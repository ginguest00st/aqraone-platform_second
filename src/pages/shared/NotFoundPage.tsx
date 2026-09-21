import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl font-bold text-[#D4AF37] leading-none">404</div>
      <div className="text-4xl mt-2 mb-4">🗺️</div>
      <h1 className="text-2xl font-bold text-[#202020] mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-[#6B6B6B] mb-8 max-w-sm">
        Halaman yang kamu cari tidak ada atau telah dipindahkan. Coba kembali ke halaman utama.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-semibold text-sm hover:bg-[#B8860B] transition-colors">
          Kembali ke Beranda
        </Link>
        <Link to="/home" className="px-6 py-3 border border-[#E5E5E5] text-[#202020] rounded-xl font-semibold text-sm hover:bg-white transition-colors">
          Halaman Utama
        </Link>
      </div>
      <div className="mt-16 text-xs text-[#6B6B6B]">AqraOne © 2026 — Platform UMKM Premium Indonesia</div>
    </div>
  );
}
