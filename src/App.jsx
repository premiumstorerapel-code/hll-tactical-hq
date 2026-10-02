import React, { useState, useEffect } from 'react';
import carentanData from './data/maps/carentan.json';
import smeData from './data/maps/sme.json';
import foyData from './data/maps/foy.json';

import MapViewer from './components/MapViewer';
import TacticalAdvisor from './components/TacticalAdvisor';
import CommanderHUD from './components/CommanderHUD';
import OfficerHUD from './components/OfficerHUD';
import TankCrewHUD from './components/TankCrewHUD';
import ArtilleryWidget from './components/ArtilleryWidget';
import MapTools from './components/MapTools';
import POIModal from './components/POIModal';

import { 
  Shield, Radio, Truck, Volume2, VolumeX, 
  Map, Monitor, ChevronLeft, ChevronRight, Languages 
} from 'lucide-react';
import { sound } from './utils/audio';
import { translations } from './utils/i18n';
import { validateGarrisonPlacement } from './engine/geometry';

const AVAILABLE_MAPS = {
  carentan: carentanData,
  sme: smeData,
  foy: foyData
};

export default function App() {
  const [lang, setLang] = useState('es'); // Default to Spanish!
  const [selectedMapKey, setSelectedMapKey] = useState('carentan');
  const [activeRole, setActiveRole] = useState('commander'); // 'commander' | 'officer' | 'tank'
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(false);
  const [advisorCollapsed, setAdvisorCollapsed] = useState(false);

  const t = translations[lang] || translations.es;

  // Active Map Data
  const mapConfig = AVAILABLE_MAPS[selectedMapKey];
  const strongpoints = mapConfig.points.filter(p => p.type === 'strongpoint');
  const batteries = mapConfig.points.filter(p => p.type === 'artillery');

  // Objectives for Tactical Advisor
  const [activeDefenseSector, setActiveDefenseSector] = useState(null);
  const [activeAttackSector, setActiveAttackSector] = useState(null);

  // Interactive Markers State (Garrisons, OPs, Supplies, Enemy)
  const [markers, setMarkers] = useState([]);
  
  // Tactical Drawings (Battle Plan Polylines)
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

  // Initialize default objectives & battery when map changes
  useEffect(() => {
    if (strongpoints.length > 0) {
      setActiveDefenseSector(strongpoints[0]);
      setActiveAttackSector(strongpoints[Math.min(2, strongpoints.length - 1)]);
    }
    if (batteries.length > 0) {
      setActiveBattery(batteries[0]);
    }

    const centerPoint = strongpoints[0]?.coordinates || [1000, 1000];
    const initialGarrisons = [
      {
        id: `def_gar_${Date.now()}_1`,
        name: lang === 'es' ? 'Guarnición Defensiva #1' : 'Defense Garrison #1',
        type: 'friendly_garrison',
        coordinates: [centerPoint[0] - 80, centerPoint[1] + 60],
        team: 'us'
      }
    ];
    setMarkers(initialGarrisons);
    setDrawings([]);
    setActiveArtyTarget(null);
  }, [selectedMapKey]);

  // Add marker from user click
  const handleAddMarker = (coords, type) => {
    const isGarrison = type === 'friendly_garrison';
    const currentGarrisons = markers.filter(m => m.type === 'friendly_garrison');

    // Garrison Cap Rule Check (8 max)
    if (isGarrison && currentGarrisons.length >= 8) {
      sound.playAlertBeep();
      alert(lang === 'es' ? '¡LÍMITE DE GUARNICIONES ALCANZADO (8/8)! Desmonta una guarnición redundante antes de construir una nueva.' : 'GARRISON CAP REACHED (8/8)! Dismantle a redundant garrison before building a new one.');
      return;
    }

    // 200m Proximity Rule Check
    if (isGarrison) {
      const check = validateGarrisonPlacement(coords, currentGarrisons);
      if (!check.isValid) {
        sound.playAlertBeep();
      }
    }

    const typeNamesEs = {
      friendly_garrison: `Guarnición #${currentGarrisons.length + 1}`,
      friendly_op: `Puesto Avanzado (OP)`,
      supply_50: `Suministros (50)`,
      supply_100: `Suministros (100)`,
      enemy_inf: `Infantería Enemiga`,
      enemy_tank: `Blindado Enemigo`,
      enemy_garrison: `Guarnición Enemiga`
    };

    const typeNamesEn = {
      friendly_garrison: `Garrison #${currentGarrisons.length + 1}`,
      friendly_op: `Squad OP`,
      supply_50: `Supplies (50)`,
      supply_100: `Supplies (100)`,
      enemy_inf: `Enemy Infantry`,
      enemy_tank: `Enemy Armor`,
      enemy_garrison: `Enemy Garrison`
    };

    const typeNames = lang === 'es' ? typeNamesEs : typeNamesEn;

    const newMarker = {
      id: `marker_${Date.now()}`,
      name: typeNames[type] || 'Marker',
      type,
      coordinates: coords,
      team: type.startsWith('enemy') ? 'ger' : 'us'
    };

    setMarkers(prev => [...prev, newMarker]);
  };

  const handleRemoveMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
  };

  const handleAcceptSuggestedGarrison = (sug) => {
    const currentGarrisons = markers.filter(m => m.type === 'friendly_garrison');
    if (currentGarrisons.length >= 8) {
      sound.playAlertBeep();
      alert(lang === 'es' ? '¡LÍMITE DE GUARNICIONES ALCANZADO (8/8)!' : 'GARRISON CAP REACHED (8/8)!');
      return;
    }

    const newGarrison = {
      id: `gar_${Date.now()}`,
      name: sug.name,
      type: 'friendly_garrison',
      coordinates: sug.coordinates,
      team: 'us'
    };

    setMarkers(prev => [...prev, newGarrison]);
    sound.playAbilitySound();
  };

  const handleCommanderAbility = (ability) => {
    if (ability.id === 'supply_drop') {
      if (activeDefenseSector) {
        const supplyCoords = [
          activeDefenseSector.coordinates[0] + 40,
          activeDefenseSector.coordinates[1] - 30
        ];
        handleAddMarker(supplyCoords, 'supply_100');
      }
    } else if (ability.id === 'airhead') {
      if (activeAttackSector) {
        const airheadCoords = [
          activeAttackSector.coordinates[0] - 220,
          activeAttackSector.coordinates[1] + 150
        ];
        handleAddMarker(airheadCoords, 'friendly_op');
      }
    }
  };

  const handleMapClickTarget = (coords) => {
    setActiveArtyTarget({
      name: `${lang === 'es' ? 'Blanco' : 'Target'} [${coords[0]}m N, ${coords[1]}m E]`,
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
      version: "1.0",
      map: selectedMapKey,
      defenseSector: activeDefenseSector?.name,
      attackSector: activeAttackSector?.name,
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
      a.download = `hll_battleplan_${selectedMapKey}_${Date.now()}.json`;
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
        alert(lang === 'es' ? 'Archivo JSON de plan de batalla no válido' : 'Invalid battle plan JSON file');
      }
    };
    reader.readAsText(file);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'es' ? 'en' : 'es';
    setLang(nextLang);
    sound.playRadioClick();
  };

  const friendlyGarrisonsCount = markers.filter(m => m.type === 'friendly_garrison').length;

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-bunker-950 text-slate-100 select-none ${crtEnabled ? 'crt-overlay' : ''}`}>
      
      {/* TOP HEADER: WWII Command Bunker HUD Bar */}
      <header className="h-14 bg-bunker-900 border-b border-bunker-700 px-3 sm:px-4 flex items-center justify-between z-30 shadow-lg shrink-0 gap-2">
        
        {/* Left: Branding & Map Selector */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-tactical-amber animate-ping shrink-0" />
            <h1 className="font-display font-black text-sm sm:text-base lg:text-lg tracking-wider text-white whitespace-nowrap">
              {t.app_title} <span className="text-tactical-amber font-normal hidden sm:inline">{t.app_subtitle}</span>
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
              <option value="carentan" className="bg-bunker-900">{t.map_carentan}</option>
              <option value="sme" className="bg-bunker-900">{t.map_sme}</option>
              <option value="foy" className="bg-bunker-900">{t.map_foy}</option>
            </select>
          </div>
        </div>

        {/* Center: Role Toggle Engine */}
        <div className="flex items-center bg-bunker-950 p-1 rounded-md border border-bunker-800">
          <button
            onClick={() => {
              setActiveRole('commander');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeRole === 'commander'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{t.role_commander}</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('officer');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeRole === 'officer'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t.role_officer}</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('tank');
              sound.playRadioClick();
            }}
            className={`px-3 py-1 text-xs font-display font-bold tracking-wider rounded transition flex items-center space-x-1.5 ${
              activeRole === 'tank'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{t.role_tank}</span>
          </button>
        </div>

        {/* Right: Language toggle, Audio, CRT, Advisor Toggle */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle (ES / EN) */}
          <button
            onClick={toggleLanguage}
            title={lang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
            className="px-2 py-1 rounded border border-tactical-amber/80 bg-tactical-amber/15 text-tactical-amber hover:bg-tactical-amber hover:text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center space-x-1"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* CRT effect toggle */}
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
            <span className="hidden sm:inline">{t.crt_btn}</span>
          </button>

          {/* Audio toggle */}
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

          {/* Toggle Advisor sidebar */}
          <button
            onClick={() => setAdvisorCollapsed(!advisorCollapsed)}
            className="px-2.5 py-1 rounded bg-bunker-800 hover:bg-bunker-700 text-slate-200 text-xs font-mono border border-bunker-700 transition flex items-center space-x-1"
          >
            <span>{t.advisor_btn}</span>
            {advisorCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>

      </header>

      {/* ROLE-SPECIFIC HUD BAR */}
      <div className="shrink-0 z-20">
        {activeRole === 'commander' && (
          <CommanderHUD
            garrisonsCount={friendlyGarrisonsCount}
            onActivateAbility={handleCommanderAbility}
            t={t}
          />
        )}
        {activeRole === 'officer' && (
          <OfficerHUD
            activeOp={markers.find(m => m.type === 'friendly_op')}
            onPlaceOpRequest={() => {
              setActiveTool('marker');
              setSelectedMarkerType('friendly_op');
            }}
            selectedSupplyZone="blue"
            t={t}
          />
        )}
        {activeRole === 'tank' && (
          <TankCrewHUD t={t} />
        )}
      </div>

      {/* MAIN WORKSPACE: Map + Floating Artillery Widget + Tactical Advisor Sidebar */}
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
            onSelectPOI={poi => setSelectedPOI(poi)}
            onMapClickTarget={handleMapClickTarget}
            drawColor={drawColor}
            drawings={drawings}
            onAddDrawing={d => setDrawings(prev => [...prev, d])}
            activeDefenseSector={activeDefenseSector}
            activeAttackSector={activeAttackSector}
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

        {/* Real-Time Deterministic Tactical Advisor Sidebar */}
        <aside className={`${advisorCollapsed ? 'w-0' : 'w-80 sm:w-96'} transition-all duration-200 shrink-0 h-full overflow-hidden z-20 shadow-2xl`}>
          <TacticalAdvisor
            activeDefenseSector={activeDefenseSector}
            activeAttackSector={activeAttackSector}
            onSelectDefenseSector={sp => setActiveDefenseSector(sp)}
            onSelectAttackSector={sp => setActiveAttackSector(sp)}
            strongpoints={strongpoints}
            markers={markers}
            onAcceptSuggestedGarrison={handleAcceptSuggestedGarrison}
            mapConfig={mapConfig}
            t={t}
          />
        </aside>

      </div>

      {/* Actionable Military Directives POI Modal */}
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
