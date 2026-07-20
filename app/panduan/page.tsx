import Link from 'next/link'
import { Navbar } from '@/components/invoice/navbar'
import {
  FileText,
  Sparkles,
  Download,
  Printer,
  ImageDown,
  Bookmark,
  Palette,
  History,
  CheckCircle2,
  Users,
  Search,
  Cloud,
  Upload,
  Copy,
  Beaker,
  QrCode,
} from 'lucide-react'

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Template default dengan layout dua kolom, badge status, dan aksen teal. Cocok untuk semua jenis usaha jasa.',
    best: 'Usaha kreatif, digital, startup',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Desain bersih tanpa warna mencolok. Fokus pada tipografi, cocok untuk invoice formal atau B2B.',
    best: 'Konsultan, notaris, B2B formal',
  },
  {
    id: 'professional',
    name: 'Profesional',
    desc: 'Layout rapi dengan header terpisah dan kolom harga yang jelas. Memberi kesan profesional dan terpercaya.',
    best: 'Kontraktor, vendor, perusahaan',
  },
  {
    id: 'creative',
    name: 'Kreatif',
    desc: 'Desain dengan aksen warna di header dan border. Tampilan modern dan eye-catching.',
    best: 'Event organizer, fotografer, agensi',
  },
  {
    id: 'nota',
    name: 'Nota / Kwitansi',
    desc: 'Layout monospace sederhana ala kwitansi toko. Ada garis tanda tangan dan ukuran ringkas.',
    best: 'Toko ritel, bengkel, service center',
  },
]

const features = [
  {
    icon: FileText,
    title: 'Invoice Baru',
    desc: 'Klik "Invoice Baru" untuk memulai. Isi data bisnis, pelanggan, dan jasa yang diberikan.',
  },
  {
    icon: Bookmark,
    title: 'Preset Jasa Favorit',
    desc: 'Simpan jasa yang sering digunakan sebagai preset. Nama, deskripsi, harga, dan unit langsung terisi otomatis.',
  },
  {
    icon: Palette,
    title: 'Kustom Warna Template',
    desc: 'Ganti warna aksen template dengan color picker. Warna otomatis teraplikasi ke semua template.',
  },
  {
    icon: Users,
    title: 'Manajemen Kontak',
    desc: 'Simpan data pelanggan untuk digunakan kembali. Cukup pilih kontak, form terisi otomatis.',
  },
  {
    icon: History,
    title: 'Riwayat & Pencarian',
    desc: 'Semua invoice tersimpan otomatis. Cari berdasarkan nomor invoice atau nama pelanggan.',
  },
  {
    icon: CheckCircle2,
    title: 'Tandai Lunas',
    desc: 'Dari riwayat, tandai invoice sebagai lunas dengan satu klik. Status otomatis berubah di semua template.',
  },
  {
    icon: Copy,
    title: 'Edit Sebagai Baru',
    desc: 'Buka invoice lama dari riwayat, edit, dan simpan sebagai entri baru tanpa mengubah aslinya.',
  },
  {
    icon: Download,
    title: 'Download PDF & PNG',
    desc: 'Export invoice sebagai PDF A4 atau PNG resolusi tinggi. Siap dikirim ke pelanggan.',
  },
  {
    icon: Printer,
    title: 'Cetak Invoice & Nota',
    desc: 'Cetak langsung dari browser. Support ukuran A4, nota thermal 58mm, dan 80mm.',
  },
  {
    icon: ImageDown,
    title: 'Export PNG',
    desc: 'Download preview invoice sebagai gambar PNG 3x resolusi. Cocok untuk share di media sosial.',
  },
  {
    icon: QrCode,
    title: 'QR Code Invoice',
    desc: 'Setiap template menampilkan QR code nomor invoice. Pelanggan bisa scan untuk referensi.',
  },
  {
    icon: Cloud,
    title: 'Auto-save',
    desc: 'Data tersimpan otomatis ke browser. Indikator "Tersimpan" muncul di toolbar.',
  },
  {
    icon: Upload,
    title: 'Backup & Restore',
    desc: 'Backup semua data (riwayat + preset) ke file JSON. Restore kapan saja.',
  },
  {
    icon: Beaker,
    title: 'Muat Contoh Data',
    desc: 'Klik "Muat Contoh Data" untuk mengisi invoice dengan data contoh. Pelajari fitur dengan cepat.',
  },
  {
    icon: Search,
    title: 'Cari di Riwayat',
    desc: 'Filter invoice berdasarkan nomor atau nama pelanggan. Hasil filter real-time.',
  },
]

export default function PanduanPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-background to-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:py-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Template & Panduan <span className="text-primary">WISA</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Pelajari cara menggunakan semua fitur dan pilih template yang sesuai dengan usaha Anda.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="#template"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                <Sparkles className="h-4 w-4" />
                Lihat Template
              </Link>
              <Link
                href="#fitur"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Panduan Fitur
              </Link>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section id="template" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">Template Invoice</h2>
          <p className="mb-8 text-muted-foreground">
            Pilih template yang paling sesuai dengan jenis usaha Anda. Semua template bisa diubah warna aksennya.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <div key={t.id} className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="mb-3 flex aspect-[3/4] items-center justify-center rounded-lg bg-muted/50 p-4 text-center text-xs text-muted-foreground">
                  <div className="space-y-2">
                    <div className="mx-auto h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">{t.name}</p>
                    <p className="max-w-[200px]">{t.desc}</p>
                  </div>
                </div>
                <h3 className="font-semibold">{t.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground italic">
                  Cocok untuk: {t.best}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/invoice"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <Sparkles className="h-4 w-4" />
              Coba Template di Invoice Baru
            </Link>
          </div>
        </section>

        {/* Features */}
        <section id="fitur" className="border-t bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <h2 className="mb-2 text-2xl font-bold tracking-tight">Panduan Fitur</h2>
            <p className="mb-8 text-muted-foreground">
              Semua fitur tersedia tanpa login. Data disimpan di browser Anda.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-lg border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{f.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">Cara Mulai</h2>
          <p className="mb-8 text-muted-foreground">
            Buat invoice pertama Anda dalam 5 menit.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Isi Data Bisnis', desc: 'Nama, alamat, kontak, dan logo usaha Anda.' },
              { step: '2', title: 'Tambah Pelanggan', desc: 'Data pelanggan atau pilih dari kontak tersimpan.' },
              { step: '3', title: 'Input Jasa & Harga', desc: 'Tambah layanan, atur quantity, harga, diskon, dan pajak.' },
              { step: '4', title: 'Download / Cetak', desc: 'Preview real-time, download PDF/PNG, atau cetak langsung.' },
            ].map((s) => (
              <div key={s.step} className="rounded-lg border bg-card p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/invoice"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Buat Invoice Sekarang
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 WISA — Website Invoice & Service Application. Dibuat untuk UMKM jasa Indonesia.</p>
        </footer>
      </main>
    </>
  )
}
