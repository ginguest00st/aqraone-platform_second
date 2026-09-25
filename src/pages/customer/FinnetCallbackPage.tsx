import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Timeline from "../../components/ui/Timeline";
import { orderService } from "../../services/order.service";

export default function FinnetCallbackPage() {
  const activeId = orderService.getActiveOrderId();
  const order = activeId ? orderService.getOrderById(activeId) : orderService.getAllOrders()[0];

  const callbackSteps = [
    { label: "Pesanan Dibuat", desc: "Transaksi berhasil dibuat oleh pembeli", date: order ? `${order.date} · ${order.time}` : "15 Sep 2026 · 14:30:12", status: "done" as const },
    { label: "Proses Pembayaran", desc: `Menunggu pembayaran diselesaikan di ${order?.paymentMethod || "Finnet"}`, date: order ? `${order.date} · ${order.time}` : "15 Sep 2026 · 14:30:45", status: "done" as const },
    { label: "Konfirmasi Diterima", desc: "Notifikasi resmi dari gateway pembayaran telah diterima sistem", date: order ? `${order.date} · ${order.time}` : "15 Sep 2026 · 14:31:02", status: "done" as const },
    { label: "Pembayaran Terverifikasi", desc: "Dana pembayaran berhasil divalidasi lunas", date: order ? `${order.date} · ${order.time}` : "15 Sep 2026 · 14:31:03", status: "active" as const },
    { label: "Pesanan Diteruskan ke Toko", desc: `Status pesanan otomatis diteruskan ke penjual ${order?.umkm || "UMKM"}`, date: "—", status: "pending" as const },
  ];

  const callbackData = [
    { label: "ID Transaksi", value: order?.id || "TRX-20260923-001" },
    { label: "Nomor Invoice", value: order?.invoiceNo || "INV/20260923/AQRA/001" },
    { label: "Toko UMKM Tujuan", value: order?.umkm || "Batik Danar Solo" },
    { label: "Nomor Referensi Gateway", value: order?.paymentRef || "FIN-20260923-9823741" },
    { label: "Metode Pembayaran", value: order?.paymentMethod || "Finnet Finpay" },
    { label: "Status Pembayaran", value: "LUNAS (PAID)" },
    { label: "Status Notifikasi", value: "BERHASIL DITERIMA" },
    { label: "Waktu Konfirmasi", value: order ? `${order.date} · ${order.time}` : "23 Sep 2026 · 14:31:02 WIB" },
    { label: "Keterangan Respons", value: "00 - Transaksi Berhasil & Diteruskan ke UMKM" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FFF5D6] rounded-xl flex items-center justify-center text-xl">💳</div>
          <div>
            <h1 className="text-xl font-bold text-[#202020]">Konfirmasi Pembayaran Finnet</h1>
            <p className="text-sm text-[#6B6B6B]">Alur verifikasi dan bukti konfirmasi pembayaran otomatis via Finnet Gateway</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Flow Tracker */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-5">Status Alur Verifikasi</h2>
            <Timeline steps={callbackSteps} />
          </div>

          {/* Callback Data */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-5">Rincian Konfirmasi Pembayaran</h2>
            <div className="space-y-3">
              {callbackData.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start py-2 border-b border-[#F8F8F6] last:border-0">
                  <span className="text-xs text-[#6B6B6B] font-medium">{label}</span>
                  <span className={`text-xs font-semibold text-right ml-4 ${value.includes("LUNAS") || value.includes("PAID") || value.includes("BERHASIL") || value.includes("RECEIVED") || value.includes("Success") ? "text-[#2E8B57]" : "text-[#202020]"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#FFF5D6] rounded-xl border border-[#F4D77D]">
              <p className="text-xs font-semibold text-[#B8860B] mb-1">💡 Otomatisasi Sistem</p>
              <p className="text-xs text-[#B8860B]">
                Pesanan telah otomatis diteruskan ke dashboard toko <strong>{order?.umkm || "UMKM"}</strong>. Penjual dapat langsung memverifikasi dan menyiapkan pesanan Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {order && (
            <Link to={`/orders/${order.id}`} className="px-6 py-3 bg-[#C9A227] text-white font-bold rounded-xl hover:bg-[#B38F1E] transition-all shadow-md">
              Lihat Detail Pesanan Saya 📦
            </Link>
          )}
          <Link to="/payment/status" className="px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-xl hover:bg-[#FFF5D6] transition-all bg-white">
            Lihat Status Pembayaran
          </Link>
          <Link to="/home" className="px-6 py-3 border border-[#E5E5E5] text-[#6B6B6B] font-medium rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all bg-white">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
