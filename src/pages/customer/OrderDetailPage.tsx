import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Timeline from "../../components/ui/Timeline";
import { StatusBadge } from "../../components/ui/Badge";
import { formatRp } from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";
import { orderService, type Order } from "../../services/order.service";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(() => {
    return (id ? orderService.getOrderById(id) : null) || orderService.getAllOrders()[0] || null;
  });
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const refreshOrder = () => {
      const found = (id ? orderService.getOrderById(id) : null) || orderService.getAllOrders()[0] || null;
      if (found) setOrder({ ...found });
    };

    // 1. Muat awal
    refreshOrder();

    // 2. Fetch data asli dari database Supabase
    orderService.fetchOrdersFromDatabase().then(() => {
      refreshOrder();
    });

    // 3. Berlangganan perubahan real-time (saat UMKM atau Admin verifikasi/selesaikan pesanan)
    const unsubscribe = orderService.subscribe(() => {
      refreshOrder();
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleConfirmReceived = async () => {
    if (!order) return;
    setCompleting(true);
    await orderService.updateOrderStatus(order.id, "SELESAI");
    const updated = orderService.getOrderById(order.id);
    if (updated) setOrder({ ...updated });
    setCompleting(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F8F8F6]">
        <Navbar user={{ name: "Andi", role: "customer" }} />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <h1 className="text-xl font-bold text-[#202020]">Pesanan Tidak Ditemukan</h1>
          <p className="text-sm text-[#6B6B6B] mt-1 mb-6">
            ID pesanan yang Anda cari tidak terdaftar atau sedang dimuat dari database.
          </p>
          <Link to="/orders">
            <Button variant="primary" size="md">Kembali ke Pesanan Saya</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-4">
          <Link to="/orders" className="hover:text-[#D4AF37]">Pesanan Saya</Link>
          <span>/</span>
          <span className="text-[#202020] font-medium font-mono">{order.id}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#202020]">Detail Pesanan</h1>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              Invoice: <span className="font-mono text-[#D4AF37] font-semibold">{order.invoiceNo}</span> · Dibuat pada {order.date} pukul {order.time}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.payStatus} type="payment" />
            <StatusBadge status={order.orderStatus} type="order" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            {/* Products List */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#202020]">📦 Produk yang Dipesan</h2>
                <span className="text-xs font-semibold text-[#D4AF37] bg-[#FFF5D6] px-2.5 py-0.5 rounded-full">
                  Toko: {order.umkm}
                </span>
              </div>
              <div className="divide-y divide-[#F5F4F0]">
                {order.items.map((item) => (
                  <div key={item.id || item.productId} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#F8F8F6] border border-[#E8E6E1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#202020] truncate">{item.name}</p>
                      <p className="text-xs text-[#D4AF37] font-medium">{item.umkm || order.umkm}</p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variant} · x{item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-[#202020] shrink-0">
                      {formatRp(item.subtotal || item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <h2 className="font-semibold text-[#202020] mb-4">💳 Informasi Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Metode Pembayaran", value: order.paymentMethod },
                  { label: "Nomor Referensi", value: order.paymentRef },
                  { label: "Status Pembayaran", value: order.payStatus === "PAID" ? "LUNAS (PAID)" : order.payStatus },
                  { label: "Waktu Verifikasi", value: `${order.date} · ${order.time}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F8F8F6] rounded-xl p-3">
                    <p className="text-xs text-[#6B6B6B] mb-1">{label}</p>
                    <p className="font-semibold text-[#202020] text-xs truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <h2 className="font-semibold text-[#202020] mb-4">🚚 Informasi Pengiriman</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#6B6B6B] w-24 shrink-0">Penerima:</span>
                  <span className="text-xs font-semibold text-[#202020]">{order.customer} ({order.customerPhone})</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#6B6B6B] w-24 shrink-0">Alamat Lengkap:</span>
                  <span className="text-xs text-[#202020] leading-relaxed">{order.shippingAddress}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#6B6B6B] w-24 shrink-0">Kurir Pengiriman:</span>
                  <span className="text-xs font-semibold text-[#202020]">{order.courier}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#6B6B6B] w-24 shrink-0">Nomor Resi:</span>
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    {order.trackingNumber && order.trackingNumber !== "—" ? order.trackingNumber : "Menunggu penyerahan paket"}
                  </span>
                </div>
                {order.shippingNotes && (
                  <div className="flex items-start gap-2 pt-2 border-t border-[#F5F4F0]">
                    <span className="text-xs text-[#6B6B6B] w-24 shrink-0">Catatan:</span>
                    <span className="text-xs italic text-[#7C7770]">{order.shippingNotes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <h2 className="font-semibold text-[#202020] mb-4">📋 Status Pesanan</h2>
              <Timeline steps={order.timeline} />

              {/* Action Button untuk Customer jika barang sudah dikirim */}
              {order.orderStatus === "DIKIRIM" && (
                <div className="mt-4 pt-4 border-t border-[#F0EEE9]">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    loading={completing}
                    onClick={handleConfirmReceived}
                  >
                    Konfirmasi Pesanan Diterima
                  </Button>
                </div>
              )}
            </div>

            {/* Total Price Summary */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
              <h2 className="font-semibold text-[#202020] mb-3">Ringkasan Biaya</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal Produk</span>
                  <span>{formatRp(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Ongkos Kirim</span>
                  <span>{formatRp(order.shippingCost)}</span>
                </div>
                {order.platformFee > 0 && (
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Biaya Layanan Platform</span>
                    <span>{formatRp(order.platformFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-[#202020] pt-2.5 border-t border-[#E5E5E5] text-base">
                  <span>Total Tagihan</span>
                  <span className="text-[#C9A227]">{formatRp(order.total)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <Link to="/orders" className="block">
                  <Button variant="outline-gold" size="md" className="w-full justify-center">
                    ← Kembali ke Semua Pesanan
                  </Button>
                </Link>
                <Link to="/products" className="block">
                  <Button variant="secondary" size="md" className="w-full justify-center">
                    Belanja Produk Lainnya
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
