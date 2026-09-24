import { useState, useEffect } from "react";
import Sidebar from "../../components/ui/Sidebar";
import Table from "../../components/ui/Table";
import { StatusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import PanelHeader from "../../components/ui/PanelHeader";
import { Input, Select } from "../../components/ui/Input";
import {
  IconDashboard,
  IconAdmin,
  IconStore,
  IconShield,
  IconFolder,
  IconPackage,
  IconCreditCard,
  IconBarChart,
  IconLogout,
} from "../../components/ui/Icons";
import { supabase } from "../../lib/supabase";

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

export type PayStatus = "PENDING" | "PAID" | "PROCESSING" | "FAILED" | "EXPIRED";
export type OrdStatus = "BARU" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

export interface OrderItemDetail {
  id?: string;
  name: string;
  variant?: string;
  sku?: string;
  price: number;
  qty: number;
  subtotal: number;
  image: string;
}

export interface TimelineEvent {
  label: string;
  desc: string;
  date: string;
  status: "done" | "active" | "pending";
}

export interface Transaction {
  id: string;
  dbId?: string;
  invoiceNo: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingNotes?: string;
  umkm: string;
  umkmOwner?: string;
  umkmCity?: string;
  umkmPhone?: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  platformFee: number;
  paymentFee: number;
  discount: number;
  courier: string;
  courierService: string;
  trackingNumber: string;
  payment: string;
  paymentRef: string;
  vaNumber?: string;
  payStatus: PayStatus;
  orderStatus: OrdStatus;
  date: string;
  time: string;
  items: OrderItemDetail[];
  timeline: TimelineEvent[];
}

function formatRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

const defaultTransactions: Transaction[] = [
  {
    id: "ORD-20260922-RATTAN-005",
    invoiceNo: "INV/20260922/AQRA/005",
    customer: "Andi Pratama",
    customerEmail: "andi.pratama@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Mohon barang anyaman rotan dilapisi bubble wrap tebal dan kardus tebal agar tidak penyok di perjalanan.",
    umkm: "Lombok Craft & Rattan",
    umkmOwner: "Ibu Baiq Nurul",
    umkmCity: "Mataram, Nusa Tenggara Barat",
    umkmPhone: "081907112233",
    total: 167000,
    subtotal: 135000,
    shippingCost: 30000,
    platformFee: 1000,
    paymentFee: 1000,
    discount: 0,
    courier: "JNE Express",
    courierService: "REG (Reguler 2-3 Hari)",
    trackingNumber: "JNE-REG-981273612",
    payment: "VA MANDIRI",
    paymentRef: "FIN-20260922-005",
    vaNumber: "8930 1928 4719 2810",
    payStatus: "PENDING",
    orderStatus: "BARU",
    date: "22 Sep 2026",
    time: "15:10 WIB",
    items: [
      {
        name: "Keranjang Anyaman Rotan Etnik Sasak",
        variant: "Natural Brown L (Ø 32cm)",
        sku: "ROTAN-L-01",
        price: 135000,
        qty: 1,
        subtotal: 135000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=160&h=160&fit=crop&auto=format",
      },
    ],
    timeline: [
      { label: "Pesanan Dibuat", desc: "Checkout oleh pembeli via Finnet Mandiri VA", date: "22 Sep 2026 · 15:10 WIB", status: "done" },
      { label: "Menunggu Pembayaran", desc: "Batas waktu pembayaran 24 jam", date: "23 Sep 2026 · 15:10 WIB", status: "active" },
      { label: "Konfirmasi Toko", desc: "Lombok Craft & Rattan menyiapkan paket", date: "—", status: "pending" },
      { label: "Pengiriman Kurir", desc: "Paket di-pickup JNE Express", date: "—", status: "pending" },
      { label: "Selesai", desc: "Paket diterima pelanggan", date: "—", status: "pending" },
    ],
  },
  {
    id: "ORD-20260922-GAYO-004",
    invoiceNo: "INV/20260922/AQRA/004",
    customer: "Siti Rahayu",
    customerEmail: "siti.rahayu@yahoo.com",
    customerPhone: "085712345678",
    shippingAddress: "Jl. Dago Asri No. 42, Kel. Dago, Kec. Coblong, Kota Bandung, Jawa Barat 40135",
    shippingNotes: "Biji kopi jangan digiling ya kak, biarkan whole beans sangrai terbaru.",
    umkm: "Gayo Mountain Coffee",
    umkmOwner: "Teuku Arman",
    umkmCity: "Takengon, Aceh Tengah",
    umkmPhone: "081266778899",
    total: 174000,
    subtotal: 150000,
    shippingCost: 22000,
    platformFee: 1000,
    paymentFee: 1000,
    discount: 0,
    courier: "J&T Express",
    courierService: "EZ (Regular 2-4 Hari)",
    trackingNumber: "JNT-EXP-889923145",
    payment: "QRIS",
    paymentRef: "FIN-20260922-004",
    vaNumber: "NMID: ID1029384756102",
    payStatus: "PAID",
    orderStatus: "SELESAI",
    date: "22 Sep 2026",
    time: "09:20 WIB",
    items: [
      {
        name: "Kopi Arabika Gayo Specialty Grade 1",
        variant: "Medium Roast · Whole Bean 250gr",
        sku: "GYO-ARB-250",
        price: 75000,
        qty: 2,
        subtotal: 150000,
        image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=160&h=160&fit=crop&auto=format",
      },
    ],
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan terverifikasi sistem", date: "22 Sep 2026 · 09:20 WIB", status: "done" },
      { label: "Pembayaran Sukses", desc: "Finnet QRIS otomatis terverifikasi", date: "22 Sep 2026 · 09:21 WIB", status: "done" },
      { label: "Diproses Toko", desc: "Kemasan kedap udara disiapkan penjual", date: "22 Sep 2026 · 10:45 WIB", status: "done" },
      { label: "Dalam Pengiriman", desc: "Resi JNT-EXP-889923145 terkirim ke Bandung Hub", date: "22 Sep 2026 · 14:00 WIB", status: "done" },
      { label: "Pesanan Selesai", desc: "Diterima oleh Siti Rahayu (Satpam Komplek)", date: "22 Sep 2026 · 17:30 WIB", status: "done" },
    ],
  },
  {
    id: "ORD-20260921-BATIK-003",
    invoiceNo: "INV/20260921/AQRA/003",
    customer: "Andi Pratama",
    customerEmail: "andi.pratama@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Titipkan di pos keamanan jika penghuni sedang di luar kantor.",
    umkm: "Batik Danar Solo",
    umkmOwner: "Danar Prasetyo",
    umkmCity: "Surakarta, Jawa Tengah",
    umkmPhone: "081329481122",
    total: 203000,
    subtotal: 185000,
    shippingCost: 16000,
    platformFee: 1000,
    paymentFee: 1000,
    discount: 0,
    courier: "JNE Express",
    courierService: "REG (Reguler 1-2 Hari)",
    trackingNumber: "JNE-REG-829104812",
    payment: "VA BRI",
    paymentRef: "FIN-20260922-003",
    vaNumber: "1289 0048 1928 3312",
    payStatus: "PAID",
    orderStatus: "DIPROSES",
    date: "21 Sep 2026",
    time: "16:45 WIB",
    items: [
      {
        name: "Kemeja Batik Tulis Sutra Motif Parang Kusumo",
        variant: "Regular Fit · L (Lingkar Dada 108cm)",
        sku: "BTK-PRG-L",
        price: 185000,
        qty: 1,
        subtotal: 185000,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=160&h=160&fit=crop&auto=format",
      },
    ],
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan masuk ke sistem", date: "21 Sep 2026 · 16:45 WIB", status: "done" },
      { label: "Pembayaran Lunas", desc: "Terverifikasi Finnet BRI Virtual Account", date: "21 Sep 2026 · 16:50 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Batik Danar Solo sedang memverifikasi kain & packing", date: "21 Sep 2026 · 17:15 WIB", status: "active" },
      { label: "Menunggu Penjemputan", desc: "Kurir JNE dijadwalkan pickup hari ini", date: "—", status: "pending" },
      { label: "Selesai", desc: "Konfirmasi terima pembeli", date: "—", status: "pending" },
    ],
  },
  {
    id: "ORD-20260921-MULYA-002",
    invoiceNo: "INV/20260921/AQRA/002",
    customer: "Siti Rahayu",
    customerEmail: "siti.rahayu@yahoo.com",
    customerPhone: "085712345678",
    shippingAddress: "Jl. Dago Asri No. 42, Kel. Dago, Kec. Coblong, Kota Bandung, Jawa Barat 40135",
    shippingNotes: "Sambal roa dalam kemasan botol kaca tolong diberi sticker fragile.",
    umkm: "Mulya Snack & Heritage",
    umkmOwner: "H. Mulyono",
    umkmCity: "Sleman, D.I. Yogyakarta",
    umkmPhone: "081128394455",
    total: 80000,
    subtotal: 70000,
    shippingCost: 8000,
    platformFee: 1000,
    paymentFee: 1000,
    discount: 0,
    courier: "SiCepat Express",
    courierService: "REG (Reguler 1-2 Hari)",
    trackingNumber: "SICEPAT-009823411",
    payment: "VA BCA",
    paymentRef: "FIN-20260922-002",
    vaNumber: "8801 2398 4129 0042",
    payStatus: "PAID",
    orderStatus: "DIKIRIM",
    date: "21 Sep 2026",
    time: "14:30 WIB",
    items: [
      {
        name: "Sambal Roa Asli Khas Manado Botol",
        variant: "Ekstra Pedas 200gr",
        sku: "ROA-MND-200",
        price: 45000,
        qty: 1,
        subtotal: 45000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=160&h=160&fit=crop&auto=format",
      },
      {
        name: "Keripik Tempe Renyah Gurih",
        variant: "Original 150gr",
        sku: "TMP-REN-150",
        price: 25000,
        qty: 1,
        subtotal: 25000,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=160&h=160&fit=crop&auto=format",
      },
    ],
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan diterima", date: "21 Sep 2026 · 14:30 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Finnet Finpay BCA VA Terverifikasi", date: "21 Sep 2026 · 14:35 WIB", status: "done" },
      { label: "Dipacking Penjual", desc: "Mulya Snack mengemas pesanan dengan kardus tebal", date: "21 Sep 2026 · 16:00 WIB", status: "done" },
      { label: "Sedang Dikirim", desc: "Paket tiba di Sortir Hub Bandung Timur (SiCepat)", date: "22 Sep 2026 · 08:30 WIB", status: "active" },
      { label: "Tiba di Tujuan", desc: "Kurir mengantar ke alamat penerima", date: "—", status: "pending" },
    ],
  },
  {
    id: "ORD-20260920-MULYA-001",
    invoiceNo: "INV/20260920/AQRA/001",
    customer: "Andi Pratama",
    customerEmail: "andi.pratama@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Pengemasan rapi dan rapat ya min.",
    umkm: "Mulya Snack & Heritage",
    umkmOwner: "H. Mulyono",
    umkmCity: "Sleman, D.I. Yogyakarta",
    umkmPhone: "081128394455",
    total: 116000,
    subtotal: 104000,
    shippingCost: 10000,
    platformFee: 1000,
    paymentFee: 1000,
    discount: 0,
    courier: "JNE Express",
    courierService: "REG (Reguler 1-2 Hari)",
    trackingNumber: "JNE-REG-290192839",
    payment: "QRIS",
    paymentRef: "FIN-20260922-001",
    vaNumber: "NMID: ID1092837465921",
    payStatus: "PAID",
    orderStatus: "SELESAI",
    date: "20 Sep 2026",
    time: "10:15 WIB",
    items: [
      {
        name: "Keripik Tempe Renyah Gurih",
        variant: "Original 150gr",
        sku: "TMP-REN-150",
        price: 25000,
        qty: 2,
        subtotal: 50000,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=160&h=160&fit=crop&auto=format",
      },
      {
        name: "Keripik Pisang Karamel Madu",
        variant: "Manis Legit 180gr",
        sku: "PSG-KRL-180",
        price: 18000,
        qty: 3,
        subtotal: 54000,
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=160&h=160&fit=crop&auto=format",
      },
    ],
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan terbit dari checkout pelanggan", date: "20 Sep 2026 · 10:15 WIB", status: "done" },
      { label: "Pembayaran QRIS Lunas", desc: "Finnet Finpay Notifikasi Terverifikasi", date: "20 Sep 2026 · 10:16 WIB", status: "done" },
      { label: "Diproses UMKM", desc: "Mulya Snack menyiapkan cemilan segar", date: "20 Sep 2026 · 11:30 WIB", status: "done" },
      { label: "Diserahkan ke Kurir", desc: "Resi JNE-REG-290192839 diproses agen JNE", date: "20 Sep 2026 · 14:00 WIB", status: "done" },
      { label: "Paket Diterima", desc: "Diterima oleh Andi Pratama", date: "21 Sep 2026 · 11:20 WIB", status: "done" },
    ],
  },
];

