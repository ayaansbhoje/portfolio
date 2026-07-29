'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TV_CHANNELS } from './tvData';

interface TvModalProps { onClose: () => void; }

/* The screen is a FIXED size - it never changes when you switch channels.
   Clips are fitted inside it with object-fit: contain, so every video
   still plays WHOLE (nothing cropped off the sides, nothing cut off the
   top or bottom); a clip that doesn't match the screen shape simply gets
   black bars, exactly like a real TV.
   Want a boxier retro set? Change SCREEN_RATIO to 4 / 3. */
const SCREEN_RATIO = 16 / 9;
const MAX_H = 62;              // vh - caps screen height on short viewports

function ChannelLogo({ logo, brand, accent }: { logo: string; brand: string; accent: string }) {
  const [ok, setOk] = useState(true);
  const isImg = logo.startsWith('/');
  if (isImg && ok) {
    return <img src={logo} alt={brand} onError={() => setOk(false)}
      style={{ height: 34, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))' }} />;
  }
  return (
    <span style={{
      fontFamily: 'monospace', fontWeight: 700, fontSize: 18, color: accent,
      textShadow: `0 0 10px ${accent}88`, display: 'inline-flex', alignItems: 'center', gap: 7,
    }}>
      <span style={{ fontSize: 22 }}>{isImg ? '\u{1F4FA}' : logo}</span>{brand}
    </span>
  );
}

