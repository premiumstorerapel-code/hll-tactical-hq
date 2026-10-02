import React from 'react';

/**
 * Authentic Hell Let Loose (HLL) In-Game HUD & TacMap Vector Symbols
 * Exactly matching the in-game tacmap (M key) appearance:
 * - Strongpoint / Base Capture Circle (4 cardinal notches, capture flag, team faction color)
 * - Garrison (Official bunker silhouette with top radio antenna mast & warning states)
 * - Outpost / OP (Official radio tower tripod with transmission wave arcs & squad designation)
 * - Supply Crate (Supply box with parachute suspension lines and 50/100 count badge)
 * - Armor / Tanks (Top-down hull with caterpillar tracks and directional main turret cannon)
 * - Squad Roles (Official in-game class emblems: Officer, MG, Assault, AT, Support, Auto Rifle, Medic, Engineer, Sniper)
 */

// 1. OFFICIAL STRONGPOINT / BASE CAPTURE ICON
export function HLLBaseIcon({ size = 34, team = "neu", isSelected = false, className = "" }) {
  const isAllied = team === "us" || team === "allies";
  const isAxis = team === "ger" || team === "axis";

  // Authentic HLL Map Colors
  const borderColor = isSelected ? "#f59e0b" : isAllied ? "#2563eb" : isAxis ? "#dc2626" : "#eab308";
  const fillColor = isSelected ? "#2a1b02" : isAllied ? "#0a1d37" : isAxis ? "#2d0a0a" : "#1a1a0c";
  const emblemColor = isSelected ? "#fbbf24" : isAllied ? "#60a5fa" : isAxis ? "#f87171" : "#fef08a";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`base-glow-${team}-${isSelected}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={borderColor} floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Outer Tactical Capture Ring */}
      <circle cx="20" cy="20" r="17.5" fill={fillColor} stroke={borderColor} strokeWidth={isSelected ? "3" : "2.2"} filter={`url(#base-glow-${team}-${isSelected})`} />
      
      {/* Active Target Pulse Ring */}
      {isSelected && (
        <circle cx="20" cy="20" r="19" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
      )}

      {/* 4 Cardinal Chevrons (Top, Right, Bottom, Left) */}
      <path d="M14 7.5L20 11.5L26 7.5" stroke={emblemColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 32.5L20 28.5L26 32.5" stroke={emblemColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 14L11.5 20L7.5 26" stroke={emblemColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32.5 14L28.5 20L32.5 26" stroke={emblemColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Center Flagpole & Waving Flag */}
      <line x1="16.5" y1="12" x2="16.5" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <polygon points="17.5,13 25.5,17 17.5,21" fill={emblemColor} stroke="#ffffff" strokeWidth="1" strokeLinejoin="round" />
      <circle cx="16.5" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  );
}

// 2. GARRISON (Official In-Game Bunker Badge)
export function HLLGarrisonIcon({ size = 30, className = "", isEnemy = false, isWarning = false, isViolating = false }) {
  const borderColor = isViolating ? "#ef4444" : isWarning ? "#f59e0b" : isEnemy ? "#dc2626" : "#10b981";
  const bgColor = isViolating ? "#3b0707" : isWarning ? "#2b1704" : isEnemy ? "#280707" : "#042419";
  const iconColor = isViolating ? "#fca5a5" : isWarning ? "#fbbf24" : isEnemy ? "#f87171" : "#34d399";

  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Tactical Disc */}
      <circle cx="19" cy="19" r="17" fill={bgColor} stroke={borderColor} strokeWidth="2.4" />
      
      {/* Proximity / Warning Alert Ring */}
      {(isViolating || isWarning) && (
        <circle cx="19" cy="19" r="18.5" fill="none" stroke={borderColor} strokeWidth="1.5" strokeDasharray="3 3" />
      )}

      {/* Vertical Radio Antenna Mast with Crossbars */}
      <line x1="19" y1="6" x2="19" y2="15" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="15.5" y1="9" x2="22.5" y2="9" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="19" cy="6" r="1.5" fill="#ffffff" />

      {/* Fortified Bunker Silhouette */}
      <path d="M10 27L13.5 15H24.5L28 27H10Z" fill={iconColor} fillOpacity="0.25" stroke={iconColor} strokeWidth="2" strokeLinejoin="round" />
      
      {/* Bunker Arch Entrance */}
      <path d="M16 27V21C16 19.3431 17.3431 18 19 18C20.6569 18 22 19.3431 22 21V27" fill={bgColor} stroke={iconColor} strokeWidth="1.8" />

      {/* Warning Exclamation Mark if Blocked */}
      {(isViolating || isWarning) && (
        <g>
          <circle cx="28" cy="10" r="5.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
          <text x="28" y="13.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900" fontFamily="sans-serif">!</text>
        </g>
      )}
    </svg>
  );
}

