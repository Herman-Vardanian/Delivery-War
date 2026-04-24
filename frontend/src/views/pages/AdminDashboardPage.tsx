import { useState } from 'react';

const FRENCH_REGIONS = [
  'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire',
  'Corse', 'Grand Est', 'Guadeloupe', 'Guyane', 'Hauts-de-France', 'Île-de-France',
  'La Réunion', 'Martinique', 'Mayotte', 'Normandie', 'Nouvelle-Aquitaine',
  'Occitanie', 'Pays de la Loire', "Provence-Alpes-Côte d'Azur",
];

interface AdminAuction {
  id: number;
  zone: string;
  slot: string;
  region: string;
  currentBid: number;
  participants: number;
  secondsLeft: number;
  status: 'active' | 'closed';
  winner: string;
  whaleOnly: boolean;
}

interface MockStore {
  id: string;
  email: string;
  balance: number;
  totalSpent: number;
  whalePass: boolean;
  bids: number;
}

const MOCK_AUCTIONS: AdminAuction[] = [
  { id: 1, zone: 'Paris 18e', slot: '09h–11h', region: 'Île-de-France',           currentBid: 137, participants: 4, secondsLeft: 142, status: 'active',  winner: 'PARIS-NORD-07',      whaleOnly: false },
  { id: 2, zone: 'Paris 11e', slot: '14h–16h', region: 'Île-de-France',           currentBid: 182, participants: 6, secondsLeft: 38,  status: 'active',  winner: 'BOULANGERIE-DUPONT', whaleOnly: true  },
  { id: 3, zone: 'Paris 5e',  slot: '10h–12h', region: 'Île-de-France',           currentBid: 95,  participants: 3, secondsLeft: 310, status: 'active',  winner: 'FROMAGERIE-LEFEBVRE',whaleOnly: false },
  { id: 4, zone: 'Lyon 2e',   slot: '16h–18h', region: 'Auvergne-Rhône-Alpes',   currentBid: 210, participants: 8, secondsLeft: 72,  status: 'active',  winner: 'TRAITEUR-AZIZ',      whaleOnly: false },
  { id: 5, zone: 'Bordeaux',  slot: '08h–10h', region: 'Nouvelle-Aquitaine',      currentBid: 88,  participants: 2, secondsLeft: 0,   status: 'closed',  winner: 'PARIS-NORD-07',      whaleOnly: false },
  { id: 6, zone: 'Marseille', slot: '13h–15h', region: "Provence-Alpes-Côte d'Azur", currentBid: 165, participants: 5, secondsLeft: 0, status: 'closed', winner: 'ÉPICERIE-MARTIN',   whaleOnly: true  },
];

const MOCK_STORES: MockStore[] = [
  { id: 'PARIS-NORD-07',       email: 'contact@paris-nord.fr',    balance: 450,  totalSpent: 1240, whalePass: true,  bids: 3 },
  { id: 'BOULANGERIE-DUPONT',  email: 'dupont@boulangerie.fr',    balance: 320,  totalSpent: 3870, whalePass: true,  bids: 5 },
  { id: 'FROMAGERIE-LEFEBVRE', email: 'claire@fromagerie.fr',     balance: 180,  totalSpent: 2150, whalePass: false, bids: 2 },
  { id: 'TRAITEUR-AZIZ',       email: 'aziz@traiteur.fr',         balance: 95,   totalSpent: 980,  whalePass: false, bids: 4 },
  { id: 'ÉPICERIE-MARTIN',     email: 'samir@epicerie-martin.fr', balance: 760,  totalSpent: 1650, whalePass: true,  bids: 1 },
];

const ZONES = ['Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e', 'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e', 'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e', 'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e'];
const SLOTS = ['08h–10h', '09h–11h', '10h–12h', '11h–13h', '12h–14h', '13h–15h', '14h–16h', '15h–17h', '16h–18h', '17h–19h'];

