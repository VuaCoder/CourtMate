import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/AuthContext';
import TournamentDetailsModal from '../components/TournamentDetailsModal';
import MatchDetailsModal from '../components/MatchDetailsModal';
const COURTS = ['Cung Thể Thao Tiên Sơn', 'Sân Cầu Lông Kỳ Đồng', 'Sân Tuyên Sơn', 'Sân Thanh Khê', 'Sân Hoà Xuân', 'Sân Bế Văn Đàn'];

const generateMockPosts = () => {
  const posts = [
    {
      id: 1, type: 'tournament', authorName: 'CLB Đà Nẵng Open', authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANI1x_H2RdY7olRA7qX1WUUIfIQwHoIaH4XrzOH4c6xfkVkEVxoG0ydU0Eb_kSKsKTJ_ZEeb5_yK1xsS4WcB-CcZCY5gaT6_hCC0Mfgw49LUIEktD8ohKdrkEG-bbUKpyZecwlZSsl4PnlLXJdb5RX45pd-wpK12JQDpLJtkL3-aE8WkFUaTqt_tUkgl9CuWxYUFyiF7C1_TJACMEvJjnWRT41ersXAcDWf2jWblqU8X5Y3mbJ8HQKxA',
      postedTime: 'Đăng 2 giờ trước', statusText: 'Đang mở', title: 'Giải Cầu Lông Đà Nẵng Open 2026', desc: 'Giải đấu phong trào quy mô lớn nhất năm dành cho các tay vợt bán chuyên và phong trào.', location: 'Cung Thể Thao Tiên Sơn', dateStr: '05/07/2026', fee: '500.000 VNĐ / người'
    },
    {
      id: 2, type: 'match', authorName: 'Nguyễn Ánh', authorAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Anh&background=ffb2b9&color=fff',
      postedTime: 'Đăng 11 giờ trước', statusText: 'Cần người', title: '', desc: 'Tuyển vãng lai sáng mai thứ 3 (30/06)\nĐịa điểm: sân cầu lông pinpon sân 11 (kcn an đồn)\nThời gian: 8h30-10h30\nTrình độ: yếu tby\nPhí: 40k\nChuyển khoản để chốt slot ạ', location: 'Sân cầu lông Pinpon (KCN An Đồn)', schedule: '08:30 - 10:30', level: 'Yếu - TB Yếu', fbLink: 'https://www.facebook.com/groups/danangbadminton/posts/37195001866764864/'
    },
    {
      id: 3, type: 'tournament', authorName: 'CLB Thanh Khê', authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjwkzH1br53KR99kc0gW3Db2VqGC745ZuwR5Hutz5w9Bhiv-JTBO6k7JMNCc_BVFSNVPhRMMHvmHjtPi2er8iQxX5hbW8pZVpGC7m37gcjdrxshGme76UHby0iOfpBNNF3l10Bn6GxUxV1XsMewZ773pfiplFj5cNwomjS5ARpEPNZU1yXjuZhry2UyYBqOY-qUownJeQZhjqXntXVR9Dcx5Z66KIIpajPoSadzaerzdiLyJ7dPLSxkA',
      postedTime: 'Đăng 1 ngày trước', statusText: 'Sắp đóng', title: 'Giải Cầu Lông Đôi Nam Nữ Thanh Khê', desc: 'Giải đấu giao lưu nội bộ quận Thanh Khê, tập trung vào thể thức đôi nam nữ.', location: 'Sân Cầu Lông Kỳ Đồng', dateStr: '02/09/2024', fee: '300.000 VNĐ / cặp'
    },
    {
      id: 4, type: 'match', authorName: 'Mai Sương', authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWDtjwj9EYv3ovmCldYzVCLFcIiLRDFJfF49m87F-SUWiD5lWCmwUSGIsLuvnfjagqC6xAGPTTXlcI4dF8gAYkVRfkU6j0QOx1oMP5w__xAIKDhdRyJV4Sjk9nuPopUKOzs2NqE8tHe-zZdqG5vi0vgayjKkF0zEQCLa4kOuS73n0CB2OLRUMBhbWtH9eJXndpZrJaXpZaH_phmMYOLr2UNbn5_R24Wq7ekswtAuM_XQN0NI87DHBBXA',
      postedTime: 'Đăng 1 giờ trước', statusText: 'Cần người', title: '', desc: 'TUYỂN VL Nam Nữ Sáng Nay (30/6)\n⏰ 9h - 11h\n🎪 Sân Lâm Gia 17 bàu năng 11\n🔥 Tb- , Tby\n🪎 Nam 50k Nữ 45K\nIb m ạ', location: 'Sân Lâm Gia 17 Bàu Năng 11', schedule: '09:00 - 11:00', level: 'TB Yếu - TB', fbLink: 'https://www.facebook.com/groups/300385366290013/posts/1012999208361955/'
    }
  ];

  // Generate 16 more mock posts
  const names = ['Hoàng Minh', 'Lê Hữu', 'Phạm Tuấn', 'Vũ Ngọc', 'Bùi Xuân', 'Đặng Thùy', 'Ngô Kiến', 'Đỗ Duy'];
  const titles = ['Giải Sinh Viên', 'Giao Hữu', 'Tranh Cúp Mùa Hè', 'Giải Nội Bộ', 'Thách Đấu Ngày Chủ Nhật'];

  for (let i = 5; i <= 20; i++) {
    const isTournament = Math.random() > 0.6;
    const court = COURTS[Math.floor(Math.random() * COURTS.length)];
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + (i % 5);

    if (isTournament) {
      posts.push({
        id: i, type: 'tournament', authorName: 'CLB ' + name, authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDC45ai1ByAoUrZ9jZlwYTHpQhRyro4iL0Rwlinq0_zwx4q_72-HiYU89GjVManXAB5Aw-lkPrOJgw1oA7KcYmttVMZ1zb9sfLudpD1FNSaYG1ahRcTUxMNjltJLqP2EoTFhkBGsanT967V2fNOsquHbDINLfbC2BeHpGOT8uC8nuseMQ1c84AFRJoQqUJSy62QQJF6iMQPLZvdbDWKerpZ-HjcKQ3d4CKUFPtTDkRMknHInM7tgCDirg',
        postedTime: `Đăng ${i} giờ trước`, statusText: 'Đang mở', title: titles[Math.floor(Math.random() * titles.length)], desc: 'Một giải đấu đầy kịch tính đang chờ đón bạn.', location: court, dateStr: 'Tuần sau', fee: '200.000 VNĐ / người'
      });
    } else {
      posts.push({
        id: i, type: 'match', authorName: name, authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANI1x_H2RdY7olRA7qX1WUUIfIQwHoIaH4XrzOH4c6xfkVkEVxoG0ydU0Eb_kSKsKTJ_ZEeb5_yK1xsS4WcB-CcZCY5gaT6_hCC0Mfgw49LUIEktD8ohKdrkEG-bbUKpyZecwlZSsl4PnlLXJdb5RX45pd-wpK12JQDpLJtkL3-aE8WkFUaTqt_tUkgl9CuWxYUFyiF7C1_TJACMEvJjnWRT41ersXAcDWf2jWblqU8X5Y3mbJ8HQKxA',
        postedTime: `Đăng ${i} giờ trước`, statusText: 'Cần người', title: '', desc: 'Thiếu 1 người đánh vãng lai. Ai đi được inbox mình.', location: court, schedule: '18:00 - 20:00',
        level: 'Trung bình', fbLink: 'https://www.facebook.com/groups/danangbadminton/posts/37195001866764864/'
      });
    }
  }

  return posts;
};

