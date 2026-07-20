'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { Album } from '../musicData';
import { useHover, Label } from './shared';
import { makeAlbumCoverCanvas } from './textures';

/* ============================================================
   RECORD CORNER — open mid-century console packed with vinyl,
   interactive turntable (propped-open dust cover), and a
   single album displayed upright on a stand beside it.
   ============================================================ */

/* a single album on a slim wooden display stand (like the reference photo) */
export function AlbumStand({ album, position, rotation = [0, 0, 0], size = 0.86 }:
  { album: Album; position: [number, number, number]; rotation?: [number, number, number]; size?: number }) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  const fallback = useMemo(() => {
    const t = new THREE.CanvasTexture(makeAlbumCoverCanvas(album));
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }, [album]);
  useEffect(() => () => fallback.dispose(), [fallback]);

  useEffect(() => {
    if (!album.cover) return;
    let alive = true;
    new THREE.TextureLoader().load(
      album.cover,
      (t) => { if (alive) { t.colorSpace = THREE.SRGBColorSpace; setTex(t); } },
      undefined,
      () => {},
    );
    return () => { alive = false; };
  }, [album.cover]);

  const map = tex ?? fallback;
  const D = 0.05;
  const wood = '#6f4a2c';
  const half = size / 2;

  return (
    <group position={position} rotation={rotation as any}>
      {/* base foot the easel sits on */}
      <RoundedBox args={[size * 0.9, 0.05, 0.34]} radius={0.02} smoothness={3} position={[0, 0.025, 0.02]} castShadow>
        <meshStandardMaterial color={wood} roughness={0.55} metalness={0.05} />
      </RoundedBox>
      {/* front lip that stops the sleeve sliding off */}
      <mesh position={[0, 0.07, 0.14]}>
        <boxGeometry args={[size * 0.9, 0.05, 0.03]} />
        <meshStandardMaterial color="#432c19" roughness={0.5} />
      </mesh>
      {/* back support leg (leans back to prop the reclined album) */}
      <mesh position={[0, half * 0.9, -0.14]} rotation={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.06, size * 1.05, 0.05]} />
        <meshStandardMaterial color={wood} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* the album sleeve, standing upright, leaning back on the support leg */}
      <group position={[0, half + 0.06, 0]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[size, size, D]} radius={0.01} smoothness={3} castShadow>
          <meshStandardMaterial color="#0e0b16" roughness={0.85} />
        </RoundedBox>
        <mesh position={[0, 0, D / 2 + 0.001]}>
          <planeGeometry args={[size * 0.98, size * 0.98]} />
          <meshStandardMaterial map={map} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

