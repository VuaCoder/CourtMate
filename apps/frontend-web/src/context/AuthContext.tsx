import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'admin' | 'user' | 'host' | null;

interface AuthContextType {
  role: UserRole;
  userName: string;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string>('Khách');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem('courtmate_role') as UserRole;
    if (savedRole) {
      setRole(savedRole);
      setUserName(savedRole === 'admin' ? 'Quản trị viên' : savedRole === 'host' ? 'Chủ sự kiện' : 'Hoàng Phúc');
      setIsAuthenticated(true);
    }
  }, []);

  const login = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setUserName(selectedRole === 'admin' ? 'Quản trị viên' : selectedRole === 'host' ? 'Chủ sự kiện' : 'Hoàng Phúc');
    setIsAuthenticated(true);
    if (selectedRole) {
      localStorage.setItem('courtmate_role', selectedRole);
    }
    
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
    setIsAuthenticated(false);
    localStorage.removeItem('courtmate_role');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ role, userName, isAuthenticated, login, logout }}>
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
