'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLogo from '@/components/ui/AppLogo';

interface CodeBootScreenProps {
  onRun: () => void;
}

const CODE_LINES = [
  { indent: 0, content: '<!DOCTYPE html>', color: 'text-muted-foreground' },
  { indent: 0, content: '<html lang="en">', color: 'text-primary' },
  { indent: 1, content: '<head>', color: 'text-primary' },
  { indent: 2, content: '<meta charset="UTF-8" />', color: 'text-muted-foreground' },
  { indent: 2, content: '<title>NeoDesk — Portfolio</title>', color: 'text-accent' },
  { indent: 2, content: '<link rel="stylesheet" href="neodesk.css" />', color: 'text-secondary' },
  { indent: 1, content: '</head>', color: 'text-primary' },
  { indent: 1, content: '<body class="cyberpunk lofi">', color: 'text-primary' },
  { indent: 2, content: '<div id="desk-scene">', color: 'text-primary' },
  { indent: 3, content: '<Laptop clickable={true} />', color: 'text-accent' },
  { indent: 3, content: '<CoffeeMug steam={true} animated={true} />', color: 'text-accent' },
  { indent: 3, content: '<Phone socials={handles} />', color: 'text-accent' },
  { indent: 3, content: '<Journal pages={experience} />', color: 'text-accent' },
  { indent: 3, content: '<Window cityscape="neo-tokyo" sunset={true} />', color: 'text-muted-foreground' },
  { indent: 2, content: '</div>', color: 'text-primary' },
  { indent: 2, content: '<script src="interactions.js"></script>', color: 'text-secondary' },
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

  // Type in code lines
  useEffect(() => {
    if (visibleLines < CODE_LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), 120);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowButton(true), 400);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />

      {/* Ambient blobs */}
      <div className="absolute inset-0 blob-bg pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-3xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <span className="font-mono text-primary text-lg font-bold tracking-wider text-glow-cyan">
              NeoDesk
            </span>
          </div>
          <div className="font-mono text-xs text-muted-foreground tracking-widest">
            <span className="text-primary">●</span> SYSTEM_READY
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground mb-4 border-b border-border pb-4">
          <span className="text-accent">neodesk</span>
          <span>~</span>
          <span className="text-secondary">portfolio.html</span>
          <span className="ml-auto text-primary">UTF-8</span>
          <span>HTML</span>
        </div>
      </div>

      {/* Terminal window */}
      <div className="relative z-10 w-full max-w-3xl glass-dark border border-border rounded-xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 0 40px rgba(0, 245, 255, 0.08), 0 20px 60px rgba(0,0,0,0.6)' }}>

        {/* Terminal title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
          <div className="w-3 h-3 rounded-full bg-secondary opacity-80" />
          <div className="w-3 h-3 rounded-full bg-accent opacity-80" />
          <div className="w-3 h-3 rounded-full bg-primary opacity-80" />
          <span className="ml-4 font-mono text-xs text-muted-foreground tracking-widest">
            portfolio.html — NeoDesk Editor
          </span>
        </div>

        {/* Code content */}
        <div className="p-6 font-mono text-sm min-h-[380px]">
          {/* Line numbers + code */}
          {CODE_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className="flex gap-4 leading-7 code-line"
              style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
            >
              <span className="text-muted-foreground select-none w-6 text-right shrink-0 opacity-40">
                {i + 1}
              </span>
              <span className={line.color} style={{ paddingLeft: `${line.indent * 16}px` }}>
                {line.content}
              </span>
            </div>
          ))}

          {/* Cursor */}
          {visibleLines <= CODE_LINES.length && (
            <div className="flex gap-4 leading-7">
              <span className="text-muted-foreground select-none w-6 text-right shrink-0 opacity-40">
                {visibleLines + 1}
              </span>
              <span className="inline-block w-2 h-5 bg-primary cursor-blink" />
            </div>
          )}
        </div>
      </div>

      {/* Run button */}
      {showButton && (
        <div
          className="relative z-10 mt-8 slide-up-modal"
        >
          <button
            onClick={onRun}
            className="neon-btn px-10 py-4 rounded-lg text-sm font-mono font-bold tracking-widest pulse-glow"
          >
            ▶ RUN PROGRAM
          </button>
          <p className="text-center mt-3 font-mono text-xs text-muted-foreground tracking-widest">
            EXECUTE portfolio.html
          </p>
        </div>
      )}
    </div>
  );
}