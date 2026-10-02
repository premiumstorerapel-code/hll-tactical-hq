import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateDistance, calculateBearing, getGridKeypad } from '../engine/geometry';
import { getHLLMarkerHTML } from './HLLIcons';
import { sound } from '../utils/audio';

export default function MapViewer({
  mapConfig,
  markers = [],
  onAddMarker,
  onRemoveMarker,
  activeTool,
  selectedMarkerType,
  activeTarget,
  activeBattery,
  onSelectPOI,
  onMapClickTarget,
  drawColor,
  drawings = [],
  onAddDrawing,
  activeDefenseSector,
  activeAttackSector,
  t
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    markers: null,
    circles: null,
    pois: null,
    grid: null,
    artyLine: null,
    ruler: null,
    drawings: null
  });

  const [mousePos, setMousePos] = useState({ lat: 1000, lng: 1000, grid: 'E5 kp5' });
  const [rulerState, setRulerState] = useState({ start: null, current: null });
  const [isDrawing, setIsDrawing] = useState(false);
  const currentDrawPointsRef = useRef([]);

  // Initialize Leaflet map with CRS.Simple
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const width = mapConfig.widthMeters || 2000;
    const height = mapConfig.heightMeters || 2000;
    const bounds = [[0, 0], [height, width]];

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -1.5,
      maxZoom: 2.5,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      attributionControl: false,
      maxBounds: [[-200, -200], [height + 200, width + 200]],
      maxBoundsViscosity: 0.8
    });

    // Image overlay
    L.imageOverlay(mapConfig.image, bounds).addTo(map);
    map.fitBounds(bounds);

    // Layer groups
    layersRef.current.grid = L.layerGroup().addTo(map);
    layersRef.current.pois = L.layerGroup().addTo(map);
    layersRef.current.circles = L.layerGroup().addTo(map);
    layersRef.current.markers = L.layerGroup().addTo(map);
    layersRef.current.artyLine = L.layerGroup().addTo(map);
    layersRef.current.ruler = L.layerGroup().addTo(map);
    layersRef.current.drawings = L.layerGroup().addTo(map);

    renderGrid(map, width, height);

    mapInstanceRef.current = map;

    map.on('mousemove', (e) => {
      const lat = Math.round(e.latlng.lat);
      const lng = Math.round(e.latlng.lng);
      const grid = getGridKeypad([lat, lng], width, height);
      setMousePos({ lat, lng, grid });

      if (currentDrawPointsRef.current.length > 0) {
        currentDrawPointsRef.current.push([e.latlng.lat, e.latlng.lng]);
        updateCurrentDrawing(currentDrawPointsRef.current);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapConfig.id]);

  const renderGrid = (map, width, height) => {
    const gridLayer = layersRef.current.grid;
    gridLayer.clearLayers();

    for (let x = 0; x <= width; x += 200) {
      L.polyline([[0, x], [height, x]], {
        color: '#ffffff',
        weight: x % 400 === 0 ? 0.8 : 0.4,
        opacity: 0.18,
        dashArray: '3, 6'
      }).addTo(gridLayer);

      if (x < width) {
        const colLetter = String.fromCharCode(65 + Math.floor(x / 200));
        const icon = L.divIcon({
          className: 'grid-col-label',
          html: `<div style="color: rgba(245, 158, 11, 0.75); font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; text-shadow: 0 0 4px #000;">${colLetter}</div>`,
          iconSize: [20, 20],
          iconAnchor: [-90, -10]
        });
        L.marker([height, x], { icon, interactive: false }).addTo(gridLayer);
      }
    }

    for (let y = 0; y <= height; y += 200) {
      L.polyline([[y, 0], [y, width]], {
        color: '#ffffff',
        weight: y % 400 === 0 ? 0.8 : 0.4,
        opacity: 0.18,
        dashArray: '3, 6'
      }).addTo(gridLayer);

      if (y < height) {
        const rowNum = 10 - Math.floor(y / 200);
        const icon = L.divIcon({
          className: 'grid-row-label',
          html: `<div style="color: rgba(245, 158, 11, 0.75); font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; text-shadow: 0 0 4px #000;">${rowNum}</div>`,
          iconSize: [20, 20],
          iconAnchor: [-10, 90]
        });
        L.marker([y, 0], { icon, interactive: false }).addTo(gridLayer);
      }
    }
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e) => {
      const clickCoords = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];

      if (activeTool === 'marker') {
        sound.playRadioClick();
        onAddMarker(clickCoords, selectedMarkerType);
      } else if (activeTool === 'ruler') {
        sound.playRadioClick();
        if (!rulerState.start) {
          setRulerState({ start: clickCoords, current: null });
        } else {
          setRulerState({ start: null, current: null });
          layersRef.current.ruler.clearLayers();
        }
      } else if (activeTool === 'draw') {
        if (!isDrawing) {
          setIsDrawing(true);
          currentDrawPointsRef.current = [clickCoords];
        } else {
          setIsDrawing(false);
          if (currentDrawPointsRef.current.length > 1) {
            onAddDrawing({
              points: [...currentDrawPointsRef.current],
              color: drawColor
            });
          }
          currentDrawPointsRef.current = [];
        }
      } else {
        onMapClickTarget(clickCoords);
      }
    };

    map.off('click');
    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [activeTool, selectedMarkerType, rulerState, isDrawing, drawColor]);

  useEffect(() => {
    const rulerLayer = layersRef.current.ruler;
    if (!rulerLayer) return;

    if (activeTool !== 'ruler' || !rulerState.start) {
      rulerLayer.clearLayers();
      return;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    const onRulerMove = (e) => {
      rulerLayer.clearLayers();
      const p1 = rulerState.start;
      const p2 = [Math.round(e.latlng.lat), Math.round(e.latlng.lng)];

      const dist = Math.round(calculateDistance(p1, p2));
      const bearing = calculateBearing(p1, p2);
      const sprintTimeSec = Math.round(dist / 4.2);
      const tankTimeSec = Math.round(dist / 7.0);

      L.polyline([p1, p2], {
        color: '#f59e0b',
        weight: 2.5,
        dashArray: '6, 6'
      }).addTo(rulerLayer);

      L.circleMarker(p1, {
        radius: 5,
        color: '#f59e0b',
        fillColor: '#000',
        fillOpacity: 1
      }).addTo(rulerLayer);

      const midPoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
      L.tooltip({
        permanent: true,
        direction: 'top',
        className: 'ruler-tooltip'
      })
        .setLatLng(midPoint)
        .setContent(
          `<div style="background: #11171b; border: 1px solid #f59e0b; padding: 4px 8px; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #fff;">
            <strong style="color: #f59e0b; font-size: 13px;">${dist}m</strong> | ${bearing}°<br/>
            <span style="color: #94a3b8;">Sprint: ${sprintTimeSec}s | Tanque: ${tankTimeSec}s</span>
          </div>`
        )
        .addTo(rulerLayer);
    };

    map.on('mousemove', onRulerMove);
    return () => map.off('mousemove', onRulerMove);
  }, [activeTool, rulerState.start]);

  const updateCurrentDrawing = (points) => {
    const drawingsLayer = layersRef.current.drawings;
    if (!drawingsLayer) return;
    drawingsLayer.clearLayers();

    drawings.forEach(d => {
      L.polyline(d.points, { color: d.color, weight: 3, opacity: 0.85 }).addTo(drawingsLayer);
    });

    if (points.length > 1) {
      L.polyline(points, { color: drawColor, weight: 3, opacity: 0.9, dashArray: '4, 4' }).addTo(drawingsLayer);
    }
  };

  useEffect(() => {
    const drawingsLayer = layersRef.current.drawings;
    if (!drawingsLayer) return;
    drawingsLayer.clearLayers();
    drawings.forEach(d => {
      L.polyline(d.points, { color: d.color, weight: 3, opacity: 0.85 }).addTo(drawingsLayer);
    });
  }, [drawings]);

  // Render Strongpoints and Terrain POIs
  useEffect(() => {
    const poisLayer = layersRef.current.pois;
    if (!poisLayer) return;
    poisLayer.clearLayers();

    const pois = mapConfig.points || [];

    pois.forEach(poi => {
      const isStrongpoint = poi.type === 'strongpoint';
      const isArty = poi.type === 'artillery';
      const isDefending = activeDefenseSector?.id === poi.id;
      const isAttacking = activeAttackSector?.id === poi.id;

      if (isStrongpoint) {
        L.circle(poi.coordinates, {
          radius: 50,
          color: isDefending ? '#3b82f6' : isAttacking ? '#ef4444' : '#f59e0b',
          weight: isDefending || isAttacking ? 2.5 : 1.5,
          fillColor: isDefending ? '#3b82f6' : isAttacking ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.15,
          dashArray: '4, 4'
        }).addTo(poisLayer);

        const badgeColor = poi.team === 'ger' ? '#ef4444' : poi.team === 'us' ? '#3b82f6' : '#eab308';
        const iconHtml = `
          <div style="background: ${isDefending ? '#1e3a8a' : isAttacking ? '#7f1d1d' : '#11171b'}; 
                      border: 2px solid ${isDefending ? '#60a5fa' : isAttacking ? '#f87171' : badgeColor}; 
                      padding: 2px 6px; border-radius: 3px; font-family: 'Chakra Petch', sans-serif; 
                      font-size: 10px; font-weight: bold; color: #fff; white-space: nowrap; 
                      box-shadow: 0 0 10px rgba(0,0,0,0.8); cursor: pointer; text-align: center;">
            ${isDefending ? '🛡️ [DEF] ' : isAttacking ? '⚔️ [ATK] ' : ''}${poi.name}
          </div>
        `;
        const icon = L.divIcon({
          className: 'strongpoint-label',
          html: iconHtml,
          iconAnchor: [40, 12]
        });

        const marker = L.marker(poi.coordinates, { icon }).addTo(poisLayer);
        marker.on('click', () => {
          sound.playRadioClick();
          onSelectPOI(poi);
        });
      } else if (isArty) {
        const isAxis = poi.team === 'ger';
        const color = isAxis ? '#ef4444' : '#3b82f6';
        const iconHtml = `
          <div style="background: ${isAxis ? '#380d0d' : '#0c2340'}; border: 1.5px solid ${color}; 
                      width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                      color: #fff; font-size: 11px; cursor: pointer; box-shadow: 0 0 8px rgba(0,0,0,0.9);">
            🎯
          </div>
        `;
        const icon = L.divIcon({ className: 'arty-gun-pin', html: iconHtml, iconAnchor: [11, 11] });
        const marker = L.marker(poi.coordinates, { icon }).addTo(poisLayer);
        marker.on('click', () => {
          sound.playRadioClick();
          onSelectPOI(poi);
        });
      } else {
        const typeIcons = {
          building: '🏢',
          chokepoint: '🛑',
          route: '🌿',
          hill: '⛰️'
        };
        const iconChar = typeIcons[poi.type] || '📍';
        const iconHtml = `
          <div style="background: #11171b; border: 1.5px solid #f59e0b; width: 24px; height: 24px; 
                      border-radius: 4px; display: flex; align-items: center; justify-content: center; 
                      font-size: 12px; cursor: pointer; box-shadow: 0 0 10px rgba(245, 158, 11, 0.4);">
            ${iconChar}
          </div>
        `;
        const icon = L.divIcon({ className: 'tactical-poi-pin', html: iconHtml, iconAnchor: [12, 12] });
        const marker = L.marker(poi.coordinates, { icon }).addTo(poisLayer);
        marker.on('click', () => {
          sound.playRadioClick();
          onSelectPOI(poi);
        });
      }
    });
  }, [mapConfig, activeDefenseSector, activeAttackSector]);

  // Render Placed Markers using Authentic In-Game HLL SVGs
  useEffect(() => {
    const markersLayer = layersRef.current.markers;
    const circlesLayer = layersRef.current.circles;
    if (!markersLayer || !circlesLayer) return;

    markersLayer.clearLayers();
    circlesLayer.clearLayers();

    const friendlyGarrisons = markers.filter(m => m.type === 'friendly_garrison');

    markers.forEach(m => {
      const isFriendlyGar = m.type === 'friendly_garrison';
      const isFriendlyOp = m.type === 'friendly_op';

      let hasProximityViolation = false;
      if (isFriendlyGar) {
        for (const other of friendlyGarrisons) {
          if (other.id !== m.id) {
            const dist = calculateDistance(m.coordinates, other.coordinates);
            if (dist < 200) {
              hasProximityViolation = true;
              break;
            }
          }
        }
      }

      // Draw Exclusion circle for Garrisons (200m)
      if (isFriendlyGar) {
        L.circle(m.coordinates, {
          radius: 200,
          color: hasProximityViolation ? '#ef4444' : '#10b981',
          weight: hasProximityViolation ? 2.5 : 1.5,
          dashArray: '6, 6',
          fillColor: hasProximityViolation ? '#ef4444' : '#10b981',
          fillOpacity: hasProximityViolation ? 0.2 : 0.08,
          interactive: false
        }).addTo(circlesLayer);
      } else if (isFriendlyOp) {
        // Draw 50m OP safe radius
        L.circle(m.coordinates, {
          radius: 50,
          color: '#34d399',
          weight: 1,
          dashArray: '3, 3',
          fillColor: '#34d399',
          fillOpacity: 0.12,
          interactive: false
        }).addTo(circlesLayer);
      }

      // Authentic HLL In-Game Symbol Badge
      const iconHtml = getHLLMarkerHTML(m.type, m.name, hasProximityViolation);
      const icon = L.divIcon({
        className: 'user-placed-marker',
        html: iconHtml,
        iconAnchor: [30, 14]
      });

      const leafletMarker = L.marker(m.coordinates, { icon }).addTo(markersLayer);

      leafletMarker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #111;">
          <strong>${m.name}</strong><br/>
          <span>${m.type.replace('_', ' ').toUpperCase()}</span><br/>
          ${hasProximityViolation ? '<span style="color: red; font-weight: bold;">¡VIOLA REGLA DE 200M!</span><br/>' : ''}
          <button id="del-${m.id}" style="margin-top: 6px; background: #dc2626; color: #fff; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">
            Eliminar Marcador
          </button>
        </div>
      `);

      leafletMarker.on('popupopen', () => {
        const btn = document.getElementById(`del-${m.id}`);
        if (btn) {
          btn.onclick = () => {
            onRemoveMarker(m.id);
            sound.playRadioClick();
          };
        }
      });
    });
  }, [markers]);

  // Artillery Targeting Line
  useEffect(() => {
    const artyLayer = layersRef.current.artyLine;
    if (!artyLayer) return;
    artyLayer.clearLayers();

    if (activeBattery && activeTarget) {
      const p1 = activeBattery.coordinates;
      const p2 = activeTarget.coordinates;

      L.polyline([p1, p2], {
        color: '#f59e0b',
        weight: 2,
        dashArray: '8, 8'
      }).addTo(artyLayer);

      L.circle(p2, {
        radius: 20,
        color: '#ef4444',
        weight: 1.5,
        fillColor: '#ef4444',
        fillOpacity: 0.25
      }).addTo(artyLayer);

      const iconHtml = `
        <div style="color: #ef4444; font-size: 18px; font-weight: bold; text-shadow: 0 0 6px #000; pointer-events: none;">
          🎯
        </div>
      `;
      L.marker(p2, {
        icon: L.divIcon({ className: 'arty-target-crosshair', html: iconHtml, iconAnchor: [9, 9] }),
        interactive: false
      }).addTo(artyLayer);
    }
  }, [activeBattery, activeTarget]);

  return (
    <div className="relative w-full h-full bg-bunker-950 overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Coordinate HUD Readout */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-bunker-900/90 backdrop-blur-md border border-bunker-700 px-3 py-1.5 rounded shadow-xl font-mono text-xs text-slate-300 pointer-events-none flex items-center space-x-3">
        <div>
          <span className="text-slate-500 uppercase text-[10px] mr-1">{t.hud_sector}</span>
          <span className="text-tactical-amber font-bold">{mousePos.grid}</span>
        </div>
        <div className="border-l border-bunker-700 pl-3">
          <span className="text-slate-500 uppercase text-[10px] mr-1">{t.hud_coords}</span>
          <span className="text-white font-bold">{mousePos.lat}m N, {mousePos.lng}m E</span>
        </div>
      </div>
    </div>
  );
}
