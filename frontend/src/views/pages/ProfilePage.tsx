import { useState, useEffect, useCallback } from 'react';
import { authModel } from '../../models/authModel';
import { stores as storesApi } from '../../controllers/endpoints';
import type { Store } from '../../interfaces/Store';

function useWhaleCountdown(expiry: string | null | undefined): string {
  const calc = useCallback(() => {
    if (!expiry) return 0;
    return Math.max(0, Math.floor((new Date(expiry).getTime() - Date.now()) / 1000));
  }, [expiry]);

  const [s, setS] = useState(calc);
  useEffect(() => {
    setS(calc());
    const id = setInterval(() => setS(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);

  if (!expiry || s <= 0) return 'Expiration imminente';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m > 0 ? `${m}m ` : ''}${String(sec).padStart(2, '0')}s`;
}

const AMOUNTS = [10, 20, 50, 100, 200];

export default function ProfilePage() {
  const [store, setStore] = useState<Store | null>(authModel.getUser());
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showTopupSuccess, setShowTopupSuccess] = useState(false);
  const [showWhaleSuccess, setShowWhaleSuccess] = useState(false);
  const [showWhaleCancelled, setShowWhaleCancelled] = useState(false);
  const [whaleUnsubLoading, setWhaleUnsubLoading] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);
  const [whaleLoading, setWhaleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = authModel.getUser();
    if (!user?.id) return;
    storesApi.byId(user.id)
      .then((s) => { setStore(s); authModel.saveUser(s); })
      .catch(() => { /* keep local data on network error */ });
  }, []);

  useEffect(() => {
    const onUpdate = () => setStore(authModel.getUser());
    window.addEventListener('user-updated', onUpdate);
    return () => window.removeEventListener('user-updated', onUpdate);
  }, []);

  const topupAmount = selectedAmount ?? (parseFloat(customAmount) || 0);

  const handleTopup = async () => {
    if (!store || topupAmount <= 0) return;
    setTopupLoading(true);
    setError('');
    try {
      const updated = await storesApi.update(store.id, {
        ...store,
        balance: (Number(store.balance) || 0) + topupAmount,
      });
      setStore(updated);
      authModel.saveUser(updated);
      window.dispatchEvent(new Event('user-updated'));
      setSelectedAmount(null);
      setCustomAmount('');
      setShowTopupSuccess(true);
      setTimeout(() => setShowTopupSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur lors de la recharge');
    } finally {
      setTopupLoading(false);
    }
  };

  const WHALE_PRICE = 199;
  const whaleCountdown = useWhaleCountdown(store?.whalePassExpiry);
  const whaleExpirySeconds = store?.whalePassExpiry
    ? Math.max(0, Math.floor((new Date(store.whalePassExpiry).getTime() - Date.now()) / 1000))
    : 0;

  const handleWhaleUnsub = async () => {
    if (!store) return;
    setWhaleUnsubLoading(true);
    setError('');
    try {
      const updated = await storesApi.deactivateWhalePass(store.id);
      setStore(updated);
      authModel.saveUser(updated);
      window.dispatchEvent(new Event('user-updated'));
      setShowWhaleCancelled(true);
      setTimeout(() => setShowWhaleCancelled(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur désabonnement Pass Whale');
    } finally {
      setWhaleUnsubLoading(false);
    }
  };

  const handleWhale = async () => {
    if (!store) return;
    setWhaleLoading(true);
    setError('');
    try {
      const updated = await storesApi.activateWhalePass(store.id);
      setStore(updated);
      authModel.saveUser(updated);
      window.dispatchEvent(new Event('user-updated'));
      setShowWhaleSuccess(true);
      setTimeout(() => setShowWhaleSuccess(false), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur activation Pass Whale');
    } finally {
      setWhaleLoading(false);
    }
  };

  if (!store) return null;

  const balance = Number(store.balance ?? 0);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* ── Header profil ── */}
        <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,107,26,.15)', border: '1px solid rgba(255,107,26,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
            🏪
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--c-text)', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {store.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)', marginTop: 2 }}>{store.email}</div>
            {store.address && (
              <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)', marginTop: 1 }}>{store.address}</div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {store.whalePass ? (
              <span style={{ background: 'rgba(99,179,237,.15)', border: '1px solid rgba(99,179,237,.3)', color: 'var(--c-whale-s)', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.72rem', fontWeight: 600 }}>🐋 Pass Whale</span>
            ) : (
              <span style={{ background: 'rgba(255,255,255,.06)', border: '1px solid var(--c-border)', color: 'var(--c-text3)', borderRadius: 20, padding: '0.25rem 0.75rem', fontSize: '0.72rem' }}>Gratuit</span>
            )}
          </div>
        </div>

        {/* ── Erreur globale ── */}
        {error && (
          <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.78rem', color: 'var(--c-danger)' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Solde ── */}
        <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text3)', marginBottom: '0.4rem' }}>Solde disponible</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-success)', letterSpacing: '-0.02em' }}>
              € {balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text3)', marginBottom: '0.4rem' }}>Total dépensé</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-text2)', letterSpacing: '-0.02em' }}>
              € {Number(store.totalSpent ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
            </div>
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
                }}
              >
                {a} €
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
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

          {showTopupSuccess && (
            <div style={{ background: 'rgba(72,199,142,.12)', border: '1px solid rgba(72,199,142,.3)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-success)', marginBottom: '0.75rem' }}>
              ✓ Solde rechargé de {topupAmount} €
            </div>
          )}

          <button
            className="btn-cta"
            style={{ width: '100%', justifyContent: 'center', opacity: topupAmount > 0 && !topupLoading ? 1 : 0.45, pointerEvents: topupAmount > 0 && !topupLoading ? 'auto' : 'none' }}
            onClick={() => void handleTopup()}
          >
            {topupLoading ? 'Recharge en cours…' : `Recharger${topupAmount > 0 ? ` ${topupAmount} €` : ''}`}
            {!topupLoading && <span className="btn-arrow">→</span>}
          </button>
        </div>

        {/* ── Pass Whale ── */}
        {!store.whalePass ? (
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
                🐋 Pass Whale activé ! {WHALE_PRICE} € débités de votre solde.
              </div>
            )}

            {balance < WHALE_PRICE && (
              <div style={{ background: 'rgba(255,77,77,.08)', border: '1px solid rgba(255,77,77,.2)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-danger)', marginBottom: '0.75rem' }}>
                Solde insuffisant — il vous manque {(WHALE_PRICE - balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € pour activer le Pass Whale.
              </div>
            )}

            <button
              onClick={() => void handleWhale()}
              disabled={whaleLoading || balance < WHALE_PRICE}
              style={{ width: '100%', padding: '0.7rem', borderRadius: 8, border: '1px solid rgba(99,179,237,.4)', background: 'rgba(99,179,237,.12)', color: balance < WHALE_PRICE ? 'var(--c-text3)' : 'var(--c-whale-s)', fontWeight: 700, fontSize: '0.85rem', cursor: (whaleLoading || balance < WHALE_PRICE) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', opacity: (whaleLoading || balance < WHALE_PRICE) ? 0.5 : 1 }}
            >
              {whaleLoading ? 'Activation…' : `🐋 Activer le Pass Whale — ${WHALE_PRICE} €`}
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(99,179,237,.06)', border: '1px solid rgba(99,179,237,.2)', borderRadius: 12, padding: '1.25rem 1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🐋</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-whale-s)' }}>Pass Whale actif</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>Vous bénéficiez de tous les avantages VIP.</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>
                  {balance >= WHALE_PRICE ? 'Renouvellement auto dans' : 'Expiration dans'}
                </div>
                <div style={{
                  fontWeight: 700, fontSize: '0.88rem', fontVariantNumeric: 'tabular-nums',
                  color: whaleExpirySeconds < 300 ? 'var(--c-danger)' : 'var(--c-whale-s)',
                }}>
                  {whaleCountdown}
                </div>
              </div>
            </div>
            {balance < WHALE_PRICE && (
              <div style={{ background: 'rgba(255,77,77,.08)', border: '1px solid rgba(255,77,77,.2)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-danger)', marginBottom: '0.875rem' }}>
                Solde insuffisant pour le renouvellement automatique — rechargez au moins {(WHALE_PRICE - balance).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € pour éviter la résiliation.
              </div>
            )}

            {showWhaleCancelled && (
              <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.5rem 0.875rem', fontSize: '0.75rem', color: 'var(--c-text3)', marginBottom: '0.75rem' }}>
                Pass Whale résilié. Vos avantages VIP ont été désactivés.
              </div>
            )}

            <button
              onClick={() => void handleWhaleUnsub()}
              disabled={whaleUnsubLoading}
              style={{ width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid rgba(255,77,77,.25)', background: 'rgba(255,77,77,.06)', color: 'var(--c-danger)', fontWeight: 600, fontSize: '0.8rem', cursor: whaleUnsubLoading ? 'default' : 'pointer', opacity: whaleUnsubLoading ? 0.5 : 1 }}
            >
              {whaleUnsubLoading ? 'Résiliation…' : 'Se désabonner'}
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
