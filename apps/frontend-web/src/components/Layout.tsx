import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserLayout from '../layouts/UserLayout';
import HostAdminLayout from '../layouts/HostAdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { role } = useAuth();

  if (role === 'user') {
    return <UserLayout>{children}</UserLayout>;
  }

  return <HostAdminLayout>{children}</HostAdminLayout>;
}
