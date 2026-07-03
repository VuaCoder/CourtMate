import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RegistrationFormModal from '../components/RegistrationFormModal';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'info' | 'bracket' | 'players'>('info');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Giả lập dữ liệu giải đấu
  const tournament = {
    id: id || '1',
    title: 'Giải Cầu Lông Đà Nẵng Open 2026',
    organizer: 'CLB Đà Nẵng Open',
    coverImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200&h=400',
    sport: 'badminton',
    sportLabel: 'Cầu lông',
    status: 'Đang mở đăng ký',
    dateRange: '05/07/2026 - 10/07/2026',
    location: 'Cung Thể Thao Tiên Sơn, Đà Nẵng',
    fee: '500.000 VNĐ / người',
    maxParticipants: 64,
    currentParticipants: 42,
    rules: [
      'Giải đấu áp dụng luật thi đấu cầu lông hiện hành của Liên đoàn Cầu lông Thế giới (BWF).',
      'Thể thức thi đấu: Đơn nam, Đơn nữ, Đôi nam, Đôi nam nữ.',
      'Mỗi trận đấu gồm 3 ván, chạm 21 điểm (vòng bảng) và chạm 31 điểm (vòng loại trực tiếp).',
      'Vận động viên phải có mặt trước giờ thi đấu 15 phút. Quá giờ 10 phút sẽ bị xử thua cuộc.'
    ],
    prizes: [
      { rank: 'Giải Nhất', value: '10.000.000 VNĐ + Cúp vô địch + Huy chương Vàng' },
      { rank: 'Giải Nhì', value: '5.000.000 VNĐ + Huy chương Bạc' },
      { rank: 'Giải Ba', value: '2.000.000 VNĐ + Huy chương Đồng' }
    ]
  };

  const players = [
    { rank: 1, name: 'Nguyễn Tiến Minh', clb: 'CLB Hải Châu', seed: 'Hạt giống số 1', status: 'Đã xác nhận' },
    { rank: 2, name: 'Lê Đức Phát', clb: 'CLB Quân Đội', seed: 'Hạt giống số 2', status: 'Đã xác nhận' },
    { rank: 3, name: 'Nguyễn Hải Đăng', clb: 'CLB TP.HCM', seed: 'Hạt giống số 3', status: 'Đã xác nhận' },
    { rank: 4, name: 'Phạm Cao Cường', clb: 'CLB Tiên Sơn', seed: 'Hạt giống số 4', status: 'Đã xác nhận' },
    { rank: 5, name: 'Vũ Thị Trang', clb: 'CLB Bắc Giang', seed: 'Không xếp hạng', status: 'Đã xác nhận' },
    { rank: 6, name: 'Nguyễn Thùy Linh', clb: 'CLB Đồng Nai', seed: 'Không xếp hạng', status: 'Đã xác nhận' }
  ];

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      {/* Nút quay lại */}
      <button 
        onClick={() => navigate('/tournaments')}
        className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-md transition-colors font-label-md text-label-md"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Quay lại Bảng tin
      </button>

      {/* Banner Giải Đấu */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-outline-variant/30 h-[220px] md:h-[320px] mb-lg bg-surface-container-low">
        <img 
          src={tournament.coverImage} 
          alt={tournament.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-md md:p-xl w-full flex flex-col md:flex-row md:items-end justify-between gap-md text-white">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 text-xs font-bold bg-primary text-on-primary rounded-full uppercase tracking-wider">
                {tournament.sportLabel}
              </span>
              <span className="px-3 py-0.5 text-xs font-bold bg-[#e8f5e9] text-[#2e7d32] rounded-full">
                {tournament.status}
              </span>
            </div>
            <h1 className="text-[24px] md:text-[36px] font-bold tracking-tight mb-1">{tournament.title}</h1>
            <p className="text-sm text-gray-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed-dim">corporate_fare</span>
              Ban tổ chức: {tournament.organizer}
            </p>
          </div>
          <button 
            onClick={() => setIsRegisterModalOpen(true)}
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-title-lg text-title-lg shadow-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* Grid thông tin chính */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Cột trái: Tab navigation & Details */}
        <div className="lg:col-span-8 space-y-md">
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-surface-container-low/60 border border-outline-variant/30 p-1.5 rounded-full w-max">
            <button 
              onClick={() => setActiveTab('info')}
              className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                activeTab === 'info' 
                  ? 'bg-primary text-on-primary shadow-sm shadow-primary/20 font-semibold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 font-medium'
              }`}
            >
              Thông tin chung
            </button>
            <button 
              onClick={() => setActiveTab('bracket')}
              className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                activeTab === 'bracket' 
                  ? 'bg-primary text-on-primary shadow-sm shadow-primary/20 font-semibold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 font-medium'
              }`}
            >
              Sơ đồ thi đấu
            </button>
            <button 
              onClick={() => setActiveTab('players')}
              className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${
                activeTab === 'players' 
                  ? 'bg-primary text-on-primary shadow-sm shadow-primary/20 font-semibold' 
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 font-medium'
              }`}
            >
              Vận động viên
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-3xl p-md md:p-lg shadow-sm">
            {/* Tab 1: Info */}
            {activeTab === 'info' && (
              <div className="space-y-lg animate-fade-in-up">
                <div>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-background mb-sm">Điều lệ giải đấu</h3>
                  <ul className="list-disc pl-5 space-y-2 font-body-sm text-body-sm text-on-surface-variant">
                    {tournament.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
                <hr className="border-outline-variant/30" />
                <div>
                  <h3 className="font-title-lg text-title-lg font-bold text-on-background mb-sm">Cơ cấu giải thưởng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    {tournament.prizes.map((prize, idx) => (
                      <div key={idx} className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                        <span className="material-symbols-outlined text-[32px] text-tertiary mb-2">
                          {idx === 0 ? 'military_tech' : idx === 1 ? 'emoji_events' : 'workspace_premium'}
                        </span>
                        <span className="font-label-md text-[13px] text-on-surface-variant uppercase tracking-wider mb-1">{prize.rank}</span>
                        <span className="font-semibold text-body-md text-on-surface">{prize.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Bracket (Thiết kế Bracket thi đấu) */}
            {activeTab === 'bracket' && (
              <div className="space-y-lg animate-fade-in-up overflow-x-auto custom-scrollbar">
                <h3 className="font-title-lg text-title-lg font-bold text-on-background mb-sm">Nhánh đấu đơn nam</h3>
                <div className="flex gap-16 min-w-[700px] p-4">
                  {/* Round 1 (Tứ kết) */}
                  <div className="flex flex-col justify-around gap-12 flex-1">
                    <div className="font-label-md text-on-surface-variant text-[11px] uppercase tracking-wider text-center border-b border-outline-variant pb-1">Tứ kết</div>
                    <div className="flex flex-col gap-4">
                      {/* Match 1 */}
                      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-3 py-1.5 flex justify-between items-center border-b border-outline-variant/20 font-bold bg-primary/5 text-primary text-xs">
                          Nguyễn Tiến Minh <span className="font-semibold text-on-surface-variant ml-2">2</span>
                        </div>
                        <div className="px-3 py-1.5 flex justify-between items-center text-xs text-on-surface-variant">
                          Phạm Cao Cường <span className="ml-2">0</span>
                        </div>
                      </div>
                      {/* Match 2 */}
                      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-3 py-1.5 flex justify-between items-center text-xs text-on-surface-variant">
                          Nguyễn Hải Đăng <span className="ml-2">1</span>
                        </div>
                        <div className="px-3 py-1.5 flex justify-between items-center border-t border-outline-variant/20 font-bold bg-primary/5 text-primary text-xs">
                          Lê Đức Phát <span className="font-semibold text-on-surface-variant ml-2">2</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Round 2 (Bán kết) */}
                  <div className="flex flex-col justify-around gap-12 flex-1">
                    <div className="font-label-md text-on-surface-variant text-[11px] uppercase tracking-wider text-center border-b border-outline-variant pb-1">Bán kết</div>
                    <div className="flex flex-col gap-4">
                      {/* Match 3 */}
                      <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-3 py-1.5 flex justify-between items-center border-b border-outline-variant/20 font-bold bg-primary/5 text-primary text-xs">
                          Nguyễn Tiến Minh <span className="font-semibold text-on-surface-variant ml-2">2</span>
                        </div>
                        <div className="px-3 py-1.5 flex justify-between items-center text-xs text-on-surface-variant">
                          Lê Đức Phát <span className="ml-2">1</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Round 3 (Chung kết) */}
                  <div className="flex flex-col justify-around gap-12 flex-1">
                    <div className="font-label-md text-on-surface-variant text-[11px] uppercase tracking-wider text-center border-b border-outline-variant pb-1">Chung kết</div>
                    <div className="flex flex-col gap-4">
                      {/* Match 4 */}
                      <div className="bg-surface-container-low border border-primary/20 rounded-xl overflow-hidden shadow-md ring-2 ring-primary/10">
                        <div className="px-3 py-2 flex justify-between items-center font-bold bg-primary text-on-primary text-xs">
                          👑 Nguyễn Tiến Minh <span className="ml-2">Vô địch</span>
                        </div>
                        <div className="px-3 py-1.5 flex justify-between items-center text-xs text-on-surface-variant">
                          Chờ cập nhật nhánh còn lại <span className="ml-2">-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Players */}
            {activeTab === 'players' && (
              <div className="space-y-md animate-fade-in-up">
                <div className="flex justify-between items-center mb-sm">
                  <h3 className="font-title-lg text-title-lg font-bold text-on-background">Danh sách vận động viên ({tournament.currentParticipants}/{tournament.maxParticipants})</h3>
                  <span className="text-xs text-on-surface-variant">Hạn đăng ký: 03/07/2026</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/40 text-on-surface-variant font-label-md uppercase text-xs">
                        <th className="py-2.5 px-3">Hạng</th>
                        <th className="py-2.5 px-3">Vận động viên</th>
                        <th className="py-2.5 px-3">Câu lạc bộ</th>
                        <th className="py-2.5 px-3">Hạt giống</th>
                        <th className="py-2.5 px-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {players.map((p, idx) => (
                        <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-3 font-semibold">{p.rank}</td>
                          <td className="py-3 px-3 font-bold text-on-background">{p.name}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{p.clb}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              p.seed !== 'Không xếp hạng' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'
                            }`}>
                              {p.seed}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-[#2e7d32]">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Thông tin bên lề (Địa điểm, Lịch thi đấu, Liên hệ) */}
        <div className="lg:col-span-4 space-y-md">
          <div className="bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-3xl p-md md:p-lg shadow-sm space-y-lg">
            <h3 className="font-title-lg text-title-lg font-bold text-on-background border-b border-outline-variant/20 pb-xs">Chi tiết giải đấu</h3>
            
            {/* Địa điểm */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
              <div>
                <h4 className="font-semibold text-body-md text-on-background">Địa điểm thi đấu</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{tournament.location}</p>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">calendar_today</span>
              <div>
                <h4 className="font-semibold text-body-md text-on-background">Thời gian tổ chức</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{tournament.dateRange}</p>
              </div>
            </div>

            {/* Lệ phí */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">payments</span>
              <div>
                <h4 className="font-semibold text-body-md text-on-background">Lệ phí thi đấu</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 font-bold">{tournament.fee}</p>
              </div>
            </div>
            
            {/* Quy mô */}
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">group</span>
              <div>
                <h4 className="font-semibold text-body-md text-on-background">Quy mô giải đấu</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Tối đa {tournament.maxParticipants} vận động viên ({tournament.maxParticipants - tournament.currentParticipants} slot còn lại)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRegisterModalOpen && (
        <RegistrationFormModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          tournamentId={Number(tournament.id) || 1}
          tournamentTitle={tournament.title}
          tournamentLevel="Yếu - Khá"
          fee={tournament.fee}
        />
      )}
    </main>
  );
}
