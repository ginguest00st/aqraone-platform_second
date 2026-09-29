import React from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

export default function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
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
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
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
        <div
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto text-left`}
          style={{ position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
            <h3 className="text-base font-semibold text-[#202020]">{title}</h3>
            <button onClick={onClose} className="text-[#6B6B6B] hover:text-[#202020] transition-colors text-xl leading-none">&times;</button>
          </div>
          <div className="px-6 py-5">{children}</div>
          {footer && <div className="px-6 py-4 border-t border-[#E5E5E5] flex justify-end gap-3">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "primary";
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Konfirmasi", variant = "danger" }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Batal</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <p className="text-sm text-[#6B6B6B]">{message}</p>
    </Modal>
  );
}
