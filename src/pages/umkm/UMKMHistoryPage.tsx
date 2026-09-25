import { useState, useEffect } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Tabs from "../../components/ui/Tabs";
import Table from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { Input } from "../../components/ui/Input";
import { IconDashboard, IconPackage, IconBarChart, IconLogout } from "../../components/ui/Icons";
import { orderService, Order } from "../../services/order.service";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

export default function UMKMHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  const loadHistory = () => {
    const all = orderService.getUmkmOrders("ALL");
    // Riwayat transaksi: pesanan yang telah SELESAI atau DIBATALKAN (atau semua jika demo)
    setOrders(all);
  };

  useEffect(() => {
    loadHistory();

    orderService.fetchOrdersFromDatabase().then(() => {
      loadHistory();
    });

    const unsubscribe = orderService.subscribe(() => {
      loadHistory();
    });

    return () => unsubscribe();
  }, []);

  const doneCount = orders.filter((o) => o.orderStatus === "SELESAI").length;
  const cancelledCount = orders.filter((o) => o.orderStatus === "DIBATALKAN").length;

  const tabs = [
    { id: "all", label: "Semua Riwayat", count: orders.length },
    { id: "done", label: "Selesai", count: doneCount },
    { id: "cancelled", label: "Dibatalkan", count: cancelledCount },
  ];

  const filtered = orders.filter((o) => {
    if (activeTab === "done" && o.orderStatus !== "SELESAI") return false;
    if (activeTab === "cancelled" && o.orderStatus !== "DIBATALKAN") return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCust = o.customer.toLowerCase().includes(q);
      const matchUmkm = o.umkm.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchId || matchCust || matchUmkm || matchItem;
    }
    return true;
  });

  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (r: Order) => (
        <Link to={`/umkm/transactions/${r.id}`} className="font-mono text-xs font-bold text-[#C9A227] hover:underline">
          {r.id}
        </Link>
      ),
    },
    { key: "date", header: "Tanggal", render: (r: Order) => <span className="text-xs text-[#7C7770]">{r.date}</span> },
    {
      key: "customer",
      header: "Pelanggan",
      render: (r: Order) => (
        <div>
          <p className="font-semibold text-xs text-[#1A1714]">{r.customer}</p>
          <p className="text-[10px] text-[#7C7770]">{r.umkm}</p>
        </div>
      ),
    },
    {
      key: "product",
      header: "Produk",
      render: (r: Order) => (
        <span className="text-xs text-[#1A1714]">
          {r.items[0]?.name || "Produk"}
          {r.items.length > 1 ? ` (+${r.items.length - 1})` : ""}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (r: Order) => <span className="font-semibold text-xs text-[#1A1714]">{formatRp(r.total)}</span>,
    },
    {
      key: "payStatus",
      header: "Pembayaran",
      render: (r: Order) => <StatusBadge status={r.payStatus} type="payment" />,
    },
    {
      key: "orderStatus",
      header: "Status Pesanan",
      render: (r: Order) => <StatusBadge status={r.orderStatus} type="order" />,
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: Order) => (
        <Link to={`/umkm/transactions/${r.id}`}>
          <Button size="sm" variant="secondary" className="text-xs py-1 px-2.5">
            Detail
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar
        items={sidebarItems}
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
        <PanelHeader
          title="Riwayat Transaksi"
          subtitle={`${filtered.length} pesanan tercatat dari database`}
          avatarLabel="U"
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={doneCount}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Cari order ID, pelanggan, atau produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<span>🔍</span>}
              className="flex-1"
            />
          </div>
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] overflow-hidden shadow-xs">
            <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <div className="p-4 overflow-x-auto">
              {filtered.length > 0 ? (
                <Table columns={columns} data={filtered} />
              ) : (
                <div className="text-center py-12 text-[#7C7770]">
                  <p className="text-3xl mb-2">📋</p>
                  <p className="font-medium text-sm">Tidak ada riwayat transaksi pada filter ini</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
