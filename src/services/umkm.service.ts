import { supabase } from "../lib/supabase";
import type { Umkm, UmkmStatus } from "../types/database.types";

export interface UmkmWithCategory extends Umkm {
  kategori_umkm?: {
    nama_kategori: string;
    icon: string | null;
  } | null;
}

export const umkmService = {
  // Ambil profil UMKM berdasarkan user_id (pengguna yang sedang login)
  async getUmkmByUserId(userId: string): Promise<{ data: UmkmWithCategory | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("umkm")
        .select("*, kategori_umkm(nama_kategori, icon)")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return { data: (data as unknown as UmkmWithCategory) || null, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  // Ambil seluruh daftar UMKM untuk Admin (dengan filter status dan pencarian)
  async getAllUmkm(statusFilter?: string, search?: string): Promise<{ data: UmkmWithCategory[]; error: Error | null }> {
    try {
      let query = supabase
        .from("umkm")
        .select("*, kategori_umkm(nama_kategori, icon)")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "ALL") {
        query = query.eq("status_verifikasi", statusFilter as UmkmStatus);
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`nama_toko.ilike.${term},nama_umkm.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: (data as unknown as UmkmWithCategory[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  // Ambil UMKM yang berstatus PENDING untuk diverifikasi oleh Admin
  async getPendingUmkm(): Promise<{ data: UmkmWithCategory[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from("umkm")
        .select("*, kategori_umkm(nama_kategori, icon)")
        .eq("status_verifikasi", "PENDING")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return { data: (data as unknown as UmkmWithCategory[]) || [], error: null };
    } catch (err: unknown) {
      return { data: [], error: err as Error };
    }
  },

  // Verifikasi atau ubah status UMKM oleh Admin (Approve / Reject / Suspend)
  async verifyUmkm(
    umkmId: string,
    status: UmkmStatus,
    adminId: string,
    catatan?: string
  ): Promise<{ data: Umkm | null; error: Error | null }> {
    try {
      const updates: Record<string, unknown> = {
        status_verifikasi: status,
        verified_at: new Date().toISOString(),
        verified_by: adminId,
        catatan_verifikasi: catatan || null,
      };

      const { data, error } = await (supabase.from("umkm") as any)
        .update(updates)
        .eq("id", umkmId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Umkm, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },

  // Update profil toko oleh pemilik UMKM
  async updateUmkm(
    umkmId: string,
    updates: Partial<Omit<Umkm, "id" | "user_id" | "kode_umkm" | "status_verifikasi">>
  ): Promise<{ data: Umkm | null; error: Error | null }> {
    try {
      const { data, error } = await (supabase.from("umkm") as any)
        .update(updates)
        .eq("id", umkmId)
        .select()
        .single();

      if (error) throw error;
      return { data: data as Umkm, error: null };
    } catch (err: unknown) {
      return { data: null, error: err as Error };
    }
  },
};
