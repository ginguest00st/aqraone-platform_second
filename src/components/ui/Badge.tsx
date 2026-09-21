import React from "react";

type PaymentStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";
type OrderStatus = "BARU" | "DIPROSES" | "DIKIRIM" | "SELESAI" | "DIBATALKAN";
type VerifyStatus = "AKTIF" | "PENDING" | "DITOLAK" | "NONAKTIF";

const paymentColors: Record<PaymentStatus, string> = {
  PENDING:    "bg-amber-50   text-amber-700   border border-amber-200",
  PROCESSING: "bg-blue-50    text-blue-700    border border-blue-200",
  PAID:       "bg-emerald-50 text-emerald-700 border border-emerald-200",
  FAILED:     "bg-red-50     text-red-700     border border-red-200",
  EXPIRED:    "bg-stone-100  text-stone-500   border border-stone-200",
  REFUNDED:   "bg-gray-100  text-gray-700  border border-gray-300",
};

const orderColors: Record<OrderStatus, string> = {
  BARU:       "bg-sky-50     text-sky-700     border border-sky-200",
  DIPROSES:   "bg-orange-50  text-orange-700  border border-orange-200",
  DIKIRIM:    "bg-blue-50  text-blue-700  border border-blue-200",
  SELESAI:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  DIBATALKAN: "bg-red-50     text-red-700     border border-red-200",
};

const verifyColors: Record<VerifyStatus, string> = {
  AKTIF:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  PENDING:  "bg-amber-50   text-amber-700   border border-amber-200",
  DITOLAK:  "bg-red-50     text-red-700     border border-red-200",
  NONAKTIF: "bg-stone-100  text-stone-500   border border-stone-200",
};

interface StatusBadgeProps {
  status: PaymentStatus | OrderStatus | VerifyStatus | string;
  type?: "payment" | "order" | "verify" | "custom";
  customClass?: string;
}

export function StatusBadge({ status, type = "payment", customClass }: StatusBadgeProps) {
  let colorClass = customClass || "bg-stone-100 text-stone-500 border border-stone-200";
  if (type === "payment" && status in paymentColors) colorClass = paymentColors[status as PaymentStatus];
  else if (type === "order" && status in orderColors) colorClass = orderColors[status as OrderStatus];
  else if (type === "verify" && status in verifyColors) colorClass = verifyColors[status as VerifyStatus];
  return (
    <span
      data-figma-layer="StatusBadge"
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${colorClass}`}
    >
      {status}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "new" | "hot" | "success" | "muted";
  className?: string;
}

const badgeVariants = {
  gold:    "bg-[#C9A227] text-white shadow-[0_1px_6px_rgba(201,162,39,0.4)]",
  new:     "bg-[#2563EB] text-white",
  hot:     "bg-[#C0392B] text-white",
  success: "bg-[#1E7A4C] text-white",
  muted:   "bg-[#E8E6E1] text-[#7C7770]",
};

export function Badge({ children, variant = "gold", className = "" }: BadgeProps) {
  return (
    <span
      data-figma-layer="Badge"
      className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold tracking-wider uppercase ${badgeVariants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
