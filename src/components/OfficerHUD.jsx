import React, { useState, useEffect } from 'react';
import { 
  Radio, Clock, Compass, Shield, Users, 
  AlertCircle, CheckCircle2, ChevronRight, Volume2 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function OfficerHUD({
  activeOp,
  onPlaceOpRequest,
  selectedSupplyZone = 'blue' // 'blue' or 'red'
}) {
  const [opTimer, setOpTimer] = useState(0); // 0 = ready, >0 = cooling down
  const [squadDoctrine, setSquadDoctrine] = useState('fire_maneuver');

  // 120s timer countdown
  useEffect(() => {
    let interval = null;
    if (opTimer > 0) {
      interval = setInterval(() => {
        setOpTimer(prev => {
          if (prev <= 1) {
            sound.playOpReadyChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [opTimer]);

  const handleDeployOp = () => {
    if (opTimer > 0) return;
    setOpTimer(120); // 120 seconds cooldown
    sound.playRadioClick();
    if (onPlaceOpRequest) {
      onPlaceOpRequest();
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-bunker-900 border-b border-bunker-700 p-3 shadow-xl text-slate-200 font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* OP (Outpost) 120s Cooldown Engine */}
        <div className="flex items-center space-x-3 bg-bunker-950 p-2 rounded border border-bunker-800">
          <div className="relative">
            <button
              onClick={handleDeployOp}
              disabled={opTimer > 0}
              className={`px-3 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow ${
                opTimer > 0
                  ? 'bg-bunker-800 border border-bunker-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse border border-emerald-400'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>{opTimer > 0 ? `OP COOLDOWN (${formatTimer(opTimer)})` : 'DEPLOY SQUAD OP (READY)'}</span>
            </button>

            {opTimer === 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div className="text-[10px] text-slate-400 hidden sm:block">
            {activeOp ? (
              <span className="text-emerald-400 font-bold">OP ACTIVE ON MAP</span>
            ) : (
              <span className="text-amber-400">NO ACTIVE OP PLACED</span>
            )}
          </div>
        </div>

        {/* Blue Zone vs Red Zone Supply Validator */}
        <div className="flex items-center space-x-2 bg-bunker-950/80 p-2 rounded border border-bunker-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Garrison Supply Rule:
          </span>
          <div className="flex items-center space-x-1.5 text-xs">
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
              selectedSupplyZone === 'blue'
                ? 'bg-blue-950 border-blue-500 text-blue-300'
                : 'bg-bunker-900 border-bunker-700 text-slate-500'
            }`}>
              BLUE ZONE (50 Supplies)
            </span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
              selectedSupplyZone === 'red'
                ? 'bg-red-950 border-red-500 text-red-300'
                : 'bg-bunker-900 border-bunker-700 text-slate-500'
            }`}>
              RED ZONE (100 Supplies)
            </span>
          </div>
        </div>

        {/* Squad Tactical Doctrine (Fire & Maneuver) */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Squad Doctrine:</span>
          <div className="flex items-center space-x-1">
            {[
              { id: 'fire_maneuver', label: 'Fire & Maneuver (MG Base + Flank)' },
              { id: 'recon_hunt', label: 'Garrison Hunter (Stealth)' },
              { id: 'point_defense', label: 'Hard Point Fortification' }
            ].map(doc => (
              <button
                key={doc.id}
                onClick={() => setSquadDoctrine(doc.id)}
                className={`px-2.5 py-1 text-[11px] rounded border transition ${
                  squadDoctrine === doc.id
                    ? 'border-tactical-amber bg-tactical-amber/20 text-tactical-amber font-bold'
                    : 'border-bunker-800 bg-bunker-950 text-slate-400 hover:text-white'
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
