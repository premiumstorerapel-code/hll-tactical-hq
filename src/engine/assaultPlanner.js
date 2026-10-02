/**
 * Tactical Assault & Unit Deployment Planner for Hell Let Loose
 * Deterministic generation of battle plans, unit roles, firing lines, smoke screens, and attack vectors.
 */

import { calculateDistance, calculateBearing, bearingToCardinal } from './geometry';

export function generateAssaultPlan(targetCapPoint, friendlyDirection = null, mapWidth = 2000, mapHeight = 2000) {
  if (!targetCapPoint || !targetCapPoint.coordinates) return null;

  const [capLat, capLng] = targetCapPoint.coordinates;

  // If friendly direction angle isn't provided, determine default approach based on team/map:
  // e.g. for US attacking East: angle ~ 270° (advancing from West to East) or based on objective location
  let approachAngle = friendlyDirection;
  if (approachAngle === null || approachAngle === undefined) {
    // If objective is on eastern half of map, assume attack comes from West (bearing from center ~ 90°)
    approachAngle = capLng > mapWidth / 2 ? 270 : 90;
  }

  // Radians
  const toRad = (deg) => (deg * Math.PI) / 180;
  const oppAngle = (approachAngle + 180) % 360; // Direction from cap towards friendly rear

  // 1. Attack Garrison (185m from cap point along rear approach line)
  const garLat = Math.round(capLat + 185 * Math.cos(toRad(oppAngle)));
  const garLng = Math.round(capLng + 185 * Math.sin(toRad(oppAngle)));
  const attackGarrison = {
    id: `plan_gar_${targetCapPoint.id}`,
    name: `Guarnición de Ataque (${bearingToCardinal(oppAngle)})`,
    type: 'friendly_garrison',
    coordinates: [garLat, garLng],
    role: 'Punto de Reaparición Principal',
    description: 'Guarnición táctica a 185m del objetivo. Permite el despliegue continuo de 50 tropas sin saturar el círculo.'
  };

  // 2. Base of Fire / Elemento de Supresión MG (130m frontal)
  const bofAngle = (oppAngle + 15) % 360;
  const bofLat = Math.round(capLat + 130 * Math.cos(toRad(bofAngle)));
  const bofLng = Math.round(capLng + 130 * Math.sin(toRad(bofAngle)));
  const baseOfFire = {
    id: `plan_bof_${targetCapPoint.id}`,
    name: 'Escuadra Alpha: Base de Fuego (MG)',
    type: 'friendly_op',
    coordinates: [bofLat, bofLng],
    role: 'Supresión Frontal de Ametralladoras',
    description: 'Ametrallador (MG42 / Browning .30) con bípode desplegado. Fuego continuo de supresión sobre ventanas y trincheras del punto.',
    firingCone: {
      origin: [bofLat, bofLng],
      target: [capLat, capLng],
      spread: 25
    }
  };

  // 3. Flanking Assault Element (90° offset, 160m away in hedgerow/flank)
  const flankAngle = (oppAngle + 80) % 360; // 80-90° to the side
  const flankLat = Math.round(capLat + 160 * Math.cos(toRad(flankAngle)));
  const flankLng = Math.round(capLng + 160 * Math.sin(toRad(flankAngle)));
  const flankSquad = {
    id: `plan_flank_${targetCapPoint.id}`,
    name: 'Escuadra Bravo: Maniobra de Flanqueo',
    type: 'friendly_op',
    coordinates: [flankLat, flankLng],
    role: 'Asalto de Flanqueo a 90°',
    description: 'Escuadra de asalto con subfusiles (Thompson / MP40) y granadas de humo avanzando por el corredor lateral para penetrar el punto.'
  };

  // 4. Armor Fire Support (250m hull-down position with heavy cannon)
  const armorAngle = (oppAngle - 25) % 360;
  const armorLat = Math.round(capLat + 250 * Math.cos(toRad(armorAngle)));
  const armorLng = Math.round(capLng + 250 * Math.sin(toRad(armorAngle)));
  const armorSupport = {
    id: `plan_armor_${targetCapPoint.id}`,
    name: 'Blindado Pesado: Apoyo de Fuego Directo',
    type: 'friendly_tank',
    coordinates: [armorLat, armorLng],
    role: 'Cañoneo HE y Blindaje Móvil',
    description: 'Tanque en posición de casco oculto (Hull-down). Dispara proyectiles de alto explosivo (HE) para derribar defensas y nidos de ametralladoras.'
  };

  // 5. Smoke Screen Barrage Line (45m in front of capture point)
  // Perpendicular to approach angle
  const smokeCenterLat = capLat + 50 * Math.cos(toRad(oppAngle));
  const smokeCenterLng = capLng + 50 * Math.sin(toRad(oppAngle));
  const perp1 = (oppAngle + 90) % 360;
  const perp2 = (oppAngle - 90) % 360;
  const smokeLine = [
    [Math.round(smokeCenterLat + 40 * Math.cos(toRad(perp1))), Math.round(smokeCenterLng + 40 * Math.sin(toRad(perp1)))],
    [Math.round(smokeCenterLat + 40 * Math.cos(toRad(perp2))), Math.round(smokeCenterLng + 40 * Math.sin(toRad(perp2)))]
  ];

  // 6. Recon Infiltration Route (Hunting Enemy Defense Garrison in the rear)
  const reconAngle = (oppAngle + 180 + 35) % 360; // Behind cap point
  const reconLat = Math.round(capLat + 140 * Math.cos(toRad(reconAngle)));
  const reconLng = Math.round(capLng + 140 * Math.sin(toRad(reconAngle)));
  const reconTeam = {
    id: `plan_recon_${targetCapPoint.id}`,
    name: 'Equipo Recon: Caza de Guarnición Enemiga',
    type: 'recon_unit',
    coordinates: [reconLat, reconLng],
    role: 'Infiltración Trasera / Sabotaje',
    description: 'Francotirador y Observador infiltrados por la retaguardia para localizar y desmantelar la guarnición defensiva enemiga.'
  };

  // 7. Tactical Assault Arrows (Vectors)
  const mainAttackVector = [
    [garLat, garLng],
    [Math.round((garLat + capLat) / 2), Math.round((garLng + capLng) / 2)],
    [capLat, capLng]
  ];

  const flankAttackVector = [
    [flankLat, flankLng],
    [Math.round(capLat + 60 * Math.cos(toRad(flankAngle + 40))), Math.round(capLng + 60 * Math.sin(toRad(flankAngle + 40)))],
    [capLat, capLng]
  ];

  return {
    targetCapPoint,
    approachAngle,
    units: [attackGarrison, baseOfFire, flankSquad, armorSupport, reconTeam],
    smokeLine,
    mainAttackVector,
    flankAttackVector,
    phases: [
      {
        phase: 1,
        title: "Fase 1: Fijación y Supresión",
        doctrine: "La Escuadra Alpha despliega la ametralladora MG a 130m mientras el tanque abre fuego HE contra las posiciones fortificadas para suprimir a los defensores."
      },
      {
        phase: 2,
        title: "Fase 2: Cortina de Humo y Maniobra Lateral",
        doctrine: "Lanzar granadas de humo a 45m del punto para cortar la visión enemiga. La Escuadra Bravo avanza al flanco a 90° usando setos y zanjas cubiertas."
      },
      {
        phase: 3,
        title: "Fase 3: Asalto Coordinado y Caza de Guarnición",
        doctrine: "Brecha coordinada con subfusiles mientras el equipo Recon desmantela la guarnición enemiga por la retaguardia para cortar sus refuerzos."
      },
      {
        phase: 4,
        title: "Fase 4: Consolidación Inmediata",
        doctrine: "Levantar una guarnición defensiva dentro del sector asegurado inmediatamente antes del contrataque enemigo."
      }
    ]
  };
}
