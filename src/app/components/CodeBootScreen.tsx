'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLogo from '@/components/ui/AppLogo';

interface CodeBootScreenProps {
  onRun: () => void;
}

// trimmed snippet — short enough that the RUN button fits on screen
const CODE_LINES = [
  { indent: 0, content: '<html lang="en">', color: 'text-primary' },
  { indent: 1, content: '<head>', color: 'text-primary' },
  { indent: 2, content: '<title>NeoDesk — Ayaan Bhoje</title>', color: 'text-accent' },
  { indent: 1, content: '</head>', color: 'text-primary' },
  { indent: 1, content: '<body class="cyberpunk lofi">', color: 'text-primary' },
  { indent: 2, content: '<Laptop projects={ayaan.work} />', color: 'text-accent' },
  { indent: 2, content: '<Turntable vinyl={true} />', color: 'text-accent' },
  { indent: 2, content: '<Window city="neo-tokyo" />', color: 'text-muted-foreground' },
  { indent: 1, content: '</body>', color: 'text-primary' },
  { indent: 0, content: '</html>', color: 'text-primary' },
];

export default function CodeBootScreen({ onRun }: CodeBootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Matrix rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const fontSize = 13;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);
    const chars = 'ｦｧｨｩｪｫｬｭｮｯｰABCDEFGHIJKLMN0123456789@#$%^&*';

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 6, 24, 0.05)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 245, 255, 0.15)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drops.length = Math.floor(width / fontSize);
      drops.fill(1);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Type in code lines (faster so the button appears quickly)
  useEffect(() => {
    if (visibleLines < CODE_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 90);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 300);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6">
      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />

      {/* Ambient blobs */}
      <div className="absolute inset-0 blob-bg pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-xl mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            <span className="font-mono text-primary text-base font-bold tracking-wider text-glow-cyan">
              NeoDesk
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground tracking-widest">
            <span className="text-primary">●</span> SYSTEM_READY
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground border-b border-border pb-3">
          <span className="text-accent">ayaan@neodesk</span>
          <span>~</span>
          <span className="text-secondary">portfolio.html</span>
          <span className="ml-auto text-primary">UTF-8</span>
          <span>HTML</span>
        </div>
      </div>

      {/* Terminal window — compact */}
      <div className="relative z-10 w-full max-w-xl glass-dark border border-border rounded-xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(0, 245, 255, 0.08), 0 20px 60px rgba(0,0,0,0.6)' }}>

        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent opacity-80" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-80" />
          <span className="ml-3 font-mono text-xs text-muted-foreground tracking-widest">
            portfolio.html — NeoDesk Editor
          </span>
        </div>

        {/* Code content — small text, tight leading, no fixed tall min-height */}
        <div className="px-5 py-4 font-mono text-xs" style={{ minHeight: 0 }}>
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="flex gap-3 leading-6 code-line"
              style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}
            >
              <span className="text-muted-foreground select-none w-5 text-right shrink-0 opacity-40">
                {i + 1}
              </span>
              <span className={line.color} style={{ paddingLeft: `${line.indent * 14}px` }}>
                {line.content}
              </span>
            </div>
          ))}

          {/* Cursor */}
          {visibleLines <= CODE_LINES.length && (
            <div className="flex gap-3 leading-6">
              <span className="text-muted-foreground select-none w-5 text-right shrink-0 opacity-40">
                {visibleLines + 1}
              </span>
              <span className="inline-block w-2 h-4 bg-primary cursor-blink" />
            </div>
          )}
        </div>
      </div>

      {/* Run button */}
      {showButton && (
        <div className="relative z-10 mt-6 slide-up-modal">
          <button
            onClick={onRun}
            className="neon-btn px-10 py-3.5 rounded-lg text-sm font-mono font-bold tracking-widest pulse-glow"
          >
            ▶ RUN PROGRAM
          </button>
          <p className="text-center mt-2 font-mono text-xs text-muted-foreground tracking-widest">
            EXECUTE portfolio.html
          </p>
        </div>
      )}
    </div>
  );
}