'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimeOfDay } from './DeskScene';

/* ============================================================
   WindowCity — the 2D CityBackground aesthetic, painted onto a
   canvas texture and hung inside the room's window opening.

   The camera is clamped (±45° azimuth, locked polar, no pan), so
   a flat backlit panel behind the wall reads as a real skyline.
   Uses meshBasicMaterial so it's self-lit (ignores room lights)
   and the scene <Bloom> makes the sky / sun / neon glow.
   ============================================================ */

const CANVAS_W = 1400;
const CANVAS_H = 800;
const HORIZON = 0.72; // skyline base, as a fraction of canvas height

interface CityCfg {
  sky: [number, string][];
  sunY: number;        // sun center, fraction of H
  sunRFrac: number;    // sun radius, fraction of H
  sunCore: string; sunMid: string; sunEdge: string; sunEdgeRGB: string;
  glowRGB: string;     // "r,g,b" for the sun halo
  horizon: string;     // rgba for the horizon glow band
  far: [string, string]; mid: [string, string]; near: [string, string];
  win: string; winAlt: string; winOpacity: number; winDensity: number; cyanChance: number;
  rays: boolean; clouds: boolean; neon: boolean;
}

const CITY: Record<TimeOfDay, CityCfg> = {
  morning: {
    sky: [
      [0, '#1a3a6e'], [0.08, '#2e5fa0'], [0.18, '#4a8ac8'], [0.28, '#7ab8e0'],
      [0.38, '#a8d4f0'], [0.50, '#f0c060'], [0.60, '#f5a030'], [0.68, '#e87840'],
      [0.78, '#c05060'], [0.90, '#3d1060'], [1, '#1a0830'],
    ],
    sunY: 0.50, sunRFrac: 0.075,
    sunCore: '#fff8e0', sunMid: '#ffe8a0', sunEdge: '#ffcc60', sunEdgeRGB: '255,204,96',
    glowRGB: '255,190,90',
    horizon: 'rgba(255,150,70,0.35)',
    far: ['#4a6a9a', '#2a4a7a'], mid: ['#3a5080', '#1e3060'], near: ['#2a3060', '#101828'],
    win: '#FFB347', winAlt: '#FFD080', winOpacity: 0.55, winDensity: 0.35, cyanChance: 0,
    rays: true, clouds: false, neon: false,
  },
  afternoon: {
    sky: [
      [0, '#1a2a5e'], [0.08, '#2a4a8a'], [0.18, '#3a6aaa'], [0.30, '#5090c8'],
      [0.42, '#70b0e0'], [0.52, '#90c8f0'], [0.62, '#b8daf8'], [0.72, '#d0e8f8'],
      [0.80, '#e8f4fc'], [0.88, '#c8d8f0'], [1, '#8090b8'],
    ],
    sunY: 0.24, sunRFrac: 0.06,
    sunCore: '#ffffff', sunMid: '#fff8e0', sunEdge: '#ffe8b0', sunEdgeRGB: '255,232,176',
    glowRGB: '255,240,200',
    horizon: 'rgba(255,200,120,0.20)',
    far: ['#3a5a8a', '#1a3a6a'], mid: ['#2a4070', '#102050'], near: ['#1a2a50', '#0a1030'],
    win: 'rgba(210,228,255,1)', winAlt: 'rgba(232,242,255,1)', winOpacity: 0.28, winDensity: 0.22, cyanChance: 0,
    rays: false, clouds: true, neon: false,
  },
  night: {
    sky: [
      [0, '#1a0830'], [0.10, '#2e0d5c'], [0.22, '#5c1a7a'], [0.35, '#9b3a7a'],
      [0.46, '#d4607a'], [0.55, '#e8855a'], [0.62, '#f0a060'], [0.68, '#e88050'],
      [0.76, '#c05070'], [0.88, '#3d1060'], [1, '#1a0830'],
    ],
    sunY: 0.44, sunRFrac: 0.085,
    sunCore: '#fff5d0', sunMid: '#ffe090', sunEdge: '#ffb347', sunEdgeRGB: '255,179,71',
    glowRGB: '255,170,90',
    horizon: 'rgba(255,120,80,0.30)',
    far: ['#3d1a6e', '#1a0a2e'], mid: ['#4a2080', '#2d1060'], near: ['#2a1050', '#0f0620'],
    win: '#FFB347', winAlt: '#00F5FF', winOpacity: 0.6, winDensity: 0.5, cyanChance: 0.25,
    rays: false, clouds: false, neon: true,
  },
};

/* ---------- deterministic skyline (same city, relit per TOD) ---------- */

function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Building { x: number; w: number; top: number; seed: number }

function genLayer(seed: number, o: { wMin: number; wMax: number; topMin: number; topMax: number }): Building[] {
  const r = mulberry32(seed);
  const a: Building[] = [];
  let x = -0.03;
  while (x < 1.03) {
    const w = o.wMin + r() * (o.wMax - o.wMin);
    const top = o.topMin + r() * (o.topMax - o.topMin);
    a.push({ x, w, top, seed: Math.floor(r() * 1e6) });
    x += w * (0.82 + r() * 0.55);
  }
  return a;
}

