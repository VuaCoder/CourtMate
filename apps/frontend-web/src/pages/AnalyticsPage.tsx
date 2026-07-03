import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';

// Parse Vietnamese date formats (e.g. "12 Th9 2026", "03 Thg 07, 2026") into standard Dates
function parseVietnameseDate(dateStr: string): Date {
  if (!dateStr) return new Date(2026, 6, 1);
  const cleanStr = dateStr.replace(/,/g, '').trim();
  const parts = cleanStr.split(/\s+/);
  
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1];
    const year = parseInt(parts[parts.length - 1], 10);
    
    let month = 1;
    const directMonthMatch = monthStr.match(/\d+/);
    if (directMonthMatch) {
      month = parseInt(directMonthMatch[0], 10);
    } else if (parts.length === 4) {
      const monthNumMatch = parts[2].match(/\d+/);
      if (monthNumMatch) {
        month = parseInt(monthNumMatch[0], 10);
      }
    }
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(2026, month - 1, day); // Align to current year 2026
    }
  }
  
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    d.setFullYear(2026);
    return d;
  }
  return new Date(2026, 6, 1);
}

// Generate deterministic mock registrations spanning Jun-Nov 2026
const generateDeterministicMockData = () => {
  const statuses: ('approved' | 'pending' | 'rejected')[] = [
    'approved', 'approved', 'approved', 'pending', 'rejected', 'approved', 'pending'
  ];
  const categories = ['Đôi nam', 'Đôi nữ', 'Đôi nam nữ', 'Đơn nam', 'Đơn nữ'];
  const levels = ['Khá', 'Trung bình khá', 'Trung bình', 'Trung bình yếu', 'Yếu'];
  const tournaments = [
    'Giải Cầu Lông Đà Nẵng Open 2026',
    'Giải Cầu Lông Đôi Nam Nữ Thanh Khê',
    'Giải Cầu Lông Hoà Xuân Mở Rộng',
    'Giải Cầu Lông Đơn Nam Bế Văn Đàn'
  ];
  const names = [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Tâm', 'Phạm Ngọc Mai', 'Vũ Quốc Bảo',
    'Hoàng Minh', 'Lê Hữu', 'Phạm Tuấn', 'Vũ Ngọc', 'Bùi Xuân', 'Đặng Thùy', 'Ngô Kiến',
    'Đỗ Duy', 'Nguyễn Thị Cúc', 'Lê Văn Đạt', 'Trần Hữu Giang', 'Phạm Minh Hải',
    'Vũ Thị Hoa', 'Hoàng Quốc Khánh', 'Lê Mỹ Linh', 'Nguyễn Tiến Nam', 'Phạm Hồng Nhung',
    'Đỗ Minh Quân', 'Trần Thanh Sơn', 'Vũ Hoài Trang', 'Nguyễn Việt Anh', 'Bùi Đức Huy',
    'Phan Thanh Trí', 'Hồ Quốc Bảo', 'Mai Sương', 'Đỗ Duy Mạnh', 'Phạm Đức Huy'
  ];
  
  const mock: any[] = [];
  let id = 1000;
  
  let seed = 12345;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  const distributions = [
    { month: 5, year: 2026, count: 28 }, // Jun
    { month: 6, year: 2026, count: 35 }, // Jul
    { month: 7, year: 2026, count: 50 }, // Aug
    { month: 8, year: 2026, count: 56 }, // Sep
    { month: 9, year: 2026, count: 48 }, // Oct
    { month: 10, year: 2026, count: 42 }, // Nov
  ];
  
  distributions.forEach(({ month, year, count }) => {
    for (let i = 0; i < count; i++) {
      const day = Math.floor(random() * 28) + 1;
      const status = statuses[Math.floor(random() * statuses.length)];
      const category = categories[Math.floor(random() * categories.length)];
      const level = levels[Math.floor(random() * levels.length)];
      const tournament = tournaments[Math.floor(random() * tournaments.length)];
      const name = names[Math.floor(random() * names.length)] + ' ' + String.fromCharCode(65 + (i % 26));
      
      const date = new Date(year, month, day);
      const dateStr = `${day.toString().padStart(2, '0')} Thg ${(month + 1).toString().padStart(2, '0')}, ${year}`;
      
      mock.push({
        id: id++,
        name,
        phone: `09${Math.floor(10000000 + random() * 90000000)}`,
        email: `${name.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`,
        tournament,
        category,
        level,
        status,
        date: dateStr
      });
    }
  });
  
  return mock;
};

