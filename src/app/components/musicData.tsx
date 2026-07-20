// app/components/musicData.ts
// Audio lives in /public/music. Cover art (optional) goes in /public/art —
// until you add real covers, a generated placeholder cover is shown.

export interface Track { id: string; title: string; src: string; }

export interface Album {
  id: string;
  artist: string;
  title: string;
  year: string;
  accent: string;      // hex — themes the 3D cover + the modal row
  cover?: string;      // optional real art e.g. '/art/album-1.png' (falls back to a generated cover)
  tracks: Track[];
}

export const ALBUMS: Album[] = [
  {
    id: 'cigs', artist: 'Cigarettes After Sex', title: 'Dream Pop', year: '2017',
    accent: '#FF2D78', cover: '/art/album-1.png',
    tracks: [
      { id: 'cas-1', title: 'Apocalypse',                    src: '/music/apocolypse.mp3' },
      { id: 'cas-2', title: "Nothing's Gonna Hurt You Baby", src: '/music/Cigarette_After_Sex_-_Nothing_s_Gonna_Hurt_You_Baby_(mp3.pm).mp3' },
    ],
  },
  {
    id: 'bryan', artist: 'Bryan Adams', title: 'Classics', year: '1993',
    accent: '#FFB347', cover: '/art/album-2.png',
    tracks: [
      { id: 'ba-1', title: 'Heaven',             src: '/music/heaven_bryan_adams.mp3' },
      { id: 'ba-2', title: 'Please Forgive Me',  src: '/music/please_forgive_me.mp3' },
    ],
  },
  {
    id: 'lany', artist: 'LANY', title: 'Late Nights', year: '2018',
    accent: '#00F5FF', cover: '/art/album-3.png',
    tracks: [
      { id: 'ln-1', title: 'Mean It',   src: '/music/mean_it.mp3' },
      { id: 'ln-2', title: 'Destiny',   src: '/music/destiny_lany.mp3' },
    ],
  },
  {
    // TODO: 4th album — replace artist/title/year/accent/cover + track titles & src
    // once you add the files to /public/music and /public/art.
    id: 'album4', artist: 'Coming Soon', title: 'Untitled', year: '',
    accent: '#b060ff', cover: '/art/album-4.png',
    tracks: [
      { id: 'a4-1', title: 'Track One', src: '/music/placeholder-1.mp3' },
      { id: 'a4-2', title: 'Track Two', src: '/music/placeholder-2.mp3' },
    ],
  },
];

// flat list in album order — handy for next/prev + the mini-player
export const ALL_TRACKS = ALBUMS.flatMap((a) =>
  a.tracks.map((t) => ({ ...t, artist: a.artist, album: a.title, accent: a.accent }))
);

export type FlatTrack = (typeof ALL_TRACKS)[number];