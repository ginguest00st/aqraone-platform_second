import { createClient } from "@supabase/supabase-js";
import { supabase, supabaseUrl, supabaseAnonKey } from "../lib/supabase";
import type { UserRole, Database } from "../types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface UserWithStore extends Profile {
  umkm?: {
    id: string;
    nama_toko: string;
    kode_umkm: string;
    status_verifikasi: string;
  } | null;
}

export interface UserStats {
  total: number;
  customer: number;
  umkm: number;
  admin: number;
}

export const userService = {
  /**
   * Mengambil daftar semua pengguna dengan filter role dan pencarian teks.
   */
  async getAllUsers(
    roleFilter: string = "ALL",
    search: string = ""
  ): Promise<{ data: UserWithStore[]; error: any }> {
    try {
      let query = supabase
        .from("profiles")
        .select(`
          *,
          umkm:umkm!umkm_user_id_fkey (
            id,
            nama_toko,
            kode_umkm,
            status_verifikasi
          )
        `)
        .order("created_at", { ascending: false });

      if (roleFilter && roleFilter !== "ALL") {
        query = query.eq("role", roleFilter);
      }

      if (search && search.trim() !== "") {
        const term = `%${search.trim()}%`;
        query = query.or(`nama.ilike.${term},email.ilike.${term},no_hp.ilike.${term}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Gagal memuat daftar pengguna:", error);
        return { data: [], error };
      }

      // Format umkm jika berupa array dari relasi Supabase
      const formatted: UserWithStore[] = (data || []).map((u: any) => {
        const store = Array.isArray(u.umkm) ? u.umkm[0] : u.umkm;
        return {
          ...u,
          umkm: store || null,
        };
      });

      return { data: formatted, error: null };
    } catch (err) {
      console.error("Kesalahan query user:", err);
      return { data: [], error: err };
    }
  },

  /**
   * Mengambil detail satu pengguna beserta profil toko jika UMKM.
   */
  async getUserById(id: string): Promise<{ data: UserWithStore | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          umkm:umkm!umkm_user_id_fkey (
            id,
            nama_toko,
            kode_umkm,
            status_verifikasi,
            alamat,
            deskripsi,
            no_hp
          )
        `)
        .eq("id", id)
        .single();

      if (error) return { data: null, error };

      const store = Array.isArray((data as any)?.umkm) ? (data as any).umkm[0] : (data as any)?.umkm;
      return {
        data: {
          ...(data as any),
          umkm: store || null,
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Menghitung statistik ringkasan pengguna berdasarkan role.
   */
  async getUserStats(): Promise<{ data: UserStats; error: any }> {
    try {
      const { data, error } = await (supabase.from("profiles") as any)
        .select("role");

      if (error) {
        return {
          data: { total: 0, customer: 0, umkm: 0, admin: 0 },
          error,
        };
      }

      const list: Array<{ role: string }> = (data as Array<{ role: string }>) || [];
      const stats: UserStats = {
        total: list.length,
        customer: list.filter((u) => u.role === "CUSTOMER").length,
        umkm: list.filter((u) => u.role === "UMKM").length,
        admin: list.filter((u) => u.role === "ADMIN").length,
      };

      return { data: stats, error: null };
    } catch (err) {
      return {
        data: { total: 0, customer: 0, umkm: 0, admin: 0 },
        error: err,
      };
    }
  },

  /**
   * Memperbarui role pengguna (Khusus ADMIN yang berhak).
   */
  async updateUserRole(id: string, newRole: UserRole): Promise<{ error: any }> {
    try {
      const { error } = await (supabase.from("profiles") as any)
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq("id", id);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Memperbarui informasi profil pengguna.
   */
  async updateUserProfile(
    id: string,
    updates: { nama?: string; no_hp?: string; jenis_kelamin?: string }
  ): Promise<{ error: any }> {
    try {
      const { error } = await (supabase.from("profiles") as any)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Menghapus profil pengguna dari tabel profiles (akan cascade ke UMKM/data terkait).
   */
  async deleteUser(id: string): Promise<{ error: any }> {
    try {
      const { error } = await (supabase.from("profiles") as any)
        .delete()
        .eq("id", id);

      return { error };
    } catch (err) {
      return { error: err };
    }
  },

  /**
   * Membuat pengguna baru dari panel admin.
   * Menggunakan client Supabase terpisah agar session admin tidak terganggu.
   */
  async createUser(data: {
    email: string;
    password: string;
    nama: string;
    role: UserRole;
    no_hp?: string;
  }): Promise<{ error: any }> {
    try {
      // Buat client terpisah agar signUp tidak menimpa session admin
      const tempClient = createClient(
        supabaseUrl || "https://placeholder.supabase.co",
        supabaseAnonKey || "placeholder-anon-key",
        { auth: { persistSession: false, autoRefreshToken: false } }
      );

      const { error: signUpError } = await tempClient.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          data: {
            nama: data.nama.trim(),
            role: data.role,
            no_hp: data.no_hp?.trim() || null,
          },
        },
      });

      if (signUpError) return { error: signUpError };
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  },
};
