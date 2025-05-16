import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PortfolioChat from '../pages/PortfolioChat';
import Automation from '../pages/Automation';
import Dashboard from '../pages/Dashboard';
import Goal from '../pages/Goal';
import AssetAnalysis from '../pages/AssetAnalysis';
import Notification from '../pages/Notification';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="/portfolio" element={<PortfolioChat />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goal" element={<Goal />} />
          <Route path="/asset" element={<AssetAnalysis />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