const TAB_STYLE = (active: boolean) => ({
  padding: '0.5rem 1.25rem',
  borderRadius: 6,
  border: 'none',
  background: active ? 'rgba(255,107,26,.15)' : 'transparent',
  color: active ? 'var(--c-pri)' : 'var(--c-text3)',
  fontWeight: 700,
  fontSize: '0.8rem',
  cursor: 'pointer',
  letterSpacing: '0.04em',
  transition: 'all .15s',
});

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<'auctions' | 'stores'>('auctions');
  const [auctions, setAuctions] = useState<AdminAuction[]>(MOCK_AUCTIONS);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAuction, setNewAuction] = useState({ zone: ZONES[0]!, slot: SLOTS[0]!, startBid: '', whaleOnly: false, region: '' });

  const activeCount   = auctions.filter((a) => a.status === 'active').length;
  const whaleCount    = MOCK_STORES.filter((s) => s.whalePass).length;
  const totalRevenue  = MOCK_STORES.reduce((s, st) => s + st.totalSpent, 0);

  const createAuction = () => {
    if (!newAuction.startBid) return;
    setAuctions((prev) => [...prev, {
      id: Date.now(),
      zone: newAuction.zone,
      slot: newAuction.slot,
      region: newAuction.region,
      currentBid: parseFloat(newAuction.startBid),
      participants: 0,
      secondsLeft: 600,
      status: 'active' as const,
      winner: '—',
      whaleOnly: newAuction.whaleOnly,
    }]);
    setNewAuction({ zone: ZONES[0]!, slot: SLOTS[0]!, startBid: '', whaleOnly: false, region: '' });
    setShowNewForm(false);
  };

  const closeAuction = (id: number) => {
    setAuctions((prev) => prev.map((a) => a.id === id ? { ...a, status: 'closed' as const, secondsLeft: 0 } : a));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-pri)', marginBottom: '0.3rem' }}>Administration</div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--c-text)', margin: 0 }}>Dashboard Admin</h1>
          </div>
          <span style={{ background: 'rgba(255,107,26,.12)', border: '1px solid rgba(255,107,26,.3)', color: 'var(--c-pri)', borderRadius: 20, padding: '0.3rem 0.875rem', fontSize: '0.72rem', fontWeight: 700 }}>
            ADMIN
          </span>
        </div>

        {/* ── Stats globales ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.75rem' }}>
          {[
            { label: 'Enchères actives',  value: activeCount,          color: 'var(--c-success)' },
            { label: 'Magasins inscrits', value: MOCK_STORES.length,   color: 'var(--c-text)' },
            { label: 'Pass Whale actifs', value: whaleCount,            color: 'var(--c-whale-s)' },
            { label: 'Volume total',      value: `€ ${totalRevenue.toLocaleString('fr-FR')}`, color: 'var(--c-pri)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '0.25rem', width: 'fit-content' }}>
          <button style={TAB_STYLE(tab === 'auctions')} onClick={() => setTab('auctions')}>Enchères</button>
          <button style={TAB_STYLE(tab === 'stores')}   onClick={() => setTab('stores')}>Magasins</button>
        </div>

        {/* ── TAB : Enchères ── */}
        {tab === 'auctions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-text2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {auctions.filter((a) => a.status === 'active').length} enchères actives · Volume en cours : € {auctions.filter((a) => a.status === 'active').reduce((s, a) => s + a.currentBid, 0).toLocaleString('fr-FR')}
              </div>
              <button
                onClick={() => setShowNewForm((v) => !v)}
                style={{ padding: '0.45rem 1rem', background: 'var(--c-pri)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
              >
                + Nouvelle enchère
              </button>
            </div>

            {/* Formulaire nouvelle enchère */}
            {showNewForm && (
              <div style={{ background: 'var(--c-surf)', border: '1px solid rgba(255,107,26,.3)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Zone</div>
                    <select
                      value={newAuction.zone}
                      onChange={(e) => setNewAuction((p) => ({ ...p, zone: e.target.value }))}
                      style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                    >
                      {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Créneau</div>
                    <select
                      value={newAuction.slot}
                      onChange={(e) => setNewAuction((p) => ({ ...p, slot: e.target.value }))}
                      style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none' }}
                    >
                      {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mise de départ (€)</div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex. 50"
                      value={newAuction.startBid}
                      onChange={(e) => setNewAuction((p) => ({ ...p, startBid: e.target.value }))}
                      style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: 'var(--c-text)', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--c-text3)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Région</div>
                    <select
                      value={newAuction.region}
                      onChange={(e) => setNewAuction((p) => ({ ...p, region: e.target.value }))}
                      style={{ width: '100%', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.82rem', color: newAuction.region ? 'var(--c-text)' : 'var(--c-text3)', outline: 'none' }}
                    >
                      <option value="">— Aucune —</option>
                      {FRENCH_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={createAuction}
                    style={{ padding: '0.5rem 1.25rem', background: 'var(--c-success)', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Créer
                  </button>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem', cursor: 'pointer', width: 'fit-content' }}>
                  <input
                    type="checkbox"
                    checked={newAuction.whaleOnly}
                    onChange={(e) => setNewAuction((p) => ({ ...p, whaleOnly: e.target.checked }))}
                    style={{ accentColor: 'var(--c-whale-s)', width: 15, height: 15, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--c-whale-s)', fontWeight: 700 }}>Réservé Pass Whale</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-text3)' }}>— seuls les détenteurs du Pass Whale peuvent enchérir</span>
                </label>
              </div>
            )}

            {/* Table enchères */}
            <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                    {['Zone', 'Région', 'Créneau', 'Mise actuelle', 'Enchérisseurs', 'Temps', 'En tête', 'Accès', 'Statut', ''].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-text3)', fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auctions.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: i < auctions.length - 1 ? '1px solid var(--c-border)' : 'none', opacity: a.status === 'closed' ? 0.55 : 1 }}>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--c-text)' }}>{a.zone}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.75rem', color: 'var(--c-text3)' }}>{a.region || '—'}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--c-text2)' }}>{a.slot}</td>
                      <td style={{ padding: '0.875rem 1rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--c-pri)' }}>€ {a.currentBid}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: 'var(--c-text2)', textAlign: 'center' }}>{a.participants}</td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.8rem', color: a.secondsLeft < 60 && a.secondsLeft > 0 ? 'var(--c-danger)' : 'var(--c-text2)' }}>
                        {a.status === 'closed' ? '—' : `${Math.floor(a.secondsLeft / 60)}m ${a.secondsLeft % 60}s`}
                      </td>
                      <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--c-text2)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.winner}</td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {a.whaleOnly ? (
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 20, background: 'rgba(99,179,237,.1)', border: '1px solid rgba(99,179,237,.25)', color: 'var(--c-whale-s)', whiteSpace: 'nowrap' }}>
                            Pass Whale
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.62rem', color: 'var(--c-text3)' }}>Tous</span>
                        )}
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20,
                          background: a.status === 'active' ? 'rgba(72,199,142,.1)' : 'rgba(255,255,255,.05)',
                          border: `1px solid ${a.status === 'active' ? 'rgba(72,199,142,.3)' : 'var(--c-border)'}`,
                          color: a.status === 'active' ? 'var(--c-success)' : 'var(--c-text3)',
                        }}>
                          {a.status === 'active' ? 'Active' : 'Terminée'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1rem' }}>
                        {a.status === 'active' && (
                          <button
                            onClick={() => closeAuction(a.id)}
                            style={{ padding: '0.25rem 0.625rem', background: 'rgba(255,77,77,.1)', border: '1px solid rgba(255,77,77,.25)', borderRadius: 5, color: 'var(--c-danger)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Clore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB : Magasins ── */}
        {tab === 'stores' && (
          <div style={{ background: 'var(--c-surf)', border: '1px solid var(--c-border)', borderRadius: 10, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--c-border)' }}>
                  {['Identifiant', 'Email', 'Solde', 'Total dépensé', 'Plan', 'Enchères actives'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--c-text3)', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_STORES.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < MOCK_STORES.length - 1 ? '1px solid var(--c-border)' : 'none' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: 'var(--c-text)', letterSpacing: '0.03em' }}>{s.id}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: 'var(--c-text3)' }}>{s.email}</td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, fontSize: '0.85rem', color: 'var(--c-success)' }}>€ {s.balance}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--c-text2)' }}>€ {s.totalSpent.toLocaleString('fr-FR')}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {s.whalePass ? (
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 20, background: 'rgba(99,179,237,.1)', border: '1px solid rgba(99,179,237,.25)', color: 'var(--c-whale-s)' }}>
                          Whale
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', color: 'var(--c-text3)', padding: '0.2rem 0.6rem', borderRadius: 20, background: 'rgba(255,255,255,.04)', border: '1px solid var(--c-border)' }}>
                          Gratuit
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: 'var(--c-text2)', textAlign: 'center' }}>{s.bids}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
