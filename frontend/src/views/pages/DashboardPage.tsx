import { useState, useEffect, useCallback } from 'react';
import { authModel } from '../../models/authModel';
import { auctions as auctionsApi, bids as bidsApi } from '../../controllers/endpoints';
import { api } from '../../controllers/utils';
import type { Auction as BackendAuction } from '../../interfaces/Auction';
import type { Bid } from '../../interfaces/Bid';
import type { DeliverySlot } from '../../interfaces/DeliverySlot';
import { AuctionStatus } from '../../interfaces/Auction';

type DisplayStatus = 'leading' | 'outbid' | 'open' | 'won' | 'lost';

interface DisplayAuction {
  id: number;
  slot: string;
  endTime: string;
  currentBid: number;
  myBid: number | null;
  status: DisplayStatus;
}

function Timer({ endTime }: { endTime: string }) {
  const calc = () => Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
  const [s, setS] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setS(calc), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);
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
  leading: { label: 'En tête',     color: 'var(--c-success)',   bg: 'rgba(72,199,142,.1)',   border: 'rgba(72,199,142,.25)' },
  outbid:  { label: 'Surenchéri',  color: 'var(--c-danger)',    bg: 'rgba(255,77,77,.1)',     border: 'rgba(255,77,77,.25)' },
  open:    { label: 'Disponible',  color: 'var(--c-pri)',       bg: 'rgba(255,107,26,.08)',   border: 'rgba(255,107,26,.2)' },
  won:     { label: '🏆 Remporté', color: 'var(--c-gold-s)',   bg: 'rgba(255,193,7,.08)',    border: 'rgba(255,193,7,.2)' },
  lost:    { label: 'Perdu',       color: 'var(--c-text3)',    bg: 'rgba(255,255,255,.04)',  border: 'var(--c-border)' },
};

function fmtHour(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const min = d.getMinutes();
  return `${h}h${min > 0 ? String(min).padStart(2, '0') : ''}`;
}

