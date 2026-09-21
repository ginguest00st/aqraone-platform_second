import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({ label, error, icon, rightIcon, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#202020]">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">{icon}</span>
        )}
        <input
          className={`w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#202020] bg-white placeholder:text-[#6B6B6B] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all ${icon ? "pl-10" : ""} ${rightIcon ? "pr-10" : ""} ${error ? "border-[#D9534F]" : ""} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]">{rightIcon}</span>
        )}
      </div>
      {error && <p className="text-xs text-[#D9534F]">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-[#202020]">{label}</label>}
      <select
        className={`w-full border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-sm text-[#202020] bg-white outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all cursor-pointer ${error ? "border-[#D9534F]" : ""} ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#D9534F]">{error}</p>}
    </div>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border-[#E5E5E5] accent-[#D4AF37] cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-sm text-[#202020]">{label}</span>}
    </label>
  );
}
