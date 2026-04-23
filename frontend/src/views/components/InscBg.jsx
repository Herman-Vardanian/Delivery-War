export default function InscBg() {
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
        {/* truck-move = gauche→droite → flip */}
        <svg className="truck" style={{ top: '12%', animation: 'truck-move 10s linear infinite', opacity: 0.5 }} width="150" height="56" viewBox="0 0 150 56" fill="none">
          <g transform="translate(150,0) scale(-1,1)">
            <rect x="26" y="7" width="104" height="34" rx="3" fill="#1A2438" stroke="#FF8C00" strokeWidth="0.8" strokeOpacity="0.5"/>
            <rect x="6" y="15" width="26" height="26" rx="2" fill="#0D1B3E" stroke="#2A3F63" strokeWidth="0.8"/>
            <rect x="9" y="18" width="14" height="10" rx="1" fill="#29B6F6" opacity="0.6"/>
            <circle cx="46" cy="47" r="8" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.2"/>
            <circle cx="46" cy="47" r="3.5" fill="#1A2438"/>
            <circle cx="114" cy="47" r="8" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.2"/>
            <circle cx="114" cy="47" r="3.5" fill="#1A2438"/>
            <text x="78" y="30" fontFamily="'Barlow Condensed',sans-serif" fontSize="9" fontWeight="900" fill="#FF8C00" letterSpacing="1" textAnchor="middle">DW</text>
          </g>
        </svg>
        <svg className="truck" style={{ top: '55%', animation: 'truck-move 14s linear infinite', animationDelay: '-5s', opacity: 0.35 }} width="120" height="48" viewBox="0 0 120 48" fill="none">
          <g transform="translate(120,0) scale(-1,1)">
            <rect x="22" y="5" width="82" height="32" rx="2" fill="#0D1B3E" stroke="#162554" strokeWidth="0.8"/>
            <rect x="5" y="12" width="22" height="25" rx="2" fill="#080C18" stroke="#1E3370" strokeWidth="0.8"/>
            <rect x="8" y="15" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.5"/>
            <circle cx="36" cy="41" r="6" fill="#080C18" stroke="#2A3F63" strokeWidth="1"/>
            <circle cx="92" cy="41" r="6" fill="#080C18" stroke="#2A3F63" strokeWidth="1"/>
          </g>
        </svg>
        {/* truck-move-reverse = droite→gauche → cab à gauche, sens correct, pas de flip */}
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
