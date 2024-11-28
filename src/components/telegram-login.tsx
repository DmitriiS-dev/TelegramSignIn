'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { verifyTelegramLogin } from '@/lib/telegram-auth'
import type { TelegramUser } from '@/lib/telegram-auth'

interface TelegramLoginProps {
  botName: string
  onSuccess?: () => void
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void
    }
  }
}

export function TelegramLogin({ 
  botName, 
  onSuccess 
}: TelegramLoginProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Use the domain from the environment variable
  
  useEffect(() => {
    // Example of constructing a URL using the domain
    const apiUrl = `${domain}/api/telegram-webhook`;
    
    // Load Telegram widget script
    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', botName)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-request-access', 'write')
    script.setAttribute('data-userpic', 'false')
    script.async = true
    
    // Handle authentication
    window.TelegramLoginWidget = {
      dataOnauth: async (user) => {
        try {
          await verifyTelegramLogin(user)
          console.log('Login successful')
          onSuccess?.()
          router.refresh()
        } catch (error) {
          console.error('Authentication failed:', error)
          alert('An error occurred during login. Please try again.')
        }
      }
    }
    
    containerRef.current?.appendChild(script)
    
    return () => {
      script.remove()
    }
  }, [botName, onSuccess, router])
  
  return <div ref={containerRef} />
}
