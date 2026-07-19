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
} from '@/lib/helpers'
import { PaymentSummary } from '@/components/invoice/payment-summary'

interface Props {
  data: InvoiceData
}

export function TemplateMinimal({ data }: Props) {
  const { businessInfo, invoiceInfo, customerInfo, items, pricing, paymentInfo, notes } = data
  const subtotal = calculateSubtotal(items)
  const itemsTotal = calculateItemsTotal(items)
  const globalDiscount = calculateGlobalDiscount(subtotal, pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, pricing)
  const additionalFeesTotal = calculateAdditionalFeesTotal(pricing)
  const grandTotal = calculateGrandTotal(data)

  return (
    <div className="p-8 sm:p-12">
      {/* Minimal Header */}
      <div className="mb-10 border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            {businessInfo.logo && (
              <img src={businessInfo.logo} alt="Logo" className="mb-3 h-12 w-12 object-contain" />
            )}
            <h1 className="text-xl font-light tracking-tight text-gray-900">
              {businessInfo.businessName || 'Nama Bisnis'}
            </h1>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
              Invoice
            </h2>
            <p className="mt-1 font-mono text-sm text-gray-600">{invoiceInfo.invoiceNumber}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between text-xs text-gray-500">
          <div className="space-y-0.5">
            {businessInfo.address && <p>{businessInfo.address}</p>}
            <p>{businessInfo.phone} {businessInfo.email && `| ${businessInfo.email}`}</p>
          </div>
          <div className="space-y-0.5 text-right">
            <p>{formatDate(invoiceInfo.issueDate)}</p>
            {invoiceInfo.dueDate && <p>Jatuh tempo: {formatDate(invoiceInfo.dueDate)}</p>}
          </div>
        </div>
      </div>

      {/* Bill To - minimal */}
      <div className="mb-8">
        <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-gray-400">Kepada</p>
        <p className="text-base font-medium text-gray-900">
          {customerInfo.customerName || '(Nama Pelanggan)'}
        </p>
        {customerInfo.companyName && <p className="text-sm text-gray-500">{customerInfo.companyName}</p>}
        {customerInfo.customerAddress && <p className="text-sm text-gray-500">{customerInfo.customerAddress}</p>}
      </div>

      {/* Items - minimal table */}
      <table className="mb-6 w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-[10px] uppercase tracking-[0.1em] text-gray-400">
            <th className="pb-2 text-left font-normal">Deskripsi</th>
            <th className="pb-2 text-right font-normal">Qty</th>
            <th className="pb-2 text-right font-normal">Harga</th>
            <th className="pb-2 text-right font-normal">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                Belum ada jasa
              </td>
            </tr>
          ) : (
            items.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3">
                  <p className="text-gray-900">{item.name || '(nama jasa)'}</p>
                  {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                </td>
                <td className="py-3 text-right text-gray-600">
                  {item.quantity} {item.unit}
                </td>
                <td className="py-3 text-right text-gray-600">
                  {formatCurrency(item.price)}
                </td>
                <td className="py-3 text-right font-medium text-gray-900">
                  {formatCurrency(item.quantity * item.price)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals - minimal */}
      <div className="mb-8 ml-auto w-56 space-y-1 border-t border-gray-200 pt-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal</span>
          <span>{formatCurrency(itemsTotal)}</span>
        </div>
        {globalDiscount > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>Diskon</span>
            <span>-{formatCurrency(globalDiscount)}</span>
          </div>
        )}
        {pricing.taxEnabled && tax > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>Pajak</span>
            <span>{formatCurrency(tax)}</span>
          </div>
        )}
        {additionalFeesTotal > 0 && (
          <div className="flex justify-between text-gray-500">
            <span>Biaya Lain</span>
            <span>{formatCurrency(additionalFeesTotal)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
        {grandTotal > 0 && (
          <p className="mt-1 text-[10px] italic text-gray-400">
            Terbilang: {numberToWords(grandTotal)}
          </p>
        )}
      </div>

      <PaymentSummary data={data} />

      {/* Payment - minimal */}
      {paymentInfo.paymentMethod && (
        <div className="mb-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
          <p className="mb-1 font-medium text-gray-700">Pembayaran</p>
          <p className="capitalize">{paymentInfo.paymentMethod}</p>
          {paymentInfo.bankName && <p>{paymentInfo.bankName} - {paymentInfo.accountNumber}</p>}
          {paymentInfo.qrisImage && (
            <img src={paymentInfo.qrisImage} alt="QRIS" className="mt-2 h-20 w-20 border object-contain" />
          )}
        </div>
      )}

      {/* Notes */}
      {notes.invoiceNotes && (
        <div className="mb-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
          <p className="whitespace-pre-line">{notes.invoiceNotes}</p>
        </div>
      )}
      {notes.terms && (
        <div className="mb-4 text-xs text-gray-400">
          <p className="whitespace-pre-line">{notes.terms}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-gray-100 pt-4 text-center text-[10px] text-gray-400">
        {businessInfo.businessName} &bull; {businessInfo.phone}
      </div>
    </div>
  )
}
