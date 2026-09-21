import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { StatusBadge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import {
  IconDashboard, IconAdmin, IconStore, IconShield, IconFolder,
  IconPackage, IconCreditCard, IconBarChart, IconLogout,
} from "../../components/ui/Icons";
import { umkmService, UmkmWithCategory } from "../../services/umkm.service";
import type { UmkmStatus } from "../../types/database.types";
import { useAuth } from "../../app/contexts/AuthContext";

const sidebarItems = [
  { to: "/admin", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/admin/admins", label: "Admin", icon: <IconAdmin className="w-4 h-4" /> },
  { to: "/admin/umkm", label: "UMKM", icon: <IconStore className="w-4 h-4" /> },
  { to: "/admin/umkm/verify", label: "Verifikasi UMKM", icon: <IconShield className="w-4 h-4" /> },
  { to: "/admin/categories", label: "Kategori", icon: <IconFolder className="w-4 h-4" /> },
  { to: "/admin/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/admin/transactions", label: "Transaksi", icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/admin/reports", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];

const filters: Array<{ key: string; label: string }> = [
  { key: "ALL", label: "Semua" },
  { key: "APPROVED", label: "Terverifikasi (Aktif)" },
  { key: "PENDING", label: "Pending" },
  { key: "REJECTED", label: "Ditolak" },
  { key: "SUSPENDED", label: "Dibekukan" },
];

export default function AdminUMKMPage() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [umkmList, setUmkmList] = useState<UmkmWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadUmkm = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await umkmService.getAllUmkm(activeFilter, search);
    if (error) {
      setErrorMsg("Gagal memuat data UMKM: " + error.message);
    } else {
      setUmkmList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUmkm();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeFilter, search]);

  const toggleSuspend = async (u: UmkmWithCategory) => {
    if (!user?.id) return;
    const nextStatus: UmkmStatus = u.status_verifikasi === "SUSPENDED" ? "APPROVED" : "SUSPENDED";
    const confirmMsg = nextStatus === "SUSPENDED"
      ? `Bekukan sementara akun toko ${u.nama_toko}?`
      : `Aktifkan kembali akun toko ${u.nama_toko}?`;

    if (!window.confirm(confirmMsg)) return;

    const { error } = await umkmService.verifyUmkm(u.id, nextStatus, user.id);
    if (error) {
      alert("Gagal mengubah status toko: " + error.message);
    } else {
      await loadUmkm();
    }
  };

  const columns = [
    {
      key: "logo",
      header: "Logo",
      render: (r: UmkmWithCategory) => (
        r.logo_url ? (
          <img src={r.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-[#FFF5D6] border border-[#F4D77D] flex items-center justify-center text-lg">
            🏪
          </div>
        )
      ),
    },
    {
      key: "nama_toko",
      header: "Nama Toko & Kode",
      render: (r: UmkmWithCategory) => (
        <div>
          <span className="font-semibold text-[#202020] block">{r.nama_toko}</span>
          <span className="text-[11px] font-mono text-[#D4AF37]">{r.kode_umkm}</span>
        </div>
      ),
    },
    {
      key: "nama_umkm",
      header: "Pemilik",
      render: (r: UmkmWithCategory) => (
        <div>
          <span className="text-sm text-[#202020] block">{r.nama_umkm}</span>
          <span className="text-xs text-[#7C7770]">{r.no_hp}</span>
        </div>
      ),
    },
    {
      key: "kategori",
      header: "Kategori Usaha",
      render: (r: UmkmWithCategory) => (
        <span className="text-xs font-medium text-[#4B5563]">
          {r.kategori_umkm?.nama_kategori || "Umum"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status Verifikasi",
      render: (r: UmkmWithCategory) => <StatusBadge status={r.status_verifikasi} type="verify" />,
    },
    {
      key: "created_at",
      header: "Tanggal Daftar",
      render: (r: UmkmWithCategory) => (
        <span className="text-xs text-[#6B6B6B]">
          {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: UmkmWithCategory) => (
        <div className="flex gap-1.5">
          {r.status_verifikasi === "APPROVED" && (
            <Button size="sm" variant="danger" onClick={() => toggleSuspend(r)}>
              Bekukan
            </Button>
          )}
          {r.status_verifikasi === "SUSPENDED" && (
            <Button size="sm" variant="outline-gold" onClick={() => toggleSuspend(r)}>
              Aktifkan
            </Button>
          )}
          {r.status_verifikasi === "PENDING" && (
            <a href="/admin/umkm/verify" className="px-2.5 py-1 text-xs bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#B8860B] transition-colors">
              Review
            </a>
          )}
        </div>
      ),
    },
  ];

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
          title="Daftar UMKM Terdaftar"
          subtitle={`${umkmList.length} total mitra UMKM di platform`}
          avatarLabel={user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          notifCount={0}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Filter Bar & Search */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex gap-1.5 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeFilter === f.key
                      ? "bg-[#D4AF37] text-white shadow-[0_2px_8px_rgba(212,175,55,0.35)]"
                      : "bg-[#F8F8F6] text-[#6B6B6B] hover:text-[#202020] hover:bg-[#EFEFEA]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-64">
              <Input
                placeholder="Cari nama toko atau pemilik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <Table
              columns={columns}
              data={umkmList}
              loading={loading}
              emptyMessage="Tidak ada data UMKM yang cocok dengan filter atau pencarian Anda."
            />
          </div>
        </main>
      </div>
    </div>
  );
}
