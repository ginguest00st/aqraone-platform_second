import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  umkm: string;
  variant: string;
  price: number;
  qty: number;
  image: string;
  checked: boolean;
}

export interface AddToCartPayload {
  productId: string;
  name: string;
  umkm: string;
  variant?: string;
  variantId?: string;
  price: number;
  qty?: number;
  image?: string;
}

export interface CartContextType {
  items: CartItem[];
  cartCount: number;
  toast: { message: string; visible: boolean; item?: CartItem } | null;
  addToCart: (payload: AddToCartPayload) => void;
  buyNow: (payload: AddToCartPayload) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  toggleCheck: (id: string) => void;
  toggleAll: (checked?: boolean) => void;
  clearCart: () => void;
  clearCheckedItems: () => void;
  getCheckoutItems: () => CartItem[];
  directCheckoutItem: CartItem | null;
  setDirectCheckoutItem: (item: CartItem | null) => void;
  closeToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "aqraone_user_cart";
const DIRECT_KEY = "aqraone_direct_checkout";

export const PRODUCT_CATALOG_IMAGES: Record<string, string> = {
  "7a714433-9c9c-459a-a644-efad312d52a3": "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=600&auto=format&fit=crop&q=80",
  "be3b946b-9373-4418-b040-2e6af18f16cd": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
  "9875f5a1-1220-45d5-b812-0b36aba338ae": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
  "4f62b8fd-23be-48a9-813e-15fd51f26d8f": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80",
  "05be9803-2bd4-4cd6-b536-e1942ae5bfd5": "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?w=600&auto=format&fit=crop&q=80",
  "5e204b81-5ebe-41a3-a9b7-6c7edc76a07c": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
  "66982947-c766-4473-9249-68de9cde96a5": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
  "cf4c4a5b-7a02-4a72-b306-0bb633c8c4dd": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
  "233edc7a-a2e0-4f2f-89d0-2c623131c39f": "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&auto=format&fit=crop&q=80",
  "3f0e6e1e-7a8e-41eb-8598-b9dedf0e5112": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
  "242cf8db-7b88-4ffa-84a4-c404d5ac35de": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80",
  "3586ce69-2ffa-4beb-acc7-07807ed2f727": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
  "7e1a87cf-9a9f-4968-a529-a3b133095865": "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600&auto=format&fit=crop&q=80",
  "a13307ef-cef3-41ca-b644-73d2ed530e0e": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80",
};

export function syncItemImage(item: CartItem): CartItem {
  if (!item) return item;
  if (PRODUCT_CATALOG_IMAGES[item.productId]) {
    return { ...item, image: PRODUCT_CATALOG_IMAGES[item.productId] };
  }
  if (item.image && item.image.includes("1558618666-fcd25c85cd64")) {
    return {
      ...item,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
    };
  }
  return item;
}

const DEFAULT_ITEMS: CartItem[] = [
  {
    id: "init-1",
    productId: "66982947-c766-4473-9249-68de9cde96a5",
    name: "Kain Batik Tulis Sutra Motif Truntum",
    umkm: "Batik Danar Solo",
    variant: "Kain Panjang 2.4 x 1.15 Meter",
    price: 350000,
    qty: 1,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80",
    checked: true,
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(syncItemImage);
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    return DEFAULT_ITEMS;
  });

