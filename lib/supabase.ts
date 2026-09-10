import { createClient } from '@supabase/supabase-js'
import { INITIAL_SOFTWARE, INITIAL_BLOGS } from './mockData'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isConfigured = rawUrl && rawUrl.startsWith('http') && !rawUrl.includes('your-project') && !rawUrl.includes('placeholder')
const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder.supabase.co'
const supabaseKey = (rawKey && !rawKey.includes('your_supabase')) ? rawKey : 'placeholder-key'

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

export async function fetchSoftwareList(): Promise<Software[]> {
  if (!isConfigured) return INITIAL_SOFTWARE
  try {
    const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 1000))
    const fetchPromise = supabase.from('software').select('*').order('created_at', { ascending: false })
    const { data } = await Promise.race([fetchPromise, timeoutPromise])
    if (data && data.length > 0) return data as Software[]
    return INITIAL_SOFTWARE
  } catch {
    return INITIAL_SOFTWARE
  }
}

export async function fetchSoftwareBySlug(slug: string): Promise<Software | undefined> {
  if (!isConfigured) return INITIAL_SOFTWARE.find(s => s.slug === slug)
  try {
    const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 1000))
    const fetchPromise = supabase.from('software').select('*').eq('slug', slug).single()
    const { data } = await Promise.race([fetchPromise, timeoutPromise])
    if (data) return data as Software
    return INITIAL_SOFTWARE.find(s => s.slug === slug)
  } catch {
    return INITIAL_SOFTWARE.find(s => s.slug === slug)
  }
}

export async function fetchBlogList(): Promise<BlogPost[]> {
  if (!isConfigured) return INITIAL_BLOGS
  try {
    const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 1000))
    const fetchPromise = supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
    const { data } = await Promise.race([fetchPromise, timeoutPromise])
    if (data && data.length > 0) return data as BlogPost[]
    return INITIAL_BLOGS
  } catch {
    return INITIAL_BLOGS
  }
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!isConfigured) return INITIAL_BLOGS.find(b => b.slug === slug)
  try {
    const timeoutPromise = new Promise<{ data: null }>((resolve) => setTimeout(() => resolve({ data: null }), 1000))
    const fetchPromise = supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
    const { data } = await Promise.race([fetchPromise, timeoutPromise])
    if (data) return data as BlogPost
    return INITIAL_BLOGS.find(b => b.slug === slug)
  } catch {
    return INITIAL_BLOGS.find(b => b.slug === slug)
  }
}