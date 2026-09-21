import { Link } from "react-router";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center text-center px-6">
      <div className="w-20 h-20 bg-[#FFF5D6] rounded-full flex items-center justify-center text-4xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold text-[#202020] mb-2">Akses Tidak Diizinkan</h1>
      <p className="text-[#6B6B6B] mb-8 max-w-sm">
        Kamu tidak memiliki izin untuk mengakses halaman ini. Silakan login dengan akun yang sesuai.
      </p>
      <div className="flex gap-3">
        <Link to="/login" className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-semibold text-sm hover:bg-[#B8860B] transition-colors">
          Login
        </Link>
        <Link to="/" className="px-6 py-3 border border-[#E5E5E5] text-[#202020] rounded-xl font-semibold text-sm hover:bg-white transition-colors">
          Beranda
        </Link>
      </div>
      <div className="mt-16 text-xs text-[#6B6B6B]">AqraOne © 2026 — Platform UMKM Premium Indonesia</div>
    </div>
  );
}
