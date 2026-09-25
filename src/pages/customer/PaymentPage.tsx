import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";
import { useCart } from "../../app/contexts/CartContext";

import { orderService } from "../../services/order.service";

const methods = [
  { id: "finnet", icon: "💳", label: "Finnet Finpay", desc: "Pembayaran terpadu via gateway Finnet", tag: "Rekomendasi" },
  { id: "va_mandiri", icon: "🏦", label: "Mandiri Virtual Account", desc: "Verifikasi instan otomatis 24 jam" },
  { id: "va_bca", icon: "🏦", label: "BCA Virtual Account", desc: "Verifikasi instan otomatis 24 jam" },
  { id: "va_bri", icon: "🏦", label: "BRI Virtual Account", desc: "Verifikasi instan otomatis 24 jam" },
  { id: "qris", icon: "📱", label: "QRIS Finnet", desc: "Scan melalui GoPay, OVO, Dana, BCA Mobile, Livin, dll." },
];

export default function PaymentPage() {
  const [selected, setSelected] = useState("finnet");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCheckedItems, getCheckoutItems } = useCart();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("aqraone_pending_order");
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const checkoutItems = orderData?.items || getCheckoutItems();
  const subtotal = orderData?.subtotal || checkoutItems.reduce((acc: number, i: any) => acc + i.price * i.qty, 0);
  const ongkir = orderData?.ongkir !== undefined ? orderData.ongkir : 15000;
  const platformFee = 1000;
  const totalAmount = (orderData?.total !== undefined ? orderData.total : subtotal + ongkir) + (orderData?.total ? 0 : platformFee);

  const handlePay = () => {
    setLoading(true);

    const selectedMethodObj = methods.find((m) => m.id === selected);
    const methodName = selectedMethodObj ? selectedMethodObj.label : "Finnet Finpay";

    // 1. Buat pesanan nyata dan simpan ke database / local store terpusat
    const createdOrder = orderService.createOrder({
      items: checkoutItems,
      shippingAddress: orderData?.shippingAddress || {
        name: "Andi Pratama",
        phone: "081234567890",
        address: "Jl. Sudirman No. 45",
        city: "Jakarta Pusat",
        zip: "10310",
      },
      shippingOption: orderData?.shippingOption,
      paymentMethod: methodName,
      subtotal,
      ongkir,
      total: totalAmount,
    });

    // 2. Tandai active order ID
    orderService.setActiveOrderId(createdOrder.id);

    // 3. Clear purchased items from cart
    clearCheckedItems();

    setTimeout(() => {
      setLoading(false);
      navigate("/payment/callback");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-4">
          <Link to="/checkout" className="hover:text-[#D4AF37]">
            ← Kembali ke Checkout
          </Link>
          <span>/</span>
          <span className="text-[#202020] font-medium">Pembayaran</span>
        </div>

        <h1 className="text-xl font-bold text-[#202020] mb-1">Pilih Metode Pembayaran</h1>
        <p className="text-xs text-[#6B6B6B] mb-6">
          Transaksi diproses secara aman melalui Finnet Payment Gateway
        </p>

        {/* Payment Channels */}
        <div className="space-y-3 mb-6">
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 bg-white rounded-2xl border-2 cursor-pointer transition-all shadow-xs ${
                selected === m.id
                  ? "border-[#D4AF37] bg-[#FFF5D6]"
                  : "border-[#E5E5E5] hover:border-[#D4AF37]/50"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                checked={selected === m.id}
                onChange={() => setSelected(m.id)}
                className="accent-[#D4AF37] cursor-pointer"
              />
              <span className="text-2xl">{m.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#202020]">{m.label}</p>
                  {m.tag && (
                    <span className="text-[10px] bg-[#D4AF37] text-white px-2 py-0.5 rounded-full font-bold">
                      {m.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6B6B6B] mt-0.5">{m.desc}</p>
              </div>
              {selected === m.id && (
                <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </label>
          ))}
        </div>

        {/* Ringkasan Biaya Nyata */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE9] mb-3">
            <div>
              <p className="text-xs text-[#7C7770]">Total Tagihan Pembayaran</p>
              <p className="text-2xl font-bold font-display text-[#C9A227] mt-0.5">
                {formatRp(totalAmount)}
              </p>
            </div>
            <div className="text-right text-xs text-[#6B6B6B]">
              <p className="font-semibold text-[#1A1714]">
                {checkoutItems.length} Produk · {orderData?.shippingOption?.label || "JNE Regular"}
              </p>
              <p className="text-emerald-700 font-medium text-[11px] mt-0.5">✓ Terverifikasi Aman</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#7C7770]">
            <div className="flex justify-between">
              <span>Subtotal Produk</span>
              <span className="font-medium text-[#202020]">{formatRp(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkos Kirim</span>
              <span className="font-medium text-[#202020]">{formatRp(ongkir)}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan Platform</span>
              <span className="font-medium text-[#202020]">Rp1.000</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center font-bold text-base cursor-pointer shadow-md"
          loading={loading}
          onClick={handlePay}
        >
          Bayar Sekarang {formatRp(totalAmount)}
        </Button>

        <p className="text-center text-xs text-[#6B6B6B] mt-4 flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>Pembayaran resmi dilindungi enkripsi Finnet Gateway Finpay</span>
        </p>
      </div>
    </div>
  );
}
