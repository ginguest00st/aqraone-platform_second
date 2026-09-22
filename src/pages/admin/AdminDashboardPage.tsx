import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar from "../../components/ui/Sidebar";
import StatCard from "../../components/ui/StatCard";
import {
  IconDashboard, IconAdmin, IconStore, IconShield, IconFolder,
  IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout,
  IconBell, IconSearch, IconCheck, IconArrowRight,
} from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";
import { productService, type ProductWithUmkm } from "../../services/product.service";
import { userService } from "../../services/user.service";
import { supabase } from "../../lib/supabase";

const sidebarItems = [
  { to: "/admin",             label: "Dashboard",       icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/admin/admins",      label: "Manajemen User",  icon: <IconAdmin className="w-4 h-4" /> },
  { to: "/admin/umkm",        label: "UMKM",            icon: <IconStore className="w-4 h-4" /> },
  { to: "/admin/umkm/verify", label: "Verifikasi UMKM", icon: <IconShield className="w-4 h-4" /> },
  { to: "/admin/categories",  label: "Kategori",        icon: <IconFolder className="w-4 h-4" /> },
  { to: "/admin/products",    label: "Produk",          icon: <IconPackage className="w-4 h-4" /> },
  { to: "/admin/transactions",label: "Transaksi",       icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/admin/reports",     label: "Laporan",         icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login",             label: "Settings",        icon: <IconSettings className="w-4 h-4" /> },
  { to: "/login",             label: "Keluar",          icon: <IconLogout className="w-4 h-4" /> },
];

const monthlyTransactions = [
  { month: "Apr", count: 1200, revenue: 42000000 },
  { month: "Mei", count: 1580, revenue: 58000000 },
  { month: "Jun", count: 1420, revenue: 51000000 },
  { month: "Jul", count: 1890, revenue: 68000000 },
  { month: "Agu", count: 2100, revenue: 75000000 },
  { month: "Sep", count: 2450, revenue: 88000000 },
];

const umkmGrowth = [
  { month: "Apr", count: 10 },
  { month: "Mei", count: 18 },
  { month: "Jun", count: 25 },
  { month: "Jul", count: 32 },
  { month: "Agu", count: 40 },
  { month: "Sep", count: 48 },
];

const topProducts = [
  { name: "Keripik Pisang", value: 35 },
  { name: "Batik Tulis",    value: 25 },
  { name: "Kopi Arabika",   value: 20 },
  { name: "Lainnya",        value: 20 },
];

const PALETTE = ["#C9A227", "#1A1714", "#EDD882", "#E8E6E1"];

function formatRp(n: number) {
  if (n >= 1000000) return `Rp${(n / 1000000).toFixed(1)}jt`;
  return "Rp" + n.toLocaleString("id-ID");
}

const tooltipStyle = {
  backgroundColor: "#1A1714",
  border: "none",
  borderRadius: 10,
  fontSize: 12,
  color: "#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};

export default function AdminDashboardPage() {
  const { profile, logout } = useAuth();
  const [allUmkm, setAllUmkm] = useState<UmkmWithCategory[]>([]);
  const [allProducts, setAllProducts] = useState<ProductWithUmkm[]>([]);
  const [pendingList, setPendingList] = useState<UmkmWithCategory[]>([]);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [umkmRes, prodRes, pendingRes, statsRes, ordRes] = await Promise.all([
          umkmService.getAllUmkm(),
          productService.getAllProducts(),
          umkmService.getPendingUmkm(),
          userService.getUserStats(),
          supabase.from("orders").select("*", { count: "exact", head: true }),
        ]);

        if (umkmRes.data) setAllUmkm(umkmRes.data);
        if (prodRes.data) setAllProducts(prodRes.data);
        if (pendingRes.data) setPendingList(pendingRes.data);
        if (statsRes.data) setTotalCustomer(statsRes.data.customer);
        if (ordRes.count !== null && ordRes.count !== undefined) {
          setTotalTransactions(ordRes.count);
        }
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const totalUmkm = allUmkm.length;
  const approvedUmkm = allUmkm.filter((u) => u.status_verifikasi === "APPROVED").length;
  const pendingCount = pendingList.length;
  const totalProducts = allProducts.length;

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar
        items={sidebarItems}
        onItemClick={(item) => {
          if (item.to === "/login") logout();
        }}
        logo={
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
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header data-figma-layer="AdminHeader" className="bg-white border-b border-[#E8E6E1] px-6 py-3.5 flex items-center justify-between"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
          <div>
            <h1 className="text-[15px] font-bold text-[#1A1714]">Dashboard Admin</h1>
            <p className="text-[11px] text-[#ABA9A4]">Platform AqraOne · Selamat datang, <span className="text-[#C9A227] font-semibold">{profile?.nama || "Super Admin"}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ABA9A4] w-3.5 h-3.5" />
              <input placeholder="Cari..." className="border border-[#E8E6E1] bg-[#FAFAF8] rounded-[10px] pl-8 pr-4 py-2 text-[12px] outline-none focus:border-[#C9A227] w-44" />
            </div>
            <button className="relative p-2 hover:bg-[#F5F4F1] rounded-[10px] text-[#7C7770]">
              <IconBell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C0392B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{pendingCount}</span>
              )}
            </button>
            <div className="w-9 h-9 bg-[#1A1714] rounded-full flex items-center justify-center text-white font-bold text-[12px] ml-1">
              {profile?.nama?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Welcome Banner */}
          <div className="relative bg-[#1A1714] rounded-[24px] overflow-hidden p-8 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
            {/* Background image & gradient */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=1200&h=400&fit=crop&auto=format"
                alt="Admin Dashboard"
                className="w-full h-full object-cover mix-blend-overlay opacity-40 grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1714] via-[#1A1714]/80 to-[#C9A227]/20" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10">
              <p className="text-[12px] font-bold text-[#EDD882] tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-4 h-px bg-[#EDD882]" /> Admin Panel
              </p>
              <h2 className="text-[28px] md:text-[32px] font-bold text-white mb-2 font-display">
                Selamat Datang, {profile?.nama || "Super Admin"} 👋
              </h2>
              <p className="text-[14px] text-white/70 max-w-lg">
                Berikut adalah ringkasan ekosistem marketplace AqraOne yang terhubung langsung ke Supabase. Pantau verifikasi toko UMKM, kelola master kategori, dan awasi produk.
              </p>
            </div>
            
            {/* Date Widget */}
            <div className="relative z-10 hidden md:flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-[16px] border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
               <div className="w-12 h-12 rounded-full bg-[#C9A227] flex items-center justify-center text-white shadow-[0_2px_12px_rgba(201,162,39,0.4)]">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                 </svg>
               </div>
               <div>
                  <p className="text-[11px] text-[#EDD882] font-semibold uppercase tracking-wider mb-0.5">Status Sistem</p>
                  <p className="text-[16px] font-bold text-white">Supabase Connected</p>
               </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div data-figma-layer="StatGrid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard label="Total UMKM"      value={loading ? "..." : String(totalUmkm)}      icon="🏪" accent />
            <StatCard label="Total Customer"  value={loading ? "..." : String(totalCustomer)}  icon="👥" iconBg="bg-blue-50" />
            <StatCard label="UMKM Aktif"      value={loading ? "..." : String(approvedUmkm)}   icon="✅" iconBg="bg-emerald-50" />
            <StatCard label="Menunggu Verif"  value={loading ? "..." : String(pendingCount)}    icon="⏳" iconBg="bg-amber-50" />
            <StatCard label="Total Produk"    value={loading ? "..." : String(totalProducts)}  icon="📦" />
            <StatCard label="Total Transaksi" value={loading ? "..." : String(totalTransactions)} icon="💳" />
          </div>

          {/* Pending Verifications Widget */}
          <div data-figma-layer="PendingVerifications" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-[14px] text-[#1A1714]">UMKM Menunggu Verifikasi</h3>
                <p className="text-[11px] text-[#ABA9A4]">
                  {pendingCount === 0 ? "Tidak ada permohonan tertunda" : `${pendingCount} permohonan baru butuh review`}
                </p>
              </div>
              <Link to="/admin/umkm/verify" className="text-[12px] text-[#C9A227] font-semibold hover:underline flex items-center gap-1">
                Buka Panel Verifikasi <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingList.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-3">
                {pendingList.slice(0, 3).map((u) => (
                  <div key={u.id} data-figma-layer="VerifCard" className="flex items-center gap-3 p-4 bg-[#FAFAF8] border border-[#E8E6E1] rounded-[14px] hover:border-[#C9A227] hover:bg-[#FDF6E3] transition-all group">
                    <div className="w-10 h-10 bg-[#1A1714] rounded-[12px] flex items-center justify-center text-white font-bold text-[11px] shrink-0 group-hover:bg-[#C9A227] transition-colors">
                      {u.nama_toko?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1A1714] truncate">{u.nama_toko}</p>
                      <p className="text-[11px] text-[#ABA9A4] truncate">{u.kategori_umkm?.nama_kategori || "Umum"} · {new Date(u.created_at).toLocaleDateString("id-ID")}</p>
                    </div>
                    <Link to="/admin/umkm/verify" className="w-7 h-7 rounded-[8px] bg-[#FDF6E3] border border-[#EDD882] flex items-center justify-center text-[#C9A227] hover:bg-[#C9A227] hover:text-white hover:border-[#C9A227] transition-all shrink-0">
                      <IconCheck className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#8A8780] bg-[#FAFAF8] rounded-xl border border-dashed border-[#E8E6E1]">
                Semua pendaftaran UMKM telah diproses. Tidak ada permohonan yang menunggu persetujuan.
              </div>
            )}
          </div>

          {/* Charts row 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div data-figma-layer="ChartTransaksi" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-[14px] text-[#1A1714]">Transaksi Bulanan</h3>
                  <p className="text-[11px] text-[#ABA9A4]">Tahun 2026</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <BarChart data={monthlyTransactions} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F5F4F1" }} />
                  <Bar dataKey="count" fill="#C9A227" radius={[6, 6, 0, 0]} name="Transaksi" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div data-figma-layer="ChartRevenue" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-[14px] text-[#1A1714]">Pendapatan Platform</h3>
                  <p className="text-[11px] text-[#ABA9A4]">Finnet Digital Payment</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={monthlyTransactions}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C9A227" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000000}jt`} />
                  <Tooltip formatter={(v) => [formatRp(Number(v)), "Revenue"]} contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="revenue" stroke="#C9A227" strokeWidth={2} fill="url(#revGrad)" name="Revenue" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts row 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div data-figma-layer="ChartUMKMGrowth" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-[14px] text-[#1A1714]">Pertumbuhan UMKM</h3>
                  <p className="text-[11px] text-[#ABA9A4]">Tren Pendaftaran Mitra</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={umkmGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="#C9A227" strokeWidth={2.5} dot={{ fill: "#C9A227", r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} name="Mitra UMKM" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div data-figma-layer="ChartTopProducts" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="mb-5">
                <h3 className="font-semibold text-[14px] text-[#1A1714]">Kategori Terpopuler</h3>
                <p className="text-[11px] text-[#ABA9A4]">Berdasarkan sebaran produk UMKM</p>
              </div>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
                    <Pie data={topProducts} dataKey="value" cx="50%" cy="50%" outerRadius={62} innerRadius={38} paddingAngle={3}>
                      {topProducts.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
                    </Pie>
                    <Tooltip formatter={v => [`${v}%`, ""]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3 flex-1">
                  {topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i] }} />
                      <span className="text-[12px] text-[#7C7770] flex-1">{p.name}</span>
                      <span className="text-[12px] font-bold text-[#1A1714]">{p.value}%</span>
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
