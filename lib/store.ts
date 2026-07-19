'use client'

import { create } from 'zustand'
import type {
  InvoiceData,
  InvoiceHistoryEntry,
  ServicePreset,
} from '@/types/invoice'
import { getDefaultInvoiceData, generateInvoiceNumber, calculateGrandTotal, getSampleInvoiceData, formatDate, migrateInvoiceData } from './helpers'
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
  savedAt: string | null

  setData: (data: InvoiceData) => void
  updateData: (partial: Partial<InvoiceData>) => void
  resetData: () => void
  loadSampleData: () => void
  saveToHistory: () => void
  loadFromHistory: (id: string) => void
  duplicateFromHistory: (id: string) => void
  deleteHistoryEntry: (id: string) => void
  clearHistory: () => void
  markAsPaid: (id: string) => void
  exportBackup: () => string
  importBackup: (json: string) => void
  addServicePreset: (preset: ServicePreset) => void
  updateServicePreset: (id: string, preset: Partial<ServicePreset>) => void
  deleteServicePreset: (id: string) => void
  setOnboardingDone: (done: boolean) => void
  setActiveTab: (tab: 'edit' | 'preview') => void
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  data: migrateInvoiceData(loadFromStorage<Partial<InvoiceData>>(STORAGE_KEY_INVOICE, getDefaultInvoiceData())),
  history: loadFromStorage<InvoiceHistoryEntry[]>(STORAGE_KEY_HISTORY, []),
  servicePresets: loadFromStorage<ServicePreset[]>(
    STORAGE_KEY_PRESETS,
    DEFAULT_SERVICE_PRESETS
  ),
  onboardingDone: loadFromStorage<boolean>(STORAGE_KEY_ONBOARDING, false),
  savedAt: null,
  activeTab: 'edit',

  setData: (data) => {
    const now = new Date().toISOString()
    const updated = {
      ...data,
      metadata: { ...data.metadata, updatedAt: now },
    }
    set({ data: updated, savedAt: now })
    saveToStorage(STORAGE_KEY_INVOICE, updated)
  },

  updateData: (partial) => {
    const current = get().data
    const now = new Date().toISOString()
    const updated = {
      ...current,
      ...partial,
      metadata: { ...current.metadata, updatedAt: now },
    }
    set({ data: updated, savedAt: now })
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
      const restored = migrateInvoiceData({
        ...entry.data,
        metadata: {
          ...entry.data.metadata,
          updatedAt: new Date().toISOString(),
        },
      })
      set({ data: restored })
      saveToStorage(STORAGE_KEY_INVOICE, restored)
    }
  },

  duplicateFromHistory: (id) => {
    const { history } = get()
    const entry = history.find((h) => h.id === id)
    if (entry) {
      const duplicated = migrateInvoiceData({
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
      })
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

  markAsPaid: (id: string) => {
    const { history } = get()
    const newHistory = history.map((h) =>
      h.id === id
        ? { ...h, status: 'paid' as const, data: { ...h.data, invoiceInfo: { ...h.data.invoiceInfo, paymentStatus: 'paid' as const } } }
        : h
    )
    set({ history: newHistory })
    saveToStorage(STORAGE_KEY_HISTORY, newHistory)
  },

  exportBackup: (): string => {
    const { history, servicePresets } = get()
    const backup = { history, servicePresets, exportedAt: new Date().toISOString() }
    return JSON.stringify(backup, null, 2)
  },

  importBackup: (json: string) => {
    const backup = JSON.parse(json)
    if (!backup.history || !backup.servicePresets) throw new Error('Format backup tidak valid')
    set({ history: backup.history, servicePresets: backup.servicePresets })
    saveToStorage(STORAGE_KEY_HISTORY, backup.history)
    saveToStorage(STORAGE_KEY_PRESETS, backup.servicePresets)
  },

  setOnboardingDone: (done) => {
    set({ onboardingDone: done })
    saveToStorage(STORAGE_KEY_ONBOARDING, done)
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
