'use client';

import React, { useState, useRef, useEffect } from 'react';
import { TV_CHANNELS } from './tvData';

interface TvModalProps { onClose: () => void; }

function ChannelLogo({ logo, brand, accent }: { logo: string; brand: string; accent: string }) {
  const [ok, setOk] = useState(true);
  const isImg = logo.startsWith('/');
  if (isImg && ok) {
    return <img src={logo} alt={brand} onError={() => setOk(false)}
      style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))' }} />;
  }
  return (
    <span style={{
      fontFamily: 'monospace', fontWeight: 700, fontSize: 22, color: accent,
      textShadow: `0 0 10px ${accent}88`, display: 'inline-flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ fontSize: 26 }}>{isImg ? '📺' : logo}</span>{brand}
    </span>
  );
}

export default function TvModal({ onClose }: TvModalProps) {
  const [channel, setChannel] = useState(0);
  const [switching, setSwitching] = useState(true);   // start on a quick "tune-in" static
  const staticRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const ch = TV_CHANNELS[channel];

  const goChannel = (idx: number) => {
    if (idx === channel && !switching) return;
    setChannel(idx);
    setSwitching(true);
  };
  const prev = () => goChannel((channel - 1 + TV_CHANNELS.length) % TV_CHANNELS.length);
  const next = () => goChannel((channel + 1) % TV_CHANNELS.length);

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

  // keyboard: Esc closes, ←/→ change channel, number keys jump
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (/^[1-9]$/.test(e.key)) { const i = +e.key - 1; if (i < TV_CHANNELS.length) goChannel(i); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}>

      <style>{`
        @keyframes tvFlicker { 0%,97%,100%{opacity:0} 98%{opacity:0.06} 99%{opacity:0.02} }
        @keyframes tvOn { from{transform:scaleY(0.02);opacity:0} to{transform:scaleY(1);opacity:1} }
      `}</style>

      <div className="slide-up-modal w-full" style={{ maxWidth: 760 }}>
        {/* wooden TV cabinet */}
        <div style={{
          background: 'linear-gradient(150deg,#2b2620 0%,#1c1813 100%)',
          border: '1px solid rgba(120,90,50,0.35)',
          borderRadius: 20, padding: 22,
          boxShadow: '0 0 60px rgba(62,169,255,0.15), 0 30px 80px rgba(0,0,0,0.8)',
        }}>
          {/* screen bezel */}
          <div style={{
            background: '#0a0a0e', borderRadius: 16, padding: 12,
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9)',
          }}>
            {/* the screen — 4:3 */}
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '4 / 3',
              borderRadius: 12, overflow: 'hidden', background: '#05060a',
              animation: 'tvOn 0.35s ease',
            }}>
              {/* base accent wash so it looks intentional even without a video file */}
              <div style={{ position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 50% 40%, ${ch.accent}22 0%, #05060a 70%)` }} />

              {/* big faint brand watermark behind the video */}
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontWeight: 800, fontSize: 40, letterSpacing: '0.1em',
                color: `${ch.accent}22`,
              }}>{ch.brand.toUpperCase()}</div>

              {/* the reel video (drop files in public/tv/videos) */}
              {!switching && (
                <video
                  key={ch.id}
                  src={ch.video}
                  autoPlay muted loop playsInline
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* client logo — top-left */}
              {!switching && (
                <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 3 }}>
                  <ChannelLogo logo={ch.logo} brand={ch.brand} accent={ch.accent} />
                </div>
              )}

              {/* channel bug — top-right */}
              {!switching && (
                <div style={{
                  position: 'absolute', top: 14, right: 16, zIndex: 3,
                  fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#fff',
                  background: 'rgba(0,0,0,0.45)', padding: '3px 9px', borderRadius: 4,
                  textShadow: '0 0 8px rgba(0,0,0,0.8)',
                }}>CH {String(channel + 1).padStart(2, '0')}</div>
              )}

              {/* tagline — bottom-left */}
              {!switching && ch.tagline && (
                <div style={{
                  position: 'absolute', bottom: 14, left: 16, zIndex: 3,
                  fontFamily: 'monospace', fontSize: 13, color: '#dfeeff',
                  background: 'rgba(0,0,0,0.4)', padding: '3px 9px', borderRadius: 4,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, flexWrap: 'wrap' }}>
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
              <button onClick={prev} className="font-mono" style={ctrlBtn}>◀</button>
              <button onClick={next} className="font-mono" style={ctrlBtn}>▶</button>
              <button onClick={onClose} className="font-mono" style={{ ...ctrlBtn, borderColor: 'rgba(255,45,120,0.5)', color: '#ff6a9a' }}>⏻</button>
            </div>
          </div>

          {/* now-playing label */}
          <div className="font-mono" style={{ marginTop: 12, fontSize: 12, color: '#8b6fa8', textAlign: 'center' }}>
            {switching ? 'TUNING…' : <>NOW PLAYING · <span style={{ color: ch.accent }}>{ch.brand}</span></>}
            <span style={{ opacity: 0.5 }}>   ·   use ← → or number keys</span>
          </div>
        </div>

        {/* close hint outside cabinet */}
        <button onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border glass-dark">
          ✕ CLOSE
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