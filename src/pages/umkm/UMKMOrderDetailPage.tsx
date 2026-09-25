import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Timeline from "../../components/ui/Timeline";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";
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

export default function UMKMOrderDetailPage() {
  const { id: orderId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(() => {
    return orderId ? orderService.getOrderById(orderId) : null;
  });
  const [updating, setUpdating] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) { setNotFound(true); return; }

    const refreshOrder = () => {
      const found = orderService.getOrderById(orderId);
      if (found) {
        setOrder({ ...found });
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    };

    refreshOrder();

    // Fetch database asli
    orderService.fetchOrdersFromDatabase().then(() => {
      refreshOrder();
    });

    // Berlangganan event sinkronisasi real-time
    const unsubscribe = orderService.subscribe(() => {
      refreshOrder();
    });

    return () => {
      unsubscribe();
    };
  }, [orderId]);

  const handleUpdateStatus = async (newStatus: "DIPROSES" | "DIKIRIM" | "SELESAI") => {
    if (!order) return;
    setUpdating(true);
    const tracking = newStatus === "DIKIRIM" ? (order.trackingNumber && order.trackingNumber !== "—" ? order.trackingNumber : `JNE-${Date.now().toString().slice(-8)}`) : undefined;
    const updated = await orderService.updateOrderStatus(order.id, newStatus, tracking);
    if (updated) {
      setOrder({ ...updated });
    }
    setUpdating(false);
  };

  if (notFound) {
    return (
      <div className="flex h-screen bg-[#F8F8F6] overflow-hidden">
        <Sidebar items={sidebarItems} logo={umkmLogo} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-5xl">📭</p>
          <p className="text-[18px] font-bold text-[#1A1714]">Pesanan tidak ditemukan</p>
          <p className="text-[13px] text-[#7C7770]">ID: {orderId}</p>
          <Button variant="primary" size="md" onClick={() => navigate("/umkm/transactions")}>
            Kembali ke Transaksi
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen bg-[#F8F8F6] overflow-hidden">
        <Sidebar items={sidebarItems} logo={umkmLogo} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#7C7770]">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  const timelineSteps = order.timeline.map((t) => ({
    label: t.label,
    desc: t.desc,
    date: t.date,
    status: t.status,
  }));

  return (
    <div className="flex h-screen bg-[#F8F8F6] overflow-hidden">
      <Sidebar items={sidebarItems} logo={umkmLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E8E6E1] px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Link to="/umkm/transactions" className="text-[12px] text-[#7C7770] hover:text-[#C9A227] transition-colors">
                ← Transaksi
              </Link>
            </div>
            <h1 className="text-lg font-bold text-[#1A1714]">Detail Pesanan</h1>
            <p className="text-xs text-[#7C7770] font-mono">{order.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.payStatus} type="payment" />
            <StatusBadge status={order.orderStatus} type="order" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
            {/* Kolom Kiri: Detail Pelanggan & Barang */}
            <div className="lg:col-span-2 space-y-6">
              {/* Info Pelanggan */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-3 flex items-center gap-2">
                  <span>👤</span> Informasi Customer
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#7C7770]">Nama Pelanggan</p>
                    <p className="font-semibold text-[#1A1714] mt-0.5">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7C7770]">Nomor HP</p>
                    <p className="font-semibold text-[#1A1714] mt-0.5">{order.customerPhone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-[#7C7770]">Alamat Pengiriman</p>
                    <p className="font-medium text-[#1A1714] mt-0.5 leading-relaxed">{order.shippingAddress}</p>
                  </div>
                  {order.shippingNotes && (
                    <div className="md:col-span-2 pt-2 border-t border-[#F0EEE9]">
                      <p className="text-xs text-[#7C7770]">Catatan Pembeli</p>
                      <p className="italic text-[#7C7770] mt-0.5 text-xs">{order.shippingNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Produk Dipesan */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-4 flex items-center gap-2">
                  <span>📦</span> Produk Dipesan
                </h2>
                <div className="divide-y divide-[#F0EEE9]">
                  {order.items.map((item) => (
                    <div key={item.id || item.productId} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-[#E8E6E1] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A1714] text-sm truncate">{item.name}</p>
                        <p className="text-xs text-[#7C7770] mt-0.5">{item.variant} · ×{item.qty}</p>
                        <p className="text-xs text-[#C9A227]">{item.umkm || order.umkm}</p>
                      </div>
                      <p className="font-bold text-[#1A1714] text-sm shrink-0">
                        {formatRp(item.subtotal || item.price * item.qty)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rincian Pembayaran */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-3 flex items-center gap-2">
                  <span>💳</span> Ringkasan Pembayaran
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#7C7770]">
                    <span>Metode</span>
                    <span className="font-medium text-[#1A1714]">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#7C7770]">
                    <span>No. Referensi</span>
                    <span className="font-mono text-xs text-[#1A1714]">{order.paymentRef}</span>
                  </div>
                  <div className="flex justify-between text-[#7C7770]">
                    <span>Subtotal Produk</span>
                    <span className="font-medium text-[#1A1714]">{formatRp(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#7C7770]">
                    <span>Ongkos Kirim ({order.courier})</span>
                    <span className="font-medium text-[#1A1714]">{formatRp(order.shippingCost)}</span>
                  </div>
                  {order.platformFee > 0 && (
                    <div className="flex justify-between text-[#7C7770]">
                      <span>Biaya Platform</span>
                      <span className="font-medium text-[#1A1714]">{formatRp(order.platformFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base text-[#1A1714] pt-2 border-t border-[#F0EEE9]">
                    <span>Total Dibayar</span>
                    <span className="text-[#C9A227]">{formatRp(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Info Pengiriman */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-3 flex items-center gap-2">
                  <span>🚚</span> Info Pengiriman
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#7C7770]">Kurir</p>
                    <p className="font-semibold text-[#1A1714] mt-0.5">{order.courier}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#7C7770]">Layanan</p>
                    <p className="font-semibold text-[#1A1714] mt-0.5">{order.courierService || "Reguler"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-[#7C7770]">Nomor Resi</p>
                    <p className="font-mono font-bold text-[#C9A227] mt-0.5">
                      {order.trackingNumber && order.trackingNumber !== "—" ? order.trackingNumber : "Belum diterbitkan"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Status & Kelola */}
            <div className="space-y-6">
              {/* Status Timeline */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-3">Status Pesanan</h2>
                <Timeline steps={timelineSteps} />
              </div>

              {/* Tombol Aksi UMKM */}
              <div className="bg-white rounded-2xl border border-[#E8E6E1] p-5 space-y-3 shadow-xs">
                <h2 className="font-semibold text-[#1A1714] mb-1">Kelola Pesanan</h2>
                {order.orderStatus === "BARU" && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => handleUpdateStatus("DIPROSES")}
                    disabled={updating}
                  >
                    {updating ? "Memproses..." : "✅ Proses Pesanan"}
                  </Button>
                )}
                {order.orderStatus === "DIPROSES" && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center"
                    onClick={() => handleUpdateStatus("DIKIRIM")}
                    disabled={updating}
                  >
                    {updating ? "Mengupdate..." : "🚚 Tandai Dikirim"}
                  </Button>
                )}
                {order.orderStatus === "DIKIRIM" && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleUpdateStatus("SELESAI")}
                    disabled={updating}
                  >
                    {updating ? "Menyelesaikan..." : "🎉 Selesaikan Pesanan"}
                  </Button>
                )}
                {order.orderStatus === "SELESAI" && (
                  <div className="text-center py-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700 font-semibold text-sm">✅ Pesanan Selesai</p>
                  </div>
                )}
                <Link to="/umkm/transactions" className="block">
                  <Button variant="secondary" size="md" className="w-full justify-center mt-1">
                    Kembali ke Daftar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
