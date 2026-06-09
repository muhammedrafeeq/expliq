"use client"

import { usePathname } from 'next/navigation'
import { Shell } from './Shell'

const NO_SHELL_ROUTES = ['/publisher/editor']

export function ShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const skip = NO_SHELL_ROUTES.some(r => pathname.startsWith(r))
  if (skip) return <>{children}</>
  return <Shell>{children}</Shell>
}
