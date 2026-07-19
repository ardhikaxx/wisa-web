'use client'

import { useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  INVOICE_STATUS_OPTIONS,
  CURRENCY_OPTIONS,
} from '@/lib/constants'

export function InvoiceInfoForm() {
  const { data, updateData } = useInvoiceStore()
  const { invoiceInfo } = data

  const update = useCallback(
    (partial: Partial<typeof invoiceInfo>) => {
      updateData({ invoiceInfo: { ...invoiceInfo, ...partial } })
    },
    [invoiceInfo, updateData]
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="invoiceNumber">Nomor Invoice *</Label>
          <Input
            id="invoiceNumber"
            value={invoiceInfo.invoiceNumber}
            onChange={(e) => update({ invoiceNumber: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="paymentStatus">Status</Label>
          <Select
            value={invoiceInfo.paymentStatus}
            onValueChange={(v) => v && update({ paymentStatus: v as any })}
          >
            <SelectTrigger id="paymentStatus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="issueDate">Tanggal Invoice</Label>
          <Input
            id="issueDate"
            type="date"
            value={invoiceInfo.issueDate}
            onChange={(e) => update({ issueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
          <Input
            id="dueDate"
            type="date"
            value={invoiceInfo.dueDate}
            onChange={(e) => update({ dueDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="currency">Mata Uang</Label>
        <Select
          value={invoiceInfo.currency}
          onValueChange={(v) => v && update({ currency: v })}
        >
          <SelectTrigger id="currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
