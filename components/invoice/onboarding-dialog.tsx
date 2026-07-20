'use client'

import { useEffect, useState } from 'react'
import { useInvoiceStore } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Download, ChevronRight, Sparkles } from 'lucide-react'

export function OnboardingDialog() {
  const { onboardingDone, setOnboardingDone } = useInvoiceStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!onboardingDone) {
      setOpen(true)
    }
  }, [onboardingDone])

  const handleClose = () => {
    setOnboardingDone(true)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Selamat Datang di WISA!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Buat invoice profesional untuk bisnis jasa Anda dalam hitungan menit,
            tanpa perlu login atau membuat akun.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {[
            {
              icon: FileText,
              title: 'Isi Informasi',
              desc: 'Masukkan data bisnis, pelanggan, dan daftar jasa yang diberikan',
            },
            {
              icon: Eye,
              title: 'Lihat Preview',
              desc: 'Invoice akan tampil secara real-time dan bisa dipilih template-nya',
            },
            {
              icon: Download,
              title: 'Download PDF',
              desc: 'Unduh invoice dalam format PDF siap kirim ke pelanggan',
            },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" size="sm" onClick={handleClose}>
            Lewati
          </Button>
          <Button size="sm" onClick={handleClose} className="gap-1">
            Mulai Buat Invoice
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
