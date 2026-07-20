'use client';

import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { TimeOfDay, SelectTarget } from './DeskScene';
import WindowCity from './WindowCity';
import { ALBUMS } from './musicData';

import { TOD, DESK_X, DESK_Z } from './room/constants';
import { makeWoodFloorCanvas, makeRugCanvas } from './room/textures';
import { CyberLights, NeonRing } from './room/Lighting';
import { BackWall, RightWall } from './room/Walls';
import { Desk, Chair, Bed } from './room/Furniture';
import { DeskLamp } from './room/DeskLamp';
import { Speaker, Headphones, Mug, DeskClock } from './room/DeskProps';
import { Shelf } from './room/Shelf';
import { Helmet, ShelfPlant, Sneaker } from './room/ShelfDecor';
import { PosterFrame, LavaLamp, IdeaBoard, FloorLamp } from './room/Decor';
import { RecordConsole, Turntable, AlbumStand } from './room/RecordCorner';
import { Laptop, Phone, Journal } from './room/Interactive';
import { RetroTV } from './room/RetroTV';

interface RoomSceneProps {
  timeOfDay: TimeOfDay;
  onSelect: (t: SelectTarget) => void;
  musicPlaying?: boolean;
  revealed?: boolean;
}

const _c = new THREE.Color();
const _v = new THREE.Vector3();

/* ---------- clickable affordance: subtle glowing, flickering ring + slow "ping" ---------- */
function ClickHint({
  position, color = '#00e5ff', radius = 0.2, visible = true,
}: {
  position: [number, number, number]; color?: string; radius?: number; visible?: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const pingRef = useRef<THREE.Mesh>(null);
  const pingMat = useRef<THREE.MeshBasicMaterial>(null);
  const vis = useRef(0);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.pow(0.02, Math.min(dt, 0.05));
    vis.current = THREE.MathUtils.lerp(vis.current, visible ? 1 : 0, k);

    // core ring — gentle breathing pulse + faint flicker
    const flick = 0.72 + Math.sin(t * 2.6 + position[0]) * 0.16 + (Math.random() - 0.5) * 0.06;
    if (ringMat.current) ringMat.current.opacity = vis.current * Math.max(0, flick) * 0.6;
    if (ringRef.current) ringRef.current.scale.setScalar(1 + Math.sin(t * 1.8 + position[2]) * 0.05);

    // expanding ripple that loops (radar-ping "click me")
    const rp = (t * 0.5 + position[0] * 0.13) % 1;
    if (pingRef.current) pingRef.current.scale.setScalar(1 + rp * 1.6);
    if (pingMat.current) pingMat.current.opacity = vis.current * (1 - rp) * 0.22;
  });

  return (
    <Billboard position={position}>
      <mesh ref={pingRef}>
        <ringGeometry args={[radius * 0.9, radius, 40]} />
        <meshBasicMaterial ref={pingMat} color={color} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[radius * 0.78, radius, 40]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </Billboard>
  );
}

/* ---------- scene root ---------- */

