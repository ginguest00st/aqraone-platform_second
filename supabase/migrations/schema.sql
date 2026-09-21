-- ==============================================================================
-- SISTEM INFORMASI MARKETPLACE UMKM (AQRAPANA / AQRAONE)
-- Database Migration: schema.sql
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'UMKM', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE umkm_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE general_status AS ENUM ('AKTIF', 'NONAKTIF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_status AS ENUM ('AKTIF', 'NONAKTIF', 'DRAFT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. HELPER FUNCTION: TRIGGER UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. MASTER & PROFILE TABLES
-- ==============================================================================

-- 4.1 Profiles (Sinkron dengan auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    no_hp TEXT,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    jenis_kelamin TEXT CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')),
    tanggal_lahir DATE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2 Kategori UMKM (Bidang Usaha Toko)
CREATE TABLE IF NOT EXISTS public.kategori_umkm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_kategori TEXT UNIQUE NOT NULL,
    deskripsi TEXT,
    icon TEXT,
    status general_status NOT NULL DEFAULT 'AKTIF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.3 Kategori Produk (Klasifikasi Barang)
CREATE TABLE IF NOT EXISTS public.kategori_produk (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_kategori TEXT UNIQUE NOT NULL,
    deskripsi TEXT,
    icon TEXT,
    status general_status NOT NULL DEFAULT 'AKTIF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.4 UMKM (Profil Toko & Legalitas)
CREATE TABLE IF NOT EXISTS public.umkm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    kode_umkm TEXT UNIQUE NOT NULL,
    nama_umkm TEXT NOT NULL,
    nama_toko TEXT NOT NULL,
    email TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    alamat TEXT NOT NULL,
    deskripsi TEXT,
    kategori_umkm_id UUID REFERENCES public.kategori_umkm(id) ON DELETE SET NULL,
    status_verifikasi umkm_status NOT NULL DEFAULT 'PENDING',
    catatan_verifikasi TEXT,
    logo_url TEXT,
    dokumen_url TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.5 Alamat Pengiriman Customer
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nama_penerima TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    alamat_lengkap TEXT NOT NULL,
    kota TEXT NOT NULL,
    provinsi TEXT NOT NULL,
    kode_pos TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. PRODUK, VARIAN, & STOK
-- ==============================================================================

-- 5.1 Produk
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    umkm_id UUID NOT NULL REFERENCES public.umkm(id) ON DELETE CASCADE,
    kategori_produk_id UUID REFERENCES public.kategori_produk(id) ON DELETE SET NULL,
    nama_produk TEXT NOT NULL,
    deskripsi TEXT,
    gambar_url TEXT,
    status product_status NOT NULL DEFAULT 'AKTIF',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5.2 Varian Produk
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    nama_varian TEXT NOT NULL,
    harga BIGINT NOT NULL CHECK (harga >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5.3 Level Stok (Tabel Stok Terpisah sesuai PDM)
CREATE TABLE IF NOT EXISTS public.stock_levels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    varian_id UUID UNIQUE NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    jumlah_stok INTEGER NOT NULL DEFAULT 0 CHECK (jumlah_stok >= 0),
    sisa_stok INTEGER NOT NULL DEFAULT 0 CHECK (sisa_stok >= 0),
    min_stok INTEGER NOT NULL DEFAULT 5 CHECK (min_stok >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. KERANJANG BELANJA (CART)
-- ==============================================================================

-- 6.1 Carts (1 Cart per Customer)
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6.2 Cart Items (Dapat menampung barang dari beberapa UMKM)
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    varian_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, varian_id)
);

-- ==============================================================================
-- 7. PEMBAYARAN, PESANAN (MULTI-MERCHANT SPLIT), & DETAIL PESANAN
-- ==============================================================================

-- 7.1 Pembayaran (Unified Payment - 1 proses bayar untuk N orders)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    payment_reference TEXT UNIQUE, -- Referensi dari Finnet
    payment_method TEXT NOT NULL, -- e.g. 'FINNET_VA', 'FINNET_QRIS', dll.
    amount BIGINT NOT NULL CHECK (amount > 0),
    payment_url TEXT,
    va_number TEXT,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    expired_at TIMESTAMPTZ,
    callback_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7.2 Pesanan (Order dipecah per UMKM, terhubung ke 1 Payment)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. 'ORD-20260917-UMKM1-001'
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    umkm_id UUID NOT NULL REFERENCES public.umkm(id) ON DELETE RESTRICT,
    alamat_id UUID NOT NULL REFERENCES public.addresses(id) ON DELETE RESTRICT,
    total_harga BIGINT NOT NULL CHECK (total_harga >= 0),
    ongkir BIGINT NOT NULL DEFAULT 0 CHECK (ongkir >= 0),
    status_order order_status NOT NULL DEFAULT 'PENDING',
    catatan TEXT,
    resi_pengiriman TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7.3 Detail Pesanan (Item dalam pesanan toko tersebut)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    varian_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    harga BIGINT NOT NULL CHECK (harga >= 0),
    subtotal BIGINT NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7.4 Log Callback Webhook Finnet (Audit Trail)
CREATE TABLE IF NOT EXISTS public.payment_callbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    payment_reference TEXT,
    raw_payload JSONB NOT NULL,
    signature_valid BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 8. LAPORAN & AUDIT
-- ==============================================================================

-- 8.1 Laporan Tergenerate
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jenis_laporan TEXT NOT NULL, -- 'PENJUALAN_UMKM', 'TRANSAKSI_PLATFORM', 'REKAP_UMKM'
    periode_awal DATE NOT NULL,
    periode_akhir DATE NOT NULL,
    nama_file TEXT NOT NULL,
    file_url TEXT NOT NULL,
    generated_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    umkm_id UUID REFERENCES public.umkm(id) ON DELETE CASCADE, -- NULL jika laporan milik Admin
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 9. TRIGGERS FOR UPDATED_AT
-- ==============================================================================
CREATE OR REPLACE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_kategori_umkm_updated_at BEFORE UPDATE ON public.kategori_umkm FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_kategori_produk_updated_at BEFORE UPDATE ON public.kategori_produk FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_umkm_updated_at BEFORE UPDATE ON public.umkm FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_addresses_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_stock_levels_updated_at BEFORE UPDATE ON public.stock_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_order_items_updated_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER trg_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 10. AUTH TRIGGER: AUTO-CREATE PROFILE ON SUPABASE SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nama, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'name', 'Pengguna Baru'),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CUSTOMER'::user_role)
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.profiles (id, email, nama, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'name', 'Pengguna Baru'),
        'CUSTOMER'::user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-confirm user emails automatically so customers and users can login immediately
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.email_confirmed_at = COALESCE(NEW.email_confirmed_at, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_auto_confirm_user ON auth.users;
CREATE TRIGGER trg_auto_confirm_user
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- ==============================================================================
-- 11. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_umkm_user_id ON public.umkm(user_id);
CREATE INDEX IF NOT EXISTS idx_umkm_status ON public.umkm(status_verifikasi);
CREATE INDEX IF NOT EXISTS idx_products_umkm_id ON public.products(umkm_id);
CREATE INDEX IF NOT EXISTS idx_products_kategori ON public.products(kategori_produk_id);
CREATE INDEX IF NOT EXISTS idx_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_stocks_variant_id ON public.stock_levels(varian_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON public.cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_umkm_id ON public.orders(umkm_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS di seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.umkm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_callbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if current user is ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
$$ LANGUAGE sql SECURITY DEFINER;

-- 12.1 Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by owner or admin" ON public.profiles;
CREATE POLICY "Public profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Enable insert for authenticated users and service role" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users and service role"
    ON public.profiles FOR INSERT
    WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 12.2 Kategori UMKM & Produk
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.kategori_umkm;
CREATE POLICY "Anyone can view active categories"
    ON public.kategori_umkm FOR SELECT USING (status = 'AKTIF' OR public.is_admin());

DROP POLICY IF EXISTS "Admin manages kategori umkm" ON public.kategori_umkm;
CREATE POLICY "Admin manages kategori umkm"
    ON public.kategori_umkm FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view active product categories" ON public.kategori_produk;
CREATE POLICY "Anyone can view active product categories"
    ON public.kategori_produk FOR SELECT USING (status = 'AKTIF' OR public.is_admin());

DROP POLICY IF EXISTS "Admin manages kategori produk" ON public.kategori_produk;
CREATE POLICY "Admin manages kategori produk"
    ON public.kategori_produk FOR ALL USING (public.is_admin());

-- 12.3 UMKM
DROP POLICY IF EXISTS "Anyone can view approved UMKM" ON public.umkm;
CREATE POLICY "Anyone can view approved UMKM"
    ON public.umkm FOR SELECT
    USING (status_verifikasi = 'APPROVED' OR user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "UMKM user can insert own store profile" ON public.umkm;
CREATE POLICY "UMKM user can insert own store profile"
    ON public.umkm FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "UMKM owner can update own store" ON public.umkm;
CREATE POLICY "UMKM owner can update own store"
    ON public.umkm FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- 12.4 Addresses
DROP POLICY IF EXISTS "Customer manages own addresses" ON public.addresses;
CREATE POLICY "Customer manages own addresses"
    ON public.addresses FOR ALL
    USING (auth.uid() = customer_id);

-- 12.5 Products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (status = 'AKTIF' OR EXISTS (
        SELECT 1 FROM public.umkm WHERE umkm.id = products.umkm_id AND umkm.user_id = auth.uid()
    ) OR public.is_admin());

DROP POLICY IF EXISTS "UMKM can manage own products" ON public.products;
CREATE POLICY "UMKM can manage own products"
    ON public.products FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.umkm WHERE umkm.id = products.umkm_id AND umkm.user_id = auth.uid()
    ) OR public.is_admin());

-- 12.6 Product Variants & Stock Levels
DROP POLICY IF EXISTS "Public can view variants of active products" ON public.product_variants;
CREATE POLICY "Public can view variants of active products"
    ON public.product_variants FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "UMKM can manage own variants" ON public.product_variants;
CREATE POLICY "UMKM can manage own variants"
    ON public.product_variants FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.products p
        JOIN public.umkm u ON u.id = p.umkm_id
        WHERE p.id = product_variants.product_id AND u.user_id = auth.uid()
    ) OR public.is_admin());

DROP POLICY IF EXISTS "Public can view stock levels" ON public.stock_levels;
CREATE POLICY "Public can view stock levels"
    ON public.stock_levels FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "UMKM can manage own stock levels" ON public.stock_levels;
CREATE POLICY "UMKM can manage own stock levels"
    ON public.stock_levels FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.product_variants pv
        JOIN public.products p ON p.id = pv.product_id
        JOIN public.umkm u ON u.id = p.umkm_id
        WHERE pv.id = stock_levels.varian_id AND u.user_id = auth.uid()
    ) OR public.is_admin());

