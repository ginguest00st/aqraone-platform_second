import React from "react";
import { IconTrendUp, IconTrendDown } from "./Icons";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  iconBg?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, icon, trend, iconBg = "bg-[#FDF6E3]", accent = false }: StatCardProps) {
  return (
    <div
      data-figma-layer="StatCard"
      className={`rounded-[16px] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${
        accent
          ? "bg-[#C9A227] text-white shadow-[0_4px_16px_rgba(201,162,39,0.3)]"
          : "bg-white border border-[#E8E6E1] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${accent ? "bg-white/20" : iconBg}`}>
          <span className={`${accent ? "text-white" : "text-[#C9A227]"}`} style={{ fontSize: 18 }}>{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            trend.up
              ? accent ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700"
              : accent ? "bg-white/20 text-white" : "bg-red-50 text-red-600"
          }`}>
            {trend.up ? <IconTrendUp className="w-3 h-3" /> : <IconTrendDown className="w-3 h-3" />}
            {trend.value}
          </div>
        )}
      </div>
      <p className={`text-[11px] font-medium mb-0.5 ${accent ? "text-white/80" : "text-[#7C7770]"}`}>{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-[#1A1714]"}`}>{value}</p>
    </div>
  );
}
