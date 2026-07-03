export type HostEvent = {
  id: string;
  hostName: string;
  title: string;
  status: 'Đang mở đăng ký' | 'Chuẩn bị bốc thăm' | 'Chờ duyệt nội dung';
  date: string;
  venue: string;
  capacity: string;
  progress: string;
  description: string;
  prize: string[];
  schedule: { time: string; title: string; meta: string }[];
  participants: { name: string; level: string; status: 'confirmed' | 'pending' }[];
};

export const HOST_EVENTS: HostEvent[] = [
  {
    id: 'danang-open-2026',
    hostName: 'CourtMate Host Club',
    title: 'Da Nang Open Badminton 2026',
    status: 'Đang mở đăng ký',
    date: '12 - 18 Th7, 2026',
    venue: 'Nhà thi đấu Tiên Sơn',
    capacity: '64 / 64',
    progress: '100%',
    description: 'Giải đấu mở dành cho VĐV phong trào và bán chuyên, với lịch thi đấu dày và quy trình check-in nhanh.',
    prize: ['Vô địch: 10,000,000 VND + Cúp', 'Á quân: 5,000,000 VND + Huy chương', 'Hạng ba: 2,000,000 VND'],
    schedule: [
      { time: '08:30', title: 'Mở cổng check-in', meta: 'Nhà thi đấu Tiên Sơn' },
      { time: '10:00', title: 'Bốc thăm vòng bảng', meta: 'Sảnh chính' },
      { time: '14:00', title: 'Chốt danh sách thi đấu', meta: 'Ban tổ chức' },
    ],
    participants: [
      { name: 'Nguyen Tran', level: 'Trung bình khá', status: 'confirmed' },
      { name: 'Le Minh', level: 'Khá', status: 'confirmed' },
      { name: 'Tran Duy', level: 'Trung bình', status: 'pending' },
    ],
  },
  {
    id: 'summer-club-cup-2026',
    hostName: 'CourtMate Host Club',
    title: 'Summer Club Cup 2026',
    status: 'Chuẩn bị bốc thăm',
    date: '21 - 24 Th7, 2026',
    venue: 'Sân CLB CourtMate',
    capacity: '32 / 48',
    progress: '67%',
    description: 'Sự kiện nội bộ dành cho các thành viên câu lạc bộ với format thi đấu đơn và đôi.',
    prize: ['Vô địch: 7,000,000 VND', 'Hạng nhì: 3,000,000 VND', 'Hạng ba: 1,000,000 VND'],
    schedule: [
      { time: '09:00', title: 'Kiểm tra danh sách', meta: 'Ban thư ký' },
      { time: '10:30', title: 'Bốc thăm bảng', meta: 'Phòng họp' },
      { time: '16:00', title: 'Gửi thông báo', meta: 'Email & Zalo' },
    ],
    participants: [
      { name: 'Alex Chen', level: 'Trung bình khá', status: 'pending' },
      { name: 'Sarah Jenkins', level: 'Trung bình', status: 'confirmed' },
      { name: 'Minh Khoa', level: 'Trung bình khá', status: 'confirmed' },
    ],
  },
  {
    id: 'friendly-mix-doubles',
    hostName: 'CourtMate Host Club',
    title: 'Friendly Mix Doubles',
    status: 'Chờ duyệt nội dung',
    date: '01 - 03 Th8, 2026',
    venue: 'Sân trong nhà Hoa Sen',
    capacity: '18 / 24',
    progress: '75%',
    description: 'Giải giao lưu đôi nam nữ, ưu tiên tính kết nối cộng đồng và trải nghiệm thi đấu nhẹ nhàng.',
    prize: ['Quà lưu niệm + Cúp', 'Voucher sân tập', 'Huy chương lưu niệm'],
    schedule: [
      { time: '08:00', title: 'Mở đăng ký xác nhận', meta: 'Form online' },
      { time: '13:00', title: 'Duyệt nội dung', meta: 'Admin panel' },
      { time: '17:30', title: 'Thông báo slot', meta: 'Nhóm chat' },
    ],
    participants: [
      { name: 'Ngoc Anh', level: 'Trung bình', status: 'pending' },
      { name: 'Hoang Nam', level: 'Trung bình khá', status: 'confirmed' },
      { name: 'Mai Phuong', level: 'Khá', status: 'confirmed' },
    ],
  },
];

export const HOST_DASHBOARD_METRICS = [
  { key: 'events', label: 'Sự kiện đang quản lý', value: '12' },
  { key: 'pending', label: 'Đơn đăng ký chờ duyệt', value: '48' },
  { key: 'athletes', label: 'Vận động viên đã xác nhận', value: '1,248' },
  { key: 'fill', label: 'Tỉ lệ lấp đầy trung bình', value: '86%' },
];
