import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../controllers/useAuth';
import AuthBg from '../components/AuthBg';

export default function LoginPage() {
  const [storeId, setStoreId] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void login(storeId, password);
  };

  return (
    <>
      <AuthBg />
      <Link to="/" className="auth-home-link">Delivery <span>War</span></Link>
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
              <label className="field-label" htmlFor="store-id">Identifiant magasin</label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="store-id"
                  type="text"
                  placeholder="EX. PARIS-NORD-07"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  autoComplete="username"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
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
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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
