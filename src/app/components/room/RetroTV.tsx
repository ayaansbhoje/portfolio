'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { TimeOfDay } from '../DeskScene';
import { useHover, Label } from './shared';

/* ---- idle screen texture: station-ID look, blue glow + scanlines ---- */
function makeTvScreenCanvas() {
  const c = document.createElement('canvas');
  c.width = 640; c.height = 480;
  const ctx = c.getContext('2d')!;
  const W = c.width, H = c.height;

  const g = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.7);
  g.addColorStop(0, '#0b1e30');
  g.addColorStop(1, '#03060c');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = '#4aa8ff'; ctx.shadowBlur = 26;
  ctx.fillStyle = '#cdeaff';
  ctx.font = "bold 84px 'JetBrains Mono', monospace";
  ctx.fillText('▶ REEL', W / 2, H / 2 - 28);
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#7fc6ff';
  ctx.font = "26px 'JetBrains Mono', monospace";
  ctx.fillText('PRESS START', W / 2, H / 2 + 52);

  ctx.shadowBlur = 8;
  ctx.font = "20px 'JetBrains Mono', monospace";
  ctx.fillStyle = '#5fb0ff';
  ctx.textAlign = 'left';  ctx.fillText('CH 00', 28, 36);
  ctx.textAlign = 'right'; ctx.fillText('● LIVE', W - 28, 36);

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.10; ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 2);
  ctx.globalAlpha = 1;
  return c;
}

/* ---- brand strip under the screen ---- */
function makeBrandStripCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 80;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#141017'; ctx.fillRect(0, 0, 512, 80);
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#00F5FF'; ctx.fillRect(22, 24, 26, 26);
  ctx.fillStyle = '#FF2D78'; ctx.fillRect(35, 34, 26, 26);
  ctx.font = "bold 34px 'JetBrains Mono', monospace";
  ctx.fillStyle = '#e8d5ff'; ctx.textAlign = 'left';
  ctx.fillText('REELBOY', 82, 44);
  ctx.font = "20px 'JetBrains Mono', monospace";
  ctx.fillStyle = '#8b6fa8'; ctx.textAlign = 'right';
  ctx.fillText('SHOWREEL·SYSTEM', 492, 44);
  return c;
}

/* ---- small TV remote prop lying on the base ---- */
function Remote({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation as any}>
      {/* body */}
      <RoundedBox args={[0.16, 0.05, 0.42]} radius={0.025} smoothness={4} castShadow>
        <meshStandardMaterial color="#1b1720" roughness={0.55} metalness={0.15} />
      </RoundedBox>
      {/* big round button near the top (power/play) */}
      <mesh position={[0, 0.04, -0.14]}>
        <cylinderGeometry args={[0.028, 0.028, 0.02, 16]} />
        <meshStandardMaterial color="#c01230" emissive="#c01230" emissiveIntensity={0.4} roughness={0.4} toneMapped={false} />
      </mesh>
      {/* small button grid */}
      {[-0.02, 0.04, 0.1, 0.16].map((z, r) =>
        [-0.04, 0.04].map((x, cix) => (
          <mesh key={`${r}-${cix}`} position={[x, 0.035, z]}>
            <boxGeometry args={[0.03, 0.015, 0.03]} />
            <meshStandardMaterial color="#3a3440" roughness={0.6} />
          </mesh>
        ))
      )}
    </group>
  );
}

