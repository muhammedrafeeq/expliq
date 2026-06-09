import { notFound } from 'next/navigation'
import { TutorialRenderer } from '@/components/renderer/TutorialRenderer'
import type { TutorialStep } from '@/components/renderer/TutorialRenderer'
import { ScrollProgress } from '@/app/[category]/[slug]/ScrollProgress'
import { ShareButtons } from '@/app/[category]/[slug]/ShareButtons'
import { NewsletterForm } from '@/components/layout/NewsletterForm'
import { Clock, ChevronRight, ArrowUpRight, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'

interface PageProps {
  params: Promise<{ slug: string }>
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-700 bg-emerald-50 border-emerald-300',
  Intermediate: 'text-amber-700 bg-amber-50 border-amber-300',
  Advanced: 'text-rose-700 bg-rose-50 border-rose-300',
}

interface Tutorial {
  title: string
  description: string
  cover: string
  category: string
  difficulty: string
  steps: number
  read_time_mins: number
  published_at: string
  author: { name: string; letter: string; bio: string }
  tags: string[]
  tutorialSteps: TutorialStep[]
  note?: string
}

const TUTORIALS: Record<string, Tutorial> = {
  'build-rest-api-nodejs': {
    title: 'Build a REST API with Node.js & Express from Scratch',
    description: 'Learn how to design, build, and deploy a production-ready REST API with authentication, validation, and error handling.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?auto=format&fit=crop&w=1200&q=80',
    category: 'Backend',
    difficulty: 'Beginner',
    steps: 4,
    read_time_mins: 35,
    published_at: 'Jan 10, 2026',
    author: { name: 'Elias Thorne', letter: 'ET', bio: 'Backend engineer and open-source contributor.' },
    tags: ['Node.js', 'Express', 'REST', 'API'],
    note: 'This tutorial covers Node.js 20+. If you are on an older version, some syntax may differ slightly.',
    tutorialSteps: [
      {
        title: 'Project Setup',
        body: 'Initialise a new Node.js project with <code class="bg-surface-container px-1 rounded text-sm font-mono">npm init -y</code> and install Express: <code class="bg-surface-container px-1 rounded text-sm font-mono">npm install express</code>. Create an <code class="bg-surface-container px-1 rounded text-sm font-mono">index.js</code> entry point and spin up a basic server on port 3000.',
        code: {
          language: 'javascript',
          filename: 'index.js',
          content: `const express = require('express')
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API is running' })
})

app.listen(3000, () => console.log('Server on port 3000'))`,
        },
      },
      {
        title: 'Routing & Controllers',
        body: 'Organise routes into separate files. Use Express Router to group related endpoints. Controllers handle business logic, keeping routes thin and readable.',
        callout: {
          type: 'tip',
          text: 'Keep controllers thin — move complex logic into service files. This makes testing and maintenance much easier long-term.',
        },
        code: {
          language: 'javascript',
          filename: 'routes/users.js',
          content: `const router = require('express').Router()
const { getUsers, createUser } = require('../controllers/users')

router.get('/', getUsers)
router.post('/', createUser)

module.exports = router`,
        },
      },
      {
        title: 'JWT Authentication',
        body: 'Install <code class="bg-surface-container px-1 rounded text-sm font-mono">jsonwebtoken</code> and <code class="bg-surface-container px-1 rounded text-sm font-mono">bcryptjs</code>. Hash passwords before storing, sign a token on login, and verify it in middleware before protected routes.',
        callout: {
          type: 'warning',
          text: 'Never store plain-text passwords. Always use bcrypt with a salt rounds value of at least 10.',
        },
        code: {
          language: 'javascript',
          filename: 'middleware/auth.js',
          content: `const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}`,
        },
      },
      {
        title: 'Validation & Error Handling',
        body: 'Use <code class="bg-surface-container px-1 rounded text-sm font-mono">express-validator</code> to validate request bodies. Build a centralised error handler middleware that formats all errors consistently so clients always receive a predictable shape.',
        callout: {
          type: 'note',
          text: 'Place your global error handler after all route definitions. Express identifies it by the 4-argument signature (err, req, res, next).',
        },
      },
    ],
  },
  'nextjs-app-router-guide': {
    title: 'Complete Guide to Next.js App Router & Server Components',
    description: 'Master the new App Router, Server/Client components, data fetching patterns, and layouts in Next.js.',
    cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80',
    category: 'Frontend',
    difficulty: 'Intermediate',
    steps: 4,
    read_time_mins: 50,
    published_at: 'Feb 3, 2026',
    author: { name: 'Elena Vance', letter: 'EV', bio: 'Frontend engineer specialising in React and Next.js.' },
    tags: ['Next.js', 'React', 'TypeScript', 'RSC'],
    note: 'This guide targets Next.js 15 with the App Router. The Pages Router has different conventions.',
    tutorialSteps: [
      {
        title: 'App Router vs Pages Router',
        body: 'The App Router introduced in Next.js 13 replaces the Pages Router with file-system routing inside the <code class="bg-surface-container px-1 rounded text-sm font-mono">app/</code> directory. It enables React Server Components, streaming, nested layouts, and parallel routes.',
        callout: {
          type: 'info',
          text: 'You can migrate incrementally — the Pages Router and App Router can coexist in the same project during transition.',
        },
      },
      {
        title: 'Server Components vs Client Components',
        body: 'By default, every component in the App Router is a Server Component. Add <code class="bg-surface-container px-1 rounded text-sm font-mono">"use client"</code> only when you need interactivity, browser APIs, or hooks like <code class="bg-surface-container px-1 rounded text-sm font-mono">useState</code>.',
        callout: {
          type: 'tip',
          text: 'Fetch data in Server Components and pass it down as props. This reduces client bundle size and improves time-to-first-byte.',
        },
      },
      {
        title: 'Data Fetching Patterns',
        body: 'Use async/await directly in Server Components. For mutations, use Server Actions. For client-side revalidation, combine SWR or React Query with route handlers.',
        code: {
          language: 'typescript',
          filename: 'app/posts/page.tsx',
          content: `// Server Component — fetch data directly
export default async function PostsPage() {
  const posts = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 } // ISR: revalidate every 60s
  }).then(r => r.json())

  return <PostList posts={posts} />
}`,
        },
      },
      {
        title: 'Layouts & Nested Routes',
        body: 'Each route segment can have its own <code class="bg-surface-container px-1 rounded text-sm font-mono">layout.tsx</code> that wraps all children. Shared UI like navigation lives here and is never re-rendered on navigation, preserving state.',
        code: {
          language: 'typescript',
          filename: 'app/dashboard/layout.tsx',
          content: `export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-8">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  )
}`,
        },
      },
    ],
  },
  'ai-tools-for-developers': {
    title: 'Top AI Tools Every Developer Should Use in 2026',
    description: 'A hands-on walkthrough of Copilot, Cursor, Claude, and other AI coding tools — with real workflows.',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    category: 'AI Tools',
    difficulty: 'Beginner',
    steps: 3,
    read_time_mins: 22,
    published_at: 'Mar 1, 2026',
    author: { name: 'Julian Vane', letter: 'JV', bio: 'AI productivity researcher and developer advocate.' },
    tags: ['AI', 'Copilot', 'Cursor', 'Claude'],
    tutorialSteps: [
      {
        title: 'GitHub Copilot',
        body: 'Copilot integrates directly into VS Code and JetBrains IDEs. Its strongest use case is autocompleting repetitive patterns and generating test cases from function signatures. Enable it from the extensions panel.',
        callout: {
          type: 'tip',
          text: 'Write a descriptive comment before a function to get the best Copilot suggestion. The more context you give, the more accurate the completion.',
        },
      },
      {
        title: 'Cursor — The AI-first Editor',
        body: 'Cursor is a fork of VS Code with Claude and GPT-4 built in. Its killer feature is <strong>Cmd+K</strong> — select any code, describe the change, and it rewrites it in place without leaving the editor.',
        callout: {
          type: 'tip',
          text: 'Use AI for the 80% — routine CRUD, tests, and docs. Keep your own judgment for architecture and security-sensitive decisions.',
        },
      },
      {
        title: 'Claude for Complex Reasoning',
        body: 'Claude (claude.ai) excels at multi-file reasoning and long context — ideal for debugging unfamiliar codebases, writing design docs, or reviewing PRs. Paste entire files into the conversation for best results.',
        callout: {
          type: 'note',
          text: 'Claude Code (the CLI) integrates directly into your terminal and can read, edit, and run files in your project directory autonomously.',
        },
      },
    ],
  },
  'data-analysis-python-pandas': {
    title: 'Data Analysis with Python & Pandas: A Practical Guide',
    description: 'From raw CSV to actionable insights — learn data cleaning, exploration, and visualization with Pandas and Matplotlib.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    category: 'Data Science',
    difficulty: 'Intermediate',
    steps: 4,
    read_time_mins: 45,
    published_at: 'Feb 20, 2026',
    author: { name: 'Aisha Nair', letter: 'AN', bio: 'Data scientist and Python educator.' },
    tags: ['Python', 'Pandas', 'Data', 'Matplotlib'],
    tutorialSteps: [
      {
        title: 'Loading and Exploring Data',
        body: 'Start with <code class="bg-surface-container px-1 rounded text-sm font-mono">pd.read_csv()</code> to load your dataset. Use <code class="bg-surface-container px-1 rounded text-sm font-mono">df.head()</code>, <code class="bg-surface-container px-1 rounded text-sm font-mono">df.info()</code>, and <code class="bg-surface-container px-1 rounded text-sm font-mono">df.describe()</code> to understand shape, types, and statistical summary.',
        code: {
          language: 'python',
          filename: 'explore.py',
          content: `import pandas as pd

df = pd.read_csv('data.csv')
print(df.shape)       # rows × columns
print(df.info())      # dtypes + nulls
print(df.describe())  # statistical summary`,
        },
      },
      {
        title: 'Cleaning Missing Values',
        body: 'Use <code class="bg-surface-container px-1 rounded text-sm font-mono">df.isnull().sum()</code> to find gaps. Drop rows with <code class="bg-surface-container px-1 rounded text-sm font-mono">dropna()</code> or fill them with <code class="bg-surface-container px-1 rounded text-sm font-mono">fillna()</code>. Choose based on how much data you can afford to lose.',
        callout: {
          type: 'warning',
          text: 'Dropping rows when missing values exceed 20% of a column will heavily bias your analysis. Consider imputation instead.',
        },
      },
      {
        title: 'Grouping & Aggregation',
        body: '<code class="bg-surface-container px-1 rounded text-sm font-mono">groupby()</code> is the most powerful tool in Pandas. Combine it with <code class="bg-surface-container px-1 rounded text-sm font-mono">agg()</code> to compute multiple statistics per group in a single pass.',
        code: {
          language: 'python',
          filename: 'aggregate.py',
          content: `result = df.groupby('category').agg(
    total_sales=('revenue', 'sum'),
    avg_order=('revenue', 'mean'),
    order_count=('order_id', 'count')
).reset_index()`,
        },
      },
      {
        title: 'Visualisation with Matplotlib',
        body: 'Use Matplotlib for quick plots and Seaborn for statistical visualisations. Always label axes and titles — a chart without context is useless in a report.',
        callout: {
          type: 'tip',
          text: 'For datasets over 1M rows, consider switching from Pandas to Polars — it runs on Rust and is 5–10x faster for most operations.',
        },
      },
    ],
  },
  'freelancing-for-students': {
    title: 'How to Start Freelancing as a Student and Earn Your First ₹10,000',
    description: 'A step-by-step guide to setting up your profile, finding clients, and delivering your first project on Fiverr and Upwork.',
    cover: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
    category: 'Student Earning',
    difficulty: 'Beginner',
    steps: 3,
    read_time_mins: 18,
    published_at: 'Jan 28, 2026',
    author: { name: 'Rahul Menon', letter: 'RM', bio: 'Freelance consultant and student startup mentor.' },
    tags: ['Freelancing', 'Fiverr', 'Students', 'Income'],
    tutorialSteps: [
      {
        title: 'Pick One Skill and Go Deep',
        body: 'Do not try to offer everything. Pick one skill — logo design, WordPress development, content writing, or video editing — and become the best option in that niche on the platform.',
        callout: {
          type: 'tip',
          text: 'Students who specialise earn 3x more than generalists in their first year on Fiverr. Niche down, then expand once you have reviews.',
        },
      },
      {
        title: 'Setting Up Your Fiverr Profile',
        body: 'Use a clear photo, a specific title ("I will build a responsive landing page in React"), and a portfolio with 2–3 sample projects even if they are self-initiated ones. Clients buy confidence.',
        callout: {
          type: 'note',
          text: 'Your first gig description should mention your turnaround time, number of revisions, and exactly what is delivered. Remove ambiguity.',
        },
      },
      {
        title: 'Getting Your First Client',
        body: 'Offer your first 3 gigs at a below-market rate to collect reviews. Message buyers who viewed your gig and ask if they have questions. Respond within 1 hour — Fiverr\'s algorithm rewards response time.',
        callout: {
          type: 'tip',
          text: 'Five 5-star reviews will double your conversion rate. Treat those first projects as marketing spend, not lost revenue.',
        },
      },
    ],
  },
  'docker-kubernetes-crash-course': {
    title: 'Docker & Kubernetes Crash Course for Backend Developers',
    description: 'Containerize your apps, orchestrate deployments, and go from zero to a running Kubernetes cluster on a cloud provider.',
    cover: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80',
    category: 'DevOps',
    difficulty: 'Advanced',
    steps: 4,
    read_time_mins: 60,
    published_at: 'Mar 10, 2026',
    author: { name: 'Elias Thorne', letter: 'ET', bio: 'DevOps engineer and cloud architecture consultant.' },
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud'],
    note: 'You will need Docker Desktop and kubectl installed. A free-tier cloud account (GCP, AWS, or Azure) is required for the Kubernetes cluster section.',
    tutorialSteps: [
      {
        title: 'Why Containers?',
        body: 'Containers solve the "works on my machine" problem by packaging your app with all its dependencies into a portable unit. Docker is the de facto standard for building and running containers.',
        callout: {
          type: 'info',
          text: 'A container is not a VM. It shares the host OS kernel, making it far lighter and faster to start — typically under 500ms.',
        },
      },
      {
        title: 'Writing Your First Dockerfile',
        body: 'Start with a base image, copy your app files, install dependencies, expose the port, and define the startup command. Use multi-stage builds to keep production images small.',
        code: {
          language: 'dockerfile',
          filename: 'Dockerfile',
          content: `# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/index.js"]`,
        },
      },
      {
        title: 'Kubernetes Core Concepts',
        body: 'Kubernetes orchestrates containers across a cluster. Key objects: <strong>Pod</strong> (smallest deployable unit), <strong>Deployment</strong> (manages replicas), <strong>Service</strong> (exposes pods), and <strong>Ingress</strong> (HTTP routing).',
        callout: {
          type: 'tip',
          text: 'Use <code class="bg-emerald-100 px-1 rounded text-xs font-mono">kind</code> or <code class="bg-emerald-100 px-1 rounded text-xs font-mono">k3s</code> to run a full Kubernetes cluster locally. Avoid cloud cluster costs during development.',
        },
      },
      {
        title: 'Deploying to a Cloud Cluster',
        body: 'Create a Deployment and Service YAML manifest. Apply it with <code class="bg-surface-container px-1 rounded text-sm font-mono">kubectl apply -f deployment.yaml</code>. Use <code class="bg-surface-container px-1 rounded text-sm font-mono">kubectl get pods</code> to verify your pods are running.',
        code: {
          language: 'yaml',
          filename: 'deployment.yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-api
  template:
    metadata:
      labels:
        app: my-api
    spec:
      containers:
      - name: my-api
        image: my-api:latest
        ports:
        - containerPort: 3000`,
        },
        callout: {
          type: 'warning',
          text: 'Never use the latest tag in production. Always pin to a specific image digest or version tag to ensure reproducible deployments.',
        },
      },
    ],
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tutorial = TUTORIALS[slug]
  if (!tutorial) return { title: 'Tutorial Not Found' }
  const url = `${BASE_URL}/tutorials/${slug}`
  return {
    title: tutorial.title,
    description: tutorial.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: `${tutorial.title} | Expliq`,
      description: tutorial.description,
      siteName: 'Expliq',
    },
    twitter: {
      card: 'summary',
      title: `${tutorial.title} | Expliq`,
      description: tutorial.description,
    },
  }
}

export default async function TutorialPage({ params }: PageProps) {
  const { slug } = await params
  const tutorial = TUTORIALS[slug]
  if (!tutorial) return notFound()

  const related = Object.entries(TUTORIALS)
    .filter(([s]) => s !== slug)
    .slice(0, 3)
    .map(([s, t]) => ({ ...t, slug: s }))

  return (
    <div className="min-h-screen">
      <ScrollProgress />

      <div className="max-w-page-max-width mx-auto px-gutter pt-8 mb-12 select-none relative z-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-sans mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} className="text-on-surface-variant/40" />
          <Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link>
        </nav>

        {/* Hero image with overlay */}
        <div className="w-full min-h-64 md:aspect-3/1 relative rounded-lg overflow-hidden shadow-2xl border border-zinc-800/20 bg-surface-dim group">
          <img
            src={tutorial.cover}
            alt={tutorial.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-1000 z-0"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 lg:p-12 z-20 space-y-4 max-w-4xl text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-white/20 text-white bg-white/10 backdrop-blur-sm font-sans">
                {tutorial.category}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${DIFFICULTY_COLOR[tutorial.difficulty]}`}>
                {tutorial.difficulty}
              </span>
            </div>
            <h1 className="font-serif font-extrabold text-2xl md:text-4xl lg:text-5xl text-white leading-tight tracking-tight drop-shadow-sm">
              {tutorial.title}
            </h1>
          </div>
        </div>

        {/* Author / meta row — below image */}
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-4 font-sans">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-primary to-secondary text-white flex items-center justify-center font-extrabold text-sm shadow-md shrink-0">
              {tutorial.author.letter}
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">{tutorial.author.name}</div>
              <div className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span>Published: {tutorial.published_at}</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="shrink-0 text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 font-sans">
                <BookOpen size={13} /> {tutorial.steps} steps
              </span>
              <span className="shrink-0 text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 font-sans">
                <Clock size={13} /> {tutorial.read_time_mins} min
              </span>
              <ShareButtons title={tutorial.title} categorySlug="tutorials" slug={slug} variant="icon" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm md:text-base text-on-surface-variant font-normal leading-relaxed max-w-3xl border-l-2 border-outline-variant pl-4 font-sans">
            {tutorial.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tutorial.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-outline-variant text-on-surface-variant bg-surface-container-low">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-article-max-width mx-auto px-gutter pb-16">

        {/* Tutorial Steps */}
        <TutorialRenderer steps={tutorial.tutorialSteps} note={tutorial.note} />

        {/* Author footer */}
        <div className="mt-14 pt-10 border-t border-outline-variant flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-linear-to-tr from-primary to-secondary text-on-primary flex items-center justify-center font-extrabold text-lg shrink-0">
            {tutorial.author.letter}
          </div>
          <div>
            <div className="font-bold text-base text-on-surface">{tutorial.author.name}</div>
            <p className="text-sm text-on-surface-variant font-sans mt-0.5">{tutorial.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Related Tutorials */}
      <section className="border-t border-outline-variant/20 pt-10 max-w-page-max-width mx-auto px-gutter pb-20 space-y-8">
        <h3 className="font-serif font-bold text-xl text-on-surface border-b border-outline-variant pb-3">More Tutorials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {related.map((rel) => (
            <Link
              key={rel.slug}
              href={`/tutorials/${rel.slug}`}
              className="group border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-surface-variant">
                <img src={rel.cover} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4 flex flex-col gap-2.5 grow">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
                  <span className="text-primary font-bold uppercase tracking-wide">{rel.category}</span>
                  <span>·</span>
                  <span className={`px-1.5 py-0.5 rounded border font-bold text-[9px] ${DIFFICULTY_COLOR[rel.difficulty]}`}>{rel.difficulty}</span>
                </div>
                <h4 className="font-serif font-bold text-sm leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2 grow">
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                  <span className="text-[11px] text-on-surface-variant flex items-center gap-1"><Clock size={10} /> {rel.read_time_mins} min</span>
                  <ArrowUpRight size={13} className="text-outline group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <NewsletterForm layout="card" source="tutorial-detail" />
      </section>
    </div>
  )
}
