import { useState, useEffect } from 'react';
import { authModel } from '../../models/authModel';

const MOCK_AUCTIONS = [
  { id: 1, zone: 'Paris 18e', slot: '09h–11h', currentBid: 137, myBid: 137, participants: 4, secondsLeft: 142, status: 'leading' },
  { id: 2, zone: 'Paris 11e', slot: '14h–16h', currentBid: 182, myBid: 150, participants: 6, secondsLeft: 38,  status: 'outbid' },
  { id: 3, zone: 'Paris 5e',  slot: '10h–12h', currentBid: 95,  myBid: null, participants: 3, secondsLeft: 310, status: 'open' },
  { id: 4, zone: 'Paris 13e', slot: '16h–18h', currentBid: 210, myBid: null, participants: 8, secondsLeft: 72,  status: 'open' },
  { id: 5, zone: 'Paris 9e',  slot: '08h–10h', currentBid: 88,  myBid: 88,  participants: 2, secondsLeft: 0,   status: 'won' },
  { id: 6, zone: 'Paris 3e',  slot: '13h–15h', currentBid: 165, myBid: 120, participants: 5, secondsLeft: 0,   status: 'lost' },
];

function Timer({ seconds }) {
  const [s, setS] = useState(seconds);
  useEffect(() => {
    if (s <= 0) return;
    const id = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  if (s <= 0) return <span style={{ color: 'var(--c-text3)', fontSize: '0.75rem' }}>Terminé</span>;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const urgent = s < 60;
  return (
    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: urgent ? 'var(--c-danger)' : 'var(--c-text)', fontVariantNumeric: 'tabular-nums' }}>
      {urgent && '⚠ '}{m > 0 ? `${m}m ` : ''}{String(sec).padStart(2, '0')}s
    </span>
  );
}

const STATUS_CONFIG = {
  leading: { label: 'En tête',  color: 'var(--c-success)',   bg: 'rgba(72,199,142,.1)',   border: 'rgba(72,199,142,.25)' },
  outbid:  { label: 'Surenchéri', color: 'var(--c-danger)', bg: 'rgba(255,77,77,.1)',     border: 'rgba(255,77,77,.25)' },
  open:    { label: 'Disponible', color: 'var(--c-pri)',     bg: 'rgba(255,107,26,.08)',   border: 'rgba(255,107,26,.2)' },
  won:     { label: '🏆 Remporté', color: 'var(--c-gold-s)', bg: 'rgba(255,193,7,.08)',   border: 'rgba(255,193,7,.2)' },
  lost:    { label: 'Perdu',    color: 'var(--c-text3)',     bg: 'rgba(255,255,255,.04)', border: 'var(--c-border)' },
};

export default function DashboardPage() {
  const user = authModel.getUser();
  const storeName = user?.name || '—';

  const [auctions, setAuctions] = useState(MOCK_AUCTIONS);
  const [bidInputs, setBidInputs] = useState({});

  const placeBid = (id) => {
    const amount = parseFloat(bidInputs[id]);
    if (!amount) return;
    setAuctions((prev) => prev.map((a) =>
      a.id === id && amount > a.currentBid
        ? { ...a, currentBid: amount, myBid: amount, status: 'leading' }
        : a
    ));
    setBidInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const active  = auctions.filter((a) => a.secondsLeft > 0);
  const closed  = auctions.filter((a) => a.secondsLeft === 0);
  const leading = auctions.filter((a) => a.status === 'leading').length;
  const outbid  = auctions.filter((a) => a.status === 'outbid').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text3)', marginBottom: '0.3rem' }}>Tableau de bord</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--c-text)', margin: 0 }}>
            Bienvenue, <span style={{ color: 'var(--c-pri)' }}>{storeName}</span>
          </h1>
        </div>

        {/* ── Stats rapides ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Enchères actives', value: active.length, color: 'var(--c-pri)' },
            { label: 'En tête',          value: leading,        color: 'var(--c-success)' },
            { label: 'Surenchéri',       value: outbid,         color: 'var(--c-danger)' },
            { label: 'Solde disponible', value: '€ 0',          color: 'var(--c-text)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Enchères actives ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-success)', display: 'inline-block', boxShadow: '0 0 6px var(--c-success)' }} />
            En cours
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {active.map((a) => {
              const cfg = STATUS_CONFIG[a.status];
              return (
                <div key={a.id} style={{ background: 'var(--c-surf)', border: `1px solid ${cfg.border}`, borderRadius: 10, padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem' }}>

                  {/* Infos */}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-text)', marginBottom: '0.2rem' }}>{a.zone}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)' }}>Créneau {a.slot} · {a.participants} enchérisseurs</div>
                  </div>

                  {/* Timer */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Temps restant</div>
                    <Timer seconds={a.secondsLeft} />
                  </div>

                  {/* Mise actuelle */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Mise actuelle</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: cfg.color }}>€ {a.currentBid}</div>
                  </div>

                  {/* Action */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 160 }}>
                    <span style={{ alignSelf: 'flex-end', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                      {cfg.label}
                    </span>
                    {a.status !== 'won' && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <input
                          type="number"
                          min={a.currentBid + 1}
                          placeholder={`> ${a.currentBid} €`}
                          value={bidInputs[a.id] || ''}
                          onChange={(e) => setBidInputs((p) => ({ ...p, [a.id]: e.target.value }))}
                          style={{ flex: 1, minWidth: 0, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.5rem', fontSize: '0.78rem', color: 'var(--c-text)', outline: 'none' }}
                        />
                        <button
                          onClick={() => placeBid(a.id)}
                          style={{ padding: '0.35rem 0.75rem', background: 'var(--c-pri)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Enchérir
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ── Enchères terminées ── */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
            Terminées
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {closed.map((a) => {
              const cfg = STATUS_CONFIG[a.status];
              return (
                <div key={a.id} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem', opacity: 0.7 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)', marginBottom: '0.15rem' }}>{a.zone}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>Créneau {a.slot} · {a.participants} enchérisseurs</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>Terminé</div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: cfg.color }}>€ {a.currentBid}</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, textAlign: 'center' }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
