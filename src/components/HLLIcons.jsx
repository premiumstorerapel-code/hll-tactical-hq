import React from 'react';

/**
 * Authentic Hell Let Loose (HLL) Tactical In-Game Symbols & SVGs
 * Perfectly recreates the exact in-game HUD markers for:
 * - Garrison (Bunker with antenna/flag & spawn arch)
 * - Outpost / OP (Radio tripod mast with broadcast radio waves)
 * - Supplies (Supply crate with military drop harness & quantity badge)
 * - Enemy Infantry (Infantry rifleman helmet & chevron)
 * - Enemy Armor / Tank (Tracked tank chassis with cannon turret)
 * - Enemy Garrison (Red fortified bunker with crosshairs)
 * - Artillery Battery (Field gun howitzer silhouette)
 */

export function HLLGarrisonIcon({ size = 28, className = "", isEnemy = false, isViolating = false }) {
  const primaryColor = isViolating ? "#ef4444" : isEnemy ? "#dc2626" : "#10b981";
  const bgColor = isViolating ? "#450a0a" : isEnemy ? "#2b0d0d" : "#06291e";
  const borderColor = isViolating ? "#f87171" : isEnemy ? "#ef4444" : "#34d399";

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Diamond/Circle Badge */}
      <circle cx="18" cy="18" r="16.5" fill={bgColor} stroke={borderColor} strokeWidth="2" />
      {isViolating && (
        <circle cx="18" cy="18" r="17.5" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      )}
      
      {/* HLL Garrison Fortified Bunker Structure */}
      {/* Roof / Antenna */}
      <path d="M18 6V11M16 8H20" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Fortified Bunker Main Body */}
      <path 
        d="M10 26L12 14H24L26 26H10Z" 
        fill={primaryColor} 
        fillOpacity="0.25" 
        stroke={primaryColor} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
      />
      
      {/* Bunker Entrance Arch (Spawn Gate) */}
      <path 
        d="M15 26V20C15 18.3431 16.3431 17 18 17C19.6569 17 21 18.3431 21 20V26" 
        fill={bgColor} 
        stroke={primaryColor} 
        strokeWidth="1.8" 
      />
      
      {/* Star / Tactical Dot inside spawn portal */}
      <circle cx="18" cy="14" r="1.5" fill="#ffffff" />
    </svg>
  );
}

export function HLLOutpostIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Round Badge */}
      <circle cx="18" cy="18" r="16" fill="#06291e" stroke="#10b981" strokeWidth="2" />
      
      {/* Radio Antenna Mast */}
      <path d="M18 9V27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      
      {/* Tripod Legs */}
      <path d="M14 27L18 20L22 27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Antenna Transmit Broadcast Waves (HLL OP Signature) */}
      <path d="M13 12C11 14 11 18 13 20" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23 12C25 14 25 18 23 20" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 9C7 13 7 21 10 25" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <path d="M26 9C29 13 29 21 26 25" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      
      {/* Top Transmitter Bead */}
      <circle cx="18" cy="9" r="2" fill="#ffffff" />
    </svg>
  );
}

export function HLLSuppliesIcon({ size = 26, amount = 50, className = "" }) {
  const is50 = amount === 50;
  const badgeColor = is50 ? "#3b82f6" : "#f59e0b";
  const bgColor = is50 ? "#0f233a" : "#2e1d08";

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Border Badge */}
      <rect x="2" y="2" width="32" height="32" rx="4" fill={bgColor} stroke={badgeColor} strokeWidth="2" />
      
      {/* Parachute Canopy at top */}
      <path d="M9 13C9 7.5 13 5 18 5C23 5 27 7.5 27 13Z" fill={badgeColor} fillOpacity="0.3" stroke={badgeColor} strokeWidth="1.5" />
      <path d="M18 5V13" stroke={badgeColor} strokeWidth="1.2" />
      <path d="M9 13L15 17M27 13L21 17" stroke={badgeColor} strokeWidth="1.2" />
      
      {/* Supply Box Container */}
      <rect x="12" y="17" width="12" height="11" rx="1.5" fill={badgeColor} />
      
      {/* Box Straps Cross */}
      <line x1="12" y1="22.5" x2="24" y2="22.5" stroke={bgColor} strokeWidth="1.2" />
      <line x1="18" y1="17" x2="18" y2="28" stroke={bgColor} strokeWidth="1.2" />

      {/* Numerical Badge in corner */}
      <text x="18" y="33" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        {amount}
      </text>
    </svg>
  );
}

export function HLLEnemyInfantryIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Red Enemy Diamond Badge */}
      <polygon points="18,3 33,18 18,33 3,18" fill="#380d0d" stroke="#ef4444" strokeWidth="2" />
      
      {/* In-Game Infantry Silhouette / Helmet with Crosshairs */}
      <circle cx="18" cy="14" r="4.5" fill="#f87171" />
      <path d="M12 25C12 21 14.5 19 18 19C21.5 19 24 21 24 25Z" fill="#f87171" />
      
      {/* Warning crosshair dots */}
      <line x1="18" y1="6" x2="18" y2="8" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="18" y1="28" x2="18" y2="30" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

export function HLLEnemyArmorIcon({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Red Enemy Diamond Badge */}
      <polygon points="18,3 33,18 18,33 3,18" fill="#380d0d" stroke="#ef4444" strokeWidth="2" />
      
      {/* In-Game HLL Tank Silhouette */}
      {/* Main Gun Barrel extending North */}
      <line x1="18" y1="7" x2="18" y2="16" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Turret */}
      <circle cx="18" cy="18" r="4" fill="#f87171" stroke="#fff" strokeWidth="1" />
      
      {/* Left and Right Tank Treads */}
      <rect x="11" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
      <rect x="22" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
      
      {/* Tank Hull */}
      <rect x="13.5" y="15" width="9" height="10" rx="1.5" fill="#dc2626" />
    </svg>
  );
}

