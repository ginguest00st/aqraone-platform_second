-- ==============================================================================
-- SEED DATA: TRANSAKSI & LAPORAN AQRAONE MARKETPLACE
-- Jalankan query ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vjvwtlckhdhygpyplrtp/editor
-- ==============================================================================

-- 1. Tambahkan Policy RLS agar payments, orders, order_items & reports dapat di-insert/update
DROP POLICY IF EXISTS "Enable insert for payments" ON public.payments;
CREATE POLICY "Enable insert for payments" ON public.payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for payments" ON public.payments;
CREATE POLICY "Enable update for payments" ON public.payments FOR UPDATE USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "Enable insert for orders" ON public.orders;
CREATE POLICY "Enable insert for orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for order_items" ON public.order_items;
CREATE POLICY "Enable insert for order_items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert for reports" ON public.reports;
CREATE POLICY "Enable insert for reports" ON public.reports FOR INSERT WITH CHECK (true);

-- Bersihkan data lama jika ada
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.payments;
DELETE FROM public.addresses;
DELETE FROM public.reports;

-- 2. Insert Alamat Customer & Transaksi
DO $$ 
DECLARE
  addr_andi UUID;
  addr_siti UUID;
  pay_id UUID;
  ord_id UUID;
BEGIN
  -- Insert Alamat Customer 1 (Andi Pratama)
  INSERT INTO public.addresses (id, customer_id, nama_penerima, no_hp, alamat_lengkap, kota, provinsi, kode_pos, is_primary)
  VALUES (gen_random_uuid(), 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', 'Andi Pratama', '081234567890', 'Jl. Kemang Raya No. 18B, RT 04/RW 02, Bangka, Mampang Prapatan', 'Jakarta Selatan', 'DKI Jakarta', '12730', true)
  RETURNING id INTO addr_andi;

  -- Insert Alamat Customer 2 (Siti Rahayu)
  INSERT INTO public.addresses (id, customer_id, nama_penerima, no_hp, alamat_lengkap, kota, provinsi, kode_pos, is_primary)
  VALUES (gen_random_uuid(), '784450c7-17c3-47a3-8afa-af89ae260a4f', 'Siti Rahayu', '085712345678', 'Jl. Dago Asri No. 42, Kel. Dago, Kec. Coblong', 'Bandung', 'Jawa Barat', '40135', true)
  RETURNING id INTO addr_siti;

  -- Transaksi 1: ORD-20260920-MULYA-001
  INSERT INTO public.payments (id, customer_id, payment_reference, payment_method, amount, payment_status, paid_at, created_at)
  VALUES (gen_random_uuid(), 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', 'FIN-20260922-001', 'FINNET_QRIS', 116000, 'PAID', '2026-09-20 10:15:00+07', '2026-09-20 10:15:00+07')
  RETURNING id INTO pay_id;

  INSERT INTO public.orders (id, order_number, payment_id, customer_id, umkm_id, alamat_id, total_harga, ongkir, status_order, resi_pengiriman, created_at)
  VALUES (gen_random_uuid(), 'ORD-20260920-MULYA-001', pay_id, 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', '30bd5699-eb1f-4d8e-922a-a3b074fbe3f6', addr_andi, 116000, 12000, 'COMPLETED', 'JNE-REG-290192839', '2026-09-20 10:15:00+07')
  RETURNING id INTO ord_id;

  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, 'b10a165a-5add-444e-960f-7dead7c4b254', 2, 25000, 50000, '2026-09-20 10:15:00+07');
  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, 'ebaa51a9-9049-4a6b-89ee-4080c48717e5', 3, 18000, 54000, '2026-09-20 10:15:00+07');

  -- Transaksi 2: ORD-20260921-MULYA-002
  INSERT INTO public.payments (id, customer_id, payment_reference, payment_method, amount, payment_status, paid_at, created_at)
  VALUES (gen_random_uuid(), '784450c7-17c3-47a3-8afa-af89ae260a4f', 'FIN-20260922-002', 'FINNET_VA_BCA', 80000, 'PAID', '2026-09-21 14:30:00+07', '2026-09-21 14:30:00+07')
  RETURNING id INTO pay_id;

  INSERT INTO public.orders (id, order_number, payment_id, customer_id, umkm_id, alamat_id, total_harga, ongkir, status_order, resi_pengiriman, created_at)
  VALUES (gen_random_uuid(), 'ORD-20260921-MULYA-002', pay_id, '784450c7-17c3-47a3-8afa-af89ae260a4f', '30bd5699-eb1f-4d8e-922a-a3b074fbe3f6', addr_siti, 80000, 10000, 'SHIPPED', 'SICEPAT-009823411', '2026-09-21 14:30:00+07')
  RETURNING id INTO ord_id;

  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, 'a0f80f93-87a7-4fc2-a072-07063c9d000c', 1, 45000, 45000, '2026-09-21 14:30:00+07');
  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, 'b10a165a-5add-444e-960f-7dead7c4b254', 1, 25000, 25000, '2026-09-21 14:30:00+07');

  -- Transaksi 3: ORD-20260921-BATIK-003
  INSERT INTO public.payments (id, customer_id, payment_reference, payment_method, amount, payment_status, paid_at, created_at)
  VALUES (gen_random_uuid(), 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', 'FIN-20260922-003', 'FINNET_VA_BRI', 203000, 'PAID', '2026-09-21 16:45:00+07', '2026-09-21 16:45:00+07')
  RETURNING id INTO pay_id;

  INSERT INTO public.orders (id, order_number, payment_id, customer_id, umkm_id, alamat_id, total_harga, ongkir, status_order, resi_pengiriman, created_at)
  VALUES (gen_random_uuid(), 'ORD-20260921-BATIK-003', pay_id, 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', 'c35c1bff-7eb9-4977-be68-c706f1aa7ea4', addr_andi, 203000, 18000, 'PROCESSING', NULL, '2026-09-21 16:45:00+07')
  RETURNING id INTO ord_id;

  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, '529497c0-aa7b-45b5-80d0-9910996298e7', 1, 185000, 185000, '2026-09-21 16:45:00+07');

  -- Transaksi 4: ORD-20260922-GAYO-004
  INSERT INTO public.payments (id, customer_id, payment_reference, payment_method, amount, payment_status, paid_at, created_at)
  VALUES (gen_random_uuid(), '784450c7-17c3-47a3-8afa-af89ae260a4f', 'FIN-20260922-004', 'FINNET_QRIS', 174000, 'PAID', '2026-09-22 09:20:00+07', '2026-09-22 09:20:00+07')
  RETURNING id INTO pay_id;

  INSERT INTO public.orders (id, order_number, payment_id, customer_id, umkm_id, alamat_id, total_harga, ongkir, status_order, resi_pengiriman, created_at)
  VALUES (gen_random_uuid(), 'ORD-20260922-GAYO-004', pay_id, '784450c7-17c3-47a3-8afa-af89ae260a4f', '521604ef-2b0e-4a0e-87f3-50bacb2477bc', addr_siti, 174000, 24000, 'COMPLETED', 'JNT-EXP-889923145', '2026-09-22 09:20:00+07')
  RETURNING id INTO ord_id;

  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, '10b82795-43fe-4ab3-b083-8aa57cf1dc0d', 2, 75000, 150000, '2026-09-22 09:20:00+07');

  -- Transaksi 5: ORD-20260922-RATTAN-005
  INSERT INTO public.payments (id, customer_id, payment_reference, payment_method, amount, payment_status, paid_at, created_at)
  VALUES (gen_random_uuid(), 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', 'FIN-20260922-005', 'FINNET_VA_MANDIRI', 167000, 'PENDING', NULL, '2026-09-22 15:10:00+07')
  RETURNING id INTO pay_id;

  INSERT INTO public.orders (id, order_number, payment_id, customer_id, umkm_id, alamat_id, total_harga, ongkir, status_order, resi_pengiriman, created_at)
  VALUES (gen_random_uuid(), 'ORD-20260922-RATTAN-005', pay_id, 'baa1f7c0-2223-45bb-9b49-9398af9dbda7', '820a1035-6cf3-42de-9b49-882b4f5b939e', addr_andi, 167000, 32000, 'PENDING', NULL, '2026-09-22 15:10:00+07')
  RETURNING id INTO ord_id;

  INSERT INTO public.order_items (order_id, varian_id, quantity, harga, subtotal, created_at)
  VALUES (ord_id, '94e75d3d-6879-4a9d-8135-005d8724be79', 1, 135000, 135000, '2026-09-22 15:10:00+07');

  -- 3. Insert Laporan / Reports Platform & UMKM
  INSERT INTO public.reports (id, jenis_laporan, periode_awal, periode_akhir, nama_file, file_url, generated_by, umkm_id, created_at)
  VALUES
    (gen_random_uuid(), 'PENJUALAN_UMKM', '2026-09-01', '2026-09-22', 'Laporan_Penjualan_MulyaStore_Sep2026.pdf', 'https://vjvwtlckhdhygpyplrtp.supabase.co/storage/v1/object/public/reports/mulya_sep2026.pdf', 'c9b4f703-8907-447f-a652-b40dce05ac9c', '30bd5699-eb1f-4d8e-922a-a3b074fbe3f6', NOW()),
    (gen_random_uuid(), 'TRANSAKSI_PLATFORM', '2026-09-01', '2026-09-22', 'Rekap_Transaksi_Platform_Q3_2026.xlsx', 'https://vjvwtlckhdhygpyplrtp.supabase.co/storage/v1/object/public/reports/platform_q3_2026.xlsx', 'c9b4f703-8907-447f-a652-b40dce05ac9c', NULL, NOW()),
    (gen_random_uuid(), 'REKAP_UMKM', '2026-08-01', '2026-09-22', 'Laporan_Pertumbuhan_Mitra_UMKM_2026.pdf', 'https://vjvwtlckhdhygpyplrtp.supabase.co/storage/v1/object/public/reports/mitra_umkm_2026.pdf', 'c9b4f703-8907-447f-a652-b40dce05ac9c', NULL, NOW()),
    (gen_random_uuid(), 'PENJUALAN_UMKM', '2026-09-01', '2026-09-22', 'Laporan_Penjualan_BatikDanar_Sep2026.pdf', 'https://vjvwtlckhdhygpyplrtp.supabase.co/storage/v1/object/public/reports/batik_sep2026.pdf', 'c9b4f703-8907-447f-a652-b40dce05ac9c', 'c35c1bff-7eb9-4977-be68-c706f1aa7ea4', NOW()),
    (gen_random_uuid(), 'PENJUALAN_UMKM', '2026-09-01', '2026-09-22', 'Laporan_Penjualan_GayoCoffee_Sep2026.pdf', 'https://vjvwtlckhdhygpyplrtp.supabase.co/storage/v1/object/public/reports/gayo_sep2026.pdf', 'c9b4f703-8907-447f-a652-b40dce05ac9c', '521604ef-2b0e-4a0e-87f3-50bacb2477bc', NOW());
END $$;

-- Cek hasil data transaksi & laporan
SELECT COUNT(*) AS total_addresses FROM public.addresses;
SELECT COUNT(*) AS total_orders FROM public.orders;
SELECT COUNT(*) AS total_order_items FROM public.order_items;
SELECT COUNT(*) AS total_payments FROM public.payments;
SELECT COUNT(*) AS total_reports FROM public.reports;
