"use client";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [greeting, setGreeting] = useState("Selamat Datang");
  const [currentDate, setCurrentDate] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Determine Greeting
    const h = new Date().getHours();
    if (h >= 5 && h < 11) setGreeting("Halo Kak, Selamat Pagi 👋");
    else if (h >= 11 && h < 15) setGreeting("Halo Kak, Selamat Siang ☀️");
    else if (h >= 15 && h < 18) setGreeting("Halo Kak, Selamat Sore ☕");
    else setGreeting("Halo Kak, Selamat Malam 🌙");

    // Format Date
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );

    // Initial Theme Sync
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const darkQuery = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (savedTheme === "dark" || (!savedTheme && darkQuery)) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="bg-app-header-bg text-app-header-text px-5 py-6 rounded-b-[2.5rem] shadow-xl relative z-20 border-b border-app-border/10 transition-colors duration-500">
      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-sm font-bold text-app-primary dark:text-emerald-300 drop-shadow-sm transition-all duration-300 animate-pulse">
            {greeting}
          </p>
          <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5 font-medium">
            Mau isi kuota apa hari ini?
          </p>
        </div>
        
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="bg-white/10 dark:bg-white/5 p-2.5 rounded-full border border-white/15 dark:border-white/5 shadow-inner backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-white/20"
        >
          {isDarkMode ? (
            // Sun Icon (Light Mode)
            <svg className="w-5 h-5 text-amber-400 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
            </svg>
          ) : (
            // Moon Icon (Dark Mode)
            <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
 
      {/* Glassmorphism Title Card */}
      <div className="bg-white/5 dark:bg-black/25 rounded-2xl px-4 py-3.5 text-center border border-white/10 dark:border-white/5 backdrop-blur-md shadow-lg">
        <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white dark:from-white dark:via-purple-100 dark:to-emerald-200">
          ARWANI D'GABRIEL STORE
        </h1>
        <p className="text-[11px] font-extrabold text-app-primary mt-1.5 tracking-wider uppercase">
          {currentDate || "Memuat tanggal..."}
        </p>
      </div>
    </div>
  );
}
