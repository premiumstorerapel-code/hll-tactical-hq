/**
 * Tactical Math & Geometry Engine for Hell Let Loose
 * Deterministic client-side tactical advisor
 */

// Calculate Euclidean distance in meters between two [lat, lng] points
export function calculateDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  const dy = p2[0] - p1[0];
  const dx = p2[1] - p1[1];
  return Math.hypot(dx, dy);
}

// Calculate bearing in degrees from p1 to p2 (0° = North, 90° = East, 180° = South, 270° = West)
export function calculateBearing(p1, p2) {
  if (!p1 || !p2) return 0;
  const dy = p2[0] - p1[0]; // Leaflet lat: North is positive
  const dx = p2[1] - p1[1]; // Leaflet lng: East is positive
  // Math.atan2(dx, dy) gives 0 at North, 90 at East
  let deg = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return Math.round(deg * 10) / 10;
}

// Convert bearing to standard military 8-cardinal direction
export function bearingToCardinal(deg) {
  const cardinals = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return cardinals[index];
}

// Convert Leaflet [lat, lng] in meters to HLL Keypad Grid reference
// E.g., Map 2000m x 2000m -> 10x10 sectors (A-J columns, 1-10 rows).
// Each 200m sector has a 3x3 keypad (1-9).
export function getGridKeypad(point, widthMeters = 2000, heightMeters = 2000) {
  if (!point) return "N/A";
  const lat = point[0]; // 0 (South) to heightMeters (North)
  const lng = point[1]; // 0 (West) to widthMeters (East)

  const colIndex = Math.min(9, Math.max(0, Math.floor(lng / 200)));
  const colLetter = String.fromCharCode(65 + colIndex); // A-J

  // Row index from North (1) to South (10)
  const rowFromNorth = Math.min(9, Math.max(0, Math.floor((heightMeters - lat) / 200)));
  const rowNumber = rowFromNorth + 1; // 1-10

  // Keypad inside 200m sector (3x3 keypad)
  // Keypad rows: top=7,8,9; mid=4,5,6; bot=1,2,3
  const xInSector = (lng % 200) / 200;
  const yInSector = ((heightMeters - lat) % 200) / 200;

  const kpCol = Math.min(2, Math.max(0, Math.floor(xInSector * 3)));
  const kpRow = Math.min(2, Math.max(0, Math.floor(yInSector * 3)));
  
  // kpRow 0 = top (7,8,9), 1 = mid (4,5,6), 2 = bottom (1,2,3)
  const keypadLayout = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3]
  ];
  const keypad = keypadLayout[kpRow][kpCol];

  return `${colLetter}${rowNumber} kp${keypad}`;
}

/**
 * Check if a proposed garrison position violates the 200m Garrison Rule.
 * In HLL, friendly garrisons must be separated by >= 200m.
 */
export function validateGarrisonPlacement(newPos, existingGarrisons, currentId = null) {
  const violations = [];
  for (const g of existingGarrisons) {
    if (g.id === currentId) continue;
    const dist = calculateDistance(newPos, g.coordinates);
    if (dist < 200) {
      violations.push({
        conflictingGarrison: g,
        distance: Math.round(dist),
        shortfall: Math.round(200 - dist)
      });
    }
  }
  return {
    isValid: violations.length === 0,
    violations,
    minDistance: violations.length > 0 ? Math.min(...violations.map(v => v.distance)) : null
  };
}

/**
 * Defensive Triangle Algorithm:
 * Evaluates the active defensive sector.
 * Requirements:
 * - Minimum 2 friendly garrisons within 220m of the active defense point to prevent wipeout from single bombing run.
 * - Suggests up to 2 backup garrisons at ~185m-205m in safe angles.
 */
