import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import { Input, Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { IconDashboard, IconStore, IconPackage, IconBarChart, IconLogout } from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";
import { categoryService } from "../../services/category.service";
import { productService, type VariantInput } from "../../services/product.service";
import type { KategoriProduk, ProductStatus } from "../../types/database.types";
import { compressImageFile } from "../../lib/imageUtils";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store", label: "Profil Toko", icon: <IconStore className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

interface VariantForm {
  name: string;
  size: string;
  color: string;
  price: string;
  stock: string;
  sku: string;
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&fit=crop&auto=format",
];

export default function UMKMAddProductPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [umkm, setUmkm] = useState<UmkmWithCategory | null>(null);
  const [categories, setCategories] = useState<KategoriProduk[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Basic Info
  const [namaProduk, setNamaProduk] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaDasar, setHargaDasar] = useState("25000");
  const [stokDasar, setStokDasar] = useState("100");
  const [status, setStatus] = useState<ProductStatus>("AKTIF");

  // State Foto Produk & Tab
  const [gambarUrl, setGambarUrl] = useState(SAMPLE_IMAGES[0]);
  const [activeTab, setActiveTab] = useState<"upload" | "sample">("upload");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Variants state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantForm[]>([
    { name: "Standar", size: "M", color: "Hitam", price: "25000", stock: "50", sku: "SKU-001" },
  ]);

  useEffect(() => {
    async function init() {
      if (!user) return;
      setLoadingInitial(true);
      try {
        const { data: uData } = await umkmService.getUmkmByUserId(user.id);
        if (uData) setUmkm(uData);

        const { data: cData } = await categoryService.getKategoriProduk();
        if (cData && cData.length > 0) {
          setCategories(cData);
          setKategoriId(cData[0].id);
        }
      } catch (err: unknown) {
        console.error("Init error:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    init();
  }, [user]);

  // Handle Upload Foto dari Device
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file gambar maksimal 5MB.");
        return;
      }
      try {
        const compressedDataUrl = await compressImageFile(file, 800, 0.85);
        setFilePreview(compressedDataUrl);
        setGambarUrl(compressedDataUrl);
      } catch (err: unknown) {
        console.error("Gagal mengompres gambar:", err);
        setErrorMessage("Gagal memproses gambar yang diunggah.");
      }
    }
  };

  // Handle Hapus Foto Pilihan
  const handleRemoveFile = () => {
    setFilePreview(null);
    setGambarUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addVariant = () =>
    setVariants((v) => [
      ...v,
      { name: `Varian ${v.length + 1}`, size: "L", color: "Putih", price: hargaDasar, stock: "30", sku: "" },
    ]);

  const removeVariant = (i: number) => setVariants((v) => v.filter((_, idx) => idx !== i));

  const updateVariant =
    (i: number, k: keyof VariantForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setVariants((v) => v.map((variant, idx) => (idx === i ? { ...variant, [k]: e.target.value } : variant)));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!umkm) {
      setErrorMessage("Profil toko UMKM tidak ditemukan.");
      return;
    }
    if (!namaProduk.trim()) {
      setErrorMessage("Nama produk wajib diisi.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      let variantInputs: VariantInput[] = [];

      if (hasVariants && variants.length > 0) {
        variantInputs = variants.map((v, idx) => {
          const varLabel = [v.size ? `Ukuran ${v.size}` : "", v.color || ""].filter(Boolean).join(" - ");
          return {
            nama_varian: varLabel.trim() || v.name || `Varian ${idx + 1}`,
            harga: Math.max(0, Number(v.price) || Number(hargaDasar) || 0),
            jumlah_stok: Math.max(0, Number(v.stock) || 0),
            min_stok: 5,
          };
        });
      } else {
        variantInputs = [
          {
            nama_varian: "Default",
            harga: Math.max(0, Number(hargaDasar) || 0),
            jumlah_stok: Math.max(0, Number(stokDasar) || 0),
            min_stok: 5,
          },
        ];
      }

      const { data, error } = await productService.createProduct({
        umkm_id: umkm.id,
        kategori_produk_id: kategoriId || null,
        nama_produk: namaProduk.trim(),
        deskripsi: deskripsi.trim() || null,
        gambar_url: gambarUrl,
        status: status,
        variants: variantInputs,
      });

      if (error || !data) {
        throw error || new Error("Gagal menyimpan produk ke database.");
      }

      navigate("/umkm/products");
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Terjadi kesalahan saat menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F8F6] overflow-hidden">
      <Sidebar
        items={sidebarItems}
        onItemClick={(item) => {
          if (item.to === "/login") logout();
        }}
        logo={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C9A227] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.35)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[13px] text-white">
                Aqra<span className="text-[#C9A227]">One</span>
              </p>
              <p className="text-[10px] text-white/40 tracking-wide">UMKM Panel</p>
            </div>
          </div>
        }
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E5E5E5] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#202020]">Tambah Produk</h1>
            <p className="text-xs text-[#6B6B6B]">
              {umkm ? `Menambahkan produk untuk toko: ${umkm.nama_toko}` : "Lengkapi informasi produk dengan benar"}
            </p>
          </div>
          <Link to="/umkm/products">
            <Button variant="secondary" size="sm">
              ← Kembali
            </Button>
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold hover:underline">
                ✕
              </button>
            </div>
          )}

          {/* Informasi Produk */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-4">Informasi Produk</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nama Produk"
                placeholder="Contoh: Keripik Pisang Cokelat Lumer"
                className="md:col-span-2"
                required
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
              />
              <Select
                label="Kategori Produk"
                options={
                  categories.length > 0
                    ? categories.map((c) => ({ value: c.id, label: `${c.icon || ""} ${c.nama_kategori}`.trim() }))
                    : [{ value: "", label: "Memuat kategori..." }]
                }
                value={kategoriId}
                onChange={(e) => setKategoriId(e.target.value)}
              />
              <Select
                label="Status Produk"
                options={[
                  { value: "AKTIF", label: "Aktif (Tersedia untuk dijual)" },
                  { value: "NONAKTIF", label: "Nonaktif (Sembunyikan dari katalog)" },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
              />
              <Input
                label="Deskripsi Produk"
                placeholder="Jelaskan keunggulan produk, komposisi, atau cara penyimpanan"
                className="md:col-span-2"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
              <Input
                label="Harga Dasar (Rp)"
                type="number"
                placeholder="25000"
                value={hargaDasar}
                onChange={(e) => setHargaDasar(e.target.value)}
              />
              <Input
                label="Stok Dasar"
                type="number"
                placeholder="100"
                value={stokDasar}
                onChange={(e) => setStokDasar(e.target.value)}
              />
            </div>
          </div>

          {/* Foto Produk (Device & Sample) */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <h2 className="font-semibold text-[#202020] mb-1">Foto Produk</h2>
            <p className="text-xs text-[#8A8780] mb-4">
              Pilih foto produk langsung dari perangkat HP/Laptop Anda.
            </p>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#E5E5E5] mb-5">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === "upload"
                    ? "border-[#C9A227] text-[#C9A227]"
                    : "border-transparent text-[#8A8780] hover:text-[#202020]"
                }`}
              >
                📁 Upload dari Perangkat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sample")}
                className={`pb-2.5 px-3 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === "sample"
                    ? "border-[#C9A227] text-[#C9A227]"
                    : "border-transparent text-[#8A8780] hover:text-[#202020]"
                }`}
              >
                🖼️ Sampel Foto
              </button>
            </div>

            {/* TAB 1: UPLOAD DARI PERANGKAT */}
            {activeTab === "upload" && (
              <div className="space-y-3">
                {filePreview ? (
                  /* Tampilan setelah foto dipilih */
                  <div className="border border-[#E5E5E5] rounded-2xl p-6 bg-[#FAFAF8] flex flex-col items-center justify-center text-center">
                    {/* Container Foto Preview */}
                    <div className="relative group mx-auto">
                      <img
                        src={filePreview}
                        alt="Preview Foto"
                        className="w-36 h-36 object-cover rounded-xl border border-[#E5E5E5] shadow-sm"
                      />

                      {/* Tombol Hapus Foto (Lingkaran Silang Merah di Pojok Kanan Atas) */}
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        title="Hapus foto"
                        className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-md transition-transform hover:scale-110 active:scale-95"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Tampilan Dropzone awal (belum ada foto) */
                  <div className="border-2 border-dashed border-[#E5E5E5] hover:border-[#C9A227] rounded-2xl p-6 text-center relative transition-all bg-[#FAFAF8]">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#F5F4F0] flex items-center justify-center mb-2 text-[#8A8780] text-xl">
                        📤
                      </div>
                      <p className="text-xs font-semibold text-[#202020]">Pilih File dari Perangkat</p>
                      <p className="text-[11px] text-[#8A8780] mt-1">Format JPG, PNG, WEBP (Maksimal 2MB)</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAMPEL PRESET FOTO */}
            {activeTab === "sample" && (
              <div className="grid grid-cols-5 gap-3">
                {SAMPLE_IMAGES.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setGambarUrl(img);
                      setFilePreview(null);
                    }}
                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                      gambarUrl === img
                        ? "border-[#C9A227] shadow-md ring-2 ring-[#C9A227]/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {gambarUrl === img && (
                      <div className="absolute top-1 right-1 bg-[#C9A227] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Varian Produk */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[#202020]">Varian Produk</h2>
                <p className="text-xs text-[#8A8780]">Aktifkan jika memiliki variasi ukuran atau warna</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1A1714]">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => setHasVariants(e.target.checked)}
                    className="w-4 h-4 text-[#C9A227] rounded accent-[#C9A227]"
                  />
                  Gunakan Varian
                </label>
                {hasVariants && (
                  <Button variant="outline-gold" size="sm" onClick={addVariant}>
                    + Tambah Varian
                  </Button>
                )}
              </div>
            </div>

            {hasVariants ? (
              <div className="space-y-4">
                {variants.map((v, i) => (
                  <div key={i} className="border border-[#E5E5E5] rounded-xl p-4 bg-[#FAFAF8]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-[#202020]">Varian {i + 1}</span>
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-xs text-[#D9534F] hover:underline font-medium"
                        >
                          Hapus Varian
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <Select
                        label="Ukuran / Tipe"
                        options={[
                          { value: "S", label: "S" },
                          { value: "M", label: "M" },
                          { value: "L", label: "L" },
                          { value: "XL", label: "XL" },
                          { value: "Regular", label: "Regular" },
                          { value: "Jumbo", label: "Jumbo" },
                        ]}
                        value={v.size}
                        onChange={updateVariant(i, "size")}
                      />
                      <Input
                        label="Warna / Rasa"
                        placeholder="Contoh: Balado"
                        value={v.color}
                        onChange={updateVariant(i, "color")}
                      />
                      <Input
                        label="Harga (Rp)"
                        type="number"
                        value={v.price}
                        onChange={updateVariant(i, "price")}
                      />
                      <Input
                        label="Stok Varian"
                        type="number"
                        value={v.stock}
                        onChange={updateVariant(i, "stock")}
                      />
                      <Input
                        label="SKU Kode"
                        placeholder="KP-M-01"
                        value={v.sku}
                        onChange={updateVariant(i, "sku")}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-[#FAFAF8] rounded-xl border border-dashed border-[#E8E6E1] text-center text-xs text-[#8A8780]">
                Produk ini menggunakan stok dan harga dasar tunggal.
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/umkm/products")}
              className="flex-1 justify-center"
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              className="flex-1 justify-center"
              disabled={submitting || loadingInitial}
            >
              {submitting ? "Menyimpan ke Supabase..." : "Simpan Produk"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}