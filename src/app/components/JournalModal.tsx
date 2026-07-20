'use client';

import React, { useState } from 'react';

interface JournalModalProps {
  onClose: () => void;
}

/* ============================================================
   BRAND WORK JOURNAL
   Each page = one client/brand, with a moodboard image grid.

   📁 Drop your images into:  public/assets/journal/
   Expected filenames (any that are missing just show a
   styled placeholder tile — nothing breaks):

     doubletick-1.jpg  doubletick-2.jpg  doubletick-3.jpg
     cnbc-1.jpg        cnbc-2.jpg        cnbc-3.jpg
     plumperch-1.jpg   plumperch-2.jpg   plumperch-3.jpg
     maaximum-1.jpg    maaximum-2.jpg    maaximum-3.jpg
     katha-1.jpg       katha-2.jpg       katha-3.jpg

   You can also add/remove entries in the `moodboard` arrays —
   the grid adapts (3 tiles looks best).
   ============================================================ */

interface JournalPage {
  brand: string;
  role: string;
  period: string;
  location: string;
  color: string;
  icon: string;
  summary: string;
  work: string[];            // what you actually did
  deliverables: string[];    // chips
  moodboard: { src: string; label: string }[];
}

const JOURNAL_PAGES: JournalPage[] = [
  {
    brand: 'DoubleTick',
    role: 'Marketing Automation & Campaigns',
    period: 'Jan 2026 — Present',
    location: 'Remote',
    color: '#00F5FF',
    icon: '⚡',
    summary:
      'Running comprehensive marketing campaigns and building the automation engine behind CRM outreach.',
    work: [
      'Executing end-to-end marketing campaigns across channels.',
      'Managing advanced automation workflows in Pabbly and n8n.',
      'Developing custom HTML email templates for outreach sequences.',
      'Injecting JavaScript code blocks inside automations to optimize CRM outreach logic.',
    ],
    deliverables: ['Pabbly', 'n8n', 'HTML Templates', 'JavaScript', 'CRM Outreach'],
    moodboard: [
      { src: '/assets/journal/doubletick-1.jpg', label: 'Campaign flow' },
      { src: '/assets/journal/doubletick-2.jpg', label: 'Email template' },
      { src: '/assets/journal/doubletick-3.jpg', label: 'Automation map' },
    ],
  },
  {
    brand: 'CNBC News Anchor',
    role: 'Content & Social Media Strategy',
    period: 'Oct 2025 — Present',
    location: 'Remote',
    color: '#FF2D78',
    icon: '🎙️',
    summary:
      'Building the personal brand of a finance news anchor across social platforms — from raw footage to published post.',
    work: [
      'Handling content creation and video editing for finance-focused social content.',
      'Designing the social media strategy across platforms.',
      'Writing copy that turns market news into scroll-stopping posts.',
      'Maintaining a consistent visual identity across every platform.',
    ],
    deliverables: ['Video Editing', 'Copywriting', 'Social Strategy', 'After Effects', 'Content Design'],
    moodboard: [
      { src: '/assets/journal/cnbc-1.jpg', label: 'Reel frames' },
      { src: '/assets/journal/cnbc-2.jpg', label: 'Post designs' },
      { src: '/assets/journal/cnbc-3.jpg', label: 'Brand kit' },
    ],
  },
  {
    brand: 'Plum Perch',
    role: 'Web Design & Development',
    period: 'Mar 2025 — May 2025',
    location: 'Mumbai, IN',
    color: '#A855F7',
    icon: '🪶',
    summary:
      'A modern, trendy website for a marketing firm — built to create brand awareness and convert visitors into clients.',
    work: [
      'Designed and developed the full site in React.js + Tailwind CSS.',
      'Implemented responsive design across all breakpoints.',
      'Built interactive UI/UX elements to boost engagement.',
      'Shaped the brand\'s digital-first look and feel with Figma.',
    ],
    deliverables: ['React.js', 'Tailwind CSS', 'Figma', 'UI/UX', 'Responsive Design'],
    moodboard: [
      { src: '/assets/journal/plumperch-1.jpg', label: 'Landing hero' },
      { src: '/assets/journal/plumperch-2.jpg', label: 'Style tiles' },
      { src: '/assets/journal/plumperch-3.jpg', label: 'Mobile views' },
    ],
  },
  {
    brand: 'Maaximum Holidays',
    role: 'Content Creation & Marketing',
    period: 'Dec 2023',
    location: 'Mumbai, IN',
    color: '#FFB347',
    icon: '🏝️',
    summary:
      'Travel agency marketing sprint — content, edits and copy that sell the destination before the ticket.',
    work: [
      'Created marketing content for travel packages and destinations.',
      'Edited promotional videos for social channels.',
      'Wrote copy for campaigns and destination highlights.',
    ],
    deliverables: ['Content Creation', 'Video Editing', 'Copywriting', 'Photoshop'],
    moodboard: [
      { src: '/assets/journal/maaximum-1.jpg', label: 'Destination posts' },
      { src: '/assets/journal/maaximum-2.jpg', label: 'Video stills' },
      { src: '/assets/journal/maaximum-3.jpg', label: 'Ad creatives' },
    ],
  },
  {
    brand: 'Katha Amaltas',
    role: 'Film Studio Portfolio Site',
    period: 'Dec 2025 — Jan 2026',
    location: 'Remote',
    color: '#3ea9ff',
    icon: '🎬',
    summary:
      'A dynamic portfolio website for a film studio — cinematic front-end with heavy visual design and custom animation.',
    work: [
      'Designed and developed the studio site in React.js + Tailwind CSS.',
      'Engineered custom JavaScript animations for an engaging front-end.',
      'Implemented extensive visual design elements to match the studio\'s film work.',
    ],
    deliverables: ['React.js', 'Tailwind CSS', 'JS Animations', 'Visual Design'],
    moodboard: [
      { src: '/assets/journal/katha-1.jpg', label: 'Homepage' },
      { src: '/assets/journal/katha-2.jpg', label: 'Film grid' },
      { src: '/assets/journal/katha-3.jpg', label: 'Motion frames' },
    ],
  },
];

