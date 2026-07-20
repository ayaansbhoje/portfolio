'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LaptopModal from './LaptopModal';
import PhoneModal from './PhoneModal';
import JournalModal from './JournalModal';
import MusicModal from './MusicModal';
import TvModal from './TvModal';
import AppLogo from '@/components/ui/AppLogo';
import { ALL_TRACKS } from './musicData';

export type ModalType = 'laptop' | 'phone' | 'journal' | 'music' | 'tv' | null;
export type SelectTarget = 'laptop' | 'phone' | 'journal' | 'music' | 'tv';
export type TimeOfDay = 'morning' | 'afternoon' | 'night';

const RoomCanvas = dynamic(() => import('./RoomCanvas'), { ssr: false });

/* ── cinematic title that fades up-and-out as the intro scrolls ── */
function IntroOverlay({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      const tt = Math.min(1, p / 0.4);            // title gone by 40% progress
      if (titleRef.current) {
        titleRef.current.style.opacity = String(1 - tt);
        titleRef.current.style.transform =
          `translate(-50%, calc(-50% - ${tt * 42}px)) scale(${1 - tt * 0.05})`;
        titleRef.current.style.filter = `blur(${tt * 5}px)`;
      }
      if (hintRef.current) {
        const ht = Math.min(1, p / 0.22);
        hintRef.current.style.opacity = String((1 - ht) * 0.85);
        hintRef.current.style.transform = `translate(-50%, ${ht * 14}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none" style={{ overflow: 'hidden' }}>
      <style>{`
        @keyframes introChevron { 0%,100%{ transform: translateY(0); opacity:.5 } 50%{ transform: translateY(6px); opacity:1 } }
      `}</style>

      {/* soft focus wash so the title reads over the desk */}
      <div style={{ position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 42%, rgba(6,2,16,0.38) 0%, transparent 58%)' }} />

      <div ref={titleRef} style={{
        position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)',
        textAlign: 'center', willChange: 'opacity, transform, filter',
      }}>
        <div className="font-mono" style={{
          fontSize: 'clamp(10px,1.1vw,13px)', letterSpacing: '0.45em', textTransform: 'uppercase',
          color: 'rgba(0,245,255,0.75)', textShadow: '0 0 12px rgba(0,245,255,0.5)',
          marginBottom: '14px', paddingLeft: '0.45em',
        }}>Ayaan Bhoje {'\u00B7'} Portfolio</div>

        <h1 className="font-mono" style={{
          fontSize: 'clamp(1.9rem,5.4vw,4.4rem)', fontWeight: 800, lineHeight: 1.05, margin: 0,
          color: '#E8D5FF',
          textShadow: '0 0 22px rgba(0,245,255,0.5), 0 0 44px rgba(0,245,255,0.22)',
        }}>
          Welcome to my<br />
          <span style={{ color: '#00F5FF', textShadow: '0 0 26px rgba(0,245,255,0.85), 0 0 60px rgba(0,245,255,0.35)' }}>
            desk space
          </span>
        </h1>
      </div>

      <div ref={hintRef} className="font-mono" style={{
        position: 'absolute', left: '50%', bottom: '12%', transform: 'translateX(-50%)',
        textAlign: 'center', color: 'rgba(200,180,255,0.85)', willChange: 'opacity, transform',
      }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>scroll to explore</div>
        <div style={{ fontSize: '22px', color: '#00F5FF', marginTop: '6px',
          animation: 'introChevron 1.6s ease-in-out infinite', textShadow: '0 0 12px rgba(0,245,255,0.6)' }}>{'\u2304'}</div>
      </div>
    </div>
  );
}

/* ── welcome / how-to-explore guide, shown once the intro zoom-out completes ── */
function WelcomeGuide({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: '\u{1F4BB}', name: 'Laptop', color: '#00F5FF', desc: 'My projects, skills & about me' },
    { icon: '\u{1F4F1}', name: 'Phone', color: '#FF2D78', desc: 'Contact & social links' },
    { icon: '\u{1F4D6}', name: 'Journal', color: '#FFB347', desc: 'Brand work log & moodboards' },
    { icon: '\u{1F3B6}', name: 'Turntable', color: '#b060ff', desc: 'Pick a vinyl \u2014 music keeps playing while you explore' },
    { icon: '\u{1F4FA}', name: 'Retro TV', color: '#3ea9ff', desc: 'Showreel channels' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="slide-up-modal w-full max-w-md glass-dark border border-border rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 0 60px rgba(0,245,255,0.15), 0 30px 80px rgba(0,0,0,0.8)' }}>

        {/* header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="flex justify-center mb-3"><AppLogo size={40} /></div>
          <h2 className="font-mono text-lg font-bold" style={{ color: '#00F5FF', textShadow: '0 0 14px rgba(0,245,255,0.5)' }}>
            Welcome to my room!
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-2 leading-relaxed">
            <span style={{ color: '#E8D5FF' }}>{'\u{1F5B1}'} Click &amp; drag</span> to look around {'\u00B7'}{' '}
            <span style={{ color: '#E8D5FF' }}>scroll</span> to zoom.<br />
            Glowing rings mark the clickable objects:
          </p>
        </div>

        {/* clickable items list */}
        <div className="px-6 pb-4 space-y-2">
          {items.map((it) => (
            <div key={it.name} className="flex items-center gap-3 p-2.5 rounded-xl border"
              style={{ background: `${it.color}0d`, borderColor: `${it.color}33` }}>
              <span className="text-xl shrink-0">{it.icon}</span>
              <div className="min-w-0">
                <div className="font-mono text-xs font-bold" style={{ color: it.color }}>{it.name}</div>
                <div className="font-mono text-[11px] text-muted-foreground truncate">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* tip + CTA */}
        <div className="px-6 pb-6 text-center">
          <p className="font-mono text-[11px] text-muted-foreground mb-4">
            {'\u{1F4A1}'} Tip: switch <span style={{ color: '#FFD060' }}>Morning</span> /{' '}
            <span style={{ color: '#FF9A40' }}>Afternoon</span> /{' '}
            <span style={{ color: '#00F5FF' }}>Night</span> from the top bar {'\u2014'} the room relights itself.
          </p>
          <button onClick={onClose} className="neon-btn px-8 py-3 rounded-lg text-xs">
            START EXPLORING {'\u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DeskScene() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');

  // --- intro scroll state ---
  const introRef = useRef(0);                     // authoritative 0..1 progress (read by the camera rig)
  const [introComplete, setIntroComplete] = useState(false);
  const completedRef = useRef(false);
  useEffect(() => { completedRef.current = introComplete; }, [introComplete]);

  // --- welcome guide state (auto-opens once after intro) ---
  const [showGuide, setShowGuide] = useState(false);
  const guideShownRef = useRef(false);
  useEffect(() => {
    if (introComplete && !guideShownRef.current) {
      guideShownRef.current = true;
      const t = setTimeout(() => setShowGuide(true), 700);   // small beat after the camera settles
      return () => clearTimeout(t);
    }
  }, [introComplete]);

  // capture scroll / touch / keys -> advance progress (only until the intro finishes)
  useEffect(() => {
    const SENS = 0.00095;
    let lastY: number | null = null;
    const bump = (dy: number) => {
      if (completedRef.current) return;
      introRef.current = Math.min(1, Math.max(0, introRef.current + dy * SENS));
    };
    const onWheel = (e: WheelEvent) => { if (completedRef.current) return; e.preventDefault(); bump(e.deltaY); };
    const onTouchStart = (e: TouchEvent) => { lastY = e.touches[0]?.clientY ?? null; };
    const onTouchMove = (e: TouchEvent) => {
      if (completedRef.current || lastY == null) return;
      const y = e.touches[0].clientY; bump((lastY - y) * 2.4); lastY = y; e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (completedRef.current) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); bump(140); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); bump(-140); }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // ignore object clicks until the cinematic finishes (and while the guide is open)
  const handleSelect = (t: SelectTarget) => { if (completedRef.current && !showGuide) setActiveModal(t); };

  // --- music player state ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTrack = currentIdx >= 0 ? ALL_TRACKS[currentIdx] : null;

  // set true the moment the visitor manually uses the player -> auto-play backs off
  const userTookControlRef = useRef(false);

  const playIndex = (idx: number) => {
    userTookControlRef.current = true;
    const a = audioRef.current;
    const track = ALL_TRACKS[idx];
    if (!a || !track) return;
    if (idx === currentIdx) {
      if (a.paused) a.play().then(() => setIsPlaying(true)).catch(() => {});
      else { a.pause(); setIsPlaying(false); }
      return;
    }
    a.src = track.src;
    setCurrentIdx(idx);
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };
  const playById = (id: string) => {
    const idx = ALL_TRACKS.findIndex((t) => t.id === id);
    if (idx >= 0) playIndex(idx);
  };
  const togglePlay = () => { currentIdx < 0 ? playIndex(0) : playIndex(currentIdx); };
  const next = () => playIndex((currentIdx + 1) % ALL_TRACKS.length);
  const prev = () => playIndex((currentIdx - 1 + ALL_TRACKS.length) % ALL_TRACKS.length);

  /* ── RANDOM AUTO-PLAY ──
     Picks a random real track on load and starts it as soon as the
     browser allows audio. Browsers block autoplay until the visitor
     interacts with the page, so:
       1. we try immediately (works if they already clicked RUN PROGRAM)
       2. if blocked, we retry on the first click / tap / keypress
     If the visitor manually picks a record first, we never override. */
  useEffect(() => {
    // only pick from tracks whose files actually exist (skip placeholders)
    const playable = ALL_TRACKS
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => !t.src.includes('placeholder'));
    if (playable.length === 0) return;

    const pick = playable[Math.floor(Math.random() * playable.length)];
    let started = false;

    const cleanup = () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
      window.removeEventListener('touchstart', onGesture);
    };

    const tryPlay = () => {
      if (started || userTookControlRef.current) { cleanup(); return; }
      const a = audioRef.current;
      if (!a) return;
      a.src = pick.t.src;
      a.volume = 0.55;                 // gentle background level
      a.play().then(() => {
        if (userTookControlRef.current) { a.pause(); return; }  // user beat us to it
        started = true;
        setCurrentIdx(pick.i);
        setIsPlaying(true);
        cleanup();
      }).catch(() => { /* blocked -> wait for a gesture */ });
    };

    const onGesture = () => tryPlay();

    tryPlay();  // attempt right away (RUN PROGRAM click may already count)
    window.addEventListener('pointerdown', onGesture);
    window.addEventListener('keydown', onGesture);
    window.addEventListener('touchstart', onGesture);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => setActiveModal(null);

  const timeOptions: { key: TimeOfDay; label: string; icon: string }[] = [
    { key: 'morning', label: 'Morning', icon: '\u{1F305}' },
    { key: 'afternoon', label: 'Afternoon', icon: '\u2600\uFE0F' },
    { key: 'night', label: 'Night', icon: '\u{1F319}' },
  ];

  const timeColors: Record<TimeOfDay, string> = {
    morning: '#FFD700', afternoon: '#FF8C42', night: '#00F5FF',
  };

  // fade the chrome in only once the room is revealed -> clean opening
  const chrome = { opacity: introComplete ? 1 : 0, transition: 'opacity 0.9s ease' } as const;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <RoomCanvas
        timeOfDay={timeOfDay}
        onSelect={handleSelect}
        musicPlaying={isPlaying}
        introRef={introRef}
        introComplete={introComplete}
        onIntroComplete={() => setIntroComplete(true)}
      />

      <audio ref={audioRef} onEnded={next} />

      {/* cinematic title (only meaningful before the intro completes) */}
      {!introComplete && <IntroOverlay progressRef={introRef} />}

      {/* welcome / how-to-explore guide */}
      {showGuide && <WelcomeGuide onClose={() => setShowGuide(false)} />}

      {/* === TOP NAV BAR === */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 py-4 flex items-center justify-between pointer-events-none"
        style={chrome}>
        <div className="flex items-center gap-3 pointer-events-auto">
          <AppLogo size={30} onClick={() => {}} />
          <span className="font-mono text-sm font-bold tracking-widest" style={{
            color: '#00F5FF', textShadow: '0 0 10px #00F5FF, 0 0 20px rgba(0,245,255,0.4)',
          }}>NeoDesk</span>
        </div>

        <div className="flex items-center gap-1 px-2 py-1.5 rounded-full pointer-events-auto"
          style={{ background: 'rgba(13,6,24,0.75)', border: '1px solid rgba(120,70,180,0.35)', backdropFilter: 'blur(12px)' }}>
          {timeOptions.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTimeOfDay(key)}
              className="font-mono text-xs px-3 py-1 rounded-full transition-all duration-300"
              style={{
                background: timeOfDay === key
                  ? `rgba(${key === 'morning' ? '255,215,0' : key === 'afternoon' ? '255,140,66' : '0,245,255'},0.18)`
                  : 'transparent',
                color: timeOfDay === key ? timeColors[key] : 'rgba(180,150,220,0.55)',
                border: timeOfDay === key ? `1px solid ${timeColors[key]}44` : '1px solid transparent',
                textShadow: timeOfDay === key ? `0 0 8px ${timeColors[key]}` : 'none',
                cursor: 'pointer', letterSpacing: '0.05em',
              }}>
              <span className="mr-1">{icon}</span>{label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* reopen the guide anytime */}
          <button onClick={() => setShowGuide(true)}
            className="font-mono text-xs flex items-center justify-center rounded-full"
            style={{
              width: 30, height: 30,
              background: 'rgba(13,6,24,0.7)', border: '1px solid rgba(0,245,255,0.3)',
              backdropFilter: 'blur(12px)', color: '#00F5FF', cursor: 'pointer',
              textShadow: '0 0 8px rgba(0,245,255,0.5)',
            }}
            title="How to explore">
            ?
          </button>
          <div className="font-mono text-xs tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(13,6,24,0.7)', border: '1px solid rgba(0,245,255,0.2)', backdropFilter: 'blur(12px)', color: 'rgba(200,180,255,0.7)' }}>
            <span style={{ color: '#00F5FF', fontSize: '8px' }}>{'\u25CF'}</span>
            PORTFOLIO_LOADED
          </div>
        </div>
      </div>

      {/* === BOTTOM HINT BAR === */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 font-mono text-xs pointer-events-none"
        style={{
          background: 'rgba(13,6,24,0.65)', border: '1px solid rgba(120,70,180,0.3)', backdropFilter: 'blur(12px)',
          borderRadius: '999px', padding: '8px 20px', color: 'rgba(180,150,220,0.7)', ...chrome,
        }}>
        <span style={{ color: 'rgba(0,245,255,0.6)', fontSize: '10px' }}>{'\u2191'} drag to look {'\u00B7'} click objects</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span className="flex items-center gap-1.5"><span>{'\u{1F4BB}'}</span><span style={{ color: 'rgba(0,245,255,0.8)' }}>Laptop</span></span>
        <span className="flex items-center gap-1.5"><span>{'\u{1F4F1}'}</span><span style={{ color: 'rgba(255,45,120,0.8)' }}>Phone</span></span>
        <span className="flex items-center gap-1.5"><span>{'\u{1F4D6}'}</span><span style={{ color: 'rgba(255,179,71,0.8)' }}>Journal</span></span>
        <span className="flex items-center gap-1.5"><span>{'\u{1F3B6}'}</span><span style={{ color: 'rgba(176,96,255,0.8)' }}>Vinyl</span></span>
        <span className="flex items-center gap-1.5"><span>{'\u{1F4FA}'}</span><span style={{ color: 'rgba(62,169,255,0.85)' }}>TV</span></span>
      </div>

      {/* === NOW PLAYING mini-player === */}
      {currentTrack && (
        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-3 pointer-events-auto font-mono"
          style={{ background: 'rgba(13,6,24,0.8)', border: '1px solid rgba(255,179,71,0.35)', backdropFilter: 'blur(12px)', borderRadius: '999px', padding: '8px 14px' }}>
          <button onClick={prev} className="text-xs" style={{ color: 'rgba(255,179,71,0.8)', cursor: 'pointer' }}>{'\u23EE'}</button>
          <button onClick={togglePlay} className="text-sm" style={{ color: '#FFB347', textShadow: '0 0 8px rgba(255,179,71,0.6)', cursor: 'pointer' }}>{isPlaying ? '\u275A\u275A' : '\u25B6'}</button>
          <button onClick={next} className="text-xs" style={{ color: 'rgba(255,179,71,0.8)', cursor: 'pointer' }}>{'\u23ED'}</button>
          <div className="min-w-0 max-w-[160px]">
            <div className="text-xs truncate" style={{ color: '#E8D5FF' }}>{currentTrack.title}</div>
            <div className="text-[10px] truncate" style={{ color: 'rgba(180,150,220,0.7)' }}>{currentTrack.artist}</div>
          </div>
          {isPlaying && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FFB347' }} />}
        </div>
      )}

      {/* Modals */}
      {activeModal === 'laptop' && <LaptopModal onClose={closeModal} />}
      {activeModal === 'phone' && <PhoneModal onClose={closeModal} />}
      {activeModal === 'journal' && <JournalModal onClose={closeModal} />}
      {activeModal === 'tv' && <TvModal onClose={closeModal} />}
      {activeModal === 'music' && (
        <MusicModal onClose={closeModal} currentTrackId={currentTrack?.id ?? null} isPlaying={isPlaying} onPlay={playById} />
      )}
    </div>
  );
}