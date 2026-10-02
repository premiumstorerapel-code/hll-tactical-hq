# Hell Let Loose - Tactical Command & Recon Platform

An autonomous, 100% deterministic client-side Tactical Web Application for **Hell Let Loose** (HLL) serving Commanders, Officers (SL), and Tank Crews.

## 🎯 Flagship Features

### 1. Research & Asset Acquisition
- **High-Resolution Tactical Maps**: Carentan (2016m), Sainte-Mère-Église (1984m), and Foy (Winter 1984m).
- **Extracted Terrain & Metadata**: Cap points (Strongpoints), chokepoints, high fortified buildings, hedgerow corridors, and artillery batteries stored in `/data/maps/` and `/src/data/maps/`.

### 2. Deterministic Real-Time Tactical Advisor (Math & Geometry Engine)
- **The 200m Garrison Rule**: Real-time visual 200m exclusionary circles. Identifies and flags illegal proximity placements (< 200m).
- **Defensive Triangle Algorithm**: If active defense sector has < 2 garrisons within 220m, triggers HIGH ALERT ("Vulnerable to single bombing run / wipe"). Computes 2 backup garrisons at safe blue zone coordinates with 1-click deployment.
- **Assault Vector / Chokepoint Analyzer**: Detects when allied spawns funnel through a narrow vector (< 40° spread) and triggers the "MEAT GRINDER / FUNNEL WARNING", computing 90° orthogonal flanking corridors.
- **Blind Spot & Screening Detector**: 360° perimeter radar dividing defense points into 4 quadrants (NE, SE, SW, NW) to alert about unmonitored avenues vulnerable to Recon sniper infiltration.

### 3. Role Toggle Engine
- **Commander Mode**: Macro logistics tracking Munitions, Manpower, and Fuel resource generation. Strict enforcement of the 8-Garrison team cap. Cooldown timers and map triggers for Bombing Run, Supply Drop (100 supplies), Recon Plane, Airhead Spawn, Reinforce Sector, and Heavy Tank Spawn.
- **Officer (Squad Leader) Mode**: Micro-tactics engine with an interactive 120s Outpost (OP) cooldown timer, Web Audio ready chime, Squad Doctrine (Fire & Maneuver), and Blue Zone (50 supplies) vs. Red Zone (100 supplies) validation.
- **Tank Crew Mode**: Armor Angling Simulator (calculates effective plate thickness from impact angles) and priority weakspot intel for Tiger I, Panther, and Sherman 76.

### 4. Artillery Calculator Tool
- Compact floating HUD widget supporting US (105mm M2A1), GER (10.5cm leFH 18), RUS (122mm M-30), and GB/CAN (25-Pounder).
- Interactive Map Targeting (battery to target) and Manual Distance slider (100m to 1600m).
- Outputs exact elevation in Milliradians (MIL), firing azimuth, and animated flight time countdown with blast sound effect.

### 5. Tactical Terrain & POI Layer
- Interactive fortified buildings, canal bridges, sunken bocage corridors, and hull-down vantage hills.
- Clicking any POI displays an Actionable Military Directive modal with tactical advantages, lines of sight, doctrine orders, and enemy counter-measures.

### 6. Map Tools & Battle Planning
- Distance Ruler measuring exact meters, bearing, infantry sprint time, and tank transit time.
- Battle Plan drawing brush and arrow tools.
- Export and import battle plans to JSON and clipboard.
- WWII Bunker CRT scanline overlay and procedural radio audio effects via Web Audio API.

---

## 🚀 Quick Start

```bash
cd hll-tactical-hq
npm install
npm run dev
```

Open `http://localhost:5173/` in any modern web browser.
