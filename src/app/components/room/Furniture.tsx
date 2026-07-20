'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';

export function Desk() {
  const legs: [number, number][] = [[-3.15, -1.3], [3.15, -1.3], [-3.15, 1.3], [3.15, 1.3]];
  return (
    <group>
      <RoundedBox args={[6.8, 0.22, 3]} radius={0.06} smoothness={4} position={[0, 1.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2a1f16" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <mesh position={[0, 1.45, 1.5]}>
        <boxGeometry args={[6.4, 0.04, 0.04]} />
        <meshStandardMaterial color="#ff5aa0" emissive="#ff5aa0" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.75, z]} castShadow>
          <boxGeometry args={[0.18, 1.5, 0.18]} />
          <meshStandardMaterial color="#161016" metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- modern gaming chair ---------- */

export function Chair({ accent }: { accent: string }) {
  const legs = [0, 1, 2, 3, 4];
  return (
    <group position={[0, 0, 2.1]}>
      {legs.map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, -a, 0]}>
            <mesh position={[0.36, 0.09, 0]} castShadow>
              <boxGeometry args={[0.72, 0.08, 0.14]} />
              <meshStandardMaterial color="#101018" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.66, 0.06, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#0a0a10" roughness={0.5} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.14, 20]} />
        <meshStandardMaterial color="#101018" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.7, 16]} />
        <meshStandardMaterial color="#1c1c26" metalness={0.7} roughness={0.3} />
      </mesh>

      <RoundedBox args={[1.5, 0.22, 1.5]} radius={0.14} smoothness={4} position={[0, 0.92, 0]} castShadow>
        <meshStandardMaterial color="#17131d" roughness={0.6} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[0.26, 0.24, 1.4]} radius={0.1} smoothness={4} position={[-0.62, 0.99, 0]} castShadow>
        <meshStandardMaterial color="#1b1622" roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.26, 0.24, 1.4]} radius={0.1} smoothness={4} position={[0.62, 0.99, 0]} castShadow>
        <meshStandardMaterial color="#1b1622" roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[1.4, 0.2, 0.34]} radius={0.1} smoothness={4} position={[0, 0.95, -0.62]} castShadow>
        <meshStandardMaterial color="#1b1622" roughness={0.6} />
      </RoundedBox>

      <group position={[0, 1.0, 0.64]} rotation={[0.16, 0, 0]}>
        <RoundedBox args={[1.35, 1.75, 0.2]} radius={0.16} smoothness={4} position={[0, 0.82, 0]} castShadow>
          <meshStandardMaterial color="#17131d" roughness={0.6} metalness={0.1} />
        </RoundedBox>
        <RoundedBox args={[0.22, 1.55, 0.3]} radius={0.1} smoothness={4} position={[-0.62, 0.78, 0.04]} castShadow>
          <meshStandardMaterial color="#1b1622" roughness={0.6} />
        </RoundedBox>
        <RoundedBox args={[0.22, 1.55, 0.3]} radius={0.1} smoothness={4} position={[0.62, 0.78, 0.04]} castShadow>
          <meshStandardMaterial color="#1b1622" roughness={0.6} />
        </RoundedBox>
        <mesh position={[-0.5, 0.8, -0.09]}><boxGeometry args={[0.035, 1.5, 0.04]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} toneMapped={false} /></mesh>
        <mesh position={[0.5, 0.8, -0.09]}><boxGeometry args={[0.035, 1.5, 0.04]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} toneMapped={false} /></mesh>
        <RoundedBox args={[0.95, 0.42, 0.16]} radius={0.12} smoothness={4} position={[0, 0.32, -0.14]} castShadow>
          <meshStandardMaterial color="#241b2e" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[0.82, 0.38, 0.18]} radius={0.12} smoothness={4} position={[0, 1.5, -0.12]} castShadow>
          <meshStandardMaterial color="#241b2e" roughness={0.7} />
        </RoundedBox>
      </group>

      {[-0.82, 0.82].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.16, 0.12]} castShadow>
            <boxGeometry args={[0.1, 0.42, 0.14]} />
            <meshStandardMaterial color="#141420" metalness={0.5} roughness={0.4} />
          </mesh>
          <RoundedBox args={[0.2, 0.1, 0.62]} radius={0.05} smoothness={4} position={[x, 1.4, 0.02]} castShadow>
            <meshStandardMaterial color="#1b1622" roughness={0.6} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

/* ---------- bed (bigger, flush against the window wall) ---------- */

export function Bed({ accent }: { accent: string }) {
  // group z placed so the headboard back sits on the wall face (~ -5.85)
  return (
    <group position={[-5.7, 0, -3.34]}>
      {/* recessed plinth */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[2.9, 0.12, 4.6]} />
        <meshStandardMaterial color="#0d0912" roughness={0.8} />
      </mesh>
      {/* platform frame */}
      <RoundedBox args={[3.2, 0.62, 4.8]} radius={0.06} smoothness={4} position={[0, 0.37, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#241a12" roughness={0.75} metalness={0.05} />
      </RoundedBox>
      {/* under-bed accent LED (foot + room-facing side) */}
      <mesh position={[0, 0.16, 2.4]}>
        <planeGeometry args={[2.9, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh position={[1.61, 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.6, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.2} toneMapped={false} />
      </mesh>

      {/* mattress */}
      <RoundedBox args={[3.05, 0.34, 4.65]} radius={0.12} smoothness={4} position={[0, 0.85, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#d9ccb6" roughness={0.9} />
      </RoundedBox>

      {/* upholstered headboard (back sits against the wall) */}
      <RoundedBox args={[3.2, 1.6, 0.22]} radius={0.1} smoothness={4} position={[0, 1.25, -2.4]} castShadow>
        <meshStandardMaterial color="#382c46" roughness={0.85} />
      </RoundedBox>

      {/* quilt / duvet */}
      <RoundedBox args={[3.18, 0.28, 3.4]} radius={0.14} smoothness={4} position={[0, 0.99, 0.6]} castShadow receiveShadow>
        <meshStandardMaterial color="#37585a" roughness={0.95} />
      </RoundedBox>
      {/* turned-down fold */}
      <RoundedBox args={[3.18, 0.2, 0.65]} radius={0.1} smoothness={4} position={[0, 1.09, -1.05]} castShadow>
        <meshStandardMaterial color="#cdbfa6" roughness={0.95} />
      </RoundedBox>
      {/* folded throw at the foot */}
      <RoundedBox args={[2.95, 0.24, 0.9]} radius={0.1} smoothness={4} position={[0, 1.06, 2.0]} castShadow>
        <meshStandardMaterial color="#7a4a52" roughness={0.95} />
      </RoundedBox>

      {/* pillows */}
      <RoundedBox args={[1.35, 0.34, 0.7]} radius={0.14} smoothness={5} position={[-0.72, 1.14, -1.75]} rotation={[0, 0.08, 0]} castShadow>
        <meshStandardMaterial color="#e9dec9" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[1.35, 0.34, 0.7]} radius={0.14} smoothness={5} position={[0.72, 1.14, -1.75]} rotation={[0, -0.08, 0]} castShadow>
        <meshStandardMaterial color="#e9dec9" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.3, 0.55]} radius={0.12} smoothness={5} position={[0, 1.24, -1.4]} rotation={[0.12, 0, 0]} castShadow>
        <meshStandardMaterial color="#8a5a5a" roughness={0.9} />
      </RoundedBox>
    </group>
  );
}