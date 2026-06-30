import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import type { UserRole } from '../context/AuthContext';

const ROLES: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'user', label: 'Người dùng', icon: 'person', desc: 'Tham gia & theo dõi giải đấu' },
  { value: 'host', label: 'Chủ sự kiện', icon: 'event', desc: 'Tạo & quản lý giải đấu' },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState('');
  const [successPopup, setSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const { login, isAuthenticated, role: authRole } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isAuthenticated) {
      if (authRole === 'admin' || authRole === 'host') {
        navigate('/dashboard');
      } else {
        navigate('/tournaments');
      }
    }
  }, [isAuthenticated, authRole, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (successPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (successPopup && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [successPopup, countdown, navigate]);

  /* Password strength */
  const passwordStrength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Yếu', color: 'bg-error' };
    if (score <= 2) return { level: 2, label: 'Trung bình', color: 'bg-[#f59e0b]' };
    if (score <= 3) return { level: 3, label: 'Khá', color: 'bg-[#22c55e]' };
    return { level: 4, label: 'Mạnh', color: 'bg-primary' };
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!fullName || !email || !phone || !password || !terms) {
      setError('Vui lòng điền đầy đủ thông tin và đồng ý điều khoản');
      return;
    }
    if (role === 'host' && !orgName) {
      setError('Vui lòng nhập tên tổ chức / câu lạc bộ');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
      setError('Số điện thoại không hợp lệ');
      return;
    }

    showLoading('Đang tạo tài khoản...');
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password, name: fullName, role }),
      });
      if (res.ok) {
        setSuccessPopup(true);
      } else {
        const err = await res.json();
        setError(err.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi kết nối máy chủ');
    } finally {
      hideLoading();
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        showLoading('Đang xác thực với Google...');
        const res = await fetch('http://localhost:3000/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token, role })
        });
        
        if (res.ok) {
          login(role);
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
      {/* ── Left Decorative Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] auth-gradient-panel relative items-center justify-center p-12 overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-white/10 rounded-full blur-[80px] animate-blob" />
        <div className="absolute bottom-[15%] right-[5%] w-48 h-48 bg-white/8 rounded-full blur-[60px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[50%] right-[20%] w-32 h-32 bg-white/5 rounded-full blur-[40px] animate-float" />

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Content */}
        <div className="relative z-10 max-w-md text-white">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/15 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight">CourtMate</h1>
            </div>
          </div>

          <h2 className="font-headline-lg text-headline-lg font-bold mb-4 animate-fade-in-up delay-100">
            Tham gia ngay!
          </h2>
          <p className="text-white/80 font-body-lg text-body-lg leading-relaxed animate-fade-in-up delay-200">
            Tạo tài khoản miễn phí để bắt đầu quản lý và tham gia các giải đấu cầu lông chuyên nghiệp.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 animate-fade-in-up delay-300">
            {[
              { num: '500+', label: 'Vận động viên' },
              { num: '120+', label: 'Giải đấu' },
              { num: '50+', label: 'Câu lạc bộ' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-headline-md text-headline-md font-bold text-white">{s.num}</div>
                <div className="font-body-sm text-body-sm text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative">
        {/* Subtle bg blobs on mobile */}
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px] pointer-events-none lg:hidden" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[80px] pointer-events-none lg:hidden" />

        {/* Back link */}
        <div className="absolute top-6 left-6 z-50">
          <Link to="/" className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm group">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Trang chủ
          </Link>
        </div>

        <div className="w-full max-w-[460px] mx-auto animate-slide-in-right">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden animate-fade-in-up">
            <span className="material-symbols-outlined text-[28px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>sports_tennis</span>
            <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">CourtMate</h1>
          </div>

          {/* Header */}
          <div className="mb-5 animate-fade-in-up delay-100">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-1">Tạo tài khoản</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Chọn vai trò và điền thông tin để bắt đầu.</p>
          </div>

          {/* ── Role Selector ── */}
          <div className="grid grid-cols-2 gap-3 mb-5 animate-fade-in-up delay-200">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`role-card flex-row !gap-3 !p-3.5 ${role === r.value ? 'active' : ''}`}
              >
                <div className={`role-icon w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${role === r.value ? '' : 'bg-surface-container-low text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: role === r.value ? "'FILL' 1" : "'FILL' 0" }}>{r.icon}</span>
                </div>
                <div className="text-left">
                  <div className={`font-label-md text-[12px] font-semibold transition-colors ${role === r.value ? 'text-primary' : 'text-on-surface'}`}>{r.label}</div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">{r.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Admin notice */}
          {role === 'admin' && (
            <div className="p-3 mb-4 text-sm bg-surface-container rounded-xl flex items-start gap-2 animate-scale-in">
              <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">info</span>
              <p className="text-on-surface-variant text-body-sm">Tài khoản quản trị viên chỉ được tạo bởi hệ thống. Vui lòng liên hệ admin để được cấp quyền.</p>
            </div>
          )}

          {/* ── Form ── */}
          <form className="space-y-3.5 animate-fade-in-up delay-300" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 text-sm text-error bg-error-container/60 backdrop-blur rounded-xl font-medium flex items-center gap-2 animate-scale-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="signup-fullname">Họ và tên <span className="text-error">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">person</span>
                  </div>
                  <input className="input-glow w-full pl-11 pr-4 py-2.5 bg-white/80 border border-outline-variant/60 rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline" id="signup-fullname" name="fullName" placeholder="Nguyễn Văn A" required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="signup-phone">Số điện thoại <span className="text-error">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">call</span>
                  </div>
                  <input className="input-glow w-full pl-11 pr-4 py-2.5 bg-white/80 border border-outline-variant/60 rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline" id="signup-phone" name="phone" placeholder="090 123 4567" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="signup-email">Email <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                </div>
                <input className="input-glow w-full pl-11 pr-4 py-2.5 bg-white/80 border border-outline-variant/60 rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline" id="signup-email" name="email" placeholder="nguyenvana@example.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Organisation name — host only */}
            {role === 'host' && (
              <div className="animate-scale-in">
                <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="signup-org">Tên tổ chức / CLB <span className="text-error">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline text-[20px]">business</span>
                  </div>
                  <input className="input-glow w-full pl-11 pr-4 py-2.5 bg-white/80 border border-outline-variant/60 rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline" id="signup-org" name="orgName" placeholder="VD: CLB Cầu lông Đà Nẵng" required type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="signup-password">Mật khẩu <span className="text-error">*</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input className="input-glow w-full pl-11 pr-11 py-2.5 bg-white/80 border border-outline-variant/60 rounded-xl font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-outline" id="signup-password" name="password" placeholder="••••••••" required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex items-center gap-2 animate-fade-in-up">
                  <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`strength-bar h-full rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.level / 4) * 100}%` }} />
                  </div>
                  <span className={`text-[11px] font-semibold min-w-[60px] text-right ${passwordStrength.level <= 1 ? 'text-error' : passwordStrength.level <= 2 ? 'text-[#f59e0b]' : 'text-primary'}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 mt-1">
              <input className="h-4 w-4 mt-0.5 text-primary focus:ring-primary border-outline-variant rounded cursor-pointer accent-primary flex-shrink-0" id="signup-terms" name="terms" required type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
              <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer leading-tight" htmlFor="signup-terms">
                Tôi đồng ý với <Link className="text-primary font-semibold hover:underline" to="#">Điều khoản</Link> và <Link className="text-primary font-semibold hover:underline" to="#">Chính sách bảo mật</Link>
              </label>
            </div>

            {/* Submit */}
            <button className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container hover:text-on-primary-container focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-[0.98] mt-1" type="submit">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Tạo tài khoản
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 relative animate-fade-in-up delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/40" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-surface-container-lowest font-body-sm text-body-sm text-outline">hoặc</span>
            </div>
          </div>

          {/* Google Signup */}
          <div className="animate-fade-in-up delay-500">
            <button className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border border-outline-variant/40 rounded-xl bg-white/80 hover:bg-white hover:shadow-md font-label-md text-label-md text-on-surface transition-all duration-200 active:scale-[0.98] group" type="button" onClick={() => handleGoogleSignup()}>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Đăng ký với Google
            </button>
          </div>

          {/* Login redirect */}
          <p className="mt-6 text-center font-body-sm text-body-sm text-on-surface-variant animate-fade-in-up delay-600">
            Đã có tài khoản?{' '}
            <Link className="font-semibold text-primary hover:text-primary-container transition-colors" to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>

      {/* Success Popup */}
      {successPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-[90%] animate-scale-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-background mb-2 text-center">Đăng ký thành công!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-center mb-6">
              Tài khoản của bạn đã được tạo. Chuyển hướng đến trang đăng nhập trong <span className="font-bold text-primary">{countdown}s</span>...
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-label-md hover:bg-primary/90 transition-colors"
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
