import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Faith + Purpose Community',
  description: 'A community platform for faith-based life purpose discovery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}