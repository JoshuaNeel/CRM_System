import { randomBytes } from 'crypto'

export function generateSlug(name: string): string {
  // Convert name to lowercase and replace spaces/special chars with hyphens
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  // Add a random suffix to ensure uniqueness
  const randomSuffix = randomBytes(4).toString('hex')
  
  return `${baseSlug}-${randomSuffix}`
}

export function generateShortId(): string {
  // Generate a short, non-sequential ID
  return randomBytes(8).toString('base64url')
} 