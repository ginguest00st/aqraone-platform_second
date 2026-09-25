import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Sidebar from "../../components/ui/Sidebar";
import StatCard from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/Badge";
import {
  IconDashboard, IconStore, IconPackage, IconCreditCard, IconBarChart,
  IconLogout, IconBell, IconArrowRight, IconSearch,
} from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";
import { productService, type ProductDetail } from "../../services/product.service";

const sidebarItems = [
  { to: "/umkm/dashboard",    label: "Dashboard",        icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store",        label: "Profil Toko",      icon: <IconStore className="w-4 h-4" /> },
  { to: "/umkm/products",     label: "Produk",           icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/products/add", label: "Tambah Produk",    icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi",        icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/umkm/history",      label: "Riwayat",          icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/umkm/report",       label: "Laporan",          icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login",             label: "Keluar",           icon: <IconLogout className="w-4 h-4" /> },
];

const dailySales = [
  { day: "Sen", sales: 185000 },
  { day: "Sel", sales: 240000 },
  { day: "Rab", sales: 195000 },
  { day: "Kam", sales: 310000 },
  { day: "Jum", sales: 420000 },
  { day: "Sab", sales: 380000 },
  { day: "Min", sales: 150000 },
];

const monthlySales = [
  { month: "Apr", sales: 3200000 },
  { month: "Mei", sales: 4100000 },
  { month: "Jun", sales: 3800000 },
  { month: "Jul", sales: 5200000 },
  { month: "Agu", sales: 4600000 },
  { month: "Sep", sales: 5800000 },
];

const topProducts = [
  { name: "Keripik Pisang", value: 45 },
  { name: "Keripik Tempe",  value: 28 },
  { name: "Kripik Singkong",value: 17 },
  { name: "Lainnya",        value: 10 },
];

const PALETTE = ["#C9A227", "#1A1714", "#EDD882", "#E8E6E1"];

import { orderService, type Order } from "../../services/order.service";

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

const tooltipStyle = {
  backgroundColor: "#1A1714",
  border: "none",
  borderRadius: 10,
  fontSize: 12,
  color: "#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};

export default function UMKMDashboardPage() {
  const { user, profile, logout } = useAuth();
  const [umkm, setUmkm] = useState<UmkmWithCategory | null>(null);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>(() => orderService.getUmkmOrders("ALL").slice(0, 5));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUMKM() {
      if (!user) return;
      try {
        const { data: uData } = await umkmService.getUmkmByUserId(user.id);
        if (uData) {
          setUmkm(uData);
          const { data: pData } = await productService.getProductsByUmkm(uData.id);
          if (pData) setProducts(pData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUMKM();

    // Muat pesanan dari database
    orderService.fetchOrdersFromDatabase().then((orders) => {
      setRecentOrders(orders.slice(0, 5));
    });

    const unsubscribe = orderService.subscribe((orders) => {
      setRecentOrders(orders.slice(0, 5));
    });

    return () => unsubscribe();
  }, [user]);

  const activeProductsCount = products.filter(p => p.status === "AKTIF").length;

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden" data-figma-layer="UMKMDashboard">
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
              <p className="text-[10px] text-white/40 tracking-wide">UMKM Panel</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header data-figma-layer="UMKMHeader"
          className="bg-white border-b border-[#E8E6E1] px-6 py-3.5 flex items-center justify-between"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
        >
          <div>
            <h1 className="text-[15px] font-bold text-[#1A1714]">Dashboard UMKM</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[11px] text-[#ABA9A4]">{umkm?.nama_toko || profile?.nama || "Toko Anda"}</p>
              {umkm?.status_verifikasi === "APPROVED" && (
                <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Terverifikasi
                </span>
              )}
              {umkm?.status_verifikasi === "PENDING" && (
                <span className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> Menunggu Verifikasi
                </span>
              )}
              {umkm?.status_verifikasi === "REJECTED" && (
                <span className="flex items-center gap-1 text-[10px] text-rose-700 font-semibold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Verifikasi Ditolak
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ABA9A4] w-3.5 h-3.5" />
              <input placeholder="Cari..." className="border border-[#E8E6E1] bg-[#FAFAF8] rounded-[10px] pl-8 pr-4 py-2 text-[12px] outline-none focus:border-[#C9A227] w-40" />
            </div>
            <button className="relative p-2 hover:bg-[#F5F4F1] rounded-[10px] text-[#7C7770]">
              <IconBell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C0392B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <div className="w-9 h-9 bg-[#FDF6E3] border-2 border-[#C9A227] rounded-full flex items-center justify-center text-[#C9A227] font-bold text-[13px]">
              {umkm?.nama_toko?.[0]?.toUpperCase() || profile?.nama?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Banner Jika Status Toko Belum Disetujui */}
          {umkm && umkm.status_verifikasi === "PENDING" && (
            <div className="bg-amber-50 border border-amber-200 rounded-[18px] p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-lg shrink-0">
                  ⏳
                </div>
                <div>
                  <h3 className="font-bold text-[14px] text-amber-900">Toko Anda Sedang Menunggu Verifikasi Admin</h3>
                  <p className="text-[12px] text-amber-700 mt-1 max-w-2xl leading-relaxed">
                    Pendaftaran toko Anda sedang dalam antrean verifikasi oleh Super Admin. Anda sudah bisa melengkapi profil toko dan menambahkan katalog produk sekarang. Toko dan produk Anda akan langsung tampil di marketplace setelah disetujui.
                  </p>
                </div>
              </div>
              <Link to="/umkm/products/add">
                <button className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shrink-0 transition-colors">
                  + Buat Produk
                </button>
              </Link>
            </div>
          )}

          {umkm && umkm.status_verifikasi === "REJECTED" && (
            <div className="bg-rose-50 border border-rose-200 rounded-[18px] p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-lg shrink-0">
                ✕
              </div>
              <div>
                <h3 className="font-bold text-[14px] text-rose-900">Verifikasi Toko Anda Belum Disetujui</h3>
                <p className="text-[12px] text-rose-700 mt-1">
                  Catatan Admin: <span className="font-semibold">{umkm.catatan_verifikasi || "Data pendaftaran toko belum lengkap."}</span>
                </p>
                <Link to="/umkm/store" className="inline-block mt-2 text-xs font-bold text-rose-800 hover:underline">
                  Perbaiki Data Profil Toko →
                </Link>
              </div>
            </div>
          )}

          {/* Stat Cards */}
          <div data-figma-layer="StatGrid" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard label="Total Produk"   value={loading ? "..." : String(products.length)} icon="📦" accent />
            <StatCard label="Produk Aktif"   value={loading ? "..." : String(activeProductsCount)} icon="✅" iconBg="bg-emerald-50" />
            <StatCard label="Pesanan Baru"   value="0"       icon="🛎️" iconBg="bg-sky-50" />
            <StatCard label="Diproses"       value="0"       icon="⚙️" iconBg="bg-orange-50" />
            <StatCard label="Produk Terjual" value="0"       icon="🏆" />
            <StatCard label="Total Penjualan"value="Rp0"      icon="💰" />
          </div>

          {/* Charts row 1 */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* 7-Day Area */}
            <div data-figma-layer="Chart7Day" className="md:col-span-2 bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-[14px] text-[#1A1714]">Penjualan 7 Hari Terakhir</h3>
                  <p className="text-[11px] text-[#ABA9A4]">Sen – Min pekan ini</p>
                </div>
                <span className="text-[11px] bg-[#FDF6E3] text-[#A07C10] font-semibold px-2.5 py-1 rounded-full">+0%</span>
              </div>
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={dailySales}>
                  <defs>
                    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C9A227" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip formatter={(v) => [formatRp(Number(v)), "Penjualan"]} contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="sales" stroke="#C9A227" strokeWidth={2} fill="url(#goldGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Products Donut */}
            <div data-figma-layer="ChartTopProducts" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="mb-4">
                <h3 className="font-semibold text-[14px] text-[#1A1714]">Produk Terlaris</h3>
                <p className="text-[11px] text-[#ABA9A4]">Berdasarkan volume</p>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={topProducts} dataKey="value" cx="50%" cy="50%" outerRadius={58} innerRadius={35} paddingAngle={3}>
                    {topProducts.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`, ""]} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PALETTE[i] }} />
                    <span className="text-[11px] text-[#7C7770] flex-1 truncate">{p.name}</span>
                    <span className="text-[11px] font-bold text-[#1A1714]">{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Bar */}
          <div data-figma-layer="ChartMonthly" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-[14px] text-[#1A1714]">Penjualan Bulanan</h3>
                <p className="text-[11px] text-[#ABA9A4]">Tahun 2026</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthlySales} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#ABA9A4" }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000000}jt`} />
                <Tooltip formatter={(v) => [formatRp(Number(v)), "Penjualan"]} contentStyle={tooltipStyle} cursor={{ fill: "#F5F4F1" }} />
                <Bar dataKey="sales" fill="#C9A227" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Orders */}
          <div data-figma-layer="RecentOrders" className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-[14px] text-[#1A1714]">Pesanan Terbaru</h3>
                <p className="text-[11px] text-[#ABA9A4]">Aktivitas pesanan toko Anda</p>
              </div>
              <Link to="/umkm/transactions" className="text-[12px] text-[#C9A227] font-semibold hover:underline flex items-center gap-1">
                Lihat Semua <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentOrders.map(order => (
                <Link key={order.id} to={`/umkm/transactions/${order.id}`}>
                  <div data-figma-layer="OrderRow"
                    className="flex items-center gap-4 p-4 bg-[#FAFAF8] border border-[#E8E6E1] rounded-[14px] hover:border-[#C9A227] hover:bg-[#FDF6E3] transition-all cursor-pointer mb-2"
                  >
                    <div className="w-10 h-10 bg-[#1A1714] rounded-[12px] flex items-center justify-center text-white font-bold text-[11px] shrink-0 font-mono">
                      {order.id.slice(-3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1A1714]">{order.customer}</p>
                      <p className="text-[11px] text-[#ABA9A4] truncate">{order.items[0]?.name || "Produk UMKM"}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-[#1A1714]">{formatRp(order.total)}</p>
                      <StatusBadge status={order.orderStatus} type="order" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
