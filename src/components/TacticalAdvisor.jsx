import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Navigation, 
  CornerDownRight, Compass, Shield, Crosshair, Plus 
} from 'lucide-react';
import { 
  analyzeDefensiveTriangle, 
  analyzeAssaultVectors, 
  analyzeBlindSpots, 
  calculateDistance 
} from '../engine/geometry';
import { HLLGarrisonIcon } from './HLLIcons';
import { sound } from '../utils/audio';

export default function TacticalAdvisor({
  activeDefenseSector,
  activeAttackSector,
  onSelectDefenseSector,
  onSelectAttackSector,
  strongpoints = [],
  markers = [],
  onAcceptSuggestedGarrison,
  mapConfig,
  t
}) {
  const [tab, setTab] = useState('defense'); // 'defense' | 'attack' | 'radar'

  const friendlyGarrisons = markers.filter(m => m.type === 'friendly_garrison');
  const friendlySpawns = markers.filter(m => m.type === 'friendly_garrison' || m.type === 'friendly_op');

  const triangleAnalysis = analyzeDefensiveTriangle(
    activeDefenseSector,
    friendlyGarrisons,
    mapConfig?.widthMeters || 2000,
    mapConfig?.heightMeters || 2000
  );

  const vectorAnalysis = analyzeAssaultVectors(
    activeAttackSector,
    friendlySpawns,
    mapConfig?.points || []
  );

  const blindSpots = analyzeBlindSpots(activeDefenseSector, markers.filter(m => m.team === 'us' || m.type.startsWith('friendly')));

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
              {t.advisor_title}
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            {t.advisor_badge}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          {t.advisor_subtitle}
        </p>
      </div>

      {/* Target Objectives Selector */}
      <div className="p-3 bg-bunker-950/80 border-b border-bunker-800 space-y-2">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center">
            <Shield className="w-3 h-3 mr-1 text-blue-400" /> {t.active_defense_label}
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
            <Crosshair className="w-3 h-3 mr-1 text-red-400" /> {t.active_attack_label}
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
          {t.tab_defense}
        </button>
        <button
          onClick={() => setTab('attack')}
          className={`flex-1 py-2 text-center font-display font-bold tracking-wider text-[11px] border-b-2 transition ${
            tab === 'attack'
              ? 'border-tactical-amber text-tactical-amber bg-bunker-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {t.tab_attack}
        </button>
        <button
          onClick={() => setTab('radar')}
          className={`flex-1 py-2 text-center font-display font-bold tracking-wider text-[11px] border-b-2 transition ${
            tab === 'radar'
              ? 'border-tactical-amber text-tactical-amber bg-bunker-900'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          {t.tab_radar}
        </button>
      </div>

      {/* Advisor Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        
        {/* 200m Rule Violations Alert Banner */}
        {proximityViolations.length > 0 && (
          <div className="bg-red-950/80 border-2 border-red-600 p-3 rounded text-red-200 animate-alert-flash space-y-1.5">
            <div className="flex items-center text-red-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
              {t.violation_title}
            </div>
            {proximityViolations.map((v, i) => (
              <p key={i} className="text-[11px]">
                • <strong className="text-white">{v.g1.name}</strong> y <strong className="text-white">{v.g2.name}</strong> {t.violation_desc} <span className="text-tactical-amber font-bold">{v.distance}m</span> {t.violation_shortfall} {v.deficit}m). {t.violation_block}
              </p>
            ))}
          </div>
        )}

        {/* TAB 1: DEFENSIVE TRIANGLE ALGORITHM */}
        {tab === 'defense' && (
          <div className="space-y-3">
            {triangleAnalysis ? (
              <>
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
                      {t.status_label} {triangleAnalysis.severity === 'CRITICAL' ? 'COLAPSO CRÍTICO' : triangleAnalysis.severity === 'HIGH ALERT' ? 'ALERTA ALTA' : 'ÓPTIMO'}
                    </span>
                    <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-black/40 border border-current">
                      {triangleAnalysis.count} / 2 GUARNICIONES
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {triangleAnalysis.count === 0
                      ? t.collapse_risk
                      : triangleAnalysis.count === 1
                      ? t.vuln_wipe_risk
                      : t.optimal_defense}
                  </p>
                </div>

                {triangleAnalysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-tactical-amber font-bold uppercase tracking-wider flex items-center">
                      <CornerDownRight className="w-3.5 h-3.5 mr-1" />
                      {t.backup_garrisons_title}
                    </div>

                    {triangleAnalysis.suggestions.map((sug, i) => (
                      <div
                        key={sug.id}
                        className="bg-bunker-850 p-2.5 rounded border border-bunker-700 hover:border-tactical-amber transition space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs flex items-center gap-1.5">
                            <HLLGarrisonIcon size={16} />
                            <span>{sug.name}</span>
                          </span>
                          <span className="text-[10px] text-tactical-amber font-bold">
                            {sug.distanceToCap}m ({sug.cardinal})
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
                          <span>{t.btn_accept_deploy}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-bunker-850 p-3 rounded border border-bunker-700 text-slate-300 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {t.garrison_manual_title}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {t.garrison_manual_1}<br />
                    {t.garrison_manual_2}<br />
                    {t.garrison_manual_3}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-slate-500 italic text-center py-4">Selecciona un sector defensivo.</p>
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
                      VECTOR: {vectorAnalysis.isFunneled ? 'EMBUDO DETECTADO' : 'DISPERSO'}
                    </span>
                    <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-black/40 border border-current">
                      ABANICO: {vectorAnalysis.angularSpread}°
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {vectorAnalysis.isFunneled
                      ? `${t.funnel_warning_title} ${t.funnel_warning_desc} ${vectorAnalysis.angularSpread}° (${vectorAnalysis.cardinalApproach}). ${t.funnel_warning_sub}`
                      : t.healthy_vector}
                  </p>
                </div>

                {vectorAnalysis.flankSuggestions && vectorAnalysis.flankSuggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-tactical-amber font-bold uppercase tracking-wider flex items-center">
                      <Navigation className="w-3.5 h-3.5 mr-1" />
                      {t.flank_routes_title}
                    </div>

                    {vectorAnalysis.flankSuggestions.map((flank, idx) => (
                      <div
                        key={idx}
                        className="bg-bunker-850 p-2.5 rounded border border-bunker-700 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">
                            {idx === 0 ? t.flank_left : t.flank_right}
                          </span>
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
                  {t.flank_insufficient}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BLIND SPOT & SCREENING DETECTOR */}
        {tab === 'radar' && (
          <div className="space-y-3">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {t.radar_title}
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
                      {quad.isBlind ? 'CIEGO' : `${quad.count} Spawns`}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-300/90 leading-normal">
                    {quad.isBlind ? t.blind_spot_vuln : t.blind_spot_secured}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-bunker-850 p-3 rounded border border-bunker-700 text-[10px] text-slate-400">
              <span className="text-tactical-amber font-bold block mb-1">{t.recon_warning_title}</span>
              {t.recon_warning_desc}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
