/**
 * Persistent CMS store backed by Vercel Blob.
 * Globally accessible across all serverless functions and edge locations.
 * Automatically falls back to local seed data if offline.
 */
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import type { Software, BlogPost } from './supabase'
import { INITIAL_SOFTWARE, INITIAL_BLOGS } from './mockData'

const BLOB_URL = 'https://qjguuyfbzynvd44k.public.blob.vercel-storage.com/cms/data.json'
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_QJgUUYfbZYNvd44K_lnwHMxgBHH6L3N3nPoIpKoAagnG6JA'

export interface CMSData {
  software: Software[]
  blogs: BlogPost[]
}

// In-memory cache per Lambda instance to speed up consecutive reads
let memoryCache: CMSData | null = null
let lastFetchTimestamp = 0
const CACHE_TTL_MS = 1500 // 1.5s in-memory cache to prevent duplicate fetches in the same request cycle

export async function loadCMSData(): Promise<CMSData> {
  const now = Date.now()
  if (memoryCache && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return memoryCache
  }

  try {
    // Bust Vercel CDN cache with timestamp + random nonce to always fetch real-time state
    const url = `${BLOB_URL}?t=${now}_${Math.random()}`
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    })

    if (res.ok) {
      const data = (await res.json()) as CMSData
      if (Array.isArray(data.software) && Array.isArray(data.blogs)) {
        memoryCache = data
        lastFetchTimestamp = now
        return data
      }
    }
  } catch (err) {
    console.error('Failed to load CMS data from Vercel Blob:', err)
  }

  // Fallback to memory cache if available, or default mock data
  if (memoryCache) return memoryCache

  const fallback: CMSData = {
    software: [...INITIAL_SOFTWARE],
    blogs: [...INITIAL_BLOGS],
  }
  memoryCache = fallback
  return fallback
}

export async function saveCMSData(data: CMSData): Promise<void> {
  memoryCache = data
  lastFetchTimestamp = Date.now()

  try {
    await put('cms/data.json', JSON.stringify(data, null, 2), {
      access: 'public',
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: 'application/json',
      token: BLOB_TOKEN,
    })

    // Invalidate all Next.js cached pages
    try {
      revalidatePath('/', 'layout')
    } catch {
      // Ignored outside request context
    }
  } catch (err) {
    console.error('Failed to persist CMS data to Vercel Blob:', err)
    throw err
  }
}

// ─── Software Operations ───────────────────────────────────────────────────

export async function storeSoftwareList(): Promise<Software[]> {
  const data = await loadCMSData()
  return data.software
}

export async function storeSoftwareById(id: string): Promise<Software | undefined> {
  const data = await loadCMSData()
  return data.software.find((s) => s.id === id || s.slug === id)
}

export async function storeSoftwareBySlug(slug: string): Promise<Software | undefined> {
  const data = await loadCMSData()
  return data.software.find((s) => s.slug === slug)
}

export async function storeSaveSoftware(item: Software): Promise<Software> {
  const data = await loadCMSData()
  const idx = data.software.findIndex((s) => s.id === item.id)
  if (idx >= 0) {
    data.software[idx] = item
  } else {
    data.software.unshift(item)
  }
  await saveCMSData(data)
  return item
}

export async function storeDeleteSoftware(id: string): Promise<boolean> {
  const data = await loadCMSData()
  const before = data.software.length
  data.software = data.software.filter((s) => s.id !== id)
  await saveCMSData(data)
  return data.software.length < before
}

// ─── Blog Operations ────────────────────────────────────────────────────────

export async function storeBlogList(publishedOnly = false): Promise<BlogPost[]> {
  const data = await loadCMSData()
  return publishedOnly ? data.blogs.filter((b) => b.published) : data.blogs
}

export async function storeBlogById(id: string): Promise<BlogPost | undefined> {
  const data = await loadCMSData()
  return data.blogs.find((b) => b.id === id || b.slug === id)
}

export async function storeBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await loadCMSData()
  return data.blogs.find((b) => b.slug === slug)
}

export async function storeSaveBlog(item: BlogPost): Promise<BlogPost> {
  const data = await loadCMSData()
  const idx = data.blogs.findIndex((b) => b.id === item.id)
  if (idx >= 0) {
    data.blogs[idx] = item
  } else {
    data.blogs.unshift(item)
  }
  await saveCMSData(data)
  return item
}

export async function storeDeleteBlog(id: string): Promise<boolean> {
  const data = await loadCMSData()
  const before = data.blogs.length
  data.blogs = data.blogs.filter((b) => b.id !== id)
  await saveCMSData(data)
  return data.blogs.length < before
}
