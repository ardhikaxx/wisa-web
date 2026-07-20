'use client'

import { useState, useCallback, useRef } from 'react'
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
  Beaker,
  Upload,
  ImageDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { generateInvoiceSummary, copyToClipboard } from '@/lib/helpers'

export function InvoiceActions() {
  const { data, resetData, saveToHistory, loadSampleData, exportBackup, importBackup } = useInvoiceStore()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportBackup = useCallback(() => {
    const json = exportBackup()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wisa-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diexport')
  }, [exportBackup])

  const handleImportBackup = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const json = ev.target?.result as string
        importBackup(json)
        toast.success('Data berhasil direstore')
      } catch {
        toast.error('File backup tidak valid')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [importBackup])

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

  const [isGeneratingPng, setIsGeneratingPng] = useState(false)

  const handleExportPng = useCallback(async () => {
    if (!validateInvoice()) return
    setIsGeneratingPng(true)
    try {
      const sourceEl = document.getElementById('invoice-preview')
      if (!sourceEl) throw new Error('Preview tidak ditemukan')
      const domtoimage = (await import('dom-to-image-more')).default
      const canvas = await domtoimage.toCanvas(sourceEl, {
        pixelRatio: 3,
        quality: 1,
        bgcolor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `${data.invoiceInfo.invoiceNumber || 'invoice'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('PNG berhasil diunduh!')
    } catch {
      toast.error('Gagal membuat PNG')
    } finally {
      setIsGeneratingPng(false)
    }
  }, [validateInvoice, data])

  const handlePrint = useCallback(() => {
    if (!validateInvoice()) return
    saveToHistory()
    window.print()
  }, [validateInvoice, saveToHistory])

  const injectPrintStyle = useCallback((widthMm: number, fontSize: string) => {
    const existing = document.getElementById(`print-${widthMm}mm-style`)
    if (existing) existing.remove()
    const style = document.createElement('style')
    style.id = `print-${widthMm}mm-style`
    style.textContent = `
      @media print {
        @page { size: ${widthMm}mm auto; margin: 0; }
        #invoice-preview { width: ${widthMm}mm !important; max-width: ${widthMm}mm !important; }
        #invoice-preview * { font-size: ${fontSize} !important; }
        #invoice-preview table { font-size: ${parseInt(fontSize) - 1}px !important; }
      }
    `
    document.head.appendChild(style)
    return style
  }, [])

  const handlePrint58mm = useCallback(() => {
    if (!validateInvoice()) return
    saveToHistory()
    injectPrintStyle(58, '7px')
    setTimeout(() => window.print(), 50)
    setTimeout(() => { document.getElementById('print-58mm-style')?.remove() }, 1000)
  }, [validateInvoice, saveToHistory, injectPrintStyle])

  const handlePrint80mm = useCallback(() => {
    if (!validateInvoice()) return
    saveToHistory()
    injectPrintStyle(80, '8px')
    setTimeout(() => window.print(), 50)
    setTimeout(() => { document.getElementById('print-80mm-style')?.remove() }, 1000)
  }, [validateInvoice, saveToHistory, injectPrintStyle])

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
            <DropdownMenuItem onClick={handlePrint58mm} className="gap-2">
              <Printer className="h-4 w-4" />
              Cetak Nota (58mm)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint80mm} className="gap-2">
              <Printer className="h-4 w-4" />
              Cetak Nota (80mm)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportPng} className="gap-2" disabled={isGeneratingPng}>
              {isGeneratingPng ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageDown className="h-4 w-4" />}
              {isGeneratingPng ? 'Memproses...' : 'Export PNG'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Bagikan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopySummary} className="gap-2">
              <Copy className="h-4 w-4" />
              Salin Ringkasan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { loadSampleData(); toast.success('Data contoh dimuat') }} className="gap-2">
              <Beaker className="h-4 w-4" />
              Muat Contoh Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Simpan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleExportBackup} className="gap-2">
              <Download className="h-4 w-4" />
              Backup Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
              <Upload className="h-4 w-4" />
              Restore Data
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

      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleImportBackup}
      />
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
