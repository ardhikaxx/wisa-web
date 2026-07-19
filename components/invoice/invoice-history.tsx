'use client'

import { useState } from 'react'
import { useInvoiceStore } from '@/lib/store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  History,
  FileText,
  Copy,
  Trash2,
  TrashIcon,
  AlertTriangle,
  Inbox,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { STATUS_COLORS } from '@/lib/constants'
import { toast } from 'sonner'
import Link from 'next/link'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceHistory({ open, onOpenChange }: Props) {
  const { history, loadFromHistory, duplicateFromHistory, deleteHistoryEntry, clearHistory, markAsPaid } =
    useInvoiceStore()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const handleLoad = (id: string) => {
    loadFromHistory(id)
    onOpenChange(false)
    toast.success('Invoice dimuat')
  }

  const handleDuplicate = (id: string) => {
    duplicateFromHistory(id)
    onOpenChange(false)
    toast.success('Invoice baru dibuat dari duplikasi')
  }

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id)
    setDeleteId(null)
    toast.success('Invoice dihapus dari riwayat')
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Riwayat Invoice
            </SheetTitle>
            <SheetDescription>
              Data tersimpan di perangkat Anda. Hanya dapat diakses dari browser ini.
            </SheetDescription>
          </SheetHeader>

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Belum Ada Invoice</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Invoice yang sudah Anda buat dan simpan akan muncul di sini.
              </p>
              <Link
                href="/invoice"
                className="mt-4 inline-flex h-7 shrink-0 items-center justify-center gap-1 rounded-[12px] bg-primary px-2.5 text-[0.8rem] font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80"
              >
                <FileText className="h-4 w-4" />
                Buat Invoice Pertama
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {history.length} invoice tersimpan
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs text-destructive"
                  onClick={() => setShowClearDialog(true)}
                >
                  <TrashIcon className="h-3 w-3" />
                  Hapus Semua
                </Button>
              </div>
              <Separator className="my-2" />
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-2">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className="group rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <p className="text-sm font-medium truncate">
                              {entry.invoiceNumber}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[9px] px-1.5 py-0 ${
                                STATUS_COLORS[entry.status] || ''
                              }`}
                            >
                              {entry.status === 'draft' && 'Draft'}
                              {entry.status === 'sent' && 'Terkirim'}
                              {entry.status === 'pending' && 'Pending'}
                              {entry.status === 'paid' && 'Lunas'}
                              {entry.status === 'overdue' && 'Jatuh Tempo'}
                            </Badge>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">
                            {entry.customerName}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatDate(entry.date)}</span>
                            <span className="font-semibold text-foreground">
                              {formatCurrency(entry.total)}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {entry.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-green-600"
                              onClick={() => {
                                markAsPaid(entry.id)
                                toast.success('Invoice ditandai Lunas')
                              }}
                              title="Tandai Lunas"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleLoad(entry.id)}
                            title="Buka"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDuplicate(entry.id)}
                            title="Edit Sebagai Baru"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => setDeleteId(entry.id)}
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-center text-[10px] text-muted-foreground">
                <AlertTriangle className="mr-1 inline h-3 w-3" />
                Data hanya tersimpan di browser ini. Hapus cache browser dapat menghilangkan data.
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Invoice akan dihapus dari riwayat. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Semua Riwayat?</AlertDialogTitle>
            <AlertDialogDescription>
              Seluruh riwayat invoice akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => {
                clearHistory()
                setShowClearDialog(false)
                toast.success('Semua riwayat dihapus')
              }}
            >
              Hapus Semua
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
