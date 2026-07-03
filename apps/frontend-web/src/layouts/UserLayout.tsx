import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Footer } from '../components/landing/Footer';
import { Header } from '../components/landing/Header';

import { useNavigate } from 'react-router-dom';
import SportsBackground from '../components/SportsBackground';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased relative overflow-hidden">
      {/* Sports Background Pattern */}
      <SportsBackground />

      {/* 100% Synchronized Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-grow w-full pb-[80px] md:pb-0 pt-[80px]">
        {children}
      </div>
      
      <Footer />

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface/90 backdrop-blur-lg border-t border-outline-variant shadow-lg rounded-t-xl transition-transform" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <Link to="/tournaments" className="flex flex-col items-center justify-center text-on-surface-variant hover:opacity-80 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1 text-[24px]">home</span>
          <span className="text-[10px] font-semibold">Trang chủ</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container rounded-full px-4 py-1 hover:opacity-80 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1 text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          <span className="text-[10px] font-semibold">Khám phá</span>
        </Link>
        <Link to="#" className="flex flex-col items-center justify-center text-on-surface-variant hover:opacity-80 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1 text-[24px]">sports_tennis</span>
          <span className="text-[10px] font-semibold">Kèo của tôi</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-on-surface-variant hover:opacity-80 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1 text-[24px]">person</span>
          <span className="text-[10px] font-semibold">Hồ sơ</span>
        </Link>
      </nav>
    </div>
  );
}
