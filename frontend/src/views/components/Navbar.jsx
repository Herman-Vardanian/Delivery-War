import { Link, useLocation } from 'react-router-dom';
import Button from './ui/Button';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/30">
            D
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">
            Delivery<span className="text-orange-400">War</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
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
