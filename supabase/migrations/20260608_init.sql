-- Create schema migrations
-- E:\Projects\Works\Tekbit\supabase\migrations\20260608_init.sql

-- Drop existing tables/functions if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- 1. Table: users (extends Supabase auth.users)
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null unique,
  name         text,
  avatar_url   text,
  role         text not null default 'reader',  -- 'reader' | 'publisher' | 'admin'
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Trigger to auto-insert user on sign up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case
      -- Default first user as admin for local testing if needed, else reader
      when not exists (select 1 from public.users) then 'admin'
      else 'reader'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Table: publisher_profiles
create table if not exists public.publisher_profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null unique references public.users(id) on delete cascade,
  bio               text,
  username          text unique not null,
  website_url       text,
  twitter_url       text,
  linkedin_url      text,
  tier              text not null default 'starter', -- 'starter' | 'contributor' | 'expert'
  commission_pct    integer not null default 40,
  total_earnings    numeric(10,2) default 0.00,
  available_balance numeric(10,2) default 0.00,
  upi_id            text,
  bank_account      jsonb, -- { account_no, ifsc, holder_name }
  is_active         boolean default true,
  quality_score     numeric(3,2) default 0.00,
  created_at        timestamptz default now()
);

-- 3. Table: publisher_applications
create table if not exists public.publisher_applications (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  bio            text not null,
  writing_sample text not null,
  expertise      text[],
  status         text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  admin_note     text,
  reviewed_by    uuid references public.users(id),
  reviewed_at    timestamptz,
  created_at     timestamptz default now()
);

-- 4. Table: categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  color       text, -- hex, e.g. '#8B5CF6'
  icon        text, -- lucide icon key, e.g. 'cpu'
  sort_order  integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Populate default categories
insert into public.categories (name, slug, description, color, icon, sort_order)
values
  ('AI Tools',        'ai-tools',   'AI tool reviews and guides',                     '#8B5CF6', 'cpu',            1),
  ('Devices',         'devices',    'Phone and gadget reviews for India',             '#3B82F6', 'smartphone',     2),
  ('Career',          'career',     'Career growth and upskilling',                   '#10B981', 'trending-up',    3),
  ('Tech News',       'tech-news',  'Weekly tech digest with India context',          '#F59E0B', 'newspaper',      4),
  ('Student Earning', 'student',    'Earning methods for Indian college students',    '#EF4444', 'graduation-cap', 5)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  icon = excluded.icon,
  sort_order = excluded.sort_order;

-- 5. Table: tags
create table if not exists public.tags (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique,
  slug  text not null unique
);

-- 6. Table: articles
create table if not exists public.articles (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  excerpt           text,
  content           jsonb not null default '{"version":1,"blocks":[]}',
  cover_image_url   text,
  cover_image_alt   text,
  category_id       uuid references public.categories(id) on delete set null,
  author_id         uuid references public.users(id) on delete set null,
  status            text not null default 'draft', -- 'draft' | 'pending' | 'published' | 'rejected' | 'scheduled'
  rejection_note    text,
  meta_title        text,
  meta_description  text,
  is_featured       boolean default false,
  view_count        integer default 0,
  read_time_mins    integer,
  published_at      timestamptz,
  scheduled_at      timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Article ↔ Tag junction
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id     uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- Full-text search vector (generated column)
alter table public.articles
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) stored;

-- 7. Table: monthly_revenue
create table if not exists public.monthly_revenue (
  id              uuid primary key default gen_random_uuid(),
  month           date not null unique, -- first day of month, e.g. '2026-06-01'
  total_adsense   numeric(10,2) not null,
  total_pageviews integer not null,
  revenue_per_view numeric(10,8), -- calculated: total_adsense / total_pageviews
  is_reconciled   boolean default false,
  reconciled_at   timestamptz,
  created_at      timestamptz default now()
);

-- 8. Table: article_monthly_stats
create table if not exists public.article_monthly_stats (
  id              uuid primary key default gen_random_uuid(),
  article_id      uuid references public.articles(id) on delete cascade,
  month           date not null,
  pageviews       integer default 0,
  gross_revenue   numeric(10,2) default 0.00,
  publisher_share numeric(10,2) default 0.00,
  platform_share  numeric(10,2) default 0.00,
  commission_pct  integer,
  is_paid         boolean default false,
  created_at      timestamptz default now(),
  unique(article_id, month)
);

