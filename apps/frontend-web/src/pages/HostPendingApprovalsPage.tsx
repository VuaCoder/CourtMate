const approvals = [
  { name: 'Lê Minh Khoa', event: 'Da Nang Open Badminton 2026', status: 'Thiếu xác minh CMND', time: '2 phút trước' },
  { name: 'Nguyễn Thu Hà', event: 'Summer Club Cup 2026', status: 'Chờ xác nhận hạng mục đôi', time: '14 phút trước' },
  { name: 'Alex Chen', event: 'Friendly Mix Doubles', status: 'Chờ thanh toán', time: '1 giờ trước' },
];

export default function HostPendingApprovalsPage() {
  return (
    <main className="space-y-lg">
      <header>
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-xs">Đơn đăng ký chờ duyệt</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Danh sách các đơn cần phản hồi từ ban tổ chức.</p>
      </header>

      <section className="grid grid-cols-1 gap-md">
        {approvals.map((item) => (
          <article key={`${item.name}-${item.event}`} className="glass-card rounded-[24px] p-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">{item.name}</h2>
                <p className="text-sm text-on-surface-variant mt-1">{item.event}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-tertiary-container/50 text-tertiary font-semibold">Pending</span>
            </div>
            <p className="mt-3 text-sm text-on-surface-variant">{item.status}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold">Duyệt</button>
              <button className="px-4 py-2 rounded-xl bg-white/80 border border-outline-variant/60 font-semibold text-on-background">Từ chối</button>
            </div>
            <p className="mt-3 text-xs text-on-surface-variant">{item.time}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
