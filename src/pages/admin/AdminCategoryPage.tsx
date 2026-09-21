import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/Badge";
import Modal, { ConfirmModal } from "../../components/ui/Modal";
import { Input, Select } from "../../components/ui/Input";
import Tabs from "../../components/ui/Tabs";
import {
  IconDashboard, IconAdmin, IconStore, IconShield, IconFolder,
  IconPackage, IconCreditCard, IconBarChart, IconLogout,
} from "../../components/ui/Icons";
import PanelHeader from "../../components/ui/PanelHeader";
import { categoryService, CategoryPayload } from "../../services/category.service";
import type { GeneralStatus } from "../../types/database.types";
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

interface CategoryItem {
  id: string;
  nama_kategori: string;
  deskripsi: string | null;
  icon: string | null;
  status: GeneralStatus;
  created_at: string;
}

export default function AdminCategoryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("produk");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<CategoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formStatus, setFormStatus] = useState<GeneralStatus>("AKTIF");

  const loadCategories = async () => {
    setLoading(true);
    setErrorMsg(null);
    if (activeTab === "produk") {
      const { data, error } = await categoryService.getKategoriProduk();
      if (error) {
        setErrorMsg("Gagal memuat kategori produk dari database: " + error.message);
      } else {
        setCategories(data);
      }
    } else {
      const { data, error } = await categoryService.getKategoriUmkm();
      if (error) {
        setErrorMsg("Gagal memuat kategori UMKM dari database: " + error.message);
      } else {
        setCategories(data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  const openAddModal = () => {
    setFormName("");
    setFormDesc("");
    setFormIcon(activeTab === "produk" ? "📦" : "🏪");
    setFormStatus("AKTIF");
    setAddOpen(true);
  };

  const openEditModal = (item: CategoryItem) => {
    setEditItem(item);
    setFormName(item.nama_kategori);
    setFormDesc(item.deskripsi || "");
    setFormIcon(item.icon || "");
    setFormStatus(item.status);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert("Nama kategori wajib diisi!");
      return;
    }

    setSubmitting(true);
    const payload: CategoryPayload = {
      nama_kategori: formName.trim(),
      deskripsi: formDesc.trim() || null,
      icon: formIcon.trim() || (activeTab === "produk" ? "📦" : "🏪"),
      status: formStatus,
    };

    if (editItem) {
      // Update
      const res = activeTab === "produk"
        ? await categoryService.updateKategoriProduk(editItem.id, payload)
        : await categoryService.updateKategoriUmkm(editItem.id, payload);

      if (res.error) {
        alert("Gagal memperbarui kategori: " + res.error.message);
      } else {
        setEditItem(null);
        await loadCategories();
      }
    } else {
      // Create
      const res = activeTab === "produk"
        ? await categoryService.createKategoriProduk(payload)
        : await categoryService.createKategoriUmkm(payload);

      if (res.error) {
        alert("Gagal menambahkan kategori: " + res.error.message);
      } else {
        setAddOpen(false);
        await loadCategories();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    const res = activeTab === "produk"
      ? await categoryService.deleteKategoriProduk(deleteId)
      : await categoryService.deleteKategoriUmkm(deleteId);

    if (res.error) {
      alert("Gagal menghapus kategori: " + res.error.message);
    } else {
      setDeleteId(null);
      await loadCategories();
    }
    setSubmitting(false);
  };

  const columns = [
    {
      key: "icon",
      header: "Icon",
      render: (r: CategoryItem) => <span className="text-2xl">{r.icon || "📦"}</span>,
    },
    {
      key: "nama_kategori",
      header: "Nama Kategori",
      render: (r: CategoryItem) => (
        <div>
          <span className="font-semibold text-[#1A1714] block">{r.nama_kategori}</span>
          {r.deskripsi && <span className="text-xs text-[#7C7770]">{r.deskripsi}</span>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r: CategoryItem) => <StatusBadge status={r.status} type="verify" />,
    },
    {
      key: "action",
      header: "Aksi",
      render: (r: CategoryItem) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline-gold" onClick={() => openEditModal(r)}>
            Edit
          </Button>
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
          title="Kelola Master Kategori"
          subtitle={`Kategori ${activeTab === "produk" ? "Produk Barang" : "Bidang Usaha UMKM"} di platform`}
          avatarLabel={user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          notifCount={0}
          actions={
            <Button variant="primary" size="sm" onClick={openAddModal}>
              + Tambah Kategori {activeTab === "produk" ? "Produk" : "UMKM"}
            </Button>
          }
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Tabs Selector: Kategori Produk vs Kategori UMKM */}
          <div className="bg-white rounded-[14px] border border-[#E8E6E1] px-4 pt-1">
            <Tabs
              tabs={[
                { id: "produk", label: "Kategori Produk (Barang)", count: activeTab === "produk" ? categories.length : undefined },
                { id: "umkm", label: "Kategori UMKM (Bidang Usaha)", count: activeTab === "umkm" ? categories.length : undefined },
              ]}
              active={activeTab}
              onChange={(id) => setActiveTab(id)}
            />
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <Table
              columns={columns}
              data={categories}
              loading={loading}
              emptyMessage={`Belum ada data kategori ${activeTab === "produk" ? "produk" : "UMKM"}. Silakan klik "+ Tambah Kategori".`}
            />
          </div>
        </main>
      </div>

      {/* Modal Tambah / Edit Kategori */}
      <Modal
        open={addOpen || !!editItem}
        onClose={() => { setAddOpen(false); setEditItem(null); }}
        title={editItem ? `Edit Kategori ${activeTab === "produk" ? "Produk" : "UMKM"}` : `Tambah Kategori ${activeTab === "produk" ? "Produk" : "UMKM"} Baru`}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setAddOpen(false); setEditItem(null); }}>
              Batal
            </Button>
            <Button variant="primary" size="sm" loading={submitting} onClick={handleSave}>
              Simpan ke Database
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Makanan Ringan / Kuliner"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <Input
            label="Icon (Emoji)"
            placeholder="Contoh: 🍱, 👗, 📦"
            value={formIcon}
            onChange={(e) => setFormIcon(e.target.value)}
            required
          />
          <Input
            label="Deskripsi Kategori (Opsional)"
            placeholder="Keterangan singkat pengelompokan kategori"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
          <Select
            label="Status Tampil"
            options={[
              { value: "AKTIF", label: "AKTIF (Ditampilkan)" },
              { value: "NONAKTIF", label: "NONAKTIF (Disembunyikan)" },
            ]}
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value as GeneralStatus)}
          />
        </div>
      </Modal>

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Kategori"
        message="Yakin ingin menghapus kategori ini dari database? Produk atau toko yang terafiliasi mungkin perlu disesuaikan."
        confirmLabel={submitting ? "Menghapus..." : "Ya, Hapus"}
      />
    </div>
  );
}
