import React, { useState, useEffect } from 'react';

// Interfaces
interface Tournament {
  id: number;
  title: string;
  hostName: string;
  location: string;
  dateStr: string;
  fee: string;
  participants: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'host' | 'user';
  dateJoined: string;
  status: 'active' | 'suspended';
}

interface SystemSettings {
  maintenanceMode: boolean;
  commissionRate: number;
  allowPublicRegistration: boolean;
  autoApproveTournaments: boolean;
  contactEmail: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tournaments' | 'users' | 'settings'>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show Toast helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Mock State - Tournaments
  const [tournaments, setTournaments] = useState<Tournament[]>([
    { id: 1, title: 'Giải Cầu lông Đôi Nam Nữ Hải Châu 2026', hostName: 'Nguyễn Văn An', location: 'Sân Cầu Lông Kỳ Đồng', dateStr: '15/07/2026', fee: '300.000 VNĐ / cặp', participants: '32/48', status: 'pending' },
    { id: 2, title: 'Giải Cầu Lông Đà Nẵng Open 2026', hostName: 'CLB Đà Nẵng Open', location: 'Cung Thể Thao Tiên Sơn', dateStr: '05/07/2026', fee: '500.000 VNĐ / người', participants: '64/64', status: 'approved' },
    { id: 3, title: 'Series Cầu lông Mùa đông Quận Cẩm Lệ', hostName: 'Lê Hoàng Tâm', location: 'Sân Thanh Khê', dateStr: '12/12/2026', fee: '200.000 VNĐ / người', participants: '12/32', status: 'pending' },
    { id: 4, title: 'Giải Cầu lông Đơn Nam Liên Chiểu', hostName: 'Phạm Ngọc Mai', location: 'Sân Thanh Khê', dateStr: '20/08/2026', fee: '150.000 VNĐ / người', participants: '16/16', status: 'completed' },
    { id: 5, title: 'Giao Hữu Câu Lạc Bộ Sơn Trà', hostName: 'Vũ Quốc Bảo', location: 'Sân Hoà Xuân', dateStr: '01/09/2026', fee: 'Miễn phí', participants: '8/12', status: 'rejected' },
    { id: 6, title: 'Giải Sinh Viên Tranh Cúp Bách Khoa', hostName: 'Trần Thị Bình', location: 'Sân Bế Văn Đàn', dateStr: '10/10/2026', fee: '100.000 VNĐ / người', participants: '24/32', status: 'pending' },
  ]);

  // Mock State - Users
  const [users, setUsers] = useState<User[]>([
    { id: 101, name: 'Nguyễn Văn An', email: 'an.nguyen@courtmate.com', phone: '0901234567', role: 'host', dateJoined: '12 Th5 2025', status: 'active' },
    { id: 102, name: 'Trần Thị Bình', email: 'binh.tran@courtmate.com', phone: '0912345678', role: 'user', dateJoined: '13 Th6 2025', status: 'active' },
    { id: 103, name: 'Lê Hoàng Tâm', email: 'tam.le@courtmate.com', phone: '0923456789', role: 'host', dateJoined: '10 Th7 2025', status: 'active' },
    { id: 104, name: 'Phạm Ngọc Mai', email: 'mai.pham@courtmate.com', phone: '0934567890', role: 'user', dateJoined: '14 Th8 2025', status: 'suspended' },
    { id: 105, name: 'Vũ Quốc Bảo', email: 'bao.vu@courtmate.com', phone: '0945678901', role: 'user', dateJoined: '15 Th9 2025', status: 'active' },
    { id: 106, name: 'Hoàng Phúc (Admin)', email: 'admin@courtmate.com', phone: '0999999999', role: 'admin', dateJoined: '01 Th1 2025', status: 'active' },
  ]);