function toIsoLocal(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

function buildAuction(
  a: BackendAuction,
  highest: Bid | null,
  userBidMap: Map<number, Bid>,
  userId: number | undefined,
): DisplayAuction {
  const now = Date.now();
  const endMs = a.endTime ? new Date(a.endTime).getTime() : now;
  const isActive = endMs > now && a.status !== AuctionStatus.CLOSED;
  const currentBid = highest?.amount ?? a.startPrice ?? 0;
  const slot = a.startTime && a.endTime ? `${fmtHour(a.startTime)}–${fmtHour(a.endTime)}` : '—';
  const myBidEntry = userBidMap.get(a.id);
  const myBid = myBidEntry?.amount ?? null;
  const isLeading = highest?.storeId === userId;

  let status: DisplayStatus;
  if (!isActive) {
    status = isLeading ? 'won' : 'lost';
  } else if (isLeading) {
    status = 'leading';
  } else if (myBid !== null) {
    status = 'outbid';
  } else {
    status = 'open';
  }

  return { id: a.id, slot, endTime: a.endTime ?? '', currentBid, myBid, status };
}

function nowLocalInput(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

interface NewAuctionForm {
  deliveryDate: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
  auctionStart: string;
  durationMin: string;
  startBid: string;
}

export default function DashboardPage() {
  const user = authModel.getUser();
  const storeName = user?.name || '—';
  const isAdmin = user?.role === 'ADMIN';

  const [auctions, setAuctions] = useState<DisplayAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidInputs, setBidInputs] = useState<Record<number, string>>({});
  const [bidErrors, setBidErrors] = useState<Record<number, string>>({});

  const [newAuction, setNewAuction] = useState<NewAuctionForm>({ deliveryDate: '', deliveryStartTime: '', deliveryEndTime: '', auctionStart: nowLocalInput(), durationMin: '5', startBid: '' });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const loadAuctions = useCallback(async () => {
    try {
      const list = await auctionsApi.all();
      const userBidMap = new Map<number, Bid>();
      if (user?.id) {
        const myBids = await bidsApi.byStore(user.id);
        for (const b of myBids) {
          const prev = userBidMap.get(b.auctionId);
          if (!prev || b.amount > prev.amount) {
            userBidMap.set(b.auctionId, b);
          }
        }
      }
      const withBids = await Promise.all(
        list.map(async (a) => {
          let highest: Bid | null = null;
          try { highest = await auctionsApi.highestBid(a.id); } catch { /* 404 = pas de mise */ }
          return buildAuction(a, highest, userBidMap, user?.id);
        })
      );
      setAuctions(withBids);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadAuctions();
    const id = setInterval(() => void loadAuctions(), 10000);
    return () => clearInterval(id);
  }, [loadAuctions]);

  const createAuction = async () => {
    if (!newAuction.deliveryDate) { setCreateError('La date de livraison est requise.'); return; }
    if (!newAuction.deliveryStartTime) { setCreateError('L\'heure de début de livraison est requise.'); return; }
    if (!newAuction.deliveryEndTime) { setCreateError('L\'heure de fin de livraison est requise.'); return; }
    if (!newAuction.startBid) { setCreateError('Le prix de départ est requis.'); return; }
    const startBid = parseFloat(newAuction.startBid);
    if (isNaN(startBid) || startBid <= 0) { setCreateError('Prix de départ invalide.'); return; }

    const deliveryStart = new Date(`${newAuction.deliveryDate}T${newAuction.deliveryStartTime}`);
    const deliveryEnd = new Date(`${newAuction.deliveryDate}T${newAuction.deliveryEndTime}`);
    const auctionBegin = newAuction.auctionStart ? new Date(newAuction.auctionStart) : new Date();
    const durationMin = parseInt(newAuction.durationMin) || 5;
    const auctionEnd = new Date(auctionBegin.getTime() + durationMin * 60 * 1000);

    setCreateError('');
    setCreating(true);
    try {
      const slot = await api.post<DeliverySlot>('/deliverySlots', {
        startTime: toIsoLocal(deliveryStart),
        endTime: toIsoLocal(deliveryEnd),
        capacity: 1,
        status: 'OPEN',
      });
      await api.post<BackendAuction>('/auctions', {
        startPrice: startBid,
        startTime: toIsoLocal(auctionBegin),
        endTime: toIsoLocal(auctionEnd),
        status: AuctionStatus.OPEN,
        deliverySlotId: slot.id,
      });
      setNewAuction({ deliveryDate: '', deliveryStartTime: '', deliveryEndTime: '', auctionStart: nowLocalInput(), durationMin: '5', startBid: '' });
      await loadAuctions();
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Erreur création');
    } finally {
      setCreating(false);
    }
  };

  const placeBid = async (a: DisplayAuction) => {
    const amount = parseFloat(bidInputs[a.id] ?? '');
    if (!amount || amount <= a.currentBid) {
      setBidErrors((p) => ({ ...p, [a.id]: `Montant doit être > ${a.currentBid} €` }));
      return;
    }
    if (!user?.id) return;
    setBidErrors((p) => ({ ...p, [a.id]: '' }));
    try {
      await bidsApi.create({ id: 0, auctionId: a.id, storeId: user.id, amount });
      setBidInputs((p) => ({ ...p, [a.id]: '' }));
      await loadAuctions();
    } catch (e: unknown) {
      setBidErrors((p) => ({ ...p, [a.id]: e instanceof Error ? e.message : 'Erreur mise' }));
    }
  };

  const active  = auctions.filter((a) => a.status === 'leading' || a.status === 'outbid' || a.status === 'open');
  const closed  = auctions.filter((a) => a.status === 'won' || a.status === 'lost');
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

        {/* ── Section Admin : Créer une enchère ── */}
        {isAdmin && (
          <div style={{ background: 'rgba(255,107,26,.06)', border: '1px solid rgba(255,107,26,.25)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-pri)', marginBottom: '0.75rem', fontWeight: 700 }}>
              Admin — Créer une enchère
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Créneau de livraison</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Date</label>
                <input type="date" value={newAuction.deliveryDate}
                  onChange={(e) => setNewAuction((p) => ({ ...p, deliveryDate: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Heure de début</label>
                <input type="time" value={newAuction.deliveryStartTime}
                  onChange={(e) => setNewAuction((p) => ({ ...p, deliveryStartTime: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Heure de fin</label>
                <input type="time" value={newAuction.deliveryEndTime}
                  onChange={(e) => setNewAuction((p) => ({ ...p, deliveryEndTime: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Enchère</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Début de l'enchère</label>
                <input type="datetime-local" value={newAuction.auctionStart}
                  onChange={(e) => setNewAuction((p) => ({ ...p, auctionStart: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Durée de l'enchère (min)</label>
                <input type="number" min={1} placeholder="5" value={newAuction.durationMin}
                  onChange={(e) => setNewAuction((p) => ({ ...p, durationMin: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Prix de départ (€)</label>
                <input type="number" min={1} placeholder="50" value={newAuction.startBid}
                  onChange={(e) => setNewAuction((p) => ({ ...p, startBid: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              <button onClick={() => void createAuction()} disabled={creating}
                style={{ padding: '0.45rem 1.1rem', background: creating ? 'var(--c-border)' : 'var(--c-pri)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: creating ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {creating ? '…' : '+ Créer'}
              </button>
            </div>
            {createError && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--c-danger)' }}>{createError}</div>}
          </div>
        )}

        {/* ── Stats rapides ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Enchères actives', value: active.length,   color: 'var(--c-pri)' },
            { label: 'En tête',          value: leading,          color: 'var(--c-success)' },
            { label: 'Surenchéri',       value: outbid,           color: 'var(--c-danger)' },
            { label: 'Solde disponible', value: `€ ${Number(user?.balance ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`, color: 'var(--c-text)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Loading / Error ── */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--c-text3)', padding: '3rem', fontSize: '0.85rem' }}>Chargement des enchères…</div>
        )}
        {error && (
          <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 8, padding: '1rem', fontSize: '0.82rem', color: 'var(--c-danger)', marginBottom: '1rem' }}>⚠ {error}</div>
        )}

        {/* ── Enchères en cours ── */}
        {!loading && active.length > 0 && (
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
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-text)', marginBottom: '0.2rem' }}>{`Enchère #${a.id}`}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)' }}>Créneau {a.slot}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Temps restant</div>
                      {a.endTime ? <Timer endTime={a.endTime} /> : <span style={{ color: 'var(--c-text3)' }}>—</span>}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Mise actuelle</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: cfg.color }}>€ {a.currentBid}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 170 }}>
                      <span style={{ alignSelf: 'flex-end', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      {a.status !== 'won' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input type="number" min={a.currentBid + 1} placeholder={`> ${a.currentBid} €`}
                              value={bidInputs[a.id] || ''}
                              onChange={(e) => setBidInputs((p) => ({ ...p, [a.id]: e.target.value }))}
                              style={{ flex: 1, minWidth: 0, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.5rem', fontSize: '0.78rem', color: 'var(--c-text)', outline: 'none' }}
                            />
                            <button onClick={() => void placeBid(a)}
                              style={{ padding: '0.35rem 0.75rem', background: 'var(--c-pri)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Enchérir
                            </button>
                          </div>
                          {bidErrors[a.id] && <div style={{ fontSize: '0.68rem', color: 'var(--c-danger)' }}>{bidErrors[a.id]}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && active.length === 0 && !error && (
          <div style={{ textAlign: 'center', color: 'var(--c-text3)', padding: '3rem', fontSize: '0.85rem', background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12 }}>
            Aucune enchère en cours pour le moment.
          </div>
        )}

        {/* ── Enchères terminées ── */}
        {!loading && closed.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
              Terminées
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {closed.map((a) => {
                const cfg = STATUS_CONFIG[a.status];
                return (
                  <div key={a.id} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem', opacity: 0.7 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)', marginBottom: '0.15rem' }}>{`Enchère #${a.id}`}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>Créneau {a.slot}</div>
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
        )}

      </div>
    </div>
  );
}
