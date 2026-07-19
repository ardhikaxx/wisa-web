'use client'

import { useState, useEffect } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Navbar } from '@/components/invoice/navbar'
import { OnboardingDialog } from '@/components/invoice/onboarding-dialog'
import { InvoiceEditor } from '@/components/invoice/invoice-editor'
import { InvoicePreview } from '@/components/invoice/invoice-preview'
import { InvoiceActions } from '@/components/invoice/invoice-actions'
import { InvoiceHistory } from '@/components/invoice/invoice-history'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileText, Eye, History, Cloud } from 'lucide-react'

export default function InvoicePage() {
  const { activeTab, setActiveTab, savedAt } = useInvoiceStore()
  const [showHistory, setShowHistory] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => { setHydrated(true) }, [])

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <OnboardingDialog />

      <div className="no-print flex items-center justify-between border-b bg-white px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('edit')}
            className="gap-1.5 lg:hidden"
          >
            <FileText className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('preview')}
            className="gap-1.5 lg:hidden"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Separator orientation="vertical" className="mx-2 hidden h-6 lg:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="hidden gap-1.5 lg:flex"
          >
            <History className="h-4 w-4" />
            Riwayat
          </Button>
          <div className="hidden items-center gap-1.5 text-[10px] text-muted-foreground lg:flex">
            <Cloud className="h-3 w-3" />
            {savedAt ? `Tersimpan ${new Date(savedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Belum disimpan'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InvoiceActions />
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div
          className={`border-r lg:w-1/2 xl:w-[45%] ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
              <InvoiceEditor />
            </div>
          </div>
        </div>
        <div
          className={`bg-muted/30 lg:w-1/2 xl:w-[55%] ${
            activeTab === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex h-full flex-col items-center justify-start overflow-y-auto p-4 sm:p-6">
            <InvoicePreview />
          </div>
        </div>
      </div>

      <InvoiceHistory open={showHistory} onOpenChange={setShowHistory} />
    </>
  )
}
