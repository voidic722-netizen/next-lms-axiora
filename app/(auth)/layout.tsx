import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const AUTH_TOKEN_COOKIE = process.env.AUTH_TOKEN_COOKIE_NAME ?? 'auth_token'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)

  if (token?.value) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      {children}
    </div>
  )
}