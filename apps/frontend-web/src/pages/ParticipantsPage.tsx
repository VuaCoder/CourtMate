import React, { useState } from 'react';

export default function ParticipantsPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Dữ liệu giả lập
  const participants = [
    { id: 1, name: 'Nguyễn Văn An', phone: '0901234567', email: 'an.nguyen@email.com', tournament: 'Giải Vô địch Quận Hải Châu', category: 'Đơn Nam', status: 'approved', date: '12 Th9 2024' },
    { id: 2, name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@email.com', tournament: 'Giải Cầu lông Đà Nẵng', category: 'Đôi Nữ', status: 'pending', date: '13 Th9 2024' },
    { id: 3, name: 'Lê Hoàng Tâm', phone: '0923456789', email: 'tam.le@email.com', tournament: 'Giải Vô địch Quận Hải Châu', category: 'Đôi Nam', status: 'rejected', date: '10 Th9 2024' },
    { id: 4, name: 'Phạm Ngọc Mai', phone: '0934567890', email: 'mai.pham@email.com', tournament: 'Series Cầu lông Mùa đông', category: 'Đơn Nữ', status: 'approved', date: '14 Th9 2024' },
    { id: 5, name: 'Vũ Quốc Bảo', phone: '0945678901', email: 'bao.vu@email.com', tournament: 'Giải Cầu lông Đà Nẵng', category: 'Đôi Nam Nữ', status: 'pending', date: '15 Th9 2024' },
  ];

  const filteredParticipants = activeTab === 'all' 
    ? participants 
    : participants.filter(p => p.status === activeTab);

  return (
    <>
      <header className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-xs">Vận động viên</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Quản lý danh sách đăng ký và trạng thái duyệt hồ sơ của các vận động viên.</p>
      </header>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
        <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/30 flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-on-surface-variant uppercase tracking-wider mb-1">Tổng cộng</span>
          <span className="font-headline-md font-bold text-on-surface">1,248</span>
        </div>
        <div className="bg-[#e8f5e9] p-md rounded-xl border border-[#c8e6c9] flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-[#2e7d32] uppercase tracking-wider mb-1">Đã duyệt</span>
          <span className="font-headline-md font-bold text-[#1b5e20]">986</span>
        </div>
        <div className="bg-tertiary-container/30 p-md rounded-xl border border-tertiary-container flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-tertiary uppercase tracking-wider mb-1">Chờ duyệt</span>
          <span className="font-headline-md font-bold text-tertiary">215</span>
        </div>
        <div className="bg-error-container/30 p-md rounded-xl border border-error-container flex flex-col justify-center items-center text-center shadow-sm">
          <span className="font-label-md text-error uppercase tracking-wider mb-1">Từ chối</span>
          <span className="font-headline-md font-bold text-error">47</span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/40 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'all' ? 'bg-surface-variant text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              onClick={() => setActiveTab('all')}
            >Tất cả</button>
            <button 
              className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'pending' ? 'bg-tertiary-container text-on-tertiary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              onClick={() => setActiveTab('pending')}
            >Chờ duyệt</button>
            <button 
              className={`px-4 py-2 rounded-lg font-label-md transition-colors ${activeTab === 'approved' ? 'bg-[#e8f5e9] text-[#2e7d32] font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
              onClick={() => setActiveTab('approved')}
            >Đã duyệt</button>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
              <input type="text" placeholder="Tìm tên, SĐT..." className="w-full pl-9 pr-3 py-2 text-sm bg-surface rounded-lg border border-outline-variant focus:border-primary outline-none" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant transition-colors font-label-md shadow-sm">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Lọc
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant transition-colors font-label-md shadow-sm" title="Xuất CSV">
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-surface-container/50">
              <tr className="border-b border-outline-variant/40 text-on-surface-variant font-label-md uppercase tracking-wider text-xs">
                <th className="py-3 px-5 font-semibold w-12"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></th>
                <th className="py-3 px-4 font-semibold">Vận động viên</th>
                <th className="py-3 px-4 font-semibold">Liên hệ</th>
                <th className="py-3 px-4 font-semibold">Giải đấu & Nội dung</th>
                <th className="py-3 px-4 font-semibold">Ngày ĐK</th>
                <th className="py-3 px-4 font-semibold">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-on-surface bg-surface-container-lowest">
              {filteredParticipants.map(p => (
                <tr key={p.id} className="border-b border-outline-variant/20 hover:bg-surface-variant/30 transition-colors group">
                  <td className="py-4 px-5"><input type="checkbox" className="rounded text-primary focus:ring-primary" /></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                        {p.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-on-background">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="material-symbols-outlined text-[14px]">call</span> {p.phone}</span>
                      <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="material-symbols-outlined text-[14px]">mail</span> {p.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-on-surface">{p.tournament}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-surface-container text-on-surface-variant text-[11px] uppercase font-bold">{p.category}</span>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant">{p.date}</td>
                  <td className="py-4 px-4">
                    {p.status === 'approved' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]"><span className="material-symbols-outlined text-[12px]">check_circle</span> Đã duyệt</span>}
                    {p.status === 'pending' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-tertiary-container/50 text-tertiary border border-tertiary/20"><span className="material-symbols-outlined text-[12px]">schedule</span> Chờ duyệt</span>}
                    {p.status === 'rejected' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-error-container/50 text-error border border-error/20"><span className="material-symbols-outlined text-[12px]">cancel</span> Từ chối</span>}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.status === 'pending' && (
                        <>
                          <button className="p-1.5 rounded bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9] transition-colors" title="Duyệt"><span className="material-symbols-outlined text-[18px]">done</span></button>
                          <button className="p-1.5 rounded bg-error-container text-error hover:bg-error-container/80 transition-colors" title="Từ chối"><span className="material-symbols-outlined text-[18px]">close</span></button>
                        </>
                      )}
                      <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors ml-1" title="Xem chi tiết"><span className="material-symbols-outlined text-[18px]">visibility</span></button>
                      <button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors" title="Thêm thao tác"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/40 bg-white/40 flex justify-between items-center text-sm text-on-surface-variant">
          <div>Hiển thị 1-5 trên tổng 1,248</div>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-surface-variant disabled:opacity-50" disabled><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold">1</button>
            <button className="w-8 h-8 rounded-full hover:bg-surface-variant">2</button>
            <button className="w-8 h-8 rounded-full hover:bg-surface-variant">3</button>
            <span>...</span>
            <button className="w-8 h-8 rounded-full hover:bg-surface-variant">10</button>
            <button className="p-1 rounded hover:bg-surface-variant"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
      </div>
    </>
  );
}
