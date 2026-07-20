'use client';

import React, { useState } from 'react';

interface JournalModalProps {
  onClose: () => void;
}

const JOURNAL_PAGES = [
  {
    title: 'Current Role',
    period: '2024 — Present',
    company: 'NeonLabs Inc.',
    role: 'Senior Full-Stack Engineer',
    location: 'San Francisco, CA',
    color: '#00F5FF',
    content: [
      'Leading frontend architecture for a real-time analytics platform serving 200k+ daily active users.',
      'Reduced initial page load by 62% by migrating to React Server Components and edge caching.',
      'Mentoring a team of 4 junior engineers, establishing code review standards and pairing sessions.',
      'Built a custom WebSocket infrastructure handling 50k concurrent connections with <30ms latency.',
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'Go', 'Kubernetes'],
  },
  {
    title: 'Previous Role',
    period: '2022 — 2024',
    company: 'Axiom Digital',
    role: 'Full-Stack Developer',
    location: 'Remote',
    color: '#FF2D78',
    content: [
      'Designed and shipped 12 client projects from discovery to launch, spanning fintech, health, and creative industries.',
      'Built a headless CMS integration layer used across all client projects, cutting delivery time by 40%.',
      'Introduced automated E2E testing (Playwright) that caught 78% of regressions before production.',
      'Collaborated directly with clients, running weekly demos and translating feedback into sprint tasks.',
    ],
    tags: ['Vue', 'Node.js', 'PostgreSQL', 'Playwright', 'AWS'],
  },
  {
    title: 'Early Career',
    period: '2020 — 2022',
    company: 'Pixel Studio',
    role: 'Frontend Developer',
    location: 'Los Angeles, CA',
    color: '#A855F7',
    content: [
      'Developed interactive marketing microsites for entertainment and gaming clients including two AAA studios.',
      'Created a reusable animation component library (30+ components) that became the studio\'s design system.',
      'Optimized WebGL scenes reducing render overhead by 45% across 6 live productions.',
      'First engineer on the team to adopt TypeScript, later trained 3 colleagues on the migration path.',
    ],
    tags: ['JavaScript', 'GSAP', 'WebGL', 'Three.js', 'Sass'],
  },
  {
    title: 'Education',
    period: '2016 — 2020',
    company: 'UC San Diego',
    role: 'B.S. Computer Science',
    location: 'San Diego, CA',
    color: '#FFB347',
    content: [
      'Graduated with honors (GPA 3.8/4.0). Focused on systems programming and human-computer interaction.',
      'Senior thesis: "Perceptual Latency in Browser-Based Rendering Pipelines" — cited in 3 papers.',
      'Founded the university\'s first Creative Coding Club with 80+ active members by graduation.',
      'TA for CS101 Introduction to Programming for 2 semesters.',
    ],
    tags: ['C++', 'Python', 'OpenGL', 'Research', 'Teaching'],
  },
];

export default function JournalModal({ onClose }: JournalModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKey, setPageKey] = useState(0);

  const goToPage = (idx: number) => {
    setCurrentPage(idx);
    setPageKey(k => k + 1);
  };

  const page = JOURNAL_PAGES[currentPage];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="slide-up-modal w-full max-w-2xl">
        {/* Book outer */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8 0%, #e8d4a0 100%)',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), -4px 0 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Book spine */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: '20px',
              background: 'linear-gradient(180deg, #c8a060 0%, #a07840 100%)',
              borderRight: '2px solid rgba(120,80,30,0.4)',
            }}
          />

          {/* Page content */}
          <div key={pageKey} className="page-flip ml-6 p-8">
            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="font-mono text-xs mb-1" style={{ color: page.color, fontFamily: 'cursive' }}>
                  {page.period}
                </div>
                <h3 className="font-bold text-xl text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>
                  {page.role}
                </h3>
                <p className="text-stone-600 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  {page.company} · {page.location}
                </p>
              </div>
              <div className="text-3xl">📖</div>
            </div>

            {/* Divider line (like notebook rule) */}
            <div className="mb-4" style={{ borderBottom: '2px solid rgba(120,80,30,0.2)' }} />

            {/* Content */}
            <ul className="space-y-3 mb-6">
              {page.content.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-stone-700" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.6 }}>
                  <span style={{ color: page.color, marginTop: '2px', flexShrink: 0 }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {page.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{
                    background: `${page.color}20`,
                    color: page.color === '#FFB347' ? '#a07840' : page.color,
                    border: `1px solid ${page.color}40`,
                  }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Notebook lines in background */}
            <div className="absolute inset-y-0 left-8 right-0 pointer-events-none" style={{ zIndex: 0 }}>
              {[...Array(20)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${(i + 1) * 5}%`,
                  left: 0, right: 0,
                  height: '1px',
                  background: 'rgba(100,70,30,0.08)',
                }} />
              ))}
            </div>
          </div>

          {/* Page navigation */}
          <div
            className="flex items-center justify-between px-8 py-4 border-t"
            style={{
              background: 'rgba(200,160,80,0.2)',
              borderColor: 'rgba(120,80,30,0.2)',
              marginLeft: '20px',
            }}
          >
            <button
              onClick={() => goToPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="font-mono text-xs px-3 py-1.5 rounded border transition-all disabled:opacity-30"
              style={{
                borderColor: 'rgba(120,80,30,0.4)',
                color: '#a07840',
                background: 'transparent',
              }}
            >
              ← PREV
            </button>

            {/* Page dots */}
            <div className="flex items-center gap-2">
              {JOURNAL_PAGES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className="transition-all"
                  style={{
                    width: i === currentPage ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === currentPage ? p.color : 'rgba(120,80,30,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(Math.min(JOURNAL_PAGES.length - 1, currentPage + 1))}
              disabled={currentPage === JOURNAL_PAGES.length - 1}
              className="font-mono text-xs px-3 py-1.5 rounded border transition-all disabled:opacity-30"
              style={{
                borderColor: 'rgba(120,80,30,0.4)',
                color: '#a07840',
                background: 'transparent',
              }}
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* Close button */}
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