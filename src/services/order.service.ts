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

// Pemetaan toko resmi dari database Supabase
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

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-20260923-BATIK-001",
    invoiceNo: "INV/20260923/AQRA/001",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Sudirman No. 45, RT 02/RW 04, Menteng, Jakarta Pusat 10310",
    shippingNotes: "Titipkan di sekuriti lobi jika saya sedang meeting.",
    courier: "JNE Regular",
    courierService: "REG (2-3 Hari)",
    trackingNumber: "JNE-REG-829104812",
    paymentMethod: "Finnet Finpay",
    paymentRef: "FIN-20260923-9823741",
    vaNumber: "8930 1928 4719 2810",
    payStatus: "PAID",
    orderStatus: "DIPROSES",
    date: "23 Sep 2026",
    time: "14:30 WIB",
    createdAt: "2026-09-23T07:30:00.000Z",
    umkm: "Batik Danar Solo",
    umkmId: "c35c1bff-7eb9-4977-be68-c706f1aa7ea4",
    items: [
      {
        id: "item-1",
        productId: "66982947-c766-4473-9249-68de9cde96a5",
        name: "Kain Batik Tulis Sutra Motif Truntum",
        variant: "Kain Panjang 2.4 x 1.15 Meter",
        price: 350000,
        qty: 1,
        subtotal: 350000,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
        umkm: "Batik Danar Solo",
      },
    ],
    subtotal: 350000,
    shippingCost: 15000,
    platformFee: 1000,
    total: 366000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat oleh pembeli", date: "23 Sep 2026 · 14:30 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Terverifikasi lunas melalui Finnet Finpay", date: "23 Sep 2026 · 14:31 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Batik Danar Solo sedang menyiapkan pesanan", date: "23 Sep 2026 · 15:00 WIB", status: "active" },
      { label: "Pesanan Dikirim", desc: "Estimasi tiba 25 Sep 2026", date: "—", status: "pending" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan oleh pembeli", date: "—", status: "pending" },
    ],
  },
  {
    id: "TRX-001",
    invoiceNo: "INV/20260915/AQRA/001",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Merdeka No. 45, Bandung 40115",
    shippingNotes: "Packing rapi dan bubble wrap aman.",
    courier: "JNE Regular",
    courierService: "REG (2-3 Hari)",
    trackingNumber: "JNE-20260915-001234",
    paymentMethod: "Finnet Finpay",
    paymentRef: "FIN-20260915-1829471",
    payStatus: "PAID",
    orderStatus: "DIPROSES",
    date: "15 Sep 2026",
    time: "14:30 WIB",
    createdAt: "2026-09-15T07:30:00.000Z",
    umkm: "Mulya Snack & Heritage",
    umkmId: "30bd5699-eb1f-4d8e-922a-a3b074fbe3f6",
    items: [
      {
        id: "item-2",
        productId: "7a714433-9c9c-459a-a644-efad312d52a3",
        name: "Keripik Pisang Cavendish Madu",
        variant: "Kemasan 250gr",
        price: 25000,
        qty: 2,
        subtotal: 50000,
        image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=80",
        umkm: "Mulya Snack & Heritage",
      },
      {
        id: "item-3",
        productId: "233edc7a-a2e0-4f2f-89d0-2c623131c39f",
        name: "Kopi Arabika Gayo Single Origin Specialty",
        variant: "Medium Roast 250gr",
        price: 75000,
        qty: 1,
        subtotal: 75000,
        image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80",
        umkm: "Gayo Mountain Coffee",
      },
    ],
    subtotal: 125000,
    shippingCost: 15000,
    platformFee: 1000,
    total: 141000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "15 Sep 2026 · 14:30 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Dibayar via Finnet", date: "15 Sep 2026 · 14:31 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Mulya Snack & Heritage sedang menyiapkan pesanan", date: "15 Sep 2026 · 15:00 WIB", status: "active" },
      { label: "Pesanan Dikirim", desc: "Estimasi tiba 18 Sep 2026", date: "—", status: "pending" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan", date: "—", status: "pending" },
    ],
  },
  {
    id: "TRX-002",
    invoiceNo: "INV/20260912/AQRA/002",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Merdeka No. 45, Bandung 40115",
    courier: "SiCepat BEST",
    courierService: "BEST (1 Hari)",
    trackingNumber: "SCP-992837162",
    paymentMethod: "BCA Virtual Account",
    paymentRef: "FIN-20260912-9923145",
    payStatus: "PAID",
    orderStatus: "DIKIRIM",
    date: "12 Sep 2026",
    time: "10:15 WIB",
    createdAt: "2026-09-12T03:15:00.000Z",
    umkm: "Batik Danar Solo",
    umkmId: "c35c1bff-7eb9-4977-be68-c706f1aa7ea4",
    items: [
      {
        id: "item-4",
        productId: "5e204b81-5ebe-41a3-a9b7-6c7edc76a07c",
        name: "Kemeja Batik Katun Primisima Parang Kusumo",
        variant: "Ukuran L (Lingkar Dada 108cm)",
        price: 185000,
        qty: 1,
        subtotal: 185000,
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
        umkm: "Batik Danar Solo",
      },
    ],
    subtotal: 185000,
    shippingCost: 18000,
    platformFee: 1000,
    total: 204000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "12 Sep 2026 · 10:15 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Dibayar via BCA VA", date: "12 Sep 2026 · 10:16 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Batik Danar Solo telah memverifikasi produk", date: "12 Sep 2026 · 11:30 WIB", status: "done" },
      { label: "Pesanan Dikirim", desc: "Paket diserahkan ke kurir SiCepat", date: "12 Sep 2026 · 14:00 WIB", status: "active" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan", date: "—", status: "pending" },
    ],
  },
  {
    id: "TRX-003",
    invoiceNo: "INV/20260908/AQRA/003",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Merdeka No. 45, Bandung 40115",
    courier: "J&T Express",
    courierService: "EZ (2-4 Hari)",
    trackingNumber: "JNT-882736192",
    paymentMethod: "QRIS Finnet",
    paymentRef: "FIN-20260908-1192837",
    payStatus: "PAID",
    orderStatus: "SELESAI",
    date: "8 Sep 2026",
    time: "11:00 WIB",
    createdAt: "2026-09-08T04:00:00.000Z",
    umkm: "Gayo Mountain Coffee",
    umkmId: "521604ef-2b0e-4a0e-87f3-50bacb2477bc",
    items: [
      {
        id: "item-5",
        productId: "233edc7a-a2e0-4f2f-89d0-2c623131c39f",
        name: "Kopi Arabika Gayo Single Origin Specialty",
        variant: "Whole Bean 250gr",
        price: 75000,
        qty: 2,
        subtotal: 150000,
        image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80",
        umkm: "Gayo Mountain Coffee",
      },
    ],
    subtotal: 150000,
    shippingCost: 20000,
    platformFee: 1000,
    total: 171000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan berhasil dibuat", date: "8 Sep 2026 · 11:00 WIB", status: "done" },
      { label: "Pembayaran Berhasil", desc: "Lunas via QRIS", date: "8 Sep 2026 · 11:01 WIB", status: "done" },
      { label: "Pesanan Diproses", desc: "Kopi fresh roast dikemas kedap udara", date: "8 Sep 2026 · 12:30 WIB", status: "done" },
      { label: "Pesanan Dikirim", desc: "Resi JNT-882736192 terkirim", date: "8 Sep 2026 · 15:00 WIB", status: "done" },
      { label: "Pesanan Selesai", desc: "Diterima oleh Andi Pratama", date: "10 Sep 2026 · 16:30 WIB", status: "done" },
    ],
  },
  {
    id: "TRX-004",
    invoiceNo: "INV/20260901/AQRA/004",
    customer: "Andi Pratama",
    customerEmail: "customer@gmail.com",
    customerPhone: "081234567890",
    shippingAddress: "Jl. Merdeka No. 45, Bandung 40115",
    courier: "JNE Regular",
    courierService: "REG (2-3 Hari)",
    paymentMethod: "Mandiri Virtual Account",
    paymentRef: "FIN-20260901-4491823",
    payStatus: "PENDING",
    orderStatus: "BARU",
    date: "1 Sep 2026",
    time: "16:20 WIB",
    createdAt: "2026-09-01T09:20:00.000Z",
    umkm: "Lombok Craft & Rattan",
    umkmId: "820a1035-6cf3-42de-9b49-882b4f5b939e",
    items: [
      {
        id: "item-6",
        productId: "3586ce69-2ffa-4beb-acc7-07807ed2f727",
        name: "Tas Anyaman Rotan Bulat Etnik Lombok Bali",
        variant: "Ukuran Diameter 20cm",
        price: 145000,
        qty: 1,
        subtotal: 145000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        umkm: "Lombok Craft & Rattan",
      },
    ],
    subtotal: 145000,
    shippingCost: 25000,
    platformFee: 1000,
    total: 171000,
    timeline: [
      { label: "Pesanan Dibuat", desc: "Pesanan masuk ke sistem", date: "1 Sep 2026 · 16:20 WIB", status: "done" },
      { label: "Menunggu Pembayaran", desc: "Batas pembayaran 24 jam via Finnet", date: "2 Sep 2026 · 16:20 WIB", status: "active" },
      { label: "Pesanan Diproses", desc: "Lombok Craft & Rattan menyiapkan pesanan", date: "—", status: "pending" },
      { label: "Pesanan Dikirim", desc: "Estimasi tiba 5 Sep 2026", date: "—", status: "pending" },
      { label: "Pesanan Selesai", desc: "Konfirmasi penerimaan", date: "—", status: "pending" },
    ],
  },
];

