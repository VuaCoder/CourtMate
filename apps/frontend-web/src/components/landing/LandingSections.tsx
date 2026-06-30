import React from 'react';
import { Link } from 'react-router-dom';

export function 
HeroSection() {
  return (
    <section id="hero" className="relative flex flex-col justify-center min-h-screen pt-[120px] pb-12">
      <div className="absolute top-0 left-0 w-full h-full z-[-1]" style={{ background: 'radial-gradient(circle at 20% 30%, rgba(0, 104, 95, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(169, 51, 73, 0.08) 0%, transparent 50%)' }}></div>
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-xl md:gap-xxl items-center w-full">
        <div className="space-y-lg z-10">
          <div className="inline-flex items-center px-md py-xs bg-primary-container/20 text-primary-container rounded-full gap-xs">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="font-label-md text-label-md">Đà Nẵng, Việt Nam</span>
          </div>
          <h1 className="font-display-lg text-display-lg md:text-[64px] md:leading-[72px] text-on-surface">
            Kết nối đam mê, <br/>
            <span className="text-primary">nâng tầm</span> trận đấu.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Nền tảng tổng hợp thông tin, tìm kiếm đồng đội và quản lý giải đấu cầu lông hàng đầu tại Đà Nẵng. Tham gia ngay để không bỏ lỡ bất kỳ trận đấu nào.
          </p>
          <div className="flex flex-wrap gap-md pt-md">
            <Link to="/signup" className="px-xxl py-md bg-primary text-on-primary font-title-lg text-title-lg rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-sm">
              Tham gia ngay
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="relative mt-8 md:mt-0">
          <div className="absolute -top-xxl -right-xxl w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] md:rotate-2 md:hover:rotate-0 transition-transform duration-500 max-h-[480px]">
            <img className="w-full h-auto aspect-[4/3] md:aspect-square lg:aspect-[4/3] object-cover" alt="Sân chơi cầu lông" src="https://cdn.shopvnb.com/uploads/images/tin_tuc/giai-giao-luu-cau-long-dong-doi-vnb-da-nang-1.webp"/>
            <div className="absolute bottom-md left-md right-md p-lg bg-white/70 backdrop-blur-md rounded-2xl flex items-center gap-md shadow-lg border border-white/40">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined">sports_tennis</span>
              </div>
              <div>
                <p className="font-title-lg text-title-lg font-bold text-on-surface">Cộng Đồng Cầu Lông Đà Nẵng</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant font-medium">Hơn 5,000 hội viên hoạt động</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlayersSection() {
  return (
    <section id="players" className="py-xxl bg-surface transition-all duration-1000 ease-out">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="text-center space-y-md mb-xxl">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Lợi Ích Dành Cho Người Chơi</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Tổng hợp mọi kèo đấu từ Facebook và các giải đấu hấp dẫn nhất tại địa phương.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-lg">
          <div className="p-lg bg-white rounded-2xl border border-outline-variant hover:border-primary transition-all group flex flex-col">
            <div className="w-14 h-14 bg-surface-container-low text-primary rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span className="material-symbols-outlined text-[32px]">groups</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-md">Tổng hợp tin tức Facebook</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-1">
              Tự động thu thập các bài đăng tìm đồng đội, lập kèo giao lưu từ các hội nhóm Facebook cầu lông Đà Nẵng.
            </p>
            <div className="h-48 rounded-xl overflow-hidden bg-surface-container-low mt-auto">
              <img className="w-full h-full object-cover" alt="Facebook Feed" src="https://fat.com.vn/wp-content/uploads/2021/07/Dich-vu-tong-hop-thong-tin-tai-chinh.jpg"/>
            </div>
          </div>
          
          <div className="p-lg bg-white rounded-2xl border border-outline-variant hover:border-primary transition-all group flex flex-col">
            <div className="w-14 h-14 bg-surface-container-low text-primary rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span className="material-symbols-outlined text-[32px]">travel_explore</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-md">Khám phá giải đấu</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-1">
              Dễ dàng tìm kiếm thông tin về các giải đấu đang diễn ra tại khu vực, từ phong trào đến bán chuyên.
            </p>
            <div className="h-48 rounded-xl overflow-hidden bg-surface-container-low mt-auto">
              <img className="w-full h-full object-cover" alt="Search Tournaments" src="https://lh7-us.googleusercontent.com/D3__OB2VEZKQCs6fJOduX17WkELdwpuSppRChXzkEeXpvVdx-GcE773A_2R5Y1zExHIkZzcRkix9KCzqM8xbr-JDW_S6adK7rqNQEvZwbCcBpisjR7ztRLHwrsBYePHAluBeGJ7aA95KzzvtDqMtiNo"/>
            </div>
          </div>
          
          <div className="p-lg bg-white rounded-2xl border border-outline-variant hover:border-primary transition-all group flex flex-col">
            <div className="w-14 h-14 bg-surface-container-low text-primary rounded-xl flex items-center justify-center mb-lg group-hover:bg-primary group-hover:text-on-primary transition-all">
              <span className="material-symbols-outlined text-[32px]">how_to_reg</span>
            </div>
            <h3 className="font-headline-md text-headline-md mb-md">Đăng ký tham gia</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-1">
              Ghi danh vào giải đấu chỉ với vài lượt chạm. Theo dõi lịch thi đấu và kết quả trực tiếp.
            </p>
            <div className="h-48 rounded-xl overflow-hidden bg-surface-container-low mt-auto">
              <img className="w-full h-full object-cover" alt="Registration" src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1949&auto=format&fit=crop"/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrganizersSection() {
  return (
    <section id="organizers" className="py-xxl relative overflow-hidden bg-inverse-surface text-on-primary-container transition-all duration-1000 ease-out">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10"></div>
      <div className="max-w-7xl mx-auto px-margin-desktop relative z-10">
        <div className="grid md:grid-cols-2 gap-xxl items-center">
          <div className="space-y-xl">
            <div className="space-y-md">
              <h2 className="font-display-lg text-display-lg text-white">Dành cho Ban tổ chức giải đấu</h2>
              <p className="font-body-lg text-body-lg text-surface-variant">
                Giải pháp quản lý giải đấu tinh gọn, giúp bạn tổ chức sự kiện thể thao chuyên nghiệp và dễ dàng truyền thông đến cộng đồng.
              </p>
            </div>
            <div className="space-y-lg">
              <div className="flex gap-md items-start">
                <div className="p-sm bg-primary-container rounded-lg text-white">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <h4 className="font-title-lg text-title-lg">Quảng bá giải đấu</h4>
                  <p className="font-body-md text-body-md text-surface-variant">Tiếp cận hàng nghìn thành viên trong cộng đồng. Tự động thông báo mở đăng ký trực tuyến.</p>
                </div>
              </div>
              <div className="flex gap-md items-start">
                <div className="p-sm bg-primary-container rounded-lg text-white">
                  <span className="material-symbols-outlined">dashboard</span>
                </div>
                <div>
                  <h4 className="font-title-lg text-title-lg">Quản lý chuyên nghiệp</h4>
                  <p className="font-body-md text-body-md text-surface-variant">Lên lịch thi đấu tự động, cập nhật kết quả và bảng xếp hạng theo thời gian thực.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-surface-container-lowest/5 backdrop-blur-xl border border-white/10 rounded-3xl p-lg shadow-2xl">
              <img className="w-full h-auto rounded-xl" alt="Mockup" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"/>
            </div>
            <div className="absolute -bottom-md -left-md glass-card p-md rounded-xl animate-bounce">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-label-md text-label-md text-on-surface">Công cụ tổ chức toàn diện</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CommunitySection() {
  return (
    <section className="py-xxl bg-white transition-all duration-1000 ease-out">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xxl text-center">
          <div className="space-y-sm">
            <div className="font-display-lg text-display-lg text-primary">5000+</div>
            <div className="font-headline-md text-headline-md text-on-surface">Vận động viên</div>
            <p className="font-body-md text-body-md text-on-surface-variant">Cộng đồng sôi nổi và ngày càng lớn mạnh tại Đà Nẵng.</p>
          </div>
          <div className="space-y-sm">
            <div className="font-display-lg text-display-lg text-secondary">200+</div>
            <div className="font-headline-md text-headline-md text-on-surface">Bài đăng mỗi ngày</div>
            <p className="font-body-md text-body-md text-on-surface-variant">Cập nhật liên tục tin tức và kèo giao lưu từ mạng xã hội.</p>
          </div>
          <div className="space-y-sm">
            <div className="font-display-lg text-display-lg text-primary">50+</div>
            <div className="font-headline-md text-headline-md text-on-surface">Giải đấu mỗi tháng</div>
            <p className="font-body-md text-body-md text-on-surface-variant">Được tổ chức và quản lý chuyên nghiệp thông qua nền tảng.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-xxl transition-all duration-1000 ease-out">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="bg-primary rounded-[32px] p-xxl text-center space-y-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none"></div>
          <h2 className="font-display-lg text-display-lg text-white relative z-10">Sẵn sàng kết nối cùng CourtMate?</h2>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-xl mx-auto relative z-10">
            Không bỏ lỡ bất kỳ thông tin nào từ cộng đồng cầu lông Đà Nẵng.
          </p>
          <div className="flex justify-center gap-md relative z-10">
            <Link to="/signup" className="px-xxl py-md bg-white text-primary font-headline-md text-headline-md rounded-2xl hover:bg-surface-container transition-colors active:scale-95">
              Tham gia ngay hôm nay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
