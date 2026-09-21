import { Link } from "react-router";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../../components/ui/Sidebar";
import StatCard from "../../components/ui/StatCard";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const dailyData = [
  { day: "10 Sep", revenue: 125000 },
  { day: "11 Sep", revenue: 180000 },
  { day: "12 Sep", revenue: 95000 },
  { day: "13 Sep", revenue: 240000 },
  { day: "14 Sep", revenue: 310000 },
  { day: "15 Sep", revenue: 420000 },
];

const weeklyData = [
  { week: "W1 Sep", revenue: 1200000 },
  { week: "W2 Sep", revenue: 1800000 },
  { week: "W3 Sep", revenue: 1500000 },
  { week: "W4 Sep", revenue: 2100000 },
];

const topProducts = [
  { name: "Keripik Pisang Original", sold: 145, revenue: 3625000 },
  { name: "Keripik Tempe Pedas", sold: 89, revenue: 1780000 },
  { name: "Kripik Singkong Premium", sold: 52, revenue: 936000 },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

export default function UMKMReportPage() {
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
            <p className="text-[10px] text-white/40 tracking-wide">UMKM Panel</p>
          </div>
        </div>
      } />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Laporan Penjualan"
          subtitle="Naraya Snack · Ringkasan performa Sep 2026"
          avatarLabel="N"
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={3}
          actions={<Button variant="primary" size="sm">Export Laporan</Button>}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Penjualan" value="Rp6,6jt" icon="💰" trend={{ value: "15%", up: true }} />
            <StatCard label="Produk Terjual" value="286" icon="📦" trend={{ value: "8%", up: true }} />
            <StatCard label="Total Transaksi" value="124" icon="📋" trend={{ value: "12%", up: true }} />
            <StatCard label="Produk Terlaris" value="Keripik Pisang" icon="🏆" iconBg="bg-yellow-50" />
          </div>

          {/* Daily Chart */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">Penjualan Harian</h2>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip formatter={(v: any) => [formatRp(Number(v) || 0), "Revenue"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Bar */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">Penjualan Mingguan</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000000}jt`} />
                <Tooltip formatter={(v: any) => [formatRp(Number(v) || 0), "Revenue"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Table */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5">
            <h2 className="font-semibold text-[#1A1714] mb-4">Produk Terlaris</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E6E1]">
                  <th className="text-left py-2 text-xs font-semibold text-[#6B6B6B] uppercase">Produk</th>
                  <th className="text-right py-2 text-xs font-semibold text-[#6B6B6B] uppercase">Terjual</th>
                  <th className="text-right py-2 text-xs font-semibold text-[#6B6B6B] uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {topProducts.map((p, i) => (
                  <tr key={p.name}>
                    <td className="py-3 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-[#D4AF37]" : i === 1 ? "bg-[#6B6B6B]" : "bg-[#B8860B]"}`}>{i + 1}</span>
                      {p.name}
                    </td>
                    <td className="py-3 text-right font-semibold">{p.sold}</td>
                    <td className="py-3 text-right font-semibold text-[#C9A227]">{formatRp(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
