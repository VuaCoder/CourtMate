import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type InfoCardProps = {
  icon: string;
  label: string;
  value: string;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-outline-variant/70 bg-surface-container-low/50 p-4">
      <div className="flex items-center gap-2 text-on-surface-variant mb-1">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
      </div>
      <div className="font-semibold text-on-surface text-base">{value}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-outline-variant/60 bg-surface/80 backdrop-blur-sm p-5 md:p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-on-surface">{title}</h2>
        <p className="text-sm md:text-base text-on-surface-variant mt-1">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  const { userName, email, logout } = useAuth();
  const navigate = useNavigate();

  const joinedDate = '03/07/2026';

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xoá tài khoản của mình không? Hành động này không thể hoàn tác.');
    if (!confirmed) return;

    window.dispatchEvent(new CustomEvent('courtmate_toast', {
      detail: {
        type: 'success',
        message: 'Tài khoản đã được xoá khỏi phiên hiện tại.'
      }
    }));
    logout();
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-background text-on-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="mb-6">
          <p className="text-sm text-on-surface-variant">Tìm đồng đội chơi thể thao.</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-black tracking-tight text-on-surface">Hồ sơ người dùng</h1>
        </div>

        <SectionCard title="Thông tin tổng quan" subtitle="Xem nhanh trạng thái tài khoản của bạn.">
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-5">
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant/70 bg-surface-container-low shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0f172a&color=fff&size=256`}
                  alt="Avatar người dùng"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-on-surface">{userName}</h2>
                <p className="text-on-surface-variant mt-1">{email || 'Chưa cập nhật email'}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-[#0f7a2f]/20 text-[#3ddc84] text-sm font-semibold">Người dùng</span>
                  <span className="px-3 py-1 rounded-full bg-[#0f7a2f]/20 text-[#3ddc84] text-sm font-semibold">Đang hoạt động</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InfoCard icon="group" label="Người theo dõi" value="0" />
              <InfoCard icon="person" label="Đang theo dõi" value="0" />
              <InfoCard icon="event_available" label="Tham gia" value={joinedDate} />
              <InfoCard icon="schedule" label="Cập nhật" value={joinedDate} />
            </div>
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <SectionCard title="Thông tin cá nhân" subtitle="Chỉnh sửa tên hiển thị và ảnh đại diện của bạn.">
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold text-on-surface mb-2">Tên hiển thị</span>
                <input
                  defaultValue={userName}
                  className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold text-on-surface mb-2">Địa chỉ</span>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: 123 Nguyễn Văn Cừ, Quận 5, TP.HCM"
                  className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-semibold text-on-surface mb-2">Giới tính</span>
                <select className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary">
                  <option>Chưa xác định</option>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </label>

              <button className="w-full rounded-xl bg-on-surface text-surface py-3 font-semibold hover:opacity-90 transition-opacity">
                Lưu thay đổi
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Thông tin liên hệ" subtitle="Cập nhật số điện thoại và địa chỉ để mọi người dễ liên lạc.">
            <div className="space-y-4">
              <label className="block">
                <span className="block text-sm font-semibold text-on-surface mb-2">Số điện thoại</span>
                <input
                  placeholder="VD: 0987 654 321"
                  className="w-full rounded-xl border border-outline-variant/70 bg-surface-container-low px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <div className="rounded-2xl border border-dashed border-outline-variant/70 p-4 bg-surface-container-low/40">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-on-surface">Liên hệ bổ sung</p>
                    <p className="text-sm text-on-surface-variant mt-1">Chưa có liên hệ nào.</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant/80 px-4 py-2 text-sm font-semibold hover:bg-surface-variant/40 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Thêm liên hệ
                  </button>
                </div>
              </div>

              <button className="w-full rounded-xl bg-on-surface text-surface py-3 font-semibold hover:opacity-90 transition-opacity">
                Lưu thông tin liên hệ
              </button>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Thông tin tài khoản" subtitle="Những trường này được đồng bộ với tài khoản đăng nhập của bạn.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon="verified_user" label="Vai trò" value="Người dùng" />
            <InfoCard icon="phone" label="Số điện thoại" value="Chưa cập nhật" />
            <InfoCard icon="location_on" label="Địa chỉ" value="Chưa cập nhật" />
            <InfoCard icon="calendar_today" label="Ngày tạo" value={joinedDate} />
          </div>
        </SectionCard>

        <SectionCard title="Cài đặt quyền riêng tư" subtitle="Quản lý các thiết lập bảo mật và quyền riêng tư của bạn.">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-on-surface">Danh sách người dùng đã chặn</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Quản lý những người chơi bạn đã chặn không cho tham gia các trận đấu do bạn tổ chức.
              </p>
            </div>
            <button className="rounded-full border border-outline-variant/80 px-4 py-2 font-semibold hover:bg-surface-variant/40 transition-colors">
              Quản lý
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Vùng nguy hiểm" subtitle="Xóa tài khoản sẽ đăng xuất và không thể hoàn tác từ giao diện này.">
          <div className="rounded-2xl border border-error/30 bg-error/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold text-error">Xóa tài khoản</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Hành động này sẽ loại bỏ tài khoản của bạn khỏi phiên hiện tại.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="rounded-full bg-error text-on-error px-5 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Xoá tài khoản
            </button>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
