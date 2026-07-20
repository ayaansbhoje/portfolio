'use client';

import React, { useState, useEffect } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { DESK_TOP } from './constants';

export function Speaker({ x, accent }: { x: number; accent: string }) {
  return (
    <group position={[x, DESK_TOP, -0.5]}>
      <RoundedBox args={[0.7, 1.0, 0.6]} radius={0.05} position={[0, 0.5, 0]} castShadow>
        <meshStandardMaterial color="#171021" roughness={0.7} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.62, 0.31]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 20]} /><meshStandardMaterial color="#0a0810" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.28, 0.31]}>
        <circleGeometry args={[0.06, 16]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Headphones() {
  return (
    <group position={[-1.0, DESK_TOP + 0.05, 1.0]} rotation={[Math.PI / 2, 0, 0.3]}>
      <mesh castShadow><torusGeometry args={[0.32, 0.05, 12, 40, Math.PI]} /><meshStandardMaterial color="#12151f" metalness={0.5} roughness={0.4} /></mesh>
      <mesh position={[-0.32, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.1, 20]} /><meshStandardMaterial color="#0b0d14" /></mesh>
      <mesh position={[0.32, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.1, 20]} /><meshStandardMaterial color="#0b0d14" /></mesh>
    </group>
  );
}

export function Mug({ accent }: { accent: string }) {
  return (
    <group position={[2.5, DESK_TOP, -0.15]}>
      <mesh position={[0, 0.22, 0]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.44, 24]} /><meshStandardMaterial color="#12151f" roughness={0.5} metalness={0.2} /></mesh>
      <mesh position={[0, 0.43, 0]}><cylinderGeometry args={[0.17, 0.17, 0.02, 24]} /><meshStandardMaterial color="#2a0f08" roughness={0.3} /></mesh>
      <mesh position={[0.24, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.1, 0.03, 10, 24, Math.PI]} /><meshStandardMaterial color="#12151f" /></mesh>
      <mesh position={[0, 0.18, 0.201]}><planeGeometry args={[0.22, 0.1]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.8} toneMapped={false} /></mesh>
    </group>
  );
}

export function DeskClock({ accent }: { accent: string }) {
  const [t, setT] = useState('');
  const [date, setDate] = useState('');
  const [colon, setColon] = useState(true);
  useEffect(() => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const upd = () => {
      const n = new Date();
      setT(`${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`);
      setDate(`${months[n.getMonth()]} ${String(n.getDate()).padStart(2, '0')}`);
    };
    upd();
    const a = setInterval(upd, 1000);
    const b = setInterval(() => setColon(c => !c), 500);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  const disp = colon ? t : t.replace(':', ' ');
  return (
    <group position={[1.5, DESK_TOP, -0.55]} rotation={[-0.15, -0.5, 0]}>
      <RoundedBox args={[1.0, 0.72, 0.14]} radius={0.06} smoothness={4} position={[0, 0.36, 0]} castShadow>
        <meshStandardMaterial color="#0a0c14" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {/* time + date as real 3D text; glow comes from an explicit unlit material
          (toneMapped is a material prop, not a <Text> prop, so it lives here) */}
      <Text position={[0, 0.42, 0.08]} fontSize={0.2} anchorX="center" anchorY="middle" letterSpacing={0.06}>
        {disp}
        <meshBasicMaterial color={accent} toneMapped={false} />
      </Text>
      <Text position={[0, 0.23, 0.08]} fontSize={0.075} anchorX="center" anchorY="middle" letterSpacing={0.25}>
        {date}
        <meshBasicMaterial color={accent} transparent opacity={0.7} toneMapped={false} />
      </Text>
    </group>
  );
}