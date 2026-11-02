import React from 'react';
import { Presentation, Users, Activity, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onNavigateToPresentation: () => void;
  onNavigateToTeam: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onNavigateToPresentation,
  onNavigateToTeam
}) => {
  return (
    <section className="pt-12 pb-10 border-b border-[#1c3e6b] bg-gradient-to-b from-[#0b1d36] to-[#061224]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08182e] border border-[#1e3a5f] text-xs font-semibold text-[#93c5fd] mb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          <span>Multi-Physics FEA & Bio-Mechanical Simulation</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-white max-w-4xl leading-tight tracking-tight">
          Engineering Biomimicry: <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-sky-300">
            Spider-Web Tensile Networks & Honeycomb Cellular Mechanics
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-4 text-[#bfdbfe] text-base max-w-3xl leading-relaxed">
          Test nature's greatest structural solutions under extreme physical events: simulate{' '}
          <strong className="text-white">honeycomb skyscraper foundations under earthquake shear</strong>,{' '}
          <strong className="text-white">plastic cell buckling</strong>,{' '}
          <strong className="text-white">ASTM aerospace crash boxes</strong>, and{' '}
          <strong className="text-white">spiderweb non-linear sacrificial tensile dissipation</strong>.
        </p>

        {/* Group 6 Byline */}
        <div className="mt-4 p-3 rounded-xl bg-[#08182e]/80 border border-[#1e3a5f] inline-flex items-center flex-wrap gap-2 text-xs">
          <span className="font-bold text-yellow-400">BY GROUP 6 (DIVISION E2):</span>
          <span className="text-[#bfdbfe]">
            <strong>C331</strong> Mohd Rayaan, <strong>C332</strong> Arjun Nayak, <strong>C341</strong> Advait Pandya, <strong>C347</strong> Khushit Patidar.
          </span>
          <button
            onClick={onNavigateToTeam}
            className="ml-2 text-sky-300 hover:text-white font-mono underline font-semibold flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            <span>View Profiles</span>
          </button>
        </div>

        {/* Quick CTA navigation */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={onNavigateToPresentation}
            className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition"
          >
            <Presentation className="w-4 h-4" />
            <span>Open Presentation Deck (.pptx)</span>
          </button>

          <a
            href="#honeycomb"
            className="px-5 py-2.5 rounded-xl bg-[#1e3a5f] hover:bg-[#284c79] text-sky-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-[#38bdf8]/40 transition"
          >
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Launch Interactive Simulators</span>
          </a>

          <button
            onClick={onNavigateToTeam}
            className="px-4 py-2.5 rounded-xl bg-[#08182e] hover:bg-[#0e274a] text-[#93c5fd] hover:text-white font-bold text-xs flex items-center gap-2 border border-[#1e3a5f] transition"
          >
            <Users className="w-4 h-4 text-yellow-400" />
            <span>Group 6 Team Details</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-[#0b1d36] border border-[#1e3a5f] p-4 rounded-xl">
            <span className="text-[11px] text-yellow-300 font-mono font-bold block">
              HONEYCOMB OPTIMALITY
            </span>
            <span className="text-2xl font-black text-white mt-1 block">30% Less Wax</span>
            <span className="text-xs text-[#93c5fd] mt-1 block">Hales Honeycomb Theorem</span>
          </div>

          <div className="bg-[#0b1d36] border border-[#1e3a5f] p-4 rounded-xl">
            <span className="text-[11px] text-sky-300 font-mono font-bold block">
              DRAGLINE SILK STRENGTH
            </span>
            <span className="text-2xl font-black text-white mt-1 block">1.3 GPa</span>
            <span className="text-xs text-[#93c5fd] mt-1 block">5x stronger than standard steel</span>
          </div>

          <div className="bg-[#0b1d36] border border-[#1e3a5f] p-4 rounded-xl">
            <span className="text-[11px] text-rose-300 font-mono font-bold block">
              FRACTURE TOUGHNESS
            </span>
            <span className="text-2xl font-black text-white mt-1 block">160 MJ/m³</span>
            <span className="text-xs text-[#93c5fd] mt-1 block">3x tougher than ballistic Kevlar</span>
          </div>

          <div className="bg-[#0b1d36] border border-[#1e3a5f] p-4 rounded-xl">
            <span className="text-[11px] text-emerald-300 font-mono font-bold block">
              SEISMIC DAMPING
            </span>
            <span className="text-2xl font-black text-white mt-1 block">&gt;75% Absorption</span>
            <span className="text-xs text-[#93c5fd] mt-1 block">Honeycomb cellular base isolation</span>
          </div>
        </div>
      </div>
    </section>
  );
};
