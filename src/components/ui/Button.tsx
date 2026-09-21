import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline-gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#C9A227] text-white font-semibold shadow-[0_2px_12px_rgba(201,162,39,0.35)] hover:bg-[#A07C10] hover:shadow-[0_4px_16px_rgba(201,162,39,0.4)] active:scale-[0.98]",
  secondary:
    "bg-white border border-[#E8E6E1] text-[#1A1714] font-medium hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[#FDF6E3] shadow-sm",
  ghost:
    "bg-transparent text-[#7C7770] font-medium hover:bg-[#F5F4F1] hover:text-[#1A1714]",
  danger:
    "bg-[#C0392B] text-white font-semibold hover:bg-red-800 shadow-sm active:scale-[0.98]",
  "outline-gold":
    "border-2 border-[#C9A227] text-[#C9A227] font-semibold bg-transparent hover:bg-[#FDF6E3] active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-[8px] gap-1.5",
  md: "px-4 py-2 text-sm rounded-[10px] gap-2",
  lg: "px-6 py-3 text-sm rounded-[12px] gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      data-figma-layer="Button"
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
      ) : icon ? (
        <span className="shrink-0 opacity-90">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
