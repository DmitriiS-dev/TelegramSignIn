'use server'

import { createHash, createHmac } from 'crypto'
import { TelegramUser } from '@/types/telegram'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TOKEN_HASH = createHash('sha256').update(BOT_TOKEN || '').digest()

function checkTelegramAuthorization(data: Partial<TelegramUser>) {
  const { hash, ...userData } = data
  
  if (!hash) return false
  
  // Create a sorted string of key=value pairs
  const checkString = Object.keys(userData)
    .sort()
    .map(k => `${k}=${userData[k as keyof typeof userData]}`)
    .join('\n')
  
  // Calculate HMAC-SHA256 signature
  const hmac = createHmac('sha256', TOKEN_HASH)
    .update(checkString)
    .digest('hex')
  
  return hmac === hash
}

export async function verifyTelegramLogin(data: TelegramUser) {
  const isValid = checkTelegramAuthorization(data)
  
  if (!isValid) {
    throw new Error('Invalid authentication data')
  }
  
  // Here you would typically:
  // 1. Create a session
  // 2. Store user data in your database
  // 3. Return necessary user data
  
  return {
    user: {
      id: data.id,
      firstName: data.first_name,
      username: data.username,
      photoUrl: data.photo_url
    }
  }
}

