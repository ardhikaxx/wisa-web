'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BusinessInfoForm } from './business-info-form'
import { InvoiceInfoForm } from './invoice-info-form'
import { CustomerInfoForm } from './customer-info-form'
import { ServiceItemsForm } from './service-items-form'
import { PricingForm } from './pricing-form'
import { PaymentInfoForm } from './payment-info-form'
import { NotesForm } from './notes-form'

export function InvoiceEditor() {
  return (
    <Accordion
      defaultValue={[
        'business',
        'invoice',
        'customer',
        'services',
        'pricing',
        'payment',
        'notes',
      ]}
      className="w-full"
    >
      <AccordionItem value="business">
        <AccordionTrigger className="text-base font-semibold">
          Informasi Bisnis
        </AccordionTrigger>
        <AccordionContent>
          <BusinessInfoForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="invoice">
        <AccordionTrigger className="text-base font-semibold">
          Informasi Invoice
        </AccordionTrigger>
        <AccordionContent>
          <InvoiceInfoForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="customer">
        <AccordionTrigger className="text-base font-semibold">
          Informasi Pelanggan
        </AccordionTrigger>
        <AccordionContent>
          <CustomerInfoForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="services">
        <AccordionTrigger className="text-base font-semibold">
          Daftar Jasa
        </AccordionTrigger>
        <AccordionContent>
          <ServiceItemsForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pricing">
        <AccordionTrigger className="text-base font-semibold">
          Pengaturan Harga
        </AccordionTrigger>
        <AccordionContent>
          <PricingForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="payment">
        <AccordionTrigger className="text-base font-semibold">
          Metode Pembayaran
        </AccordionTrigger>
        <AccordionContent>
          <PaymentInfoForm />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="notes">
        <AccordionTrigger className="text-base font-semibold">
          Catatan & Ketentuan
        </AccordionTrigger>
        <AccordionContent>
          <NotesForm />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