export default function RoomScene({ timeOfDay, onSelect, musicPlaying = false, revealed = false }: RoomSceneProps) {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const neonRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);
  const windowLightRef = useRef<THREE.PointLight>(null);
  const floorMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const accent = TOD[timeOfDay].accent;
  const isNight = timeOfDay === 'night';

  // dark-wood floor texture (tiled) + cozy woven rug texture (built once)
  const floorTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeWoodFloorCanvas());
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(4, 4);                // ← lower = wider planks, higher = more/tighter planks
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  const rugTex = useMemo(() => {
    const t = new THREE.CanvasTexture(makeRugCanvas());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);

  useEffect(() => () => { floorTex.dispose(); rugTex.dispose(); }, [floorTex, rugTex]);

  // album shown on the display stand — same as ALBUMS[0] but with a custom cover image.
  // file lives at public/assets/vinyl_cover.jpeg → served from /assets/vinyl_cover.jpeg
  const displayAlbum = useMemo(() => ({ ...ALBUMS[0], cover: '/assets/vinyl_cover.jpeg' }), []);

  useFrame((state, dt) => {
    const p = TOD[timeOfDay];
    const k = 1 - Math.pow(0.0016, Math.min(dt, 0.05));
    const { scene } = state;

    if (ambientRef.current) {
      ambientRef.current.color.lerp(_c.set(p.ambient.c), k);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, p.ambient.i, k);
    }
    if (dirRef.current) {
      dirRef.current.color.lerp(_c.set(p.dir.c), k);
      dirRef.current.intensity = THREE.MathUtils.lerp(dirRef.current.intensity, p.dir.i, k);
      dirRef.current.position.lerp(_v.set(p.dir.p[0], p.dir.p[1], p.dir.p[2]), k);
    }
    if (neonRef.current) {
      neonRef.current.color.lerp(_c.set(p.neon.c), k);
      neonRef.current.intensity = THREE.MathUtils.lerp(neonRef.current.intensity, p.neon.i, k);
    }
    if (fillRef.current) {
      fillRef.current.color.lerp(_c.set(p.fill.c), k);
      fillRef.current.intensity = THREE.MathUtils.lerp(fillRef.current.intensity, p.fill.i, k);
    }
    if (windowLightRef.current) {
      windowLightRef.current.color.lerp(_c.set(p.sky.c), k);
      windowLightRef.current.intensity = THREE.MathUtils.lerp(windowLightRef.current.intensity, p.sky.i * 1.6, k);
    }
    // floor turns glossy at night so the neon streaks across it (wet-street look)
    if (floorMatRef.current) {
      floorMatRef.current.roughness = THREE.MathUtils.lerp(floorMatRef.current.roughness, isNight ? 0.42 : 0.7, k);
      floorMatRef.current.metalness = THREE.MathUtils.lerp(floorMatRef.current.metalness, isNight ? 0.32 : 0.06, k);
    }
    if (scene.fog) (scene.fog as THREE.Fog).color.lerp(_c.set(p.fog), k);
    if (scene.background instanceof THREE.Color) scene.background.lerp(_c.set(p.fog), k);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.7} />
      <hemisphereLight args={['#3a3050', '#0a0812', 0.4]} />
      <directionalLight
        ref={dirRef} castShadow position={[-6, 8, 5]} intensity={1.4}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14} shadow-camera-right={14} shadow-camera-top={14} shadow-camera-bottom={-14}
        shadow-camera-near={0.5} shadow-camera-far={50} shadow-bias={-0.0004}
      />
      <pointLight ref={neonRef} position={[3, 3, 3]} intensity={1.0} distance={22} color="#00e5ff" />
      <pointLight ref={fillRef} position={[-4, 2.5, -3]} intensity={0.9} distance={18} color="#b060ff" />
      <pointLight ref={windowLightRef} position={[0, 4, -3]} intensity={1.2} distance={16} color="#00e5ff" />

      <pointLight position={[0, 5, 2]} intensity={2.2} distance={14} color="#cfe0ff" />

      {/* cyberpunk LED install on the window wall + the two subtle night wash lights */}
      <CyberLights timeOfDay={timeOfDay} />

      {/* floor — dark wood planks (glossy at night) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial ref={floorMatRef} map={floorTex} color="#ffffff" roughness={0.7} metalness={0.06} />
      </mesh>

      <BackWall />
      <WindowCity timeOfDay={timeOfDay} />
      <mesh position={[-8, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[28, 9]} /><meshStandardMaterial color="#283845" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <RightWall accent={accent} />

      {/* bed — bigger, headboard flush against the window wall */}
      <Bed accent={accent} />

      {/* neon idea/inspiration board above the bed — glows at night */}
      <IdeaBoard position={[-5.7, 3.75, -5.86]} timeOfDay={timeOfDay} w={2.4} h={1.6} />

      {/* floating shelf above the board + display pieces */}
      <Shelf position={[-5.7, 5.05, -5.5]} width={2.6} fixtures={3} reach={3.6} />
      <Helmet position={[-6.45, 5.43, -5.42]} rotation={[0, 0.7, 0]} />
      <ShelfPlant position={[-5.7, 5.11, -5.42]} />
      <Sneaker position={[-5.05, 5.11, -5.4]} rotation={[0, 0.5, 0]} />
      <Sneaker position={[-4.68, 5.11, -5.5]} rotation={[0, -0.35, 0]} />

      {/* two posters on the LEFT wall (x=-8), hung above the bed and rotated to face into the room.
          Drop PNGs into /public/art/ (poster-3.png / poster-4.png) and they'll replace the glow placeholders. */}
      <PosterFrame position={[-7.9, 3.7, -3.3]}  rotation={[0, Math.PI / 2, 0]} w={1.5} h={2.1} src="/art/poster-3.png" accent={accent} />
      <PosterFrame position={[-7.9, 3.7, -1.45]} rotation={[0, Math.PI / 2, 0]} w={1.5} h={2.1} src="/art/poster-4.png" accent={accent} />

      {/* two large poster frames filling the wall to the right of the desk.
          Drop PNGs into /public (e.g. public/art/poster-1.png) and set src below. */}
      <PosterFrame position={[4.75, 3.05, -5.8]} w={1.7} h={2.9} src="/art/poster-1.png" accent={accent} />
      <PosterFrame position={[6.65, 3.05, -5.8]} w={1.7} h={2.9} src="/art/poster-2.png" accent={accent} />
      {/* matching lit shelf above the frames (gallery-style down-lighting) */}
      <Shelf position={[5.7, 4.85, -5.5]} width={3.95} fixtures={4} reach={4.2} />
      {/* lava lamp on the right shelf — bubbles + glows only at night */}
      <LavaLamp position={[6.6, 4.91, -5.45]} timeOfDay={timeOfDay} scale={0.72} color="#c85f1e" blobColor="#e8451e" glowColor="#ffb42a" />

      {/* === RECORD CORNER — right wall, back section (clear of the door) ===
          Move/rotate the whole thing with this group's position + rotation. */}
      <group position={[7.35, 0, -3.9]} rotation={[0, -Math.PI / 2, 0]}>
        <RecordConsole />
        <Turntable musicPlaying={musicPlaying} onSelect={() => onSelect('music')} />
        {/* single album on a display stand beside the turntable — faces into the room */}
        <AlbumStand album={displayAlbum} position={[0.97, 1.45, 0]} rotation={[0, -0.1, 0]} size={0.74} />
        {/* clickable-affordance ring above the turntable */}
        <ClickHint position={[0, 2.05, 0.02]} color="#b060ff" radius={0.24} visible={revealed} />
      </group>

      {/* floor lamp right beside the record console — wooden tripod, warm glow at night */}
      <FloorLamp position={[7.0, 0, -1.4]} timeOfDay={timeOfDay} scale={1} />

      {/* retro game-station showreel — front-left */}
      <RetroTV position={[-5.4, 0, 2.4]} rotation={[0, 0.5, 0]} timeOfDay={timeOfDay} scale={1.0}
        onSelect={() => onSelect('tv')} />
      {/* clickable-affordance ring above the retro TV */}
      <ClickHint position={[-5.4, 2.55, 2.4]} color="#3ea9ff" radius={0.28} visible={revealed} />

      {/* desk cluster — centered (x=0), pushed toward the window wall (DESK_Z) */}
      <group position={[DESK_X, 0, DESK_Z]}>
        {/* cozy woven area rug — bigger now (travels with the desk area) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 1.4]} receiveShadow>
          <circleGeometry args={[5.6, 64]} />
          <meshStandardMaterial map={rugTex} color="#ffffff" roughness={0.95} metalness={0} />
        </mesh>
        {/* subtle neon piping around the rug — glows only at night */}
        <NeonRing radius={5.6} tube={0.03} color="#00e5ff" position={[0, 0.02, 1.4]} rotation={[-Math.PI / 2, 0, 0]} night={isNight} nightI={0.9} dayI={0} />

        <Desk />
        <Chair accent={accent} />
        <Speaker x={-3.1} accent={accent} />
        <Speaker x={3.1} accent={accent} />
        <Headphones />
        <Mug accent={accent} />
        <DeskClock accent={accent} />
        <DeskLamp timeOfDay={timeOfDay} />

        <Laptop accent={accent} onSelect={() => onSelect('laptop')} />
        <Phone onSelect={() => onSelect('phone')} />
        <Journal onSelect={() => onSelect('journal')} />

        {/* clickable-affordance rings — fade in once the room is revealed (positions are local to the desk group) */}
        <ClickHint position={[0, 1.98, 0.12]}  color="#00e5ff" radius={0.26} visible={revealed} />
        <ClickHint position={[2.2, 1.82, 0.7]} color="#ff2d78" radius={0.16} visible={revealed} />
        <ClickHint position={[-2.1, 1.8, 0.55]} color="#ffb347" radius={0.18} visible={revealed} />
      </group>
    </>
  );
}