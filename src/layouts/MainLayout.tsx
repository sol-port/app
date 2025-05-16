import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: ReactNode; // Outlet 사용을 위함
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* TODO: 상단 네비게이션/사이드바 등 공통 UI */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
