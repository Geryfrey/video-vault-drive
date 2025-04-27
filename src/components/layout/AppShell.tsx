
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppShellProps {
  children: ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
}

export function AppShell({ children, requireAuth = false, adminOnly = false }: AppShellProps) {
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication if required
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check admin access if required
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // For authentication pages, show a simple layout
  if (!requireAuth) {
    return <div className="min-h-screen bg-muted/30">{children}</div>;
  }

  // Main app layout for authenticated users
  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
