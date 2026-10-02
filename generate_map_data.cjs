const fs = require('fs');
const path = require('path');

let txt = fs.readFileSync('maps_raw.js', 'utf8').replace('const MAP_DATABASE =', 'global.MAP_DATABASE =');
eval(txt);

function toLeafletCoords(gameX, gameY, widthMeters, heightMeters) {
  // Leaflet CRS.Simple:
  // Lat: 0 is South (bottom of image), heightMeters is North (top of image)
  // Lng: 0 is West (left of image), widthMeters is East (right of image)
  // gameX: negative West, positive East
  // gameY: negative South, positive North
  const lng = Math.round((widthMeters / 2 + gameX / 100) * 10) / 10;
  const lat = Math.round((heightMeters / 2 + gameY / 100) * 10) / 10;
  return [lat, lng]; // [lat, lng] = [y, x]
}

// Map specific POIs (fortified buildings, chokepoints, concealed routes, vantage hills)
// Specified in [lat, lng]
const extraPOIs = {
  CAR: [
    {
      id: "car_poi_church",
      name: "Carentan Catholic Church (Eglise Notre-Dame)",
      type: "building",
      coordinates: [1020.0, 1025.0],
      advantage: "Elevated Gothic bell tower provides 360-degree line of sight over Town Center, Canal Crossing, and southern railroad approaches. High hard stone cover impervious to small arms and light explosive fragmentation.",
      doctrineTactic: "Position designated Marksman / Sniper in belfry with Spotter monitoring Canal bridge. Place Squad Leader OP in church courtyard with AP mines on stairwell entrance.",
      idealSquadRole: "Recon / Machine Gunner",
      lineOfSight: "Full 360° over Town Center plaza and approach bridges up to 400m.",
      counterMeasures: "Concentrated medium armor HE shell fire on upper windows; smoke perimeter to blind tower snipers."
    },
    {
      id: "car_poi_customs_office",
      name: "Customs Office 2-Story Depot",
      type: "building",
      coordinates: [1350.0, 1416.0],
      advantage: "Dual-story industrial masonry structure controlling the entrance into the Customs sector. Second-floor windows create intersecting kill zones across the rail junction.",
      doctrineTactic: "Deploy bipod MG42/Browning .30 Cal on top-floor south-facing window. Plant AP mines on ground floor interior doorway.",
      idealSquadRole: "Machine Gunner & Engineer (Barbed Wire)",
      lineOfSight: "Direct 250m frontal coverage over rail bed and industrial warehouse approach.",
      counterMeasures: "Bazooka/Panzerschreck wall breaches; flanking maneuver through eastern hedgerows."
    },
    {
      id: "car_poi_canal_bridge",
      name: "Canal Chokepoint & Lock Bridge",
      type: "chokepoint",
      coordinates: [1402.0, 1066.0],
      advantage: "Narrow stone bridge over the deep water canal. Heavy armor and infantry crossing must funnel through a 6-meter wide aperture with zero natural flank cover.",
      doctrineTactic: "Engineer must lay Anti-Tank mine belt across bridge approach. Squad Leader calls precision artillery or 50mm smoke barrage if friendly forces need to push across.",
      idealSquadRole: "Anti-Tank / Combat Engineer",
      lineOfSight: "Linear funnel along canal bank corridor.",
      counterMeasures: "Airhead drop on opposing bank or smoke screen flanking via far eastern Canal Locks."
    },
    {
      id: "car_poi_purple_heart_causeway",
      name: "Cole's Causeway (Purple Heart Lane Entry)",
      type: "chokepoint",
      coordinates: [996.0, 480.0],
      advantage: "Flooded farm marshes on both sides of the roadway limit all mechanical and mechanized infantry movement to the elevated road embankment.",
      doctrineTactic: "Set up interlocking MG fire nests behind roadside hedgerow berms. Ambush enemy advance with Satchel charges when lead armor stalls.",
      idealSquadRole: "Machine Gunner & Anti-Tank",
      lineOfSight: "Long straight 350m corridor vulnerable to sniper and AT gun fire.",
      counterMeasures: "Off-road infantry crawl using drainage ditches with high smoke concealment."
    },
    {
      id: "car_poi_bocage_corridor_north",
      name: "Northern Bocage Hedgerow Trench Network",
      type: "route",
      coordinates: [1596.0, 750.0],
      advantage: "Ancient Norman sunken hedgerows with thick 2m earthen berms and thorny brush. Immune to direct armored high-velocity tank cannon sights.",
      doctrineTactic: "Primary flanking highway for assault squads pushing towards Blactot and Town Center. Squad Leaders should stagger Outposts every 150m along inner berm.",
      idealSquadRole: "Assault / Automatic Rifleman",
      lineOfSight: "Extremely short (under 25m), optimal for submachine guns, shotguns, and grenades.",
      counterMeasures: "Preemptive artillery bombardment or armor HE blast tree-bursts."
    },
    {
      id: "car_poi_mont_halais_ridge",
      name: "Mont Halais Southern Overlook",
      type: "hill",
      coordinates: [495.0, 1346.0],
      advantage: "Highest southern topographical vantage overlooking the railway tracks, canal approaches, and rural farm fields.",
      doctrineTactic: "Establish heavy anti-tank gun (PaK 40 / 57mm M1) in hull-down concealment with dedicated support player dropping 50-supplies boxes.",
      idealSquadRole: "Armor / Anti-Tank Gun Crew",
      lineOfSight: "Broad strategic panoramic view spanning 600m.",
      counterMeasures: "Mortar / recon plane spotted bombing run; smoke screen base of hill."
    }
  ],
  SME: [
    {
      id: "sme_poi_church_square",
      name: "Sainte-Mère-Église Town Church & Belltower",
      type: "building",
      coordinates: [1066.0, 1059.0],
      advantage: "Iconic church square where American paratroopers landed. Solid stone masonry with commanding second-tier windows and high roof visibility.",
      doctrineTactic: "Establish squad defensive anchor. Barricade interior chokepoints and position MG covering the southern plaza fountain approach.",
      idealSquadRole: "Squad Leader & Machine Gunner",
      lineOfSight: "Full 360-degree control of center plaza and cross streets.",
      counterMeasures: "Direct tank shell wall puncture and continuous artillery suppression."
    },
    {
      id: "sme_poi_cemetery_wall",
      name: "Historic Stone Cemetery Wall",
      type: "building",
      coordinates: [936.0, 1288.0],
      advantage: "Waist-high stone walling and stone tombs provide heavy ballistic cover for prone infantry defending against eastern sector thrusts.",
      doctrineTactic: "Support role sets ammo boxes behind mausoleums; infantry holds fire until enemy enters open field at 75m.",
      idealSquadRole: "Rifleman / Support",
      lineOfSight: "150m open field coverage toward Les Vieux Vergers.",
      counterMeasures: "HE artillery fragmentation and flanking through the northern orchard hedgerow."
    },
    {
      id: "sme_poi_crossroads_junction",
      name: "Highway D115 Critical Crossroads",
      type: "chokepoint",
      coordinates: [978.0, 1722.0],
      advantage: "Main east-west supply artery for Axis/Allied armor reinforcement columns entering the center sectors.",
      doctrineTactic: "Conceal Anti-Tank mines in dark pavement shadows. Place AT gun 150m behind tree line with direct side-armor angle.",
      idealSquadRole: "Anti-Tank / Engineer",
      lineOfSight: "Linear north-south and east-west clear line of fire.",
      counterMeasures: "Recon vehicle screening before main armor column advances."
    },
    {
      id: "sme_poi_western_sunken_lane",
      name: "Western Bocage Sunken Lane (Covered Route)",
      type: "route",
      coordinates: [1139.0, 673.0],
      advantage: "Sunken cart track enclosed by dense 3-meter earthen hedgerow banks on both sides. Conceals full infantry platoons from sniper observation.",
      doctrineTactic: "Execute 90-degree flanking assault toward Western Approach strongpoint. Move in wedge formation with point rifleman checking corners.",
      idealSquadRole: "Assault / Officer",
      lineOfSight: "Restricted linear trench view.",
      counterMeasures: "Tripwire AP mines and fragmentation grenade lobbing over hedgerow walls."
    },
    {
      id: "sme_poi_flak_embankment",
      name: "Flak Position Gun Embankment",
      type: "hill",
      coordinates: [1399.0, 306.0],
      advantage: "Earth-bermed gun revetments shielding artillery and heavy anti-aircraft pieces from flat-trajectory ground fire.",
      doctrineTactic: "Hull-down tank positioning to hull-lock incoming enemy medium armor advancing from Vaulaville.",
      idealSquadRole: "Tank Crew / Anti-Tank Gun",
      lineOfSight: "Wide 400m firing arc over northern agrarian fields.",
      counterMeasures: "Rear infantry satchel charge rush through orchard blindspot."
    }
  ],
  FOY: [
    {
      id: "foy_poi_bois_jacques",
      name: "Bois Jacques Foxhole Network (Easy Co. Trenches)",
      type: "building",
      coordinates: [310.0, 936.0],
      advantage: "Deep snow-covered foxholes and pine tree trunks providing excellent splinter cover and extreme concealment against enemy armor optics.",
      doctrineTactic: "Set up forward Squad Leader Outpost behind earthen revetments. Base of Fire element pins down enemy advancing across snowy field.",
      idealSquadRole: "Officer & Machine Gunner",
      lineOfSight: "200m open clearing sightline towards Foy village southern edge.",
      counterMeasures: "Airburst artillery rounds shearing tree branches; high-explosive tank bombardment."
    },
    {
      id: "foy_poi_cobru_factory",
      name: "Cobru Industrial Brick Factory",
      type: "building",
      coordinates: [1438.0, 692.0],
      advantage: "Multi-room reinforced red brick facility with high rafters and window slits. Unshakeable defensive strongpoint against northern armor incursions.",
      doctrineTactic: "Engineer build stage 3 bunkers and barbed wire funnels across all rear exterior doorways. Place garrison inside central warehouse.",
      idealSquadRole: "Engineer / Support / Machine Gunner",
      lineOfSight: "Domination of northern road approaches toward Recogne.",
      counterMeasures: "Heavy tank AP penetration on soft brick sections, combined with satchel assault teams."
    },
    {
      id: "foy_poi_n30_junction",
      name: "N30 Highway & Rail Chokepoint",
      type: "chokepoint",
      coordinates: [674.0, 607.0],
      advantage: "Direct highway connecting Bastogne to Noville bordered by steep snow banks and ditches.",
      doctrineTactic: "Place daisy chain AT mines across road tracks. Keep Anti-Tank gun concealed in woodline 120m away.",
      idealSquadRole: "Anti-Tank",
      lineOfSight: "Dead straight 400m highway visibility.",
      counterMeasures: "Advance tanks through snowy ditch off-road with infantry escorting flanks."
    },
    {
      id: "foy_poi_dugout_barn",
      name: "Dugout Barn Hull-Down Vantage",
      type: "hill",
      coordinates: [1039.0, 1452.0],
      advantage: "Elevated snow berm with sunken wooden barn creating an optimal hull-down vantage point for heavy tanks (Tiger I / 76mm Jumbo).",
      doctrineTactic: "Hull-down tank holds the eastern flank, denying enemy armor movement along the Bizory-Foy road axis.",
      idealSquadRole: "Tank Commander & Gunner",
      lineOfSight: "500m over central eastern fields and woods.",
      counterMeasures: "Smoke rounds on turret face; infantry flanking through woods with bazookas."
    },
    {
      id: "foy_poi_west_bend_drainage",
      name: "West Bend Frozen Creek Corridor",
      type: "route",
      coordinates: [1121.0, 460.0],
      advantage: "Depressed terrain depression with snow drifts concealing infantry silhouettes against the horizon.",
      doctrineTactic: "Stealth flanking vector to bypass Foy village center and plant enemy garrison hunting outposts behind Axis lines.",
      idealSquadRole: "Recon / Assault",
      lineOfSight: "Low profile, concealed from long-range snipers in church belfries.",
      counterMeasures: "Periodic machine gun recon-by-fire into creek hollows."
    }
  ]
};