// 3. OUTPOST / OP (Official Radio Tripod & Transmission Waves)
export function HLLOutpostIcon({ size = 28, squadLetter = "OP", isEnemy = false, className = "" }) {
  const primaryColor = isEnemy ? "#ef4444" : "#10b981";
  const bgColor = isEnemy ? "#280707" : "#042419";
  const accentColor = isEnemy ? "#fca5a5" : "#34d399";

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Tactical Disc */}
      <circle cx="18" cy="18" r="16" fill={bgColor} stroke={primaryColor} strokeWidth="2.2" />
      
      {/* Central Radio Mast */}
      <line x1="18" y1="8" x2="18" y2="28" stroke={primaryColor} strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Tripod Base Legs */}
      <line x1="18" y1="21" x2="12" y2="28" stroke={primaryColor} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="18" y1="21" x2="24" y2="28" stroke={primaryColor} strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Radio Transmission Waves (Left and Right arcs) */}
      <path d="M13 13C11 15.5 11 19.5 13 22" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M23 13C25 15.5 25 19.5 23 22" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 10.5C6.5 14.5 6.5 20.5 9.5 24.5" stroke={accentColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <path d="M26.5 10.5C29.5 14.5 29.5 20.5 26.5 24.5" stroke={accentColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      
      {/* Transmitter Beacon Tip */}
      <circle cx="18" cy="8" r="2" fill="#ffffff" />
    </svg>
  );
}

// 4. SUPPLY CRATE / DROP (Official Parachute + Ammo Box)
export function HLLSuppliesIcon({ size = 28, amount = 50, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Disc Base */}
      <circle cx="19" cy="19" r="17" fill="#082138" stroke="#38bdf8" strokeWidth="2.2" />
      
      {/* Parachute Canopy Top */}
      <path d="M11 14C11 9 14.5 6.5 19 6.5C23.5 6.5 27 9 27 14C24.5 13 22.5 13 19 13.5C15.5 13 13.5 13 11 14Z" fill="#38bdf8" fillOpacity="0.4" stroke="#7dd3fc" strokeWidth="1.5" />
      
      {/* Parachute Suspension Lines */}
      <line x1="11" y1="14" x2="15" y2="20" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <line x1="27" y1="14" x2="23" y2="20" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <line x1="19" y1="13.5" x2="19" y2="20" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="1.5 1.5" />

      {/* Wooden / Metal Supply Crate */}
      <rect x="12" y="20" width="14" height="11" rx="1.5" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="12" y1="25.5" x2="26" y2="25.5" stroke="#ffffff" strokeWidth="1" />
      <line x1="19" y1="20" x2="19" y2="31" stroke="#ffffff" strokeWidth="1" />

      {/* Supply Count Indicator Badge */}
      <g>
        <rect x="23" y="2" width="14" height="9" rx="2" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
        <text x="30" y="8.5" textAnchor="middle" fill="#ffffff" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">{amount}</text>
      </g>
    </svg>
  );
}

// 5. TANK / BLINDADO (Official Top-Down Armor Silhouette)
export function HLLFriendlyArmorIcon({ size = 30, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Tactical Disc */}
      <circle cx="19" cy="19" r="17" fill="#05261c" stroke="#10b981" strokeWidth="2.2" />

      {/* Left Caterpillar Track */}
      <rect x="9" y="11" width="3.5" height="17" rx="1" fill="#34d399" stroke="#059669" strokeWidth="0.8" />
      {/* Right Caterpillar Track */}
      <rect x="25.5" y="11" width="3.5" height="17" rx="1" fill="#34d399" stroke="#059669" strokeWidth="0.8" />

      {/* Armored Chassis Hull */}
      <rect x="13.5" y="12" width="11" height="15" rx="2" fill="#047857" stroke="#34d399" strokeWidth="1.2" />

      {/* Cannon Barrel pointing North */}
      <line x1="19" y1="5" x2="19" y2="18" stroke="#34d399" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="17.8" y="4.5" width="2.4" height="3" fill="#ffffff" />

      {/* Revolving Turret Mantlet */}
      <circle cx="19" cy="18" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
    </svg>
  );
}

