import React, { useState, useEffect } from "react";
import {
  applyVoucher,
  getSavedVoucherCode,
  saveActiveVoucherCode,
  removeSavedVoucherCode,
  AVAILABLE_VOUCHERS,
  type VoucherApplyResult,
} from "../../lib/voucher";
import { formatRp } from "./ProductCard";

interface VoucherSectionProps {
  subtotal: number;
  shippingCost?: number;
  onVoucherApplied: (res: VoucherApplyResult | null) => void;
  currentVoucher: VoucherApplyResult | null;
}

export default function VoucherSection({
  subtotal,
  shippingCost = 15000,
  onVoucherApplied,
  currentVoucher,
}: VoucherSectionProps) {
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-apply saved voucher from promo banner if available on initial render
  useEffect(() => {
    if (!currentVoucher) {
      const savedCode = getSavedVoucherCode();
      if (savedCode && AVAILABLE_VOUCHERS[savedCode]) {
        const res = applyVoucher(savedCode, subtotal, shippingCost);
        if (res.valid) {
          onVoucherApplied(res);
          setInputCode(savedCode);
        }
      }
    }
  }, [subtotal, shippingCost]);

  // Recalculate if subtotal changes while voucher is active
  useEffect(() => {
    if (currentVoucher && currentVoucher.valid) {
      const recalculated = applyVoucher(currentVoucher.code, subtotal, shippingCost);
      if (recalculated.valid) {
        if (recalculated.discount !== currentVoucher.discount) {
          onVoucherApplied(recalculated);
        }
      } else {
        onVoucherApplied(null);
        setErrorMessage(recalculated.message);
      }
    }
  }, [subtotal, shippingCost]);

  const handleApply = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim().toUpperCase();
    if (!code) {
      setErrorMessage("Silakan ketik atau pilih kode voucher terlebih dahulu.");
      return;
    }

    setErrorMessage(null);
    const result = applyVoucher(code, subtotal, shippingCost);

    if (result.valid) {
      saveActiveVoucherCode(result.code);
      onVoucherApplied(result);
      setInputCode(result.code);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleRemove = () => {
    removeSavedVoucherCode();
    onVoucherApplied(null);
    setInputCode("");
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-[#202020] flex items-center gap-2">
          <span>🎟️</span>
          <span>Voucher & Promo Diskon</span>
        </h2>
        {currentVoucher && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Aktif
          </span>
        )}
      </div>

      {/* Jika Voucher Sedang Aktif */}
      {currentVoucher && currentVoucher.valid ? (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
              %
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-emerald-900">
                  {currentVoucher.code}
                </span>
                <span className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Hemat {formatRp(currentVoucher.discount)}
                </span>
              </div>
              <p className="text-xs text-emerald-800/80 truncate mt-0.5">
                {currentVoucher.voucher?.description || "Voucher diskon belanja telah diterapkan."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline px-2 py-1 shrink-0 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      ) : (
        /* Form Input Voucher */
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Masukkan kode voucher (e.g. AQRAJUARA)"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E6E1] bg-[#FAFAF8] text-sm text-[#1A1714] font-mono uppercase placeholder:normal-case placeholder:font-sans placeholder:text-[#ABA9A4] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15 transition-all"
            />
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-5 py-2.5 rounded-xl bg-[#1A1714] text-white text-xs font-bold hover:bg-[#2E2720] active:scale-95 transition-all cursor-pointer shrink-0"
            >
              Terapkan
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 animate-in fade-in">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Rekomendasi Voucher Cepat */}
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-[#7C7770] uppercase tracking-wider mb-2">
              Voucher Tersedia untuk Anda:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(AVAILABLE_VOUCHERS).map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => handleApply(v.code)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#C9A227] bg-[#FDF6E3] hover:bg-[#F9EDC7] text-xs font-medium text-[#A07C10] transition-colors cursor-pointer"
                >
                  <span className="font-bold">{v.code}</span>
                  <span className="text-[10px] text-[#7C7770]">
                    ({v.type === "percentage" ? `Diskon ${v.value}%` : v.type === "shipping" ? "Gratis Ongkir" : `-Rp${(v.value / 1000)}rb`})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
