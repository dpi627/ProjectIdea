# 🎵 Quick Guide: Enable Music in 3 Steps

## Step 1: Get Your Music File

**Option A: Download from Pixabay (Free)**
1. Go to https://pixabay.com/music/
2. Search for "upbeat tech" or "corporate motivational"
3. Download a 30-second track
4. Rename it to `music.mp3`

**Option B: Use Your Own Music**
- Any MP3, WAV, or M4A file works
- Recommended: 30 seconds long (same as video)

---

## Step 2: Place Music in Project

Put your `music.mp3` file here:
```
project-idea-studio-video/
└── public/
    └── music.mp3  ← Your music file
```

---

## Step 3: Update Root.tsx

**Option A: Simple (Music with Fixed Volume)**

Edit `src/Root.tsx` and change the import:

```tsx
// CHANGE THIS LINE:
import {IntroVideo} from './IntroVideo';

// TO THIS:
import {IntroVideo} from './IntroVideoWithMusic';
```

That's it! The music version has fade in/out already configured.

**Option B: Manual (Add Music to Current File)**

Edit `src/IntroVideo.tsx` and add these lines:

```tsx
// 1. Add to imports at the top:
import {Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// 2. Add inside the component function:
const frame = useCurrentFrame();
const {durationInFrames} = useVideoConfig();

const fadeIn = interpolate(frame, [0, 60], [0, 0.35], {
  extrapolateRight: 'clamp',
});

const fadeOut = interpolate(
  frame,
  [durationInFrames - 60, durationInFrames],
  [0.35, 0],
  {extrapolateLeft: 'clamp'}
);

const musicVolume = Math.min(fadeIn, fadeOut);

// 3. Add inside the <AbsoluteFill> tag, before <TransitionSeries>:
<Audio src={staticFile('music.mp3')} volume={musicVolume} />
```

---

## Step 4: Test It!

1. Refresh the Remotion Studio browser
2. Press play (spacebar)
3. Listen to the music fade in and out
4. Adjust volume if needed (change `0.35` to higher/lower)

---

## Quick Adjustments

### Make Music Louder/Quieter

In the code, change this number:
```tsx
const fadeIn = interpolate(frame, [0, 60], [0, 0.35], {
  //                                         ↑
  //                            Change this (0.1 = quiet, 0.6 = loud)
```

### Remove Fade (Constant Volume)

Replace the fade logic with:
```tsx
<Audio src={staticFile('music.mp3')} volume={0.3} />
```

### Longer Fade In/Out

Change the timing:
```tsx
// Fade in over 3 seconds instead of 2:
const fadeIn = interpolate(frame, [0, 90], [0, 0.35], {
  //                                  ↑
  //                    90 frames = 3 seconds at 30fps
```

---

## Troubleshooting

### "Cannot find music.mp3"
- Make sure file is in `public/music.mp3`
- Check the filename is exactly `music.mp3` (lowercase)
- Restart Remotion Studio

### Music too loud/quiet
- Adjust the volume number (0.1 to 0.6 recommended)
- Test with different speakers/headphones

### Music doesn't match video length
- Trim your audio file to 30 seconds
- Or use the `endAt` property: `<Audio ... endAt={900} />`

---

## Recommended Free Music

Search these on Pixabay Music:
- "Tech Background" by AudioCoffee
- "Corporate Success" by penguinmusic
- "Upbeat Inspiring" by Lexin_Music
- "Modern Technology" by Grand_Project

All are royalty-free and perfect for tech videos!

---

## Next: Add Sound Effects

Want to add whoosh sounds on transitions? See `ADDING_MUSIC.md` for advanced techniques including:
- Multiple audio tracks
- Sound effects at specific times
- Audio synchronized to animations
- Voiceovers

---

**Quick Summary:**
1. Put `music.mp3` in `public/` folder
2. Change `IntroVideo` to `IntroVideoWithMusic` in Root.tsx
3. Refresh browser
4. Enjoy! 🎵
