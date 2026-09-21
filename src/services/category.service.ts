import { supabase } from "../lib/supabase";
import type { KategoriProduk, KategoriUmkm, GeneralStatus } from "../types/database.types";

export interface CategoryPayload {
  nama_kategori: string;
  deskripsi?: string | null;
  icon?: string | null;
  status: GeneralStatus;
}

export const categoryService = {
  // --- Kategori Produk ---
  async getKategoriProduk(): Promise<{ data: KategoriProduk[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("kategori_produk")
        .select("*")
        .order("nama_kategori", { ascending: true });

      if (error) throw error;
      return { data: (data as KategoriProduk[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  async createKategoriProduk(payload: CategoryPayload): Promise<{ data: KategoriProduk | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("kategori_produk") as any)
        .insert([{
          nama_kategori: payload.nama_kategori.trim(),
          deskripsi: payload.deskripsi?.trim() || null,
          icon: payload.icon?.trim() || "📦",
          status: payload.status,
        }])
        .select()
        .single();

      if (error) throw error;
      return { data: data as KategoriProduk, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  async updateKategoriProduk(id: string, payload: Partial<CategoryPayload>): Promise<{ data: KategoriProduk | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("kategori_produk") as any)
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as KategoriProduk, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  async deleteKategoriProduk(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from("kategori_produk")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },

  // --- Kategori UMKM ---
  async getKategoriUmkm(): Promise<{ data: KategoriUmkm[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("kategori_umkm")
        .select("*")
        .order("nama_kategori", { ascending: true });

      if (error) throw error;
      return { data: (data as KategoriUmkm[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  async createKategoriUmkm(payload: CategoryPayload): Promise<{ data: KategoriUmkm | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("kategori_umkm") as any)
        .insert([{
          nama_kategori: payload.nama_kategori.trim(),
          deskripsi: payload.deskripsi?.trim() || null,
          icon: payload.icon?.trim() || "🏪",
          status: payload.status,
        }])
        .select()
        .single();

      if (error) throw error;
      return { data: data as KategoriUmkm, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  async updateKategoriUmkm(id: string, payload: Partial<CategoryPayload>): Promise<{ data: KategoriUmkm | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("kategori_umkm") as any)
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as KategoriUmkm, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  async deleteKategoriUmkm(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from("kategori_umkm")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  },
};
