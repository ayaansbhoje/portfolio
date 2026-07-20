'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimeOfDay } from '../DeskScene';
import { lerpK } from './constants';

// emissive LED strip — Bloom turns it into a glowing neon line
export function Strip({
  args, position, rotation = [0, 0, 0], color, night, nightI = 2.4, dayI = 0.16,
}: {
  args: [number, number, number]; position: [number, number, number];
  rotation?: [number, number, number]; color: string; night: boolean; nightI?: number; dayI?: number;
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.emissiveIntensity =
      THREE.MathUtils.lerp(ref.current.emissiveIntensity, night ? nightI : dayI, lerpK(dt));
  });
  return (
    <mesh position={position} rotation={rotation as any}>
      <boxGeometry args={args} />
      <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={night ? nightI : dayI} toneMapped={false} />
    </mesh>
  );
}

// a real point light that eases on at night and off otherwise
export function FadeLight({
  position, color, night, nightI, dayI = 0, distance = 16, decay = 1.7,
}: {
  position: [number, number, number]; color: string; night: boolean;
  nightI: number; dayI?: number; distance?: number; decay?: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.intensity =
      THREE.MathUtils.lerp(ref.current.intensity, night ? nightI : dayI, lerpK(dt));
  });
  return <pointLight ref={ref} position={position} color={color} intensity={night ? nightI : dayI} distance={distance} decay={decay} />;
}

// thin glowing ring (used as neon piping around the rug)
export function NeonRing({
  radius, tube = 0.03, color, position, rotation = [0, 0, 0], night, nightI = 1, dayI = 0,
}: {
  radius: number; tube?: number; color: string; position: [number, number, number];
  rotation?: [number, number, number]; night: boolean; nightI?: number; dayI?: number;
}) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.emissiveIntensity =
      THREE.MathUtils.lerp(ref.current.emissiveIntensity, night ? nightI : dayI, lerpK(dt));
  });
  return (
    <mesh position={position} rotation={rotation as any}>
      <torusGeometry args={[radius, tube, 12, 96]} />
      <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={night ? nightI : dayI} toneMapped={false} />
    </mesh>
  );
}

// the whole neon install on the window wall + the two subtle wash lights
export function CyberLights({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const night = timeOfDay === 'night';
  const cyan = '#00e5ff';
  const mag = '#ff2d78';
  return (
    <group>
      {/* ceiling cove (cyan) + baseboard wash (magenta) */}
      <Strip args={[13, 0.06, 0.12]} position={[0, 8.0, -5.7]} color={cyan} night={night} nightI={2.6} dayI={0.18} />
      <Strip args={[13, 0.06, 0.12]} position={[0, 0.12, -5.7]} color={mag}  night={night} nightI={2.2} dayI={0.14} />
      {/* strips framing the window opening */}
      <Strip args={[0.05, 4.0, 0.08]} position={[-3.52, 4.0, -5.82]} color={mag}  night={night} nightI={2.4} dayI={0.14} />
      <Strip args={[0.05, 4.0, 0.08]} position={[ 3.52, 4.0, -5.82]} color={cyan} night={night} nightI={2.4} dayI={0.14} />

      {/* the actual (subtle) sources: cyan pours down from the cove, magenta glows up off the floor */}
      <FadeLight position={[0, 7.5, -4.7]} color={cyan} night={night} nightI={2.2} distance={22} decay={1.6} />
      <FadeLight position={[0, 0.5, -4.6]} color={mag}  night={night} nightI={1.5} distance={16} decay={1.8} />
    </group>
  );
}