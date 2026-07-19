'use client'

import { useState } from 'react'
import { useInvoiceStore } from '@/lib/store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Plus, Pencil, Trash2, Users, Phone, Mail, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CustomerContact } from '@/types/invoice'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect?: (contact: CustomerContact) => void
}

export function ContactManager({ open, onOpenChange, onSelect }: Props) {
  const { contacts, addContact, updateContact, deleteContact } = useInvoiceStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', company: '', address: '', email: '', phone: '', notes: '' })

  const resetForm = () => {
    setForm({ name: '', company: '', address: '', email: '', phone: '', notes: '' })
    setEditingId(null)
  }

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Nama kontak harus diisi'); return }
    const now = new Date().toISOString()
    if (editingId) {
      updateContact(editingId, form)
      toast.success('Kontak diperbarui')
    } else {
      addContact({ id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2), ...form, createdAt: now, updatedAt: now })
      toast.success('Kontak ditambahkan')
    }
    resetForm()
  }

  const handleEdit = (c: CustomerContact) => {
    setEditingId(c.id)
    setForm({ name: c.name, company: c.company, address: c.address, email: c.email, phone: c.phone, notes: c.notes })
  }

  const handleDelete = (id: string) => {
    if (editingId === id) resetForm()
    deleteContact(id)
    toast.success('Kontak dihapus')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Manajemen Kontak
          </SheetTitle>
          <SheetDescription>
            Simpan data pelanggan untuk digunakan kembali.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border p-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              {editingId ? 'Edit Kontak' : 'Kontak Baru'}
            </p>
            <div className="space-y-2">
              <Input placeholder="Nama*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Perusahaan" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input placeholder="Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Textarea placeholder="Alamat" className="h-16 text-xs" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Textarea placeholder="Catatan" className="h-12 text-xs" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={handleSave}>
                  {editingId ? 'Simpan' : 'Tambah'}
                </Button>
                {editingId && (
                  <Button size="sm" variant="outline" onClick={resetForm}>Batal</Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-[calc(100vh-420px)]">
            <div className="space-y-2">
              {contacts.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">Belum ada kontak</p>
              )}
              {contacts.map((c) => (
                <div key={c.id} className="group rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      {c.company && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Building2 className="h-3 w-3" />{c.company}</p>}
                      {c.phone && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{c.phone}</p>}
                      {c.email && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{c.email}</p>}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {onSelect && (
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { onSelect(c); onOpenChange(false) }}>
                          Pilih
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(c)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
