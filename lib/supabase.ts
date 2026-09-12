/**
 * Data access layer — reads from persistent Vercel Blob store.
 * All public pages and admin use these functions to fetch data.
 */
import {
  storeSoftwareList,
  storeSoftwareBySlug,
  storeSoftwareById,
  storeBlogList,
  storeBlogBySlug,
  storeBlogById,
} from './store'

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
  return await storeSoftwareList()
}

export async function fetchSoftwareBySlug(slug: string): Promise<Software | undefined> {
  return await storeSoftwareBySlug(slug)
}

export async function fetchSoftwareById(id: string): Promise<Software | undefined> {
  return await storeSoftwareById(id)
}

export async function fetchBlogList(): Promise<BlogPost[]> {
  return await storeBlogList(true) // published only for public
}

export async function fetchAllBlogList(): Promise<BlogPost[]> {
  return await storeBlogList(false) // all posts (including drafts for admin)
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  return await storeBlogBySlug(slug)
}

export async function fetchBlogById(id: string): Promise<BlogPost | undefined> {
  return await storeBlogById(id)
}