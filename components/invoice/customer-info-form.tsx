'use client'

import { useState, useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ContactManager } from './contact-manager'
import { BookUser } from 'lucide-react'
import type { CustomerContact } from '@/types/invoice'

export function CustomerInfoForm() {
  const { data, updateData } = useInvoiceStore()
  const { customerInfo } = data
  const [showContacts, setShowContacts] = useState(false)

  const update = useCallback(
    (partial: Partial<typeof customerInfo>) => {
      updateData({ customerInfo: { ...customerInfo, ...partial } })
    },
    [customerInfo, updateData]
  )

  const handleSelectContact = useCallback((contact: CustomerContact) => {
    updateData({
      customerInfo: {
        ...customerInfo,
        contactId: contact.id,
        customerName: contact.name,
        companyName: contact.company,
        customerAddress: contact.address,
        customerEmail: contact.email,
        customerPhone: contact.phone,
      },
    })
  }, [customerInfo, updateData])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Data Pelanggan</span>
        <Button variant="outline" size="sm" className="h-7 gap-1 text-xs" onClick={() => setShowContacts(true)}>
          <BookUser className="h-3.5 w-3.5" />
          Pilih Kontak
        </Button>
      </div>
      <ContactManager open={showContacts} onOpenChange={setShowContacts} onSelect={handleSelectContact} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="customerName">Nama Pelanggan *</Label>
          <Input
            id="customerName"
            placeholder="Contoh: Budi Santoso"
            value={customerInfo.customerName}
            onChange={(e) => update({ customerName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="companyName">Nama Perusahaan</Label>
          <Input
            id="companyName"
            placeholder="PT. Maju Jaya (opsional)"
            value={customerInfo.companyName}
            onChange={(e) => update({ companyName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="customerAddress">Alamat</Label>
        <Textarea
          id="customerAddress"
          placeholder="Alamat lengkap pelanggan"
          value={customerInfo.customerAddress}
          onChange={(e) => update({ customerAddress: e.target.value })}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder="pelanggan@email.com"
            value={customerInfo.customerEmail}
            onChange={(e) => update({ customerEmail: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="customerPhone">Telepon</Label>
          <Input
            id="customerPhone"
            placeholder="0812-3456-7890"
            value={customerInfo.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="customerNotes">Catatan Tambahan</Label>
        <Textarea
          id="customerNotes"
          placeholder="Catatan khusus untuk pelanggan"
          value={customerInfo.additionalNotes}
          onChange={(e) => update({ additionalNotes: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  )
}
