'use client'

import { useRef, useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PAYMENT_METHODS } from '@/lib/constants'
import { ImagePlus, X } from 'lucide-react'
import { readFileAsDataURL, validateFileSize, validateFileType } from '@/lib/helpers'
import { toast } from 'sonner'

export function PaymentInfoForm() {
  const { data, updateData } = useInvoiceStore()
  const { paymentInfo } = data
  const qrisInputRef = useRef<HTMLInputElement>(null)

  const update = useCallback(
    (partial: Partial<typeof paymentInfo>) => {
      updateData({ paymentInfo: { ...paymentInfo, ...partial } })
    },
    [paymentInfo, updateData]
  )

  const handleQrisUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!validateFileType(file)) {
        toast.error('Hanya file PNG, JPG, atau WebP yang diperbolehkan')
        return
      }
      if (!validateFileSize(file, 2)) {
        toast.error('Ukuran file maksimal 2MB')
        return
      }
      try {
        const dataUrl = await readFileAsDataURL(file)
        update({ qrisImage: dataUrl })
      } catch {
        toast.error('Gagal membaca file')
      }
    },
    [update]
  )

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
        <Select
          value={paymentInfo.paymentMethod}
          onValueChange={(v) => v && update({ paymentMethod: v })}
        >
          <SelectTrigger id="paymentMethod">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(paymentInfo.paymentMethod === 'transfer' ||
        paymentInfo.paymentMethod === 'other') && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="bankName">Nama Bank</Label>
              <Input
                id="bankName"
                placeholder="BCA, Mandiri, BRI, dll"
                value={paymentInfo.bankName}
                onChange={(e) => update({ bankName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="accountName">Atas Nama</Label>
              <Input
                id="accountName"
                placeholder="Nama pemilik rekening"
                value={paymentInfo.accountName}
                onChange={(e) => update({ accountName: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="accountNumber">Nomor Rekening</Label>
            <Input
              id="accountNumber"
              placeholder="1234567890"
              value={paymentInfo.accountNumber}
              onChange={(e) => update({ accountNumber: e.target.value })}
            />
          </div>
        </>
      )}

      {(paymentInfo.paymentMethod === 'qris' ||
        paymentInfo.paymentMethod === 'ewallet') && (
        <div>
          <Label>QRIS / Kode Pembayaran</Label>
          <div className="mt-1 flex items-center gap-4">
            {paymentInfo.qrisImage ? (
              <div className="relative">
                <img
                  src={paymentInfo.qrisImage}
                  alt="QRIS"
                  className="h-24 w-24 rounded-lg border object-contain"
                />
                <button
                  onClick={() => update({ qrisImage: null })}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => qrisInputRef.current?.click()}
                className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <ImagePlus className="h-6 w-6" />
              </div>
            )}
            <input
              ref={qrisInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleQrisUpload}
            />
            <p className="text-xs text-muted-foreground">
            Upload gambar QRIS atau kode pembayaran
            </p>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="paymentNotes">Catatan Pembayaran</Label>
        <Textarea
          id="paymentNotes"
          placeholder="Informasi tambahan tentang pembayaran"
          value={paymentInfo.paymentNotes}
          onChange={(e) => update({ paymentNotes: e.target.value })}
          rows={2}
        />
      </div>
    </div>
  )
}
