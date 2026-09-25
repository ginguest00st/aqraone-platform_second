import { supabase } from "../lib/supabase";
import { PRODUCT_CATALOG_IMAGES } from "../app/contexts/CartContext";

export type PayStatus = "PAID" | "PENDING" | "FAILED";
export type OrdStatus = "BARU" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";

export interface OrderItem {
  id?: string;
  productId: string;
  variantId?: string;
  name: string;
  variant: string;
  sku?: string;
  price: number;
  qty: number;
  subtotal: number;
  image: string;
  umkm: string;
}

export interface OrderTimelineItem {
  label: string;
  desc: string;
  date: string;
  status: "done" | "active" | "pending";
}

export interface Order {
  id: string;
  dbId?: string;
  invoiceNo: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingNotes?: string;
  courier: string;
  courierService?: string;
  trackingNumber?: string;
  paymentMethod: string;
  paymentRef: string;
  vaNumber?: string;
  payStatus: PayStatus;
  orderStatus: OrdStatus;
  date: string;
  time: string;
  createdAt: string;
  umkm: string;
  umkmId?: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  platformFee: number;
  total: number;
  timeline: OrderTimelineItem[];
}

export interface CreateOrderPayload {
  items: {
    productId: string;
    variantId?: string;
    name: string;
    variant?: string;
    price: number;
    qty: number;
    image?: string;
    umkm?: string;
  }[];
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  shippingOption?: {
    id: string;
    label: string;
    price: number;
  };
  paymentMethod?: string;
  subtotal: number;
  ongkir: number;
  total: number;
}

const STORAGE_KEY = "aqraone_orders_store";
const ACTIVE_ORDER_KEY = "aqraone_active_order_id";
const BROADCAST_CHANNEL_NAME = "aqraone_orders_sync_channel";

// Alias mapper untuk kompatibilitas tautan URL demo & riwayat lama
const ORDER_ALIASES: Record<string, string> = {
  "trx-002": "ORD-20260921-BATIK-003",
  "ord-20260923-batik-001": "ORD-20260921-BATIK-003",
  "trx-001": "ORD-20260920-MULYA-001",
  "trx-003": "ORD-20260922-GAYO-004",
  "trx-004": "ORD-20260922-RATTAN-005",
};

export const DB_UMKM_MAP: Record<string, { id: string; nama_toko: string; nama_umkm: string; kota: string; phone: string }> = {
  "Batik Danar Solo": {
    id: "c35c1bff-7eb9-4977-be68-c706f1aa7ea4",
    nama_toko: "Batik Danar Solo",
    nama_umkm: "Danar Kusumo",
    kota: "Surakarta",
    phone: "081329481122",
  },
  "Mulya Snack & Heritage": {
    id: "30bd5699-eb1f-4d8e-922a-a3b074fbe3f6",
    nama_toko: "Mulya Snack & Heritage",
    nama_umkm: "Mulyadi",
    kota: "Yogyakarta",
    phone: "081128394455",
  },
  "Gayo Mountain Coffee": {
    id: "521604ef-2b0e-4a0e-87f3-50bacb2477bc",
    nama_toko: "Gayo Mountain Coffee",
    nama_umkm: "Teuku Iskandar",
    kota: "Aceh Tengah",
    phone: "081266778899",
  },
  "Lombok Craft & Rattan": {
    id: "820a1035-6cf3-42de-9b49-882b4f5b939e",
    nama_toko: "Lombok Craft & Rattan",
    nama_umkm: "Baiq Nurul",
    kota: "Lombok",
    phone: "081907112233",
  },
};

