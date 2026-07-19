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
} from '@/lib/helpers'
import { STATUS_COLORS } from '@/lib/constants'
import { Badge } from '@/components/ui/badge'

interface Props {
  data: InvoiceData
}

export function TemplateProfessional({ data }: Props) {
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
      {/* Top brand bar */}
      <div className="mb-8 rounded-lg bg-primary p-5 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {businessInfo.logo && (
              <img
                src={businessInfo.logo}
                alt="Logo"
                className="h-14 w-14 rounded-lg bg-white object-contain"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">{businessInfo.businessName || 'Nama Bisnis'}</h1>
              <p className="mt-0.5 text-sm opacity-80">{businessInfo.address}</p>
              <div className="mt-1 flex gap-3 text-xs opacity-70">
                {businessInfo.phone && <span>{businessInfo.phone}</span>}
                {businessInfo.email && <span>{businessInfo.email}</span>}
                {businessInfo.website && <span>{businessInfo.website}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">INVOICE</h2>
            <p className="text-sm opacity-80">{invoiceInfo.invoiceNumber}</p>
            <Badge
              variant="secondary"
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
      </div>

      {/* Dates row */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm">
        <div>
          <span className="text-xs text-muted-foreground">Tanggal Invoice</span>
          <p className="font-medium">{formatDate(invoiceInfo.issueDate)}</p>
        </div>
        <div className="text-center">
          <span className="text-xs text-muted-foreground">Status</span>
          <p className="font-medium capitalize">{invoiceInfo.paymentStatus}</p>
        </div>
        {invoiceInfo.dueDate && (
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Jatuh Tempo</span>
            <p className="font-medium">{formatDate(invoiceInfo.dueDate)}</p>
          </div>
        )}
      </div>

      {/* Bill To */}
      <div className="mb-6 border-l-4 border-primary pl-4">
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ditagihkan Kepada
        </h3>
        <p className="text-base font-semibold">
          {customerInfo.customerName || '(Nama Pelanggan)'}
        </p>
        {customerInfo.companyName && <p className="text-sm text-muted-foreground">{customerInfo.companyName}</p>}
        {customerInfo.customerAddress && <p className="text-sm text-muted-foreground">{customerInfo.customerAddress}</p>}
        {(customerInfo.customerEmail || customerInfo.customerPhone) && (
          <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
            {customerInfo.customerEmail && <span>{customerInfo.customerEmail}</span>}
            {customerInfo.customerPhone && <span>{customerInfo.customerPhone}</span>}
          </div>
        )}
      </div>

      {/* Items Table */}
      <table className="mb-6 w-full text-left text-sm">
        <thead>
          <tr className="bg-primary/5 text-xs uppercase tracking-wider text-muted-foreground">
            <th className="p-3 font-medium">#</th>
            <th className="p-3 font-medium">Jasa</th>
            <th className="p-3 text-right font-medium">Qty</th>
            <th className="p-3 text-right font-medium">Harga</th>
            <th className="p-3 text-right font-medium">Diskon</th>
            <th className="p-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                Belum ada jasa
              </td>
            </tr>
          ) : (
            items.map((item, i) => (
              <tr key={item.id} className="border-b">
                <td className="p-3 text-muted-foreground">{i + 1}</td>
                <td className="p-3">
                  <p className="font-medium">{item.name || '(nama jasa)'}</p>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                </td>
                <td className="p-3 text-right">{item.quantity} {item.unit}</td>
                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                <td className="p-3 text-right text-destructive">
                  {item.discountValue > 0
                    ? item.discountType === 'percentage'
                      ? `${item.discountValue}%`
                      : formatCurrency(item.discountValue)
                    : '-'}
                </td>
                <td className="p-3 text-right font-semibold">
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
      <div className="mb-6 ml-auto w-64 rounded-lg bg-muted/30 p-4 text-sm">
        <div className="space-y-1">
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
          {pricing.taxEnabled && tax > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak</span>
              <span>{formatCurrency(tax)}</span>
            </div>
          )}
          {additionalFeesTotal > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Biaya Lain</span>
              <span>{formatCurrency(additionalFeesTotal)}</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between border-t pt-2 text-base font-bold text-primary">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Payment & Notes row */}
      <div className="grid gap-6 sm:grid-cols-2">
        {paymentInfo.paymentMethod && (
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pembayaran
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium capitalize">{paymentInfo.paymentMethod}</p>
              {paymentInfo.bankName && <p>{paymentInfo.bankName}</p>}
              {paymentInfo.accountNumber && <p>No. Rek: {paymentInfo.accountNumber}</p>}
              {paymentInfo.accountName && <p>a.n. {paymentInfo.accountName}</p>}
            </div>
            {paymentInfo.qrisImage && (
              <img src={paymentInfo.qrisImage} alt="QRIS" className="mt-2 h-20 w-20 border object-contain" />
            )}
          </div>
        )}
        <div>
          {notes.invoiceNotes && (
            <div className="mb-3">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Catatan
              </h3>
              <p className="text-sm whitespace-pre-line">{notes.invoiceNotes}</p>
            </div>
          )}
          {notes.terms && (
            <div>
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ketentuan
              </h3>
              <p className="text-sm whitespace-pre-line text-muted-foreground">{notes.terms}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
        <p>{businessInfo.businessName} &bull; {businessInfo.phone} &bull; {businessInfo.email}</p>
        {businessInfo.additionalInfo && <p>{businessInfo.additionalInfo}</p>}
      </div>
    </div>
  )
}
