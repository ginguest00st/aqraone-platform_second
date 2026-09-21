import { useState } from "react";
import { Link } from "react-router";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { StatusBadge } from "../../components/ui/Badge";
import Modal, { ConfirmModal } from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import { IconDashboard, IconAdmin, IconStore, IconShield, IconFolder, IconPackage, IconCreditCard, IconBarChart, IconSettings, IconLogout, IconPlus } from "../../components/ui/Icons";

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

interface Admin { id: string; name: string; email: string; role: string; status: "AKTIF" | "NONAKTIF"; lastLogin: string; }

const initAdmins: Admin[] = [
  { id: "1", name: "Super Admin", email: "admin@aqraone.com", role: "Super Admin", status: "AKTIF", lastLogin: "15 Sep 2026 · 14:00" },
  { id: "2", name: "Manajer Verif", email: "verif@aqraone.com", role: "Verifikator", status: "AKTIF", lastLogin: "15 Sep 2026 · 10:30" },
  { id: "3", name: "Staff Laporan", email: "report@aqraone.com", role: "Reporter", status: "NONAKTIF", lastLogin: "10 Sep 2026 · 08:00" },
];

export default function AdminManagePage() {
  const [admins, setAdmins] = useState(initAdmins);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns = [
    { key: "no", header: "No", render: (_: Admin, i?: number) => (i ?? 0) + 1 },
    { key: "name", header: "Nama", render: (r: Admin) => <span className="font-semibold text-[#202020]">{r.name}</span> },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status", render: (r: Admin) => <StatusBadge status={r.status} type="verify" /> },
    { key: "lastLogin", header: "Last Login" },
    {
      key: "action", header: "Aksi",
      render: (r: Admin) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline-gold">Edit</Button>
          <Button size="sm" variant="secondary">Nonaktifkan</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Hapus</Button>
        </div>
      )
    },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar items={sidebarItems} logo={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C9A227] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.35)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-[13px] text-white">Aqra<span className="text-[#C9A227]">One</span></p>
            <p className="text-[10px] text-white/40 tracking-wide">Admin Panel</p>
          </div>
        </div>
      } />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Kelola Admin"
          subtitle="Manajemen akun & hak akses administrator"
          avatarLabel="SA"
          notifCount={5}
          actions={<Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>+ Tambah Admin</Button>}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <Table columns={columns} data={admins} />
          </div>
        </main>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Tambah Admin Baru"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)}>Batal</Button>
            <Button variant="primary" size="sm" onClick={() => setAddOpen(false)}>Simpan</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nama" placeholder="Nama lengkap" required />
          <Input label="Email" type="email" placeholder="email@aqraone.com" required />
          <Select label="Role" options={[
            { value: "super", label: "Super Admin" },
            { value: "verif", label: "Verifikator" },
            { value: "reporter", label: "Reporter" },
          ]} />
          <Input label="Password" type="password" placeholder="Min 8 karakter" required />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { setAdmins(a => a.filter(x => x.id !== deleteId)); setDeleteId(null); }}
        title="Hapus Admin"
        message="Apakah kamu yakin ingin menghapus admin ini?"
        confirmLabel="Ya, Hapus"
      />
    </div>
  );
}
