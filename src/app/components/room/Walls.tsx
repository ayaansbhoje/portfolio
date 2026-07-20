'use client';

import React from 'react';
import * as THREE from 'three';

export function BackWall() {
  const wall = '#283845';
  const M = <meshStandardMaterial color={wall} roughness={1} />;
  return (
    <group position={[0, 0, -6]}>
      <mesh position={[-5.75, 4.5, 0]} receiveShadow><boxGeometry args={[4.5, 9, 0.3]} />{M}</mesh>
      <mesh position={[ 5.75, 4.5, 0]} receiveShadow><boxGeometry args={[4.5, 9, 0.3]} />{M}</mesh>
      <mesh position={[0, 7.5, 0]} receiveShadow><boxGeometry args={[7, 3, 0.3]} />{M}</mesh>
      <mesh position={[0, 1,   0]} receiveShadow><boxGeometry args={[7, 2, 0.3]} />{M}</mesh>
      <mesh position={[0, 6.05, 0.16]}><boxGeometry args={[7.1, 0.12, 0.08]} /><meshStandardMaterial color="#1c2a37" /></mesh>
      <mesh position={[0, 1.95, 0.16]}><boxGeometry args={[7.1, 0.12, 0.08]} /><meshStandardMaterial color="#1c2a37" /></mesh>
      <mesh position={[-3.55, 4, 0.16]}><boxGeometry args={[0.12, 4.2, 0.08]} /><meshStandardMaterial color="#1c2a37" /></mesh>
      <mesh position={[ 3.55, 4, 0.16]}><boxGeometry args={[0.12, 4.2, 0.08]} /><meshStandardMaterial color="#1c2a37" /></mesh>
    </group>
  );
}

/* ---------- right wall with a closed, locked door ---------- */

export function RightWall({ accent }: { accent: string }) {
  const wallColor = '#283845';
  const frameMat = <meshStandardMaterial color="#0d0a16" metalness={0.4} roughness={0.5} />;
  const doorFace = 7.83;

  return (
    <group>
      <mesh position={[8, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 9]} />
        <meshStandardMaterial color={wallColor} roughness={1} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[7.9, 2.4, -1.3]} castShadow receiveShadow><boxGeometry args={[0.18, 4.9, 0.18]} />{frameMat}</mesh>
      <mesh position={[7.9, 2.4,  1.3]} castShadow receiveShadow><boxGeometry args={[0.18, 4.9, 0.18]} />{frameMat}</mesh>
      <mesh position={[7.9, 4.75, 0]}   castShadow receiveShadow><boxGeometry args={[0.18, 0.2, 2.78]} />{frameMat}</mesh>

      <mesh position={[7.92, 2.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 4.5, 2.4]} />
        <meshStandardMaterial color="#16121f" metalness={0.55} roughness={0.45} />
      </mesh>

      <mesh position={[doorFace, 3.15, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.9, 1.5]} />
        <meshStandardMaterial color="#0f0b18" roughness={0.6} />
      </mesh>
      <mesh position={[doorFace, 1.35, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.9, 1.5]} />
        <meshStandardMaterial color="#0f0b18" roughness={0.6} />
      </mesh>

      <mesh position={[doorFace - 0.01, 2.25, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.05, 3.6]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>

      <mesh position={[doorFace - 0.06, 2.15, -0.7]} castShadow>
        <boxGeometry args={[0.12, 0.14, 0.95]} />
        <meshStandardMaterial color="#2a2438" metalness={0.7} roughness={0.3} />
      </mesh>

      <mesh position={[doorFace, 2.4, 1.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.36, 0.56]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[doorFace - 0.01, 2.32, 1.75]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.22, 0.34]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.85} toneMapped={false} />
      </mesh>
      <mesh position={[doorFace - 0.02, 2.74, 1.75]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[0.045, 16]} />
        <meshStandardMaterial color="#FF2D78" emissive="#FF2D78" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}