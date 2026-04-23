import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function InscBg() {
  return (
    <div className="bg-layer">
      <svg className="bg-city" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <line x1="0" y1="180" x2="1440" y2="180" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="580" x2="1440" y2="580" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="780" x2="1440" y2="780" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="200" y1="0" x2="200" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="450" y1="0" x2="450" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="700" y1="0" x2="700" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="950" y1="0" x2="950" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="1200" y1="0" x2="1200" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <rect x="220" y="30" width="190" height="130" fill="#8899BB" rx="2" opacity=".9"/>
        <rect x="470" y="60" width="170" height="100" fill="#8899BB" rx="2" opacity=".9"/>
        <rect x="720" y="20" width="180" height="150" fill="#8899BB" rx="2" opacity=".9"/>
        <rect x="970" y="50" width="170" height="110" fill="#8899BB" rx="2" opacity=".9"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#FF8C00" strokeWidth="0.8" strokeDasharray="18 14" opacity="0.3"/>
        <circle cx="300" cy="140" r="4" fill="#FF8C00" opacity="0.5"/>
        <circle cx="560" cy="300" r="3" fill="#00E676" opacity="0.4"/>
        <circle cx="810" cy="180" r="5" fill="#FF8C00" opacity="0.45"/>
      </svg>

      <div style={{ position: 'absolute', left: -200, top: '50%', transform: 'translateY(-50%)', width: 600, height: 600, opacity: 0.07 }}>
        <svg viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="280" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.3"/>
          <circle cx="300" cy="300" r="200" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.25"/>
          <circle cx="300" cy="300" r="120" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.2"/>
          <circle cx="300" cy="300" r="50"  stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.15"/>
          <g style={{ transformOrigin: '300px 300px', animation: 'radar-spin 5s linear infinite' }}>
            <path d="M300 300 L580 300 A280 280 0 0 0 300 20 Z" fill="url(#rg2)" opacity="0.2"/>
          </g>
          <circle cx="420" cy="230" r="4" fill="#FF8C00" opacity="0.6"/>
          <circle cx="190" cy="380" r="3" fill="#00E676" opacity="0.5"/>
          <defs>
            <radialGradient id="rg2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 300) scale(280)">
              <stop offset="0" stopColor="#FF8C00" stopOpacity="0.5"/>
              <stop offset="1" stopColor="#FF8C00" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="trucks-layer">
        <svg className="truck" style={{ top: '12%', animation: 'truck-move 10s linear infinite', opacity: 0.5 }} width="150" height="56" viewBox="0 0 150 56" fill="none">
          <rect x="26" y="7" width="104" height="34" rx="3" fill="#1A2438" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.5"/>
          <rect x="6" y="15" width="26" height="26" rx="2" fill="#0D1B3E" stroke="#2A3F63" strokeWidth="0.8"/>
          <rect x="9" y="18" width="14" height="10" rx="1" fill="#29B6F6" opacity="0.6"/>
          <circle cx="46" cy="47" r="8" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.2"/>
          <circle cx="46" cy="47" r="3.5" fill="#1A2438"/>
          <circle cx="114" cy="47" r="8" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.2"/>
          <circle cx="114" cy="47" r="3.5" fill="#1A2438"/>
          <text x="78" y="30" fontFamily="'Barlow Condensed',sans-serif" fontSize="9" fontWeight="900" fill="#FF8C00" letterSpacing="1" textAnchor="middle">DW</text>
        </svg>
        <svg className="truck" style={{ top: '55%', animation: 'truck-move 14s linear infinite', animationDelay: '-5s', opacity: 0.35 }} width="120" height="48" viewBox="0 0 120 48" fill="none">
          <rect x="22" y="5" width="82" height="32" rx="2" fill="#0D1B3E" stroke="#162554" strokeWidth="0.8"/>
          <rect x="5" y="12" width="22" height="25" rx="2" fill="#080C18" stroke="#1E3370" strokeWidth="0.8"/>
          <rect x="8" y="15" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.5"/>
          <circle cx="36" cy="41" r="6" fill="#080C18" stroke="#2A3F63" strokeWidth="1"/>
          <circle cx="92" cy="41" r="6" fill="#080C18" stroke="#2A3F63" strokeWidth="1"/>
        </svg>
        <svg className="truck" style={{ top: '82%', animation: 'truck-move-reverse 9s linear infinite', animationDelay: '-3s', opacity: 0.3 }} width="100" height="42" viewBox="0 0 100 42" fill="none">
          <rect x="18" y="5" width="66" height="27" rx="2" fill="#111827" stroke="#1F2D47" strokeWidth="0.7"/>
          <rect x="4" y="10" width="20" height="22" rx="2" fill="#0C1020"/>
          <circle cx="30" cy="36" r="5.5" fill="#080C18" stroke="#1F2D47" strokeWidth="0.8"/>
          <circle cx="74" cy="36" r="5.5" fill="#080C18" stroke="#1F2D47" strokeWidth="0.8"/>
        </svg>
      </div>

      <div className="overlay-right" />
      <div className="overlay-vignette" style={{ background: 'radial-gradient(ellipse 60% 80% at 70% 50%, transparent 40%, rgba(8,12,24,0.88) 100%)' }} />
    </div>
  );
}