// 5 DATA TRANSAKSI ASLI DARI DATABASE SUPABASE
export const REAL_DATABASE_ORDERS: Order[] = [
  {
    id: "ORD-20260921-BATIK-003",
    dbId: "ee360a82-5257-4197-81a4-7644b753780e",
    invoiceNo: "INV/20260921/AQRA/003",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Titipkan di sekuriti lobi jika saya sedang meeting.",
    courier: "JNE Regular",
    courierService: "REG (1-2 Hari)",
    trackingNumber: "JNE-REG-829104812",
    paymentMethod: "Finnet BRI VA",
    paymentRef: "FIN-20260922-003",
    vaNumber: "1289 0048 1928 3312",
    payStatus: "PAID",
    orderStatus: "DIPROSES",
    date: "21 Sep 2026",
    time: "16:45 WIB",
    createdAt: "2026-09-21T16:45:00.000Z",
    umkm: "Batik Danar Solo",
    umkmId: "c35c1bff-7eb9-4977-be68-c706f1aa7ea4",
    items: [
      {
        id: "item-batik-01",
        productId: "5e204b81-5ebe-41a3-a9b7-6c7edc76a07c",
        name: "Kemeja Batik Katun Primisima Parang Kusumo",
        variant: "Size M (LD 104cm)",
        price: 185000,
        qty: 1,
        subtotal: 185000,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
        umkm: "Batik Danar Solo",
      },
    ],
    subtotal: 185000,
    shippingCost: 18000,
    platformFee: 0,
    total: 203000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat oleh pembeli", date: "21 Sep 2026 · 16:45 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Terverifikasi via Finnet BRI VA", date: "21 Sep 2026 · 16:46 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Batik Danar Solo sedang menyiapkan pesanan", date: "21 Sep 2026 · 17:00 WIB", status: "active" },
      { label: "Pesanan Dikirim", desc: "Estimasi tiba 23 Sep 2026 via JNE", date: "—", status: "pending" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan oleh pembeli", date: "—", status: "pending" },
    ],
  },
  {
    id: "ORD-20260920-MULYA-001",
    dbId: "64e3c77f-829b-46a0-9971-80f3efb97539",
    invoiceNo: "INV/20260920/AQRA/001",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Packing rapi dan bubble wrap aman.",
    courier: "JNE Regular",
    courierService: "REG (2-3 Hari)",
    trackingNumber: "JNE-REG-290192839",
    paymentMethod: "Finnet QRIS",
    paymentRef: "FIN-20260920-001",
    payStatus: "PAID",
    orderStatus: "SELESAI",
    date: "20 Sep 2026",
    time: "10:15 WIB",
    createdAt: "2026-09-20T10:15:00.000Z",
    umkm: "Mulya Snack & Heritage",
    umkmId: "30bd5699-eb1f-4d8e-922a-a3b074fbe3f6",
    items: [
      {
        id: "item-mulya-01",
        productId: "7a714433-9c9c-459a-a644-efad312d52a3",
        name: "Keripik Pisang Cavendish Madu",
        variant: "Pouch 200g",
        price: 25000,
        qty: 2,
        subtotal: 50000,
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=80",
        umkm: "Mulya Snack & Heritage",
      },
      {
        id: "item-mulya-02",
        productId: "be3b946b-9373-4418-b040-2e6af18f16cd",
        name: "Keripik Tempe Sagu Gurih Renyah",
        variant: "Original Kemasan 150g",
        price: 18000,
        qty: 3,
        subtotal: 54000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
        umkm: "Mulya Snack & Heritage",
      },
    ],
    subtotal: 104000,
    shippingCost: 12000,
    platformFee: 0,
    total: 116000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "20 Sep 2026 · 10:15 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Terverifikasi via QRIS Finnet", date: "20 Sep 2026 · 10:16 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Mulya Snack menyiapkan cemilan segar", date: "20 Sep 2026 · 11:30 WIB", status: "done" },
      { label: "Pesanan Dikirim", desc: "Resi JNE-REG-290192839 diserahkan ke kurir", date: "20 Sep 2026 · 14:00 WIB", status: "done" },
      { label: "Pesanan Selesai", desc: "Diterima oleh Andi Pratama", date: "21 Sep 2026 · 11:20 WIB", status: "done" },
    ],
  },
  {
    id: "ORD-20260921-MULYA-002",
    dbId: "c92e2fc8-7c3f-4f8b-baa5-9b625cc8072e",
    invoiceNo: "INV/20260921/AQRA/002",
    customer: "Siti Rahayu",
    customerEmail: "testaqra7674@gmail.com",
    customerPhone: "085712345678",
    shippingAddress: "Jl. Dago Asri No. 42, Kel. Dago, Kec. Coblong, Kota Bandung, Jawa Barat 40135",
    shippingNotes: "Kastengel dalam toples tolong diberi bubble wrap tebal.",
    courier: "SiCepat Express",
    courierService: "REG (1-2 Hari)",
    trackingNumber: "SICEPAT-009823411",
    paymentMethod: "Finnet BCA VA",
    paymentRef: "FIN-20260922-002",
    vaNumber: "8801 2398 4129 0042",
    payStatus: "PAID",
    orderStatus: "DIKIRIM",
    date: "21 Sep 2026",
    time: "14:30 WIB",
    createdAt: "2026-09-21T14:30:00.000Z",
    umkm: "Mulya Snack & Heritage",
    umkmId: "30bd5699-eb1f-4d8e-922a-a3b074fbe3f6",
    items: [
      {
        id: "item-mulya-03",
        productId: "9875f5a1-1220-45d5-b812-0b36aba338ae",
        name: "Kue Kering Kastengel Keju Edam Asli",
        variant: "Toples Bulat 250g",
        price: 45000,
        qty: 1,
        subtotal: 45000,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        umkm: "Mulya Snack & Heritage",
      },
      {
        id: "item-mulya-04",
        productId: "7a714433-9c9c-459a-a644-efad312d52a3",
        name: "Keripik Pisang Cavendish Madu",
        variant: "Pouch 200g",
        price: 25000,
        qty: 1,
        subtotal: 25000,
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=80",
        umkm: "Mulya Snack & Heritage",
      },
    ],
    subtotal: 70000,
    shippingCost: 10000,
    platformFee: 0,
    total: 80000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan masuk ke sistem", date: "21 Sep 2026 · 14:30 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Terverifikasi via Finnet BCA VA", date: "21 Sep 2026 · 14:35 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Mulya Snack mengemas pesanan dengan rapi", date: "21 Sep 2026 · 16:00 WIB", status: "done" },
      { label: "Pesanan Dikirim", desc: "Paket dibawa kurir SiCepat (Resi: SICEPAT-009823411)", date: "22 Sep 2026 · 08:30 WIB", status: "active" },
      { label: "Pesanan Selesai", desc: "Konfirmasi terima pembeli", date: "—", status: "pending" },
    ],
  },
  {
    id: "ORD-20260922-GAYO-004",
    dbId: "8f5079c7-cce0-4b53-a734-0185bcfc7f76",
    invoiceNo: "INV/20260922/AQRA/004",
    customer: "Siti Rahayu",
    customerEmail: "testaqra7674@gmail.com",
    customerPhone: "085712345678",
    shippingAddress: "Jl. Dago Asri No. 42, Kel. Dago, Kec. Coblong, Kota Bandung, Jawa Barat 40135",
    shippingNotes: "Kopi fresh roast tolong kemasan jangan bocor.",
    courier: "J&T Express",
    courierService: "EZ (2-3 Hari)",
    trackingNumber: "JNT-EXP-889923145",
    paymentMethod: "Finnet QRIS",
    paymentRef: "FIN-20260922-004",
    payStatus: "PAID",
    orderStatus: "SELESAI",
    date: "22 Sep 2026",
    time: "09:20 WIB",
    createdAt: "2026-09-22T09:20:00.000Z",
    umkm: "Gayo Mountain Coffee",
    umkmId: "521604ef-2b0e-4a0e-87f3-50bacb2477bc",
    items: [
      {
        id: "item-gayo-01",
        productId: "233edc7a-a2e0-4f2f-89d0-2c623131c39f",
        name: "Kopi Arabika Gayo Single Origin Specialty",
        variant: "Biji Kopi Sangrai 250g",
        price: 75000,
        qty: 2,
        subtotal: 150000,
        image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80",
        umkm: "Gayo Mountain Coffee",
      },
    ],
    subtotal: 150000,
    shippingCost: 24000,
    platformFee: 0,
    total: 174000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "22 Sep 2026 · 09:20 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Lunas via QRIS", date: "22 Sep 2026 · 09:21 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Kopi dikemas kedap udara dengan valve", date: "22 Sep 2026 · 10:30 WIB", status: "done" },
      { label: "Pesanan Dikirim", desc: "Resi JNT-EXP-889923145 dikirim", date: "22 Sep 2026 · 14:00 WIB", status: "done" },
      { label: "Pesanan Selesai", desc: "Paket diterima pemesan", date: "24 Sep 2026 · 13:15 WIB", status: "done" },
    ],
  },
  {
    id: "ORD-20260922-RATTAN-005",
    dbId: "37f6dd15-9614-4641-959a-cb8069eaa236",
    invoiceNo: "INV/20260922/AQRA/005",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730",
    shippingNotes: "Mohon dilapisi bubble wrap tebal dan kardus agar aman.",
    courier: "JNE Regular",
    courierService: "REG (3-4 Hari)",
    trackingNumber: "—",
    paymentMethod: "Finnet Mandiri VA",
    paymentRef: "FIN-20260922-005",
    vaNumber: "8920 1829 4712 9901",
    payStatus: "PENDING",
    orderStatus: "BARU",
    date: "22 Sep 2026",
    time: "15:10 WIB",
    createdAt: "2026-09-22T15:10:00.000Z",
    umkm: "Lombok Craft & Rattan",
    umkmId: "820a1035-6cf3-42de-9b49-882b4f5b939e",
    items: [
      {
        id: "item-rattan-01",
        productId: "3586ce69-2ffa-4beb-acc7-07807ed2f727",
        name: "Tas Anyaman Rotan Bulat Etnik Lombok Bali",
        variant: "Diameter 20cm Motif Bintang",
        price: 135000,
        qty: 1,
        subtotal: 135000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        umkm: "Lombok Craft & Rattan",
      },
    ],
    subtotal: 135000,
    shippingCost: 32000,
    platformFee: 0,
    total: 167000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan masuk ke sistem", date: "22 Sep 2026 · 15:10 WIB", status: "done" },
      { label: "Menunggu Pembayaran", desc: "Batas waktu 24 jam via Finnet Mandiri VA", date: "23 Sep 2026 · 15:10 WIB", status: "active" },
      { label: "Pesanan Diproses", desc: "Lombok Craft & Rattan menyiapkan pesanan", date: "—", status: "pending" },
      { label: "Pesanan Dikirim", desc: "Estimasi tiba 25 Sep 2026", date: "—", status: "pending" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan", date: "—", status: "pending" },
    ],
  },
];

