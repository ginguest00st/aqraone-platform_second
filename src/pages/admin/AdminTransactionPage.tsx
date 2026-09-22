import { useState, useEffect } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { Input, Select } from "../../components/ui/Input";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";
import { supabase } from "../../lib/supabase";

const sidebarItems = [
  { to: "/admin", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/admin/admins", label: "Manajemen User", icon: <IconAdmin className="w-4 h-4" /> },
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

const defaultTransactions: Transaction[] = [
  { id: "ORD-20260920-MULYA-001", customer: "Andi Pratama", umkm: "Mulya Snack & Heritage", total: 116000, payment: "QRIS", payStatus: "PAID", orderStatus: "SELESAI", date: "20 Sep 2026" },
  { id: "ORD-20260921-MULYA-002", customer: "Siti Rahayu", umkm: "Mulya Snack & Heritage", total: 80000, payment: "VA BCA", payStatus: "PAID", orderStatus: "DIKIRIM", date: "21 Sep 2026" },
  { id: "ORD-20260921-BATIK-003", customer: "Andi Pratama", umkm: "Batik Danar Solo", total: 203000, payment: "VA BRI", payStatus: "PAID", orderStatus: "DIPROSES", date: "21 Sep 2026" },
  { id: "ORD-20260922-GAYO-004", customer: "Siti Rahayu", umkm: "Gayo Mountain Coffee", total: 174000, payment: "QRIS", payStatus: "PAID", orderStatus: "SELESAI", date: "22 Sep 2026" },
  { id: "ORD-20260922-RATTAN-005", customer: "Andi Pratama", umkm: "Lombok Craft & Rattan", total: 167000, payment: "VA Mandiri", payStatus: "PENDING", orderStatus: "BARU", date: "22 Sep 2026" },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

export default function AdminTransactionPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            total_harga,
            status_order,
            created_at,
            umkm (nama_toko),
            profiles:customer_id (nama),
            payments (payment_method, payment_status)
          `)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const mapped: Transaction[] = data.map((o: any) => ({
            id: o.order_number || `ORD-${o.id.slice(0, 8).toUpperCase()}`,
            customer: o.profiles?.nama || "Pelanggan",
            umkm: o.umkm?.nama_toko || "Mulya Snack & Heritage",
            total: Number(o.total_harga) || 0,
            payment: (o.payments?.payment_method || "Finnet").replace("FINNET_", "").replace("_", " "),
            payStatus: (o.payments?.payment_status || "PENDING") as PayStatus,
            orderStatus: (o.status_order === "COMPLETED" ? "SELESAI" : o.status_order === "SHIPPED" ? "DIKIRIM" : o.status_order === "PROCESSING" ? "DIPROSES" : "BARU") as OrdStatus,
            date: new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          }));
          setDbTransactions(mapped);
        }
      } catch (err) {
        console.error("Transactions load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const allTx = dbTransactions.length > 0 ? dbTransactions : defaultTransactions;
  const filtered = allTx.filter((t) => {
    if (statusFilter && t.payStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.umkm.toLowerCase().includes(q);
    }
    return true;
  });

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
              { label: "Total Transaksi", value: String(allTx.length), sub: "keseluruhan", color: "bg-[#1A1714]", textColor: "text-white", subColor: "text-white/50" },
              { label: "Berhasil (Paid)", value: String(allTx.filter(t => t.payStatus === "PAID").length), sub: "sukses diverifikasi", color: "bg-emerald-50", textColor: "text-emerald-700", subColor: "text-emerald-500" },
              { label: "Pending", value: String(allTx.filter(t => t.payStatus === "PENDING").length), sub: "menunggu pembayaran", color: "bg-amber-50", textColor: "text-amber-700", subColor: "text-amber-500" },
              { label: "Gagal / Expired", value: String(allTx.filter(t => t.payStatus === "FAILED" || t.payStatus === "EXPIRED").length), sub: "dibatalkan", color: "bg-red-50", textColor: "text-red-700", subColor: "text-red-400" },
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
            </div>
            <Table columns={columns} data={filtered} />
          </div>
        </main>
      </div>
    </div>
  );
}
