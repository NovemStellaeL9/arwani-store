"use client";

import React from "react";
import Link from "next/link";
import { getWaLink } from "@/utils/helpers";

export default function Kontak() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] pb-10 transition-colors duration-500">
      
      {/* Header stick */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-white/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
          Hubungi Kami
        </span>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Contact info list */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-6 transition-colors duration-500">
          
          <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
            Informasi Kontak Toko
          </h2>

          <div className="space-y-4">
            {/* WhatsApp */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.311 1.485 5.357 1.486 5.568 0 10.105-4.52 10.108-10.089.002-2.697-1.047-5.234-2.952-7.141C17.26 1.49 14.733.438 12.013.438c-5.57 0-10.11 4.519-10.114 10.087-.001 2.077.549 4.107 1.596 5.899l-1.045 3.82 3.935-1.03c1.611.879 3.398 1.34 5.262 1.34zm8.993-6.9c-.273-.137-1.615-.797-1.866-.889-.25-.092-.432-.137-.614.137-.182.274-.706.889-.865 1.072-.158.182-.318.205-.591.069-.272-.137-1.15-.424-2.19-1.353-.809-.722-1.355-1.614-1.514-1.888-.158-.274-.017-.422.12-.558.123-.122.273-.32.41-.48.136-.16.182-.274.273-.457.09-.182.045-.342-.023-.479-.068-.137-.614-1.484-.84-2.032-.22-.53-.443-.457-.614-.466-.159-.008-.341-.01-.523-.01-.182 0-.477.069-.727.342-.25.274-.954.933-.954 2.276 0 1.343.977 2.64 1.114 2.823.136.183 1.922 2.936 4.657 4.116.65.28 1.158.448 1.554.574.654.208 1.25.179 1.722.109.526-.078 1.616-.66 1.843-1.298.227-.639.227-1.187.159-1.298-.068-.112-.25-.183-.523-.32z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  WhatsApp Store
                </h3>
                <a
                  href={getWaLink("Tanya Admin", "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-extrabold text-orange-500 dark:text-emerald-400 hover:underline mt-0.5 block"
                >
                  +62 859-6709-6912
                </a>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  Proses cepat via chat pesan langsung.
                </p>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Jam Layanan
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  Senin - Minggu: 08:00 - 22:00 WIB
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                  Layanan pemesanan paket dan bantuan aktif setiap hari.
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/30 text-sky-500 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Email Support
                </h3>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">
                  support@arwanistore.com
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <a
            href={getWaLink("Hubungi CS", "")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest text-center block shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-0.5 active:scale-98"
          >
            Hubungi Customer Service Kami
          </a>
        </div>

      </div>
    </div>
  );
}
