import { Link, useLocation } from 'react-router-dom';
import { authModel } from '../../models/authModel';

export default function AppNavbar() {
  const { pathname } = useLocation();
  const user = authModel.getUser();

  const linkStyle = (path) => ({
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
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.06em', color: 'var(--c-text)', marginRight: '2rem', flexShrink: 0 }}>
        Delivery <span style={{ color: 'var(--c-pri)' }}>War</span>
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
        <Link
          to="/login"
          style={{ fontSize: '0.75rem', color: 'var(--c-text3)', textDecoration: 'none', padding: '0.35rem 0.75rem', border: '1px solid var(--c-border)', borderRadius: 6, transition: 'all .15s' }}
        >
          Déconnexion
        </Link>
      </div>
    </header>
  );
}
