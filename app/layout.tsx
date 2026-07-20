import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"
import { PwaRegister } from "@/components/pwa-register"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#0d9488",
}

export const metadata: Metadata = {
  title: "WISA — Website Invoice & Service Application",
  description:
    "Buat invoice profesional untuk bisnis jasa UMKM secara gratis. Preview real-time, download PDF, tanpa perlu login atau daftar akun.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "WISA" },
  icons: { apple: "/icon-192.svg" },
  openGraph: {
    title: "WISA — Website Invoice & Service Application",
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
        <PwaRegister />
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
