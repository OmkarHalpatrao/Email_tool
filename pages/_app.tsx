import type { AppProps } from "next/app"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./../components/theme-provider"
import { Toaster } from "sonner"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className={inter.className}>
        <Component {...pageProps} />
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  )
}