export function analyzeDefensiveTriangle(activeCapPoint, friendlyGarrisons, mapWidth = 2000, mapHeight = 2000) {
  if (!activeCapPoint) return null;

  const nearbyGarrisons = friendlyGarrisons.filter(g => {
    const dist = calculateDistance(activeCapPoint.coordinates, g.coordinates);
    return dist <= 220;
  });

  const count = nearbyGarrisons.length;
  const isVulnerable = count < 2;

  // Calculate suggestions if < 2
  const suggestions = [];
  if (count < 2) {
    // Generate candidate positions in a triangle pattern around cap point
    // Angles: 30°, 150°, 270° or offset depending on existing garrison
    let baseAngles = [45, 165, 285];
    if (count === 1) {
      const existingAngle = calculateBearing(activeCapPoint.coordinates, nearbyGarrisons[0].coordinates);
      baseAngles = [(existingAngle + 120) % 360, (existingAngle + 240) % 360];
    }

    baseAngles.forEach((angleDeg, idx) => {
      if (suggestions.length >= (2 - count)) return;

      const rad = (angleDeg * Math.PI) / 180;
      // Target 195m distance from active cap
      const targetDist = 195;
      const proposedLat = activeCapPoint.coordinates[0] + targetDist * Math.cos(rad);
      const proposedLng = activeCapPoint.coordinates[1] + targetDist * Math.sin(rad);

      // Clamp within map bounds
      const clampedLat = Math.max(50, Math.min(mapHeight - 50, proposedLat));
      const clampedLng = Math.max(50, Math.min(mapWidth - 50, proposedLng));
      const candidatePos = [Math.round(clampedLat), Math.round(clampedLng)];

      // Verify > 200m from all existing garrisons
      const validation = validateGarrisonPlacement(candidatePos, friendlyGarrisons);
      if (validation.isValid) {
        suggestions.push({
          id: `suggested_triangle_gar_${idx + 1}`,
          name: `Backup Garrison ${idx + 1} (${bearingToCardinal(angleDeg)})`,
          coordinates: candidatePos,
          distanceToCap: Math.round(calculateDistance(candidatePos, activeCapPoint.coordinates)),
          bearingFromCap: Math.round(angleDeg),
          cardinal: bearingToCardinal(angleDeg),
          suppliesNeeded: 50, // Defensive blue zone
          reason: "Creates redundant defensive triangle resilient to artillery and bombing runs"
        });
      }
    });
  }

  return {
    activeCapPoint,
    nearbyGarrisons,
    count,
    isVulnerable,
    severity: count === 0 ? "CRITICAL" : count === 1 ? "HIGH ALERT" : "OPTIMAL",
    message: count === 0
      ? "DEFENSE COLLAPSE RISK: 0 garrisons within 220m! Any enemy push will immediately decap this sector."
      : count === 1
      ? "VULNERABLE DEFENSE: Only 1 garrison within 220m. A single enemy Bombing Run or stealth satchel will wipe all spawns!"
      : "DEFENSE FORTIFIED: Robust defensive perimeter established with 2+ mutually supporting garrisons.",
    suggestions
  };
}

/**
 * Assault Vector / Chokepoint Analyzer:
 * Detects if all allied spawn points (garrisons + outposts) attacking an objective are on a single vector.
 * "Meat Grinder / Funnel warning".
 * Suggests orthogonal (90°) flanking routes.
 */