export function RetroTV({
  position, rotation = [0, 0, 0], timeOfDay, scale = 1, onSelect,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  timeOfDay: TimeOfDay;
  scale?: number;
  onSelect: () => void;
}) {
  const { hovered, bind } = useHover();
  const night = timeOfDay === 'night';

  const screenTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeTvScreenCanvas());
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }, []);
  const brandTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeBrandStripCanvas());
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return t;
  }, []);
  useEffect(() => () => { screenTex.dispose(); brandTex.dispose(); }, [screenTex, brandTex]);

  const screenMat = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    const flick = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.04 + (Math.random() - 0.5) * 0.03;
    const emis = (hovered ? 1.6 : 1.15) * flick;
    if (screenMat.current) screenMat.current.emissiveIntensity = THREE.MathUtils.lerp(screenMat.current.emissiveIntensity, emis, k);
    const li = (night ? 2.2 : 1.3) * flick;
    if (glowRef.current) glowRef.current.intensity = THREE.MathUtils.lerp(glowRef.current.intensity, li, k);
  });

  // cream/beige arcade-toy plastic
  const shell = '#c8bda6';
  const shellDark = '#a89a80';
  const bezel = '#2b2620';

  // key heights (base sits on floor at y=0, top of base = BASE_TOP)
  const BASE_H = 0.9;
  const BASE_TOP = BASE_H;   // 0.9

  return (
    <group position={position} rotation={rotation as any} scale={scale * (hovered ? 1.03 : 1)} {...bind}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}>

      {/* ===== solid console base — sits FLAT on the floor (bottom at y=0) ===== */}
      <RoundedBox args={[1.35, BASE_H, 1.0]} radius={0.06} smoothness={4} position={[0, BASE_H / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#3a2a1c" roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* lighter top surface so the base reads as grounded furniture */}
      <mesh position={[0, BASE_TOP + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.33, 0.98]} />
        <meshStandardMaterial color="#4a3626" roughness={0.6} />
      </mesh>
      {/* front accent line on the base */}
      <mesh position={[0, BASE_H * 0.45, 0.5]}>
        <boxGeometry args={[1.2, 0.02, 0.02]} />
        <meshStandardMaterial color={shellDark} roughness={0.6} />
      </mesh>

      {/* small remote resting on the front of the base top, angled casually */}
      <Remote position={[0.32, BASE_TOP, 0.34]} rotation={[0, -0.5, 0]} />

      {/* ===== screen head — sits on the BACK of the base top, tilted back slightly ===== */}
      <group position={[0, BASE_TOP, -0.2]} rotation={[0.1, 0, 0]}>
        {/* chunky cabinet — bottom rests on the base top */}
        <RoundedBox args={[1.45, 1.1, 0.55]} radius={0.12} smoothness={4} position={[0, 0.55, 0]} castShadow>
          <meshStandardMaterial color={shell} roughness={0.55} metalness={0.05} />
        </RoundedBox>
        {/* rounded top ridge accent */}
        <RoundedBox args={[1.47, 0.1, 0.57]} radius={0.05} smoothness={4} position={[0, 1.1, 0]}>
          <meshStandardMaterial color={shellDark} roughness={0.6} />
        </RoundedBox>

        {/* dark bezel plate */}
        <RoundedBox args={[1.15, 0.85, 0.06]} radius={0.08} smoothness={4} position={[0, 0.62, 0.28]} castShadow>
          <meshStandardMaterial color={bezel} roughness={0.5} metalness={0.15} />
        </RoundedBox>
        {/* recessed screen well */}
        <mesh position={[0, 0.62, 0.3]}>
          <boxGeometry args={[0.95, 0.68, 0.02]} />
          <meshStandardMaterial color="#050608" roughness={0.4} />
        </mesh>
        {/* glowing screen (idle station-ID) */}
        <mesh position={[0, 0.62, 0.312]}>
          <planeGeometry args={[0.88, 0.62]} />
          <meshStandardMaterial ref={screenMat} map={screenTex} emissiveMap={screenTex}
            emissive="#4aa8ff" emissiveIntensity={1.15} roughness={0.35} toneMapped={false} />
        </mesh>
        {/* glass sheen */}
        <mesh position={[0, 0.78, 0.318]}>
          <planeGeometry args={[0.88, 0.24]} />
          <meshBasicMaterial color="#bfe0ff" transparent opacity={0.06} toneMapped={false} />
        </mesh>

        {/* brand strip below the screen */}
        <mesh position={[0, 0.16, 0.29]}>
          <planeGeometry args={[1.0, 0.14]} />
          <meshStandardMaterial map={brandTex} roughness={0.6} toneMapped={false} />
        </mesh>

        {/* power LED */}
        <mesh position={[0.46, 0.16, 0.3]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshStandardMaterial color="#3ea9ff" emissive="#3ea9ff" emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {/* side vents */}
        {[-0.2, 0, 0.2].map((y, i) => (
          <mesh key={i} position={[0.72, 0.62 + y, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.34]} />
            <meshStandardMaterial color="#0e0c10" roughness={0.8} />
          </mesh>
        ))}

        {/* blue light pouring into the room from the screen */}
        <pointLight ref={glowRef} position={[0, 0.62, 1.1]} intensity={1.3} distance={5} decay={2} color="#3ea9ff" />
      </group>

      {hovered && <Label text="▶ Play showreel" position={[0, 2.3, 0]} />}
    </group>
  );
}