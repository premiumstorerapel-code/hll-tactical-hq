import React, { useState } from 'react';
import { Shield, Crosshair } from 'lucide-react';
import { HLLEnemyArmorIcon } from './HLLIcons';

export default function TankCrewHUD({ t }) {
  const [angleDeg, setAngleDeg] = useState(30);
  const baseArmorMm = 100;

  const rad = (angleDeg * Math.PI) / 180;
  const effectiveThickness = Math.round(baseArmorMm / Math.cos(rad));
  const armorBonusPercent = Math.round(((effectiveThickness - baseArmorMm) / baseArmorMm) * 100);

  return (
    <div className="bg-bunker-900 border-b border-bunker-700 p-3 shadow-xl text-slate-200 font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Armor Angling Simulator */}
        <div className="flex items-center space-x-4 bg-bunker-950 p-2 rounded border border-bunker-800">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-bold text-white uppercase tracking-wider font-display">
              {t.armor_angle_calc}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-slate-400">{t.angle_label}</span>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={angleDeg}
              onChange={e => setAngleDeg(Number(e.target.value))}
              className="w-24 accent-emerald-400 h-1.5 rounded cursor-pointer"
            />
            <span className="text-xs font-bold text-tactical-amber w-8">{angleDeg}°</span>
          </div>

          <div className="flex items-center space-x-2 border-l border-bunker-700 pl-3">
            <span className="text-[10px] text-slate-400">{t.effective_armor}</span>
            <span className="text-sm font-display font-bold text-emerald-400">
              {effectiveThickness}mm
            </span>
            <span className="text-[10px] text-emerald-500 font-bold">
              (+{armorBonusPercent}% {t.armor_bonus})
            </span>
          </div>
        </div>

        {/* Tank Matchup Weakspot Intel */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold">{t.weakspots_title}</span>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-300 text-[10px] font-bold">
              {t.tiger_weakspot}
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px] font-bold">
              {t.panther_weakspot}
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-300 text-[10px] font-bold">
              {t.sherman_weakspot}
            </span>
          </div>
        </div>

        {/* Hull-Down Doctrine Badge */}
        <div className="flex items-center space-x-1.5 text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/50">
          <Crosshair className="w-3.5 h-3.5" />
          <span>{t.hull_down_badge}</span>
        </div>

      </div>
    </div>
  );
}
