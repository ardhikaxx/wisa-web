'use client'

import type { InvoiceData } from '@/types/invoice'
import {
  formatCurrency,
  formatDate,
  calculateDpAmount,
  calculateRemainingBalance,
  calculateGrandTotal,
} from '@/lib/helpers'

interface Props {
  data: InvoiceData
}

export function PaymentSummary({ data }: Props) {
  const { pricing } = data
  const grandTotal = calculateGrandTotal(data)

  if (pricing.paymentTerm === 'full') {
    return (
      <div className="mb-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ketentuan Pembayaran
        </h4>
        <p className="text-sm">Pembayaran Penuh — {formatCurrency(grandTotal)}</p>
      </div>
    )
  }

  if (pricing.paymentTerm === 'dp') {
    const dpAmount = calculateDpAmount(data)
    const remaining = calculateRemainingBalance(data)
    return (
      <div className="mb-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rincian Pembayaran
        </h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Total Tagihan</span>
            <span className="font-semibold">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="flex justify-between text-amber-600">
            <span>Uang Muka (DP)</span>
            <span className="font-semibold">{formatCurrency(dpAmount)}</span>
          </div>
          <div className="flex justify-between border-t pt-1 font-bold text-green-600">
            <span>Sisa Tagihan</span>
            <span>{formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    )
  }

  if (pricing.paymentTerm === 'milestone' && pricing.milestones.length > 0) {
    return (
      <div className="mb-6 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Jadwal Termin Pembayaran
        </h4>
        <div className="space-y-1 text-sm">
          <div className="mb-1 flex justify-between font-medium">
            <span>Total Tagihan</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          {pricing.milestones.map((m, i) => (
            <div key={m.id} className="flex justify-between text-xs">
              <span>{m.name}</span>
              <span>
                {m.percentage}% — {formatCurrency((grandTotal * m.percentage) / 100)}
                {m.dueDate ? ` (jatuh tempo ${formatDate(m.dueDate)})` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
