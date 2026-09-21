import { ReactNode } from "react";
import { IconBell, IconSearch } from "./Icons";

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  avatarLabel: string;
  avatarBg?: string;
  avatarTextColor?: string;
  notifCount?: number;
  actions?: ReactNode;
}

export default function PanelHeader({
  title,
  subtitle,
  avatarLabel,
  avatarBg = "bg-[#1A1714]",
  avatarTextColor = "text-white",
  notifCount,
  actions,
}: PanelHeaderProps) {
  return (
    <header className="bg-white border-b border-[#E8E6E1] px-6 py-3.5 flex items-center justify-between shrink-0"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}>
      <div>
        <h1 className="text-[15px] font-bold text-[#1A1714]">{title}</h1>
        {subtitle && <p className="text-[11px] text-[#ABA9A4] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ABA9A4] w-3.5 h-3.5" />
          <input placeholder="Cari..." className="border border-[#E8E6E1] bg-[#FAFAF8] rounded-[10px] pl-8 pr-4 py-2 text-[12px] outline-none focus:border-[#C9A227] w-40" />
        </div>
        <button className="relative p-2 hover:bg-[#F5F4F1] rounded-[10px] text-[#7C7770]">
          <IconBell className="w-5 h-5" />
          {notifCount != null && notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C0392B] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
          )}
        </button>
        <div className={`w-9 h-9 ${avatarBg} rounded-full flex items-center justify-center ${avatarTextColor} font-bold text-[12px] ml-1`}>{avatarLabel}</div>
      </div>
    </header>
  );
}
