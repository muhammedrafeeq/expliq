// E:\Projects\Works\Expliq\src\components\tools\SalaryBenchmarker.tsx
"use client"

import { useState } from 'react'
import { Info, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ROLES = [
  { id: 'dev-jr', label: 'Junior Developer', base: 450000, increment: 95000 },
  { id: 'dev-sr', label: 'Senior Developer', base: 1200000, increment: 180000 },
  { id: 'pm', label: 'Product Manager', base: 900000, increment: 150000 },
  { id: 'designer', label: 'UI/UX Designer', base: 400000, increment: 85000 },
  { id: 'data-scientist', label: 'Data Scientist', base: 600000, increment: 130000 },
  { id: 'devops', label: 'DevOps Engineer', base: 550000, increment: 110000 },
  { id: 'content-writer', label: 'Tech Content Writer', base: 350000, increment: 50000 },
  { id: 'qa', label: 'QA Engineer', base: 380000, increment: 70000 }
]

const CITIES = [
  { id: 'bangalore', label: 'Bangalore (Bengaluru)', multiplier: 1.25 },
  { id: 'mumbai', label: 'Mumbai', multiplier: 1.20 },
  { id: 'delhi', label: 'Delhi NCR', multiplier: 1.15 },
  { id: 'hyderabad', label: 'Hyderabad', multiplier: 1.05 },
  { id: 'pune', label: 'Pune', multiplier: 1.00 },
  { id: 'chennai', label: 'Chennai', multiplier: 0.95 },
  { id: 'kochi', label: 'Kochi / Trivandrum', multiplier: 0.80 },
  { id: 'jaipur', label: 'Jaipur / Remote', multiplier: 0.75 }
]

export function SalaryBenchmarker() {
  const [roleId, setRoleId] = useState(ROLES[0].id)
  const [cityId, setCityId] = useState(CITIES[0].id)
  const [exp, setExp] = useState(3)

  const activeRole = ROLES.find((r) => r.id === roleId) || ROLES[0]
  const activeCity = CITIES.find((c) => c.id === cityId) || CITIES[0]

  // Benchmark algorithm
  const baseSalary = activeRole.base + (activeRole.increment * exp)
  const cityAdjusted = Math.round(baseSalary * activeCity.multiplier)

  const lowEnd = Math.round(cityAdjusted * 0.8)
  const median = cityAdjusted
  const highEnd = Math.round(cityAdjusted * 1.35)

  const formatLakhs = (val: number) => {
    const lakhs = (val / 100000).toFixed(1)
    return `₹${lakhs} LPA`
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant p-6 rounded-lg max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-outline-variant">
        <TrendingUp size={24} className="text-primary" />
        <div>
          <h3 className="font-serif font-bold text-lg text-on-surface">India Salary Benchmarker</h3>
          <p className="text-xs text-on-surface-variant">Check your market worth across Indian tech hubs</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Role Select */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-outline block mb-1.5">Job Role</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Select */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-outline block mb-1.5">Location</label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {CITIES.map((city) => (
              <option key={city.id} value={city.id}>
                {city.label}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Slider */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold uppercase tracking-wider text-outline">Years of Experience</label>
            <span className="text-xs font-mono font-bold text-primary">{exp} Years</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={exp}
            onChange={(e) => setExp(parseInt(e.target.value))}
            className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Results display */}
      <div className="bg-surface p-5 rounded-lg border border-outline-variant space-y-4">
        <div className="text-center font-bold text-[10px] text-outline uppercase tracking-widest">Estimated CTC Range</div>
        <div className="flex items-center justify-between gap-4">
          <div className="text-center flex-1">
            <div className="text-[10px] text-on-surface-variant uppercase">Low End</div>
            <div className="font-mono text-sm font-semibold text-outline">{formatLakhs(lowEnd)}</div>
          </div>
          <div className="text-center flex-1 bg-primary/10 p-2.5 rounded-lg border border-primary/20">
            <div className="text-[10px] text-primary uppercase font-bold">Median</div>
            <div className="font-mono text-lg font-bold text-primary">{formatLakhs(median)}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-[10px] text-on-surface-variant uppercase font-bold">High End (90th)</div>
            <div className="font-mono text-sm font-semibold text-tertiary">{formatLakhs(highEnd)}</div>
          </div>
        </div>

        <div className="flex gap-2 bg-[#f0f4f9] p-3 rounded-lg border-l-4 border-primary text-xs text-primary-fixed-dim">
          <Info size={16} className="shrink-0 text-primary" />
          <p className="text-on-surface-variant">
            In {activeCity.label}, top companies pay up to {formatLakhs(highEnd)} for {activeRole.label}s with {exp} years of experience.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <Link
        href="/career"
        className="w-full bg-primary hover:bg-primary-container text-on-primary font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
        <span>Explore Career Paths to Boost Your Hike</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  )
}