// Enemy Tank / Armor
export function HLLEnemyArmorIcon({ size = 30, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="17" fill="#310808" stroke="#ef4444" strokeWidth="2.2" />

      {/* Left Caterpillar Track */}
      <rect x="9" y="11" width="3.5" height="17" rx="1" fill="#f87171" stroke="#b91c1c" strokeWidth="0.8" />
      {/* Right Caterpillar Track */}
      <rect x="25.5" y="11" width="3.5" height="17" rx="1" fill="#f87171" stroke="#b91c1c" strokeWidth="0.8" />

      {/* Armored Chassis Hull */}
      <rect x="13.5" y="12" width="11" height="15" rx="2" fill="#b91c1c" stroke="#f87171" strokeWidth="1.2" />

      {/* Cannon Barrel */}
      <line x1="19" y1="5" x2="19" y2="18" stroke="#f87171" strokeWidth="2.8" strokeLinecap="round" />
      <rect x="17.8" y="4.5" width="2.4" height="3" fill="#ffffff" />

      {/* Turret Mantlet */}
      <circle cx="19" cy="18" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" />
    </svg>
  );
}

// 6. SQUAD ROLES (Official Hell Let Loose Class Emblems)

// Officer / Squad Leader (SL - Star and Dual Chevrons)
export function HLLOfficerRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#082b20" stroke="#10b981" strokeWidth="2" />
      {/* Gold Officer Star */}
      <polygon points="17,6.5 19.5,12 25.5,12.5 21,16.5 22.5,22.5 17,19.5 11.5,22.5 13,16.5 8.5,12.5 14.5,12" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.8" />
      {/* Dual Chevrons */}
      <path d="M11 25L17 21L23 25" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 28L17 24L23 28" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Machine Gunner (Heavy Bipod MG)
export function HLLMachineGunnerRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#2d1c06" stroke="#f59e0b" strokeWidth="2" />
      {/* Heavy MG Barrel & Cooling Shroud */}
      <line x1="7" y1="14" x2="27" y2="14" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <line x1="27" y1="12.5" x2="27" y2="15.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
      {/* Bipod Legs */}
      <line x1="23" y1="14" x2="19" y2="24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="14" x2="27" y2="24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      {/* Ammo drum */}
      <circle cx="14" cy="18" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
    </svg>
  );
}

// Assault (Stick Grenade & Blast Flash)
export function HLLAssaultRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#311212" stroke="#ef4444" strokeWidth="2" />
      {/* German Stielhandgranate (Stick Grenade) */}
      <rect x="14" y="7" width="6" height="9" rx="1.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
      <rect x="16" y="16" width="2" height="11" fill="#fca5a5" />
      <line x1="13" y1="12" x2="21" y2="12" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
}

// Anti-Tank (AT - Rocket Projectile)
export function HLLAntiTankRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#201133" stroke="#a855f7" strokeWidth="2" />
      {/* Shaped Charge Warhead */}
      <path d="M17 6L23 13H11L17 6Z" fill="#c084fc" stroke="#ffffff" strokeWidth="1" />
      <rect x="15" y="13" width="4" height="11" fill="#c084fc" />
      {/* Rocket Stabilizer Fins */}
      <polygon points="12,27 15,23 19,23 22,27" fill="#e9d5ff" />
    </svg>
  );
}

// Support (Supply Crate & Wrench)
export function HLLSupportRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#0c1f38" stroke="#38bdf8" strokeWidth="2" />
      {/* Supply Box */}
      <rect x="9.5" y="12" width="15" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="9.5" y1="18" x2="24.5" y2="18" stroke="#ffffff" strokeWidth="1.2" />
      <line x1="17" y1="12" x2="17" y2="24" stroke="#ffffff" strokeWidth="1.2" />
      {/* Carrying Handle */}
      <path d="M14 12V9.5C14 8.7 14.7 8 15.5 8H18.5C19.3 8 20 8.7 20 9.5V12" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

// Automatic Rifleman (Magazine + Triple Tracer)
export function HLLAutoRifleRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#1f1b2b" stroke="#818cf8" strokeWidth="2" />
      {/* Box Magazine */}
      <rect x="14" y="9" width="6" height="16" rx="1.5" fill="#4f46e5" stroke="#a5b4fc" strokeWidth="1.5" />
      {/* Triple Burst Tracers */}
      <line x1="8" y1="12" x2="12" y2="12" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="17" x2="12" y2="17" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="22" x2="12" y2="22" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Sniper / Recon (Telescopic Optical Reticle)
