import React from 'react';
import { 
  Ruler, PenTool, Trash2, Download, Upload, Copy, Check 
} from 'lucide-react';
import { 
  HLLGarrisonIcon, HLLOutpostIcon, HLLSuppliesIcon, 
  HLLEnemyInfantryIcon, HLLEnemyArmorIcon 
} from './HLLIcons';
import { sound } from '../utils/audio';

export default function MapTools({
  activeTool,
  setActiveTool,
  selectedMarkerType,
  setSelectedMarkerType,
  drawColor,
  setDrawColor,
  onClearMarkers,
  onClearDrawings,
  onExportPlan,
  onImportPlan,
  t
}) {
  const [copied, setCopied] = React.useState(false);

  const markerOptions = [
    { id: 'friendly_garrison', label: t.marker_garrison, renderIcon: () => <HLLGarrisonIcon size={20} /> },
    { id: 'friendly_op', label: t.marker_op, renderIcon: () => <HLLOutpostIcon size={20} /> },
    { id: 'supply_50', label: t.marker_supply_50, renderIcon: () => <HLLSuppliesIcon size={20} amount={50} /> },
    { id: 'supply_100', label: t.marker_supply_100, renderIcon: () => <HLLSuppliesIcon size={20} amount={100} /> },
    { id: 'enemy_inf', label: t.marker_enemy_inf, renderIcon: () => <HLLEnemyInfantryIcon size={20} /> },
    { id: 'enemy_tank', label: t.marker_enemy_tank, renderIcon: () => <HLLEnemyArmorIcon size={20} /> },
    { id: 'enemy_garrison', label: t.marker_enemy_gar, renderIcon: () => <HLLGarrisonIcon size={20} isEnemy={true} /> }
  ];

  const handleCopyClipboard = () => {
    onExportPlan(true);
    setCopied(true);
    sound.playRadioClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2 select-none font-mono text-xs">
      
      {/* Primary Tool Selector Bar */}
      <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700 p-1.5 rounded shadow-2xl flex items-center space-x-1">
        <button
          onClick={() => {
            setActiveTool('select');
            sound.playRadioClick();
          }}
          className={`px-2.5 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition ${
            activeTool === 'select'
              ? 'bg-tactical-amber text-black font-black'
              : 'text-slate-300 hover:bg-bunker-800'
          }`}
        >
          {t.tool_inspect}
        </button>

        <button
          onClick={() => {
            setActiveTool('marker');
            sound.playRadioClick();
          }}
          className={`px-2.5 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition ${
            activeTool === 'marker'
              ? 'bg-tactical-amber text-black font-black'
              : 'text-slate-300 hover:bg-bunker-800'
          }`}
        >
          {t.tool_marker}
        </button>

        <button
          onClick={() => {
            setActiveTool('ruler');
            sound.playRadioClick();
          }}
          className={`px-2.5 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1 ${
            activeTool === 'ruler'
              ? 'bg-tactical-amber text-black font-black'
              : 'text-slate-300 hover:bg-bunker-800'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>{t.tool_ruler}</span>
        </button>

        <button
          onClick={() => {
            setActiveTool('draw');
            sound.playRadioClick();
          }}
          className={`px-2.5 py-1.5 rounded font-display font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1 ${
            activeTool === 'draw'
              ? 'bg-tactical-amber text-black font-black'
              : 'text-slate-300 hover:bg-bunker-800'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{t.tool_draw}</span>
        </button>

        <div className="h-4 w-px bg-bunker-700 mx-1" />

        {/* Export / Import Buttons */}
        <button
          onClick={handleCopyClipboard}
          title="Copiar Plan de Batalla al Portapapeles"
          className="p-1.5 text-slate-400 hover:text-tactical-amber hover:bg-bunker-800 rounded transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onExportPlan(false)}
          title="Descargar Plan de Batalla JSON"
          className="p-1.5 text-slate-400 hover:text-tactical-amber hover:bg-bunker-800 rounded transition"
        >
          <Download className="w-4 h-4" />
        </button>

        <label
          title="Cargar Plan de Batalla JSON"
          className="p-1.5 text-slate-400 hover:text-tactical-amber hover:bg-bunker-800 rounded transition cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <input
            type="file"
            accept=".json"
            onChange={onImportPlan}
            className="hidden"
          />
        </label>
      </div>

      {/* Sub-Bar: Authentic HLL In-Game Marker Palette */}
      {activeTool === 'marker' && (
        <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700 p-2.5 rounded shadow-2xl space-y-2 max-w-sm">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {t.tool_marker}: Símbolos Oficiales del Juego
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {markerOptions.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMarkerType(m.id);
                  sound.playRadioClick();
                }}
                className={`flex items-center space-x-2 p-1.5 rounded border text-left text-[11px] transition ${
                  selectedMarkerType === m.id
                    ? 'border-tactical-amber bg-tactical-amber/20 text-white font-bold'
                    : 'border-bunker-700 bg-bunker-950 text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="shrink-0">
                  {m.renderIcon()}
                </span>
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-1 flex justify-between border-t border-bunker-800">
            <button
              onClick={onClearMarkers}
              className="text-[10px] text-red-400 hover:text-red-300 flex items-center space-x-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clear_markers}</span>
            </button>
          </div>
        </div>
      )}

      {/* Sub-Bar: Drawing Colors & Clear */}
      {activeTool === 'draw' && (
        <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700 p-2 rounded shadow-2xl flex items-center space-x-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Color:</span>
          {['#f59e0b', '#ef4444', '#3b82f6', '#22c55e', '#ffffff'].map(c => (
            <button
              key={c}
              onClick={() => setDrawColor(c)}
              className={`w-5 h-5 rounded-full border-2 transition ${
                drawColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-75'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}

          <div className="h-4 w-px bg-bunker-700 mx-1" />

          <button
            onClick={onClearDrawings}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>{t.clear_drawings}</span>
          </button>
        </div>
      )}

      {/* Sub-Bar: Ruler Instructions */}
      {activeTool === 'ruler' && (
        <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700 p-2 rounded shadow-2xl text-[11px] text-tactical-amber">
          {t.ruler_hint}
        </div>
      )}

    </div>
  );
}
