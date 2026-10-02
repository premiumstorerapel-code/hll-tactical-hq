import React, { useState, useEffect } from 'react';
import carentanData from './data/maps/carentan.json';
import smeData from './data/maps/sme.json';
import foyData from './data/maps/foy.json';

import MapViewer from './components/MapViewer';
import StrategicPlaybookPanel from './components/StrategicPlaybookPanel';
import TacticalAdvisor from './components/TacticalAdvisor';
import TacticalAcademyPanel from './components/TacticalAcademyPanel';
import TacticalGuideMaster from './components/TacticalGuideMaster';
import TankCrewHUD from './components/TankCrewHUD';
import ArtilleryWidget from './components/ArtilleryWidget';
import MapTools from './components/MapTools';
import POIModal from './components/POIModal';

import { 
  Shield, Crosshair, Target, Volume2, VolumeX, 
  Map, Monitor, ChevronLeft, ChevronRight, Languages, BookOpen, Users, Swords, Compass 
} from 'lucide-react';
import { sound } from './utils/audio';
import { translations } from './utils/i18n';
import { validateGarrisonPlacement } from './engine/geometry';
import { getSectorStrategy } from './engine/sectorStrategy';

const AVAILABLE_MAPS = {
  carentan: carentanData,
  sme: smeData,
  foy: foyData
};