  const [directCheckoutItem, setDirectCheckoutItem] = useState<CartItem | null>(() => {
    try {
      const saved = sessionStorage.getItem(DIRECT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") return syncItemImage(parsed);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [toast, setToast] = useState<{ message: string; visible: boolean; item?: CartItem } | null>(null);

  // Sync items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  // Total items in cart
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const closeToast = () => {
    setToast(null);
  };

  const addToCart = (payload: AddToCartPayload) => {
    const qtyToAdd = payload.qty && payload.qty > 0 ? payload.qty : 1;
    const variantStr = payload.variant || "Standard";
    const itemId = `${payload.productId}-${payload.variantId || variantStr}`;
    const resolvedImage =
      payload.image ||
      PRODUCT_CATALOG_IMAGES[payload.productId] ||
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80";

    let addedItem: CartItem;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === payload.productId && i.variant === variantStr
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.qty + qtyToAdd;
        addedItem = {
          ...existing,
          qty: newQty,
          image: resolvedImage,
          checked: true,
        };
        updated[existingIndex] = addedItem;
        return updated;
      } else {
        addedItem = {
          id: itemId,
          productId: payload.productId,
          variantId: payload.variantId,
          name: payload.name,
          umkm: payload.umkm || "Mitra UMKM",
          variant: variantStr,
          price: payload.price,
          qty: qtyToAdd,
          image: resolvedImage,
          checked: true,
        };
        return [addedItem, ...prev];
      }
    });

    // Reset direct checkout
    setDirectCheckoutItem(null);
    sessionStorage.removeItem(DIRECT_KEY);

    // Trigger Toast
    setToast({
      message: `"${payload.name}" berhasil ditambahkan ke keranjang!`,
      visible: true,
      item: {
        id: itemId,
        productId: payload.productId,
        name: payload.name,
        umkm: payload.umkm,
        variant: variantStr,
        price: payload.price,
        qty: qtyToAdd,
        image: resolvedImage,
        checked: true,
      },
    });

    // Auto dismiss toast after 4s
    setTimeout(() => {
      setToast((cur) => (cur?.item?.id === itemId ? null : cur));
    }, 4000);
  };

  const buyNow = (payload: AddToCartPayload) => {
    const qtyToAdd = payload.qty && payload.qty > 0 ? payload.qty : 1;
    const variantStr = payload.variant || "Standard";
    const resolvedImage =
      payload.image ||
      PRODUCT_CATALOG_IMAGES[payload.productId] ||
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80";

    const directItem: CartItem = {
      id: `direct-${payload.productId}-${Date.now()}`,
      productId: payload.productId,
      variantId: payload.variantId,
      name: payload.name,
      umkm: payload.umkm || "Mitra UMKM",
      variant: variantStr,
      price: payload.price,
      qty: qtyToAdd,
      image: resolvedImage,
      checked: true,
    };

    setDirectCheckoutItem(directItem);
    try {
      sessionStorage.setItem(DIRECT_KEY, JSON.stringify(directItem));
    } catch {
      // ignore
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.qty + delta);
          return { ...i, qty: newQty };
        }
        return i;
      })
    );
  };

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const toggleAll = (checked?: boolean) => {
    setItems((prev) => {
      const targetChecked = checked !== undefined ? checked : !prev.every((i) => i.checked);
      return prev.map((i) => ({ ...i, checked: targetChecked }));
    });
  };

  const clearCart = () => {
    setItems([]);
    setDirectCheckoutItem(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(DIRECT_KEY);
    } catch {
      // ignore
    }
  };

  const clearCheckedItems = () => {
    if (directCheckoutItem) {
      setDirectCheckoutItem(null);
      sessionStorage.removeItem(DIRECT_KEY);
      return;
    }
    setItems((prev) => prev.filter((i) => !i.checked));
  };

  const getCheckoutItems = (): CartItem[] => {
    if (directCheckoutItem) {
      return [directCheckoutItem];
    }
    try {
      const savedDirect = sessionStorage.getItem(DIRECT_KEY);
      if (savedDirect) {
        return [JSON.parse(savedDirect)];
      }
    } catch {
      // ignore
    }
    const checked = items.filter((i) => i.checked);
    return checked.length > 0 ? checked : items;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        toast,
        addToCart,
        buyNow,
        removeFromCart,
        updateQty,
        toggleCheck,
        toggleAll,
        clearCart,
        clearCheckedItems,
        getCheckoutItems,
        directCheckoutItem,
        setDirectCheckoutItem,
        closeToast,
      }}
    >
      {children}

      {/* Floating Cart Toast Component */}
      {toast && toast.visible && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1714] text-white p-4 rounded-2xl shadow-2xl border border-[#C9A227]/40 flex items-center gap-3.5 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          {toast.item?.image && (
            <img
              src={toast.item.image}
              alt=""
              className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0 bg-white/5"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-[#C9A227] font-semibold">
              <span>✓ Berhasil Masuk Keranjang</span>
            </div>
            <p className="text-xs text-white/90 font-medium truncate mt-0.5">
              {toast.item?.name || toast.message}
            </p>
            {toast.item?.variant && (
              <p className="text-[10px] text-white/50">{toast.item.variant} · x{toast.item.qty}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/cart"
              onClick={closeToast}
              className="bg-[#C9A227] hover:bg-[#B38F1E] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <span>Keranjang</span>
              <span>🛒</span>
            </a>
            <button
              onClick={closeToast}
              className="text-white/40 hover:text-white text-lg leading-none p-1 transition-colors cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
