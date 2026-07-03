import { Link } from 'react-router-dom';
import { HOST_EVENTS } from '../data/hostEvents';

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
          <Link key={event.id} to={`/event/${event.id}`} className="bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-md hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">{event.title}</h2>
                <p className="text-sm text-on-surface-variant mt-1">{event.date}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-primary-container/50 text-primary font-semibold">{event.status}</span>
            </div>
            <p className="text-sm text-on-surface-variant mt-4">{event.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{event.venue}</span>
              <span className="font-semibold text-primary">{event.capacity}</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
