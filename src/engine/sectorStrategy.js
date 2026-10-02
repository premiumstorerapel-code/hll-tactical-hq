/**
 * Sector Strategy & Tactical Hotspot Intelligence for Hell Let Loose
 * Contains verified strategic placements for:
 * - Optimal Garrisons (Attack & Defense Triangles)
 * - Heavy MG bipod nests with firing cones
 * - Sniper / Recon overwatch vantage towers
 * - Tank Hull-down & Ambush positions
 * - Critical AT Mine bottlenecks
 */

export const STRATEGIC_PLAYBOOK = {
  // ==========================================
  // CARENTAN (CAR)
  // ==========================================
  carentan: {
    // 1. TOWN CENTER (B7)
    car_b7: {
      name: "TOWN CENTER (Centro de Carentan)",
      coordinates: [1021.6, 1022.0],
      importance: "El sector central más crucial de Carentan. Bloques densos de edificios, plazas abiertas y accesos cruzados por puentes de canal.",
      attack: {
        title: "Plan de Asalto al Centro Urbano",
        summary: "Nunca asaltes por las calles principales frontales; las MGs en los áticos destrozarán a tu equipo. Emplea un asalto de pinza norte-sur apoyado por cañones HE.",
        garrisons: [
          {
            name: "Guarnición de Ataque Norte (Setos de Blactot)",
            coordinates: [1180.0, 950.0],
            role: "attack_garry",
            description: "A 175m al norte en patio protegido por muros de ladrillo. Entrada por callejones traseros sin exposición a la iglesia."
          },
          {
            name: "Guarnición de Ataque Sur (Depósito de Vías)",
            coordinates: [850.0, 1060.0],
            role: "flank_garry",
            description: "A 180m al sur detrás del terraplén de vías férreas. Permite pinzar el ayuntamiento desde dos ángulos a 90°."
          }
        ],
        mgSpots: [
          {
            name: "MG Supresión Norte (Ventana 2do Piso)",
            coordinates: [1120.0, 980.0],
            coneAngle: 160,
            coneSpread: 45,
            description: "Ametrallador con bípode en ventana hacia la plaza. Suprime a los defensores que asoman por las ventanas de la iglesia."
          }
        ],
        sniperSpots: [
          {
            name: "Nido de Sniper (Tejado Este)",
            coordinates: [1140.0, 1120.0],
            description: "Línea de visión directa de 280m barriendo la entrada de refuerzos enemigos desde la plaza."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Asalto (Hull-Down en Esquina)",
            coordinates: [1190.0, 890.0],
            description: "Chasis cubierto tras muro derruido. Solo la torreta asoma disparando proyectiles HE a los edificios ocupados."
          }
        ],
        atMines: [
          {
            name: "Mina AT en Cruce Norte",
            coordinates: [1090.0, 960.0],
            description: "Camino obligatorio para blindados ligeros y camiones de transporte enemigos."
          }
        ]
      },
      defense: {
        title: "Fortaleza Defensiva del Centro Urbano",
        summary: "Establece el Triángulo Defensivo de 3 guarniciones a ~200m. Si colocas la única guarnición dentro de la plaza, un solo bombardeo os dejará sin spawn.",
        garrisons: [
          {
            name: "Guarnición Defensiva Alpha (Patio de la Iglesia)",
            coordinates: [1040.0, 1030.0],
            role: "defense_garry",
            description: "Dentro del recinto empedrado de la iglesia. Protegida de proyectiles de tanque por muros de piedra sólida."
          },
          {
            name: "Guarnición Defensiva Bravo (Zona Residencial Oeste)",
            coordinates: [1010.0, 830.0],
            role: "defense_garry",
            description: "A 195m al oeste en patio interior con seto cerrado. Spawn de reserva esencial ante bombardeos."
          },
          {
            name: "Guarnición Defensiva Charlie (Bocage Este)",
            coordinates: [1020.0, 1220.0],
            role: "defense_garry",
            description: "A 200m al este. Asegura la llegada de refuerzos si el enemigo penetra por el canal."
          }
        ],
        mgSpots: [
          {
            name: "MG Bípode Fuego Cruzado 1 (Campanario)",
            coordinates: [1030.0, 1025.0],
            coneAngle: 270,
            coneSpread: 60,
            description: "Controla 3 calles completas con campo de tiro despejado hacia el oeste."
          },
          {
            name: "MG Bípode Fuego Cruzado 2 (Balcón Sur)",
            coordinates: [980.0, 1040.0],
            coneAngle: 0,
            coneSpread: 50,
            description: "Crea fuego cruzado letal con la MG del campanario en la plaza principal."
          }
        ],
        sniperSpots: [
          {
            name: "Francotirador en Campanario Iglesia",
            coordinates: [1030.0, 1025.0],
            description: "Visión panorámica de 360° hasta 400 metros. Prioridad: matar oficiales y ametralladores enemigos."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Defensivo (Emboscada Callejón)",
            coordinates: [990.0, 1110.0],
            description: "Cañón apuntando al cruce principal con blindaje frontal en ángulo hacia la entrada este."
          }
        ],
        atMines: [
          {
            name: "Cinturón de Minas AT Puente Canal",
            coordinates: [1060.0, 1140.0],
            description: "Imposible de esquivar para tanques enemigos que intenten cruzar el canal."
          }
        ]
      }
    },

    // 2. CANAL CROSSING (B8)
    car_b8: {
      name: "CANAL CROSSING (Cruce del Canal)",
      coordinates: [1402.0, 1066.0],
      importance: "Punto de estrangulamiento fluvial con puentes estrechos donde los tanques quedan atrapados sin maniobra.",
      attack: {
        title: "Plan de Asalto al Canal",
        summary: "Cruzar el puente frontalmente es un suicidio. Usa cortinas de humo densas en las esclusas y flanquea por el paso este.",
        garrisons: [
          {
            name: "Guarnición Asalto Ribera Oeste",
            coordinates: [1410.0, 890.0],
            role: "attack_garry",
            description: "Oculta tras terraplén vegetal a 175m del puente."
          },
          {
            name: "Guarnición Flanqueo Esclusas",
            coordinates: [1560.0, 1050.0],
            role: "flank_garry",
            description: "A 190m al norte para forzar el paso de agua por el vado secundario."
          }
        ],
        mgSpots: [
          {
            name: "MG Supresión Margen Ribera",
            coordinates: [1420.0, 930.0],
            coneAngle: 90,
            coneSpread: 40,
            description: "Dispara directo sobre las troneras del puente impidiendo que los defensores asomen la cabeza."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper en Molino Abandonado",
            coordinates: [1480.0, 920.0],
            description: "Tiro rasante a lo largo de toda la línea de agua."
          }
        ],
        tankSpots: [
          {
            name: "Tanque de Soporte Fuerte",
            coordinates: [1360.0, 840.0],
            description: "Fuego de contrabatería sobre los búnkeres de la orilla opuesta."
          }
        ],
        atMines: [
          {
            name: "Minas en Salida del Puente",
            coordinates: [1400.0, 1010.0],
            description: "Detiene en seco a blindados enemigos que avancen en contraofensiva."
          }
        ]
      },
      defense: {
        title: "Defensa Fortaleza del Canal",
        summary: "Convierte el puente en un embudo mortal con ametralladoras cruzadas y minas antitanque.",
        garrisons: [
          {
            name: "Guarnición Defensiva Ribera Este",
            coordinates: [1390.0, 1180.0],
            role: "defense_garry",
            description: "Detrás de muros de hormigón a 120m del puente."
          },
          {
            name: "Guarnición Retaguardia Esclusas",
            coordinates: [1560.0, 1200.0],
            role: "defense_garry",
            description: "A 210m para asegurar el flanco norte fluvial."
          }
        ],
        mgSpots: [
          {
            name: "Nido MG Enfilada de Puente",
            coordinates: [1400.0, 1110.0],
            coneAngle: 270,
            coneSpread: 30,
            description: "Línea de tiro recta y mortal sobre todo el ancho del puente."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper en Pajar Elevado",
            coordinates: [1340.0, 1160.0],
            description: "Caza a los ingenieros enemigos que intentan poner cargas explosivas."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Emboscada PaK Alley",
            coordinates: [1420.0, 1220.0],
            description: "Posición hull-down disparando de costado al puente."
          }
        ],
        atMines: [
          {
            name: "Minas AT en Asfalto del Puente",
            coordinates: [1402.0, 1066.0],
            description: "Trampa mortal e inevitable sobre el arco de piedra."
          }
        ]
      }
    },

    // 3. CUSTOMS (Aduana)
    car_b11: {
      name: "CUSTOMS (Aduana / Estación de Carga)",
      coordinates: [1350.0, 1416.0],
      importance: "Área industrial ferroviaria con almacenes de ladrillo masivo, vagones de tren y hangares.",
      attack: {
        title: "Plan de Asalto a la Aduana",
        summary: "Avanza por el corredor de vagones de tren para tener cobertura dura y evita los patios abiertos.",
        garrisons: [
          {
            name: "Guarnición Asalto Vía Férrea",
            coordinates: [1220.0, 1310.0],
            role: "attack_garry",
            description: "A 170m oculta entre vagones cisterna volcados."
          },
          {
            name: "Guarnición Flanqueo Bocage Norte",
            coordinates: [1490.0, 1330.0],
            role: "flank_garry",
            description: "A 185m al norte a través de los setos densos normandos."
          }
        ],
        mgSpots: [
          {
            name: "MG Supresión Patio de Vagones",
            coordinates: [1260.0, 1350.0],
            coneAngle: 45,
            coneSpread: 40,
            description: "Fuego continuo a lo largo del pasillo ferroviario."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper en Depósito de Agua",
            coordinates: [1210.0, 1390.0],
            description: "Domina todos los tejados de los talleres de la aduana."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Rompe-Hangares",
            coordinates: [1180.0, 1270.0],
            description: "Disparo directo perforando las puertas de madera de los almacenes."
          }
        ],
        atMines: [
          {
            name: "Mina AT en Paso a Nivel",
            coordinates: [1280.0, 1380.0],
            description: "Cruce obligatorio de blindados enemigos."
          }
        ]
      },
      defense: {
        title: "Defensa Fortaleza Aduanera",
        summary: "Convierte el almacén de dos pisos en un búnker inexpugnable con alambre de espino en las puertas.",
        garrisons: [
          {
            name: "Guarnición Central Almacén",
            coordinates: [1350.0, 1430.0],
            role: "defense_garry",
            description: "Dentro de la nave principal de carga bajo techo de chapa blindada."
          },
          {
            name: "Guarnición Respaldo Huerto Este",
            coordinates: [1360.0, 1610.0],
            role: "defense_garry",
            description: "A 195m al este en zona azul segura."
          }
        ],
        mgSpots: [
          {
            name: "MG Ventana Superior Aduana",
            coordinates: [1350.0, 1410.0],
            coneAngle: 230,
            coneSpread: 55,
            description: "Barre todo el patio de carga y las vías de llegada."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper Ático Edificio Oficinas",
            coordinates: [1380.0, 1430.0],
            description: "Controla el avance de infantería enemiga entre los setos."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Defensivo Estación",
            coordinates: [1410.0, 1480.0],
            description: "Posición desenfilada cubriendo la entrada de la aduana."
          }
        ],
        atMines: [
          {
            name: "Mina AT Entrada de Vehículos",
            coordinates: [1320.0, 1370.0],
            description: "Bloquea el camino principal de tanques atacantes."
          }
        ]
      }
    }
  },

  // ==========================================
  // SAINTE-MÈRE-ÉGLISE (SME)
  // ==========================================
  sme: {
    // 1. SAINTE-MÈRE-ÉGLISE (B7)
    sme_b7: {
      name: "SAINTE-MÈRE-ÉGLISE (Plaza de la Iglesia)",
      coordinates: [1066.0, 1059.0],
      importance: "El corazón de SME. La plaza empedrada de la iglesia, el cementerio amurallado y las carreteras que convergen.",
      attack: {
        title: "Plan de Asalto a la Plaza de SME",
        summary: "El cementerio y la plaza son una trampa mortal si vas de frente. Ataca con una pinza desde los huertos norte y la calle de casas oeste.",
        garrisons: [
          {
            name: "Guarnición Asalto Huertos Norte",
            coordinates: [1230.0, 1070.0],
            role: "attack_garry",
            description: "A 170m al norte oculta tras el terraplén de manzanos."
          },
          {
            name: "Guarnición Flanqueo Callejuela Oeste",
            coordinates: [1050.0, 880.0],
            role: "flank_garry",
            description: "A 180m al oeste. Despliegue rápido a través de patios traseros."
          }
        ],
        mgSpots: [
          {
            name: "MG Bípode Ventana Oeste",
            coordinates: [1070.0, 930.0],
            coneAngle: 90,
            coneSpread: 45,
            description: "Dispara directo sobre los parapetos de sacos terreros de la plaza."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper Pajar Norte",
            coordinates: [1210.0, 1030.0],
            description: "Línea de tiro directa al campanario de la iglesia enemiga."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Asalto Calzada",
            coordinates: [1160.0, 920.0],
            description: "Cañón HE disparando al cementerio para desmantelar trincheras."
          }
        ],
        atMines: [
          {
            name: "Minas en Carretera de Acceso",
            coordinates: [1120.0, 980.0],
            description: "Frenar blindados rápidos de contraataque."
          }
        ]
      },
      defense: {
        title: "Defensa Fortaleza de la Iglesia",
        summary: "El campanario histórico y los muros de piedra del cementerio otorgan cobertura nivel 3 contra artillería.",
        garrisons: [
          {
            name: "Guarnición Interior Iglesia",
            coordinates: [1066.0, 1065.0],
            role: "defense_garry",
            description: "Dentro de la nave de la iglesia protegida por bóveda de piedra."
          },
          {
            name: "Guarnición Defensiva Cementerio",
            coordinates: [990.0, 1220.0],
            role: "defense_garry",
            description: "A 185m al sureste detrás del mausoleo de piedra."
          },
          {
            name: "Guarnición Huerto Suroeste",
            coordinates: [920.0, 960.0],
            role: "defense_garry",
            description: "A 190m asegurando la ruta de refuerzos del HQ."
          }
        ],
        mgSpots: [
          {
            name: "MG Campanario de SME",
            coordinates: [1066.0, 1060.0],
            coneAngle: 270,
            coneSpread: 90,
            description: "Posición más legendaria del juego. Domina 300 metros a la redonda."
          },
          {
            name: "MG Muro del Cementerio",
            coordinates: [1030.0, 1120.0],
            coneAngle: 45,
            coneSpread: 60,
            description: "Fuego cruzado hacia los campos abiertos del este."
          }
        ],
        sniperSpots: [
          {
            name: "Francotirador en la Torre de la Iglesia",
            coordinates: [1066.0, 1060.0],
            description: "Visión panorámica completa de las tres carreteras principales."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Defensivo en Esquina Plaza",
            coordinates: [1040.0, 1090.0],
            description: "Bloqueando el cruce con blindaje frontal en ángulo hacia el norte."
          }
        ],
        atMines: [
          {
            name: "Minas en Carretera D115",
            coordinates: [1066.0, 980.0],
            description: "Emboscada garantizada para tanques pesados atacantes."
          }
        ]
      }
    }
  },

  // ==========================================
  // FOY (FOY - INVIERNO)
  // ==========================================
  foy: {
    // 1. FOY (B15 - Pueblo de Foy)
    foy_b15: {
      name: "FOY (Pueblo Nevado de Foy)",
      coordinates: [1341.0, 904.0],
      importance: "Pueblo belga nevado rodeado de campos abiertos sin cobertura. Los francotiradores y tanques dominan las distancias largas.",
      attack: {
        title: "Plan de Asalto al Pueblo de Foy",
        summary: "Cruzar la nieve en campo abierto es una masacre. Obligatorio avanzar bajo cortinas de humo masivas y emplear el bosque Bois Jacques como ancla.",
        garrisons: [
          {
            name: "Guarnición Ataque Borde del Bosque",
            coordinates: [1170.0, 910.0],
            role: "attack_garry",
            description: "A 175m al sur al abrigo de los densos pinos de Bois Jacques."
          },
          {
            name: "Guarnición Flanqueo Carretera Oeste",
            coordinates: [1340.0, 720.0],
            role: "flank_garry",
            description: "A 185m al oeste entre los montículos de nieve del riachuelo congelado."
          }
        ],
        mgSpots: [
          {
            name: "MG Supresión Foxhole Bois Jacques",
            coordinates: [1190.0, 900.0],
            coneAngle: 0,
            coneSpread: 40,
            description: "Bípode montado en trinchera Easy Company. Fuego rasante a través de la nieve hacia las casas de Foy."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper en Copa de Árbol / Pino Alto",
            coordinates: [1150.0, 880.0],
            description: "Camuflaje blanco de nieve cazando a los ametralladores en las ventanas del pueblo."
          }
        ],
        tankSpots: [
          {
            name: "Tanque Hull-Down en Trinchera Forestal",
            coordinates: [1120.0, 920.0],
            description: "Casco enterrado en la nieve disparando proyectiles de fósforo y HE a los graneros."
          }
        ],
        atMines: [
          {
            name: "Minas en Carretera N30",
            coordinates: [1260.0, 780.0],
            description: "Carretera helada con cero tracción para los tanques Tiger enemigos."
          }
        ]
      },
      defense: {
        title: "Defensa Fortaleza Invernal de Foy",
        summary: "Los edificios de ladrillo rojo de Foy proporcionan búnkeres naturales. Las MGs en las ventanas del segundo piso dominan los campos nevados.",
        garrisons: [
          {
            name: "Guarnición Granero Central",
            coordinates: [1345.0, 915.0],
            role: "defense_garry",
            description: "Dentro del granero de madera con suelo de tierra batida."
          },
          {
            name: "Guarnición Respaldo Norte (Fábrica Cobru)",
            coordinates: [1510.0, 910.0],
            role: "defense_garry",
            description: "A 190m al norte en zona segura para contraataque."
          },
          {
            name: "Guarnición Este (Granja Dugout)",
            coordinates: [1340.0, 1100.0],
            role: "defense_garry",
            description: "A 195m al este para evitar que el enemigo rodee por la cuenca este."
          }
        ],
        mgSpots: [
          {
            name: "MG Casa de Ladrillo (Ventana Sur)",
            coordinates: [1330.0, 900.0],
            coneAngle: 180,
            coneSpread: 60,
            description: "Cierra por completo el campo de nieve hacia Bois Jacques."
          },
          {
            name: "MG Granero Oeste",
            coordinates: [1350.0, 870.0],
            coneAngle: 240,
            coneSpread: 50,
            description: "Enfilada mortal a los enemigos que intenten cruzar la carretera."
          }
        ],
        sniperSpots: [
          {
            name: "Sniper Ático Foy",
            coordinates: [1355.0, 910.0],
            description: "Elimina oficiales a más de 350 metros en el linde del bosque."
          }
        ],
        tankSpots: [
          {
            name: "Tiger I en Posición Emboscada",
            coordinates: [1380.0, 940.0],
            description: "Asomando solo el cañón de 88mm entre dos casas de ladrillo."
          }
        ],
        atMines: [
          {
            name: "Minas en Carretera de Foy a Bastogne",
            coordinates: [1290.0, 890.0],
            description: "Destruye el tanque punta de lanza aliado al salir de la arboleda."
          }
        ]
      }
    }
  }
};

