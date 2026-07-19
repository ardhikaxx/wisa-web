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

export function calculateDpAmount(data: InvoiceData): number {
  if (!data.pricing.dpEnabled || !data.pricing.dpValue) return 0
  const total = calculateGrandTotal(data)
  if (data.pricing.dpType === 'percentage') {
    return (total * data.pricing.dpValue) / 100
  }
  return Math.min(data.pricing.dpValue, total)
}

export function calculateRemainingBalance(data: InvoiceData): number {
  const total = calculateGrandTotal(data)
  const dp = calculateDpAmount(data)
  return Math.max(0, total - dp)
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 9000) + 1000)
  return `INV-${year}${month}-${random}`
}

export function migrateInvoiceData(data: Partial<InvoiceData>): InvoiceData {
  const defaults = getDefaultInvoiceData()
  return {
    ...defaults,
    ...data,
    pricing: {
      ...defaults.pricing,
      ...(data.pricing || {}),
      additionalFees: data.pricing?.additionalFees || defaults.pricing.additionalFees,
      milestones: data.pricing?.milestones || defaults.pricing.milestones,
    },
    paymentInfo: {
      ...defaults.paymentInfo,
      ...(data.paymentInfo || {}),
    },
    notes: {
      ...defaults.notes,
      ...(data.notes || {}),
    },
    metadata: {
      ...defaults.metadata,
      ...(data.metadata || {}),
    },
    items: data.items || defaults.items,
    invoiceInfo: {
      ...defaults.invoiceInfo,
      ...(data.invoiceInfo || {}),
    },
    customerInfo: {
      ...defaults.customerInfo,
      ...(data.customerInfo || {}),
    },
    businessInfo: {
      ...defaults.businessInfo,
      ...(data.businessInfo || {}),
    },
  }
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
      paymentTerm: 'full',
      dpEnabled: false,
      dpType: 'percentage',
      dpValue: 0,
      milestones: [],
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

const SATUAN = ['', 'Ribu', 'Juta', 'Miliar', 'Triliun']
const ANGKA = [
  '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan',
]
const BELASAN = [
  'Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
  'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas',
]

function terbilangRatusan(n: number): string {
  const ratus = Math.floor(n / 100)
  const sisa = n % 100
  let hasil = ''
  if (ratus === 1) hasil += 'Seratus'
  else if (ratus > 1) hasil += ANGKA[ratus] + ' Ratus'
  if (sisa === 0) return hasil
  if (hasil) hasil += ' '
  if (sisa < 10) hasil += ANGKA[sisa]
  else if (sisa < 20) hasil += BELASAN[sisa - 10]
  else {
    const puluh = Math.floor(sisa / 10)
    const sat = sisa % 10
    hasil += ANGKA[puluh] + ' Puluh'
    if (sat > 0) hasil += ' ' + ANGKA[sat]
  }
  return hasil
}

export function numberToWords(amount: number): string {
  if (amount === 0) return 'Nol Rupiah'

  let n = Math.abs(Math.round(amount))
  let result = ''

  for (let i = SATUAN.length - 1; i >= 0; i--) {
    const divisor = Math.pow(1000, i)
    if (n >= divisor) {
      const bagian = Math.floor(n / divisor)
      let kataBagian = ''
      if (bagian === 1 && i === 1) kataBagian = 'Seribu'
      else if (bagian < 10) kataBagian = ANGKA[bagian]
      else if (bagian < 20) kataBagian = BELASAN[bagian - 10]
      else if (bagian < 100) {
        const puluh = Math.floor(bagian / 10)
        const sat = bagian % 10
        kataBagian = ANGKA[puluh] + ' Puluh' + (sat > 0 ? ' ' + ANGKA[sat] : '')
      } else {
        kataBagian = terbilangRatusan(bagian)
      }
      result += (result ? ' ' : '') + kataBagian + ' ' + SATUAN[i]
      n %= divisor
    }
  }

  return result.trim() + ' Rupiah'
}

export function getSampleInvoiceData(): InvoiceData {
  const id = crypto.randomUUID?.() ?? Date.now().toString()
  const now = new Date().toISOString().split('T')[0]
  const later = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]

  return {
    businessInfo: {
      businessName: 'CV Kreatif Studio',
      logo: null,
      address: 'Jl. Merdeka No. 45, Kelurahan Sukamaju, Kecamatan Cimahi, Bandung 40512',
      phone: '0812-3456-7890',
      email: 'hello@kreatifstudio.com',
      website: 'www.kreatifstudio.com',
      additionalInfo: 'NPWP: 01.234.567.8-901.000',
    },
    invoiceInfo: {
      invoiceNumber: generateInvoiceNumber(),
      issueDate: now,
      dueDate: later,
      paymentStatus: 'pending',
      currency: 'IDR',
    },
    customerInfo: {
      customerName: 'Budi Santoso',
      companyName: 'PT. Maju Bersama',
      customerAddress: 'Jl. Sudirman No. 88, Jakarta Pusat 10210',
      customerEmail: 'budi@maju bersama.com',
      customerPhone: '0811-222-333',
      additionalNotes: '',
    },
    items: [
      {
        id: crypto.randomUUID?.() ?? 's1',
        name: 'Jasa Pembuatan Website Company Profile',
        description: 'Website responsif 5 halaman + admin panel + hosting 1 tahun',
        quantity: 1,
        unit: 'Proyek',
        price: 5000000,
        discountType: 'percentage',
        discountValue: 10,
      },
      {
        id: crypto.randomUUID?.() ?? 's2',
        name: 'Jasa Desain Logo',
        description: 'Konsep 3 pilihan + revisi 2x + file siap cetak',
        quantity: 1,
        unit: 'Paket',
        price: 750000,
        discountType: 'percentage',
        discountValue: 0,
      },
      {
        id: crypto.randomUUID?.() ?? 's3',
        name: 'Jasa Penulisan Konten',
        description: 'Copywriting 5 halaman landing page',
        quantity: 5,
        unit: 'Halaman',
        price: 100000,
        discountType: 'fixed',
        discountValue: 50000,
      },
    ],
    pricing: {
      discountType: 'percentage',
      discountValue: 0,
      taxType: 'percentage',
      taxValue: 11,
      taxEnabled: true,
      additionalFees: [
        { id: 'fee1', name: 'Biaya Domain & Hosting', amount: 350000 },
      ],
      paymentTerm: 'dp',
      dpEnabled: true,
      dpType: 'percentage',
      dpValue: 50,
      milestones: [
        { id: 'm1', name: 'Pembayaran Pertama (DP)', percentage: 50, dueDate: now },
        { id: 'm2', name: 'Pelunasan', percentage: 50, dueDate: later },
      ],
    },
    paymentInfo: {
      paymentMethod: 'transfer',
      bankName: 'Bank Central Asia (BCA)',
      accountName: 'CV Kreatif Studio',
      accountNumber: '123-456-7890',
      qrisImage: null,
      paymentNotes: 'Pembayaran dapat dilakukan melalui transfer bank atau QRIS',
    },
    notes: {
      invoiceNotes: 'Terima kasih telah mempercayakan project ini kepada kami. Kami akan segera memulai pengerjaan setelah pembayaran diterima.',
      terms: 'Pembayaran dilakukan maksimal 7 hari setelah invoice diterbitkan. Keterlambatan pembayaran akan dikenakan biaya administrasi 2% per bulan.',
      selectedNoteTemplate: 'thanks',
    },
    selectedTemplate: 'modern',
    metadata: {
      id: id + '-sample',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
}
