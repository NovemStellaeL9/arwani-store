"use client";

import React, { useEffect } from "react";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Register Service Worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("PWA Service Worker registered successfully: ", reg.scope);
          })
          .catch((err) => {
            console.warn("PWA Service Worker registration failed: ", err);
          });
      });
    }
  }, []);

  return (
    <div className="bg-[#081225] min-h-screen flex justify-center font-sans text-white">
      
      {/* Desktop Wrapper (App Frame) / Mobile Fullscreen */}
      <div className="bg-[#081225] w-full max-w-md min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col pb-24 border-x border-white/5">
        
        {/* Render Page Children */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Floating WhatsApp Button - Always Visible */}
        <a
          href="https://wa.me/6285967096912?text=Halo%20Arwani%20D'Gabriel%20Store%2C%20saya%20butuh%20bantuan."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact support on WhatsApp"
          className="fixed bottom-24 right-4 md:right-[calc(50vw-13rem)] z-50 bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-[0_4px_18px_rgba(37,211,102,0.45)] hover:scale-110 hover:-translate-y-1 active:scale-95 transition-all duration-300 animate-pulse hover:animate-none flex items-center justify-center border-2 border-white/10"
        >
          <svg className="w-5.5 h-5.5 fill-white text-white" viewBox="0 0 24 24">
            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
          </svg>
        </a>

        {/* Global Bottom Navigation Footer */}
        <Footer />
        
      </div>
    </div>
  );
}
