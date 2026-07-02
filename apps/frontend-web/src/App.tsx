import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OrganizerSettings from './pages/OrganizerSettings';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import Layout from './components/Layout';
import LoadingScreen, { LoadingOverlay } from './components/LoadingScreen';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import './index.css';

function App() {
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
              
              {/* All authenticated users */}
              <Route path="/tournaments" element={<ProtectedRoute allowedRoles={['user', 'host', 'admin']}><Layout><TournamentsPage /></Layout></ProtectedRoute>} />
              <Route path="/tournaments/:id" element={<ProtectedRoute allowedRoles={['user', 'host', 'admin']}><Layout><TournamentDetailPage /></Layout></ProtectedRoute>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LoadingScreen>
    </LoadingProvider>
  );
}

export default App;
