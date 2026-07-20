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
import { STATUS_COLORS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'
import { PaymentSummary } from '@/components/invoice/payment-summary'

interface Props {
  data: InvoiceData
}

export function TemplateModern({ data }: Props) {
  const { businessInfo, invoiceInfo, customerInfo, items, pricing, paymentInfo, notes } = data
  const subtotal = calculateSubtotal(items)
  const itemsTotal = calculateItemsTotal(items)
  const globalDiscount = calculateGlobalDiscount(subtotal, pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, pricing)
  const additionalFeesTotal = calculateAdditionalFeesTotal(pricing)
  const grandTotal = calculateGrandTotal(data)

  return (
    <div className="p-8 sm:p-10">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {businessInfo.logo && (
            <img
              src={businessInfo.logo}
              alt="Logo"
              className="h-14 w-14 rounded-lg border object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {businessInfo.businessName || 'Nama Bisnis'}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {businessInfo.address}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
              {businessInfo.phone && <span>{businessInfo.phone}</span>}
              {businessInfo.email && <span>{businessInfo.email}</span>}
              {businessInfo.website && <span>{businessInfo.website}</span>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold text-primary">INVOICE</h2>
          <p className="mt-1 text-sm font-medium">{invoiceInfo.invoiceNumber}</p>
          <Badge
            variant="outline"
            className={`mt-1.5 text-[10px] ${STATUS_COLORS[invoiceInfo.paymentStatus] || ''}`}
          >
            {invoiceInfo.paymentStatus === 'draft' && 'Draft'}
            {invoiceInfo.paymentStatus === 'sent' && 'Terkirim'}
            {invoiceInfo.paymentStatus === 'pending' && 'Pending'}
            {invoiceInfo.paymentStatus === 'paid' && 'Lunas'}
            {invoiceInfo.paymentStatus === 'overdue' && 'Jatuh Tempo'}
          </Badge>
        </div>
      </div>

      {/* Dates */}
      <div className="mb-6 flex gap-8 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Tanggal Invoice</span>
          <p className="font-medium">{formatDate(invoiceInfo.issueDate)}</p>
        </div>
        {invoiceInfo.dueDate && (
          <div>
            <span className="text-xs text-muted-foreground">Jatuh Tempo</span>
            <p className="font-medium">{formatDate(invoiceInfo.dueDate)}</p>
          </div>
        )}
      </div>

      {/* Bill To */}
      <div className="mb-6 rounded-lg bg-muted/30 p-4">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ditagihkan Kepada
        </h3>
        <p className="text-base font-semibold">
          {customerInfo.customerName || '(Nama Pelanggan)'}
        </p>
        {customerInfo.companyName && (
          <p className="text-sm text-muted-foreground">{customerInfo.companyName}</p>
        )}
        {customerInfo.customerAddress && (
          <p className="text-sm text-muted-foreground">{customerInfo.customerAddress}</p>
        )}
        <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
          {customerInfo.customerEmail && <span>{customerInfo.customerEmail}</span>}
          {customerInfo.customerPhone && <span>{customerInfo.customerPhone}</span>}
        </div>
      </div>

      {/* Items Table */}
      <table className="mb-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-primary/20 text-xs uppercase tracking-wider text-muted-foreground">
            <th className="pb-2 font-medium">#</th>
            <th className="pb-2 font-medium">Jasa</th>
            <th className="pb-2 text-right font-medium">Qty</th>
            <th className="pb-2 text-right font-medium">Harga</th>
            <th className="pb-2 text-right font-medium">Diskon</th>
            <th className="pb-2 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                Belum ada jasa yang ditambahkan
              </td>
            </tr>
          ) : (
            items.map((item, i) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="py-3 text-muted-foreground">{i + 1}</td>
                <td className="py-3">
                  <p className="font-medium">{item.name || '(nama jasa)'}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </td>
                <td className="py-3 text-right">
                  {item.quantity} {item.unit}
                </td>
                <td className="py-3 text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-3 text-right text-destructive">
                  {item.discountValue > 0
                    ? item.discountType === 'percentage'
                      ? `${item.discountValue}%`
                      : formatCurrency(item.discountValue)
                    : '-'}
                </td>
                <td className="py-3 text-right font-semibold">
                  {formatCurrency(
                    item.quantity * item.price -
                      (item.discountType === 'percentage'
                        ? (item.quantity * item.price * item.discountValue) / 100
                        : item.discountValue)
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-6 ml-auto w-64 space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(itemsTotal)}</span>
        </div>
        {globalDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diskon</span>
            <span className="text-destructive">-{formatCurrency(globalDiscount)}</span>
          </div>
        )}
        {calculateTaxBreakdown(afterDiscount, pricing).map(t => (
          <div key={t.name} className="flex justify-between">
            <span className="text-muted-foreground">{t.name}</span>
            <span>{formatCurrency(t.amount)}</span>
          </div>
        ))}
        {pricing.taxIncluded && (
          <p className="text-[10px] italic text-muted-foreground">*sudah termasuk pajak</p>
        )}
        {additionalFeesTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Biaya Lain</span>
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

      {/* Payment Term Summary */}
      <PaymentSummary data={data} />

      {/* Payment Info */}
      {paymentInfo.paymentMethod && (
        <div className="mb-6 rounded-lg border p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Informasi Pembayaran
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-xs text-muted-foreground">Metode</span>
              <p className="font-medium capitalize">{paymentInfo.paymentMethod}</p>
            </div>
            {paymentInfo.bankName && (
              <div>
                <span className="text-xs text-muted-foreground">Bank</span>
                <p className="font-medium">{paymentInfo.bankName}</p>
              </div>
            )}
            {paymentInfo.accountName && (
              <div>
                <span className="text-xs text-muted-foreground">Atas Nama</span>
                <p className="font-medium">{paymentInfo.accountName}</p>
              </div>
            )}
            {paymentInfo.accountNumber && (
              <div>
                <span className="text-xs text-muted-foreground">No. Rekening</span>
                <p className="font-medium">{paymentInfo.accountNumber}</p>
              </div>
            )}
          </div>
          {paymentInfo.qrisImage && (
            <img
              src={paymentInfo.qrisImage}
              alt="QRIS"
              className="mt-2 h-24 w-24 rounded-lg border object-contain"
            />
          )}
        </div>
      )}

      {/* Notes & Terms */}
      {notes.invoiceNotes && (
        <div className="mb-4">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Catatan
          </h3>
          <p className="text-sm whitespace-pre-line">{notes.invoiceNotes}</p>
        </div>
      )}
      {notes.terms && (
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Syarat & Ketentuan
          </h3>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {notes.terms}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
        <p>
          {businessInfo.businessName || 'Nama Bisnis'} &bull; {businessInfo.phone || 'Telepon'}{' '}
          &bull; {businessInfo.email || 'Email'}
        </p>
        {businessInfo.additionalInfo && <p>{businessInfo.additionalInfo}</p>}
      </div>
    </div>
  )
}
