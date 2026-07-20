// Procedural canvas textures + the shared color-shade helper.

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}

export function makeWoodFloorCanvas() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1024;
  const ctx = c.getContext('2d')!;
  const W = c.width, H = c.height;

  ctx.fillStyle = '#2a1c12';
  ctx.fillRect(0, 0, W, H);

  const plankH = 146;
  const tones = ['#2a1c12', '#33251a', '#3b2a1b', '#241811', '#301f14', '#3d2a17'];
  let row = 0;

  for (let y = 0; y < H; y += plankH) {
    const offset = (row % 2) * 260;                 // stagger the seams (brick-lay)
    for (let x = -300; x < W + 300; x += 300) {
      const px = x + offset;
      const pw = 240 + Math.random() * 90;
      const tone = tones[(Math.random() * tones.length) | 0];

      const g = ctx.createLinearGradient(0, y, 0, y + plankH);
      g.addColorStop(0, shade(tone, 10));
      g.addColorStop(0.5, tone);
      g.addColorStop(1, shade(tone, -12));
      ctx.fillStyle = g;
      ctx.fillRect(px, y, pw, plankH);

      // dark wandering grain
      ctx.strokeStyle = 'rgba(0,0,0,0.16)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const gy = y + 10 + Math.random() * (plankH - 20);
        ctx.beginPath();
        ctx.moveTo(px, gy);
        ctx.bezierCurveTo(
          px + pw * 0.3, gy + (Math.random() - 0.5) * 7,
          px + pw * 0.7, gy + (Math.random() - 0.5) * 7,
          px + pw, gy,
        );
        ctx.stroke();
      }
      // warm highlight streaks
      ctx.strokeStyle = 'rgba(150,95,55,0.09)';
      for (let i = 0; i < 3; i++) {
        const gy = y + 16 + Math.random() * (plankH - 32);
        ctx.beginPath();
        ctx.moveTo(px, gy);
        ctx.lineTo(px + pw, gy);
        ctx.stroke();
      }
      // vertical seam
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(px + pw - 2, y, 3, plankH);
    }
    // horizontal seam
    ctx.fillStyle = 'rgba(0,0,0,0.42)';
    ctx.fillRect(0, y + plankH - 2, W, 3);
    row++;
  }
  return c;
}

export function makeRugCanvas() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  const S = 512, mid = S / 2;
  const base = '#5f4a3c';                            // warm taupe/mocha — change this to retint

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  // coarse woven cross-hatch (jute vibe)
  const cell = 9;
  for (let y = 0; y < S; y += cell) {
    for (let x = 0; x < S; x += cell) {
      const over = (((x / cell) | 0) + ((y / cell) | 0)) % 2 === 0;
      ctx.fillStyle = over ? shade(base, 12) : shade(base, -14);
      ctx.fillRect(x, y, cell - 1, cell - 1);
    }
  }

  // speckle for texture
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2);
  }

  // concentric border rings (sit near the circular rug's edge)
  const ring = (r: number, w: number, col: string) => {
    ctx.strokeStyle = col; ctx.lineWidth = w;
    ctx.beginPath(); ctx.arc(mid, mid, r, 0, Math.PI * 2); ctx.stroke();
  };
  ring(mid * 0.93, 10, shade(base, -26));
  ring(mid * 0.86, 4, '#8a6a48');                    // faint amber pinstripe → ties into the room
  ring(mid * 0.80, 2, shade(base, -20));

  return c;
}

/* procedural album-cover placeholder (used until you drop real art in) */
export function makeAlbumCoverCanvas(album: { artist: string; title: string; accent: string }) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d')!;
  const S = 512;

  const g = ctx.createLinearGradient(0, 0, S, S);
  g.addColorStop(0, '#140b1e');
  g.addColorStop(1, album.accent);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2);
  }

  // off-center record disc
  const cx = S * 0.62, cy = S * 0.4;
  ctx.save();
  const disc = ctx.createRadialGradient(cx, cy, 6, cx, cy, 150);
  disc.addColorStop(0, 'rgba(0,0,0,0.9)');
  disc.addColorStop(0.7, 'rgba(0,0,0,0.9)');
  disc.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2;
  for (let r = 28; r < 140; r += 10) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = album.accent;
  ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#f4ecff';
  ctx.font = 'bold 40px monospace'; ctx.textBaseline = 'top';
  ctx.fillText(album.artist.toUpperCase(), 34, 356, S - 68);
  ctx.fillStyle = 'rgba(244,236,255,0.72)';
  ctx.font = '24px monospace';
  ctx.fillText(album.title, 34, 408, S - 68);

  ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, S - 36, S - 36);
  return c;
}