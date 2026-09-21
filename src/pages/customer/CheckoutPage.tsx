import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { formatRp } from "../../components/ui/ProductCard";

const shippingOptions = [
  { id: "regular", label: "Regular", desc: "3–5 hari kerja", price: 15000 },
  { id: "express", label: "Express", desc: "1–2 hari kerja", price: 35000 },
];

const orderItems = [
  { name: "Keripik Pisang Original", umkm: "Naraya Snack", variant: "L · Hitam", qty: 2, price: 25000, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=100&h=100&fit=crop&auto=format" },
  { name: "Kopi Arabika Gayo Aceh", umkm: "Gayo Coffee", variant: "250gr", qty: 1, price: 75000, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=100&h=100&fit=crop&auto=format" },
];

export default function CheckoutPage() {
  const [shipping, setShipping] = useState("regular");
  const [form, setForm] = useState({ name: "Andi Pratama", phone: "0812-3456-7890", address: "Jl. Merdeka No. 45, RT 03/RW 02", city: "Bandung", zip: "40115" });
  const navigate = useNavigate();

  const ongkir = shippingOptions.find(s => s.id === shipping)?.price || 0;
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + ongkir;

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#202020] mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* Alamat */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#202020]">📍 Alamat Pengiriman</h2>
                <button className="text-sm text-[#D4AF37] font-medium hover:underline">Ubah Alamat</button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nama Penerima" value={form.name} onChange={update("name")} />
                <Input label="Nomor HP" value={form.phone} onChange={update("phone")} />
                <Input label="Alamat" value={form.address} onChange={update("address")} className="md:col-span-2" />
                <Input label="Kota" value={form.city} onChange={update("city")} />
                <Input label="Kode Pos" value={form.zip} onChange={update("zip")} />
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <h2 className="font-semibold text-[#202020] mb-4">📦 Produk yang Dipesan</h2>
              <div className="space-y-3">
                {orderItems.map(item => (
                  <div key={item.name} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-[#F8F8F6]" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#202020]">{item.name}</p>
                      <p className="text-xs text-[#6B6B6B]">{item.umkm} · {item.variant} · x{item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-[#202020]">{formatRp(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
              <h2 className="font-semibold text-[#202020] mb-4">🚚 Metode Pengiriman</h2>
              <div className="space-y-3">
                {shippingOptions.map(opt => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${shipping === opt.id ? "border-[#D4AF37] bg-[#FFF5D6]" : "border-[#E5E5E5] hover:border-[#D4AF37]/50"}`}>
                    <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className="accent-[#D4AF37]" />
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

          {/* Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sticky top-24">
              <h2 className="font-semibold text-[#202020] mb-4">Ringkasan</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal</span><span>{formatRp(subtotal)}</span></div>
                <div className="flex justify-between text-[#6B6B6B]"><span>Ongkos Kirim</span><span>{formatRp(ongkir)}</span></div>
                <div className="flex justify-between text-[#6B6B6B]"><span>Biaya Lainnya</span><span>Rp0</span></div>
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-[#202020] text-base">
                  <span>Total Pembayaran</span><span>{formatRp(total)}</span>
                </div>
              </div>
              <Button variant="primary" size="lg" className="w-full justify-center mt-5" onClick={() => navigate("/payment")}>
                Pilih Pembayaran
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
