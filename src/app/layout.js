import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { EdgeStoreProvider } from '@/lib/edgestore'
import { ModalProvider } from '@/providers/modal-provider'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Jabber',
  keywords: [
    'chat app', 'chat', 'messaging app', 'messenger', 'messaging', 'communication app', 'group chat', 'video chat', 'voice chat', 'free chat', 'secure chat', 'private chat', 'encrypted chat', 'chat with friends', 'chat with family', 'chat with strangers', 'chat for business', 'chat for work', 'chat for school', 'chat for gamers', 'chat for everyone'
  ],
  description : "Jabber is a messaging app for your phone and computer. It lets you chat smoothly and securely with others.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/images/favicon.ico" sizes="any" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          <AuthProvider
          >
            <EdgeStoreProvider>
                <Toaster position="top-center" richColors />
                <ModalProvider/>
                {children}
            </EdgeStoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
