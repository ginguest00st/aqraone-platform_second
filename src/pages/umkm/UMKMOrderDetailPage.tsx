import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Timeline from "../../components/ui/Timeline";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const orderTimeline = [
  { label: "Pesanan Baru", desc: "Pesanan diterima dari customer", date: "15 Sep 2026 · 14:30", status: "done" as const },
  { label: "Diproses", desc: "Pesanan sedang disiapkan", date: "15 Sep 2026 · 15:00", status: "active" as const },
  { label: "Dikirim", desc: "Paket diserahkan ke kurir", date: "—", status: "pending" as const },
  { label: "Selesai", desc: "Pesanan diterima customer", date: "—", status: "pending" as const },
];

export default function UMKMOrderDetailPage() {
  return (
    <div className="flex h-screen bg-[#F8F8F6] overflow-hidden">
      <Sidebar items={sidebarItems} logo={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C9A227] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.35)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[13px] text-white">Aqra<span className="text-[#C9A227]">One</span></p>
            <p className="text-[10px] text-white/40 tracking-wide">UMKM Panel</p>
          </div>
        </div>
      } />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#202020]">Detail Transaksi</h1>
            <p className="text-xs text-[#6B6B6B]">ORD-20260915-001</p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status="PAID" type="payment" />
            <StatusBadge status="DIPROSES" type="order" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-5">
              {/* Customer */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                <h2 className="font-semibold text-[#202020] mb-3">👤 Informasi Customer</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-[#6B6B6B]">Nama: </span><strong>Siti Rahayu</strong></div>
                  <div><span className="text-[#6B6B6B]">HP: </span><strong>0812-1234-5678</strong></div>
                  <div className="col-span-2"><span className="text-[#6B6B6B]">Alamat: </span><strong>Jl. Sudirman No. 5, Jakarta Selatan 12190</strong></div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                <h2 className="font-semibold text-[#202020] mb-3">📦 Produk</h2>
                <div className="flex items-center gap-4 py-2">
                  <img src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&h=80&fit=crop&auto=format" alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Keripik Pisang Original</p>
                    <p className="text-xs text-[#6B6B6B]">Varian: L · Hitam · x2</p>
                  </div>
                  <p className="font-bold">{formatRp(50000)}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                <h2 className="font-semibold text-[#202020] mb-3">💳 Pembayaran</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-[#6B6B6B]">Metode: </span><strong>Finnet</strong></div>
                  <div><span className="text-[#6B6B6B]">Status: </span><strong className="text-[#2E8B57]">PAID</strong></div>
                  <div className="flex justify-between col-span-2 pt-2 border-t border-[#E5E5E5]">
                    <span className="text-[#6B6B6B]">Total</span>
                    <strong className="text-base">{formatRp(65000)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                <h2 className="font-semibold text-[#202020] mb-3">Status Pesanan</h2>
                <Timeline steps={orderTimeline} />
              </div>
              <Button variant="primary" size="lg" className="w-full justify-center">Proses Pesanan</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
