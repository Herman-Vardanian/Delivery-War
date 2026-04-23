import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/stores`)
      .then((r) => {
        if (!r.ok) throw new Error('Erreur serveur');
        return r.json();
      })
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.totalSpent ?? 0) - (a.totalSpent ?? 0));
        setStores(sorted);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--c-pri)', marginBottom: '0.5rem' }}>Classement</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-text)', margin: '0 0 0.5rem' }}>
            Pigeon d'Or
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--c-text3)', margin: 0 }}>
            Les magasins qui dépensent le plus sur Delivery War
          </p>
        </div>

        {/* ── États ── */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--c-text3)', fontSize: '0.85rem', padding: '3rem' }}>
            Chargement…
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 8, padding: '1rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--c-danger)' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Top 3 ── */}
        {!loading && !error && stores.length > 0 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.875rem', marginBottom: '1.25rem' }}>
              {stores.slice(0, 3).map((s, i) => (
                <div key={s.id} style={{
                  background: i === 0 ? 'rgba(255,193,7,.07)' : 'var(--c-surf)',
                  border: `1px solid ${i === 0 ? 'rgba(255,193,7,.3)' : 'var(--c-border)'}`,
                  borderRadius: 12,
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                  order: i === 1 ? -1 : i === 0 ? 0 : 1,
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{MEDALS[i]}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--c-text)', marginBottom: '0.25rem', wordBreak: 'break-all' }}>{s.name}</div>
                  {s.whalePass && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--c-whale-s)', marginBottom: '0.35rem' }}>🐋 Whale</div>
                  )}
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--c-gold-s, #f5c518)' }}>
                    € {Number(s.totalSpent ?? 0).toLocaleString('fr-FR')}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', marginTop: '0.2rem' }}>total dépensé</div>
                </div>
              ))}
            </div>

            {/* ── Reste du classement ── */}
            {stores.length > 3 && (
              <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12, overflow: 'hidden' }}>
                {stores.slice(3).map((s, i) => (
                  <div key={s.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5rem 1fr auto auto',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1.25rem',
                    borderBottom: i < stores.length - 4 ? '1px solid var(--c-border)' : 'none',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text3)', textAlign: 'center' }}>#{i + 4}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--c-text)' }}>{s.name}</div>
                      {s.whalePass && <div style={{ fontSize: '0.65rem', color: 'var(--c-whale-s)' }}>🐋 Whale</div>}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--c-text2)' }}>
                      € {Number(s.totalSpent ?? 0).toLocaleString('fr-FR')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {stores.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--c-text3)', padding: '3rem', fontSize: '0.85rem' }}>
                Aucun magasin inscrit pour l'instant.
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
