import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl border border-[#E8E6E1] p-8 max-w-md w-full shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF5D6] text-[#C9A227] flex items-center justify-center text-3xl mx-auto mb-4">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-[#1A1714]">Terjadi Kendala Tampilan</h2>
            <p className="text-xs text-[#7C7770] mt-2 mb-6 leading-relaxed">
              Sistem mendeteksi kendala pada halaman ini. Anda dapat memuat ulang halaman atau kembali ke beranda.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#C9A227] hover:bg-[#B38F1E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Muat Ulang Halaman
              </button>
              <a
                href="/"
                className="px-4 py-2 bg-[#F5F4F0] hover:bg-[#E8E6E1] text-[#1A1714] text-xs font-semibold rounded-xl transition-all cursor-pointer border border-[#E8E6E1]"
              >
                Ke Beranda
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
