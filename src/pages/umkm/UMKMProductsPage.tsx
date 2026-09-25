import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { StatusBadge } from "../../components/ui/Badge";
import { ConfirmModal } from "../../components/ui/Modal";
import { IconDashboard, IconStore, IconPackage, IconBarChart, IconLogout, IconPlus } from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";
import { productService, type ProductDetail } from "../../services/product.service";
import { sanitizeProductImageUrl, getProductFallbackImage } from "../../lib/imageUtils";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store", label: "Profil Toko", icon: <IconStore className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/products/add", label: "Tambah Produk", icon: <IconPlus className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

function formatRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default function UMKMProductsPage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const [umkm, setUmkm] = useState<UmkmWithCategory | null>(null);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load UMKM data & Products
  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Dapatkan profil toko UMKM pengguna saat ini
      const { data: umkmData, error: umkmErr } = await umkmService.getUmkmByUserId(user.id);
      if (umkmErr || !umkmData) {
        setErrorMsg("Profil toko UMKM tidak ditemukan untuk akun ini. Pastikan Anda telah terdaftar sebagai UMKM.");
        setLoading(false);
        return;
      }

      setUmkm(umkmData);

      // 2. Dapatkan daftar produk milik UMKM ini
      const { data: prodData, error: prodErr } = await productService.getProductsByUmkm(umkmData.id);
      if (prodErr) {
        setErrorMsg("Gagal memuat produk: " + prodErr.message);
      } else {
        setProducts(prodData);
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Hapus produk
  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const { error } = await productService.deleteProduct(deleteId);
      if (error) {
        alert("Gagal menghapus produk: " + error.message);
      } else {
        setProducts(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err: unknown) {
      alert("Error: " + ((err as Error).message || "Gagal menghapus"));
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: "image",
      header: "Foto",
      render: (r: ProductDetail) => {
        const fallback = getProductFallbackImage(r.kategori_produk?.nama_kategori || r.nama_produk);
        return (
          <img
            src={sanitizeProductImageUrl(r.gambar_url, r.kategori_produk?.nama_kategori || r.nama_produk)}
            alt={r.nama_produk}
            className="w-12 h-12 rounded-xl object-cover border border-[#E8E6E1]"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallback;
            }}
          />
        );
      },
    },
    {
      key: "name",
      header: "Nama Produk",
      render: (r: ProductDetail) => (
        <div>
          <span className="font-semibold text-[#202020] block">{r.nama_produk}</span>
          {r.product_variants?.length > 1 && (
            <span className="text-[11px] text-[#A07C10] font-medium">
              {r.product_variants.length} Varian
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      render: (r: ProductDetail) => (
        <span className="text-[13px] text-[#6B6B6B]">
          {r.kategori_produk?.nama_kategori || "-"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Harga",
      render: (r: ProductDetail) => {
        const lowestPrice = r.product_variants?.[0]?.harga ?? 0;
        return <span className="text-[13px] font-medium text-[#202020]">{formatRp(lowestPrice)}</span>;
      },
    },
    {
      key: "stock",
      header: "Stok",
      render: (r: ProductDetail) => {
        const totalStock = r.product_variants?.reduce((sum, v) => sum + (v.stock_levels?.sisa_stok ?? 0), 0) ?? 0;
        return (
          <span className={totalStock === 0 ? "text-[#D9534F] font-bold text-[13px]" : "text-[13px] text-[#202020]"}>
            {totalStock === 0 ? "Habis (0)" : totalStock}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (r: ProductDetail) => <StatusBadge status={r.status as "AKTIF" | "NONAKTIF"} type="verify" />,
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: ProductDetail) => (
        <div className="flex gap-2">
          <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar
        items={sidebarItems}
        onItemClick={(item) => {
          if (item.to === "/login") {
            logout();
          }
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
        <PanelHeader
          title="Kelola Produk"
          subtitle={`${umkm?.nama_toko || "Toko"} · ${products.length} produk terdaftar`}
          avatarLabel={umkm?.nama_toko?.[0]?.toUpperCase() || profile?.nama?.[0]?.toUpperCase() || "U"}
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={0}
          actions={
            <Link to="/umkm/products/add">
              <Button variant="primary" size="sm">+ Tambah Produk</Button>
            </Link>
          }
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Status Toko Warning Banner jika PENDING */}
          {umkm && umkm.status_verifikasi === "PENDING" && (
            <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-4 text-amber-800 text-xs flex items-start gap-3">
              <span className="text-base">⏳</span>
              <div>
                <p className="font-bold text-amber-900">Toko Anda Sedang Menunggu Verifikasi Admin</p>
                <p className="mt-0.5 text-amber-700">
                  Anda tetap dapat mempersiapkan dan menambahkan katalog produk sekarang. Produk akan otomatis dapat dibeli oleh customer begitu toko disetujui oleh Admin.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-[14px] p-4 text-rose-800 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <Button size="sm" variant="secondary" onClick={loadData}>Coba Lagi</Button>
            </div>
          )}

          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            {loading ? (
              <div className="py-16 text-center text-sm text-[#8A8780] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                <p>Memuat produk dari Supabase...</p>
              </div>
            ) : (
              <Table columns={columns} data={products} emptyMessage="Belum ada produk terdaftar. Klik + Tambah Produk untuk memulai katalog Anda." />
            )}
          </div>
        </main>
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteProduct}
        title="Hapus Produk"
        message="Apakah kamu yakin ingin menghapus produk ini? Semua varian dan data stok terkait di database akan dihapus permanen."
        confirmLabel={actionLoading ? "Menghapus..." : "Ya, Hapus"}
      />
    </div>
  );
}
