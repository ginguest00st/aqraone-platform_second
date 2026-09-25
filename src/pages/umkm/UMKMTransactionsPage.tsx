import { useState, useEffect } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { IconDashboard, IconStore, IconPackage, IconBarChart, IconLogout } from "../../components/ui/Icons";
import { orderService, Order, OrdStatus } from "../../services/order.service";

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

function formatRp(n: number) { return "Rp" + n.toLocaleString("id-ID"); }

// Nama/ID UMKM aktif. "ALL" = tampilkan semua (demo mode).
const ACTIVE_UMKM = "ALL";

export default function UMKMTransactionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = () => {
    const allOrders = orderService.getUmkmOrders(ACTIVE_UMKM);
    // Halaman Transaksi hanya tampilkan pesanan yang masih aktif
    const activeOrders = allOrders.filter(
      (o) => o.orderStatus !== "SELESAI" && o.orderStatus !== "DIBATALKAN"
    );
    setOrders(activeOrders);
  };

  useEffect(() => {
    loadOrders();
    // Poll setiap 3 detik agar pesanan baru dari customer langsung muncul
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // Statistik dinamis
  const countStatus = (s: OrdStatus) => orders.filter((o) => o.orderStatus === s).length;
  const jumlahBaru = countStatus("BARU");
  const jumlahDiproses = countStatus("DIPROSES");
  const jumlahDikirim = countStatus("DIKIRIM");
  const pendapatanHariIni = orders
    .filter((o) => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today && o.payStatus === "PAID";
    })
    .reduce((sum, o) => sum + o.total, 0);

  const tabFilters = [
    { id: "all", label: "Semua", count: orders.length },
    { id: "BARU", label: "Pesanan Baru", count: jumlahBaru, dot: "bg-amber-400" },
    { id: "DIPROSES", label: "Diproses", count: jumlahDiproses, dot: "bg-sky-400" },
    { id: "DIKIRIM", label: "Dikirim", count: jumlahDikirim, dot: "bg-blue-400" },
  ];

  const filtered = activeTab === "all" ? orders : orders.filter((o) => o.orderStatus === activeTab);

  const handleProses = (orderId: string) => {
    setUpdating(orderId);
    setTimeout(() => {
      orderService.updateOrderStatus(orderId, "DIPROSES");
      loadOrders();
      setUpdating(null);
    }, 600);
  };

  const handleKirim = (orderId: string, tracking?: string) => {
    setUpdating(orderId);
    setTimeout(() => {
      orderService.updateOrderStatus(orderId, "DIKIRIM", tracking || `JNE-${Date.now().toString().slice(-8)}`);
      loadOrders();
      setUpdating(null);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar items={sidebarItems} logo={umkmLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Transaksi Masuk"
          subtitle={`${orders.length} pesanan aktif`}
          avatarLabel="U"
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={jumlahBaru}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Mini stat strip */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Pesanan Baru", value: String(jumlahBaru), color: "border-l-amber-400", bg: "bg-amber-50" },
              { label: "Diproses", value: String(jumlahDiproses), color: "border-l-sky-400", bg: "bg-sky-50" },
              { label: "Dikirim", value: String(jumlahDikirim), color: "border-l-blue-400", bg: "bg-blue-50" },
              {
                label: "Pendapatan Hari Ini",
                value: pendapatanHariIni > 0 ? `Rp${Math.round(pendapatanHariIni / 1000)}rb` : "Rp0",
                color: "border-l-[#C9A227]",
                bg: "bg-[#FDF6E3]",
              },
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
                  <img
                    src={order.items[0]?.image || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=80&h=80&fit=crop&auto=format"}
                    alt=""
                    className="w-16 h-16 rounded-[14px] object-cover shrink-0 border border-[#E8E6E1]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-[11px] text-[#ABA9A4] font-mono">{order.id}</p>
                        <p className="text-[14px] font-semibold text-[#1A1714] mt-0.5">
                          {order.items[0]?.name || "Produk"}
                          {order.items.length > 1 && (
                            <span className="text-[#ABA9A4] font-normal text-[12px]"> +{order.items.length - 1} produk lain</span>
                          )}
                          <span className="text-[#ABA9A4] font-normal"> ×{order.items[0]?.qty || 1}</span>
                        </p>
                        <p className="text-[12px] text-[#7C7770] mt-0.5">Pelanggan: <span className="font-semibold text-[#1A1714]">{order.customer}</span></p>
                        <p className="text-[11px] text-[#ABA9A4] mt-0.5">{order.date} · {order.time}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <StatusBadge status={order.payStatus} type="payment" />
                        <StatusBadge status={order.orderStatus} type="order" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EEE9]">
                      <div>
                        <p className="text-[18px] font-bold text-[#1A1714] font-display">{formatRp(order.total)}</p>
                        <p className="text-[10px] text-[#ABA9A4]">{order.courier}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/umkm/transactions/${order.id}`}>
                          <Button size="sm" variant="secondary">Lihat Detail</Button>
                        </Link>
                        {order.orderStatus === "BARU" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleProses(order.id)}
                            disabled={updating === order.id}
                          >
                            {updating === order.id ? "Memproses..." : "Proses Pesanan"}
                          </Button>
                        )}
                        {order.orderStatus === "DIPROSES" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleKirim(order.id, order.trackingNumber)}
                            disabled={updating === order.id}
                          >
                            {updating === order.id ? "Mengirim..." : "Kirim Sekarang"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[18px] border border-[#E8E6E1]">
                <p className="text-4xl mb-3">📫</p>
                <p className="text-[14px] font-semibold text-[#1A1714]">Tidak ada pesanan aktif</p>
                <p className="text-[12px] text-[#ABA9A4] mt-1">
                  {activeTab === "all"
                    ? "Belum ada pesanan masuk. Pesanan baru dari customer akan muncul di sini."
                    : "Belum ada pesanan dengan status ini"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
