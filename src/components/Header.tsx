import React from 'react';
import { Layers, Presentation, Users, Activity, ExternalLink } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulators' | 'presentation' | 'team';
  setActiveTab: (tab: 'simulators' | 'presentation' | 'team') => void;
  onJumpToTeamSlide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#061224]/95 border-b border-[#1c3e6b]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('simulators')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-yellow-500/20">
            ⬡
          </div>
          <div>
            <div className="font-black text-white text-base tracking-tight flex items-center gap-1.5">
              <span>BIO</span>
              <span className="text-yellow-400">STRUCTURES</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#132c4e] text-sky-300 border border-[#1e3a5f] font-semibold hidden md:inline-block">
                FEA Lab
              </span>
            </div>
            <div className="text-[11px] text-[#93c5fd] font-mono leading-none hidden sm:block">
              Group 6 • Div E2 // C331 • C332 • C341 • C347
            </div>
          </div>
        </div>

        {/* Primary Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#08182e] p-1 rounded-xl border border-[#1e3a5f]">
          <button
            onClick={() => setActiveTab('simulators')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'simulators'
                ? 'bg-yellow-400 text-slate-950 font-black shadow-md shadow-yellow-400/20'
                : 'text-[#93c5fd] hover:text-white hover:bg-[#0d223f]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulators</span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'presentation'
                ? 'bg-yellow-400 text-slate-950 font-black shadow-md shadow-yellow-400/20'
                : 'text-[#93c5fd] hover:text-white hover:bg-[#0d223f]'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Presentation (PPTX)</span>
            <span className="sm:hidden">PPTX</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-yellow-400 text-slate-950 font-black shadow-md shadow-yellow-400/20'
                : 'text-[#93c5fd] hover:text-white hover:bg-[#0d223f]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Details</span>
          </button>
        </nav>

        {/* Quick simulator links when simulator tab is active */}
        {activeTab === 'simulators' && (
          <div className="hidden xl:flex items-center gap-1.5 text-xs">
            <a
              href="#honeycomb"
              className="px-2.5 py-1 rounded-lg bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 font-medium hover:bg-yellow-400/20 transition"
            >
              ⬡ Honeycomb
            </a>
            <a
              href="#spiderweb"
              className="px-2.5 py-1 rounded-lg bg-[#1e3a5f] text-[#bfdbfe] border border-[#38bdf8]/40 font-medium hover:text-white transition"
            >
              🕸️ Spiderweb
            </a>
            <a
              href="#materials"
              className="px-2.5 py-1 rounded-lg bg-[#132c4e] text-[#93c5fd] border border-[#1e3a5f] font-medium hover:text-white transition"
            >
              📊 Materials
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
