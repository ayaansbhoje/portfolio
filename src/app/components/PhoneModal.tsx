'use client';

import React from 'react';

interface PhoneModalProps {
  onClose: () => void;
}

const SOCIALS = [
  {
    platform: 'LinkedIn',
    handle: 'Ayaan Bhoje',
    icon: '\u{1F4BC}',
    url: 'https://www.linkedin.com/in/ayaan-bhoje-8146a524b/',
    color: '#00F5FF',
    desc: 'Full-Stack Dev \u00B7 Marketing Tech',
  },
  {
    platform: 'GitHub',
    handle: '@ayaansbhoje',
    icon: '\u{1F419}',
    url: 'https://github.com/ayaansbhoje',
    color: '#E8D5FF',
    desc: 'Projects & client work',
  },
  {
    platform: 'Email',
    handle: 'bhojeayaan8@gmail.com',
    icon: '\u2709\uFE0F',
    url: 'mailto:bhojeayaan8@gmail.com',
    color: '#FFB347',
    desc: 'Open for work & collabs',
  },
  {
    platform: 'Phone',
    handle: '+91 79770 26717',
    icon: '\u{1F4DE}',
    url: 'tel:+917977026717',
    color: '#FF2D78',
    desc: 'Tap to call',
  },
];

export default function PhoneModal({ onClose }: PhoneModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Phone frame */}
      <div className="slide-up-modal relative" style={{ width: '100%', maxWidth: '360px' }}>
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
              <div className="font-mono text-xs text-muted-foreground">{'\u25CF\u25CF\u25CF'}</div>
            </div>
          </div>

          {/* Notch */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full"
            style={{ background: '#0d0618' }}
          />

          {/* App header */}
          <div className="text-center mb-6 px-4">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,45,120,0.2), rgba(255,45,120,0.1))',
                border: '2px solid rgba(255,45,120,0.4)',
              }}
            >
              {'\u{1F9D1}\u200D\u{1F4BB}'}
            </div>
            <h3 className="font-mono font-bold text-foreground">Ayaan Bhoje</h3>
            <p className="font-mono text-xs text-secondary">
              Full-Stack Developer &amp; Marketing Technologist
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-1">
              Mumbai, IN {'\u00B7'} B.Tech IT + AI Honors
            </p>
          </div>

          {/* Contact / social links */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-cyber px-1">
            {SOCIALS.map((social, i) => {
              const isExternal = social.url.startsWith('http');
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-secondary/30 transition-all group skill-badge"
                  style={{
                    background: 'rgba(255,45,120,0.05)',
                    animationDelay: `${i * 0.08}s`,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{
                      background: `${social.color}15`,
                      border: `1px solid ${social.color}30`,
                    }}
                  >
                    {social.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-bold text-foreground">{social.platform}</div>
                    <div className="font-mono text-xs truncate" style={{ color: social.color }}>
                      {social.handle}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">{social.desc}</div>
                  </div>
                  <div className="font-mono text-xs text-muted-foreground group-hover:text-secondary transition-colors">
                    {'\u2192'}
                  </div>
                </a>
              );
            })}
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
          {'\u2715'} CLOSE
        </button>
      </div>
    </div>
  );
}