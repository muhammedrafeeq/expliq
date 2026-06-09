import { ArrowUpRight, Clock, BookOpen, ChevronRight, Layers, Code2, Cpu, BarChart2, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tutorials',
  description: 'Step-by-step tutorials on AI, web development, career skills, and technology for Indian learners.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'}/tutorials` },
  openGraph: {
    type: 'website',
    title: 'Tutorials | Expliq',
    description: 'Step-by-step tutorials on AI, web development, career skills, and technology for Indian learners.',
  },
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  Intermediate: 'text-amber-600 bg-amber-50 border-amber-200',
  Advanced: 'text-rose-600 bg-rose-50 border-rose-200',
}

const TUTORIALS = [
  {
    id: 't1',
    slug: 'build-rest-api-nodejs',
    title: 'Build a REST API with Node.js & Express from Scratch',
    description: 'Learn how to design, build, and deploy a production-ready REST API with authentication, validation, and error handling.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?auto=format&fit=crop&w=800&q=80',
    category: 'Backend',
    icon: 'code',
    difficulty: 'Beginner',
    steps: 8,
    read_time_mins: 35,
    author: { name: 'Elias Thorne', letter: 'ET' },
    tags: ['Node.js', 'Express', 'REST', 'API'],
  },
  {
    id: 't2',
    slug: 'nextjs-app-router-guide',
    title: 'Complete Guide to Next.js App Router & Server Components',
    description: 'Master the new App Router, Server/Client components, data fetching patterns, and layouts in Next.js.',
    cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=800&q=80',
    category: 'Frontend',
    icon: 'layers',
    difficulty: 'Intermediate',
    steps: 12,
    read_time_mins: 50,
    author: { name: 'Elena Vance', letter: 'EV' },
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    id: 't3',
    slug: 'ai-tools-for-developers',
    title: 'Top AI Tools Every Developer Should Use in 2026',
    description: 'A hands-on walkthrough of Copilot, Cursor, Claude, and other AI coding tools — with real workflows.',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    category: 'AI Tools',
    icon: 'cpu',
    difficulty: 'Beginner',
    steps: 6,
    read_time_mins: 22,
    author: { name: 'Julian Vane', letter: 'JV' },
    tags: ['AI', 'Copilot', 'Cursor', 'Productivity'],
  },
  {
    id: 't4',
    slug: 'data-analysis-python-pandas',
    title: 'Data Analysis with Python & Pandas: A Practical Guide',
    description: 'From raw CSV to actionable insights — learn data cleaning, exploration, and visualization with Pandas and Matplotlib.',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: 'Data Science',
    icon: 'chart',
    difficulty: 'Intermediate',
    steps: 10,
    read_time_mins: 45,
    author: { name: 'Aisha Nair', letter: 'AN' },
    tags: ['Python', 'Pandas', 'Data', 'Matplotlib'],
  },
  {
    id: 't5',
    slug: 'freelancing-for-students',
    title: 'How to Start Freelancing as a Student and Earn Your First ₹10,000',
    description: 'A step-by-step guide to setting up your profile, finding clients, and delivering your first project on Fiverr and Upwork.',
    cover: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    category: 'Student Earning',
    icon: 'graduate',
    difficulty: 'Beginner',
    steps: 7,
    read_time_mins: 18,
    author: { name: 'Rahul Menon', letter: 'RM' },
    tags: ['Freelancing', 'Fiverr', 'Students', 'Income'],
  },
  {
    id: 't6',
    slug: 'docker-kubernetes-crash-course',
    title: 'Docker & Kubernetes Crash Course for Backend Developers',
    description: 'Containerize your apps, orchestrate deployments, and go from zero to a running Kubernetes cluster on a cloud provider.',
    cover: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    category: 'DevOps',
    icon: 'layers',
    difficulty: 'Advanced',
    steps: 14,
    read_time_mins: 60,
    author: { name: 'Elias Thorne', letter: 'ET' },
    tags: ['Docker', 'Kubernetes', 'DevOps', 'Cloud'],
  },
]

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  code: Code2,
  layers: Layers,
  cpu: Cpu,
  chart: BarChart2,
  graduate: GraduationCap,
}

const FEATURED = TUTORIALS[0]
const REST = TUTORIALS.slice(1)

export default function TutorialsPage() {
  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-10 space-y-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={10} className="text-on-surface-variant/40" />
        <span className="text-on-surface">Tutorials</span>
      </nav>

      {/* Header */}
      <div className="border-b border-outline-variant pb-6">
        <h1 className="font-serif font-bold text-3xl text-on-surface mb-1">Tutorials & Guides</h1>
        <p className="text-sm text-on-surface-variant">Step-by-step guides to level up your skills — from beginner to advanced.</p>
      </div>

      {/* Featured Tutorial */}
      <Link
        href={`/tutorials/${FEATURED.slug}`}
        className="group block border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 aspect-video md:aspect-auto md:min-h-60 overflow-hidden">
            <img src={FEATURED.cover} alt={FEATURED.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-primary">{FEATURED.category}</span>
              <span className="text-on-surface-variant/40">·</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${DIFFICULTY_COLOR[FEATURED.difficulty]}`}>{FEATURED.difficulty}</span>
            </div>
            <h2 className="font-serif font-bold text-xl md:text-2xl text-on-surface leading-snug group-hover:text-primary transition-colors">
              {FEATURED.title}
            </h2>
            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">{FEATURED.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
              <span className="flex items-center gap-1"><BookOpen size={11} /> {FEATURED.steps} steps</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {FEATURED.read_time_mins} min</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px]">{FEATURED.author.letter}</div>
                <span className="text-[11px] text-on-surface-variant">{FEATURED.author.name}</span>
              </div>
              <ArrowUpRight size={15} className="text-outline group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {REST.map((tut) => {
          const Icon = ICON_MAP[tut.icon] || BookOpen
          return (
            <Link
              key={tut.id}
              href={`/tutorials/${tut.slug}`}
              className="group border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest hover:border-outline hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="aspect-video overflow-hidden bg-surface-variant relative">
                <img src={tut.cover} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-2.5 left-2.5 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white">
                  <Icon size={13} />
                </div>
              </div>
              <div className="p-4 flex flex-col gap-2.5 grow">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-on-surface-variant">
                  <span className="text-primary font-bold uppercase tracking-wide">{tut.category}</span>
                  <span>·</span>
                  <span className={`px-1.5 py-0.5 rounded border font-bold ${DIFFICULTY_COLOR[tut.difficulty]}`}>{tut.difficulty}</span>
                </div>
                <h3 className="font-serif font-bold text-sm leading-snug text-on-surface group-hover:text-primary transition-colors line-clamp-2 grow">
                  {tut.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                  <span className="flex items-center gap-1"><BookOpen size={10} /> {tut.steps} steps</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {tut.read_time_mins} min</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[9px]">{tut.author.letter}</div>
                    <span className="text-[11px] text-on-surface-variant">{tut.author.name}</span>
                  </div>
                  <ArrowUpRight size={13} className="text-outline group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
