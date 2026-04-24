import { useState, useEffect } from 'react';
import { authModel } from '../../models/authModel';
import { api } from '../../controllers/utils';
import type { Auction as BackendAuction } from '../../interfaces/Auction';
import type { Bid } from '../../interfaces/Bid';
import type { DeliverySlot } from '../../interfaces/DeliverySlot';
import { AuctionStatus } from '../../interfaces/Auction';
import { useAuctions } from '../../hooks/useAuctions';
import type { DisplayStatus } from '../../hooks/useAuctions';

const STATUS_CONFIG: Record<DisplayStatus, { label: string; color: string; bg: string; border: string }> = {
  leading: { label: 'En tête',     color: 'var(--c-success)',   bg: 'rgba(72,199,142,.1)',   border: 'rgba(72,199,142,.25)' },
  outbid:  { label: 'Surenchéri',  color: 'var(--c-danger)',    bg: 'rgba(255,77,77,.1)',     border: 'rgba(255,77,77,.25)'  },
  open:    { label: 'Disponible',  color: 'var(--c-pri)',       bg: 'rgba(255,107,26,.08)',   border: 'rgba(255,107,26,.2)'  },
  pending: { label: 'À venir',     color: 'var(--c-text3)',     bg: 'rgba(255,255,255,.04)',  border: 'var(--c-border)'      },
  won:     { label: '🏆 Remporté', color: 'var(--c-gold-s)',    bg: 'rgba(255,193,7,.08)',    border: 'rgba(255,193,7,.2)'   },
  lost:    { label: 'Perdu',       color: 'var(--c-text3)',     bg: 'rgba(255,255,255,.04)',  border: 'var(--c-border)'      },
};

function Timer({ endTime }: { endTime: string }) {
  const calc = () => Math.max(0, Math.floor((new Date(endTime + 'Z').getTime() - Date.now()) / 1000));
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

function CountDown({ startTime }: { startTime: string }) {
  const calc = () => Math.max(0, Math.floor((new Date(startTime + 'Z').getTime() - Date.now()) / 1000));
  const [s, setS] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setS(calc), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime]);
  if (s <= 0) return <span style={{ color: 'var(--c-text3)', fontSize: '0.75rem' }}>Bientôt</span>;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (
    <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--c-text3)', fontVariantNumeric: 'tabular-nums' }}>
      dans {h > 0 ? `${h}h ` : ''}{m > 0 ? `${m}m ` : ''}{String(sec).padStart(2, '0')}s
    </span>
  );
}

function toIsoLocal(date: Date): string {
  return date.toISOString().slice(0, 19);
}

