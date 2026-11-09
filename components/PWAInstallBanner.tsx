"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    if (standalone) return; // Already installed

    if (ios) {
      // Show iOS instructions if not in standalone
      const dismissed = sessionStorage.getItem("pwa-ios-dismissed");
      if (!dismissed) {
        setIsIOS(true);
        setShowBanner(true);
      }
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem("pwa-dismissed");
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem(isIOS ? "pwa-ios-dismissed" : "pwa-dismissed", "1");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 z-50 mx-auto max-w-md">
      <div className="bg-[#0a1628] border border-blue-500/40 rounded-2xl p-3.5 shadow-2xl shadow-black/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white leading-tight">
            Pasang di layar HP
          </p>
          {isIOS ? (
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              Ketuk <strong className="text-white">Bagikan</strong> lalu{" "}
              <strong className="text-white">Tambah ke Layar Utama</strong>
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Akses lebih cepat tanpa buka browser
            </p>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black transition-colors"
            >
              Pasang
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
