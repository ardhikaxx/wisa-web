'use client'

import { useState, useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Download,
  Printer,
  Share2,
  Copy,
  RotateCcw,
  Save,
  Loader2,
  MoreHorizontal,
} from 'lucide-react'
import { toast } from 'sonner'
import { generateInvoiceSummary, copyToClipboard } from '@/lib/helpers'

export function InvoiceActions() {
  const { data, resetData, saveToHistory } = useInvoiceStore()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const validateInvoice = useCallback((): boolean => {
    const errors: string[] = []
    if (!data.businessInfo.businessName.trim()) errors.push('Nama bisnis')
    if (!data.customerInfo.customerName.trim()) errors.push('Nama pelanggan')
    if (!data.invoiceInfo.invoiceNumber.trim()) errors.push('Nomor invoice')
    if (data.items.length === 0) errors.push('Minimal satu jasa')
    if (data.items.some((item) => !item.name.trim())) errors.push('Nama jasa harus diisi')

    if (errors.length > 0) {
      toast.error(`Lengkapi data berikut: ${errors.join(', ')}`)
      return false
    }
    return true
  }, [data])

  const handleDownloadPdf = useCallback(async () => {
    if (!validateInvoice()) return

    setIsGeneratingPdf(true)
    try {
      const sourceEl = document.getElementById('invoice-preview')
      if (!sourceEl) throw new Error('Preview tidak ditemukan')

      const domtoimage = (await import('dom-to-image-more')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await domtoimage.toCanvas(sourceEl, {
        pixelRatio: 2,
        quality: 1,
        bgcolor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = 210
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = pdfHeight
      let position = 0
      const pageHeight = 297

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${data.invoiceInfo.invoiceNumber || 'invoice'}.pdf`)
      saveToHistory()
      toast.success('PDF berhasil diunduh!')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Gagal membuat PDF. Silakan coba lagi.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }, [validateInvoice, data, saveToHistory])

  const handlePrint = useCallback(() => {
    if (!validateInvoice()) return
    saveToHistory()
    window.print()
  }, [validateInvoice, saveToHistory])

  const handleShare = useCallback(async () => {
    if (!validateInvoice()) return

    const summary = generateInvoiceSummary(data)

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${data.invoiceInfo.invoiceNumber}`,
          text: summary,
        })
      } catch {
        // User cancelled
      }
    } else {
      await copyToClipboard(summary)
      toast.success('Ringkasan invoice disalin ke clipboard!')
    }
  }, [validateInvoice, data])

  const handleCopySummary = useCallback(async () => {
    if (!validateInvoice()) return
    const summary = generateInvoiceSummary(data)
    await copyToClipboard(summary)
    toast.success('Ringkasan invoice disalin!')
  }, [validateInvoice, data])

  const handleSave = useCallback(() => {
    saveToHistory()
    toast.success('Invoice tersimpan di riwayat!')
  }, [saveToHistory])

  const handleReset = useCallback(() => {
    resetData()
    setShowResetDialog(false)
    toast.success('Invoice baru siap dibuat')
  }, [resetData])

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGeneratingPdf ? 'Memproses...' : 'Download PDF'}
        </Button>

        <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="h-8 w-8" />}>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Bagikan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopySummary} className="gap-2">
              <Copy className="h-4 w-4" />
              Salin Ringkasan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Simpan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowResetDialog(true)}
              className="gap-2 text-destructive"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Invoice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua data invoice yang sedang dikerjakan akan dihapus.
              Data yang sudah disimpan di riwayat tidak akan terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Ya, Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
