import type { NavItem } from "../../components/ui/Sidebar";
import {
  IconBarChart,
  IconClock,
  IconCreditCard,
  IconDashboard,
  IconLogout,
  IconPackage,
  IconPlus,
  IconUser,
} from "../../components/ui/Icons";

export const UMKM_SIDEBAR_ITEMS: NavItem[] = [
  { to: "/umkm/dashboard", label: "Dashboard", icon: <IconDashboard className="w-4 h-4" /> },
  { to: "/umkm/store", label: "Profil Toko", icon: <IconUser className="w-4 h-4" /> },
  { to: "/umkm/products", label: "Produk", icon: <IconPackage className="w-4 h-4" /> },
  { to: "/umkm/products/add", label: "Tambah Produk", icon: <IconPlus className="w-4 h-4" />, parent: "Produk" },
  { to: "/umkm/transactions", label: "Transaksi", icon: <IconCreditCard className="w-4 h-4" /> },
  { to: "/umkm/history", label: "Riwayat", icon: <IconClock className="w-4 h-4" /> },
  { to: "/umkm/report", label: "Laporan", icon: <IconBarChart className="w-4 h-4" /> },
  { to: "/login", label: "Keluar", icon: <IconLogout className="w-4 h-4" /> },
];