/**
 * Returns strategy for any given strongpoint, or computes algorithmic tactical points
 * if a specific predefined manual entry doesn't exist.
 */
export function getSectorStrategy(mapId, strongpointId, strongpointName, coordinates) {
  const mapKey = mapId.toLowerCase();
  const cleanId = strongpointId.toLowerCase().replace(/[^a-z0-9_]/g, '');

  const mapDb = STRATEGIC_PLAYBOOK[mapKey];
  if (mapDb && mapDb[cleanId]) {
    return mapDb[cleanId];
  }

  // Fallback: Generate algorithmic military strategy for ANY base on ANY map
  const [lat, lng] = coordinates;
  const toRad = (d) => (d * Math.PI) / 180;

  return {
    name: strongpointName,
    coordinates: [lat, lng],
    importance: `Sector estratégico clave. Controla el sector de captura y las vías de avance adyacentes en el cuadrante.`,
    attack: {
      title: `Plan de Asalto Táctico: ${strongpointName}`,
      summary: `Despliega una guarnición frontal a 180m y una de flanqueo a 90° para crear un fuego cruzado coordinado. La base de fuego MG debe suprimir las ventanas mientras la escuadra de asalto limpia con granadas de humo.`,
      garrisons: [
        {
          name: "Guarnición de Asalto Frontal",
          coordinates: [Math.round(lat - 175), Math.round(lng)],
          role: "attack_garry",
          description: "A 175m al sur del objetivo en cobertura natural."
        },
        {
          name: "Guarnición de Flanqueo Lateral (90°)",
          coordinates: [Math.round(lat), Math.round(lng - 190)],
          role: "flank_garry",
          description: "A 190m al oeste para rodear las defensas enemigas por el flanco ciego."
        }
      ],
      mgSpots: [
        {
          name: "Nido de Supresión MG",
          coordinates: [Math.round(lat - 130), Math.round(lng + 40)],
          coneAngle: 0,
          coneSpread: 45,
          description: "Fuego continuo de ametralladora hacia las troneras de la base."
        }
      ],
      sniperSpots: [
        {
          name: "Puesto Elevado de Recon / Sniper",
          coordinates: [Math.round(lat - 160), Math.round(lng - 80)],
          description: "Vigilancia de 300m para eliminar oficiales enemigos y defensores en altura."
        }
      ],
      tankSpots: [
        {
          name: "Tanque de Soporte (Hull-Down)",
          coordinates: [Math.round(lat - 240), Math.round(lng + 50)],
          description: "Posición desenfilada bombardeando con proyectiles HE los muros del punto."
        }
      ],
      atMines: [
        {
          name: "Minas AT en Camino de Acceso",
          coordinates: [Math.round(lat - 90), Math.round(lng - 40)],
          description: "Corta el paso a los vehículos de transporte y tanques de apoyo."
        }
      ]
    },
    defense: {
      title: `Plan de Defensa Fortaleza: ${strongpointName}`,
      summary: `Establece el Triángulo Defensivo obligatorio de 3 guarniciones a ~200m en zona azul. Emplea MGs con fuego cruzado en los accesos y minas AT en los cuellos de botella.`,
      garrisons: [
        {
          name: "Guarnición Interior de Protección",
          coordinates: [Math.round(lat + 20), Math.round(lng + 20)],
          role: "defense_garry",
          description: "Dentro del perímetro duro para defensa inmediata."
        },
        {
          name: "Guarnición Triángulo Norte (Zona Azul)",
          coordinates: [Math.round(lat + 195), Math.round(lng)],
          role: "defense_garry",
          description: "A 195m al norte. Spawn de contraataque vital si cae el centro."
        },
        {
          name: "Guarnición Triángulo Sureste (Zona Azul)",
          coordinates: [Math.round(lat - 140), Math.round(lng + 140)],
          role: "defense_garry",
          description: "A 198m al sureste. Crea el triángulo de supervivencia contra bombardeos."
        }
      ],
      mgSpots: [
        {
          name: "MG Bípode Fuego Cruzado 1",
          coordinates: [Math.round(lat - 30), Math.round(lng - 20)],
          coneAngle: 220,
          coneSpread: 60,
          description: "Cubre los accesos desde el suroeste."
        },
        {
          name: "MG Bípode Fuego Cruzado 2",
          coordinates: [Math.round(lat + 30), Math.round(lng + 40)],
          coneAngle: 110,
          coneSpread: 60,
          description: "Fuego cruzado entrelazado con la MG 1 sobre el perímetro."
        }
      ],
      sniperSpots: [
        {
          name: "Puesto de Francotirador en Altura",
          coordinates: [Math.round(lat + 40), Math.round(lng - 10)],
          description: "Línea de visión profunda de 350m para interceptar cazadores de guarniciones."
        }
      ],
      tankSpots: [
        {
          name: "Tanque en Posición de Emboscada Defensiva",
          coordinates: [Math.round(lat - 60), Math.round(lng + 80)],
          description: "Blindaje en ángulo frontal cubriendo la carretera principal de penetración."
        }
      ],
      atMines: [
        {
          name: "Cinturón de Minas AT",
          coordinates: [Math.round(lat - 70), Math.round(lng - 50)],
          description: "Detiene tanques enemigos antes de que lleguen a distancia de cañoneo directo."
        }
      ]
    }
  };
}
