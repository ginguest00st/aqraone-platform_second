import { NavLink } from "react-router";
import React from "react";

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
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
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={() => {
              item.onClick?.();
              onItemClick?.(item);
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white/20 text-white shadow-[0_2px_12px_rgba(0,0,0,0.2)] backdrop-blur-sm border border-white/20"
                  : "text-white/55 hover:bg-white/10 hover:text-white/90"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`shrink-0 w-5 h-5 flex items-center justify-center ${isActive ? "text-[#EDD882]" : ""}`}>{item.icon}</span>
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {footer && (
        <div className={`${collapsed ? "px-2 py-4" : "px-4 py-4"} border-t border-white/10 relative z-10`}>
          {footer}
        </div>
      )}
    </aside>
  );
}
