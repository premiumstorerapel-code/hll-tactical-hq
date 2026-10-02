import React, { useState } from 'react';
import { 
  BookOpen, Shield, Crosshair, Users, Target, MapPin, 
  AlertTriangle, CheckCircle2, ChevronRight, Compass, 
  HelpCircle, Swords, Award, Play, Eye, Flame, Layers 
} from 'lucide-react';
import { 
  HLLGarrisonIcon, HLLOutpostIcon, HLLBaseIcon, 
  HLLFriendlyArmorIcon, HLLSuppliesIcon, HLLOfficerRoleIcon, 
  HLLMachineGunnerRoleIcon, HLLAssaultRoleIcon, HLLAntiTankRoleIcon, 
  HLLSupportRoleIcon, HLLAutoRifleRoleIcon, HLLSniperRoleIcon 
} from './HLLIcons';
import { SQUAD_FORMATIONS, GARRISON_MASTERY_RULES } from '../engine/squadFormations';
import { sound } from '../utils/audio';

export default function TacticalGuideMaster({
  selectedBase,
  onDeploySquadFormation,
  onSwitchToMap,
  t
}) {
  const [activeModule, setActiveModule] = useState('garrisons'); 
  // 'garrisons' | 'how_to_attack' | 'how_to_defend' | 'squad_formations' | 'game_modes' | 'tank_school' | 'map_intel'

  const [selectedFormationId, setSelectedFormationId] = useState('fire_maneuver');
  const activeFormation = SQUAD_FORMATIONS.find(f => f.id === selectedFormationId) || SQUAD_FORMATIONS[0];

  const modules = [
    { id: 'garrisons', label: '1. BIBLIA DE GUARNICIONES', icon: HLLGarrisonIcon, desc: 'Zona Azul vs Roja, 200m, Distancia de Oro y Cobertura L' },
    { id: 'how_to_attack', label: '2. CÓMO ATACAR UN PUNTO', icon: Swords, desc: 'Doctrina de Asalto en 4 Fases, Pinza Táctica y Humo' },
    { id: 'how_to_defend', label: '3. CÓMO DEFENDER UN SECTOR', icon: Shield, desc: 'Triángulo de 3 Spawns, Fuego Cruzado de MG y Fortificaciones' },
    { id: 'squad_formations', label: '4. FORMACIONES DE ESCUADRA', icon: Users, desc: 'Simulador táctico interactivo de los 6 roles' },
    { id: 'game_modes', label: '5. MODOS: WARFARE VS OFENSIVA', icon: Compass, desc: 'Reglas de captura, Soft Cap vs Hard Cap y Guarniciones Default' },
    { id: 'tank_school', label: '6. BLINDAJE & TANQUES', icon: HLLFriendlyArmorIcon, desc: 'Angulación a 30°, Casco Oculto (Hull-down) y Puntos Débiles' },
    { id: 'map_intel', label: '7. GUÍA ESPECÍFICA POR MAPA', icon: Target, desc: 'Ubicaciones clave en Carentan, Foy, SME, Omaha, Kursk...' }
  ];

  const handleTestFormation = (formation) => {
    sound.playAbilitySound();
    if (onDeploySquadFormation && selectedBase) {
      onDeploySquadFormation(formation, selectedBase.coordinates);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bunker-950 text-slate-100 font-mono text-xs overflow-hidden">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-bunker-900 border-b border-bunker-700 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-tactical-amber/15 border border-tactical-amber flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-tactical-amber" />
          </div>
          <div>
            <h2 className="font-display font-black text-sm text-white tracking-wider uppercase">
              MANUAL DE COMBATE TÁCTICO & GUÍA MAESTRA HLL
            </h2>
            <p className="text-[11px] text-slate-400">
              Aprende doctrinas militares, colocación de guarniciones, asaltos y formaciones para dominar el campo de batalla
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedBase && (
            <span className="hidden sm:inline text-[11px] bg-bunker-950 border border-bunker-800 px-2.5 py-1 rounded text-tactical-amber">
              Objetivo: <strong>{selectedBase.name}</strong>
            </span>
          )}
          {onSwitchToMap && (
            <button
              onClick={() => {
                sound.playRadioClick();
                onSwitchToMap();
              }}
              className="px-3 py-1 bg-tactical-amber hover:bg-amber-400 text-black font-display font-bold rounded text-xs tracking-wider transition flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>IR AL MAPA</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body: Sidebar with Modules + Content Viewer */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Module Nav Drawer (Left) */}
        <aside className="w-64 sm:w-72 bg-bunker-900 border-r border-bunker-700/80 p-2 overflow-y-auto space-y-1 shrink-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
            Capítulos de Instrucción
          </div>
          {modules.map(mod => {
            const IconComponent = mod.icon;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  sound.playRadioClick();
                }}
                className={`w-full text-left p-2.5 rounded border transition flex flex-col space-y-1 ${
                  isActive
                    ? 'bg-tactical-amber/15 border-tactical-amber text-white shadow-sm'
                    : 'bg-bunker-950 border-bunker-800 text-slate-300 hover:border-slate-600 hover:bg-bunker-850'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="shrink-0">
                    {typeof IconComponent === 'function' && IconComponent.name.startsWith('HLL') ? (
                      <IconComponent size={18} />
                    ) : (
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-tactical-amber' : 'text-slate-400'}`} />
                    )}
                  </div>
                  <span className={`font-display font-bold text-xs uppercase tracking-wide truncate ${isActive ? 'text-tactical-amber font-black' : ''}`}>
                    {mod.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight pl-6 line-clamp-1">
                  {mod.desc}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Content Viewer (Right) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
          
          {/* ============================================================== */}
          {/* MÓDULO 1: LA BIBLIA DE LAS GUARNICIONES (GARRISONS & OPS)       */}
          {/* ============================================================== */}
          {activeModule === 'garrisons' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 1</span>
                  <span>•</span>
                  <span>FUNDAMENTO VITAL DE HELL LET LOOSE</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  LA BIBLIA DE LAS GUARNICIONES (GARRISONS) Y OUTPOSTS (OPS)
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Las partidas de Hell Let Loose no se ganan con puntería individual: <strong>se ganan con control de apariciones (spawns)</strong>. El equipo que tenga más guarniciones activas siempre tendrá más jugadores en el frente.
                </p>
              </div>

              {/* Comparativa Visual: Zona Azul vs Zona Roja */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Blue Zone Card */}
                <div className="bg-bunker-900 border-2 border-emerald-500/80 rounded-lg p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-bunker-700 pb-2">
                    <div className="flex items-center space-x-2">
                      <HLLGarrisonIcon size={26} />
                      <h3 className="font-display font-bold text-emerald-400 text-sm">
                        GUARNICIÓN EN ZONA AZUL
                      </h3>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                      50 SUMINISTROS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p>
                      • <strong>Ubicación:</strong> Dentro del territorio controlado por tu equipo (detrás de la línea de frente).
                    </p>
                    <p>
                      • <strong>Costo:</strong> Solo <strong>50 suministros</strong> (la caja exacta que porta 1 soldado de Apoyo).
                    </p>
                    <p>
                      • <strong>Regla de Bloqueo:</strong> Se bloquea en rojo <strong>SOLO cuando un enemigo entra a menos de 15 metros</strong>. A más de 15 metros, los jugadores pueden salir sin problemas.
                    </p>
                    <p>
                      • <strong>Uso Doctrinal:</strong> La columna vertebral del equipo. Coloca el triángulo defensivo siempre en zona azul.
                    </p>
                  </div>
                </div>

                {/* Red Zone Card */}
                <div className="bg-bunker-900 border-2 border-red-500/80 rounded-lg p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-bunker-700 pb-2">
                    <div className="flex items-center space-x-2">
                      <HLLGarrisonIcon size={26} isEnemy={true} />
                      <h3 className="font-display font-bold text-red-400 text-sm">
                        GUARNICIÓN EN ZONA ROJA
                      </h3>
                    </div>
                    <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-700 font-bold">
                      100 SUMINISTROS
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p>
                      • <strong>Ubicación:</strong> En territorio enemigo (delante de la línea de frente activa).
                    </p>
                    <p>
                      • <strong>Costo:</strong> Requiere <strong>100 suministros</strong> (1 drop aéreo del Comandante, 1 camión de suministros, o 2 Apoyos rotando).
                    </p>
                    <p className="text-amber-300">
                      • <strong>¡PELIGRO DE BLOQUEO!</strong> Se bloquea en rojo <strong>si cualquier enemigo entra a menos de 100 metros</strong>.
                    </p>
                    <p>
                      • <strong>Uso Doctrinal:</strong> Si la colocas a menos de 100m del punto enemigo, se bloqueará al instante y nadie podrá salir. <strong>Respeta la Distancia de Oro (160m-180m)</strong>.
                    </p>
                  </div>
                </div>

              </div>

              {/* Las 5 Reglas de Oro de Guarniciones */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white uppercase text-sm flex items-center space-x-2">
                  <Award className="w-4 h-4 text-tactical-amber" />
                  <span>LAS 5 REGLAS DE ORO DE COLOCACIÓN DE GUARNICIONES</span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {GARRISON_MASTERY_RULES.map(rule => (
                    <div key={rule.num} className="bg-bunker-900 border border-bunker-700/80 rounded p-3 flex items-start space-x-3 hover:border-tactical-amber/60 transition">
                      <div className="w-6 h-6 rounded-full bg-tactical-amber text-black font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {rule.num}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-white text-xs">
                          {rule.title}
                        </h4>
                        <p className="text-tactical-amber text-xs font-bold">
                          "{rule.rule}"
                        </p>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {rule.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarnición vs Outpost (OP) */}
              <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-4 space-y-3">
                <h3 className="font-display font-bold text-white text-xs uppercase border-b border-bunker-700 pb-2">
                  DIFERENCIA ENTRE GUARNICIÓN (GARRY) Y PUESTO DE AVANZADA (OP)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <HLLGarrisonIcon size={20} />
                      <strong className="text-emerald-400">GUARNICIÓN (Garry)</strong>
                    </div>
                    <p className="text-slate-300">
                      • Toda la compañía (50 jugadores) puede reaparecer aquí.<br/>
                      • Respawn cada <strong>40 segundos</strong> en oleadas.<br/>
                      • Límite de <strong>8 guarniciones simultáneas</strong> por equipo.<br/>
                      • Solo el Comandante y los Oficiales (SL) pueden construirla.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <HLLOutpostIcon size={20} />
                      <strong className="text-emerald-400">PUESTO DE AVANZADA (OP)</strong>
                    </div>
                    <p className="text-slate-300">
                      • Solo tu escuadra (6 soldados) puede reaparecer.<br/>
                      • Respawn ultra rápido cada <strong>20 segundos</strong>.<br/>
                      • No cuesta suministros; tiempo de recarga de 120s del reloj de SL.<br/>
                      • Se destruye instantáneamente si un enemigo pasa a 5 metros.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 2: CÓMO ATACAR UN PUNTO (DOCTRINA DE ASALTO)            */}
          {/* ============================================================== */}
          {activeModule === 'how_to_attack' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 2</span>
                  <span>•</span>
                  <span>DOCTRINA MILITAR DE INFANTERÍA</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  CÓMO ASALTAR Y CAPTURAR UN PUNTO FUERTE
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  En Hell Let Loose, atacar corriendo en línea recta hacia el punto central es un suicidio. La defensa enemiga siempre tiene bípodes montados y cobertura superior. Para tomar una base necesitas <strong>fuego, maniobra y destrucción de spawns</strong>.
                </p>
              </div>

              {/* Las 4 Fases de un Asalto Exitoso */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-white uppercase text-xs">
                  LAS 4 FASES DE LA PINZA TÁCTICA
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Fase 1 */}
                  <div className="bg-bunker-900 border border-bunker-700 rounded p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-tactical-amber text-black font-black text-xs flex items-center justify-center">1</span>
                      <h4 className="font-display font-bold text-white text-xs uppercase">
                        FASE 1: PREPARACIÓN Y DOBLE VECTOR
                      </h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Nunca asaltes desde un solo lado. Levanta <strong>dos guarniciones de ataque separadas a 90° entre sí a 160m-180m del objetivo</strong>. Una servirá de distracción frontal y la otra ejecutará el golpe letal de flanco.
                    </p>
                  </div>

                  {/* Fase 2 */}
                  <div className="bg-bunker-900 border border-bunker-700 rounded p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-tactical-amber text-black font-black text-xs flex items-center justify-center">2</span>
                      <h4 className="font-display font-bold text-white text-xs uppercase">
                        FASE 2: BASE DE FUEGO (SUPRESIÓN)
                      </h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      El Ametrallador pesado (MG) despliega el bípode a 120m en una posición protegida con vista a las ventanas del búnker. <strong>Dispara ráfagas constantes a las troneras</strong>. La supresión nubla la visión del defensor y le impide disparar certero.
                    </p>
                  </div>

                  {/* Fase 3 */}
                  <div className="bg-bunker-900 border border-bunker-700 rounded p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-tactical-amber text-black font-black text-xs flex items-center justify-center">3</span>
                      <h4 className="font-display font-bold text-white text-xs uppercase">
                        FASE 3: PANTALLA DE HUMO
                      </h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      A 40 metros del perímetro, el Oficial y los Asaltos lanzan granadas de humo. <strong>El humo debe caer delante del enemigo, no sobre tus propios soldados</strong>, para cegar sus líneas de tiro sin quitarte visión de avance.
                    </p>
                  </div>

                  {/* Fase 4 */}
                  <div className="bg-bunker-900 border border-bunker-700 rounded p-3.5 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded bg-tactical-amber text-black font-black text-xs flex items-center justify-center">4</span>
                      <h4 className="font-display font-bold text-white text-xs uppercase">
                        FASE 4: ASALTO AL CÍRCULO Y CAZA DE SPAWNS
                      </h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      El elemento de asalto entra al patio. <strong>La prioridad número uno NO es matar soldados: es encontrar la guarnición enemiga y destruirla</strong>. Si no desmantelas su spawn, seguirán saliendo refuerzos infinitos.
                    </p>
                  </div>

                </div>
              </div>

              {/* Soft Cap vs Hard Cap */}
              <div className="bg-bunker-900 border border-tactical-amber/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-tactical-amber" />
                  <h3 className="font-display font-bold text-white text-xs uppercase">
                    LA MATEMÁTICA DE CAPTURA: SOFT CAP VS HARD CAP
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 mt-2">
                  <div className="p-2.5 rounded bg-bunker-950 border border-bunker-800">
                    <strong className="text-white">Sector de 200m (Soft Cap):</strong>
                    <p className="mt-1">
                      Cualquier soldado dentro de los 4 cuadrantes del sector del mapa suma <strong>1 punto de presión de captura</strong>.
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-bunker-950 border border-tactical-amber/40">
                    <strong className="text-tactical-amber">Círculo Negro de 50m (Hard Cap):</strong>
                    <p className="mt-1">
                      Cada soldado que ponga un pie dentro del círculo negro de 50m cuenta por <strong>¡3 a 4 veces más peso de captura!</strong> 5 hombres dentro del círculo vencen a 15 hombres fuera.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 3: CÓMO DEFENDER UN SECTOR                              */}
          {/* ============================================================== */}
          {activeModule === 'how_to_defend' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 3</span>
                  <span>•</span>
                  <span>DOCTRINA DE DEFENSA ESTÁTICA Y MÓVIL</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  CÓMO DEFENDER UN SECTOR Y RESISTIR EL ASEDIO
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Quedarse agachado dentro del círculo de captura es una sentencia de muerte. La artillería y los bombardeos aéreos enemigos destruirán a todos en 30 segundos. La verdadera defensa se juega en el <strong>perímetro exterior</strong>.
                </p>
              </div>

              {/* El Triángulo Defensivo */}
              <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-4 space-y-3">
                <h3 className="font-display font-bold text-emerald-400 text-xs uppercase">
                  1. EL TRIÁNGULO DEFENSIVO DE 3 GUARNICIONES (ZONA AZUL)
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Para defender un punto fuerte requieres 3 guarniciones a ~200 metros entre sí formando un triángulo equilátero:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-bunker-950 p-2.5 rounded border border-bunker-800">
                    <strong className="text-white">G1 (Núcleo):</strong>
                    <p className="text-slate-400 mt-1">
                      A 40m detrás del búnker principal, oculta en un sótano o zanja.
                    </p>
                  </div>
                  <div className="bg-bunker-950 p-2.5 rounded border border-bunker-800">
                    <strong className="text-white">G2 (Flanco Izquierdo):</strong>
                    <p className="text-slate-400 mt-1">
                      A 200m al noroeste en zona azul. Permite contraatacar si G1 cae.
                    </p>
                  </div>
                  <div className="bg-bunker-950 p-2.5 rounded border border-bunker-800">
                    <strong className="text-white">G3 (Flanco Derecho):</strong>
                    <p className="text-slate-400 mt-1">
                      A 200m al noreste en zona azul. Corta el avance de blindados y camiones enemigos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Nidos Cruzados de MG y Fortificaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bunker-900 border border-bunker-700 rounded p-4 space-y-2">
                  <h4 className="font-display font-bold text-white text-xs uppercase flex items-center space-x-2">
                    <HLLMachineGunnerRoleIcon size={20} />
                    <span>FUEGO CRUZADO DE AMETRALLADORAS</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Nunca coloques dos MGs en el mismo edificio. Sitúa un tirador en cada flanco a 150m con <strong>arcos de fuego que se crucen en 'X' sobre el campo abierto</strong>. Cualquier enemigo que intente avanzar quedará atrapado entre dos fuegos.
                  </p>
                </div>

                <div className="bg-bunker-900 border border-bunker-700 rounded p-4 space-y-2">
                  <h4 className="font-display font-bold text-white text-xs uppercase flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-tactical-amber" />
                    <span>FORTIFICACIONES DEL INGENIERO</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Usa el alambre de espino para <strong>bloquear los accesos fáciles y obligar al atacante a pasar por tu campo de tiro de ametralladora</strong>. Levanta búnkeres de nivel 3: protegen a la guarnición del Bombing Run del comandante.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 4: FORMACIONES DE ESCUADRA (SIMULADOR 6 ROLES)          */}
          {/* ============================================================== */}
          {activeModule === 'squad_formations' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                    <span>CAPÍTULO 4</span>
                    <span>•</span>
                    <span>SIMULADOR TÁCTICO DE ESCUADRA</span>
                  </div>
                  <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                    FORMACIONES DE ESCUADRA DE 6 SOLDADOS
                  </h1>
                </div>

                {selectedBase && (
                  <button
                    onClick={() => handleTestFormation(activeFormation)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-bold text-xs rounded tracking-wider shadow transition flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>PROBAR EN EL MAPA</span>
                  </button>
                )}
              </div>

              {/* Selector de Formación */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SQUAD_FORMATIONS.map(form => (
                  <button
                    key={form.id}
                    onClick={() => {
                      setSelectedFormationId(form.id);
                      sound.playRadioClick();
                    }}
                    className={`p-2.5 rounded border text-left transition ${
                      selectedFormationId === form.id
                        ? 'border-tactical-amber bg-tactical-amber/20 text-white font-bold shadow'
                        : 'border-bunker-700 bg-bunker-900 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-xs uppercase font-display font-bold truncate">
                      {form.name.split('(')[0]}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Dispersión: {form.dispersionMeters}m
                    </div>
                  </button>
                ))}
              </div>

              {/* Detalle de la Formación Activa */}
              <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-tactical-amber text-sm uppercase">
                      {activeFormation.name}
                    </h3>
                    <span className="text-[10px] bg-bunker-950 px-2 py-0.5 rounded border border-bunker-800 text-slate-400">
                      Dispersión recomendada: {activeFormation.dispersionMeters}m
                    </span>
                  </div>
                  <p className="text-emerald-400 text-xs font-bold mt-1">
                    Óptima para: {activeFormation.bestFor}
                  </p>
                  <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                    {activeFormation.doctrine}
                  </p>
                </div>

                {/* Los 6 Miembros con sus Iconos Oficiales */}
                <div className="space-y-2 border-t border-bunker-700 pt-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Disposición y Rol de los 6 Soldados:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeFormation.members.map((member, i) => (
                      <div key={i} className="bg-bunker-950 border border-bunker-800 rounded p-2.5 flex items-center space-x-3">
                        <div className="shrink-0">
                          {member.roleId === 'officer' && <HLLOfficerRoleIcon size={24} />}
                          {member.roleId === 'mg' && <HLLMachineGunnerRoleIcon size={24} />}
                          {member.roleId === 'assault' && <HLLAssaultRoleIcon size={24} />}
                          {member.roleId === 'at' && <HLLAntiTankRoleIcon size={24} />}
                          {member.roleId === 'support' && <HLLSupportRoleIcon size={24} />}
                          {member.roleId === 'auto_rifle' && <HLLAutoRifleRoleIcon size={24} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-display font-bold text-white text-xs truncate">
                            {member.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {member.weapon}
                          </div>
                          <div className="text-[10px] text-emerald-400 truncate">
                            {member.note}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 5: MODOS DE JUEGO (WARFARE VS OFENSIVA)                 */}
          {/* ============================================================== */}
          {activeModule === 'game_modes' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 5</span>
                  <span>•</span>
                  <span>SISTEMA DE PARTIDA Y CONDICIONES DE VICTORIA</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  WARFARE (TERRITORIAL) VS OFENSIVA (INVASIÓN)
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Las reglas de juego cambian radicalmente entre ambos modos. Usar tácticas de Warfare en Ofensiva te costará la derrota garantizada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Warfare */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-4 space-y-3">
                  <div className="border-b border-bunker-700 pb-2">
                    <h3 className="font-display font-bold text-tactical-amber text-sm uppercase">
                      MODO WARFARE (50 VS 50)
                    </h3>
                    <span className="text-[10px] text-slate-400">90 Minutos • Línea de Frente Dinámica</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p>
                      • <strong>Línea de Frente Móvil:</strong> Ambos equipos inician con 2 sectores controlados y pelean por el sector central (#3).
                    </p>
                    <p>
                      • <strong>Bloqueo de Sectores:</strong> Solo 2 sectores del mapa están activos a la vez (1 para atacar, 1 para defender). Los demás están con candado.
                    </p>
                    <p>
                      • <strong>Carrera de Captura:</strong> La captura dura exactamente <strong>2 minutos</strong>. Si el enemigo inicia la captura de tu defensa, no puedes ignorarlo: ¡debes enviar tropas de relevo de inmediato!
                    </p>
                  </div>
                </div>

                {/* Offensive */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-4 space-y-3">
                  <div className="border-b border-bunker-700 pb-2">
                    <h3 className="font-display font-bold text-tactical-amber text-sm uppercase">
                      MODO OFENSIVA (ATACANTES VS DEFENSORES)
                    </h3>
                    <span className="text-[10px] text-slate-400">30 Minutos por Sector • Asalto Asimétrico</span>
                  </div>
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p>
                      • <strong>Guarniciones por Defecto (Default):</strong> Los defensores inician con <strong>3 guarniciones especiales</strong> que reaparecen cada 10 segundos y no requieren suministros. ¡El escuadrón de Recon atacante debe cazarlas primero!
                    </p>
                    <p>
                      • <strong>Límite Defensor:</strong> Los defensores <strong>NO pueden</strong> colocar guarniciones en sectores perdidos ni en territorio atacante.
                    </p>
                    <p>
                      • <strong>Tiempo:</strong> Los atacantes tienen 30 minutos. Capturar un fuerte reinicia el temporizador a 30 minutos completos.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 6: BLINDAJE & TANQUES                                    */}
          {/* ============================================================== */}
          {activeModule === 'tank_school' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 6</span>
                  <span>•</span>
                  <span>BALÍSTICA Y COMBATE ACORAZADO</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  GUÍA DE COMBATE BLINDADO (TANK ACADEMY)
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Un tanque en Hell Let Loose no es un coche blindado: es una fortaleza móvil de 3 hombres (Conductor, Artillero, Comandante con binoculares de 360°).
                </p>
              </div>

              {/* Doctrina de Rebote */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-bunker-900 border border-bunker-700 rounded p-3 space-y-1.5">
                  <strong className="text-tactical-amber text-xs uppercase font-display">1. REGLA DEL DIAMANTE (30°)</strong>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Nunca expongas tu chasis de forma perpendicular (0°). Girar el morro 30° respecto al cañón enemigo aumenta el grosor de blindaje de 100mm a 118mm y provoca rebotes balísticos.
                  </p>
                </div>

                <div className="bg-bunker-900 border border-bunker-700 rounded p-3 space-y-1.5">
                  <strong className="text-tactical-amber text-xs uppercase font-display">2. POSICIÓN CASCO OCULTO</strong>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Oculta el chasis en montículos o zanjas. Solo asoma la torreta para disparar y retrocede durante los 8 segundos de recarga.
                  </p>
                </div>

                <div className="bg-bunker-900 border border-bunker-700 rounded p-3 space-y-1.5">
                  <strong className="text-tactical-amber text-xs uppercase font-display">3. PUNTOS DÉBILES PESADOS</strong>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Tiger I y Jumbo 76 son impenetrables frontalmente con cañón medio. Apunta al anillo de la torreta, orugas o motor trasero para destruirlos de 2 disparos.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* MÓDULO 7: GUÍA ESPECÍFICA POR MAPA                             */}
          {/* ============================================================== */}
          {activeModule === 'map_intel' && (
            <div className="space-y-6">
              
              <div className="border-b border-bunker-700 pb-3">
                <div className="flex items-center space-x-2 text-tactical-amber font-bold text-xs uppercase">
                  <span>CAPÍTULO 7</span>
                  <span>•</span>
                  <span>INTELIGENCIA GEOGRÁFICA Y TOPOGRÁFICA</span>
                </div>
                <h1 className="font-display font-black text-xl text-white tracking-wide mt-1">
                  GUÍA TÁCTICA DE LOS MAPAS DE HELL LET LOOSE
                </h1>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Cada mapa exige una doctrina única. Conoce las claves del terreno para anticipar los movimientos enemigos:
                </p>
              </div>

              <div className="space-y-3">
                
                {/* Carentan */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-sm">
                      CARENTAN (COMBATE URBANO & PUENTES)
                    </h3>
                    <span className="text-[10px] text-tactical-amber bg-tactical-amber/10 px-2 py-0.5 rounded border border-tactical-amber/30">
                      Normandía • Callejones
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    • <strong>El Peligro de los Canales:</strong> Los puentes y la calzada (Purple Heart Lane) son cuellos de botella mortales cubiertos por MGs en los áticos. Cruza siempre por los vados laterales con humo.<br/>
                    • <strong>Town Center:</strong> Asalta en pinza norte-sur usando los patios traseros. No entres por la calle principal frente a la iglesia.
                  </p>
                </div>

                {/* Sainte-Mère-Église */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-sm">
                      SAINTE-MÈRE-ÉGLISE (BOCAGE & CRUCES)
                    </h3>
                    <span className="text-[10px] text-tactical-amber bg-tactical-amber/10 px-2 py-0.5 rounded border border-tactical-amber/30">
                      Normandía • Setos
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    • <strong>La Guerra de Setos (Bocage):</strong> Los setos son impenetrables para balas y tanques ligeros. Mueve tu escuadra pegada a la base de la vegetación y usa la torre de la iglesia de SME como punto de observación sniper.
                  </p>
                </div>

                {/* Foy */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-sm">
                      FOY (NIEVE, TRINCHERAS Y ARDENAS)
                    </h3>
                    <span className="text-[10px] text-tactical-amber bg-tactical-amber/10 px-2 py-0.5 rounded border border-tactical-amber/30">
                      Invierno • Visión Larga
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    • <strong>Campos Abiertos Blancos:</strong> La silueta oscura de los soldados destaca sobre la nieve a 400m. Avanza exclusivamente por las redes de trincheras y el bosque denso de pinos. Los tanques dominan este mapa.
                  </p>
                </div>

                {/* Omaha Beach */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-sm">
                      OMAHA BEACH (DESEMBARCO & ACANTILADOS WN70/73)
                    </h3>
                    <span className="text-[10px] text-tactical-amber bg-tactical-amber/10 px-2 py-0.5 rounded border border-tactical-amber/30">
                      Costa • Búnkeres
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    • <strong>Salida de la Playa:</strong> Si los atacantes se quedan en la arena, serán masacrados por las MGs alemanas en los acantilados. Lanza humos masivos y escala por los barrancos de los extremos este y oeste para destruir los nidos de hormigón.
                  </p>
                </div>

                {/* Kursk */}
                <div className="bg-bunker-900 border border-bunker-700 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-white text-sm">
                      KURSK (ESTEPA SOVIÉTICA & DUELO DE BLINDADOS)
                    </h3>
                    <span className="text-[10px] text-tactical-amber bg-tactical-amber/10 px-2 py-0.5 rounded border border-tactical-amber/30">
                      Frente Oriental • Estepa
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    • <strong>Guerra de Trincheras y Francotiradores:</strong> No hay edificios altos. Todo el combate de infantería se libra dentro de trincheras en zigzag. Los tanques se disparan a más de 800 metros de distancia en las colinas de molinos.
                  </p>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
