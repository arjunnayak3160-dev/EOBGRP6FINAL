import React from 'react';
import { TeamMember } from '../types';
import { Award, BadgeCheck, FileText, CheckCircle2 } from 'lucide-react';

interface TeamCardProps {
  member: TeamMember;
  onViewSlide?: () => void;
  featured?: boolean;
}

export const TeamCard: React.FC<TeamCardProps> = ({ member, onViewSlide, featured = false }) => {
  return (
    <div
      className={`bg-gradient-to-b from-[#0b1d36] to-[#071527] border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-yellow-400/50 flex flex-col ${
        featured ? 'border-yellow-400/40 shadow-xl shadow-yellow-400/5' : 'border-[#1e3a5f]'
      }`}
    >
      {/* Top Banner & Photo Area */}
      <div className="relative pt-6 px-6 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-[#0d2547] to-transparent">
        {/* Division badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#08182e] border border-[#1e3a5f] text-[10px] font-mono font-bold text-yellow-300">
          DIV {member.division}
        </div>

        {/* Roll number badge */}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black tracking-wider">
          {member.rollNo}
        </div>

        {/* Photo Container */}
        <div className="relative w-32 h-32 mt-2 rounded-2xl overflow-hidden border-2 border-yellow-400/60 shadow-lg shadow-black/40 bg-[#061224] group">
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover object-center transition duration-300 group-hover:scale-105"
            onError={(e) => {
              // fallback if needed
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Name and Role */}
        <h3 className="mt-4 text-lg font-black text-white tracking-tight leading-snug">
          {member.name}
        </h3>
        <span className="inline-block px-2.5 py-0.5 mt-1 rounded-md text-[11px] font-semibold bg-sky-950/60 text-sky-300 border border-sky-500/30">
          {member.role}
        </span>
      </div>

      {/* Details Body */}
      <div className="p-6 pt-2 flex-1 flex flex-col justify-between space-y-4">
        {/* Academic Meta Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#08182e] border border-[#1c3e6b] text-xs">
          <div>
            <span className="text-[10px] text-[#93c5fd] font-mono block">SAP ID</span>
            <span className="font-mono font-bold text-yellow-300">
              {member.sapId || 'Verified / Active'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#93c5fd] font-mono block">ROLL NO</span>
            <span className="font-mono font-bold text-white">{member.rollNo}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#93c5fd] font-mono block">DIVISION</span>
            <span className="font-mono font-bold text-emerald-400">{member.division}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#93c5fd] font-mono block">PROJECT GROUP</span>
            <span className="font-mono font-bold text-sky-300">Group 6</span>
          </div>
        </div>

        {/* Focus Area */}
        <div>
          <span className="text-[11px] font-bold text-[#bfdbfe] block uppercase tracking-wider mb-1">
            Research Specialization
          </span>
          <p className="text-xs text-[#93c5fd] leading-relaxed">
            {member.focusArea}
          </p>
        </div>

        {/* Contributions */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#bfdbfe] block uppercase tracking-wider">
            Key Contributions
          </span>
          {member.contributions.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#bfdbfe]">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
              <span className="leading-tight">{c}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {onViewSlide && (
          <button
            onClick={onViewSlide}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-[#132c4e] hover:bg-[#1e3a5f] text-sky-200 hover:text-white border border-[#1e3a5f] text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Team Slide in PPTX</span>
          </button>
        )}
      </div>
    </div>
  );
};
