import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";

const methods = [
  { id: "finnet", icon: "💳", label: "Finnet", desc: "Pembayaran via gateway Finnet", tag: "Recommended" },
  { id: "va", icon: "🏦", label: "Virtual Account", desc: "BCA, Mandiri, BNI, BRI" },
  { id: "ewallet", icon: "📲", label: "E-Wallet", desc: "GoPay, OVO, Dana, ShopeePay" },
  { id: "bank", icon: "🏧", label: "Bank Transfer", desc: "Transfer langsung ke rekening tujuan" },
  { id: "qr", icon: "📱", label: "QR Payment", desc: "Scan QR dengan aplikasi perbankan" },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState("finnet");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/payment/callback");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-[#202020] mb-2">Pilih Metode Pembayaran</h1>
        <p className="text-sm text-[#6B6B6B] mb-6">Pilih metode pembayaran yang paling mudah untukmu</p>

        <div className="space-y-3 mb-6">
          {methods.map(m => (
            <label key={m.id} className={`flex items-center gap-4 p-4 bg-white rounded-2xl border-2 cursor-pointer transition-all ${selected === m.id ? "border-[#D4AF37] bg-[#FFF5D6]" : "border-[#E5E5E5] hover:border-[#D4AF37]/50"}`}>
              <input type="radio" name="payment" value={m.id} checked={selected === m.id} onChange={() => setSelected(m.id)} className="accent-[#D4AF37]" />
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-[#202020]">{m.label}</p>
                  {m.tag && <span className="text-xs bg-[#D4AF37] text-white px-2 py-0.5 rounded-full">{m.tag}</span>}
                </div>
                <p className="text-xs text-[#6B6B6B]">{m.desc}</p>
              </div>
              {selected === m.id && <span className="text-[#D4AF37] text-lg">✓</span>}
            </label>
          ))}
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B6B6B]">Total Pembayaran</p>
              <p className="text-2xl font-bold text-[#202020]">{formatRp(125000)}</p>
            </div>
            <div className="text-right text-xs text-[#6B6B6B]">
              <p>3 produk · Ongkir Regular</p>
              <p className="text-[#D4AF37] font-medium">Pembayaran Aman</p>
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" className="w-full justify-center" loading={loading} onClick={handlePay}>
          Bayar Sekarang {formatRp(125000)}
        </Button>

        <p className="text-center text-xs text-[#6B6B6B] mt-4">
          🔒 Pembayaran diamankan oleh Finnet Payment Gateway
        </p>
      </div>
    </div>
  );
}
