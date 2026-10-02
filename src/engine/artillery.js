/**
 * Hell Let Loose Artillery Ballistics Engine
 * High-precision Milliradian (MIL) & Time-of-Flight calculation
 */

export const FACTION_ARTY_SPECS = {
  US: {
    name: "United States (105mm M2A1 Howitzer)",
    minDist: 100,
    maxDist: 1600,
    // Linear regression formula: mil = 1001.7333 - 0.237333 * dist
    // Exactly matches 100m -> 978 mil, 1600m -> 622 mil (step: -23.73 mil per 100m)
    distToMil: (dist) => 1001.7333 - 0.237333 * dist,
    milToDist: (mil) => (1001.7333 - mil) / 0.237333,
    flightTime: (dist) => 18 + (dist / 1600) * 8 // 18s to 26s
  },
  GER: {
    name: "Germany (10.5cm leFH 18/40)",
    minDist: 100,
    maxDist: 1600,
    distToMil: (dist) => 1001.7333 - 0.237333 * dist,
    milToDist: (mil) => (1001.7333 - mil) / 0.237333,
    flightTime: (dist) => 18 + (dist / 1600) * 8
  },
  RUS: {
    name: "Soviet Union (122mm M-30 Howitzer)",
    minDist: 100,
    maxDist: 1600,
    // 100m -> 1120 mil, 1600m -> 800 mil (step: -21.33 mil per 100m)
    // mil = 1141.333 - 0.213333 * dist
    distToMil: (dist) => 1141.3333 - 0.213333 * dist,
    milToDist: (mil) => (1141.3333 - mil) / 0.213333,
    flightTime: (dist) => 19 + (dist / 1600) * 7
  },
  GB: {
    name: "Great Britain (QF 25-Pounder)",
    minDist: 100,
    maxDist: 1600,
    // 100m -> 533 mil, 1600m -> 267 mil (step: -17.73 mil per 100m)
    // mil = 550.7333 - 0.177333 * dist
    distToMil: (dist) => 550.7333 - 0.177333 * dist,
    milToDist: (mil) => (550.7333 - mil) / 0.177333,
    flightTime: (dist) => 17 + (dist / 1600) * 8
  },
  CAN: {
    name: "Canada (QF 25-Pounder)",
    minDist: 100,
    maxDist: 1600,
    distToMil: (dist) => 550.7333 - 0.177333 * dist,
    milToDist: (mil) => (550.7333 - mil) / 0.177333,
    flightTime: (dist) => 17 + (dist / 1600) * 8
  }
};

/**
 * Calculate artillery firing solution
 */
export function calculateFiringSolution(distanceMeters, faction = "US", batteryCoords = null, targetCoords = null) {
  const spec = FACTION_ARTY_SPECS[faction] || FACTION_ARTY_SPECS.US;

  let dist = distanceMeters;
  let azimuth = null;

  if (batteryCoords && targetCoords) {
    const dy = targetCoords[0] - batteryCoords[0];
    const dx = targetCoords[1] - batteryCoords[1];
    dist = Math.hypot(dx, dy);

    let deg = (Math.atan2(dx, dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    azimuth = Math.round(deg * 10) / 10;
  }

  const roundedDist = Math.round(dist);
  const inRange = dist >= spec.minDist && dist <= spec.maxDist;

  const rawMil = spec.distToMil(dist);
  const mil = Math.round(rawMil);
  const flightSec = Math.round(spec.flightTime(dist) * 10) / 10;

  return {
    faction,
    factionName: spec.name,
    distance: roundedDist,
    inRange,
    mil,
    rawMil: Math.round(rawMil * 10) / 10,
    azimuth,
    flightTimeSeconds: flightSec,
    dispersionRadiusMeters: 20, // Standard HLL shell dispersion
    status: inRange
      ? "READY TO FIRE"
      : dist < spec.minDist
      ? "TARGET TOO CLOSE (< 100m)"
      : "OUT OF RANGE (> 1600m)"
  };
}
