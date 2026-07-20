'use client';

import React, { useMemo, useEffect } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useHover, Label } from './shared';
import { DESK_TOP } from './constants';

export function Laptop({ accent, onSelect }: { accent: string; onSelect: () => void }) {
  const { hovered, bind } = useHover();

  // brand glyph → canvas → real mesh on the screen (depth-tested, no DOM overlay)
  const logoTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 256);
    ctx.fillStyle = 'rgba(10,12,20,0.4)';
    ctx.font = 'bold 190px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('彩', 128, 140);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => logoTex.dispose(), [logoTex]);

  return (
    <group position={[0, DESK_TOP, 0.15]} scale={hovered ? 1.04 : 1} {...bind}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[1.9, 0.08, 1.25]} radius={0.03} smoothness={3} castShadow>
        <meshStandardMaterial color="#14161f" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      <group position={[0, 0.66, -0.58]} rotation={[-0.28, 0, 0]}>
        <RoundedBox args={[1.9, 1.24, 0.06]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color="#0b0d14" metalness={0.6} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.68, 1.04]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={hovered ? 1.7 : 0.9} toneMapped={false} />
        </mesh>
        {/* logo just in front of the screen; depth-tested so it never bleeds over other objects */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[0.62, 0.62]} />
          <meshBasicMaterial map={logoTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      {hovered && <Label text="Open laptop" position={[0, 1.7, -0.3]} />}
    </group>
  );
}

export function Phone({ onSelect }: { onSelect: () => void }) {
  const { hovered, bind } = useHover();
  const pink = '#ff2d78';
  const S = 0.7;                      // base scale — shrink the phone
  return (
    <group position={[2.2, DESK_TOP + 0.03, 0.7]} rotation={[-Math.PI / 2, 0, -0.25]}
      scale={hovered ? S * 1.07 : S} {...bind}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[0.6, 1.2, 0.05]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#0c0e16" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.5, 1.08]} />
        <meshStandardMaterial color={pink} emissive={pink} emissiveIntensity={hovered ? 1.7 : 0.9} toneMapped={false} />
      </mesh>
      {hovered && <Label text="Open phone" position={[0, 0, 1.1]} />}
    </group>
  );
}

export function Journal({ onSelect }: { onSelect: () => void }) {
  const { hovered, bind } = useHover();
  const S = 0.68;                     // base scale — shrink the journal
  return (
    <group position={[-2.1, DESK_TOP + 0.02, 0.55]} rotation={[-Math.PI / 2, 0, 0.12]}
      scale={hovered ? S * 1.05 : S} {...bind}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <RoundedBox args={[1.4, 1.8, 0.16]} radius={0.04} smoothness={3} castShadow>
        <meshStandardMaterial color="#caa15a" roughness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0, 0.09]}><planeGeometry args={[1.24, 1.6]} /><meshStandardMaterial color="#efdba8" roughness={0.9} /></mesh>
      <mesh position={[-0.6, 0, 0.09]}><planeGeometry args={[0.12, 1.6]} /><meshStandardMaterial color="#a87830" roughness={0.8} /></mesh>
      {hovered && <Label text="Open journal" position={[0, 0, 1.2]} />}
    </group>
  );
}