/* moodboard tile — image with graceful placeholder fallback */
function MoodTile({ src, label, color }: { src: string; label: string; color: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        aspectRatio: '4 / 3',
        background: `linear-gradient(135deg, ${color}14, rgba(20,10,30,0.5))`,
        border: `1px solid ${color}35`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        transform: 'rotate(-0.4deg)',
      }}
    >
      {ok ? (
        <img
          src={src}
          alt={label}
          onError={() => setOk(false)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* placeholder tile — looks like a pinned swatch */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span style={{ fontSize: 20, opacity: 0.55 }}>🖼️</span>
          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: `${color}aa` }}>
            {label}
          </span>
        </div>
      )}
      {/* label strip over real images */}
      {ok && (
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase"
          style={{ background: 'rgba(10,6,18,0.65)', color: '#e8d5ff', backdropFilter: 'blur(4px)' }}
        >
          {label}
        </div>
      )}
      {/* washi-tape corner */}
      <div style={{
        position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
        width: 42, height: 12, background: `${color}55`, borderRadius: 2,
      }} />
    </div>
  );
}

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
      <div className="slide-up-modal w-full max-w-3xl">
        {/* Book outer */}
        <div
          className="relative rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, #f5e6c8 0%, #e8d4a0 100%)',
            boxShadow: '0 0 60px rgba(0,0,0,0.6), -4px 0 20px rgba(0,0,0,0.4)',
            maxHeight: '88vh',
          }}
        >
          {/* Book spine */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10"
            style={{
              width: '20px',
              background: 'linear-gradient(180deg, #c8a060 0%, #a07840 100%)',
              borderRight: '2px solid rgba(120,80,30,0.4)',
            }}
          />

          {/* Page content — scrollable */}
          <div key={pageKey} className="page-flip ml-6 px-7 pt-7 pb-4 overflow-y-auto scrollbar-cyber relative"
            style={{ flex: 1, minHeight: 0 }}>

            {/* Notebook lines in background */}
            <div className="absolute inset-y-0 left-2 right-0 pointer-events-none" style={{ zIndex: 0 }}>
              {[...Array(24)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: `${(i + 1) * 4.2}%`,
                  left: 0, right: 0,
                  height: '1px',
                  background: 'rgba(100,70,30,0.08)',
                }} />
              ))}
            </div>

            <div className="relative" style={{ zIndex: 1 }}>
              {/* Page header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-mono text-xs mb-1" style={{ color: page.color === '#FFB347' ? '#a07840' : page.color }}>
                    {page.period} · {page.location}
                  </div>
                  <h3 className="font-bold text-xl text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>
                    {page.brand}
                  </h3>
                  <p className="text-stone-600 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
                    {page.role}
                  </p>
                </div>
                <div className="text-3xl">{page.icon}</div>
              </div>

              {/* summary — handwritten-style intro */}
              <p className="text-stone-700 text-sm mb-4" style={{ fontFamily: 'Georgia, serif', lineHeight: 1.6 }}>
                {page.summary}
              </p>

              <div className="mb-4" style={{ borderBottom: '2px solid rgba(120,80,30,0.2)' }} />

              {/* ── MOODBOARD ── */}
              <div className="mb-5">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                  style={{ color: '#a07840' }}>
                  ✂ moodboard / brand work
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {page.moodboard.map((m) => (
                    <MoodTile key={m.src} src={m.src} label={m.label} color={page.color} />
                  ))}
                </div>
              </div>

              {/* ── WHAT I DID ── */}
              <div className="mb-5">
                <div className="font-mono text-[10px] tracking-[0.25em] uppercase mb-2"
                  style={{ color: '#a07840' }}>
                  ✎ work log
                </div>
                <ul className="space-y-2">
                  {page.work.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-stone-700"
                      style={{ fontFamily: 'Georgia, serif', lineHeight: 1.55 }}>
                      <span style={{ color: page.color === '#FFB347' ? '#a07840' : page.color, marginTop: '2px', flexShrink: 0 }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── DELIVERABLES ── */}
              <div className="flex flex-wrap gap-2 pb-2">
                {page.deliverables.map(tag => (
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
            </div>
          </div>

          {/* Page navigation */}
          <div
            className="flex items-center justify-between px-8 py-3 border-t shrink-0"
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

            {/* Page dots — labelled with brand initial */}
            <div className="flex items-center gap-2">
              {JOURNAL_PAGES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  title={p.brand}
                  className="transition-all"
                  style={{
                    width: i === currentPage ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === currentPage ? (p.color === '#FFB347' ? '#a07840' : p.color) : 'rgba(120,80,30,0.3)',
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