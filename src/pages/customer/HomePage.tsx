import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../components/ui/Navbar";
import ProductCard from "../../components/ui/ProductCard";
import {
  IconSearch, IconArrowRight, IconHome, IconFolder,
  IconCart, IconPackage, IconUser, IconStar,
  IconMapPin, IconShield, IconStore,
} from "../../components/ui/Icons";
import { productService, type ProductWithUmkm } from "../../services/product.service";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";

const allProducts = [
  { id: "1",  name: "Keripik Pisang Original",  umkm: "Naraya Snack",    price: 25000,  rating: 4.8, stock: 120, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "2",  name: "Batik Tulis Motif Parang", umkm: "Batik Nusantara", price: 185000, rating: 4.6, stock: 45,  image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop&auto=format", badge: "new" as const },
  { id: "3",  name: "Kopi Arabika Gayo Aceh",   umkm: "Gayo Coffee",     price: 75000,  rating: 4.9, stock: 80,  image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "4",  name: "Tas Anyam Rotan Premium",  umkm: "Rattan Craft",    price: 145000, rating: 4.7, stock: 30,  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&auto=format" },
  { id: "5",  name: "Tempe Organik Homemade",   umkm: "Dapur Sehat",     price: 15000,  rating: 4.5, stock: 200, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format", badge: "new" as const },
  { id: "6",  name: "Gelang Perak Ukir Bali",   umkm: "Silver Bali",     price: 95000,  rating: 4.8, stock: 50,  image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop&auto=format" },
  { id: "7",  name: "Minyak Kelapa Murni 500ml",umkm: "Kopra Nusantara", price: 45000,  rating: 4.6, stock: 150, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop&auto=format" },
  { id: "8",  name: "Tenun Ikat NTT Original",  umkm: "Tenun Flores",    price: 320000, rating: 4.9, stock: 20,  image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&auto=format", badge: "hot" as const },
  { id: "9",  name: "Sambal Matah Khas Bali",   umkm: "Dapur Bali",      price: 35000,  rating: 4.7, stock: 90,  image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop&auto=format" },
  { id: "10", name: "Jamu Kunyit Asam Segar",   umkm: "Warisan Herbal",  price: 20000,  rating: 4.5, stock: 60,  image: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=400&h=300&fit=crop&auto=format", badge: "new" as const },
];

const defaultUmkmSpotlight = [
  { name: "Mulya Snack & Heritage", category: "Kuliner", rating: 4.9, products: 5, location: "Yogyakarta", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format" },
  { name: "Batik Danar Solo", category: "Fashion", rating: 4.8, products: 4, location: "Surakarta", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=200&h=200&fit=crop&auto=format" },
  { name: "Gayo Mountain Coffee", category: "Kopi", rating: 4.9, products: 3, location: "Aceh Tengah", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&auto=format" },
  { name: "Lombok Craft & Rattan", category: "Kerajinan", rating: 4.8, products: 3, location: "Lombok", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&auto=format" },
];

const TABS = ["Terlaris", "Terbaru", "Promo"] as const;
type Tab = typeof TABS[number];

const W = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-1 h-4 rounded-full bg-[#C9A227] inline-block shrink-0" />
      <span className="text-[11px] font-bold text-[#C9A227] tracking-[0.12em] uppercase">{children}</span>
    </div>
  );
}

export default function HomePage() {
  const [cart, setCart] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Terlaris");
  const [dbProducts, setDbProducts] = useState<ProductWithUmkm[]>([]);
  const [dbUmkm, setDbUmkm] = useState<UmkmWithCategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, umkmRes] = await Promise.all([
          productService.getAllProducts(),
          umkmService.getAllUmkm("APPROVED"),
        ]);
        if (prodRes.data && prodRes.data.length > 0) {
          setDbProducts(prodRes.data);
        }
        if (umkmRes.data && umkmRes.data.length > 0) {
          setDbUmkm(umkmRes.data);
        }
      } catch (e) {
        console.error("Home data load error:", e);
      }
    }
    loadData();
  }, []);

  const displayedProducts = dbProducts.length > 0
    ? dbProducts.map((p) => {
        const minPrice = p.product_variants && p.product_variants.length > 0
          ? Math.min(...p.product_variants.map((v) => Number(v.harga) || 0))
          : 25000;
        const totalStock = p.product_variants
          ? p.product_variants.reduce((sum, v) => sum + (v.stock_levels?.sisa_stok ?? 0), 0)
          : 50;
        return {
          id: p.id,
          name: p.nama_produk,
          umkm: p.umkm?.nama_toko || "UMKM Mitra",
          price: minPrice,
          rating: 4.8,
          stock: totalStock,
          image: p.gambar_url || "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=300&fit=crop",
          badge: (p.status === "AKTIF" ? "hot" : undefined) as "hot" | undefined,
        };
      })
    : allProducts;

  const displayedUmkm = dbUmkm.length > 0
    ? dbUmkm.map((u) => {
        const loc = u.alamat ? u.alamat.split(",")[1]?.trim() || u.alamat.split(",")[0] : "Indonesia";
        return {
          id: u.id,
          name: u.nama_toko,
          category: u.kategori_umkm?.nama_kategori || "UMKM Mitra",
          rating: 4.9,
          products: dbProducts.filter((p) => p.umkm_id === u.id).length || 4,
          location: loc,
          image: u.logo_url || "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
        };
      })
    : defaultUmkmSpotlight;

  const addToCart = (id: string) => setCart(prev => [...prev, id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F4F0] pb-16 md:pb-0 w-full">
      <Navbar cartCount={cart.length} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative w-full" style={{ height: 520 }}>
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&h=600&fit=crop&auto=format&q=85"
          alt="UMKM Indonesia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(105deg, rgba(15,12,9,0.92) 0%, rgba(15,12,9,0.75) 45%, rgba(15,12,9,0.3) 100%)",
        }} />

        {/* Decorative gold line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#C9A227] to-transparent" />

        <div className={`relative h-full ${W} flex flex-col justify-center`}>
          <div className="max-w-[600px]">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#EDD882] tracking-[0.14em] uppercase mb-5">
              <span className="w-6 h-px bg-[#EDD882]" />
              Platform UMKM Digital #1 Indonesia
            </span>
            <h1 className="font-display text-[40px] md:text-[54px] text-white leading-[1.1] mb-5">
              Temukan Produk<br />
              <span className="text-[#EDD882]">UMKM Lokal</span> Terbaik
            </h1>
            <p className="text-[15px] text-white/55 mb-8 leading-relaxed">
              Belanja langsung dari 2.400+ UMKM terverifikasi<br className="hidden md:block" />
              di seluruh Indonesia. Aman, terpercaya, berkualitas.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch}
              className="flex items-center bg-white rounded-[14px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              style={{ maxWidth: 540 }}
            >
              <IconSearch className="w-5 h-5 text-[#ABA9A4] ml-5 shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari produk, UMKM, atau kategori..."
                className="flex-1 px-4 py-[15px] text-[14px] outline-none text-[#1A1714] placeholder:text-[#C0BDB8] bg-transparent"
              />
              <button type="submit"
                className="m-1.5 px-6 py-3 bg-[#C9A227] text-white text-[13px] font-bold rounded-[10px] hover:bg-[#A07C10] transition-all shrink-0"
              >
                Cari
              </button>
            </form>

            {/* Quick searches */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <span className="text-[11px] text-white/35 font-medium">Populer:</span>
              {["Keripik Pisang", "Batik", "Kopi Gayo", "Tas Rotan", "Jamu Herbal"].map(q => (
                <button key={q} onClick={() => navigate(`/products?q=${q}`)}
                  className="text-[11px] text-white/60 hover:text-white border border-white/15 hover:border-white/35 rounded-full px-3 py-1 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Floating trust badge */}
        <div className="absolute right-16 bottom-10 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] px-5 py-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
            <IconShield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white">Transaksi Terlindungi</p>
            <p className="text-[11px] text-white/50">Dijamin via Finnet Payment</p>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────── */}
      <section className="w-full bg-[#1A1714]">
        <div className={`${W} py-0`}>
          <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-white/8">
            {[
              { value: "2.400+",  label: "UMKM Aktif" },
              { value: "48.000+", label: "Produk" },
              { value: "120K+",   label: "Transaksi" },
              { value: "34",      label: "Provinsi" },
              { value: "4.8★",    label: "Rating Platform" },
              { value: "100%",    label: "Terverifikasi" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center py-5 px-3 group">
                <span className="text-[22px] font-bold text-[#C9A227] font-display leading-none">{s.value}</span>
                <span className="text-[10px] text-white/35 mt-1.5 font-medium tracking-wide uppercase">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BANNERS ─────────────────────────── */}
      <section className={`${W} pt-12 pb-0`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <SectionLabel>Jelajahi Kategori</SectionLabel>
            <h2 className="font-display text-[26px] text-[#1A1714]">Koleksi Produk Unggulan</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-1.5 text-[13px] text-[#C9A227] font-semibold hover:underline">
            Lihat Semua <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { to: "/products?cat=Makanan",   img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=420&fit=crop&auto=format", title: "Makanan & Minuman",  sub: "800+ produk kuliner lokal", tag: "Terpopuler" },
            { to: "/products?cat=Fashion",   img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=700&h=420&fit=crop&auto=format", title: "Fashion & Batik",    sub: "Kain tradisional terpilih", tag: "Berkualitas" },
            { to: "/products?cat=Kerajinan", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&h=420&fit=crop&auto=format", title: "Kerajinan Tangan",  sub: "Produk seni & handmade", tag: "Eksklusif" },
          ].map(b => (
            <Link key={b.to} to={b.to}
              className="group relative overflow-hidden rounded-[20px] h-[240px] shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-300"
            >
              <img src={b.img} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0c09]/90 via-[#0f0c09]/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold text-white bg-[#1A1714]/70 backdrop-blur-sm px-3 py-1.5 rounded-full tracking-widest uppercase border border-white/20">
                  {b.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display text-[20px] text-white leading-tight mb-1">{b.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[12px] text-white/60">{b.sub}</p>
                  <IconArrowRight className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ─────────────────────────────────── */}
      <section className={`${W} pt-14 pb-14`}>
        <div className="flex items-end justify-between mb-6">
          <div>
            <SectionLabel>Produk Pilihan</SectionLabel>
            <h2 className="font-display text-[26px] text-[#1A1714]">Pilihan Terbaik Hari Ini</h2>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-1.5 text-[13px] text-[#C9A227] font-semibold hover:underline">
            Lihat Semua <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab filter */}
        <div className="flex items-center gap-1 mb-6 bg-white border border-[#E8E6E1] rounded-[12px] p-1 w-fit">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-[9px] text-[13px] font-semibold transition-all ${
                activeTab === tab
                  ? "bg-[#1A1714] text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  : "text-[#7C7770] hover:text-[#1A1714]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayedProducts.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#1A1714] text-[#1A1714] font-semibold text-[14px] rounded-[12px] hover:bg-[#1A1714] hover:text-white transition-all"
          >
            Tampilkan Lebih Banyak <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── PROMO BANNER ─────────────────────────────── */}
      <section className={`${W} pb-14`}>
        <div className="relative overflow-hidden rounded-[24px] h-[220px]">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&h=440&fit=crop&auto=format&q=85"
            alt="Promo Ongkir"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(15,12,9,0.95) 0%, rgba(15,12,9,0.8) 40%, rgba(15,12,9,0.3) 100%)" }} />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A227]" />
          <div className="absolute inset-0 flex items-center px-10 md:px-14 justify-between">
            <div>
              <p className="text-[11px] font-bold text-[#EDD882] tracking-[0.14em] uppercase mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-[#EDD882]" /> Promo Spesial
              </p>
              <h3 className="font-display text-[28px] md:text-[36px] text-white leading-tight mb-2">
                Gratis Ongkir Pembelian Pertama
              </h3>
              <p className="text-[13px] text-white/60">
                Gunakan kode: <strong className="text-[#EDD882] font-bold tracking-[0.1em]">AQRA2026</strong>
              </p>
            </div>
            <div className="hidden md:block shrink-0">
              <Link to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C9A227] text-white font-bold text-[14px] rounded-[14px] hover:bg-[#A07C10] transition-all shadow-[0_4px_24px_rgba(201,162,39,0.45)]"
              >
                Daftar Sekarang <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── UMKM SPOTLIGHT ───────────────────────────── */}
      <section className="w-full bg-white border-y border-[#E8E6E1]">
        <div className={`${W} py-14`}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <SectionLabel>UMKM Terpopuler</SectionLabel>
              <h2 className="font-display text-[26px] text-[#1A1714]">Toko yang Sedang Naik Daun</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1.5 text-[13px] text-[#C9A227] font-semibold hover:underline">
              Semua UMKM <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedUmkm.map(u => (
              <Link key={u.name} to={`/products?q=${encodeURIComponent(u.name)}`}
                className="group flex flex-col items-center text-center p-5 bg-[#FAFAF8] border border-[#EBEBEA] rounded-[20px] hover:border-[#C9A227] hover:shadow-[0_4px_20px_rgba(201,162,39,0.10)] transition-all"
              >
                <div className="relative mb-4">
                  <img src={u.image} alt={u.name}
                    className="w-[68px] h-[68px] rounded-full object-cover ring-2 ring-[#E8E6E1] group-hover:ring-[#C9A227] transition-all"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-[#1A1714] truncate w-full mb-0.5">{u.name}</p>
                <p className="text-[11px] text-[#ABA9A4] mb-3">{u.category}</p>
                <div className="w-full pt-3 border-t border-[#EBEBEA] flex items-center justify-center gap-3 text-[11px] text-[#7C7770]">
                  <span className="flex items-center gap-0.5 text-[#C9A227] font-bold"><IconStar className="w-3 h-3" />{u.rating}</span>
                  <span className="text-[#D0CEC9]">|</span>
                  <span>{u.products} produk</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#ABA9A4] mt-2">
                  <IconMapPin className="w-3 h-3 shrink-0" />{u.location}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY AQRAONE ──────────────────────────────── */}
      <section className="w-full bg-[#1A1714]">
        <div className={`${W} py-16`}>
          <div className="text-center mb-10">
            <SectionLabel>Kenapa AqraOne?</SectionLabel>
            <h2 className="font-display text-[30px] md:text-[38px] text-white mt-1">
              Belanja Lebih Mudah, Aman & Terpercaya
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { icon: <IconShield className="w-6 h-6" />, title: "Pembayaran Aman", desc: "Transaksi dijamin via Finnet Payment Gateway bersertifikat Bank Indonesia" },
              { icon: <IconStore className="w-6 h-6" />,  title: "UMKM Terverifikasi", desc: "Setiap penjual telah melalui proses verifikasi ketat" },
              { icon: <IconStar className="w-6 h-6" />,   title: "Produk Berkualitas", desc: "48.000+ produk pilihan dari UMKM terbaik di 34 provinsi" },
              { icon: <IconPackage className="w-6 h-6" />, title: "Pengiriman Cepat", desc: "Mitra ekspedisi terpercaya untuk pengiriman ke seluruh Indonesia" },
            ].map((f, i) => (
              <div key={f.title}
                className="relative p-6 rounded-[20px] border border-white/8 hover:border-[#C9A227]/40 hover:bg-white/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-[14px] bg-[#C9A227]/10 group-hover:bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227] mb-5 transition-all">
                  {f.icon}
                </div>
                <div className="absolute top-6 right-6 text-[28px] font-bold text-white/5 font-display leading-none">0{i+1}</div>
                <h3 className="font-semibold text-white text-[15px] mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/45 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA UMKM ─────────────────────────────────── */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FDF3D0 0%, #FFFBF0 60%, #FDF3D0 100%)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30"
          style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #C9A227 0%, transparent 70%)" }}
        />
        <div className={`${W} py-16 relative flex flex-col md:flex-row items-center justify-between gap-10`}>
          <div className="flex-1">
            <SectionLabel>Punya UMKM?</SectionLabel>
            <h2 className="font-display text-[30px] md:text-[40px] text-[#1A1714] leading-tight mt-1 mb-4">
              Daftarkan Tokomu &<br />Jangkau Lebih Banyak Pembeli
            </h2>
            <p className="text-[14px] text-[#7C7770] leading-relaxed max-w-md">
              Bergabung bersama 2.400+ UMKM yang sudah berjualan di AqraOne. Gratis pendaftaran, mudah dikelola.
            </p>
            <div className="flex items-center gap-6 mt-6">
              {[["2.400+", "UMKM aktif"], ["48K+", "Pembeli"], ["Gratis", "Pendaftaran"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-[18px] font-bold text-[#C9A227] font-display">{v}</p>
                  <p className="text-[11px] text-[#ABA9A4] font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link to="/register/umkm"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-[#C9A227] text-white font-bold text-[14px] rounded-[14px] hover:bg-[#A07C10] transition-all shadow-[0_4px_20px_rgba(201,162,39,0.35)]"
            >
              Daftarkan UMKM Gratis <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products"
              className="inline-flex items-center justify-center px-9 py-4 border-2 border-[#1A1714]/20 text-[#1A1714] font-semibold text-[14px] rounded-[14px] hover:border-[#1A1714] transition-all"
            >
              Mulai Belanja
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="w-full bg-[#0F0C09]">
        <div className={`${W} pt-14 pb-8`}>
          <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-white/8">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-[#C9A227] rounded-[10px] flex items-center justify-center shadow-[0_2px_12px_rgba(201,162,39,0.4)]">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/></svg>
                </div>
                <span className="font-bold text-[16px] text-white">Aqra<span className="text-[#C9A227]">One</span></span>
              </div>
              <p className="text-[12px] text-white/35 leading-relaxed mb-5">
                Platform marketplace UMKM digital terpercaya, menghubungkan penjual dan pembeli di seluruh Indonesia.
              </p>
              <div className="flex items-center gap-2">
                {["IG", "FB", "TW", "YT"].map(s => (
                  <div key={s} className="w-8 h-8 rounded-full bg-white/8 hover:bg-[#C9A227]/30 flex items-center justify-center text-[10px] font-bold text-white/40 hover:text-[#EDD882] cursor-pointer transition-all">
                    {s}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "Belanja",  links: ["Semua Produk", "Promo & Diskon", "UMKM Terpopuler", "Flash Sale"] },
              { title: "UMKM",    links: ["Daftar UMKM", "Login Penjual", "Panduan Berjualan", "Statistik Toko"] },
              { title: "Bantuan", links: ["Pusat Bantuan", "Hubungi Kami", "Kebijakan Privasi", "Syarat & Ketentuan"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-[13px] mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-[12px] text-white/35 hover:text-white/75 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25">© 2026 AqraOne. Platform UMKM Digital Indonesia. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-white/8 rounded-[8px] text-[10px] font-medium text-white/35">Finnet Payment</div>
              <div className="px-3 py-1.5 bg-white/8 rounded-[8px] text-[10px] font-medium text-white/35">OJK Terdaftar</div>
              <div className="px-3 py-1.5 bg-white/8 rounded-[8px] text-[10px] font-medium text-white/35">SSL Secured</div>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Mobile bottom nav ──────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8E6E1] z-40">
        <div className="flex">
          {[
            { icon: <IconHome className="w-5 h-5" />,    label: "Home",      to: "/" },
            { icon: <IconFolder className="w-5 h-5" />,  label: "Kategori",  to: "/products" },
            { icon: <IconCart className="w-5 h-5" />,    label: "Keranjang", to: "/cart" },
            { icon: <IconPackage className="w-5 h-5" />, label: "Pesanan",   to: "/orders" },
            { icon: <IconUser className="w-5 h-5" />,    label: "Profil",    to: "/profile" },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="flex-1 flex flex-col items-center py-2.5 text-[#ABA9A4] hover:text-[#C9A227] transition-colors"
            >
              {item.icon}
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
