import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'laravel_session'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)

  if (session?.value) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      {children}
    </div>
  )
}