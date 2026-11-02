import React, { useState } from 'react';
import { BarChart3, Shield, Zap, Sparkles, Scale, Info } from 'lucide-react';

export const MaterialsMatrix: React.FC = () => {
  const [selectedMat, setSelectedMat] = useState<string>('silk');

  const materials = [
    {
      id: 'silk',
      category: 'BIOLOGICAL TENSILE',
      name: 'Spider Dragline Silk (Major Ampullate)',
      tagColor: 'text-sky-300',
      borderColor: 'border-sky-500/40',
      tensile: '1,300 MPa',
      toughness: '160 MJ/m³',
      density: '1.31 g/cm³',
      elongation: '35%',
      specificStrength: '992 kN·m/kg',
      description: 'Extreme energy absorption; molecular β-sheets unfold sequentially before rupture.',
      detailedBio: 'Produced by Nephila clavipes for structural web spokes. Comprises polyalanine crystals (3nm) providing high tensile stiffness, embedded in an amorphous glycine matrix that enables massive plastic elongation without brittle cleavage.'
    },
    {
      id: 'honeycomb',
      category: 'BIOMIMETIC CELLULAR',
      name: 'CFRP Honeycomb Sandwich Core',
      tagColor: 'text-yellow-300',
      borderColor: 'border-yellow-500/40',
      tensile: '37x Flexural Rigidity vs Solid',
      toughness: '35 kJ/kg SEA',
      density: '0.18 g/cm³ (Core)',
      elongation: 'Progressive Fold',
      specificStrength: '1,450 kN·m/kg',
      description: 'Standard for Boeing 787 rudders and James Webb Space Telescope mirrors.',
      detailedBio: 'Two thin carbon-fiber laminate face sheets separated by a lightweight hexagonal core. The second moment of area scales as h³, achieving unprecedented bending stiffness with 92% interior air cavities.'
    },
    {
      id: 'kevlar',
      category: 'SYNTHETIC ARAMID',
      name: 'Kevlar-49 (Poly-paraphenylene)',
      tagColor: 'text-rose-300',
      borderColor: 'border-rose-500/40',
      tensile: '3,000 MPa',
      toughness: '50 MJ/m³',
      density: '1.44 g/cm³',
      elongation: '2.4%',
      specificStrength: '2,083 kN·m/kg',
      description: 'High tensile strength, but only 1/3 the fracture energy absorption of spider silk.',
      detailedBio: 'Para-aramid synthetic polymer featuring rigid aromatic phenyl groups and strong inter-chain hydrogen bonds. Exceptional tensile modulus, but exhibits low breaking elongation and low shear unzipping resistance.'
    },
    {
      id: 'steel',
      category: 'METALLIC BENCHMARK',
      name: 'High-Tensile Structural Steel (A514)',
      tagColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/40',
      tensile: '690 MPa',
      toughness: '12 MJ/m³',
      density: '7.85 g/cm³',
      elongation: '18%',
      specificStrength: '88 kN·m/kg',
      description: 'Heavy structural standard; prone to inertial amplification during seismic events.',
      detailedBio: 'Tempered martensitic alloy steel. While isotropic and ductile, its high density (6x denser than silk, 43x denser than honeycomb core) produces massive inertial force vectors (F = m · a) during ground acceleration.'
    }
  ];

  return (
    <section id="materials" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-6 w-2 rounded-full bg-emerald-400 block"></span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Module III: Biomimetic Material Benchmarking Matrix
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {materials.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMat(m.id)}
            className={`bg-[#0b1d36] border p-5 rounded-2xl cursor-pointer transition flex flex-col justify-between ${
              selectedMat === m.id
                ? `${m.borderColor} shadow-xl shadow-yellow-400/5 ring-1 ring-yellow-400/40`
                : 'border-[#1e3a5f] hover:border-[#38bdf8]/50'
            }`}
          >
            <div>
              <div className={`${m.tagColor} font-mono text-[11px] mb-1 font-bold`}>
                {m.category}
              </div>
              <h3 className="text-white font-bold text-base mb-3 leading-snug">
                {m.name}
              </h3>

              <div className="text-xs text-[#bfdbfe] space-y-1.5 mb-3 bg-[#08182e] p-3 rounded-xl border border-[#1c3e6b] font-mono">
                <div className="flex justify-between">
                  <span className="text-[#93c5fd]">Tensile:</span>
                  <strong className="text-white">{m.tensile}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#93c5fd]">Toughness:</span>
                  <strong className="text-yellow-300">{m.toughness}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#93c5fd]">Density:</span>
                  <strong className="text-sky-300">{m.density}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#93c5fd]">Specific:</span>
                  <strong className="text-emerald-400">{m.specificStrength}</strong>
                </div>
              </div>

              <p className="text-xs text-[#93c5fd] leading-relaxed">
                {m.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1c3e6b] flex items-center justify-between text-[11px] font-mono">
              <span className="text-yellow-300 font-bold">
                {selectedMat === m.id ? '● Active Specimen' : 'Select to inspect'}
              </span>
              <span className="text-[#93c5fd]">Ashby Plot ›</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Selected Material Deep Dive */}
      {(() => {
        const active = materials.find((m) => m.id === selectedMat) || materials[0];
        return (
          <div className="bg-[#08182e] border border-[#1e3a5f] p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-2">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-xs font-bold ${active.tagColor}`}>
                  {active.category}
                </span>
                <span className="text-[#1e3a5f]">|</span>
                <span className="text-white font-bold text-sm">{active.name}</span>
              </div>
              <p className="text-xs text-[#bfdbfe] leading-relaxed">
                {active.detailedBio}
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col gap-2 shrink-0 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-[#0b2447] text-yellow-300 border border-[#1e3a5f]">
                Work of Fracture: {active.toughness}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-[#0b2447] text-sky-300 border border-[#1e3a5f]">
                Elongation: {active.elongation}
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
};
