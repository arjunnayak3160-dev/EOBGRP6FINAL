import React, { useEffect, useRef, useState } from 'react';
import { Building2, Layers, Activity, Sliders, AlertTriangle } from 'lucide-react';

export const HoneycombSim: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [model, setModel] = useState<'building' | 'panel'>('building');
  const [bldgEvent, setBldgEvent] = useState<string>('seismic_shear');
  const [panelEvent, setPanelEvent] = useState<string>('idle');

  // Building params
  const [bldgFloors, setBldgFloors] = useState<number>(45);
  const [foundWallT, setFoundWallT] = useState<number>(180);
  const [seismicPGA, setSeismicPGA] = useState<number>(0.65);

  // Panel params
  const [panelFoilT, setPanelFoilT] = useState<number>(0.9);
  const [panelCellL, setPanelCellL] = useState<number>(16);
  const [panelLoadF, setPanelLoadF] = useState<number>(65);
  const [panelGeom, setPanelGeom] = useState<'hexagonal' | 'square' | 'triangular'>('hexagonal');

  // KPIs
  const [kpi1, setKpi1] = useState<string>('78.5%');
  const [kpi2, setKpi2] = useState<string>('22.4 MPa');
  const [kpi3, setKpi3] = useState<string>('0.14°');
  const [kpi4, setKpi4] = useState<string>('2.4x');

  // State refs to pass fresh values into animation loop
  const stateRef = useRef({
    model,
    bldgEvent,
    panelEvent,
    bldgFloors,
    foundWallT,
    seismicPGA,
    panelFoilT,
    panelCellL,
    panelLoadF,
    panelGeom,
    simTime: 0,
    hcNodes: [] as any[],
    hcBeams: [] as any[],
    hcCells: [] as any[],
    hcSway: { angle: 0, vAngle: 0, topX: 380 },
    hcTopPlaten: { y: 82, by: 82, vy: 0 },
    hcCrash: { y: -60, vy: 0, active: false },
    hcOsc: new Array(80).fill(0),
    isDraggingPlaten: false
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current.model = model;
    stateRef.current.bldgEvent = bldgEvent;
    stateRef.current.panelEvent = panelEvent;
    stateRef.current.bldgFloors = bldgFloors;
    stateRef.current.foundWallT = foundWallT;
    stateRef.current.seismicPGA = seismicPGA;
    stateRef.current.panelFoilT = panelFoilT;
    stateRef.current.panelCellL = panelCellL;
    stateRef.current.panelLoadF = panelLoadF;
    stateRef.current.panelGeom = panelGeom;
  }, [model, bldgEvent, panelEvent, bldgFloors, foundWallT, seismicPGA, panelFoilT, panelCellL, panelLoadF, panelGeom]);

  const initLattice = () => {
    const s = stateRef.current;
    s.hcNodes = [];
    s.hcBeams = [];
    s.hcCells = [];
    const w = 760, h = 440;
    const nodeMap = new Map<string, number>();

    if (s.model === 'building') {
      const raftY = 248, bedrockY = 380;
      const bLeft = 140, bRight = w - 140;
      const R = 22, W = R * 1.5, H = R * Math.sqrt(3);
      const cols = Math.ceil((bRight - bLeft) / W) + 1;
      const rows = Math.ceil((bedrockY - raftY) / H) + 1;

      const getFNode = (x: number, y: number) => {
        const cy = Math.max(raftY, Math.min(bedrockY, y));
        const k = `${Math.round(x * 10)},${Math.round(cy * 10)}`;
        if (nodeMap.has(k)) return nodeMap.get(k)!;
        const id = s.hcNodes.length;
        const isTop = Math.abs(cy - raftY) < 4.0;
        const isBot = Math.abs(cy - bedrockY) < 4.0;
        s.hcNodes.push({
          x,
          y: cy,
          bx: x,
          by: cy,
          vx: 0,
          vy: 0,
          fixed: isBot,
          isTop,
          mass: isTop ? 18 : isBot ? 50 : 2.5
        });
        nodeMap.set(k, id);
        return id;
      };

      for (let c = -1; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const cx = bLeft + c * W;
          const cy = raftY + r * H + (c % 2 !== 0 ? H / 2 : 0);
          if (cx >= bLeft - 10 && cx <= bRight + 10 && cy >= raftY - 10 && cy <= bedrockY + 10) {
            const cellIdxs: number[] = [];
            for (let i = 0; i < 6; i++) {
              const a = (Math.PI / 3) * i;
              const px = Math.max(bLeft, Math.min(bRight, cx + R * Math.cos(a)));
              const py = cy + R * Math.sin(a);
              cellIdxs.push(getFNode(px, py));
            }
            if (cx >= bLeft + R && cx <= bRight - R && cy >= raftY + R && cy <= bedrockY - R) {
              s.hcCells.push({ indices: [...cellIdxs] });
            }
            for (let i = 0; i < 6; i++) {
              const u = cellIdxs[i], v = cellIdxs[(i + 1) % 6];
              if (u !== v && !s.hcBeams.some((b) => (b.u === u && b.v === v) || (b.u === v && b.v === u))) {
                const d = Math.hypot(s.hcNodes[v].x - s.hcNodes[u].x, s.hcNodes[v].y - s.hcNodes[u].y);
                if (d > 2) s.hcBeams.push({ u, v, rest: d, stress: 0, yielded: false });
              }
            }
          }
        }
      }
      s.hcSway = { angle: 0, vAngle: 0, topX: 380 };
    } else {
      const pTop = 82, pBot = 368;
      const xMin = 70, xMax = w - 70;
      const R = Math.max(14, s.panelCellL * 1.35);
      const W = R * 1.5, H = R * Math.sqrt(3);

      const getPNode = (x: number, y: number) => {
        const cy = Math.max(pTop, Math.min(pBot, y));
        const k = `${Math.round(x * 10)},${Math.round(cy * 10)}`;
        if (nodeMap.has(k)) return nodeMap.get(k)!;
        const id = s.hcNodes.length;
        const isTop = Math.abs(cy - pTop) < 3.5;
        const isBot = Math.abs(cy - pBot) < 3.5;
        s.hcNodes.push({
          x,
          y: cy,
          bx: x,
          by: cy,
          vx: 0,
          vy: 0,
          fixed: isBot,
          isTop,
          mass: isTop || isBot ? 10 : 1
        });
        nodeMap.set(k, id);
        return id;
      };

      const cols = Math.ceil((xMax - xMin) / W) + 2;
      const rows = Math.ceil((pBot - pTop) / H) + 2;

      for (let c = -1; c <= cols; c++) {
        for (let r = -1; r <= rows; r++) {
          const cx = xMin + c * W;
          const cy = pTop + r * H + (c % 2 !== 0 ? H / 2 : 0);
          let inside = false;
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const px = cx + R * Math.cos(a), py = cy + R * Math.sin(a);
            if (px >= xMin - 15 && px <= xMax + 15 && py >= pTop - 10 && py <= pBot + 10) inside = true;
          }
          if (inside) {
            const cellIdxs: number[] = [];
            for (let i = 0; i < 6; i++) {
              const a = (Math.PI / 3) * i;
              const px = Math.max(xMin, Math.min(xMax, cx + R * Math.cos(a)));
              const py = cy + R * Math.sin(a);
              cellIdxs.push(getPNode(px, py));
            }
            if (cx >= xMin + R && cx <= xMax - R && cy >= pTop + R && cy <= pBot - R) {
              s.hcCells.push({ indices: [...cellIdxs] });
            }
            for (let i = 0; i < 6; i++) {
              const u = cellIdxs[i], v = cellIdxs[(i + 1) % 6];
              if (u !== v && !s.hcBeams.some((b) => (b.u === u && b.v === v) || (b.u === v && b.v === u))) {
                const d = Math.hypot(s.hcNodes[v].x - s.hcNodes[u].x, s.hcNodes[v].y - s.hcNodes[u].y);
                if (d > 2) s.hcBeams.push({ u, v, rest: d, stress: 0, yielded: false });
              }
            }
          }
        }
      }
      s.hcTopPlaten = { y: pTop, by: pTop, vy: 0 };
      s.hcCrash = { y: -60, vy: 0, active: false };
    }
  };

  useEffect(() => {
    initLattice();
  }, [model, panelCellL, panelGeom]);

  const triggerCrash = () => {
    stateRef.current.hcCrash = { y: 15, vy: 19, active: true };
    setPanelEvent('crash');
  };

  // Main Animation & Physics Loop
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

      // Physics update
      if (s.model === 'building') {
        const totalGravity = s.bldgFloors * 920;
        const fK = (s.foundWallT / 120) * 8.5;
        let groundX = 0;
        let axialForce = totalGravity * 0.0007;

        if (s.bldgEvent === 'seismic_shear') {
          const amp = s.seismicPGA * 34;
          groundX = Math.sin(s.simTime * 8.5) * amp + Math.sin(s.simTime * 16) * (amp * 0.3);
          s.hcNodes.forEach((n) => { if (n.fixed) n.x = n.bx + groundX; });
          s.hcSway.vAngle += groundX * 0.0018;
        } else if (s.bldgEvent === 'wind_overturning') {
          const wind = Math.sin(s.simTime * 4) * 28 + 35;
          s.hcSway.vAngle += wind * 0.025 * 0.004;
          s.hcNodes.forEach((n) => { if (n.fixed) n.x = n.bx; });
        } else if (s.bldgEvent === 'settlement') {
          s.hcNodes.forEach((n) => { if (n.fixed) n.y = n.by + (n.bx > 380 ? 16 : 0); });
        } else if (s.bldgEvent === 'buckling_test') {
          axialForce *= 2.8;
          s.hcNodes.forEach((n) => { if (n.fixed) n.x = n.bx; });
        } else {
          s.hcNodes.forEach((n) => { if (n.fixed) { n.x = n.bx; n.y = n.by; } });
        }

        s.hcSway.vAngle += -s.hcSway.angle * 0.055;
        s.hcSway.vAngle *= 0.94;
        s.hcSway.angle += s.hcSway.vAngle;
        s.hcSway.topX = 380 + Math.sin(s.hcSway.angle) * 190;

        const tilt = Math.sin(s.hcSway.angle) * 12;
        s.hcNodes.forEach((n) => {
          if (n.isTop) {
            const rel = (n.bx - 380) / 240;
            n.y = n.by + axialForce * 0.2 + rel * tilt;
            n.x = n.bx + Math.sin(s.hcSway.angle) * 8;
          }
        });

        let maxStress = 0;
        for (let iter = 0; iter < 12; iter++) {
          s.hcBeams.forEach((b) => {
            const n1 = s.hcNodes[b.u], n2 = s.hcNodes[b.v];
            if (!n1 || !n2) return;
            const dx = n2.x - n1.x, dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const strain = Math.abs(dist - b.rest) / b.rest;
            b.stress = Math.min(1.0, strain * 4.8);
            maxStress = Math.max(maxStress, b.stress * 180);

            if (strain > 0.24 && !b.yielded) {
              b.yielded = true;
              b.rest *= 0.90;
            }

            const diff = (dist - b.rest) / dist;
            const corrX = dx * diff * 0.5 * (fK * 0.035);
            const corrY = dy * diff * 0.5 * (fK * 0.035);
            if (!n1.fixed && !n1.isTop) { n1.x += corrX; n1.y += corrY; }
            if (!n2.fixed && !n2.isTop) { n2.x -= corrX; n2.y -= corrY; }
          });
        }

        s.hcNodes.forEach((n) => {
          if (n.fixed || n.isTop) return;
          n.vx += (n.bx - n.x) * 0.05;
          n.vy += (n.by - n.y) * 0.05;
          n.vx *= 0.88; n.vy *= 0.88;
          n.x += n.vx; n.y += n.vy;
        });

        s.hcOsc.shift();
        s.hcOsc.push(maxStress);

        const drift = Math.abs(s.hcSway.angle * (180 / Math.PI)).toFixed(2);
        const sf = Math.max(0.3, 240 / (maxStress * 0.9 + 10)).toFixed(1);
        setKpi1(Math.min(92, 70 + (s.foundWallT / 180) * 12).toFixed(1) + '%');
        setKpi2(maxStress.toFixed(1) + ' MPa');
        setKpi3(drift + '°');
        setKpi4(sf + 'x');
      } else {
        // PANEL / ASTM CORE
        let topForceY = s.panelLoadF * 0.18;
        let lateralX = 0;

        if (s.panelEvent === 'earthquake') {
          const shake = Math.sin(s.simTime * 11) * 26 + Math.sin(s.simTime * 21) * 7;
          s.hcNodes.forEach((n) => { if (n.fixed) n.x = n.bx + shake; });
        } else if (s.panelEvent === 'flutter') {
          lateralX = Math.sin(s.simTime * 19) * 35;
          topForceY += Math.sin(s.simTime * 9.5) * 16;
        } else if (s.panelEvent === 'crash') {
          if (s.hcCrash.active) {
            s.hcCrash.vy += 0.38;
            s.hcCrash.y += s.hcCrash.vy;
            if (s.hcCrash.y >= s.hcTopPlaten.y - 12) {
              s.hcCrash.y = s.hcTopPlaten.y - 12;
              topForceY += s.hcCrash.vy * 50;
              s.hcCrash.vy *= -0.15;
              if (Math.abs(s.hcCrash.vy) < 0.4) s.hcCrash.active = false;
            }
          }
        } else {
          s.hcNodes.forEach((n) => { if (n.fixed) n.x = n.bx; });
        }

        if (!s.isDraggingPlaten) {
          s.hcTopPlaten.vy += (topForceY * 0.08) / 8;
          s.hcTopPlaten.y += s.hcTopPlaten.vy;
          s.hcTopPlaten.vy += (s.hcTopPlaten.by - s.hcTopPlaten.y) * 0.05;
          s.hcTopPlaten.vy *= 0.85;
        }

        s.hcNodes.forEach((n) => {
          if (n.isTop) {
            n.y = s.hcTopPlaten.y;
            n.x += (n.bx + lateralX * 0.25 - n.x) * 0.15;
          }
        });

        let maxStress = 0;
        const k = 70 * 0.12 * (s.panelFoilT / 0.8);

        for (let iter = 0; iter < 12; iter++) {
          s.hcBeams.forEach((b) => {
            const n1 = s.hcNodes[b.u], n2 = s.hcNodes[b.v];
            if (!n1 || !n2) return;
            const dx = n2.x - n1.x, dy = n2.y - n1.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const strain = Math.abs(dist - b.rest) / b.rest;
            b.stress = Math.min(1.0, strain * 4.2);
            maxStress = Math.max(maxStress, b.stress * 290);

            if (strain > 0.22 && !b.yielded) {
              b.yielded = true;
              b.rest *= 0.88;
            }

            const diff = (dist - b.rest) / dist;
            const corrX = dx * diff * 0.5 * (k * 0.04);
            const corrY = dy * diff * 0.5 * (k * 0.04);
            if (!n1.fixed && !n1.isTop) { n1.x += corrX; n1.y += corrY; }
            if (!n2.fixed && !n2.isTop) { n2.x -= corrX; n2.y -= corrY; }
          });
        }

        s.hcNodes.forEach((n) => {
          if (n.fixed || n.isTop) return;
          n.vx += (n.bx - n.x) * 0.04;
          n.vy += (n.by - n.y) * 0.04;
          n.vx *= 0.85; n.vy *= 0.85;
          n.x += n.vx; n.y += n.vy;
        });

        s.hcOsc.shift();
        s.hcOsc.push(maxStress);

        const relDensity = Math.min(0.96, (2 / Math.sqrt(3)) * (s.panelFoilT / s.panelCellL));
        setKpi1(((1 - relDensity) * 100).toFixed(1) + '%');
        setKpi2(maxStress.toFixed(1) + ' MPa');
        setKpi3(((s.hcTopPlaten.y - s.hcTopPlaten.by) * 0.35).toFixed(1) + ' mm');
        setKpi4(Math.max(0.2, (290 * relDensity * 1.15) / (maxStress * 0.06 + 0.1)).toFixed(1) + 'x');
      }

      // Drawing
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#061224';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = '#0f2442';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      if (s.model === 'building') {
        const tLeftX = 260 + (s.hcSway.topX - 380) * 0.45;
        const tRightX = 500 + (s.hcSway.topX - 380) * 0.45;
        const tRoofY = 52, raftY = 248;

        ctx.save();
        const bGrad = ctx.createLinearGradient(tLeftX, tRoofY, tRightX, raftY);
        bGrad.addColorStop(0, '#0c2242');
        bGrad.addColorStop(1, '#08182e');
        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(tLeftX, tRoofY);
        ctx.lineTo(tRightX, tRoofY);
        ctx.lineTo(500, raftY);
        ctx.lineTo(260, raftY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#93c5fd';
        ctx.globalAlpha = 0.65;
        for (let fr = 0; fr < 9; fr++) {
          const rowY = tRoofY + 16 + fr * 18;
          const prog = fr / 9;
          const cLeft = tLeftX * (1 - prog) + 260 * prog + 14;
          const cRight = tRightX * (1 - prog) + 500 * prog - 14;
          const cStep = (cRight - cLeft) / 6;
          for (let wc = 0; wc < 6; wc++) {
            ctx.fillRect(cLeft + wc * cStep + 3, rowY, cStep - 6, 8);
          }
        }
        ctx.globalAlpha = 1.0;

        // Antenna
        ctx.beginPath();
        ctx.moveTo((tLeftX + tRightX) / 2, tRoofY);
        ctx.lineTo((tLeftX + tRightX) / 2, 22);
        ctx.strokeStyle = '#bfdbfe';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc((tLeftX + tRightX) / 2, 20, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${s.bldgFloors}-STORY SKYSCRAPER [${(s.bldgFloors * 920).toLocaleString()} TONS]`, (tLeftX + tRightX) / 2 - 95, tRoofY + 14);
        ctx.restore();

        // Raft transfer slab
        ctx.fillStyle = '#1e3a5f';
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(135, raftY - 14, w - 270, 14, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#bfdbfe';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('HEAVY RAFT TRANSFER SLAB', 155, raftY - 4);

        // Bedrock
        ctx.fillStyle = '#081628';
        ctx.strokeStyle = '#1e3a5f';
        ctx.fillRect(135, 380, w - 270, 36);
        ctx.strokeRect(135, 380, w - 270, 36);
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('BEDROCK GEOLOGICAL ANCHOR (SEISMIC BASE BED)', 155, 402);
      } else {
        // PANEL MODE
        const pLeft = 55, pRight = w - 55;
        ctx.fillStyle = '#1e3a5f';
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.fillRect(pLeft, s.hcTopPlaten.y - 20, pRight - pLeft, 20);
        ctx.strokeRect(pLeft, s.hcTopPlaten.y - 20, pRight - pLeft, 20);

        ctx.fillStyle = '#102a4c';
        ctx.fillRect(pLeft - 18, 50, 16, h - 100);
        ctx.fillRect(pRight + 2, 50, 16, h - 100);

        ctx.fillStyle = '#bfdbfe';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('CFRP COMPRESSION PLATEN [ASTM C365]', pLeft + 16, s.hcTopPlaten.y - 7);

        // Compression force arrows
        ctx.strokeStyle = '#facc15';
        ctx.fillStyle = '#facc15';
        ctx.lineWidth = 2.5;
        [180, 300, 420, 540].forEach((ax) => {
          ctx.beginPath();
          ctx.moveTo(ax, s.hcTopPlaten.y - 20 - 18);
          ctx.lineTo(ax, s.hcTopPlaten.y - 22);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(ax - 4, s.hcTopPlaten.y - 26);
          ctx.lineTo(ax, s.hcTopPlaten.y - 22);
          ctx.lineTo(ax + 4, s.hcTopPlaten.y - 26);
          ctx.fill();
        });

        // Fixed bed
        ctx.fillStyle = '#0e2440';
        ctx.strokeStyle = '#1e3a5f';
        ctx.fillRect(pLeft, 368, pRight - pLeft, 26);
        ctx.strokeRect(pLeft, 368, pRight - pLeft, 26);
        ctx.fillStyle = '#93c5fd';
        ctx.fillText('FIXED RIGID FOUNDATION BED', pLeft + 16, 384);

        // Ram
        if (s.hcCrash.active || s.panelEvent === 'crash') {
          ctx.fillStyle = '#f97316';
          ctx.fillRect(w / 2 - 45, s.hcCrash.y - 30, 90, 30);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText('RAM: 2.5T', w / 2 - 25, s.hcCrash.y - 11);
        }
      }

      // Draw Cells
      s.hcCells.forEach((c) => {
        if (c.indices.length >= 3) {
          ctx.beginPath();
          c.indices.forEach((idx: number, i: number) => {
            const n = s.hcNodes[idx];
            if (!n) return;
            if (i === 0) ctx.moveTo(n.x, n.y); else ctx.lineTo(n.x, n.y);
          });
          ctx.closePath();
          ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
          ctx.fill();
        }
      });

      // Draw Beams
      s.hcBeams.forEach((b) => {
        const n1 = s.hcNodes[b.u], n2 = s.hcNodes[b.v];
        if (!n1 || !n2) return;
        const st = b.stress;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = st > 0.8 ? '#ef4444' : st > 0.5 ? '#f97316' : '#facc15';
        ctx.lineWidth = s.model === 'building' ? Math.max(2.0, (s.foundWallT / 180) * 2.8) : Math.max(1.8, s.panelFoilT * 2.6);
        ctx.stroke();
      });

      // Draw Nodes
      s.hcNodes.forEach((n) => {
        if (n.isTop || n.fixed) return;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.fill();
      });

      // Oscillogram
      const ox = 20, oy = h - 115, ow = 200, oh = 65;
      ctx.fillStyle = 'rgba(8, 22, 40, 0.92)';
      ctx.fillRect(ox, oy, ow, oh);
      ctx.strokeStyle = '#1e3a5f';
      ctx.strokeRect(ox, oy, ow, oh);
      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(s.model === 'building' ? 'BASE SHEAR STRESS (MPa)' : 'PLATEN STRESS (MPa)', ox + 8, oy + 14);

      ctx.beginPath();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      for (let i = 0; i < s.hcOsc.length; i++) {
        const px = ox + 6 + (i / s.hcOsc.length) * (ow - 12);
        const py = oy + oh - 6 - Math.min(oh - 24, (s.hcOsc[i] / 240) * (oh - 24));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleMouseDown = (e: MouseEvent) => {
      if (stateRef.current.model !== 'panel') return;
      const rect = canvas.getBoundingClientRect();
      const y = e.clientY - rect.top;
      if (Math.abs(y - stateRef.current.hcTopPlaten.y) < 25) {
        stateRef.current.isDraggingPlaten = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.isDraggingPlaten) return;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.hcTopPlaten.y = Math.max(76, Math.min(170, e.clientY - rect.top));
    };

    const handleMouseUp = () => {
      stateRef.current.isDraggingPlaten = false;
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
    <section id="honeycomb" className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-6 w-2 rounded-full bg-yellow-400 block"></span>
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Module I: Honeycomb Structural Engineering Lab
        </h2>
      </div>

      <div className="bg-[#0b1d36] border border-[#1e3a5f] rounded-2xl p-6 shadow-2xl">
        {/* Model Selector Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-[#1c3e6b] gap-4">
          <div>
            <div className="inline-flex px-2.5 py-0.5 bg-yellow-400/10 text-yellow-300 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-400/30">
              Biomimetic Cellular Mechanics
            </div>
            <p className="text-[#93c5fd] text-xs mt-1">
              Select between the <strong>Honeycomb Skyscraper Foundation</strong> and the <strong>ASTM Aerospace Sandwich Core</strong>.
            </p>
          </div>

          {/* Model Switcher Buttons */}
          <div className="flex bg-[#08182e] p-1.5 rounded-xl border border-[#1e3a5f] text-xs font-bold gap-1">
            <button
              onClick={() => setModel('building')}
              className={`px-4 py-2 rounded-lg transition font-black ${
                model === 'building'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'text-[#93c5fd] hover:text-white'
              }`}
            >
              🏢 Honeycomb Building Base
            </button>
            <button
              onClick={() => setModel('panel')}
              className={`px-4 py-2 rounded-lg transition font-black ${
                model === 'panel'
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/20'
                  : 'text-[#93c5fd] hover:text-white'
              }`}
            >
              ⬡ Aerospace Sandwich Core
            </button>
          </div>
        </div>

        {/* Dynamic Stress & Buckling Event Buttons */}
        <div className="py-4 border-b border-[#1c3e6b] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#bfdbfe]">
            {model === 'building'
              ? 'Civil Foundation Stress & Buckling Modes:'
              : 'ASTM Panel Dynamic Tests:'}
          </span>

          <div className="flex flex-wrap gap-2 text-xs">
            {model === 'building' ? (
              <>
                <button
                  onClick={() => setBldgEvent('gravity')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    bldgEvent === 'gravity'
                      ? 'bg-[#1e3a5f] text-white border-[#3b82f6]'
                      : 'bg-[#08182e] text-[#93c5fd] border-[#1e3a5f]'
                  }`}
                >
                  100% Dead Load
                </button>
                <button
                  onClick={() => setBldgEvent('seismic_shear')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1 ${
                    bldgEvent === 'seismic_shear'
                      ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-400'
                      : 'bg-[#08182e] text-rose-300 border-rose-500/30'
                  }`}
                >
                  🌋 Richter 7.5 Shear Strain
                </button>
                <button
                  onClick={() => setBldgEvent('wind_overturning')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1 ${
                    bldgEvent === 'wind_overturning'
                      ? 'bg-sky-400 text-slate-950 font-black'
                      : 'bg-[#08182e] text-sky-300 border-sky-400/30'
                  }`}
                >
                  🌪️ Wind Overturning Moment
                </button>
                <button
                  onClick={() => setBldgEvent('buckling_test')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition flex items-center gap-1 ${
                    bldgEvent === 'buckling_test'
                      ? 'bg-yellow-400 text-slate-950 font-black'
                      : 'bg-[#08182e] text-yellow-300 border-yellow-400/30'
                  }`}
                >
                  ⚠️ Plastic Buckling Test
                </button>
                <button
                  onClick={() => setBldgEvent('settlement')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    bldgEvent === 'settlement'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-[#08182e] text-[#bfdbfe] border-[#1e3a5f]'
                  }`}
                >
                  Corner Subsidence
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setPanelEvent('idle')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    panelEvent === 'idle'
                      ? 'bg-[#1e3a5f] text-white border-[#3b82f6]'
                      : 'bg-[#08182e] text-[#93c5fd] border-[#1e3a5f]'
                  }`}
                >
                  Static Platen Test
                </button>
                <button
                  onClick={() => setPanelEvent('earthquake')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    panelEvent === 'earthquake'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#08182e] text-rose-300 border-rose-500/30'
                  }`}
                >
                  🌋 Base Shear Wave
                </button>
                <button
                  onClick={triggerCrash}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    panelEvent === 'crash'
                      ? 'bg-yellow-400 text-slate-950 font-black'
                      : 'bg-[#08182e] text-yellow-300 border-yellow-400/30'
                  }`}
                >
                  💥 2.5T Crash Buckling
                </button>
                <button
                  onClick={() => setPanelEvent('flutter')}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                    panelEvent === 'flutter'
                      ? 'bg-sky-400 text-slate-950 font-black'
                      : 'bg-[#08182e] text-sky-300 border-sky-400/30'
                  }`}
                >
                  💨 Transonic Flutter
                </button>
              </>
            )}
          </div>
        </div>

        {/* Canvas & Controls Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#1e3a5f] shadow-2xl bg-[#061224] select-none">
              <canvas
                ref={canvasRef}
                width={760}
                height={440}
                className="w-full h-auto block"
              />
              <div className="absolute top-3 right-3 bg-[#0a1c33]/90 border border-[#1e3a5f] rounded-lg px-3 py-1.5 text-[11px] text-[#bfdbfe] font-mono">
                {model === 'building' ? (
                  <>🏗️ Base: <span className="text-yellow-300 font-bold">Biomimetic Honeycomb Foundation</span></>
                ) : (
                  <>💡 Specimen: <span className="text-yellow-300 font-bold">ASTM C365 Flatwise Core</span></>
                )}
              </div>
            </div>

            {/* Telemetry Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mt-4 text-center">
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">
                  {model === 'building' ? 'SEISMIC DAMPING' : 'WEIGHT SAVED'}
                </span>
                <span className="text-xl font-black text-emerald-400">{kpi1}</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">BASE STRESS</span>
                <span className="text-xl font-black text-yellow-300">{kpi2}</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">
                  {model === 'building' ? 'BUILDING DRIFT' : 'AXIAL STRAIN'}
                </span>
                <span className="text-xl font-black text-sky-300">{kpi3}</span>
              </div>
              <div className="bg-[#08182e] border border-[#1c3e6b] p-3 rounded-xl">
                <span className="text-xs text-[#93c5fd] block font-mono">SAFETY FACTOR</span>
                <span className="text-xl font-black text-emerald-400">{kpi4}</span>
              </div>
            </div>
          </div>

          {/* Parameter Sliders Column */}
          <div className="lg:col-span-4 flex flex-col gap-4 bg-[#08182e]/80 p-5 rounded-2xl border border-[#1c3e6b]">
            {model === 'building' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Superstructure Height</span>
                    <span className="font-mono text-yellow-300 font-bold">
                      {bldgFloors} Floors ({(bldgFloors * 920).toLocaleString()} t)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    step="5"
                    value={bldgFloors}
                    onChange={(e) => setBldgFloors(parseInt(e.target.value))}
                    className="w-full accent-yellow-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Foundation Cell Wall (t)</span>
                    <span className="font-mono text-yellow-300 font-bold">
                      {foundWallT} mm UHPFRC
                    </span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="350"
                    step="10"
                    value={foundWallT}
                    onChange={(e) => setFoundWallT(parseInt(e.target.value))}
                    className="w-full accent-yellow-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Seismic Ground Acceleration (PGA)</span>
                    <span className="font-mono text-rose-300 font-bold">
                      {seismicPGA.toFixed(2)} g
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.2"
                    step="0.05"
                    value={seismicPGA}
                    onChange={(e) => setSeismicPGA(parseFloat(e.target.value))}
                    className="w-full accent-rose-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div className="bg-[#0b2447]/90 border border-[#1e3a5f] p-3.5 rounded-xl text-xs leading-relaxed text-[#bfdbfe] mt-2">
                  <span className="font-bold text-yellow-300 block mb-1">Civil Foundation Biomimicry:</span>
                  Instead of a rigid concrete slab that fractures under violent shear, the <strong>yellow hexagonal honeycomb foundation</strong> deforms in controlled shear, absorbing over <strong>75% of earthquake energy</strong> before it transmits upward into the skyscraper.
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-[#bfdbfe] uppercase tracking-wider block mb-2">
                    Cell Lattice Geometry
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['hexagonal', 'square', 'triangular'] as const).map((geom) => (
                      <button
                        key={geom}
                        onClick={() => setPanelGeom(geom)}
                        className={`py-2 px-1 text-xs font-black rounded-lg border text-center capitalize ${
                          panelGeom === geom
                            ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                            : 'bg-[#061224] text-[#93c5fd] border-[#1e3a5f]'
                        }`}
                      >
                        {geom}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Foil Wall Thickness (t)</span>
                    <span className="font-mono text-yellow-300 font-bold">
                      {panelFoilT} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.5"
                    step="0.1"
                    value={panelFoilT}
                    onChange={(e) => setPanelFoilT(parseFloat(e.target.value))}
                    className="w-full accent-yellow-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Cell Diameter (l)</span>
                    <span className="font-mono text-yellow-300 font-bold">
                      {panelCellL} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="28"
                    step="1"
                    value={panelCellL}
                    onChange={(e) => setPanelCellL(parseInt(e.target.value))}
                    className="w-full accent-yellow-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#bfdbfe]">Static Compression (F)</span>
                    <span className="font-mono text-rose-300 font-bold">
                      {panelLoadF} kN
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="160"
                    step="5"
                    value={panelLoadF}
                    onChange={(e) => setPanelLoadF(parseInt(e.target.value))}
                    className="w-full accent-rose-400 bg-[#061224] h-1.5 rounded cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