export function analyzeAssaultVectors(targetObjective, friendlySpawns, pois = []) {
  if (!targetObjective || friendlySpawns.length < 2) {
    return {
      status: "INSUFFICIENT_DATA",
      isFunneled: false,
      message: "Place at least 2 attack spawns (Garrison/OP) to evaluate assault vector geometry."
    };
  }

  // Calculate bearings from each spawn toward target objective
  const vectors = friendlySpawns.map(s => {
    const bearing = calculateBearing(s.coordinates, targetObjective.coordinates);
    const distance = calculateDistance(s.coordinates, targetObjective.coordinates);
    return {
      id: s.id,
      name: s.name,
      bearing,
      distance: Math.round(distance)
    };
  });

  // Calculate angular variance / span
  const bearings = vectors.map(v => v.bearing);
  let minDiff = 360;
  let maxDiff = 0;

  for (let i = 0; i < bearings.length; i++) {
    for (let j = i + 1; j < bearings.length; j++) {
      let diff = Math.abs(bearings[i] - bearings[j]);
      if (diff > 180) diff = 360 - diff;
      if (diff > maxDiff) maxDiff = diff;
    }
  }

  // If all spawns are within a 40° angular cone, it's a funnel
  const isFunneled = maxDiff < 40;
  const avgBearing = bearings.reduce((a, b) => a + b, 0) / bearings.length;

  const flanks = [];
  if (isFunneled) {
    // Left flank (+90°) and Right flank (-90°)
    const leftBearing = (avgBearing + 90) % 360;
    const rightBearing = (avgBearing + 270) % 360;

    // Check if there are natural concealed route POIs near these flanks
    const targetPos = targetObjective.coordinates;
    const leftPos = [
      Math.round(targetPos[0] + 250 * Math.cos((leftBearing * Math.PI) / 180)),
      Math.round(targetPos[1] + 250 * Math.sin((leftBearing * Math.PI) / 180))
    ];
    const rightPos = [
      Math.round(targetPos[0] + 250 * Math.cos((rightBearing * Math.PI) / 180)),
      Math.round(targetPos[1] + 250 * Math.sin((rightBearing * Math.PI) / 180))
    ];

    flanks.push({
      side: "WEST / LEFT FLANK",
      angle: Math.round(leftBearing),
      suggestedCoord: leftPos,
      doctrine: "Deploy secondary Assault squad with smoke grenades to establish flanking Outpost (OP) and cross-fire MG nest."
    });
    flanks.push({
      side: "EAST / RIGHT FLANK",
      angle: Math.round(rightBearing),
      suggestedCoord: rightPos,
      doctrine: "Advance through hedgerow / sunken corridor at 90° angle to envelop the enemy cap circle."
    });
  }

  return {
    status: isFunneled ? "ALERT" : "DISPERSED",
    isFunneled,
    angularSpread: Math.round(maxDiff),
    avgAssaultAngle: Math.round(avgBearing),
    cardinalApproach: bearingToCardinal(avgBearing),
    vectors,
    message: isFunneled
      ? `MEAT GRINDER / FUNNEL WARNING: All ${friendlySpawns.length} allied spawns attack from the same narrow ${Math.round(maxDiff)}° vector (${bearingToCardinal(avgBearing)}). Enemy MG42 and armor will suppress your entire force.`
      : `HEALTHY MULTI-VECTOR ATTACK: Allied spawns are dispersed across ${Math.round(maxDiff)}°, creating crossfire opportunities.`,
    flankSuggestions: flanks
  };
}

/**
 * Blind Spot & Screening Detector:
 * Divides 360° perimeter around defensive strongpoint into 4 quadrants.
 * Alerts if any quadrant within 300m has ZERO friendly presence.
 */
export function analyzeBlindSpots(defenseCapPoint, allFriendlyMarkers) {
  if (!defenseCapPoint) return [];

  const quadrants = [
    { name: "North-East (NE)", minAngle: 0, maxAngle: 90, icon: "↗" },
    { name: "South-East (SE)", minAngle: 90, maxAngle: 180, icon: "↘" },
    { name: "South-West (SW)", minAngle: 180, maxAngle: 270, icon: "↙" },
    { name: "North-West (NW)", minAngle: 270, maxAngle: 360, icon: "↖" }
  ];

  const results = quadrants.map(q => {
    const markersInQuadrant = allFriendlyMarkers.filter(m => {
      const dist = calculateDistance(defenseCapPoint.coordinates, m.coordinates);
      if (dist > 320) return false;
      const bearing = calculateBearing(defenseCapPoint.coordinates, m.coordinates);
      return bearing >= q.minAngle && bearing < q.maxAngle;
    });

    const isBlind = markersInQuadrant.length === 0;

    return {
      quadrant: q.name,
      icon: q.icon,
      isBlind,
      count: markersInQuadrant.length,
      markers: markersInQuadrant,
      threatAssessment: isBlind
        ? `HIGH VULNERABILITY: 0 presence in ${q.name}. Enemy Recon sniper or flanking armor can sneak in undetected.`
        : `SECURED: Covered by ${markersInQuadrant.length} friendly unit(s)/spawns.`
    };
  });

  return results;
}
