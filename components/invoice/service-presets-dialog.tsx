'use client'

import { useState } from 'react'
import { useInvoiceStore } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bookmark, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { SERVICE_UNITS } from '@/lib/constants'
import type { ServiceItem, ServicePreset } from '@/types/invoice'
import { toast } from 'sonner'

export function ServicePresetsDialog() {
  const { servicePresets, addServicePreset, updateServicePreset, deleteServicePreset, updateData, data } =
    useInvoiceStore()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: 0, unit: 'Unit' })

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, unit: 'Unit' })
    setEditingId(null)
  }

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error('Nama jasa harus diisi')
      return
    }
    const now = Date.now().toString()
    if (editingId) {
      updateServicePreset(editingId, form)
      toast.success('Preset jasa diperbarui')
    } else {
      addServicePreset({ id: now, ...form })
      toast.success('Preset jasa ditambahkan')
    }
    resetForm()
  }

  const handleEdit = (preset: ServicePreset) => {
    setEditingId(preset.id)
    setForm({
      name: preset.name,
      description: preset.description,
      price: preset.price,
      unit: preset.unit,
    })
  }

  const handleUsePreset = (preset: ServicePreset) => {
    const newItem: ServiceItem = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      name: preset.name,
      description: preset.description,
      quantity: 1,
      unit: preset.unit,
      price: preset.price,
      discountType: 'percentage',
      discountValue: 0,
    }
    updateData({ items: [...data.items, newItem] })
    toast.success(`"${preset.name}" ditambahkan`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5" />}>
        <Bookmark className="h-4 w-4" />
        Preset Jasa
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Daftar Jasa Favorit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 rounded-lg border p-3">
          <h4 className="text-xs font-medium text-muted-foreground">
            {editingId ? 'Edit Preset' : 'Tambah Preset Baru'}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Input
                placeholder="Nama jasa"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Textarea
                placeholder="Deskripsi singkat"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
              />
            </div>
            <Input
              type="number"
              placeholder="Harga"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <Select value={form.unit} onValueChange={(v) => v && setForm({ ...form, unit: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            {editingId && (
              <Button variant="ghost" size="sm" onClick={resetForm}>
                Batal
              </Button>
            )}
            <Button size="sm" onClick={handleSave} className="gap-1">
              {editingId ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Simpan
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Tambah
                </>
              )}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-60">
          <div className="space-y-2">
            {servicePresets.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Belum ada preset jasa. Tambahkan jasa yang sering Anda gunakan.
              </p>
            ) : (
              servicePresets.map((preset) => (
                <div
                  key={preset.id}
                  className="group flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{preset.name}</p>
                    {preset.description && (
                      <p className="text-xs text-muted-foreground">
                        {preset.description}
                      </p>
                    )}
                    <p className="mt-1 text-xs font-semibold text-primary">
                      Rp {preset.price.toLocaleString('id-ID')}/{preset.unit}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEdit(preset)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => {
                        deleteServicePreset(preset.id)
                        toast.success('Preset dihapus')
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 gap-1 text-xs"
                      onClick={() => handleUsePreset(preset)}
                    >
                      <Plus className="h-3 w-3" />
                      Pakai
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