export function HLLSniperRoleIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="15" fill="#082138" stroke="#38bdf8" strokeWidth="2" />
      {/* Scope Reticle Circles */}
      <circle cx="17" cy="17" r="9" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="4" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" />
      {/* Crosshair Lines */}
      <line x1="17" y1="5" x2="17" y2="29" stroke="#38bdf8" strokeWidth="1.4" />
      <line x1="5" y1="17" x2="29" y2="17" stroke="#38bdf8" strokeWidth="1.4" />
      <circle cx="17" cy="17" r="1.5" fill="#ffffff" />
    </svg>
  );
}

export const HLLReconIcon = HLLSniperRoleIcon;

// Artillery Cannon Howitzer
export function HLLArtilleryIcon({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#1b1204" stroke="#f59e0b" strokeWidth="2.2" />
      <line x1="12" y1="24" x2="25" y2="10" stroke="#fbbf24" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="13" cy="23" r="5" fill="#2d1d05" stroke="#f59e0b" strokeWidth="1.8" />
      <line x1="14" y1="16" x2="19" y2="21" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Enemy Infantry Diamond Icon
export function HLLEnemyInfantryIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,4 32,18 18,32 4,18" fill="#380d0d" stroke="#ef4444" strokeWidth="2.2" />
      <line x1="11" y1="11" x2="25" y2="25" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="25" y1="11" x2="11" y2="25" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18" cy="18" r="2.5" fill="#ef4444" />
    </svg>
  );
}


// =========================================================================
// LEAFLET MAP TOKEN GENERATORS (CLEAN IN-GAME HUD LOOK)
// No bulky rectangular boxes covering the terrain - Authentic clean roundels!
// =========================================================================

