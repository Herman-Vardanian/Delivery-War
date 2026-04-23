import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthBg from '../components/AuthBg';
import { authModel } from '../../models/authModel';

function PwdStrength({ value }) {
  let score = 0;
  if (value.length >= 8)          score++;
  if (/[A-Z]/.test(value))        score++;
  if (/[0-9]/.test(value))        score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  const cls = score <= 1 ? 'filled-weak' : score <= 2 ? 'filled-medium' : 'filled-strong';
  const labels = ['', 'Trop court', 'Faible', 'Moyen', 'Fort'];
  const colors = ['', 'var(--c-danger)', 'var(--c-danger)', 'var(--c-pri)', 'var(--c-success)'];
  return (
    <div className="pwd-strength">
      <div className="pwd-bars">
        {[0,1,2,3].map((i) => <div key={i} className={`pwd-bar ${i < score ? cls : ''}`} />)}
      </div>
      <div className="pwd-label" style={{ color: value.length === 0 ? 'var(--c-text3)' : colors[score] }}>
        {value.length === 0 ? 'Saisissez un mot de passe' : labels[score]}
      </div>
    </div>
  );
}

const ERR_STYLE = { fontSize: '0.7rem', color: 'var(--c-danger)', marginLeft: 'auto' };

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ storeId: '', password: '', confirm: '', email: '', address: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};

    if (!form.storeId.trim())
      next.storeId = 'Obligatoire';

    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Email valide obligatoire';

    if (!form.password)
      next.password = 'Obligatoire';

    if (form.password && form.password !== form.confirm)
      next.confirm = 'Ne correspond pas';

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    setApiError('');
    try {
      const store = await authModel.register(form);
      authModel.saveUser(store);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '2.5rem 2rem', maxWidth: 380, width: '90%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--c-text)', marginBottom: '0.5rem' }}>Compte créé !</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--c-text2)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              Bienvenue dans Delivery War. Votre compte <strong style={{ color: 'var(--c-pri)' }}>{form.storeId}</strong> est actif et prêt à enchérir.
            </p>
            <button className="btn-cta" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
              Accéder à la plateforme <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      )}
      <AuthBg />
      <Link to="/" className="auth-home-link">Delivery <span>War</span></Link>
      <main className="auth-main">

        {/* ── Branding ── */}
        <div className="branding">
          <div className="logo-block">
            <div className="logo-icon">
              <span className="logo-badge">Inscription</span>
            </div>
            <span className="logo-title">
              <span className="word-delivery">Delivery</span>
              <span className="word-war">War</span>
            </span>
            <p className="logo-subtitle">
              Rejoignez la <span>bataille.</span>
            </p>
          </div>
          <div className="live-stats">
            <div className="stat">
              <div className="stat-num">384</div>
              <div className="stat-label">Magasins inscrits</div>
            </div>
            <div className="stat">
              <div className="stat-num">1 247</div>
              <div className="stat-label">Enchères actives</div>
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
            <div className="form-eyebrow">Nouveau compte</div>
            <div className="form-title">Inscription</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label" htmlFor="store-id" style={{ display: 'flex', alignItems: 'center' }}>
                Identifiant <span className="req" style={{ marginLeft: '0.2rem' }}>*</span>
                {errors.storeId && <span style={ERR_STYLE}>⚠ {errors.storeId}</span>}
              </label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="store-id"
                  type="text"
                  placeholder="EX. PARIS-NORD-07"
                  value={form.storeId}
                  onChange={(e) => setForm({ ...form, storeId: e.target.value })}
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
              <label className="field-label" htmlFor="email" style={{ display: 'flex', alignItems: 'center' }}>
                Adresse email <span className="req" style={{ marginLeft: '0.2rem' }}>*</span>
                {errors.email && <span style={ERR_STYLE}>⚠ {errors.email}</span>}
              </label>
              <div className="field-wrap">
                <input
                  className={`field-input ${form.email.length > 0 ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'valid' : 'error') : ''}`}
                  id="email"
                  type="email"
                  placeholder="contact@monmagasin.fr"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="address">
                Adresse postale
              </label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="address"
                  type="text"
                  placeholder="12 rue de la Paix, 75001 Paris"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  autoComplete="street-address"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="password" style={{ display: 'flex', alignItems: 'center' }}>
                Mot de passe <span className="req" style={{ marginLeft: '0.2rem' }}>*</span>
                {errors.password && <span style={ERR_STYLE}>⚠ {errors.password}</span>}
              </label>
              <div className="field-wrap">
                <input
                  className="field-input"
                  id="password"
                  type="password"
                  placeholder="Min. 8 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
              <PwdStrength value={form.password} />
            </div>

            <div className="field">
              <label className="field-label" htmlFor="confirm" style={{ display: 'flex', alignItems: 'center' }}>
                Confirmer le mot de passe <span className="req" style={{ marginLeft: '0.2rem' }}>*</span>
                {errors.confirm && <span style={ERR_STYLE}>⚠ {errors.confirm}</span>}
              </label>
              <div className="field-wrap">
                <input
                  className={`field-input ${form.confirm.length > 0 ? (form.confirm === form.password ? 'valid' : 'error') : ''}`}
                  id="confirm"
                  type="password"
                  placeholder="••••••••••"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  autoComplete="new-password"
                />
                <div className="field-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>

            {apiError && (
              <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 4, padding: '0.6rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-danger)', marginBottom: '0.5rem' }}>
                ⚠ {apiError}
              </div>
            )}

            <button className="btn-cta" type="submit" disabled={loading}>
              {loading ? 'Création…' : 'Créer mon compte'}
              <span className="btn-arrow">→</span>
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.72rem', color: 'var(--c-text3)' }}>
            Déjà inscrit ?{' '}
            <Link to="/login" style={{ color: 'var(--c-pri)', textDecoration: 'none', fontWeight: 600 }}>
              Connexion
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