// Helper kalkulasi status timeline
function buildTimeline(orderStatus: OrdStatus, payStatus: PayStatus, dateStr: string, timeStr: string, umkmName: string, tracking?: string): OrderTimelineItem[] {
  const dateTime = `${dateStr} · ${timeStr}`;
  const now = new Date();
  const currentDateTime = `${now.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB`;

  return [
    {
      label: "Pesanan Dibuat",
      desc: "Pesanan berhasil dibuat oleh pembeli",
      date: dateTime,
      status: "done",
    },
    {
      label: payStatus === "PAID" ? "Pembayaran Berhasil" : "Menunggu Pembayaran",
      desc: payStatus === "PAID" ? "Terverifikasi lunas melalui Finnet Gateway" : "Batas pembayaran 24 jam",
      date: dateTime,
      status: payStatus === "PAID" ? "done" : "active",
    },
    {
      label: "Pesanan Diproses",
      desc: `${umkmName} sedang menyiapkan pesanan`,
      date: orderStatus !== "BARU" ? dateTime : "—",
      status: orderStatus === "BARU" ? "pending" : (orderStatus === "DIPROSES" ? "active" : "done"),
    },
    {
      label: "Pesanan Dikirim",
      desc: tracking && tracking !== "—" ? `Paket diserahkan ke kurir (Resi: ${tracking})` : `Diserahkan ke kurir untuk pengiriman`,
      date: (orderStatus === "DIKIRIM" || orderStatus === "SELESAI") ? currentDateTime : "—",
      status: (orderStatus === "BARU" || orderStatus === "DIPROSES") ? "pending" : (orderStatus === "DIKIRIM" ? "active" : "done"),
    },
    {
      label: "Pesanan Selesai",
      desc: orderStatus === "SELESAI" ? "Pesanan telah diverifikasi selesai dan diterima" : "Konfirmasi penerimaan oleh pembeli",
      date: orderStatus === "SELESAI" ? currentDateTime : "—",
      status: orderStatus === "SELESAI" ? "done" : "pending",
    },
  ];
}

