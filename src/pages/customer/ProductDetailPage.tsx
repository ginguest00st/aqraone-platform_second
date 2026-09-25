import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Navbar from "../../components/ui/Navbar";
import Button from "../../components/ui/Button";
import { Stars, formatRp } from "../../components/ui/ProductCard";
import Badge from "../../components/ui/Badge";
import { supabase } from "../../lib/supabase";
import { useCart } from "../../app/contexts/CartContext";
import { getProductFallbackImage } from "../../lib/imageUtils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    if (!id) return;
    supabase
      .from("products")
      .select(`
        *,
        umkm (id, nama_toko, nama_umkm, alamat),
        kategori_produk (nama_kategori),
        product_variants (
          *,
          stock_levels (*)
        )
      `)
      .eq("id", id)
      .maybeSingle()
      .then((res: any) => {
        const prodData = res?.data;
        if (prodData) {
          setProduct(prodData);
          if (prodData.product_variants && prodData.product_variants.length > 0) {
            setSelectedVariant(prodData.product_variants[0]);
          }
        }
      });
  }, [id]);

  const productName = product?.nama_produk || "Produk UMKM";
  const storeName = product?.umkm?.nama_toko || "Toko UMKM";
  const categoryName = product?.kategori_produk?.nama_kategori || "";
  const fallbackImg = getProductFallbackImage(categoryName || productName);
  const rawImage = product?.gambar_url;
  const validMainImage = (rawImage && typeof rawImage === "string" && !rawImage.startsWith("blob:"))
    ? rawImage
    : fallbackImg;
  const images = [validMainImage];
  const price = selectedVariant?.harga ? Number(selectedVariant.harga) : 25000;
  const stock = selectedVariant?.stock_levels?.sisa_stok ?? 100;
  const variants = product?.product_variants || [];

  const handleAddToCart = () => {
    addToCart({
      productId: id || product?.id || "prod-default",
      variantId: selectedVariant?.id,
      name: productName,
      umkm: storeName,
      variant: selectedVariant?.nama_varian || (variants.length > 0 ? variants[0].nama_varian : "Standard"),
      price,
      qty,
      image: validMainImage,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    buyNow({
      productId: id || product?.id || "prod-default",
      variantId: selectedVariant?.id,
      name: productName,
      umkm: storeName,
      variant: selectedVariant?.nama_varian || (variants.length > 0 ? variants[0].nama_varian : "Standard"),
      price,
      qty,
      image: validMainImage,
    });
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <Navbar user={{ name: "Andi", role: "customer" }} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#6B6B6B] mb-6">
          <Link to="/home" className="hover:text-[#D4AF37]">Home</Link>
          <span>/</span>
          <Link to={`/products?cat=${encodeURIComponent(categoryName)}`} className="hover:text-[#D4AF37]">{categoryName || "Produk"}</Link>
          <span>/</span>
          <span className="text-[#202020] truncate max-w-xs">{productName}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E5E5] h-96">
              <img
                src={images[activeImg] || validMainImage}
                alt={productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImg;
                }}
              />
              <div className="absolute top-3 left-3"><Badge variant="hot">Terlaris</Badge></div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-[#D4AF37]" : "border-[#E5E5E5]"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImg;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <span className="text-sm text-[#D4AF37] font-semibold">{storeName}</span>
              <h1 className="text-2xl font-bold text-[#202020] mt-1">{productName}</h1>
              <div className="flex items-center gap-3 mt-2">
                <Stars rating={4.8} />
                <span className="text-xs text-[#6B6B6B]">· Terverifikasi · Kualitas Terjamin</span>
              </div>
            </div>

            <div className="bg-[#FFF5D6] rounded-xl p-4">
              <p className="text-3xl font-bold text-[#202020]">{formatRp(price)}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Stok: <strong className="text-[#2E8B57]">{stock} tersedia</strong></p>
            </div>

            {/* Product Variants */}
            {variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[#202020] mb-2">Pilihan Varian / Kemasan</p>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((v: any) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                        selectedVariant?.id === v.id
                          ? "border-[#D4AF37] bg-[#FFF5D6] text-[#D4AF37] font-semibold"
                          : "border-[#E5E5E5] text-[#6B6B6B] hover:border-[#D4AF37]"
                      }`}
                    >
                      {v.nama_varian} ({formatRp(Number(v.harga) || 0)})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product?.deskripsi && (
              <div className="pt-2">
                <p className="text-sm font-semibold text-[#202020] mb-1.5">Deskripsi Produk</p>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{product.deskripsi}</p>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-[#202020] mb-2">Jumlah</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-xl border border-[#E5E5E5] text-lg font-bold text-[#202020] hover:border-[#D4AF37] transition-all flex items-center justify-center">−</button>
                <span className="w-12 text-center font-semibold text-[#202020]">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 rounded-xl border border-[#E5E5E5] text-lg font-bold text-[#202020] hover:border-[#D4AF37] transition-all flex items-center justify-center">+</button>
                <span className="text-sm text-[#6B6B6B]">Subtotal: <strong className="text-[#202020]">{formatRp(price * qty)}</strong></span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3 pt-2">
              <Button
                variant={added ? "secondary" : "outline-gold"}
                size="lg"
                onClick={handleAddToCart}
                className="flex-1 justify-center transition-all cursor-pointer font-semibold"
              >
                {added ? "✓ Masuk Keranjang!" : "Tambah ke Keranjang"}
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleBuyNow}
                className="flex-1 justify-center shadow-md hover:shadow-lg transition-all cursor-pointer font-semibold"
              >
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
