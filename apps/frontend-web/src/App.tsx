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
import ParticipantsPage from './pages/ParticipantsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import EventDetailPage from './pages/EventDetailPage';
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
              <Route path="/host/pending-approvals" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><HostPendingApprovalsPage /></Layout></ProtectedRoute>} />
              <Route path="/host/confirmed-athletes" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><HostConfirmedAthletesPage /></Layout></ProtectedRoute>} />
              <Route path="/event/:eventId" element={<ProtectedRoute allowedRoles={['host', 'admin']}><Layout><EventDetailPage /></Layout></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Layout><AdminPage /></Layout></ProtectedRoute>} />
              
              {/* All authenticated users */}
              <Route path="/tournaments" element={<ProtectedRoute allowedRoles={['user', 'host', 'admin']}><Layout><TournamentsPage /></Layout></ProtectedRoute>} />
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
