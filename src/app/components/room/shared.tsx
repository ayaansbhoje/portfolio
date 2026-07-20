'use client';

import React, { useState } from 'react';
import { Html } from '@react-three/drei';

export function useHover() {
  const [hovered, setHovered] = useState(false);
  const bind = {
    onPointerOver: (e: any) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; },
    onPointerOut:  (e: any) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; },
  };
  return { hovered, bind };
}

export function Label({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html center distanceFactor={8} position={position} style={{ pointerEvents: 'none' }}>
      <div style={{
        fontFamily: 'monospace', fontSize: 13, letterSpacing: '0.08em', color: '#e6f7ff',
        background: 'rgba(10,12,22,0.85)', border: '1px solid rgba(0,229,255,0.5)',
        borderRadius: 999, padding: '4px 10px', whiteSpace: 'nowrap',
        boxShadow: '0 0 12px rgba(0,229,255,0.4)',
      }}>{text}</div>
    </Html>
  );
}