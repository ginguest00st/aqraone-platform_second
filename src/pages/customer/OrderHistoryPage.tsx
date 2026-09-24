import { useState, useEffect } from "react";
import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Tabs from "../../components/ui/Tabs";
import { StatusBadge } from "../../components/ui/Badge";
import { formatRp } from "../../components/ui/ProductCard";
import Button from "../../components/ui/Button";

import { orderService, type Order } from "../../services/order.service";

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [ordersList, setOrdersList] = useState<Order[]>(() => orderService.getCustomerOrders());

  useEffect(() => {
    // Muat data pesanan terbaru setiap kali halaman dibuka
    setOrdersList(orderService.getCustomerOrders());
  }, []);

  const counts = {
    all: ordersList.length,
    pending: ordersList.filter(o => o.payStatus === "PENDING").length,
    processing: ordersList.filter(o => o.orderStatus === "BARU" || o.orderStatus === "DIPROSES").length,
    delivered: ordersList.filter(o => o.orderStatus === "DIKIRIM" || o.orderStatus === "SELESAI").length,
    cancelled: ordersList.filter(o => o.orderStatus === "DIBATALKAN").length,
  };

  const tabs = [
    { id: "all", label: "Semua", count: counts.all },
    { id: "pending", label: "Menunggu Pembayaran", count: counts.pending },
    { id: "processing", label: "Diproses", count: counts.processing },
    { id: "delivered", label: "Dikirim / Selesai", count: counts.delivered },
    { id: "cancelled", label: "Dibatalkan", count: counts.cancelled },
  ];

  const filteredOrders = ordersList.filter(o => {
    if (activeTab === "pending") return o.payStatus === "PENDING";
    if (activeTab === "processing") return o.orderStatus === "BARU" || o.orderStatus === "DIPROSES";
    if (activeTab === "delivered") return o.orderStatus === "DIKIRIM" || o.orderStatus === "SELESAI";
    if (activeTab === "cancelled") return o.orderStatus === "DIBATALKAN";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#202020] mb-4">Pesanan Saya</h1>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

          <div className="divide-y divide-[#E5E5E5]">
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-[#6B6B6B]">
                <p className="text-3xl mb-2">📦</p>
                <p className="font-semibold text-[#202020]">Belum ada pesanan pada kategori ini</p>
                <p className="text-xs mt-1">Pesanan yang Anda buat akan langsung muncul di sini secara real-time.</p>
              </div>
            ) : (
              filteredOrders.map(order => {
                const primaryItem = order.items[0];
                const productSummary = primaryItem
                  ? `${primaryItem.name}${order.items.length > 1 ? ` + ${order.items.length - 1} produk lainnya` : ""}`
                  : "Pesanan Produk";
                const productImage = primaryItem?.image || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=100&h=100&fit=crop&auto=format";

                return (
                  <div key={order.id} className="p-5 hover:bg-[#FAF9F5] transition-colors">
                    <div className="flex items-start gap-4">
                      <img
                        src={productImage}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#F8F8F6] border border-[#E8E6E1]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="text-xs text-[#6B6B6B]">{order.id} · {order.date}</p>
                            <p className="text-sm font-semibold text-[#202020] mt-0.5">{productSummary}</p>
                            <p className="text-xs text-[#D4AF37] font-medium">{order.umkm}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <StatusBadge status={order.payStatus} type="payment" />
                            <StatusBadge status={order.orderStatus} type="order" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-base font-bold text-[#202020]">{formatRp(order.total)}</p>
                          <Link to={`/orders/${order.id}`}>
                            <Button variant="outline-gold" size="sm" className="font-bold">
                              Lihat Detail Pesanan
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
