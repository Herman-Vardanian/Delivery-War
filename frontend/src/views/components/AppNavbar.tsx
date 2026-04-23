import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authModel } from '../../models/authModel';

export default function AppNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(authModel.getUser());

  const handleLogout = () => {
    authModel.removeUser();
    navigate('/login');
  };

  useEffect(() => {
    const onUpdate = () => setUser(authModel.getUser());
    window.addEventListener('user-updated', onUpdate);
    return () => window.removeEventListener('user-updated', onUpdate);
  }, []);

  const linkStyle = (path: string) => ({
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.04em',
    textDecoration: 'none',
    padding: '0.4rem 0.875rem',
    borderRadius: 6,
    transition: 'all .15s',
    color: pathname === path ? 'var(--c-text)' : 'var(--c-text2)',
    background: pathname === path ? 'rgba(255,255,255,.07)' : 'transparent',
  });

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      background: 'rgba(10,10,18,.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--c-border)',
      padding: '0 2rem',
    }}>
      <Link to="/dashboard" style={{ fontFamily: 'var(--font-d)', fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.03em', textDecoration: 'none', color: '#fff', marginRight: '2rem', flexShrink: 0 }}>
        Delivery<span style={{ color: 'var(--c-pri)' }}>War</span>
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          <Link to="/leaderboard" style={linkStyle('/leaderboard')}>Classement</Link>
          <Link to="/profile" style={linkStyle('/profile')}>Mon compte</Link>
        </nav>
        <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)', borderRight: '1px solid var(--c-border)', paddingRight: '0.75rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <div style={{ color: 'var(--c-text2)', fontWeight: 600 }}>{user?.name || '—'}</div>
            <div style={{ fontSize: '0.68rem' }}>{user?.whalePass ? 'Pass Whale' : 'Gratuit'}</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--c-success)' }}>
            € {user?.balance != null ? Number(user.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '0,00'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ fontSize: '0.75rem', color: 'var(--c-text3)', background: 'transparent', padding: '0.35rem 0.75rem', border: '1px solid var(--c-border)', borderRadius: 6, transition: 'all .15s', cursor: 'pointer' }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
