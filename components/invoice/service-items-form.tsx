'use client'

import { useCallback, useRef, useState } from 'react'
import { useInvoiceStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ServicePresetsDialog } from './service-presets-dialog'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { SERVICE_UNITS } from '@/lib/constants'
import { formatCurrency, calculateItemSubtotal, calculateItemTotal } from '@/lib/helpers'
import type { ServiceItem } from '@/types/invoice'

export function ServiceItemsForm() {
  const { data, updateData } = useInvoiceStore()
  const { items } = data
  const dragItem = useRef<number | null>(null)
  const dragOverItem = useRef<number | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  const updateItem = useCallback(
    (id: string, partial: Partial<ServiceItem>) => {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      )
      updateData({ items: newItems })
    },
    [items, updateData]
  )

  const addItem = useCallback(() => {
    const newItem: ServiceItem = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      name: '',
      description: '',
      quantity: 1,
      unit: 'Unit',
      price: 0,
      discountType: 'percentage',
      discountValue: 0,
    }
    updateData({ items: [...items, newItem] })
  }, [items, updateData])

  const removeItem = useCallback(
    (id: string) => {
      if (items.length <= 1) return
      updateData({ items: items.filter((item) => item.id !== id) })
    },
    [items, updateData]
  )

  const moveItem = useCallback(
    (from: number, to: number) => {
      const newItems = [...items]
      const [removed] = newItems.splice(from, 1)
      newItems.splice(to, 0, removed)
      updateData({ items: newItems })
    },
    [items, updateData]
  )

  const handleDragStart = (index: number) => {
    dragItem.current = index
    setDragIdx(index)
  }

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index
  }

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      moveItem(dragItem.current, dragOverItem.current)
    }
    dragItem.current = null
    dragOverItem.current = null
    setDragIdx(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Tambahkan jasa/layanan yang diberikan kepada pelanggan
        </p>
        <ServicePresetsDialog />
      </div>

      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => e.preventDefault()}
          className={`rounded-lg border p-3 transition-shadow ${
            dragIdx === index ? 'opacity-50 ring-2 ring-primary' : ''
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing" title="Seret untuk urutkan">
                <GripVertical className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Jasa #{index + 1}
              </span>
            </div>
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Input
                  placeholder="Nama jasa"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                />
              </div>
              <Select
                value={item.unit}
                onValueChange={(v) => v && updateItem(item.id, { unit: v })}
              >
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
            <Textarea
              placeholder="Deskripsi jasa (opsional)"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              rows={1}
              className="text-xs"
            />
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity || ''}
                  onChange={(e) =>
                    updateItem(item.id, { quantity: Math.max(1, Number(e.target.value)) })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label className="text-[10px] text-muted-foreground">
                  Harga Per {item.unit}
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={item.price || ''}
                  onChange={(e) =>
                    updateItem(item.id, { price: Math.max(0, Number(e.target.value)) })
                  }
                />
              </div>
              <div className="flex flex-col justify-end">
                <Label className="text-[10px] text-muted-foreground">
                  Diskon
                </Label>
                <div className="flex gap-1">
                  <Input
                    type="number"
                    min={0}
                    className="w-12 flex-1"
                    value={item.discountValue || ''}
                    onChange={(e) =>
                      updateItem(item.id, { discountValue: Math.max(0, Number(e.target.value)) })
                    }
                  />
                  <Select
                    value={item.discountType}
                    onValueChange={(v) =>
                      v && updateItem(item.id, { discountType: v as any })
                    }
                  >
                    <SelectTrigger className="w-14">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="fixed">Rp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/50 px-2 py-1 text-xs">
              <span>Subtotal: {formatCurrency(calculateItemSubtotal(item))}</span>
              <span className="font-semibold">
                Total: {formatCurrency(calculateItemTotal(item))}
              </span>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={addItem}
      >
        <Plus className="h-4 w-4" />
        Tambah Jasa
      </Button>
    </div>
  )
}
