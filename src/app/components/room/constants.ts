// Shared placement + time-of-day config used across the room components.

export const DESK_TOP = 1.61;
// Desk cluster placement. x = 0 keeps it centered.
// z is negative = pushed toward the window/back wall. More negative = closer to the wall.
export const DESK_X = 0;
export const DESK_Z = -2.6;

export const TOD = {
  morning:   { ambient:{c:'#ffe3bd',i:0.9},  dir:{c:'#ffd39a',i:1.3, p:[-7,8,5]},  neon:{c:'#ffb060',i:0.6}, fill:{c:'#ffcf99',i:0.5}, sky:{c:'#ffbf80',i:0.9},  fog:'#181420', accent:'#FFD060' },
  afternoon: { ambient:{c:'#ffd0a8',i:0.75}, dir:{c:'#ff9a4d',i:1.5, p:[-6,8,6]},  neon:{c:'#ff7a4d',i:0.7}, fill:{c:'#ffb26b',i:0.5}, sky:{c:'#ff9a4d',i:0.75}, fog:'#141019', accent:'#FF9A40' },
  night:     { ambient:{c:'#2b2450',i:0.8},  dir:{c:'#5060b0',i:1.0, p:[-5,7,4]},  neon:{c:'#00e5ff',i:1.4}, fill:{c:'#b060ff',i:1.1}, sky:{c:'#00e5ff',i:0.85}, fog:'#08060f', accent:'#00F5FF' },
} as const;

// eased lerp factor for the night-fade materials + lights
export const lerpK = (dt: number) => 1 - Math.pow(0.0016, Math.min(dt, 0.05));