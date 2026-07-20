'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { TimeOfDay } from '../DeskScene';

/* ---------- poster frame (drop a PNG into public/ and set src) ---------- */

export function PosterFrame({ position, rotation = [0, 0, 0], src, accent, w = 1.2, h = 1.6 }: { position: [number, number, number]; rotation?: [number, number, number]; src?: string; accent: string; w?: number; h?: number }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!src) return;
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (t) => { if (alive) { t.colorSpace = THREE.SRGBColorSpace; setTex(t); } },
      undefined,
      () => { /* file missing -> keep placeholder */ },
    );
    return () => { alive = false; };
  }, [src]);

  const W = w, H = h, border = 0.08, depth = 0.06;
  return (
    <group position={position} rotation={rotation as any}>
      {/* frame border */}
      <RoundedBox args={[W + border * 2, H + border * 2, depth]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial color="#2a2018" metalness={0.25} roughness={0.55} />
      </RoundedBox>
      {/* image / placeholder */}
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[W, H]} />
        {tex
          ? <meshBasicMaterial map={tex} toneMapped={false} />
          : <meshStandardMaterial color="#0e0b16" emissive={accent} emissiveIntensity={0.14} roughness={0.5} />}
      </mesh>
      {!tex && (
        <mesh position={[0, 0, depth / 2 + 0.004]}>
          <planeGeometry args={[W * 0.86, H * 0.86]} />
          <meshBasicMaterial color={accent} transparent opacity={0.08} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- lava lamp (blobs animate + glow only at night) ---------- */

export function LavaLamp({
  position, timeOfDay, color = '#ff2d78', glowColor = '#ff6aa8', blobColor, scale = 1,
}: {
  position: [number, number, number]; timeOfDay: TimeOfDay; color?: string; glowColor?: string; blobColor?: string; scale?: number;
}) {
  const night = timeOfDay === 'night';
  const blob = blobColor ?? color;
  const lightRef = useRef<THREE.PointLight>(null);
  const liquidRef = useRef<THREE.MeshStandardMaterial>(null);
  const rimRef = useRef<THREE.MeshStandardMaterial>(null);
  const blobRefs = useRef<(THREE.Mesh | null)[]>([]);

  // each blob rides its own sine wave (offset lo/hi range, speed, phase)
  const blobs = useMemo(() => ([
    { x:  0.00, r: 0.095, lo: 0.36, hi: 1.10, speed: 0.34, phase: 0.0 },
    { x:  0.04, r: 0.065, lo: 0.40, hi: 1.02, speed: 0.52, phase: 1.7 },
    { x: -0.05, r: 0.075, lo: 0.34, hi: 0.98, speed: 0.28, phase: 3.2 },
    { x:  0.02, r: 0.055, lo: 0.44, hi: 1.14, speed: 0.63, phase: 4.6 },
    { x: -0.03, r: 0.050, lo: 0.38, hi: 1.06, speed: 0.71, phase: 5.7 },
  ]), []);

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    const t = state.clock.elapsedTime;
    if (lightRef.current) lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, night ? 1.7 : 0, k);
    if (liquidRef.current) liquidRef.current.emissiveIntensity = THREE.MathUtils.lerp(liquidRef.current.emissiveIntensity, night ? 0.9 : 0.04, k);
    if (rimRef.current) rimRef.current.emissiveIntensity = THREE.MathUtils.lerp(rimRef.current.emissiveIntensity, night ? 1.2 : 0.08, k);
    // only bubble at night — frozen during the day
    if (night) {
      for (let i = 0; i < blobs.length; i++) {
        const m = blobRefs.current[i];
        if (!m) continue;
        const b = blobs[i];
        const s = (Math.sin(t * b.speed + b.phase) + 1) / 2;
        m.position.y = b.lo + s * (b.hi - b.lo);
        m.scale.setScalar(1 + Math.sin(t * b.speed * 1.4 + b.phase) * 0.2);
      }
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* metal base (cone) */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 0.22, 32]} />
        <meshStandardMaterial color="#1c1e28" metalness={0.85} roughness={0.32} />
      </mesh>
      {/* glowing rim where the base meets the glass */}
      <mesh position={[0, 0.225, 0]}>
        <cylinderGeometry args={[0.155, 0.155, 0.03, 32]} />
        <meshStandardMaterial ref={rimRef} color={glowColor} emissive={glowColor} emissiveIntensity={0.08} toneMapped={false} />
      </mesh>

      {/* tinted liquid column (emissive at night) */}
      <mesh position={[0, 0.77, 0]}>
        <cylinderGeometry args={[0.115, 0.175, 1.10, 32]} />
        <meshStandardMaterial ref={liquidRef} color={color} emissive={glowColor} emissiveIntensity={0.04}
          transparent opacity={0.5} roughness={0.25} depthWrite={false} />
      </mesh>

      {/* the lava blobs */}
      {blobs.map((b, i) => (
        <mesh key={i} ref={(el) => { blobRefs.current[i] = el; }} position={[b.x, (b.lo + b.hi) / 2, 0]}>
          <sphereGeometry args={[b.r, 20, 16]} />
          <meshStandardMaterial color={blob} emissive={glowColor} emissiveIntensity={night ? 1.4 : 0.06} roughness={0.2} toneMapped={false} />
        </mesh>
      ))}

      {/* glass shell */}
      <mesh position={[0, 0.77, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.125, 0.185, 1.10, 32, 1, true]} />
        <meshStandardMaterial color="#e6eeff" metalness={0.1} roughness={0.05}
          transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* metal cap */}
      <mesh position={[0, 1.40, 0]} castShadow>
        <cylinderGeometry args={[0.10, 0.13, 0.14, 32]} />
        <meshStandardMaterial color="#1c1e28" metalness={0.85} roughness={0.32} />
      </mesh>

      {/* inner glow — night only */}
      <pointLight ref={lightRef} position={[0, 0.8, 0]} intensity={night ? 1.7 : 0} distance={4.5} decay={2} color={glowColor} />
    </group>
  );
}

