import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OrganizerSettings from './pages/OrganizerSettings';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HostTournamentsPage from './pages/HostTournamentsPage';
import HostPendingApprovalsPage from './pages/HostPendingApprovalsPage';
import HostConfirmedAthletesPage from './pages/HostConfirmedAthletesPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import ProfilePage from './pages/ProfilePage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import EventDetailPage from './pages/EventDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import Layout from './components/Layout';
import LoadingScreen, { LoadingOverlay } from './components/LoadingScreen';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

function App() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    // Seed localStorage registrations if empty or has baseline initial participants
    const saved = localStorage.getItem('courtmate_registrations');
    if (!saved || JSON.parse(saved).length <= 5) {
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
      const tournamentIds = [1, 3, 4, 5];
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
      let seed = 54321;
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
          
          const tIdx = Math.floor(random() * tournaments.length);
          const tournament = tournaments[tIdx];
          const tournamentId = tournamentIds[tIdx];
          
          const name = names[Math.floor(random() * names.length)] + ' ' + String.fromCharCode(65 + (i % 26));
          
          const dateStr = `${day.toString().padStart(2, '0')} Thg ${(month + 1).toString().padStart(2, '0')}, ${year}`;
          
          mock.push({
            id: id++,
            name,
            phone: `09${Math.floor(10000000 + random() * 90000000)}`,
            email: `${name.toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`,
            tournament,
            tournamentId,
            category,
            level,
            status,
            date: dateStr
          });
        }
      });
      
      localStorage.setItem('courtmate_registrations', JSON.stringify(mock));
    }
  }, []);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setToast({
          message: customEvent.detail.message,
          type: customEvent.detail.type || 'success'
        });
      }
    };

    window.addEventListener('courtmate_toast', handleToastEvent);
    return () => {
      window.removeEventListener('courtmate_toast', handleToastEvent);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <LoadingProvider>
      <LoadingScreen>
        <BrowserRouter>
          <AuthProvider>
            <LoadingOverlay />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Host & Admin Routes */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><DashboardPage /></Layout></ProtectedRoute>} />
              <Route path="/create-tournament" element={<ProtectedRoute allowedRoles={['host', 'admin']}><CreateTournamentPage /></ProtectedRoute>} />
              <Route path="/participants" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><ParticipantsPage /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><OrganizerSettings /></Layout></ProtectedRoute>} />
              <Route path="/host/tournaments" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><HostTournamentsPage /></Layout></ProtectedRoute>} />
              <Route path="/host/analytics" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><AnalyticsPage /></Layout></ProtectedRoute>} />
              <Route path="/host/pending-approvals" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><HostPendingApprovalsPage /></Layout></ProtectedRoute>} />
              <Route path="/host/confirmed-athletes" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><HostConfirmedAthletesPage /></Layout></ProtectedRoute>} />
              <Route path="/event/:eventId" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><EventDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><AdminPage /></Layout></ProtectedRoute>} />
              
              {/* All authenticated users */}
              <Route path="/tournaments" element={<ProtectedRoute allowedRoles={['user', 'host', 'admin']}><Layout><TournamentsPage /></Layout></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={['user']}><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/tournaments/:id" element={<ProtectedRoute allowedRoles={['user', 'host', 'admin']}><Layout><TournamentDetailPage /></Layout></ProtectedRoute>} />
            </Routes>

            {/* Global Animated Toast Notification */}
            {toast && (
              <div className="fixed bottom-6 right-6 z-[999] max-w-sm bg-white/90 backdrop-blur-md border border-outline-variant/60 rounded-xl shadow-2xl p-md flex items-center gap-sm animate-in slide-in-from-bottom duration-300">
                <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center ${
                  toast.type === 'success' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 
                  toast.type === 'error' ? 'bg-error-container text-error' : 
                  'bg-secondary-container text-on-secondary-container'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {toast.type === 'success' ? 'check_circle' : 
                     toast.type === 'error' ? 'cancel' : 
                     'info'}
                  </span>
                </div>
                <div className="flex-1 font-body-sm text-body-sm font-semibold text-on-background">
                  {toast.message}
                </div>
                <button onClick={() => setToast(null)} className="text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </AuthProvider>
        </BrowserRouter>
      </LoadingScreen>
    </LoadingProvider>
  );
}

export default App;
