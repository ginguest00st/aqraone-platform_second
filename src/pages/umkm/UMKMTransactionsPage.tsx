import { useState } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { IconDashboard, IconStore, IconPackage, IconCreditCard, IconBarChart, IconLogout } from "../../components/ui/Icons";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store", label: "Profil Toko", icon: <IconStore className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const umkmLogo = (
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
);

type PayStatus = "PAID" | "PENDING" | "FAILED";
type OrdStatus = "BARU" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

interface Order {
  id: string; customer: string; product: string; qty: number; total: number;
  date: string; payStatus: PayStatus; orderStatus: OrdStatus; image: string;
}

const orders: Order[] = [
  { id: "ORD-20260915-001", customer: "Siti Rahayu", product: "Keripik Pisang Original", qty: 2, total: 50000, date: "15 Sep 2026 · 14:30", payStatus: "PAID", orderStatus: "BARU", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&h=80&fit=crop&auto=format" },
  { id: "ORD-20260914-005", customer: "Budi Santoso", product: "Keripik Tempe Pedas", qty: 3, total: 60000, date: "14 Sep 2026 · 11:20", payStatus: "PAID", orderStatus: "DIPROSES", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop&auto=format" },
  { id: "ORD-20260913-003", customer: "Dewi Lestari", product: "Kripik Singkong Premium", qty: 1, total: 18000, date: "13 Sep 2026 · 09:45", payStatus: "PAID", orderStatus: "DIKIRIM", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=80&h=80&fit=crop&auto=format" },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

const tabFilters: { id: string; label: string; count: number; dot?: string }[] = [
  { id: "all", label: "Semua", count: 8 },
  { id: "BARU", label: "Pesanan Baru", count: 3, dot: "bg-amber-400" },
  { id: "DIPROSES", label: "Diproses", count: 2, dot: "bg-sky-400" },
  { id: "DIKIRIM", label: "Dikirim", count: 3, dot: "bg-blue-400" },
];

export default function UMKMTransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = activeTab === "all" ? orders : orders.filter(o => o.orderStatus === activeTab);

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar items={sidebarItems} logo={umkmLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Transaksi Masuk"
          subtitle="Naraya Snack · 8 pesanan aktif hari ini"
          avatarLabel="N"
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={3}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Mini stat strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Pesanan Baru", value: "3", color: "border-l-amber-400", bg: "bg-amber-50" },
              { label: "Diproses", value: "2", color: "border-l-sky-400", bg: "bg-sky-50" },
              { label: "Dikirim", value: "3", color: "border-l-blue-400", bg: "bg-blue-50" },
              { label: "Pendapatan Hari Ini", value: "Rp128rb", color: "border-l-[#C9A227]", bg: "bg-[#FDF6E3]" },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border border-black/5 border-l-4 ${s.color} rounded-[14px] px-4 py-3`}>
                <p className="text-[10px] text-[#7C7770] font-medium">{s.label}</p>
                <p className="text-[20px] font-bold text-[#1A1714] font-display mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Tab filter */}
          <div className="flex gap-2">
            {tabFilters.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12px] font-medium border transition-all ${
                  activeTab === t.id
                    ? "bg-[#C9A227] text-white border-[#C9A227]"
                    : "bg-white border-[#E8E6E1] text-[#7C7770] hover:border-[#C9A227]"
                }`}
              >
                {t.dot && <span className={`w-2 h-2 rounded-full ${activeTab === t.id ? "bg-white" : t.dot}`} />}
                {t.label}
                <span className={`ml-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-white/20 text-white" : "bg-[#F0EEE9] text-[#7C7770]"}`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Order cards */}
          <div className="space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-[18px] border border-[#E8E6E1] p-5 hover:border-[#C9A227] hover:shadow-[0_4px_16px_rgba(201,162,39,0.08)] transition-all"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div className="flex items-start gap-4">
                  <img src={order.image} alt="" className="w-16 h-16 rounded-[14px] object-cover shrink-0 border border-[#E8E6E1]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-[11px] text-[#ABA9A4] font-mono">{order.id}</p>
                        <p className="text-[14px] font-semibold text-[#1A1714] mt-0.5">{order.product} <span className="text-[#ABA9A4] font-normal">×{order.qty}</span></p>
                        <p className="text-[12px] text-[#7C7770] mt-0.5">Pelanggan: <span className="font-semibold text-[#1A1714]">{order.customer}</span></p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <StatusBadge status={order.payStatus} type="payment" />
                        <StatusBadge status={order.orderStatus} type="order" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EEE9]">
                      <div>
                        <p className="text-[18px] font-bold text-[#1A1714] font-display">{formatRp(order.total)}</p>
                        <p className="text-[10px] text-[#ABA9A4]">{order.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/umkm/transactions/${order.id}`}>
                          <Button size="sm" variant="secondary">Lihat Detail</Button>
                        </Link>
                        {order.orderStatus === "BARU" && (
                          <Button size="sm" variant="primary">Proses Pesanan</Button>
                        )}
                        {order.orderStatus === "DIPROSES" && (
                          <Button size="sm" variant="primary">Kirim Sekarang</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[18px] border border-[#E8E6E1]">
                <p className="text-[14px] font-semibold text-[#1A1714]">Tidak ada pesanan</p>
                <p className="text-[12px] text-[#ABA9A4] mt-1">Belum ada pesanan dengan status ini</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
