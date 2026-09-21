import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { IconCheck } from "../../components/ui/Icons";
import { useAuth } from "../../app/contexts/AuthContext";

export default function RegisterPage() {
  const [role, setRole]         = useState<"customer" | "umkm">("customer");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  // If the user clicks on UMKM, we can either switch the tab state to UMKM and show a redirect button,
  // or we can redirect directly. Let's make it so clicking the tab behaves like a link, but to keep
  // the design, we'll intercept it.
  const handleRoleChange = (r: "customer" | "umkm") => {
    if (r === "umkm") {
      navigate("/register/umkm");
    } else {
      setRole(r);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setErrorMsg("Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const result = await register({
        email: email.trim(),
        password,
        nama: name.trim(),
        role: "CUSTOMER",
      });

      if (result.error) {
        setErrorMsg(result.error.message || "Gagal mendaftar. Silakan periksa kembali data Anda.");
        setLoading(false);
        return;
      }

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke halaman login...");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans" data-figma-layer="RegisterPage">
      
      {/* ── Left: Form Panel ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12" data-figma-layer="RegisterFormContainer">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-[#C9A227] rounded-[8px] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-bold text-[20px] text-[#1A1714] tracking-tight">Aqra<span className="text-[#C9A227]">One</span></span>
          </Link>

          <h1 className="text-[28px] md:text-[32px] font-bold text-[#111827] mb-2 font-display">
            Daftar Akun Baru 👋
          </h1>
          <p className="text-[14px] text-[#6B7280] mb-8">
            Mulai perjalanan Anda bersama AqraOne hari ini.
          </p>

          {/* Role tabs */}
          <div className="flex bg-gray-100 p-1 rounded-[12px] mb-6" data-figma-layer="RoleTabs">
            <button
              onClick={() => handleRoleChange("customer")}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-[9px] transition-all ${
                role === "customer"
                  ? "bg-white text-[#111827] shadow-sm border border-gray-200"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleRoleChange("umkm")}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-[9px] transition-all ${
                role === "umkm"
                  ? "bg-white text-[#111827] shadow-sm border border-gray-200"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              UMKM
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span className="flex-1">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 flex items-start gap-2">
              <span className="text-base leading-none">✅</span>
              <span className="flex-1">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div data-figma-layer="InputName">
              <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full border border-[#D1D5DB] bg-white rounded-xl px-4 py-3.5 text-[14px] text-[#111827] outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Email / Phone */}
            <div data-figma-layer="InputEmail">
              <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                Email atau Nomor Telepon
              </label>
              <input
                type="text"
                placeholder="Masukkan email atau nomor telepon"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-[#D1D5DB] bg-white rounded-xl px-4 py-3.5 text-[14px] text-[#111827] outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all placeholder:text-[#9CA3AF]"
              />
            </div>

            {/* Password */}
            <div data-figma-layer="InputPassword">
              <label className="text-[13px] font-medium text-[#374151] block mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Buat kata sandi (min. 8 karakter)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full border border-[#D1D5DB] bg-white rounded-xl px-4 py-3.5 pr-12 text-[14px] text-[#111827] outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] transition-all placeholder:text-[#9CA3AF]"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] transition-colors flex items-center justify-center"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                <div
                  onClick={(e) => { e.preventDefault(); setAgree(!agree); }}
                  className={`w-4 h-4 mt-0.5 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer ${agree ? "bg-[#C9A227] border-[#C9A227]" : "border-[#D1D5DB] bg-white"}`}
                >
                  {agree && <IconCheck className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className="text-[12.5px] text-[#6B7280] leading-snug">
                  Saya setuju dengan <a href="#" className="text-[#C9A227] hover:text-[#A07C10] font-medium transition-colors">Syarat & Ketentuan</a> serta <a href="#" className="text-[#C9A227] hover:text-[#A07C10] font-medium transition-colors">Kebijakan Privasi</a>
                </span>
                {/* Hidden real checkbox for required validation */}
                <input type="checkbox" required checked={agree} onChange={() => {}} className="sr-only" />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[#C9A227] text-white text-[14px] font-bold rounded-xl hover:bg-[#A07C10] transition-all shadow-[0_4px_16px_rgba(201,162,39,0.35)] hover:shadow-[0_6px_20px_rgba(201,162,39,0.45)] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="relative flex items-center py-6 mt-2">
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
            <span className="flex-shrink-0 mx-4 text-[#9CA3AF] text-[13px]">Atau daftar dengan</span>
            <div className="flex-grow border-t border-[#E5E7EB]"></div>
          </div>

          <div className="grid grid-cols-2 gap-3" data-figma-layer="SocialLogin">
            <button className="flex items-center justify-center gap-2.5 py-2.5 border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-medium text-[#374151]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.31-1 2.41-2.06 3.12v2.59h3.33c1.95-1.79 3.07-4.44 3.07-7.72z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.33-2.59c-.98.66-2.23 1.05-3.95 1.05-3.04 0-5.61-2.05-6.53-4.81H2.03v2.68C3.86 20.35 7.6 23 12 23z" fill="#34A853"/>
                <path d="M5.47 14.04c-.24-.72-.37-1.49-.37-2.29s.13-1.57.37-2.29V6.78H2.03C1.27 8.29.84 9.98.84 11.75s.43 3.46 1.19 4.97l3.44-2.68z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.6 1 3.86 3.65 2.03 7.28l3.44 2.68c.92-2.76 3.49-4.58 6.53-4.58z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2.5 py-2.5 border border-[#E5E7EB] rounded-xl hover:bg-gray-50 transition-colors bg-white text-[13px] font-medium text-[#374151]">
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>
          
          <p className="text-center text-[13.5px] text-[#6B7280] mt-8">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-[#C9A227] font-semibold hover:text-[#A07C10] transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right: Image Panel ───────────────────────────────── */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden bg-[#1A1714]" data-figma-layer="RegisterHero">
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=1600&fit=crop&auto=format"
          alt="Bergabung bersama AqraOne"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 grayscale"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714] via-[#1A1714]/80 to-[#C9A227]/20" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <div className="max-w-md">
            <h2 className="text-[36px] font-bold text-white leading-[1.2] mb-5 font-display">
              Bergabung dengan Ribuan UMKM Lainnya.
            </h2>
            <p className="text-[15px] text-white/80 leading-relaxed mb-8">
              Dapatkan akses ke ribuan produk UMKM dan mulai perjalanan belanja Anda bersama AqraOne.
            </p>
            
            {/* Pagination Indicators */}
            <div className="flex gap-2">
              <div className="w-8 h-1.5 bg-[#C9A227] rounded-full shadow-[0_0_8px_rgba(201,162,39,0.5)]"></div>
              <div className="w-2 h-1.5 bg-white/30 rounded-full transition-all"></div>
              <div className="w-2 h-1.5 bg-white/30 rounded-full transition-all"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
