'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ---------- stylish dark helmet (Batman-vibe color story, no trademarked marks) ---------- */

export function Helmet({ position, rotation = [0, 0.7, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const gold = '#d8a63f';
  const dark = '#0f0f14';
  // shared ovoid scale so the shell + visor stay concentric (wider than tall, longer front-back)
  const S: [number, number, number] = [1.08, 1.1, 1.24];
  return (
    // origin at the shell centre; head-opening faces down and rests just above the shelf
    <group position={position} rotation={rotation as any}>
      {/* SHELL — egg-shaped dome, open at the bottom for the neck */}
      <mesh scale={S} castShadow>
        <sphereGeometry args={[0.27, 56, 44, 0, Math.PI * 2, 0, Math.PI * 0.9]} />
        <meshStandardMaterial color={dark} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* thin inner liner so the open bottom doesn't look hollow */}
      <mesh scale={S}>
        <sphereGeometry args={[0.25, 40, 32, 0, Math.PI * 2, 0, Math.PI * 0.92]} />
        <meshStandardMaterial color="#050507" roughness={1} side={THREE.BackSide} />
      </mesh>

      {/* CHIN BAR — forward + downward projecting front-lower mass */}
      <mesh position={[0, -0.13, 0.15]} scale={[1.02, 0.82, 1.15]} castShadow>
        <sphereGeometry args={[0.21, 44, 32]} />
        <meshStandardMaterial color={dark} metalness={0.5} roughness={0.24} />
      </mesh>
      {/* chin vent (dark recessed grille) */}
      <mesh position={[0, -0.16, 0.36]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.16, 0.07, 0.03]} />
        <meshStandardMaterial color="#050507" roughness={0.9} />
      </mesh>

      {/* VISOR — glossy dark curved shield across the eye band */}
      <mesh scale={S}>
        <sphereGeometry args={[0.288, 64, 40, Math.PI / 2 - 0.92, 1.84, 0.66, 0.6]} />
        <meshStandardMaterial color="#0c1622" metalness={0.98} roughness={0.06} emissive="#0c2033" emissiveIntensity={0.45} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* visor top brow trim (gold) */}
      <mesh scale={S}>
        <sphereGeometry args={[0.298, 64, 20, Math.PI / 2 - 0.94, 1.88, 0.62, 0.05]} />
        <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.6} metalness={0.9} roughness={0.25} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* GOLD crown stripe (front-to-back mohawk accent) */}
      <mesh position={[0, 0.02, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.012, 12, 64, Math.PI * 0.85]} />
        <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.55} metalness={0.9} roughness={0.25} toneMapped={false} />
      </mesh>

      {/* gold side pods / vents */}
      {[0.24, -0.24].map((x, i) => (
        <mesh key={i} position={[x, 0.0, 0.06]} rotation={[0, i ? -0.6 : 0.6, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.1]} />
          <meshStandardMaterial color={gold} emissive={gold} emissiveIntensity={0.45} metalness={0.85} roughness={0.3} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- small potted plant for the shelf ---------- */

export function ShelfPlant({ position }: { position: [number, number, number] }) {
  const blobs: [number, number, number, number][] = [
    [0, 0.28, 0, 0.14], [0.08, 0.32, 0.05, 0.1], [-0.07, 0.3, -0.04, 0.11], [0.02, 0.37, 0.06, 0.09],
  ];
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.11, 0.08, 0.18, 20]} />
        <meshStandardMaterial color="#3a2a22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 20]} />
        <meshStandardMaterial color="#1a120e" roughness={1} />
      </mesh>
      {blobs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 12, 12]} />
          <meshStandardMaterial color={i % 2 ? '#3f7d54' : '#4f9d68'} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- stylized high-top sneaker (white / red / black, no logos) ---------- */

export function Sneaker({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const white = '#efece3', red = '#c01230', black = '#16161a', sole = '#f3ecd9';
  // toe points toward +z; sits sole-down on the shelf. scaled at the group.
  return (
    <group position={position} rotation={rotation as any} scale={0.52}>
      {/* ---- SOLE: chunky midsole with a curved-up toe (toe spring) ---- */}
      <RoundedBox args={[0.44, 0.15, 0.78]} radius={0.075} smoothness={4} position={[0, 0.085, -0.02]} castShadow>
        <meshStandardMaterial color={sole} roughness={0.55} />
      </RoundedBox>
      {/* toe of the sole, lifted */}
      <group position={[0, 0.13, 0.42]} rotation={[-0.35, 0, 0]}>
        <RoundedBox args={[0.44, 0.15, 0.28]} radius={0.075} smoothness={4} castShadow>
          <meshStandardMaterial color={sole} roughness={0.55} />
        </RoundedBox>
      </group>
      {/* thin red outsole trim */}
      <RoundedBox args={[0.46, 0.05, 0.8]} radius={0.03} position={[0, 0.03, -0.02]}>
        <meshStandardMaterial color={red} roughness={0.55} />
      </RoundedBox>

      {/* ---- UPPER: rounded foot body ---- */}
      {/* vamp / instep (white) */}
      <mesh position={[0, 0.3, -0.02]} scale={[0.92, 0.82, 1.55]} castShadow>
        <sphereGeometry args={[0.21, 40, 32]} />
        <meshStandardMaterial color={white} roughness={0.65} />
      </mesh>
      {/* rounded toe box (red) */}
      <mesh position={[0, 0.23, 0.34]} scale={[0.88, 0.72, 0.85]} castShadow>
        <sphereGeometry args={[0.2, 36, 28]} />
        <meshStandardMaterial color={red} roughness={0.68} />
      </mesh>
      {/* heel counter (red) */}
      <mesh position={[0, 0.3, -0.42]} scale={[0.84, 0.92, 0.62]} castShadow>
        <sphereGeometry args={[0.2, 36, 28]} />
        <meshStandardMaterial color={red} roughness={0.68} />
      </mesh>

      {/* ---- HIGH-TOP ANKLE ---- */}
      {/* padded collar ring = the ankle opening (the key "shoe" cue) */}
      <mesh position={[0, 0.56, -0.24]} rotation={[0.32, 0, 0]} castShadow>
        <torusGeometry args={[0.15, 0.06, 16, 32]} />
        <meshStandardMaterial color={black} roughness={0.55} />
      </mesh>
      {/* quarter panel filling under the collar (black) */}
      <mesh position={[0, 0.42, -0.26]} scale={[0.82, 0.8, 0.7]} castShadow>
        <sphereGeometry args={[0.2, 32, 24]} />
        <meshStandardMaterial color={black} roughness={0.55} />
      </mesh>
      {/* tongue */}
      <group position={[0, 0.5, 0.02]} rotation={[0.5, 0, 0]}>
        <RoundedBox args={[0.24, 0.07, 0.22]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color={red} roughness={0.6} />
        </RoundedBox>
      </group>
      {/* lace band (black) across the instep */}
      <mesh position={[0, 0.42, 0.08]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.26]} />
        <meshStandardMaterial color={black} roughness={0.5} />
      </mesh>
    </group>
  );
}