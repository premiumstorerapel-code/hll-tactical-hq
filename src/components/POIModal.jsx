import React from 'react';
import { Shield, Crosshair, Eye, AlertTriangle, X, Compass, MapPin } from 'lucide-react';
import { getGridKeypad } from '../engine/geometry';

export default function POIModal({ poi, mapConfig, onClose, onTargetWithArty }) {
  if (!poi) return null;

  const typeColors = {
    building: "border-blue-500/60 bg-blue-950/40 text-blue-400",
    chokepoint: "border-red-500/60 bg-red-950/40 text-red-400",
    route: "border-emerald-500/60 bg-emerald-950/40 text-emerald-400",
    hill: "border-amber-500/60 bg-amber-950/40 text-amber-400",
    strongpoint: "border-yellow-500/60 bg-yellow-950/40 text-yellow-400",
    artillery: "border-purple-500/60 bg-purple-950/40 text-purple-400"
  };

  const typeLabels = {
    building: "FORTIFIED STRUCTURE",
    chokepoint: "CRITICAL CHOKEPOINT",
    route: "CONCEALED FLANK ROUTE",
    hill: "ELEVATED VANTAGE / HULL-DOWN",
    strongpoint: "SECTOR STRONGPOINT",
    artillery: "ARTILLERY BATTERY"
  };

  const gridRef = getGridKeypad(poi.coordinates, mapConfig.widthMeters, mapConfig.heightMeters);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-bunker-900 border-2 border-bunker-700 shadow-2xl rounded-sm overflow-hidden text-slate-200">
        
        {/* Top Header Banner */}
        <div className="flex items-center justify-between px-5 py-3 bg-bunker-850 border-b border-bunker-700">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider rounded border ${typeColors[poi.type] || typeColors.building}`}>
              {typeLabels[poi.type] || poi.type.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-tactical-amber" />
              {gridRef} ({Math.round(poi.coordinates[0])}m N, {Math.round(poi.coordinates[1])}m E)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-bunker-700 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* POI Title & Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <div>
            <h2 className="text-xl font-display font-bold text-white tracking-wide flex items-center">
              {poi.name}
            </h2>
          </div>

          {/* Advantage Section */}
          <div className="bg-bunker-800/80 border-l-4 border-tactical-amber p-3.5 rounded-r">
            <div className="flex items-center text-tactical-amber text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 mr-1.5" /> Tactical Advantage
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {poi.advantage}
            </p>
          </div>

          {/* Military Doctrine Tactic */}
          <div className="bg-bunker-800/80 border-l-4 border-emerald-500 p-3.5 rounded-r">
            <div className="flex items-center text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Crosshair className="w-4 h-4 mr-1.5" /> Doctrine & Orders
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-mono">
              {poi.doctrineTactic}
            </p>
          </div>

          {/* Grid Information Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-bunker-850 p-3 rounded border border-bunker-700">
              <span className="text-slate-400 font-mono block uppercase mb-1">Recommended Squad Role</span>
              <span className="font-bold text-tactical-amber text-sm font-mono">
                {poi.idealSquadRole || "Officer / Infantry"}
              </span>
            </div>

            <div className="bg-bunker-850 p-3 rounded border border-bunker-700">
              <span className="text-slate-400 font-mono block uppercase mb-1 flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Line of Sight
              </span>
              <span className="text-slate-300 font-mono">
                {poi.lineOfSight || "Standard 150m sector coverage"}
              </span>
            </div>
          </div>

          {/* Counter Measures */}
          {poi.counterMeasures && (
            <div className="bg-red-950/30 border border-red-900/60 p-3.5 rounded">
              <div className="flex items-center text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 mr-1.5" /> Enemy Counter-Measures
              </div>
              <p className="text-xs text-red-200/90 leading-relaxed font-mono">
                {poi.counterMeasures}
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between px-6 py-3 bg-bunker-850 border-t border-bunker-700">
          <button
            onClick={() => {
              onTargetWithArty(poi.coordinates, poi.name);
              onClose();
            }}
            className="flex items-center px-4 py-2 bg-tactical-amber hover:bg-tactical-amber-glow text-black font-display font-bold text-xs uppercase tracking-wider rounded transition shadow"
          >
            <Crosshair className="w-4 h-4 mr-1.5" />
            Lock In Artillery Calculator
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-bunker-700 hover:bg-bunker-600 text-slate-300 font-mono text-xs uppercase tracking-wider rounded transition"
          >
            Close Directive
          </button>
        </div>

      </div>
    </div>
  );
}
