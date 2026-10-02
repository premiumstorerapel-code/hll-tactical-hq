import React from 'react';

/**
 * Authentic Hell Let Loose (HLL) Tactical In-Game Symbols & SVGs
 * Renders official in-game HUD markers for:
 * - Strongpoint / Base Capture Circle (Official HLL chevrons & flag)
 * - Garrison (Fortified bunker with antenna & spawn portal)
 * - Outpost / OP (Radio mast with tripod and radial waves)
 * - Squad Roles: Officer, Machine Gunner, Assault, Anti-Tank, Support, Sniper, Medic, Commander
 * - Armor / Tanks & Supplies
 */

// 1. OFFICIAL HLL BASE / STRONGPOINT CAPTURE BADGE
export function HLLBaseIcon({ size = 32, label = "", team = "neu", isSelected = false, className = "" }) {
  const isAllied = team === "us" || team === "allies";
  const isAxis = team === "ger" || team === "axis";

  const borderColor = isSelected ? "#f59e0b" : isAllied ? "#3b82f6" : isAxis ? "#ef4444" : "#eab308";
  const fillColor = isSelected ? "#2d1f05" : isAllied ? "#0f233a" : isAxis ? "#2d0f0f" : "#1e1e12";
  const iconColor = isSelected ? "#fbbf24" : isAllied ? "#60a5fa" : isAxis ? "#f87171" : "#fef08a";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer Capture Ring */}
      <circle cx="20" cy="20" r="18" fill={fillColor} stroke={borderColor} strokeWidth={isSelected ? "3" : "2"} />
      {isSelected && (
        <circle cx="20" cy="20" r="19.5" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
      )}

      {/* HLL Strongpoint Chevrons (Top & Bottom) */}
      <path d="M14 8L20 12L26 8" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 32L20 28L26 32" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

      {/* Center Flagpole / Star */}
      <line x1="17" y1="13" x2="17" y2="27" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" />
      <polygon points="17,14 25,17.5 17,21" fill={iconColor} stroke={iconColor} strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

// 2. GARRISON (Official In-Game Bunker Badge)
export function HLLGarrisonIcon({ size = 28, className = "", isEnemy = false, isViolating = false }) {
  const primaryColor = isViolating ? "#ef4444" : isEnemy ? "#dc2626" : "#10b981";
  const bgColor = isViolating ? "#450a0a" : isEnemy ? "#2b0d0d" : "#06291e";
  const borderColor = isViolating ? "#f87171" : isEnemy ? "#ef4444" : "#34d399";

  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16.5" fill={bgColor} stroke={borderColor} strokeWidth="2" />
      {isViolating && (
        <circle cx="18" cy="18" r="17.5" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      )}
      <path d="M18 6V11M16 8H20" stroke={primaryColor} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 26L12 14H24L26 26H10Z" fill={primaryColor} fillOpacity="0.25" stroke={primaryColor} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M15 26V20C15 18.3431 16.3431 17 18 17C19.6569 17 21 18.3431 21 20V26" fill={bgColor} stroke={primaryColor} strokeWidth="1.8" />
      <circle cx="18" cy="14" r="1.5" fill="#ffffff" />
    </svg>
  );
}

// 3. OUTPOST / OP (Official Radio Tripod & Transmission Waves)
export function HLLOutpostIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#06291e" stroke="#10b981" strokeWidth="2" />
      <path d="M18 9V27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 27L18 20L22 27" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 12C11 14 11 18 13 20" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M23 12C25 14 25 18 23 20" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 9C7 13 7 21 10 25" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <path d="M26 9C29 13 29 21 26 25" stroke="#34d399" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      <circle cx="18" cy="9" r="2" fill="#ffffff" />
    </svg>
  );
}

// 4. SQUAD ROLES (Official HLL Tactical Emblems)

// Officer / Squad Leader (Star + Chevron)
export function HLLOfficerRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#082b20" stroke="#10b981" strokeWidth="1.8" />
      <polygon points="16,6 18.5,12 25,12.5 20,16.5 21.5,23 16,19.5 10.5,23 12,16.5 7,12.5 13.5,12" fill="#fcd34d" stroke="#f59e0b" strokeWidth="0.8" />
      <path d="M10 26L16 22L22 26" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Machine Gunner (Bipod Gun / Ammo Belt)
export function HLLMachineGunnerRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#2d1c06" stroke="#f59e0b" strokeWidth="1.8" />
      {/* Heavy MG Barrel */}
      <line x1="7" y1="13" x2="25" y2="13" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      {/* Bipod Legs */}
      <line x1="21" y1="14" x2="17" y2="23" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="21" y1="14" x2="25" y2="23" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      {/* Ammo drum */}
      <circle cx="13" cy="17" r="3" fill="#fbbf24" />
    </svg>
  );
}