export function HLLArtilleryIcon({ size = 26, className = "", isAxis = false }) {
  const color = isAxis ? "#ef4444" : "#3b82f6";
  const bg = isAxis ? "#2e0c0c" : "#0d1e33";

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill={bg} stroke={color} strokeWidth="2" />
      
      {/* Artillery Cannon / Howitzer Silhouette */}
      <line x1="10" y1="24" x2="25" y2="11" stroke={color} strokeWidth="3" strokeLinecap="round" />
      
      {/* Gun Carriage Wheel */}
      <circle cx="15" cy="21" r="4.5" fill={bg} stroke="#ffffff" strokeWidth="1.8" />
      <circle cx="15" cy="21" r="1.5" fill="#ffffff" />
      
      {/* Recoil shield & split trail */}
      <line x1="13" y1="16" x2="17" y2="20" stroke={color} strokeWidth="2" />
      <line x1="15" y1="21" x2="9" y2="26" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Returns HTML string representation of in-game HLL marker for Leaflet L.divIcon
 */
export function getHLLMarkerHTML(type, label, hasViolation = false) {
  if (type === 'friendly_garrison') {
    const borderColor = hasViolation ? '#ef4444' : '#10b981';
    const bgColor = hasViolation ? '#450a0a' : '#042419';
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: ${bgColor}; border: 2px solid ${borderColor}; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(0,0,0,0.9); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16.5" fill="${bgColor}" stroke="${borderColor}" stroke-width="2.5" />
          <path d="M18 6V11M16 8H20" stroke="${borderColor}" stroke-width="2.2" stroke-linecap="round" />
          <path d="M10 26L12 14H24L26 26H10Z" fill="${borderColor}" fill-opacity="0.3" stroke="${borderColor}" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M15 26V20C15 18.3 16.3 17 18 17C19.7 17 21 18.3 21 20V26" fill="${bgColor}" stroke="${borderColor}" stroke-width="2.2" />
          <circle cx="18" cy="14" r="1.5" fill="#ffffff" />
        </svg>
        <span>${label}</span>
        ${hasViolation ? '<span style="background: #ef4444; color: #fff; padding: 0 3px; border-radius: 2px; font-size: 9px; font-weight: 900;">&lt;200m!</span>' : ''}
      </div>
    `;
  }

  if (type === 'friendly_op') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #06291e; border: 2px solid #10b981; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(0,0,0,0.9); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#06291e" stroke="#10b981" stroke-width="2.5" />
          <path d="M18 9V27" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
          <path d="M14 27L18 20L22 27" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13 12C11 14 11 18 13 20" stroke="#34d399" stroke-width="2" stroke-linecap="round" />
          <path d="M23 12C25 14 25 18 23 20" stroke="#34d399" stroke-width="2" stroke-linecap="round" />
          <circle cx="18" cy="9" r="2" fill="#ffffff" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  if (type === 'supply_50' || type === 'supply_100') {
    const is50 = type === 'supply_50';
    const col = is50 ? '#3b82f6' : '#f59e0b';
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #131a24; border: 2px solid ${col}; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.9); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="4" fill="#0f172a" stroke="${col}" stroke-width="2.5" />
          <path d="M9 13C9 7.5 13 5 18 5C23 5 27 7.5 27 13Z" fill="${col}" fill-opacity="0.3" stroke="${col}" stroke-width="1.8" />
          <rect x="12" y="17" width="12" height="11" rx="1.5" fill="${col}" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  if (type === 'enemy_inf') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #2b0b0b; border: 2px solid #ef4444; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(239,68,68,0.4); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="18,3 33,18 18,33 3,18" fill="#380d0d" stroke="#ef4444" stroke-width="2.5" />
          <circle cx="18" cy="14" r="4" fill="#f87171" />
          <path d="M12 25C12 21 14.5 19 18 19C21.5 19 24 21 24 25Z" fill="#f87171" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  if (type === 'enemy_tank') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #2b0b0b; border: 2px solid #ef4444; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(239,68,68,0.4); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="18,3 33,18 18,33 3,18" fill="#380d0d" stroke="#ef4444" stroke-width="2.5" />
          <line x1="18" y1="7" x2="18" y2="16" stroke="#fca5a5" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="18" cy="18" r="3.5" fill="#f87171" stroke="#fff" stroke-width="1" />
          <rect x="11" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
          <rect x="22" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
          <rect x="13.5" y="15" width="9" height="10" rx="1.5" fill="#dc2626" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  if (type === 'enemy_garrison') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #3b0909; border: 2px solid #ef4444; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 14px rgba(239,68,68,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16.5" fill="#2b0d0d" stroke="#ef4444" stroke-width="2.5" />
          <path d="M18 6V11M16 8H20" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" />
          <path d="M10 26L12 14H24L26 26H10Z" fill="#ef4444" fill-opacity="0.3" stroke="#ef4444" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M15 26V20C15 18.3 16.3 17 18 17C19.7 17 21 18.3 21 20V26" fill="#2b0d0d" stroke="#ef4444" stroke-width="2.2" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  return `
    <div style="background: #11171b; border: 1.5px solid #f59e0b; padding: 2px 6px; border-radius: 3px; color: #fff; font-size: 11px; font-family: monospace;">
      📍 ${label}
    </div>
  `;
}