export default function TvModal({ onClose }: TvModalProps) {
  const [channel, setChannel] = useState(0);
  const [switching, setSwitching] = useState(true);   // start on a quick "tune-in" static
  const staticRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const ch = TV_CHANNELS[channel];

  const goChannel = useCallback((idx: number) => {
    setChannel(idx);
    setSwitching(true);
  }, []);

  const prev = useCallback(
    () => goChannel((channel - 1 + TV_CHANNELS.length) % TV_CHANNELS.length),
    [channel, goChannel],
  );
  const next = useCallback(
    () => goChannel((channel + 1) % TV_CHANNELS.length),
    [channel, goChannel],
  );

  // white-noise static while switching channels
  useEffect(() => {
    if (!switching) return;
    const cvs = staticRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d')!;
    const draw = () => {
      const w = cvs.width, h = cvs.height;
      const img = ctx.createImageData(w, h);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    const t = setTimeout(() => setSwitching(false), 620);
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(t); };
  }, [switching, channel]);

  // keyboard: Esc closes, arrows change channel, number keys jump
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (/^[1-9]$/.test(e.key)) {
        const i = +e.key - 1;
        if (i < TV_CHANNELS.length) goChannel(i);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, next, prev, goChannel]);

  // constant screen size - depends only on the viewport, never on the clip
  const screenWidth = `min(100%, ${(MAX_H * SCREEN_RATIO).toFixed(2)}vh)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <style>{`
        @keyframes tvFlicker { 0%,97%,100%{opacity:0} 98%{opacity:0.06} 99%{opacity:0.02} }
        @keyframes tvOn { from{transform:scaleY(0.02);opacity:0} to{transform:scaleY(1);opacity:1} }
      `}</style>

      <div className="slide-up-modal relative w-full" style={{ maxWidth: 860 }}>
        {/* wooden TV cabinet */}
        <div style={{
          background: 'linear-gradient(150deg,#2b2620 0%,#1c1813 100%)',
          border: '1px solid rgba(120,90,50,0.35)',
          borderRadius: 20, padding: 20,
          boxShadow: '0 0 60px rgba(62,169,255,0.15), 0 30px 80px rgba(0,0,0,0.8)',
        }}>
          {/* screen bezel */}
          <div style={{
            background: '#0a0a0e', borderRadius: 16, padding: 12,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)',
            display: 'flex', justifyContent: 'center',
          }}>
            {/* the screen - FIXED size, identical on every channel */}
            <div style={{
              position: 'relative',
              width: screenWidth,
              aspectRatio: String(SCREEN_RATIO),
              borderRadius: 12, overflow: 'hidden', background: '#05060a',
              animation: 'tvOn 0.35s ease',
            }}>
              {/* base accent wash so it looks intentional even without a video file */}
              <div style={{ position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 50% 40%, ${ch.accent}22 0%, #05060a 70%)` }} />

              {/* big faint brand watermark behind the video */}
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontWeight: 800, fontSize: 'clamp(18px,3.4vw,40px)',
                letterSpacing: '0.1em', textAlign: 'center', padding: '0 12px',
                color: `${ch.accent}22`,
              }}>{ch.brand.toUpperCase()}</div>

              {/* the reel video - contain fits the whole clip inside the fixed
                  screen, so nothing is ever cropped or cut short */}
              {!switching && (
                <video
                  key={ch.id}
                  src={ch.video}
                  autoPlay muted loop playsInline preload="metadata"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'contain', background: '#05060a',
                  }}
                />
              )}

              {/* client logo - top-left */}
              {!switching && (
                <div style={{ position: 'absolute', top: 12, left: 14, zIndex: 3 }}>
                  <ChannelLogo logo={ch.logo} brand={ch.brand} accent={ch.accent} />
                </div>
              )}

              {/* channel bug - top-right */}
              {!switching && (
                <div style={{
                  position: 'absolute', top: 12, right: 14, zIndex: 3,
                  fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#fff',
                  background: 'rgba(0,0,0,0.5)', padding: '3px 9px', borderRadius: 4,
                  textShadow: '0 0 8px rgba(0,0,0,0.8)',
                }}>CH {String(channel + 1).padStart(2, '0')}</div>
              )}

              {/* tagline - bottom-left */}
              {!switching && ch.tagline && (
                <div style={{
                  position: 'absolute', bottom: 12, left: 14, zIndex: 3,
                  fontFamily: 'monospace', fontSize: 12, color: '#dfeeff',
                  background: 'rgba(0,0,0,0.45)', padding: '3px 9px', borderRadius: 4,
                }}>{ch.tagline}</div>
              )}

              {/* white static while switching */}
              {switching && (
                <canvas ref={staticRef} width={320} height={240} style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  imageRendering: 'pixelated', zIndex: 4, opacity: 0.9,
                }} />
              )}

              {/* CRT scanlines + vignette (always on top) */}
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 2px, transparent 3px)',
              }} />
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
              }} />
              {/* rare white flash */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
                background: '#fff', animation: 'tvFlicker 6s steps(1) infinite' }} />
            </div>
          </div>

          {/* control panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16, flexWrap: 'wrap' }}>
            {/* channel buttons */}
            <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
              {TV_CHANNELS.map((c, i) => {
                const active = i === channel;
                return (
                  <button key={c.id} onClick={() => goChannel(i)}
                    className="font-mono"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                      background: active ? `${c.accent}1f` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? c.accent : 'rgba(255,255,255,0.1)'}`,
                      boxShadow: active ? `0 0 14px ${c.accent}55` : 'none',
                      transition: 'all 0.2s',
                    }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: active ? c.accent : '#cbb8e6' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 10, letterSpacing: '0.1em', color: active ? c.accent : '#8b6fa8' }}>
                      {c.short}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* prev / next / power */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={prev} className="font-mono" style={ctrlBtn}>{'\u25C0'}</button>
              <button onClick={next} className="font-mono" style={ctrlBtn}>{'\u25B6'}</button>
              <button onClick={onClose} className="font-mono" style={{ ...ctrlBtn, borderColor: 'rgba(255,45,120,0.5)', color: '#ff6a9a' }}>{'\u23FB'}</button>
            </div>
          </div>

          {/* now-playing label */}
          <div className="font-mono" style={{ marginTop: 12, fontSize: 12, color: '#8b6fa8', textAlign: 'center' }}>
            {switching ? 'TUNING...' : <>NOW PLAYING {'\u00B7'} <span style={{ color: ch.accent }}>{ch.brand}</span></>}
            <span style={{ opacity: 0.5 }}>{'   \u00B7   '}use arrows or number keys</span>
          </div>
        </div>

        {/* close hint outside cabinet */}
        <button onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border glass-dark">
          {'\u2715'} CLOSE
        </button>
      </div>
    </div>
  );
}

const ctrlBtn: React.CSSProperties = {
  width: 44, height: 44, borderRadius: 10, cursor: 'pointer',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.14)',
  color: '#cbb8e6', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
};