// Assault (Stick Grenade / Lightning)
export function HLLAssaultRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#311212" stroke="#ef4444" strokeWidth="1.8" />
      {/* Stick Grenade / Stielhandgranate */}
      <rect x="13.5" y="7" width="5" height="8" rx="1.5" fill="#f87171" stroke="#fff" strokeWidth="0.8" />
      <rect x="15" y="15" width="2" height="10" fill="#fca5a5" />
    </svg>
  );
}

// Anti-Tank (Rocket / Warhead)
export function HLLAntiTankRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#201133" stroke="#a855f7" strokeWidth="1.8" />
      {/* Bazooka Rocket */}
      <path d="M16 6L21 12H11L16 6Z" fill="#c084fc" />
      <rect x="14" y="12" width="4" height="10" fill="#c084fc" />
      <polygon points="12,25 14,22 18,22 20,25" fill="#e9d5ff" />
    </svg>
  );
}

// Support (Supply Crate / Wrench)
export function HLLSupportRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#0c1f38" stroke="#38bdf8" strokeWidth="1.8" />
      <rect x="9" y="11" width="14" height="11" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="9" y1="16.5" x2="23" y2="16.5" stroke="#fff" strokeWidth="1" />
      <line x1="16" y1="11" x2="16" y2="22" stroke="#fff" strokeWidth="1" />
    </svg>
  );
}

// Sniper (Telescopic Reticle)
export function HLLSniperRoleIcon({ size = 22, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14.5" fill="#082138" stroke="#38bdf8" strokeWidth="1.8" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="16" y1="5" x2="16" y2="27" stroke="#38bdf8" strokeWidth="1.2" />
      <line x1="5" y1="16" x2="27" y2="16" stroke="#38bdf8" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.5" fill="#fff" />
    </svg>
  );
}

export const HLLReconIcon = HLLSniperRoleIcon;

// Tank Crew (Chassis with Turret)
export function HLLFriendlyArmorIcon({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="30" height="30" rx="6" fill="#06291e" stroke="#10b981" strokeWidth="2" />
      <line x1="18" y1="6" x2="18" y2="16" stroke="#34d399" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="18" cy="18" r="4.5" fill="#047857" stroke="#fff" strokeWidth="1.2" />
      <rect x="10" y="14" width="3.5" height="12" rx="1" fill="#34d399" />
      <rect x="22.5" y="14" width="3.5" height="12" rx="1" fill="#34d399" />
      <rect x="13.5" y="15" width="9" height="10" rx="1.5" fill="#059669" />
    </svg>
  );
}

// Enemy Tank / Armor
export function HLLEnemyArmorIcon({ size = 28, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,3 33,18 18,33 3,18" fill="#380d0d" stroke="#ef4444" strokeWidth="2" />
      <line x1="18" y1="7" x2="18" y2="16" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="18" cy="18" r="4" fill="#f87171" stroke="#fff" strokeWidth="1" />
      <rect x="11" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
      <rect x="22" y="14" width="3" height="12" rx="1" fill="#fca5a5" />
      <rect x="13.5" y="15" width="9" height="10" rx="1.5" fill="#dc2626" />
    </svg>
  );
}

