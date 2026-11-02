import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { TEAM_MEMBERS } from '../data/team';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Users,
  Grid,
  FileText,
  Download,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDF_URL = '/assets/aistudio/Honeycomb_Spiderweb_Structures_C331_C332_C341_C347_dc5800d7.pdf';

interface PresentationViewerProps {
  initialSlideId?: number;
  onOpenTeamTab?: () => void;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  initialSlideId = 1,
  onOpenTeamTab
}) => {
  const [numPages, setNumPages] = useState<number>(44);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showTeamSlide, setShowTeamSlide] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  // Load PDF document on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: PDF_URL });
        const doc = await loadingTask.promise;
        if (!isMounted) return;
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error loading PDF with pdfjs:', err);
        if (isMounted) {
          setLoadError('Using direct presentation viewer mode.');
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
    };
  }, []);

  // Render current page onto canvas
  useEffect(() => {
    if (showTeamSlide) return;
    if (!pdfDocRef.current || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore cancel error
          }
        }

        const page = await pdfDocRef.current.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate responsive viewport scale
        const containerWidth = stageContainerRef.current?.clientWidth || 960;
        const baseViewport = page.getViewport({ scale: 1.0 });
        const fitScale = (containerWidth - 48) / baseViewport.width;
        const effectiveScale = Math.min(2.5, Math.max(0.6, fitScale * scale));

        const viewport = page.getViewport({ scale: effectiveScale });

        // Handle high DPI screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        const task = page.render(renderContext);
        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, scale, showTeamSlide]);

  // Keyboard navigation for page to page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showTeamSlide) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Escape') {
          setShowTeamSlide(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage((prev) => Math.min(numPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentPage((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages, isFullscreen, showTeamSlide]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (stageContainerRef.current?.requestFullscreen) {
        stageContainerRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Presentation Bar */}
      <div className="bg-[#0b1d36] border border-[#1e3a5f] rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-yellow-400 text-slate-950 font-mono text-[11px] font-black">
              PRESENTATION DECK
            </span>
            <span className="text-xs text-[#93c5fd] font-mono">
              Group 6 • Division E2
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            Honeycomb_Spiderweb_Structures_C331_C332_C341_C347.pdf
          </h2>
          <p className="text-xs text-[#bfdbfe] mt-0.5">
            Interactive Slide Deck • {numPages} Total Pages • Navigating Page to Page
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Team Slide Button */}
          <button
            onClick={() => setShowTeamSlide(!showTeamSlide)}
            className={`px-3.5 py-2 rounded-xl border transition flex items-center gap-1.5 font-bold ${
              showTeamSlide
                ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-400/20 font-black'
                : 'bg-[#08182e] text-yellow-300 border-yellow-400/40 hover:bg-yellow-400/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{showTeamSlide ? 'Back to PDF Slides' : 'Team Details Slide'}</span>
          </button>

          {/* Thumbnails grid */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`px-3 py-2 rounded-xl border transition flex items-center gap-1.5 font-bold ${
              showThumbnails
                ? 'bg-[#1e3a5f] text-white border-[#38bdf8] shadow-md'
                : 'bg-[#08182e] text-[#93c5fd] border-[#1e3a5f] hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Pages Grid ({numPages})</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-[#08182e] border border-[#1e3a5f] rounded-xl p-1 gap-1">
            <button
              onClick={() => setScale((s) => Math.max(0.7, s - 0.15))}
              className="p-1 text-[#93c5fd] hover:text-white rounded hover:bg-[#132c4e]"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-yellow-300 px-1 font-bold">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((s) => Math.min(2.0, s + 0.15))}
              className="p-1 text-[#93c5fd] hover:text-white rounded hover:bg-[#132c4e]"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-xl bg-[#08182e] text-[#93c5fd] hover:text-white border border-[#1e3a5f] transition flex items-center gap-1.5 font-bold"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Stage (Page to Page Viewer) */}
      <div
        ref={stageContainerRef}
        className={`relative rounded-3xl overflow-hidden border border-[#1e3a5f] shadow-2xl bg-[#061224] transition-all flex flex-col justify-between ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'min-h-[580px] lg:min-h-[660px]'
        }`}
      >
        {/* Stage Top Bar */}
        <div className="px-6 py-3.5 bg-[#08182e]/95 backdrop-blur border-b border-[#1c3e6b] flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse"></span>
            <span className="font-mono text-yellow-300 font-bold uppercase tracking-wider text-[11px]">
              {showTeamSlide
                ? 'SPECIAL SLIDE // TEAM DETAILS'
                : `PAGE ${currentPage} OF ${numPages}`}
            </span>
            <span className="text-[#1e3a5f]">|</span>
            <span className="text-[#93c5fd] font-mono text-[11px]">
              {showTeamSlide
                ? 'Official Group 6 Capstone Roster'
                : 'Bio-Inspired Structural Engineering'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#0b2447] text-sky-300 border border-[#1e3a5f]">
              C331 • C332 • C341 • C347
            </span>
          </div>
        </div>

        {/* Viewport: Canvas PDF Renderer or Team Slide */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center overflow-auto bg-[#040d1a]">
          {isLoading && (
            <div className="flex flex-col items-center gap-3 text-center py-20 text-[#93c5fd]">
              <div className="w-10 h-10 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-xs">Loading presentation slides...</p>
            </div>
          )}

          {/* Special Team Details Slide */}
          {showTeamSlide ? (
            <div className="w-full max-w-5xl py-6 px-4 space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-300 font-mono text-xs font-bold border border-yellow-400/30 uppercase tracking-widest inline-block mb-2">
                  OFFICIAL CAPSTONE TEAM DETAILS
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  Group 6 Engineering Investigators
                </h1>
                <p className="text-xs text-[#93c5fd] mt-1 font-mono">
                  DIVISION E2 • BIOMIMETIC STRUCTURES RESEARCH PROJECT
                </p>
              </div>

              {/* 4 Team Member Cards Inside Slide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-b from-[#0b1d36] to-[#08182e] border-2 border-yellow-400/50 rounded-2xl p-4 flex flex-col items-center text-center shadow-xl hover:border-yellow-400 transition"
                  >
                    {/* Member Photo */}
                    <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-md mb-3 bg-[#061224]">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-yellow-300 font-mono text-[9px] font-bold">
                        {member.rollNo}
                      </div>
                    </div>

                    <h4 className="text-base font-black text-white leading-tight">
                      {member.name}
                    </h4>
                    <span className="text-[11px] font-medium text-sky-300 mt-0.5">
                      {member.role}
                    </span>

                    {/* Meta Badge Grid */}
                    <div className="w-full mt-3 pt-3 border-t border-[#1c3e6b] space-y-1 text-[11px] text-left font-mono">
                      <div className="flex justify-between">
                        <span className="text-[#93c5fd]">SAP ID:</span>
                        <span className="font-bold text-yellow-300">{member.sapId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#93c5fd]">ROLL NO:</span>
                        <span className="font-bold text-white">{member.rollNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#93c5fd]">DIVISION:</span>
                        <span className="font-bold text-emerald-400">{member.division}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Research Distribution Summary */}
              <div className="bg-[#0b2447]/90 border border-[#1e3a5f] p-4 rounded-xl text-xs text-[#bfdbfe] flex items-center justify-between flex-wrap gap-2">
                <div>
                  <strong className="text-yellow-300">Project Scope:</strong> Spider-Web Tensile Networks & Honeycomb Cellular Mechanics FEA
                </div>
                <div className="font-mono text-[11px] text-[#93c5fd]">
                  C331 Mohd Rayaan • C332 Arjun Nayak • C341 Advait Pandya • C347 Khushit Patidar
                </div>
              </div>
            </div>
          ) : (
            /* Canvas PDF Render with Fallback Iframe */
            <div className="relative flex flex-col items-center justify-center max-w-full">
              {loadError ? (
                <iframe
                  src={`${PDF_URL}#page=${currentPage}&toolbar=0&navpanes=0`}
                  title="PDF Slide Viewer"
                  className="w-full h-[540px] lg:h-[620px] rounded-xl border border-[#1e3a5f] bg-[#061224]"
                />
              ) : (
                <div className="relative shadow-2xl rounded-xl overflow-hidden border border-[#1e3a5f] bg-[#061224] transition-all">
                  <canvas ref={canvasRef} className="block max-w-full h-auto select-none" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Page to Page Bottom Controls */}
        <div className="px-6 py-4 bg-[#08182e]/95 backdrop-blur border-t border-[#1c3e6b] flex flex-wrap items-center justify-between gap-4 select-none">
          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (showTeamSlide) setShowTeamSlide(false);
                setCurrentPage((p) => Math.max(1, p - 1));
              }}
              disabled={currentPage === 1 && !showTeamSlide}
              className="px-3.5 py-2 rounded-xl bg-[#0d223f] hover:bg-[#1e3a5f] disabled:opacity-40 disabled:cursor-not-allowed text-[#93c5fd] hover:text-white border border-[#1e3a5f] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            {/* Jump to page slider or input */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#061224] border border-[#1e3a5f] rounded-xl text-xs font-mono">
              <span className="text-[#93c5fd]">Page</span>
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (val >= 1 && val <= numPages) {
                    setShowTeamSlide(false);
                    setCurrentPage(val);
                  }
                }}
                className="w-12 text-center bg-[#0d223f] text-yellow-300 font-bold rounded border border-[#1e3a5f] py-0.5"
              />
              <span className="text-white">/ {numPages}</span>
            </div>

            <button
              onClick={() => {
                if (showTeamSlide) setShowTeamSlide(false);
                setCurrentPage((p) => Math.min(numPages, p + 1));
              }}
              disabled={currentPage === numPages && !showTeamSlide}
              className="px-3.5 py-2 rounded-xl bg-[#0d223f] hover:bg-[#1e3a5f] disabled:opacity-40 disabled:cursor-not-allowed text-[#93c5fd] hover:text-white border border-[#1e3a5f] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Slider Scrubbing */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs mx-4">
            <span className="text-[10px] font-mono text-[#93c5fd]">1</span>
            <input
              type="range"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                setShowTeamSlide(false);
                setCurrentPage(parseInt(e.target.value, 10));
              }}
              className="w-full accent-yellow-400 bg-[#061224] h-1.5 rounded cursor-pointer"
            />
            <span className="text-[10px] font-mono text-[#93c5fd]">{numPages}</span>
          </div>

          {/* Direct Slide Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTeamSlide(!showTeamSlide)}
              className="px-3.5 py-2 rounded-xl bg-[#132c4e] hover:bg-[#1e3a5f] text-yellow-300 border border-yellow-400/40 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-yellow-400" />
              <span>{showTeamSlide ? 'Show PDF' : 'Team Slide'}</span>
            </button>

            <a
              href={PDF_URL}
              download="Honeycomb_Spiderweb_Structures_C331_C332_C341_C347.pdf"
              className="px-3 py-2 rounded-xl bg-[#08182e] hover:bg-[#132c4e] text-[#93c5fd] hover:text-white border border-[#1e3a5f] text-xs font-bold flex items-center gap-1.5 transition"
              title="Download presentation PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails Drawer (if toggled) */}
      {showThumbnails && (
        <div className="bg-[#0b1d36] border border-[#1e3a5f] p-6 rounded-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Grid className="w-4 h-4 text-yellow-400" />
              <span>All 44 Presentation Slides • Jump to Page</span>
            </h3>
            <span className="text-xs text-[#93c5fd] font-mono">
              Click any slide to jump
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-2">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNo) => (
              <button
                key={pageNo}
                onClick={() => {
                  setShowTeamSlide(false);
                  setCurrentPage(pageNo);
                  setShowThumbnails(false);
                }}
                className={`py-2 px-1 rounded-lg border text-center transition font-mono text-xs font-bold ${
                  currentPage === pageNo && !showTeamSlide
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md font-black'
                    : 'bg-[#08182e] text-[#93c5fd] border-[#1e3a5f] hover:text-white hover:border-[#38bdf8]'
                }`}
              >
                P. {pageNo}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Project Authors Roster */}
      <section className="mt-12 bg-gradient-to-b from-[#0b1d36] to-[#07162b] border border-[#1e3a5f] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#1c3e6b]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-yellow-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              <span>Project Investigators & Authors</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Group 6: Advait, Rayaan, Khushit & Arjun
            </h3>
            <p className="text-xs text-[#93c5fd] mt-0.5">
              Division E2 • C331 • C332 • C341 • C347
            </p>
          </div>

          {onOpenTeamTab && (
            <button
              onClick={onOpenTeamTab}
              className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs hover:bg-yellow-300 transition flex items-center gap-1.5 shadow-md shadow-yellow-400/20"
            >
              <Users className="w-4 h-4" />
              <span>Open Dedicated Team Tab</span>
            </button>
          )}
        </div>

        {/* The 4 photos with names and credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-[#08182e] border border-[#1e3a5f] rounded-2xl p-4 flex flex-col items-center text-center hover:border-yellow-400/50 transition group"
            >
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-yellow-400/70 shadow-lg mb-3 bg-[#061224]">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-yellow-300 text-[10px] font-mono font-bold border border-yellow-400/40">
                  {member.rollNo}
                </span>
              </div>

              <h4 className="text-base font-black text-white leading-tight">
                {member.name}
              </h4>
              <p className="text-xs text-[#93c5fd] font-medium mt-0.5">
                {member.role}
              </p>

              <div className="w-full mt-3 pt-2.5 border-t border-[#1c3e6b] grid grid-cols-2 gap-1 text-[11px] font-mono">
                <div className="text-left">
                  <span className="text-[#93c5fd] block text-[9px]">SAP ID</span>
                  <span className="font-bold text-yellow-300">{member.sapId}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#93c5fd] block text-[9px]">DIV</span>
                  <span className="font-bold text-emerald-400">{member.division}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
