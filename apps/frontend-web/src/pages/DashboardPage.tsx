import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HOST_EVENTS } from '../data/hostEvents';

const schedule = [
  { time: '08:30', title: 'Mở cổng check-in', meta: 'Da Nang Open Badminton 2026' },
  { time: '10:00', title: 'Bốc thăm vòng bảng', meta: 'Summer Club Cup 2026' },
  { time: '14:00', title: 'Chốt danh sách thi đấu', meta: 'Friendly Mix Doubles' },
  { time: '16:30', title: 'Gửi thông báo cho VĐV', meta: 'Tất cả sự kiện đang mở' },
];

const checklist = ['Kiểm tra sân bãi và khung giờ', 'Chốt danh sách trọng tài', 'Xuất danh sách bốc thăm', 'Gửi thông báo xác nhận cho VĐV'];
const recentActivity = ['Có 12 đăng ký mới trong 1 giờ qua.', 'Biểu mẫu giải đấu vừa được cập nhật thành công.', '3 vận động viên được duyệt vào bảng chính.', 'Một sự kiện đã chạm mốc 100% số lượng slot.'];

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<any[]>(() => {
    const saved = localStorage.getItem('courtmate_registrations');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('courtmate_registrations');
      if (saved) {
        setRegistrations(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const { pendingCount, approvedCount, approvalQueue } = useMemo(() => {
    const pending = registrations.filter((r) => r.status === 'pending');
    const approved = registrations.filter((r) => r.status === 'approved');
    
    // Map registrations queue to list
    const queue = pending.map((r) => ({
      id: r.id,
      name: r.name,
      event: r.tournament,
      time: r.date || 'Vừa xong',
      action: 'Chờ duyệt'
    }));

    // Fallback if empty to make the dashboard look nice
    if (queue.length === 0) {
      queue.push(
        { id: 1, name: 'Lê Minh Khoa', event: 'Da Nang Open Badminton 2026', time: '2 phút trước', action: 'Xác minh hồ sơ' },
        { id: 2, name: 'Nguyễn Thu Hà', event: 'Summer Club Cup 2026', time: '14 phút trước', action: 'Xét hạng mục đôi' },
        { id: 3, name: 'Alex Chen', event: 'Friendly Mix Doubles', time: '1 giờ trước', action: 'Chờ thanh toán' }
      );
    }

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      approvalQueue: queue.slice(0, 5)
    };
  }, [registrations]);

  const metrics = useMemo(() => {
    return [
      { key: 'events', label: 'Sự kiện đang quản lý', value: '3' },
      { key: 'pending', label: 'Đơn đăng ký chờ duyệt', value: String(pendingCount) },
      { key: 'athletes', label: 'Vận động viên đã xác nhận', value: String(approvedCount + 12) }, // base offset 12 for mock
      { key: 'fill', label: 'Tỉ lệ lấp đầy trung bình', value: '86%' },
    ];
  }, [pendingCount, approvedCount]);

  return (
    <div className="space-y-xl animate-fade-in-up">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-white to-primary-container/30 border border-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,104,95,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(33,150,243,0.12),transparent_30%)]" />
        <div className="relative p-lg md:p-xl flex flex-col xl:flex-row xl:items-end xl:justify-between gap-lg">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/60 text-primary text-sm font-semibold">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              Host dashboard
            </span>
            <h1 className="mt-4 font-headline-lg text-headline-lg md:text-[3rem] font-bold text-on-background leading-tight">
              Điều phối sự kiện, đăng ký và vận hành trong một màn hình duy nhất.
            </h1>
            <p className="mt-3 text-on-surface-variant max-w-2xl">
              Trung tâm điều hành cho host để theo dõi giải đấu, xử lý đơn chờ duyệt, kiểm soát lịch và mở từng sự kiện ở màn hình riêng.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/create-tournament" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-on-primary font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Tạo sự kiện
            </Link>
            <Link to="/host/tournaments" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/80 text-on-background border border-outline-variant/60 font-semibold hover:bg-white transition-all">
              <span className="material-symbols-outlined text-[20px]">emoji_events</span>
              Xem giải của tôi
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-lg">
        {metrics.map((metric, index) => {
          const href =
            metric.key === 'events'
              ? '/host/tournaments'
              : metric.key === 'pending'
                ? '/participants?status=pending'
                : metric.key === 'athletes'
                  ? '/participants?status=approved'
                  : '/host/tournaments';
          const icon = metric.key === 'events' ? 'event_available' : metric.key === 'pending' ? 'pending_actions' : metric.key === 'athletes' ? 'group' : 'bar_chart';
          return (
            <Link key={metric.key} to={href} className={`glass-card rounded-[28px] p-lg animate-fade-in-up delay-${Math.min((index + 1) * 100, 700)} hover:-translate-y-1 transition-transform`}>
              <div className="flex items-start justify-between gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metric.key === 'events' ? 'text-primary bg-primary-container/20' : metric.key === 'pending' ? 'text-secondary bg-secondary-container/20' : metric.key === 'athletes' ? 'text-tertiary bg-tertiary-container/20' : 'text-[#2e7d32] bg-[#eaf7ec]'}`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant">Click to open</span>
              </div>
              <div className="mt-6">
                <p className="text-sm text-on-surface-variant">{metric.label}</p>
                <h2 className="mt-1 text-[2rem] leading-none font-bold text-on-background">{metric.value}</h2>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
        <div className="xl:col-span-8 space-y-lg">
          <article className="glass-card rounded-[28px] p-lg">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">Sự kiện đang vận hành</h2>
                <p className="text-sm text-on-surface-variant mt-1">Bấm vào từng sự kiện để xem trang chi tiết.</p>
              </div>
              <Link to="/host/tournaments" className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary-container transition-colors">
                Xem tất cả
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="space-y-4">
              {HOST_EVENTS.map((event) => (
                <Link key={event.id} to={`/event/${event.id}`} className="rounded-2xl border border-outline-variant/50 bg-white/70 p-4 hover:bg-white transition-colors block">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-on-background">{event.title}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-container/50 text-primary font-semibold">{event.status}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1">{event.date} • {event.venue}</p>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <p className="text-xs text-on-surface-variant">Tỉ lệ lấp đầy</p>
                        <p className="font-semibold text-on-background">{event.capacity}</p>
                      </div>
                      <div className="w-36">
                        <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: event.progress }} />
                        </div>
                        <p className="text-xs text-on-surface-variant mt-2 text-right">{event.progress}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <article className="glass-card rounded-[28px] p-lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-background">Lịch hôm nay</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Những mốc vận hành cần xử lý trong ngày.</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary-container/40 text-secondary">Today</span>
              </div>
              <div className="space-y-4">
                {schedule.map((item) => (
                  <div key={`${item.time}-${item.title}`} className="flex gap-4 items-start">
                    <div className="min-w-16 text-sm font-bold text-primary">{item.time}</div>
                    <div className="flex-1 pb-4 border-b border-outline-variant/40 last:border-b-0 last:pb-0">
                      <p className="font-semibold text-on-background">{item.title}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-card rounded-[28px] p-lg">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-background">Checklist trước giải</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Bộ việc cần hoàn tất trước khi mở sân.</p>
                </div>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item} className="flex items-center gap-3 rounded-2xl border border-outline-variant/50 bg-white/70 px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 accent-[color:var(--color-primary)]" defaultChecked={item === 'Kiểm tra sân bãi và khung giờ'} />
                    <span className="text-sm text-on-background">{item}</span>
                  </label>
                ))}
              </div>
            </article>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-lg">
          <article className="glass-card rounded-[28px] p-lg">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">Hàng chờ duyệt</h2>
                <p className="text-sm text-on-surface-variant mt-1">Các yêu cầu cần phản hồi sớm.</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary-container/50 text-secondary">{pendingCount > 0 ? `${pendingCount} mới` : 'Mẫu'}</span>
            </div>
            <div className="space-y-3">
              {approvalQueue.map((item, idx) => (
                <div key={item.id || `${item.name}-${item.event}-${idx}`} className="rounded-2xl border border-outline-variant/50 bg-white/75 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-container/40 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-background truncate">{item.name}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{item.event}</p>
                      <p className="text-xs text-on-surface-variant mt-2">{item.time} • {item.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="glass-card rounded-[28px] p-lg">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Hoạt động gần đây</h2>
            <div className="mt-4 space-y-3">
              {recentActivity.map((item, index) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                  <p className="text-sm text-on-surface-variant">{index + 1}. {item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
