import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Tabs from "../../components/ui/Tabs";
import { StatusBadge } from "../../components/ui/Badge";
import { formatRp } from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";

const tabs = [
  { id: "all", label: "Semua", count: 8 },
  { id: "pending", label: "Menunggu Pembayaran", count: 1 },
  { id: "processing", label: "Diproses", count: 2 },
  { id: "delivered", label: "Selesai", count: 4 },
  { id: "cancelled", label: "Dibatalkan", count: 1 },
];

const orders = [
  { id: "TRX-001", date: "15 Sep 2026", product: "Keripik Pisang + 1 lainnya", umkm: "Naraya Snack", total: 125000, payStatus: "PAID" as const, orderStatus: "DIPROSES" as const, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop&auto=format" },
  { id: "TRX-002", date: "12 Sep 2026", product: "Batik Tulis Motif Parang", umkm: "Batik Nusantara", total: 185000, payStatus: "PAID" as const, orderStatus: "DIKIRIM" as const, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&auto=format" },
  { id: "TRX-003", date: "8 Sep 2026", product: "Kopi Arabika Gayo x2", umkm: "Gayo Coffee", total: 150000, payStatus: "PAID" as const, orderStatus: "SELESAI" as const, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop&auto=format" },
  { id: "TRX-004", date: "1 Sep 2026", product: "Tas Anyam Rotan Premium", umkm: "Rattan Craft", total: 145000, payStatus: "PENDING" as const, orderStatus: "BARU" as const, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop&auto=format" },
];

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#202020] mb-4">Pesanan Saya</h1>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <div className="divide-y divide-[#E5E5E5]">
            {orders.map(order => (
              <div key={order.id} className="p-5">
                <div className="flex items-start gap-4">
                  <img src={order.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F8F8F6]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="text-xs text-[#6B6B6B]">{order.id} · {order.date}</p>
                        <p className="text-sm font-semibold text-[#202020] mt-0.5">{order.product}</p>
                        <p className="text-xs text-[#D4AF37]">{order.umkm}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={order.payStatus} type="payment" />
                        <StatusBadge status={order.orderStatus} type="order" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-base font-bold text-[#202020]">{formatRp(order.total)}</p>
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="outline-gold" size="sm">Lihat Detail</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5] z-40">
        <div className="flex">
          {[
            { icon: "🏠", label: "Home", to: "/home" },
            { icon: "📂", label: "Kategori", to: "/products" },
            { icon: "🛒", label: "Keranjang", to: "/cart" },
            { icon: "📦", label: "Pesanan", to: "/orders" },
            { icon: "👤", label: "Profile", to: "/profile" },
          ].map(item => (
            <Link key={item.to} to={item.to} className="flex-1 flex flex-col items-center py-2 text-[#6B6B6B] hover:text-[#D4AF37] transition-colors">
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