export const orderService = {
  // Ambil semua orders dari storage (disinkronkan dengan default dan data terbaru)
  getAllOrders(): Order[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Bersihkan data lama jika masih ada 'Naraya Snack'
          return parsed.map((ord: Order) => {
            if (ord.umkm === "Naraya Snack") {
              ord.umkm = "Mulya Snack & Heritage";
              ord.umkmId = "30bd5699-eb1f-4d8e-922a-a3b074fbe3f6";
              ord.timeline = ord.timeline.map((t) => ({
                ...t,
                desc: t.desc.replace("Naraya Snack", "Mulya Snack & Heritage"),
              }));
            }
            // Pastikan gambar produk sesuai katalog
            if (ord.items) {
              ord.items = ord.items.map((i) => {
                if (PRODUCT_CATALOG_IMAGES[i.productId]) {
                  return { ...i, image: PRODUCT_CATALOG_IMAGES[i.productId] };
                }
                return i;
              });
            }
            return ord;
          });
        }
      }
    } catch (e) {
      console.error("Gagal membaca order dari localStorage", e);
    }
    return DEFAULT_ORDERS;
  },

  // Simpan orders ke storage
  saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Gagal menyimpan order ke localStorage", e);
    }
  },

  // Ambil detail pesanan berdasarkan ID
  getOrderById(id: string): Order | null {
    const orders = this.getAllOrders();
    const found = orders.find(
      (o) => o.id.toLowerCase() === id.toLowerCase() || o.invoiceNo.toLowerCase() === id.toLowerCase()
    );
    return found || null;
  },

  // Ambil pesanan milik customer tertentu
  getCustomerOrders(customerEmail?: string): Order[] {
    const orders = this.getAllOrders();
    if (!customerEmail) return orders;
    return orders.filter(
      (o) => !o.customerEmail || o.customerEmail.toLowerCase() === customerEmail.toLowerCase() || o.customer.toLowerCase().includes("andi")
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

    // Tentukan nama UMKM toko asal dari item pertama yang dibeli
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
      platformFee: 1000,
      total: payload.total,
      timeline: [
        {
          label: "Pesanan Dibuat",
          desc: "Pesanan berhasil dibuat oleh pembeli",
          date: `${dateStr} · ${timeStr}`,
          status: "done",
        },
        {
          label: "Pembayaran Berhasil",
          desc: `Terverifikasi via ${payload.paymentMethod || "Finnet Gateway"}`,
          date: `${dateStr} · ${timeStr}`,
          status: "done",
        },
        {
          label: "Pesanan Diproses",
          desc: `${primaryUmkm} sedang menyiapkan pesanan`,
          date: `${dateStr} · ${timeStr}`,
          status: "active",
        },
        {
          label: "Pesanan Dikirim",
          desc: `Estimasi tiba 2-3 hari via ${payload.shippingOption?.label || "Kurir"}`,
          date: "—",
          status: "pending",
        },
        {
          label: "Pesanan Selesai",
          desc: "Konfirmasi penerimaan oleh pembeli",
          date: "—",
          status: "pending",
        },
      ],
    };

    const currentOrders = this.getAllOrders();
    const updated = [newOrder, ...currentOrders];
    this.saveOrders(updated);
    this.setActiveOrderId(newOrder.id);

    return newOrder;
  },

  // Update status pesanan (oleh UMKM atau Admin)
  updateOrderStatus(orderId: string, newStatus: OrdStatus, trackingNumber?: string): Order | null {
    const orders = this.getAllOrders();
    const index = orders.findIndex(
      (o) => o.id.toLowerCase() === orderId.toLowerCase() || o.invoiceNo.toLowerCase() === orderId.toLowerCase()
    );
    if (index === -1) return null;

    const ord = orders[index];
    ord.orderStatus = newStatus;
    if (trackingNumber) ord.trackingNumber = trackingNumber;

    const now = new Date();
    const timeStr = `${now.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB`;

    if (newStatus === "DIPROSES") {
      ord.timeline = ord.timeline.map((t) => {
        if (t.label === "Pesanan Diproses") return { ...t, status: "active", date: timeStr };
        return t;
      });
    } else if (newStatus === "DIKIRIM") {
      ord.timeline = ord.timeline.map((t) => {
        if (t.label === "Pesanan Diproses") return { ...t, status: "done" };
        if (t.label === "Pesanan Dikirim") return { ...t, status: "active", date: timeStr, desc: `Resi: ${ord.trackingNumber || "Terkirim ke kurir"}` };
        return t;
      });
    } else if (newStatus === "SELESAI") {
      ord.timeline = ord.timeline.map((t) => ({ ...t, status: "done", date: t.date === "—" ? timeStr : t.date }));
    }

    orders[index] = { ...ord };
    this.saveOrders(orders);
    return orders[index];
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
