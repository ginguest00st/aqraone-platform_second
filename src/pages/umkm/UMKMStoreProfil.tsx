import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import { Input, Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { IconDashboard, IconStore, IconPackage, IconBarChart, IconLogout } from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { umkmService, type UmkmWithCategory } from "../../services/umkm.service";
import { categoryService } from "../../services/category.service";
import type { KategoriUmkm } from "../../types/database.types";

const sidebarItems = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store", label: "Profil Toko", icon: <IconStore className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

export default function UMKMStoreProfil() {
  const { user, profile, logout } = useAuth();

  const [umkm, setUmkm] = useState<UmkmWithCategory | null>(null);
  const [categories, setCategories] = useState<KategoriUmkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    nama_toko: "",
    nama_umkm: "",
    no_hp: "",
    email: "",
    alamat: "",
    kategori_umkm_id: "",
    deskripsi: "",
  });

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Ambil data profil UMKM
      const { data: uData, error: uErr } = await umkmService.getUmkmByUserId(user.id);
      if (uErr) throw uErr;

      if (uData) {
        setUmkm(uData);
        setForm({
          nama_toko: uData.nama_toko || "",
          nama_umkm: uData.nama_umkm || "",
          no_hp: uData.no_hp || "",
          email: uData.email || "",
          alamat: uData.alamat || "",
          kategori_umkm_id: uData.kategori_umkm_id || "",
          deskripsi: uData.deskripsi || "",
        });
      }

      // 2. Ambil master kategori UMKM
      const { data: cData } = await categoryService.getKategoriUmkm();
      if (cData) setCategories(cData);
    } catch (err: unknown) {
      setFeedback({ type: "error", message: (err as Error).message || "Gagal memuat profil toko" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!umkm) return;
    setSaving(true);
    setFeedback(null);

    try {
      const { data, error } = await umkmService.updateUmkm(umkm.id, {
        nama_toko: form.nama_toko.trim(),
        nama_umkm: form.nama_umkm.trim(),
        no_hp: form.no_hp.trim(),
        email: form.email.trim(),
        alamat: form.alamat.trim(),
        kategori_umkm_id: form.kategori_umkm_id || null,
        deskripsi: form.deskripsi.trim() || null,
      });

      if (error || !data) {
        throw error || new Error("Gagal memperbarui profil toko");
      }

      const selectedCategory = categories.find((c) => c.id === form.kategori_umkm_id);
      setUmkm((prev) =>
        prev
          ? {
              ...prev,
              ...data,
              kategori_umkm: selectedCategory
                ? { id: selectedCategory.id, nama_kategori: selectedCategory.nama_kategori }
                : (form.kategori_umkm_id ? prev.kategori_umkm : null),
            }
          : (data as unknown as UmkmWithCategory)
      );
      setEdit(false);
      setFeedback({ type: "success", message: "Profil toko berhasil diperbarui di Supabase!" });
    } catch (err: unknown) {
      setFeedback({ type: "error", message: (err as Error).message || "Terjadi kesalahan saat menyimpan." });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = () => {
    if (!umkm) return null;
    switch (umkm.status_verifikasi) {
      case "APPROVED":
        return <span className="text-xs bg-[#2E8B57] text-white px-2.5 py-0.5 rounded-full font-semibold">✓ Terverifikasi</span>;
      case "PENDING":
        return <span className="text-xs bg-amber-500 text-white px-2.5 py-0.5 rounded-full font-semibold">⏳ Menunggu Verifikasi</span>;
      case "REJECTED":
        return <span className="text-xs bg-rose-600 text-white px-2.5 py-0.5 rounded-full font-semibold">✕ Ditolak</span>;
      case "SUSPENDED":
        return <span className="text-xs bg-gray-600 text-white px-2.5 py-0.5 rounded-full font-semibold">⚠️ Ditangguhkan</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
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
        <PanelHeader
          title="Profil Toko"
          subtitle={`${umkm?.nama_toko || "Toko"} · Kelola informasi & identitas toko`}
          avatarLabel={umkm?.nama_toko?.[0]?.toUpperCase() || profile?.nama?.[0]?.toUpperCase() || "U"}
          avatarBg="bg-[#FDF6E3] border-2 border-[#C9A227]"
          avatarTextColor="text-[#C9A227]"
          notifCount={0}
          showSearch={false}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center justify-between ${
                feedback.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback(null)} className="font-bold hover:underline">
                ✕
              </button>
            </div>
          )}

          {/* Catatan Verifikasi Jika Ditolak Admin */}
          {umkm?.catatan_verifikasi && (
            <div className="bg-rose-50 border border-rose-200 rounded-[18px] p-4 text-rose-800 text-xs flex items-start gap-3">
              <span className="text-base">📝</span>
              <div>
                <p className="font-bold text-rose-900">Catatan dari Admin Verifikator:</p>
                <p className="mt-0.5 text-rose-700">{umkm.catatan_verifikasi}</p>
              </div>
            </div>
          )}

          {/* Store Header Banner */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] overflow-hidden">
            <div className="h-44 sm:h-48 md:h-52 bg-gradient-to-r from-[#202020] to-[#3a3a3a] relative">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1000&h=200&fit=crop&auto=format"
                alt=""
                className="w-full h-full object-cover opacity-75"
              />
            </div>
              <div className="px-6 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-[18px] border-4 border-white shadow-lg overflow-hidden bg-white shrink-0 -mt-10 z-10">
                      <img
                        src={
                          umkm?.logo_url ||
                          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=120&fit=crop&auto=format"
                        }
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-bold text-[#1A1714]">{umkm?.nama_toko || "Toko Belum Dinamai"}</h2>
                        {getStatusBadge()}
                      </div>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        Kode: <span className="font-mono font-medium text-[#1A1714]">{umkm?.kode_umkm}</span> · Kategori:{" "}
                        <span className="font-medium text-[#C9A227]">{umkm?.kategori_umkm?.nama_kategori || "Belum dipilih"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {edit ? (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => setEdit(false)} disabled={saving}>
                          Batal
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                          {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline-gold" size="sm" onClick={() => setEdit(true)}>
                        Edit Profil Toko
                      </Button>
                    )}
                  </div>
                </div>
              </div>
          </div>

          {/* Form Informasi Toko */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#1A1714]">Informasi Lengkap Usaha</h3>
              {edit && <span className="text-xs text-[#C9A227] font-semibold">Mode Edit Aktif</span>}
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-[#8A8780]">Memuat informasi toko dari Supabase...</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nama Toko Komersial"
                  value={form.nama_toko}
                  onChange={update("nama_toko")}
                  disabled={!edit}
                  placeholder="Nama brand toko yang tampil di marketplace"
                />
                <Input
                  label="Nama Pemilik / Badan Usaha"
                  value={form.nama_umkm}
                  onChange={update("nama_umkm")}
                  disabled={!edit}
                  placeholder="Nama legal atau pemilik"
                />
                <Input
                  label="Nomor WhatsApp / HP"
                  value={form.no_hp}
                  onChange={update("no_hp")}
                  disabled={!edit}
                  placeholder="08123456789"
                />
                <Input
                  label="Email Resmi Toko"
                  value={form.email}
                  onChange={update("email")}
                  disabled={!edit}
                  placeholder="toko@domain.com"
                />
                <Input
                  label="Alamat Lengkap Toko"
                  value={form.alamat}
                  onChange={update("alamat")}
                  disabled={!edit}
                  className="md:col-span-2"
                  placeholder="Alamat operasional toko atau tempat produksi"
                />
                <Select
                  label="Bidang Kategori UMKM"
                  options={
                    categories.length > 0
                      ? categories.map((c) => ({
                          value: c.id,
                          label: `${c.icon || ""} ${c.nama_kategori}`.trim(),
                        }))
                      : [{ value: "", label: "Pilih Kategori" }]
                  }
                  value={form.kategori_umkm_id}
                  onChange={update("kategori_umkm_id")}
                  disabled={!edit}
                />
                <Input
                  label="Deskripsi Singkat Toko"
                  value={form.deskripsi}
                  onChange={update("deskripsi")}
                  disabled={!edit}
                  placeholder="Ceritakan keistimewaan produk toko Anda"
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
