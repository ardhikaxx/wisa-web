'use client'

import { create } from 'zustand'
import type {
  InvoiceData,
  InvoiceHistoryEntry,
  ServicePreset,
} from '@/types/invoice'
import { getDefaultInvoiceData, generateInvoiceNumber, calculateGrandTotal, getSampleInvoiceData } from './helpers'
import { DEFAULT_SERVICE_PRESETS } from './constants'

const STORAGE_KEY_INVOICE = 'misa-invoice-data'
const STORAGE_KEY_HISTORY = 'misa-invoice-history'
const STORAGE_KEY_PRESETS = 'misa-service-presets'
const STORAGE_KEY_ONBOARDING = 'misa-onboarding-done'

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    /* storage full or unavailable */
  }
}

interface InvoiceStore {
  data: InvoiceData
  history: InvoiceHistoryEntry[]
  servicePresets: ServicePreset[]
  onboardingDone: boolean
  activeTab: 'edit' | 'preview'

  setData: (data: InvoiceData) => void
  updateData: (partial: Partial<InvoiceData>) => void
  resetData: () => void
  loadSampleData: () => void
  saveToHistory: () => void
  loadFromHistory: (id: string) => void
  duplicateFromHistory: (id: string) => void
  deleteHistoryEntry: (id: string) => void
  clearHistory: () => void
  addServicePreset: (preset: ServicePreset) => void
  updateServicePreset: (id: string, preset: Partial<ServicePreset>) => void
  deleteServicePreset: (id: string) => void
  setOnboardingDone: (done: boolean) => void
  setActiveTab: (tab: 'edit' | 'preview') => void
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  data: loadFromStorage<InvoiceData>(STORAGE_KEY_INVOICE, getDefaultInvoiceData()),
  history: loadFromStorage<InvoiceHistoryEntry[]>(STORAGE_KEY_HISTORY, []),
  servicePresets: loadFromStorage<ServicePreset[]>(
    STORAGE_KEY_PRESETS,
    DEFAULT_SERVICE_PRESETS
  ),
  onboardingDone: loadFromStorage<boolean>(STORAGE_KEY_ONBOARDING, false),
  activeTab: 'edit',

  setData: (data) => {
    const updated = {
      ...data,
      metadata: { ...data.metadata, updatedAt: new Date().toISOString() },
    }
    set({ data: updated })
    saveToStorage(STORAGE_KEY_INVOICE, updated)
  },

  updateData: (partial) => {
    const current = get().data
    const updated = {
      ...current,
      ...partial,
      metadata: { ...current.metadata, updatedAt: new Date().toISOString() },
    }
    set({ data: updated })
    saveToStorage(STORAGE_KEY_INVOICE, updated)
  },

  resetData: () => {
    const fresh = getDefaultInvoiceData()
    set({ data: fresh })
    saveToStorage(STORAGE_KEY_INVOICE, fresh)
  },

  saveToHistory: () => {
    const { data, history } = get()
    const total = calculateGrandTotal(data)
    const entry: InvoiceHistoryEntry = {
      id: data.metadata.id,
      invoiceNumber: data.invoiceInfo.invoiceNumber,
      customerName: data.customerInfo.customerName || '(tanpa nama)',
      date: data.invoiceInfo.issueDate,
      total,
      status: data.invoiceInfo.paymentStatus,
      data: { ...data },
    }
    const existingIndex = history.findIndex((h) => h.id === entry.id)
    let newHistory: InvoiceHistoryEntry[]
    if (existingIndex >= 0) {
      newHistory = [...history]
      newHistory[existingIndex] = entry
    } else {
      newHistory = [entry, ...history]
    }
    set({ history: newHistory })
    saveToStorage(STORAGE_KEY_HISTORY, newHistory)
  },

  loadFromHistory: (id) => {
    const { history } = get()
    const entry = history.find((h) => h.id === id)
    if (entry) {
      const restored = {
        ...entry.data,
        metadata: {
          ...entry.data.metadata,
          updatedAt: new Date().toISOString(),
        },
      }
      set({ data: restored })
      saveToStorage(STORAGE_KEY_INVOICE, restored)
    }
  },

  duplicateFromHistory: (id) => {
    const { history } = get()
    const entry = history.find((h) => h.id === id)
    if (entry) {
      const duplicated = {
        ...entry.data,
        invoiceInfo: {
          ...entry.data.invoiceInfo,
          invoiceNumber: generateInvoiceNumber(),
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          paymentStatus: 'draft' as const,
        },
        metadata: {
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
      set({ data: duplicated })
      saveToStorage(STORAGE_KEY_INVOICE, duplicated)
    }
  },

  deleteHistoryEntry: (id) => {
    const newHistory = get().history.filter((h) => h.id !== id)
    set({ history: newHistory })
    saveToStorage(STORAGE_KEY_HISTORY, newHistory)
  },

  clearHistory: () => {
    set({ history: [] })
    saveToStorage(STORAGE_KEY_HISTORY, [])
  },

  addServicePreset: (preset) => {
    const presets = [...get().servicePresets, preset]
    set({ servicePresets: presets })
    saveToStorage(STORAGE_KEY_PRESETS, presets)
  },

  updateServicePreset: (id, partial) => {
    const presets = get().servicePresets.map((p) =>
      p.id === id ? { ...p, ...partial } : p
    )
    set({ servicePresets: presets })
    saveToStorage(STORAGE_KEY_PRESETS, presets)
  },

  deleteServicePreset: (id) => {
    const presets = get().servicePresets.filter((p) => p.id !== id)
    set({ servicePresets: presets })
    saveToStorage(STORAGE_KEY_PRESETS, presets)
  },

  loadSampleData: () => {
    const sample = getSampleInvoiceData()
    set({ data: sample })
    saveToStorage(STORAGE_KEY_INVOICE, sample)
  },

  setOnboardingDone: (done) => {
    set({ onboardingDone: done })
    saveToStorage(STORAGE_KEY_ONBOARDING, done)
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
