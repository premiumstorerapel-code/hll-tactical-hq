import React, { useState, useEffect } from 'react';
import { 
  Zap, Package, Shield, Radio, Flame, Truck, 
  RotateCcw, AlertOctagon, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function CommanderHUD({
  garrisonsCount = 0,
  onActivateAbility,
  t
}) {
  const [resources, setResources] = useState({
    munitions: 650,
    manpower: 700,
    fuel: 850
  });

  const [nodesActive, setNodesActive] = useState({
    munitions: true,
    manpower: true,
    fuel: true
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setResources(prev => ({
        munitions: Math.min(1000, prev.munitions + (nodesActive.munitions ? 60 : 30)),
        manpower: Math.min(1000, prev.manpower + (nodesActive.manpower ? 60 : 30)),
        fuel: Math.min(1000, prev.fuel + (nodesActive.fuel ? 60 : 30))
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, [nodesActive]);

  const [abilities, setAbilities] = useState([
    {
      id: 'bombing_run',
      nameKey: 'ability_bombing_run',
      descKey: 'ability_bombing_run_desc',
      resourceType: 'munitions',
      cost: 300,
      cooldownSec: 600,
      currentCd: 0,
      icon: Flame,
      color: 'text-red-400 border-red-500/60 bg-red-950/30'
    },
    {
      id: 'supply_drop',
      nameKey: 'ability_supply_drop',
      descKey: 'ability_supply_drop_desc',
      resourceType: 'munitions',
      cost: 100,
      cooldownSec: 120,
      currentCd: 0,
      icon: Package,
      color: 'text-amber-400 border-amber-500/60 bg-amber-950/30'
    },
    {
      id: 'recon_plane',
      nameKey: 'ability_recon_plane',
      descKey: 'ability_recon_plane_desc',
      resourceType: 'munitions',
      cost: 150,
      cooldownSec: 300,
      currentCd: 0,
      icon: Radio,
      color: 'text-cyan-400 border-cyan-500/60 bg-cyan-950/30'
    },
    {
      id: 'airhead',
      nameKey: 'ability_airhead',
      descKey: 'ability_airhead_desc',
      resourceType: 'manpower',
      cost: 400,
      cooldownSec: 600,
      currentCd: 0,
      icon: Zap,
      color: 'text-purple-400 border-purple-500/60 bg-purple-950/30'
    },
    {
      id: 'reinforce',
      nameKey: 'ability_reinforce',
      descKey: 'ability_reinforce_desc',
      resourceType: 'manpower',
      cost: 200,
      cooldownSec: 300,
      currentCd: 0,
      icon: Shield,
      color: 'text-blue-400 border-blue-500/60 bg-blue-950/30'
    },
    {
      id: 'heavy_tank',
      nameKey: 'ability_heavy_tank',
      descKey: 'ability_heavy_tank_desc',
      resourceType: 'fuel',
      cost: 600,
      cooldownSec: 300,
      currentCd: 0,
      icon: Truck,
      color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/30'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAbilities(prev =>
        prev.map(ab => (ab.currentCd > 0 ? { ...ab, currentCd: ab.currentCd - 1 } : ab))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerAbility = (ability) => {
    if (resources[ability.resourceType] < ability.cost) {
      sound.playAlertBeep();
      alert(`RECURSOS INSUFICIENTES: Requiere ${ability.cost} ${ability.resourceType.toUpperCase()}`);
      return;
    }
    if (ability.currentCd > 0) return;

    setResources(prev => ({
      ...prev,
      [ability.resourceType]: prev[ability.resourceType] - ability.cost
    }));

    setAbilities(prev =>
      prev.map(ab => (ab.id === ability.id ? { ...ab, currentCd: ab.cooldownSec } : ab))
    );

    sound.playAbilitySound();
    if (onActivateAbility) {
      onActivateAbility(ability);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-bunker-900 border-b border-bunker-700 p-3 shadow-xl text-slate-200 font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Logistics Resources Bar */}
        <div className="flex items-center space-x-3 bg-bunker-950/80 p-2 rounded border border-bunker-800">
          <div className="text-[11px] font-bold text-slate-400 tracking-wider flex items-center mr-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-tactical-amber" />
            {t.resources}
          </div>

          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-amber-950/30 border border-amber-800/40">
            <span className="text-[10px] text-amber-500 font-bold">{t.munitions}</span>
            <span className="text-sm font-display font-bold text-amber-300">{resources.munitions}</span>
            <span className="text-[9px] text-amber-600">/1000</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-blue-950/30 border border-blue-800/40">
            <span className="text-[10px] text-blue-400 font-bold">{t.manpower}</span>
            <span className="text-sm font-display font-bold text-blue-300">{resources.manpower}</span>
            <span className="text-[9px] text-blue-600">/1000</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-[10px] text-emerald-400 font-bold">{t.fuel}</span>
            <span className="text-sm font-display font-bold text-emerald-300">{resources.fuel}</span>
            <span className="text-[9px] text-emerald-600">/1000</span>
          </div>
        </div>

        {/* Garrison Cap Enforcement */}
        <div className={`flex items-center space-x-2.5 px-3 py-1.5 rounded border transition ${
          garrisonsCount >= 8
            ? 'bg-red-950/60 border-red-600 text-red-300 animate-alert-flash'
            : garrisonsCount >= 6
            ? 'bg-amber-950/40 border-amber-600 text-amber-300'
            : 'bg-bunker-950/80 border-bunker-700 text-slate-300'
        }`}>
          <div className="text-left">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              {t.garrison_limit}
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-display font-black text-white">{garrisonsCount}</span>
              <span className="text-xs font-bold text-slate-400">/ 8</span>
              {garrisonsCount >= 8 && (
                <span className="text-[10px] font-bold text-red-400 bg-red-900/60 px-1 rounded ml-1">
                  {t.cap_reached}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Command Abilities Row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {abilities.map(ab => {
            const Icon = ab.icon;
            const onCooldown = ab.currentCd > 0;
            const canAfford = resources[ab.resourceType] >= ab.cost;
            const abilityName = t[ab.nameKey] || ab.nameKey;
            const abilityDesc = t[ab.descKey] || ab.descKey;

            return (
              <button
                key={ab.id}
                onClick={() => triggerAbility(ab)}
                disabled={onCooldown || !canAfford}
                title={`${abilityName} (${ab.cost} ${ab.resourceType.toUpperCase()}) - ${abilityDesc}`}
                className={`relative px-2.5 py-1.5 rounded border text-left transition flex items-center space-x-2 ${
                  onCooldown
                    ? 'border-bunker-800 bg-bunker-950/60 opacity-60 cursor-not-allowed text-slate-500'
                    : !canAfford
                    ? 'border-bunker-800 bg-bunker-950/80 text-slate-500 cursor-not-allowed'
                    : `${ab.color} hover:brightness-125 cursor-pointer shadow-sm`
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <div>
                  <div className="text-[11px] font-display font-bold leading-none">
                    {abilityName}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {onCooldown ? (
                      <span className="text-tactical-amber font-bold">{formatTime(ab.currentCd)}</span>
                    ) : (
                      <span>{ab.cost} {ab.resourceType.slice(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                {onCooldown && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-tactical-amber/80"
                    style={{ width: `${(ab.currentCd / ab.cooldownSec) * 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
