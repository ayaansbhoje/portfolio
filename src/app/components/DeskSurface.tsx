'use client';

import React from 'react';
import { TimeOfDay } from './DeskScene';

interface DeskSurfaceProps {
  onOpenLaptop: () => void;
  onOpenPhone: () => void;
  onOpenJournal: () => void;
  currentTime: string;
  currentDate: string;
  colonVisible: boolean;
  timeOfDay: TimeOfDay;
}

export default function DeskSurface({
  onOpenLaptop,
  onOpenPhone,
  onOpenJournal,
  currentTime,
  currentDate,
  colonVisible,
  timeOfDay,
}: DeskSurfaceProps) {
  const timeDisplay = colonVisible ? currentTime : currentTime.replace(':', ' ');

  const isNight = timeOfDay === 'night';
  const isMorning = timeOfDay === 'morning';

  // Color themes per time of day
  const accentColor = isNight ? '#00F5FF' : isMorning ? '#FFD060' : '#FF9A40';
  const accentGlow = isNight ? 'rgba(0,245,255,0.5)' : isMorning ? 'rgba(255,208,96,0.5)' : 'rgba(255,154,64,0.5)';
  const deskBg = isNight
    ? 'linear-gradient(180deg, #2e1a50 0%, #1e0f38 30%, #140a28 70%, #0e0720 100%)'
    : isMorning
    ? 'linear-gradient(180deg, #1a2840 0%, #101c30 30%, #0a1422 70%, #060e18 100%)'
    : 'linear-gradient(180deg, #1e2038 0%, #141628 30%, #0c1020 70%, #080c18 100%)';

  return (
    // Scale down the entire desk scene — push it further away with scale transform
    <div className="absolute bottom-0 left-0 right-0 z-10" style={{ height: '52%' }}>

      {/* === DESK SURFACE === */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '100%',
        background: deskBg,
        borderTop: `1px solid ${isNight ? 'rgba(140,80,200,0.35)' : isMorning ? 'rgba(80,120,200,0.3)' : 'rgba(80,100,180,0.3)'}`,
      }} />

      {/* Desk top edge - warm light reflection */}
      <div className="absolute top-0 left-0 right-0" style={{
        height: '3px',
        background: `linear-gradient(90deg, transparent 0%, ${isNight ? 'rgba(255,160,80,0.2)' : isMorning ? 'rgba(255,200,100,0.3)' : 'rgba(255,180,120,0.25)'} 20%, ${isNight ? 'rgba(255,200,120,0.35)' : isMorning ? 'rgba(255,220,140,0.45)' : 'rgba(255,200,140,0.4)'} 50%, ${isNight ? 'rgba(255,160,80,0.2)' : isMorning ? 'rgba(255,200,100,0.3)' : 'rgba(255,180,120,0.25)'} 80%, transparent 100%)`,
      }} />

      {/* Warm window light on desk surface */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% -10%, ${isNight ? 'rgba(255,160,80,0.06)' : isMorning ? 'rgba(255,200,100,0.1)' : 'rgba(255,180,100,0.08)'} 0%, transparent 70%)`,
      }} />

      {/* Desk legs */}
      <div className="absolute" style={{ left: '8%', bottom: 0, width: '3px', height: '25%', background: isNight ? 'linear-gradient(180deg, #1a0a30, #0a0318)' : 'linear-gradient(180deg, #0e1828, #060c18)', borderRadius: '2px' }} />
      <div className="absolute" style={{ right: '8%', bottom: 0, width: '3px', height: '25%', background: isNight ? 'linear-gradient(180deg, #1a0a30, #0a0318)' : 'linear-gradient(180deg, #0e1828, #060c18)', borderRadius: '2px' }} />

      {/* ===== DESK ITEMS — scaled down and repositioned for "further away" feel ===== */}

      {/* === LEFT SPEAKER === */}
      <div className="absolute" style={{ left: '3%', bottom: '50%', width: '6%' }}>
        <div style={{
          background: isNight
            ? 'linear-gradient(145deg, #2e1a50 0%, #1a0a30 60%, #100620 100%)'
            : 'linear-gradient(145deg, #1a2840 0%, #0e1828 60%, #080e18 100%)',
          borderRadius: '8px',
          border: `1px solid ${isNight ? 'rgba(120,70,180,0.35)' : 'rgba(80,120,180,0.3)'}`,
          padding: '8px 6px',
          aspectRatio: '0.72',
          position: 'relative',
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            width: '72%', height: '0', paddingBottom: '72%', margin: '8% auto 4%',
            borderRadius: '50%',
            background: isNight
              ? 'radial-gradient(circle at 35% 35%, #3a2060 0%, #1e0e38 50%, #0e0620 100%)'
              : 'radial-gradient(circle at 35% 35%, #1e2a40 0%, #0e1828 50%, #060e18 100%)',
            border: `2px solid ${isNight ? 'rgba(120,70,180,0.4)' : 'rgba(80,120,180,0.35)'}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '30%', height: '30%', borderRadius: '50%',
              background: isNight
                ? 'radial-gradient(circle, #4a2880 0%, #2a1050 100%)'
                : 'radial-gradient(circle, #2a3860 0%, #141e38 100%)',
            }} />
          </div>
          <div style={{
            width: '35%', height: '3px', margin: '0 auto',
            borderRadius: '2px',
            background: `${accentColor}26`,
          }} />
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', top: `${8 + i * 5}%`, left: '15%', right: '15%',
              height: '1px', background: isNight ? 'rgba(120,70,180,0.2)' : 'rgba(80,120,180,0.18)',
            }} />
          ))}
        </div>
      </div>

      {/* === PLANT (far left) === */}
      <div className="absolute" style={{ left: '-0.5%', bottom: '65%', width: '5.5%' }}>
        <svg viewBox="0 0 60 80" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <path d="M18 65 L42 65 L38 80 L22 80 Z" fill={isNight ? '#3a2060' : '#1a2840'} stroke={isNight ? 'rgba(120,70,180,0.3)' : 'rgba(80,120,180,0.25)'} strokeWidth="1" />
          <rect x="15" y="60" width="30" height="6" rx="2" fill={isNight ? '#4a2880' : '#1e3050'} stroke={isNight ? 'rgba(120,70,180,0.3)' : 'rgba(80,120,180,0.25)'} strokeWidth="1" />
          <ellipse cx="30" cy="60" rx="14" ry="3" fill={isNight ? '#2a1040' : '#101828'} />
          <path d="M30 58 Q25 45 18 35" stroke="#2d6a4f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 55 Q35 42 42 32" stroke="#2d6a4f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M30 52 Q28 38 30 25" stroke="#2d6a4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="16" cy="33" rx="10" ry="5" fill="#40916c" transform="rotate(-30 16 33)" />
          <ellipse cx="43" cy="30" rx="10" ry="5" fill="#52b788" transform="rotate(25 43 30)" />
          <ellipse cx="30" cy="22" rx="8" ry="4" fill="#40916c" transform="rotate(-5 30 22)" />
          <ellipse cx="12" cy="40" rx="8" ry="4" fill="#52b788" transform="rotate(-45 12 40)" />
          <ellipse cx="46" cy="38" rx="8" ry="4" fill="#40916c" transform="rotate(40 46 38)" />
        </svg>
      </div>

      {/* === JOURNAL / NOTEBOOK === */}
      <div
        className="desk-item-hover absolute"
        style={{ left: '10%', bottom: '46%', width: '12%' }}
        onClick={onOpenJournal}
        role="button"
        tabIndex={0}
        aria-label="Open journal - work experience"
        onKeyDown={(e) => e.key === 'Enter' && onOpenJournal()}
      >
        <div style={{ position: 'relative', aspectRatio: '1.35' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '4px 10px 10px 4px',
            transform: 'translate(3px, 3px)',
            filter: 'blur(4px)',
          }} />
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #f0e0c0 0%, #e8d0a0 40%, #d4b870 100%)',
            borderRadius: '4px 10px 10px 4px',
            border: '1px solid rgba(180,140,80,0.6)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 3px 12px rgba(0,0,0,0.4)',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '10%',
              background: 'linear-gradient(180deg, #c89050 0%, #a07030 100%)',
              borderRight: '1px solid rgba(120,80,30,0.4)',
            }} />
            {[18, 30, 42, 54, 66, 78].map(pct => (
              <div key={pct} style={{
                position: 'absolute', left: '14%', right: '10%',
                top: `${pct}%`, height: '1px',
                background: 'rgba(100,70,30,0.25)',
              }} />
            ))}
            <div style={{
              position: 'absolute', bottom: '12%', left: '14%', right: '8%',
              textAlign: 'center',
              fontSize: 'clamp(6px, 0.8vw, 10px)',
              color: 'rgba(100,60,20,0.7)',
              fontFamily: 'cursive',
              fontStyle: 'italic',
            }}>
              work log
            </div>
          </div>
          <div style={{
            position: 'absolute', right: '-5%', top: '10%',
            width: '5px', height: '72%',
            background: 'linear-gradient(180deg, #ff7040 0%, #d04020 70%, #8b2010 100%)',
            borderRadius: '3px 3px 1px 1px',
            transform: 'rotate(8deg)',
          }} />
        </div>
      </div>

      {/* === LAPTOP === */}
      <div
        className="desk-item-hover absolute"
        style={{ left: '28%', bottom: '40%', width: '30%' }}
        onClick={onOpenLaptop}
        role="button"
        tabIndex={0}
        aria-label="Open laptop - portfolio and skills"
        onKeyDown={(e) => e.key === 'Enter' && onOpenLaptop()}
      >
        {/* Laptop shadow */}
        <div style={{
          position: 'absolute', bottom: '-4px', left: '5%', right: '5%',
          height: '16px',
          background: 'rgba(0,0,0,0.5)',
          filter: 'blur(6px)',
          borderRadius: '50%',
        }} />

        {/* Laptop lid */}
        <div style={{
          width: '100%',
          background: isNight
            ? 'linear-gradient(145deg, #2e1a50 0%, #1e0e38 50%, #120828 100%)'
            : 'linear-gradient(145deg, #1a2840 0%, #0e1828 50%, #080e18 100%)',
          borderRadius: '8px 8px 0 0',
          border: `1.5px solid ${isNight ? 'rgba(120,70,180,0.5)' : 'rgba(80,120,180,0.4)'}`,
          borderBottom: 'none',
          padding: '3% 2.5%',
          aspectRatio: '1.65',
          position: 'relative',
          boxShadow: '0 -4px 18px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '100%', height: '100%',
            background: '#080414',
            borderRadius: '5px',
            border: `1px solid ${accentColor}26`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              height: '14px',
              background: `${accentColor}0f`,
              borderBottom: `1px solid ${accentColor}1a`,
              display: 'flex', alignItems: 'center', padding: '0 6px', gap: '3px',
            }}>
              {['#FF2D78','#FFB347','#00F5FF'].map((c, i) => (
                <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <div style={{ flex: 1, height: '3px', background: `${accentColor}14`, borderRadius: '2px', marginLeft: '5px' }} />
            </div>
            <div style={{ padding: '6px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[
                { w: '55%', c: `${accentColor}80` },
                { w: '75%', c: 'rgba(255,45,120,0.4)' },
                { w: '40%', c: 'rgba(255,179,71,0.4)' },
                { w: '85%', c: `${accentColor}4d` },
                { w: '60%', c: 'rgba(255,45,120,0.35)' },
                { w: '45%', c: `${accentColor}40` },
              ].map((line, i) => (
                <div key={i} style={{ height: '2px', width: line.w, background: line.c, borderRadius: '1px' }} />
              ))}
            </div>
            <div style={{
              height: '12%',
              background: `${accentColor}0a`,
              borderTop: `1px solid ${accentColor}1a`,
              display: 'flex', alignItems: 'center', padding: '0 6px', gap: '2px',
            }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  width: '7%', aspectRatio: 1, borderRadius: '2px',
                  background: `${accentColor}${Math.round((0.1 + i * 0.04) * 255).toString(16).padStart(2,'0')}`,
                }} />
              ))}
            </div>
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at 50% 40%, ${accentColor}0f 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
          </div>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            opacity: 0.2,
          }}>
            <span style={{ color: accentColor, fontSize: 'clamp(14px, 2.2vw, 26px)', textShadow: `0 0 10px ${accentColor}` }}>彩</span>
          </div>
        </div>

        {/* Keyboard base */}
        <div style={{
          width: '108%', marginLeft: '-4%',
          height: '15px',
          background: isNight
            ? 'linear-gradient(180deg, #2a1848 0%, #1a0e30 100%)'
            : 'linear-gradient(180deg, #1a2840 0%, #0e1828 100%)',
          borderRadius: '0 0 6px 6px',
          border: `1.5px solid ${isNight ? 'rgba(120,70,180,0.4)' : 'rgba(80,120,180,0.35)'}`,
          borderTop: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: '70%', height: '4px', borderRadius: '2px',
            background: `linear-gradient(90deg, ${accentColor}0d, ${accentColor}40, ${accentColor}0d)`,
            boxShadow: `0 0 6px ${accentColor}26`,
          }} />
        </div>

        {/* Headphones */}
        <div style={{
          position: 'absolute', bottom: '-18%', left: '30%',
          fontSize: 'clamp(14px, 1.8vw, 22px)',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
        }}>
          🎧
        </div>
      </div>

      {/* === DIGITAL CLOCK === */}
      <div className="absolute" style={{ left: '61%', bottom: '48%', zIndex: 5 }}>
        <div style={{
          background: isNight
            ? 'linear-gradient(135deg, #080414 0%, #0e0820 100%)'
            : 'linear-gradient(135deg, #060c18 0%, #0a1020 100%)',
          border: `1.5px solid ${accentColor}80`,
          borderRadius: '7px',
          padding: '6px 11px',
          boxShadow: `0 0 16px ${accentColor}26, 0 0 32px ${accentColor}0f, inset 0 0 10px rgba(0,0,0,0.8)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${accentColor}0a 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          <div className="font-mono font-bold" style={{
            fontSize: 'clamp(13px, 1.8vw, 22px)',
            color: accentColor,
            textShadow: `0 0 6px ${accentColor}, 0 0 12px ${accentGlow}`,
            letterSpacing: '0.12em',
            lineHeight: 1,
          }}>
            {timeDisplay}
          </div>
          <div className="font-mono text-center" style={{
            fontSize: 'clamp(6px, 0.75vw, 9px)',
            color: `${accentColor}8c`,
            letterSpacing: '0.25em',
            marginTop: '3px',
          }}>
            {currentDate}
          </div>
        </div>
      </div>

      {/* === COFFEE MUG === */}
      <div className="absolute" style={{ left: '62%', bottom: '40%', width: '6.5%' }}>
        {/* Steam */}
        <div className="absolute" style={{ bottom: '100%', left: '15%', width: '70%', height: '50px', overflow: 'visible', pointerEvents: 'none' }}>
          {[
            { left: '15%', delay: '0s', color: isNight ? 'rgba(220,200,255,0.5)' : 'rgba(200,220,255,0.45)' },
            { left: '45%', delay: '0.9s', color: isNight ? 'rgba(200,180,255,0.4)' : 'rgba(180,200,255,0.35)' },
            { left: '75%', delay: '1.8s', color: isNight ? 'rgba(220,200,255,0.35)' : 'rgba(200,220,255,0.3)' },
          ].map((s, i) => (
            <div key={i} className="steam-particle absolute" style={{
              left: s.left, bottom: 0,
              width: '4px', height: '4px',
              borderRadius: '50%',
              background: s.color,
              animationDelay: s.delay,
              filter: 'blur(1px)',
            }} />
          ))}
        </div>

        {/* Mug body */}
        <div style={{
          width: '100%',
          aspectRatio: '0.82',
          background: isNight
            ? 'linear-gradient(145deg, #1e0e38 0%, #120828 60%, #0a0418 100%)'
            : 'linear-gradient(145deg, #0e1828 0%, #080e18 60%, #040a10 100%)',
          borderRadius: '4px 4px 8px 8px',
          border: `1.5px solid ${accentColor}59`,
          boxShadow: `0 0 10px ${accentColor}1a, 0 3px 10px rgba(0,0,0,0.5)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="font-mono text-center" style={{
            fontSize: 'clamp(4px, 0.55vw, 7px)',
            color: accentColor,
            textShadow: `0 0 5px ${accentColor}`,
            marginTop: '28%',
            letterSpacing: '0.05em',
            fontWeight: 700,
          }}>
            {isNight ? 'NEO-BREW' : isMorning ? 'MORNING' : 'COZY'}
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
            background: 'linear-gradient(180deg, #4a2010 0%, #200a04 100%)',
            borderRadius: '0 0 6px 6px',
          }} />
          <div style={{
            position: 'absolute', top: '8%', left: '10%',
            width: '14%', height: '32%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.07), transparent)',
            borderRadius: '3px',
          }} />
        </div>

        {/* Handle */}
        <div style={{
          position: 'absolute', right: '-18%', top: '18%',
          width: '20%', height: '46%',
          border: `1.5px solid ${accentColor}4d`,
          borderLeft: 'none',
          borderRadius: '0 7px 7px 0',
        }} />
      </div>

      {/* === MOBILE PHONE === */}
      <div
        className="desk-item-hover absolute"
        style={{ left: '72%', bottom: '40%', width: '4.5%' }}
        onClick={onOpenPhone}
        role="button"
        tabIndex={0}
        aria-label="Open phone - social media"
        onKeyDown={(e) => e.key === 'Enter' && onOpenPhone()}
      >
        <div style={{
          position: 'absolute', bottom: '-3px', left: '10%', right: '10%',
          height: '6px', background: 'rgba(0,0,0,0.4)', filter: 'blur(3px)', borderRadius: '50%',
        }} />
        <div style={{
          width: '100%',
          aspectRatio: '0.46',
          background: isNight
            ? 'linear-gradient(145deg, #1e0e38 0%, #120828 60%, #0a0418 100%)'
            : 'linear-gradient(145deg, #0e1828 0%, #080e18 60%, #040a10 100%)',
          borderRadius: '8px',
          border: '1.5px solid rgba(255,45,120,0.45)',
          boxShadow: '0 0 12px rgba(255,45,120,0.1), 0 3px 10px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: '8% 7%',
            background: 'linear-gradient(135deg, #0a0418 0%, #160a28 100%)',
            borderRadius: '5px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '2px',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '3px' }}>
              {[...Array(9)].map((_, i) => (
                <div key={i} style={{
                  width: '7px', height: '7px', borderRadius: '2px',
                  background: `rgba(255,45,120,${0.15 + (i % 4) * 0.08})`,
                }} />
              ))}
            </div>
          </div>
          <div style={{
            position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)',
            width: '26%', height: '3px', background: '#0a0418', borderRadius: '2px',
          }} />
          <div style={{
            position: 'absolute', bottom: '3%', left: '50%', transform: 'translateX(-50%)',
            width: '30%', height: '2px', background: 'rgba(255,45,120,0.4)', borderRadius: '2px',
          }} />
        </div>
      </div>

      {/* === RIGHT SPEAKER === */}
      <div className="absolute" style={{ right: '3%', bottom: '46%', width: '6%' }}>
        <div style={{
          background: isNight
            ? 'linear-gradient(145deg, #2e1a50 0%, #1a0a30 60%, #100620 100%)'
            : 'linear-gradient(145deg, #1a2840 0%, #0e1828 60%, #080e18 100%)',
          borderRadius: '8px',
          border: `1px solid ${isNight ? 'rgba(120,70,180,0.35)' : 'rgba(80,120,180,0.3)'}`,
          padding: '8px 6px',
          aspectRatio: '0.72',
          position: 'relative',
          boxShadow: '0 6px 18px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            width: '72%', height: '0', paddingBottom: '72%', margin: '8% auto 4%',
            borderRadius: '50%',
            background: isNight
              ? 'radial-gradient(circle at 35% 35%, #3a2060 0%, #1e0e38 50%, #0e0620 100%)'
              : 'radial-gradient(circle at 35% 35%, #1e2a40 0%, #0e1828 50%, #060e18 100%)',
            border: `2px solid ${isNight ? 'rgba(120,70,180,0.4)' : 'rgba(80,120,180,0.35)'}`,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: '30%', height: '30%', borderRadius: '50%',
              background: isNight
                ? 'radial-gradient(circle, #4a2880 0%, #2a1050 100%)'
                : 'radial-gradient(circle, #2a3860 0%, #141e38 100%)',
            }} />
          </div>
          <div style={{
            width: '35%', height: '3px', margin: '0 auto',
            borderRadius: '2px',
            background: 'rgba(255,45,120,0.15)',
          }} />
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute', top: `${8 + i * 5}%`, left: '15%', right: '15%',
              height: '1px', background: isNight ? 'rgba(120,70,180,0.2)' : 'rgba(80,120,180,0.18)',
            }} />
          ))}
        </div>
      </div>

      {/* === PLANT (right, cactus) === */}
      <div className="absolute" style={{ right: '0.5%', bottom: '57%', width: '5.5%' }}>
        <svg viewBox="0 0 60 80" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
          <path d="M18 65 L42 65 L38 80 L22 80 Z" fill={isNight ? '#3a2060' : '#1a2840'} stroke={isNight ? 'rgba(120,70,180,0.3)' : 'rgba(80,120,180,0.25)'} strokeWidth="1" />
          <rect x="15" y="60" width="30" height="6" rx="2" fill={isNight ? '#4a2880' : '#1e3050'} stroke={isNight ? 'rgba(120,70,180,0.3)' : 'rgba(80,120,180,0.25)'} strokeWidth="1" />
          <ellipse cx="30" cy="60" rx="14" ry="3" fill={isNight ? '#2a1040' : '#101828'} />
          <rect x="24" y="20" width="12" height="42" rx="6" fill="#2d6a4f" />
          <rect x="14" y="32" width="12" height="8" rx="4" fill="#2d6a4f" />
          <rect x="14" y="24" width="8" height="16" rx="4" fill="#2d6a4f" />
          <rect x="34" y="38" width="12" height="8" rx="4" fill="#2d6a4f" />
          <rect x="38" y="30" width="8" height="16" rx="4" fill="#2d6a4f" />
          {[25, 32, 40, 48].map(y => (
            <line key={y} x1="22" y1={y} x2="18" y2={y - 2} stroke="#52b788" strokeWidth="1" />
          ))}
          {[25, 32, 40, 48].map(y => (
            <line key={`r${y}`} x1="38" y1={y} x2="42" y2={y - 2} stroke="#52b788" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* === CABLE === */}
      <svg className="absolute" style={{ left: '40%', bottom: '37%', width: '20%', height: '28px', overflow: 'visible', pointerEvents: 'none' }}>
        <path d="M 0 22 Q 35 7 72 16 Q 100 23 135 10" stroke={isNight ? 'rgba(120,70,180,0.35)' : 'rgba(80,120,180,0.3)'} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 0 22 Q 35 7 72 16 Q 100 23 135 10" stroke={`${accentColor}14`} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      {/* === DESK AMBIENT LIGHT === */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% -5%, ${isMorning ? 'rgba(255,200,100,0.08)' : 'rgba(255,160,80,0.06)'} 0%, transparent 55%)`,
      }} />
    </div>
  );
}