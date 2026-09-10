import { createClient } from '@supabase/supabase-js'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseUrl = (rawUrl && rawUrl.startsWith('http')) ? rawUrl : 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Software = {
  id: string
  name: string
  slug: string
  description: string
  content: string
  version: string
  features: string[]
  image_url: string
  file_url: string
  file_name: string
  file_size: number
  download_count: number
  created_at: string
  updated_at: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  cover_image: string
  published: boolean
  created_at: string
  updated_at: string
}