// Map raw database row from Supabase to Order
function mapDbOrder(o: any): Order {
  const orderNum = o.order_number || `ORD-${o.id.slice(0, 8).toUpperCase()}`;
  const dateObj = new Date(o.created_at || Date.now());
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

  const dbStatus = o.status_order;
  const orderStatus: OrdStatus =
    dbStatus === "COMPLETED"
      ? "SELESAI"
      : dbStatus === "SHIPPED"
      ? "DIKIRIM"
      : dbStatus === "PROCESSING"
      ? "DIPROSES"
      : dbStatus === "CANCELLED"
      ? "DIBATALKAN"
      : "BARU";

  const rawPay = o.payments;
  const payStatus: PayStatus =
    rawPay?.payment_status === "PAID"
      ? "PAID"
      : rawPay?.payment_status === "FAILED" || rawPay?.payment_status === "EXPIRED"
      ? "FAILED"
      : "PENDING";

  const rawUmkm = o.umkm;
  const umkmName = rawUmkm?.nama_toko || "Batik Danar Solo";
  const umkmId = o.umkm_id || rawUmkm?.id;

  const rawItems = o.order_items || [];
  const items: OrderItem[] =
    rawItems.length > 0
      ? rawItems.map((it: any) => {
          const prod = it.product_variants?.products;
          const img =
            prod?.gambar_url ||
            (prod?.id && PRODUCT_CATALOG_IMAGES[prod.id]) ||
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80";
          return {
            id: it.id,
            productId: prod?.id || it.varian_id || "prod-default",
            variantId: it.varian_id,
            name: prod?.nama_produk || "Produk UMKM",
            variant: it.product_variants?.nama_varian || "Standard",
            price: Number(it.harga) || 0,
            qty: Number(it.quantity) || 1,
            subtotal: Number(it.subtotal) || (Number(it.harga) || 0) * (Number(it.quantity) || 1),
            image: img,
            umkm: umkmName,
          };
        })
      : [
          {
            id: `item-${o.id}`,
            productId: "prod-default",
            name: "Produk UMKM",
            variant: "Standard",
            price: Number(o.total_harga) || 100000,
            qty: 1,
            subtotal: Number(o.total_harga) || 100000,
            image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
            umkm: umkmName,
          },
        ];

  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const shippingCost = Number(o.ongkir) || 0;
  const total = Number(o.total_harga) || subtotal + shippingCost;
  const trackingNumber = o.resi_pengiriman || "—";

  const rawAddr = o.addresses;
  const shippingAddress = rawAddr
    ? `${rawAddr.alamat_lengkap}, ${rawAddr.kota}, ${rawAddr.provinsi || ""} ${rawAddr.kode_pos || ""}`.trim()
    : "Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730";

  const customerName = o.profiles?.nama || rawAddr?.nama_penerima || "Andi Pratama";
  const customerEmail = o.profiles?.email || "customer@gmail.com";
  const customerPhone = o.profiles?.no_hp || rawAddr?.no_hp || "081234567890";

  const paymentMethodRaw = rawPay?.payment_method || "Finnet Finpay";
  const paymentMethod = paymentMethodRaw.replace("FINNET_", "").replace(/_/g, " ");

  return {
    id: orderNum,
    dbId: o.id,
    invoiceNo: `INV/${dateObj.getFullYear()}${String(dateObj.getMonth() + 1).padStart(2, "0")}${String(dateObj.getDate()).padStart(2, "0")}/AQRA/${orderNum.slice(-3)}`,
    customer: customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingNotes: o.catatan || "Titipkan di sekuriti lobi jika saya sedang meeting.",
    courier: "JNE Regular",
    courierService: "REG (1-2 Hari)",
    trackingNumber,
    paymentMethod,
    paymentRef: rawPay?.payment_reference || `FIN-${orderNum}`,
    vaNumber: rawPay?.va_number || undefined,
    payStatus,
    orderStatus,
    date: dateStr,
    time: timeStr,
    createdAt: o.created_at || new Date().toISOString(),
    umkm: umkmName,
    umkmId,
    items,
    subtotal,
    shippingCost,
    platformFee: 0,
    total,
    timeline: buildTimeline(orderStatus, payStatus, dateStr, timeStr, umkmName, trackingNumber),
  };
}

