import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../context/AuthContext';
import MatchDetailsModal from '../components/MatchDetailsModal';

const COURTS = ['Cung Thể Thao Tiên Sơn', 'Sân Cầu Lông Kỳ Đồng', 'Sân Tuyên Sơn', 'Sân Tuyên Sơn Pickleball', 'Sân Cầu Lông Pinpon', 'Sân Lâm Gia'];

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Giải Cầu Lông Đà Nẵng Open 2026',
    subtitle: 'GIẢI ĐẤU LỚN NHẤT NĂM 🏆',
    description: 'Quy tụ hơn 200 vận động viên chuyên nghiệp & phong trào tranh tài cúp vô địch và tổng giải thưởng lên tới 50 triệu đồng.',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1200&h=400',
    sport: 'badminton',
    sportLabel: 'Cầu lông',
    link: '/tournaments/1'
  },
  {
    id: 3,
    title: 'Giải Pickleball Đôi Nam Nữ Thanh Khê 2026',
    subtitle: 'SỰ KIỆN NÓNG TUẦN NÀY 🔥',
    description: 'Sân chơi giao lưu Pickleball lớn nhất khu vực Thanh Khê. Đăng ký theo cặp nam nữ trước ngày 30/08 để nhận ưu đãi lệ phí.',
    image: 'https://images.unsplash.com/photo-1611566144960-4f7b1376a591?auto=format&fit=crop&q=80&w=1200&h=400',
    sport: 'pickleball',
    sportLabel: 'Pickleball',
    link: '/tournaments/3'
  }
];

const QUICK_TAGS = [
  { label: 'Tất cả giải đấu 🏆', action: 'all_tournaments' },
  { label: 'Đang mở đăng ký 🟢', action: 'open_registration' },
  { label: 'Sân Tiên Sơn 🏟️', action: 'court_tienson' },
  { label: 'Pickleball HOT 🔥', action: 'pickleball_hot' },
  { label: 'Cần người gấp ⏰', action: 'need_players' }
];

