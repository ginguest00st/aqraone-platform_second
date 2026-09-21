import { Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Timeline from "../../components/ui/Timeline";

const callbackSteps = [
  { label: "Payment Created", desc: "Transaksi berhasil dibuat", date: "15 Sep 2026 · 14:30:12", status: "done" as const },
  { label: "Payment Processing", desc: "Pembayaran sedang diproses oleh Finnet", date: "15 Sep 2026 · 14:30:45", status: "done" as const },
  { label: "Callback Received", desc: "Notifikasi dari Finnet diterima", date: "15 Sep 2026 · 14:31:02", status: "done" as const },
  { label: "Payment Verified", desc: "Status pembayaran berhasil divalidasi", date: "15 Sep 2026 · 14:31:03", status: "active" as const },
  { label: "Transaction Updated", desc: "Status transaksi diperbarui ke database", date: "—", status: "pending" as const },
];

const callbackData = [
  { label: "Transaction ID", value: "TRX-20260914-001" },
  { label: "Reference Number", value: "FIN-20260914-9823741" },
  { label: "Payment Status", value: "PAID" },
  { label: "Callback Status", value: "RECEIVED" },
  { label: "Callback Time", value: "15 Sep 2026 · 14:31:02" },
  { label: "Response Code", value: "00 - Success" },
];

export default function FinnetCallbackPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FFF5D6] rounded-xl flex items-center justify-center text-xl">💳</div>
          <div>
            <h1 className="text-xl font-bold text-[#202020]">Finnet Payment Flow</h1>
            <p className="text-sm text-[#6B6B6B]">Alur integrasi pembayaran via Finnet Gateway</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Flow Tracker */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-5">Status Alur Pembayaran</h2>
            <Timeline steps={callbackSteps} />
          </div>

          {/* Callback Data */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-5">Informasi Callback</h2>
            <div className="space-y-3">
              {callbackData.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start py-2 border-b border-[#F8F8F6] last:border-0">
                  <span className="text-xs text-[#6B6B6B] font-medium">{label}</span>
                  <span className={`text-xs font-semibold text-right ml-4 ${value.includes("PAID") || value.includes("RECEIVED") || value.includes("Success") ? "text-[#2E8B57]" : "text-[#202020]"}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 bg-[#FFF5D6] rounded-xl border border-[#F4D77D]">
              <p className="text-xs font-semibold text-[#B8860B] mb-1">💡 Catatan Integrasi</p>
              <p className="text-xs text-[#B8860B]">
                Sistem akan otomatis memperbarui status pesanan setelah callback Finnet diterima dan divalidasi.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/payment/status" className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8860B] transition-all">
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
