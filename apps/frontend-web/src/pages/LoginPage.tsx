import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import type { UserRole } from '../context/AuthContext';
import { API_URL } from '../config';

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'user', label: 'Người dùng', icon: 'person', desc: 'Tham gia & theo dõi giải đấu' },
  { value: 'host', label: 'Chủ sự kiện', icon: 'event', desc: 'Tạo & quản lý giải đấu' },
  { value: 'admin', label: 'Quản trị viên', icon: 'admin_panel_settings', desc: 'Quản trị hệ thống' },
];

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('host');
  const [error, setError] = useState('');
  const { login, isAuthenticated, role: authRole } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      if (authRole === 'admin' || authRole === 'host') {
        navigate('/dashboard');
      } else {
        navigate('/tournaments');
      }
    }
  }, [isAuthenticated, authRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      setError('Email không hợp lệ');
      return;
    }

    if (!selectedRole) {
      setError('Vui lòng chọn vai trò đăng nhập');
      return;
    }

    showLoading('Đang đăng nhập...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    hideLoading();
    login(selectedRole);
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        showLoading('Đang xác thực với Google...');
        const res = await fetch(`${API_URL}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token, role: selectedRole }),
        });

        if (res.ok) {
          login(selectedRole);
        } else {
          setError('Lỗi đăng nhập Google với server');
        }
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi kết nối máy chủ');
      } finally {
        hideLoading();
      }
    },
    onError: () => {
      setError('Đăng nhập Google thất bại');
    },
  });

  return (
    <div className="min-h-screen flex bg-surface-container-lowest antialiased relative overflow-hidden">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] auth-gradient-panel relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-[80px] animate-blob" />
        <div className="absolute bottom-[15%] right-[5%] w-48 h-48 bg-white/8 rounded-full blur-[60px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[50%] right-[20%] w-32 h-32 bg-white/5 rounded-full blur-[40px] animate-float" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-md text-white">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  sports_tennis
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight">CourtMate</h1>
            </div>
          </div>

          <h2 className="font-headline-lg text-headline-lg font-bold mb-4 animate-fade-in-up delay-100">
            Chào mừng trở lại!
          </h2>
          <p className="text-white/80 font-body-lg text-body-lg leading-relaxed animate-fade-in-up delay-200">
            Nền tảng quản lý giải đấu cầu lông chuyên nghiệp. Đăng nhập để tiếp tục quản lý các giải đấu của bạn.
          </p>

          <div className="mt-10 space-y-4 animate-fade-in-up delay-300">
            {[
              { icon: 'emoji_events', text: 'Quản lý giải đấu dễ dàng' },
              { icon: 'group', text: 'Kết nối cộng đồng cầu lông' },
              { icon: 'analytics', text: 'Theo dõi thống kê trực tiếp' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                </div>
                <span className="font-body-md text-body-md">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[80px] pointer-events-none lg:hidden" />

        <div className="absolute top-6 left-6 z-50">
          <Link to="/" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Trang chủ
          </Link>
        </div>

        <div className="w-full max-w-[460px] mx-auto animate-slide-in-right">
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden animate-fade-in-up">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_tennis
            </span>
            <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">CourtMate</h1>
          </div>

          <div className="mb-5 animate-fade-in-up delay-100">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-1">Đăng nhập</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Nhập thông tin đăng nhập của bạn.</p>
          </div>

          <div className="mb-5 animate-fade-in-up delay-200">
            <label className="block font-label-md text-label-md text-on-surface mb-2">Chọn vai trò đăng nhập</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const active = selectedRole === role.value;
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`role-card items-start text-left !gap-3 !p-3.5 ${active ? 'active' : ''}`}
                  >
                    <div className={`role-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${active ? '' : 'bg-surface-container-low text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                        {role.icon}
                      </span>
                    </div>
                    <div>
                      <div className={`font-label-md text-[12px] font-semibold transition-colors ${active ? 'text-primary' : 'text-on-surface'}`}>
                        {role.label}
                      </div>
                      <div className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">
                        {role.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form className="space-y-4 animate-fade-in-up delay-300" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 text-sm text-error bg-error-container/60 backdrop-blur rounded-xl font-medium flex items-center gap-2 animate-scale-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="login-identifier">
                Email hoặc Số điện thoại <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">person</span>
                </div>
                <input
                  className="input-glow block w-full pl-11 pr-4 py-3 border border-outline-variant/60 rounded-xl bg-white/80 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline"
                  id="login-identifier"
                  name="identifier"
                  placeholder="Nhập email hoặc số điện thoại"
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="login-password">
                Mật khẩu <span className="text-error">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input
                  className="input-glow block w-full pl-11 pr-11 py-3 border border-outline-variant/60 rounded-xl bg-white/80 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline"
                  id="login-password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-primary transition-colors focus:outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer accent-primary"
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer select-none" htmlFor="remember-me">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                className="font-body-sm text-body-sm text-primary hover:text-primary-container font-semibold transition-colors"
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Tính năng Khôi phục mật khẩu đang phát triển');
                }}
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] mt-2"
              type="submit"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Đăng nhập
            </button>
          </form>

          <div className="my-6 relative animate-fade-in-up delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface-container-lowest font-body-sm text-body-sm text-outline">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="animate-fade-in-up delay-500">
            <button
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-outline-variant/40 rounded-xl bg-white/80 hover:bg-white hover:shadow-md font-label-md text-label-md text-on-surface transition-all duration-200 active:scale-[0.98] group"
              type="button"
              onClick={() => handleGoogleLogin()}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Tiếp tục với Google
            </button>
          </div>

          <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant animate-fade-in-up delay-600">
            Chưa có tài khoản?{' '}
            <Link className="font-semibold text-primary hover:text-primary-container transition-colors" to="/signup">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}