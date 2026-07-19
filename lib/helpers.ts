import type { InvoiceData, ServiceItem, Pricing } from '@/types/invoice'

export function formatCurrency(
  amount: number,
  currency: string = 'IDR',
  locale: string = 'id-ID'
): string {
  if (isNaN(amount) || amount === null || amount === undefined) return currency === 'IDR' ? 'Rp 0' : '$0'
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString(locale)}`
  }
}

export function calculateItemTotal(item: ServiceItem): number {
  const subtotal = (item.quantity || 0) * (item.price || 0)
  if (!item.discountValue || item.discountValue <= 0) return subtotal
  if (item.discountType === 'percentage') {
    return subtotal - (subtotal * item.discountValue) / 100
  }
  return Math.max(0, subtotal - item.discountValue)
}

export function calculateItemSubtotal(item: ServiceItem): number {
  return (item.quantity || 0) * (item.price || 0)
}

export function calculateItemDiscount(item: ServiceItem): number {
  const subtotal = calculateItemSubtotal(item)
  if (!item.discountValue || item.discountValue <= 0) return 0
  if (item.discountType === 'percentage') {
    return (subtotal * item.discountValue) / 100
  }
  return item.discountValue
}

export function calculateSubtotal(items: ServiceItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0)
}

export function calculateTotalDiscount(items: ServiceItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemDiscount(item), 0)
}

export function calculateItemsTotal(items: ServiceItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
}

export function calculateGlobalDiscount(subtotal: number, pricing: Pricing): number {
  if (!pricing.discountValue || pricing.discountValue <= 0) return 0
  if (pricing.discountType === 'percentage') {
    return (subtotal * pricing.discountValue) / 100
  }
  return Math.min(pricing.discountValue, subtotal)
}

export function calculateTaxableAmount(amount: number, pricing: Pricing): number {
  if (!pricing.taxEnabled || !pricing.taxValue || pricing.taxValue <= 0) return 0
  if (pricing.taxType === 'percentage') {
    return (amount * pricing.taxValue) / 100
  }
  return pricing.taxValue
}

export function calculateAdditionalFeesTotal(pricing: Pricing): number {
  return (pricing.additionalFees || []).reduce((sum, fee) => sum + (fee.amount || 0), 0)
}

export function calculateGrandTotal(data: InvoiceData): number {
  const itemsTotal = calculateItemsTotal(data.items)
  const subtotal = calculateSubtotal(data.items)
  const globalDiscount = calculateGlobalDiscount(subtotal, data.pricing)
  const afterDiscount = itemsTotal - globalDiscount
  const tax = calculateTaxableAmount(afterDiscount, data.pricing)
  const additionalFees = calculateAdditionalFeesTotal(data.pricing)
  return Math.max(0, afterDiscount + tax + additionalFees)
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 9000) + 1000)
  return `INV-${year}${month}-${random}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function getDefaultInvoiceData(
  overrides?: Partial<InvoiceData>
): InvoiceData {
  const now = new Date().toISOString().split('T')[0]
  return {
    businessInfo: {
      businessName: '',
      logo: null,
      address: '',
      phone: '',
      email: '',
      website: '',
      additionalInfo: '',
    },
    invoiceInfo: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: now,
      dueDate: '',
      paymentStatus: 'draft',
      currency: 'IDR',
    },
    customerInfo: {
      customerName: '',
      companyName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhone: '',
      additionalNotes: '',
    },
    items: [],
    pricing: {
      discountType: 'percentage',
      discountValue: 0,
      taxType: 'percentage',
      taxValue: 11,
      taxEnabled: false,
      additionalFees: [],
    },
    paymentInfo: {
      paymentMethod: 'transfer',
      bankName: '',
      accountName: '',
      accountNumber: '',
      qrisImage: null,
      paymentNotes: '',
    },
    notes: {
      invoiceNotes: '',
      terms: '',
      selectedNoteTemplate: 'thanks',
    },
    selectedTemplate: 'modern',
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    },
    ...overrides,
  }
}

export function validateEmail(email: string): boolean {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateFileSize(file: File, maxMB: number = 2): boolean {
  return file.size <= maxMB * 1024 * 1024
}

export function validateFileType(file: File): boolean {
  const allowed = ['image/png', 'image/jpeg', 'image/webp']
  return allowed.includes(file.type)
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export function generateInvoiceSummary(data: InvoiceData): string {
  const total = calculateGrandTotal(data)
  const lines = [
    `📋 INVOICE ${data.invoiceInfo.invoiceNumber}`,
    `Dari: ${data.businessInfo.businessName || '(nama bisnis)'}`,
    `Kepada: ${data.customerInfo.customerName || '(nama pelanggan)'}`,
    `Total: ${formatCurrency(total, data.invoiceInfo.currency)}`,
    `Status: ${data.invoiceInfo.paymentStatus}`,
  ]
  if (data.paymentInfo.bankName && data.paymentInfo.accountNumber) {
    lines.push(
      '',
      'Info Pembayaran:',
      `Bank: ${data.paymentInfo.bankName}`,
      `Rekening: ${data.paymentInfo.accountNumber}`,
      `Atas Nama: ${data.paymentInfo.accountName}`
    )
  }
  return lines.join('\n')
}