const mapConfigs = [
  { key: 'CAR', file: 'carentan.json', img: '/maps/carentan.webp' },
  { key: 'SME', file: 'sme.json', img: '/maps/sme.webp' },
  { key: 'FOY', file: 'foy.json', img: '/maps/foy.webp' }
];

mapConfigs.forEach(mc => {
  const m = global.MAP_DATABASE[mc.key];
  const widthMeters = m.widthMeters || 2000;
  const heightMeters = m.heightMeters || 2000;

  const points = [];

  m.strongpoints.forEach(sp => {
    const coords = toLeafletCoords(sp.gameX, sp.gameY, widthMeters, heightMeters);
    const isArty = sp.type === 'point' || (sp.id && sp.id.includes('_A'));
    const isStrongpoint = sp.type === 'strongpoint';

    let itemType = isArty ? 'artillery' : 'strongpoint';
    let labelName = sp.label || (isArty ? (sp.team.toUpperCase() + ' Artillery ' + sp.id) : 'Objective ' + sp.id);

    points.push({
      id: `${mc.key.toLowerCase()}_${sp.id.toLowerCase()}`,
      name: labelName,
      type: itemType,
      coordinates: coords, // [lat, lng] in meters (CRS.Simple)
      rawGameCoords: { gameX: sp.gameX, gameY: sp.gameY },
      team: sp.team,
      radiusMeters: sp.radius ? Math.round(sp.radius / 100) : (isStrongpoint ? 50 : 10),
      advantage: isArty
        ? `Fixed ${sp.team.toUpperCase()} artillery battery position with maximum effective range up to 1600m.`
        : `Strategic Sector Capture Point for ${sp.team.toUpperCase()} team. Dominates surrounding 200m combat zone.`,
      doctrineTactic: isArty
        ? `Protect with defensive squad outpost and AP mines against enemy Recon sniper infiltration.`
        : `Anchor with minimum 2 defensive garrisons placed ~200m away in blue zone and 1 fallback garrison.`,
      idealSquadRole: isArty ? "Artillery Crew / Base Defense" : "Squad Leader / Support / Machine Gunner",
      lineOfSight: isArty ? "Indirect high-arc ballistic trajectory" : "Sector capture zone perimeter",
      counterMeasures: isArty ? "Allied Recon squad search and destroy; smoke out gun pit." : "Artillery barrage / bombing run before infantry breach."
    });
  });

  if (extraPOIs[mc.key]) {
    extraPOIs[mc.key].forEach(poi => {
      points.push({
        ...poi,
        rawGameCoords: {
          gameX: Math.round((poi.coordinates[1] - widthMeters / 2) * 100),
          gameY: Math.round((poi.coordinates[0] - heightMeters / 2) * 100)
        }
      });
    });
  }

  const mapData = {
    id: mc.key.toLowerCase(),
    code: mc.key,
    name: m.name,
    image: mc.img,
    widthMeters: widthMeters,
    heightMeters: heightMeters,
    gridSizeMeters: 200,
    gridCols: 10,
    gridRows: 10,
    teams: m.teams,
    history: m.history,
    strongpointsCount: points.filter(p => p.type === 'strongpoint').length,
    artilleryCount: points.filter(p => p.type === 'artillery').length,
    poiCount: points.filter(p => ['building', 'chokepoint', 'route', 'hill'].includes(p.type)).length,
    points: points
  };

  fs.writeFileSync(path.join('src', 'data', 'maps', mc.file), JSON.stringify(mapData, null, 2));
  fs.mkdirSync(path.join('data', 'maps'), { recursive: true });
  fs.writeFileSync(path.join('data', 'maps', mc.file), JSON.stringify(mapData, null, 2));

  console.log(`Generated ${mc.file}: ${points.length} total tactical POIs.`);
});
