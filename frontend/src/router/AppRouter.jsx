import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '../views/pages/IndexPage';
import LoginPage from '../views/pages/LoginPage';
import RegisterPage from '../views/pages/RegisterPage';
import ProfilePage from '../views/pages/ProfilePage';
import Navbar from '../views/components/Navbar';
import AppNavbar from '../views/components/AppNavbar';

function PublicLayout({ children, showNav = true }) {
  return (
    <>
      {showNav && <Navbar />}
      {children}
    </>
  );
}

function AppLayout({ children }) {
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
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
