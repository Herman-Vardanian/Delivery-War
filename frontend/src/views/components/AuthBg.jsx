export default function AuthBg() {
  return (
    <div className="bg-layer">
      <svg className="bg-city" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <line x1="0" y1="200" x2="1440" y2="200" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="560" x2="1440" y2="560" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="0" y1="740" x2="1440" y2="740" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="180" y1="0" x2="180" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="420" y1="0" x2="420" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="660" y1="0" x2="660" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="900" y1="0" x2="900" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="1140" y1="0" x2="1140" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <line x1="1380" y1="0" x2="1380" y2="900" stroke="#8899BB" strokeWidth="0.5"/>
        <rect x="200" y="40" width="200" height="140" fill="#8899BB" rx="2"/>
        <rect x="440" y="80" width="180" height="100" fill="#8899BB" rx="2"/>
        <rect x="680" y="20" width="180" height="160" fill="#8899BB" rx="2"/>
        <rect x="920" y="60" width="160" height="120" fill="#8899BB" rx="2"/>
        <rect x="200" y="220" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="440" y="260" width="200" height="90" fill="#8899BB" rx="2"/>
        <rect x="680" y="400" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="920" y="400" width="180" height="130" fill="#8899BB" rx="2"/>
        <rect x="1160" y="80" width="160" height="100" fill="#8899BB" rx="2"/>
        <rect x="1160" y="400" width="200" height="120" fill="#8899BB" rx="2"/>
        <line x1="0" y1="380" x2="1440" y2="380" stroke="#FF8C00" strokeWidth="1" strokeDasharray="20 15" opacity="0.4"/>
        <line x1="0" y1="200" x2="1440" y2="200" stroke="#FF8C00" strokeWidth="0.5" strokeDasharray="20 15" opacity="0.2"/>
        <circle cx="300" cy="150" r="4" fill="#FF8C00" opacity="0.6"/>
        <circle cx="540" cy="300" r="3" fill="#FF8C00" opacity="0.4"/>
        <circle cx="780" cy="200" r="5" fill="#FF8C00" opacity="0.5"/>
        <circle cx="1020" cy="450" r="3" fill="#FF8C00" opacity="0.35"/>
        <circle cx="1200" cy="160" r="4" fill="#00E676" opacity="0.4"/>
      </svg>

      <div className="radar-wrap">
        <svg viewBox="0 0 680 680" fill="none">
          <circle cx="340" cy="340" r="320" className="radar-ring" strokeOpacity="0.4"/>
          <circle cx="340" cy="340" r="240" className="radar-ring" strokeOpacity="0.3"/>
          <circle cx="340" cy="340" r="160" className="radar-ring" strokeOpacity="0.25"/>
          <circle cx="340" cy="340" r="80"  className="radar-ring" strokeOpacity="0.2"/>
          <line x1="20" y1="340" x2="660" y2="340" stroke="#FF8C00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <line x1="340" y1="20" x2="340" y2="660" stroke="#FF8C00" strokeWidth="0.5" strokeOpacity="0.3"/>
          <g className="radar-sweep">
            <path d="M340 340 L660 340 A320 320 0 0 0 340 20 Z" fill="url(#radarGrad)" opacity="0.25"/>
            <line x1="340" y1="340" x2="660" y2="340" stroke="#FF8C00" strokeWidth="1.5" strokeOpacity="0.8"/>
          </g>
          <circle cx="480" cy="260" r="4" fill="#FF8C00" opacity="0.7"/>
          <circle cx="220" cy="400" r="3" fill="#00E676" opacity="0.6"/>
          <circle cx="400" cy="180" r="5" fill="#FF8C00" opacity="0.5"/>
          <defs>
            <radialGradient id="radarGrad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(340 340) scale(320)">
              <stop offset="0" stopColor="#FF8C00" stopOpacity="0.4"/>
              <stop offset="1" stopColor="#FF8C00" stopOpacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="trucks-layer">
        <svg className="truck truck-1" width="160" height="60" viewBox="0 0 160 60" fill="none">
          <rect x="30" y="8" width="110" height="38" rx="3" fill="#1A2438" stroke="#FF8C00" strokeWidth="1" strokeOpacity="0.6"/>
          <rect x="8" y="18" width="28" height="28" rx="2" fill="#0D1B3E" stroke="#2A3F63" strokeWidth="1"/>
          <rect x="12" y="22" width="14" height="10" rx="1" fill="#29B6F6" opacity="0.7"/>
          <circle cx="50" cy="50" r="9" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.5"/>
          <circle cx="50" cy="50" r="4" fill="#1A2438"/>
          <circle cx="120" cy="50" r="9" fill="#0C1020" stroke="#FF8C00" strokeWidth="1.5"/>
          <circle cx="120" cy="50" r="4" fill="#1A2438"/>
          <text x="75" y="32" fontFamily="'Barlow Condensed',sans-serif" fontSize="10" fontWeight="900" fill="#FF8C00" letterSpacing="1" textAnchor="middle">DW</text>
        </svg>
        <svg className="truck truck-2" width="130" height="52" viewBox="0 0 130 52" fill="none">
          <rect x="24" y="6" width="88" height="34" rx="3" fill="#0D1B3E" stroke="#1E3370" strokeWidth="1"/>
          <rect x="6" y="14" width="24" height="26" rx="2" fill="#080C18" stroke="#162554" strokeWidth="1"/>
          <rect x="9" y="17" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.5"/>
          <circle cx="40" cy="44" r="7" fill="#080C18" stroke="#2A3F63" strokeWidth="1.5"/>
          <circle cx="40" cy="44" r="3" fill="#111827"/>
          <circle cx="98" cy="44" r="7" fill="#080C18" stroke="#2A3F63" strokeWidth="1.5"/>
          <circle cx="98" cy="44" r="3" fill="#111827"/>
        </svg>
        <svg className="truck truck-3" width="100" height="44" viewBox="0 0 100 44" fill="none">
          <rect x="18" y="5" width="66" height="28" rx="2" fill="#111827" stroke="#1F2D47" strokeWidth="1"/>
          <rect x="4" y="11" width="20" height="22" rx="2" fill="#0C1020"/>
          <rect x="7" y="14" width="10" height="8" rx="1" fill="#29B6F6" opacity="0.4"/>
          <circle cx="30" cy="37" r="6" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
          <circle cx="74" cy="37" r="6" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
        </svg>
        <svg className="truck truck-4" width="150" height="58" viewBox="0 0 150 58" fill="none">
          <rect x="28" y="7" width="104" height="36" rx="3" fill="#0D1B3E" stroke="#162554" strokeWidth="1"/>
          <rect x="6" y="16" width="28" height="27" rx="2" fill="#080C18" stroke="#1E3370" strokeWidth="1"/>
          <rect x="9" y="19" width="15" height="10" rx="1" fill="#29B6F6" opacity="0.6"/>
          <circle cx="42" cy="48" r="8" fill="#080C18" stroke="#162554" strokeWidth="1.5"/>
          <circle cx="42" cy="48" r="3.5" fill="#111827"/>
          <circle cx="112" cy="48" r="8" fill="#080C18" stroke="#162554" strokeWidth="1.5"/>
          <circle cx="112" cy="48" r="3.5" fill="#111827"/>
        </svg>
        <svg className="truck truck-5" width="110" height="48" viewBox="0 0 110 48" fill="none">
          <rect x="20" y="5" width="74" height="30" rx="2" fill="#111827" stroke="#1F2D47" strokeWidth="0.5"/>
          <rect x="4" y="11" width="22" height="24" rx="2" fill="#0C1020"/>
          <rect x="6" y="14" width="12" height="9" rx="1" fill="#29B6F6" opacity="0.35"/>
          <circle cx="33" cy="40" r="7" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
          <circle cx="85" cy="40" r="7" fill="#080C18" stroke="#1F2D47" strokeWidth="1"/>
        </svg>
      </div>

      <div className="overlay-left" />
      <div className="overlay-vignette" />
    </div>
  );
}
