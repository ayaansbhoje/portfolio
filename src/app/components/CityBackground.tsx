'use client';

import React, { useEffect, useRef } from 'react';

type TimeOfDay = 'morning' | 'afternoon' | 'night';

interface CityBackgroundProps {
  timeOfDay: TimeOfDay;
}

// Bird SVG path component
function Bird({ x, y, scale = 1, opacity = 0.8 }: { x: number; y: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <path d="M0,0 Q5,-6 10,-2 Q15,-8 20,0" stroke="#2d1a0a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

export default function CityBackground({ timeOfDay }: CityBackgroundProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const birdsIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Bird chirp sound for morning
  useEffect(() => {
    if (timeOfDay === 'morning') {
      const playChirp = () => {
        try {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') ctx.resume();

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);

          const baseFreq = 800 + Math.random() * 400;
          osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.08);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, ctx.currentTime + 0.18);
          osc.type = 'sine';

          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.12);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.25);
        } catch (_) {}
      };

      birdsIntervalRef.current = setInterval(() => {
        if (Math.random() > 0.4) playChirp();
      }, 1800);
    } else {
      if (birdsIntervalRef.current) {
        clearInterval(birdsIntervalRef.current);
        birdsIntervalRef.current = null;
      }
    }
    return () => {
      if (birdsIntervalRef.current) clearInterval(birdsIntervalRef.current);
    };
  }, [timeOfDay]);

  // Sky gradients per time of day
  const skyGradient = {
    morning: 'linear-gradient(180deg, #1a3a6e 0%, #2e5fa0 8%, #4a8ac8 18%, #7ab8e0 28%, #a8d4f0 38%, #f0c060 50%, #f5a030 60%, #e87840 68%, #c05060 78%, #3d1060 90%, #1a0830 100%)',
    afternoon: 'linear-gradient(180deg, #1a2a5e 0%, #2a4a8a 8%, #3a6aaa 18%, #5090c8 30%, #70b0e0 42%, #90c8f0 52%, #b8daf8 62%, #d0e8f8 72%, #e8f4fc 80%, #c8d8f0 88%, #8090b8 100%)',
    night: 'linear-gradient(180deg, #1a0830 0%, #2e0d5c 10%, #5c1a7a 22%, #9b3a7a 35%, #d4607a 46%, #e8855a 55%, #f0a060 62%, #e88050 68%, #c05070 76%, #3d1060 88%, #1a0830 100%)',
  };

  const sunColor = {
    morning: 'radial-gradient(circle, #fff8e0 0%, #ffe8a0 25%, #ffcc60 55%, rgba(255,180,60,0.5) 80%, transparent 100%)',
    afternoon: 'radial-gradient(circle, #ffffff 0%, #fff8e0 20%, #ffe8b0 50%, rgba(255,220,140,0.5) 80%, transparent 100%)',
    night: 'radial-gradient(circle, #fff5d0 0%, #ffe090 30%, #ffb347 60%, rgba(255,140,60,0.5) 80%, transparent 100%)',
  };

  const sunTop = { morning: '55%', afternoon: '28%', night: '42%' };
  const sunSize = { morning: '90px', afternoon: '80px', night: '110px' };

  const sunGlowColor = {
    morning: 'rgba(255,220,100,0.3) 0%, rgba(255,180,60,0.18) 35%, rgba(255,120,40,0.08) 60%, transparent 80%',
    afternoon: 'rgba(255,255,220,0.25) 0%, rgba(255,230,160,0.15) 35%, rgba(255,200,100,0.06) 60%, transparent 80%',
    night: 'rgba(255,220,140,0.18) 0%, rgba(255,160,80,0.12) 35%, rgba(255,100,80,0.06) 60%, transparent 80%',
  };

  const buildingFarColor = {
    morning: ['#4a6a9a', '#2a4a7a'],
    afternoon: ['#3a5a8a', '#1a3a6a'],
    night: ['#3d1a6e', '#1a0a2e'],
  };

  const buildingMidColor = {
    morning: ['#3a5080', '#1e3060'],
    afternoon: ['#2a4070', '#102050'],
    night: ['#4a2080', '#2d1060'],
  };

  const isMorning = timeOfDay === 'morning';
  const isAfternoon = timeOfDay === 'afternoon';
  const isNight = timeOfDay === 'night';

  // Bird positions for morning animation
  const birdGroups = [
    { birds: [{ x: 0, y: 0 }, { x: 25, y: -8 }, { x: 50, y: 3 }, { x: 75, y: -5 }], startX: -100, endX: 1600, y: 80, duration: 18, delay: 0 },
    { birds: [{ x: 0, y: 0 }, { x: 20, y: -6 }, { x: 40, y: 2 }], startX: -80, endX: 1600, y: 130, duration: 22, delay: 4 },
    { birds: [{ x: 0, y: 0 }, { x: 30, y: -10 }, { x: 60, y: 4 }, { x: 90, y: -7 }, { x: 120, y: 2 }], startX: -150, endX: 1600, y: 60, duration: 16, delay: 8 },
  ];

  return (
    <div className="absolute inset-0 z-0">
      {/* === SKY GRADIENT === */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: skyGradient[timeOfDay] }}
      />

      {/* Morning: soft haze overlay */}
      {isMorning && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(255,240,200,0.12) 0%, rgba(255,200,100,0.08) 40%, transparent 70%)',
        }} />
      )}

      {/* Afternoon: bright sky overlay */}
      {isAfternoon && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(180,220,255,0.15) 0%, rgba(200,230,255,0.1) 50%, transparent 80%)',
        }} />
      )}

      {/* Sun glow halo */}
      <div className="absolute transition-all duration-1000" style={{
        left: '50%',
        top: sunTop[timeOfDay],
        transform: 'translate(-50%, -50%)',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${sunGlowColor[timeOfDay]})`,
        pointerEvents: 'none',
      }} />

      {/* Sun disc */}
      <div className="absolute transition-all duration-1000" style={{
        left: '50%',
        top: sunTop[timeOfDay],
        transform: 'translate(-50%, -50%)',
        width: sunSize[timeOfDay],
        height: sunSize[timeOfDay],
        borderRadius: '50%',
        background: sunColor[timeOfDay],
        boxShadow: isMorning
          ? '0 0 30px 15px rgba(255,200,80,0.4), 0 0 60px 30px rgba(255,160,60,0.2)'
          : isAfternoon
          ? '0 0 40px 20px rgba(255,240,200,0.5), 0 0 80px 40px rgba(255,220,160,0.25)'
          : '0 0 40px 20px rgba(255,190,80,0.35), 0 0 80px 40px rgba(255,140,60,0.18)',
      }} />

      {/* Morning: sun rays */}
      {isMorning && (
        <div className="absolute pointer-events-none" style={{
          left: '50%', top: '55%', transform: 'translate(-50%, -50%)',
          width: '500px', height: '500px',
        }}>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
            <div key={angle} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '2px', height: '200px',
              background: 'linear-gradient(180deg, rgba(255,220,100,0.25) 0%, transparent 100%)',
              transformOrigin: '50% 0%',
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }} />
          ))}
        </div>
      )}

      {/* Afternoon: clouds */}
      {isAfternoon && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '10%', top: '15%', w: '120px', opacity: 0.7 },
            { left: '35%', top: '8%', w: '160px', opacity: 0.6 },
            { left: '65%', top: '12%', w: '140px', opacity: 0.65 },
            { left: '80%', top: '20%', w: '100px', opacity: 0.55 },
          ].map((cloud, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: cloud.left, top: cloud.top,
              width: cloud.w,
              opacity: cloud.opacity,
            }}>
              <svg viewBox="0 0 120 50" style={{ width: '100%' }}>
                <ellipse cx="60" cy="35" rx="55" ry="18" fill="rgba(255,255,255,0.85)" />
                <ellipse cx="40" cy="28" rx="30" ry="20" fill="rgba(255,255,255,0.9)" />
                <ellipse cx="75" cy="25" rx="28" ry="18" fill="rgba(255,255,255,0.88)" />
                <ellipse cx="55" cy="20" rx="22" ry="16" fill="rgba(255,255,255,0.92)" />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Morning: flying birds */}
      {isMorning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {birdGroups.map((group, gi) => (
            <div key={gi} style={{
              position: 'absolute',
              top: `${group.y}px`,
              left: 0,
              animation: `flyBirds${gi} ${group.duration}s linear ${group.delay}s infinite`,
            }}>
              <svg width="200" height="40" viewBox="0 0 200 40" style={{ overflow: 'visible' }}>
                {group.birds.map((b, bi) => (
                  <Bird key={bi} x={b.x} y={20 + b.y} scale={0.9 + bi * 0.05} opacity={0.75} />
                ))}
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Horizon glow band */}
      <div className="absolute transition-all duration-1000" style={{
        left: 0, right: 0, top: '55%', height: '80px',
        background: isMorning
          ? 'linear-gradient(180deg, rgba(255,180,80,0.3) 0%, rgba(255,120,60,0.15) 50%, transparent 100%)'
          : isAfternoon
          ? 'linear-gradient(180deg, rgba(255,200,120,0.2) 0%, rgba(255,160,80,0.1) 50%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(255,140,80,0.25) 0%, rgba(200,80,100,0.15) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* === CITY SKYLINE === */}
      <svg
        className="absolute"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ bottom: '30%', left: 0, width: '100%', height: '45%' }}
      >
        <defs>
          <linearGradient id="buildingFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={buildingFarColor[timeOfDay][0]} />
            <stop offset="100%" stopColor={buildingFarColor[timeOfDay][1]} />
          </linearGradient>
          <linearGradient id="buildingMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={buildingMidColor[timeOfDay][0]} />
            <stop offset="100%" stopColor={buildingMidColor[timeOfDay][1]} />
          </linearGradient>
          <linearGradient id="buildingNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isNight ? '#2a1050' : isAfternoon ? '#1a2a50' : '#2a3060'} />
            <stop offset="100%" stopColor={isNight ? '#0f0620' : isAfternoon ? '#0a1030' : '#101828'} />
          </linearGradient>
        </defs>

        {/* Far background buildings */}
        <rect x="0" y="220" width="55" height="180" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="50" y="170" width="38" height="230" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="83" y="240" width="48" height="160" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="126" y="150" width="32" height="250" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="153" y="190" width="52" height="210" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="200" y="130" width="42" height="270" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="237" y="175" width="58" height="225" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="290" y="110" width="48" height="290" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="333" y="160" width="38" height="240" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="366" y="200" width="65" height="200" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="426" y="120" width="52" height="280" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="473" y="165" width="42" height="235" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="510" y="90" width="62" height="310" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="567" y="140" width="48" height="260" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="610" y="180" width="38" height="220" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="643" y="100" width="58" height="300" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="696" y="150" width="52" height="250" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="743" y="120" width="42" height="280" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="780" y="80" width="68" height="320" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="843" y="160" width="48" height="240" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="886" y="190" width="58" height="210" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="939" y="110" width="42" height="290" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="976" y="150" width="52" height="250" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="1023" y="130" width="48" height="270" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="1066" y="170" width="62" height="230" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="1123" y="100" width="52" height="300" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="1170" y="140" width="48" height="260" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="1213" y="180" width="58" height="220" fill="url(#buildingFar)" opacity="0.6" />
        <rect x="1266" y="120" width="52" height="280" fill="url(#buildingFar)" opacity="0.7" />
        <rect x="1313" y="160" width="48" height="240" fill="url(#buildingFar)" opacity="0.65" />
        <rect x="1356" y="100" width="84" height="300" fill="url(#buildingFar)" opacity="0.7" />

        {/* Mid buildings */}
        <rect x="0" y="250" width="70" height="150" fill="url(#buildingMid)" />
        <rect x="65" y="200" width="50" height="200" fill="url(#buildingMid)" />
        <rect x="110" y="230" width="60" height="170" fill="url(#buildingMid)" />
        <rect x="165" y="180" width="45" height="220" fill="url(#buildingMid)" />
        <rect x="205" y="210" width="70" height="190" fill="url(#buildingMid)" />
        <rect x="270" y="160" width="55" height="240" fill="url(#buildingMid)" />
        <rect x="320" y="190" width="65" height="210" fill="url(#buildingMid)" />
        <rect x="380" y="140" width="60" height="260" fill="url(#buildingMid)" />
        <rect x="435" y="170" width="50" height="230" fill="url(#buildingMid)" />
        <rect x="480" y="200" width="80" height="200" fill="url(#buildingMid)" />
        <rect x="555" y="130" width="65" height="270" fill="url(#buildingMid)" />
        <rect x="615" y="160" width="55" height="240" fill="url(#buildingMid)" />
        <rect x="665" y="110" width="75" height="290" fill="url(#buildingMid)" />
        <rect x="735" y="150" width="60" height="250" fill="url(#buildingMid)" />
        <rect x="790" y="180" width="50" height="220" fill="url(#buildingMid)" />
        <rect x="835" y="120" width="70" height="280" fill="url(#buildingMid)" />
        <rect x="900" y="160" width="60" height="240" fill="url(#buildingMid)" />
        <rect x="955" y="190" width="75" height="210" fill="url(#buildingMid)" />
        <rect x="1025" y="140" width="55" height="260" fill="url(#buildingMid)" />
        <rect x="1075" y="170" width="65" height="230" fill="url(#buildingMid)" />
        <rect x="1135" y="120" width="70" height="280" fill="url(#buildingMid)" />
        <rect x="1200" y="160" width="60" height="240" fill="url(#buildingMid)" />
        <rect x="1255" y="190" width="75" height="210" fill="url(#buildingMid)" />
        <rect x="1325" y="140" width="55" height="260" fill="url(#buildingMid)" />
        <rect x="1375" y="170" width="65" height="230" fill="url(#buildingMid)" />

        {/* Antenna spires */}
        <line x1="310" y1="160" x2="310" y2="100" stroke={isNight ? '#4a2080' : '#3a5080'} strokeWidth="2.5" />
        <circle cx="310" cy="98" r="4" fill={isNight ? '#FF2D78' : '#ff8844'} opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <line x1="555" y1="130" x2="555" y2="70" stroke={isNight ? '#3d1a6e' : '#2a4070'} strokeWidth="2" />
        <circle cx="555" cy="68" r="3.5" fill={isNight ? '#00F5FF' : '#ffcc44'} opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2s" repeatCount="indefinite" />
        </circle>
        <line x1="780" y1="80" x2="780" y2="20" stroke={isNight ? '#4a2080' : '#3a5080'} strokeWidth="2.5" />
        <circle cx="780" cy="18" r="4" fill={isNight ? '#FF2D78' : '#ff8844'} opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <line x1="1135" y1="120" x2="1135" y2="55" stroke={isNight ? '#3d1a6e' : '#2a4070'} strokeWidth="2" />
        <circle cx="1135" cy="53" r="3.5" fill={isNight ? '#00F5FF' : '#ffcc44'} opacity="0.9">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.2s" repeatCount="indefinite" />
        </circle>

        {/* Building windows - warm lit (night/morning) or daylight (afternoon) */}
        {[170, 190, 210, 230, 250, 270].map(y =>
          [275, 295, 315, 335].map(x => (
            <rect key={`wa-${x}-${y}`} x={x} y={y} width="5" height="5"
              fill={isAfternoon ? 'rgba(200,220,255,0.3)' : '#FFB347'} opacity={isAfternoon ? 0.3 : 0.55} rx="0.5" />
          ))
        )}
        {[130, 150, 170, 190, 210, 230, 250].map(y =>
          [560, 580, 600].map(x => (
            <rect key={`wb-${x}-${y}`} x={x} y={y} width="5" height="5"
              fill={isAfternoon ? 'rgba(200,220,255,0.3)' : '#FFB347'} opacity={isAfternoon ? 0.25 : 0.5} rx="0.5" />
          ))
        )}
        {[120, 140, 160, 180, 200, 220].map(y =>
          [840, 860, 880].map(x => (
            <rect key={`wc-${x}-${y}`} x={x} y={y} width="5" height="5"
              fill={isNight ? '#00F5FF' : isAfternoon ? 'rgba(200,220,255,0.3)' : '#FFD080'} opacity={isAfternoon ? 0.25 : 0.4} rx="0.5" />
          ))
        )}
        {[130, 150, 170, 190, 210].map(y =>
          [1140, 1160, 1180].map(x => (
            <rect key={`wd-${x}-${y}`} x={x} y={y} width="5" height="5"
              fill={isAfternoon ? 'rgba(200,220,255,0.3)' : '#FFB347'} opacity={isAfternoon ? 0.25 : 0.45} rx="0.5" />
          ))
        )}

        {/* Neon signs - only visible at night */}
        {isNight && <>
          <rect x="280" y="165" width="16" height="50" rx="2" fill="none" stroke="#FF2D78" strokeWidth="2" opacity="0.85">
            <animate attributeName="opacity" values="0.85;0.3;0.85;0.9;0.85" dur="4s" repeatCount="indefinite" />
          </rect>
          <rect x="570" y="135" width="16" height="55" rx="2" fill="none" stroke="#00F5FF" strokeWidth="2" opacity="0.85">
            <animate attributeName="opacity" values="0.85;0.9;0.4;0.9;0.85" dur="3.5s" repeatCount="indefinite" />
          </rect>
          <rect x="845" y="125" width="14" height="50" rx="2" fill="none" stroke="#FF2D78" strokeWidth="2" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="5s" repeatCount="indefinite" />
          </rect>
          <rect x="1145" y="125" width="16" height="52" rx="2" fill="none" stroke="#00F5FF" strokeWidth="2" opacity="0.85">
            <animate attributeName="opacity" values="0.85;0.4;0.85" dur="4.5s" repeatCount="indefinite" />
          </rect>
        </>}

        {/* Ground fill */}
        <rect x="0" y="390" width="1440" height="10" fill={isNight ? '#0d0618' : isAfternoon ? '#0a1828' : '#0d1828'} />
      </svg>

      {/* === WINDOW FRAME === */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 bottom-0" style={{
          width: '13%',
          background: isNight
            ? 'linear-gradient(90deg, #120828 0%, rgba(18,8,40,0.92) 50%, rgba(18,8,40,0.4) 80%, transparent 100%)'
            : isAfternoon
            ? 'linear-gradient(90deg, #0a1828 0%, rgba(10,24,40,0.92) 50%, rgba(10,24,40,0.4) 80%, transparent 100%)'
            : 'linear-gradient(90deg, #0d1828 0%, rgba(13,24,40,0.92) 50%, rgba(13,24,40,0.4) 80%, transparent 100%)',
        }} />
        <div className="absolute right-0 top-0 bottom-0" style={{
          width: '13%',
          background: isNight
            ? 'linear-gradient(270deg, #120828 0%, rgba(18,8,40,0.92) 50%, rgba(18,8,40,0.4) 80%, transparent 100%)'
            : isAfternoon
            ? 'linear-gradient(270deg, #0a1828 0%, rgba(10,24,40,0.92) 50%, rgba(10,24,40,0.4) 80%, transparent 100%)'
            : 'linear-gradient(270deg, #0d1828 0%, rgba(13,24,40,0.92) 50%, rgba(13,24,40,0.4) 80%, transparent 100%)',
        }} />
        <div className="absolute top-0 left-0 right-0" style={{
          height: '7%',
          background: isNight
            ? 'linear-gradient(180deg, #120828 0%, rgba(18,8,40,0.7) 60%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(10,20,40,0.9) 0%, rgba(10,20,40,0.6) 60%, transparent 100%)',
        }} />
        <div className="absolute" style={{
          left: '50%', top: '7%', bottom: '32%',
          width: '4px',
          background: isNight
            ? 'linear-gradient(180deg, rgba(18,8,40,0.95), rgba(30,12,60,0.8))'
            : 'linear-gradient(180deg, rgba(10,20,40,0.95), rgba(20,30,60,0.8))',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        }} />
        <div className="absolute" style={{
          left: '13%', right: '13%', top: '38%',
          height: '4px',
          background: isNight ? 'rgba(18,8,40,0.9)' : 'rgba(10,20,40,0.85)',
          boxShadow: '0 0 8px rgba(0,0,0,0.5)',
        }} />
        <div className="absolute" style={{
          left: '13%', top: '7%', bottom: '32%',
          width: '2px',
          background: isMorning
            ? 'linear-gradient(180deg, rgba(255,220,100,0.2), rgba(255,160,80,0.1), transparent)'
            : isAfternoon
            ? 'linear-gradient(180deg, rgba(255,240,200,0.15), rgba(255,200,120,0.08), transparent)'
            : 'linear-gradient(180deg, rgba(255,160,80,0.15), rgba(255,100,80,0.08), transparent)',
        }} />
        <div className="absolute" style={{
          right: '13%', top: '7%', bottom: '32%',
          width: '2px',
          background: isMorning
            ? 'linear-gradient(180deg, rgba(255,220,100,0.2), rgba(255,160,80,0.1), transparent)'
            : isAfternoon
            ? 'linear-gradient(180deg, rgba(255,240,200,0.15), rgba(255,200,120,0.08), transparent)'
            : 'linear-gradient(180deg, rgba(255,160,80,0.15), rgba(255,100,80,0.08), transparent)',
        }} />
      </div>

      {/* === LIGHT RAYS from window === */}
      <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          left: '20%', right: '20%',
          top: '7%', bottom: '30%',
          background: isMorning
            ? 'linear-gradient(180deg, rgba(255,220,100,0.07) 0%, rgba(255,180,80,0.12) 50%, rgba(255,140,60,0.06) 100%)'
            : isAfternoon
            ? 'linear-gradient(180deg, rgba(255,240,200,0.06) 0%, rgba(255,220,160,0.1) 50%, rgba(255,200,120,0.05) 100%)'
            : 'linear-gradient(180deg, rgba(255,180,100,0.04) 0%, rgba(255,140,80,0.08) 50%, rgba(255,120,60,0.04) 100%)',
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
        }} />
        <div style={{
          position: 'absolute',
          left: '15%', top: '10%',
          width: '25%', height: '60%',
          background: isMorning
            ? 'linear-gradient(135deg, rgba(255,220,100,0.06) 0%, transparent 60%)'
            : 'linear-gradient(135deg, rgba(255,200,120,0.04) 0%, transparent 60%)',
          transform: 'skewX(-15deg)',
        }} />
        <div style={{
          position: 'absolute',
          right: '15%', top: '10%',
          width: '25%', height: '60%',
          background: isMorning
            ? 'linear-gradient(225deg, rgba(255,220,100,0.06) 0%, transparent 60%)'
            : 'linear-gradient(225deg, rgba(255,200,120,0.04) 0%, transparent 60%)',
          transform: 'skewX(15deg)',
        }} />
      </div>

      {/* === NEON SIGNS - only at night === */}
      {isNight && <>
        <div className="absolute" style={{ right: '15%', top: '12%', zIndex: 2 }}>
          <div className="neon-sign-flicker font-mono font-bold neon-vertical"
            style={{
              color: '#FF2D78',
              textShadow: '0 0 6px #FF2D78, 0 0 14px #FF2D78, 0 0 28px rgba(255,45,120,0.5)',
              writingMode: 'vertical-rl',
              letterSpacing: '0.25em',
              fontSize: 'clamp(10px, 1.2vw, 16px)',
            }}>
            ネオ東京
          </div>
        </div>
        <div className="absolute" style={{ right: '8%', top: '22%', zIndex: 2 }}>
          <div className="neon-sign-flicker font-mono font-bold neon-vertical"
            style={{
              color: '#00F5FF',
              textShadow: '0 0 6px #00F5FF, 0 0 14px #00F5FF, 0 0 28px rgba(0,245,255,0.5)',
              writingMode: 'vertical-rl',
              letterSpacing: '0.25em',
              fontSize: 'clamp(10px, 1.2vw, 16px)',
              animationDelay: '1.2s',
            }}>
            ARCADE
          </div>
        </div>
        <div className="absolute" style={{ left: '15%', top: '18%', zIndex: 2 }}>
          <div className="neon-sign-flicker font-mono font-bold neon-vertical"
            style={{
              color: '#FFB347',
              textShadow: '0 0 6px #FFB347, 0 0 14px #FFB347, 0 0 28px rgba(255,179,71,0.5)',
              writingMode: 'vertical-rl',
              letterSpacing: '0.25em',
              fontSize: 'clamp(10px, 1.2vw, 16px)',
              animationDelay: '2s',
            }}>
            デジタル
          </div>
        </div>
        <div className="absolute" style={{ left: '8%', top: '28%', zIndex: 2 }}>
          <div className="neon-sign-flicker font-mono font-bold neon-vertical"
            style={{
              color: '#b060ff',
              textShadow: '0 0 6px #b060ff, 0 0 14px #b060ff, 0 0 28px rgba(176,96,255,0.5)',
              writingMode: 'vertical-rl',
              letterSpacing: '0.25em',
              fontSize: 'clamp(10px, 1.2vw, 16px)',
              animationDelay: '0.7s',
            }}>
            MATRIX
          </div>
        </div>
      </>}

      {/* Morning: birds chirping label */}
      {isMorning && (
        <div className="absolute" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <div className="font-mono text-xs" style={{
            color: 'rgba(255,200,80,0.7)',
            textShadow: '0 0 8px rgba(255,180,60,0.5)',
            letterSpacing: '0.15em',
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            🐦 birds are chirping...
          </div>
        </div>
      )}

      {/* Afternoon: warm cozy label */}
      {isAfternoon && (
        <div className="absolute" style={{ top: '8%', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <div className="font-mono text-xs" style={{
            color: 'rgba(255,220,160,0.7)',
            textShadow: '0 0 8px rgba(255,180,80,0.4)',
            letterSpacing: '0.15em',
          }}>
            ☕ warm & cozy afternoon
          </div>
        </div>
      )}

      {/* === ROOM ATMOSPHERE === */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '38%',
        background: isNight
          ? 'linear-gradient(180deg, transparent 0%, rgba(12,4,28,0.6) 30%, rgba(10,3,22,0.92) 70%, #0a0316 100%)'
          : isAfternoon
          ? 'linear-gradient(180deg, transparent 0%, rgba(8,16,32,0.5) 30%, rgba(6,12,28,0.88) 70%, #060c1c 100%)'
          : 'linear-gradient(180deg, transparent 0%, rgba(8,14,28,0.55) 30%, rgba(6,10,24,0.9) 70%, #060a18 100%)',
      }} />
      <div className="absolute" style={{
        left: '18%', right: '18%',
        top: '45%', height: '35%',
        background: isMorning
          ? 'radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.12) 0%, rgba(255,160,60,0.06) 40%, transparent 70%)'
          : isAfternoon
          ? 'radial-gradient(ellipse at 50% 0%, rgba(255,220,160,0.1) 0%, rgba(255,180,100,0.05) 40%, transparent 70%)'
          : 'radial-gradient(ellipse at 50% 0%, rgba(255,160,80,0.1) 0%, rgba(255,100,60,0.05) 40%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: isNight
          ? 'radial-gradient(ellipse at 15% 70%, rgba(80,20,140,0.15) 0%, transparent 40%), radial-gradient(ellipse at 85% 70%, rgba(80,20,140,0.15) 0%, transparent 40%)'
          : isAfternoon
          ? 'radial-gradient(ellipse at 15% 70%, rgba(20,40,80,0.12) 0%, transparent 40%), radial-gradient(ellipse at 85% 70%, rgba(20,40,80,0.12) 0%, transparent 40%)'
          : 'radial-gradient(ellipse at 15% 70%, rgba(30,50,80,0.12) 0%, transparent 40%), radial-gradient(ellipse at 85% 70%, rgba(30,50,80,0.12) 0%, transparent 40%)',
      }} />
    </div>
  );
}