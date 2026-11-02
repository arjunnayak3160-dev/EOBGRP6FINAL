import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HoneycombSim } from './components/HoneycombSim';
import { SpiderwebSim } from './components/SpiderwebSim';
import { MaterialsMatrix } from './components/MaterialsMatrix';
import { PresentationViewer } from './components/PresentationViewer';
import { TeamView } from './components/TeamView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulators' | 'presentation' | 'team'>('simulators');
  const [targetSlideId, setTargetSlideId] = useState<number>(1);

  const navigateToPresentation = (slideId: number = 1) => {
    setTargetSlideId(slideId);
    setActiveTab('presentation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTeam = () => {
    setActiveTab('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSimulators = () => {
    setActiveTab('simulators');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#061224] text-[#f8fafc] selection:bg-yellow-400 selection:text-slate-950 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onJumpToTeamSlide={() => navigateToPresentation(2)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'simulators' && (
          <div>
            {/* Hero Section */}
            <Hero
              onNavigateToPresentation={() => navigateToPresentation(1)}
              onNavigateToTeam={navigateToTeam}
            />

            {/* Simulators Container */}
            <div className="max-w-7xl mx-auto px-4 mt-12 space-y-16 pb-20">
              {/* Module 1: Honeycomb Structural Engineering Lab */}
              <HoneycombSim />

              {/* Module 2: Spiderweb Tensile Redistribution */}
              <SpiderwebSim />

              {/* Module 3: Materials Matrix */}
              <MaterialsMatrix />

              {/* Quick Jump to Presentation & Team Callout */}
              <div className="bg-gradient-to-r from-[#0b1d36] via-[#0e274a] to-[#07172b] border border-[#1e3a5f] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-yellow-400/10 text-yellow-300 font-mono text-xs font-bold border border-yellow-400/30 uppercase">
                    Capstone Deliverables
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Ready for Presentation Review?
                  </h3>
                  <p className="text-xs text-[#93c5fd] mt-1 max-w-xl">
                    View the full 12-slide slide deck (<strong>Honeycomb_Spiderweb_Structures_C331_C332_C341_C347.pptx</strong>), including the dedicated Team Details Slide and member research dossiers.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 shrink-0">
                  <button
                    onClick={() => navigateToPresentation(2)}
                    className="px-4 py-2.5 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition shadow-md shadow-yellow-400/20"
                  >
                    View Team Slide (Slide 2)
                  </button>
                  <button
                    onClick={() => navigateToPresentation(1)}
                    className="px-4 py-2.5 rounded-xl bg-[#1e3a5f] text-[#bfdbfe] hover:text-white border border-[#38bdf8]/40 font-bold text-xs transition"
                  >
                    Launch PPTX Deck
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'presentation' && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <PresentationViewer
              initialSlideId={targetSlideId}
              onOpenTeamTab={navigateToTeam}
            />
          </div>
        )}

        {activeTab === 'team' && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <TeamView
              onNavigateToSlide={(slideId) => navigateToPresentation(slideId)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1c3e6b] bg-[#061224] py-8 text-xs text-[#93c5fd]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <div className="font-bold text-white text-sm">
              BIO<span className="text-yellow-400">STRUCTURES</span> • Biomimetic Multi-Physics Platform
            </div>
            <p className="text-[11px] text-[#93c5fd] mt-0.5">
              Spider-Web Tensile Networks & Honeycomb Cellular Mechanics FEA
            </p>
          </div>

          <div className="font-mono text-[11px] text-[#bfdbfe]">
            Group 6 (Division E2): Mohd Rayaan (C331) • Arjun Nayak (C332) • Advait Pandya (C341) • Khushit Patidar (C347)
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={navigateToSimulators}
              className="hover:text-yellow-300 transition"
            >
              Simulators
            </button>
            <span>•</span>
            <button
              onClick={() => navigateToPresentation(1)}
              className="hover:text-yellow-300 transition"
            >
              Presentation (PPTX)
            </button>
            <span>•</span>
            <button
              onClick={navigateToTeam}
              className="hover:text-yellow-300 transition"
            >
              Team Details
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
