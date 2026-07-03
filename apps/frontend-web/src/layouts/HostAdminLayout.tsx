import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HostAdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const navItemClass = (path: string) => {
    if (isActive(path)) {
      return "flex items-center gap-3 px-3 py-2 bg-primary-container text-on-primary-container dark:bg-primary dark:text-on-primary rounded-lg font-semibold font-body-md text-body-md hover:translate-x-1 transition-all duration-200 active:scale-98";
    }
    return "flex items-center gap-3 px-3 py-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-tertiary-container/30 rounded-lg font-body-md text-body-md hover:translate-x-1 transition-all duration-200 active:scale-98";
  };

  const portalName = role === 'admin' ? 'Cổng Quản Trị' : role === 'host' ? 'Cổng Chủ Sự Kiện' : 'Cổng Người Dùng';
  const isHostOrAdmin = role === 'host' || role === 'admin';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f9] text-on-background relative">
      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* SideNavBar */}
      <nav className="hidden md:flex flex-col h-full p-md space-y-base bg-white/60 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] w-64 fixed left-0 top-0 z-40">
        <div className="flex items-center gap-3 mb-xl">
          <img alt="Organizer Logo" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMMRdajFHhmTmFlRawiyunFf8QFvhUXa3_uvUZCAIU2fC0CZG9LaTh84tl9XUBs5dyJ1kGI7m-Ic_BqZXYsRSEqClJym8eiNnqf3o9tVREH6booK7FNudG4BG1ajuQydvbKwKYedk3lJe2Wm6iSj7JfjN84g6buX4u0AjEjdCNx8KBxu07ZpPNOG7vju1NrVKaY3gBl6cuqNQU9bqFoZquQfZ5olar26hHnX-pxljmMklIwZdly1ry3g" />
          <div>
            <h2 className="font-title-lg text-title-lg font-bold text-on-surface dark:text-inverse-on-surface">
              {portalName}
            </h2>
            <p className="font-label-md text-label-md text-on-surface-variant">CLB Cầu lông Đà Nẵng</p>
          </div>
        </div>
        {isHostOrAdmin && (
          <Link to="/create-tournament" className="w-full bg-primary text-on-primary py-2 px-4 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 mb-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo giải mới
          </Link>
        )}
        <div className="flex-1 space-y-2">
          {isHostOrAdmin && (
            <Link to="/dashboard" className={navItemClass('/dashboard')}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/dashboard') ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
              Bảng điều khiển
            </Link>
          )}
          <Link to="/host/tournaments" className={navItemClass('/host/tournaments')}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/host/tournaments') ? "'FILL' 1" : "'FILL' 0" }}>emoji_events</span>
            {isHostOrAdmin ? 'Giải đấu của tôi' : 'Danh sách giải đấu'}
          </Link>
          {isHostOrAdmin && (
            <Link to="/participants" className={navItemClass('/participants')}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/participants') ? "'FILL' 1" : "'FILL' 0" }}>group</span>
              Vận động viên
            </Link>
          )}
          {role === 'admin' && (
            <Link to="/admin" className={navItemClass('/admin')}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/admin') ? "'FILL' 1" : "'FILL' 0" }}>admin_panel_settings</span>
              Quản trị hệ thống
            </Link>
          )}
        </div>
        <div className="space-y-2 pt-4 border-t border-outline-variant">
          {isHostOrAdmin && (
            <Link to="/settings" className={navItemClass('/settings')}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/settings') ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
              Cài đặt
            </Link>
          )}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant dark:text-surface-variant hover:bg-error-container hover:text-on-error-container rounded-lg font-body-md text-body-md hover:translate-x-1 transition-all duration-200 active:scale-98">
            <span className="material-symbols-outlined">logout</span>
            Đăng xuất
          </button>
        </div>
      </nav>
      
      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 h-full overflow-y-auto p-margin-mobile md:p-margin-desktop relative z-10 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
