import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Timeline from "../../components/ui/Timeline";
import { StatusBadge } from "../../components/ui/Badge";
import { formatRp } from "../../components/ui/ProductCard";

const orderTimeline = [
  { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "15 Sep 2026 · 14:30", status: "done" as const },
  { label: "Pembayaran Berhasil", desc: "Dibayar via Finnet", date: "15 Sep 2026 · 14:31", status: "done" as const },
  { label: "Pesanan Diproses", desc: "Naraya Snack sedang menyiapkan pesanan", date: "15 Sep 2026 · 15:00", status: "active" as const },
  { label: "Pesanan Dikirim", desc: "Estimasi tiba 18 Sep 2026", date: "—", status: "pending" as const },
  { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan", date: "—", status: "pending" as const },
];

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-4">
          <Link to="/orders" className="hover:text-[#D4AF37]">Pesanan Saya</Link>
          <span>/</span>
          <span className="text-[#202020] font-medium">TRX-20260914-001</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#202020]">Detail Pesanan</h1>
          <div className="flex gap-2">
            <StatusBadge status="PAID" type="payment" />
            <StatusBadge status="DIPROSES" type="order" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-5">
            {/* Products */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <h2 className="font-semibold text-[#202020] mb-4">📦 Produk</h2>
              {[
                { name: "Keripik Pisang Original", umkm: "Naraya Snack", variant: "L · Hitam", qty: 2, price: 25000, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop&auto=format" },
                { name: "Kopi Arabika Gayo Aceh", umkm: "Gayo Coffee", variant: "250gr", qty: 1, price: 75000, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop&auto=format" },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-4 py-3 border-b border-[#E5E5E5] last:border-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-[#F8F8F6]" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#202020]">{item.name}</p>
                    <p className="text-xs text-[#D4AF37]">{item.umkm}</p>
                    <p className="text-xs text-[#6B6B6B]">{item.variant} · x{item.qty}</p>
                  </div>
                  <p className="text-sm font-bold">{formatRp(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <h2 className="font-semibold text-[#202020] mb-4">💳 Informasi Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Metode Pembayaran", value: "Finnet" },
                  { label: "Transaction ID", value: "TRX-20260914-001" },
                  { label: "Status Pembayaran", value: "PAID" },
                  { label: "Tanggal Bayar", value: "15 Sep 2026 · 14:31" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#F8F8F6] rounded-xl p-3">
                    <p className="text-xs text-[#6B6B6B] mb-1">{label}</p>
                    <p className="font-semibold text-[#202020]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <h2 className="font-semibold text-[#202020] mb-4">🚚 Informasi Pengiriman</h2>
              <div className="space-y-2 text-sm">
                <div><span className="text-[#6B6B6B]">Alamat: </span><span className="text-[#202020] font-medium">Jl. Merdeka No. 45, Bandung 40115</span></div>
                <div><span className="text-[#6B6B6B]">Kurir: </span><span className="text-[#202020] font-medium">JNE Regular</span></div>
                <div><span className="text-[#6B6B6B]">Nomor Resi: </span><span className="text-[#D4AF37] font-medium">JNE-20260915-001234</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <h2 className="font-semibold text-[#202020] mb-4">📋 Status Pesanan</h2>
              <Timeline steps={orderTimeline} />
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
              <h2 className="font-semibold text-[#202020] mb-3">Ringkasan Harga</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal</span><span>{formatRp(125000)}</span></div>
                <div className="flex justify-between text-[#6B6B6B]"><span>Ongkir</span><span>{formatRp(15000)}</span></div>
                <div className="flex justify-between font-bold text-[#202020] pt-2 border-t border-[#E5E5E5]"><span>Total</span><span>{formatRp(140000)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
