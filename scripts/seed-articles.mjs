/**
 * Seed script — inserts all 30 content articles into Supabase.
 *
 * Usage:
 *   1. Set SUPABASE_SERVICE_ROLE_KEY in .env.local to your actual service role key
 *      (Dashboard → Project Settings → API → service_role secret)
 *   2. Run: node scripts/seed-articles.mjs
 *
 * The script is idempotent — re-running upserts by slug, it will not create duplicates.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Load .env.local manually (no dotenv dependency needed)
// ---------------------------------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function loadEnv() {
  try {
    const raw = readFileSync(path.join(ROOT, '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* ignore */ }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || SERVICE_KEY === 'your_supabase_service_role_key') {
  console.error('❌  Set SUPABASE_SERVICE_ROLE_KEY in .env.local before running this script.');
  console.error('   Dashboard → Project Settings → API → service_role');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ---------------------------------------------------------------------------
// Article manifest — metadata for all 30 articles
// Thumbnails: curated Unsplash photo IDs relevant to each category
// ---------------------------------------------------------------------------

const ARTICLES = [
  // ── TUTORIALS ─────────────────────────────────────────────────────────────
  {
    file: 'tutorials/how-to-build-rest-api-python-fastapi',
    category: 'tutorials',
    title: 'How to Build a REST API with Python and FastAPI — Complete Guide (2026)',
    slug: 'how-to-build-rest-api-python-fastapi',
    excerpt: 'Learn how to build a production-ready REST API with Python and FastAPI — covering routing, Pydantic validation, async database access, and deployment to a live server.',
    cover_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&fit=crop',
    cover_image_alt: 'Python code on a dark monitor',
    read_time_mins: 11,
    is_featured: true,
  },
  {
    file: 'tutorials/react-hooks-beginners-guide',
    category: 'tutorials',
    title: 'React Hooks Complete Guide for Beginners (2026)',
    slug: 'react-hooks-beginners-guide',
    excerpt: 'Master useState, useEffect, useContext, and custom hooks with real-world examples, common mistakes to avoid, and patterns used in production React applications.',
    cover_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&fit=crop',
    cover_image_alt: 'React logo on a laptop screen',
    read_time_mins: 10,
    is_featured: false,
  },
  {
    file: 'tutorials/docker-for-developers-zero-to-deployed',
    category: 'tutorials',
    title: 'Docker for Developers — Zero to Deployed (2026)',
    slug: 'docker-for-developers-zero-to-deployed',
    excerpt: 'A practical Docker guide for developers — writing Dockerfiles, using Docker Compose, understanding layer caching, and deploying your first containerised application.',
    cover_image_url: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=80&fit=crop',
    cover_image_alt: 'Shipping containers representing Docker',
    read_time_mins: 11,
    is_featured: false,
  },

  // ── FREELANCING ───────────────────────────────────────────────────────────
  {
    file: 'freelancing/how-to-get-first-freelance-client-fiverr-india',
    category: 'freelancing',
    title: 'How to Get Your First Freelance Client on Fiverr in India (2026)',
    slug: 'how-to-get-first-freelance-client-fiverr-india',
    excerpt: 'A step-by-step guide to landing your first Fiverr order with zero reviews — profile setup, gig creation, pricing strategy, and how to earn your first 5-star review.',
    cover_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&fit=crop',
    cover_image_alt: 'Developer working on laptop at a coffee shop',
    read_time_mins: 11,
    is_featured: true,
  },
  {
    file: 'freelancing/upwork-vs-fiverr-vs-toptal-india',
    category: 'freelancing',
    title: 'Upwork vs Fiverr vs Toptal for Indian Developers — Which Pays Most in 2026?',
    slug: 'upwork-vs-fiverr-vs-toptal-india',
    excerpt: 'A data-driven comparison of the three biggest freelancing platforms for Indian developers — fees, realistic earnings, Toptal screening process, and which platform suits your career stage.',
    cover_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&fit=crop',
    cover_image_alt: 'Laptop showing freelancing dashboard with earnings',
    read_time_mins: 11,
    is_featured: false,
  },
  {
    file: 'freelancing/how-to-price-freelance-services-usd-india',
    category: 'freelancing',
    title: 'How to Price Your Freelance Services in USD as an Indian Developer (2026)',
    slug: 'how-to-price-freelance-services-usd-india',
    excerpt: 'Stop undercharging. Learn how to calculate your minimum viable rate, research international market rates, present pricing confidently, and raise your rates without losing clients.',
    cover_image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80&fit=crop',
    cover_image_alt: 'Dollar bills representing USD freelance earnings',
    read_time_mins: 11,
    is_featured: false,
  },

  // ── STARTUP ───────────────────────────────────────────────────────────────
  {
    file: 'startup/how-to-register-startup-india-2026',
    category: 'startup',
    title: 'How to Register a Startup in India in 2026 — Pvt Ltd, LLP, and Startup India',
    slug: 'how-to-register-startup-india-2026',
    excerpt: 'The complete legal guide to incorporating your Indian startup — comparing Pvt Ltd, LLP, and OPC, the SPICe+ registration process, Startup India recognition, and your first-year compliance calendar.',
    cover_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80&fit=crop',
    cover_image_alt: 'Modern startup office with whiteboards and laptops',
    read_time_mins: 12,
    is_featured: true,
  },
  {
    file: 'startup/bootstrapped-saas-ideas-indian-developers-2026',
    category: 'startup',
    title: '10 Bootstrapped SaaS Ideas for Indian Developers in 2026',
    slug: 'bootstrapped-saas-ideas-indian-developers-2026',
    excerpt: 'Ten validated SaaS ideas with target users, competitor gaps, pricing models, tech stacks, and revenue projections — built specifically for Indian developers with limited capital.',
    cover_image_url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80&fit=crop',
    cover_image_alt: 'Team brainstorming SaaS ideas on a whiteboard',
    read_time_mins: 12,
    is_featured: false,
  },
  {
    file: 'startup/how-to-raise-pre-seed-round-india-2026',
    category: 'startup',
    title: 'How to Raise a Pre-Seed Round in India in 2026 — Deck, Investors, and Closing',
    slug: 'how-to-raise-pre-seed-round-india-2026',
    excerpt: 'A practical guide to raising your first institutional round — investor types, the 11-slide deck structure, finding and approaching angels and micro-VCs, and closing mechanics with SAFE notes.',
    cover_image_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80&fit=crop',
    cover_image_alt: 'Investor meeting with pitch deck on screen',
    read_time_mins: 12,
    is_featured: false,
  },

  // ── FINANCE ───────────────────────────────────────────────────────────────
  {
    file: 'finance/how-15l-software-engineer-should-invest-india-2026',
    category: 'finance',
    title: 'How a ₹15L Software Engineer Should Invest in India (2026)',
    slug: 'how-15l-software-engineer-should-invest-india-2026',
    excerpt: 'A complete investment blueprint for a salaried IT professional earning ₹15L CTC — emergency fund, mutual fund allocation, NPS tax benefits, and 20-year wealth projections with real numbers.',
    cover_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80&fit=crop',
    cover_image_alt: 'Stock market charts showing portfolio growth',
    read_time_mins: 12,
    is_featured: true,
  },
  {
    file: 'finance/sip-vs-lump-sum-india-2026',
    category: 'finance',
    title: 'SIP vs Lump Sum Investing in India — Which Strategy Wins in 2026?',
    slug: 'sip-vs-lump-sum-india-2026',
    excerpt: 'A data-backed comparison of SIP and lump sum investing using 20 years of Nifty 50 data — when each strategy wins, rupee cost averaging explained, and the hybrid STP approach.',
    cover_image_url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80&fit=crop',
    cover_image_alt: 'Mutual fund growth chart on a tablet',
    read_time_mins: 11,
    is_featured: false,
  },
  {
    file: 'finance/tax-saving-salaried-it-employee-india-2026',
    category: 'finance',
    title: 'Tax Saving Guide for Salaried IT Employees in India (2026)',
    slug: 'tax-saving-salaried-it-employee-india-2026',
    excerpt: 'Save ₹1–2L in tax this year — new vs old regime comparison, 80C instruments ranked, NPS 80CCD(2) employer contribution hack, HRA calculation, and 7 lesser-known deductions most developers miss.',
    cover_image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&fit=crop',
    cover_image_alt: 'Tax documents and calculator on a desk',
    read_time_mins: 12,
    is_featured: false,
  },

  // ── OPEN SOURCE ───────────────────────────────────────────────────────────
  {
    file: 'open-source/first-open-source-contribution-github-guide',
    category: 'open-source',
    title: 'How to Make Your First Open Source Contribution on GitHub (2026)',
    slug: 'first-open-source-contribution-github-guide',
    excerpt: 'A complete beginner\'s guide to contributing to open source — finding good-first-issue projects, the full git fork-clone-branch-PR workflow, writing a PR that gets merged, and qualifying for GSoC.',
    cover_image_url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&q=80&fit=crop',
    cover_image_alt: 'GitHub contribution graph on a laptop screen',
    read_time_mins: 12,
    is_featured: true,
  },
  {
    file: 'open-source/top-open-source-projects-indian-developers-2026',
    category: 'open-source',
    title: 'Top 10 Open Source Projects for Indian Developers to Contribute to in 2026',
    slug: 'top-open-source-projects-indian-developers-2026',
    excerpt: 'Ten high-impact open source projects with active Indian communities — Appsmith, Plane, Infisical, Hoppscotch, and more — with contribution entry points and career benefits for each.',
    cover_image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&fit=crop',
    cover_image_alt: 'Developers collaborating on code together',
    read_time_mins: 12,
    is_featured: false,
  },
  {
    file: 'open-source/how-to-get-paid-for-open-source-india-2026',
    category: 'open-source',
    title: 'How to Get Paid for Open Source Work in India — GSoC, LFX, Bounties and Beyond (2026)',
    slug: 'how-to-get-paid-for-open-source-india-2026',
    excerpt: 'Every realistic path to earning money from open source — GSoC (₹3–6L stipends), LFX Mentorship, Outreachy, Gitcoin bounties, GitHub Sponsors, and paid OSS roles at Indian companies.',
    cover_image_url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80&fit=crop',
    cover_image_alt: 'Developer earning money from open source contributions',
    read_time_mins: 12,
    is_featured: false,
  },

  // ── PRODUCTIVITY ──────────────────────────────────────────────────────────
  {
    file: 'productivity/best-productivity-tools-developers-2026',
    category: 'productivity',
    title: 'Best Productivity Tools for Developers in 2026 — Notion vs Obsidian vs Linear',
    slug: 'best-productivity-tools-developers-2026',
    excerpt: 'An opinionated comparison of the tools that actually matter — Notion vs Obsidian for notes, Linear vs Jira for project tracking, focus tools, and full recommended stacks with INR pricing.',
    cover_image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&q=80&fit=crop',
    cover_image_alt: 'Clean developer desk with productivity tools',
    read_time_mins: 12,
    is_featured: true,
  },
  {
    file: 'productivity/gtd-personal-task-system-developers',
    category: 'productivity',
    title: 'How to Build a Personal Task System That Actually Sticks — GTD for Developers',
    slug: 'gtd-personal-task-system-developers',
    excerpt: 'Getting Things Done adapted for software engineers — inbox capture, weekly review, project vs next-action distinction, and complete implementation templates for both Obsidian and Notion.',
    cover_image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80&fit=crop',
    cover_image_alt: 'Notebook and task management system on a desk',
    read_time_mins: 12,
    is_featured: false,
  },
  {
    file: 'productivity/keyboard-shortcuts-terminal-tricks-developers',
    category: 'productivity',
    title: 'Keyboard Shortcuts and Terminal Tricks That Save Developers 1 Hour Every Day',
    slug: 'keyboard-shortcuts-terminal-tricks-developers',
    excerpt: 'High-ROI shortcuts for VS Code multi-cursor editing, Chrome DevTools, Bash readline, Git CLI aliases, tmux session management, and fzf fuzzy find — with a practice schedule.',
    cover_image_url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&q=80&fit=crop',
    cover_image_alt: 'Mechanical keyboard with backlit keys',
    read_time_mins: 11,
    is_featured: false,
  },

  // ── SECURITY ──────────────────────────────────────────────────────────────
  {
    file: 'security/owasp-top-10-web-security-developers-2026',
    category: 'security',
    title: 'Web Application Security for Developers — OWASP Top 10 Explained With Code (2026)',
    slug: 'owasp-top-10-web-security-developers-2026',
    excerpt: 'A practical guide to every OWASP Top 10 vulnerability — broken access control, SQL injection, cryptographic failures, and more — with vulnerable vs secure code examples in Node.js and Python.',
    cover_image_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80&fit=crop',
    cover_image_alt: 'Digital security lock protecting web application code',
    read_time_mins: 13,
    is_featured: true,
  },
  {
    file: 'security/secure-nodejs-api-production-2026',
    category: 'security',
    title: 'How to Secure Your Node.js API in Production — Auth, Rate Limiting, and Secrets (2026)',
    slug: 'secure-nodejs-api-production-2026',
    excerpt: 'Production hardening for Node.js/Express APIs — Zod input validation, JWT with rotating refresh tokens in httpOnly cookies, Redis-backed rate limiting, Parameter Store secrets, and Helmet.js.',
    cover_image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=80&fit=crop',
    cover_image_alt: 'Node.js API security code on dark terminal',
    read_time_mins: 13,
    is_featured: false,
  },
  {
    file: 'security/linux-server-hardening-vps-2026',
    category: 'security',
    title: 'Linux Server Hardening Guide for Developers — SSH, Firewall, and Fail2Ban (2026)',
    slug: 'linux-server-hardening-vps-2026',
    excerpt: 'Step-by-step hardening of a fresh Ubuntu VPS — disable root SSH login, key-only auth, UFW firewall, Fail2Ban brute-force protection, automatic security updates, and auditd kernel logging.',
    cover_image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=1200&q=80&fit=crop',
    cover_image_alt: 'Linux terminal showing server security configuration',
    read_time_mins: 13,
    is_featured: false,
  },

  // ── DESIGN ────────────────────────────────────────────────────────────────
  {
    file: 'design/figma-for-developers-guide-2026',
    category: 'design',
    title: 'Figma for Developers — Read Design Files, Extract Tokens, and Hand Off Like a Pro',
    slug: 'figma-for-developers-guide-2026',
    excerpt: 'The practical Figma guide for developers — reading Auto Layout as Flexbox, extracting colour and typography tokens, using Dev Mode to get accurate CSS, and a 5-step handoff workflow.',
    cover_image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80&fit=crop',
    cover_image_alt: 'Figma design tool interface on a MacBook',
    read_time_mins: 12,
    is_featured: true,
  },
  {
    file: 'design/design-system-tailwind-storybook-2026',
    category: 'design',
    title: 'Design Systems for Developers — Component Library With Tailwind CSS and Storybook (2026)',
    slug: 'design-system-tailwind-storybook-2026',
    excerpt: 'Build a production-ready component library from scratch — design tokens in Tailwind config, dark mode with CSS custom properties, Button/Input/Card with CVA variants, and Storybook autodocs.',
    cover_image_url: 'https://images.unsplash.com/photo-1576153192396-180ecef2a715?w=1200&q=80&fit=crop',
    cover_image_alt: 'UI component library displayed in Storybook',
    read_time_mins: 13,
    is_featured: false,
  },
  {
    file: 'design/ui-ux-principles-developers-2026',
    category: 'design',
    title: 'UI/UX Principles Every Developer Should Know — Spacing, Typography, and Visual Hierarchy',
    slug: 'ui-ux-principles-developers-2026',
    excerpt: 'The five design rules that explain 80% of the quality gap between amateur and professional UIs — the 8-point spacing grid, modular type scale, WCAG contrast, white space, and visual weight.',
    cover_image_url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80&fit=crop',
    cover_image_alt: 'Clean UI design wireframes and typography samples',
    read_time_mins: 12,
    is_featured: false,
  },

  // ── CLOUD & DEVOPS ────────────────────────────────────────────────────────
  {
    file: 'cloud/aws-nodejs-ec2-rds-s3-deploy-2026',
    category: 'cloud',
    title: 'AWS for Developers — Deploy a Node.js App With EC2, RDS, and S3 (2026)',
    slug: 'aws-nodejs-ec2-rds-s3-deploy-2026',
    excerpt: 'End-to-end AWS deployment guide — EC2 setup, RDS Postgres, S3 with IAM roles, Parameter Store secrets, Nginx reverse proxy, PM2 cluster mode, Let\'s Encrypt SSL, and cost breakdown in INR.',
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&fit=crop',
    cover_image_alt: 'AWS cloud infrastructure visualised as glowing server nodes',
    read_time_mins: 13,
    is_featured: true,
  },
  {
    file: 'cloud/github-actions-cicd-nodejs-2026',
    category: 'cloud',
    title: 'GitHub Actions CI/CD Pipeline for Node.js — Test, Build, and Deploy Automatically (2026)',
    slug: 'github-actions-cicd-nodejs-2026',
    excerpt: 'Build a complete CI/CD pipeline — run tests on every PR, build a Docker image on merge, push to ECR using OIDC (no long-lived keys), and deploy to EC2 with a health-checked zero-downtime script.',
    cover_image_url: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80&fit=crop',
    cover_image_alt: 'GitHub Actions workflow running CI/CD pipeline',
    read_time_mins: 13,
    is_featured: false,
  },
  {
    file: 'cloud/kubernetes-first-app-eks-gke-2026',
    category: 'cloud',
    title: 'Kubernetes for Developers — Deploy Your First App on EKS/GKE in 2026',
    slug: 'kubernetes-first-app-eks-gke-2026',
    excerpt: 'Deploy a real app on Kubernetes from scratch — Deployment, Service, Ingress, ConfigMap, Secrets, rolling updates with rollback, and Horizontal Pod Autoscaling on a managed cluster.',
    cover_image_url: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80&fit=crop',
    cover_image_alt: 'Kubernetes container orchestration diagram',
    read_time_mins: 13,
    is_featured: false,
  },

  // ── REMOTE WORK ───────────────────────────────────────────────────────────
  {
    file: 'remote/land-remote-job-international-company-india-2026',
    category: 'remote',
    title: 'How Indian Developers Can Land Remote Jobs at International Companies in 2026',
    slug: 'land-remote-job-international-company-india-2026',
    excerpt: 'The complete roadmap — global-ready GitHub and LinkedIn profile, 8 remote job boards, cold outreach templates, the 5-stage hiring process at US/EU companies, and USD salary negotiation scripts.',
    cover_image_url: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200&q=80&fit=crop',
    cover_image_alt: 'Developer working remotely with international company on video call',
    read_time_mins: 13,
    is_featured: true,
  },
  {
    file: 'remote/remote-work-setup-guide-india-2026',
    category: 'remote',
    title: 'Remote Work Setup Guide for Indian Developers — Home Office, Internet Backup (2026)',
    slug: 'remote-work-setup-guide-india-2026',
    excerpt: 'Build a professional home office on any budget — fibre + mobile internet redundancy, UPS power backup, hardware at three INR price tiers, audio/lighting priorities, and the software stack.',
    cover_image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=1200&q=80&fit=crop',
    cover_image_alt: 'Clean home office setup with dual monitors and good lighting',
    read_time_mins: 12,
    is_featured: false,
  },
  {
    file: 'remote/thrive-remote-team-communication-career-growth-2026',
    category: 'remote',
    title: 'How to Thrive on a Remote Team — Communication, Visibility, and Career Growth (2026)',
    slug: 'thrive-remote-team-communication-career-growth-2026',
    excerpt: 'The soft skills of remote work — async-first communication, daily visibility habits, building relationships across timezones, brag documents for performance reviews, and preventing burnout.',
    cover_image_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&fit=crop',
    cover_image_alt: 'Remote team on a video call collaborating across timezones',
    read_time_mins: 12,
    is_featured: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getCategoryMap() {
  const { data, error } = await supabase.from('categories').select('id, slug');
  if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
  return Object.fromEntries(data.map(c => [c.slug, c.id]));
}

async function importArticleContent(file) {
  const filePath = path.join(ROOT, 'content', 'articles', `${file}.js`);
  const fileUrl = pathToFileURL(filePath).href;
  try {
    const mod = await import(fileUrl);
    return mod.article ?? mod.default;
  } catch (err) {
    console.warn(`  ⚠  Could not import ${file}: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱  Starting article seed...\n');

  const categoryMap = await getCategoryMap();
  console.log(`✅  Loaded ${Object.keys(categoryMap).length} categories\n`);

  let inserted = 0;
  let skipped  = 0;
  let failed   = 0;

  for (const meta of ARTICLES) {
    const categoryId = categoryMap[meta.category];
    if (!categoryId) {
      console.warn(`  ⚠  Category "${meta.category}" not found in DB — skipping ${meta.slug}`);
      skipped++;
      continue;
    }

    const contentModule = await importArticleContent(meta.file);
    if (!contentModule) {
      failed++;
      continue;
    }

    // Normalise content to the DB schema format
    // Both versions ("1.0" string and 1 number) are stored as-is in JSONB
    const content = contentModule;

    const row = {
      title:           meta.title,
      slug:            meta.slug,
      excerpt:         meta.excerpt,
      content:         content,
      cover_image_url: meta.cover_image_url,
      cover_image_alt: meta.cover_image_alt,
      category_id:     categoryId,
      status:          'published',
      read_time_mins:  meta.read_time_mins,
      is_featured:     meta.is_featured ?? false,
      meta_title:      meta.title,
      meta_description: meta.excerpt,
      published_at:    new Date().toISOString(),
    };

    const { error } = await supabase
      .from('articles')
      .upsert(row, { onConflict: 'slug', ignoreDuplicates: false });

    if (error) {
      console.error(`  ❌  ${meta.slug}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✅  ${meta.slug}`);
      inserted++;
    }
  }

  console.log(`\n────────────────────────────────`);
  console.log(`  Inserted/updated : ${inserted}`);
  console.log(`  Skipped          : ${skipped}`);
  console.log(`  Failed           : ${failed}`);
  console.log(`────────────────────────────────`);

  if (failed > 0) process.exit(1);
}

seed().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
