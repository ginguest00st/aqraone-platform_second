import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { IconSearch, IconCart, IconBell, IconUser, IconMenu, IconLogout, IconHome, IconPackage } from "./Icons";
import { useAuth } from "../../app/contexts/AuthContext";
import { useCart } from "../../app/contexts/CartContext";

interface NavbarProps {
  cartCount?: number;
  notifCount?: number;
  user?: { name: string; role: string };
}

export default function Navbar({ cartCount: propCartCount, notifCount = 0, user: propUser }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const { cartCount: liveCartCount } = useCart();
  const user = authUser || propUser;

  // Use live cart count from CartContext
  const cartCount = liveCartCount;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`);
  };

  return (
    <header
      data-figma-layer="Navbar"
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E6E1]"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.06)" }}
    >
      <div className="w-full px-6 lg:px-14 xl:px-20 flex items-center gap-5 h-[60px]">

        {/* Logo */}
        <Link to="/" data-figma-layer="Logo" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 bg-[#C9A227] rounded-[9px] flex items-center justify-center shadow-[0_2px_8px_rgba(201,162,39,0.35)] group-hover:shadow-[0_4px_12px_rgba(201,162,39,0.45)] transition-shadow">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L4 7.5v7h10v-7L9 2z" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7 14.5v-4h4v4" stroke="white" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] text-[#1A1714] tracking-tight">Aqra<span className="text-[#C9A227]">One</span></span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { to: "/",         label: "Beranda" },
            { to: "/products", label: "Produk" },
          ].map((n) => (
            <Link key={n.to} to={n.to}
              className="px-3 py-1.5 text-[13px] text-[#7C7770] hover:text-[#1A1714] rounded-[8px] hover:bg-[#F5F4F1] transition-all font-medium"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[340px]">
          <div className="relative w-full">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ABA9A4] w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk atau UMKM..."
              className="w-full border border-[#E8E6E1] bg-[#FAFAF8] rounded-[10px] pl-9 pr-4 py-2 text-[13px] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15 transition-all placeholder:text-[#ABA9A4]"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Link to="/cart" data-figma-layer="CartButton" className="relative p-2 rounded-[10px] hover:bg-[#F5F4F1] transition-all text-[#7C7770] hover:text-[#1A1714]">
            <IconCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#C9A227] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_1px_4px_rgba(201,162,39,0.4)]">
                {cartCount}
              </span>
            )}
          </Link>

          <button data-figma-layer="NotifButton" className="relative p-2 rounded-[10px] hover:bg-[#F5F4F1] transition-all text-[#7C7770] hover:text-[#1A1714]">
            <IconBell className="w-5 h-5" />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] bg-[#C0392B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="relative ml-1">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] hover:bg-[#F5F4F1] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#FDF6E3] border-2 border-[#C9A227] flex items-center justify-center text-[11px] font-bold text-[#C9A227]">
                  {user.name[0]}
                </div>
                <span className="text-[13px] font-medium text-[#1A1714] hidden md:block">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-[#E8E6E1] py-1.5 z-50">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#1A1714] hover:bg-[#FAFAF8]" onClick={() => setMenuOpen(false)}>
                    <IconUser className="w-4 h-4 text-[#7C7770]" /> Profil Saya
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#1A1714] hover:bg-[#FAFAF8]" onClick={() => setMenuOpen(false)}>
                    <IconPackage className="w-4 h-4 text-[#7C7770]" /> Pesanan Saya
                  </Link>
                  <div className="my-1 border-t border-[#E8E6E1]" />
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-[#C0392B] hover:bg-[#FAFAF8]" onClick={() => { setMenuOpen(false); logout(); navigate("/login"); }}>
                    <IconLogout className="w-4 h-4" /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="ml-1 px-4 py-1.5 bg-[#C9A227] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#A07C10] transition-all shadow-[0_2px_8px_rgba(201,162,39,0.3)]">
              Masuk
            </Link>
          )}

          <button className="md:hidden p-2 rounded-[10px] hover:bg-[#F5F4F1] text-[#7C7770]">
            <IconMenu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
