// app/components/tvData.ts
// Your showreel "channels". Drop clips into public/tv/videos and (optional)
// client logos into public/tv/logos, then edit the paths below.
// If a video file is missing, the channel still looks intentional (accent bg + brand).
// `logo` can be an image path ('/tv/logos/x.png') OR an emoji (e.g. '🎬').

export interface Channel {
  id: string;
  brand: string;       // client / project name
  short: string;       // tiny label shown on the channel button
  logo: string;        // '/tv/logos/x.png' or an emoji
  video: string;       // '/tv/videos/x.mp4'
  accent: string;      // themes the button + screen tint
  tagline?: string;    // small caption bottom-left
}

export const TV_CHANNELS: Channel[] = [
  { id: 'ch1', brand: 'Cafe & Restaurant', short: 'Cafe', logo: '🎬', video: '/assets/channel_1.mp4', accent: '#00F5FF', tagline: 'Brand Film · 2024' },
  { id: 'ch2', brand: 'Podcasts', short: 'Pod', logo: '⚡', video: '/assets/channel_2.mp4', accent: '#FF2D78', tagline: 'Product Launch Reel' },
  { id: 'ch3', brand: 'Commercials', short: 'Comm', logo: '🌇', video: '/assets/We_are_here.mp4', accent: '#FFB347', tagline: 'Lifestyle Campaign' },
  { id: 'ch4', brand: 'Short Content', short: 'Short', logo: '🎵', video: '/assets/short_Cont.mp4', accent: '#b060ff', tagline: 'Music Video Edit' },
];