function nowLocalInput(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

const FRENCH_REGIONS = [
  'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire',
  'Corse', 'Grand Est', 'Guadeloupe', 'Guyane', 'Hauts-de-France', 'Île-de-France',
  'La Réunion', 'Martinique', 'Mayotte', 'Normandie', 'Nouvelle-Aquitaine',
  'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur',
];

interface NewAuctionForm {
  deliveryDate: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
  auctionStart: string;
  durationMin: string;
  startBid: string;
  whaleOnly: boolean;
  region: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState(authModel.getUser());
  const isAdmin = user?.role === 'ADMIN';

  const { auctions, loading, error } = useAuctions();

  // Keep user state in sync with WS balance updates
  useEffect(() => {
    const onUpdate = () => setUser(authModel.getUser());
    window.addEventListener('user-updated', onUpdate);
    return () => window.removeEventListener('user-updated', onUpdate);
  }, []);

  const [bidInputs, setBidInputs] = useState<Record<number, string>>({});
  const [bidErrors, setBidErrors] = useState<Record<number, string>>({});

  const [newAuction, setNewAuction] = useState<NewAuctionForm>({
    deliveryDate: '', deliveryStartTime: '', deliveryEndTime: '',
    auctionStart: nowLocalInput(), durationMin: '5', startBid: '', whaleOnly: false, region: '',
  });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  const [filterDate,      setFilterDate]      = useState('');
  const [filterRegion,    setFilterRegion]    = useState('');
  const [filterMinAmount, setFilterMinAmount] = useState('');
  const [filterMaxAmount, setFilterMaxAmount] = useState('');
  const [filterStatus,    setFilterStatus]    = useState<'all' | 'active' | 'upcoming' | 'closed' | 'leading' | 'outbid'>('all');

  interface OutbidNotif { id: number; auctionId: number; newAmount: number; }
  const [notifs, setNotifs] = useState<OutbidNotif[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { auctionId, newAmount } = (e as CustomEvent<{ auctionId: number; newAmount: number }>).detail;
      const id = Date.now();
      setNotifs(prev => [...prev, { id, auctionId, newAmount }]);
      setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== id)), 6000);
    };
    window.addEventListener('auction-outbid', handler);
    return () => window.removeEventListener('auction-outbid', handler);
  }, []);

  const createAuction = async () => {
    if (!newAuction.deliveryDate)      { setCreateError('La date de livraison est requise.'); return; }
    if (!newAuction.deliveryStartTime) { setCreateError("L'heure de début est requise."); return; }
    if (!newAuction.deliveryEndTime)   { setCreateError("L'heure de fin est requise."); return; }
    if (!newAuction.startBid)          { setCreateError('Le prix de départ est requis.'); return; }
    const startBid = parseFloat(newAuction.startBid);
    if (isNaN(startBid) || startBid <= 0) { setCreateError('Prix de départ invalide.'); return; }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deliveryDay = new Date(newAuction.deliveryDate);
    deliveryDay.setHours(0, 0, 0, 0);
    if (deliveryDay <= today) { setCreateError('La date de livraison doit être strictement après aujourd\'hui.'); return; }

    const deliveryStart = new Date(`${newAuction.deliveryDate}T${newAuction.deliveryStartTime}`);
    const deliveryEnd   = new Date(`${newAuction.deliveryDate}T${newAuction.deliveryEndTime}`);
    const auctionBegin  = newAuction.auctionStart ? new Date(newAuction.auctionStart) : new Date();

    if (auctionBegin <= new Date()) { setCreateError("La date de début de l'enchère doit être strictement après maintenant."); return; }
    const durationMin   = parseInt(newAuction.durationMin) || 5;
    const auctionEnd    = new Date(auctionBegin.getTime() + durationMin * 60 * 1000);

    setCreateError('');
    setCreating(true);
    try {
      const slot = await api.post<DeliverySlot>('/deliverySlots', {
        startTime: toIsoLocal(deliveryStart),
        endTime:   toIsoLocal(deliveryEnd),
        capacity: 1,
        status: 'OPEN',
      });
      await api.post<BackendAuction>('/auctions', {
        startPrice:    startBid,
        startTime:     toIsoLocal(auctionBegin),
        endTime:       toIsoLocal(auctionEnd),
        status:        AuctionStatus.OPEN,
        deliverySlotId: slot.id,
        whaleOnly:     newAuction.whaleOnly,
        region:        newAuction.region || undefined,
      });
      setNewAuction({ deliveryDate: '', deliveryStartTime: '', deliveryEndTime: '', auctionStart: nowLocalInput(), durationMin: '5', startBid: '', whaleOnly: false, region: '' });
      // WS /topic/auctions push handles the list refresh automatically
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Erreur création');
    } finally {
      setCreating(false);
    }
  };

  const minBid = (currentBid: number) => Math.ceil(currentBid * 1.05 * 100) / 100;

  const placeBid = async (auctionId: number, currentBid: number) => {
    const amount = parseFloat(bidInputs[auctionId] ?? '');
    const min = minBid(currentBid);
    if (!amount || amount < min) {
      setBidErrors(p => ({ ...p, [auctionId]: `Minimum +5% — enchère min : ${min.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €` }));
      return;
    }
    if (!user?.id) return;
    setBidErrors(p => ({ ...p, [auctionId]: '' }));
    try {
      await api.post<Bid>('/bids', { auctionId, storeId: user.id, amount });
      setBidInputs(p => ({ ...p, [auctionId]: '' }));
      // WS /topic/bids + /queue/store/{id}/balance handle the display refresh
    } catch (e: unknown) {
      setBidErrors(p => ({ ...p, [auctionId]: e instanceof Error ? e.message : 'Erreur mise' }));
    }
  };

  const applyFilters = (list: typeof auctions) => list.filter(a => {
    if (filterDate      && a.slotDateIso !== filterDate) return false;
    if (filterRegion    && a.region !== filterRegion)    return false;
    if (filterMinAmount && a.currentBid < parseFloat(filterMinAmount)) return false;
    if (filterMaxAmount && a.currentBid > parseFloat(filterMaxAmount)) return false;
    return true;
  });

  const active   = applyFilters(auctions.filter(a => a.status === 'leading' || a.status === 'outbid' || a.status === 'open'));
  const upcoming = applyFilters(auctions.filter(a => a.status === 'pending'));
  const closed   = applyFilters(auctions.filter(a => a.status === 'won' || a.status === 'lost'));
  const leading  = auctions.filter(a => a.status === 'leading').length;
  const outbid   = auctions.filter(a => a.status === 'outbid').length;
  const hasFilters = !!(filterDate || filterRegion || filterMinAmount || filterMaxAmount || filterStatus !== 'all');

  const displayActive = filterStatus === 'leading' ? active.filter(a => a.status === 'leading')
                      : filterStatus === 'outbid'  ? active.filter(a => a.status === 'outbid')
                      : active;
  const showActive   = filterStatus === 'all' || filterStatus === 'active' || filterStatus === 'leading' || filterStatus === 'outbid';
  const showUpcoming = filterStatus === 'all' || filterStatus === 'upcoming';
  const showClosed   = filterStatus === 'all' || filterStatus === 'closed';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text3)', marginBottom: '0.3rem' }}>Tableau de bord</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--c-text)', margin: 0 }}>
            Bienvenue, <span style={{ color: 'var(--c-pri)' }}>{user?.name || '—'}</span>
          </h1>
        </div>

        {/* ── Section Admin ── */}
        {isAdmin && (
          <div style={{ background: 'rgba(255,107,26,.06)', border: '1px solid rgba(255,107,26,.25)', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-pri)', marginBottom: '0.75rem', fontWeight: 700 }}>
              Admin — Créer une enchère
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Créneau de livraison</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Date</label>
                <input type="date" value={newAuction.deliveryDate}
                  onChange={e => setNewAuction(p => ({ ...p, deliveryDate: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Heure de début</label>
                <input type="time" value={newAuction.deliveryStartTime}
                  onChange={e => setNewAuction(p => ({ ...p, deliveryStartTime: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Heure de fin</label>
                <input type="time" value={newAuction.deliveryEndTime}
                  onChange={e => setNewAuction(p => ({ ...p, deliveryEndTime: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Région</label>
                <select value={newAuction.region} onChange={e => setNewAuction(p => ({ ...p, region: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: newAuction.region ? 'var(--c-text)' : 'var(--c-text3)', outline: 'none' }}
                >
                  <option value="">— Aucune —</option>
                  {FRENCH_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Enchère</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Début de l'enchère</label>
                <input type="datetime-local" value={newAuction.auctionStart}
                  onChange={e => setNewAuction(p => ({ ...p, auctionStart: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Durée (min)</label>
                <input type="number" min={1} placeholder="5" value={newAuction.durationMin}
                  onChange={e => setNewAuction(p => ({ ...p, durationMin: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--c-text3)', display: 'block', marginBottom: '0.3rem' }}>Prix de départ (€)</label>
                <input type="number" min={1} placeholder="50" value={newAuction.startBid}
                  onChange={e => setNewAuction(p => ({ ...p, startBid: e.target.value }))}
                  style={{ width: '100%', boxSizing: 'border-box', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.45rem 0.65rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              <button onClick={() => void createAuction()} disabled={creating}
                style={{ padding: '0.45rem 1.1rem', background: creating ? 'var(--c-border)' : 'var(--c-pri)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: creating ? 'default' : 'pointer', whiteSpace: 'nowrap' }}
              >
                {creating ? '…' : '+ Créer'}
              </button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', cursor: 'pointer', width: 'fit-content' }}>
              <input
                type="checkbox"
                checked={newAuction.whaleOnly}
                onChange={e => setNewAuction(p => ({ ...p, whaleOnly: e.target.checked }))}
                style={{ accentColor: 'var(--c-whale-s)', width: 15, height: 15, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--c-whale-s)', fontWeight: 700 }}>Réservé Pass Whale</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>— seuls les détenteurs du Pass Whale peuvent enchérir</span>
            </label>
            {createError && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--c-danger)' }}>{createError}</div>}
          </div>
        )}

        {/* ── Stats ── */}
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

        {/* ── Filtres ── */}
        {!loading && (
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Pills état */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {([
                { key: 'all',      label: 'Tout',        dot: null },
                { key: 'active',   label: 'En cours',    dot: 'var(--c-success)' },
                { key: 'leading',  label: 'En tête',     dot: 'var(--c-success)' },
                { key: 'outbid',   label: 'Surenchéri',  dot: 'var(--c-danger)' },
                { key: 'upcoming', label: 'À venir',     dot: 'var(--c-text3)' },
                { key: 'closed',   label: 'Terminées',   dot: 'var(--c-pri)' },
              ] as const).map(({ key, label, dot }) => {
                const sel = filterStatus === key;
                return (
                  <button key={key} onClick={() => setFilterStatus(key)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.3rem 0.8rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', border: '1px solid',
                    borderColor: sel ? 'var(--c-pri)' : 'var(--c-border)',
                    background: sel ? 'rgba(255,107,26,.12)' : 'var(--c-bg)',
                    color: sel ? 'var(--c-pri)' : 'var(--c-text3)',
                  }}>
                    {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />}
                    {label}
                  </button>
                );
              })}
            </div>
            {/* Autres filtres */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>Date de livraison</div>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                  style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: filterDate ? 'var(--c-text)' : 'var(--c-text3)', outline: 'none', colorScheme: 'dark' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>Région</div>
                <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
                  style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: filterRegion ? 'var(--c-text)' : 'var(--c-text3)', outline: 'none' }}
                >
                  <option value="">Toutes les régions</option>
                  {FRENCH_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>Mise min (€)</div>
                <input type="number" min={0} placeholder="0" value={filterMinAmount} onChange={e => setFilterMinAmount(e.target.value)}
                  style={{ width: 90, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>Mise max (€)</div>
                <input type="number" min={0} placeholder="∞" value={filterMaxAmount} onChange={e => setFilterMaxAmount(e.target.value)}
                  style={{ width: 90, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.6rem', fontSize: '0.8rem', color: 'var(--c-text)', outline: 'none' }}
                />
              </div>
              {hasFilters && (
                <button onClick={() => { setFilterDate(''); setFilterRegion(''); setFilterMinAmount(''); setFilterMaxAmount(''); setFilterStatus('all'); }}
                  style={{ padding: '0.35rem 0.875rem', background: 'transparent', border: '1px solid var(--c-border)', borderRadius: 6, color: 'var(--c-text3)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Loading / Error ── */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--c-text3)', padding: '3rem', fontSize: '0.85rem' }}>Chargement…</div>
        )}
        {error && (
          <div style={{ background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 8, padding: '1rem', fontSize: '0.82rem', color: 'var(--c-danger)', marginBottom: '1rem' }}>⚠ {error}</div>
        )}

        {/* ── Enchères en cours ── */}
        {!loading && showActive && displayActive.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-success)', display: 'inline-block', boxShadow: '0 0 6px var(--c-success)' }} />
              {filterStatus === 'leading' ? 'En tête' : filterStatus === 'outbid' ? 'Surenchéri' : 'En cours'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {displayActive.map(a => {
                const cfg = STATUS_CONFIG[a.status];
                const isLeading = a.status === 'leading';
                const isWhaleBlocked = a.whaleOnly && !user?.whalePass;
                const bidDisabled = isLeading || isWhaleBlocked;
                return (
                  <div key={a.id} style={{ background: 'var(--c-surf)', border: `1px solid ${a.whaleOnly ? 'rgba(99,179,237,.35)' : cfg.border}`, borderRadius: 10, padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-text)' }}>Enchère #{a.id}</span>
                        {a.whaleOnly && (
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 20, background: 'rgba(99,179,237,.12)', border: '1px solid rgba(99,179,237,.3)', color: 'var(--c-whale-s)' }}>
                            Pass Whale
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--c-text3)' }}>
                        Livraison {a.slotDate && <><span style={{ color: 'var(--c-text2)', fontWeight: 600 }}>{a.slotDate}</span> · </>}{a.slot}
                        {a.region && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--c-text3)', background: 'rgba(255,255,255,.05)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.1rem 0.45rem' }}>{a.region}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Temps restant</div>
                      {a.auctionEnd ? <Timer endTime={a.auctionEnd} /> : <span style={{ color: 'var(--c-text3)' }}>—</span>}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--c-text3)', marginBottom: '0.15rem' }}>Mise actuelle</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: cfg.color }}>€ {a.currentBid}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 170 }}>
                      <span style={{ alignSelf: 'flex-end', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
                        {cfg.label}
                      </span>
                      {isWhaleBlocked ? (
                        <div style={{ fontSize: '0.72rem', color: 'var(--c-whale-s)', textAlign: 'center', padding: '0.4rem 0.5rem', background: 'rgba(99,179,237,.08)', border: '1px solid rgba(99,179,237,.2)', borderRadius: 6 }}>
                          Réservé Pass Whale
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <input
                              type="number"
                              min={minBid(a.currentBid)}
                              step="0.01"
                              placeholder={`min ${minBid(a.currentBid).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`}
                              disabled={bidDisabled}
                              value={bidInputs[a.id] || ''}
                              onChange={e => setBidInputs(p => ({ ...p, [a.id]: e.target.value }))}
                              style={{ flex: 1, minWidth: 0, background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.35rem 0.5rem', fontSize: '0.78rem', color: bidDisabled ? 'var(--c-text3)' : 'var(--c-text)', outline: 'none', opacity: bidDisabled ? 0.5 : 1 }}
                            />
                            <button
                              onClick={() => void placeBid(a.id, a.currentBid)}
                              disabled={bidDisabled}
                              style={{ padding: '0.35rem 0.75rem', background: bidDisabled ? 'var(--c-border)' : 'var(--c-pri)', border: 'none', borderRadius: 6, color: bidDisabled ? 'var(--c-text3)' : '#fff', fontWeight: 700, fontSize: '0.75rem', cursor: bidDisabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
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

        {!loading && showActive && displayActive.length === 0 && !error && (
          <div style={{ textAlign: 'center', color: 'var(--c-text3)', padding: '3rem', fontSize: '0.85rem', background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 12 }}>
            Aucune enchère en cours.
          </div>
        )}

        {/* ── À venir ── */}
        {!loading && showUpcoming && upcoming.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
              À venir
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {upcoming.map(a => (
                <div key={a.id} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem', opacity: 0.7 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)', marginBottom: '0.15rem' }}>Enchère #{a.id}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>
                      Livraison {a.slotDate && <><span style={{ color: 'var(--c-text2)', fontWeight: 600 }}>{a.slotDate}</span> · </>}{a.slot}
                      {a.region && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--c-text3)', background: 'rgba(255,255,255,.05)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.1rem 0.45rem' }}>{a.region}</span>}
                    </div>
                  </div>
                  <div><CountDown startTime={a.auctionStart} /></div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--c-text3)' }}>À partir de € {a.startPrice}</div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: 20, background: STATUS_CONFIG.pending.bg, border: `1px solid ${STATUS_CONFIG.pending.border}`, color: STATUS_CONFIG.pending.color }}>
                    {STATUS_CONFIG.pending.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Terminées ── */}
        {!loading && showClosed && closed.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
              Terminées
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {closed.map(a => {
                const cfg = STATUS_CONFIG[a.status];
                return (
                  <div key={a.id} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.875rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '1.5rem', opacity: 0.7 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--c-text)', marginBottom: '0.15rem' }}>Enchère #{a.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>
                        Livraison {a.slotDate && <><span style={{ color: 'var(--c-text2)', fontWeight: 600 }}>{a.slotDate}</span> · </>}{a.slot}
                        {a.region && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--c-text3)', background: 'rgba(255,255,255,.05)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '0.1rem 0.45rem' }}>{a.region}</span>}
                      </div>
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

      {/* ── Toast stack surenchères ── */}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '0.625rem', pointerEvents: 'none' }}>
        {notifs.map(n => (
          <div key={n.id} style={{
            pointerEvents: 'auto',
            background: 'var(--c-surf)',
            border: '1px solid rgba(255,77,77,.4)',
            borderLeft: '4px solid var(--c-danger)',
            borderRadius: 8,
            padding: '0.75rem 1rem',
            minWidth: 280, maxWidth: 340,
            boxShadow: '0 8px 24px rgba(0,0,0,.5)',
            animation: 'toast-in 0.3s ease both',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '1rem' }}>🔴</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--c-danger)' }}>Vous avez été surenchéri !</span>
              <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--c-text3)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}
              >×</button>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--c-text2)' }}>
              Enchère <strong style={{ color: 'var(--c-text)' }}>#{n.auctionId}</strong> — nouvelle mise : <strong style={{ color: 'var(--c-danger)' }}>€ {n.newAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: 'var(--c-danger)', opacity: 0.5, borderRadius: '0 0 0 8px', animation: 'toast-progress 6s linear both' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
