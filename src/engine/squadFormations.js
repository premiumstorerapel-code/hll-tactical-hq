/**
 * Hell Let Loose Squad Formations & Tactics Engine
 * 6-Man Squad tactical deployment patterns, roles, and military doctrine
 */

export const SQUAD_FORMATIONS = [
  {
    id: "wedge",
    name: "Formación en Cuña (Wedge)",
    bestFor: "Avance por campos abiertos y zonas boscosas sin contacto confirmado.",
    doctrine: "Proporciona excelente potencia de fuego hacia el frente y los flancos. Si la punta entra bajo fuego, los miembros de los lados pueden abrir fuego inmediatamente sin bloquearse entre sí.",
    dispersionMeters: 15,
    members: [
      { roleId: "officer", name: "Oficial (SL)", weapon: "Subfusil / Carabina M1", pos: [0, 0], note: "Punta de lanza, binoculares y marcado de objetivos." },
      { roleId: "auto_rifle", name: "Fusilero Automático", weapon: "BAR / STG44", pos: [-12, -15], note: "Flanco izquierdo cubriendo el avance." },
      { roleId: "assault", name: "Asalto", weapon: "Thompson / MP40 + Granadas", pos: [-12, 15], note: "Flanco derecho listo para cerrar distancia." },
      { roleId: "mg", name: "Ametrallador (MG)", weapon: "Browning M1919 / MG42", pos: [-20, 0], note: "Centro del dispositivo; busca cobertura inmediata al contacto." },
      { roleId: "support", name: "Apoyo", weapon: "Caja 50 Suministros + Humo", pos: [-28, -12], note: "Transporte de suministros para guarnición rápida." },
      { roleId: "at", name: "Antitanque (AT)", weapon: "Bazooka / Panzerschreck", pos: [-28, 12], note: "Retaguardia preparado para interceptar blindados." }
    ]
  },
  {
    id: "fire_maneuver",
    name: "Base de Fuego y Flanqueo (Pinza Táctica)",
    bestFor: "Asalto a puntos fortificados, búnkeres y casas de 2 pisos defendidas.",
    doctrine: "La escuadra se divide en dos elementos: la Base de Fuego (MG + Oficial + Apoyo) fija y suprime al enemigo a 120m para que no asomen la cabeza, mientras el Elemento de Asalto (Asalto + Automático + AT) corre por un seto o zanja lateral a 90° con granadas de humo.",
    dispersionMeters: 25,
    members: [
      { roleId: "mg", name: "Ametrallador (Base de Fuego)", weapon: "MG42 / Browning (Bípode)", pos: [0, -35], note: "Fuego continuo a troneras y ventanas del punto." },
      { roleId: "officer", name: "Oficial (Director de Fuego)", weapon: "Binoculares / Humos", pos: [-5, -45], note: "Corrige los disparos de la MG y lanza humo de pantalla." },
      { roleId: "support", name: "Apoyo (Caja de Munición)", weapon: "Caja de Munición Explosiva", pos: [-10, -30], note: "Abastece de munición infinita a la ametralladora." },
      { roleId: "assault", name: "Asalto (Punta de Flanqueo)", weapon: "Subfusil + 4 Granadas Humo", pos: [25, 40], note: "Avanza por el seto lateral a 90° para penetrar el punto." },
      { roleId: "auto_rifle", name: "Fusilero Automático (Apoyo Asalto)", weapon: "BAR / STG44", pos: [15, 30], note: "Cubre las esquinas ciegas del asalto." },
      { roleId: "at", name: "Antitanque (Satchel / Demolición)", weapon: "Carga de Satchel / Mina AT", pos: [10, 45], note: "Coloca la carga concentrada para volar el búnker enemigo." }
    ]
  },
  {
    id: "staggered_column",
    name: "Columna Escalonada (Bocage y Calles)",
    bestFor: "Movimiento por calles de Carentan, zanjas o callejones de setos normandos.",
    doctrine: "Los soldados avanzan pegados a las paredes o setos opuestos en zigzag. Evita que una sola ráfaga de ametralladora o un proyectil HE de tanque elimine a toda la escuadra en fila.",
    dispersionMeters: 10,
    members: [
      { roleId: "officer", name: "Oficial (Puntero)", weapon: "Carabina", pos: [0, -4], note: "Explora la siguiente esquina con sigilo." },
      { roleId: "assault", name: "Asalto", weapon: "Escopeta / Subfusil", pos: [-12, 4], note: "Vigila la acera/seto contrario." },
      { roleId: "auto_rifle", name: "Fusilero Automático", weapon: "Fusil Automático", pos: [-24, -4], note: "Cubre los accesos frontales." },
      { roleId: "support", name: "Apoyo", weapon: "Fusil Garand / Kar98k", pos: [-36, 4], note: "Mantiene la distancia entre filas." },
      { roleId: "mg", name: "Ametrallador", weapon: "Ametralladora Pesada", pos: [-48, -4], note: "Listo para desplegar bípode si la punta es emboscada." },
      { roleId: "at", name: "Antitanque (Guardia Trasera)", weapon: "Lanzacohetes", pos: [-60, 4], note: "Vigila la retaguardia para evitar flanqueos enemigos." }
    ]
  },
  {
    id: "skirmish_line",
    name: "Línea de Tiradores (Asalto Final al Círculo)",
    bestFor: "Entrada simultánea al círculo de captura tras la caída de la cortina de humo.",
    doctrine: "Todos los soldados en línea horizontal separados por 8-10 metros. Máxima potencia de fuego frontal. Nadie se queda atrás: todos dentro de los 50m del punto para sumar peso de captura multiplicador.",
    dispersionMeters: 12,
    members: [
      { roleId: "assault", name: "Asalto (Extremo Izquierdo)", weapon: "Granadas", pos: [0, -30], note: "Limpia trincheras exteriores." },
      { roleId: "auto_rifle", name: "Fusilero Automático", weapon: "Fuego continuo", pos: [0, -18], note: "Avanza disparando desde la cadera." },
      { roleId: "officer", name: "Oficial (Centro de Mando)", weapon: "Voz de mando", pos: [0, -6], note: "Comprueba el ratio de captura del sector." },
      { roleId: "mg", name: "Ametrallador", weapon: "Fuego de cadera", pos: [0, 6], note: "Supresión de pánico a quemarropa." },
      { roleId: "support", name: "Apoyo", weapon: "Garand / Kar98k", pos: [0, 18], note: "Tiro apuntado a supervivientes." },
      { roleId: "at", name: "Antitanque (Extremo Derecho)", weapon: "Fusil / Cohete", pos: [0, 30], note: "Neutraliza nidos de sacos terreros." }
    ]
  }
];

