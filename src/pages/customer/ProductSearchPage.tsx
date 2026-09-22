import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../../components/ui/Navbar";
import ProductCard from "../../components/ui/ProductCard";
import { Checkbox } from "../../components/ui/Input";
import { productService, type ProductWithUmkm } from "../../services/product.service";
import { categoryService } from "../../services/category.service";

const defaultCategories = ["Makanan Ringan", "Minuman Khas & Kopi", "Pakaian & Tekstil", "Tas & Kerajinan Anyam", "Aksesoris & Perhiasan", "Bumbu Dapur & Sambal", "Dekorasi & Rumah Tangga"];

export default function ProductSearchPage() {
  const [params] = useSearchParams();
  const queryParam = params.get("q") || "";
  const catParam = params.get("cat") || "";
  const [sort, setSort] = useState("Terbaru");
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [selectedCats, setSelectedCats] = useState<string[]>(catParam ? [catParam] : []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [terlaris, setTerlaris] = useState(false);
  const [rawProducts, setRawProducts] = useState<ProductWithUmkm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getAllProducts(undefined, queryParam),
          categoryService.getKategoriProduk(),
        ]);
        if (prodRes.data) setRawProducts(prodRes.data);
        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data.map(c => c.nama_kategori));
        }
      } catch (err) {
        console.error("Search page load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [queryParam]);

  const toggleCat = (cat: string) => setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  // Transform and filter products
  const formattedProducts = rawProducts.map(p => {
    const minP = p.product_variants && p.product_variants.length > 0
      ? Math.min(...p.product_variants.map(v => Number(v.harga) || 0))
      : 25000;
    const totalStock = p.product_variants
      ? p.product_variants.reduce((sum, v) => sum + (v.stock_levels?.sisa_stok ?? 0), 0)
      : 50;
    return {
      id: p.id,
      name: p.nama_produk,
      umkm: p.umkm?.nama_toko || "UMKM Mitra",
      categoryName: p.kategori_produk?.nama_kategori || "",
      price: minP,
      rating: 4.8,
      stock: totalStock,
      image: p.gambar_url || "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop",
      badge: (p.status === "AKTIF" ? "hot" : undefined) as "hot" | undefined,
    };
  });

  const filteredProducts = formattedProducts.filter(p => {
    if (selectedCats.length > 0 && !selectedCats.some(c => p.categoryName.toLowerCase().includes(c.toLowerCase()))) {
      return false;
    }
    if (minPrice && p.price < Number(minPrice)) return false;
    if (maxPrice && p.price > Number(maxPrice)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "Harga terendah") return a.price - b.price;
    if (sort === "Harga tertinggi") return b.price - a.price;
    return 0;
  });

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
              <p className="text-sm text-[#6B6B6B]">
                {loading ? "Memuat produk..." : `${filteredProducts.length} produk ditemukan`}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B6B6B]">Urutkan:</span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="border border-[#E5E5E5] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-[#D4AF37]">
                  <option>Terbaru</option>
                  <option>Harga terendah</option>
                  <option>Harga tertinggi</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-[#8A8780] bg-white rounded-2xl border border-[#E5E5E5]">
                Memuat produk dari database...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-[#8A8780] bg-white rounded-2xl border border-[#E5E5E5]">
                Tidak ada produk yang cocok dengan pencarian atau filter Anda.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

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
