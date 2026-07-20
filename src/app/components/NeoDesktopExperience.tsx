'use client';

import React, { useState, useEffect, useRef } from 'react';
import CodeBootScreen from './CodeBootScreen';
import DeskScene from './DeskScene';

export default function NeoDesktopExperience() {
  const [phase, setPhase] = useState<'code' | 'transitioning' | 'desk'>('code');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRun = () => {
    setPhase('transitioning');
    setTimeout(() => setPhase('desk'), 900);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-mono text-primary text-sm tracking-widest animate-pulse">
          INITIALIZING...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Scanlines overlay */}
      <div className="scanlines-overlay" />
      {/* Vignette overlay */}
      <div className="vignette-overlay" />

      {/* Code phase */}
      {(phase === 'code' || phase === 'transitioning') && (
        <div className={phase === 'transitioning' ? 'hero-code-fade-out' : ''}>
          <CodeBootScreen onRun={handleRun} />
        </div>
      )}

      {/* Desk phase */}
      {phase === 'desk' && (
        <div className="fade-in-desk">
          <DeskScene />
        </div>
      )}
    </div>
  );
}