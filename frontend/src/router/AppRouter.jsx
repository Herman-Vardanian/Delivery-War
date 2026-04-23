import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import IndexPage from '../views/pages/IndexPage';
import LoginPage from '../views/pages/LoginPage';
import RegisterPage from '../views/pages/RegisterPage';
import Navbar from '../views/components/Navbar';

function PublicLayout({ children, showNav = true }) {
  return (
    <>
      {showNav && <Navbar />}
      {children}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
