import { Link } from 'react-router-dom';
import { HOST_EVENTS } from '../data/hostEvents';

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'Đang mở đăng ký':
      return 'bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]';
    case 'Chuẩn bị bốc thăm':
      return 'bg-[#e3f2fd] text-[#1565c0] border-[#bbdefb]';
    case 'Chờ duyệt nội dung':
      return 'bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]';
    default:
      return 'bg-surface-container-high text-on-surface border-outline-variant/30';
  }
};

export default function HostTournamentsPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-lg">
      <header className="mb-md">
        <h1 className="font-display-lg text-display-lg md:text-[48px] text-[32px] font-bold text-on-background mb-sm">
          Giải đấu của host
        </h1>
        <p className="text-on-surface-variant">Trang riêng cho host, không ảnh hưởng đến trang giải đấu chung.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
        {HOST_EVENTS.map((event) => (
          <Link key={event.id} to={`/event/${event.id}`} className="bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-md hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-title-lg text-title-lg font-bold text-on-background truncate" title={event.title}>{event.title}</h2>
                  <p className="text-sm text-on-surface-variant mt-1">{event.date}</p>
                </div>
                <span className={`text-[12px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap shrink-0 border ${getStatusClasses(event.status)}`}>
                  {event.status}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-4 line-clamp-2">{event.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm pt-3 border-t border-outline-variant/20">
              <span className="text-on-surface-variant truncate mr-2">{event.venue}</span>
              <span className="font-semibold text-primary whitespace-nowrap">{event.capacity}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
