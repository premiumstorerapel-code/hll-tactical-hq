import React, { useState } from 'react';
import { 
  Users, Shield, Crosshair, BookOpen, ChevronRight, 
  MapPin, CheckCircle2, AlertTriangle, ArrowRight, Play 
} from 'lucide-react';
import { 
  HLLOfficerRoleIcon, HLLMachineGunnerRoleIcon, HLLAssaultRoleIcon, 
  HLLAntiTankRoleIcon, HLLSupportRoleIcon, HLLGarrisonIcon 
} from './HLLIcons';
import { SQUAD_FORMATIONS, GARRISON_MASTERY_RULES } from '../engine/squadFormations';
import { sound } from '../utils/audio';

export default function TacticalAcademyPanel({
  selectedBase,
  onDeploySquadFormation,
  t
}) {
  const [academyTab, setAcademyTab] = useState('formations'); // 'formations' | 'garrison_mastery' | 'attack_guide'
  const [selectedFormationId, setSelectedFormationId] = useState('fire_maneuver');

  const activeFormation = SQUAD_FORMATIONS.find(f => f.id === selectedFormationId) || SQUAD_FORMATIONS[0];

  const roleIcons = {
    officer: () => <HLLOfficerRoleIcon size={24} />,
    mg: () => <HLLMachineGunnerRoleIcon size={24} />,
    assault: () => <HLLAssaultRoleIcon size={24} />,
    at: () => <HLLAntiTankRoleIcon size={24} />,
    support: () => <HLLSupportRoleIcon size={24} />,
    auto_rifle: () => <HLLAssaultRoleIcon size={24} />
  };

  const handleTestFormationOnMap = () => {
    sound.playAbilitySound();
    if (onDeploySquadFormation && selectedBase) {
      onDeploySquadFormation(activeFormation, selectedBase.coordinates);
    }
  };

  return (
    <div className="bg-bunker-900/95 backdrop-blur-md border border-bunker-700/80 shadow-2xl rounded text-slate-200 font-mono text-xs overflow-hidden max-w-md w-full h-full flex flex-col">
      
      {/* Header */}
      <div className="p-3 bg-bunker-850 border-b border-bunker-700 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-tactical-amber" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-wider">
              ACADEMIA TÁCTICA & SIMULADOR
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            APRENDER & PROBAR
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-bunker-950 p-1 rounded border border-bunker-800 text-[10px] font-bold uppercase tracking-wider text-center">
          <button
            onClick={() => {
              setAcademyTab('formations');
              sound.playRadioClick();
            }}
            className={`py-1.5 px-1 rounded transition ${
              academyTab === 'formations'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Formaciones
          </button>
          <button
            onClick={() => {
              setAcademyTab('garrison_mastery');
              sound.playRadioClick();
            }}
            className={`py-1.5 px-1 rounded transition ${
              academyTab === 'garrison_mastery'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Guarniciones
          </button>
          <button
            onClick={() => {
              setAcademyTab('attack_guide');
              sound.playRadioClick();
            }}
            className={`py-1.5 px-1 rounded transition ${
              academyTab === 'attack_guide'
                ? 'bg-tactical-amber text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cómo Atacar
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        
        {/* TAB 1: SQUAD FORMATIONS (FORMACIONES DE ESCUADRA) */}
        {academyTab === 'formations' && (
          <div className="space-y-3">
            
            {/* Formation Selector Pills */}
            <div className="grid grid-cols-2 gap-1.5">
              {SQUAD_FORMATIONS.map(form => (
                <button
                  key={form.id}
                  onClick={() => {
                    setSelectedFormationId(form.id);
                    sound.playRadioClick();
                  }}
                  className={`p-2 rounded border text-left transition ${
                    selectedFormationId === form.id
                      ? 'border-tactical-amber bg-tactical-amber/20 text-white font-bold'
                      : 'border-bunker-700 bg-bunker-950 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <div className="text-[11px] font-display font-bold text-white truncate">{form.name}</div>
                  <div className="text-[9px] text-slate-400 truncate mt-0.5">Dispersion: {form.dispersionMeters}m</div>
                </button>
              ))}
            </div>

            {/* Formation Doctrine Card */}
            <div className="bg-bunker-950/80 p-3 rounded border border-bunker-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display font-black text-xs text-tactical-amber uppercase">
                  {activeFormation.name}
                </span>
                <span className="text-[9px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-bunker-700">
                  Escuadra de 6 Soldados
                </span>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-800/40 p-2 rounded text-[11px] text-emerald-200">
                <span className="font-bold text-emerald-400 block mb-0.5">Ideal para:</span>
                {activeFormation.bestFor}
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeFormation.doctrine}
              </p>
            </div>

            {/* Tactical Board: 6 Squad Roles Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Disposición y Armamento de los 6 Soldados:
              </span>

              {activeFormation.members.map((soldier, idx) => (
                <div
                  key={idx}
                  className="bg-bunker-850 p-2 rounded border border-bunker-700 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="shrink-0">
                      {roleIcons[soldier.roleId] ? roleIcons[soldier.roleId]() : <HLLOfficerRoleIcon size={22} />}
                    </span>
                    <div>
                      <div className="font-bold text-white leading-none">{soldier.name}</div>
                      <div className="text-[10px] text-tactical-amber font-mono mt-0.5">{soldier.weapon}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right max-w-[140px] leading-tight">
                    {soldier.note}
                  </div>
                </div>
              ))}
            </div>

            {/* Project Formation on Active Base Button */}
            <button
              onClick={handleTestFormationOnMap}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-display font-black text-xs uppercase tracking-wider rounded transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>PROBAR ESTA FORMACIÓN EN EL MAPA</span>
            </button>

          </div>
        )}

        {/* TAB 2: GARRISON MASTERY (MAESTRÍA DE GUARNICIONES) */}
        {academyTab === 'garrison_mastery' && (
          <div className="space-y-3">
            
            {/* Golden Rule Highlight */}
            <div className="bg-amber-950/40 border border-amber-600/70 p-3 rounded space-y-1.5">
              <div className="flex items-center space-x-2 text-tactical-amber font-display font-black text-xs uppercase tracking-wider">
                <HLLGarrisonIcon size={18} />
                <span>LA REGLA N°1 DE HELL LET LOOSE</span>
              </div>
              <p className="text-[11px] text-amber-200 leading-relaxed font-bold">
                "Las partidas de Hell Let Loose no las ganan los que más matan, sino el equipo que tiene más Guarniciones activas rodeando los puntos."
              </p>
            </div>

            {/* The 5 Golden Rules */}
            <div className="space-y-2">
              {GARRISON_MASTERY_RULES.map((rule) => (
                <div
                  key={rule.num}
                  className="bg-bunker-850 p-2.5 rounded border border-bunker-700 space-y-1"
                >
                  <div className="flex items-center space-x-2 text-white font-bold text-xs">
                    <span className="w-5 h-5 rounded-full bg-tactical-amber text-black font-black flex items-center justify-center text-[10px] shrink-0">
                      {rule.num}
                    </span>
                    <span>{rule.title}</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-bold ml-7">
                    {rule.rule}
                  </div>
                  <p className="text-[10px] text-slate-300 ml-7 leading-relaxed">
                    {rule.explanation}
                  </p>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: HOW TO ATTACK (CÓMO ATACAR CUALQUIER BASE) */}
        {academyTab === 'attack_guide' && (
          <div className="space-y-3">
            
            <div className="bg-red-950/30 border border-red-800/60 p-3 rounded space-y-1.5">
              <span className="text-red-400 font-display font-black text-xs uppercase tracking-wider block">
                METODOLOGÍA DE ASALTO A PUNTOS FORTIFICADOS
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Asaltar un punto enemigo frontalmente por la carretera siempre resulta en una derrota (Picadora de Carne). El asalto exitoso sigue estos 4 pasos:
              </p>
            </div>

            {/* Phase Steps */}
            <div className="space-y-2">
              <div className="bg-bunker-850 p-2.5 rounded border-l-4 border-amber-500">
                <span className="font-bold text-white text-xs block">1. Despliegue de Guarnición de Ataque a 170m</span>
                <p className="text-[10px] text-slate-300 mt-1">
                  Tu Oficial y Apoyo levantan una guarnición a 170m en un seto cóncavo. Nunca en el medio del campo ni pegada al muro enemigo.
                </p>
              </div>

              <div className="bg-bunker-850 p-2.5 rounded border-l-4 border-blue-500">
                <span className="font-bold text-white text-xs block">2. Fijación y Supresión con MG y Tanque</span>
                <p className="text-[10px] text-slate-300 mt-1">
                  La ametralladora MG y el cañón del tanque abren fuego continuo a las ventanas del segundo piso para provocar efecto de desenfoque y supresión sobre los defensores.
                </p>
              </div>

              <div className="bg-bunker-850 p-2.5 rounded border-l-4 border-cyan-400">
                <span className="font-bold text-white text-xs block">3. Cortina de Humo a 45m del Círculo</span>
                <p className="text-[10px] text-slate-300 mt-1">
                  Los soldados con granadas de humo las arrojan en línea horizontal frente a los defensores para cegar sus miras de sniper y armas pesadas.
                </p>
              </div>

              <div className="bg-bunker-850 p-2.5 rounded border-l-4 border-emerald-500">
                <span className="font-bold text-white text-xs block">4. Flanqueo a 90° y Brecha con Subfusiles</span>
                <p className="text-[10px] text-slate-300 mt-1">
                  La escuadra de asalto entra por el ángulo ciego con subfusiles Thompson/MP40 y granadas, destruyendo la guarnición enemiga para cortar sus refuerzos.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