-- 9. Table: payout_requests
create table if not exists public.payout_requests (
  id           uuid primary key default gen_random_uuid(),
  publisher_id uuid references public.publisher_profiles(id) on delete cascade,
  amount       numeric(10,2) not null,
  upi_id       text not null,
  status       text not null default 'pending', -- 'pending' | 'processing' | 'paid' | 'rejected'
  upi_ref      text,
  admin_note   text,
  requested_at timestamptz default now(),
  processed_at timestamptz,
  processed_by uuid references public.users(id)
);

-- 10. Table: bookmarks
create table if not exists public.bookmarks (
  user_id    uuid references public.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, article_id)
);

-- 11. Table: newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  name            text,
  is_active       boolean default true,
  source          text, -- e.g. 'homepage', 'article'
  subscribed_at   timestamptz default now(),
  unsubscribed_at timestamptz
);

-- 12. Table: affiliate_clicks
create table if not exists public.affiliate_clicks (
  id         uuid primary key default gen_random_uuid(),
  partner    text not null, -- e.g. 'scaler', 'coursera'
  article_id uuid references public.articles(id) on delete set null,
  clicked_at timestamptz default now()
);

-- INDEXES
create index if not exists articles_search_idx      on public.articles using gin(search_vector);
create index if not exists articles_status_idx      on public.articles(status);
create index if not exists articles_category_idx    on public.articles(category_id);
create index if not exists articles_published_idx   on public.articles(published_at desc) where status = 'published';
create index if not exists articles_author_idx      on public.articles(author_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.users enable row level security;
alter table public.publisher_profiles enable row level security;
alter table public.publisher_applications enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public.bookmarks enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.payout_requests enable row level security;

-- 1. Users policies
create policy "users: read all" on public.users for select using (true);
create policy "users: update own" on public.users for update using (auth.uid() = id);

-- 2. Publisher profiles policies
create policy "publisher_profiles: read active" on public.publisher_profiles
  for select using (is_active = true);
create policy "publisher_profiles: owner update" on public.publisher_profiles
  for update using (user_id = auth.uid());
create policy "publisher_profiles: admin all" on public.publisher_profiles
  for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 3. Publisher applications policies
create policy "publisher_applications: owner read/create" on public.publisher_applications
  for select using (user_id = auth.uid());
create policy "publisher_applications: owner insert" on public.publisher_applications
  for insert with check (user_id = auth.uid());
create policy "publisher_applications: admin all" on public.publisher_applications
  for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 4. Categories & tags policies
create policy "categories: public read" on public.categories for select using (is_active = true);
create policy "categories: admin manage" on public.categories for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "tags: public read" on public.tags for select using (true);
create policy "tags: admin manage" on public.tags for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 5. Articles policies
create policy "articles: public read published" on public.articles
  for select using (status = 'published');
create policy "articles: author select own" on public.articles
  for select using (author_id = auth.uid());
create policy "articles: author insert own" on public.articles
  for insert with check (author_id = auth.uid());
create policy "articles: author update own" on public.articles
  for update using (author_id = auth.uid());
create policy "articles: admin all" on public.articles
  for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- 6. Bookmarks policies
create policy "bookmarks: owner select" on public.bookmarks for select using (user_id = auth.uid());
create policy "bookmarks: owner insert" on public.bookmarks for insert with check (user_id = auth.uid());
create policy "bookmarks: owner delete" on public.bookmarks for delete using (user_id = auth.uid());

-- 7. Payout requests policies
create policy "payout_requests: owner select" on public.payout_requests for select
  using (exists (select 1 from public.publisher_profiles where id = publisher_id and user_id = auth.uid()));
create policy "payout_requests: owner insert" on public.payout_requests for insert
  with check (exists (select 1 from public.publisher_profiles where id = publisher_id and user_id = auth.uid()));
create policy "payout_requests: admin all" on public.payout_requests for all
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
