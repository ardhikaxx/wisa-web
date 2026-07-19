import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MISA — Generator Invoice Jasa Gratis Tanpa Login",
  description:
    "Buat invoice profesional untuk bisnis jasa UMKM secara gratis. Preview real-time, download PDF, tanpa perlu login atau daftar akun.",
  openGraph: {
    title: "MISA — Generator Invoice Jasa Gratis Tanpa Login",
    description:
      "Buat invoice profesional untuk bisnis jasa UMKM secara gratis. Preview real-time, download PDF, tanpa perlu login.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </TooltipProvider>
      </body>
    </html>
  )
}
