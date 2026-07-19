'use client'

import { useCallback } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DEFAULT_NOTE_TEMPLATES } from '@/lib/constants'

export function NotesForm() {
  const { data, updateData } = useInvoiceStore()
  const { notes } = data

  const update = useCallback(
    (partial: Partial<typeof notes>) => {
      updateData({ notes: { ...notes, ...partial } })
    },
    [notes, updateData]
  )

  const applyTemplate = useCallback(
    (templateId: string) => {
      const template = DEFAULT_NOTE_TEMPLATES.find((t) => t.id === templateId)
      if (template) {
        update({
          selectedNoteTemplate: templateId,
          invoiceNotes: template.notes,
          terms: template.terms,
        })
      }
    },
    [update]
  )

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block text-xs text-muted-foreground">
          Template Catatan Cepat
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_NOTE_TEMPLATES.map((tpl) => (
            <Button
              key={tpl.id}
              variant={notes.selectedNoteTemplate === tpl.id ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => applyTemplate(tpl.id)}
            >
              {tpl.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="invoiceNotes">Catatan Invoice</Label>
        <Textarea
          id="invoiceNotes"
          placeholder="Terima kasih telah menggunakan jasa kami..."
          value={notes.invoiceNotes}
          onChange={(e) =>
            update({ invoiceNotes: e.target.value, selectedNoteTemplate: 'custom' })
          }
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="terms">Syarat & Ketentuan</Label>
        <Textarea
          id="terms"
          placeholder="Pembayaran dilakukan maksimal 7 hari setelah invoice diterima..."
          value={notes.terms}
          onChange={(e) => update({ terms: e.target.value, selectedNoteTemplate: 'custom' })}
          rows={3}
        />
      </div>
    </div>
  )
}
