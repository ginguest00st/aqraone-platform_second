import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";

interface CartItem {
  id: string;
  name: string;
  umkm: string;
  variant: string;
  price: number;
  qty: number;
  image: string;
  checked: boolean;
}

const initCart: CartItem[] = [
  { id: "1", name: "Keripik Pisang Original", umkm: "Naraya Snack", variant: "Size: L · Warna: Hitam", price: 25000, qty: 2, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=200&h=200&fit=crop&auto=format", checked: true },
  { id: "2", name: "Kopi Arabika Gayo Aceh", umkm: "Gayo Coffee", variant: "250gr", price: 75000, qty: 1, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=200&h=200&fit=crop&auto=format", checked: true },
  { id: "3", name: "Batik Tulis Motif Parang", umkm: "Batik Nusantara", variant: "Size: M · Warna: Biru", price: 185000, qty: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&auto=format", checked: false },
];

export default function CartPage() {
  const [items, setItems] = useState(initCart);
  const navigate = useNavigate();

  const toggle = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const toggleAll = () => { const all = items.every(i => i.checked); setItems(prev => prev.map(i => ({ ...i, checked: !all }))); };
  const updateQty = (id: string, delta: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const checked = items.filter(i => i.checked);
  const subtotal = checked.reduce((s, i) => s + i.price * i.qty, 0);
  const ongkir = checked.length > 0 ? 15000 : 0;
  const diskon = 0;
  const total = subtotal + ongkir - diskon;

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={items.length} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-[#202020] mb-6">Keranjang Belanja ({items.length})</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Items */}
          <div className="md:col-span-2 space-y-3">
            {/* Select All */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] px-5 py-3 flex items-center gap-3">
              <input type="checkbox" checked={items.every(i => i.checked)} onChange={toggleAll} className="w-4 h-4 accent-[#D4AF37]" />
              <span className="text-sm font-medium text-[#202020]">Pilih Semua ({items.length})</span>
            </div>

            {items.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
                <div className="flex gap-4">
                  <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} className="w-4 h-4 accent-[#D4AF37] mt-1 shrink-0" />
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#F8F8F6]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#D4AF37] font-medium">{item.umkm}</p>
                    <p className="text-sm font-semibold text-[#202020] truncate">{item.name}</p>
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variant}</p>
                    <p className="text-base font-bold text-[#202020] mt-2">{formatRp(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => remove(item.id)} className="text-[#6B6B6B] hover:text-[#D9534F] transition-colors text-lg">🗑️</button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-[#E5E5E5] text-[#202020] font-bold hover:border-[#D4AF37] transition-all flex items-center justify-center text-sm">−</button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-[#E5E5E5] text-[#202020] font-bold hover:border-[#D4AF37] transition-all flex items-center justify-center text-sm">+</button>
                    </div>
                    <p className="text-sm font-bold text-[#D4AF37]">{formatRp(item.price * item.qty)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sticky top-24">
              <h2 className="font-semibold text-[#202020] mb-4">Ringkasan Belanja</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#6B6B6B]"><span>Subtotal ({checked.length} produk)</span><span>{formatRp(subtotal)}</span></div>
                <div className="flex justify-between text-[#6B6B6B]"><span>Ongkos Kirim</span><span>{formatRp(ongkir)}</span></div>
                <div className="flex justify-between text-[#2E8B57]"><span>Diskon</span><span>−{formatRp(diskon)}</span></div>
                <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-[#202020] text-base">
                  <span>Total</span><span>{formatRp(total)}</span>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center mt-5"
                disabled={checked.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Lanjut Checkout ({checked.length})
              </Button>
              <Link to="/home" className="block text-center text-sm text-[#D4AF37] mt-3 hover:underline">Lanjut Belanja</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
