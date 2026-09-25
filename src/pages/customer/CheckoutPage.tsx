import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { formatRp } from "../../components/ui/ProductCard";
import { useCart } from "../../app/contexts/CartContext";

const shippingOptions = [
  { id: "regular", label: "JNE Regular", desc: "Estimasi 2–3 hari kerja", price: 15000 },
  { id: "express", label: "SiCepat Express", desc: "Estimasi 1–2 hari kerja", price: 30000 },
  { id: "cargo", label: "J&T Cargo / Kargo", desc: "Estimasi 3–5 hari kerja (Barang berat)", price: 20000 },
];

export default function CheckoutPage() {
  const { getCheckoutItems } = useCart();
  const checkoutItems = getCheckoutItems();
  const [shipping, setShipping] = useState("regular");
  const [form, setForm] = useState({
    name: "Andi Pratama",
    phone: "0812-3456-7890",
    address: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan",
    city: "Jakarta Selatan",
    zip: "12730",
  });
  const navigate = useNavigate();

  const selectedShipping = shippingOptions.find((s) => s.id === shipping) || shippingOptions[0];
  const ongkir = checkoutItems.length > 0 ? selectedShipping.price : 0;
  const subtotal = checkoutItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + ongkir;

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleProceedToPayment = () => {
    const orderData = {
      items: checkoutItems,
      subtotal,
      ongkir,
      total,
      shippingOption: selectedShipping,
      shippingAddress: form,
      createdAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem("aqraone_pending_order", JSON.stringify(orderData));
    } catch {
      // ignore
    }
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-4">
          <Link to="/cart" className="hover:text-[#D4AF37]">
            ← Kembali ke Keranjang
          </Link>
          <span>/</span>
          <span className="text-[#202020] font-medium">Checkout Pesanan</span>
        </div>

        <h1 className="text-xl font-bold text-[#202020] mb-6">Checkout Pesanan</h1>

        {checkoutItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-10 text-center max-w-md mx-auto my-8 shadow-xs">
            <p className="text-sm font-semibold text-[#202020] mb-2">
              Tidak ada produk yang dipilih untuk checkout
            </p>
            <p className="text-xs text-[#6B6B6B] mb-5">
              Silakan pilih produk dari keranjang atau langsung beli dari halaman produk.
            </p>
            <Link to="/cart">
              <Button variant="primary" size="md">
                Buka Keranjang Belanja
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {/* Alamat Pengiriman */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#202020]">📍 Alamat Pengiriman</h2>
                  <span className="text-xs text-[#A07C10] font-medium bg-[#FFF5D6] px-2.5 py-0.5 rounded-full">
                    Alamat Utama
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Nama Penerima" value={form.name} onChange={update("name")} />
                  <Input label="Nomor WhatsApp / HP" value={form.phone} onChange={update("phone")} />
                  <Input label="Alamat Lengkap" value={form.address} onChange={update("address")} className="md:col-span-2" />
                  <Input label="Kota / Kabupaten" value={form.city} onChange={update("city")} />
                  <Input label="Kode Pos" value={form.zip} onChange={update("zip")} />
                </div>
              </div>

              {/* Produk Dipesan */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs">
                <h2 className="font-semibold text-[#202020] mb-4 flex items-center justify-between">
                  <span>📦 Produk yang Dipesan ({checkoutItems.length} item)</span>
                  <Link to="/cart" className="text-xs text-[#D4AF37] hover:underline font-medium">
                    Ubah Item
                  </Link>
                </h2>
                <div className="divide-y divide-[#F5F4F0]">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#F8F8F6] border border-[#E8E6E1] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#D4AF37] font-semibold">{item.umkm}</p>
                        <p className="text-sm font-bold text-[#202020] truncate">{item.name}</p>
                        <p className="text-xs text-[#6B6B6B] mt-0.5">
                          {item.variant} · <strong className="text-[#1A1714]">x{item.qty} pcs</strong>
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#202020]">{formatRp(item.price * item.qty)}</p>
                        <p className="text-[10px] text-[#6B6B6B]">{formatRp(item.price)} / pcs</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 shadow-xs">
                <h2 className="font-semibold text-[#202020] mb-4">🚚 Pilihan Ekspedisi Pengiriman</h2>
                <div className="space-y-3">
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        shipping === opt.id
                          ? "border-[#D4AF37] bg-[#FFF5D6]"
                          : "border-[#E5E5E5] hover:border-[#D4AF37]/50 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={opt.id}
                        checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id)}
                        className="accent-[#D4AF37] cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#202020]">{opt.label}</p>
                        <p className="text-xs text-[#6B6B6B]">{opt.desc}</p>
                      </div>
                      <p className="text-sm font-bold text-[#202020]">{formatRp(opt.price)}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div>
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sticky top-24 shadow-xs">
                <h2 className="font-semibold text-[#202020] mb-4">Ringkasan Pembayaran</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal Produk ({checkoutItems.reduce((acc, i) => acc + i.qty, 0)} pcs)</span>
                    <span className="font-semibold text-[#202020]">{formatRp(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Ongkos Kirim ({selectedShipping.label})</span>
                    <span className="font-semibold text-[#202020]">{formatRp(ongkir)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Biaya Layanan Finnet Platform</span>
                    <span className="font-semibold text-[#202020]">Rp1.000</span>
                  </div>
                  <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-[#202020] text-base">
                    <span>Total Tagihan</span>
                    <span className="text-lg text-[#C9A227] font-display">
                      {formatRp(total + 1000)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center mt-5 cursor-pointer font-bold shadow-md"
                  onClick={handleProceedToPayment}
                >
                  Lanjut ke Pembayaran
                </Button>
                <p className="text-center text-[11px] text-[#7C7770] mt-3">
                  🔒 Pembayaran aman dan terverifikasi via Finnet Finpay
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
