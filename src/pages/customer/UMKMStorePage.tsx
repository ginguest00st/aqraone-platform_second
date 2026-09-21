import { useState } from "react";
import Navbar from "../../components/ui/Navbar";
import Tabs from "../../components/ui/Tabs";
import ProductCard from "../../components/ui/ProductCard";
import { Stars } from "../../components/ui/ProductCard";

const products = [
  { id: "1", name: "Keripik Pisang Original", umkm: "Naraya Snack", price: 25000, rating: 4.8, stock: 120, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "2", name: "Keripik Tempe Pedas", umkm: "Naraya Snack", price: 20000, rating: 4.6, stock: 80, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format" },
  { id: "3", name: "Kripik Singkong Premium", umkm: "Naraya Snack", price: 18000, rating: 4.7, stock: 150, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&auto=format" },
];

const tabs = [
  { id: "products", label: "Produk" },
  { id: "about", label: "Tentang" },
  { id: "reviews", label: "Ulasan" },
];

export default function UMKMStorePage() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar cartCount={2} user={{ name: "Andi", role: "customer" }} />

      {/* Store Header */}
      <div className="bg-white border-b border-[#E5E5E5]">
        <div className="h-32 bg-gradient-to-r from-[#202020] to-[#3a3a3a] relative">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-5">
          <div className="flex items-end gap-5 -mt-8">
            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format" alt="Store" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#202020]">Naraya Snack</h1>
                <span className="text-xs bg-[#2E8B57] text-white px-2 py-0.5 rounded-full">✓ Terverifikasi</span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <Stars rating={4.8} />
                <span className="text-xs text-[#6B6B6B]">· 24 produk · 1.240 transaksi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Rating", value: "4.8 ⭐" },
            { label: "Produk", value: "24" },
            { label: "Transaksi", value: "1.240+" },
            { label: "Lokasi", value: "Bandung" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-[#E5E5E5] p-3 text-center">
              <p className="text-sm font-bold text-[#202020]">{value}</p>
              <p className="text-xs text-[#6B6B6B]">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          <div className="p-5">
            {activeTab === "products" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
            {activeTab === "about" && (
              <div className="space-y-4 text-sm text-[#6B6B6B]">
                <p><strong className="text-[#202020]">Deskripsi:</strong> Naraya Snack adalah produsen camilan tradisional Indonesia yang menggunakan bahan-bahan lokal berkualitas tinggi tanpa pengawet.</p>
                <p><strong className="text-[#202020]">Jam Operasional:</strong> Senin–Sabtu, 08:00–17:00 WIB</p>
                <p><strong className="text-[#202020]">Lokasi:</strong> Jl. Raya Dago No. 12, Bandung, Jawa Barat</p>
                <p><strong className="text-[#202020]">Kontak:</strong> naraya.snack@email.com · +62 812-3456-7890</p>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {[
                  { name: "Siti Rahayu", rating: 5, text: "Produk berkualitas, pengiriman cepat!" },
                  { name: "Budi Santoso", rating: 4, text: "Enak dan harga terjangkau." },
                ].map(r => (
                  <div key={r.name} className="flex gap-3 border-b border-[#E5E5E5] pb-4">
                    <div className="w-8 h-8 bg-[#FFF5D6] rounded-full flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">{r.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-[#202020]">{r.name}</p>
                      <Stars rating={r.rating} />
                      <p className="text-sm text-[#6B6B6B] mt-1">{r.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
