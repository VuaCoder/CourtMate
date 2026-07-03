import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HOST_EVENTS } from '../data/hostEvents';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const event = HOST_EVENTS.find((item) => item.id === eventId) || HOST_EVENTS[0];

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

  const eventParticipants = useMemo(() => {
    const mockParts = event.participants.map((p) => ({
      name: p.name,
      level: p.level,
      status: p.status === 'confirmed' ? 'confirmed' : 'pending'
    }));

    const tId = event.id === 'danang-open-2026' ? 1 : event.id === 'summer-club-cup-2026' ? 2 : 3;
    const realParts = registrations
      .filter((r) => r.tournamentId === tId)
      .map((r) => ({
        name: r.name,
        level: r.level,
        status: r.status === 'approved' ? 'confirmed' : 'pending'
      }));

    return [...realParts, ...mockParts];
  }, [event, registrations]);

  return (
    <div className="space-y-xl animate-fade-in-up">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay lại dashboard
          </Link>
          <h1 className="mt-3 font-headline-lg text-headline-lg font-bold text-on-background">{event.title}</h1>
          <p className="text-on-surface-variant mt-1">{event.description}</p>
        </div>
        <Link to="/tournaments?scope=my" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold">
          Xem danh sách giải của tôi
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
        <div className="xl:col-span-8 space-y-lg">
          <section className="glass-card rounded-[28px] p-lg">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary-container/50 text-primary text-sm font-semibold">{event.status}</span>
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-semibold">{event.date}</span>
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-semibold">{event.venue}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/70 p-4 border border-outline-variant/40">
                <p className="text-sm text-on-surface-variant">Tỉ lệ lấp đầy</p>
                <p className="text-2xl font-bold text-on-background mt-1">{event.progress}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 border border-outline-variant/40">
                <p className="text-sm text-on-surface-variant">Số lượng</p>
                <p className="text-2xl font-bold text-on-background mt-1">{event.capacity}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 border border-outline-variant/40">
                <p className="text-sm text-on-surface-variant">Ban tổ chức</p>
                <p className="text-lg font-semibold text-on-background mt-1">{event.hostName}</p>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[28px] p-lg">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background mb-4">Lịch vận hành</h2>
            <div className="space-y-3">
              {event.schedule.map((item) => (
                <div key={`${item.time}-${item.title}`} className="flex gap-4 items-start">
                  <div className="min-w-16 text-sm font-bold text-primary">{item.time}</div>
                  <div className="flex-1 pb-3 border-b border-outline-variant/40 last:border-b-0 last:pb-0">
                    <p className="font-semibold text-on-background">{item.title}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[28px] p-lg">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background mb-4">Giải thưởng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {event.prize.map((item) => (
                <div key={item} className="rounded-2xl bg-white/70 p-4 border border-outline-variant/40 text-sm text-on-background">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="xl:col-span-4 space-y-lg">
          <section className="glass-card rounded-[28px] p-lg">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background mb-4">Danh sách VĐV</h2>
            <div className="space-y-3">
              {eventParticipants.map((p, idx) => (
                <div key={`${p.name}-${idx}`} className="rounded-2xl bg-white/70 p-4 border border-outline-variant/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-on-background">{p.name}</p>
                      <p className="text-sm text-on-surface-variant mt-1">Trình độ: {p.level}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${p.status === 'confirmed' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-tertiary-container/50 text-tertiary'}`}>
                      {p.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[28px] p-lg">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background mb-4">Thao tác nhanh</h2>
            <div className="space-y-3">
              <button className="w-full rounded-2xl bg-primary text-on-primary py-3 font-semibold">Chỉnh sửa sự kiện</button>
              <button className="w-full rounded-2xl bg-white/80 border border-outline-variant/50 py-3 font-semibold text-on-background">Xuất danh sách</button>
              <button className="w-full rounded-2xl bg-white/80 border border-outline-variant/50 py-3 font-semibold text-on-background">Gửi thông báo</button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
