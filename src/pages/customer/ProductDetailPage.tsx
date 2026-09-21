import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { Stars, formatRp } from "../../components/ui/ProductCard";
import Badge from "../../components/ui/Badge";

const images = [
  "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=500&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=500&fit=crop&auto=format",
];

const sizes = ["S", "M", "L", "XL"];
const colors = ["Hitam", "Putih", "Gold"];

export default function ProductDetailPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Hitam");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={added ? 1 : 0} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-6">
          <Link to="/home" className="hover:text-[#D4AF37]">Home</Link>
          <span>/</span>
          <Link to="/products?cat=Makanan" className="hover:text-[#D4AF37]">Makanan</Link>
          <span>/</span>
          <span className="text-[#202020]">Keripik Pisang Original</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E5E5] h-96">
              <img src={images[activeImg]} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3"><Badge variant="hot">Terlaris</Badge></div>
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-[#D4AF37]" : "border-[#E5E5E5]"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <Link to="/store/1" className="text-sm text-[#D4AF37] font-semibold hover:underline">Naraya Snack</Link>
              <h1 className="text-2xl font-bold text-[#202020] mt-1">Keripik Pisang Original</h1>
              <div className="flex items-center gap-3 mt-2">
                <Stars rating={4.8} />
                <span className="text-xs text-[#6B6B6B]">· 248 ulasan · 1.2k+ terjual</span>
              </div>
            </div>

            <div className="bg-[#FFF5D6] rounded-xl p-4">
              <p className="text-3xl font-bold text-[#202020]">{formatRp(75000)}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Stok: <strong className="text-[#2E8B57]">120 tersedia</strong></p>
            </div>

            {/* Size Variants */}
            <div>
              <p className="text-sm font-semibold text-[#202020] mb-2">Ukuran</p>
              <div className="flex gap-2">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`w-12 h-10 rounded-xl text-sm font-medium border-2 transition-all ${size === s ? "border-[#D4AF37] bg-[#FFF5D6] text-[#D4AF37]" : "border-[#E5E5E5] text-[#6B6B6B] hover:border-[#D4AF37]"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Variants */}
            <div>
              <p className="text-sm font-semibold text-[#202020] mb-2">Warna: <span className="text-[#D4AF37]">{color}</span></p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-xl text-sm border-2 transition-all ${color === c ? "border-[#D4AF37] bg-[#FFF5D6] text-[#D4AF37]" : "border-[#E5E5E5] text-[#6B6B6B] hover:border-[#D4AF37]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-[#202020] mb-2">Jumlah</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl border border-[#E5E5E5] text-lg font-bold text-[#202020] hover:border-[#D4AF37] transition-all flex items-center justify-center">−</button>
                <span className="w-12 text-center font-semibold text-[#202020]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-xl border border-[#E5E5E5] text-lg font-bold text-[#202020] hover:border-[#D4AF37] transition-all flex items-center justify-center">+</button>
                <span className="text-sm text-[#6B6B6B]">Subtotal: <strong className="text-[#202020]">{formatRp(75000 * qty)}</strong></span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-2">
              <Button variant="outline-gold" size="lg" onClick={handleAddToCart} className="flex-1 justify-center">
                {added ? "✓ Ditambahkan!" : "Tambah ke Keranjang"}
              </Button>
              <Button variant="primary" size="lg" onClick={() => navigate("/checkout")} className="flex-1 justify-center">
                Beli Sekarang
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="border border-[#E5E5E5] rounded-xl p-4 space-y-2">
              {[
                { icon: "🚚", label: "Pengiriman", value: "Regular (3-5 hari) · Express (1-2 hari)" },
                { icon: "⏱️", label: "Estimasi", value: "Tiba Kamis, 18 Sep 2026" },
                { icon: "↩️", label: "Kebijakan Retur", value: "7 hari retur jika produk cacat" },
              ].map(info => (
                <div key={info.label} className="flex items-start gap-3">
                  <span className="text-base">{info.icon}</span>
                  <div>
                    <span className="text-xs font-semibold text-[#202020]">{info.label}: </span>
                    <span className="text-xs text-[#6B6B6B]">{info.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E5E5E5] p-6">
          <h2 className="text-lg font-bold text-[#202020] mb-5">Ulasan Pembeli (248)</h2>
          <div className="space-y-4">
            {[
              { name: "Siti Rahayu", date: "12 Sep 2026", rating: 5, text: "Rasanya enak banget, renyah dan tidak terlalu asin. Packaging juga rapi dan aman sampai tujuan!" },
              { name: "Budi Santoso", date: "10 Sep 2026", rating: 5, text: "Produk sesuai deskripsi, pengiriman cepat. Bakal order lagi!" },
              { name: "Dewi Lestari", date: "8 Sep 2026", rating: 4, text: "Produknya bagus, hanya ukurannya agak kecil dari ekspektasi. Tapi rasa mantap!" },
            ].map(r => (
              <div key={r.name} className="border-b border-[#E5E5E5] pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#FFF5D6] rounded-full flex items-center justify-center text-[#D4AF37] font-bold text-sm">{r.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#202020]">{r.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{r.date}</p>
                  </div>
                  <div className="ml-auto"><Stars rating={r.rating} /></div>
                </div>
                <p className="text-sm text-[#6B6B6B]">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
