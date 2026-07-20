'use client';

import React, { Suspense, useRef, useLayoutEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import RoomScene from './RoomScene';
import type { TimeOfDay, SelectTarget } from './DeskScene';

interface RoomCanvasProps {
  timeOfDay: TimeOfDay;
  onSelect: (t: SelectTarget) => void;
  musicPlaying?: boolean;
  introRef: React.MutableRefObject<number>;   // 0..1 scroll progress
  introComplete: boolean;
  onIntroComplete: () => void;
}

/* ── cinematic intro keyframes — tune these two poses to taste ──
   CLOSE = tight on the desk (all desk objects visible)
   WIDE  = whole room (this MUST match OrbitControls' start pose) */
const CLOSE_POS = new THREE.Vector3(1.4, 2.5, 3.4);
const CLOSE_TGT = new THREE.Vector3(0, 1.75, -1.9);
const WIDE_POS  = new THREE.Vector3(7, 4.5, 10);
const WIDE_TGT  = new THREE.Vector3(0, 1.5, 0);

function IntroRig({ progressRef, onComplete, active }: {
  progressRef: React.MutableRefObject<number>; onComplete: () => void; active: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const eased = useRef(0);
  const done = useRef(false);
  const p = useRef(new THREE.Vector3());
  const g = useRef(new THREE.Vector3());

  // start exactly on the close shot (no first-frame flash)
  useLayoutEffect(() => {
    if (done.current) return;
    camera.position.copy(CLOSE_POS);
    camera.lookAt(CLOSE_TGT);
  }, [camera]);

  useFrame((_, dt) => {
    if (done.current || !active) return;
    // ease our own value toward the raw scroll target → buttery even if scroll is jumpy
    const k = 1 - Math.pow(0.015, Math.min(dt, 0.05));
    eased.current = THREE.MathUtils.lerp(eased.current, progressRef.current, k);
    const t = THREE.MathUtils.smootherstep(eased.current, 0, 1);

    p.current.lerpVectors(CLOSE_POS, WIDE_POS, t);
    g.current.lerpVectors(CLOSE_TGT, WIDE_TGT, t);
    camera.position.copy(p.current);
    camera.lookAt(g.current);

    // latch + hand off once fully scrolled and settled
    if (progressRef.current >= 1 && eased.current > 0.992) {
      camera.position.copy(WIDE_POS);
      camera.lookAt(WIDE_TGT);
      done.current = true;
      onComplete();
    }
  });
  return null;
}

export default function RoomCanvas({
  timeOfDay, onSelect, musicPlaying = false, introRef, introComplete, onIntroComplete,
}: RoomCanvasProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', display: 'block', background: 'transparent' }}
        onCreated={({ gl }) => { gl.toneMappingExposure = 1.2; }}
      >
        <fog attach="fog" args={['#08060f', 22, 55]} />

        <PerspectiveCamera makeDefault position={[1.4, 2.5, 3.4]} fov={42} />

        {/* OrbitControls only exists AFTER the intro — avoids it fighting the rig */}
        {introComplete && (
          <OrbitControls
            makeDefault
            target={[0, 1.5, 0]}
            enablePan={false}
            enableZoom
            minDistance={7}
            maxDistance={14}
            minPolarAngle={0.8}
            maxPolarAngle={1.45}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
            enableDamping
            dampingFactor={0.08}
          />
        )}

        <IntroRig progressRef={introRef} onComplete={onIntroComplete} active={!introComplete} />

        <Suspense fallback={null}>
          <RoomScene
            timeOfDay={timeOfDay}
            onSelect={onSelect}
            musicPlaying={musicPlaying}
            revealed={introComplete}
          />
          <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={26} blur={2.6} far={7} />
        </Suspense>

        <EffectComposer>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.6} luminanceSmoothing={0.2} />
          <Vignette offset={0.3} darkness={0.65} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}