-- 12.7 Carts & Cart Items
DROP POLICY IF EXISTS "Customer manages own cart" ON public.carts;
CREATE POLICY "Customer manages own cart"
    ON public.carts FOR ALL USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customer manages own cart items" ON public.cart_items;
CREATE POLICY "Customer manages own cart items"
    ON public.cart_items FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.customer_id = auth.uid()
    ));

-- 12.8 Payments
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = customer_id OR public.is_admin());

-- 12.9 Orders
DROP POLICY IF EXISTS "Customer can view own orders" ON public.orders;
CREATE POLICY "Customer can view own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = customer_id OR public.is_admin() OR EXISTS (
        SELECT 1 FROM public.umkm u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "UMKM can update order status of own store" ON public.orders;
CREATE POLICY "UMKM can update order status of own store"
    ON public.orders FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.umkm u WHERE u.id = orders.umkm_id AND u.user_id = auth.uid()
    ) OR public.is_admin());

-- 12.10 Order Items
DROP POLICY IF EXISTS "Users can view relevant order items" ON public.order_items;
CREATE POLICY "Users can view relevant order items"
    ON public.order_items FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND (
            o.customer_id = auth.uid() OR public.is_admin() OR EXISTS (
                SELECT 1 FROM public.umkm u WHERE u.id = o.umkm_id AND u.user_id = auth.uid()
            )
        )
    ));

