// E:\Projects\Works\Expliq\src\components\tools\ToolFinderQuiz.tsx
"use client"

import { useState } from 'react'
import { HelpCircle, RefreshCcw, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  title: string
  options: { label: string; value: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 'role',
    title: 'What is your primary profile?',
    options: [
      { label: 'College Student', value: 'student' },
      { label: 'Working Professional', value: 'pro' },
      { label: 'Freelancer / Creator', value: 'freelancer' }
    ]
  },
  {
    id: 'goal',
    title: 'What is your primary goal right now?',
    options: [
      { label: 'Earn side income online', value: 'earn' },
      { label: 'Boost work productivity with AI', value: 'productivity' },
      { label: 'Learn in-demand technical skills', value: 'upskill' }
    ]
  },
  {
    id: 'budget',
    title: 'What is your budget limit for tools?',
    options: [
      { label: 'Free tools only (₹0)', value: 'free' },
      { label: 'Low cost (under ₹1,000/mo)', value: 'budget' },
      { label: 'Willing to invest in premium tools', value: 'premium' }
    ]
  },
  {
    id: 'device',
    title: 'What is your primary learning / work device?',
    options: [
      { label: 'Smartphone only', value: 'mobile' },
      { label: 'Laptop / PC', value: 'desktop' }
    ]
  }
]

const RECOMMENDATIONS_DB = [
  {
    id: 'fiverr',
    name: 'Fiverr Freelance Seller Program',
    desc: 'Best platform for Indian students to sell design, writing, or basic dev gigs from home.',
    price: 'Free to join',
    badge: 'Student Favorite',
    url: '/go/fiverr',
    tags: ['student', 'earn', 'free', 'mobile']
  },
  {
    id: 'scaler',
    name: 'Scaler Academy Cohorts',
    desc: 'Structured cohort upskilling program with mentorship for service company developers shifting to startups.',
    price: 'Paid (Scholarship available)',
    badge: 'Premium Career',
    url: '/go/scaler',
    tags: ['pro', 'upskill', 'premium', 'desktop']
  },
  {
    id: 'gemini-adv',
    name: 'Gemini Advanced (₹1,750/mo)',
    desc: 'Google’s highest tier AI model, integrated into Docs, Sheets, and Gmail. Highly useful for marketers and writers.',
    price: 'Free 1 month trial',
    badge: 'Best Productivity',
    url: '/go/gemini',
    tags: ['pro', 'productivity', 'budget', 'desktop']
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus (₹1,999/mo)',
    desc: 'OpenAI’s GPT-4o model with advanced code execution, image creation, and custom GPT builders.',
    price: 'Paid / Free tier available',
    badge: 'Gold Standard',
    url: '/go/chatgpt',
    tags: ['freelancer', 'productivity', 'premium', 'desktop']
  },
  {
    id: 'internshala',
    name: 'Internshala Work-From-Home Jobs',
    desc: 'Find part-time work-from-home internships in marketing, web design, or content writing inside India.',
    price: 'Free',
    badge: 'Student income',
    url: '/go/internshala',
    tags: ['student', 'earn', 'free', 'desktop']
  },
  {
    id: 'coursera',
    name: 'Coursera Professional Certificates',
    desc: 'Get certified by Google, Meta, or IBM. Great addition to resumes for junior developers and graduates.',
    price: 'Low budget / Financial Aid available',
    badge: 'Certified Learning',
    url: '/go/coursera',
    tags: ['student', 'upskill', 'budget', 'mobile']
  }
]

export function ToolFinderQuiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleSelectOption = (value: string) => {
    const activeQuestion = QUESTIONS[step]
    setAnswers((prev) => ({ ...prev, [activeQuestion.id]: value }))

    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1)
    } else {
      setStep(QUESTIONS.length) // Move to results step
    }
  }

  const handleReset = () => {
    setAnswers({})
    setStep(0)
  }

  // Filter recommendations based on tags
  const getRecommendations = () => {
    const userRole = answers.role
    const userGoal = answers.goal
    const userBudget = answers.budget
    const userDevice = answers.device

    // Score recommendations based on matched tags
    const scored = RECOMMENDATIONS_DB.map((rec) => {
      let score = 0
      if (rec.tags.includes(userRole)) score += 3
      if (rec.tags.includes(userGoal)) score += 3
      if (rec.tags.includes(userBudget)) score += 1
      if (rec.tags.includes(userDevice)) score += 1
      return { ...rec, score }
    })

    // Sort by highest score first, return top 3
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant p-6 rounded-lg max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <HelpCircle size={22} className="text-secondary" />
          <h3 className="font-serif font-bold text-lg text-on-surface">AI Tool Finder Quiz</h3>
        </div>
        {step > 0 && (
          <button
            onClick={handleReset}
            className="text-[10px] font-bold text-outline hover:text-primary flex items-center gap-1 uppercase transition-colors"
          >
            <RefreshCcw size={10} /> Reset
          </button>
        )}
      </div>

      {step < QUESTIONS.length ? (
        // Question Step UI
        <div className="space-y-5">
          <div className="flex justify-between items-center text-xs text-outline font-mono">
            <span>QUESTION {step + 1} OF {QUESTIONS.length}</span>
            <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}% Done</span>
          </div>
          
          <h4 className="font-serif font-bold text-base text-on-surface leading-tight">
            {QUESTIONS[step].title}
          </h4>

          <div className="flex flex-col gap-3">
            {QUESTIONS[step].options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className="w-full text-left bg-surface hover:bg-surface-container-high border border-outline-variant hover:border-secondary p-4 rounded-lg text-sm font-semibold transition-all hover:translate-x-1 duration-150 text-on-surface active:scale-[0.98]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Results Step UI
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-[#f0f4f9] p-4 rounded-lg border border-secondary/20">
            <Sparkles size={20} className="text-secondary animate-pulse" />
            <div>
              <h4 className="text-sm font-bold text-on-surface">Matches Found!</h4>
              <p className="text-xs text-on-surface-variant">Here are your personalized tool recommendations:</p>
            </div>
          </div>

          <div className="space-y-4">
            {getRecommendations().map((rec) => (
              <div key={rec.id} className="border border-outline-variant bg-surface p-4 rounded-lg space-y-3 shadow-sm hover:scale-[1.01] transition-transform">
                <div className="flex justify-between items-start">
                  <span className="bg-secondary/10 text-secondary text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    {rec.badge}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">{rec.price}</span>
                </div>
                <h5 className="font-bold text-on-surface text-sm">{rec.name}</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">{rec.desc}</p>
                {/* Redirect trigger */}
                <Link
                  href={`/api/affiliate/click?partner=${encodeURIComponent(rec.name)}&url=${encodeURIComponent(rec.url)}`}
                  target="_blank"
                  className="w-full bg-secondary hover:bg-secondary-container text-on-secondary text-center text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Check size={12} /> Explore Tool
                </Link>
              </div>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full border-2 border-outline-variant hover:bg-surface-container text-on-surface text-xs font-bold py-3 rounded-lg transition-colors"
          >
            Retake the Quiz
          </button>
        </div>
      )}
    </div>
  )
}
