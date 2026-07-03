const athletes = [
  { name: 'Nguyen Tran', tournament: 'Da Nang Open Badminton 2026', level: '4.0', status: 'Đã xác nhận' },
  { name: 'Le Minh', tournament: 'Summer Club Cup 2026', level: '4.5', status: 'Đã xác nhận' },
  { name: 'Sarah Jenkins', tournament: 'Friendly Mix Doubles', level: '3.5', status: 'Đã xác nhận' },
];

export default function HostConfirmedAthletesPage() {
  return (
    <main className="space-y-lg">
      <header>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-xs">Vận động viên đã xác nhận</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Danh sách vận động viên đã được duyệt và sẵn sàng thi đấu.</p>
      </header>

      <section className="grid grid-cols-1 gap-md">
        {athletes.map((item) => (
          <article key={`${item.name}-${item.tournament}`} className="glass-card rounded-[24px] p-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">{item.name}</h2>
                <p className="text-sm text-on-surface-variant mt-1">{item.tournament}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] font-semibold">Confirmed</span>
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant">Trình độ: {item.level}</span>
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant">{item.status}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
