// E:\Projects\Works\Expliq\src\app\tools\page.tsx
import { SalaryBenchmarker } from '@/components/tools/SalaryBenchmarker'
import { ToolFinderQuiz } from '@/components/tools/ToolFinderQuiz'
import { Sparkles, BarChart2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Free tools for Indian students and professionals — salary benchmarker, AI tool finder, and more.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://expliq.in'}/tools` },
  openGraph: {
    type: 'website',
    title: 'Tools | Expliq',
    description: 'Free tools for Indian students and professionals — salary benchmarker, AI tool finder, and more.',
  },
}

export default function ToolsHubPage() {
  return (
    <div className="max-w-page-max-width mx-auto px-gutter py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif font-bold text-3xl md:text-4xl text-on-surface">Interactive Tech Calculators</h1>
        <p className="text-xs text-on-surface-variant max-w-lg mx-auto">
          Use our customized tools to benchmark your compensation against Indian tech hubs or find AI products tailored to your workflow.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Tool 1: Salary Calculator */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <BarChart2 size={18} className="text-primary" />
            <h2 className="font-serif font-bold text-lg text-on-surface">Income Survey Analyzer</h2>
          </div>
          <SalaryBenchmarker />
        </div>

        {/* Tool 2: Tool Finder */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={18} className="text-secondary" />
            <h2 className="font-serif font-bold text-lg text-on-surface">Productivity Matchmaker</h2>
          </div>
          <ToolFinderQuiz />
        </div>
      </div>
    </div>
  )
}
