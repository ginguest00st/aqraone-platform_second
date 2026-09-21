import { useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../../components/ui/Navbar";
import ProductCard from "../../components/ui/ProductCard";
import { Checkbox } from "../../components/ui/Input";

const products = [
  { id: "1", name: "Keripik Pisang Original", umkm: "Naraya Snack", price: 25000, rating: 4.8, stock: 120, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "2", name: "Batik Tulis Motif Parang", umkm: "Batik Nusantara", price: 185000, rating: 4.6, stock: 45, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format", badge: "new" as const },
  { id: "3", name: "Kopi Arabika Gayo Aceh", umkm: "Gayo Coffee", price: 75000, rating: 4.9, stock: 80, image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "4", name: "Tas Anyam Rotan Premium", umkm: "Rattan Craft", price: 145000, rating: 4.7, stock: 30, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format" },
  { id: "5", name: "Tempe Organik Homemade", umkm: "Dapur Sehat", price: 15000, rating: 4.5, stock: 200, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format", badge: "new" as const },
  { id: "6", name: "Gelang Perak Ukir Bali", umkm: "Silver Bali", price: 95000, rating: 4.8, stock: 50, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop&auto=format" },
  { id: "7", name: "Minyak Kelapa Murni 500ml", umkm: "Kopra Nusantara", price: 45000, rating: 4.6, stock: 150, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&auto=format" },
  { id: "8", name: "Tenun Ikat NTT Original", umkm: "Tenun Flores", price: 320000, rating: 4.9, stock: 20, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
];

const categories = ["Makanan", "Minuman", "Fashion", "Kerajinan", "Kecantikan", "Elektronik", "Jasa", "Produk Lokal"];

export default function ProductSearchPage() {
  const [params] = useSearchParams();
  const [sort, setSort] = useState("Terbaru");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [terlaris, setTerlaris] = useState(false);

  const toggleCat = (cat: string) => setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {params.get("q") && (
          <p className="text-sm text-[#6B6B6B] mb-4">Hasil pencarian untuk: <strong className="text-[#202020]">"{params.get("q")}"</strong></p>
        )}

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <div className="w-60 shrink-0 hidden md:block">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 space-y-6">
              <h3 className="font-semibold text-[#202020]">Filter</h3>

              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-3">Kategori</p>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <Checkbox key={cat} label={cat} checked={selectedCats.includes(cat)} onChange={() => toggleCat(cat)} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-3">Harga</p>
                <div className="flex gap-2 items-center">
                  <input value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min" className="w-full border border-[#E5E5E5] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#D4AF37]" />
                  <span className="text-[#6B6B6B] text-xs">–</span>
                  <input value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max" className="w-full border border-[#E5E5E5] rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#D4AF37]" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-wide mb-3">Rating</p>
                {[4, 3, 2, 1].map(r => (
                  <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                    <input type="radio" name="rating" className="accent-[#D4AF37]" />
                    <span className="text-sm text-[#202020]">{"★".repeat(r)}{"☆".repeat(4 - r)} & ke atas</span>
                  </label>
                ))}
              </div>

              <Checkbox label="Terlaris saja" checked={terlaris} onChange={e => setTerlaris(e.target.checked)} />

              <button className="w-full py-2 text-sm font-medium text-[#D4AF37] border border-[#D4AF37] rounded-xl hover:bg-[#FFF5D6] transition-all">
                Reset Filter
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#6B6B6B]">{products.length} produk ditemukan</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B6B6B]">Urutkan:</span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#D4AF37]">
                  <option>Terbaru</option>
                  <option>Harga terendah</option>
                  <option>Harga tertinggi</option>
                  <option>Rating tertinggi</option>
                  <option>Terlaris</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-1 mt-8">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${n === 1 ? "bg-[#D4AF37] text-white" : "bg-white border border-[#E5E5E5] text-[#6B6B6B] hover:border-[#D4AF37]"}`}>
                  {n}
                </button>
              ))}
              <button className="w-9 h-9 rounded-xl text-sm bg-white border border-[#E5E5E5] text-[#6B6B6B] hover:border-[#D4AF37]">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
