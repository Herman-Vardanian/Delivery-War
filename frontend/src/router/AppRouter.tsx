import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '../views/pages/IndexPage';
import LoginPage from '../views/pages/LoginPage';
import RegisterPage from '../views/pages/RegisterPage';
import ProfilePage from '../views/pages/ProfilePage';
import DashboardPage from '../views/pages/DashboardPage';
import AdminDashboardPage from '../views/pages/AdminDashboardPage';
import LeaderboardPage from '../views/pages/LeaderboardPage';
import Navbar from '../views/components/Navbar';
import AppNavbar from '../views/components/AppNavbar';

function PublicLayout({ children, showNav = true }: { children: ReactNode; showNav?: boolean }) {
  return (
    <>
      {showNav && <Navbar />}
      {children}
    </>
  );
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppNavbar />
      <div style={{ paddingTop: '56px' }}>{children}</div>
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <IndexPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout showNav={false}>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout showNav={false}>
              <RegisterPage />
            </PublicLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <AppLayout>
              <LeaderboardPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