/* ---------- procedural "idea board" canvas (neon doodles on a dark board) ---------- */

function makeIdeaBoardCanvas() {
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 720;
  const ctx = c.getContext('2d')!;
  const W = c.width, H = c.height;

  // palette + fonts
  const CY = '#00F5FF', MG = '#FF2D78', AM = '#FFB347', P = '#b060ff', INK = '#9fb4c4';
  const cur  = "'Segoe Script','Comic Sans MS',cursive";
  const mk   = "'Comic Sans MS','Segoe Script',cursive";
  const mono = "'JetBrains Mono','Courier New',monospace";

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);        ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // board background + subtle vignette
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#17131f'); bg.addColorStop(1, '#100c18');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // faint dot grid
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let y = 30; y < H; y += 40) for (let x = 30; x < W; x += 40) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill(); }

  // inner border
  ctx.strokeStyle = 'rgba(0,245,255,0.18)'; ctx.lineWidth = 3;
  roundRect(22, 22, W - 44, H - 44, 16); ctx.stroke();

  // ---- helpers ----
  function glowText(t: string, x: number, y: number, color: string, size: number, font: string, rot = 0) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(rot);
    ctx.font = `${size}px ${font}`;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.shadowColor = color; ctx.shadowBlur = size * 0.55;
    ctx.fillStyle = color; ctx.fillText(t, 0, 0);
    ctx.restore();
  }
  function pen(color: string, wdt = 2.5, blur = 8) {
    ctx.strokeStyle = color; ctx.lineWidth = wdt; ctx.lineCap = 'round';
    ctx.shadowColor = color; ctx.shadowBlur = blur;
  }
  function arrow(x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.save(); pen(color, 2.2, 7);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 24;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2); ctx.stroke();
    const ang = Math.atan2(y2 - my, x2 - mx);
    ctx.beginPath();
    ctx.moveTo(x2, y2); ctx.lineTo(x2 - 12 * Math.cos(ang - 0.4), y2 - 12 * Math.sin(ang - 0.4));
    ctx.moveTo(x2, y2); ctx.lineTo(x2 - 12 * Math.cos(ang + 0.4), y2 - 12 * Math.sin(ang + 0.4));
    ctx.stroke(); ctx.restore();
  }
  function squiggle(x: number, y: number, w: number, color: string) {
    ctx.save(); pen(color, 3, 8);
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const px = x + i * w / 20; const py = y + Math.sin(i / 2) * 3; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke(); ctx.restore();
  }
  function sine(x: number, y: number, w: number, amp: number, color: string) {
    ctx.save(); pen(color, 2.5, 8);
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) { const px = x + i * w / 120; const py = y + Math.sin(i / 120 * Math.PI * 5) * amp; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke(); ctx.restore();
  }
  function bulb(x: number, y: number, color: string) {
    ctx.save(); pen(color, 2.5, 10);
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 20); ctx.lineTo(x - 7, y + 30);
    ctx.moveTo(x + 7, y + 20); ctx.lineTo(x + 7, y + 30);
    ctx.moveTo(x - 8, y + 34); ctx.lineTo(x + 8, y + 34); ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 28, y + Math.sin(a) * 28); ctx.lineTo(x + Math.cos(a) * 36, y + Math.sin(a) * 36); ctx.stroke(); }
    ctx.restore();
  }
  function neuralNet(cx: number, cy: number, color: string) {
    ctx.save();
    const layers = [[-40, 0, 40], [-45, -15, 15, 45], [-20, 20]];
    const xs = [cx - 55, cx, cx + 55];
    const nodes = layers.map((ys, li) => ys.map((dy) => ({ x: xs[li], y: cy + dy })));
    pen(color, 1.4, 5);
    for (let l = 0; l < nodes.length - 1; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 8;
    for (const layer of nodes) for (const n of layer) { ctx.beginPath(); ctx.arc(n.x, n.y, 5, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }

  // ---- scattered "handwritten" tech words (edit freely) ----
  const texts: Array<[string, number, number, string, number, string, number]> = [
    ['creativity', 70, 70, P, 34, cur, -0.06],
    ['REACT', 95, 150, CY, 58, mk, -0.03],
    ['design', 560, 90, P, 36, cur, 0.05],
    ['SOLID', 800, 120, AM, 56, mk, 0.03],
    ['// TODO: sleep', 360, 175, INK, 22, mono, -0.02],
    ['TypeScript', 70, 285, CY, 38, cur, 0.02],
    ['A && B => C', 500, 245, INK, 28, mono, 0],
    ['WebGL', 860, 265, MG, 40, mk, -0.05],
    ['for(i=0; i<∞)', 235, 350, CY, 24, mono, 0.01],
    ['intelligence', 430, 400, CY, 60, cur, -0.02],
    ['O(n log n)', 830, 385, AM, 28, mono, 0.03],
    ['Three.js', 70, 470, P, 40, cur, -0.03],
    ['clean code', 780, 470, AM, 38, cur, 0.04],
    ['{ }', 460, 520, INK, 60, mono, 0],
    ['Rust', 90, 600, MG, 44, mk, 0.03],
    ['true && false', 690, 560, INK, 24, mono, -0.02],
    ['</>', 590, 650, CY, 42, mono, 0.02],
    ['Next.js', 840, 630, MG, 42, cur, -0.04],
    ['f = kx', 230, 660, INK, 28, cur, 0.03],
  ];
  texts.forEach(([t, x, y, color, s, f, r]) => glowText(t, x, y, color, s, f, r));

  // ---- doodles ----
  bulb(980, 110, AM);
  neuralNet(970, 540, MG);
  sine(300, 690, 240, 10, CY);
  squiggle(430, 435, 250, CY);   // underline "intelligence"
  squiggle(95, 185, 190, CY);    // underline "REACT"
  arrow(360, 300, 300, 350, INK);
  arrow(650, 405, 800, 390, INK);
  arrow(150, 620, 90, 560, MG);

  return c;
}

/* ---------- framed neon idea board (glows at night) ---------- */

export function IdeaBoard({ position, rotation = [0, 0, 0], timeOfDay, w = 2.4, h = 1.6 }:
  { position: [number, number, number]; rotation?: [number, number, number]; timeOfDay: TimeOfDay; w?: number; h?: number }) {
  const night = timeOfDay === 'night';
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeIdeaBoardCanvas());
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);

  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    if (matRef.current) matRef.current.emissiveIntensity =
      THREE.MathUtils.lerp(matRef.current.emissiveIntensity, night ? 1.15 : 0.35, k);
    if (lightRef.current) lightRef.current.intensity =
      THREE.MathUtils.lerp(lightRef.current.intensity, night ? 0.8 : 0, k);
  });

  const border = 0.09, depth = 0.07;
  return (
    <group position={position} rotation={rotation as any}>
      {/* wooden frame */}
      <RoundedBox args={[w + border * 2, h + border * 2, depth]} radius={0.03} smoothness={3} castShadow>
        <meshStandardMaterial color="#2a2018" metalness={0.3} roughness={0.5} />
      </RoundedBox>
      {/* board surface — map drives both color + emissive, so the neon doodles light up at night */}
      <mesh position={[0, 0, depth / 2 + 0.002]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          ref={matRef}
          map={tex}
          emissiveMap={tex}
          emissive="#ffffff"
          emissiveIntensity={0.35}
          roughness={0.6}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
      {/* faint wash so the glow spills onto the wall at night */}
      <pointLight ref={lightRef} position={[0, 0, 0.6]} intensity={0} distance={4.5} decay={2} color="#00d0ff" />
    </group>
  );
}

