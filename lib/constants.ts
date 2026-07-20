import type { NoteTemplate, ServicePreset } from '@/types/invoice'

export const APP_NAME = 'WISA'
export const APP_TAGLINE = 'Buat Invoice Jasa Profesional dalam Hitungan Menit'
export const APP_DESCRIPTION =
  'Generator invoice gratis untuk UMKM bidang jasa. Buat invoice profesional, preview real-time, download PDF, tanpa login.'

export const CURRENCY_OPTIONS = [
  { value: 'IDR', label: 'Rp (Rupiah)', locale: 'id-ID', currency: 'IDR' },
  { value: 'USD', label: '$ (Dolar AS)', locale: 'en-US', currency: 'USD' },
] as const

export const PAYMENT_METHODS = [
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'qris', label: 'QRIS' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'cash', label: 'Tunai' },
  { value: 'other', label: 'Lainnya' },
] as const

export const INVOICE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Terkirim' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Lunas' },
  { value: 'overdue', label: 'Jatuh Tempo' },
] as const

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
}

export const SERVICE_UNITS = [
  'Unit',
  'Jam',
  'Hari',
  'Minggu',
  'Bulan',
  'Paket',
  'Proyek',
  'Item',
  'Kali',
  'Orang',
  'Pertemuan',
  'Halaman',
] as const

export const DEFAULT_NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'thanks',
    label: 'Terima Kasih',
    notes: 'Terima kasih telah menggunakan jasa kami. Pembayaran dapat dilakukan melalui transfer bank atau metode pembayaran yang tercantum.',
    terms: 'Pembayaran harus dilakukan dalam waktu 7 hari setelah invoice diterima. Hubungi kami jika ada pertanyaan terkait invoice ini.',
  },
  {
    id: 'payment-reminder',
    label: 'Pengingat Pembayaran',
    notes: 'Mohon segera lakukan pembayaran sesuai dengan invoice yang telah diterbitkan.',
    terms: 'Pembayaran dilakukan paling lambat pada tanggal jatuh tempo yang tercantum. Keterlambatan pembayaran akan dikenakan biaya administrasi sebesar 2% per bulan.',
  },
  {
    id: 'professional',
    label: 'Profesional',
    notes: 'Kami berterima kasih atas kepercayaan yang diberikan kepada kami. Invoice ini berlaku sebagai bukti tagihan resmi.',
    terms: 'Invoice ini dibuat berdasarkan kesepakatan yang telah ditandatangani kedua belah pihak. Segala perubahan harus dilakukan secara tertulis dan disetujui oleh kedua belah pihak.',
  },
  {
    id: 'custom',
    label: 'Kustom',
    notes: '',
    terms: '',
  },
]

export const TEMPLATE_OPTIONS = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'professional', label: 'Profesional' },
  { value: 'creative', label: 'Kreatif' },
  { value: 'nota', label: 'Nota / Kwitansi' },
] as const

export const DEFAULT_SERVICE_PRESETS: ServicePreset[] = [
  { id: 'preset-1', name: 'Jasa Desain Logo', description: 'Desain logo profesional termasuk revisi 3x', price: 500000, unit: 'Paket' },
  { id: 'preset-2', name: 'Jasa Pembuatan Website', description: 'Website company profile responsif 5 halaman', price: 3000000, unit: 'Proyek' },
  { id: 'preset-3', name: 'Jasa Fotografi Event', description: 'Dokumentasi event full-day + editing 50 foto', price: 1500000, unit: 'Paket' },
  { id: 'preset-4', name: 'Jasa Videografi', description: 'Video highlight 3-5 menit + footage mentah', price: 2500000, unit: 'Paket' },
  { id: 'preset-5', name: 'Jasa Service AC', description: 'Service AC bersih + freon', price: 150000, unit: 'Unit' },
  { id: 'preset-6', name: 'Jasa Desain Grafis', description: 'Desain feed Instagram 10 template', price: 750000, unit: 'Paket' },
  { id: 'preset-7', name: 'Jasa Konsultasi Digital Marketing', description: 'Konsultasi 60 menit + strategi', price: 350000, unit: 'Jam' },
  { id: 'preset-8', name: 'Jasa Pengetikan & Edit', description: 'Pengetikan dokumen 10 halaman', price: 50000, unit: 'Halaman' },
]
