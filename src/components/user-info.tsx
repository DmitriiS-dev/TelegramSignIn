import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: number
  first_name: string
  username?: string
  photo_url?: string
}

interface UserInfoProps {
  user: User
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome, {user.first_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.photo_url ? (
            <AvatarImage src={user.photo_url} alt={user.first_name} />
          ) : (
            <AvatarFallback>{user.first_name[0]}</AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          {user.username && (
            <p className="text-sm font-medium">Username: @{user.username}</p>
          )}
          <p className="text-sm text-muted-foreground">Telegram ID: {user.id}</p>
        </div>
      </CardContent>
    </Card>
  )
}

