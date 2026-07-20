'use client';

import React from 'react';
import { ALBUMS } from './musicData';

interface MusicModalProps {
  onClose: () => void;
  currentTrackId: string | null;
  isPlaying: boolean;
  onPlay: (trackId: string) => void;
}

export default function MusicModal({ onClose, currentTrackId, isPlaying, onPlay }: MusicModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="slide-up-modal w-full max-w-3xl max-h-[90vh] glass-dark border border-border rounded-2xl overflow-hidden flex flex-col"
        style={{ boxShadow: '0 0 60px rgba(255,179,71,0.14), 0 30px 80px rgba(0,0,0,0.8)' }}>

        {/* title bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <div className="w-3 h-3 rounded-full bg-accent" />
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="ml-3 font-mono text-xs text-muted-foreground tracking-widest">record_player.app</span>
          </div>
          <button onClick={onClose} className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
            ✕ CLOSE
          </button>
        </div>

        {/* header */}
        <div className="px-6 pt-5 pb-3 shrink-0">
          <h2 className="font-mono text-lg font-bold" style={{ color: '#FFB347', textShadow: '0 0 12px rgba(255,179,71,0.5)' }}>
            ♪ Pick a record
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Choose something to spin — it keeps playing while you explore the room.
          </p>
        </div>

        {/* albums */}
        <div className="flex-1 overflow-y-auto scrollbar-cyber px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALBUMS.map((album) => (
            <div key={album.id} className="rounded-xl border border-border overflow-hidden" style={{ background: 'rgba(13,6,24,0.6)' }}>
              <div className="flex gap-3 p-3">
                {/* cover (real art overlays the gradient; falls back if missing) */}
                <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, #140b1e, ${album.accent})`, border: `1px solid ${album.accent}55` }}>
                  <span style={{ color: album.accent, fontSize: 26 }}>♫</span>
                  {album.cover && (
                    <img
                      src={album.cover}
                      alt={album.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget.style.display = 'none'); }}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-sm font-bold text-foreground truncate">{album.title}</div>
                  <div className="font-mono text-xs truncate" style={{ color: album.accent }}>{album.artist}</div>
                  <div className="font-mono text-xs text-muted-foreground">{album.year}</div>
                </div>
              </div>

              {/* tracks */}
              <div className="px-3 pb-3 space-y-1">
                {album.tracks.map((track) => {
                  const active = currentTrackId === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => onPlay(track.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left"
                      style={{
                        background: active ? `${album.accent}18` : 'transparent',
                        border: active ? `1px solid ${album.accent}55` : '1px solid transparent',
                      }}
                    >
                      <span className="font-mono text-xs w-4 shrink-0" style={{ color: album.accent }}>
                        {active && isPlaying ? '❚❚' : '▶'}
                      </span>
                      <span className="font-mono text-xs text-foreground flex-1 truncate">{track.title}</span>
                      {active && isPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: album.accent }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}