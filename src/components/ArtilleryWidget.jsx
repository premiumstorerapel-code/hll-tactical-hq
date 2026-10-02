import React, { useState, useEffect } from 'react';
import { Target, Crosshair, ChevronDown, ChevronUp, Clock, Volume2, ShieldAlert, Sparkles, X } from 'lucide-react';
import { calculateFiringSolution, FACTION_ARTY_SPECS } from '../engine/artillery';
import { sound } from '../utils/audio';

export default function ArtilleryWidget({
  activeTarget,
  activeBattery,
  batteries = [],
  onSelectBattery,
  onClearTarget,
  isCollapsed,
  onToggleCollapse
}) {
  const [faction, setFaction] = useState('US');
  const [manualDistance, setManualDistance] = useState(800);
  const [inputMode, setInputMode] = useState('map'); // 'map' or 'manual'
  const [firingTimer, setFiringTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // Compute firing solution
  const currentTargetPos = activeTarget ? activeTarget.coordinates : null;
  const currentBatteryPos = activeBattery ? activeBattery.coordinates : null;

  const solution = calculateFiringSolution(
    inputMode === 'manual' ? manualDistance : 0,
    faction,
    currentBatteryPos,
    currentTargetPos
  );

  // Countdown timer for flight time
  useEffect(() => {
    let interval = null;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            sound.playAlertBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleFireMission = () => {
    sound.playArtyFire();
    setCountdown(Math.round(solution.flightTimeSeconds));
  };

  return (
    <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700/80 shadow-2xl rounded-sm text-slate-200 w-80 overflow-hidden font-mono text-xs">
      
      {/* Widget Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-bunker-850 border-b border-bunker-700">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-tactical-amber animate-pulse" />
          <span className="font-display font-bold tracking-wider text-white text-sm">
            ARTILLERY BALLISTICS
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-bunker-700 transition"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="p-3.5 space-y-3">
          {/* Faction Selector */}
          <div className="flex items-center space-x-1 bg-bunker-950 p-1 rounded border border-bunker-700">
            {Object.keys(FACTION_ARTY_SPECS).map(fKey => (
              <button
                key={fKey}
                onClick={() => setFaction(fKey)}
                className={`flex-1 py-1 text-center font-bold tracking-wider rounded transition ${
                  faction === fKey
                    ? 'bg-tactical-amber text-black'
                    : 'text-slate-400 hover:text-white hover:bg-bunker-800'
                }`}
              >
                {fKey}
              </button>
            ))}
          </div>

          {/* Mode Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setInputMode('map')}
              className={`flex-1 py-1 px-2 border rounded flex items-center justify-center space-x-1.5 transition ${
                inputMode === 'map'
                  ? 'border-tactical-amber text-tactical-amber bg-tactical-amber/10'
                  : 'border-bunker-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Map Targeting</span>
            </button>
            <button
              onClick={() => setInputMode('manual')}
              className={`flex-1 py-1 px-2 border rounded flex items-center justify-center space-x-1.5 transition ${
                inputMode === 'manual'
                  ? 'border-tactical-amber text-tactical-amber bg-tactical-amber/10'
                  : 'border-bunker-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Manual Range</span>
            </button>
          </div>

          {/* Map Mode Battery Selection */}
          {inputMode === 'map' ? (
            <div className="space-y-2 bg-bunker-950/60 p-2.5 rounded border border-bunker-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Active Battery:</span>
                <span className="text-tactical-amber font-bold truncate max-w-[140px]">
                  {activeBattery ? activeBattery.name : 'Select Battery'}
                </span>
              </div>

              {batteries.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {batteries.slice(0, 3).map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => onSelectBattery(b)}
                      className={`p-1 text-center truncate rounded border text-[10px] ${
                        activeBattery?.id === b.id
                          ? 'border-tactical-amber bg-tactical-amber/20 text-tactical-amber font-bold'
                          : 'border-bunker-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      Gun #{i + 1}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 italic">No friendly artillery batteries detected on map.</p>
              )}

              {/* Target info */}
              <div className="flex items-center justify-between pt-1 border-t border-bunker-800 text-[11px]">
                <span className="text-slate-400">Target:</span>
                {activeTarget ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-red-400 font-bold truncate max-w-[120px]">
                      {activeTarget.name || 'Custom Target'}
                    </span>
                    <button onClick={onClearTarget} className="text-slate-500 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Click map or POI</span>
                )}
              </div>
            </div>
          ) : (
            /* Manual Distance Slider */
            <div className="space-y-1.5 bg-bunker-950/60 p-2.5 rounded border border-bunker-800">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Target Range:</span>
                <span className="text-tactical-amber font-bold text-sm">{manualDistance} m</span>
              </div>
              <input
                type="range"
                min="100"
                max="1600"
                step="5"
                value={manualDistance}
                onChange={e => setManualDistance(Number(e.target.value))}
                className="w-full accent-tactical-amber bg-bunker-800 h-1.5 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>100m</span>
                <span>800m</span>
                <span>1600m</span>
              </div>
            </div>
          )}

          {/* Solution Readout (Big MIL Display) */}
          <div className="bg-bunker-950 p-3 rounded border-2 border-bunker-700 text-center relative overflow-hidden">
            <div className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">
              Required Elevation
            </div>

            <div className="flex items-center justify-center space-x-2">
              <span className={`text-3xl font-display font-black tracking-tight ${solution.inRange ? 'text-tactical-amber' : 'text-red-500'}`}>
                {solution.inRange ? `${solution.mil}` : '---'}
              </span>
              <span className="text-sm font-bold text-slate-400">MIL</span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] text-slate-300 border-t border-bunker-800 pt-2">
              <div>
                <span className="text-slate-500 block">Distance</span>
                <span className="font-bold text-white">{solution.distance} m</span>
              </div>
              <div>
                <span className="text-slate-500 block">Azimuth</span>
                <span className="font-bold text-white">
                  {solution.azimuth !== null ? `${solution.azimuth}°` : '---'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Time of Flight</span>
                <span className="font-bold text-cyan-400">{solution.flightTimeSeconds} s</span>
              </div>
            </div>

            {!solution.inRange && (
              <div className="mt-2 py-0.5 px-2 bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-bold rounded">
                {solution.status}
              </div>
            )}
          </div>

          {/* Fire Mission Button & Projectile Flight Simulation */}
          <div className="space-y-2">
            <button
              onClick={handleFireMission}
              disabled={!solution.inRange || countdown > 0}
              className={`w-full py-2 px-3 rounded font-display font-bold uppercase tracking-wider text-xs transition flex items-center justify-center space-x-2 shadow ${
                !solution.inRange || countdown > 0
                  ? 'bg-bunker-800 text-slate-500 cursor-not-allowed border border-bunker-700'
                  : 'bg-tactical-amber hover:bg-tactical-amber-glow text-black font-black'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>{countdown > 0 ? `SHELL IN FLIGHT (${countdown}s)` : 'FIRE TEST SALVO'}</span>
            </button>

            {countdown > 0 && (
              <div className="w-full bg-bunker-950 rounded-full h-1.5 overflow-hidden border border-bunker-700">
                <div
                  className="bg-cyan-400 h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((solution.flightTimeSeconds - countdown) / solution.flightTimeSeconds) * 100}%`
                  }}
                />
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
