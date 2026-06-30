import React, { useEffect } from 'react';

interface TournamentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle?: string;
}

export default function TournamentDetailsModal({ isOpen, onClose, postTitle }: TournamentDetailsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-on-background/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[1200px] h-full max-h-[90vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors shadow-lg backdrop-blur-sm"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-margin-mobile md:p-margin-desktop">
          
          {/* Hero Banner */}
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden relative shadow-sm mb-lg">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDz74r7LMJvJsv45kuE26KsJd_vfI5mPpwNDwP0CgeEj-InDN-io7VYoVbmnivYfdxQZFu689Dv0WU6Ecy2IRGWexVqKWrRD92RQl6ENHTDOyaJq8IgCX0yLcFsmuccz03tH1gsb-BL7UgeXkRf5NhKocp3RO8VELppJzKYJxaSMYsIQRKst9N4xLzmgKhOZxhbJKTBCf_83XsTwL2qIGV3toIxWG9vaLlkwVnhUMWdj6BOw-XkhEgEmw")' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-lg w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-sm">
                <div>
                  <div className="inline-flex items-center bg-primary-container/90 backdrop-blur-sm text-on-primary-container px-3 py-1 rounded-full font-label-md text-label-md mb-sm">
                    <span className="material-symbols-outlined text-[14px] mr-1" style={{ fontVariationSettings: '"FILL" 1' }}>calendar_month</span>
                    05/07/2026
                  </div>
                  <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-white font-bold mb-xs">
                    {postTitle || 'Giải Cầu lông Đơn nam Đà Nẵng Open 2024'}
                  </h1>
                  <p className="font-body-md text-body-md text-surface-variant flex items-center">
                    <span className="material-symbols-outlined text-[16px] mr-2">location_on</span>
                    Cung Thể thao Tiên Sơn, Quận Hải Châu, Đà Nẵng
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-surface-container/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-lg font-label-md text-label-md">Cầu lông (Badminton)</span>
                  <span className="bg-surface-container/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-lg font-label-md text-label-md">Trình độ Yếu - Khá</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative">
            
            {/* Left Column: Information */}
            <div className="lg:col-span-8 space-y-lg">
              
              {/* Info Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                
                {/* Organizer Info */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-sm">
                  <h2 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">group</span>
                    Ban tổ chức
                  </h2>
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv6Ql7dI-EkYmnoC4ErgUM9uTHyFcAKSPZOlHO3OinQ4vJ0Xjmx7uG8El8H7Ehx7P5ItAXMYVVN06-zJUej17iYuQhbZSn8YevZBtUBT3h41FZBSNFRzWgGgn3GDf2juRImrV7M971Zr9EEpmdKlVph1QlqxUFPaLkrcBT8YnK2JyEzQ-9PRP3HON6fNfi-iXeJl49qHfw5OeqPjLRmMJ-Sgin67yOnuVu9wxeubCWoNW4YkwE65z6PQ" alt="Organizer" />
                    </div>
                    <div>
                      <h3 className="font-label-md text-label-md text-on-surface">Vietnam Tennis Association</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">4.8 ★ (120 Đánh giá)</p>
                    </div>
                  </div>
                </div>

                {/* Prizes */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-sm">
                  <h2 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-secondary">emoji_events</span>
                    Giải thưởng
                  </h2>
                  <ul className="space-y-sm font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex justify-between items-center"><span className="font-bold text-on-surface">Vô địch:</span> <span>10,000,000 VND + Cúp</span></li>
                    <li className="flex justify-between items-center"><span className="font-bold text-on-surface">Hạng nhì:</span> <span>5,000,000 VND + Huy chương</span></li>
                    <li className="flex justify-between items-center"><span className="font-bold text-on-surface">Hạng ba:</span> <span>2,000,000 VND</span></li>
                  </ul>
                </div>

                {/* Schedule */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-sm md:col-span-2">
                  <h2 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    Lịch thi đấu
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
                    <div className="bg-surface p-sm rounded-lg border border-outline-variant/30">
                      <div className="font-label-md text-label-md text-primary mb-1">15 Th10 - Vòng loại</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Vòng bảng bắt đầu lúc 08:00 Sáng trên 8 sân.</div>
                    </div>
                    <div className="bg-surface p-sm rounded-lg border border-outline-variant/30">
                      <div className="font-label-md text-label-md text-primary mb-1">18 Th10 - Tứ kết/Bán kết</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Các vòng loại trực tiếp bắt đầu từ 09:00 Sáng.</div>
                    </div>
                    <div className="bg-surface p-sm rounded-lg border border-outline-variant/30">
                      <div className="font-label-md text-label-md text-primary mb-1">20 Th10 - Chung kết</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Chung kết sự kiện chính lúc 14:00 Chiều sau đó là lễ trao giải.</div>
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-sm md:col-span-2">
                  <h2 className="font-title-lg text-title-lg text-on-surface mb-md flex items-center gap-2 border-b border-outline-variant/30 pb-2">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                    Điều lệ
                  </h2>
                  <div className="prose prose-sm text-on-surface-variant max-w-none font-body-sm text-body-sm">
                    <p>Tất cả các trận đấu sẽ tuân theo luật ITF chuẩn. Vận động viên phải có mặt 30 phút trước giờ thi đấu theo lịch. Quy tắc xử thua sau 10 phút vắng mặt sẽ được áp dụng. Các trận đấu thi đấu 3 ván thắng 2, với tiebreak 10 điểm cho ván thứ ba ở các vòng đầu.</p>
                  </div>
                </div>

              </div>

              {/* Participants Table */}
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-sm">
                <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-2">
                  <h2 className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">groups</span>
                    Danh sách vận động viên
                  </h2>
                  <span className="bg-surface-container px-3 py-1 rounded-full font-label-md text-label-md text-on-surface">24/32 Đã đăng ký</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/50">
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant">VĐV</th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant">Trình độ</th>
                        <th className="py-2 px-3 font-label-md text-label-md text-on-surface-variant">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      <tr className="border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2 font-bold text-on-surface">
                          <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-md">NG</div>
                          Nguyen Tran
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">4.0</td>
                        <td className="py-3 px-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">ĐÃ XÁC NHẬN</span>
                        </td>
                      </tr>
                      <tr className="border-b border-outline-variant/20 hover:bg-surface-container/30 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2 font-bold text-on-surface">
                          <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md">LM</div>
                          Le Minh
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">4.5</td>
                        <td className="py-3 px-3">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">ĐÃ XÁC NHẬN</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container/30 transition-colors">
                        <td className="py-3 px-3 flex items-center gap-2 font-bold text-on-surface">
                          <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md">TD</div>
                          Tran Duy
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant">3.5</td>
                        <td className="py-3 px-3">
                          <span className="bg-outline/20 text-on-surface-variant px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">ĐANG CHỜ</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Sticky Registration Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-md bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-lg flex flex-col gap-md">
                <div className="border-b border-outline-variant/30 pb-sm">
                  <div className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Lệ phí thi đấu</div>
                  <div className="font-headline-lg text-headline-lg font-bold text-on-surface flex items-baseline gap-1">
                    500k <span className="font-body-md text-body-md text-on-surface-variant font-normal">VND</span>
                  </div>
                </div>
                <div className="space-y-sm">
                  <div className="flex justify-between items-center font-body-sm text-body-sm">
                    <span className="text-on-surface-variant">Hạn đăng ký:</span>
                    <span className="font-semibold text-on-surface">10 Th10, 2023</span>
                  </div>
                  <div className="flex justify-between items-center font-body-sm text-body-sm">
                    <span className="text-on-surface-variant">Số suất còn lại:</span>
                    <span className="font-semibold text-primary">8 suất</span>
                  </div>
                  {/* Progress Bar for slots */}
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-primary h-full w-[75%] rounded-full"></div>
                  </div>
                </div>
                <button className="w-full bg-secondary text-on-secondary font-label-md text-label-md py-3 rounded-lg hover:bg-secondary/90 transition-colors active:scale-95 flex items-center justify-center gap-2">
                  Đăng ký ngay
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <p className="text-[11px] text-center text-on-surface-variant mt-2">
                  Bằng việc đăng ký, bạn đồng ý với Điều lệ Giải đấu & Điều khoản.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
