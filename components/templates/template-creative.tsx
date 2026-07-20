'use client'

import type { InvoiceData } from '@/types/invoice'
import {
  formatCurrency,
  formatDate,
  calculateItemsTotal,
  calculateGlobalDiscount,
  calculateTaxableAmount,
  calculateAdditionalFeesTotal,
  calculateGrandTotal,
  calculateSubtotal,
  numberToWords,
  calculateTaxBreakdown,
} from '@/lib/helpers'
import { PaymentSummary } from '@/components/invoice/payment-summary'

interface Props {
  data: InvoiceData
}

export function TemplateCreative({ data }: Props) {
  const { businessInfo, invoiceInfo, customerInfo, items, pricing, paymentInfo, notes } = data
  const subtotal = calculateSubtotal(items)
  const itemsTotal = calculateItemsTotal(items)
  const globalDiscount = calculateGlobalDiscount(subtotal, pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, pricing)
  const additionalFeesTotal = calculateAdditionalFeesTotal(pricing)
  const grandTotal = calculateGrandTotal(data)

  return (
    <div className="flex min-h-full flex-col sm:flex-row">
      {/* Left sidebar - creative accent */}
      <div className="bg-gradient-to-b from-primary to-primary/80 p-6 text-primary-foreground sm:w-56 sm:p-8">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          {businessInfo.logo && (
            <img
              src={businessInfo.logo}
              alt="Logo"
              className="mb-4 h-16 w-16 rounded-full border-2 border-white/30 bg-white object-contain"
            />
          )}
          <h1 className="text-lg font-bold">
            {businessInfo.businessName || 'Nama Bisnis'}
          </h1>
          <div className="mt-3 space-y-1 text-xs opacity-80">
            {businessInfo.address && <p>{businessInfo.address}</p>}
            {businessInfo.phone && <p>{businessInfo.phone}</p>}
            {businessInfo.email && <p>{businessInfo.email}</p>}
            {businessInfo.website && <p>{businessInfo.website}</p>}
          </div>
          {businessInfo.additionalInfo && (
            <p className="mt-3 text-[10px] opacity-60">{businessInfo.additionalInfo}</p>
          )}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 p-6 sm:p-8">
        {/* Invoice header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">Invoice</h2>
            <p className="mt-0.5 font-mono text-lg font-bold text-foreground">
              {invoiceInfo.invoiceNumber}
            </p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{formatDate(invoiceInfo.issueDate)}</p>
            {invoiceInfo.dueDate && <p>Jatuh tempo: {formatDate(invoiceInfo.dueDate)}</p>}
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                invoiceInfo.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : invoiceInfo.paymentStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : invoiceInfo.paymentStatus === 'overdue'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {invoiceInfo.paymentStatus === 'draft' && 'Draft'}
              {invoiceInfo.paymentStatus === 'sent' && 'Terkirim'}
              {invoiceInfo.paymentStatus === 'pending' && 'Pending'}
              {invoiceInfo.paymentStatus === 'paid' && 'Lunas'}
              {invoiceInfo.paymentStatus === 'overdue' && 'Jatuh Tempo'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-0.5 rounded-full bg-gradient-to-r from-primary to-primary/20" />

        {/* Customer */}
        <div className="mb-6">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Ditagihkan Kepada
          </p>
          <p className="text-base font-bold">{customerInfo.customerName || '(Nama Pelanggan)'}</p>
          {customerInfo.companyName && <p className="text-sm text-muted-foreground">{customerInfo.companyName}</p>}
          {customerInfo.customerAddress && <p className="text-sm text-muted-foreground">{customerInfo.customerAddress}</p>}
        </div>

        {/* Items */}
        <table className="mb-6 w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <th className="pb-2 text-left font-medium">Jasa</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Harga</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  Belum ada jasa
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0"
                  style={{ borderColor: i % 2 === 0 ? 'hsl(var(--border))' : 'transparent' }}
                >
                  <td className="py-3">
                    <p className="font-medium text-foreground">{item.name || '(nama jasa)'}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    )}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-3 text-right font-semibold text-foreground">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mb-6 ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(itemsTotal)}</span>
          </div>
          {globalDiscount > 0 && (
            <div className="flex justify-between text-destructive">
              <span>Diskon</span>
              <span>-{formatCurrency(globalDiscount)}</span>
            </div>
          )}
          {calculateTaxBreakdown(afterDiscount, pricing).map(t => (
            <div key={t.name} className="flex justify-between text-muted-foreground">
              <span>{t.name}</span>
              <span>{formatCurrency(t.amount)}</span>
            </div>
          ))}
          {pricing.taxIncluded && (
            <p className="text-[10px] italic text-muted-foreground">*sudah termasuk pajak</p>
          )}
          {additionalFeesTotal > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>Biaya Lain</span>
              <span>{formatCurrency(additionalFeesTotal)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-primary pt-2 text-base font-bold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(grandTotal)}</span>
          </div>
          {grandTotal > 0 && (
            <p className="mt-1 text-[10px] italic text-muted-foreground">
              Terbilang: {numberToWords(grandTotal)}
            </p>
          )}
        </div>

        <PaymentSummary data={data} />

        {/* Payment */}
        {paymentInfo.paymentMethod && (
          <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
              Pembayaran
            </p>
            <div className="grid gap-1 text-sm">
              <p className="font-medium capitalize">{paymentInfo.paymentMethod}</p>
              {paymentInfo.bankName && <p>{paymentInfo.bankName} - {paymentInfo.accountNumber}</p>}
              {paymentInfo.accountName && <p className="text-xs text-muted-foreground">a.n. {paymentInfo.accountName}</p>}
            </div>
            {paymentInfo.qrisImage && (
              <img src={paymentInfo.qrisImage} alt="QRIS" className="mt-2 h-20 w-20 border object-contain" />
            )}
          </div>
        )}

        {/* Notes */}
        {notes.invoiceNotes && (
          <div className="mb-3 text-sm">
            <p className="whitespace-pre-line italic text-muted-foreground">
              "{notes.invoiceNotes}"
            </p>
          </div>
        )}
        {notes.terms && (
          <div className="text-xs text-muted-foreground">
            <p className="whitespace-pre-line">{notes.terms}</p>
          </div>
        )}
      </div>
    </div>
  )
}
