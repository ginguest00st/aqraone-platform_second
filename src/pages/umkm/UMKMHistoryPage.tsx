import { useState } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Tabs from "../../components/ui/Tabs";
import Table from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { Input } from "../../components/ui/Input";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const tabs = [
  { id: "all", label: "Semua", count: 12 },
  { id: "done", label: "Selesai", count: 9 },
  { id: "cancelled", label: "Dibatalkan", count: 3 },
];

const history = [
  { id: "ORD-20260901-001", date: "1 Sep 2026", customer: "Budi Santoso", product: "Keripik Pisang x3", total: 75000, payStatus: "PAID" as const, orderStatus: "SELESAI" as const },
  { id: "ORD-20260825-003", date: "25 Agu 2026", customer: "Dewi Lestari", product: "Keripik Tempe x2", total: 40000, payStatus: "PAID" as const, orderStatus: "SELESAI" as const },
  { id: "ORD-20260820-007", date: "20 Agu 2026", customer: "Ahmad Fauzi", product: "Kripik Singkong x1", total: 18000, payStatus: "FAILED" as const, orderStatus: "DIBATALKAN" as const },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

export default function UMKMHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const columns = [
    { key: "id", header: "Order ID", render: (r: typeof history[0]) => <span className="font-mono text-xs text-[#C9A227]">{r.id}</span> },
    { key: "date", header: "Tanggal" },
    { key: "customer", header: "Customer" },
    { key: "product", header: "Produk" },
    { key: "total", header: "Total", render: (r: typeof history[0]) => <span className="font-semibold">{formatRp(r.total)}</span> },
    { key: "payStatus", header: "Payment", render: (r: typeof history[0]) => <StatusBadge status={r.payStatus} type="payment" /> },
    { key: "orderStatus", header: "Order", render: (r: typeof history[0]) => <StatusBadge status={r.orderStatus} type="order" /> },
  ];

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
          title="Riwayat Transaksi"
          subtitle="Naraya Snack · Semua pesanan selesai & dibatalkan"
          avatarLabel="N"
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={3}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-3">
            <Input placeholder="Cari order ID atau customer..." value={search} onChange={e => setSearch(e.target.value)} icon={<span>🔍</span>} className="flex-1" />
            <input type="date" className="border border-[#E8E6E1] rounded-[10px] px-3 py-2 text-sm outline-none focus:border-[#C9A227] bg-[#FAFAF8]" />
            <input type="date" className="border border-[#E8E6E1] rounded-[10px] px-3 py-2 text-sm outline-none focus:border-[#C9A227] bg-[#FAFAF8]" />
          </div>
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] overflow-hidden" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <div className="p-4">
              <Table columns={columns} data={history} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
