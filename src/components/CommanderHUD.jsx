import React, { useState, useEffect } from 'react';
import { 
  Zap, Package, Shield, Radio, Flame, Truck, 
  RotateCcw, AlertOctagon, TrendingUp, CheckCircle2 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function CommanderHUD({
  garrisonsCount = 0,
  onActivateAbility,
  onDismantleGarrisonAlert
}) {
  // Resources state (default starting pool)
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

  // Resource income tick (+30/min default + 30/min per active node)
  useEffect(() => {
    const timer = setInterval(() => {
      setResources(prev => ({
        munitions: Math.min(1000, prev.munitions + (nodesActive.munitions ? 60 : 30)),
        manpower: Math.min(1000, prev.manpower + (nodesActive.manpower ? 60 : 30)),
        fuel: Math.min(1000, prev.fuel + (nodesActive.fuel ? 60 : 30))
      }));
    }, 60000); // every minute
    return () => clearInterval(timer);
  }, [nodesActive]);

  // Abilities definition
  const [abilities, setAbilities] = useState([
    {
      id: 'bombing_run',
      name: 'Bombing Run',
      resourceType: 'munitions',
      cost: 300,
      cooldownSec: 600, // 10 min
      currentCd: 0,
      icon: Flame,
      color: 'text-red-400 border-red-500/60 bg-red-950/30',
      description: 'Lays down an explosive corridor that annihilates all infantry and garrisons in path.'
    },
    {
      id: 'supply_drop',
      name: 'Supply Drop',
      resourceType: 'munitions',
      cost: 100,
      cooldownSec: 120, // 2 min
      currentCd: 0,
      icon: Package,
      color: 'text-amber-400 border-amber-500/60 bg-amber-950/30',
      description: 'Drops 100 supplies by parachute at selected map coordinate for garrisons/defenses.'
    },
    {
      id: 'recon_plane',
      name: 'Recon Plane',
      resourceType: 'munitions',
      cost: 150,
      cooldownSec: 300, // 5 min
      currentCd: 0,
      icon: Radio,
      color: 'text-cyan-400 border-cyan-500/60 bg-cyan-950/30',
      description: 'High-altitude flyover revealing enemy infantry, vehicles, and active outposts on HUD.'
    },
    {
      id: 'airhead',
      name: 'Airhead Spawn',
      resourceType: 'manpower',
      cost: 400,
      cooldownSec: 600, // 10 min
      currentCd: 0,
      icon: Zap,
      color: 'text-purple-400 border-purple-500/60 bg-purple-950/30',
      description: 'Temporary 2.5-minute stealth spawn point dropped in enemy territory for surprise flanks.'
    },
    {
      id: 'reinforce',
      name: 'Reinforce Sector',
      resourceType: 'manpower',
      cost: 200,
      cooldownSec: 300, // 5 min
      currentCd: 0,
      icon: Shield,
      color: 'text-blue-400 border-blue-500/60 bg-blue-950/30',
      description: 'Doubles the defensive capture weight of all friendly troops inside active strongpoint.'
    },
    {
      id: 'heavy_tank',
      name: 'Heavy Tank Spawn',
      resourceType: 'fuel',
      cost: 600,
      cooldownSec: 300, // 5 min
      currentCd: 0,
      icon: Truck,
      color: 'text-emerald-400 border-emerald-500/60 bg-emerald-950/30',
      description: 'Dispatches Tiger I / 76mm Jumbo Tank to designated HQ vehicle depot.'
    }
  ]);

  // Cooldown countdown tick
  useEffect(() => {
    const interval = setInterval(() => {
      setAbilities(prev =>
        prev.map(ab => (ab.currentCd > 0 ? { ...ab, currentCd: ab.currentCd - 1 } : ab))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerAbility = (ability) => {
    // Check cost
    if (resources[ability.resourceType] < ability.cost) {
      sound.playAlertBeep();
      alert(`INSUFFICIENT RESOURCES: Requires ${ability.cost} ${ability.resourceType.toUpperCase()}`);
      return;
    }
    if (ability.currentCd > 0) {
      return;
    }

    // Deduct
    setResources(prev => ({
      ...prev,
      [ability.resourceType]: prev[ability.resourceType] - ability.cost
    }));

    // Set CD
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
            RESOURCES:
          </div>

          {/* Munitions */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-amber-950/30 border border-amber-800/40">
            <span className="text-[10px] text-amber-500 font-bold">MUN</span>
            <span className="text-sm font-display font-bold text-amber-300">{resources.munitions}</span>
            <span className="text-[9px] text-amber-600">/1000</span>
          </div>

          {/* Manpower */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-blue-950/30 border border-blue-800/40">
            <span className="text-[10px] text-blue-400 font-bold">MAN</span>
            <span className="text-sm font-display font-bold text-blue-300">{resources.manpower}</span>
            <span className="text-[9px] text-blue-600">/1000</span>
          </div>

          {/* Fuel */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-emerald-950/30 border border-emerald-800/40">
            <span className="text-[10px] text-emerald-400 font-bold">FUEL</span>
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
              Team Garrison Limit
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-display font-black text-white">{garrisonsCount}</span>
              <span className="text-xs font-bold text-slate-400">/ 8</span>
              {garrisonsCount >= 8 && (
                <span className="text-[10px] font-bold text-red-400 bg-red-900/60 px-1 rounded ml-1">
                  CAP REACHED
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

            return (
              <button
                key={ab.id}
                onClick={() => triggerAbility(ab)}
                disabled={onCooldown || !canAfford}
                title={`${ab.name} (${ab.cost} ${ab.resourceType.toUpperCase()}) - ${ab.description}`}
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
                    {ab.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {onCooldown ? (
                      <span className="text-tactical-amber font-bold">{formatTime(ab.currentCd)}</span>
                    ) : (
                      <span>{ab.cost} {ab.resourceType.slice(0, 3).toUpperCase()}</span>
                    )}
                  </div>
                </div>

                {/* Cooldown progress indicator overlay */}
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
