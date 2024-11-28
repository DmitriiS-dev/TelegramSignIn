import { getCurrentUser, logout } from '@/lib/telegram-auth'
import { TelegramLogin } from '@/components/telegram-login'
import { UserInfo } from '@/components/user-info'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 space-y-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Telegram Login Demo</h1>
        <p className="text-muted-foreground">Sign in with your Telegram account</p>
      </div>
      
      {user ? (
        <div className="space-y-4">
          <UserInfo user={user} />
          <form action={logout}>
            <Button type="submit" variant="outline" className="w-full">
              Sign Out
            </Button>
          </form>
        </div>
      ) : (
        <div className="p-8 border rounded-lg bg-card">
          <TelegramLogin 
            botName={process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || ''}
            onError={(error) => {
              console.error('Login failed:', error)
            }}
          />
        </div>
      )}
    </main>
  )
}

