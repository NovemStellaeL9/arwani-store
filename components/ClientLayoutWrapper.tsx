"use client";

import React, { useEffect } from "react";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 1. Sync Theme Class on Mount
    const savedTheme = localStorage.getItem("theme");
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && darkQuery)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // 2. Register Service Worker for PWA
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
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex justify-center font-sans text-slate-800 dark:text-slate-200 transition-colors duration-500">
      
      {/* Desktop Wrapper (App Frame) / Mobile Fullscreen */}
      <div className="bg-slate-50 dark:bg-[#0b0f19] w-full max-w-md min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col pb-24 transition-colors duration-500">
        
        {/* Render Page Children */}
        <main className="flex-1 w-full">{children}</main>

        {/* Global Bottom Navigation Footer */}
        <Footer />
        
      </div>
    </div>
  );
}