  // Mock State - Settings
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    commissionRate: 5,
    allowPublicRegistration: true,
    autoApproveTournaments: false,
    contactEmail: 'support@courtmate.com',
  });

  const [settingsForm, setSettingsForm] = useState<SystemSettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Search and Filter states
  const [tSearch, setTSearch] = useState('');
  const [tFilter, setTFilter] = useState<string>('all');

  const [uSearch, setUSearch] = useState('');
  const [uFilter, setUFilter] = useState<string>('all');

  // Stats calculation
  const totalUsers = users.length;
  const totalHosts = users.filter(u => u.role === 'host').length;
  const pendingTournaments = tournaments.filter(t => t.status === 'pending').length;
  const approvedTournaments = tournaments.filter(t => t.status === 'approved').length;

  // Overview pending queues
  const pendingTQueue = tournaments.filter(t => t.status === 'pending');
  const pendingHostQueue = users.filter(u => u.role === 'user' && u.email.includes('host')); // simulate users requesting to be hosts

  // Actions for Tournaments
  const handleApproveTournament = (id: number) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' } : t));
    const t = tournaments.find(t => t.id === id);
    showToast(`Đã duyệt giải đấu "${t?.title}"`, 'success');
  };

  const handleRejectTournament = (id: number) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
    const t = tournaments.find(t => t.id === id);
    showToast(`Đã từ chối giải đấu "${t?.title}"`, 'info');
  };

  const handleDeleteTournament = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa giải đấu này khỏi hệ thống không?')) {
      setTournaments(prev => prev.filter(t => t.id !== id));
      showToast('Đã xóa giải đấu thành công', 'success');
    }
  };

  // Actions for Users
  const handleToggleUserRole = (id: number, currentRole: 'admin' | 'host' | 'user') => {
    let newRole: 'admin' | 'host' | 'user' = 'user';
    if (currentRole === 'user') newRole = 'host';
    else if (currentRole === 'host') newRole = 'user';
    else return; // Don't change admin role from here

    setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
    const u = users.find(u => u.id === id);
    showToast(`Đã chuyển đổi quyền của ${u?.name} thành ${newRole === 'host' ? 'Chủ sự kiện' : 'Thành viên'}`, 'success');
  };

  const handleToggleUserStatus = (id: number, currentStatus: 'active' | 'suspended') => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    const u = users.find(u => u.id === id);
    showToast(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản của ${u?.name}`, newStatus === 'active' ? 'success' : 'error');
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setSettings(settingsForm);
      setIsSavingSettings(false);
      showToast('Đã lưu cấu hình hệ thống thành công!', 'success');
    }, 1000);
  };

  // Filtered lists
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(tSearch.toLowerCase()) || 
                          t.hostName.toLowerCase().includes(tSearch.toLowerCase()) ||
                          t.location.toLowerCase().includes(tSearch.toLowerCase());
    const matchesFilter = tFilter === 'all' ? true : t.status === tFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(uSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(uSearch.toLowerCase()) ||
                          u.phone.includes(uSearch);
    const matchesFilter = uFilter === 'all' ? true : u.role === uFilter || u.status === uFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto py-md px-1 animate-fade-in-up">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-xl animate-scale-in text-label-md font-semibold text-white ${
          toast.type === 'success' ? 'bg-[#00685f]/90 border-[#008378]/50' : 
          toast.type === 'error' ? 'bg-[#ba1a1a]/90 border-[#ffb4ab]/50' : 
          'bg-[#006399]/90 border-[#0096eb]/50'
        }`}>
          <span className="material-symbols-outlined text-[20px]">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background">Quản trị hệ thống</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Quản lý hoạt động, thành viên, phê duyệt giải đấu và tùy chỉnh các tham số hệ thống.</p>
        </div>
        
        {/* Maintenance Banner status */}
        {settings.maintenanceMode && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-error-container text-error rounded-xl font-label-md border border-error/20 animate-pulse">
            <span className="material-symbols-outlined text-[18px]">build</span>
            Chế độ bảo trì đang bật
          </div>
        )}
      </header>

      {/* Tab Navigation */}
      <div className="flex border-b border-outline-variant/30 mb-lg overflow-x-auto whitespace-nowrap gap-1 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-label-md transition-all relative ${
            activeTab === 'overview' 
              ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">dashboard</span>
          Tổng quan
        </button>
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-label-md transition-all relative ${
            activeTab === 'tournaments' 
              ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">emoji_events</span>
          Quản lý giải đấu
          {pendingTournaments > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-secondary text-on-secondary rounded-full text-[10px] font-bold">
              {pendingTournaments}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-label-md transition-all relative ${
            activeTab === 'users' 
              ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">group</span>
          Người dùng
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-label-md transition-all relative ${
            activeTab === 'settings' 
              ? 'text-primary border-b-2 border-primary font-bold bg-primary/5' 
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings_suggest</span>
          Cấu hình hệ thống
        </button>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-lg animate-scale-in">
            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary-container/20 rounded-2xl text-primary">
                    <span className="material-symbols-outlined">group</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2.5 py-0.5 rounded-full font-bold">+18.5%</span>
                </div>
                <div>
                  <h3 className="font-body-sm text-body-sm text-on-surface-variant">Tổng người dùng</h3>
                  <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">{totalUsers}</p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-secondary-container/20 rounded-2xl text-secondary">
                    <span className="material-symbols-outlined">shield_person</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2.5 py-0.5 rounded-full font-bold">+8%</span>
                </div>
                <div>
                  <h3 className="font-body-sm text-body-sm text-on-surface-variant">Chủ sự kiện (Hosts)</h3>
                  <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">{totalHosts}</p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-tertiary-container/20 rounded-2xl text-tertiary">
                    <span className="material-symbols-outlined">emoji_events</span>
                  </div>
                  {pendingTournaments > 0 ? (
                    <span className="font-label-md text-label-md text-secondary bg-secondary-container/20 px-2.5 py-0.5 rounded-full font-bold animate-pulse">{pendingTournaments} chờ duyệt</span>
                  ) : (
                    <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2.5 py-0.5 rounded-full font-bold">Ổn định</span>
                  )}
                </div>
                <div>
                  <h3 className="font-body-sm text-body-sm text-on-surface-variant">Giải đấu hệ thống</h3>
                  <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">{tournaments.length} <span className="text-body-sm font-normal text-on-surface-variant">({approvedTournaments} đã duyệt)</span></p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-success-container/20 rounded-2xl text-success">
                    <span className="material-symbols-outlined">insights</span>
                  </div>
                  <span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2.5 py-0.5 rounded-full font-bold">+24.2%</span>
                </div>
                <div>
                  <h3 className="font-body-sm text-body-sm text-on-surface-variant">Doanh thu hoa hồng</h3>
                  <p className="font-headline-md text-headline-md font-bold text-on-background mt-1">{(approvedTournaments * 125000 * (settings.commissionRate / 100)).toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            </div>

            {/* Graphics and Lists Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
              
              {/* Analytics Graph mockup */}
              <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between">
                <div>
                  <h2 className="font-title-lg text-title-lg font-bold text-on-background">Tần suất đăng ký giải đấu</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Số lượng giải đấu được tổ chức qua các tháng (năm 2026)</p>
                </div>
                
                {/* SVG Line Chart */}
                <div className="w-full h-64 mt-lg relative">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00685f" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00685f" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#e0e0e0" strokeDasharray="5,5" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#e0e0e0" strokeDasharray="5,5" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#e0e0e0" strokeDasharray="5,5" strokeWidth="1" />
                    
                    {/* Area under curve */}
                    <path d="M 0 200 L 0 170 Q 100 130 150 150 T 300 70 T 400 90 T 500 40 L 500 200 Z" fill="url(#chart-grad)" />
                    
                    {/* Line path */}
                    <path d="M 0 170 Q 100 130 150 150 T 300 70 T 400 90 T 500 40" fill="none" stroke="#00685f" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Data dots */}
                    <circle cx="150" cy="150" r="5" fill="#00685f" stroke="white" strokeWidth="1.5" />
                    <circle cx="300" cy="70" r="5" fill="#00685f" stroke="white" strokeWidth="1.5" />
                    <circle cx="420" cy="95" r="5" fill="#008378" stroke="white" strokeWidth="1.5" />
                    <circle cx="500" cy="40" r="6" fill="#ffb2b9" stroke="#ba1a1a" strokeWidth="2" />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-1.5 left-1 bg-white/80 px-2 py-0.5 rounded text-[10px] font-bold border border-outline-variant/30 shadow-sm text-primary">Tháng 7 (Dự kiến cao điểm)</div>
                </div>
                
                <div className="flex justify-between items-center text-label-md text-on-surface-variant border-t border-outline-variant/20 pt-md mt-sm">
                  <span>T1 - T2</span>
                  <span>T3 - T4</span>
                  <span>T5 - T6</span>
                  <span className="font-bold text-on-background">T7 - T8 (Hiện tại)</span>
                  <span>T9 - T10</span>
                  <span>T11 - T12</span>
                </div>
              </div>

              {/* Pending Approvals quick widget */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20 mb-md">
                    <h2 className="font-title-lg text-title-lg font-bold text-on-background">Yêu cầu phê duyệt ({pendingTQueue.length})</h2>
                    <button 
                      onClick={() => setActiveTab('tournaments')} 
                      className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-0.5"
                    >
                      Tất cả <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>

                  {pendingTQueue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-xl text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-primary/40 mb-2">check_circle</span>
                      <p className="font-body-sm">Đã duyệt hết các giải đấu trong hàng đợi!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                      {pendingTQueue.map(t => (
                        <div key={t.id} className="p-3 bg-surface-container/50 border border-outline-variant/20 rounded-2xl flex flex-col gap-2 hover:bg-surface-container transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-body-sm text-on-background truncate">{t.title}</h4>
                              <p className="text-[12px] text-on-surface-variant mt-0.5">Người tạo: {t.hostName}</p>
                            </div>
                            <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full">Đợi duyệt</span>
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 mt-1 border-t border-outline-variant/20 pt-2">
                            <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">calendar_today</span>
                              {t.dateStr}
                            </span>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleApproveTournament(t.id)} 
                                className="px-2.5 py-1 bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container text-[11px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                              >
                                <span className="material-symbols-outlined text-[12px]">check</span> Duyệt
                              </button>
                              <button 
                                onClick={() => handleRejectTournament(t.id)} 
                                className="px-2.5 py-1 border border-error-container text-error hover:bg-error-container/50 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-0.5 active:scale-95"
                              >
                                Từ chối
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-md border-t border-outline-variant/20 text-center">
                  <div className="text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Giải đấu được duyệt sẽ lập tức hiển thị công khai trên bảng tin.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOURNAMENTS MANAGEMENT */}
        {activeTab === 'tournaments' && (
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden flex flex-col animate-scale-in">
            {/* Toolbar */}
            <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40">
              <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${tFilter === 'all' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setTFilter('all')}
                >Tất cả ({tournaments.length})</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${tFilter === 'pending' ? 'bg-secondary-container text-on-secondary-container font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setTFilter('pending')}
                >Chờ duyệt ({pendingTournaments})</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${tFilter === 'approved' ? 'bg-[#e8f5e9] text-[#2e7d32] font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setTFilter('approved')}
                >Đã duyệt ({approvedTournaments})</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${tFilter === 'rejected' ? 'bg-error-container/50 text-error font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setTFilter('rejected')}
                >Đã từ chối</button>
              </div>

              <div className="flex gap-3 w-full md:w-auto flex-1 justify-end">
                <div className="relative w-full max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm giải đấu, địa điểm..." 
                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={tSearch}
                    onChange={(e) => setTSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tournaments Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-surface-container/30">
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-md uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-6 font-bold">Giải đấu</th>
                    <th className="py-3.5 px-4 font-bold">Chủ giải đấu</th>
                    <th className="py-3.5 px-4 font-bold">Địa điểm & Ngày</th>
                    <th className="py-3.5 px-4 font-bold">Chi phí & Slot</th>
                    <th className="py-3.5 px-4 font-bold">Trạng thái</th>
                    <th className="py-3.5 px-6 font-bold text-right">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-on-surface bg-surface-container-lowest">
                  {filteredTournaments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] opacity-40 mb-2">search_off</span>
                        <p>Không tìm thấy giải đấu nào phù hợp bộ lọc.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTournaments.map(t => (
                      <tr key={t.id} className="border-b border-outline-variant/15 hover:bg-surface-variant/20 transition-colors group">
                        <td className="py-4 px-6">
                          <p className="font-bold text-on-background text-body-md leading-snug">{t.title}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-primary/10 text-primary font-bold text-[10px]">CẦU LÔNG</span>
                        </td>
                        <td className="py-4 px-4 font-semibold">{t.hostName}</td>
                        <td className="py-4 px-4">
                          <p className="font-medium">{t.location}</p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5">{t.dateStr}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold text-primary">{t.fee}</p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5">Số lượng: {t.participants}</p>
                        </td>
                        <td className="py-4 px-4">
                          {t.status === 'approved' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span> Đã duyệt
                            </span>
                          )}
                          {t.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container border border-secondary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> Chờ duyệt
                            </span>
                          )}
                          {t.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-error-container text-error border border-error/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Từ chối
                            </span>
                          )}
                          {t.status === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface-variant text-on-surface-variant border border-outline-variant/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant"></span> Đã kết thúc
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            {t.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleApproveTournament(t.id)} 
                                  className="p-1.5 rounded-lg bg-[#e8f5e9] text-[#2e7d32] hover:bg-[#c8e6c9] transition-colors" 
                                  title="Phê duyệt giải đấu"
                                >
                                  <span className="material-symbols-outlined text-[18px]">done</span>
                                </button>
                                <button 
                                  onClick={() => handleRejectTournament(t.id)} 
                                  className="p-1.5 rounded-lg bg-error-container text-error hover:bg-error-container/80 transition-colors" 
                                  title="Từ chối phê duyệt"
                                >
                                  <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleDeleteTournament(t.id)} 
                              className="p-1.5 rounded-lg hover:bg-error-container/50 hover:text-error text-on-surface-variant transition-colors" 
                              title="Xóa giải đấu khỏi hệ thống"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Mockup */}
            <div className="p-4 border-t border-outline-variant/30 bg-white/40 flex justify-between items-center text-sm text-on-surface-variant">
              <div>Hiển thị {filteredTournaments.length} giải đấu</div>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded hover:bg-surface-variant" disabled><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold">1</button>
                <button className="p-1 rounded hover:bg-surface-variant" disabled><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl overflow-hidden flex flex-col animate-scale-in">
            {/* Toolbar */}
            <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40">
              <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${uFilter === 'all' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setUFilter('all')}
                >Tất cả ({users.length})</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${uFilter === 'host' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setUFilter('host')}
                >Chủ sự kiện ({totalHosts})</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${uFilter === 'user' ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setUFilter('user')}
                >Thành viên</button>
                <button 
                  className={`px-3 py-1.5 rounded-lg font-label-md transition-all whitespace-nowrap ${uFilter === 'suspended' ? 'bg-error-container text-error font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant/50'}`}
                  onClick={() => setUFilter('suspended')}
                >Bị khóa</button>
              </div>

              <div className="flex gap-3 w-full md:w-auto flex-1 justify-end">
                <div className="relative w-full max-w-xs">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên, email, SĐT..." 
                    className="w-full pl-9 pr-3 py-2 text-sm bg-surface-container-lowest rounded-xl border border-outline-variant/40 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={uSearch}
                    onChange={(e) => setUSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead className="bg-surface-container/30">
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-label-md uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-6 font-bold">Thành viên</th>
                    <th className="py-3.5 px-4 font-bold">Liên hệ</th>
                    <th className="py-3.5 px-4 font-bold">Vai trò</th>
                    <th className="py-3.5 px-4 font-bold">Ngày tham gia</th>
                    <th className="py-3.5 px-4 font-bold">Trạng thái</th>
                    <th className="py-3.5 px-6 font-bold text-right">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-on-surface bg-surface-container-lowest">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[48px] opacity-40 mb-2">search_off</span>
                        <p>Không tìm thấy người dùng nào phù hợp bộ lọc.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-outline-variant/15 hover:bg-surface-variant/20 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[15px] ${
                              u.role === 'admin' ? 'bg-[#ffb2b9] text-[#891933]' : 
                              u.role === 'host' ? 'bg-[#00685f]/15 text-primary' : 
                              'bg-secondary-container text-on-secondary-container'
                            }`}>
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-on-background text-body-md">{u.name}</p>
                              <p className="text-[11px] text-on-surface-variant">ID: #{u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          <p className="text-on-surface flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">mail</span> {u.email}</p>
                          <p className="text-on-surface-variant flex items-center gap-1.5 mt-0.5"><span className="material-symbols-outlined text-[14px]">call</span> {u.phone}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            u.role === 'admin' ? 'bg-[#ffdeb7] text-[#8b3c00] border-[#ffdcb2]' : 
                            u.role === 'host' ? 'bg-primary-container text-on-primary-container border-primary/20' : 
                            'bg-surface-variant text-on-surface-variant border-outline-variant/30'
                          }`}>
                            <span className="material-symbols-outlined text-[12px]">{u.role === 'admin' ? 'shield' : u.role === 'host' ? 'badge' : 'person'}</span>
                            {u.role === 'admin' ? 'Quản trị viên' : u.role === 'host' ? 'Chủ sự kiện' : 'Thành viên'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant">{u.dateJoined}</td>
                        <td className="py-4 px-4">
                          {u.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5e9] text-[#2e7d32]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]"></span> Đang hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-error-container text-error">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Bị khóa
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-2">
                            {u.role !== 'admin' && (
                              <>
                                <button 
                                  onClick={() => handleToggleUserRole(u.id, u.role)} 
                                  className="px-2.5 py-1 text-[11px] font-bold border border-outline-variant/40 rounded-lg hover:bg-surface-variant transition-colors active:scale-95"
                                  title={u.role === 'host' ? 'Hạ cấp xuống Thành viên' : 'Nâng cấp lên Chủ sự kiện'}
                                >
                                  {u.role === 'host' ? 'Hạ cấp' : 'Cấp Host'}
                                </button>
                                <button 
                                  onClick={() => handleToggleUserStatus(u.id, u.status)} 
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    u.status === 'active' 
                                      ? 'hover:bg-error-container hover:text-error text-on-surface-variant' 
                                      : 'bg-error-container text-error hover:bg-error-container/85'
                                  }`} 
                                  title={u.status === 'active' ? 'Khóa tài khoản người dùng' : 'Mở khóa tài khoản'}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {u.status === 'active' ? 'block' : 'lock_open'}
                                  </span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Mockup */}
            <div className="p-4 border-t border-outline-variant/30 bg-white/40 flex justify-between items-center text-sm text-on-surface-variant">
              <div>Hiển thị {filteredUsers.length} người dùng</div>
              <div className="flex items-center gap-2">
                <button className="p-1 rounded hover:bg-surface-variant" disabled><span className="material-symbols-outlined">chevron_left</span></button>
                <button className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold">1</button>
                <button className="p-1 rounded hover:bg-surface-variant" disabled><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM CONFIGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg animate-scale-in">
            
            {/* Left form details */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg">
              <div className="pb-3 border-b border-outline-variant/30 mb-lg">
                <h2 className="font-title-lg text-title-lg font-bold text-on-background">Thông số cấu hình</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Điều chỉnh các biến và chức năng hoạt động của nền tảng.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Commission Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="commission-rate">
                      Phí hoa hồng của hệ thống (%) <span className="text-error">*</span>
                    </label>
                    <span className="font-bold text-primary text-title-md bg-primary-container/20 px-3 py-1 rounded-xl">
                      {settingsForm.commissionRate}%
                    </span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant">Phần trăm hoa hồng được khấu trừ tự động trên mỗi giao dịch đăng ký giải đấu có phí.</p>
                  <input 
                    id="commission-rate"
                    type="range" 
                    min="0" 
                    max="20" 
                    step="1"
                    className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
                    value={settingsForm.commissionRate}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, commissionRate: parseInt(e.target.value) }))}
                  />
                  <div className="flex justify-between text-[11px] text-on-surface-variant px-1">
                    <span>0% (Miễn phí)</span>
                    <span>10%</span>
                    <span>20% (Tối đa)</span>
                  </div>
                </div>

                <hr className="border-outline-variant/20" />

                {/* Contact Email input */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="contact-email">
                    Email liên hệ hỗ trợ <span className="text-error">*</span>
                  </label>
                  <input 
                    id="contact-email"
                    type="email" 
                    placeholder="support@courtmate.com"
                    required
                    className="w-full max-w-md px-4 py-3 border border-outline-variant/60 rounded-xl bg-white/50 focus:border-primary outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body-md"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                  <p className="text-[12px] text-on-surface-variant">Email chính hiển thị cho người dùng và gửi thông tin hóa đơn/giao dịch.</p>
                </div>

                <hr className="border-outline-variant/20" />

                {/* Toggles */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-body-md text-on-background">Quy tắc phê duyệt và Đăng ký</h4>
                  
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container/20 border border-outline-variant/10">
                    <div>
                      <h5 className="font-semibold text-body-sm text-on-background">Cho phép tự đăng ký làm Host</h5>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">Người dùng thường có thể tự do đăng ký tổ chức giải đấu không cần phê duyệt nâng vai trò.</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        id="allow-public-reg" 
                        className="sr-only switch-checkbox"
                        checked={settingsForm.allowPublicRegistration}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, allowPublicRegistration: e.target.checked }))}
                      />
                      <label htmlFor="allow-public-reg" className="block w-11 h-6 bg-outline-variant rounded-full cursor-pointer transition-colors switch-label"></label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container/20 border border-outline-variant/10">
                    <div>
                      <h5 className="font-semibold text-body-sm text-on-background">Tự động duyệt giải đấu</h5>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">Các giải đấu mới tạo sẽ tự động xuất bản mà không cần admin duyệt thủ công.</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        id="auto-approve" 
                        className="sr-only switch-checkbox"
                        checked={settingsForm.autoApproveTournaments}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, autoApproveTournaments: e.target.checked }))}
                      />
                      <label htmlFor="auto-approve" className="block w-11 h-6 bg-outline-variant rounded-full cursor-pointer transition-colors switch-label"></label>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-md border-t border-outline-variant/30 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSavingSettings}
                    className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-label-md shadow-sm hover:opacity-95 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSavingSettings ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        Lưu cấu hình
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Maintenance Panel */}
            <div className="lg:col-span-1 bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] rounded-3xl p-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-error pb-3 border-b border-outline-variant/30 mb-lg">
                  <span className="material-symbols-outlined text-[28px]">gavel</span>
                  <h3 className="font-title-lg text-title-lg font-bold">Khu vực khẩn cấp</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-error-container/30 border border-error/20 rounded-2xl">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-error text-[20px] mt-0.5">warning</span>
                      <div>
                        <h4 className="font-bold text-error text-body-sm">Chế độ bảo trì hệ thống</h4>
                        <p className="text-[12px] text-on-surface-variant mt-1 leading-normal">
                          Khi kích hoạt chế độ này, người dùng thông thường và chủ sự kiện sẽ không thể truy cập nền tảng và chỉ thấy trang thông báo bảo trì.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end items-center gap-3">
                      <span className="text-[12px] font-bold text-on-surface">
                        {settingsForm.maintenanceMode ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                      </span>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="maintenance-toggle" 
                          className="sr-only switch-checkbox"
                          checked={settingsForm.maintenanceMode}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setSettingsForm(prev => ({ ...prev, maintenanceMode: val }));
                            showToast(val ? 'Đã kích hoạt chế độ bảo trì hệ thống!' : 'Đã tắt chế độ bảo trì hệ thống!', val ? 'error' : 'info');
                          }}
                        />
                        <label htmlFor="maintenance-toggle" className="block w-11 h-6 bg-outline-variant rounded-full cursor-pointer transition-colors switch-label"></label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-2xl">
                    <h4 className="font-bold text-on-background text-body-sm">Trình trạng máy chủ</h4>
                    <div className="mt-3 space-y-2 text-[12px] text-on-surface-variant">
                      <div className="flex justify-between">
                        <span>CPU Usage:</span>
                        <span className="font-bold text-[#2e7d32]">14% (Bình thường)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory:</span>
                        <span className="font-bold text-[#2e7d32]">1.2 GB / 4.0 GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Latency:</span>
                        <span className="font-bold text-[#2e7d32]">45 ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hệ thống:</span>
                        <span className="font-bold text-primary">Hoạt động tốt (100%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-on-surface-variant text-center bg-surface-container/30 p-2 rounded-xl border border-outline-variant/10">
                Lần cuối điều chỉnh cấu hình hệ thống: 1 phút trước bởi Admin
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
