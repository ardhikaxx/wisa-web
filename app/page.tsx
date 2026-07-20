import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/invoice/navbar'
import { FileText, Eye, Download, Shield, Zap, Building2 } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <Zap className="h-3.5 w-3.5" />
                Gratis &bull; Tanpa Login &bull; Langsung Pakai
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Buat Invoice Jasa Profesional{' '}
                <span className="text-primary">Tanpa Login</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Generator invoice gratis untuk UMKM bidang jasa. Isi data bisnis,
                tambahkan layanan, lihat preview real-time, dan download PDF —
                semua tanpa perlu daftar akun.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/invoice"
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80 w-full sm:w-auto"
                >
                  Buat Invoice Sekarang
                  <FileText className="h-5 w-5" />
                </Link>
                <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                  <Eye className="h-5 w-5" />
                  Lihat Contoh
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Gratis & Tanpa Login',
                desc: 'Tidak perlu registrasi, verifikasi email, atau biaya bulanan. Buka website dan langsung buat invoice.',
              },
              {
                icon: Eye,
                title: 'Preview Real-Time',
                desc: 'Setiap perubahan langsung terlihat di preview. Pilih template Modern, Minimal, Profesional, atau Kreatif.',
              },
              {
                icon: Download,
                title: 'Download PDF',
                desc: 'Invoice siap diunduh dalam format PDF ukuran A4 yang rapi dan profesional, siap dikirim ke pelanggan.',
              },
              {
                icon: Building2,
                title: 'Cocok untuk Semua Bisnis Jasa',
                desc: 'Desain grafis, fotografi, servis elektronik, laundry, salon, konsultasi, WO, dan berbagai jasa lainnya.',
              },
              {
                icon: Shield,
                title: 'Data Tetap di Perangkat Anda',
                desc: 'Semua data diproses di browser. Tidak ada yang dikirim ke server. Privasi Anda tetap terjaga.',
              },
              {
                icon: FileText,
                title: 'Riwayat Invoice Lokal',
                desc: 'Invoice tersimpan di browser. Buka kembali, duplikasi, atau hapus sesuai kebutuhan.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Siap Membuat Invoice?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Ribuan pelaku UMKM jasa sudah menggunakan WISA. Mulai sekarang,
              gratis.
            </p>
            <Link
              href="/invoice"
              className="mt-6 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium whitespace-nowrap text-primary-foreground transition-all hover:bg-primary/80"
            >
              Buat Invoice Sekarang
              <FileText className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>&copy; 2026 WISA — Website Invoice & Service Application. Dibuat untuk UMKM jasa Indonesia.</p>
      </footer>
    </>
  )
}
