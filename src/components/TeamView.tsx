import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { TeamCard } from './TeamCard';
import { Users, Presentation, ShieldCheck, Cpu, Building2, Wind } from 'lucide-react';

interface TeamViewProps {
  onNavigateToSlide?: (slideId: number) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onNavigateToSlide }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b1d36] via-[#0e274a] to-[#07172b] border border-[#1e3a5f] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            Academic Capstone Group 6 • Division E2
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Research Team & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-sky-300">
              Engineering Investigators
            </span>
          </h1>
          <p className="mt-4 text-[#bfdbfe] text-base leading-relaxed max-w-3xl">
            Meet the researchers behind the multi-physics Finite Element Analysis and bio-mechanical simulation platform. Our research investigates nature’s structural solutions across civil earthquake base shear mitigation and aerospace non-linear tensile network dissipation.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateToSlide && onNavigateToSlide(2)}
              className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-yellow-400/20 transition"
            >
              <Presentation className="w-4 h-4" />
              <span>Present Team Slide (Slide 2 in PPTX)</span>
            </button>
            <div className="px-4 py-2.5 rounded-xl bg-[#08182e] border border-[#1e3a5f] text-xs font-mono text-[#93c5fd] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>4 Verified Investigators • Div E2</span>
            </div>
          </div>
        </div>

        {/* Subtle geometric background watermarks */}
        <div className="absolute -right-12 -bottom-12 opacity-10 text-[260px] font-black text-yellow-400 select-none pointer-events-none">
          ⬡
        </div>
      </div>

      {/* 4 Team Member Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <span className="h-6 w-2 rounded-full bg-yellow-400 block"></span>
              Core Research Team
            </h2>
            <p className="text-xs text-[#93c5fd] mt-1">
              Roll Numbers: C331 • C332 • C341 • C347 | Division E2
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              featured={true}
              onViewSlide={() => onNavigateToSlide && onNavigateToSlide(2)}
            />
          ))}
        </div>
      </div>

      {/* Collaborative Research Breakdown */}
      <div className="bg-[#0b1d36] border border-[#1e3a5f] rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-yellow-400" />
          Technical Division of Labor & Engineering Matrix
        </h3>
        <p className="text-xs text-[#93c5fd] mb-6">
          How Group 6 coupled micro-mechanical cellular solids with macro-structural dynamic solvers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-[#08182e] border border-[#1c3e6b] p-5 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center font-bold text-base">
              ⬡
            </div>
            <h4 className="font-bold text-white text-sm">Cellular Foundation Mechanics</h4>
            <p className="text-[#bfdbfe] leading-relaxed">
              Arjun Nayak (C332) & Advait Pandya (C341) formulated the out-of-plane flexural stiffness and in-plane shear kinematics of UHPFRC cellular lattices under Richter 7.5 ground acceleration and ASTM C365 platens.
            </p>
          </div>

          <div className="bg-[#08182e] border border-[#1c3e6b] p-5 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center font-bold text-base">
              🕸️
            </div>
            <h4 className="font-bold text-white text-sm">Verlet Tensile Dynamics</h4>
            <p className="text-[#bfdbfe] leading-relaxed">
              Mohd Rayaan Naseem (C331) formulated the 2nd-order symplectic Verlet spring-mass engine, implementing Marcus Buehler's non-linear sacrificial strain-softening to isolate shockwave propagation.
            </p>
          </div>

          <div className="bg-[#08182e] border border-[#1c3e6b] p-5 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold text-base">
              📊
            </div>
            <h4 className="font-bold text-white text-sm">Materials Benchmarking Matrix</h4>
            <p className="text-[#bfdbfe] leading-relaxed">
              Khushit Patidar (C347) mapped the multi-axis Ashby property space comparing Dragline Silk, Kevlar-49, Ultra-High-Tensile Steel, and CFRP Honeycombs for flexural and ballistic energy absorption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
