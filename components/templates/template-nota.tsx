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
import { InvoiceQr } from '@/components/invoice/invoice-qr'

interface Props {
  data: InvoiceData
}

export function TemplateNota({ data }: Props) {
  const { businessInfo, invoiceInfo, customerInfo, items, pricing, paymentInfo, notes } = data

  const itemsTotal = calculateItemsTotal(items)
  const subtotal = calculateSubtotal(items)
  const globalDiscount = calculateGlobalDiscount(subtotal, pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, pricing)
  const additionalFeesTotal = calculateAdditionalFeesTotal(pricing)
  const grandTotal = calculateGrandTotal(data)

  return (
    <div className="bg-white p-6 font-mono text-xs">
      {/* Nota header */}
      <div className="mb-4 border-b-2 border-black pb-2">
        <h1 className="text-lg font-bold uppercase tracking-wider">Nota / Kwitansi</h1>
        {businessInfo.businessName && (
          <p className="text-sm font-semibold">{businessInfo.businessName}</p>
        )}
        <p className="text-[10px]">{businessInfo.address}</p>
        <p className="text-[10px]">
          {[businessInfo.phone, businessInfo.email].filter(Boolean).join(' | ')}
        </p>
      </div>

      {/* Info row */}
      <div className="mb-3 flex justify-between border-b border-dashed border-gray-300 pb-2">
        <div>
          <p>
            <span className="font-semibold">No:</span> {invoiceInfo.invoiceNumber}
          </p>
          <p>
            <span className="font-semibold">Tgl:</span> {formatDate(invoiceInfo.issueDate)}
          </p>
          <p>
            <span className="font-semibold">Kepada:</span> {customerInfo.customerName}
          </p>
        </div>
        <div className="text-right">
          <Badge
            className={`text-[9px] ${STATUS_COLORS[invoiceInfo.paymentStatus]}`}
          >
            {invoiceInfo.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
          </Badge>
        </div>
      </div>

      {/* Items table */}
      <table className="mb-3 w-full border-collapse text-[10px]">
        <thead>
          <tr className="border-b border-black">
            <th className="py-1 pr-2 text-left font-semibold">Item</th>
            <th className="py-1 px-2 text-right font-semibold">Qty</th>
            <th className="py-1 px-2 text-right font-semibold">Harga</th>
            <th className="py-1 pl-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-400">
                Belum ada item
              </td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.id} className="border-b border-dashed border-gray-200">
              <td className="py-1 pr-2">
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-[8px] text-muted-foreground">{item.description}</p>
                )}
              </td>
              <td className="py-1 px-2 text-right">
                {item.quantity} {item.unit}
              </td>
              <td className="py-1 px-2 text-right">{formatCurrency(item.price)}</td>
              <td className="py-1 pl-2 text-right font-semibold">
                {formatCurrency(
                  item.quantity * item.price -
                    (item.discountType === 'percentage'
                      ? (item.quantity * item.price * item.discountValue) / 100
                      : item.discountValue)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mb-4 ml-auto w-48 space-y-0.5 border-t border-black pt-1 text-[10px]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(itemsTotal)}</span>
        </div>
        {globalDiscount > 0 && (
          <div className="flex justify-between">
            <span>Diskon</span>
            <span className="text-destructive">-{formatCurrency(globalDiscount)}</span>
          </div>
        )}
        {calculateTaxBreakdown(afterDiscount, pricing).map(t => (
          <div key={t.name} className="flex justify-between">
            <span>{t.name}</span>
            <span>{formatCurrency(t.amount)}</span>
          </div>
        ))}
        {pricing.taxIncluded && (
          <p className="text-[10px] italic text-muted-foreground">*sudah termasuk pajak</p>
        )}
        {additionalFeesTotal > 0 && (
          <div className="flex justify-between">
            <span>Biaya Lain</span>
            <span>{formatCurrency(additionalFeesTotal)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-black pt-1 font-bold text-sm">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
        {grandTotal > 0 && (
          <p className="mt-1 text-[8px] italic">
            {numberToWords(grandTotal)}
          </p>
        )}
      </div>

      <PaymentSummary data={data} />

      {/* Payment info */}
      {paymentInfo.paymentMethod && (
        <div className="mb-3 border-t border-dashed border-gray-300 pt-2">
          <p className="mb-1 font-semibold">Pembayaran:</p>
          <p className="capitalize">{paymentInfo.paymentMethod}</p>
          {paymentInfo.bankName && <p>{paymentInfo.bankName}</p>}
          {paymentInfo.accountName && <p>a.n. {paymentInfo.accountName}</p>}
          {paymentInfo.accountNumber && <p>No.Rek: {paymentInfo.accountNumber}</p>}
          <div className="mt-2 flex items-center gap-2">
            <InvoiceQr value={invoiceInfo.invoiceNumber} size={40} />
            <span className="text-[8px] text-muted-foreground">{invoiceInfo.invoiceNumber}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      {notes.invoiceNotes && (
        <div className="mb-3 border-t border-dashed border-gray-300 pt-2">
          <p className="text-[8px] italic">{notes.invoiceNotes}</p>
        </div>
      )}

      {/* Signature line */}
      <div className="mt-6 border-t border-dashed border-gray-300 pt-2 text-right text-[8px]">
        <p className="mb-6">{customerInfo.customerName || 'Penerima'},</p>
        <p className="font-semibold">(______________)</p>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-black pt-1 text-center text-[8px]">
        <p>
          {businessInfo.businessName} | {businessInfo.phone}
        </p>
      </div>
    </div>
  )
}
