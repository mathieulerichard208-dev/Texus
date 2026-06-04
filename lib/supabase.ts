// lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Types ───────────────────────────────────────────────────────────────────

export type Profile = {
  id: string
  phone: string
  display_name: string
  avatar_url: string | null
  status_text: string
  status_emoji: string
  is_online: boolean
  last_seen: string
}

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  type: 'text' | 'image'
  content: string | null
  image_url: string | null
  image_blurhash: string | null
  image_width: number | null
  image_height: number | null
  is_read: boolean
  sent_at: string
  sender?: Profile
}

export type Conversation = {
  id: string
  type: 'direct' | 'group'
  name: string | null
  last_message?: Message
  unread_count?: number
  members?: Profile[]
}
