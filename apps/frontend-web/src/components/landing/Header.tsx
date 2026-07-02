import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // States for dropdowns & search
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside clicks
  useEffect(() => {
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const mockNotifications = [
    { id: 1, text: 'Bạn đã đăng ký thành công giải Cầu Lông Đà Nẵng Open 2024', time: '1 giờ trước' },
    { id: 2, text: 'Trận đấu Kèo Vãng Lai sẽ bắt đầu sau 2 tiếng', time: '3 giờ trước' }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-inverse-surface/80 backdrop-blur-lg border-b border-primary/10 shadow-[0_4px_30px_rgba(0,104,95,0.03)] transition-all duration-300">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-margin-desktop py-3">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-sm cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">CourtMate</span>
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5 bg-surface-container-low/60 border border-outline-variant/30 p-1 rounded-full ml-4">
              <Link 
                to="/tournaments" 
                className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
                  location.pathname === '/tournaments' 
                    ? 'bg-primary text-on-primary shadow-sm shadow-primary/20 font-semibold' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 font-medium'
                }`}
              >
                Bảng tin
              </Link>
              <Link 
                to="#" 
                className="text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 px-4 py-1.5 rounded-full transition-all duration-200"
              >
                Khám phá
              </Link>
              <Link 
                to="#" 
                className="text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 px-4 py-1.5 rounded-full transition-all duration-200"
              >
                Kèo của tôi
              </Link>
            </nav>
          )}
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
                {/* Desktop static search bar */}
                <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center w-[200px] bg-surface-container-low border border-outline-variant/30 rounded-full px-3 py-1.5 hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-1.5 flex-shrink-0">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tìm giải đấu, kèo..."
                    className="bg-transparent outline-none text-xs text-on-surface w-full placeholder:text-on-surface-variant/50"
                  />
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-sans font-semibold text-on-surface-variant/40 bg-surface border border-outline-variant/20 rounded-md shadow-sm ml-1.5 flex-shrink-0">⌘K</kbd>
                </form>

                {/* Tablet expandable search bar */}
                <form onSubmit={handleSearchSubmit} className={`lg:hidden flex items-center overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-[200px] bg-surface-variant/30 rounded-full border border-outline-variant/50' : 'w-10'}`}>
                  <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full flex-shrink-0 z-10">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm..."
                    className={`bg-transparent outline-none text-xs text-on-surface transition-all duration-300 ${isSearchOpen ? 'w-full px-2 opacity-100' : 'w-0 opacity-0'}`}
                  />
                </form>
              </div>

              <div className="flex items-center gap-xs">
                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="group p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-variant/50 relative">
                    <span className="material-symbols-outlined text-[20px] animate-bell-ring">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
                  </button>
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-[320px] bg-surface border border-outline-variant rounded-xl shadow-lg py-2 animate-fade-in-up z-50">
                      <div className="px-4 py-2 font-bold text-on-surface border-b border-outline-variant/30">Thông báo</div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {mockNotifications.map(n => (
                          <div key={n.id} className="px-4 py-3 hover:bg-surface-variant/30 cursor-pointer border-b border-outline-variant/20 last:border-0">
                            <p className="text-sm text-on-surface">{n.text}</p>
                            <p className="text-xs text-on-surface-variant mt-1">{n.time}</p>
                          </div>
                        ))}
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
                <button onClick={() => setIsAvatarOpen(!isAvatarOpen)} className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/50 cursor-pointer hover:ring-4 hover:ring-primary/20 hover:border-primary transition-all flex-shrink-0 group">
                  <img alt="User Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr1LsHiKBSTpRv61zSBn4zlnn2sNQ-KWj44i26qCoVvFQiJOKLr7Aqly52b1gr356zbqfH0nnGl3Uv6sjM19cjgzYw-3koEVmQvPvV_l23vUhVB6w-8RmzdS1Ih4k6dLIxi769gYroyixBFyF9I-lbcMCI_d1SfraF2n0nwXq2wkMefd6qsr9DQK_E_mThvNFD0jtqc1gvsMhzu0usZaqvh7IAGrQ401ELXFatAJXevqCUWwSEqp6PXA" />
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
