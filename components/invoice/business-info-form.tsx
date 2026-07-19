'use client'

import { useRef, useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImagePlus, X } from 'lucide-react'
import { readFileAsDataURL, validateFileSize, validateFileType } from '@/lib/helpers'
import { toast } from 'sonner'

export function BusinessInfoForm() {
  const { data, updateData } = useInvoiceStore()
  const { businessInfo } = data
  const logoInputRef = useRef<HTMLInputElement>(null)

  const update = useCallback(
    (partial: Partial<typeof businessInfo>) => {
      updateData({ businessInfo: { ...businessInfo, ...partial } })
    },
    [businessInfo, updateData]
  )

  const handleLogoUpload = useCallback(
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
        update({ logo: dataUrl })
      } catch {
        toast.error('Gagal membaca file')
      }
    },
    [update]
  )

  const removeLogo = useCallback(() => {
    update({ logo: null })
    if (logoInputRef.current) logoInputRef.current.value = ''
  }, [update])

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-2">
          {businessInfo.logo ? (
            <div className="relative">
              <img
                src={businessInfo.logo}
                alt="Logo"
                className="h-16 w-16 rounded-lg border object-contain"
              />
              <button
                onClick={removeLogo}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-destructive-foreground shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <span className="text-[10px] text-muted-foreground">Logo</span>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <Label htmlFor="businessName">Nama Bisnis *</Label>
            <Input
              id="businessName"
              placeholder="Contoh: CV Kreatif Studio"
              value={businessInfo.businessName}
              onChange={(e) => update({ businessName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="businessPhone">Nomor Telepon</Label>
            <Input
              id="businessPhone"
              placeholder="0812-3456-7890"
              value={businessInfo.phone}
              onChange={(e) => update({ phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="businessEmail">Email</Label>
            <Input
              id="businessEmail"
              type="email"
              placeholder="info@bisnisanda.com"
              value={businessInfo.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="businessAddress">Alamat</Label>
        <Textarea
          id="businessAddress"
          placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi"
          value={businessInfo.address}
          onChange={(e) => update({ address: e.target.value })}
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="businessWebsite">Website / Portfolio</Label>
          <Input
            id="businessWebsite"
            placeholder="www.contoh.com"
            value={businessInfo.website}
            onChange={(e) => update({ website: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="businessAddInfo">Info Tambahan</Label>
          <Input
            id="businessAddInfo"
            placeholder="NPWP, SK, dll"
            value={businessInfo.additionalInfo}
            onChange={(e) => update({ additionalInfo: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
