import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../controllers/useAuth';

function AuthBg() {
  return (
    <div className="bg-layer">
      <svg className="bg-city" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <line x1="0" y1="200" x2="1440" y2="200" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="560" x2="1440" y2="560" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="740" x2="1440" y2="740" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="180" y1="0" x2="180" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="420" y1="0" x2="420" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="660" y1="0" x2="660" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="900" y1="0" x2="900" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="1140" y1="0" x2="1140" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="1380" y1="0" x2="1380" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <rect x="200" y="40" width="200" height="140" fill="#8899BB" rx="2"/>
        <rect x="440" y="80" width="180" height="100" fill="#8899BB" rx="2"/>
        <rect x="680" y="20" width="180" height="160" fill="#8899BB" rx="2"/>
        <rect x="920" y="60" width="160" height="120" fill="#8899BB" rx="2"/>
        <rect x="200" y="220" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="440" y="260" width="200" height="90" fill="#8899BB" rx="2"/>
        <rect x="680" y="400" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="920" y="400" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="1160" y="80" width="160" height="100" fill="#8899BB" rx="2"/>
        <rect x="1160" y="400" width="200" height="120" fill="#8899BB" rx="2"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#FF8C00" strokeWidth="1" strokeDasharray="20 15" opacity="0.4"/>
        <line x1="0" y1="200" x2="1440" y2="200" stroke="#FF8C00" strokeWidth="0.5" strokeDasharray="20 15" opacity="0.2"/>
        <circle cx="300" cy="150" r="4" fill="#FF8C00" opacity="0.6"/>
        <circle cx="540" cy="300" r="3" fill="#FF8C00" opacity="0.4"/>
        <circle cx="780" cy="200" r="5" fill="#FF8C00" opacity="0.5"/>
        <circle cx="1020" cy="450" r="3" fill="#FF8C00" opacity="0.35"/>
        <circle cx="1200" cy="160" r="4" fill="#00E676" opacity="0.4"/>
      </svg>

      <div className="radar-wrap">
        <svg viewBox="0 0 680 680" fill="none">
          <circle cx="340" cy="340" r="320" className="radar-ring" strokeOpacity="0.4"/>
          <circle cx="340" cy="340" r="240" className="radar-ring" strokeOpacity="0.3"/>
          <circle cx="340" cy="340" r="160" className="radar-ring" strokeOpacity="0.25"/>
          <circle cx="340" cy="340" r="80"  className="radar-ring" strokeOpacity="0.2"/>
          <line x1="20" y1="340" x2="660" y2="340" stroke="#FF8C00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <line x1="340" y1="20" x2="340" y2="660" stroke="#FF8C00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <g className="radar-sweep">
            <path d="M340 340 L660 340 A320 320 0 0 0 340 20 Z" fill="url(#radarGrad)" opacity="0.25"/>
            <line x1="340" y1="340" x2="660" y2="340" stroke="#FF8C00" strokeWidth="1.5" strokeOpacity="0.8"/>
          </g>
          <circle cx="480" cy="260" r="4" fill="#FF8C00" opacity="0.7"/>
          <circle cx="220" cy="400" r="3" fill="#00E676" opacity="0.6"/>
          <circle cx="400" cy="180" r="5" fill="#FF8C00" opacity="0.5"/>
          <defs>
            <radialGradient id="radarGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(340 340) scale(320)">
              <stop offset="0" stopColor="#FF8C00" stopOpacity="0.4"/>
              <stop offset="1" stopColor="#FF8C00" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="trucks-layer">
        <svg className="truck truck-1" width="160" height="60" viewBox="0 0 160 60" fill="none">
          <rect x="30" y="8" width="110" height="38" rx="3" fill="#1A2438" stroke="#FF8C00" strokeWidth="1" strokeOpacity="0.6"/>
          <rect x="8" y="18" width="28" height="28" rx="2" fill="#0D1B3E" stroke="#2A3F63" strokeWidth="1"/>
          <rect x="12" y="22" width="14" height="10" rx="1" fill="#29B6F6" opacity="0.7"/>
          <circle cx="50" cy="50" r="9" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="4" fill="#1A2438"/>
          <circle cx="120" cy="50" r="9" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.5"/>
          <circle cx="120" cy="50" r="4" fill="#1A2438"/>
          <text x="75" y="32" fontFamily="'Barlow Condensed',sans-serif" fontSize="10" fontWeight="900" fill="#FF8C00" letterSpacing="1" textAnchor="middle">DW</text>
        </svg>
        <svg className="truck truck-2" width="130" height="52" viewBox="0 0 130 52" fill="none">
          <rect x="24" y="6" width="88" height="34" rx="3" fill="#0D1B3E" stroke="#1E3370" strokeWidth="1"/>
          <rect x="6" y="14" width="24" height="26" rx="2" fill="#080C18" stroke="#162554" strokeWidth="1"/>
          <rect x="9" y="17" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.5"/>
          <circle cx="40" cy="44" r="7" fill="#080C18" stroke="#2A3F63" strokeWidth="1.5"/>
          <circle cx="40" cy="44" r="3" fill="#111827"/>
          <circle cx="98" cy="44" r="7" fill="#080C18" stroke="#2A3F63" strokeWidth="1.5"/>
          <circle cx="98" cy="44" r="3" fill="#111827"/>
        </svg>
        <svg className="truck truck-3" width="100" height="44" viewBox="0 0 100 44" fill="none">
          <rect x="18" y="5" width="66" height="28" rx="2" fill="#111827" stroke="#1F2D47" strokeWidth="1"/>
          <rect x="4" y="11" width="20" height="22" rx="2" fill="#0C1020"/>
          <rect x="7" y="14" width="10" height="8" rx="1" fill="#29B6F6" opacity="0.4"/>
          <circle cx="30" cy="37" r="6" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
          <circle cx="74" cy="37" r="6" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
        </svg>
        <svg className="truck truck-4" width="150" height="58" viewBox="0 0 150 58" fill="none">
          <rect x="28" y="7" width="104" height="36" rx="3" fill="#0D1B3E" stroke="#162554" strokeWidth="1"/>
          <rect x="6" y="16" width="28" height="27" rx="2" fill="#080C18" stroke="#1E3370" strokeWidth="1"/>
          <rect x="9" y="19" width="15" height="10" rx="1" fill="#29B6F6" opacity="0.6"/>
          <circle cx="42" cy="48" r="8" fill="#080C18" stroke="#162554" strokeWidth="1.5"/>
          <circle cx="42" cy="48" r="3.5" fill="#111827"/>
          <circle cx="112" cy="48" r="8" fill="#080C18" stroke="#162554" strokeWidth="1.5"/>
          <circle cx="112" cy="48" r="3.5" fill="#111827"/>
        </svg>
        <svg className="truck truck-5" width="110" height="48" viewBox="0 0 110 48" fill="none">
          <rect x="20" y="5" width="74" height="30" rx="2" fill="#111827" stroke="#1F2D47" strokeWidth="0.5"/>
          <rect x="4" y="11" width="22" height="24" rx="2" fill="#0C1020"/>
          <rect x="6" y="14" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.35"/>
          <circle cx="33" cy="40" r="7" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
          <circle cx="85" cy="40" r="7" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
        </svg>
      </div>

      <div className="overlay-left" />
      <div className="overlay-vignette" />
    </div>
  );
}

