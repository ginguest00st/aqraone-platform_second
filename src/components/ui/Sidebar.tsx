import { NavLink, useNavigate } from "react-router";
import React, { useState } from "react";
import { useAuth } from "../../app/contexts/AuthContext";
import { useCart } from "../../app/contexts/CartContext";
import { IconChevronDown } from "./Icons";
import LogoutConfirmModal from "./LogoutConfirmModal";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  parent?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  items: NavItem[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  onItemClick?: (item: NavItem) => void;
}

export default function Sidebar({ items, logo, footer, collapsed = false, onItemClick }: SidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [expandedParent, setExpandedParent] = useState<string | null>(() =>
    sessionStorage.getItem("aqraone-sidebar-expanded-parent"),
  );
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clearCart } = useCart();

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);
      clearCart();
      navigate("/", { replace: true });
      await logout();
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };
  return (
    <aside
      data-figma-layer="Sidebar"
      className={`${collapsed ? "w-[64px]" : "w-[220px]"} flex-shrink-0 flex flex-col h-full transition-all duration-300 relative overflow-hidden`}
      style={{
        background: "linear-gradient(160deg, #1A1714 0%, #0f0c09 45%, #1A1714 100%)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
      }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at 80% 0%, rgba(201,162,39,0.15) 0%, transparent 60%)",
        }}
      />

      {logo && (
        <div className={`${collapsed ? "px-3 py-5 justify-center" : "px-5 py-5"} border-b border-white/10 flex items-center relative z-10`}>
          {logo}
        </div>
      )}

      <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2 relative z-10">
        {items.map((item) => {
          if (item.parent && item.parent !== expandedParent) return null;

          const isLogout = item.label === "Keluar" || item.to === "/login";
          const hasChildren = items.some((candidate) => candidate.parent === item.label);
          if (isLogout) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onItemClick?.(item);
                  setShowLogoutModal(true);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-150 text-red-400/80 hover:bg-red-500/15 hover:text-red-300 cursor-pointer ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              title={item.parent ? `${item.label} - submenu ${item.parent}` : undefined}
              aria-expanded={hasChildren ? expandedParent === item.label : undefined}
              onClick={() => {
                if (hasChildren) {
                  const nextParent = expandedParent === item.label ? null : item.label;
                  setExpandedParent(nextParent);
                  if (nextParent) {
                    sessionStorage.setItem("aqraone-sidebar-expanded-parent", nextParent);
                  } else {
                    sessionStorage.removeItem("aqraone-sidebar-expanded-parent");
                  }
                }
                item.onClick?.();
                onItemClick?.(item);
              }}
              className={({ isActive }) => {
                const isSelected = isActive || (hasChildren && expandedParent === item.label);
                const nestedStyles = isActive
                  ? "border-[#C9A227] bg-[#C9A227]/10 text-[#F3DB86]"
                  : "border-white/15 text-white/55 hover:border-white/30 hover:bg-white/5 hover:text-white/90";

                return `flex items-center gap-3 transition-all duration-150 ${
                  item.parent && !collapsed
                    ? `ml-4 rounded-r-md border-l pl-3 pr-3 py-2 text-xs ${nestedStyles}`
                    : `px-3 py-2.5 rounded-[10px] text-[13px] font-medium ${
                        isSelected
                          ? "bg-white/20 text-white shadow-[0_2px_12px_rgba(0,0,0,0.2)] backdrop-blur-sm border border-white/20"
                          : "text-white/55 hover:bg-white/10 hover:text-white/90"
                      }`
                } ${collapsed ? "justify-center" : ""}`;
              }}
            >
              {({ isActive }) => (
                <>
                  <span className={`shrink-0 w-5 h-5 flex items-center justify-center ${isActive ? "text-[#EDD882]" : ""}`}>{item.icon}</span>
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {hasChildren && (
                    <IconChevronDown
                      aria-hidden="true"
                      className={`ml-auto h-4 w-4 shrink-0 transition-transform duration-200 ${expandedParent === item.label ? "rotate-180" : ""}`}
                    />
                  )}
                  {!collapsed && isActive && !hasChildren && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {footer && (
        <div className={`${collapsed ? "px-2 py-4" : "px-4 py-4"} border-t border-white/10 relative z-10`}>
          {footer}
        </div>
      )}

      {/* Pop-up Dialog Konfirmasi Logout */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />
    </aside>
  );
}
