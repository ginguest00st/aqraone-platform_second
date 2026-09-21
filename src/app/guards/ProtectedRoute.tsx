import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { UserRole } from "../../types/database.types";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // 1. Tampilkan loading state saat Supabase memeriksa session aktif
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#D4AF37] rounded-md flex items-center justify-center text-white text-[10px] font-bold">A</div>
          <span className="text-sm font-semibold text-[#202020]">AqraOne</span>
        </div>
        <p className="text-xs text-[#6B6B6B] mt-1 font-medium">Memverifikasi hak akses akun...</p>
      </div>
    );
  }

  // 2. Jika user belum login, arahkan ke halaman /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Normalisasi role user aktif
  const currentRole = (role || user.role)?.toUpperCase() as UserRole | undefined;

  // 4. Jika role tidak sesuai dengan hak akses yang diizinkan
  if (allowedRoles && allowedRoles.length > 0 && currentRole && !allowedRoles.includes(currentRole)) {
    // Arahkan ke dashboard yang sesuai dengan role aktual user
    if (currentRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (currentRole === "UMKM") {
      return <Navigate to="/umkm/dashboard" replace />;
    }
    // Default untuk CUSTOMER
    return <Navigate to="/" replace />;
  }

  // 5. Akses diberikan
  return children ? <>{children}</> : <Outlet />;
}
