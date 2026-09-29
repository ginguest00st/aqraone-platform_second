export interface Voucher {
  code: string;
  title: string;
  description: string;
  type: "percentage" | "fixed" | "shipping";
  value: number; // e.g. 30 for 30%, or 20000 for Rp20.000
  maxDiscount?: number; // e.g. 50000
  minSpend: number;
}

export const AVAILABLE_VOUCHERS: Record<string, Voucher> = {
  AQRAJUARA: {
    code: "AQRAJUARA",
    title: "Voucher Pengguna Baru 30%",
    description: "Diskon 30% hingga Rp50.000 khusus produk UMKM Nusantara.",
    type: "percentage",
    value: 30,
    maxDiscount: 50000,
    minSpend: 0,
  },
  BANGGAUMKM: {
    code: "BANGGAUMKM",
    title: "Potongan Langsung Rp20.000",
    description: "Potongan Rp20.000 dengan minimum belanja Rp75.000.",
    type: "fixed",
    value: 20000,
    minSpend: 75000,
  },
  ONGKIRGRATIS: {
    code: "ONGKIRGRATIS",
    title: "Bebas Ongkir Nusantara",
    description: "Potongan ongkos kirim hingga Rp15.000 ke seluruh Indonesia.",
    type: "shipping",
    value: 15000,
    minSpend: 30000,
  },
};

export interface VoucherApplyResult {
  valid: boolean;
  code: string;
  discount: number;
  message: string;
  voucher?: Voucher;
}

export function applyVoucher(
  code: string,
  subtotal: number,
  shippingCost: number = 0
): VoucherApplyResult {
  const cleanCode = (code || "").trim().toUpperCase();

  if (!cleanCode) {
    return { valid: false, code: "", discount: 0, message: "Silakan masukkan kode voucher." };
  }

  const voucher = AVAILABLE_VOUCHERS[cleanCode];
  if (!voucher) {
    return {
      valid: false,
      code: cleanCode,
      discount: 0,
      message: `Kode voucher "${cleanCode}" tidak ditemukan atau sudah kadaluarsa.`,
    };
  }

  if (subtotal < voucher.minSpend) {
    return {
      valid: false,
      code: cleanCode,
      discount: 0,
      message: `Minimum belanja untuk voucher ini adalah Rp${voucher.minSpend.toLocaleString("id-ID")}.`,
    };
  }

  let discount = 0;
  if (voucher.type === "percentage") {
    discount = Math.round((subtotal * voucher.value) / 100);
    if (voucher.maxDiscount && discount > voucher.maxDiscount) {
      discount = voucher.maxDiscount;
    }
  } else if (voucher.type === "fixed") {
    discount = Math.min(voucher.value, subtotal);
  } else if (voucher.type === "shipping") {
    discount = Math.min(voucher.value, shippingCost);
  }

  return {
    valid: true,
    code: cleanCode,
    discount,
    message: `Voucher ${voucher.code} berhasil diterapkan! Hemat Rp${discount.toLocaleString("id-ID")}.`,
    voucher,
  };
}

const STORAGE_VOUCHER_KEY = "aqraone_active_voucher";

export function getSavedVoucherCode(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_VOUCHER_KEY) || localStorage.getItem(STORAGE_VOUCHER_KEY);
  } catch {
    return null;
  }
}

export function saveActiveVoucherCode(code: string): void {
  try {
    sessionStorage.setItem(STORAGE_VOUCHER_KEY, code.toUpperCase());
    localStorage.setItem(STORAGE_VOUCHER_KEY, code.toUpperCase());
  } catch {
    // ignore
  }
}

export function removeSavedVoucherCode(): void {
  try {
    sessionStorage.removeItem(STORAGE_VOUCHER_KEY);
    localStorage.removeItem(STORAGE_VOUCHER_KEY);
  } catch {
    // ignore
  }
}
