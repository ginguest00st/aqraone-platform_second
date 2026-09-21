import { useState } from "react";
import { Link } from "react-router";
import { Input, Select } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../app/contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const steps = ["Data Pemilik", "Data UMKM", "Dokumen", "Konfirmasi"];
const categories = [
  { value: "makanan", label: "Makanan" },
  { value: "minuman", label: "Minuman" },
  { value: "fashion", label: "Fashion" },
  { value: "kerajinan", label: "Kerajinan" },
  { value: "kecantikan", label: "Kecantikan" },
  { value: "elektronik", label: "Elektronik" },
  { value: "jasa", label: "Jasa" },
  { value: "lainnya", label: "Produk Lokal" },
];

export default function UMKMRegisterPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    namaPemilik: "",
    nik: "",
    noHp: "",
    email: "",
    password: "",
    alamat: "",
    namaToko: "",
    kategori: "makanan",
    deskripsi: "",
  });

  const updateField = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const next = () => {
    setErrorMsg(null);
    if (step === 0) {
      if (!formData.namaPemilik || !formData.email || !formData.password || !formData.noHp || !formData.alamat) {
        setErrorMsg("Harap lengkapi semua data wajib pada Data Pemilik.");
        return;
      }
      if (formData.password.length < 8) {
        setErrorMsg("Kata sandi minimal 8 karakter.");
        return;
      }
    } else if (step === 1) {
      if (!formData.namaToko || !formData.deskripsi) {
        setErrorMsg("Harap isi Nama Toko dan Deskripsi Usaha.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, 3));
  };

  const prev = () => {
    setErrorMsg(null);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!agree) {
      setErrorMsg("Anda harus menyetujui pernyataan kebenaran data dan Syarat & Ketentuan.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Buat akun Auth di Supabase
      const authRes = await register({
        email: formData.email.trim(),
        password: formData.password,
        nama: formData.namaPemilik.trim(),
        role: "UMKM",
        no_hp: formData.noHp.trim(),
      });

      if (authRes.error) {
        setErrorMsg(authRes.error.message || "Gagal membuat akun UMKM.");
        setLoading(false);
        return;
      }

      // 2. Simpan profil toko ke tabel public.umkm jika user terdaftar
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { error: storeError } = await (supabase.from("umkm") as any).insert([
          {
            user_id: userData.user.id,
            kode_umkm: "UMKM-" + Date.now().toString(36).toUpperCase(),
            nama_umkm: formData.namaPemilik.trim(),
            nama_toko: formData.namaToko.trim(),
            email: formData.email.trim(),
            no_hp: formData.noHp.trim(),
            alamat: formData.alamat.trim(),
            deskripsi: formData.deskripsi.trim(),
            status_verifikasi: "PENDING",
          }
        ]);

        if (storeError) {
          console.warn("Gagal menyimpan data toko ke tabel umkm:", storeError);
        }
      }

      setLoading(false);
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat pendaftaran";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-[#202020] mb-2">Menunggu Verifikasi Admin</h2>
          <p className="text-[#6B6B6B] mb-6">Data UMKM Anda ({formData.namaToko}) sedang direview oleh admin AqraOne. Proses verifikasi membutuhkan waktu 1–3 hari kerja.</p>
          <div className="bg-[#FFF5D6] border border-[#F4D77D] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-[#B8860B] mb-2">Apa yang akan terjadi selanjutnya?</p>
            <ul className="text-sm text-[#B8860B] space-y-1">
              <li>✓ Admin akan mereview data dan dokumen usaha Anda</li>
              <li>✓ Anda akan menerima pembaruan status pendaftaran</li>
              <li>✓ Setelah disetujui, toko Anda aktif dan dapat mengelola produk</li>
            </ul>
          </div>
          <Link to="/" className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8860B] transition-all inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-[#D4AF37] rounded-xl flex items-center justify-center"><span className="text-white font-bold">A</span></div>
            <span className="font-bold text-xl text-[#202020]">AqraOne</span>
          </Link>
          <h2 className="text-2xl font-bold text-[#202020]">Daftarkan UMKM Anda</h2>
          <p className="text-sm text-[#6B6B6B]">Lengkapi data berikut untuk mulai berjualan</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? "bg-[#2E8B57] text-white" : i === step ? "bg-[#D4AF37] text-white" : "bg-[#E5E5E5] text-[#6B6B6B]"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-xs font-medium hidden md:block ${i === step ? "text-[#D4AF37]" : "text-[#6B6B6B]"}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-[#2E8B57]" : "bg-[#E5E5E5]"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#202020] mb-4">Data Pemilik</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nama Pemilik"
                  placeholder="Nama lengkap sesuai KTP"
                  value={formData.namaPemilik}
                  onChange={e => updateField("namaPemilik", e.target.value)}
                  required
                />
                <Input
                  label="NIK (opsional)"
                  placeholder="16 digit NIK"
                  value={formData.nik}
                  onChange={e => updateField("nik", e.target.value)}
                />
                <Input
                  label="Nomor HP"
                  type="tel"
                  placeholder="+62 812..."
                  value={formData.noHp}
                  onChange={e => updateField("noHp", e.target.value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="email@toko.com"
                  value={formData.email}
                  onChange={e => updateField("email", e.target.value)}
                  required
                />
                <Input
                  label="Kata Sandi Akun"
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={e => updateField("password", e.target.value)}
                  className="md:col-span-2"
                  required
                />
                <Input
                  label="Alamat Lengkap"
                  placeholder="Alamat domisili atau tempat usaha"
                  value={formData.alamat}
                  onChange={e => updateField("alamat", e.target.value)}
                  className="md:col-span-2"
                  required
                />
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#202020] mb-4">Data UMKM</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nama Toko"
                  placeholder="Nama tokomu"
                  value={formData.namaToko}
                  onChange={e => updateField("namaToko", e.target.value)}
                  required
                />
                <Select
                  label="Kategori Usaha"
                  options={categories}
                  value={formData.kategori}
                  onChange={e => updateField("kategori", e.target.value)}
                />
                <Input
                  label="Deskripsi Usaha"
                  placeholder="Ceritakan tentang usahamu"
                  value={formData.deskripsi}
                  onChange={e => updateField("deskripsi", e.target.value)}
                  className="md:col-span-2"
                  required
                />
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#202020] mb-4">Upload Dokumen</h3>
              {[
                { label: "Logo Toko", desc: "Format JPG/PNG, max 2MB" },
                { label: "Dokumen Legalitas", desc: "KTP, SIUP, atau NIB" },
                { label: "Dokumen Pendukung", desc: "Foto produk atau usaha (opsional)" },
              ].map(doc => (
                <div key={doc.label} className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-5 text-center hover:border-[#D4AF37] transition-all cursor-pointer">
                  <div className="text-2xl mb-2">📁</div>
                  <p className="text-sm font-semibold text-[#202020]">{doc.label}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{doc.desc}</p>
                  <button type="button" className="mt-3 text-xs text-[#D4AF37] font-medium">Pilih File</button>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-[#202020] mb-4">Konfirmasi Data</h3>
              <div className="bg-[#F8F8F6] rounded-xl p-4 space-y-3 text-sm">
                {[
                  { label: "Nama Pemilik", value: formData.namaPemilik || "-" },
                  { label: "Email", value: formData.email || "-" },
                  { label: "Nama Toko", value: formData.namaToko || "-" },
                  { label: "Kategori Usaha", value: formData.kategori || "-" },
                  { label: "No. HP", value: formData.noHp || "-" },
                  { label: "Alamat", value: formData.alamat || "-" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#6B6B6B]">{label}</span>
                    <span className="font-semibold text-[#202020]">{value}</span>
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-2 cursor-pointer mt-4">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#D4AF37] w-4 h-4 cursor-pointer"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  required
                />
                <span className="text-xs text-[#6B6B6B]">
                  Saya menyatakan bahwa semua data yang dimasukkan adalah benar dan saya menyetujui{" "}
                  <a href="#" className="text-[#D4AF37] hover:underline font-medium">Syarat & Ketentuan</a> AqraOne.
                </span>
              </label>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 0 && <Button variant="secondary" size="lg" onClick={prev} className="flex-1 justify-center">Kembali</Button>}
            {step < 3 ? (
              <Button variant="primary" size="lg" onClick={next} className="flex-1 justify-center">Lanjut</Button>
            ) : (
              <Button variant="primary" size="lg" loading={loading} onClick={handleSubmit} className="flex-1 justify-center">Kirim Pendaftaran</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
