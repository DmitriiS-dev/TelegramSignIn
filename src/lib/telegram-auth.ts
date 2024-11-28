'use server'

import { createHash, createHmac } from 'crypto'
import { cookies } from 'next/headers'

export interface TelegramUser {
  id: number
  first_name: string
  username?: string
  photo_url?: string
  auth_date: number
  hash: string
}

// Ensure BOT_TOKEN is defined and of the correct type
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not set')
}

function checkSignature(data: Partial<TelegramUser>) {
  const { hash, ...userData } = data
  if (!hash) return false

  // Create check string
  const checkArr = Object.entries(userData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)

  const checkString = checkArr.join('\n')

  // Create secret key
  const secretKey = createHash('sha256')
    .update(BOT_TOKEN) // BOT_TOKEN is now guaranteed to be a string
    .digest()

  // Calculate hmac
  const hmac = createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex')

  return hmac === hash
}

export async function verifyTelegramLogin(data: TelegramUser) {
  'use server'

  const isValid = checkSignature(data)
  if (!isValid) {
    throw new Error('Invalid authentication')
  }

  // Check if auth_date is not too old (within last 24h)
  const authTimestamp = data.auth_date
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (currentTimestamp - authTimestamp > 86400) {
    throw new Error('Authentication expired')
  }

  // Set a session cookie
  cookies().set('telegram_user', JSON.stringify({
    id: data.id,
    first_name: data.first_name,
    username: data.username,
    photo_url: data.photo_url
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })

  return {
    success: true,
    user: {
      id: data.id,
      firstName: data.first_name,
      username: data.username,
      photoUrl: data.photo_url
    }
  }
}

export async function getCurrentUser() {
  'use server'

  const userCookie = cookies().get('telegram_user')
  if (!userCookie) return null

  try {
    return JSON.parse(userCookie.value)
  } catch {
    return null
  }
}

export async function logout() {
  'use server'
  cookies().delete('telegram_user')
}
