import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InscBg from '../components/InscBg';

const STEPS_META = [
  { id: 1, label: 'Magasin',  desc: 'Nom et identifiant de connexion' },
  { id: 2, label: 'Accès',    desc: 'Mot de passe et crédit de départ' },
  { id: 3, label: 'Plan',     desc: 'Gratuit, Standard ou Pass Whale' },
  { id: 4, label: 'Confirmation', desc: 'Compte activé, prêt à enchérir' },
];

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

function FieldIcon({ children }) {
  return <div className="field-icon-insc">{children}</div>;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doneSteps, setDoneSteps] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  // Champs alignés sur l'entité Store
  const [s1, setS1] = useState({ name: '', storeId: '' });
  const [s2, setS2] = useState({ password: '', confirm: '', balance: '' });

  const goStep = (n) => {
    setDoneSteps((d) => [...new Set([...d, step])]);
    setStep(n);
    window.scrollTo(0, 0);
  };

  const pct = [25, 50, 75, 100][step - 1];

  const planClass = (p) => {
    if (p === selectedPlan) {
      if (p === 'free')     return 'plan-card-insc sel-free';
      if (p === 'standard') return 'plan-card-insc sel-standard';
      if (p === 'whale')    return 'plan-card-insc sel-whale';
    }
    return 'plan-card-insc';
  };

  const whalePass     = selectedPlan === 'whale';
  const planConfirm   = { free: 'Gratuit — 0 €/mois', standard: 'Standard — 49 €/mois', whale: 'Pass Whale — 199 €/mois' };
  const planColor     = { free: 'var(--c-success)', standard: 'var(--c-pri)', whale: 'var(--c-whale-s)' };

  const dotClass = (id) => {
    if (doneSteps.includes(id)) return 'step-dot done';
    if (id === step)            return 'step-dot active';
    return 'step-dot pending';
  };
  const labelClass = (id) => {
    if (doneSteps.includes(id)) return 'step-label done';
    if (id === step)            return 'step-label active';
    return 'step-label pending';
  };
  const fsnClass = (id) => {
    if (doneSteps.includes(id)) return 'fsn-item done';
    if (id === step)            return 'fsn-item active';
    return 'fsn-item';
  };

  return (
    <>
      <InscBg />
      <Link to="/" className="auth-home-link">Delivery <span>War</span></Link>
      <div className="insc-page">

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <Link className="logo-link" to="/login">
            <div className="logo-text">Delivery <span>War</span></div>
            <span className="logo-back-arrow">← Connexion</span>
          </Link>
          <h2 className="panel-title">Rejoignez<br />la <span>bataille</span></h2>
          <p className="panel-sub">Créez votre compte magasin et commencez à enchérir sur des créneaux de livraison en temps réel.</p>

          <div className="steps">
            {STEPS_META.map(({ id, label, desc }, idx) => (
              <div key={id} className="step">
                <div className="step-line-wrap">
                  <div className={dotClass(id)}>{doneSteps.includes(id) ? '✓' : id}</div>
                  {idx < STEPS_META.length - 1 && (
                    <div className={`step-connector ${doneSteps.includes(id) ? 'done' : ''}`} />
                  )}
                </div>
                <div className="step-content">
                  <div className={labelClass(id)}>{label}</div>
                  <div className="step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="guarantees">
            <div className="guarantee"><span className="guarantee-icon">🔒</span> Données sécurisées et chiffrées</div>
            <div className="guarantee"><span className="guarantee-icon">⚡</span> Activation immédiate après inscription</div>
            <div className="guarantee"><span className="guarantee-icon">🐋</span> Pass Whale upgradeable à tout moment</div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="form-card">

            {/* Step nav tabs */}
            <div className="form-steps-nav">
              {STEPS_META.map(({ id, label }) => (
                <div key={id} className={fsnClass(id)}>
                  <span className="fsn-num">{doneSteps.includes(id) ? '✓' : id}</span>
                  {label}
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="form-progress">
              <div className="form-progress-bar">
                <div className="form-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="form-progress-label">Étape {step} / 4</div>
            </div>

            <div className="form-body">

              {/* ── STEP 1 — Magasin ── */}
              <div className={`step-panel ${step === 1 ? 'active' : ''}`}>
                <div className="form-eyebrow-insc">Étape 1</div>
                <div className="form-title-insc">Votre magasin</div>

                <div className="field-insc">
                  <label className="field-label-insc">Nom du magasin <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className="field-input-insc"
                      type="text"
                      placeholder="Ex. Boulangerie Dupont"
                      value={s1.name}
                      onChange={(e) => setS1({ ...s1, name: e.target.value })}
                    />
                    <FieldIcon>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </FieldIcon>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Identifiant de connexion <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className="field-input-insc"
                      type="text"
                      placeholder="Ex. PARIS-NORD-07"
                      value={s1.storeId}
                      onChange={(e) => setS1({ ...s1, storeId: e.target.value.toUpperCase() })}
                    />
                    <FieldIcon>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                    </FieldIcon>
                  </div>
                  <div className="field-hint">Utilisé pour la connexion. Majuscules recommandées.</div>
                </div>

                <div className="form-footer">
                  <span style={{ fontSize: '0.68rem', color: 'var(--c-text3)' }}>
                    Déjà inscrit ?{' '}
                    <Link to="/login" style={{ color: 'var(--c-pri)', textDecoration: 'none' }}>Connexion</Link>
                  </span>
                  <button className="btn-insc btn-primary-insc" onClick={() => goStep(2)}>
                    Continuer <span>→</span>
                  </button>
                </div>
              </div>

              {/* ── STEP 2 — Accès & Finances ── */}
              <div className={`step-panel ${step === 2 ? 'active' : ''}`}>
                <div className="form-eyebrow-insc">Étape 2</div>
                <div className="form-title-insc">Accès &amp; Finances</div>

                <div className="field-insc">
                  <label className="field-label-insc">Mot de passe <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className="field-input-insc"
                      type="password"
                      placeholder="Min. 8 caractères"
                      value={s2.password}
                      onChange={(e) => setS2({ ...s2, password: e.target.value })}
                    />
                    <FieldIcon>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </FieldIcon>
                  </div>
                  <PwdStrength value={s2.password} />
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Confirmer le mot de passe <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className={`field-input-insc ${s2.confirm.length > 0 ? (s2.confirm === s2.password ? 'valid' : 'error') : ''}`}
                      type="password"
                      placeholder="••••••••"
                      value={s2.confirm}
                      onChange={(e) => setS2({ ...s2, confirm: e.target.value })}
                    />
                    <FieldIcon>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </FieldIcon>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Crédit de départ (€) <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className="field-input-insc"
                      type="number"
                      min="0"
                      placeholder="Ex. 500"
                      value={s2.balance}
                      onChange={(e) => setS2({ ...s2, balance: e.target.value })}
                    />
                    <FieldIcon>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="12" y1="1" x2="12" y2="23"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </FieldIcon>
                  </div>
                  <div className="field-hint">Solde initial disponible pour enchérir.</div>
                </div>

                <div className="form-footer">
                  <button className="btn-insc btn-ghost-insc" onClick={() => goStep(1)}>← Retour</button>
                  <button className="btn-insc btn-primary-insc" onClick={() => goStep(3)}>Continuer →</button>
                </div>
              </div>

              {/* ── STEP 3 — Plan ── */}
              <div className={`step-panel ${step === 3 ? 'active' : ''}`}>
                <div className="form-eyebrow-insc">Étape 3</div>
                <div className="form-title-insc">Choisir votre plan</div>

                <div className="plans-insc">
                  <div className={planClass('free')} onClick={() => setSelectedPlan('free')}>
                    <div className="plan-radio" />
                    <div className="plan-icon-insc">🐢</div>
                    <div className="plan-info">
                      <div className="plan-name-insc">Gratuit</div>
                      <div className="plan-desc-insc">Accès aux enchères standard. File Tortue si enchère perdue. Petit camion uniquement.</div>
                    </div>
                    <div className="plan-price-insc">0 €<span>/ mois</span></div>
                  </div>

                  <div className={planClass('standard')} onClick={() => setSelectedPlan('standard')}>
                    <div className="plan-badge-insc">Recommandé</div>
                    <div className="plan-radio" />
                    <div className="plan-icon-insc">🚛</div>
                    <div className="plan-info">
                      <div className="plan-name-insc">Standard</div>
                      <div className="plan-desc-insc">Tous les créneaux disponibles. Camion grand et petit. Priorité sur la file Tortue.</div>
                    </div>
                    <div className="plan-price-insc">49 €<span>/ mois</span></div>
                  </div>

                  <div className={planClass('whale')} onClick={() => setSelectedPlan('whale')}>
                    <div className="plan-badge-insc whale">VIP</div>
                    <div className="plan-radio" />
                    <div className="plan-icon-insc">🐋</div>
                    <div className="plan-info">
                      <div className="plan-name-insc">Pass Whale</div>
                      <div className="plan-desc-insc">Créneaux exclusifs VIP. Jamais en file Tortue. Dashboard avancé. Support dédié.</div>
                    </div>
                    <div className="plan-price-insc">199 €<span>/ mois</span></div>
                  </div>
                </div>

                <div style={{ fontSize: '0.68rem', color: 'var(--c-text3)', textAlign: 'center', marginBottom: '0.5rem' }}>
                  Tous les plans sont résiliables à tout moment. Essai gratuit 14 jours sur Standard et Whale.
                </div>

                <div className="form-footer">
                  <button className="btn-insc btn-ghost-insc" onClick={() => goStep(2)}>← Retour</button>
                  <button className="btn-insc btn-primary-insc" onClick={() => goStep(4)}>Créer mon compte →</button>
                </div>
              </div>

              {/* ── STEP 4 — Confirmation ── */}
              <div className={`step-panel ${step === 4 ? 'active' : ''}`}>
                <div className="success-screen">
                  <div className="success-icon">🎉</div>
                  <div className="success-title">Compte créé !</div>
                  <p className="success-sub">Bienvenue dans Delivery War. Votre compte est activé et prêt à enchérir sur les créneaux de livraison.</p>

                  <div className="success-details">
                    <div className="sd-row">
                      <span className="sd-key">Identifiant</span>
                      <span className="sd-val">{s1.storeId || 'MON-MAGASIN'}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Magasin</span>
                      <span className="sd-val">{s1.name || 'Votre Magasin'}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Solde initial</span>
                      <span className="sd-val" style={{ color: 'var(--c-success)' }}>
                        {s2.balance ? `${Number(s2.balance).toLocaleString('fr-FR')} €` : '0 €'}
                      </span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Plan</span>
                      <span className="sd-val" style={{ color: planColor[selectedPlan] }}>{planConfirm[selectedPlan]}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Pass Whale</span>
                      <span className="sd-val" style={{ color: whalePass ? 'var(--c-whale-s)' : 'var(--c-text3)' }}>
                        {whalePass ? '🐋 Actif' : '—'}
                      </span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Rôle</span>
                      <span className="sd-val">STORE</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Statut</span>
                      <span className="sd-val" style={{ color: 'var(--c-success)' }}>✓ Actif</span>
                    </div>
                  </div>

                  <button
                    className="btn-insc btn-success-insc"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/login')}
                  >
                    Accéder à la plateforme →
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
