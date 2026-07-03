import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'user' | 'host' | null;

interface AuthContextType {
  role: UserRole;
  userName: string;
  email: string;
  isAuthenticated: boolean;
  login: (role: UserRole, userData?: { userName?: string; email?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('Khách');
  const [email, setEmail] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('courtmate_role') as UserRole;
    const savedName = localStorage.getItem('courtmate_user_name');
    const savedEmail = localStorage.getItem('courtmate_user_email');
    if (savedRole) {
      setRole(savedRole);
      setUserName(savedName || (savedRole === 'admin' ? 'Quản trị viên' : savedRole === 'host' ? 'Chủ sự kiện' : 'Khách'));
      setEmail(savedEmail || '');
      setIsAuthenticated(true);
    }
  }, []);

  const login = (selectedRole: UserRole, userData?: { userName?: string; email?: string }) => {
    setRole(selectedRole);
    const nextUserName = userData?.userName || (selectedRole === 'admin' ? 'Quản trị viên' : selectedRole === 'host' ? 'Chủ sự kiện' : 'Khách');
    const nextEmail = userData?.email || '';
    setUserName(nextUserName);
    setEmail(nextEmail);
    setIsAuthenticated(true);
    if (selectedRole) {
      localStorage.setItem('courtmate_role', selectedRole);
    }
    localStorage.setItem('courtmate_user_name', nextUserName);
    localStorage.setItem('courtmate_user_email', nextEmail);
    
    // Redirect based on role
    if (selectedRole === 'admin' || selectedRole === 'host') {
      navigate('/dashboard');
    } else {
      navigate('/tournaments');
    }
  };

  const logout = () => {
    setRole(null);
    setUserName('Khách');
    setEmail('');
    setIsAuthenticated(false);
    localStorage.removeItem('courtmate_role');
    localStorage.removeItem('courtmate_user_name');
    localStorage.removeItem('courtmate_user_email');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ role, userName, email, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