const MOCK_POSTS = generateMockPosts();

export default function TournamentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [posts, setPosts] = useState<any[]>(() => {
    const savedTournaments = localStorage.getItem('courtmate_tournaments');
    if (savedTournaments) {
      return JSON.parse(savedTournaments);
    } else {
      localStorage.setItem('courtmate_tournaments', JSON.stringify(MOCK_POSTS));
      return MOCK_POSTS;
    }
  });

  // Sync state with localStorage updates
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('courtmate_tournaments');
      if (saved) {
        setPosts(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000); // Poll every second for seamless local updates
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  const courtQuery = searchParams.get('court') || '';

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Infinity Scroll state
  const [displayCount, setDisplayCount] = useState(6);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Modal State
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Greeting
  const currentHour = new Date().getHours();
  let greeting = 'Chào buổi tối';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Chào buổi sáng';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Chào buổi chiều';
  
  const { userName } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleCourtChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('court', val);
    else newParams.delete('court');
    setSearchParams(newParams);
  };

  const getRegCount = (postId: number) => {
    const saved = localStorage.getItem('courtmate_registrations');
    if (!saved) return 0;
    const regs = JSON.parse(saved);
    return regs.filter((r: any) => r.tournamentId === postId).length;
  };

  const filteredPosts = posts.filter(post => {
    let matches = true;
    if (query) {
      const searchStr = query.toLowerCase();
      matches = (
        post.authorName.toLowerCase().includes(searchStr) ||
        (post.title && post.title.toLowerCase().includes(searchStr)) ||
        post.desc.toLowerCase().includes(searchStr) ||
        post.location.toLowerCase().includes(searchStr)
      );
    }
    if (courtQuery) {
      matches = matches && post.location.toLowerCase().includes(courtQuery.toLowerCase());
    }
    return matches;
  });

  const displayedPosts = filteredPosts.slice(0, displayCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setDisplayCount(prev => Math.min(prev + 6, filteredPosts.length));
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [filteredPosts.length]);

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      {/* Header Section */}
      <header className="mb-md text-left">
        <h1 className="font-display-lg text-display-lg md:text-[48px] text-[32px] font-bold text-on-background mb-sm">
          {greeting}, {userName}!
        </h1>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg relative items-start">
        {/* Left Sidebar: Filters */}
        <aside className="lg:col-span-3 flex flex-col gap-md lg:sticky top-[100px]">
          <div className="glass-card bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rounded-3xl p-lg flex flex-col gap-lg max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <h2 className="font-title-lg text-title-lg font-bold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span>
              Bộ lọc
            </h2>

            {/* Lọc Sân */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant">Lọc Sân</label>
              <div className="relative">
                <select value={courtQuery} onChange={handleCourtChange} className="w-full appearance-none pl-3 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-on-surface cursor-pointer focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Tất cả các sân</option>
                  {COURTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Khu vực */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant">Khu vực</label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-on-surface cursor-pointer focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Tất cả</option>
                  <option>Hải Châu</option>
                  <option>Thanh Khê</option>
                  <option>Liên Chiểu</option>
                  <option>Ngũ Hành Sơn</option>
                  <option>Sơn Trà</option>
                  <option>Cẩm Lệ</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Trình độ */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant">Trình độ</label>
              <div className="relative">
                <select className="w-full appearance-none pl-3 pr-8 py-2 bg-surface-container-low border border-outline-variant rounded-xl font-body-sm text-on-surface cursor-pointer focus:ring-2 focus:ring-primary outline-none">
                  <option value="">Tất cả</option>
                  <option>Yếu</option>
                  <option>Trung bình yếu</option>
                  <option>Trung bình</option>
                  <option>Trung bình khá</option>
                  <option>Khá</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-on-surface-variant">
                  expand_more
                </span>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant">Khoảng thời gian</label>
              
              <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 shadow-sm overflow-hidden">
                {/* Lịch custom */}
                <div className="w-full flex justify-center mb-4 custom-datepicker">
                  <style dangerouslySetInnerHTML={{__html: `
                    .custom-datepicker .react-datepicker { font-family: inherit; border: none; background: transparent; width: 100%; display: flex; justify-content: center; }
                    .custom-datepicker .react-datepicker__header { background: transparent; border-bottom: none; padding-top: 8px; }
                    .custom-datepicker .react-datepicker__day--selected, .custom-datepicker .react-datepicker__day--in-selecting-range, .custom-datepicker .react-datepicker__day--in-range { background-color: #00685f !important; color: white !important; border-radius: 8px; }
                    .custom-datepicker .react-datepicker__day:hover { border-radius: 8px; background-color: #eff4ff; }
                    .custom-datepicker .react-datepicker__month-container { width: 100%; }
                    .custom-datepicker .react-datepicker__day-names { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .custom-datepicker .react-datepicker__week { display: flex; justify-content: space-between; }
                    .custom-datepicker .react-datepicker__day--keyboard-selected { background-color: transparent; color: inherit; }
                    .custom-datepicker .react-datepicker__day:focus { outline: none; }
                    input[type="time"]::-webkit-calendar-picker-indicator { width: 14px; height: 14px; padding: 0; margin-left: 2px; }
                  `}} />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    inline
                  />
                </div>

                <div className="border-t border-outline-variant/50 pt-3">
                  <label className="font-label-md text-[12px] text-on-surface-variant font-semibold mb-2 block">Khung giờ</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] text-on-surface-variant block mb-1">Từ giờ</label>
                      <input 
                        type="time" 
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full px-1 py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] text-on-surface-variant block mb-1">Đến giờ</label>
                      <input 
                        type="time" 
                        value={endTime}
                        onChange={e => setEndTime(e.target.value)}
                        className="w-full px-1 py-1.5 bg-surface border border-outline-variant rounded-lg font-body-sm text-on-surface focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-2 mt-sm bg-primary text-on-primary rounded-xl font-label-md hover:opacity-90 transition-opacity active:scale-95">
              Lọc
            </button>
          </div>
        </aside>

        {/* Right Content: Unified Feed Grid */}
        <section className="lg:col-span-9 flex flex-col gap-md">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="font-headline-md text-headline-md font-semibold text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">grid_view</span>
              Bảng tin tổng hợp
            </h2>
          </div>

          {/* Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
            
            {displayedPosts.map(post => (
              <div 
                key={post.id} 
                className="bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-2xl p-md flex flex-col gap-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
                onClick={() => {
                  setSelectedPost(post);
                  setIsModalOpen(true);
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-surface-variant/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant border border-outline-variant/20">
                      <img className="w-full h-full object-cover" alt={post.authorName} src={post.authorAvatar} />
                    </div>
                    <div>
                      <h3 className="font-title-lg text-[16px] leading-[24px] font-bold text-on-background">{post.authorName}</h3>
                      <p className="font-body-sm text-[12px] text-on-surface-variant">{post.postedTime}</p>
                    </div>
                  </div>
                  <button className="text-on-surface-variant"><span className="material-symbols-outlined text-[20px]">more_horiz</span></button>
                </div>

                <div className="flex gap-2 relative z-10">
                  <span className={`px-3 py-1 text-[12px] font-bold rounded-full flex items-center gap-1 shadow-sm ${post.type === 'tournament' ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {post.type === 'tournament' ? 'emoji_events' : 'local_fire_department'}
                    </span> 
                    {post.type === 'tournament' ? 'Giải đấu' : 'Kèo vãng lai'}
                  </span>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center ${post.statusText === 'Sắp đóng' ? 'bg-[#891933] text-white' : 'bg-surface-container-high text-on-surface'}`}>
                    {post.statusText}
                  </span>
                </div>
                
                {post.title && (
                  <h4 className="font-title-lg text-title-lg font-bold text-on-background mt-sm relative z-10">{post.title}</h4>
                )}
                
                <p className={`font-body-md text-body-md text-on-surface-variant relative z-10 line-clamp-2 ${!post.title ? 'mt-xs' : ''}`}>
                  {post.desc}
                </p>
                
                <div className="flex flex-col gap-2 mt-sm relative z-10 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">location_on</span>
                    <span className="font-body-sm text-body-sm">{post.location}</span>
                  </div>
                  {post.type === 'tournament' ? (
                    <>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px] text-tertiary">calendar_today</span>
                        <span className="font-body-sm text-body-sm">{post.dateStr}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px] text-tertiary">payments</span>
                        <span className="font-body-sm text-body-sm font-semibold">{post.fee}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface">
                        <span className="material-symbols-outlined text-[18px] text-tertiary">groups</span>
                        <span className="font-body-sm text-body-sm font-semibold text-primary">
                          {getRegCount(post.id)}/{post.limit || 32} VĐV đã đăng ký
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
                      <span className="font-body-sm text-body-sm">{post.schedule}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-sm border-t border-outline-variant/30 flex justify-end relative z-10">
                  <button className="font-label-md text-label-md text-primary hover:text-primary-fixed-dim transition-colors flex items-center gap-1">
                    {post.type === 'tournament' ? 'Xem chi tiết' : 'Xem bài viết'} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="col-span-full py-xl text-center text-on-surface-variant flex flex-col items-center">
                <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">search_off</span>
                <p>Không tìm thấy kết quả nào cho "{query}"</p>
              </div>
            )}
            
            {/* Infinity Scroll Target */}
            {displayCount < filteredPosts.length && (
              <div ref={observerTarget} className="col-span-full py-4 text-center">
                <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

          </div>
        </section>
      </div>

      <TournamentDetailsModal 
        isOpen={isModalOpen && selectedPost?.type === 'tournament'} 
        onClose={() => setIsModalOpen(false)} 
        post={selectedPost}
      />
      <MatchDetailsModal 
        isOpen={isModalOpen && selectedPost?.type === 'match'} 
        onClose={() => setIsModalOpen(false)} 
        post={selectedPost}
      />
    </main>
  );
}