export default function AdminTransactionPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [loading, setLoading] = useState(true);

  // Modal Detail State
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [editingResi, setEditingResi] = useState(false);
  const [customResi, setCustomResi] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast(`✓ Berhasil disalin: ${text}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            total_harga,
            ongkir,
            status_order,
            catatan,
            resi_pengiriman,
            created_at,
            umkm (nama_toko, nama_umkm, email, no_hp, alamat),
            profiles:customer_id (nama, email, no_hp),
            addresses:alamat_id (nama_penerima, no_hp, alamat_lengkap, kota, provinsi, kode_pos),
            payments (payment_reference, payment_method, payment_status, va_number, amount, paid_at),
            order_items (
              id,
              quantity,
              harga,
              subtotal,
              product_variants (
                nama_varian,
                sku,
                products (
                  nama_produk,
                  gambar_url
                )
              )
            )
          `)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const mapped: Transaction[] = data.map((o: any) => {
            const orderNum = o.order_number || `ORD-${o.id.slice(0, 8).toUpperCase()}`;
            // Match with detailed mock fallback if existing
            const fallback = defaultTransactions.find((df) => df.id === orderNum) || defaultTransactions[0];

            const payMethodRaw = o.payments?.payment_method || "Finnet";
            const payMethodClean = payMethodRaw.replace("FINNET_", "").replace("_", " ");
            const payStatus = (o.payments?.payment_status || fallback.payStatus || "PENDING") as PayStatus;
            const orderStatus = (
              o.status_order === "COMPLETED"
                ? "SELESAI"
                : o.status_order === "SHIPPED"
                ? "DIKIRIM"
                : o.status_order === "PROCESSING"
                ? "DIPROSES"
                : o.status_order === "CANCELLED"
                ? "DIBATALKAN"
                : o.status_order === "PENDING"
                ? "BARU"
                : fallback.orderStatus
            ) as OrdStatus;

            const dateObj = new Date(o.created_at);
            const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
            const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

            const rawItems = o.order_items || [];
            const mappedItems: OrderItemDetail[] =
              rawItems.length > 0
                ? rawItems.map((item: any) => ({
                    id: item.id,
                    name: item.product_variants?.products?.nama_produk || "Produk UMKM",
                    variant: item.product_variants?.nama_varian || "Standard",
                    sku: item.product_variants?.sku || "SKU-001",
                    price: Number(item.harga) || 0,
                    qty: Number(item.quantity) || 1,
                    subtotal: Number(item.subtotal) || Number(item.harga) * Number(item.quantity) || 0,
                    image: item.product_variants?.products?.gambar_url || fallback.items[0]?.image || "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=160&h=160&fit=crop&auto=format",
                  }))
                : fallback.items;

            const total = Number(o.total_harga) || fallback.total;
            const shippingCost = Number(o.ongkir) || fallback.shippingCost;
            const itemsSubtotal = mappedItems.reduce((acc, it) => acc + it.subtotal, 0) || fallback.subtotal;

            return {
              id: orderNum,
              dbId: o.id,
              invoiceNo: `INV/${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, "0")}${String(dateObj.getDate()).padStart(2, "0")}/AQRA/${orderNum.slice(-3)}`,
              customer: o.profiles?.nama || fallback.customer,
              customerEmail: o.profiles?.email || fallback.customerEmail,
              customerPhone: o.profiles?.no_hp || fallback.customerPhone,
              shippingAddress: o.addresses?.alamat_lengkap ? `${o.addresses.alamat_lengkap}, ${o.addresses.kota || ""}, ${o.addresses.provinsi || ""} ${o.addresses.kode_pos || ""}` : fallback.shippingAddress,
              shippingNotes: o.catatan || fallback.shippingNotes,
              umkm: o.umkm?.nama_toko || fallback.umkm,
              umkmOwner: o.umkm?.nama_umkm || fallback.umkmOwner,
              umkmCity: o.umkm?.alamat || fallback.umkmCity,
              umkmPhone: o.umkm?.no_hp || fallback.umkmPhone,
              total,
              subtotal: itemsSubtotal,
              shippingCost,
              platformFee: 1000,
              paymentFee: 1000,
              discount: 0,
              courier: fallback.courier,
              courierService: fallback.courierService,
              trackingNumber: o.resi_pengiriman || fallback.trackingNumber,
              payment: payMethodClean.toUpperCase(),
              paymentRef: o.payments?.payment_reference || fallback.paymentRef,
              vaNumber: o.payments?.va_number || fallback.vaNumber,
              payStatus,
              orderStatus,
              date: dateStr,
              time: timeStr,
              items: mappedItems,
              timeline: fallback.timeline,
            };
          });
          setTransactions(mapped);
        }
      } catch (err) {
        console.error("Transactions load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const handleUpdateOrderStatus = async (newStatus: OrdStatus) => {
    if (!selectedTx) return;
    const prevId = selectedTx.id;

    // Update local state immediately
    const updatedTx: Transaction = {
      ...selectedTx,
      orderStatus: newStatus,
      timeline: selectedTx.timeline.map((step) => {
        if (newStatus === "SELESAI") return { ...step, status: "done" };
        if (newStatus === "DIKIRIM" && step.label.includes("Pengiriman")) return { ...step, status: "active" };
        if (newStatus === "DIPROSES" && step.label.includes("Diproses")) return { ...step, status: "active" };
        return step;
      }),
    };

    setSelectedTx(updatedTx);
    setTransactions((prev) => prev.map((t) => (t.id === prevId ? updatedTx : t)));
    showToast(`Status pesanan ${prevId} berhasil diubah menjadi: ${newStatus}`);

    // Persist to Supabase if dbId exists
    if (selectedTx.dbId) {
      const dbStatus = newStatus === "SELESAI" ? "COMPLETED" : newStatus === "DIKIRIM" ? "SHIPPED" : newStatus === "DIPROSES" ? "PROCESSING" : newStatus === "DIBATALKAN" ? "CANCELLED" : "PENDING";
      await (supabase.from("orders") as any).update({ status_order: dbStatus }).eq("id", selectedTx.dbId);
    }
  };

  const handleUpdatePaymentStatus = async (newStatus: PayStatus) => {
    if (!selectedTx) return;
    const prevId = selectedTx.id;

    const updatedTx: Transaction = {
      ...selectedTx,
      payStatus: newStatus,
      orderStatus: newStatus === "PAID" && selectedTx.orderStatus === "BARU" ? "DIPROSES" : selectedTx.orderStatus,
    };

    setSelectedTx(updatedTx);
    setTransactions((prev) => prev.map((t) => (t.id === prevId ? updatedTx : t)));
    showToast(`Status pembayaran ${prevId} diverifikasi: ${newStatus}`);
  };

  const handleSaveResi = async () => {
    if (!selectedTx || !customResi.trim()) return;
    const prevId = selectedTx.id;
    const newResi = customResi.trim();

    const updatedTx: Transaction = {
      ...selectedTx,
      trackingNumber: newResi,
      orderStatus: selectedTx.orderStatus === "BARU" || selectedTx.orderStatus === "DIPROSES" ? "DIKIRIM" : selectedTx.orderStatus,
    };

    setSelectedTx(updatedTx);
    setTransactions((prev) => prev.map((t) => (t.id === prevId ? updatedTx : t)));
    setEditingResi(false);
    showToast(`Nomor resi ${prevId} diperbarui: ${newResi}`);

    if (selectedTx.dbId) {
      await (supabase.from("orders") as any).update({ resi_pengiriman: newResi }).eq("id", selectedTx.dbId);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const filtered = transactions.filter((t) => {
    if (statusFilter && t.payStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.customer.toLowerCase().includes(q) ||
        t.umkm.toLowerCase().includes(q) ||
        t.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "id",
      header: "TRANSACTION ID",
      render: (r: Transaction) => (
        <button
          onClick={() => {
            setSelectedTx(r);
            setCustomResi(r.trackingNumber);
          }}
          className="font-mono text-xs text-[#C9A227] hover:underline font-semibold text-left cursor-pointer flex items-center gap-1 group"
          title="Klik untuk lihat detail transaksi"
        >
          <span>{r.id}</span>
          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#A07C10] transition-opacity">↗</span>
        </button>
      ),
    },
    {
      key: "customer",
      header: "CUSTOMER",
      render: (r: Transaction) => (
        <div>
          <span className="font-medium text-[#202020] block">{r.customer}</span>
          <span className="text-[11px] text-[#7C7770] font-mono">{r.customerPhone}</span>
        </div>
      ),
    },
    {
      key: "umkm",
      header: "UMKM",
      render: (r: Transaction) => (
        <span className="text-[#C9A227] font-semibold text-[13px]">{r.umkm}</span>
      ),
    },
    {
      key: "total",
      header: "TOTAL",
      render: (r: Transaction) => (
        <span className="font-bold text-[#1A1714]">{formatRp(r.total)}</span>
      ),
    },
    {
      key: "payment",
      header: "PEMBAYARAN",
      render: (r: Transaction) => (
        <span className="text-xs font-medium text-[#4A4742] bg-[#F5F4F0] px-2 py-0.5 rounded-md border border-[#E8E6E1]">
          {r.payment}
        </span>
      ),
    },
    {
      key: "payStatus",
      header: "PAYMENT STATUS",
      render: (r: Transaction) => <StatusBadge status={r.payStatus} type="payment" />,
    },
    {
      key: "orderStatus",
      header: "ORDER STATUS",
      render: (r: Transaction) => <StatusBadge status={r.orderStatus} type="order" />,
    },
    {
      key: "date",
      header: "TANGGAL",
      render: (r: Transaction) => (
        <div>
          <span className="text-[12px] text-[#202020] block">{r.date}</span>
          <span className="text-[10px] text-[#8C8880]">{r.time}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "AKSI",
      render: (r: Transaction) => (
        <Button
          size="sm"
          variant="outline-gold"
          onClick={() => {
            setSelectedTx(r);
            setCustomResi(r.trackingNumber);
          }}
          className="hover:bg-[#C9A227] hover:text-white transition-all shadow-sm font-medium"
        >
          Detail
        </Button>
      ),
    },
  ];

  const adminLogo = (
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
  );

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <Sidebar items={sidebarItems} logo={adminLogo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PanelHeader
          title="Monitoring Transaksi"
          subtitle="Semua transaksi platform · 15 September 2026"
          avatarLabel="SA"
          notifCount={5}
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Summary mini-cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Transaksi", value: String(transactions.length), sub: "keseluruhan", color: "bg-[#1A1714]", textColor: "text-white", subColor: "text-white/50" },
              { label: "Berhasil (Paid)", value: String(transactions.filter((t) => t.payStatus === "PAID").length), sub: "sukses diverifikasi", color: "bg-emerald-50", textColor: "text-emerald-700", subColor: "text-emerald-500" },
              { label: "Pending", value: String(transactions.filter((t) => t.payStatus === "PENDING").length), sub: "menunggu pembayaran", color: "bg-amber-50", textColor: "text-amber-700", subColor: "text-amber-500" },
              { label: "Gagal / Expired", value: String(transactions.filter((t) => t.payStatus === "FAILED" || t.payStatus === "EXPIRED").length), sub: "dibatalkan", color: "bg-red-50", textColor: "text-red-700", subColor: "text-red-400" },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-[16px] px-5 py-4 border border-black/5 shadow-xs`}>
                <p className={`text-[11px] font-medium ${s.subColor ?? s.textColor} opacity-70`}>{s.label}</p>
                <p className={`text-[22px] font-bold ${s.textColor} mt-1 font-display`}>{s.value}</p>
                <p className={`text-[10px] ${s.subColor ?? s.textColor} mt-0.5`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[18px] border border-[#E8E6E1] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <div className="flex gap-3 flex-wrap mb-4 items-center justify-between">
              <div className="flex gap-3 flex-1 flex-wrap min-w-[280px]">
                <Input
                  placeholder="Cari ID transaksi, pembeli, UMKM, atau resi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<span>🔍</span>}
                  className="flex-1 min-w-48"
                />
                <Select
                  options={[
                    { value: "", label: "Semua Status Pembayaran" },
                    { value: "PAID", label: "Paid (Lunas)" },
                    { value: "PENDING", label: "Pending (Menunggu)" },
                    { value: "PROCESSING", label: "Processing" },
                    { value: "FAILED", label: "Failed" },
                    { value: "EXPIRED", label: "Expired" },
                  ]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
              <div className="text-xs text-[#7C7770] font-medium">
                Menampilkan <strong className="text-[#1A1714]">{filtered.length}</strong> dari {transactions.length} transaksi
              </div>
            </div>

            <Table columns={columns} data={filtered} />
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1714] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#C9A227]/40 text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DETAIL TRANSAKSI LENGKAP & REALISTIS                                */}
      {/* ========================================================================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
          <div
            className="relative bg-[#FAFAF8] rounded-[22px] shadow-2xl border border-[#E8E6E1] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-white px-6 py-4 border-b border-[#E8E6E1] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF6E3] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] text-lg font-bold">
                  🧾
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-base md:text-lg text-[#1A1714]">
                      {selectedTx.id}
                    </h3>
                    <button
                      onClick={() => handleCopy(selectedTx.id, "txid")}
                      className="text-[11px] text-[#A07C10] hover:text-[#7A5E0B] bg-[#FDF6E3] hover:bg-[#F9EFC7] px-2 py-0.5 rounded border border-[#C9A227]/30 flex items-center gap-1 transition-colors"
                      title="Salin No Transaksi"
                    >
                      {copiedKey === "txid" ? "✓ Tersalin" : "📋 Salin"}
                    </button>
                  </div>
                  <p className="text-xs text-[#7C7770] mt-0.5">
                    Invoice: <span className="font-mono text-[#1A1714] font-medium">{selectedTx.invoiceNo}</span> · Terbit {selectedTx.date}, {selectedTx.time}
                  </p>
                </div>
              </div>

              {/* Status Badges & Quick Action */}
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedTx.payStatus} type="payment" />
                <StatusBadge status={selectedTx.orderStatus} type="order" />
                <button
                  onClick={handlePrintInvoice}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E6E1] bg-white text-xs font-semibold text-[#4A4742] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors ml-1 shadow-xs"
                  title="Cetak Faktur Pesanan"
                >
                  <span>🖨️</span>
                  <span>Cetak Faktur</span>
                </button>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="w-8 h-8 rounded-full bg-[#F0EEE9] hover:bg-[#E2DFD8] text-[#4A4742] hover:text-[#1A1714] flex items-center justify-center font-bold text-lg transition-colors ml-2"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Columns */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
              {/* Alert jika masih PENDING */}
              {selectedTx.payStatus === "PENDING" && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3 text-amber-900 text-xs">
                  <span className="text-base leading-none">⚠️</span>
                  <div className="flex-1">
                    <p className="font-bold">Menunggu Pembayaran dari Pelanggan</p>
                    <p className="text-amber-800/80 mt-0.5">
                      Pelanggan belum menyelesaikan pembayaran via {selectedTx.payment} ({selectedTx.vaNumber || selectedTx.paymentRef}). Admin dapat memverifikasi manual jika transfer telah dikonfirmasi di rekening penampung Finnet.
                    </p>
                  </div>
                  <button
                    onClick={() => handleUpdatePaymentStatus("PAID")}
                    className="bg-[#C9A227] hover:bg-[#B38F1E] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 shadow-xs transition-colors"
                  >
                    ✓ Verifikasi Lunas
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT COLUMN: Produk, Kurir & Resi, Data Pembeli, Data Toko */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Card 1: Rincian Produk Dipesan */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE9] mb-3">
                      <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-2">
                        <span>📦</span>
                        <span>Daftar Produk yang Dipesan ({selectedTx.items.length} item)</span>
                      </h4>
                      <span className="text-xs text-[#A07C10] font-semibold bg-[#FDF6E3] px-2.5 py-0.5 rounded-full border border-[#C9A227]/30">
                        {selectedTx.umkm}
                      </span>
                    </div>

                    <div className="divide-y divide-[#F5F4F0]">
                      {selectedTx.items.map((item, idx) => (
                        <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-[#E8E6E1] shrink-0 bg-[#F5F4F0]"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-[#1A1714] truncate">{item.name}</p>
                            <p className="text-[11px] text-[#7C7770] mt-0.5">
                              Varian: <span className="font-medium text-[#4A4742]">{item.variant || "Standard"}</span>
                              {item.sku && <span className="text-[#A07C10] ml-2">SKU: {item.sku}</span>}
                            </p>
                            <p className="text-[11px] text-[#7C7770]">
                              {formatRp(item.price)} × <span className="font-bold text-[#1A1714]">{item.qty} pcs</span>
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[13px] font-bold text-[#1A1714] block">
                              {formatRp(item.subtotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Pengiriman & Lacak Resi Kurir */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE9] mb-3">
                      <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-2">
                        <span>🚚</span>
                        <span>Logistik & Pelacakan Kurir</span>
                      </h4>
                      <span className="text-xs font-semibold text-[#202020] bg-[#F5F4F0] px-2.5 py-0.5 rounded-full border border-[#E8E6E1]">
                        {selectedTx.courier} · {selectedTx.courierService}
                      </span>
                    </div>

                    {/* Resi Box */}
                    <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E8E6E1] flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[10px] text-[#7C7770] font-medium tracking-wide">NOMOR RESI PENGIRIMAN</p>
                        {editingResi ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={customResi}
                              onChange={(e) => setCustomResi(e.target.value)}
                              className="px-2.5 py-1 text-xs border border-[#C9A227] rounded-lg bg-white font-mono uppercase focus:outline-hidden"
                              placeholder="Masukkan No Resi..."
                            />
                            <button
                              onClick={handleSaveResi}
                              className="bg-[#C9A227] hover:bg-[#B38F1E] text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingResi(false)}
                              className="text-xs text-[#7C7770] hover:text-[#1A1714] px-1"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <p className="font-mono text-[13px] font-bold text-[#1A1714] mt-0.5 tracking-wider">
                            {selectedTx.trackingNumber || "— Belum Diterbitkan —"}
                          </p>
                        )}
                      </div>

                      {!editingResi && (
                        <div className="flex items-center gap-1.5">
                          {selectedTx.trackingNumber && (
                            <button
                              onClick={() => handleCopy(selectedTx.trackingNumber, "resi")}
                              className="px-2.5 py-1 text-xs rounded-lg border border-[#E8E6E1] bg-white hover:border-[#C9A227] text-[#4A4742] font-medium transition-colors"
                              title="Salin Resi"
                            >
                              {copiedKey === "resi" ? "✓ Tersalin" : "📋 Salin Resi"}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setCustomResi(selectedTx.trackingNumber);
                              setEditingResi(true);
                            }}
                            className="px-2.5 py-1 text-xs rounded-lg border border-[#E8E6E1] bg-white hover:border-[#C9A227] text-[#A07C10] font-medium transition-colors"
                          >
                            ✏️ Edit Resi
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Timeline Tracker */}
                    <div className="space-y-3 pt-1">
                      <p className="text-[11px] font-bold text-[#7C7770] tracking-wide uppercase">Riwayat Status Paket</p>
                      <div className="space-y-3 pl-1">
                        {selectedTx.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-3 relative">
                            {idx < selectedTx.timeline.length - 1 && (
                              <div
                                className={`absolute left-3 top-5 w-0.5 h-6 ${
                                  step.status === "done" ? "bg-[#2E8B57]" : "bg-[#E8E6E1]"
                                }`}
                              />
                            )}
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                                step.status === "done"
                                  ? "bg-[#2E8B57] text-white"
                                  : step.status === "active"
                                  ? "bg-[#C9A227] text-white ring-4 ring-[#FDF6E3]"
                                  : "bg-[#E8E6E1] text-[#8C8880]"
                              }`}
                            >
                              {step.status === "done" ? "✓" : idx + 1}
                            </div>
                            <div className="flex-1 pb-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-xs font-bold ${step.status === "active" ? "text-[#C9A227]" : "text-[#202020]"}`}>
                                  {step.label}
                                </p>
                                <span className="text-[10px] text-[#8C8880]">{step.date}</span>
                              </div>
                              <p className="text-[11px] text-[#7C7770] mt-0.5">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Informasi Customer & Pengiriman */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-2 pb-2.5 border-b border-[#F0EEE9] mb-3">
                      <span>👤</span>
                      <span>Informasi Pelanggan & Alamat Kirim</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[11px] text-[#7C7770]">Nama Lengkap</p>
                        <p className="font-semibold text-[#1A1714] mt-0.5">{selectedTx.customer}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#7C7770]">No. Telepon / WhatsApp</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="font-mono font-semibold text-[#1A1714]">{selectedTx.customerPhone}</p>
                          <a
                            href={`https://wa.me/${selectedTx.customerPhone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                          >
                            Chat WA ↗
                          </a>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-[11px] text-[#7C7770]">Email Pembeli</p>
                        <p className="font-mono text-[#1A1714] mt-0.5">{selectedTx.customerEmail}</p>
                      </div>
                      <div className="sm:col-span-2 pt-2 border-t border-[#F5F4F0]">
                        <p className="text-[11px] text-[#7C7770]">Alamat Tujuan Pengiriman</p>
                        <p className="text-[#1A1714] font-medium leading-relaxed mt-0.5 bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E8E6E1]">
                          {selectedTx.shippingAddress}
                        </p>
                      </div>
                      {selectedTx.shippingNotes && (
                        <div className="sm:col-span-2">
                          <p className="text-[11px] text-[#7C7770]">Catatan Pesanan dari Pembeli</p>
                          <p className="text-[#A07C10] italic mt-0.5 bg-[#FDF6E3]/60 p-2 rounded-lg border border-[#C9A227]/20 text-[11px]">
                            "{selectedTx.shippingNotes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 4: Informasi Toko Mitra UMKM */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-2 pb-2.5 border-b border-[#F0EEE9] mb-3">
                      <span>🏪</span>
                      <span>Mitra Penjual (UMKM)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-[11px] text-[#7C7770]">Nama Toko</p>
                        <p className="font-bold text-[#C9A227] mt-0.5">{selectedTx.umkm}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#7C7770]">Pemilik / Penanggung Jawab</p>
                        <p className="font-semibold text-[#1A1714] mt-0.5">{selectedTx.umkmOwner || "Pemilik UMKM"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#7C7770]">Lokasi Asal Pengiriman</p>
                        <p className="text-[#1A1714] mt-0.5">{selectedTx.umkmCity || "Indonesia"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#7C7770]">Kontak Toko</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="font-mono text-[#1A1714]">{selectedTx.umkmPhone || "0812-3456-7890"}</p>
                          <a
                            href={`https://wa.me/${(selectedTx.umkmPhone || "081234567890").replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition-colors"
                          >
                            Hubungi UMKM ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Payment Details, Financial Summary & Admin Action Panel */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Card 5: Finnet Payment Gateway Details */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#F0EEE9] mb-3">
                      <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-2">
                        <span>💳</span>
                        <span>Gateway Pembayaran Finnet</span>
                      </h4>
                      <span className="text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
                        Finnet Finpay
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#7C7770]">Metode Bayar:</span>
                        <span className="font-bold text-[#1A1714] bg-[#F5F4F0] px-2 py-0.5 rounded border border-[#E8E6E1]">
                          {selectedTx.payment}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7C7770]">ID Referensi Finnet:</span>
                        <span className="font-mono text-[#1A1714] font-medium">{selectedTx.paymentRef}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7C7770]">No. Virtual Account / VA:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-[#A07C10]">{selectedTx.vaNumber || "—"}</span>
                          {selectedTx.vaNumber && (
                            <button
                              onClick={() => handleCopy(selectedTx.vaNumber!, "va")}
                              className="text-[10px] text-[#A07C10] hover:text-[#7A5E0B] p-0.5"
                              title="Salin VA"
                            >
                              📋
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#7C7770]">Status Finnet:</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>{selectedTx.payStatus === "PAID" ? "Terverifikasi Otomatis" : "Menunggu Pelunasan"}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 6: Ringkasan Biaya (Biaya Transaksi) */}
                  <div className="bg-white rounded-2xl border border-[#E8E6E1] p-4.5 shadow-xs">
                    <h4 className="font-bold text-[13px] text-[#1A1714] pb-2.5 border-b border-[#F0EEE9] mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>💰</span>
                        <span>Rincian Pembayaran</span>
                      </span>
                      <span className="text-[11px] font-normal text-[#7C7770]">Invoice Resmi</span>
                    </h4>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-[#7C7770]">
                        <span>Subtotal Produk</span>
                        <span className="font-medium text-[#202020]">{formatRp(selectedTx.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-[#7C7770]">
                        <span>Ongkos Kirim ({selectedTx.courier})</span>
                        <span className="font-medium text-[#202020]">{formatRp(selectedTx.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between text-[#7C7770]">
                        <span>Biaya Layanan Platform AqraOne</span>
                        <span className="font-medium text-[#202020]">{formatRp(selectedTx.platformFee)}</span>
                      </div>
                      <div className="flex justify-between text-[#7C7770]">
                        <span>Biaya Penanganan Finnet Gateway</span>
                        <span className="font-medium text-[#202020]">{formatRp(selectedTx.paymentFee)}</span>
                      </div>
                      {selectedTx.discount > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium">
                          <span>Diskon Voucher</span>
                          <span>-{formatRp(selectedTx.discount)}</span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#E8E6E1] mt-2 bg-[#FAF9F5] p-3 rounded-xl border">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="font-bold text-xs text-[#1A1714] block">TOTAL PEMBAYARAN</span>
                            <span className="text-[10px] text-[#7C7770]">Termasuk PPN & biaya gateway</span>
                          </div>
                          <span className="text-xl font-bold font-display text-[#A07C10]">
                            {formatRp(selectedTx.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 7: Admin Control Panel (Status Changer) */}
                  <div className="bg-[#FAF9F5] rounded-2xl border-2 border-[#C9A227]/40 p-4.5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8E6E1]">
                      <h4 className="font-bold text-[13px] text-[#1A1714] flex items-center gap-1.5">
                        <span>⚙️</span>
                        <span>Kontrol Admin Pesanan</span>
                      </h4>
                      <span className="text-[10px] font-semibold text-[#A07C10] bg-[#FDF6E3] px-2 py-0.5 rounded border border-[#C9A227]/30">
                        Admin Mode
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#4A4742] block">
                        Ubah Status Pesanan:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["BARU", "DIPROSES", "DIKIRIM", "SELESAI", "DIBATALKAN"] as OrdStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleUpdateOrderStatus(st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                              selectedTx.orderStatus === st
                                ? "bg-[#1A1714] text-white border-[#1A1714] shadow-xs"
                                : "bg-white text-[#4A4742] border-[#E8E6E1] hover:border-[#C9A227] hover:text-[#C9A227]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E6E1] flex gap-2">
                      {selectedTx.payStatus === "PENDING" && (
                        <button
                          onClick={() => handleUpdatePaymentStatus("PAID")}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-xl text-xs transition-colors shadow-xs"
                        >
                          ✓ Tandai Sudah Lunas
                        </button>
                      )}
                      <button
                        onClick={handlePrintInvoice}
                        className="flex-1 bg-white hover:bg-[#F5F4F0] border border-[#E8E6E1] text-[#1A1714] font-semibold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>🖨️ Cetak Faktur</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-3.5 border-t border-[#E8E6E1] flex items-center justify-between shrink-0">
              <div className="text-xs text-[#7C7770]">
                ID Transaksi: <span className="font-mono text-[#1A1714] font-semibold">{selectedTx.id}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setSelectedTx(null)}>
                  Tutup
                </Button>
                <Button size="sm" variant="primary" onClick={handlePrintInvoice}>
                  🖨️ Cetak Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
