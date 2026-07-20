'use client';

import React from 'react';

interface PhoneModalProps {
  onClose: () => void;
}

const SOCIALS = [
  {
    platform: 'GitHub',
    handle: '@kai-nakamura',
    icon: '🐙',
    url: 'https://github.com',
    color: '#E8D5FF',
    desc: '24 repos · 2.4k stars',
  },
  {
    platform: 'Twitter / X',
    handle: '@kai_neo',
    icon: '𝕏',
    url: 'https://twitter.com',
    color: '#E8D5FF',
    desc: '1.2k followers',
  },
  {
    platform: 'LinkedIn',
    handle: 'Kai Nakamura',
    icon: '💼',
    url: 'https://linkedin.com',
    color: '#00F5FF',
    desc: '500+ connections',
  },
  {
    platform: 'Dribbble',
    handle: '@kai.design',
    icon: '🏀',
    url: 'https://dribbble.com',
    color: '#FF2D78',
    desc: '48 shots · 320 followers',
  },
  {
    platform: 'Dev.to',
    handle: '@kai_codes',
    icon: '📝',
    url: 'https://dev.to',
    color: '#A855F7',
    desc: '12 articles · 4.1k reads',
  },
  {
    platform: 'Discord',
    handle: 'kai_neo#2048',
    icon: '🎮',
    url: 'https://discord.com',
    color: '#7289DA',
    desc: 'Cyberpunk Dev Community',
  },
];

export default function PhoneModal({ onClose }: PhoneModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Phone frame */}
      <div
        className="slide-up-modal relative"
        style={{ width: '100%', maxWidth: '360px' }}
      >
        {/* Phone outer shell */}
        <div
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1a0a2e 0%, #0d0618 100%)',
            border: '3px solid rgba(255,45,120,0.4)',
            boxShadow: '0 0 40px rgba(255,45,120,0.2), 0 30px 80px rgba(0,0,0,0.8)',
            padding: '16px',
          }}
        >
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 mb-4">
            <span className="font-mono text-xs text-muted-foreground">21:42</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-muted-foreground opacity-60" />
              <div className="font-mono text-xs text-muted-foreground">●●●</div>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full"
            style={{ background: '#0d0618' }} />

          {/* App header */}
          <div className="text-center mb-6 px-4">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(255,45,120,0.1))',
                border: '2px solid rgba(255,45,120,0.4)',
              }}>
              🧑‍💻
            </div>
            <h3 className="font-mono font-bold text-foreground">Kai Nakamura</h3>
            <p className="font-mono text-xs text-secondary">Full-Stack Engineer</p>
          </div>

          {/* Social links */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-cyber px-1">
            {SOCIALS.map((social, i) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-secondary/30 transition-all group skill-badge"
                style={{
                  background: 'rgba(255,45,120,0.05)',
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: 'forwards',
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: `${social.color}15`,
                    border: `1px solid ${social.color}30`,
                  }}>
                  {social.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold text-foreground">{social.platform}</div>
                  <div className="font-mono text-xs truncate" style={{ color: social.color }}>{social.handle}</div>
                  <div className="font-mono text-xs text-muted-foreground">{social.desc}</div>
                </div>
                <div className="font-mono text-xs text-muted-foreground group-hover:text-secondary transition-colors">→</div>
              </a>
            ))}
          </div>

          {/* Home indicator */}
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 rounded-full bg-muted-foreground opacity-40" />
          </div>
        </div>

        {/* Close button outside phone */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border glass-dark"
        >
          ✕ CLOSE
        </button>
      </div>
    </div>
  );
}