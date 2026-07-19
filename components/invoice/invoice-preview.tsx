'use client'

import { useInvoiceStore } from '@/lib/store'
import { TemplateModern } from '@/components/templates/template-modern'
import { TemplateMinimal } from '@/components/templates/template-minimal'
import { TemplateProfessional } from '@/components/templates/template-professional'
import { TemplateCreative } from '@/components/templates/template-creative'
import { TemplateNota } from '@/components/templates/template-nota'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TEMPLATE_OPTIONS } from '@/lib/constants'
import { LayoutTemplate } from 'lucide-react'

const templates = {
  modern: TemplateModern,
  minimal: TemplateMinimal,
  professional: TemplateProfessional,
  creative: TemplateCreative,
  nota: TemplateNota,
}

export function InvoicePreview() {
  const { data, updateData } = useInvoiceStore()
  const Template = templates[data.selectedTemplate] || TemplateModern

  return (
    <div className="w-full max-w-[210mm]">
      <div className="no-print mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Template</span>
          <Select
            value={data.selectedTemplate}
            onValueChange={(v) => v && updateData({ selectedTemplate: v as any })}
          >
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div id="invoice-preview" className="overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5">
        <Template data={data} />
      </div>
    </div>
  )
}
