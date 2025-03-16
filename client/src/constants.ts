export const KEYS = [
  'A Major',
  'A Minor',
  'A# Major',
  'A# Minor',
  'B Major',
  'B Minor',
  'C Major',
  'C Minor',
  'C# Major',
  'C# Minor',
  'D Major',
  'D Minor',
  'D# Major',
  'D# Minor',
  'E Major',
  'E Minor',
  'F Major',
  'F Minor',
  'F# Major',
  'F# Minor',
  'G Major',
  'G Minor',
  'G# Major',
  'G# Minor',
]

export const GENRES = ['Trap', 'BoomBap', 'Rage', 'Drill', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'Electronic', 'House', 'Techno']

export const INSTRUMENTS = [
  'Drums',
  '808',
  'Synth',
  'Pad',
  'Lead',
  'Pluck',
  'Electric Guitar',
  'Acoustic Guitar',
  'Bass Guitar',
  'Piano',
  'Grand Piano',
  'Keyboard',
  'Violin',
  'Cello',
  'Strings',
  'Flute',
  'Saxophone',
  'Trumpet',
  'Vocal Chop',
  'Choir',
  'Vocal Sample',
]

export const MOODS = [
  'Happy',
  'Sad',
  'Energetic',
  'Relaxed',
  'Romantic',
  'Melancholic',
  'Angry',
  'Uplifting',
  'Calm',
  'Motivational',
  'Chill',
  'Introspective',
  'Euphoric',
  'Aggressive',
  'Dark',
  'Nostalgic',
  'Mysterious',
  'Hopeful',
  'Playful',
  'Sentimental',
  'Tense',
  'Excited',
  'Dreamy',
  'Epic',
  'Mellow',
  'Groovy',
  'Trippy',
  'Peaceful',
  'Surreal',
  'Funky',
]

export const TRACK_TYPES: TrackType[] = ['all', 'beat', 'loop', 'sample']

export const GENERIC_ERROR_TOAST = { type: 'error' as ToastType, title: 'Something went wrong' }

//social platforms
export const PLATFORMS: Platform[] = ['facebook', 'instagram', 'soundcloud', 'youtube', 'twitter', 'tiktok', 'other']

export const PLATFORM_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  soundcloud: 'Soundcloud',
  youtube: 'Youtube',
  twitter: 'Twitter',
  tiktok: 'TikTok',
  other: 'Other',
}

export const PLATFORM_ICONS = {
  facebook:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/></svg>',
  instagram:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/></svg>',
  soundcloud:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M11.56 8.87V17h8.76c1.54-.18 2.67-1.44 2.67-3c0-1.65-1.34-2.97-3-3h-1c-.43-3-2.97-5.3-6.03-5.3c-.6 0-1.17.11-1.7.3c.3.65.5 1.35.5 2.09m-1.5 1.8L10 17V8.5a2.5 2.5 0 0 0-.69-1.72l-.06-.06a2.5 2.5 0 0 0-1.74-.72H7.5l-.16.05c-.67.17-1.28.54-1.69 1.05h-.03A3 3 0 0 0 5 8.5V17h1V8.74a2 2 0 0 1 .99-1.74c.3-.18.63-.26.99-.27c.43-.1.88.18 1.2.5c.29.29.49.69.49 1.12c0 .12-.2.23-.2.34l-.04.31M2 9v8h1V9H2m-2 2v4h1v-4H0Z"/></svg>',
  youtube:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73Z"/></svg>',
  twitter:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"/></svg>',
  tiktok:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 20.34 9h-2.17c-.06 1.21-.6 2.1-1.94 2.1C15.24 11.1 14 9.89 14 8.9c0-.95.79-1.85 2.05-1.85c.2 0 .38.02.55.06c.78.18 1.54-.54 1.54-1.29m-1.43 5.32V18h-2.97v-2.04c0-2.08.55-3.8 2.97-4.82m3.32-11.04c.03-.84.8-1.47 1.62-1.25c.83.22 1.31 1.12.98 1.95c-.33.83-1.32 1.27-2.13.97c-.78-.3-1.21-1.16-.99-1.97l.19-1.13M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.34 7c2.25-.65 3.85.36 3.85.36v2.47c-.77-.83-2.01-.98-2.01-.98v5.37c0 1.19-.68 3.38-3.45 3.38c-1.33 0-2.88-.49-2.88-2.3c0-3.08 3.28-3.65 3.28-3.65l.02 2.42s-1.75.06-1.75 1.37c0 .47.33.77.86.77c1.62 0 1.65-1.77 1.65-1.77V9c-1.78 0-3.69.71-3.69 3.94c0 3.24 7.98 3.03 7.98-1.18V9C19.2 9 16.34 9 16.34 9Z"/></svg>',
  other:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2c0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"/></svg>',
}