export const GARRISON_MASTERY_RULES = [
  {
    num: 1,
    title: "La Distancia de Oro: 160m a 180m",
    rule: "Nunca coloques la guarnición de ataque a menos de 100m ni a más de 250m.",
    explanation: "Si la pones a menos de 100m, cualquier soldado enemigo que se acerque a 15m bloqueará el spawn y no podréis salir. Si la pones a más de 250m, la infantería tarda 60 segundos en correr y morirá en campo abierto antes de llegar."
  },
  {
    num: 2,
    title: "La Cobertura en 'L' (Escondite Ciego)",
    rule: "Siempre levanta la guarnición detrás de muros dobles o en la curva de un seto.",
    explanation: "El búnker de la guarnición debe estar oculto de la línea de tiro de los tanques y artillería. La mejor posición es en la esquina interior de un muro de piedra o en un seto cóncavo de bocage."
  },
  {
    num: 3,
    title: "El Triángulo Defensivo de 3 Spawns",
    rule: "Para defender, coloca 1 guarnición cerca del punto y 2 guarniciones exteriores a 200m en zona azul.",
    explanation: "Si el enemigo tira un Bombing Run sobre el punto, solo destruirá la central; las dos exteriores sobrevivirán y tu equipo podrá contraatacar inmediatamente antes de que el enemigo capture."
  },
  {
    num: 4,
    title: "La Regla de los 200 Metros",
    rule: "El motor del juego no permite colocar dos guarniciones a menos de 200m entre sí.",
    explanation: "Planifica siempre el mapa respetando los círculos de exclusión. Si intentas poner una guarnición a 190m, el reloj de construcción se pondrá en rojo y perderás los suministros."
  },
  {
    num: 5,
    title: "El Doble Vector de Ataque (Pinza)",
    rule: "Una base nunca se toma atacando desde un solo lado.",
    explanation: "Si 50 jugadores salen de la misma guarnición, la ametralladora enemiga solo tiene que disparar a un solo lugar (picadora de carne). Coloca siempre una guarnición frontal y otra a 90° de flanqueo."
  }
];