export default function App() {
  const [lang, setLang] = useState('es');
  const [selectedMapKey, setSelectedMapKey] = useState('carentan');
  const [gameMode, setGameMode] = useState('warfare'); // 'warfare' | 'offensive'
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [advisorCollapsed, setAdvisorCollapsed] = useState(false);
  const [activeTabMode, setActiveTabMode] = useState('strategy'); // 'strategy' | 'guide' | 'academy' | 'advisor' | 'tank'

  const t = translations[lang] || translations.es;

  // Active Map Data
  const mapConfig = AVAILABLE_MAPS[selectedMapKey];
  const strongpoints = mapConfig.points.filter(p => p.type === 'strongpoint');
  const batteries = mapConfig.points.filter(p => p.type === 'artillery');

  // Selected Base for Strategic Intel
  const [selectedBase, setSelectedBase] = useState(null);
  const [operationMode, setOperationMode] = useState('attack'); // 'attack' | 'defense'
  const [layerFilters, setLayerFilters] = useState({
    garrisons: true,
    mgs: true,
    snipers: true,
    tanks: true,
    mines: true
  });

  // Interactive Markers State (User placed or deployed from strategy)
  const [markers, setMarkers] = useState([]);
  const [drawings, setDrawings] = useState([]);

  // Active Tool ('select' | 'ruler' | 'draw' | 'marker')
  const [activeTool, setActiveTool] = useState('select');
  const [selectedMarkerType, setSelectedMarkerType] = useState('friendly_garrison');
  const [drawColor, setDrawColor] = useState('#f59e0b');

  // Artillery Targeting State
  const [activeBattery, setActiveBattery] = useState(null);
  const [activeArtyTarget, setActiveArtyTarget] = useState(null);
  const [artyWidgetCollapsed, setArtyWidgetCollapsed] = useState(false);

  // Selected POI for Modal Directives
  const [selectedPOI, setSelectedPOI] = useState(null);

  // Initialize default base and battery when map changes
  useEffect(() => {
    if (strongpoints.length > 0) {
      // Pick center strongpoint (e.g. Town Center in Carentan)
      const centerSp = strongpoints.find(s => s.id.includes('b7') || s.name.toLowerCase().includes('town') || s.name.toLowerCase().includes('sainte') || s.name.toLowerCase().includes('foy')) || strongpoints[0];
      setSelectedBase(centerSp);
    }
    if (batteries.length > 0) {
      setActiveBattery(batteries[0]);
    }

    setMarkers([]);
    setDrawings([]);
    setActiveArtyTarget(null);
  }, [selectedMapKey]);

  // Compute active base strategy
  const currentStrategy = selectedBase
    ? getSectorStrategy(selectedMapKey, selectedBase.id, selectedBase.name, selectedBase.coordinates)
    : null;

  // Deploy all strategic positions directly into active map markers
  const handleDeployStrategyToMap = (plan) => {
    if (!plan) return;
    sound.playAbilitySound();

    const deployedMarkers = [];

    // Add Garrisons
    if (plan.garrisons) {
      plan.garrisons.forEach((g, i) => {
        deployedMarkers.push({
          id: `dep_gar_${Date.now()}_${i}`,
          name: g.name,
          type: 'friendly_garrison',
          coordinates: g.coordinates,
          team: 'us'
        });
      });
    }

    // Add MG Nests
    if (plan.mgSpots) {
      plan.mgSpots.forEach((mg, i) => {
        deployedMarkers.push({
          id: `dep_mg_${Date.now()}_${i}`,
          name: mg.name,
          type: 'friendly_op',
          coordinates: mg.coordinates,
          team: 'us'
        });
      });
    }

    // Add Snipers
    if (plan.sniperSpots) {
      plan.sniperSpots.forEach((sn, i) => {
        deployedMarkers.push({
          id: `dep_sn_${Date.now()}_${i}`,
          name: sn.name,
          type: 'recon_unit',
          coordinates: sn.coordinates,
          team: 'us'
        });
      });
    }

    // Add Tanks
    if (plan.tankSpots) {
      plan.tankSpots.forEach((tk, i) => {
        deployedMarkers.push({
          id: `dep_tk_${Date.now()}_${i}`,
          name: tk.name,
          type: 'friendly_tank',
          coordinates: tk.coordinates,
          team: 'us'
        });
      });
    }

    // Add AT Mines
    if (plan.atMines) {
      plan.atMines.forEach((m, i) => {
        deployedMarkers.push({
          id: `dep_mine_${Date.now()}_${i}`,
          name: m.name,
          type: 'supply_50',
          coordinates: m.coordinates,
          team: 'us'
        });
      });
    }

    setMarkers(prev => [...prev, ...deployedMarkers]);
  };

  // Deploy 6-man Squad Formation into interactive map markers
  const handleDeploySquadFormation = (formation, baseCoords) => {
    if (!formation || !formation.members) return;
    sound.playAbilitySound();

    const centerLat = baseCoords ? baseCoords[0] - 120 : 1000;
    const centerLng = baseCoords ? baseCoords[1] : 1000;

    const squadMarkers = formation.members.map((member, idx) => ({
      id: `squad_member_${Date.now()}_${idx}`,
      name: member.name,
      weapon: member.weapon,
      roleNote: member.note,
      type: `squad_${member.roleId}`,
      coordinates: [
        Math.round(centerLat + member.pos[0] * 1.5),
        Math.round(centerLng + member.pos[1] * 1.5)
      ],
      team: 'us'
    }));

    setMarkers(prev => [...prev, ...squadMarkers]);
  };

  const handleAddMarker = (coords, type) => {
    const isGarrison = type === 'friendly_garrison';
    const currentGarrisons = markers.filter(m => m.type === 'friendly_garrison');

    if (isGarrison && currentGarrisons.length >= 8) {
      sound.playAlertBeep();
      alert(lang === 'es' ? '¡LÍMITE DE GUARNICIONES ALCANZADO (8/8)!' : 'GARRISON CAP REACHED (8/8)!');
      return;
    }

    if (isGarrison) {
      const check = validateGarrisonPlacement(coords, currentGarrisons);
      if (!check.isValid) {
        sound.playAlertBeep();
      }
    }

    const typeNames = {
      friendly_garrison: `Guarnición #${currentGarrisons.length + 1}`,
      friendly_op: `Nido / Puesto (OP)`,
      friendly_tank: `Tanque Aliado`,
      recon_unit: `Puesto Recon`,
      supply_50: `Suministros (50)`,
      supply_100: `Suministros (100)`,
      enemy_inf: `Infantería Enemiga`,
      enemy_tank: `Blindado Enemigo`,
      enemy_garrison: `Guarnición Enemiga`
    };

    const newMarker = {
      id: `marker_${Date.now()}`,
      name: typeNames[type] || 'Marcador',
      type,
      coordinates: coords,
      team: type.startsWith('enemy') ? 'ger' : 'us'
    };

    setMarkers(prev => [...prev, newMarker]);
  };

  const handleRemoveMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const handleMapClickTarget = (coords) => {
    setActiveArtyTarget({
      name: `Blanco [${coords[0]}m N, ${coords[1]}m E]`,
      coordinates: coords
    });
  };

  const handleTargetPOIWithArty = (coords, name) => {
    setActiveArtyTarget({
      name,
      coordinates: coords
    });
    setArtyWidgetCollapsed(false);
    sound.playRadioClick();
  };

  const handleExportPlan = (toClipboard = false) => {
    const plan = {
      version: "2.0",
      map: selectedMapKey,
      selectedBase: selectedBase?.name,
      operationMode,
      markers,
      drawings
    };

    const jsonStr = JSON.stringify(plan, null, 2);

    if (toClipboard) {
      navigator.clipboard.writeText(jsonStr);
    } else {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hll_plan_estrategico_${selectedMapKey}_${Date.now()}.json`;
      a.click();
    }
  };

  const handleImportPlan = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.markers) setMarkers(imported.markers);
        if (imported.drawings) setDrawings(imported.drawings);
        if (imported.map && AVAILABLE_MAPS[imported.map]) {
          setSelectedMapKey(imported.map);
        }
        sound.playAbilitySound();
      } catch (err) {
        alert('Archivo JSON no válido');
      }
    };
    reader.readAsText(file);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'es' ? 'en' : 'es';
    setLang(nextLang);
    sound.playRadioClick();
  };

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-bunker-950 text-slate-100 select-none ${crtEnabled ? 'crt-overlay' : ''}`}>
      
      {/* TOP HEADER: Command Bunker Bar */}
      <header className="h-14 bg-bunker-900 border-b border-bunker-700 px-3 sm:px-4 flex items-center justify-between z-30 shadow-lg shrink-0 gap-2">
        
        {/* Left: Branding & Map Selector */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tactical-amber animate-ping shrink-0" />
            <h1 className="font-display font-black text-sm sm:text-base lg:text-lg tracking-wider text-white whitespace-nowrap">
              HELL LET LOOSE <span className="text-tactical-amber font-normal hidden sm:inline">CENTRO ESTRATÉGICO</span>
            </h1>
          </div>

          <div className="h-5 w-px bg-bunker-700 hidden sm:block" />

          {/* Map Selector */}
          <div className="flex items-center space-x-1.5 bg-bunker-950 px-2 py-1 rounded border border-bunker-800">
            <Map className="w-3.5 h-3.5 text-tactical-amber shrink-0" />
            <select
              value={selectedMapKey}
              onChange={e => {
                setSelectedMapKey(e.target.value);
                sound.playRadioClick();
              }}
              className="bg-transparent text-xs font-mono font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="carentan" className="bg-bunker-900">CARENTAN (2016m)</option>
              <option value="sme" className="bg-bunker-900">SAINTE-MÈRE-ÉGLISE (1984m)</option>
              <option value="foy" className="bg-bunker-900">FOY (INVIERNO 1984m)</option>
            </select>
          </div>

          {/* Game Mode Selector */}
          <div className="flex items-center space-x-1 bg-bunker-950 px-2 py-1 rounded border border-bunker-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase hidden md:inline">MODO:</span>
            <button
              onClick={() => {
                setGameMode('warfare');
                sound.playRadioClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition ${
                gameMode === 'warfare'
                  ? 'bg-tactical-amber text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              WARFARE (50v50)
            </button>
            <button
              onClick={() => {
                setGameMode('offensive');
                sound.playRadioClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition ${
                gameMode === 'offensive'
                  ? 'bg-tactical-amber text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OFENSIVA
            </button>
          </div>
        </div>

        {/* Center: Tactical Intel Navigation Tabs */}
        <div className="flex items-center bg-bunker-950 p-1 rounded-md border border-bunker-800">
          <button
            onClick={() => {
              setActiveTabMode('strategy');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeTabMode === 'strategy'
                ? 'bg-tactical-amber text-black shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>MAPA & BASES</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('guide');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeTabMode === 'guide'
                ? 'bg-tactical-amber text-black shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>GUÍA TÁCTICA MAESTRA</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('academy');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeTabMode === 'academy'
                ? 'bg-tactical-amber text-black shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>SIMULADOR ESCUADRA</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('tank');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeTabMode === 'tank'
                ? 'bg-tactical-amber text-black shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>BLINDAJE</span>
          </button>

          <button
            onClick={() => {
              setActiveTabMode('advisor');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeTabMode === 'advisor'
                ? 'bg-tactical-amber text-black shadow font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>RADAR 200M</span>
          </button>
        </div>

        {/* Right: Language toggle, Audio, CRT, Panel Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded border border-tactical-amber/80 bg-tactical-amber/15 text-tactical-amber hover:bg-tactical-amber hover:text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            title="Efecto CRT Bunker"
            className={`p-1.5 rounded border text-xs font-mono transition flex items-center space-x-1 ${
              crtEnabled
                ? 'border-tactical-amber text-tactical-amber bg-tactical-amber/10'
                : 'border-bunker-800 text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CRT</span>
          </button>

          <button
            onClick={() => {
              const muted = sound.toggleMute();
              setIsAudioMuted(muted);
            }}
            title={isAudioMuted ? 'Activar Sonidos de Radio' : 'Silenciar'}
            className="p-1.5 rounded border border-bunker-800 text-slate-400 hover:text-white hover:bg-bunker-800 transition"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-tactical-amber" />}
          </button>

          <button
            onClick={() => setAdvisorCollapsed(!advisorCollapsed)}
            className="px-2.5 py-1 rounded bg-bunker-800 hover:bg-bunker-700 text-slate-200 text-xs font-mono border border-bunker-700 transition flex items-center space-x-1"
          >
            <span>PANEL</span>
            {advisorCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </header>

      {/* TANK CREW HUD (When Tank Mode is active) */}
      {activeTabMode === 'tank' && (
        <div className="shrink-0 z-20">
          <TankCrewHUD t={t} />
        </div>
      )}

      {/* FULLSCREEN TACTICAL MASTER GUIDE (When Guide Mode is active) */}
      {activeTabMode === 'guide' ? (
        <div className="flex-1 h-full overflow-hidden">
          <TacticalGuideMaster
            selectedBase={selectedBase}
            onDeploySquadFormation={handleDeploySquadFormation}
            onSwitchToMap={() => setActiveTabMode('strategy')}
            t={t}
          />
        </div>
      ) : (
        /* MAIN WORKSPACE: Map + Strategic Panel Sidebar */
        <div className="flex-1 relative flex overflow-hidden">
        
        {/* Leaflet Map Surface */}
        <div className="flex-1 relative h-full">
          <MapViewer
            mapConfig={mapConfig}
            markers={markers}
            onAddMarker={handleAddMarker}
            onRemoveMarker={handleRemoveMarker}
            activeTool={activeTool}
            selectedMarkerType={selectedMarkerType}
            activeTarget={activeArtyTarget}
            activeBattery={activeBattery}
            onSelectPOI={poi => {
              setSelectedBase(poi);
              setSelectedPOI(poi);
            }}
            onMapClickTarget={handleMapClickTarget}
            drawColor={drawColor}
            drawings={drawings}
            onAddDrawing={d => setDrawings(prev => [...prev, d])}
            selectedBase={selectedBase}
            strategy={currentStrategy}
            operationMode={operationMode}
            layerFilters={layerFilters}
            t={t}
          />

          {/* Map Tools Palette (Top-Left) */}
          <MapTools
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            selectedMarkerType={selectedMarkerType}
            setSelectedMarkerType={setSelectedMarkerType}
            drawColor={drawColor}
            setDrawColor={setDrawColor}
            onClearMarkers={() => setMarkers([])}
            onClearDrawings={() => setDrawings([])}
            onExportPlan={handleExportPlan}
            onImportPlan={handleImportPlan}
            t={t}
          />

          {/* Floating Artillery Calculator Widget (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 z-[1000]">
            <ArtilleryWidget
              activeTarget={activeArtyTarget}
              activeBattery={activeBattery}
              batteries={batteries}
              onSelectBattery={b => setActiveBattery(b)}
              onClearTarget={() => setActiveArtyTarget(null)}
              isCollapsed={artyWidgetCollapsed}
              onToggleCollapse={() => setArtyWidgetCollapsed(!artyWidgetCollapsed)}
              t={t}
            />
          </div>
        </div>

        {/* SIDEBAR: Strategic Playbook Panel, Tactical Academy, or Advisor */}
        <aside className={`${advisorCollapsed ? 'w-0' : 'w-80 sm:w-96'} transition-all duration-200 shrink-0 h-full overflow-hidden z-20 shadow-2xl`}>
          {activeTabMode === 'strategy' && (
            <div className="h-full overflow-y-auto">
              <StrategicPlaybookPanel
                selectedBase={selectedBase}
                operationMode={operationMode}
                setOperationMode={setOperationMode}
                strategy={currentStrategy}
                layerFilters={layerFilters}
                setLayerFilters={setLayerFilters}
                onDeployStrategyToMap={handleDeployStrategyToMap}
                strongpoints={strongpoints}
                onSelectBase={sp => setSelectedBase(sp)}
                t={t}
              />
            </div>
          )}

          {activeTabMode === 'academy' && (
            <div className="h-full overflow-y-auto">
              <TacticalAcademyPanel
                selectedBase={selectedBase}
                onDeploySquadFormation={handleDeploySquadFormation}
                t={t}
              />
            </div>
          )}

          {activeTabMode === 'advisor' && (
            <TacticalAdvisor
              activeDefenseSector={selectedBase}
              activeAttackSector={strongpoints[Math.min(2, strongpoints.length - 1)]}
              onSelectDefenseSector={sp => setSelectedBase(sp)}
              onSelectAttackSector={() => {}}
              strongpoints={strongpoints}
              markers={markers}
              onAcceptSuggestedGarrison={sug => handleAddMarker(sug.coordinates, 'friendly_garrison')}
              mapConfig={mapConfig}
              t={t}
            />
          )}

          {activeTabMode === 'tank' && (
            <div className="p-4 bg-bunker-900 h-full text-slate-300 font-mono text-xs space-y-3">
              <div className="font-display font-bold text-white uppercase text-sm border-b border-bunker-700 pb-2">
                DOCTRINA DE COMBATE BLINDADO
              </div>
              <p className="text-xs leading-relaxed">
                • <strong>Regla del Diamante (30°):</strong> Nunca encares al cañón enemigo de forma perpendicular (0°). Angular a 30° incrementa el grosor efectivo de tu placa frontal de 100mm a más de 115mm y duplica las probabilidades de rebote.
              </p>
              <p className="text-xs leading-relaxed">
                • <strong>Posición Casco Oculto (Hull-Down):</strong> Oculta el chasis en zanjas o montículos de tierra. Solo expón la torreta para disparar y retírate inmediatamente durante la recarga (8 segundos).
              </p>
              <p className="text-xs leading-relaxed">
                • <strong>Caza de Tanques Pesados:</strong> Un Tiger I o Sherman 76 no pueden penetrarse frontalmente a media distancia con cañones ligeros. Requiere fuego cruzado buscando el anillo de la torreta o el compartimento del motor trasero.
              </p>
            </div>
          )}
        </aside>

      </div>
      )}

      {/* POI Modal */}
      {selectedPOI && (
        <POIModal
          poi={selectedPOI}
          mapConfig={mapConfig}
          onClose={() => setSelectedPOI(null)}
          onTargetWithArty={handleTargetPOIWithArty}
          t={t}
        />
      )}

    </div>
  );
}
