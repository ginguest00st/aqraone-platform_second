// ==============================================================================
// DATABASE TYPE DEFINITIONS (AQRAONE MARKETPLACE)
// Target: Supabase PostgreSQL Schema
// ==============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'ADMIN' | 'UMKM' | 'CUSTOMER';
export type UmkmStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type GeneralStatus = 'AKTIF' | 'NONAKTIF';
export type ProductStatus = 'AKTIF' | 'NONAKTIF' | 'DRAFT';
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          nama: string;
          no_hp: string | null;
          role: UserRole;
          jenis_kelamin: string | null;
          tanggal_lahir: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          nama: string;
          no_hp?: string | null;
          role?: UserRole;
          jenis_kelamin?: string | null;
          tanggal_lahir?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          nama?: string;
          no_hp?: string | null;
          role?: UserRole;
          jenis_kelamin?: string | null;
          tanggal_lahir?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kategori_umkm: {
        Row: {
          id: string;
          nama_kategori: string;
          deskripsi: string | null;
          icon: string | null;
          status: GeneralStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama_kategori: string;
          deskripsi?: string | null;
          icon?: string | null;
          status?: GeneralStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama_kategori?: string;
          deskripsi?: string | null;
          icon?: string | null;
          status?: GeneralStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      kategori_produk: {
        Row: {
          id: string;
          nama_kategori: string;
          deskripsi: string | null;
          icon: string | null;
          status: GeneralStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nama_kategori: string;
          deskripsi?: string | null;
          icon?: string | null;
          status?: GeneralStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nama_kategori?: string;
          deskripsi?: string | null;
          icon?: string | null;
          status?: GeneralStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      umkm: {
        Row: {
          id: string;
          user_id: string;
          kode_umkm: string;
          nama_umkm: string;
          nama_toko: string;
          email: string;
          no_hp: string;
          alamat: string;
          deskripsi: string | null;
          kategori_umkm_id: string | null;
          status_verifikasi: UmkmStatus;
          catatan_verifikasi: string | null;
          logo_url: string | null;
          dokumen_url: string | null;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kode_umkm: string;
          nama_umkm: string;
          nama_toko: string;
          email: string;
          no_hp: string;
          alamat: string;
          deskripsi?: string | null;
          kategori_umkm_id?: string | null;
          status_verifikasi?: UmkmStatus;
          catatan_verifikasi?: string | null;
          logo_url?: string | null;
          dokumen_url?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kode_umkm?: string;
          nama_umkm?: string;
          nama_toko?: string;
          email?: string;
          no_hp?: string;
          alamat?: string;
          deskripsi?: string | null;
          kategori_umkm_id?: string | null;
          status_verifikasi?: UmkmStatus;
          catatan_verifikasi?: string | null;
          logo_url?: string | null;
          dokumen_url?: string | null;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          nama_penerima: string;
          no_hp: string;
          alamat_lengkap: string;
          kota: string;
          provinsi: string;
          kode_pos: string;
          is_primary: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          nama_penerima: string;
          no_hp: string;
          alamat_lengkap: string;
          kota: string;
          provinsi: string;
          kode_pos: string;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          nama_penerima?: string;
          no_hp?: string;
          alamat_lengkap?: string;
          kota?: string;
          provinsi?: string;
          kode_pos?: string;
          is_primary?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          umkm_id: string;
          kategori_produk_id: string | null;
          nama_produk: string;
          deskripsi: string | null;
          gambar_url: string | null;
          status: ProductStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          umkm_id: string;
          kategori_produk_id?: string | null;
          nama_produk: string;
          deskripsi?: string | null;
          gambar_url?: string | null;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          umkm_id?: string;
          kategori_produk_id?: string | null;
          nama_produk?: string;
          deskripsi?: string | null;
          gambar_url?: string | null;
          status?: ProductStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          nama_varian: string;
          harga: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          nama_varian: string;
          harga: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          nama_varian?: string;
          harga?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      stock_levels: {
        Row: {
          id: string;
          varian_id: string;
          jumlah_stok: number;
          sisa_stok: number;
          min_stok: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          varian_id: string;
          jumlah_stok?: number;
          sisa_stok?: number;
          min_stok?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          varian_id?: string;
          jumlah_stok?: number;
          sisa_stok?: number;
          min_stok?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          id: string;
          customer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          cart_id: string;
          varian_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cart_id: string;
          varian_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cart_id?: string;
          varian_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          customer_id: string;
          payment_reference: string | null;
          payment_method: string;
          amount: number;
          payment_url: string | null;
          va_number: string | null;
          payment_status: PaymentStatus;
          paid_at: string | null;
          expired_at: string | null;
          callback_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          payment_reference?: string | null;
          payment_method: string;
          amount: number;
          payment_url?: string | null;
          va_number?: string | null;
          payment_status?: PaymentStatus;
          paid_at?: string | null;
          expired_at?: string | null;
          callback_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          payment_reference?: string | null;
          payment_method?: string;
          amount?: number;
          payment_url?: string | null;
          va_number?: string | null;
          payment_status?: PaymentStatus;
          paid_at?: string | null;
          expired_at?: string | null;
          callback_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          payment_id: string;
          customer_id: string;
          umkm_id: string;
          alamat_id: string;
          total_harga: number;
          ongkir: number;
          status_order: OrderStatus;
          catatan: string | null;
          resi_pengiriman: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          payment_id: string;
          customer_id: string;
          umkm_id: string;
          alamat_id: string;
          total_harga: number;
          ongkir?: number;
          status_order?: OrderStatus;
          catatan?: string | null;
          resi_pengiriman?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          payment_id?: string;
          customer_id?: string;
          umkm_id?: string;
          alamat_id?: string;
          total_harga?: number;
          ongkir?: number;
          status_order?: OrderStatus;
          catatan?: string | null;
          resi_pengiriman?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          varian_id: string;
          quantity: number;
          harga: number;
          subtotal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          varian_id: string;
          quantity: number;
          harga: number;
          subtotal: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          varian_id?: string;
          quantity?: number;
          harga?: number;
          subtotal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_callbacks: {
        Row: {
          id: string;
          payment_id: string | null;
          payment_reference: string | null;
          raw_payload: Json;
          signature_valid: boolean;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id?: string | null;
          payment_reference?: string | null;
          raw_payload: Json;
          signature_valid?: boolean;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string | null;
          payment_reference?: string | null;
          raw_payload?: Json;
          signature_valid?: boolean;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          jenis_laporan: string;
          periode_awal: string;
          periode_akhir: string;
          nama_file: string;
          file_url: string;
          generated_by: string;
          umkm_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          jenis_laporan: string;
          periode_awal: string;
          periode_akhir: string;
          nama_file: string;
          file_url: string;
          generated_by: string;
          umkm_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          jenis_laporan?: string;
          periode_awal?: string;
          periode_akhir?: string;
          nama_file?: string;
          file_url?: string;
          generated_by?: string;
          umkm_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience Type Aliases
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type KategoriUmkm = Database['public']['Tables']['kategori_umkm']['Row'];
export type KategoriProduk = Database['public']['Tables']['kategori_produk']['Row'];
export type Umkm = Database['public']['Tables']['umkm']['Row'];
export type Address = Database['public']['Tables']['addresses']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
export type StockLevel = Database['public']['Tables']['stock_levels']['Row'];
export type Cart = Database['public']['Tables']['carts']['Row'];
export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type PaymentCallback = Database['public']['Tables']['payment_callbacks']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
