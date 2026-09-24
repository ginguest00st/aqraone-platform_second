import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";

type Status = "success" | "pending" | "failed";

const statusConfig = {
  success: {
    icon: "✅",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    title: "Pembayaran Berhasil!",
    subtitle: "Pesananmu sedang diproses oleh UMKM",
    color: "text-[#2E8B57]",
    badge: "PAID",
    badgeClass: "bg-green-100 text-green-700",
  },
  pending: {
    icon: "⏳",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    title: "Menunggu Pembayaran",
    subtitle: "Selesaikan pembayaranmu sebelum batas waktu",
    color: "text-[#E6A700]",
    badge: "PENDING",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },
  failed: {
    icon: "❌",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    title: "Pembayaran Gagal",
    subtitle: "Pembayaran tidak dapat diproses. Silakan coba lagi.",
    color: "text-[#D9534F]",
    badge: "FAILED",
    badgeClass: "bg-red-100 text-red-700",
  },
};

import { orderService } from "../../services/order.service";

export default function PaymentStatusPage() {
  const [status, setStatus] = useState<Status>("success");
  const cfg = statusConfig[status];

  const activeId = orderService.getActiveOrderId();
  const order = activeId ? orderService.getOrderById(activeId) : orderService.getAllOrders()[0];

  const orderId = order?.id || "TRX-20260923-001";
  const orderDate = order ? `${order.date}, ${order.time}` : "23 Sep 2026, 14:32 WIB";
  const orderTotal = order?.total || 366000;
  const orderPayment = order?.paymentMethod || "Finnet Finpay";

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      {/* Status Toggle (demo) */}
      <div className="bg-white border-b border-[#E5E5E5] px-4 py-2 flex gap-2 justify-center">
        <span className="text-xs text-[#6B6B6B] my-auto">Demo status:</span>
        {(["success", "pending", "failed"] as Status[]).map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${status === s ? "bg-[#D4AF37] text-white" : "bg-[#E5E5E5] text-[#6B6B6B]"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden">
          {/* Top Banner */}
          <div className={`${cfg.iconBg} p-8 text-center`}>
            <div className="text-6xl mb-4">{cfg.icon}</div>
            <h1 className={`text-2xl font-bold ${cfg.color}`}>{cfg.title}</h1>
            <p className="text-sm text-[#6B6B6B] mt-2">
              {order ? `Pesananmu diteruskan ke toko ${order.umkm}` : cfg.subtitle}
            </p>
          </div>

          {/* Transaction Info */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Transaction ID", value: orderId },
                { label: "Tanggal", value: orderDate },
                { label: "Amount", value: formatRp(orderTotal) },
                { label: "Payment Method", value: orderPayment },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F8F8F6] rounded-xl p-3">
                  <p className="text-xs text-[#6B6B6B] mb-1">{label}</p>
                  <p className="font-semibold text-[#202020] text-xs truncate">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#E5E5E5]">
              <span className="text-sm text-[#6B6B6B]">Status Pembayaran</span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${cfg.badgeClass}`}>{cfg.badge}</span>
            </div>

            {status === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-yellow-700 mb-1">Batas Waktu Pembayaran</p>
                <p className="text-xl font-bold text-yellow-700">23:45:00</p>
                <p className="text-xs text-yellow-600 mt-1">24 Sep 2026, 15:17 WIB</p>
              </div>
            )}

            {status === "failed" && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-700 mb-1">Alasan</p>
                <p className="text-sm text-red-600">Pembayaran ditolak oleh bank. Pastikan saldo mencukupi atau gunakan metode pembayaran lain.</p>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2">
              {status === "success" && (
                <>
                  <Link to={`/orders/${orderId}`}>
                    <Button variant="primary" size="lg" className="w-full justify-center shadow-md font-bold">
                      Lihat Detail Transaksi Pesanan 📦
                    </Button>
                  </Link>
                  <Link to="/home">
                    <Button variant="secondary" size="lg" className="w-full justify-center">Kembali ke Beranda</Button>
                  </Link>
                </>
              )}
              {status === "pending" && (
                <>
                  <Button variant="primary" size="lg" className="w-full justify-center">Cek Status Pembayaran</Button>
                  <Link to="/home">
                    <Button variant="secondary" size="lg" className="w-full justify-center">Kembali ke Beranda</Button>
                  </Link>
                </>
              )}
              {status === "failed" && (
                <>
                  <Link to="/payment">
                    <Button variant="primary" size="lg" className="w-full justify-center">Coba Bayar Lagi</Button>
                  </Link>
                  <Link to="/home">
                    <Button variant="secondary" size="lg" className="w-full justify-center">Kembali ke Beranda</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