/* ---------- tripod floor lamp (wooden splayed legs + drum shade, warm glow at night) ---------- */

export function FloorLamp({ position, timeOfDay, scale = 1 }:
  { position: [number, number, number]; timeOfDay: TimeOfDay; scale?: number }) {
  const night = timeOfDay === 'night';
  const lightRef = useRef<THREE.PointLight>(null);
  const shadeRef = useRef<THREE.MeshStandardMaterial>(null);
  const bulbRef = useRef<THREE.MeshStandardMaterial>(null);

  const warm = '#ffdcad';   // shade fabric glow
  const glow = '#ffbf80';   // bulb + light colour
  const wood = '#6f4a2c';

  const R = 0.42;      // leg splay radius at the floor
  const topY = 1.15;   // height where the legs converge
  const legLen = 1.28;
  const tilt = 0.30;
  const shadeY = topY + 0.45;

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    if (lightRef.current) lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, night ? 5.0 : 0, k);
    if (shadeRef.current) shadeRef.current.emissiveIntensity = THREE.MathUtils.lerp(shadeRef.current.emissiveIntensity, night ? 0.9 : 0.05, k);
    if (bulbRef.current) bulbRef.current.emissiveIntensity = THREE.MathUtils.lerp(bulbRef.current.emissiveIntensity, night ? 2.4 : 0, k);
  });

  return (
    <group position={position} scale={scale}>
      {/* four splayed wooden legs */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[R * 0.5, topY * 0.5, 0]} rotation={[0, 0, tilt]} castShadow>
              <boxGeometry args={[0.07, legLen, 0.09]} />
              <meshStandardMaterial color={wood} roughness={0.55} metalness={0.05} />
            </mesh>
          </group>
        );
      })}

      {/* top hub where the legs meet */}
      <mesh position={[0, topY, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.12, 16]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.5} />
      </mesh>

      {/* center pole running up through the middle */}
      <mesh position={[0, (topY + shadeY - 0.05) / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, shadeY - 0.05, 16]} />
        <meshStandardMaterial color="#d8d2c6" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* bulb inside the shade */}
      <mesh position={[0, shadeY, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial ref={bulbRef} color="#fff2d6" emissive={glow} emissiveIntensity={0} toneMapped={false} />
      </mesh>

      {/* drum shade (open cylinder, warm-glowing fabric) */}
      <mesh position={[0, shadeY, 0]} castShadow>
        <cylinderGeometry args={[0.64, 0.64, 0.5, 40, 1, true]} />
        <meshStandardMaterial ref={shadeRef} color="#efe6d2" emissive={warm} emissiveIntensity={0.05}
          roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* thin rims top + bottom of the shade */}
      <mesh position={[0, shadeY + 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.64, 0.012, 10, 40]} />
        <meshStandardMaterial color="#cfc4a8" roughness={0.7} />
      </mesh>
      <mesh position={[0, shadeY - 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.64, 0.012, 10, 40]} />
        <meshStandardMaterial color="#cfc4a8" roughness={0.7} />
      </mesh>

      {/* the actual warm light — eases on at night */}
      <pointLight ref={lightRef} position={[0, shadeY, 0]} intensity={0} distance={14} decay={1.7} color={glow} />
    </group>
  );
}