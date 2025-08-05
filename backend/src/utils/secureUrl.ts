import { randomBytes, createHash } from 'crypto'

export function generateSecureToken(id: string, userId: string): string {
  // Create a hash of the ID + userId + a secret salt
  const secret = process.env.JWT_SECRET || 'fallback-secret'
  const data = `${id}:${userId}:${secret}`
  const hash = createHash('sha256').update(data).digest('hex')
  
  // Take first 16 characters for a shorter token
  return hash.substring(0, 16)
}

export function encodeCustomerUrl(id: string, userId: string): string {
  const token = generateSecureToken(id, userId)
  // Combine ID and token, then base64 encode
  const combined = `${id}:${token}`
  return Buffer.from(combined).toString('base64url')
}

export function decodeCustomerUrl(encoded: string): { id: string; token: string } | null {
  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf-8')
    const [id, token] = decoded.split(':')
    return { id, token }
  } catch {
    return null
  }
}

export function validateCustomerAccess(encoded: string, userId: string): string | null {
  const decoded = decodeCustomerUrl(encoded)
  
  if (!decoded) {
    return null
  }
  
  const expectedToken = generateSecureToken(decoded.id, userId)
  
  if (decoded.token !== expectedToken) {
    return null
  }
  
  return decoded.id
} 