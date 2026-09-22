import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { StatusBadge } from "../../components/ui/Badge";
import Modal, { ConfirmModal } from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import StatCard from "../../components/ui/StatCard";
import {
  IconDashboard, IconAdmin, IconStore, IconShield, IconFolder,
  IconPackage, IconCreditCard, IconBarChart, IconLogout, IconPlus,
} from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { userService, type UserWithStore, type UserStats } from "../../services/user.service";
import type { UserRole } from "../../types/database.types";

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

const roleFilters = [
  { key: "ALL", label: "Semua Pengguna" },
  { key: "CUSTOMER", label: "Customer" },
  { key: "UMKM", label: "Mitra UMKM" },
  { key: "ADMIN", label: "Administrator" },
];

const roleBadgeClass: Record<string, string> = {
  ADMIN: "bg-amber-50 text-amber-800 border border-amber-300",
  UMKM: "bg-blue-50 text-blue-700 border border-blue-200",
  CUSTOMER: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const roleOptions = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "UMKM", label: "UMKM" },
  { value: "ADMIN", label: "Admin" },
];

function getInitials(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminManagePage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserWithStore[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, customer: 0, umkm: 0, admin: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserWithStore | null>(null);
  const [roleEditUser, setRoleEditUser] = useState<UserWithStore | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserWithStore | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add user form
  const [addNama, setAddNama] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPassword, setAddPassword] = useState("");
  const [addRole, setAddRole] = useState<UserRole>("CUSTOMER");
  const [addPhone, setAddPhone] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  // Role change form
  const [newRole, setNewRole] = useState<UserRole>("CUSTOMER");

  const loadUsers = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await userService.getAllUsers(activeFilter, search);
    if (error) {
      setErrorMsg("Gagal memuat data pengguna: " + (error.message || String(error)));
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    const { data } = await userService.getUserStats();
    setStats(data);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [activeFilter, search]);

  useEffect(() => {
    loadStats();
  }, []);

  // --- Add User ---
  const handleAddUser = async () => {
    if (!addNama.trim() || !addEmail.trim() || !addPassword) {
      setAddError("Nama, Email, dan Password wajib diisi.");
      return;
    }
    if (addPassword.length < 8) {
      setAddError("Password minimal 8 karakter.");
      return;
    }

    setAddError(null);
    setSubmitting(true);

    const { error } = await userService.createUser({
      email: addEmail,
      password: addPassword,
      nama: addNama,
      role: addRole,
      no_hp: addPhone || undefined,
    });

    if (error) {
      setAddError(error.message || "Gagal membuat pengguna baru.");
    } else {
      setAddOpen(false);
      resetAddForm();
      await loadUsers();
      await loadStats();
    }
    setSubmitting(false);
  };

  const resetAddForm = () => {
    setAddNama("");
    setAddEmail("");
    setAddPassword("");
    setAddRole("CUSTOMER");
    setAddPhone("");
    setAddError(null);
  };

  // --- Change Role ---
  const handleChangeRole = async () => {
    if (!roleEditUser) return;
    setSubmitting(true);
    const { error } = await userService.updateUserRole(roleEditUser.id, newRole);
    if (error) {
      alert("Gagal mengubah role: " + (error.message || String(error)));
    } else {
      setRoleEditUser(null);
      await loadUsers();
      await loadStats();
    }
    setSubmitting(false);
  };

  // --- Delete User ---
  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    setSubmitting(true);
    const { error } = await userService.deleteUser(deleteUser.id);
    if (error) {
      alert("Gagal menghapus pengguna: " + (error.message || String(error)));
    } else {
      setDeleteUser(null);
      await loadUsers();
      await loadStats();
    }
    setSubmitting(false);
  };

  const columns = [
    {
      key: "no",
      header: "No",
      render: (_: UserWithStore, i?: number) => (
        <span className="text-[#ABA9A4] text-xs font-medium">{(i ?? 0) + 1}</span>
      ),
      className: "w-12",
    },
    {
      key: "user",
      header: "Pengguna",
      render: (r: UserWithStore) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1A1714] text-white font-bold text-[11px] flex items-center justify-center shrink-0">
            {getInitials(r.nama)}
          </div>
          <div>
            <p className="font-semibold text-[#202020] text-[13px] leading-tight">{r.nama}</p>
            <p className="text-[11px] text-[#ABA9A4] font-mono">{r.id.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (r: UserWithStore) => (
        <span className="text-[13px] text-[#3D3A36]">{r.email}</span>
      ),
    },
    {
      key: "no_hp",
      header: "No. HP",
      render: (r: UserWithStore) => (
        <span className="text-[13px] text-[#3D3A36]">{r.no_hp || "—"}</span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (r: UserWithStore) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${roleBadgeClass[r.role] || "bg-stone-100 text-stone-500 border border-stone-200"}`}
        >
          {r.role}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Bergabung",
      render: (r: UserWithStore) => (
        <span className="text-[12px] text-[#7C7770]">{formatDate(r.created_at)}</span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: UserWithStore) => (
        <div className="flex gap-1.5 flex-wrap">
          <Button size="sm" variant="secondary" onClick={() => setDetailUser(r)}>
            Detail
          </Button>
          <Button
            size="sm"
            variant="outline-gold"
            onClick={() => {
              setRoleEditUser(r);
              setNewRole(r.role);
            }}
          >
            Ubah Role
          </Button>
          {r.id !== profile?.id && (
            <Button size="sm" variant="danger" onClick={() => setDeleteUser(r)}>
              Hapus
            </Button>
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
              <p className="font-bold text-[13px] text-white">
                Aqra<span className="text-[#C9A227]">One</span>
              </p>
              <p className="text-[10px] text-white/40 tracking-wide">Admin Panel</p>
            </div>
          </div>
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Manajemen Pengguna"
          subtitle="Kelola seluruh akun pengguna, customer, mitra UMKM, dan administrator"
          avatarLabel={profile ? getInitials(profile.nama) : "AD"}
          notifCount={stats.total}
          actions={
            <Button variant="primary" size="sm" onClick={() => { resetAddForm(); setAddOpen(true); }}>
              + Tambah Pengguna
            </Button>
          }
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Pengguna"
              value={String(stats.total)}
              icon={<IconAdmin className="w-5 h-5" />}
              accent
            />
            <StatCard
              label="Customer"
              value={String(stats.customer)}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Mitra UMKM"
              value={String(stats.umkm)}
              icon={<IconStore className="w-5 h-5" />}
              iconBg="bg-blue-50"
            />
            <StatCard
              label="Administrator"
              value={String(stats.admin)}
              icon={<IconShield className="w-5 h-5" />}
              iconBg="bg-amber-50"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {roleFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold transition-all ${
                  activeFilter === f.key
                    ? "bg-[#C9A227] text-white shadow-[0_2px_8px_rgba(201,162,39,0.3)]"
                    : "bg-white border border-[#E8E6E1] text-[#7C7770] hover:border-[#C9A227] hover:text-[#C9A227]"
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="ml-auto">
              <input
                type="text"
                placeholder="Cari nama, email, no. HP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-[#E8E6E1] bg-white rounded-[10px] px-4 py-2 text-[12px] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 w-56 transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Table */}
          <div
            className="bg-white rounded-[18px] border border-[#E8E6E1] p-5"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <Table columns={columns} data={users} loading={loading} emptyMessage="Belum ada pengguna terdaftar." />
          </div>
        </main>
      </div>

      {/* ====== MODAL: Tambah Pengguna ====== */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Tambah Pengguna Baru"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)} disabled={submitting}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddUser} loading={submitting}>
              Simpan
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {addError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {addError}
            </div>
          )}
          <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" value={addNama} onChange={(e) => setAddNama(e.target.value)} required />
          <Input label="Email" type="email" placeholder="email@contoh.com" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} required />
          <Input label="No. HP (opsional)" type="tel" placeholder="08xxxxxxxxxx" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} />
          <Select
            label="Role"
            options={roleOptions}
            value={addRole}
            onChange={(e) => setAddRole(e.target.value as UserRole)}
          />
          <Input label="Password" type="password" placeholder="Min 8 karakter" value={addPassword} onChange={(e) => setAddPassword(e.target.value)} required />
        </div>
      </Modal>

      {/* ====== MODAL: Detail Pengguna ====== */}
      <Modal
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        title="Detail Pengguna"
        size="lg"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setDetailUser(null)}>
            Tutup
          </Button>
        }
      >
        {detailUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1A1714] text-white font-bold text-lg flex items-center justify-center">
                {getInitials(detailUser.nama)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1714]">{detailUser.nama}</h3>
                <p className="text-sm text-[#7C7770]">{detailUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">User ID</p>
                <p className="font-mono text-[#3D3A36] text-xs break-all">{detailUser.id}</p>
              </div>
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">Role</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${roleBadgeClass[detailUser.role] || ""}`}>
                  {detailUser.role}
                </span>
              </div>
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">No. HP</p>
                <p className="text-[#3D3A36]">{detailUser.no_hp || "—"}</p>
              </div>
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">Jenis Kelamin</p>
                <p className="text-[#3D3A36]">{detailUser.jenis_kelamin || "—"}</p>
              </div>
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">Tanggal Lahir</p>
                <p className="text-[#3D3A36]">{detailUser.tanggal_lahir ? formatDate(detailUser.tanggal_lahir) : "—"}</p>
              </div>
              <div>
                <p className="text-[#ABA9A4] text-xs mb-0.5">Bergabung Sejak</p>
                <p className="text-[#3D3A36]">{formatDate(detailUser.created_at)}</p>
              </div>
            </div>

            {detailUser.umkm && (
              <div className="bg-[#FDF6E3] rounded-xl p-4 border border-[#EDD882]/40">
                <h4 className="text-sm font-bold text-[#A07C10] mb-2">Data Toko UMKM</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[#ABA9A4] text-xs mb-0.5">Nama Toko</p>
                    <p className="font-semibold text-[#3D3A36]">{detailUser.umkm.nama_toko}</p>
                  </div>
                  <div>
                    <p className="text-[#ABA9A4] text-xs mb-0.5">Kode UMKM</p>
                    <p className="font-mono text-[#3D3A36]">{detailUser.umkm.kode_umkm}</p>
                  </div>
                  <div>
                    <p className="text-[#ABA9A4] text-xs mb-0.5">Status Verifikasi</p>
                    <StatusBadge status={detailUser.umkm.status_verifikasi} type="verify" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ====== MODAL: Ubah Role ====== */}
      <Modal
        open={!!roleEditUser}
        onClose={() => setRoleEditUser(null)}
        title="Ubah Role Pengguna"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRoleEditUser(null)} disabled={submitting}>
              Batal
            </Button>
            <Button variant="primary" size="sm" onClick={handleChangeRole} loading={submitting}>
              Simpan Perubahan
            </Button>
          </>
        }
      >
        {roleEditUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[#F5F4F1] rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-[#1A1714] text-white font-bold text-[12px] flex items-center justify-center">
                {getInitials(roleEditUser.nama)}
              </div>
              <div>
                <p className="font-semibold text-[13px] text-[#1A1714]">{roleEditUser.nama}</p>
                <p className="text-[11px] text-[#7C7770]">{roleEditUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-[#ABA9A4] mb-1">Role Saat Ini</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${roleBadgeClass[roleEditUser.role] || ""}`}>
                  {roleEditUser.role}
                </span>
              </div>
              <svg className="w-5 h-5 text-[#ABA9A4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="flex-1">
                <Select label="Role Baru" options={roleOptions} value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} />
              </div>
            </div>
            {roleEditUser.id === profile?.id && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 border border-amber-200">
                ⚠️ Perhatian: Anda sedang mengubah role akun Anda sendiri. Pastikan perubahan ini disengaja.
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* ====== MODAL: Konfirmasi Hapus ====== */}
      <ConfirmModal
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus pengguna "${deleteUser?.nama}" (${deleteUser?.email})? Tindakan ini tidak dapat dibatalkan dan semua data terkait (termasuk toko UMKM jika ada) akan ikut terhapus.`}
        confirmLabel="Ya, Hapus Pengguna"
      />
    </div>
  );
}