/* packed row(s) of upright vinyl sleeves — fills one bay of the console */
export function VinylCollection({ width, y, z, bayX = 0, depth = 0.5, maxH = 0.74 }:
  { width: number; y: number; z: number; bayX?: number; depth?: number; maxH?: number }) {
  const rows = useMemo(() => {
    const palette = [
      '#c96b4a', '#d8a24a', '#4a7a6b', '#7a4a52', '#3f5a7a', '#b0895a', '#5a4a6b',
      '#8a8a6a', '#a05040', '#2f5a52', '#8a5a3a', '#6a5a7a', '#c8b060', '#40607a',
      '#7a3a3a', '#3a5a4a', '#9a6a3a', '#4a4a6a',
    ];
    const n = Math.max(14, Math.floor(width / 0.026));   // dense: ~1 sleeve every 2.6cm
    const mkRow = () =>
      Array.from({ length: n }, () => ({
        color: palette[(Math.random() * palette.length) | 0],
        lean: (Math.random() - 0.5) * 0.16,
        h: maxH * (0.82 + Math.random() * 0.18),
        thin: 0.66 + Math.random() * 0.5,
        jz: (Math.random() - 0.5) * 0.012,
      }));
    return [mkRow(), mkRow()];                            // front row + back row for depth
  }, [width, maxH]);

  return (
    <group position={[bayX, y, z]}>
      {rows.map((row, ri) => {
        const n = row.length;
        const step = width / n;
        const start = -width / 2 + step / 2;
        const rowZ = ri === 0 ? depth * 0.16 : -depth * 0.22;
        return (
          <group key={ri}>
            {row.map((it, i) => (
              <mesh key={i} position={[start + i * step, it.h / 2, rowZ + it.jz]} rotation={[0, 0, it.lean]} castShadow>
                <boxGeometry args={[step * it.thin, it.h, depth * 0.72]} />
                <meshStandardMaterial color={it.color} roughness={0.92} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* open mid-century console — real shelf so the records inside are visible */
export function RecordConsole({ width = 2.6, depth = 0.95, bodyH = 1.0, legH = 0.45 }:
  { width?: number; depth?: number; bodyH?: number; legH?: number }) {
  const pt = 0.06;                        // panel thickness
  const bodyBottom = legH;                // y where the body starts
  const bodyTop = legH + bodyH;           // deck top (turntable sits here) = 1.45
  const hW = width / 2, hD = depth / 2;
  const wood = '#3a2a1c';
  const woodTop = '#4a3626';

  const legPos: [number, number][] = [
    [-hW + 0.2, -hD + 0.16], [hW - 0.2, -hD + 0.16],
    [-hW + 0.2, hD - 0.16], [hW - 0.2, hD - 0.16],
  ];

  const interiorW = width - 2 * pt;
  const interiorH = bodyH - 2 * pt;
  const interiorBottomY = bodyBottom + pt;
  const bayW = interiorW / 2 - 0.08;

  return (
    <group>
      {/* splayed tapered legs */}
      {legPos.map(([x, z], i) => (
        <mesh key={i} position={[x, legH / 2, z]} rotation={[0, 0, (x > 0 ? -1 : 1) * 0.08]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, legH, 12]} />
          <meshStandardMaterial color="#1a1208" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}

      {/* bottom slab */}
      <RoundedBox args={[width, pt, depth]} radius={0.02} smoothness={3} position={[0, bodyBottom + pt / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={wood} roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* top deck (the turntable rests on this) */}
      <RoundedBox args={[width, pt, depth]} radius={0.02} smoothness={3} position={[0, bodyTop - pt / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={woodTop} roughness={0.6} metalness={0.05} />
      </RoundedBox>
      {/* side panels */}
      <RoundedBox args={[pt, interiorH, depth]} radius={0.02} smoothness={3} position={[-hW + pt / 2, bodyBottom + bodyH / 2, 0]} castShadow>
        <meshStandardMaterial color={wood} roughness={0.7} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[pt, interiorH, depth]} radius={0.02} smoothness={3} position={[hW - pt / 2, bodyBottom + bodyH / 2, 0]} castShadow>
        <meshStandardMaterial color={wood} roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* back panel */}
      <mesh position={[0, bodyBottom + bodyH / 2, -hD + pt / 2]}>
        <boxGeometry args={[interiorW, interiorH, pt]} />
        <meshStandardMaterial color="#241811" roughness={0.85} />
      </mesh>
      {/* center divider — splits into two record bays */}
      <mesh position={[0, bodyBottom + bodyH / 2, 0]}>
        <boxGeometry args={[pt * 0.8, interiorH, depth - pt]} />
        <meshStandardMaterial color={wood} roughness={0.75} />
      </mesh>

      {/* packed records in each bay */}
      <VinylCollection width={bayW} y={interiorBottomY} z={0} depth={depth - pt} maxH={interiorH - 0.04} bayX={-interiorW / 4} />
      <VinylCollection width={bayW} y={interiorBottomY} z={0} depth={depth - pt} maxH={interiorH - 0.04} bayX={interiorW / 4} />
    </group>
  );
}

/* interactive turntable — wooden plinth + propped-open dust cover; spins while playing */
export function Turntable({ musicPlaying, onSelect }: { musicPlaying: boolean; onSelect: () => void }) {
  const { hovered, bind } = useHover();
  const platterRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (musicPlaying && platterRef.current) platterRef.current.rotation.y += dt * 1.8;
  });

  const wood = '#6f4a2c';
  const woodDark = '#432c19';
  const frameWood = '#3a2f26';

  return (
    <group position={[0, 1.45, 0.02]} scale={hovered ? 1.02 : 1} {...bind}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}>

      {/* ---- wooden plinth (two-tone) ---- */}
      <RoundedBox args={[1.25, 0.2, 0.9]} radius={0.04} smoothness={4} position={[0, 0.1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={wood} roughness={0.5} metalness={0.05} />
      </RoundedBox>
      {/* recessed darker top deck */}
      <RoundedBox args={[1.16, 0.04, 0.82]} radius={0.02} smoothness={4} position={[0, 0.21, 0]}>
        <meshStandardMaterial color={woodDark} roughness={0.45} metalness={0.1} />
      </RoundedBox>

      {/* ---- platter + vinyl (spins) ---- */}
      <group ref={platterRef} position={[-0.16, 0.235, 0.02]}>
        {/* metal platter */}
        <mesh castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.035, 48]} />
          <meshStandardMaterial color="#17171d" metalness={0.7} roughness={0.35} />
        </mesh>
        {/* vinyl record */}
        <mesh position={[0, 0.023, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.01, 48]} />
          <meshStandardMaterial color="#0a0a0c" roughness={0.3} metalness={0.15} />
        </mesh>
        {/* faint groove band */}
        <mesh position={[0, 0.029, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.33, 48]} />
          <meshStandardMaterial color="#1a1a1f" roughness={0.4} side={THREE.DoubleSide} />
        </mesh>
        {/* colored label */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial color="#c96b4a" roughness={0.55} />
        </mesh>
        {/* spindle */}
        <mesh position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.03, 12]} />
          <meshStandardMaterial color="#d8d8d8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* ---- tonearm (back-right corner) ---- */}
      {/* pivot base */}
      <mesh position={[0.42, 0.24, -0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.055, 0.06, 20]} />
        <meshStandardMaterial color="#1c1c24" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* arm swings in toward the record while playing */}
      <group position={[0.42, 0.27, -0.3]} rotation={[0, musicPlaying ? -0.62 : -1.0, 0]}>
        <mesh position={[-0.24, 0, 0.18]} rotation={[0, 0.64, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.56, 12]} />
          <meshStandardMaterial color="#c8c8cc" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* headshell */}
        <mesh position={[-0.46, -0.02, 0.34]} rotation={[0, 0.64, 0]} castShadow>
          <boxGeometry args={[0.07, 0.03, 0.05]} />
          <meshStandardMaterial color="#161016" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* counterweight */}
      <mesh position={[0.5, 0.27, -0.38]}>
        <cylinderGeometry args={[0.035, 0.035, 0.05, 16]} />
        <meshStandardMaterial color="#0e0e14" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* ---- control knobs (front-left) ---- */}
      <mesh position={[-0.46, 0.22, 0.32]}>
        <cylinderGeometry args={[0.04, 0.04, 0.03, 20]} />
        <meshStandardMaterial color="#d8d2c4" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[-0.3, 0.22, 0.34]}>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 20]} />
        <meshStandardMaterial color="#d8d2c4" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* ---- hinged translucent dust cover (propped open at the back) ---- */}
      {/* hinge posts */}
      <mesh position={[-0.6, 0.24, -0.42]}><cylinderGeometry args={[0.015, 0.015, 0.08, 10]} /><meshStandardMaterial color="#2a2a30" metalness={0.6} roughness={0.4} /></mesh>
      <mesh position={[ 0.6, 0.24, -0.42]}><cylinderGeometry args={[0.015, 0.015, 0.08, 10]} /><meshStandardMaterial color="#2a2a30" metalness={0.6} roughness={0.4} /></mesh>
      {/* lid — hinged at the back edge, tilted up and leaning back toward the wall */}
      <group position={[0, 0.28, -0.42]} rotation={[-0.5, 0, 0]}>
        {/* clear smoked panel */}
        <mesh position={[0, 0.425, 0]}>
          <boxGeometry args={[1.2, 0.85, 0.02]} />
          <meshStandardMaterial color="#cdbfae" transparent opacity={0.16} roughness={0.05} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
        {/* thin wood frame around the panel */}
        <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.22, 0.03, 0.04]} /><meshStandardMaterial color={frameWood} roughness={0.5} /></mesh>
        <mesh position={[-0.61, 0.425, 0]}><boxGeometry args={[0.03, 0.85, 0.04]} /><meshStandardMaterial color={frameWood} roughness={0.5} /></mesh>
        <mesh position={[ 0.61, 0.425, 0]}><boxGeometry args={[0.03, 0.85, 0.04]} /><meshStandardMaterial color={frameWood} roughness={0.5} /></mesh>
      </group>

      {hovered && <Label text="♪ Pick a record" position={[0, 1.2, 0]} />}
    </group>
  );
}