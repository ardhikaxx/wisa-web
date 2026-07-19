export interface BusinessInfo {
  businessName: string
  logo: string | null
  address: string
  phone: string
  email: string
  website: string
  additionalInfo: string
}

export interface InvoiceInfo {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  paymentStatus: InvoiceStatus
  currency: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue'

export interface CustomerInfo {
  customerName: string
  companyName: string
  customerAddress: string
  customerEmail: string
  customerPhone: string
  additionalNotes: string
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  price: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
}

export interface AdditionalFee {
  id: string
  name: string
  amount: number
}

export interface Pricing {
  discountType: 'percentage' | 'fixed'
  discountValue: number
  taxType: 'percentage' | 'fixed'
  taxValue: number
  taxEnabled: boolean
  additionalFees: AdditionalFee[]
}

export interface PaymentInfo {
  paymentMethod: string
  bankName: string
  accountName: string
  accountNumber: string
  qrisImage: string | null
  paymentNotes: string
}

export interface Notes {
  invoiceNotes: string
  terms: string
  selectedNoteTemplate: string
}

export type TemplateType = 'modern' | 'minimal' | 'professional' | 'creative'

export interface Metadata {
  createdAt: string
  updatedAt: string
  id: string
}

export interface InvoiceData {
  businessInfo: BusinessInfo
  invoiceInfo: InvoiceInfo
  customerInfo: CustomerInfo
  items: ServiceItem[]
  pricing: Pricing
  paymentInfo: PaymentInfo
  notes: Notes
  selectedTemplate: TemplateType
  metadata: Metadata
}

export interface InvoiceHistoryEntry {
  id: string
  invoiceNumber: string
  customerName: string
  date: string
  total: number
  status: InvoiceStatus
  data: InvoiceData
}

export interface ServicePreset {
  id: string
  name: string
  description: string
  price: number
  unit: string
}

export type DiscountType = 'percentage' | 'fixed'

export interface NoteTemplate {
  id: string
  label: string
  notes: string
  terms: string
}
