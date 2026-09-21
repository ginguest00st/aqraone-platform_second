import { Link } from "react-router";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../../components/ui/Sidebar";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";

const sidebarItems = [
  { to: "/admin", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/admin/admins", label: "Admin", icon: <IconAdmin className="w-4 h-4" /> },
  { to: "/admin/umkm", label: "UMKM", icon: <IconStore className="w-4 h-4" /> },
  { to: "/admin/umkm/verify", label: "Verifikasi UMKM", icon: <IconShield className="w-4 h-4" /> },
  { to: "/admin/categories", label: "Kategori", icon: <IconFolder className="w-4 h-4" /> },
  { to: "/admin/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/admin/transactions", label: "Transaksi", icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/admin/reports", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const revenueData = [
  { month: "Apr", revenue: 42000000, harian: 1400000 },
  { month: "Mei", revenue: 58000000, harian: 1870000 },
  { month: "Jun", revenue: 51000000, harian: 1700000 },
  { month: "Jul", revenue: 68000000, harian: 2193000 },
  { month: "Agu", revenue: 75000000, harian: 2419000 },
  { month: "Sep", revenue: 88000000, harian: 2933000 },
];

function formatRp(n: number) {
  if (n >= 1000000) return `Rp${(n / 1000000).toFixed(1)}jt`;
  return "Rp" + n.toLocaleString("id-ID");
}

export default function AdminReportPage() {
  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
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
            <p className="text-[10px] text-white/40 tracking-wide">Admin Panel</p>
          </div>
        </div>
      } />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Laporan Platform"
          subtitle="Ringkasan performa penjualan & pertumbuhan UMKM"
          avatarLabel="SA"
          notifCount={5}
          actions={
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Export Excel</Button>
              <Button variant="primary" size="sm">Export PDF</Button>
            </div>
          }
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Laporan Transaksi */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">📋 Laporan Transaksi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Transaksi" value="2.450" icon="💳" />
              <StatCard label="Berhasil" value="2.280" icon="✅" iconBg="bg-green-50" trend={{ value: "93%", up: true }} />
              <StatCard label="Gagal" value="108" icon="❌" iconBg="bg-red-50" />
              <StatCard label="Pending" value="62" icon="⏳" iconBg="bg-yellow-50" />
            </div>
          </div>

          {/* Laporan Pendapatan */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">💰 Laporan Pendapatan</h2>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <StatCard label="Total Revenue" value="Rp382jt" icon="💰" trend={{ value: "18%", up: true }} />
              <StatCard label="Revenue Harian" value="Rp2,9jt" icon="📅" iconBg="bg-blue-50" />
              <StatCard label="Revenue Bulanan" value="Rp88jt" icon="📆" iconBg="bg-blue-50" trend={{ value: "17%", up: true }} />
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000000}jt`} />
                <Tooltip formatter={(v: any) => [formatRp(Number(v) || 0), "Revenue"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Laporan UMKM */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">🏪 Laporan UMKM</h2>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="UMKM Aktif" value="2.310" icon="✅" iconBg="bg-green-50" />
              <StatCard label="UMKM Baru (bulan ini)" value="72" icon="🆕" iconBg="bg-blue-50" trend={{ value: "12", up: true }} />
              <StatCard label="UMKM Terverifikasi" value="2.280" icon="🏅" />
            </div>
          </div>

          {/* Laporan Produk */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">📦 Laporan Produk</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <StatCard label="Produk Terlaris" value="Keripik Pisang" icon="🏆" iconBg="bg-yellow-50" />
                  <StatCard label="Stok Rendah" value="124" icon="⚠️" iconBg="bg-orange-50" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1714] mb-3">Top 5 Produk Terlaris</h3>
                <div className="space-y-2">
                  {[
                    { name: "Keripik Pisang Original", sold: 145 },
                    { name: "Batik Tulis Parang", sold: 98 },
                    { name: "Kopi Arabika Gayo", sold: 87 },
                    { name: "Tas Anyam Rotan", sold: 76 },
                    { name: "Gelang Perak Bali", sold: 64 },
                  ].map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#C9A227] w-4">{i + 1}</span>
                      <div className="flex-1 bg-[#FAFAF8] rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-[#D4AF37] rounded-full transition-all" style={{ width: `${(p.sold / 145) * 100}%` }} />
                      </div>
                      <span className="text-xs text-[#6B6B6B] w-8 text-right">{p.sold}</span>
                      <span className="text-xs text-[#1A1714] font-medium w-40 truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
