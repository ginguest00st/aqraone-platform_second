import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import {
  IconDashboard, IconAdmin, IconStore, IconShield, IconFolder,
  IconPackage, IconCreditCard, IconBarChart, IconLogout,
} from "../../components/ui/Icons";
import PanelHeader from "../../components/ui/PanelHeader";
import { umkmService, UmkmWithCategory } from "../../services/umkm.service";
import { useAuth } from "../../app/contexts/AuthContext";

const sidebarItems = [
  { to: "/admin", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/admin/admins", label: "Manajemen User", icon: <IconAdmin className="w-4 h-4" /> },
  { to: "/admin/umkm", label: "UMKM", icon: <IconStore className="w-4 h-4" /> },
  { to: "/admin/umkm/verify", label: "Verifikasi UMKM", icon: <IconShield className="w-4 h-4" /> },
  { to: "/admin/categories", label: "Kategori", icon: <IconFolder className="w-4 h-4" /> },
  { to: "/admin/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/admin/transactions", label: "Transaksi", icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/admin/reports", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

export default function AdminVerifyUMKMPage() {
  const { user } = useAuth();
  const [pendingList, setPendingList] = useState<UmkmWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Reject modal state
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const loadPending = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await umkmService.getPendingUmkm();
    if (error) {
      setErrorMsg("Gagal memuat data verifikasi UMKM: " + error.message);
    } else {
      setPendingList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (umkmId: string) => {
    if (!user?.id) return;
    setActionLoadingId(umkmId);
    const { error } = await umkmService.verifyUmkm(umkmId, "APPROVED", user.id);
    if (error) {
      alert("Gagal menyetujui UMKM: " + error.message);
    } else {
      setPendingList(prev => prev.filter(u => u.id !== umkmId));
    }
    setActionLoadingId(null);
  };

  const handleReject = async () => {
    if (!rejectId || !user?.id) return;
    if (!rejectReason.trim()) {
      alert("Harap masukkan alasan penolakan!");
      return;
    }

    setActionLoadingId(rejectId);
    const { error } = await umkmService.verifyUmkm(rejectId, "REJECTED", user.id, rejectReason.trim());
    if (error) {
      alert("Gagal menolak UMKM: " + error.message);
    } else {
      setPendingList(prev => prev.filter(u => u.id !== rejectId));
      setRejectId(null);
      setRejectReason("");
    }
    setActionLoadingId(null);
  };

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar
        items={sidebarItems}
        logo={
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#C9A227] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.35)]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[13px] text-white">Aqra<span className="text-[#C9A227]">One</span></p>
              <p className="text-[10px] text-white/40 tracking-wide">Admin Panel</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Verifikasi UMKM"
          subtitle={`${pendingList.length} UMKM menunggu verifikasi pendaftaran`}
          avatarLabel={user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          notifCount={pendingList.length}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {errorMsg && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[#6B6B6B]">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm">Memuat data pendaftaran UMKM dari database...</p>
            </div>
          ) : pendingList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E6E1] p-12 text-center max-w-lg mx-auto mt-10">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-[#1A1714] mb-1">Semua UMKM Sudah Diverifikasi</h3>
              <p className="text-sm text-[#7C7770]">Tidak ada pengajuan toko baru yang berstatus PENDING saat ini.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
              {pendingList.map((u) => (
                <div key={u.id} className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col justify-between">
                  <div className="p-5">
                    {/* Header Card */}
                    <div className="flex items-start gap-3 mb-4">
                      {u.logo_url ? (
                        <img src={u.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border border-[#E8E6E1]" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#FFF5D6] border border-[#F4D77D] flex items-center justify-center text-2xl">
                          🏪
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">{u.kode_umkm}</span>
                        <h3 className="font-bold text-[#1A1714] text-base truncate">{u.nama_toko}</h3>
                        <p className="text-xs text-[#7C7770]">Pemilik: <span className="font-medium text-[#202020]">{u.nama_umkm}</span></p>
                      </div>
                    </div>

                    {/* Details Info */}
                    <div className="space-y-2 bg-[#FAFAF8] rounded-xl p-3 text-xs mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Kategori Usaha:</span>
                        <span className="font-medium text-[#202020]">
                          {u.kategori_umkm?.nama_kategori || "Umum"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Kontak / HP:</span>
                        <span className="font-medium text-[#202020]">{u.no_hp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#6B6B6B]">Email:</span>
                        <span className="font-medium text-[#202020] truncate max-w-[150px]">{u.email}</span>
                      </div>
                      <div>
                        <span className="text-[#6B6B6B] block mb-0.5">Alamat Usaha:</span>
                        <span className="font-medium text-[#202020] leading-snug">{u.alamat}</span>
                      </div>
                    </div>

                    {u.deskripsi && (
                      <p className="text-xs text-[#6B6B6B] line-clamp-2 italic mb-4">
                        &quot;{u.deskripsi}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-[#F0EFEA] p-4 bg-[#FAFAF8] flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 justify-center"
                      loading={actionLoadingId === u.id}
                      onClick={() => handleApprove(u.id)}
                    >
                      ✓ Setujui (Approve)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1 justify-center"
                      disabled={actionLoadingId === u.id}
                      onClick={() => { setRejectId(u.id); setRejectReason(""); }}
                    >
                      ✕ Tolak
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Alasan Penolakan */}
      <Modal
        open={!!rejectId}
        onClose={() => setRejectId(null)}
        title="Tolak Verifikasi UMKM"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRejectId(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={actionLoadingId === rejectId}
              onClick={handleReject}
            >
              Kirim Penolakan
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-[#6B6B6B]">
            Tuliskan alasan penolakan verifikasi agar pemilik UMKM dapat memperbaiki data atau dokumen usahanya:
          </p>
          <Input
            label="Alasan Penolakan"
            placeholder="Contoh: Dokumen legalitas buram, nomor telepon tidak aktif, dll."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
