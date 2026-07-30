'use client';

import React, { useState } from 'react';

interface JournalModalProps {
  onClose: () => void;
}

/* ============================================================
   BRAND WORK JOURNAL
   One page per client/brand, with a moodboard gallery.

   The moodboard is a JUSTIFIED STRIP: every tile is given the
   same media height, and each tile measures its own media and
   adopts that exact aspect ratio. So nothing is ever cropped,
   nothing is ever letterboxed, and the row still lines up.

   Drop media into:  public/assets/  (and public/assets/journal/)
   Missing files fall back to a styled "pinned swatch" placeholder.
   ============================================================ */

const ICON = {
  scissors: '\u2702',
  pen: '\u270E',
  star: '\u2726',
  left: '\u2190',
  right: '\u2192',
  close: '\u2715',
  film: '\u{1F3AC}',
  photo: '\u{1F5BC}',
};

interface MoodItem { src: string; label: string; }

interface JournalPage {
  brand: string;
  role: string;
  period: string;
  location: string;
  color: string;
  icon: string;
  summary: string;
  work: string[];
  deliverables: string[];
  moodboard: MoodItem[];
}

const JOURNAL_PAGES: JournalPage[] = [
  {
    brand: 'DoubleTick',
    role: 'Marketing Automation & Campaigns',
    period: 'Jan 2026 - Present',
    location: 'Remote',
    color: '#00F5FF',
    icon: '\u26A1',
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
      { src: '/assets/doubletick_journal_3.png', label: 'Campaign flow' },
      { src: '/assets/doubletick_journal_2.png', label: 'Email template' },
      { src: '/assets/doubletick_journal_3.png', label: 'Automation map' },
    ],
  },
  {
    brand: 'CNBC News Anchor',
    role: 'Content & Social Media Strategy',
    period: 'Oct 2025 - Present',
    location: 'Remote',
    color: '#FF2D78',
    icon: '\u{1F399}\uFE0F',
    summary:
      'Building the personal brand of a finance news anchor across social platforms - from raw footage to published post.',
    work: [
      'Handling content creation and video editing for finance-focused social content.',
      'Designing the social media strategy across platforms.',
      'Writing copy that turns market news into scroll-stopping posts.',
      'Maintaining a consistent visual identity across every platform.',
    ],
    deliverables: ['Video Editing', 'Copywriting', 'Social Strategy', 'After Effects', 'Content Design'],
    moodboard: [
      { src: '/assets/cnbc_journal_1.png', label: 'Reel frames' },
      { src: '/assets/cnbc_visual_2_final.mp4', label: 'Reel edit' },
      { src: '/assets/cnbc_Journal_3.png', label: 'Brand kit' },
    ],
  },
  {
    brand: 'Plum Perch',
    role: 'Web Design & Development',
    period: 'Mar 2025 - May 2025',
    location: 'Mumbai, IN',
    color: '#A855F7',
    icon: '\u{1FAB6}',
    summary:
      'A modern, trendy website for a marketing firm - built to create brand awareness and convert visitors into clients.',
    work: [
      'Designed and developed the full site in React.js + Tailwind CSS.',
      'Implemented responsive design across all breakpoints.',
      'Built interactive UI/UX elements to boost engagement.',
      'Shaped the brand\'s digital-first look and feel with Figma.',
    ],
    deliverables: ['React.js', 'Tailwind CSS', 'Figma', 'UI/UX', 'Responsive Design'],
    moodboard: [
      { src: '/assets/plumperch_journal_1.png', label: 'Landing hero' },
      { src: '/assets/plumperch_jounral_4.mp4', label: 'Site walkthrough' },
      { src: '/assets/plumperch_journal_3.png', label: 'Mobile views' },
    ],
  },
  {
    brand: 'Maaximum Holidays',
    role: 'Content Creation & Marketing',
    period: 'Dec 2023',
    location: 'Mumbai, IN',
    color: '#FFB347',
    icon: '\u{1F3DD}\uFE0F',
    summary:
      'Travel agency marketing sprint - content, edits and copy that sell the destination before the ticket.',
    work: [
      'Created marketing content for travel packages and destinations.',
      'Edited promotional videos for social channels.',
      'Wrote copy for campaigns and destination highlights.',
    ],
    deliverables: ['Content Creation', 'Video Editing', 'Copywriting', 'Photoshop'],
    moodboard: [
      { src: '/assets/maaximum_jounral_1.png', label: 'Destination posts' },
      { src: '/assets/maaximum_journal_2.mp4', label: 'Promo video' },
      { src: '/assets/maaximum_journal_3.png', label: 'Ad creatives' },
    ],
  },
];

