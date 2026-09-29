import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router";
import { saveActiveVoucherCode } from "../../lib/voucher";

interface WelcomePromoModalProps {
  open: boolean;
  onClose: () => void;
  onClaim?: () => void;
}

export default function WelcomePromoModal({
  open,
  onClose,
  onClaim,
}: WelcomePromoModalProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const voucherCode = "AQRAJUARA";

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    saveActiveVoucherCode(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    saveActiveVoucherCode(voucherCode);
    onClose();
    if (onClaim) {
      onClaim();
    } else {
      navigate("/products");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
        onClick={onClose}
      />

      {/* Centering Wrapper */}
      <div
        className="flex min-h-screen w-full items-center justify-center p-4 text-center"
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          position: "relative",
          zIndex: 10,
        }}
        onClick={onClose}
      >
        {/* Modal Container */}
        <div
          className="relative bg-white rounded-[28px] shadow-[0_24px_64px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden border border-[#E8E6E1] text-left"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "32rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-sm text-sm"
          title="Tutup"
        >
          ✕
        </button>

        {/* Top Header Banner */}
        <div className="relative bg-gradient-to-br from-[#1A1714] via-[#2A231C] to-[#14120F] px-8 pt-9 pb-8 text-white overflow-hidden">
          {/* Decorative Shimmer Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#EDD882]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/25 border border-[#EDD882]/40 backdrop-blur-md mb-3.5">
            <span className="text-xs">✨</span>
            <span className="text-[11px] font-bold text-[#EDD882] tracking-wider uppercase">
              Promo Spesial Pengguna Baru
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight font-display">
            Diskon <span className="text-[#EDD882]">30%</span> Belanja Produk UMKM Nusantara!
          </h2>

          <p className="text-[13px] text-white/70 mt-2.5 leading-relaxed">
            Dukung kemajuan usaha lokal Indonesia dan dapatkan potongan harga spesial belanja pertama Anda di AqraOne.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-7 space-y-5 bg-[#FAFAF8]">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl p-4 border border-dashed border-[#C9A227] shadow-xs flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase text-[#7C7770] tracking-wider">
                Kode Voucher Eksklusif
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-bold text-lg text-[#1A1714] tracking-wider">
                  {voucherCode}
                </span>
                <span className="text-[10px] font-bold bg-[#FDF6E3] text-[#A07C10] border border-[#C9A227]/30 px-2 py-0.5 rounded-full">
                  Maks. Rp50.000
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5 ${
                copied
                  ? "bg-emerald-600 text-white shadow-emerald-600/20"
                  : "bg-[#1A1714] text-[#EDD882] hover:bg-[#2A231C]"
              }`}
            >
              {copied ? (
                <>
                  <span>✓</span>
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          {/* Benefits Feature List */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white p-3 rounded-xl border border-[#E8E6E1] text-center shadow-xs">
              <span className="text-xl block mb-1">🚚</span>
              <p className="text-[11px] font-bold text-[#1A1714]">Gratis Ongkir</p>
              <p className="text-[10px] text-[#7C7770]">Semua UMKM</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E8E6E1] text-center shadow-xs">
              <span className="text-xl block mb-1">🛡️</span>
              <p className="text-[11px] font-bold text-[#1A1714]">Aman & Resmi</p>
              <p className="text-[10px] text-[#7C7770]">Finnet Gateway</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-[#E8E6E1] text-center shadow-xs">
              <span className="text-xl block mb-1">🇲🇨</span>
              <p className="text-[11px] font-bold text-[#1A1714]">100% Lokal</p>
              <p className="text-[10px] text-[#7C7770]">Produk Nusantara</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={handleClaim}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#B38D1B] text-white font-bold text-[14px] hover:shadow-[0_8px_24px_rgba(201,162,39,0.35)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Klaim & Mulai Belanja Sekarang</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-center text-xs text-[#7C7770] hover:text-[#1A1714] font-medium transition-colors cursor-pointer"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>,
  document.body
);
}