const SKYLINE = {
  far: genLayer(1337, { wMin: 0.018, wMax: 0.05, topMin: 0.50, topMax: 0.70 }),
  mid: genLayer(4242, { wMin: 0.035, wMax: 0.075, topMin: 0.44, topMax: 0.66 }),
  near: genLayer(9001, { wMin: 0.05, wMax: 0.11, topMin: 0.60, topMax: 0.74 }),
};

/* ---------- painters ---------- */

interface WinCfg { win: string; winAlt: string; winOpacity: number; density: number; cyanChance: number }

function paintWindows(ctx: CanvasRenderingContext2D, x: number, w: number, top: number, H: number, seed: number, cfg: WinCfg) {
  const r = mulberry32(seed);
  const gap = Math.max(8, w * 0.18);
  const size = Math.max(2.5, gap * 0.4);
  for (let wy = top + gap; wy < H - gap; wy += gap) {
    for (let wx = x + gap * 0.6; wx < x + w - gap * 0.4; wx += gap) {
      if (r() < cfg.density) {
        const cyan = cfg.cyanChance > 0 && r() < cfg.cyanChance;
        ctx.fillStyle = cyan ? cfg.winAlt : cfg.win;
        ctx.globalAlpha = cfg.winOpacity * (0.6 + r() * 0.4);
        ctx.fillRect(wx, wy, size, size);
      }
    }
  }
  ctx.globalAlpha = 1;
}

function paintLayer(
  ctx: CanvasRenderingContext2D, W: number, H: number,
  layer: Building[], c0: string, c1: string, opacity: number, winCfg: WinCfg | null,
) {
  const g = ctx.createLinearGradient(0, 0.38 * H, 0, H);
  g.addColorStop(0, c0);
  g.addColorStop(1, c1);
  layer.forEach((b) => {
    const x = b.x * W, w = b.w * W, top = b.top * H;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = g;
    ctx.fillRect(x, top, w, H - top);
    ctx.globalAlpha = 1;
    if (winCfg) paintWindows(ctx, x, w, top, H, b.seed, winCfg);
  });
}