/* ---------- paper palette ---------- */

const PAPER_TOP = '#f8eed8';
const PAPER_BOT = '#e8d6b0';
const INK_BODY = '#4a3a28';
const INK_SOFT = '#8a7250';
const RULE = 'rgba(120,80,30,0.13)';

/* Darken a neon accent until it is readable as ink on cream paper.
   Replaces the old hardcoded "#FFB347 -> #a07840" special case and
   fixes cyan/amber brands that used to wash out. */
function ink(hex: string, maxL = 0.34) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return INK_BODY;
  const n = parseInt(m[1], 16);
  let r = ((n >> 16) & 255) / 255;
  let g = ((n >> 8) & 255) / 255;
  let b = (n & 255) / 255;
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (L > maxL && L > 0) {
    const k = maxL / L;
    r *= k; g *= k; b *= k;
  }
  const to = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
  return `#${to(r)}${to(g)}${to(b)}`;
}

/* ---------- one moodboard tile ----------
   Measures its own media and adopts that aspect ratio, so the
   media is shown whole at its true proportions - never cropped,
   never boxed inside a mismatched frame. */

const MEDIA_H = 'clamp(140px, 21vh, 210px)';

function MoodTile({ src, label, color, tilt }: {
  src: string; label: string; color: string; tilt: number;
}) {
  const [ratio, setRatio] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(false);

  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const loaded = ratio !== null;
  const shown = failed ? 4 / 3 : (ratio ?? 4 / 3);
  const accent = ink(color, 0.42);

  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        margin: 0,
        padding: '7px 7px 4px',
        borderRadius: 4,
        background: 'linear-gradient(160deg,#fffdf7,#f3e9d6)',
        border: '1px solid rgba(120,80,30,0.22)',
        boxShadow: hover
          ? '0 14px 26px rgba(60,35,10,0.30)'
          : '0 3px 10px rgba(60,35,10,0.20)',
        transform: hover ? 'rotate(0deg) translateY(-6px)' : `rotate(${tilt}deg)`,
        transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.32s ease',
        position: 'relative',
        zIndex: hover ? 5 : 1,
      }}
    >
      {/* washi tape */}
      <span style={{
        position: 'absolute', top: -8, left: '50%',
        transform: `translateX(-50%) rotate(${tilt * 1.6 - 1.5}deg)`,
        width: 46, height: 14, borderRadius: 2,
        background: `${color}44`,
        border: `1px solid ${color}55`,
        zIndex: 3,
      }} />

      <div style={{
        position: 'relative',
        height: MEDIA_H,
        aspectRatio: String(shown),
        borderRadius: 2,
        overflow: 'hidden',
        background: failed ? 'transparent' : '#1a1420',
      }}>
        {!failed && !loaded && (
          <div className="jm-shimmer" style={{ position: 'absolute', inset: 0 }} />
        )}

        {!failed && (
          isVideo ? (
            <video
              src={src}
              autoPlay muted loop playsInline preload="metadata"
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (v.videoWidth && v.videoHeight) setRatio(v.videoWidth / v.videoHeight);
                else setRatio(16 / 9);
              }}
              onError={() => setFailed(true)}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={src}
              alt={label}
              onLoad={(e) => {
                const i = e.currentTarget;
                if (i.naturalWidth && i.naturalHeight) setRatio(i.naturalWidth / i.naturalHeight);
                else setRatio(4 / 3);
              }}
              onError={() => setFailed(true)}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        )}

        {failed && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 6,
            border: `1.5px dashed ${color}66`,
            borderRadius: 2,
            background: `linear-gradient(160deg, ${color}14, rgba(255,253,247,0.6))`,
          }}>
            <span style={{ fontSize: 22, opacity: 0.65 }}>{isVideo ? ICON.film : ICON.photo}</span>
            <span className="font-mono" style={{
              fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent,
            }}>
              {isVideo ? 'clip pending' : 'still pending'}
            </span>
          </div>
        )}

        {/* reel badge */}
        {!failed && isVideo && (
          <span className="font-mono" style={{
            position: 'absolute', top: 6, right: 6, zIndex: 2,
            padding: '2px 6px', borderRadius: 3, fontSize: 8, letterSpacing: '0.12em',
            background: 'rgba(12,8,20,0.72)', color: '#fff',
            border: `1px solid ${color}88`,
          }}>
            {'\u25B6'} REEL
          </span>
        )}
      </div>

      <figcaption style={{
        marginTop: 6, marginBottom: 2,
        textAlign: 'center',
        fontFamily: "'Segoe Script','Bradley Hand','Comic Sans MS',cursive",
        fontSize: 12,
        color: accent,
        lineHeight: 1.2,
      }}>
        {label}
      </figcaption>
    </figure>
  );
}

