export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Universal slug cleaner:
 * Removes domains, paths (/phan-mem/, /blog/), slashes, accents, and special characters.
 * Guarantees a safe, clean, one-segment URL slug.
 */
export function cleanSlug(raw: string): string {
  if (!raw) return ''
  return raw
    .trim()
    .replace(/^https?:\/\/[^\/]+/i, '')
    .replace(/^\/?(phan-mem|blog)\/?/i, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugify(text: string): string {
  return cleanSlug(text)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
