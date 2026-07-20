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
  calculateDpAmount,
  calculateRemainingBalance,
  formatCurrency,
  calculateTaxBreakdown,
} from '@/lib/helpers'
import type { AdditionalFee, PaymentMilestone, TaxEntry } from '@/types/invoice'

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

  const addTax = useCallback(() => {
    const tax: TaxEntry = {
      id: Date.now().toString(),
      name: 'PPN',
      type: 'percentage',
      value: 11,
    }
    updatePricing({ taxes: [...(pricing.taxes || []), tax] })
  }, [pricing, updateData])

  const updateTax = useCallback(
    (id: string, partial: Partial<TaxEntry>) => {
      const list = (pricing.taxes || []).map((t) =>
        t.id === id ? { ...t, ...partial } : t
      )
      updatePricing({ taxes: list })
    },
    [pricing, updateData]
  )

  const removeTax = useCallback(
    (id: string) => {
      const list = (pricing.taxes || []).filter((t) => t.id !== id)
      updatePricing({ taxes: list })
    },
    [pricing, updateData]
  )

  const addMilestone = useCallback(() => {
    const next = ((pricing.milestones || []).length + 1)
    const milestone: PaymentMilestone = {
      id: Date.now().toString(),
      name: `Termin ${next}`,
      percentage: next === 1 ? 100 : 0,
      dueDate: new Date().toISOString().slice(0, 10),
    }
    updatePricing({ milestones: [...(pricing.milestones || []), milestone] })
  }, [pricing, updateData])

  const updateMilestone = useCallback(
    (id: string, partial: Partial<PaymentMilestone>) => {
      const list = (pricing.milestones || []).map((m) =>
        m.id === id ? { ...m, ...partial } : m
      )
      updatePricing({ milestones: list })
    },
    [pricing, updateData]
  )

  const removeMilestone = useCallback(
    (id: string) => {
      const list = (pricing.milestones || []).filter((m) => m.id !== id)
      updatePricing({ milestones: list })
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
          <span className="text-sm font-medium">Pajak (PPN, PPh, dll)</span>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={addTax}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="space-y-2">
          {(pricing.taxes || []).length === 0 && (
            <p className="text-xs text-muted-foreground">Belum ada pajak</p>
          )}
          {(pricing.taxes || []).map((tax) => (
            <div key={tax.id} className="flex items-center gap-2">
              <Input
                placeholder="Nama pajak"
                className="flex-[1.5]"
                value={tax.name}
                onChange={(e) => updateTax(tax.id, { name: e.target.value })}
              />
              <div className="w-16">
                <Select
                  value={tax.type}
                  onValueChange={(v) => v && updateTax(tax.id, { type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">%</SelectItem>
                    <SelectItem value="fixed">Rp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                min={0}
                placeholder="0"
                className="w-20"
                value={tax.value || ''}
                onChange={(e) =>
                  updateTax(tax.id, { value: Math.max(0, Number(e.target.value)) })
                }
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-destructive"
                onClick={() => removeTax(tax.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-xs text-muted-foreground">Harga sudah termasuk pajak</span>
            <Switch
              checked={pricing.taxIncluded}
              onCheckedChange={(v) => updatePricing({ taxIncluded: v })}
            />
          </div>
          {pricing.taxIncluded && (
            <p className="text-[10px] text-muted-foreground">
              Pajak dihitung dari dalam total harga (PPN termasuk)
            </p>
          )}
        </div>
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

      <div className="rounded-lg border p-3">
        <span className="mb-2 block text-sm font-medium">Ketentuan Pembayaran</span>
        <Select
          value={pricing.paymentTerm}
          onValueChange={(v) => v && updatePricing({ paymentTerm: v as any, dpEnabled: v === 'dp', milestones: v === 'milestone' ? pricing.milestones : [] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Pembayaran Penuh</SelectItem>
            <SelectItem value="dp">Uang Muka (DP)</SelectItem>
            <SelectItem value="milestone">Termin / Cicilan</SelectItem>
          </SelectContent>
        </Select>

        {pricing.paymentTerm === 'dp' && (
          <div className="mt-3 space-y-2">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label className="text-[10px] text-muted-foreground">Nilai DP</Label>
                <Input
                  type="number"
                  min={0}
                  max={pricing.dpType === 'percentage' ? 100 : undefined}
                  value={pricing.dpValue || ''}
                  onChange={(e) =>
                    updatePricing({ dpValue: Math.max(0, Number(e.target.value)) })
                  }
                />
              </div>
              <div className="w-20">
                <Label className="text-[10px] text-muted-foreground">Tipe</Label>
                <Select
                  value={pricing.dpType}
                  onValueChange={(v) => v && updatePricing({ dpType: v as any })}
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
            {pricing.dpValue > 0 && (
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>DP: {formatCurrency(calculateDpAmount(data))}</p>
                <p>Sisa: {formatCurrency(calculateRemainingBalance(data))}</p>
              </div>
            )}
          </div>
        )}

        {pricing.paymentTerm === 'milestone' && (
          <div className="mt-3 space-y-2">
            {(pricing.milestones || []).length === 0 && (
              <p className="text-xs text-muted-foreground">Belum ada termin</p>
            )}
            {(pricing.milestones || []).map((m, i) => (
              <div key={m.id} className="rounded-md border p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{m.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-destructive"
                    onClick={() => removeMilestone(m.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Termin ${i + 1}`}
                      className="h-7 text-xs"
                      value={m.name}
                      onChange={(e) => updateMilestone(m.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="w-16">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="%"
                      className="h-7 text-xs"
                      value={m.percentage || ''}
                      onChange={(e) =>
                        updateMilestone(m.id, { percentage: Math.max(0, Math.min(100, Number(e.target.value))) })
                      }
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">%</span>
                  <Input
                    type="date"
                    className="h-7 w-32 text-xs"
                    value={m.dueDate}
                    onChange={(e) => updateMilestone(m.id, { dueDate: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={addMilestone}>
              <Plus className="mr-1 h-3 w-3" />
              Tambah Termin
            </Button>
          </div>
        )}
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
        {calculateTaxBreakdown(afterDiscount, pricing).map(t => (
          <div key={t.name} className="flex justify-between">
            <span className="text-muted-foreground">{t.name}</span>
            <span>{formatCurrency(t.amount)}</span>
          </div>
        ))}
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
