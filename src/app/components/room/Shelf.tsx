'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';

/* ---------- floating shelf above the bed (with under-shelf spotlights) ---------- */

export function Shelf({ position, width = 2.6, fixtures = 3, reach = 3.6 }: { position: [number, number, number]; width?: number; fixtures?: number; reach?: number }) {
  const warm = '#ffcf9a';
  const usable = width - 0.5;
  const fx = Array.from({ length: fixtures }, (_, i) => -usable / 2 + (fixtures === 1 ? usable / 2 : (usable * i) / (fixtures - 1)));
  return (
    <group position={position}>
      {/* wood plank */}
      <RoundedBox args={[width, 0.12, 0.7]} radius={0.03} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#3a2a1c" roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* lighter grain on top */}
      <mesh position={[0, 0.061, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.05, 0.65]} />
        <meshStandardMaterial color="#4a3626" roughness={0.6} />
      </mesh>
      {/* under-shelf spotlight fixtures (visual) */}
      {fx.map((x, i) => (
        <group key={i} position={[x, -0.06, 0.18]}>
          <mesh position={[0, -0.02, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.05, 20]} />
            <meshStandardMaterial color="#15121a" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 20]} />
            <meshStandardMaterial color={warm} emissive={warm} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* two actual downlights (kept low to protect perf) */}
      <pointLight position={[-width * 0.26, -0.16, 0.1]} intensity={0.8} distance={reach} decay={2} color={warm} />
      <pointLight position={[width * 0.26, -0.16, 0.1]} intensity={0.8} distance={reach} decay={2} color={warm} />
    </group>
  );
}