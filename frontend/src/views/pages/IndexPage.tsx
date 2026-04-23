import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TrucksBg from '../components/TrucksBg';

export default function IndexPage() {
  const auctionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let auctions = 1247;
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 9) - 3;
      auctions = Math.max(1200, auctions + delta);
      if (auctionsRef.current) auctionsRef.current.textContent = auctions.toLocaleString('fr-FR');
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* ── BG ── */}
      <div className="bg-fixed">
        <div className="bg-grid" />
        <div className="bg-glow-top" />
        <div className="bg-glow-mid" />
        <TrucksBg />
      </div>

      {/* ── NAV ── */}
      <nav className="nav">
        <a className="nav-logo" href="#">Delivery <span>War</span></a>
        <div className="nav-links">
          <a className="nav-link" href="#how">Comment ça marche</a>
          <a className="nav-link" href="#features">Fonctionnalités</a>
          <a className="nav-link" href="#plans">Tarifs</a>
        </div>
        <div className="nav-ctas">
          <Link className="btn-nav-ghost" to="/login">Connexion</Link>
          <Link className="btn-nav-primary" to="/register">Commencer</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <div className="live-dot" />
          Plateforme d&apos;enchères en temps réel
        </div>
        <h1 className="hero-title">
          <span className="line-1">Delivery</span>
          <span className="line-2">War</span>
        </h1>
        <p className="hero-sub">
          Enchérissez sur des créneaux de livraison en temps réel. Surenchérissez vos concurrents, remportez les meilleurs créneaux, dominez votre zone.
        </p>
        <div className="hero-ctas">
          <Link className="btn-hero-primary" to="/register">
            Créer mon compte <span>→</span>
          </Link>
          <Link className="btn-hero-ghost" to="/login">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Connexion
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num" ref={auctionsRef}>1 247</div>
            <div className="hero-stat-label">Enchères actives</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num green">384</div>
            <div className="hero-stat-label">Magasins inscrits</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num blue">2 840</div>
            <div className="hero-stat-label">Créneaux ce mois</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">€ 307K</div>
            <div className="hero-stat-label">Volume mensuel</div>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-mouse" />
          <span>Défiler</span>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-section">
        <div className="ticker-wrap">
          {[1, 2].map((k) => (
            <span key={k} style={{ display: 'contents' }}>
              <span className="ticker-item orange"><div className="ticker-dot" style={{ background: 'var(--c-pri)' }} />BOULANGERIE DUPONT remporte Paris 18e 09h–11h — <strong>€ 137</strong></span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item green"><div className="ticker-dot" style={{ background: 'var(--c-success)' }} />Nouveau créneau disponible — Zone Sud Paris 13e 14h–16h</span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item whale"><div className="ticker-dot" style={{ background: 'var(--c-whale-s)' }} />🐋 ÉPICERIE MARTIN active son Pass Whale — créneau VIP</span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item gold"><div className="ticker-dot" style={{ background: 'var(--c-gold-s)' }} />🕊️ Classement Pigeon d&apos;Or mis à jour — DUPONT en tête</span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item red"><div className="ticker-dot" style={{ background: 'var(--c-danger)' }} />FROMAGERIE LEFEBVRE surenchéri — <strong>€ 182</strong> par TRAITEUR AZIZ</span>
              <span className="ticker-sep">◆</span>
              <span className="ticker-item orange"><div className="ticker-dot" style={{ background: 'var(--c-pri)' }} />Timer critique — Créneau Paris 11e 16h–18h : 00:08 restants</span>
              <span className="ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section-how" id="how">
        <div className="section-eyebrow">Comment ça marche</div>
        <h2 className="section-title">Enchérir en <span>4 étapes</span></h2>
        <p className="section-sub">Simple, rapide, intense. Chaque créneau est une bataille. Voici comment se déroule une enchère.</p>
        <div className="how-grid">
          {[
            { cls: 'hc-1', num: '01', icon: '📦', title: 'Créneau disponible', desc: 'Un créneau de livraison s\'ouvre sur la plateforme. Tous les magasins de la zone reçoivent une notification en temps réel.' },
            { cls: 'hc-2', num: '02', icon: '⚡', title: 'Enchère en cours', desc: 'Placez votre offre. Les concurrents surenchérissent. Le montant monte, le timer tourne. L\'intensité monte.' },
            { cls: 'hc-3', num: '03', icon: '🏆', title: 'Créneau remporté', desc: 'Le plus offrant au timer final remporte le créneau. La tournée est confirmée instantanément dans votre tableau de bord.' },
            { cls: 'hc-4', num: '04', icon: '🐢', title: 'File Tortue si perdu', desc: 'Pas de chance ? Vous êtes automatiquement placé en file Tortue avec un petit camion. Délai +2h, mais vous livrez quand même.' },
          ].map(({ cls, num, icon, title, desc }) => (
            <div key={num} className={`how-card ${cls}`}>
              <div className="how-num">{num}</div>
              <span className="how-icon">{icon}</span>
              <div className="how-title">{title}</div>
              <p className="how-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section-features" id="features">
        <div className="features-inner">
          <div className="section-eyebrow">Fonctionnalités</div>
          <h2 className="section-title">Tout ce qu&apos;il vous faut pour <span>dominer</span></h2>
          <p className="section-sub">Des outils puissants pour enchérir plus vite, mieux, et avec une longueur d&apos;avance sur vos concurrents.</p>
          <div className="features-grid">
            {[
              { wrap: 'fc-orange', icon: '⚡', title: 'Enchères temps réel', desc: 'Mises à jour instantanées, timers en direct, notifications push à chaque surenchère. Zéro latence, zéro excuse.' },
              { wrap: 'fc-green',  icon: '🏆', title: 'Classement Pigeon d\'Or', desc: 'Les magasins qui dépensent le plus grimpent au classement. Podium, médailles, et prestige mensuel.' },
              { wrap: 'fc-red',    icon: '🚨', title: 'Surenchère instantanée', desc: 'Vous avez été dépassé ? Riposter en un clic. Montant automatiquement pré-rempli au-dessus du concurrent.' },
              { wrap: 'fc-blue',   icon: '📊', title: 'Tableau de bord complet', desc: 'Historique d\'enchères, stats de dépenses, créneaux remportés, progression du classement. Tout en un.' },
            ].map(({ wrap, icon, title, desc }) => (
              <div key={title} className="feature-card">
                <div className={`fc-icon-wrap ${wrap}`}>{icon}</div>
                <div className="fc-content">
                  <div className="fc-title">{title}</div>
                  <p className="fc-desc">{desc}</p>
                </div>
              </div>
            ))}
            <div className="feature-card highlight">
              <div className="fc-icon-wrap fc-whale" style={{ width: 52, height: 52, fontSize: '1.6rem' }}>🐋</div>
              <div className="fc-content">
                <div className="fc-title" style={{ color: 'var(--c-whale-s)', fontSize: '1.15rem' }}>Pass Whale — Accès VIP exclusif</div>
                <p className="fc-desc">Créneaux réservés inaccessibles aux comptes Gratuit. Jamais en file Tortue. Camion prioritaire. Support dédié 24/7. Pour ceux qui ne transigent pas avec la livraison.</p>
              </div>
              <Link className="btn-plan-whale btn-plan" to="/register" style={{ width: 'auto', padding: '0.6rem 1.5rem', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>🐋 Activer le Pass</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="section-plans" id="plans">
        <div className="section-eyebrow">Tarifs</div>
        <h2 className="section-title">Choisissez votre <span>arsenal</span></h2>
        <p className="section-sub">Deux niveaux de puissance. Upgradeables à tout moment. Résiliables sans préavis.</p>
        <div className="plans-grid">
          <div className="plan-card-landing">
            <span className="plan-icon">🐢</span>
            <div className="plan-name-lg" style={{ color: 'var(--c-turtle)' }}>Gratuit</div>
            <div className="plan-price-lg">0 €</div>
            <div className="plan-period">Pour toujours</div>
            <div className="plan-divider" />
            <ul className="plan-features-list">
              <li><span className="pf-check green">✓</span> File Tortue si enchère perdue</li>
              <li><span className="pf-check muted">✗</span> <span className="pf-muted">Créneaux VIP inaccessibles</span></li>
              <li><span className="pf-check muted">✗</span> <span className="pf-muted">Pas de priorité file</span></li>
            </ul>
            <Link className="btn-plan btn-plan-ghost" to="/register">Commencer gratuitement</Link>
          </div>
          <div className="plan-card-landing whale-plan">
            <div className="plan-badge-top whale">🐋 VIP</div>
            <span className="plan-icon" style={{ marginTop: '1.25rem' }}>🐋</span>
            <div className="plan-name-lg" style={{ color: 'var(--c-whale-s)' }}>Pass Whale</div>
            <div className="plan-price-lg" style={{ color: 'var(--c-whale-s)' }}>199 €</div>
            <div className="plan-period">/ mois · Essai 14 jours gratuits</div>
            <div className="plan-divider" />
            <ul className="plan-features-list">
              <li><span className="pf-check whale">✓</span> Créneaux exclusifs VIP</li>
              <li><span className="pf-check whale">✓</span> Camion prioritaire garanti</li>
              <li><span className="pf-check whale">✓</span> Dashboard avancé temps réel</li>
              <li><span className="pf-check whale">✓</span> Support dédié 24/7</li>
            </ul>
            <Link className="btn-plan btn-plan-whale" to="/register">🐋 Activer le Pass Whale</Link>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="section-proof">
        <div className="section-eyebrow">Témoignages</div>
        <h2 className="section-title">Ils <span>gagnent</span> leurs créneaux</h2>
        <p className="section-sub" style={{ marginBottom: '2.5rem' }}>Plus de 380 magasins font confiance à Delivery War pour leurs livraisons quotidiennes.</p>
        <div className="proof-grid">
          {[
            { avatar: '🥐', quote: 'On a réduit nos délais de livraison de 40% depuis qu\'on utilise Delivery War. Le Pass Whale c\'est indispensable pour nous.', name: 'Jean Dupont', shop: 'Boulangerie Dupont · Paris 18e', badge: 'tb-whale', badgeLabel: '🐋 Whale' },
            { avatar: '🧀', quote: 'L\'adrénaline des enchères c\'est vraiment addictif. Et quand on remporte un créneau au dernier moment, quelle satisfaction !', name: 'Claire Lefebvre', shop: 'Fromagerie Lefebvre · Paris 5e', badge: 'tb-whale', badgeLabel: '🐋 Whale' },
            { avatar: '🛒', quote: 'Le classement Pigeon d\'Or nous motive à enchérir plus. On veut absolument rester dans le Top 3 ce mois-ci !', name: 'Samir Martin', shop: 'Épicerie Martin · Paris 11e', badge: 'tb-gold', badgeLabel: '🕊️ Pigeon #2' },
          ].map(({ avatar, quote, name, shop, badge, badgeLabel }) => (
            <div key={name} className="testimonial">
              <p className="test-quote">{quote}</p>
              <div className="test-author">
                <div className="test-avatar">{avatar}</div>
                <div><div className="test-name">{name}</div><div className="test-shop">{shop}</div></div>
                <span className={`test-badge ${badge}`}>{badgeLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-cta">
        <h2 className="cta-title">Prêt à<br />enchérir <span>?</span></h2>
        <p className="cta-sub">Rejoignez 384 magasins qui se battent chaque jour pour les meilleurs créneaux de livraison.</p>
        <div className="cta-buttons">
          <Link className="btn-hero-primary" to="/register">Créer mon compte gratuitement →</Link>
          <Link className="btn-hero-ghost" to="/login">J&apos;ai déjà un compte</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">Delivery <span>War</span></div>
        <div className="footer-links">
          <a className="footer-link" href="#">Mentions légales</a>
          <a className="footer-link" href="#">CGU</a>
          <a className="footer-link" href="#">Confidentialité</a>
          <a className="footer-link" href="#">Contact</a>
        </div>
        <div className="footer-copy">© 2026 Delivery War. Tous droits réservés.</div>
      </footer>
    </>
  );
}