// Artillery Howitzer Cannon Icon
export function HLLArtilleryIcon({ size = 26, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#1b1204" stroke="#f59e0b" strokeWidth="2" />
      {/* Artillery Barrel pointing up-right */}
      <line x1="12" y1="24" x2="25" y2="10" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      {/* Gun Carriage Wheel */}
      <circle cx="13" cy="23" r="5" fill="#2d1d05" stroke="#f59e0b" strokeWidth="1.8" />
      {/* Gun Shield */}
      <line x1="14" y1="16" x2="19" y2="21" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Supplies Icon (Supply Box with ammo count)
export function HLLSuppliesIcon({ size = 24, amount = 50, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#082138" stroke="#38bdf8" strokeWidth="2" />
      <rect x="10" y="12" width="16" height="13" rx="2" fill="#0369a1" stroke="#7dd3fc" strokeWidth="1.5" />
      <line x1="10" y1="18.5" x2="26" y2="18.5" stroke="#fff" strokeWidth="1.2" />
      <line x1="18" y1="12" x2="18" y2="25" stroke="#fff" strokeWidth="1.2" />
      <line x1="18" y1="6" x2="10" y2="12" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <line x1="18" y1="6" x2="26" y2="12" stroke="#7dd3fc" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <circle cx="18" cy="6" r="1.5" fill="#38bdf8" />
    </svg>
  );
}

// Enemy Infantry Icon (Authentic HLL Axis Infantry Diamond)
export function HLLEnemyInfantryIcon({ size = 24, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,4 32,18 18,32 4,18" fill="#380d0d" stroke="#ef4444" strokeWidth="2" />
      <line x1="11" y1="11" x2="25" y2="25" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="11" x2="11" y2="25" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="18" r="2.5" fill="#ef4444" />
    </svg>
  );
}

// HTML generator for Strongpoint / Base Capture Marker on Leaflet
export function getHLLBaseMarkerHTML(poi, isSelected = false) {
  const isAxis = poi.team === 'ger';
  const isAllies = poi.team === 'us';
  const borderColor = isSelected ? '#fbbf24' : isAxis ? '#ef4444' : isAllies ? '#3b82f6' : '#eab308';
  const fillColor = isSelected ? '#331f00' : isAxis ? '#2b0a0a' : isAllies ? '#091c33' : '#1f1e09';
  const iconColor = isSelected ? '#fbbf24' : isAxis ? '#f87171' : isAllies ? '#60a5fa' : '#fef08a';

  return `
    <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 8px rgba(0,0,0,0.85));">
        <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Outer Capture Circle -->
          <circle cx="20" cy="20" r="18" fill="${fillColor}" stroke="${borderColor}" stroke-width="${isSelected ? '2.8' : '2'}" />
          ${isSelected ? `<circle cx="20" cy="20" r="19.5" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 3" />` : ''}
          
          <!-- HLL Capture Chevrons (Top & Bottom & Sides) -->
          <path d="M14 7L20 11L26 7" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14 33L20 29L26 33" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7 14L11 20L7 26" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M33 14L29 20L33 26" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />

          <!-- Center Flag / Emblem -->
          <line x1="17" y1="12" x2="17" y2="28" stroke="${iconColor}" stroke-width="1.8" stroke-linecap="round" />
          <polygon points="17,13 25,17 17,21" fill="${iconColor}" stroke="${iconColor}" stroke-width="0.8" stroke-linejoin="round" />
        </svg>
      </div>

      <!-- Sector Name Badge -->
      <div style="margin-top: 2px; background: ${isSelected ? '#92400e' : '#11171b'}; 
                  border: 1.5px solid ${isSelected ? '#fbbf24' : borderColor}; 
                  padding: 1px 7px; border-radius: 3px; font-family: 'Chakra Petch', sans-serif; 
                  font-size: 11px; font-weight: 800; color: #fff; white-space: nowrap; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.9); text-transform: uppercase; letter-spacing: 0.5px;">
        ${isSelected ? '★ ' : ''}${poi.name}
      </div>
    </div>
  `;
}

// HTML generator for Leaflet map markers
export function getHLLMarkerHTML(type, label, hasViolation = false) {
  // Friendly Garrison
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

  // Friendly Outpost / OP
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

  // Friendly Tank / Armor
  if (type === 'friendly_tank') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #06291e; border: 2px solid #10b981; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(16,185,129,0.5); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="30" height="30" rx="6" fill="#06291e" stroke="#10b981" stroke-width="2.2" />
          <line x1="18" y1="6" x2="18" y2="16" stroke="#34d399" stroke-width="2.4" stroke-linecap="round" />
          <circle cx="18" cy="18" r="4.5" fill="#047857" stroke="#fff" stroke-width="1.2" />
          <rect x="10" y="14" width="3.5" height="12" rx="1" fill="#34d399" />
          <rect x="22.5" y="14" width="3.5" height="12" rx="1" fill="#34d399" />
          <rect x="13.5" y="15" width="9" height="10" rx="1.5" fill="#059669" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  // Recon / Sniper
  if (type === 'recon_unit' || type === 'squad_sniper') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #082138; border: 2px solid #38bdf8; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(56,189,248,0.5); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="#082138" stroke="#38bdf8" stroke-width="2" />
          <circle cx="16" cy="16" r="7" fill="none" stroke="#38bdf8" stroke-width="1.5" />
          <line x1="16" y1="5" x2="16" y2="27" stroke="#38bdf8" stroke-width="1.2" />
          <line x1="5" y1="16" x2="27" y2="16" stroke="#38bdf8" stroke-width="1.2" />
          <circle cx="16" cy="16" r="1.5" fill="#fff" />
        </svg>
        <span>${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Officer (SL)
  if (type === 'squad_officer') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #062b1e; border: 2px solid #10b981; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(16,185,129,0.7); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#082b20" stroke="#10b981" stroke-width="1.8" />
          <polygon points="16,6 18.5,12 25,12.5 20,16.5 21.5,23 16,19.5 10.5,23 12,16.5 7,12.5 13.5,12" fill="#fcd34d" stroke="#f59e0b" stroke-width="0.8" />
          <path d="M10 26L16 22L22 26" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span style="color: #6ee7b7;">${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Machine Gunner (MG)
  if (type === 'squad_mg') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #2b1803; border: 2px solid #f59e0b; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(245,158,11,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#2d1c06" stroke="#f59e0b" stroke-width="1.8" />
          <line x1="7" y1="13" x2="25" y2="13" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" />
          <line x1="21" y1="14" x2="17" y2="23" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" />
          <line x1="21" y1="14" x2="25" y2="23" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="13" cy="17" r="3" fill="#fbbf24" />
        </svg>
        <span style="color: #fde68a;">${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Assault
  if (type === 'squad_assault') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #2e0d0d; border: 2px solid #ef4444; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(239,68,68,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#311212" stroke="#ef4444" stroke-width="1.8" />
          <rect x="13.5" y="7" width="5" height="8" rx="1.5" fill="#f87171" stroke="#fff" stroke-width="0.8" />
          <rect x="15" y="15" width="2" height="10" fill="#fca5a5" />
        </svg>
        <span style="color: #fca5a5;">${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Anti-Tank (AT)
  if (type === 'squad_at') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #220b38; border: 2px solid #a855f7; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(168,85,247,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#201133" stroke="#a855f7" stroke-width="1.8" />
          <path d="M16 6L21 12H11L16 6Z" fill="#c084fc" />
          <rect x="14" y="12" width="4" height="10" fill="#c084fc" />
          <polygon points="12,25 14,22 18,22 20,25" fill="#e9d5ff" />
        </svg>
        <span style="color: #d8b4fe;">${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Support (Suministros)
  if (type === 'squad_support') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #0c1f38; border: 2px solid #38bdf8; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(56,189,248,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#0c1f38" stroke="#38bdf8" stroke-width="1.8" />
          <rect x="9" y="11" width="14" height="11" rx="2" fill="#0284c7" stroke="#38bdf8" stroke-width="1.5" />
          <line x1="9" y1="16.5" x2="23" y2="16.5" stroke="#fff" stroke-width="1" />
          <line x1="16" y1="11" x2="16" y2="22" stroke="#fff" stroke-width="1" />
        </svg>
        <span style="color: #7dd3fc;">${label}</span>
      </div>
    `;
  }

  // SQUAD ROLES: Auto Rifle
  if (type === 'squad_auto_rifle') {
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #1f1b2b; border: 2px solid #818cf8; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(129,140,248,0.6); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14.5" fill="#1f1b2b" stroke="#818cf8" stroke-width="1.8" />
          <line x1="7" y1="15" x2="25" y2="15" stroke="#a5b4fc" stroke-width="2" stroke-linecap="round" />
          <rect x="13" y="15" width="4" height="6" fill="#a5b4fc" />
          <polygon points="7,15 10,21 13,21 11,15" fill="#a5b4fc" />
        </svg>
        <span style="color: #c7d2fe;">${label}</span>
      </div>
    `;
  }

  // Supplies (50 or 100)
  if (type === 'supply_50' || type === 'supply_100') {
    const is100 = type === 'supply_100';
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #082138; border: 2px solid #38bdf8; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(56,189,248,0.5); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <span style="font-size: 13px;">📦</span>
        <span>${label} [${is100 ? '100' : '50'}]</span>
      </div>
    `;
  }

  // Enemy / Axis Markers
  if (type.startsWith('enemy')) {
    const isEnemyTank = type === 'enemy_tank';
    const isEnemyGarrison = type === 'enemy_garrison';
    return `
      <div style="display: flex; align-items: center; gap: 4px; background: #350c0c; border: 2px solid #ef4444; 
                  padding: 2px 6px; border-radius: 4px; box-shadow: 0 0 12px rgba(239,68,68,0.7); font-family: 'JetBrains Mono', monospace; 
                  font-size: 11px; font-weight: bold; color: #fff; cursor: pointer; white-space: nowrap;">
        <span style="color: #ef4444; font-size: 13px;">${isEnemyTank ? '🛡️' : isEnemyGarrison ? '🚩' : '⚠️'}</span>
        <span style="color: #fca5a5;">${label}</span>
      </div>
    `;
  }

  return `
    <div style="background: #11171b; border: 1.5px solid #f59e0b; padding: 2px 6px; border-radius: 3px; color: #fff; font-size: 11px; font-family: monospace;">
      📍 ${label}
    </div>
  `;
}
