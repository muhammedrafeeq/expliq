// E:\Projects\Works\Expliq\src\lib\actions\newsletter.ts
"use server"

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const subscriberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional()
})

export async function subscribeNewsletterAction(email: string, source: string = 'website') {
  const parsed = subscriberSchema.safeParse({ email, source })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({
      email: parsed.data.email,
      source: parsed.data.source
    })

  if (error) {
    if (error.code === '23505') { // Unique constraint code
      return { error: 'You are already subscribed to our newsletter!' }
    }
    return { error: 'Subscription failed. Please try again.' }
  }

  return { success: true }
}
