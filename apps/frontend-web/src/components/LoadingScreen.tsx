import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';

/* ── Initial splash screen (shown once on app mount) ── */
export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [splash, setSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1200);
    const removeTimer = setTimeout(() => setSplash(false), 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {splash && (
        <div
          className={`fixed inset-0 z-[10000] bg-gradient-to-br from-surface via-surface-container-low to-surface-container flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="relative flex items-center justify-center animate-fade-in-up">
            {/* Outer glow ring */}
            <div className="absolute w-28 h-28 border-4 border-primary/15 rounded-full animate-ping" />
            {/* Spinning ring */}
            <div className="absolute w-22 h-22 border-[3px] border-primary/40 border-t-primary rounded-full animate-spin" style={{ width: 88, height: 88 }} />
            {/* Inner shimmer ring */}
            <div className="absolute w-16 h-16 border-2 border-primary/10 rounded-full animate-pulse" />
            {/* Centre icon */}
            <span className="material-symbols-outlined text-primary text-[44px] relative z-10 drop-shadow-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_tennis
            </span>
          </div>
          <h2 className="mt-10 font-headline-md font-bold text-primary tracking-wide animate-fade-in-up" style={{ animationDelay: '.15s' }}>
            CourtMate
          </h2>
          <p className="mt-2 text-on-surface-variant text-body-sm animate-fade-in-up" style={{ animationDelay: '.3s' }}>
            Nền tảng quản lý giải đấu cầu lông
          </p>
        </div>
      )}
      {children}
    </>
  );
}

/* ── Global loading overlay (driven by LoadingContext) ── */
export function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      requestAnimationFrame(() => setShow(true));
    } else {
      setShow(false);
      const t = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-400 ${show ? 'opacity-100 backdrop-blur-md bg-surface/60' : 'opacity-0 backdrop-blur-none bg-transparent'}`}
    >
      <div className={`relative flex items-center justify-center transition-transform duration-300 ${show ? 'scale-100' : 'scale-90'}`}>
        {/* Spinning ring */}
        <div className="absolute border-[3px] border-primary/30 border-t-primary rounded-full animate-spin" style={{ width: 64, height: 64 }} />
        {/* Inner pulse */}
        <div className="absolute w-12 h-12 border-2 border-primary/10 rounded-full animate-pulse" />
        {/* Centre icon */}
        <span className="material-symbols-outlined text-primary text-[32px] relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
          sports_tennis
        </span>
      </div>
      {loadingMessage && (
        <p className={`mt-6 font-body-md text-body-md text-on-surface-variant font-medium transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
          {loadingMessage}
        </p>
      )}
    </div>
  );
}