const STEPS_META = [
  { id: 1, label: 'Magasin', desc: 'Nom, adresse, type d\'activité' },
  { id: 2, label: 'Accès', desc: 'Email, téléphone, mot de passe' },
  { id: 3, label: 'Plan', desc: 'Gratuit, Standard ou Pass Whale' },
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

  const [s1, setS1] = useState({ name: '', id: '', type: '', address: '', zone: '', siret: '' });
  const [s2, setS2] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });

  const goStep = (n) => {
    setDoneSteps((d) => [...new Set([...d, step])]);
    setStep(n);
    window.scrollTo(0, 0);
  };

  const pct = [25, 50, 75, 100][step - 1];

  const planClass = (p) => {
    if (p === 'free' && selectedPlan === 'free') return 'plan-card-insc sel-free';
    if (p === 'standard' && selectedPlan === 'standard') return 'plan-card-insc sel-standard';
    if (p === 'whale' && selectedPlan === 'whale') return 'plan-card-insc sel-whale';
    return 'plan-card-insc';
  };

  const planConfirm = { free: 'Gratuit — 0 €/mois', standard: 'Standard — 49 €/mois', whale: 'Pass Whale — 199 €/mois' };
  const planColor   = { free: 'var(--c-success)', standard: 'var(--c-pri)', whale: 'var(--c-whale-s)' };

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

              {/* ── STEP 1 ── */}
              <div className={`step-panel ${step === 1 ? 'active' : ''}`}>
                <div className="form-eyebrow-insc">Étape 1</div>
                <div className="form-title-insc">Votre magasin</div>

                <div className="field-insc">
                  <label className="field-label-insc">Nom du magasin <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input className="field-input-insc" type="text" placeholder="Ex. Boulangerie Dupont" value={s1.name} onChange={(e) => setS1({ ...s1, name: e.target.value })} />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></FieldIcon>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-insc">
                    <label className="field-label-insc">Identifiant <span className="req">*</span></label>
                    <div className="field-wrap-insc">
                      <input className="field-input-insc" type="text" placeholder="PARIS-NORD-07" value={s1.id} onChange={(e) => setS1({ ...s1, id: e.target.value })} />
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></FieldIcon>
                    </div>
                    <div className="field-hint">Utilisé pour la connexion</div>
                  </div>
                  <div className="field-insc">
                    <label className="field-label-insc">Type d&apos;activité <span className="req">*</span></label>
                    <div className="field-wrap-insc">
                      <select className="field-select-insc" value={s1.type} onChange={(e) => setS1({ ...s1, type: e.target.value })}>
                        <option value="" disabled>Choisir...</option>
                        <option>Alimentation générale</option>
                        <option>Boulangerie / Pâtisserie</option>
                        <option>Boucherie / Charcuterie</option>
                        <option>Épicerie fine</option>
                        <option>Traiteur / Restauration</option>
                        <option>Caviste / Boissons</option>
                        <option>Librairie / Papeterie</option>
                        <option>Autre commerce</option>
                      </select>
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></FieldIcon>
                    </div>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Adresse <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input className="field-input-insc" type="text" placeholder="12 rue de la Paix, 75001 Paris" value={s1.address} onChange={(e) => setS1({ ...s1, address: e.target.value })} />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></FieldIcon>
                  </div>
                </div>

                <div className="field-row">
                  <div className="field-insc">
                    <label className="field-label-insc">Zone de livraison</label>
                    <div className="field-wrap-insc">
                      <select className="field-select-insc" value={s1.zone} onChange={(e) => setS1({ ...s1, zone: e.target.value })}>
                        <option value="" disabled>Zone...</option>
                        <option>Zone Nord</option><option>Zone Sud</option><option>Zone Est</option><option>Zone Ouest</option><option>Zone Centre</option>
                      </select>
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></FieldIcon>
                    </div>
                  </div>
                  <div className="field-insc">
                    <label className="field-label-insc">SIRET</label>
                    <div className="field-wrap-insc">
                      <input className="field-input-insc" type="text" placeholder="123 456 789 00012" value={s1.siret} onChange={(e) => setS1({ ...s1, siret: e.target.value })} />
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></FieldIcon>
                    </div>
                  </div>
                </div>

                <div className="form-footer">
                  <span style={{ fontSize: '0.68rem', color: 'var(--c-text3)' }}>Déjà inscrit ? <Link to="/login" style={{ color: 'var(--c-pri)', textDecoration: 'none' }}>Connexion</Link></span>
                  <button className="btn-insc btn-primary-insc" onClick={() => goStep(2)}>Continuer <span>→</span></button>
                </div>
              </div>

              {/* ── STEP 2 ── */}
              <div className={`step-panel ${step === 2 ? 'active' : ''}`}>
                <div className="form-eyebrow-insc">Étape 2</div>
                <div className="form-title-insc">Contact &amp; Accès</div>

                <div className="field-row">
                  <div className="field-insc">
                    <label className="field-label-insc">Prénom <span className="req">*</span></label>
                    <div className="field-wrap-insc">
                      <input className="field-input-insc" type="text" placeholder="Jean" value={s2.firstName} onChange={(e) => setS2({ ...s2, firstName: e.target.value })} />
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></FieldIcon>
                    </div>
                  </div>
                  <div className="field-insc">
                    <label className="field-label-insc">Nom <span className="req">*</span></label>
                    <div className="field-wrap-insc">
                      <input className="field-input-insc" type="text" placeholder="Dupont" value={s2.lastName} onChange={(e) => setS2({ ...s2, lastName: e.target.value })} />
                      <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></FieldIcon>
                    </div>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Adresse email <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input
                      className={`field-input-insc ${s2.email.length > 0 ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s2.email) ? 'valid' : 'error') : ''}`}
                      type="email" placeholder="jean.dupont@boulangerie.fr"
                      value={s2.email} onChange={(e) => setS2({ ...s2, email: e.target.value })}
                    />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></FieldIcon>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Téléphone</label>
                  <div className="field-wrap-insc">
                    <input className="field-input-insc" type="tel" placeholder="+33 6 12 34 56 78" value={s2.phone} onChange={(e) => setS2({ ...s2, phone: e.target.value })} />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg></FieldIcon>
                  </div>
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Mot de passe <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input className="field-input-insc" type="password" placeholder="Min. 8 caractères" value={s2.password} onChange={(e) => setS2({ ...s2, password: e.target.value })} />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></FieldIcon>
                  </div>
                  <PwdStrength value={s2.password} />
                </div>

                <div className="field-insc">
                  <label className="field-label-insc">Confirmer le mot de passe <span className="req">*</span></label>
                  <div className="field-wrap-insc">
                    <input className="field-input-insc" type="password" placeholder="••••••••" value={s2.confirm} onChange={(e) => setS2({ ...s2, confirm: e.target.value })} />
                    <FieldIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></FieldIcon>
                  </div>
                </div>

                <div className="form-footer">
                  <button className="btn-insc btn-ghost-insc" onClick={() => goStep(1)}>← Retour</button>
                  <button className="btn-insc btn-primary-insc" onClick={() => goStep(3)}>Continuer →</button>
                </div>
              </div>

              {/* ── STEP 3 ── */}
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

              {/* ── STEP 4 — Success ── */}
              <div className={`step-panel ${step === 4 ? 'active' : ''}`}>
                <div className="success-screen">
                  <div className="success-icon">🎉</div>
                  <div className="success-title">Compte créé !</div>
                  <p className="success-sub">Bienvenue dans Delivery War. Votre compte est activé et prêt à enchérir sur les créneaux de livraison.</p>

                  <div className="success-details">
                    <div className="sd-row">
                      <span className="sd-key">Identifiant</span>
                      <span className="sd-val">{s1.id || 'MON-MAGASIN'}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Magasin</span>
                      <span className="sd-val">{s1.name || 'Votre Magasin'}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Plan</span>
                      <span className="sd-val" style={{ color: planColor[selectedPlan] }}>{planConfirm[selectedPlan]}</span>
                    </div>
                    <div className="sd-row">
                      <span className="sd-key">Statut</span>
                      <span className="sd-val" style={{ color: 'var(--c-success)' }}>✓ Actif — Essai 14 jours</span>
                    </div>
                  </div>

                  <button className="btn-insc btn-success-insc" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
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
