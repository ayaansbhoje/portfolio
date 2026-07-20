'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TimeOfDay } from '../DeskScene';
import { DESK_TOP } from './constants';

/* ---------- desk lamp (auto-on at night, scaled up) ---------- */

export function DeskLamp({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const emitRef = useRef<THREE.MeshStandardMaterial>(null);
  const warm = '#ffb877';
  const on = timeOfDay === 'night';

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    if (lightRef.current) lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, on ? 5.0 : 0, k);
    if (emitRef.current) emitRef.current.emissiveIntensity = THREE.MathUtils.lerp(emitRef.current.emissiveIntensity, on ? 2.6 : 0.04, k);
  });

  const frameMat = <meshStandardMaterial color="#17131d" metalness={0.55} roughness={0.4} />;

  return (
    <group position={[-2.5, DESK_TOP, -1.05]} scale={1.2}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.27, 0.055, 40]} />
        <meshStandardMaterial color="#17131d" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.062, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.014, 40]} />
        <meshStandardMaterial color="#0d0b12" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.33, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.033, 0.55, 20]} />{frameMat}
      </mesh>
      <mesh position={[0, 0.585, 0]}><sphereGeometry args={[0.05, 20, 20]} />{frameMat}</mesh>
      <mesh position={[0, 0.93, 0.29]} rotation={[0.7, 0, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.026, 0.9, 20]} />{frameMat}
      </mesh>
      <mesh position={[0, 1.27, 0.58]}><sphereGeometry args={[0.05, 20, 20]} />{frameMat}</mesh>
      <mesh position={[0, 1.093, 0.882]} rotation={[2.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.7, 20]} />{frameMat}
      </mesh>
      <group position={[0, 0.916, 1.184]}>
        <mesh castShadow rotation={[0.15, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.18, 0.22, 28, 1, true]} />
          <meshStandardMaterial color="#1a1620" metalness={0.5} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.1, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.155, 28]} />
          <meshStandardMaterial ref={emitRef} color="#2a1c10" emissive={warm} emissiveIntensity={0.04} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={lightRef} position={[0, 0.8, 1.12]} intensity={0} distance={16} decay={1.6} color={warm} />
    </group>
  );
}