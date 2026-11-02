import React, { useEffect, useRef, useState } from 'react';
import { Wind, Crosshair, Scissors, RefreshCw, Activity, ShieldAlert } from 'lucide-react';

export const SpiderwebSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [webEvent, setWebEvent] = useState<string>('none');
  const [silk, setSilk] = useState<'major_ampullate' | 'flagelliform' | 'steel'>('major_ampullate');
  const [windSpeed, setWindSpeed] = useState<number>(40);

  const [integrity, setIntegrity] = useState<number>(100);
  const [cutCount, setCutCount] = useState<number>(0);
  const [workEnergy, setWorkEnergy] = useState<number>(0);

  const stateRef = useRef({
    webEvent,
    silk,
    windSpeed,
    simTime: 0,
    webNodes: [] as any[],
    webEdges: [] as any[],
    webWindParts: [] as any[],
    webShockwaves: [] as any[],
    webProj: { x: -40, y: 220, vx: 0, vy: 0, active: false },
    webDragId: null as number | null,
    webMouse: { x: 0, y: 0 },
    webOscHistory: new Array(80).fill(0)
  });

  useEffect(() => {
    stateRef.current.webEvent = webEvent;
    stateRef.current.silk = silk;
    stateRef.current.windSpeed = windSpeed;
  }, [webEvent, silk, windSpeed]);

  const initWeb = () => {
    const s = stateRef.current;
    s.webNodes = [];
    s.webEdges = [];
    s.webShockwaves = [];
    const cx = 380, cy = 220;
    const spokes = 14, rings = [0, 38, 76, 115, 155, 195];
    let nId = 0, eId = 0;

    s.webNodes.push({
      id: nId++,
      x: cx,
      y: cy,
      oldX: cx,
      oldY: cy,
      bx: cx,
      by: cy,
      vx: 0,
      vy: 0,
      fixed: false,
      spoke: -1
    });

    for (let r = 1; r < rings.length; r++) {
      const rad = rings[r], isAnchor = r === rings.length - 1;
      for (let sp = 0; sp < spokes; sp++) {
        const a = (sp * 2 * Math.PI) / spokes;
        const px = cx + rad * Math.cos(a), py = cy + rad * Math.sin(a);
        s.webNodes.push({
          id: nId++,
          x: px,
          y: py,
          oldX: px,
          oldY: py,
          bx: px,
          by: py,
          vx: 0,
          vy: 0,
          fixed: isAnchor,
          spoke: sp
        });
      }
    }

    for (let sp = 0; sp < spokes; sp++) {
      s.webEdges.push({
        id: eId++,
        u: 0,
        v: 1 + sp,
        rest: rings[1],
        broken: false,
        type: 'radial',
        strain: 0
      });
      for (let r = 1; r < rings.length - 1; r++) {
        const u = 1 + (r - 1) * spokes + sp, v = 1 + r * spokes + sp;
        const d = Math.hypot(s.webNodes[v].x - s.webNodes[u].x, s.webNodes[v].y - s.webNodes[u].y);
        s.webEdges.push({ id: eId++, u, v, rest: d, broken: false, type: 'radial', strain: 0 });
      }
    }

    for (let r = 1; r < rings.length; r++) {
      const off = 1 + (r - 1) * spokes;
      for (let sp = 0; sp < spokes; sp++) {
        const u = off + sp, v = off + ((sp + 1) % spokes);
        const d = Math.hypot(s.webNodes[v].x - s.webNodes[u].x, s.webNodes[v].y - s.webNodes[u].y);
        s.webEdges.push({ id: eId++, u, v, rest: d, broken: false, type: 'spiral', strain: 0 });
      }
    }

    s.webWindParts = [];
    for (let i = 0; i < 40; i++) {
      s.webWindParts.push({
        x: Math.random() * 760,
        y: Math.random() * 440,
        vx: 4 + Math.random() * 6,
        vy: (Math.random() - 0.5) * 1.5
      });
    }

    setIntegrity(100);
    setCutCount(0);
    setWorkEnergy(0);
  };

  useEffect(() => {
    initWeb();
  }, []);

  const triggerEvent = (evt: string) => {
    setWebEvent(evt);
    if (evt === 'impact') {
      stateRef.current.webProj = {
        x: 35,
        y: 220,
        vx: 26,
        vy: (Math.random() - 0.5) * 6,
        active: true
      };
      stateRef.current.webShockwaves.push({ x: 380, y: 220, r: 4, alpha: 1.0 });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const s = stateRef.current;
      s.simTime += 0.016;

      const w = canvas.width, h = canvas.height;

      const kRad = s.silk === 'major_ampullate' ? 0.4 : s.silk === 'flagelliform' ? 0.17 : 0.92;
      const kSpi = s.silk === 'major_ampullate' ? 0.19 : s.silk === 'flagelliform' ? 0.09 : 0.86;
      const rupture = s.silk === 'major_ampullate' ? 1.68 : s.silk === 'flagelliform' ? 2.65 : 1.12;

      // Event dynamics
      if (s.webEvent === 'wind') {
        const force = (s.windSpeed / 40) * 1.8;
        s.webNodes.forEach((n) => {
          if (!n.fixed) n.vx += force * 0.25 + (Math.random() - 0.5) * 0.4;
        });
      } else if (s.webEvent === 'sway') {
        s.webNodes.forEach((n) => {
          if (n.fixed) {
            n.x = n.bx + Math.sin(s.simTime * 5 + n.spoke * 0.4) * 18;
            n.y = n.by + Math.cos(s.simTime * 4 + n.spoke * 0.3) * 12;
          }
        });
      } else {
        s.webNodes.forEach((n) => {
          if (n.fixed) { n.x = n.bx; n.y = n.by; }
        });
      }

      // Ballistic Projectile
      if (s.webProj.active) {
        s.webProj.x += s.webProj.vx;
        s.webProj.y += s.webProj.vy;
        s.webNodes.forEach((n) => {
          if (!n.fixed) {
            const d = Math.hypot(n.x - s.webProj.x, n.y - s.webProj.y);
            if (d < 35) {
              n.vx += ((n.x - s.webProj.x) / d) * s.webProj.vx * 0.4;
              n.vy += ((n.y - s.webProj.y) / d) * s.webProj.vx * 0.4;
              s.webProj.vx *= 0.82;
            }
          }
        });
        if (s.webProj.vx < 0.5 || s.webProj.x > 760) s.webProj.active = false;
      }

      // Relaxation solver passes
      let brokenThisFrame = false;
      for (let iter = 0; iter < 5; iter++) {
        s.webEdges.forEach((e) => {
          if (e.broken) return;
          const n1 = s.webNodes[e.u], n2 = s.webNodes[e.v];
          if (!n1 || !n2) return;
          const dx = n2.x - n1.x, dy = n2.y - n1.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const strain = d / e.rest;
          e.strain = strain;

          if (strain > rupture) {
            e.broken = true;
            brokenThisFrame = true;
            s.webShockwaves.push({ x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2, r: 4, alpha: 0.9 });
            return;
          }

          let k = e.type === 'radial' ? kRad : kSpi;
          if (strain > 1.25) k *= 2.4;
          const diff = (d - e.rest) / d;
          const ox = dx * diff * 0.5 * k, oy = dy * diff * 0.5 * k;

          if (!n1.fixed && s.webDragId !== n1.id) { n1.x += ox; n1.y += oy; }
          if (!n2.fixed && s.webDragId !== n2.id) { n2.x -= ox; n2.y -= oy; }
        });
      }

      if (brokenThisFrame) {
        const broken = s.webEdges.filter((e) => e.broken).length;
        const total = s.webEdges.length || 1;
        setIntegrity(Math.max(0, Math.round(((total - broken) / total) * 100)));
        setCutCount(broken);
        setWorkEnergy(broken * 160);
      }

      // Verlet Position updates
      s.webNodes.forEach((n) => {
        if (n.fixed) return;
        if (s.webDragId === n.id) {
          n.x = s.webMouse.x;
          n.y = s.webMouse.y;
          n.vx = 0;
          n.vy = 0;
          return;
        }
        const vx = (n.x - n.oldX) * 0.91 + n.vx;
        const vy = (n.y - n.oldY) * 0.91 + n.vy;
        n.oldX = n.x;
        n.oldY = n.y;
        n.x += vx;
        n.y += vy;
        n.vx = 0;
        n.vy = 0;
      });

      // Wind particles
      s.webWindParts.forEach((p) => {
        p.x += p.vx + s.windSpeed / 25;
        p.y += p.vy;
        if (p.x > 760) {
          p.x = 0;
          p.y = Math.random() * 440;
        }
      });

      // Shockwaves
      for (let i = s.webShockwaves.length - 1; i >= 0; i--) {
        const sw = s.webShockwaves[i];
        sw.r += 3.5;
        sw.alpha -= 0.035;
        if (sw.alpha <= 0) s.webShockwaves.splice(i, 1);
      }

      s.webOscHistory.shift();
      s.webOscHistory.push(
        s.webNodes[0] ? Math.hypot(s.webNodes[0].x - s.webNodes[0].bx, s.webNodes[0].y - s.webNodes[0].by) : 0
      );

      // DRAWING
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#061224';
      ctx.fillRect(0, 0, w, h);

      // Wind Streaks
      if (s.webEvent === 'wind') {
        s.webWindParts.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3.5, p.y + p.vy);
          ctx.strokeStyle = 'rgba(147, 197, 253, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      // Shockwave ripples
      s.webShockwaves.forEach((sw) => {
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Edges
      s.webEdges.forEach((e) => {
        if (e.broken) return;
        const n1 = s.webNodes[e.u], n2 = s.webNodes[e.v];
        if (!n1 || !n2) return;
        const st = e.strain || 1.0;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = st > 1.35 ? '#ef4444' : st > 1.15 ? '#facc15' : e.type === 'radial' ? '#93c5fd' : '#bfdbfe';
        ctx.lineWidth = e.type === 'radial' ? 2.2 : 1.3;
        ctx.stroke();
      });

      // Draw Nodes
      s.webNodes.forEach((n) => {
        if (n.fixed) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#10b981';
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = s.webDragId === n.id ? '#facc15' : '#93c5fd';
          ctx.fill();
        }
      });

      // Hub
      if (s.webNodes[0]) {
        ctx.beginPath();
        ctx.arc(s.webNodes[0].x, s.webNodes[0].y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.fill();
      }

      // Projectile
      if (s.webProj.active) {
        ctx.beginPath();
        ctx.arc(s.webProj.x, s.webProj.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }

      // Hub displacement oscillogram
      const ox = 18, oy = h - 85, ow = 200, oh = 65;
      ctx.fillStyle = 'rgba(8, 22, 40, 0.9)';
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = '#1e3a5f';
      ctx.strokeRect(ox, oy, ow, oh);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('HUB DISPLACEMENT (μm)', ox + 8, oy + 14);

      ctx.beginPath();
      ctx.strokeStyle = s.webEvent === 'impact' ? '#ef4444' : '#93c5fd';
      ctx.lineWidth = 1.8;
      for (let i = 0; i < s.webOscHistory.length; i++) {
        const px = ox + 6 + (i / s.webOscHistory.length) * (ow - 12);
        const py = oy + oh - 6 - Math.min(oh - 24, s.webOscHistory[i] * 1.8);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      stateRef.current.webMouse = { x, y };

      if (stateRef.current.webEvent === 'cut') {
        for (let edge of stateRef.current.webEdges) {
          if (edge.broken) continue;
          const n1 = stateRef.current.webNodes[edge.u], n2 = stateRef.current.webNodes[edge.v];
          const midX = (n1.x + n2.x) / 2, midY = (n1.y + n2.y) / 2;
          if (Math.hypot(x - midX, y - midY) < 18) {
            edge.broken = true;
            stateRef.current.webShockwaves.push({ x: midX, y: midY, r: 3, alpha: 0.9 });
            const broken = stateRef.current.webEdges.filter((ed) => ed.broken).length;
            const total = stateRef.current.webEdges.length || 1;
            setIntegrity(Math.max(0, Math.round(((total - broken) / total) * 100)));
            setCutCount(broken);
            setWorkEnergy(broken * 160);
            break;
          }
        }
        return;
      }

      let closest = null, minD = 30;
      for (let n of stateRef.current.webNodes) {
        if (n.fixed) continue;
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < minD) { minD = d; closest = n.id; }
      }
      if (closest !== null) stateRef.current.webDragId = closest;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.webMouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseUp = () => {
      stateRef.current.webDragId = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <section id="spiderweb" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-6 w-2 rounded-full bg-sky-400 block"></span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Module II: Spider-Web Tensile Redistribution (Verlet Dynamics)
        </h2>
      </div>

      <div className="bg-[#0b1d36] border border-[#1e3a5f] rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pb-5 border-b border-[#1c3e6b] gap-4">
          <div>
            <div className="inline-flex px-2.5 py-0.5 bg-sky-400/10 text-sky-300 rounded-full text-xs font-bold uppercase tracking-wider border border-sky-400/30">
              Non-Linear Sacrificial Network
            </div>
            <p className="text-[#93c5fd] text-xs mt-1">
              2nd-order Verlet spring mesh simulating aerodynamic wind drag, ballistic projectile impact, and tree branch sway.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => triggerEvent('wind')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                webEvent === 'wind'
                  ? 'bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-400/30'
                  : 'bg-[#081628] text-sky-300 border-sky-400/30 hover:bg-sky-950/30'
              }`}
            >
              💨 Hurricane Wind Wave
            </button>
            <button
              onClick={() => triggerEvent('impact')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                webEvent === 'impact'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-[#081628] text-rose-300 border-rose-500/30 hover:bg-rose-950/30'
              }`}
            >
              🪰 Ballistic Projectile Impact
            </button>
            <button
              onClick={() => triggerEvent('sway')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                webEvent === 'sway'
                  ? 'bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-400/30'
                  : 'bg-[#081628] text-yellow-300 border-yellow-400/30 hover:bg-yellow-950/30'
              }`}
            >
              🌳 Branch Sway / Seismic
            </button>
            <button
              onClick={() => triggerEvent('cut')}
              className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                webEvent === 'cut'
                  ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                  : 'bg-[#081628] text-[#bfdbfe] border border-[#1e3a5f] hover:text-white'
              }`}
            >
              ✂️ Snip Threads
            </button>
            <button
              onClick={initWeb}
              className="px-3 py-1.5 rounded-lg font-bold bg-[#1e3a5f] text-[#bfdbfe] hover:text-white transition flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#1e3a5f] shadow-2xl bg-[#061224]">
              <canvas
                ref={canvasRef}
                width={760}
                height={440}
                className="w-full h-auto block select-none cursor-crosshair"
              />
              <div className="absolute bottom-3 right-3 bg-[#0a1c33]/90 border border-[#1e3a5f] rounded-lg px-3 py-1 text-[10px] text-[#bfdbfe] font-mono">
                Click & drag nodes • Click threads in Snip mode
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4 text-center">
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">INTEGRITY</span>
                <span className="text-xl font-black text-emerald-400">{integrity}%</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">WORK OF FRACTURE</span>
                <span className="text-xl font-black text-sky-300">{workEnergy} MJ/m³</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">SEVERED FILAMENTS</span>
                <span className="text-xl font-black text-rose-400">{cutCount}</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">DAMAGE MODE</span>
                <span className="text-sm font-bold text-yellow-300 block mt-1">
                  {integrity > 60 ? 'Damage Isolated' : 'Network Compromised'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-4 bg-[#08182e]/80 p-5 rounded-2xl border border-[#1c3e6b] text-xs">
            <div>
              <label className="text-xs font-bold text-[#bfdbfe] uppercase tracking-wider block mb-2">
                Thread Material Model
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSilk('major_ampullate')}
                  className={`w-full text-left p-2.5 rounded-xl border transition ${
                    silk === 'major_ampullate'
                      ? 'border-[#38bdf8] bg-[#1e3a5f] text-sky-300 font-bold'
                      : 'border-[#1e3a5f] text-[#93c5fd] hover:text-white bg-[#061224]'
                  }`}
                >
                  Major Ampullate (Dragline)
                  <span className="block text-[10px] text-[#bfdbfe] opacity-80 font-normal">
                    1.3 GPa Tensile • Sacrificial β-sheets
                  </span>
                </button>

                <button
                  onClick={() => setSilk('flagelliform')}
                  className={`w-full text-left p-2.5 rounded-xl border transition ${
                    silk === 'flagelliform'
                      ? 'border-[#38bdf8] bg-[#1e3a5f] text-sky-300 font-bold'
                      : 'border-[#1e3a5f] text-[#93c5fd] hover:text-white bg-[#061224]'
                  }`}
                >
                  Flagelliform (Capture Coil)
                  <span className="block text-[10px] text-[#bfdbfe] opacity-70 font-normal">
                    0.5 GPa Tensile • 270% Elongation
                  </span>
                </button>

                <button
                  onClick={() => setSilk('steel')}
                  className={`w-full text-left p-2.5 rounded-xl border transition ${
                    silk === 'steel'
                      ? 'border-[#38bdf8] bg-[#1e3a5f] text-sky-300 font-bold'
                      : 'border-[#1e3a5f] text-[#93c5fd] hover:text-white bg-[#061224]'
                  }`}
                >
                  High-Tensile Steel Wire
                  <span className="block text-[10px] text-[#bfdbfe] opacity-70 font-normal">
                    1.5 GPa Tensile • Snaps Web Cascadingly
                  </span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#bfdbfe]">Wind Velocity</span>
                <span className="font-mono text-sky-300 font-bold">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(parseInt(e.target.value))}
                className="w-full accent-sky-400 bg-[#061224] h-1.5 rounded cursor-pointer"
              />
            </div>

            <div className="bg-[#0b2447]/90 border border-[#1e3a5f] p-3.5 rounded-xl text-[#bfdbfe] leading-relaxed mt-1">
              <strong className="text-yellow-300">MIT Buehler Sacrificial Mechanism:</strong> Spider silk exhibits localized strain-softening, letting single threads rupture cleanly without propagating shock waves into the surrounding web.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