const generateMockPosts = () => {
  const posts = [
    {
      id: 1, 
      type: 'tournament', 
      sport: 'badminton',
      sportLabel: 'Cầu lông',
      authorName: 'CLB Đà Nẵng Open', 
      authorAvatar: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=100&h=100',
      coverImage: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=500&h=250',
      postedTime: 'Đăng 2 giờ trước', 
      statusText: 'Đang mở', 
      title: 'Giải Cầu Lông Đà Nẵng Open 2026', 
      desc: 'Giải đấu phong trào quy mô lớn nhất năm dành cho các tay vợt bán chuyên và phong trào tại Cung Tiên Sơn.', 
      location: 'Cung Thể Thao Tiên Sơn', 
      dateStr: '05/07/2026', 
      fee: '500.000 VNĐ / người'
    },
    {
      id: 2, 
      type: 'match', 
      sport: 'badminton',
      sportLabel: 'Cầu lông',
      authorName: 'Nguyễn Ánh', 
      authorAvatar: 'https://ui-avatars.com/api/?name=Nguyen+Anh&background=ffb2b9&color=fff',
      postedTime: 'Đăng 11 giờ trước', 
      statusText: 'Cần người', 
      title: 'Giao lưu cầu lông tối thứ 3', 
      desc: 'Tuyển vãng lai sáng mai thứ 3 (30/06). Yêu cầu nhiệt tình, vui vẻ, không quạu.', 
      location: 'Sân cầu lông Pinpon (KCN An Đồn)', 
      schedule: '08:30 - 10:30', 
      level: 'Yếu - TB Yếu',
      fee: '40.000 VNĐ / buổi',
      slots: 'Còn 2 slot'
    },
    {
      id: 3, 
      type: 'tournament', 
      sport: 'pickleball',
      sportLabel: 'Pickleball',
      authorName: 'CLB Thanh Khê', 
      authorAvatar: 'https://images.unsplash.com/photo-1611566144960-4f7b1376a591?auto=format&fit=crop&q=80&w=100&h=100',
      coverImage: 'https://images.unsplash.com/photo-1611566144960-4f7b1376a591?auto=format&fit=crop&q=80&w=500&h=250',
      postedTime: 'Đăng 1 ngày trước', 
      statusText: 'Sắp đóng', 
      title: 'Giải Pickleball Đôi Nam Nữ Thanh Khê 2026', 
      desc: 'Giải đấu giao lưu nội bộ quận Thanh Khê, tập trung vào thể thức đôi nam nữ phong trào.', 
      location: 'Sân Tuyên Sơn Pickleball', 
      dateStr: '02/09/2026', 
      fee: '300.000 VNĐ / cặp'
    },
    {
      id: 4, 
      type: 'match', 
      sport: 'pickleball',
      sportLabel: 'Pickleball',
      authorName: 'Mai Sương', 
      authorAvatar: 'https://ui-avatars.com/api/?name=Mai+Suong&background=c2f3e8&color=00685f',
      postedTime: 'Đăng 1 giờ trước', 
      statusText: 'Cần người', 
      title: 'Gom kèo Pickleball chiều nay', 
      desc: 'Cần tuyển 1 hoặc 2 vợt chơi cùng sân Tuyên Sơn, trình độ trung bình yếu đến trung bình.', 
      location: 'Sân Tuyên Sơn Pickleball', 
      schedule: '17:00 - 19:00', 
      level: 'DUPR 3.0 - 3.5',
      fee: '50.000 VNĐ / người',
      slots: 'Còn 1 slot'
    }
  ];

  const names = ['Hoàng Minh', 'Lê Hữu', 'Phạm Tuấn', 'Vũ Ngọc', 'Bùi Xuân', 'Đặng Thùy', 'Ngô Kiến', 'Đỗ Duy'];
  const titles = ['Giải Cầu Lông Đơn Nam Hè 2026', 'Giao Hữu Pickleball Cuối Tuần', 'Giải Cầu Lông Tranh Cúp Mùa Hè', 'Giải Pickleball Nội Bộ Mở Rộng', 'Thách Đấu Cầu Lông Chủ Nhật'];

  for (let i = 5; i <= 24; i++) {
    const isTournament = i % 2 === 0;
    const isPickleball = i % 3 === 0;
    const court = COURTS[Math.floor(Math.random() * COURTS.length)];
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + (i % 5);

    if (isTournament) {
      posts.push({
        id: i, 
        type: 'tournament', 
        sport: isPickleball ? 'pickleball' : 'badminton',
        sportLabel: isPickleball ? 'Pickleball' : 'Cầu lông',
        authorName: 'CLB ' + name, 
        authorAvatar: 'https://ui-avatars.com/api/?name=CLB&background=e2e8f0&color=475569',
        coverImage: isPickleball 
          ? 'https://images.unsplash.com/photo-1611566144960-4f7b1376a591?auto=format&fit=crop&q=80&w=500&h=250'
          : 'https://images.unsplash.com/photo-1560012206-a88b5113d5b7?auto=format&fit=crop&q=80&w=500&h=250',
        postedTime: `Đăng ${i % 5 + 1} giờ trước`, 
        statusText: 'Đang mở', 
        title: titles[Math.floor(Math.random() * titles.length)], 
        desc: 'Một giải đấu đầy kịch tính đang chờ đón các vận động viên đăng ký tham gia cọ xát và giành những phần quà hấp dẫn.', 
        location: court, 
        dateStr: '15/07/2026', 
        fee: '200.000 VNĐ / người'
      });
    } else {
      posts.push({
        id: i, 
        type: 'match', 
        sport: isPickleball ? 'pickleball' : 'badminton',
        sportLabel: isPickleball ? 'Pickleball' : 'Cầu lông',
        authorName: name, 
        authorAvatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=e8f0fe&color=1a73e8`,
        postedTime: `Đăng ${i % 5 + 1} giờ trước`, 
        statusText: 'Cần người', 
        title: isPickleball ? 'Kèo Pickleball tối nay' : 'Kèo Cầu lông vãng lai', 
        desc: 'Thiếu người chơi vãng lai vui vẻ hòa đồng. Sân đẹp, bóng/cầu cung cấp sẵn, chỉ cần xách vợt đến chơi.', 
        location: court, 
        schedule: '18:00 - 20:00',
        level: isPickleball 
          ? ['DUPR 2.0 - 2.5', 'DUPR 3.0 - 3.5', 'DUPR 4.0 - 4.5', 'DUPR 5.0+'][Math.floor(Math.random() * 4)]
          : ['Yếu - TB Yếu', 'Trung bình', 'Khá - Giỏi'][Math.floor(Math.random() * 3)], 
        fee: '45.000 VNĐ / người',
        slots: 'Còn 2 slot'
      });
    }
  }

  return posts;
};

const MOCK_POSTS = generateMockPosts();

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const courtQuery = searchParams.get('court') || '';
  
  // Custom Dropdown Open States
  const [openDropdown, setOpenDropdown] = useState<'court' | 'level' | null>(null);

  // Modal State for Match Details
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carousel Active Slide State
  const [activeSlide, setActiveSlide] = useState(0);

  // Filter States
  const [level, setLevel] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Infinity Scroll state
  const [displayCount, setDisplayCount] = useState(8);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Greeting
  const currentHour = new Date().getHours();
  let greeting = 'Chào buổi tối';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Chào buổi sáng';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Chào buổi chiều';
  
  const { userName } = useAuth();

  // Auto-run slide timer
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  // Close dropdowns on window click
  useEffect(() => {
    const handleClose = () => {
      setOpenDropdown(null);
    };
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('q', val);
    else newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleCourtChange = (courtName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (courtName) newParams.set('court', courtName);
    else newParams.delete('court');
    setSearchParams(newParams);
  };

  const handleSportFilterChange = (sport: string) => {
    setSportFilter(sport);
    setLevel(''); // Reset level when changing sports to prevent mismatching filters
  };

  const handleQuickTagClick = (action: string) => {
    if (action === 'all_tournaments') {
      handleSportFilterChange('');
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', 'Giải');
      setSearchParams(newParams);
    } else if (action === 'open_registration') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', 'Đang mở');
      setSearchParams(newParams);
    } else if (action === 'court_tienson') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('court', 'Cung Thể Thao Tiên Sơn');
      setSearchParams(newParams);
    } else if (action === 'pickleball_hot') {
      handleSportFilterChange('pickleball');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('court');
      setSearchParams(newParams);
    } else if (action === 'need_players') {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('q', 'Cần người');
      setSearchParams(newParams);
    }
  };

  const isTagActive = (action: string) => {
    if (action === 'all_tournaments') return query === 'Giải';
    if (action === 'open_registration') return query === 'Đang mở';
    if (action === 'court_tienson') return courtQuery === 'Cung Thể Thao Tiên Sơn';
    if (action === 'pickleball_hot') return sportFilter === 'pickleball' && !courtQuery;
    if (action === 'need_players') return query === 'Cần người';
    return false;
  };

  const filteredPosts = MOCK_POSTS.filter(post => {
    let matches = true;
    if (query) {
      const searchStr = query.toLowerCase();
      matches = (
        post.authorName.toLowerCase().includes(searchStr) ||
        post.title.toLowerCase().includes(searchStr) ||
        post.desc.toLowerCase().includes(searchStr) ||
        post.location.toLowerCase().includes(searchStr)
      );
    }
    if (courtQuery) {
      matches = matches && post.location.toLowerCase().includes(courtQuery.toLowerCase());
    }
    if (sportFilter) {
      matches = matches && post.sport === sportFilter;
    }
    if (level) {
      if (post.type === 'match') {
        matches = matches && post.level.toLowerCase().includes(level.toLowerCase());
      }
    }
    return matches;
  });

  const displayedPosts = filteredPosts.slice(0, displayCount);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setDisplayCount(prev => Math.min(prev + 8, filteredPosts.length));
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => observer.disconnect();
  }, [filteredPosts.length]);

  // Dynamic Level Options based on Sport selected
  const getLevelOptions = () => {
    if (sportFilter === 'badminton') {
      return [
        { label: 'Tất cả trình độ cầu lông', value: '', group: 'all' },
        { label: 'Yếu - TB Yếu', value: 'yếu', group: 'all' },
        { label: 'Trung bình', value: 'trung bình', group: 'all' },
        { label: 'Khá - Giỏi', value: 'khá', group: 'all' }
      ];
    }
    if (sportFilter === 'pickleball') {
      return [
        { label: 'Tất cả trình độ DUPR', value: '', group: 'all' },
        { label: 'DUPR 2.0 - 2.5 (Nhập môn)', value: '2.0', group: 'all' },
        { label: 'DUPR 3.0 - 3.5 (Trung bình)', value: '3.0', group: 'all' },
        { label: 'DUPR 4.0 - 4.5 (Khá)', value: '4.0', group: 'all' },
        { label: 'DUPR 5.0+ (Chuyên nghiệp)', value: '5.0', group: 'all' }
      ];
    }
    // Combined / grouped options when "Tất cả" is selected
    return [
      { label: 'Tất cả trình độ', value: '', group: 'all' },
      { label: 'Cầu lông: Yếu - TB Yếu', value: 'yếu', group: 'Cầu lông' },
      { label: 'Cầu lông: Trung bình', value: 'trung bình', group: 'Cầu lông' },
      { label: 'Cầu lông: Khá - Giỏi', value: 'khá', group: 'Cầu lông' },
      { label: 'Pickleball: DUPR 2.0 - 2.5', value: '2.0', group: 'Pickleball' },
      { label: 'Pickleball: DUPR 3.0 - 3.5', value: '3.0', group: 'Pickleball' },
      { label: 'Pickleball: DUPR 4.0 - 4.5', value: '4.0', group: 'Pickleball' },
      { label: 'Pickleball: DUPR 5.0+', value: '5.0', group: 'Pickleball' }
    ];
  };

  const getLevelButtonLabel = () => {
    if (sportFilter === 'badminton') {
      if (level === 'yếu') return 'Yếu - TB Yếu';
      if (level === 'trung bình') return 'Trung bình';
      if (level === 'khá') return 'Khá - Giỏi';
    }
    if (sportFilter === 'pickleball') {
      if (level === '2.0') return 'DUPR 2.0 - 2.5';
      if (level === '3.0') return 'DUPR 3.0 - 3.5';
      if (level === '4.0') return 'DUPR 4.0 - 4.5';
      if (level === '5.0') return 'DUPR 5.0+';
    }
    // Combined / fallback label checks
    if (level === 'yêu') return 'Cầu lông: Yếu - TB Yếu';
    if (level === 'trung bình') return 'Cầu lông: Trung bình';
    if (level === 'khá') return 'Cầu lông: Khá - Giỏi';
    if (level === '2.0') return 'Pickleball: DUPR 2.0-2.5';
    if (level === '3.0') return 'Pickleball: DUPR 3.0-3.5';
    if (level === '4.0') return 'Pickleball: DUPR 4.0-4.5';
    if (level === '5.0') return 'Pickleball: DUPR 5.0+';
    
    return 'Tất cả trình độ';
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      {/* Header Section */}
      <header className="mb-lg text-left">
        <h1 className="font-display-lg text-display-lg md:text-[48px] text-[32px] font-bold text-on-background mb-2">
          {greeting}, {userName}!
        </h1>
        <p className="text-on-surface-variant font-body-md text-body-md">Tìm kiếm giải đấu và tham gia các kèo đấu thể thao quanh bạn.</p>
      </header>

      {/* Hero Carousel Banner (Using robust CSS backgrounds to avoid overlapping browser alt texts) */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-outline-variant/30 h-[200px] md:h-[280px] mb-lg bg-[#111b21] group/carousel">
        {CAROUSEL_SLIDES.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 invisible pointer-events-none'
            }`}
          >
            {/* Background Image Layer */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[8000ms] ease-out scale-105 group-hover/carousel:scale-100"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundColor: '#111b21'
              }}
            />
            {/* Gradient Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
            
            {/* Content Layer */}
            <div className="absolute inset-0 flex flex-col justify-center p-md md:p-xl text-white max-w-xl z-20">
              <span className="text-[10px] md:text-xs font-bold text-primary-fixed-dim tracking-widest uppercase mb-1">
                {slide.subtitle}
              </span>
              <h2 className="text-[20px] md:text-[28px] font-bold tracking-tight mb-2 leading-tight">
                {slide.title}
              </h2>
              <p className="text-[11px] md:text-sm text-gray-300 line-clamp-2 mb-4">
                {slide.description}
              </p>
              <button 
                onClick={() => navigate(slide.link)}
                className="w-max bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 flex items-center gap-1"
              >
                Xem chi tiết giải <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
        
        {/* Indicators */}
        <div className="absolute bottom-3 right-4 z-25 flex gap-2">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === activeSlide ? 'bg-primary scale-110 w-6' : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Horizontal Filter Bar with relative and z-30 stack index */}
      <div className="relative z-30 bg-white/80 backdrop-blur-md border border-outline-variant/30 shadow-md rounded-3xl p-md mb-md flex flex-col gap-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-sm items-center w-full">
          {/* Ô Tìm Kiếm - Synced with Header Search */}
          <div className="relative lg:col-span-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input 
              type="text" 
              placeholder="Tìm giải đấu, kèo..." 
              value={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-2xl font-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Lọc Môn Thể Thao - Premium Segmented Control / Tab control */}
          <div className="flex bg-surface-container-low p-1 rounded-2xl border border-outline-variant/50 lg:col-span-3">
            <button 
              onClick={() => handleSportFilterChange('')}
              className={`flex-1 py-2 px-3 rounded-xl font-label-md text-xs font-semibold transition-all ${
                sportFilter === '' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => handleSportFilterChange('badminton')}
              className={`flex-1 py-2 px-3 rounded-xl font-label-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                sportFilter === 'badminton' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              🏸 Cầu lông
            </button>
            <button 
              onClick={() => handleSportFilterChange('pickleball')}
              className={`flex-1 py-2 px-3 rounded-xl font-label-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                sportFilter === 'pickleball' 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              🏓 Pickleball
            </button>
          </div>

          {/* Lọc Sân - Custom dropdown with location icon */}
          <div className="relative lg:col-span-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === 'court' ? null : 'court');
                setShowDatePicker(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-2xl font-body-sm text-on-surface hover:border-primary transition-all text-left"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                <span className="truncate font-semibold text-on-surface">{courtQuery || 'Tất cả các sân'}</span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
            </button>

            {openDropdown === 'court' && (
              <div className="absolute left-0 top-full mt-2 w-[240px] z-50 bg-white border border-outline-variant shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5 max-h-[250px] overflow-y-auto custom-scrollbar animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => {
                    handleCourtChange('');
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-body-sm hover:bg-surface-container-low transition-colors ${
                    !courtQuery ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface'
                  }`}
                >
                  Tất cả các sân
                </button>
                {COURTS.map(c => (
                  <button 
                    key={c}
                    onClick={() => {
                      handleCourtChange(c);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-body-sm hover:bg-surface-container-low transition-colors ${
                      courtQuery === c ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lọc Trình Độ - Custom Dynamic levels dropdown based on Sport Filter */}
          <div className="relative lg:col-span-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(openDropdown === 'level' ? null : 'level');
                setShowDatePicker(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-2xl font-body-sm text-on-surface hover:border-primary transition-all text-left"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">military_tech</span>
                <span className="truncate font-semibold text-on-surface">
                  {getLevelButtonLabel()}
                </span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
            </button>

            {openDropdown === 'level' && (
              <div className="absolute left-0 top-full mt-2 w-[240px] z-50 bg-white border border-outline-variant shadow-xl rounded-2xl p-1.5 flex flex-col gap-0.5 max-h-[320px] overflow-y-auto custom-scrollbar animate-fade-in-up" onClick={e => e.stopPropagation()}>
                {getLevelOptions().map((item, idx) => {
                  const showHeader = idx === 0 || getLevelOptions()[idx - 1].group !== item.group;
                  return (
                    <React.Fragment key={idx}>
                      {showHeader && item.group && item.group !== 'all' && (
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 bg-surface-container-low rounded-lg my-1 first:mt-0">
                          {item.group}
                        </div>
                      )}
                      <button 
                        onClick={() => {
                          setLevel(item.value);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-body-sm hover:bg-surface-container-low transition-colors ${
                          level === item.value ? 'bg-primary/5 text-primary font-semibold' : 'text-on-surface'
                        }`}
                      >
                        {item.label}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bộ chọn Ngày/Giờ */}
          <div className="relative lg:col-span-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDatePicker(!showDatePicker);
                setOpenDropdown(null);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-2xl font-body-sm text-on-surface hover:border-primary transition-all text-left"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                <span className="truncate font-semibold text-on-surface">
                  {startDate ? `${startDate.toLocaleDateString('vi-VN')} ${endDate ? `- ${endDate.toLocaleDateString('vi-VN')}` : ''}` : 'Chọn ngày'}
                </span>
              </span>
              <span className="material-symbols-outlined text-[18px] text-on-surface-variant">expand_more</span>
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-outline-variant shadow-2xl rounded-3xl p-4 custom-datepicker animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  inline
                />
                <button 
                  onClick={() => setShowDatePicker(false)}
                  className="w-full py-2 mt-2 bg-primary text-on-primary rounded-xl font-label-md hover:opacity-90 text-sm shadow-md"
                >
                  Xác nhận
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Search Tags with active state highlights */}
      <div className="flex flex-wrap gap-2 mb-xl items-center px-1">
        <span className="text-[11px] font-bold text-on-surface-variant/80 uppercase tracking-wider mr-2">Gợi ý lọc:</span>
        {QUICK_TAGS.map((tag, idx) => {
          const isActive = isTagActive(tag.action);
          return (
            <button
              key={idx}
              onClick={() => handleQuickTagClick(tag.action)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                isActive 
                  ? 'bg-primary text-on-primary border-primary' 
                  : 'bg-white/60 border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Grid bài đăng chính (Nâng cấp thành 4 cột grid) */}
      <section className="flex flex-col gap-md">
        <div className="flex justify-between items-center mb-sm">
          <h2 className="font-headline-md text-headline-md font-bold text-on-background flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[28px]">sports_tennis</span>
            Bảng tin tổng hợp
          </h2>
          <span className="text-sm font-semibold text-on-surface-variant">{filteredPosts.length} kết quả</span>
        </div>

        {/* Lưới card hiển thị */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
          {displayedPosts.map((post, idx) => {
            const isTournament = post.type === 'tournament';
            
            return (
              <div 
                key={post.id}
                onClick={() => {
                  if (isTournament) {
                    navigate(`/tournaments/${post.id}`);
                  } else {
                    setSelectedPost(post);
                    setIsModalOpen(true);
                  }
                }}
                className="relative z-10 bg-white/80 backdrop-blur-sm border border-outline-variant/30 rounded-3xl overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300 cursor-pointer group h-full shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${(idx % 4) * 0.08}s` }}
              >
                {/* 1. THẺ GIẢI ĐẤU (CÓ BANNER LỚN) */}
                {isTournament ? (
                  <>
                    <div className="relative h-[160px] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.opacity = '0'; // Hide broken image completely to show the fallback gradient
                        }}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className={`absolute top-3 left-3 px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider text-white shadow-sm ${
                        post.sport === 'badminton' ? 'bg-[#2e7d32]' : 'bg-[#e65100]'
                      }`}>
                        {post.sportLabel}
                      </span>
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] rounded-full shadow-sm">
                        {post.statusText}
                      </span>
                    </div>
                    
                    <div className="p-md flex flex-col flex-1 gap-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={post.authorAvatar} alt="" className="w-5 h-5 rounded-full object-cover border border-outline-variant/30" />
                        <span className="font-label-md text-[11px] text-on-surface-variant font-semibold truncate">{post.authorName}</span>
                      </div>
                      <h3 className="font-title-lg text-[16px] leading-[22px] font-bold text-on-background line-clamp-2 min-h-[44px]">
                        {post.title}
                      </h3>
                      <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2 mb-2">
                        {post.desc}
                      </p>
                      
                      <div className="mt-auto space-y-1.5 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/20">
                        <div className="flex items-center gap-2 text-on-surface text-[12px]">
                          <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                          <span className="truncate">{post.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-[12px]">
                          <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                          <span>{post.dateStr}</span>
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-[12px] font-bold text-[#00685f]">
                          <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
                          <span>{post.fee}</span>
                        </div>
                      </div>

                      <button className="w-full mt-3 py-2 bg-primary text-on-primary rounded-xl font-label-md text-sm hover:opacity-95 shadow-sm active:scale-95 transition-all">
                        Đăng ký ngay
                      </button>
                    </div>
                  </>
                ) : (
                  /* 2. THẺ KÈO ĐẤU (GỌN GÀNG, TẬP TRUNG THÔNG TIN THỰC TẾ) */
                  <div className="p-md flex flex-col flex-1 gap-xs justify-between">
                    <div>
                      {/* Avatar, Tag, status */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <img src={post.authorAvatar} alt="" className="w-9 h-9 rounded-full object-cover border border-outline-variant/30" />
                          <div>
                            <h4 className="font-title-lg text-[13px] leading-[18px] font-bold text-on-background">{post.authorName}</h4>
                            <span className="text-[10px] text-on-surface-variant block">{post.postedTime}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider text-white ${
                            post.sport === 'badminton' ? 'bg-[#2e7d32]/80' : 'bg-[#e65100]/80'
                          }`}>
                            {post.sportLabel}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-bold bg-[#e8f5e9] text-[#2e7d32] rounded-full">
                            {post.statusText}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-title-lg text-[15px] leading-[20px] font-bold text-on-background mb-1">
                        {post.title}
                      </h3>
                      <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-3 mb-3">
                        {post.desc}
                      </p>
                    </div>

                    <div className="space-y-2 mt-auto">
                      <div className="grid grid-cols-2 gap-1.5 bg-surface-container-low p-2.5 rounded-xl text-[11px] border border-outline-variant/20">
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                          <span className="font-semibold truncate">{post.schedule}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[14px] text-primary">stars</span>
                          <span className="font-semibold truncate">{post.level}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[14px] text-primary">payments</span>
                          <span className="font-semibold truncate">{post.fee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface">
                          <span className="material-symbols-outlined text-[14px] text-primary">group</span>
                          <span className="font-semibold truncate text-[#d32f2f]">{post.slots}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] px-1 truncate">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="truncate">{post.location}</span>
                      </div>

                      <button className="w-full py-2 bg-secondary-container text-on-secondary-container rounded-xl font-label-md text-sm hover:opacity-95 active:scale-95 transition-all">
                        Tham gia kèo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="col-span-full py-xl text-center text-on-surface-variant flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">search_off</span>
              <p>Không tìm thấy kết quả nào cho tiêu chí của bạn</p>
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

      {/* Match Details Modal */}
      <MatchDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        post={selectedPost} 
      />
    </main>
  );
}
