import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IconLogout } from "./Icons";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export default function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
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
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
        onClick={loading ? undefined : onClose}
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
        onClick={loading ? undefined : onClose}
      >
        {/* Dialog Card */}
        <div
          className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-md p-6 overflow-hidden border border-[#E8E6E1] text-center"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "28rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#C9A227]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-200/70 flex items-center justify-center text-[#C0392B] shadow-sm mb-4">
              <IconLogout className="w-8 h-8" />
            </div>

            {/* Heading */}
            <h3 className="text-xl font-bold text-[#1A1714]">
              Keluar dari Akun?
            </h3>

            {/* Message */}
            <p className="text-sm text-[#7C7770] mt-2 leading-relaxed max-w-sm">
              Apakah Anda yakin ingin mengakhiri sesi saat ini? Sesi Anda akan ditutup dan Anda akan dialihkan kembali ke halaman utama platform AqraOne.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full mt-6">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-[#E8E6E1] text-[#7C7770] text-[13px] font-semibold hover:bg-[#F5F4F1] hover:text-[#1A1714] transition-all cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C0392B] to-[#A93226] text-white text-[13px] font-semibold hover:shadow-[0_4px_16px_rgba(192,57,43,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <IconLogout className="w-4 h-4" />
                    <span>Ya, Keluar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