-- 12.11 Payment Callbacks (Audit Log)
DROP POLICY IF EXISTS "Only admin can view callbacks" ON public.payment_callbacks;
CREATE POLICY "Only admin can view callbacks"
    ON public.payment_callbacks FOR SELECT USING (public.is_admin());

-- 12.12 Reports
DROP POLICY IF EXISTS "View reports based on ownership" ON public.reports;
CREATE POLICY "View reports based on ownership"
    ON public.reports FOR SELECT
    USING (public.is_admin() OR (umkm_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.umkm u WHERE u.id = reports.umkm_id AND u.user_id = auth.uid()
    )));

-- ==============================================================================
-- 13. KEAMANAN LEVEL DATABASE (ANTI-PRIVILEGE ESCALATION TRIGGERS)
-- ==============================================================================

-- 13.1 Cegah pengguna non-admin mengubah role dirinya sendiri
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Keamanan: Pengguna tidak diizinkan mengubah role akun sendiri!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_prevent_role_change
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.prevent_role_change();

-- 13.2 Cegah pemilik UMKM mengubah status_verifikasi sendiri
CREATE OR REPLACE FUNCTION public.prevent_umkm_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_verifikasi IS DISTINCT FROM OLD.status_verifikasi AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Keamanan: Hanya admin yang berhak memverifikasi atau mengubah status toko UMKM!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_prevent_umkm_status_change
    BEFORE UPDATE ON public.umkm
    FOR EACH ROW EXECUTE FUNCTION public.prevent_umkm_status_change();

