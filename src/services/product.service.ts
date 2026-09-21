import { supabase } from "../lib/supabase";
import type { Product, ProductVariant, StockLevel, ProductStatus } from "../types/database.types";

export interface VariantInput {
  nama_varian: string;
  harga: number;
  jumlah_stok: number;
  min_stok?: number;
}

export interface ProductInput {
  umkm_id: string;
  kategori_produk_id?: string | null;
  nama_produk: string;
  deskripsi?: string | null;
  gambar_url?: string | null;
  status?: ProductStatus;
  variants: VariantInput[];
}

export interface ProductDetail extends Product {
  kategori_produk?: {
    nama_kategori: string;
    icon: string | null;
  } | null;
  product_variants: Array<ProductVariant & {
    stock_levels: StockLevel | null;
  }>;
}

export interface ProductWithUmkm extends ProductDetail {
  umkm?: {
    id: string;
    nama_toko: string;
    nama_umkm: string;
  } | null;
}

export const productService = {
  // Ambil seluruh produk di platform (untuk Admin monitoring atau Marketplace)
  async getAllProducts(kategoriId?: string, search?: string): Promise<{ data: ProductWithUmkm[]; error: Error | null }> {
    try {
      let query = supabase
        .from("products")
        .select(`
          *,
          umkm (id, nama_toko, nama_umkm),
          kategori_produk (nama_kategori, icon),
          product_variants (
            *,
            stock_levels (*)
          )
        `)
        .order("created_at", { ascending: false });

      if (kategoriId) {
        query = query.eq("kategori_produk_id", kategoriId);
      }

      if (search && search.trim()) {
        query = query.ilike("nama_produk", `%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as unknown as ProductWithUmkm[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  // Ambil seluruh produk milik suatu toko UMKM
  async getProductsByUmkm(umkmId: string): Promise<{ data: ProductDetail[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          kategori_produk (nama_kategori, icon),
          product_variants (
            *,
            stock_levels (*)
          )
        `)
        .eq("umkm_id", umkmId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return { data: (data as unknown as ProductDetail[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  // Tambah produk baru beserta varian dan level stoknya
  async createProduct(input: ProductInput): Promise<{ data: Product | null; error: Error | null }> {
    try {
      // 1. Simpan induk produk
      const { data: prodData, error: prodErr } = await (supabase.from("products") as any)
        .insert([{
          umkm_id: input.umkm_id,
          kategori_produk_id: input.kategori_produk_id || null,
          nama_produk: input.nama_produk.trim(),
          deskripsi: input.deskripsi?.trim() || null,
          gambar_url: input.gambar_url || null,
          status: input.status || "AKTIF",
        }])
        .select()
        .single();

      if (prodErr || !prodData) throw prodErr || new Error("Gagal membuat produk");

      const createdProduct = prodData as Product;

      // 2. Simpan varian & stok
      if (input.variants && input.variants.length > 0) {
        for (const v of input.variants) {
          const { data: varData, error: varErr } = await (supabase.from("product_variants") as any)
            .insert([{
              product_id: createdProduct.id,
              nama_varian: v.nama_varian.trim() || "Default",
              harga: Math.max(0, Number(v.harga) || 0),
            }])
            .select()
            .single();

          if (varErr || !varData) throw varErr || new Error("Gagal membuat varian produk");

          // Simpan level stok untuk varian tersebut
          const { error: stockErr } = await (supabase.from("stock_levels") as any)
            .insert([{
              varian_id: varData.id,
              jumlah_stok: Math.max(0, Number(v.jumlah_stok) || 0),
              sisa_stok: Math.max(0, Number(v.jumlah_stok) || 0),
              min_stok: Math.max(0, Number(v.min_stok) || 5),
            }]);

          if (stockErr) throw stockErr;
        }
      }

      return { data: createdProduct, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  // Hapus produk (PostgreSQL CASCADE akan menghapus varian dan stok otomatis)
  async deleteProduct(productId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  // Update informasi dasar produk
  async updateProduct(
    productId: string,
    updates: Partial<Omit<Product, "id" | "umkm_id" | "created_at" | "updated_at">>
  ): Promise<{ data: Product | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("products") as any)
        .update(updates)
        .eq("id", productId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Product, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },
};