const BASE_MOCK_DATA = generateDeterministicMockData();

export default function AnalyticsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'revenue'>('overview');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Date Range Picker States
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 5, 1)); // Jun 1, 2026
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 10, 30)); // Nov 30, 2026
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date(2026, 6, 1)); // Jul 2026
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Zooming & Panning States
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartPanOffset, setDragStartPanOffset] = useState(0);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Initial Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('courtmate_registrations');
    if (saved) {
      setRegistrations(JSON.parse(saved));
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Listen to external edits to registrations
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('courtmate_registrations');
      if (saved) {
        setRegistrations(JSON.parse(saved));
      }
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset zoom scale if the date range changes to avoid coordinate confusion
  useEffect(() => {
    setZoomScale(1.0);
    setPanOffset(0);
  }, [startDate, endDate]);

  // Combine real registrations with baseline mock registrations
  const allRegs = useMemo(() => {
    const liveIds = new Set(registrations.map(r => r.id));
    const filteredBase = BASE_MOCK_DATA.filter(r => !liveIds.has(r.id));
    return [...registrations, ...filteredBase];
  }, [registrations]);

  // Filter registrations based on selected Date Range
  const filteredRegs = useMemo(() => {
    return allRegs.filter(r => {
      const d = parseVietnameseDate(r.date);
      const t = d.getTime();
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      const e = new Date(endDate || startDate);
      e.setHours(23, 59, 59, 999);
      return t >= s.getTime() && t <= e.getTime();
    });
  }, [allRegs, startDate, endDate]);

  // Calculate live statistics
  const stats = useMemo(() => {
    const total = filteredRegs.length;
    const approved = filteredRegs.filter(r => r.status === 'approved').length;
    const pending = filteredRegs.filter(r => r.status === 'pending').length;
    const rejected = filteredRegs.filter(r => r.status === 'rejected').length;

    const successRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const revenue = approved * 150000; // 150k per participant

    // Level Breakdown
    const levelCount: Record<string, number> = {
      'Khá': 0,
      'Trung bình khá': 0,
      'Trung bình': 0,
      'Trung bình yếu': 0,
      'Yếu': 0
    };
    filteredRegs.forEach(r => {
      const lvl = r.level || '';
      let matched = false;
      Object.keys(levelCount).forEach(k => {
        if (lvl.toLowerCase().includes(k.toLowerCase())) {
          levelCount[k]++;
          matched = true;
        }
      });
      if (!matched && lvl) {
        levelCount['Trung bình']++;
      }
    });

    // Content/Category Breakdown
    const categoryCount: Record<string, number> = {
      'Đôi nam': 0,
      'Đôi nữ': 0,
      'Đôi nam nữ': 0,
      'Đơn nam': 0,
      'Đơn nữ': 0
    };
    filteredRegs.forEach(r => {
      const cat = r.category || '';
      let matched = false;
      Object.keys(categoryCount).forEach(k => {
        if (cat.toLowerCase().includes(k.toLowerCase())) {
          categoryCount[k]++;
          matched = true;
        }
      });
      if (!matched && cat) {
        categoryCount['Đôi nam nữ']++;
      }
    });

    return {
      total,
      approved,
      pending,
      rejected,
      successRate,
      revenue,
      levelCount,
      categoryCount
    };
  }, [filteredRegs]);

  // Construct chart timeline and coordinates dynamically based on Date Range
  const { chartTimeline, pointsTop, pointsBottom, maxDataVal } = useMemo(() => {
    const diffTime = Math.abs((endDate || startDate).getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeline: string[] = [];
    let regsGrouped: number[] = [];
    let apprsGrouped: number[] = [];
    
    if (diffDays <= 31) {
      // Daily view: Create a point for each day
      const datesArray: Date[] = [];
      let cur = new Date(startDate);
      const targetEnd = new Date(endDate || startDate);
      while (cur <= targetEnd) {
        datesArray.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      
      timeline = datesArray.map(d => d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }));
      
      datesArray.forEach(d => {
        const s = new Date(d);
        s.setHours(0,0,0,0);
        const e = new Date(d);
        e.setHours(23,59,59,999);
        
        const dayRegs = filteredRegs.filter(r => {
          const rd = parseVietnameseDate(r.date);
          return rd.getTime() >= s.getTime() && rd.getTime() <= e.getTime();
        });
        
        regsGrouped.push(dayRegs.length);
        apprsGrouped.push(dayRegs.filter(r => r.status === 'approved').length);
      });
    } else if (diffDays <= 90) {
      // Weekly view: split the range into 6 periods
      const stepMs = diffTime / 6;
      const periods: { start: Date; end: Date; label: string }[] = [];
      for (let i = 0; i < 6; i++) {
        const s = new Date(startDate.getTime() + i * stepMs);
        const e = new Date(startDate.getTime() + (i + 1) * stepMs);
        const label = `${s.getDate()}/${s.getMonth() + 1}-${e.getDate()}/${e.getMonth() + 1}`;
        periods.push({ start: s, end: e, label });
      }
      
      timeline = periods.map(p => p.label);
      periods.forEach(p => {
        const pRegs = filteredRegs.filter(r => {
          const rd = parseVietnameseDate(r.date);
          return rd.getTime() >= p.start.getTime() && rd.getTime() <= p.end.getTime();
        });
        regsGrouped.push(pRegs.length);
        apprsGrouped.push(pRegs.filter(r => r.status === 'approved').length);
      });
    } else {
      // Monthly view (Jun, Jul, Aug, Sep, Oct, Nov)
      const startMonth = startDate.getMonth();
      const endMonth = (endDate || startDate).getMonth();
      const monthNames = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
      
      for (let m = startMonth; m <= endMonth; m++) {
        timeline.push(monthNames[m] || `Thg ${m + 1}`);
        const mRegs = filteredRegs.filter(r => {
          const rd = parseVietnameseDate(r.date);
          return rd.getMonth() === m;
        });
        
        regsGrouped.push(mRegs.length);
        apprsGrouped.push(mRegs.filter(r => r.status === 'approved').length);
      }
    }

    // Scale values based on active tab
    let finalRegs = regsGrouped;
    let finalApprs = apprsGrouped;
    if (activeTab === 'revenue') {
      finalRegs = regsGrouped.map(v => v * 150000);
      finalApprs = apprsGrouped.map(v => v * 150000);
    }

    const maxReg = finalRegs.length > 0 ? Math.max(...finalRegs) : 10;
    const maxAppr = finalApprs.length > 0 ? Math.max(...finalApprs) : 10;
    const maxVal = Math.max(maxReg, maxAppr, 10);

    return {
      chartTimeline: timeline,
      pointsTop: finalRegs,
      pointsBottom: finalApprs,
      maxDataVal: maxVal
    };
  }, [filteredRegs, startDate, endDate, activeTab]);

  // SVG Chart settings
  const width = 760;
  const height = 280;
  const paddingX = 45;
  const paddingY = 20;

  // Dynamically compute y-axis clean ticks
  const maxTick = useMemo(() => {
    const rawMax = maxDataVal;
    if (rawMax <= 10) return 10;
    if (rawMax <= 50) return 50;
    if (rawMax <= 100) return 100;
    if (rawMax <= 250) return 250;
    if (rawMax <= 500) return 500;

    const power = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const normalized = rawMax / power;
    let cleanNormalized = 10;
    if (normalized <= 1.2) cleanNormalized = 1.2;
    else if (normalized <= 1.5) cleanNormalized = 1.5;
    else if (normalized <= 2) cleanNormalized = 2;
    else if (normalized <= 2.5) cleanNormalized = 2.5;
    else if (normalized <= 3) cleanNormalized = 3;
    else if (normalized <= 4) cleanNormalized = 4;
    else if (normalized <= 5) cleanNormalized = 5;
    else if (normalized <= 6) cleanNormalized = 6;
    else if (normalized <= 7.5) cleanNormalized = 7.5;
    else if (normalized <= 8) cleanNormalized = 8;
    else cleanNormalized = 10;

    return cleanNormalized * power;
  }, [maxDataVal]);

  const yTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= 5; i++) {
      ticks.push((maxTick / 5) * i);
    }
    return ticks;
  }, [maxTick]);

  // Compute SVG Points based on Zoom and Pan
  const pointsTopCoords = useMemo(() => {
    return pointsTop.map((val, idx) => {
      const xBase = paddingX + (idx / (pointsTop.length - 1 || 1)) * (width - 2 * paddingX);
      const x = paddingX + (xBase - paddingX) * zoomScale + panOffset;
      const y = height - paddingY - (val / (maxTick || 1)) * (height - 2 * paddingY);
      return { x, y, value: val };
    });
  }, [pointsTop, zoomScale, panOffset, maxTick, width, height]);

  const pointsBottomCoords = useMemo(() => {
    return pointsBottom.map((val, idx) => {
      const xBase = paddingX + (idx / (pointsBottom.length - 1 || 1)) * (width - 2 * paddingX);
      const x = paddingX + (xBase - paddingX) * zoomScale + panOffset;
      const y = height - paddingY - (val / (maxTick || 1)) * (height - 2 * paddingY);
      return { x, y, value: val };
    });
  }, [pointsBottom, zoomScale, panOffset, maxTick, width, height]);

  // SVG Paths
  const linePathTop = useMemo(() => {
    if (pointsTopCoords.length === 0) return '';
    return pointsTopCoords.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [pointsTopCoords]);

  const linePathBottom = useMemo(() => {
    if (pointsBottomCoords.length === 0) return '';
    return pointsBottomCoords.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [pointsBottomCoords]);

  const areaPathTop = useMemo(() => {
    if (pointsTopCoords.length === 0) return '';
    const startX = pointsTopCoords[0].x;
    const endX = pointsTopCoords[pointsTopCoords.length - 1].x;
    const bottomY = height - paddingY;
    return `${linePathTop} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [pointsTopCoords, linePathTop, height]);

  const areaPathBottom = useMemo(() => {
    if (pointsBottomCoords.length === 0) return '';
    const startX = pointsBottomCoords[0].x;
    const endX = pointsBottomCoords[pointsBottomCoords.length - 1].x;
    const bottomY = height - paddingY;
    return `${linePathBottom} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [pointsBottomCoords, linePathBottom, height]);

  // Zooming & Panning Handlers
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const gridX = mouseX - paddingX;

    const zoomFactor = 1.15;
    let newScale = zoomScale;
    if (e.deltaY < 0) {
      newScale = Math.min(5.0, zoomScale * zoomFactor);
    } else {
      newScale = Math.max(1.0, zoomScale / zoomFactor);
    }

    if (newScale !== zoomScale) {
      const unscaledX = (gridX - panOffset) / zoomScale;
      let newPanOffset = gridX - unscaledX * newScale;
      
      const minPan = -(width - 2 * paddingX) * (newScale - 1);
      newPanOffset = Math.max(minPan, Math.min(0, newPanOffset));

      setZoomScale(newScale);
      setPanOffset(newPanOffset);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale > 1.0) {
      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragStartPanOffset(panOffset);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && chartContainerRef.current) {
      const rect = chartContainerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartX;
      const svgDeltaX = (deltaX / rect.width) * width;
      let newPanOffset = dragStartPanOffset + svgDeltaX;

      const minPan = -(width - 2 * paddingX) * (zoomScale - 1);
      newPanOffset = Math.max(minPan, Math.min(0, newPanOffset));
      
      setPanOffset(newPanOffset);
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Zoom Actions
  const zoomIn = () => {
    const newScale = Math.min(5.0, zoomScale * 1.3);
    const gridCenter = (width - 2 * paddingX) / 2;
    const unscaledX = (gridCenter - panOffset) / zoomScale;
    let newPan = gridCenter - unscaledX * newScale;
    const minPan = -(width - 2 * paddingX) * (newScale - 1);
    setPanOffset(Math.max(minPan, Math.min(0, newPan)));
    setZoomScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(1.0, zoomScale / 1.3);
    const gridCenter = (width - 2 * paddingX) / 2;
    const unscaledX = (gridCenter - panOffset) / zoomScale;
    let newPan = gridCenter - unscaledX * newScale;
    const minPan = -(width - 2 * paddingX) * (newScale - 1);
    setPanOffset(Math.max(minPan, Math.min(0, newPan)));
    setZoomScale(newScale);
  };

  const resetZoom = () => {
    setZoomScale(1.0);
    setPanOffset(0);
  };

  // Date Range Formatting helper
  const formatDateRangeString = () => {
    const format = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
    return `${format(startDate)} - ${format(endDate)}`;
  };

  // Preset Handler
  const applyPreset = (preset: string) => {
    if (preset === 'all') {
      setStartDate(new Date(2026, 5, 1));
      setEndDate(new Date(2026, 10, 30));
      setCalendarMonth(new Date(2026, 6, 1));
    } else if (preset === 'jun') {
      setStartDate(new Date(2026, 5, 1));
      setEndDate(new Date(2026, 5, 30));
      setCalendarMonth(new Date(2026, 5, 1));
    } else if (preset === 'jul') {
      setStartDate(new Date(2026, 6, 1));
      setEndDate(new Date(2026, 6, 31));
      setCalendarMonth(new Date(2026, 6, 1));
    } else if (preset === 'aug') {
      setStartDate(new Date(2026, 7, 1));
      setEndDate(new Date(2026, 7, 31));
      setCalendarMonth(new Date(2026, 7, 1));
    } else if (preset === 'sep') {
      setStartDate(new Date(2026, 8, 1));
      setEndDate(new Date(2026, 8, 30));
      setCalendarMonth(new Date(2026, 8, 1));
    } else if (preset === 'oct') {
      setStartDate(new Date(2026, 9, 1));
      setEndDate(new Date(2026, 9, 31));
      setCalendarMonth(new Date(2026, 9, 1));
    } else if (preset === 'nov') {
      setStartDate(new Date(2026, 10, 1));
      setEndDate(new Date(2026, 10, 30));
      setCalendarMonth(new Date(2026, 10, 1));
    } else if (preset === 'last7') {
      setStartDate(new Date(2026, 5, 27)); // June 27, 2026
      setEndDate(new Date(2026, 6, 3));    // July 3, 2026
      setCalendarMonth(new Date(2026, 6, 1));
    } else if (preset === 'last30') {
      setStartDate(new Date(2026, 5, 4));  // June 4, 2026
      setEndDate(new Date(2026, 6, 3));   // July 3, 2026
      setCalendarMonth(new Date(2026, 6, 1));
    }
    setShowDatePicker(false);
  };

  // Calendar render helper
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon is 0
    
    const cells = [];
    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      const cur = new Date(year, month, d);
      const isStart = startDate && startDate.toDateString() === cur.toDateString();
      const isEnd = endDate && endDate.toDateString() === cur.toDateString();
      const inRange = startDate && endDate && cur.getTime() > startDate.getTime() && cur.getTime() < endDate.getTime();
      
      let cellStyle = "w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center transition-all ";
      if (isStart || isEnd) {
        cellStyle += "bg-primary text-white shadow-sm";
      } else if (inRange) {
        cellStyle += "bg-primary/10 text-primary hover:bg-primary/20";
      } else {
        cellStyle += "text-on-surface hover:bg-surface-container-high/60";
      }
      
      cells.push(
        <button
          key={`day-${d}`}
          type="button"
          onClick={() => {
            if (!startDate || (startDate && endDate)) {
              setStartDate(cur);
              setEndDate(undefined as any);
            } else {
              if (cur < startDate) {
                setStartDate(cur);
              } else {
                setEndDate(cur);
                setShowDatePicker(false);
              }
            }
          }}
          className={cellStyle}
        >
          {d}
        </button>
      );
    }
    return cells;
  };

  const changeMonth = (val: number) => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + val, 1));
  };

  const formatYAxisTick = (val: number) => {
    if (activeTab === 'revenue') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace(/\.0$/, '')} Tr`;
      if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
      return `${val}đ`;
    }
    return val.toString();
  };

  return (
    <div className="space-y-xl animate-fade-in-up">
      {/* Header section */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-on-background">Thống kê & Phân tích</h1>
          <p className="text-on-surface-variant mt-1">Báo cáo hiệu suất đăng ký, tỷ lệ phê duyệt và doanh thu phí giải đấu.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline-variant/60 text-sm font-semibold hover:bg-white transition-all bg-white/50"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            Bảng điều khiển
          </Link>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
        <div className="glass-card rounded-[24px] p-lg border border-outline-variant/35 bg-white/70">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Tổng lượt đăng ký</span>
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-on-background">{stats.total}</h3>
            <p className="text-xs text-[#2e7d32] font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +14% so với kỳ trước
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-lg border border-outline-variant/35 bg-white/70">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Tỷ lệ duyệt hồ sơ</span>
            <span className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">percent</span>
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-on-background">{stats.successRate}%</h3>
            <p className="text-xs text-on-surface-variant mt-2">
              Đã duyệt <span className="font-semibold text-on-surface">{stats.approved}</span> / {stats.total} hồ sơ
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-lg border border-outline-variant/35 bg-white/70">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Hồ sơ chờ phê duyệt</span>
            <span className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-on-background">{stats.pending}</h3>
            <p className="text-xs text-secondary font-semibold mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              Chờ Ban tổ chức xử lý
            </p>
          </div>
        </div>

        <div className="glass-card rounded-[24px] p-lg border border-outline-variant/35 bg-white/70">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface-variant">Doanh thu phí giải đấu</span>
            <span className="w-9 h-9 rounded-xl bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-on-background">
              {stats.revenue.toLocaleString('vi-VN')} đ
            </h3>
            <p className="text-xs text-on-surface-variant mt-2">
              Tạm tính phí 150.000đ/VĐV đã duyệt
            </p>
          </div>
        </div>
      </section>

      {/* Main Chart Section */}
      <section className="glass-card rounded-[28px] p-lg border border-outline-variant/30 bg-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Biểu đồ tăng trưởng (Statistics)</h2>
            <p className="text-sm text-on-surface-variant mt-1">
              {activeTab === 'revenue' 
                ? 'Theo dõi doanh thu phí giải đấu (thực tế và dự kiến).'
                : 'So sánh tổng lượt đăng ký và số lượng hồ sơ đã được phê duyệt.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Tabs */}
            <div className="inline-flex rounded-xl bg-surface-container-high/50 p-1 border border-outline-variant/30">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'sales'
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Sales
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'revenue'
                    ? 'bg-white text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Revenue
              </button>
            </div>

            {/* Datepicker Wrapper */}
            <div className="relative" ref={datePickerRef}>
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-outline-variant/50 bg-white hover:bg-surface-container-low text-xs font-bold text-on-surface-variant shadow-sm shrink-0 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>{formatDateRangeString()}</span>
                <span className="material-symbols-outlined text-[14px]">expand_more</span>
              </button>

              {/* Datepicker Dropdown */}
              {showDatePicker && (
                <div className="absolute right-0 mt-2 w-[460px] bg-white border border-outline-variant rounded-2xl shadow-xl z-50 p-4 flex gap-4 animate-scale-up">
                  {/* Presets List */}
                  <div className="w-[140px] border-r border-outline-variant/30 pr-3 flex flex-col gap-1 text-xs">
                    <span className="font-bold text-on-surface-variant/70 mb-2 px-2">Khoảng nhanh</span>
                    <button onClick={() => applyPreset('all')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-semibold">Tất cả thời gian</button>
                    <button onClick={() => applyPreset('last7')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-semibold">Lần gần nhất (Jun 27-Jul 3)</button>
                    <button onClick={() => applyPreset('last30')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-semibold">30 ngày gần nhất</button>
                    <div className="h-px bg-outline-variant/30 my-1" />
                    <button onClick={() => applyPreset('jun')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 6</button>
                    <button onClick={() => applyPreset('jul')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 7</button>
                    <button onClick={() => applyPreset('aug')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 8</button>
                    <button onClick={() => applyPreset('sep')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 9</button>
                    <button onClick={() => applyPreset('oct')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 10</button>
                    <button onClick={() => applyPreset('nov')} className="text-left px-2 py-1.5 rounded-lg hover:bg-surface-container-low text-on-surface font-medium">Tháng 11</button>
                  </div>

                  {/* Calendar Widget */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <button type="button" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-surface-container-high">
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      <span className="text-xs font-bold text-on-background">
                        {calendarMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                      </span>
                      <button type="button" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-surface-container-high">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-bold text-on-surface-variant/80 mb-2">
                      <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-y-1 text-center justify-items-center">
                      {renderCalendar()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend & Zoom buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold mb-4 text-on-surface-variant border-b border-outline-variant/20 pb-3">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#1e88e5]" />
              <span>{activeTab === 'revenue' ? 'Doanh thu dự kiến' : 'Tổng lượt đăng ký'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#64b5f6]" />
              <span>{activeTab === 'revenue' ? 'Doanh thu thực tế' : 'Hồ sơ đã duyệt'}</span>
            </div>
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-surface-container-high/40 p-1 rounded-xl border border-outline-variant/30">
            <button
              onClick={zoomIn}
              title="Phóng to (Cuộn chuột lên)"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-on-surface-variant hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
            <button
              onClick={zoomOut}
              title="Thu nhỏ (Cuộn chuột xuống)"
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-on-surface-variant hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            </button>
            {zoomScale > 1.0 && (
              <button
                onClick={resetZoom}
                className="px-2 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-[10px] font-bold text-primary transition-all"
              >
                Reset ({zoomScale.toFixed(1)}x)
              </button>
            )}
          </div>
        </div>

        {/* Responsive Line Chart Area */}
        <div className="relative w-full overflow-x-auto select-none">
          <div 
            ref={chartContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`min-w-[760px] relative h-[300px] transition-all select-none ${
              zoomScale > 1.0 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              {/* Definitions for Gradients and Clips */}
              <defs>
                <linearGradient id="areaGradientTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e88e5" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1e88e5" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="areaGradientBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64b5f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#64b5f6" stopOpacity="0.0" />
                </linearGradient>
                {/* Clip path to crop lines during zooming */}
                <clipPath id="chart-grid-clip">
                  <rect x={paddingX} y={0} width={width - 2 * paddingX} height={height} />
                </clipPath>
              </defs>

              {/* Grid Y-Lines (Static, not clipped) */}
              {yTicks.map((gridVal) => {
                const y = height - paddingY - (gridVal / (maxTick || 1)) * (height - 2 * paddingY);
                return (
                  <g key={gridVal}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={width - paddingX}
                      y2={y}
                      stroke="rgba(0, 0, 0, 0.05)"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[9px] font-bold fill-on-surface-variant/60"
                    >
                      {formatYAxisTick(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Zoomable elements inside the ClipPath */}
              <g clipPath="url(#chart-grid-clip)">
                {/* Gradient Areas */}
                <path d={areaPathTop} fill="url(#areaGradientTop)" />
                <path d={areaPathBottom} fill="url(#areaGradientBottom)" />

                {/* Stroke Lines */}
                <path d={linePathTop} fill="none" stroke="#1e88e5" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <path d={linePathBottom} fill="none" stroke="#64b5f6" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Interactive columns & points */}
                {chartTimeline.map((item, idx) => {
                  const pTop = pointsTopCoords[idx];
                  const pBottom = pointsBottomCoords[idx];
                  if (!pTop || !pBottom) return null;
                  
                  const isHovered = hoveredIdx === idx;
                  const colWidth = ((width - 2 * paddingX) * zoomScale) / (chartTimeline.length - 1 || 1);
                  
                  return (
                    <g key={`${item}-${idx}`}>
                      {/* Hover column */}
                      <rect
                        x={pTop.x - colWidth / 2}
                        y={paddingY}
                        width={colWidth}
                        height={height - 2 * paddingY}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      />

                      {/* Interactive vertical hover indicator line */}
                      {isHovered && (
                        <line
                          x1={pTop.x}
                          y1={paddingY}
                          x2={pTop.x}
                          y2={height - paddingY}
                          stroke="#1e88e5"
                          strokeDasharray="4 4"
                          strokeWidth="1.5"
                          pointerEvents="none"
                        />
                      )}

                      {/* Top Circle */}
                      <circle
                        cx={pTop.x}
                        cy={pTop.y}
                        r={isHovered ? 6 : 4}
                        fill="#1e88e5"
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-150 pointer-events-none"
                      />

                      {/* Bottom Circle */}
                      <circle
                        cx={pBottom.x}
                        cy={pBottom.y}
                        r={isHovered ? 6 : 4}
                        fill="#64b5f6"
                        stroke="#ffffff"
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        className="transition-all duration-150 pointer-events-none"
                      />

                      {/* X-Axis labels inside the clipped grid */}
                      <text
                        x={pTop.x}
                        y={height - 4}
                        textAnchor="middle"
                        className={`text-[9px] font-bold ${
                          isHovered ? 'fill-primary' : 'fill-on-surface-variant/70'
                        } transition-colors`}
                      >
                        {item}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Tooltip Card */}
            {hoveredIdx !== null && pointsTopCoords[hoveredIdx] && (
              <div
                className="absolute bg-white/95 backdrop-blur-md border border-outline-variant/60 rounded-xl shadow-xl p-3 text-xs pointer-events-none z-20 flex flex-col gap-1.5 transition-all duration-150"
                style={{
                  left: `${(pointsTopCoords[hoveredIdx].x / width) * 100}%`,
                  top: '12%',
                  transform: 'translateX(-50%)'
                }}
              >
                <p className="font-bold text-on-background border-b border-outline-variant/15 pb-1 text-center">
                  Khoảng {chartTimeline[hoveredIdx]}
                </p>
                <div className="flex items-center gap-4 justify-between">
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-[#1e88e5]" />
                    {activeTab === 'revenue' ? 'Dự kiến:' : 'Đăng ký:'}
                  </span>
                  <span className="font-bold text-[#1e88e5]">
                    {activeTab === 'revenue' 
                      ? `${pointsTop[hoveredIdx].toLocaleString('vi-VN')} đ` 
                      : pointsTop[hoveredIdx]}
                  </span>
                </div>
                <div className="flex items-center gap-4 justify-between">
                  <span className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full bg-[#64b5f6]" />
                    {activeTab === 'revenue' ? 'Thực thu:' : 'Đã duyệt:'}
                  </span>
                  <span className="font-bold text-[#1e88e5]">
                    {activeTab === 'revenue' 
                      ? `${pointsBottom[hoveredIdx].toLocaleString('vi-VN')} đ` 
                      : pointsBottom[hoveredIdx]}
                  </span>
                </div>
                {activeTab !== 'revenue' && pointsTop[hoveredIdx] > 0 && (
                  <div className="flex items-center gap-4 justify-between border-t border-outline-variant/10 pt-1">
                    <span className="text-on-surface-variant/80">Tỷ lệ duyệt:</span>
                    <span className="font-bold text-secondary">
                      {Math.round((pointsBottom[hoveredIdx] / pointsTop[hoveredIdx]) * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Level and Category Breakdown Bento */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <article className="glass-card rounded-[28px] p-lg border border-outline-variant/30 bg-white/70">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary text-[24px]">trending_up</span>
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Phân bố Trình độ Vận động viên</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.levelCount).map(([level, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm font-semibold mb-1 text-on-background">
                    <span>Trình độ: {level}</span>
                    <span>{count} VĐV ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="glass-card rounded-[28px] p-lg border border-outline-variant/30 bg-white/70">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-primary text-[24px]">sports_tennis</span>
            <h2 className="font-title-lg text-title-lg font-bold text-on-background">Phân bố Nội dung Đăng ký</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.categoryCount).map(([cat, count]) => {
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm font-semibold mb-1 text-on-background">
                    <span>{cat}</span>
                    <span>{count} đơn ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </div>
  );
}
