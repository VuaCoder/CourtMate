import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
  tournamentTitle: string;
  tournamentLevel: string;
  fee: string;
  onRegisterSuccess?: () => void;
}

export default function RegistrationFormModal({
  isOpen,
  onClose,
  tournamentId,
  tournamentTitle,
  tournamentLevel,
  fee,
  onRegisterSuccess,
}: RegistrationFormModalProps) {
  const { userName } = useAuth();
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Đơn Nam');
  const [level, setLevel] = useState('Trung bình');
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerLevel, setPartnerLevel] = useState('Trung bình');

  const ALL_LEVELS = ['Yếu', 'Trung bình yếu', 'Trung bình', 'Trung bình khá', 'Khá'];

  const getAllowedLevels = () => {
    if (!tournamentLevel) return ALL_LEVELS;
    
    // Parse level, e.g. "Trung bình yếu - Khá" or "Trung bình"
    const parts = tournamentLevel.split('-').map(s => s.trim());
    if (parts.length === 1) {
      const singleLevel = parts[0];
      if (ALL_LEVELS.includes(singleLevel)) {
        return [singleLevel];
      }
      return ALL_LEVELS;
    }
    
    if (parts.length === 2) {
      const minL = parts[0];
      const maxL = parts[1];
      
      const minIdx = ALL_LEVELS.indexOf(minL);
      const maxIdx = ALL_LEVELS.indexOf(maxL);
      
      if (minIdx !== -1 && maxIdx !== -1 && minIdx <= maxIdx) {
        return ALL_LEVELS.slice(minIdx, maxIdx + 1);
      }
    }
    
    return ALL_LEVELS;
  };

  const allowedLevels = getAllowedLevels();

  // Prefill user info if logged in
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      
      if (userName && userName !== 'Khách' && userName !== 'Chủ sự kiện' && userName !== 'Quản trị viên') {
        setFullName(userName);
        setPhone('0905123456'); // Mock phone
        setEmail('hoangphuc@email.com'); // Mock email
      } else {
        setFullName('');
        setPhone('');
        setEmail('');
      }
      setCategory('Đơn Nam');
      
      // Initialize level and partner level to first allowed level
      const allowed = getAllowedLevels();
      setLevel(allowed[0] || 'Trung bình');
      setPartnerLevel(allowed[0] || 'Trung bình');
      
      setPartnerName('');
      setPartnerPhone('');
    }
  }, [isOpen, userName, tournamentLevel]);

  if (!isOpen) return null;

  // Extract number from fee for QR payment
  const getNumericFee = () => {
    const numbersOnly = fee.replace(/[^0-9]/g, '');
    return numbersOnly ? parseInt(numbersOnly) : 500000;
  };

  const isDoubleCategory = category.startsWith('Đôi');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    const saved = localStorage.getItem('courtmate_registrations');
    const registrations = saved ? JSON.parse(saved) : [];
    
    const newRegistration = {
      id: Date.now(),
      name: fullName,
      phone,
      email,
      tournament: tournamentTitle,
      tournamentId,
      category: isDoubleCategory ? `${category} (Đồng đội: ${partnerName})` : category,
      level: isDoubleCategory ? `A: ${level} | B: ${partnerLevel}` : level,
      status: 'pending', // Waiting for approval
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    registrations.unshift(newRegistration); // Add to the top
    localStorage.setItem('courtmate_registrations', JSON.stringify(registrations));

    // Save notification
    const savedNotifs = localStorage.getItem('courtmate_notifications');
    const notifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    notifs.unshift({
      id: Date.now(),
      text: `Bạn đã đăng ký thành công giải ${tournamentTitle}. Trạng thái: Chờ duyệt.`,
      time: 'Vừa xong'
    });
    localStorage.setItem('courtmate_notifications', JSON.stringify(notifs));

    // Dispatch global Toast event
    window.dispatchEvent(new CustomEvent('courtmate_toast', {
      detail: { 
        message: `Đăng ký thành công giải ${tournamentTitle}!`, 
        type: 'success' 
      }
    }));

    setIsSuccess(true);
    if (onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  const qrUrl = `https://api.vietqr.io/image/970422-123456789-Q4zJqH.jpg?accountName=COURTMATE%20SPORTS&amount=${getNumericFee()}&addInfo=DK%20TOURNAMENT%20${tournamentId}%20${phone}`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-on-background/85 backdrop-blur-md overflow-hidden animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-[600px] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-md md:p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Đăng ký Giải đấu</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">{tournamentTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-variant transition-colors flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-xl flex flex-col items-center text-center space-y-md animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-full bg-[#e8f5e9] border border-[#c8e6c9] flex items-center justify-center text-[#2e7d32] shadow-sm animate-bounce">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-background">Đăng ký thành công!</h3>
            <div className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Hồ sơ đăng ký của <span className="font-semibold text-on-background">{fullName}</span> đã được ghi nhận. Hãy chờ phía thông báo nhé!
            </div>
            <div className="p-sm bg-surface-variant/30 rounded-lg text-left text-body-sm text-on-surface-variant space-y-1 w-full max-w-md">
              <p>📍 **Giải đấu:** {tournamentTitle}</p>
              <p>🏸 **Nội dung:** {category} (Trình độ A: {level})</p>
              {isDoubleCategory && (
                <>
                  <p>👥 **Đồng đội:** {partnerName} ({partnerPhone})</p>
                  <p>💪 **Trình độ đồng đội:** {partnerLevel}</p>
                </>
              )}
              <p>💰 **Lệ phí:** {fee}</p>
            </div>
            <p className="text-[12px] text-on-surface-variant max-w-sm">
              Ban tổ chức sẽ kiểm tra giao dịch và phê duyệt hồ sơ của bạn trong vòng 24 giờ. Cảm ơn bạn!
            </p>
            <button 
              onClick={onClose}
              className="w-full max-w-xs bg-primary text-on-primary font-label-md py-3 rounded-lg hover:bg-surface-tint transition-all active:scale-95 shadow-sm"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Progress Stepper */}
            <div className="px-md md:px-lg pt-md pb-xs">
              <div className="flex justify-between items-center mb-sm">
                <span className="font-label-md text-label-md text-primary font-bold">Bước {step} trên 3</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {step === 1 && 'Thông tin liên hệ'}
                  {step === 2 && 'Chi tiết thi đấu'}
                  {step === 3 && 'Lệ phí & Thanh toán'}
                </span>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto p-md md:p-lg space-y-md custom-scrollbar">
              
              {/* Step 1: Contact Info */}
              {step === 1 && (
                <div className="space-y-md animate-in fade-in-50 duration-150">
                  <div className="p-sm bg-primary/5 text-primary border border-primary/10 rounded-lg flex items-start gap-sm">
                    <span className="material-symbols-outlined text-[20px] mt-0.5">info</span>
                    <span className="font-body-sm text-body-sm">
                      Dữ liệu liên hệ được lấy tự động từ tài khoản của bạn để rút ngắn thời gian điền.
                    </span>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Họ và tên *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Số điện thoại *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="VD: 0905123456"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Email *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="VD: an.nguyen@email.com"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Category & Skill */}
              {step === 2 && (
                <div className="space-y-md animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Nội dung đăng ký *</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="Đơn Nam">Đơn Nam</option>
                          <option value="Đơn Nữ">Đơn Nữ</option>
                          <option value="Đôi Nam">Đôi Nam</option>
                          <option value="Đôi Nữ">Đôi Nữ</option>
                          <option value="Đôi Nam Nữ">Đôi Nam Nữ</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Trình độ tự đánh giá (VĐV A) *</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                          value={level}
                          onChange={(e) => setLevel(e.target.value)}
                        >
                          {allowedLevels.map(lvl => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>

                  {/* Partner fields - only show if it's double category */}
                  {isDoubleCategory && (
                    <div className="p-md bg-surface-container rounded-xl border border-outline-variant/30 space-y-md animate-in slide-in-from-top duration-200">
                      <h4 className="font-label-md text-label-md text-primary font-bold border-b border-outline-variant pb-xs flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        Thông tin đồng đội (Partner)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                        <div>
                          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Họ tên đồng đội *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="VD: Trần Văn B"
                            className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            value={partnerName}
                            onChange={(e) => setPartnerName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Số điện thoại đồng đội *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="VD: 0905999999"
                            className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            value={partnerPhone}
                            onChange={(e) => setPartnerPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface-variant mb-xs">Trình độ đồng đội (VĐV B) *</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-surface border border-outline-variant rounded-lg px-md py-sm font-body-md text-body-md text-on-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                            value={partnerLevel}
                            onChange={(e) => setPartnerLevel(e.target.value)}
                          >
                            {allowedLevels.map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-md animate-in fade-in-50 duration-150">
                  <div className="text-center space-y-sm">
                    <p className="font-label-md text-label-md text-on-surface-variant">LỆ PHÍ ĐĂNG KÝ CẦN THANH TOÁN</p>
                    <div className="font-headline-lg text-headline-lg font-bold text-primary">{fee}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md items-center border border-outline-variant/30 rounded-xl p-md bg-surface-container-lowest">
                    <div className="flex flex-col items-center justify-center">
                      <div className="border border-outline-variant/60 p-sm rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <img 
                          src={qrUrl} 
                          alt="VietQR Chuyển khoản"
                          className="w-40 h-40 md:w-48 md:h-48 object-contain" 
                        />
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-2">Quét mã QR để chuyển khoản nhanh</span>
                    </div>

                    <div className="space-y-sm font-body-sm text-body-sm text-on-surface-variant">
                      <div className="font-semibold text-on-background border-b border-outline-variant pb-xs flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px] text-secondary">account_balance</span>
                        Thông tin chuyển khoản
                      </div>
                      <p>🏦 **Ngân hàng:** MB Bank (Ngân hàng Quân Đội)</p>
                      <p>👤 **Tên TK:** COURTMATE SPORTS</p>
                      <p>🔢 **Số tài khoản:** 123456789</p>
                      <p>📝 **Nội dung:** <span className="font-mono bg-surface px-1.5 py-0.5 rounded border border-outline-variant font-bold text-on-background text-[12px]">{`DK TOURNAMENT ${tournamentId} ${phone}`}</span></p>
                      <div className="p-xs bg-error-container/20 text-error border border-error-container/20 rounded text-[11px] leading-tight">
                        * Bạn vui lòng ghi đúng nội dung chuyển khoản để hệ thống tự động nhận diện và duyệt hồ sơ nhanh chóng.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-md border-t border-outline-variant/30 bg-surface-container-lowest">
                {step > 1 ? (
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="px-lg py-3 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-variant transition-colors"
                  >
                    Quay lại
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button 
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!fullName || !phone || !email)) ||
                      (step === 2 && isDoubleCategory && (!partnerName.trim() || !partnerPhone.trim()))
                    }
                    className="px-lg py-3 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:bg-surface-tint transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Tiếp tục
                  </button>
                ) : (
                  <button 
                    type="submit"
                    className="px-lg py-3 rounded-lg font-label-md text-label-md bg-secondary text-on-secondary hover:bg-secondary/90 transition-all active:scale-95 shadow-sm"
                  >
                    Hoàn tất đăng ký
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
