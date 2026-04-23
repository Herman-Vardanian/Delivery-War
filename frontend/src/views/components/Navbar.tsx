import { Link, useLocation } from 'react-router-dom';
import Button from './ui/Button';
import { authModel } from '../../models/authModel';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to={authModel.isAuthenticated() ? '/dashboard' : '/'} style={{ fontFamily: 'var(--font-d)', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', textDecoration: 'none', color: '#fff' }}>
          Delivery<span style={{ color: 'var(--c-pri)' }}>War</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/leaderboard">
            <Button variant="ghost" size="sm">Classement</Button>
          </Link>
          {pathname !== '/login' && (
            <Link to="/login">
              <Button variant="ghost" size="sm">Connexion</Button>
            </Link>
          )}
          {pathname !== '/register' && (
            <Link to="/register">
              <Button size="sm">Inscription</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
