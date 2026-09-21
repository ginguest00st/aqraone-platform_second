import Button from "../../components/ui/Button";
import { Badge, StatusBadge } from "../../components/ui/Badge";
import { Input, Select, Checkbox } from "../../components/ui/Input";
import StatCard from "../../components/ui/StatCard";
import Tabs from "../../components/ui/Tabs";
import { useState } from "react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold text-[#202020] mb-1">{title}</h2>
    <div className="h-px bg-[#E5E5E5] mb-4" />
    {children}
  </div>
);

const Swatch = ({ color, label, hex }: { color: string; label: string; hex: string }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="w-16 h-16 rounded-2xl border border-[#E5E5E5] shadow-sm" style={{ background: hex }} />
    <span className="text-xs font-medium text-[#202020]">{label}</span>
    <span className="text-xs text-[#6B6B6B] font-mono">{hex}</span>
  </div>
);

export default function DesignSystemPage() {
  const [tab, setTab] = useState("buttons");

  return (
    <div className="min-h-screen bg-[#F8F8F6] py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202020]">AqraOne Design System</h1>
          </div>
          <p className="text-sm text-[#6B6B6B]">Komponen UI dan panduan desain platform AqraOne</p>
        </div>

        <Section title="Warna">
          <div className="flex flex-wrap gap-5">
            <Swatch color="" label="Primary Gold" hex="#D4AF37" />
            <Swatch color="" label="Dark Gold" hex="#B8860B" />
            <Swatch color="" label="Light Gold" hex="#F4D77D" />
            <Swatch color="" label="Soft Gold" hex="#FFF5D6" />
            <Swatch color="" label="Background" hex="#F8F8F6" />
            <Swatch color="" label="White" hex="#FFFFFF" />
            <Swatch color="" label="Dark Text" hex="#202020" />
            <Swatch color="" label="Secondary" hex="#6B6B6B" />
            <Swatch color="" label="Border" hex="#E5E5E5" />
            <Swatch color="" label="Success" hex="#2E8B57" />
            <Swatch color="" label="Warning" hex="#E6A700" />
            <Swatch color="" label="Danger" hex="#D9534F" />
            <Swatch color="" label="Info" hex="#3B82F6" />
          </div>
        </Section>

        <Section title="Tipografi">
          <div className="space-y-3">
            <div><p className="text-3xl font-bold text-[#202020]">Heading 1 — Poppins Bold 700</p><span className="text-xs text-[#6B6B6B]">3xl / 700</span></div>
            <div><p className="text-2xl font-bold text-[#202020]">Heading 2 — Poppins Bold</p><span className="text-xs text-[#6B6B6B]">2xl / 700</span></div>
            <div><p className="text-xl font-semibold text-[#202020]">Heading 3 — Poppins SemiBold</p><span className="text-xs text-[#6B6B6B]">xl / 600</span></div>
            <div><p className="text-base font-medium text-[#202020]">Body Medium — Poppins Medium</p><span className="text-xs text-[#6B6B6B]">base / 500</span></div>
            <div><p className="text-sm text-[#202020]">Body Regular — Poppins Regular</p><span className="text-xs text-[#6B6B6B]">sm / 400</span></div>
            <div><p className="text-xs text-[#6B6B6B]">Caption — Poppins Regular Muted</p><span className="text-xs text-[#6B6B6B]">xs / 400</span></div>
          </div>
        </Section>

        <Section title="Tombol">
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline-gold">Outline Gold</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center mb-4">
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="sm">Small</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" loading>Loading...</Button>
            <Button variant="primary" icon="🛒">Tambah ke Keranjang</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Badge & Status">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="gold">Terlaris</Badge>
            <Badge variant="new">Baru</Badge>
            <Badge variant="hot">Hot</Badge>
            <Badge variant="success">Aktif</Badge>
            <Badge variant="muted">Nonaktif</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-[#6B6B6B] self-center mr-1">Payment:</span>
            {(["PENDING", "PROCESSING", "PAID", "FAILED", "EXPIRED", "REFUNDED"] as const).map(s => (
              <StatusBadge key={s} status={s} type="payment" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-[#6B6B6B] self-center mr-1">Order:</span>
            {(["BARU", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"] as const).map(s => (
              <StatusBadge key={s} status={s} type="order" />
            ))}
          </div>
        </Section>

        <Section title="Form Input">
          <div className="grid grid-cols-2 gap-4 max-w-xl">
            <Input label="Nama Lengkap" placeholder="Masukkan nama..." required />
            <Input label="Email" placeholder="email@example.com" type="email" />
            <Input label="Search" placeholder="Cari produk..." icon={<span>🔍</span>} />
            <Select label="Kategori" options={[{ value: "", label: "Pilih kategori" }, { value: "makanan", label: "Makanan" }, { value: "fashion", label: "Fashion" }]} />
            <div className="col-span-2">
              <Checkbox label="Saya setuju dengan syarat dan ketentuan" checked={false} onChange={() => {}} />
            </div>
          </div>
        </Section>

        <Section title="StatCard">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Produk" value="12.480" icon="📦" trend={{ value: "8%", up: true }} />
            <StatCard label="Total UMKM" value="2.310" icon="🏪" iconBg="bg-blue-50" />
            <StatCard label="Pendapatan" value="Rp382jt" icon="💰" trend={{ value: "18%", up: true }} />
            <StatCard label="Transaksi Gagal" value="108" icon="❌" iconBg="bg-red-50" trend={{ value: "3%", up: false }} />
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs tabs={[
            { key: "buttons", label: "Buttons" },
            { key: "badges", label: "Badges", count: 6 },
            { key: "forms", label: "Forms" },
          ]} active={tab} onChange={setTab} />
        </Section>

        <Section title="Kartu">
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-[#FFF5D6] to-[#F4D77D] flex items-center justify-center text-4xl">📦</div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="gold">Terlaris</Badge>
                  </div>
                  <h3 className="font-semibold text-[#202020] text-sm mb-0.5">Produk Contoh {i}</h3>
                  <p className="text-xs text-[#6B6B6B] mb-2">Nama UMKM · ⭐ 4.8 (120)</p>
                  <p className="text-base font-bold text-[#D4AF37]">Rp125.000</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div className="text-center text-xs text-[#6B6B6B] mt-10 pb-8">
          AqraOne Design System v1.0 — © 2026 AqraOne Platform
        </div>
      </div>
    </div>
  );
}
