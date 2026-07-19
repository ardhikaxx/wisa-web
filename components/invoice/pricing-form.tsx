'use client'

import { useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2 } from 'lucide-react'
import {
  calculateSubtotal,
  calculateItemsTotal,
  calculateGlobalDiscount,
  calculateTaxableAmount,
  calculateAdditionalFeesTotal,
  calculateGrandTotal,
  formatCurrency,
} from '@/lib/helpers'
import type { AdditionalFee } from '@/types/invoice'

export function PricingForm() {
  const { data, updateData } = useInvoiceStore()
  const { pricing, items } = data

  const updatePricing = useCallback(
    (partial: Partial<typeof pricing>) => {
      updateData({ pricing: { ...pricing, ...partial } })
    },
    [pricing, updateData]
  )

  const addFee = useCallback(() => {
    const fee: AdditionalFee = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
    }
    updatePricing({ additionalFees: [...(pricing.additionalFees || []), fee] })
  }, [pricing, updateData])

  const updateFee = useCallback(
    (id: string, partial: Partial<AdditionalFee>) => {
      const fees = (pricing.additionalFees || []).map((f) =>
        f.id === id ? { ...f, ...partial } : f
      )
      updatePricing({ additionalFees: fees })
    },
    [pricing, updateData]
  )

  const removeFee = useCallback(
    (id: string) => {
      const fees = (pricing.additionalFees || []).filter((f) => f.id !== id)
      updatePricing({ additionalFees: fees })
    },
    [pricing, updateData]
  )

  const subtotal = calculateSubtotal(items)
  const itemsTotal = calculateItemsTotal(items)
  const globalDiscount = calculateGlobalDiscount(subtotal, pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, pricing)
  const additionalFeesTotal = calculateAdditionalFeesTotal(pricing)
  const grandTotal = calculateGrandTotal(data)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Diskon Global</span>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground">Nilai</Label>
            <Input
              type="number"
              min={0}
              value={pricing.discountValue || ''}
              onChange={(e) =>
                updatePricing({ discountValue: Math.max(0, Number(e.target.value)) })
              }
            />
          </div>
          <div className="w-20">
            <Label className="text-[10px] text-muted-foreground">Tipe</Label>
            <Select
              value={pricing.discountType}
               onValueChange={(v) => v && updatePricing({ discountType: v as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Persen</SelectItem>
                <SelectItem value="fixed">Nominal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {pricing.discountValue > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Diskon: {formatCurrency(globalDiscount)}
          </p>
        )}
      </div>

      <div className="rounded-lg border p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Pajak</span>
          <Switch
            checked={pricing.taxEnabled}
            onCheckedChange={(v) => updatePricing({ taxEnabled: v })}
          />
        </div>
        {pricing.taxEnabled && (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-[10px] text-muted-foreground">Nilai</Label>
              <Input
                type="number"
                min={0}
                value={pricing.taxValue || ''}
                onChange={(e) =>
                  updatePricing({ taxValue: Math.max(0, Number(e.target.value)) })
                }
              />
            </div>
            <div className="w-20">
              <Label className="text-[10px] text-muted-foreground">Tipe</Label>
              <Select
                value={pricing.taxType}
                onValueChange={(v) => v && updatePricing({ taxType: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Persen</SelectItem>
                  <SelectItem value="fixed">Nominal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">Biaya Tambahan</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addFee}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="space-y-2">
          {(pricing.additionalFees || []).map((fee) => (
            <div key={fee.id} className="flex items-center gap-2">
              <Input
                placeholder="Nama biaya"
                className="flex-1"
                value={fee.name}
                onChange={(e) => updateFee(fee.id, { name: e.target.value })}
              />
              <Input
                type="number"
                min={0}
                placeholder="0"
                className="w-24"
                value={fee.amount || ''}
                onChange={(e) =>
                  updateFee(fee.id, { amount: Math.max(0, Number(e.target.value)) })
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive"
                onClick={() => removeFee(fee.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(itemsTotal)}</span>
        </div>
        {globalDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diskon Global</span>
            <span className="text-destructive">-{formatCurrency(globalDiscount)}</span>
          </div>
        )}
        {pricing.taxEnabled && tax > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Pajak ({pricing.taxType === 'percentage' ? `${pricing.taxValue}%` : 'Rp'})
            </span>
            <span>{formatCurrency(tax)}</span>
          </div>
        )}
        {additionalFeesTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Biaya Tambahan</span>
            <span>{formatCurrency(additionalFeesTotal)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-base font-bold">
          <span>Total Akhir</span>
          <span className="text-primary">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}