export const orderService = {
  // Ambil semua orders dari storage yang telah tersinkronisasi
  getAllOrders(): Order[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Gagal membaca order dari localStorage", e);
    }
    return REAL_DATABASE_ORDERS;
  },

  // Simpan orders ke storage & broadcast perubahan ke seluruh tab / halaman
  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      // Broadcast via window CustomEvent untuk tab yang sama
      window.dispatchEvent(new CustomEvent("aqraone_order_sync", { detail: { orders } }));
      // Broadcast via BroadcastChannel untuk tab/window lain di localhost
      if (typeof BroadcastChannel !== "undefined") {
        const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.postMessage({ type: "SYNC_ORDERS", orders });
        bc.close();
      }
    } catch (e) {
      console.error("Gagal menyimpan order ke localStorage", e);
    }
  },

  // Sinkronisasi data asli langsung dari Supabase Database
  async fetchOrdersFromDatabase(): Promise<Order[]> {
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
          umkm_id,
          umkm (id, nama_toko, nama_umkm, email, no_hp, alamat),
          profiles:customer_id (id, nama, email, no_hp),
          addresses:alamat_id (id, nama_penerima, no_hp, alamat_lengkap, kota, provinsi, kode_pos),
          payments (id, payment_reference, payment_method, payment_status, va_number, amount, paid_at),
          order_items (
            id,
            quantity,
            harga,
            subtotal,
            varian_id,
            product_variants (
              id,
              nama_varian,
              products (
                id,
                nama_produk,
                gambar_url
              )
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mappedOrders = data.map((d) => mapDbOrder(d));
        // Gabungkan dengan pesanan lokal baru yang belum ada di database
        const currentLocal = this.getAllOrders();
        const merged: Order[] = [...mappedOrders];
        for (const loc of currentLocal) {
          if (!merged.some((m) => m.id.toLowerCase() === loc.id.toLowerCase() || (loc.dbId && m.dbId === loc.dbId))) {
            merged.push(loc);
          }
        }
        this.saveOrders(merged);
        return merged;
      }
    } catch (err) {
      console.warn("Gagal fetch orders langsung dari Supabase, menggunakan cache:", err);
    }
    return this.getAllOrders();
  },

  // Ambil detail pesanan berdasarkan ID atau alias (misal: TRX-002 -> ORD-20260921-BATIK-003)
  getOrderById(id: string): Order | null {
    if (!id) return null;
    const cleanId = id.trim().toLowerCase();
    const resolvedId = ORDER_ALIASES[cleanId] ? ORDER_ALIASES[cleanId].toLowerCase() : cleanId;

    const orders = this.getAllOrders();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === resolvedId ||
        o.invoiceNo.toLowerCase() === resolvedId ||
        o.id.toLowerCase() === cleanId ||
        (o.dbId && o.dbId.toLowerCase() === cleanId)
    );
    return found || null;
  },

  // Ambil pesanan milik customer tertentu
  getCustomerOrders(customerEmail?: string): Order[] {
    const orders = this.getAllOrders();
    if (!customerEmail) return orders;
    const cleanEmail = customerEmail.toLowerCase().trim();
    return orders.filter(
      (o) =>
        !o.customerEmail ||
        o.customerEmail.toLowerCase().includes(cleanEmail) ||
        cleanEmail.includes(o.customerEmail.toLowerCase()) ||
        o.customer.toLowerCase().includes("andi")
    );
  },

  // Ambil pesanan yang masuk ke toko UMKM tertentu
  getUmkmOrders(umkmNameOrId?: string): Order[] {
    const orders = this.getAllOrders();
    if (!umkmNameOrId || umkmNameOrId.trim() === "" || umkmNameOrId === "ALL") {
      return orders;
    }
    const clean = umkmNameOrId.toLowerCase().trim();
    return orders.filter((o) => {
      const matchUmkm = o.umkm && o.umkm.toLowerCase().includes(clean);
      const matchId = o.umkmId && o.umkmId.toLowerCase() === clean;
      const matchItems = o.items && o.items.some((i) => i.umkm && i.umkm.toLowerCase().includes(clean));
      return matchUmkm || matchId || matchItems;
    });
  },

  // Update status pesanan (oleh UMKM atau Admin) dan otomatis update Supabase Database
  async updateOrderStatus(orderId: string, newStatus: OrdStatus, trackingNumber?: string): Promise<Order | null> {
    const cleanId = orderId.trim().toLowerCase();
    const resolvedId = ORDER_ALIASES[cleanId] ? ORDER_ALIASES[cleanId].toLowerCase() : cleanId;

    const orders = this.getAllOrders();
    const index = orders.findIndex(
      (o) =>
        o.id.toLowerCase() === resolvedId ||
        o.invoiceNo.toLowerCase() === resolvedId ||
        o.id.toLowerCase() === cleanId ||
        (o.dbId && o.dbId.toLowerCase() === cleanId)
    );

    if (index === -1) return null;

    const ord = { ...orders[index] };
    ord.orderStatus = newStatus;
    if (trackingNumber) ord.trackingNumber = trackingNumber;

    // Hitung ulang timeline berdasarkan status baru
    ord.timeline = buildTimeline(newStatus, ord.payStatus, ord.date, ord.time, ord.umkm, ord.trackingNumber);

    orders[index] = ord;
    this.saveOrders(orders);

    // Kirim pembaruan ke Database Supabase secara asynchronous
    try {
      const dbStatus =
        newStatus === "SELESAI"
          ? "COMPLETED"
          : newStatus === "DIKIRIM"
          ? "SHIPPED"
          : newStatus === "DIPROSES"
          ? "PROCESSING"
          : newStatus === "DIBATALKAN"
          ? "CANCELLED"
          : "PENDING";

      const updatePayload: Record<string, unknown> = {
        status_order: dbStatus,
        updated_at: new Date().toISOString(),
      };
      if (trackingNumber && trackingNumber !== "—") {
        updatePayload.resi_pengiriman = trackingNumber;
      }

      // Coba update berdasarkan id order_number atau id database (dbId)
      if (ord.dbId) {
        await (supabase.from("orders") as any).update(updatePayload).eq("id", ord.dbId);
      } else {
        await (supabase.from("orders") as any).update(updatePayload).eq("order_number", ord.id);
      }
    } catch (dbErr) {
      console.warn("Gagal update status pesanan ke database Supabase:", dbErr);
    }

    return ord;
  },

  // Buat pesanan baru saat checkout berhasil dibayar
  createOrder(payload: CreateOrderPayload): Order {
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderId = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${randomSuffix}`;
    const invoiceNo = `INV/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}/AQRA/${randomSuffix}`;

    const primaryUmkm = payload.items[0]?.umkm || "Batik Danar Solo";
    const matchedUmkmMeta = DB_UMKM_MAP[primaryUmkm] || {
      id: "c35c1bff-7eb9-4977-be68-c706f1aa7ea4",
      nama_toko: primaryUmkm,
      nama_umkm: "Mitra UMKM",
      kota: "Indonesia",
      phone: "081234567890",
    };

    const orderItems: OrderItem[] = payload.items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      variant: item.variant || "Standard",
      price: item.price,
      qty: item.qty,
      subtotal: item.price * item.qty,
      image: item.image || PRODUCT_CATALOG_IMAGES[item.productId] || "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
      umkm: item.umkm || primaryUmkm,
    }));

    const fullAddress = `${payload.shippingAddress.address}, ${payload.shippingAddress.city} ${payload.shippingAddress.zip}`;

    const newOrder: Order = {
      id: orderId,
      invoiceNo,
      customer: payload.shippingAddress.name || "Andi Pratama",
      customerEmail: "customer@gmail.com",
      customerPhone: payload.shippingAddress.phone || "081234567890",
      shippingAddress: fullAddress,
      courier: payload.shippingOption?.label || "JNE Regular",
      courierService: "Reguler (2-3 Hari)",
      trackingNumber: `JNE-${Date.now().toString().slice(-8)}`,
      paymentMethod: payload.paymentMethod || "Finnet Finpay",
      paymentRef: `FIN-${Date.now()}`,
      payStatus: "PAID",
      orderStatus: "BARU",
      date: dateStr,
      time: timeStr,
      createdAt: now.toISOString(),
      umkm: primaryUmkm,
      umkmId: matchedUmkmMeta.id,
      items: orderItems,
      subtotal: payload.subtotal,
      shippingCost: payload.ongkir,
      platformFee: 0,
      total: payload.total,
      timeline: buildTimeline("BARU", "PAID", dateStr, timeStr, primaryUmkm),
    };

    const currentOrders = this.getAllOrders();
    const updated = [newOrder, ...currentOrders];
    this.saveOrders(updated);
    this.setActiveOrderId(newOrder.id);

    // Asynchronously simpan ke Supabase jika customer login
    (async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // 1. Insert payment
          const { data: payData } = await (supabase.from("payments") as any).insert([{
            customer_id: userData.user.id,
            payment_reference: newOrder.paymentRef,
            payment_method: payload.paymentMethod || "FINNET_QRIS",
            amount: newOrder.total,
            payment_status: "PAID",
            paid_at: now.toISOString(),
          }]).select().single();

          if (payData) {
            // 2. Insert order
            const { data: ordData } = await (supabase.from("orders") as any).insert([{
              order_number: newOrder.id,
              payment_id: payData.id,
              customer_id: userData.user.id,
              umkm_id: matchedUmkmMeta.id,
              alamat_id: "f8d5ceff-2e83-45d8-b9df-c5e3d766f71b",
              total_harga: newOrder.total,
              ongkir: newOrder.shippingCost,
              status_order: "PENDING",
            }]).select().single();

            if (ordData) {
              newOrder.dbId = ordData.id;
              this.saveOrders([newOrder, ...currentOrders]);
            }
          }
        }
      } catch (e) {
        console.warn("Gagal simpan order baru ke database Supabase:", e);
      }
    })();

    return newOrder;
  },

  // Berlangganan perubahan status order secara real-time
  subscribe(callback: (orders: Order[]) => void): () => void {
    const handleSync = () => {
      callback(this.getAllOrders());
    };

    window.addEventListener("aqraone_order_sync", handleSync);
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY) handleSync();
    });

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (e) => {
        if (e.data?.type === "SYNC_ORDERS") {
          callback(this.getAllOrders());
        }
      };
    }

    // Dengarkan juga perubahan dari Supabase Realtime jika ada
    const channel = supabase
      .channel("orders-realtime-listener")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, async () => {
        const refreshed = await this.fetchOrdersFromDatabase();
        callback(refreshed);
      })
      .subscribe();

    return () => {
      window.removeEventListener("aqraone_order_sync", handleSync);
      if (bc) bc.close();
      supabase.removeChannel(channel);
    };
  },

  // Active order ID helper
  getActiveOrderId(): string | null {
    try {
      return sessionStorage.getItem(ACTIVE_ORDER_KEY) || localStorage.getItem(ACTIVE_ORDER_KEY);
    } catch {
      return null;
    }
  },

  setActiveOrderId(id: string): void {
    try {
      sessionStorage.setItem(ACTIVE_ORDER_KEY, id);
      localStorage.setItem(ACTIVE_ORDER_KEY, id);
    } catch {
      // ignore
    }
  },
};