export function getHLLBaseMarkerHTML(poi, isSelected = false) {
  const isAxis = poi.team === 'ger';
  const isAllies = poi.team === 'us';
  const borderColor = isSelected ? '#fbbf24' : isAxis ? '#ef4444' : isAllies ? '#3b82f6' : '#eab308';
  const fillColor = isSelected ? '#331f00' : isAxis ? '#2b0a0a' : isAllies ? '#091c33' : '#1f1e09';
  const iconColor = isSelected ? '#fbbf24' : isAxis ? '#f87171' : isAllies ? '#60a5fa' : '#fef08a';

  return `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
      <!-- In-Game Strongpoint Capture Roundel -->
      <div style="width: 36px; height: 36px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="17.5" fill="${fillColor}" stroke="${borderColor}" stroke-width="${isSelected ? '3' : '2.2'}" />
          ${isSelected ? `<circle cx="20" cy="20" r="19" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3 3" />` : ''}
          <path d="M14 7.5L20 11.5L26 7.5" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 32.5L20 28.5L26 32.5" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.5 14L11.5 20L7.5 26" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M32.5 14L28.5 20L32.5 26" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <line x1="16.5" y1="12" x2="16.5" y2="28" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
          <polygon points="17.5,13 25.5,17 17.5,21" fill="${iconColor}" stroke="#ffffff" stroke-width="0.8" stroke-linejoin="round" />
          <circle cx="16.5" cy="12" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      <!-- Clean Tactical Name Tag -->
      <div style="margin-top: 2px; background: rgba(17, 24, 39, 0.92); border: 1.5px solid ${borderColor}; 
                  padding: 1px 6px; border-radius: 3px; font-family: 'Chakra Petch', sans-serif; 
                  font-size: 11px; font-weight: 800; color: #fff; white-space: nowrap; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.9); text-transform: uppercase; letter-spacing: 0.5px;">
        ${isSelected ? '★ ' : ''}${poi.name}
      </div>
    </div>
  `;
}

export function getHLLMarkerHTML(type, label, hasViolation = false) {
  // GARRISON
  if (type === 'friendly_garrison' || type === 'enemy_garrison') {
    const isEnemy = type === 'enemy_garrison';
    const borderColor = hasViolation ? '#ef4444' : isEnemy ? '#dc2626' : '#10b981';
    const bgColor = hasViolation ? '#3b0707' : isEnemy ? '#280707' : '#042419';
    const iconColor = hasViolation ? '#fca5a5' : isEnemy ? '#f87171' : '#34d399';

    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 32px; height: 32px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="17" fill="${bgColor}" stroke="${borderColor}" stroke-width="2.4" />
            ${hasViolation ? `<circle cx="19" cy="19" r="18.5" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3 3" />` : ''}
            <line x1="19" y1="6" x2="19" y2="15" stroke="${iconColor}" stroke-width="2.2" stroke-linecap="round" />
            <line x1="15.5" y1="9" x2="22.5" y2="9" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" />
            <circle cx="19" cy="6" r="1.5" fill="#ffffff" />
            <path d="M10 27L13.5 15H24.5L28 27H10Z" fill="${iconColor}" fill-opacity="0.25" stroke="${iconColor}" stroke-width="2" stroke-linejoin="round" />
            <path d="M16 27V21C16 19.3 17.3 18 19 18C20.7 18 22 19.3 22 21V27" fill="${bgColor}" stroke="${iconColor}" stroke-width="1.8" />
            ${hasViolation ? `<circle cx="28" cy="10" r="5.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.2" /><text x="28" y="13.5" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="900" font-family="sans-serif">!</text>` : ''}
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid ${borderColor}; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: #fff; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.8);">
          ${label} ${hasViolation ? '<span style="color:#ef4444;">&lt;200m!</span>' : ''}
        </div>
      </div>
    `;
  }

  // OUTPOST / OP
  if (type === 'friendly_op') {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 28px; height: 28px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="16" fill="#042419" stroke="#10b981" stroke-width="2.2" />
            <line x1="18" y1="8" x2="18" y2="28" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" />
            <line x1="18" y1="21" x2="12" y2="28" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" />
            <line x1="18" y1="21" x2="24" y2="28" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" />
            <path d="M13 13C11 15.5 11 19.5 13 22" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" />
            <path d="M23 13C25 15.5 25 19.5 23 22" stroke="#34d399" stroke-width="1.8" stroke-linecap="round" />
            <circle cx="18" cy="8" r="2" fill="#ffffff" />
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid #10b981; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: #6ee7b7; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `;
  }

  // TANK / BLINDADO
  if (type === 'friendly_tank' || type === 'enemy_tank') {
    const isEnemy = type === 'enemy_tank';
    const borderColor = isEnemy ? '#ef4444' : '#10b981';
    const bgColor = isEnemy ? '#310808' : '#05261c';
    const trackColor = isEnemy ? '#f87171' : '#34d399';

    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 32px; height: 32px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="17" fill="${bgColor}" stroke="${borderColor}" stroke-width="2.2" />
            <rect x="9" y="11" width="3.5" height="17" rx="1" fill="${trackColor}" />
            <rect x="25.5" y="11" width="3.5" height="17" rx="1" fill="${trackColor}" />
            <rect x="13.5" y="12" width="11" height="15" rx="2" fill="${isEnemy ? '#b91c1c' : '#047857'}" stroke="${trackColor}" stroke-width="1.2" />
            <line x1="19" y1="5" x2="19" y2="18" stroke="${trackColor}" stroke-width="2.8" stroke-linecap="round" />
            <circle cx="19" cy="18" r="4.5" fill="${borderColor}" stroke="#ffffff" stroke-width="1.2" />
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid ${borderColor}; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: ${isEnemy ? '#fca5a5' : '#6ee7b7'}; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `;
  }

  // SUPPLIES
  if (type === 'supply_50' || type === 'supply_100') {
    const is100 = type === 'supply_100';
    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 30px; height: 30px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="30" height="30" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="17" fill="#082138" stroke="#38bdf8" stroke-width="2.2" />
            <path d="M11 14C11 9 14.5 6.5 19 6.5C23.5 6.5 27 9 27 14C24.5 13 22.5 13 19 13.5C15.5 13 13.5 13 11 14Z" fill="#38bdf8" fill-opacity="0.4" stroke="#7dd3fc" stroke-width="1.5" />
            <rect x="12" y="20" width="14" height="11" rx="1.5" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" />
            <line x1="12" y1="25.5" x2="26" y2="25.5" stroke="#ffffff" stroke-width="1" />
            <line x1="19" y1="20" x2="19" y2="31" stroke="#ffffff" stroke-width="1" />
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid #38bdf8; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: #7dd3fc; white-space: nowrap;">
          📦 ${is100 ? '100' : '50'}
        </div>
      </div>
    `;
  }

  // SQUAD ROLES: Clean In-Game Class Badges
  if (type.startsWith('squad_')) {
    const roleColors = {
      squad_officer: { border: '#10b981', text: '#6ee7b7', glyph: `<polygon points="17,6.5 19.5,12 25.5,12.5 21,16.5 22.5,22.5 17,19.5 11.5,22.5 13,16.5 8.5,12.5 14.5,12" fill="#fbbf24" /><path d="M11 25L17 21L23 25" stroke="#34d399" stroke-width="2.2" stroke-linecap="round"/><path d="M11 28L17 24L23 28" stroke="#34d399" stroke-width="1.8" stroke-linecap="round"/>` },
      squad_mg: { border: '#f59e0b', text: '#fde68a', glyph: `<line x1="7" y1="14" x2="27" y2="14" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" /><line x1="23" y1="14" x2="19" y2="24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" /><line x1="23" y1="14" x2="27" y2="24" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" /><circle cx="14" cy="18" r="3.5" fill="#fbbf24" />` },
      squad_assault: { border: '#ef4444', text: '#fca5a5', glyph: `<rect x="14" y="7" width="6" height="9" rx="1.5" fill="#ef4444" stroke="#ffffff" stroke-width="1" /><rect x="16" y="16" width="2" height="11" fill="#fca5a5" />` },
      squad_at: { border: '#a855f7', text: '#d8b4fe', glyph: `<path d="M17 6L23 13H11L17 6Z" fill="#c084fc" /><rect x="15" y="13" width="4" height="11" fill="#c084fc" /><polygon points="12,27 15,23 19,23 22,27" fill="#e9d5ff" />` },
      squad_support: { border: '#38bdf8', text: '#7dd3fc', glyph: `<rect x="9.5" y="12" width="15" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" /><line x1="9.5" y1="18" x2="24.5" y2="18" stroke="#ffffff" stroke-width="1.2" /><line x1="17" y1="12" x2="17" y2="24" stroke="#ffffff" stroke-width="1.2" />` },
      squad_auto_rifle: { border: '#818cf8', text: '#c7d2fe', glyph: `<rect x="14" y="9" width="6" height="16" rx="1.5" fill="#4f46e5" stroke="#a5b4fc" stroke-width="1.5" /><line x1="8" y1="12" x2="12" y2="12" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="17" x2="12" y2="17" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>` }
    };

    const cfg = roleColors[type] || { border: '#10b981', text: '#6ee7b7', glyph: '<circle cx="17" cy="17" r="6" fill="#10b981" />' };

    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 28px; height: 28px; filter: drop-shadow(0 0 6px rgba(0,0,0,0.9));">
          <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="17" r="15" fill="#111827" stroke="${cfg.border}" stroke-width="2" />
            ${cfg.glyph}
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid ${cfg.border}; 
                    padding: 0px 4px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 9px; font-weight: bold; color: ${cfg.text}; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `;
  }

  // RECON / SNIPER
  if (type === 'recon_unit' || type === 'squad_sniper') {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 28px; height: 28px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="17" r="15" fill="#082138" stroke="#38bdf8" stroke-width="2" />
            <circle cx="17" cy="17" r="8" fill="none" stroke="#38bdf8" stroke-width="1.5" />
            <line x1="17" y1="5" x2="17" y2="29" stroke="#38bdf8" stroke-width="1.4" />
            <line x1="5" y1="17" x2="29" y2="17" stroke="#38bdf8" stroke-width="1.4" />
            <circle cx="17" cy="17" r="1.5" fill="#ffffff" />
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid #38bdf8; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: #7dd3fc; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `;
  }

  // ENEMY INFANTRY
  if (type === 'enemy_inf') {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
        <div style="width: 26px; height: 26px; filter: drop-shadow(0 0 8px rgba(0,0,0,0.9));">
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="18,4 32,18 18,32 4,18" fill="#380d0d" stroke="#ef4444" stroke-width="2.2" />
            <line x1="11" y1="11" x2="25" y2="25" stroke="#fca5a5" stroke-width="2.2" stroke-linecap="round" />
            <line x1="25" y1="11" x2="11" y2="25" stroke="#fca5a5" stroke-width="2.2" stroke-linecap="round" />
            <circle cx="18" cy="18" r="2.5" fill="#ef4444" />
          </svg>
        </div>
        <div style="margin-top: 1px; background: rgba(17, 24, 39, 0.9); border: 1px solid #ef4444; 
                    padding: 0px 5px; border-radius: 2px; font-family: 'JetBrains Mono', monospace; 
                    font-size: 10px; font-weight: bold; color: #fca5a5; white-space: nowrap;">
          ${label}
        </div>
      </div>
    `;
  }

  return `
    <div style="background: #11171b; border: 1.5px solid #f59e0b; padding: 2px 6px; border-radius: 3px; color: #fff; font-size: 11px; font-family: monospace;">
      📍 ${label}
    </div>
  `;
}
