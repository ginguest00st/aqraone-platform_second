import { Link, useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { formatRp } from "../../components/ui/ProductCard";
import { useCart } from "../../app/contexts/CartContext";

export default function CartPage() {
  const {
    items,
    toggleCheck,
    toggleAll,
    updateQty,
    removeFromCart,
    setDirectCheckoutItem,
  } = useCart();
  const navigate = useNavigate();

  const checked = items.filter((i) => i.checked);
  const subtotal = checked.reduce((s, i) => s + i.price * i.qty, 0);
  const ongkir = checked.length > 0 ? 15000 : 0;
  const diskon = 0;
  const total = subtotal + ongkir - diskon;

  const handleProceedCheckout = () => {
    setDirectCheckoutItem(null);
    try {
      sessionStorage.removeItem("aqraone_direct_checkout");
    } catch {
      // ignore
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-[#202020]">
            Keranjang Belanja ({items.length})
          </h1>
          <Link to="/products" className="text-xs text-[#D4AF37] hover:underline font-semibold">
            + Tambah Produk Lain
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FFF5D6] text-[#C9A227] flex items-center justify-center text-4xl mx-auto mb-4">
              🛒
            </div>
            <h3 className="text-lg font-bold text-[#202020]">Keranjang Belanja Kosong</h3>
            <p className="text-sm text-[#6B6B6B] mt-1 mb-6">
              Kamu belum menambahkan produk apapun ke dalam keranjang. Temukan berbagai produk UMKM pilihan khas nusantara sekarang!
            </p>
            <Link to="/products">
              <Button variant="primary" size="lg" className="mx-auto">
                Mulai Belanja Sekarang
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items List */}
            <div className="md:col-span-2 space-y-3">
              {/* Select All Bar */}
              <div className="bg-white rounded-2xl border border-[#E5E5E5] px-5 py-3.5 flex items-center justify-between shadow-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && items.every((i) => i.checked)}
                    onChange={() => toggleAll()}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-[#202020]">
                    Pilih Semua ({items.length} Produk)
                  </span>
                </label>
                <span className="text-xs text-[#6B6B6B]">
                  {checked.length} dipilih
                </span>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E5E5E5] p-5 hover:border-[#D4AF37]/50 transition-all shadow-xs"
                >
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="w-4 h-4 accent-[#D4AF37] mt-1 shrink-0 cursor-pointer"
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-[#F8F8F6] border border-[#E8E6E1]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#D4AF37] font-semibold">{item.umkm}</p>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-sm font-bold text-[#202020] truncate block hover:text-[#D4AF37] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variant}</p>
                      <p className="text-base font-bold text-[#202020] mt-2">
                        {formatRp(item.price)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#ABA9A4] hover:text-[#D9534F] transition-colors p-1 text-base cursor-pointer"
                        title="Hapus dari keranjang"
                      >
                        🗑️
                      </button>
                      <div className="flex items-center gap-2 bg-[#F8F8F6] p-1 rounded-xl border border-[#E8E6E1]">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#E5E5E5] text-[#202020] font-bold hover:border-[#D4AF37] transition-all flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#E5E5E5] text-[#202020] font-bold hover:border-[#D4AF37] transition-all flex items-center justify-center text-sm cursor-pointer shadow-2xs"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#D4AF37]">
                        {formatRp(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 sticky top-24 shadow-xs">
                <h2 className="font-semibold text-[#202020] mb-4 flex items-center justify-between">
                  <span>Ringkasan Belanja</span>
                  <span className="text-xs text-[#A07C10] font-bold bg-[#FFF5D6] px-2 py-0.5 rounded-full">
                    {checked.length} Produk
                  </span>
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Subtotal ({checked.length} produk)</span>
                    <span className="font-semibold text-[#202020]">{formatRp(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B6B6B]">
                    <span>Ongkos Kirim</span>
                    <span className="font-semibold text-[#202020]">{formatRp(ongkir)}</span>
                  </div>
                  <div className="flex justify-between text-[#2E8B57]">
                    <span>Diskon</span>
                    <span className="font-semibold">−{formatRp(diskon)}</span>
                  </div>
                  <div className="border-t border-[#E5E5E5] pt-3 flex justify-between font-bold text-[#202020] text-base">
                    <span>Total Pembayaran</span>
                    <span className="text-lg text-[#C9A227] font-display">{formatRp(total)}</span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-center mt-5 cursor-pointer font-bold shadow-md"
                  disabled={checked.length === 0}
                  onClick={handleProceedCheckout}
                >
                  Lanjut Checkout ({checked.length})
                </Button>
                <Link
                  to="/products"
                  className="block text-center text-xs text-[#D4AF37] mt-3 hover:underline font-medium"
                >
                  ← Lanjut Belanja Produk Lain
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