function paintClouds(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const clouds: [number, number, number][] = [
    [0.18, 0.16, 150], [0.42, 0.11, 190], [0.68, 0.15, 160], [0.85, 0.21, 120],
  ];
  clouds.forEach(([cx, cy, cw]) => {
    const x = cx * W, y = cy * H;
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    const blobs: [number, number, number, number][] = [
      [0, 0, cw * 0.5, cw * 0.2],
      [-cw * 0.22, -cw * 0.06, cw * 0.28, cw * 0.2],
      [cw * 0.16, -cw * 0.08, cw * 0.26, cw * 0.18],
      [-cw * 0.05, -cw * 0.14, cw * 0.2, cw * 0.15],
    ];
    blobs.forEach(([dx, dy, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x + dx, y + dy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  });
}

function neonText(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string) {
  ctx.save();
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  [...text].forEach((ch, i) => ctx.fillText(ch, x, y + i * 30));
  ctx.restore();
}

function neonBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.globalAlpha = 0.9;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 4) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function paintCity(ctx: CanvasRenderingContext2D, W: number, H: number, tod: TimeOfDay) {
  const cfg = CITY[tod];
  ctx.clearRect(0, 0, W, H);

  // --- sky ---
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  cfg.sky.forEach(([p, c]) => sky.addColorStop(p, c));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const sx = W * 0.5;
  const sy = cfg.sunY * H;
  const R = cfg.sunRFrac * H;

  // --- sun halo ---
  const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 4.2);
  halo.addColorStop(0, `rgba(${cfg.glowRGB},0.55)`);
  halo.addColorStop(0.35, `rgba(${cfg.glowRGB},0.24)`);
  halo.addColorStop(0.7, `rgba(${cfg.glowRGB},0.07)`);
  halo.addColorStop(1, `rgba(${cfg.glowRGB},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // --- morning rays (behind the disc) ---
  if (cfg.rays) {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.strokeStyle = `rgba(${cfg.glowRGB},0.12)`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      ctx.rotate(Math.PI / 6);
      ctx.beginPath();
      ctx.moveTo(0, R * 1.25);
      ctx.lineTo(0, R * 3.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- sun disc ---
  const disc = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 1.1);
  disc.addColorStop(0, cfg.sunCore);
  disc.addColorStop(0.5, cfg.sunMid);
  disc.addColorStop(0.85, cfg.sunEdge);
  disc.addColorStop(1, `rgba(${cfg.sunEdgeRGB},0)`);
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(sx, sy, R * 1.1, 0, Math.PI * 2);
  ctx.fill();

  // --- horizon glow band ---
  const hy = HORIZON * H;
  const hb = ctx.createLinearGradient(0, hy - 0.14 * H, 0, hy + 0.16 * H);
  hb.addColorStop(0, cfg.horizon.replace(/[\d.]+\)$/, '0)'));
  hb.addColorStop(0.5, cfg.horizon);
  hb.addColorStop(1, cfg.horizon.replace(/[\d.]+\)$/, '0)'));
  ctx.fillStyle = hb;
  ctx.fillRect(0, hy - 0.14 * H, W, 0.30 * H);

  // --- afternoon clouds ---
  if (cfg.clouds) paintClouds(ctx, W, H);

  // --- skyline (far -> mid -> near) ---
  const midWin: WinCfg = { win: cfg.win, winAlt: cfg.winAlt, winOpacity: cfg.winOpacity, density: cfg.winDensity, cyanChance: cfg.cyanChance };
  const nearWin: WinCfg = { ...midWin, density: Math.min(0.7, cfg.winDensity + 0.1) };
  paintLayer(ctx, W, H, SKYLINE.far, cfg.far[0], cfg.far[1], 0.75, null);
  paintLayer(ctx, W, H, SKYLINE.mid, cfg.mid[0], cfg.mid[1], 1, midWin);
  paintLayer(ctx, W, H, SKYLINE.near, cfg.near[0], cfg.near[1], 1, nearWin);

  // --- atmospheric haze softening the skyline base into the sky ---
  const haze = ctx.createLinearGradient(0, hy - 0.05 * H, 0, hy + 0.10 * H);
  haze.addColorStop(0, `rgba(${cfg.glowRGB},0.10)`);
  haze.addColorStop(1, `rgba(${cfg.glowRGB},0)`);
  ctx.fillStyle = haze;
  ctx.fillRect(0, hy - 0.05 * H, W, 0.15 * H);

  // --- night neon signage + antenna beacons ---
  if (cfg.neon) {
    neonText(ctx, W * 0.15, H * 0.52, 'ネオ東京', '#FF2D78');
    neonText(ctx, W * 0.30, H * 0.58, 'ARCADE', '#00F5FF');
    neonText(ctx, W * 0.71, H * 0.54, 'デジタル', '#FFB347');
    neonText(ctx, W * 0.86, H * 0.60, 'MATRIX', '#b060ff');
    neonBar(ctx, W * 0.245, H * 0.58, 14, 66, '#FF2D78');
    neonBar(ctx, W * 0.62, H * 0.56, 14, 60, '#00F5FF');
    dot(ctx, W * 0.40, H * 0.45, '#FF2D78', 4);
    dot(ctx, W * 0.55, H * 0.47, '#00F5FF', 3.5);
    dot(ctx, W * 0.78, H * 0.46, '#FF2D78', 4);
  }
}

/* ---------- component ---------- */

interface WindowCityProps {
  timeOfDay: TimeOfDay;
  /** fade duration in seconds when switching time of day */
  fadeDuration?: number;
}

export default function WindowCity({ timeOfDay, fadeDuration = 0.9 }: WindowCityProps) {
  // two stacked planes we cross-fade between on TOD change
  const gfx = useMemo(() => {
    const mk = () => {
      const c = document.createElement('canvas');
      c.width = CANVAS_W;
      c.height = CANVAS_H;
      return c;
    };
    const canvases = [mk(), mk()];
    const textures = canvases.map((c) => {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    });
    return { canvases, textures };
  }, []);

  const matA = useRef<THREE.MeshBasicMaterial>(null);
  const matB = useRef<THREE.MeshBasicMaterial>(null);
  const mats = [matA, matB];

  const active = useRef(0);
  const fade = useRef(1);
  const first = useRef(true);

  // initial paint
  useEffect(() => {
    paintCity(gfx.canvases[0].getContext('2d')!, CANVAS_W, CANVAS_H, timeOfDay);
    gfx.textures[0].needsUpdate = true;
    if (matA.current) matA.current.opacity = 1;
    if (matB.current) matB.current.opacity = 0;
    return () => gfx.textures.forEach((t) => t.dispose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // repaint incoming layer + kick off cross-fade on TOD change
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const incoming = 1 - active.current;
    paintCity(gfx.canvases[incoming].getContext('2d')!, CANVAS_W, CANVAS_H, timeOfDay);
    gfx.textures[incoming].needsUpdate = true;
    active.current = incoming;
    fade.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOfDay]);

  useFrame((_, dt) => {
    if (fade.current < 1) {
      fade.current = Math.min(1, fade.current + dt / fadeDuration);
    }
    const a = active.current;
    const inMat = mats[a].current;
    const outMat = mats[1 - a].current;
    if (inMat) inMat.opacity = fade.current;
    if (outMat) outMat.opacity = 1 - fade.current;
  });

  // Oversized plane parked behind the wall (window opening is x[-3.5,3.5] y[2,6]).
  // The wall crops it perfectly at every allowed camera angle.
  return (
    <group position={[0, 4, -6.2]}>
      <mesh position={[0, 0, 0]} renderOrder={-2}>
        <planeGeometry args={[8.4, 5.0]} />
        <meshBasicMaterial
          ref={matA}
          map={gfx.textures[0]}
          transparent
          opacity={1}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.004]} renderOrder={-1}>
        <planeGeometry args={[8.4, 5.0]} />
        <meshBasicMaterial
          ref={matB}
          map={gfx.textures[1]}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}