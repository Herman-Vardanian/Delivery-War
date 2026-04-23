import { useState } from 'react';

const AMOUNTS = [10, 20, 50, 100, 200];

export default function ProfilePage() {
  const [balance, setBalance] = useState(0);
  const [whalePass, setWhalePass] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showTopupSuccess, setShowTopupSuccess] = useState(false);
  const [showWhaleSuccess, setShowWhaleSuccess] = useState(false);

  const handleTopup = () => {
    const amount = selectedAmount ?? parseFloat(customAmount);
    if (!amount || amount <= 0) return;
    setBalance((b) => b + amount);
    setSelectedAmount(null);
    setCustomAmount('');
    setShowTopupSuccess(true);
    setTimeout(() => setShowTopupSuccess(false), 3000);
  };

  const handleWhale = () => {
    setWhalePass(true);
    setShowWhaleSuccess(true);
    setTimeout(() => setShowWhaleSuccess(false), 3000);
  };

  const topupAmount = selectedAmount ?? (parseFloat(customAmount) || 0);

  return (
    <>
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ── Header profil ── */}
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,107,26,.15)', border: '1px solid rgba(255,107,26,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
              🏪
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--c-text)', letterSpacing: '0.04em' }}>PARIS-NORD-07</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)', marginTop: 2 }}>contact@monmagasin.fr</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {whalePass ? (
                <span style={{ background: 'rgba(99,179,237,.15)', border: '1px solid rgba(99,179,237,.3)', color: 'var(--c-whale-s)', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.72rem', fontWeight: 600 }}>🐋 Pass Whale</span>
              ) : (
                <span style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--c-border)', color: 'var(--c-text3)', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.72rem' }}>Gratuit</span>
              )}
            </div>
          </div>

          {/* ── Solde ── */}
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.5rem 1.75rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text3)', marginBottom: '0.5rem' }}>Solde disponible</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--c-success)', letterSpacing: '-0.02em' }}>
              € {balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* ── Recharger ── */}
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.5rem 1.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-text)', marginBottom: '1rem' }}>Recharger le solde</div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setSelectedAmount(a); setCustomAmount(''); }}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: 6,
                    border: `1px solid ${selectedAmount === a ? 'var(--c-pri)' : 'var(--c-border)'}`,
                    background: selectedAmount === a ? 'rgba(255,107,26,.15)' : 'var(--c-bg)',
                    color: selectedAmount === a ? 'var(--c-pri)' : 'var(--c-text2)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all .15s',
                  }}
                >
                  {a} €
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="number"
                  min="1"
                  placeholder="Montant personnalisé"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                  style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.55rem 2.25rem 0.55rem 0.875rem', fontSize: '0.85rem', color: 'var(--c-text)', outline: 'none', boxSizing: 'border-box' }}
                />
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text3)', fontSize: '0.8rem' }}>€</span>
              </div>
            </div>

            {showTopupSuccess && (
              <div style={{ background: 'rgba(72,199,142,.12)', border: '1px solid rgba(72,199,142,.3)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-success)', marginBottom: '0.75rem' }}>
                ✓ Solde rechargé de {topupAmount > 0 ? topupAmount : '...'} €
              </div>
            )}

            <button
              className="btn-cta"
              style={{ width: '100%', justifyContent: 'center', opacity: topupAmount > 0 ? 1 : 0.45, pointerEvents: topupAmount > 0 ? 'auto' : 'none' }}
              onClick={handleTopup}
            >
              Recharger {topupAmount > 0 ? `${topupAmount} €` : ''}
              <span className="btn-arrow">→</span>
            </button>
          </div>

          {/* ── Pass Whale ── */}
          {!whalePass && (
            <div style={{ background: 'linear-gradient(135deg, rgba(99,179,237,.08), rgba(99,179,237,.03))', border: '1px solid rgba(99,179,237,.25)', borderRadius: 12, padding: '1.5rem 1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.6rem' }}>🐋</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-whale-s)' }}>Pass Whale</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>199 € / mois · Essai 14 jours gratuits</div>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 800, fontSize: '1.1rem', color: 'var(--c-whale-s)' }}>199 €</div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {['Créneaux exclusifs VIP inaccessibles aux comptes Gratuit', 'Jamais placé en file Tortue', 'Dashboard avancé temps réel', 'Support dédié 24/7'].map((f) => (
                  <li key={f} style={{ fontSize: '0.78rem', color: 'var(--c-text2)', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--c-whale-s)', flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              {showWhaleSuccess && (
                <div style={{ background: 'rgba(99,179,237,.12)', border: '1px solid rgba(99,179,237,.3)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-whale-s)', marginBottom: '0.75rem' }}>
                  🐋 Pass Whale activé ! Profitez de vos avantages VIP.
                </div>
              )}

              <button
                onClick={handleWhale}
                style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid rgba(99,179,237,.4)', background: 'rgba(99,179,237,.12)', color: 'var(--c-whale-s)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all .15s' }}
              >
                🐋 Activer le Pass Whale
              </button>
            </div>
          )}

          {whalePass && (
            <div style={{ background: 'rgba(99,179,237,.06)', border: '1px solid rgba(99,179,237,.2)', borderRadius: 12, padding: '1rem 1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🐋</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-whale-s)' }}>Pass Whale actif</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>Vous bénéficiez de tous les avantages VIP.</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--c-text3)' }}>Résiliable à tout moment</span>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
