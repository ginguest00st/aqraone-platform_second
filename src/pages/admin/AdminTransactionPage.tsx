import { useState } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { Input, Select } from "../../components/ui/Input";
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

type PayStatus = "PENDING" | "PAID" | "PROCESSING" | "FAILED" | "EXPIRED";
type OrdStatus = "BARU" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

interface Transaction {
  id: string; customer: string; umkm: string; total: number;
  payment: string; payStatus: PayStatus; orderStatus: OrdStatus; date: string;
}

const transactions: Transaction[] = [
  { id: "TRX-20260915-001", customer: "Siti Rahayu", umkm: "Naraya Snack", total: 125000, payment: "Finnet", payStatus: "PAID", orderStatus: "DIPROSES", date: "15 Sep 2026" },
  { id: "TRX-20260914-002", customer: "Budi Santoso", umkm: "Batik Nusantara", total: 185000, payment: "Virtual Account", payStatus: "PAID", orderStatus: "DIKIRIM", date: "14 Sep 2026" },
  { id: "TRX-20260913-003", customer: "Dewi Lestari", umkm: "Gayo Coffee", total: 75000, payment: "E-Wallet", payStatus: "PENDING", orderStatus: "BARU", date: "13 Sep 2026" },
  { id: "TRX-20260912-004", customer: "Ahmad Fauzi", umkm: "Rattan Craft", total: 145000, payment: "Finnet", payStatus: "FAILED", orderStatus: "DIBATALKAN", date: "12 Sep 2026" },
  { id: "TRX-20260911-005", customer: "Rina Susanti", umkm: "Silver Bali", total: 95000, payment: "Bank Transfer", payStatus: "PAID", orderStatus: "SELESAI", date: "11 Sep 2026" },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

export default function AdminTransactionPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { key: "id", header: "Transaction ID", render: (r: Transaction) => <span className="font-mono text-xs text-[#D4AF37]">{r.id}</span> },
    { key: "customer", header: "Customer" },
    { key: "umkm", header: "UMKM", render: (r: Transaction) => <span className="text-[#D4AF37] font-medium">{r.umkm}</span> },
    { key: "total", header: "Total", render: (r: Transaction) => <span className="font-semibold">{formatRp(r.total)}</span> },
    { key: "payment", header: "Pembayaran" },
    { key: "payStatus", header: "Payment Status", render: (r: Transaction) => <StatusBadge status={r.payStatus} type="payment" /> },
    { key: "orderStatus", header: "Order Status", render: (r: Transaction) => <StatusBadge status={r.orderStatus} type="order" /> },
    { key: "date", header: "Tanggal" },
    {
      key: "action", header: "Aksi",
      render: () => <Button size="sm" variant="outline-gold">Detail</Button>
    },
  ];

  const adminLogo = (
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
  );

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar items={sidebarItems} logo={adminLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Monitoring Transaksi"
          subtitle="Semua transaksi platform · 15 September 2026"
          avatarLabel="SA"
          notifCount={5}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Summary mini-cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Transaksi", value: "2.450", sub: "bulan ini", color: "bg-[#1A1714]", textColor: "text-white", subColor: "text-white/50" },
              { label: "Berhasil (Paid)", value: "2.310", sub: "+12% dari bulan lalu", color: "bg-emerald-50", textColor: "text-emerald-700", subColor: "text-emerald-500" },
              { label: "Pending", value: "87", sub: "menunggu pembayaran", color: "bg-amber-50", textColor: "text-amber-700", subColor: "text-amber-500" },
              { label: "Gagal / Expired", value: "53", sub: "perlu penanganan", color: "bg-red-50", textColor: "text-red-700", subColor: "text-red-400" },
            ].map(s => (
              <div key={s.label} className={`${s.color} rounded-[16px] px-5 py-4 border border-black/5`}>
                <p className={`text-[11px] font-medium ${s.subColor ?? s.textColor} opacity-70`}>{s.label}</p>
                <p className={`text-[22px] font-bold ${s.textColor} mt-1 font-display`}>{s.value}</p>
                <p className={`text-[10px] ${s.subColor ?? s.textColor} mt-0.5`}>{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div className="flex gap-3 flex-wrap mb-4">
              <Input placeholder="Cari transaction ID atau customer..." value={search} onChange={e => setSearch(e.target.value)} icon={<span>🔍</span>} className="flex-1 min-w-48" />
              <Select options={[
                { value: "", label: "Semua Status" },
                { value: "PENDING", label: "Pending" },
                { value: "PAID", label: "Paid" },
                { value: "PROCESSING", label: "Processing" },
                { value: "FAILED", label: "Failed" },
                { value: "EXPIRED", label: "Expired" },
              ]} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} />
              <input type="date" className="border border-[#E8E6E1] rounded-[10px] px-3 py-2 text-sm outline-none focus:border-[#C9A227] bg-[#FAFAF8]" />
              <input type="date" className="border border-[#E8E6E1] rounded-[10px] px-3 py-2 text-sm outline-none focus:border-[#C9A227] bg-[#FAFAF8]" />
            </div>
            <Table columns={columns} data={transactions} />
          </div>
        </main>
      </div>
    </div>
  );
}
