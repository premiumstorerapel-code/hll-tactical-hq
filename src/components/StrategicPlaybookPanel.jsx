import React, { useState } from 'react';
import { 
  Shield, Crosshair, Target, Truck, AlertTriangle, 
  ChevronRight, Compass, Eye, Check, Layers, Play 
} from 'lucide-react';
import { 
  HLLGarrisonIcon, HLLFriendlyArmorIcon, HLLReconIcon 
} from './HLLIcons';
import { sound } from '../utils/audio';

export default function StrategicPlaybookPanel({
  selectedBase,
  operationMode, // 'attack' | 'defense'
  setOperationMode,
  strategy,
  layerFilters,
  setLayerFilters,
  onDeployStrategyToMap,
  strongpoints = [],
  onSelectBase,
  t
}) {
  const currentPlan = operationMode === 'attack' ? strategy?.attack : strategy?.defense;

  const toggleLayer = (layerKey) => {
    sound.playRadioClick();
    setLayerFilters(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  return (
    <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700/80 shadow-2xl rounded text-slate-200 font-mono text-xs overflow-hidden max-w-md w-full">
      
      {/* Header with Base Selector */}
      <div className="p-3 bg-bunker-850 border-b border-bunker-700 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tactical-amber animate-pulse" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
              INTELIGENCIA TÁCTICA DE BASE
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            GUÍA DE POSICIONAMIENTO
          </span>
        </div>

        {/* Base Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Base / Sector:</span>
          <select
            value={selectedBase?.id || ''}
            onChange={e => {
              const sp = strongpoints.find(s => s.id === e.target.value);
              if (sp) onSelectBase(sp);
            }}
            className="flex-1 bg-bunker-950 border border-bunker-700 text-tactical-amber font-bold text-xs p-1.5 rounded focus:outline-none"
          >
            {strongpoints.map(sp => (
              <option key={sp.id} value={sp.id}>
                {sp.name} ({sp.team.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Operation Mode Toggle: ATACAR vs DEFENDER */}
        <div className="grid grid-cols-2 gap-1.5 bg-bunker-950 p-1 rounded border border-bunker-700">
          <button
            onClick={() => {
              setOperationMode('attack');
              sound.playRadioClick();
            }}
            className={`py-1.5 px-3 rounded font-display font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 ${
              operationMode === 'attack'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>¿CÓMO ATACAR?</span>
          </button>

          <button
            onClick={() => {
              setOperationMode('defense');
              sound.playRadioClick();
            }}
            className={`py-1.5 px-3 rounded font-display font-black text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5 ${
              operationMode === 'defense'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>¿CÓMO DEFENDER?</span>
          </button>
        </div>
      </div>

      {/* Layer Filters on Map */}
      <div className="px-3 py-2 bg-bunker-950/70 border-b border-bunker-800 flex items-center justify-between text-[11px] flex-wrap gap-1">
        <span className="text-slate-400 font-bold uppercase text-[10px] mr-1 flex items-center">
          <Layers className="w-3 h-3 mr-1 text-tactical-amber" /> Mostrar en Mapa:
        </span>

        <button
          onClick={() => toggleLayer('garrisons')}
          className={`px-2 py-0.5 rounded border text-[10px] font-bold transition flex items-center space-x-1 ${
            layerFilters.garrisons
              ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
              : 'border-bunker-700 text-slate-500 opacity-60'
          }`}
        >
          <span>🛡️ Garries ({currentPlan?.garrisons?.length || 0})</span>
        </button>

        <button
          onClick={() => toggleLayer('mgs')}
          className={`px-2 py-0.5 rounded border text-[10px] font-bold transition flex items-center space-x-1 ${
            layerFilters.mgs
              ? 'border-amber-500 bg-amber-950/60 text-amber-300'
              : 'border-bunker-700 text-slate-500 opacity-60'
          }`}
        >
          <span>💥 MGs ({currentPlan?.mgSpots?.length || 0})</span>
        </button>

        <button
          onClick={() => toggleLayer('snipers')}
          className={`px-2 py-0.5 rounded border text-[10px] font-bold transition flex items-center space-x-1 ${
            layerFilters.snipers
              ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300'
              : 'border-bunker-700 text-slate-500 opacity-60'
          }`}
        >
          <span>🎯 Snipers ({currentPlan?.sniperSpots?.length || 0})</span>
        </button>

        <button
          onClick={() => toggleLayer('tanks')}
          className={`px-2 py-0.5 rounded border text-[10px] font-bold transition flex items-center space-x-1 ${
            layerFilters.tanks
              ? 'border-blue-500 bg-blue-950/60 text-blue-300'
              : 'border-bunker-700 text-slate-500 opacity-60'
          }`}
        >
          <span>🚜 Tanques ({currentPlan?.tankSpots?.length || 0})</span>
        </button>

        <button
          onClick={() => toggleLayer('mines')}
          className={`px-2 py-0.5 rounded border text-[10px] font-bold transition flex items-center space-x-1 ${
            layerFilters.mines
              ? 'border-red-500 bg-red-950/60 text-red-300'
              : 'border-bunker-700 text-slate-500 opacity-60'
          }`}
        >
          <span>🛑 Minas AT ({currentPlan?.atMines?.length || 0})</span>
        </button>
      </div>

      {/* Plan Details Body */}
      <div className="p-3.5 space-y-3 max-h-[360px] overflow-y-auto">
        
        {/* Doctrinal Summary Card */}
        <div className={`p-2.5 rounded border ${
          operationMode === 'attack'
            ? 'bg-red-950/30 border-red-800/60 text-red-200'
            : 'bg-blue-950/30 border-blue-800/60 text-blue-200'
        }`}>
          <div className="font-display font-bold text-xs uppercase mb-1 flex items-center">
            {operationMode === 'attack' ? <Crosshair className="w-3.5 h-3.5 mr-1" /> : <Shield className="w-3.5 h-3.5 mr-1" />}
            {currentPlan?.title}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {currentPlan?.summary}
          </p>
        </div>

        {/* Hotspots Breakdown List */}
        <div className="space-y-2">
          
          {/* Optimal Garrisons */}
          {currentPlan?.garrisons?.length > 0 && (
            <div className="bg-bunker-950/80 p-2 rounded border border-bunker-800 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                🛡️ Guarniciones Óptimas Recomendadas:
              </span>
              {currentPlan.garrisons.map((g, idx) => (
                <div key={idx} className="bg-bunker-850 p-1.5 rounded border border-bunker-700 text-[11px]">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{g.name}</span>
                    <span className="text-[9px] text-emerald-400 px-1 rounded bg-black/40">~180-200m</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{g.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Machine Gun Nests */}
          {currentPlan?.mgSpots?.length > 0 && (
            <div className="bg-bunker-950/80 p-2 rounded border border-bunker-800 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                💥 Nidos de Ametralladora (MG) con Bípode:
              </span>
              {currentPlan.mgSpots.map((mg, idx) => (
                <div key={idx} className="bg-bunker-850 p-1.5 rounded border border-bunker-700 text-[11px]">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{mg.name}</span>
                    <span className="text-[9px] text-amber-400 px-1 rounded bg-black/40">Arco {mg.coneSpread}°</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{mg.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Sniper & Recon Towers */}
          {currentPlan?.sniperSpots?.length > 0 && (
            <div className="bg-bunker-950/80 p-2 rounded border border-bunker-800 space-y-1.5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                🎯 Posición de Francotirador / Recon en Altura:
              </span>
              {currentPlan.sniperSpots.map((sn, idx) => (
                <div key={idx} className="bg-bunker-850 p-1.5 rounded border border-bunker-700 text-[11px]">
                  <div className="font-bold text-white">{sn.name}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sn.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tanks Hull-Down Positions */}
          {currentPlan?.tankSpots?.length > 0 && (
            <div className="bg-bunker-950/80 p-2 rounded border border-bunker-800 space-y-1.5">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                🚜 Posición de Tanque (Casco Oculto / Hull-Down):
              </span>
              {currentPlan.tankSpots.map((tk, idx) => (
                <div key={idx} className="bg-bunker-850 p-1.5 rounded border border-bunker-700 text-[11px]">
                  <div className="font-bold text-white">{tk.name}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tk.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* AT Mines Bottlenecks */}
          {currentPlan?.atMines?.length > 0 && (
            <div className="bg-bunker-950/80 p-2 rounded border border-bunker-800 space-y-1.5">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                🛑 Trampa de Minas Antitanque y Emboscada AT:
              </span>
              {currentPlan.atMines.map((m, idx) => (
                <div key={idx} className="bg-bunker-850 p-1.5 rounded border border-bunker-700 text-[11px]">
                  <div className="font-bold text-white">{m.name}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.description}</p>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Action Footer: 1-Click Deploy to Map */}
      <div className="p-3 bg-bunker-850 border-t border-bunker-700 flex items-center justify-between">
        <button
          onClick={() => onDeployStrategyToMap(currentPlan)}
          className="w-full py-2 px-3 bg-tactical-amber hover:bg-tactical-amber-glow text-black font-display font-black text-xs uppercase tracking-wider rounded transition flex items-center justify-center space-x-2 shadow-lg"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>DESPLEGAR TODAS LAS POSICIONES AL MAPA</span>
        </button>
      </div>

    </div>
  );
}
