import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Tổng quan quản lý</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Chào mừng trở lại. Đây là cập nhật mới nhất hôm nay.</p>
        </div>
        <div className="flex gap-4">
          <button className="relative p-2 rounded-full bg-surface-container hover:bg-surface-variant transition-colors text-on-surface">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-surface-container"></span>
          </button>
          <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Tạo giải đấu mới
          </button>
        </div>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container/20 rounded-lg text-primary">
              <span className="material-symbols-outlined">emoji_events</span>
            </div>
            <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div>
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">Tổng giải đấu</h3>
            <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">24</p>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-container/20 rounded-lg text-secondary">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2 py-1 rounded-full">+5.4%</span>
          </div>
          <div>
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">Tổng vận động viên</h3>
            <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">1,248</p>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container/20 rounded-lg text-tertiary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="font-label-md text-label-md text-secondary bg-secondary-container/10 px-2 py-1 rounded-full">-2.1%</span>
          </div>
          <div>
            <h3 className="font-body-sm text-body-sm text-on-surface-variant">Doanh thu (YTD)</h3>
            <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">$42,500</p>
          </div>
        </div>
      </div>

      {/* Main Content Area: Table and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        {/* Active Tournaments Table */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-lg overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Giải đấu đang diễn ra</h2>
            <Link to="/tournaments" className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-1">
              Xem tất cả <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/50 text-on-surface-variant font-label-md text-label-md uppercase">
                  <th className="py-3 px-4 font-semibold">Tên giải đấu</th>
                  <th className="py-3 px-4 font-semibold">Trạng thái</th>
                  <th className="py-3 px-4 font-semibold">Vận động viên</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface">
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-on-background">Giải Cầu lông Đà Nẵng Mở rộng 2024</p>
                    <p className="text-on-surface-variant text-[12px] mt-0.5">15 Th8 - 20 Th8 • Sân trong nhà</p>
                  </td>
                  <td className="py-4 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-surface-container text-primary">Đang diễn ra</span></td>
                  <td className="py-4 px-4">64 / 64</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors" title="Xem"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors" title="Sửa"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors" title="Quản lý vận động viên"><span className="material-symbols-outlined text-[20px]">manage_accounts</span></button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-outline-variant/30 hover:bg-surface-container/50 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-semibold text-on-background">Giải Vô địch Quận Hải Châu</p>
                    <p className="text-on-surface-variant text-[12px] mt-0.5">10 Th9 - 12 Th9 • Sân thảm</p>
                  </td>
                  <td className="py-4 px-4"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#2e7d32]">Đang mở đăng ký</span></td>
                  <td className="py-4 px-4">32 / 48</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">manage_accounts</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Notification Center */}
        <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl p-lg flex flex-col h-full max-h-[500px]">
          <div className="flex justify-between items-center mb-md pb-2 border-b border-outline-variant/50">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Đăng ký gần đây</h2>
            <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-2 py-0.5 rounded-full">Mới</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container/50 transition-colors">
              <img alt="Player Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_NcKrexQFEBfQxfP_a4_sjsRo3kK7FVPac60uScC0x7c2bCecWRvO_uSKQ278pTBlSLAdBxf0debZx65JH0ylESrCRZ_4w_zFxwERL0KpBK3p8KsF346g0ss1kA5X4qpTletGTlihjgRg1y34FWRxiNA-Id_hCj4p3TpPFJg_OIW8Hf3YeYAuDQLUu-lIfGPSUB5z98ZuRSxWtugW172EJpv2aUZW_YZbY_jvrz_9y4g-0KOSJ0LjDQ" />
              <div>
                <p className="font-body-sm text-body-sm text-on-background"><span className="font-semibold">Alex Chen</span> đã đăng ký cho <span className="font-semibold">City Fall Classic</span></p>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">2 phút trước</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container/50 transition-colors">
              <img alt="Player Avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuFzkeVo2_rh0MxbcE95KD7osmE3WePAvlxVGJFI0A1CQpK2PKso2Gk6el6E6JrDI0kDfSdgGDqOk4oGpjy5iFOZ9oPKui52n0kjrGwcqzjwsi-M079BoptLrLQo_iAwQW5n1E3XWqsPqkJwYgszx0h40gKJk5nO2R4QI5ZyCmpNNxZfOcyWi8neBGqcyoYJU8Ab-XSFWhmoFkHT1Rdy1ORes8XLuowFb0Vpo6v4NrsP0jH56vFeGZSw" />
              <div>
                <p className="font-body-sm text-body-sm text-on-background"><span className="font-semibold">Sarah Jenkins</span> đã đăng ký cho <span className="font-semibold">City Fall Classic</span></p>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">1 giờ trước</p>
              </div>
            </div>
          </div>
          <Link to="/participants" className="w-full mt-4 pt-3 border-t border-outline-variant/50 text-center font-label-md text-label-md text-primary hover:text-primary-container transition-colors block">
            Xem toàn bộ hoạt động
          </Link>
        </div>
      </div>
    </>
  );
}
