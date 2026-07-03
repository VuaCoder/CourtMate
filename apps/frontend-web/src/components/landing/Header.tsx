import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { role, isAuthenticated, userName, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('courtmate_notifications');
    if (saved) return JSON.parse(saved);
    const initial = [
      { id: 1, text: 'Bạn đã đăng ký thành công giải Cầu Lông Đà Nẵng Open 2026', time: '1 giờ trước' },
      { id: 2, text: 'Trận đấu Kèo Vãng Lai sẽ bắt đầu sau 2 tiếng', time: '3 giờ trước' }
    ];
    localStorage.setItem('courtmate_notifications', JSON.stringify(initial));
    return initial;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setIsAvatarOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync notifications from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('courtmate_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (location.pathname === '/tournaments') {
      const newParams = new URLSearchParams(searchParams);
      if (val) newParams.set('q', val);
      else newParams.delete('q');
      setSearchParams(newParams);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/tournaments') {
      navigate(`/tournaments?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md shadow-sm' : 'bg-transparent py-2'}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-margin-desktop py-md">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-sm cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">CourtMate</span>
          </Link>
        </div>
        <div className="flex items-center gap-md">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="px-lg py-sm font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                Đăng nhập
              </Link>
              <Link to="/signup" className="flex items-center justify-center px-lg py-sm bg-primary text-on-primary rounded-full font-label-md text-label-md shadow-lg active:scale-95 transition-all">Tham gia ngay</Link>
            </>
          ) : (
            <div className="flex items-center gap-md">
              {/* Search */}
              <div ref={searchRef} className="hidden md:flex items-center relative mr-sm">
                <form onSubmit={handleSearchSubmit} className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-[250px] bg-surface-variant/30 rounded-full border border-outline-variant/50' : 'w-10'}`}>
                  <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full flex-shrink-0 z-10">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm..."
                    className={`bg-transparent outline-none text-sm text-on-surface transition-all duration-300 ${isSearchOpen ? 'w-full px-2 opacity-100' : 'w-0 opacity-0'}`}
                  />
                </form>
              </div>

              <div className="flex items-center gap-xs">
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/50 relative">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                  </button>
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-[320px] bg-surface border border-outline-variant rounded-xl shadow-lg py-2 animate-fade-in-up z-50">
                      <div className="px-4 py-2 font-bold text-on-surface border-b border-outline-variant/30">Thông báo</div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-on-surface-variant italic">Không có thông báo mới</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n.id} className="px-4 py-3 hover:bg-surface-variant/30 cursor-pointer border-b border-outline-variant/20 last:border-0">
                              <p className="text-sm text-on-surface">{n.text}</p>
                              <p className="text-xs text-on-surface-variant mt-1">{n.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {role !== 'user' && (
                <Link to="/create-tournament" className="hidden lg:flex px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-sm hover:opacity-90 transition-opacity active:scale-95">
                  Tạo giải đấu
                </Link>
              )}

              {/* Avatar Dropdown */}
              <div ref={avatarRef} className="relative ml-sm">
                <button onClick={() => setIsAvatarOpen(!isAvatarOpen)} className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary transition-all flex-shrink-0">
                  <img alt="User Avatar" className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff" />
                </button>
                {isAvatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-lg py-2 animate-fade-in-up z-50 overflow-hidden">
                    <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-variant/30 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Cài đặt
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
