'use client'

import Link from 'next/link'
import { FileText, BookOpen, LayoutGrid, Sparkles } from 'lucide-react'
import { APP_NAME, APP_TAGLINE } from '@/lib/constants'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md no-print">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              W
            </div>
            <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
          </Link>
          <span className="hidden text-xs text-muted-foreground md:inline-block">
            {APP_TAGLINE}
          </span>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/panduan#template" className="hidden items-center gap-1.5 text-sm md:inline-flex h-9 px-3 rounded-md hover:bg-muted transition-colors">
            <LayoutGrid className="h-4 w-4" />
            Template
          </Link>
          <Link href="/panduan" className="hidden items-center gap-1.5 text-sm md:inline-flex h-9 px-3 rounded-md hover:bg-muted transition-colors">
            <BookOpen className="h-4 w-4" />
            Panduan
          </Link>
          <Link
            href="/invoice"
            className="inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[12px] bg-primary px-2.5 text-[0.8rem] font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80"
          >
            <Sparkles className="h-4 w-4" />
            Invoice Baru
          </Link>
        </nav>
      </div>
    </header>
  )
}
