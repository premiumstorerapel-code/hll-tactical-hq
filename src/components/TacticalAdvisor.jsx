import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Navigation, 
  Eye, CornerDownRight, Compass, Shield, Crosshair, Plus 
} from 'lucide-react';
import { 
  analyzeDefensiveTriangle, 
  analyzeAssaultVectors, 
  analyzeBlindSpots, 
  validateGarrisonPlacement,
  calculateDistance 
} from '../engine/geometry';
import { sound } from '../utils/audio';

export default function TacticalAdvisor({
  activeDefenseSector,
  activeAttackSector,
  onSelectDefenseSector,
  onSelectAttackSector,
  strongpoints = [],
  markers = [],
  onAcceptSuggestedGarrison,
  mapConfig
}) {
  const [tab, setTab] = useState('defense'); // 'defense' | 'attack' | 'radar'

  const friendlyGarrisons = markers.filter(m => m.type === 'friendly_garrison');
  const friendlySpawns = markers.filter(m => m.type === 'friendly_garrison' || m.type === 'friendly_op');

  // 1. Defensive Triangle Analysis
  const triangleAnalysis = analyzeDefensiveTriangle(
    activeDefenseSector,
    friendlyGarrisons,
    mapConfig?.widthMeters || 2000,
    mapConfig?.heightMeters || 2000
  );

  // 2. Assault Vector Analysis
  const vectorAnalysis = analyzeAssaultVectors(
    activeAttackSector,
    friendlySpawns,
    mapConfig?.points || []
  );

  // 3. Blind Spot Analysis
  const blindSpots = analyzeBlindSpots(activeDefenseSector, markers.filter(m => m.team === 'us' || m.type.startsWith('friendly')));

  // 4. Proximity Rule Violations check among all friendly garrisons
  const proximityViolations = [];
  for (let i = 0; i < friendlyGarrisons.length; i++) {
    for (let j = i + 1; j < friendlyGarrisons.length; j++) {
      const g1 = friendlyGarrisons[i];
      const g2 = friendlyGarrisons[j];
      const d = calculateDistance(g1.coordinates, g2.coordinates);
      if (d < 200) {
        proximityViolations.push({
          g1,
          g2,
          distance: Math.round(d),
          deficit: Math.round(200 - d)
        });
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-bunker-900 border-l border-bunker-700 text-slate-200 font-mono text-xs select-none">
      
      {/* Advisor Header */}
      <div className="p-3 bg-bunker-850 border-b border-bunker-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-tactical-amber animate-spin" style={{ animationDuration: '10s' }} />
            <h2 className="font-display font-bold tracking-wider text-sm text-white uppercase">
              TACTICAL ADVISOR
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            DETERMINISTIC AI
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          Real-time geometric analysis & doctrinal advice
        </p>
      </div>

      {/* Target Objectives Selector */}
      <div className="p-3 bg-bunker-950/80 border-b border-bunker-800 space-y-2">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center">
            <Shield className="w-3 h-3 mr-1 text-blue-400" /> Active Defense Objective
          </label>
          <select
            value={activeDefenseSector?.id || ''}
            onChange={e => {
              const sp = strongpoints.find(s => s.id === e.target.value);
              if (sp) onSelectDefenseSector(sp);
            }}
            className="w-full bg-bunker-800 border border-bunker-700 text-slate-200 text-xs p-1.5 rounded focus:border-tactical-amber focus:outline-none"
          >
            {strongpoints.map(sp => (
              <option key={sp.id} value={sp.id}>
                {sp.name} ({sp.team.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center">
            <Crosshair className="w-3 h-3 mr-1 text-red-400" /> Active Assault Objective
          </label>
          <select
            value={activeAttackSector?.id || ''}
            onChange={e => {
              const sp = strongpoints.find(s => s.id === e.target.value);
              if (sp) onSelectAttackSector(sp);
            }}
            className="w-full bg-bunker-800 border border-bunker-700 text-slate-200 text-xs p-1.5 rounded focus:border-tactical-amber focus:outline-none"
          >
            {strongpoints.map(sp => (
              <option key={sp.id} value={sp.id}>
                {sp.name} ({sp.team.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advisor Tabs */}
      <div className="flex border-b border-bunker-800 bg-bunker-950">
        <button
          onClick={() => setTab('defense')}
          className={`flex-1 py-2 text-center font-display font-bold tracking-wider text-[11px] border-b-2 transition ${
            tab === 'defense'
              ? 'border-tactical-amber text-tactical-amber bg-bunker-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          DEFENSE TRIANGLE
        </button>
        <button
          onClick={() => setTab('attack')}
          className={`flex-1 py-2 text-center font-display font-bold tracking-wider text-[11px] border-b-2 transition ${
            tab === 'attack'
              ? 'border-tactical-amber text-tactical-amber bg-bunker-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ASSAULT VECTOR
        </button>
        <button
          onClick={() => setTab('radar')}
          className={`flex-1 py-2 text-center font-display font-bold tracking-wider text-[11px] border-b-2 transition ${
            tab === 'radar'
              ? 'border-tactical-amber text-tactical-amber bg-bunker-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          BLIND SPOTS
        </button>
      </div>

      {/* Advisor Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* 200m Rule Violations Alert Banner (Always Visible if Violation exists) */}
        {proximityViolations.length > 0 && (
          <div className="bg-red-950/80 border-2 border-red-600 p-3 rounded text-red-200 animate-alert-flash space-y-1.5">
            <div className="flex items-center text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
              ILLEGAL 200m GARRISON VIOLATION!
            </div>
            {proximityViolations.map((v, i) => (
              <p key={i} className="text-[11px]">
                • <strong className="text-white">{v.g1.name}</strong> and <strong className="text-white">{v.g2.name}</strong> are only <span className="text-tactical-amber font-bold">{v.distance}m</span> apart (Shortfall: {v.deficit}m). Game engine will block spawn creation!
              </p>
            ))}
          </div>
        )}

        {/* TAB 1: DEFENSIVE TRIANGLE ALGORITHM */}
        {tab === 'defense' && (
          <div className="space-y-3">
            {triangleAnalysis ? (
              <>
                {/* Status Card */}
                <div className={`p-3 rounded border ${
                  triangleAnalysis.severity === 'CRITICAL'
                    ? 'bg-red-950/40 border-red-700/80 text-red-200'
                    : triangleAnalysis.severity === 'HIGH ALERT'
                    ? 'bg-amber-950/40 border-amber-700/80 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold uppercase text-xs flex items-center">
                      {triangleAnalysis.isVulnerable ? (
                        <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                      )}
                      STATUS: {triangleAnalysis.severity}
                    </span>
                    <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-black/40 border border-current">
                      {triangleAnalysis.count} / 2 GARRISONS
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {triangleAnalysis.message}
                  </p>
                </div>

                {/* Algorithmic Suggestions */}
                {triangleAnalysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-tactical-amber font-bold uppercase tracking-wider flex items-center">
                      <CornerDownRight className="w-3.5 h-3.5 mr-1" />
                      Calculated Backup Garrisons (Safe Blue Zone):
                    </div>

                    {triangleAnalysis.suggestions.map((sug, i) => (
                      <div
                        key={sug.id}
                        className="bg-bunker-850 p-2.5 rounded border border-bunker-700 hover:border-tactical-amber transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{sug.name}</span>
                          <span className="text-[10px] text-tactical-amber font-bold">
                            {sug.distanceToCap}m {sug.cardinal}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {sug.reason}
                        </p>
                        <button
                          onClick={() => {
                            sound.playRadioClick();
                            onAcceptSuggestedGarrison(sug);
                          }}
                          className="w-full py-1 px-2 bg-tactical-amber/20 hover:bg-tactical-amber text-tactical-amber hover:text-black border border-tactical-amber font-display font-bold text-[10px] uppercase tracking-wider rounded transition flex items-center justify-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Accept & Deploy to Map</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Doctrinal Advice Box */}
                <div className="bg-bunker-850 p-3 rounded border border-bunker-700 text-slate-300 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Garrison Doctrine Manual:
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    • Never place the only garrison inside the capture circle (easy target for bombing run).<br />
                    • Build a triangle of 3 garrisons ~200m apart surrounding the sector.<br />
                    • Blue zone garrisons only require 50 supplies (1 support drop).
                  </p>
                </div>
              </>
            ) : (
              <p className="text-slate-500 italic text-center py-4">Select a defensive sector to evaluate.</p>
            )}
          </div>
        )}

        {/* TAB 2: ASSAULT VECTOR / CHOKEPOINT ANALYZER */}
        {tab === 'attack' && (
          <div className="space-y-3">
            {vectorAnalysis && vectorAnalysis.status !== 'INSUFFICIENT_DATA' ? (
              <>
                <div className={`p-3 rounded border ${
                  vectorAnalysis.isFunneled
                    ? 'bg-red-950/40 border-red-700/80 text-red-200'
                    : 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-bold uppercase text-xs flex items-center">
                      {vectorAnalysis.isFunneled ? (
                        <AlertTriangle className="w-4 h-4 mr-1.5 text-red-400 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400" />
                      )}
                      VECTOR: {vectorAnalysis.status}
                    </span>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-black/40 border border-current">
                      SPREAD: {vectorAnalysis.angularSpread}°
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {vectorAnalysis.message}
                  </p>
                </div>

                {/* Flank Corridors Suggestions */}
                {vectorAnalysis.flankSuggestions && vectorAnalysis.flankSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-tactical-amber font-bold uppercase tracking-wider flex items-center">
                      <Navigation className="w-3.5 h-3.5 mr-1" />
                      Recommended 90° Flanking Routes:
                    </div>

                    {vectorAnalysis.flankSuggestions.map((flank, idx) => (
                      <div
                        key={idx}
                        className="bg-bunker-850 p-2.5 rounded border border-bunker-700 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{flank.side}</span>
                          <span className="text-[10px] text-cyan-400 font-bold">Vector: {flank.angle}°</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          {flank.doctrine}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-bunker-850 p-4 rounded border border-bunker-700 text-center text-slate-400 space-y-2">
                <Crosshair className="w-8 h-8 text-tactical-amber mx-auto opacity-50" />
                <p className="text-xs">
                  {vectorAnalysis ? vectorAnalysis.message : "Select active attack objective"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BLIND SPOT & SCREENING DETECTOR */}
        {tab === 'radar' && (
          <div className="space-y-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              360° Sector Screening Radar (300m Radius):
            </div>

            <div className="grid grid-cols-2 gap-2">
              {blindSpots.map((quad, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded border text-left space-y-1 transition ${
                    quad.isBlind
                      ? 'bg-red-950/40 border-red-700 text-red-200'
                      : 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs flex items-center">
                      <span className="text-sm mr-1 font-mono">{quad.icon}</span>
                      {quad.quadrant}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40">
                      {quad.isBlind ? 'BLIND' : `${quad.count} Spawns`}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-300/90 leading-normal">
                    {quad.threatAssessment}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-bunker-850 p-3 rounded border border-bunker-700 text-[10px] text-slate-400">
              <span className="text-tactical-amber font-bold block mb-1">RECON INFILTRATION WARNING:</span>
              Enemy sniper teams systematically exploit unmonitored quadrants to establish stealth OPs in your rear artillery batteries. Ensure all 4 quadrants have active screening!
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