export default function LoginPage() {
  const [shopId, setShopId] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(shopId, password);
  };

  return (
    <>
      <AuthBg />
      <main className="auth-main">
        {/* ── Branding ── */}
        <div className="branding">
          <div className="logo-block">
            <div className="logo-icon">
              <span className="logo-badge">Live Auction</span>
            </div>
            <span className="logo-title">
              <span className="word-delivery">Delivery</span>
              <span className="word-war">War</span>
            </span>
            <p className="logo-subtitle">
              Enchérissez. Livrez. <span>Dominez.</span>
            </p>
          </div>
          <div className="live-stats">
            <div className="stat">
              <div className="stat-num">1 247</div>
              <div className="stat-label">Enchères actives</div>
            </div>
            <div className="stat">
              <div className="stat-num">384</div>
              <div className="stat-label">Magasins en ligne</div>
            </div>
            <div className="stat">
              <div className="stat-num">€82K</div>
              <div className="stat-label">Volume aujourd&apos;hui</div>
            </div>
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className="form-panel">
          <div className="form-header">
            <div className="form-eyebrow">Espace enchérisseur</div>
            <div className="form-title">Connexion</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="shop-id">Identifiant magasin</label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="shop-id"
                  type="text"
                  placeholder="EX. PARIS-NORD-07"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  autoComplete="username"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/><circle cx="12" cy="12" r="1" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password">Mot de passe</label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 4, padding: '0.6rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-danger)', marginBottom: '0.5rem' }}>
                ⚠ {error}
              </div>
            )}

            <button className="btn-cta" type="submit" disabled={loading}>
              {loading ? 'Connexion…' : 'Accéder à la plateforme'}
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <div className="divider">ou</div>

          <button className="btn-whale-auth" type="button">
            <div className="whale-stars">
              {[1,2,3,4,5].map((i) => <div key={i} className="whale-star" />)}
            </div>
            🐋 Connexion Pass Whale — Accès VIP
          </button>

          <div className="admin-link-wrap">
            <a className="admin-link" href="#">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Accès administrateur plateforme
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: 'var(--c-text3)' }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'var(--c-pri)', textDecoration: 'none', fontWeight: 600 }}>
              Inscription
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