/* ---------- the journal ---------- */

export default function JournalModal({ onClose }: JournalModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKey, setPageKey] = useState(0);

  const goToPage = (idx: number) => {
    setCurrentPage(idx);
    setPageKey((k) => k + 1);
  };

  const page = JOURNAL_PAGES[currentPage];
  const accent = ink(page.color);
  const tilts = [-1.6, 0.9, 1.8];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`
        @keyframes jmShimmer { 0%{background-position:-180% 0} 100%{background-position:180% 0} }
        .jm-shimmer {
          background: linear-gradient(100deg, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.03) 70%);
          background-size: 220% 100%;
          animation: jmShimmer 1.5s linear infinite;
        }
      `}</style>

      <div className="slide-up-modal relative w-full max-w-4xl">
        {/* ---- book ---- */}
        <div
          className="relative rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: `linear-gradient(150deg, ${PAPER_TOP} 0%, ${PAPER_BOT} 100%)`,
            boxShadow: '0 0 70px rgba(0,0,0,0.65), -6px 0 26px rgba(0,0,0,0.45)',
            maxHeight: '88vh',
          }}
        >
          {/* spine + stitching */}
          <div className="absolute left-0 top-0 bottom-0 z-20" style={{
            width: 26,
            background: 'linear-gradient(90deg,#a87c3c 0%,#c9a163 55%,#9c7134 100%)',
            borderRight: '2px solid rgba(90,60,20,0.45)',
          }}>
            {[...Array(12)].map((_, i) => (
              <span key={i} style={{
                position: 'absolute', left: 11, top: `${6 + i * 7.6}%`,
                width: 4, height: 4, borderRadius: '50%',
                background: 'rgba(255,245,220,0.42)',
              }} />
            ))}
          </div>

          {/* bookmark ribbon */}
          <div className="font-mono" style={{
            position: 'absolute', top: 0, right: 30, zIndex: 20,
            padding: '16px 9px 7px', borderRadius: '0 0 3px 3px',
            background: page.color, color: '#120a1e',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            boxShadow: '0 3px 9px rgba(0,0,0,0.3)',
          }}>
            {String(currentPage + 1).padStart(2, '0')}
          </div>

          {/* ---- page ---- */}
          <div
            key={pageKey}
            className="page-flip overflow-y-auto scrollbar-cyber relative"
            style={{ flex: 1, minHeight: 0, marginLeft: 26, padding: '26px 30px 16px 40px' }}
          >
            {/* ruled lines */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
              backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, transparent 27px, ${RULE} 27px, ${RULE} 28px)`,
            }} />
            {/* red margin */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 24, width: 1.5,
              background: 'rgba(190,70,60,0.30)', zIndex: 0, pointerEvents: 'none',
            }} />

            <div className="relative" style={{ zIndex: 1 }}>
              {/* ---- header ---- */}
              <div className="flex items-start gap-4 mb-4">
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26,
                  background: `linear-gradient(150deg, ${page.color}30, ${page.color}12)`,
                  border: `1.5px solid ${page.color}66`,
                  boxShadow: `0 3px 10px ${page.color}22`,
                }}>
                  {page.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 style={{
                    fontFamily: 'Georgia, serif', fontWeight: 700,
                    fontSize: 'clamp(19px, 2.4vw, 26px)', lineHeight: 1.15,
                    color: '#33260f', margin: 0,
                  }}>
                    {page.brand}
                  </h3>
                  <p style={{
                    fontFamily: 'Georgia, serif', fontStyle: 'italic',
                    fontSize: 14, color: accent, marginTop: 2,
                  }}>
                    {page.role}
                  </p>
                </div>

                {/* date stamp */}
                <div className="font-mono shrink-0" style={{
                  textAlign: 'right', fontSize: 10, lineHeight: 1.55,
                  color: INK_SOFT, letterSpacing: '0.08em',
                  border: `1px dashed ${INK_SOFT}66`, borderRadius: 5,
                  padding: '5px 8px', transform: 'rotate(1.4deg)',
                }}>
                  <div style={{ color: accent, fontWeight: 700 }}>{page.period}</div>
                  <div>{page.location}</div>
                </div>
              </div>

              {/* accent rule */}
              <div style={{
                height: 3, borderRadius: 2, marginBottom: 14,
                background: `linear-gradient(90deg, ${page.color}, ${page.color}22 70%, transparent)`,
              }} />

              {/* summary */}
              <p style={{
                fontFamily: 'Georgia, serif', fontSize: 14.5, lineHeight: 1.75,
                color: INK_BODY, marginBottom: 20,
              }}>
                {page.summary}
              </p>

              {/* ---- moodboard ---- */}
              <div className="mb-6">
                <div className="font-mono mb-3" style={{
                  fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: INK_SOFT,
                }}>
                  {ICON.scissors} moodboard / brand work
                </div>
                <div style={{
                  display: 'flex', flexWrap: 'wrap',
                  alignItems: 'flex-start', justifyContent: 'center',
                  gap: 16, paddingTop: 8,
                }}>
                  {page.moodboard.map((m, i) => (
                    <MoodTile
                      key={`${page.brand}-${i}`}
                      src={m.src}
                      label={m.label}
                      color={page.color}
                      tilt={tilts[i % tilts.length]}
                    />
                  ))}
                </div>
              </div>

              {/* ---- work log ---- */}
              <div className="mb-5">
                <div className="font-mono mb-3" style={{
                  fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: INK_SOFT,
                }}>
                  {ICON.pen} work log
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {page.work.map((item, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      fontFamily: 'Georgia, serif', fontSize: 14, lineHeight: 1.75,
                      color: INK_BODY, marginBottom: 6,
                    }}>
                      <span style={{ color: accent, flexShrink: 0, lineHeight: 1.6 }}>{ICON.star}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ---- deliverables ---- */}
              <div className="flex flex-wrap gap-2 pb-3">
                {page.deliverables.map((tag) => (
                  <span key={tag} className="font-mono" style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 999,
                    background: `${page.color}1f`,
                    color: accent,
                    border: `1px solid ${page.color}55`,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ---- nav ---- */}
          <div
            className="flex items-center justify-between px-7 py-3 shrink-0"
            style={{
              marginLeft: 26,
              background: 'linear-gradient(180deg, rgba(200,160,80,0.14), rgba(160,120,50,0.22))',
              borderTop: '1px solid rgba(120,80,30,0.25)',
            }}
          >
            <button
              onClick={() => goToPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="font-mono text-xs px-3 py-1.5 rounded transition-all disabled:opacity-30"
              style={{ border: '1px solid rgba(120,80,30,0.45)', color: '#8a6a32', background: 'transparent', cursor: 'pointer' }}
            >
              {ICON.left} PREV
            </button>

            <div className="flex items-center gap-2">
              {JOURNAL_PAGES.map((p, i) => (
                <button
                  key={p.brand}
                  onClick={() => goToPage(i)}
                  title={p.brand}
                  className="transition-all"
                  style={{
                    width: i === currentPage ? 26 : 8,
                    height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
                    background: i === currentPage ? p.color : 'rgba(120,80,30,0.32)',
                    boxShadow: i === currentPage ? `0 0 8px ${p.color}88` : 'none',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => goToPage(Math.min(JOURNAL_PAGES.length - 1, currentPage + 1))}
              disabled={currentPage === JOURNAL_PAGES.length - 1}
              className="font-mono text-xs px-3 py-1.5 rounded transition-all disabled:opacity-30"
              style={{ border: '1px solid rgba(120,80,30,0.45)', color: '#8a6a32', background: 'transparent', cursor: 'pointer' }}
            >
              NEXT {ICON.right}
            </button>
          </div>
        </div>

        {/* close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-lg border border-border glass-dark"
        >
          {ICON.close} CLOSE
        </button>
      </div>
    </div>
  );
}