-- ==============================================================================
-- 14. SEED DATA AWAL (MASTER KATEGORI)
-- ==============================================================================

-- 14.1 Kategori UMKM (Bidang Usaha Toko)
INSERT INTO public.kategori_umkm (nama_kategori, deskripsi, icon, status)
VALUES
    ('Kuliner', 'Usaha makanan dan minuman olahan siap saji', '🍱', 'AKTIF'),
    ('Fashion & Pakaian', 'Pakaian, tekstil, batik, dan busana muslim', '👗', 'AKTIF'),
    ('Kerajinan Tangan', 'Kriya kayu, anyaman bambu, kulit, dan perak', '🪆', 'AKTIF'),
    ('Jasa Kreatif & Reparasi', 'Jasa sablon, desain, jahit, dan service', '🛠️', 'AKTIF'),
    ('Kecantikan & Herbal', 'Produk skincare herbal, jamu, dan kosmetik lokal', '💄', 'AKTIF'),
    ('Pertanian & Agrobisnis', 'Hasil bumi, kopi, rempah-rempah, dan hidroponik', '🌿', 'AKTIF'),
    ('Elektronik & Gadget', 'Aksesoris elektronik dan perkakas rumah tangga', '📱', 'AKTIF'),
    ('Pariwisata & Oleh-Oleh', 'Souvenir khas daerah dan pusat cinderamata', '🎁', 'AKTIF')
ON CONFLICT (nama_kategori) DO NOTHING;

-- 14.2 Kategori Produk (Klasifikasi Barang Dagangan)
INSERT INTO public.kategori_produk (nama_kategori, deskripsi, icon, status)
VALUES
    ('Makanan Ringan', 'Keripik, biskuit, kue kering, dan snack olahan', '🍿', 'AKTIF'),
    ('Minuman', 'Kopi bubuk, sirup lokal, jamu kemasan, dan teh herbal', '🧃', 'AKTIF'),
    ('Pakaian & Busana', 'Kaos, kemeja, gamis, batik, dan celana', '👕', 'AKTIF'),
    ('Aksesoris & Perhiasan', 'Gelang, kalung, tas rajut, dompet, dan topi', '👜', 'AKTIF'),
    ('Kerajinan & Dekorasi', 'Pajangan kayu, gerabah, ukiran, dan alat rumah tangga', '🏺', 'AKTIF'),
    ('Perawatan & Kosmetik', 'Sabun organik, minyak aromaterapi, dan lulur', '🧴', 'AKTIF'),
    ('Produk Olahan Lokal', 'Sambal kemasan, abon, dodol, dan bumbu instan', '🌶️', 'AKTIF'),
    ('Souvenir & Cinderamata', 'Gantungan kunci, plakat, dan merchandise wisata', '🛍️', 'AKTIF')
ON CONFLICT (nama_kategori) DO NOTHING;

