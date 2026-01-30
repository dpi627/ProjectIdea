# 🎵 Adding Music to Your Video

Remotion fully supports audio! Here's how to add background music to your introduction video.

---

## Quick Method: Add Background Music

### Step 1: Get Your Music File

Place your music file in the project:
```
project-idea-studio-video/
├── public/
│   └── music.mp3  ← Your music file here
```

Supported formats:
- MP3 (most common)
- WAV (high quality)
- M4A (Apple format)
- OGG (open format)

### Step 2: Update IntroVideo.tsx

Add the `<Audio>` component:

```tsx
import {Audio} from 'remotion';

// Add this inside your IntroVideo component, before TransitionSeries:
<Audio 
  src={staticFile('music.mp3')} 
  volume={0.3} 
/>
```

**Full example** of where to add it:

```tsx
import {AbsoluteFill, Audio, staticFile} from 'remotion';

export const IntroVideo: React.FC<IntroVideoProps> = ({title, tagline}) => {
  return (
    <AbsoluteFill>
      {/* Background Music */}
      <Audio 
        src={staticFile('music.mp3')}
        volume={0.3}  // 30% volume (adjust as needed)
      />
      
      <TransitionSeries>
        {/* Your scenes... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

---

## Advanced: Volume Control & Fade In/Out

### Fade In at Start

```tsx
import {Audio, interpolate, useCurrentFrame} from 'remotion';

export const IntroVideo: React.FC<IntroVideoProps> = ({title, tagline}) => {
  const frame = useCurrentFrame();
  
  // Fade in music over first 2 seconds
  const volume = interpolate(frame, [0, 60], [0, 0.3], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill>
      <Audio 
        src={staticFile('music.mp3')}
        volume={volume}
      />
      
      <TransitionSeries>
        {/* Your scenes... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

### Fade In & Fade Out

```tsx
import {Audio, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const IntroVideo: React.FC<IntroVideoProps> = ({title, tagline}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  
  // Fade in over first 2 seconds
  const fadeInVolume = interpolate(frame, [0, 60], [0, 0.3], {
    extrapolateRight: 'clamp',
  });
  
  // Fade out over last 2 seconds
  const fadeOutVolume = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [0.3, 0],
    {extrapolateLeft: 'clamp'}
  );
  
  // Use minimum of fade in and fade out
  const volume = Math.min(fadeInVolume, fadeOutVolume);
  
  return (
    <AbsoluteFill>
      <Audio 
        src={staticFile('music.mp3')}
        volume={volume}
      />
      
      <TransitionSeries>
        {/* Your scenes... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

---

## Using Remote Audio (URL)

```tsx
<Audio 
  src="https://example.com/music.mp3"
  volume={0.3}
/>
```

---

## Multiple Audio Tracks

You can layer multiple sounds:

```tsx
<AbsoluteFill>
  {/* Background music */}
  <Audio src={staticFile('background.mp3')} volume={0.2} />
  
  {/* Sound effect at specific time */}
  <Sequence from={60}>
    <Audio src={staticFile('swoosh.mp3')} volume={0.5} />
  </Sequence>
  
  {/* Another sound effect */}
  <Sequence from={120}>
    <Audio src={staticFile('ding.mp3')} volume={0.6} />
  </Sequence>
  
  <TransitionSeries>
    {/* Your scenes... */}
  </TransitionSeries>
</AbsoluteFill>
```

---

## Audio Properties

```tsx
<Audio
  src={staticFile('music.mp3')}
  volume={0.3}              // 0 to 1 (0% to 100%)
  startFrom={0}             // Start from frame 0
  endAt={900}               // End at frame 900
  playbackRate={1}          // Speed: 1 = normal, 2 = double speed
  loop                      // Loop the audio (optional)
  muted={false}             // Mute (optional)
/>
```

---

## Volume Guidelines

- **0.1 - 0.2**: Very quiet background music
- **0.3 - 0.4**: Normal background music (recommended)
- **0.5 - 0.6**: Prominent background music
- **0.7 - 1.0**: Loud (usually too much for background)

---

## Complete Example with Music

Create this file for testing:

**src/IntroVideoWithMusic.tsx**:
```tsx
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {OpeningScene} from './scenes/OpeningScene';
import {LocalStorageScene} from './scenes/LocalStorageScene';
// ... import other scenes

export type IntroVideoProps = {
  title: string;
  tagline: string;
};

export const IntroVideoWithMusic: React.FC<IntroVideoProps> = ({
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Fade in music at start
  const fadeIn = interpolate(frame, [0, 60], [0, 0.35], {
    extrapolateRight: 'clamp',
  });

  // Fade out music at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 60, durationInFrames],
    [0.35, 0],
    {extrapolateLeft: 'clamp'}
  );

  const volume = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill>
      {/* Background Music with fade in/out */}
      <Audio src={staticFile('music.mp3')} volume={volume} />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <OpeningScene title={title} tagline={tagline} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 20})}
        />

        <TransitionSeries.Sequence durationInFrames={90}>
          <LocalStorageScene />
        </TransitionSeries.Sequence>

        {/* ... rest of your scenes ... */}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
```

---

## Where to Find Royalty-Free Music

### Free Options:
1. **YouTube Audio Library** - https://studio.youtube.com/channel/UC.../music
2. **Pixabay Music** - https://pixabay.com/music/
3. **Free Music Archive** - https://freemusicarchive.org/
4. **Incompetech** - https://incompetech.com/music/royalty-free/

### Premium Options:
1. **Epidemic Sound** - https://www.epidemicsound.com/
2. **Artlist** - https://artlist.io/
3. **AudioJungle** - https://audiojungle.net/
4. **Uppbeat** - https://uppbeat.io/

---

## Music Recommendations for Your Video

### Style Suggestions:
- **Upbeat Electronic**: Modern, tech-focused feel
- **Corporate Uplifting**: Professional and positive
- **Ambient Tech**: Minimal, futuristic
- **Inspiring Cinematic**: Epic and motivational

### Length:
Look for tracks that are **30-60 seconds** or can be looped smoothly.

---

## Testing with Music

1. Add your music file to `public/music.mp3`
2. Update `IntroVideo.tsx` with the Audio component
3. Refresh the Remotion Studio
4. Adjust volume to your preference
5. Test the fade in/out timing

---

## Tips for Best Results

✅ **Volume Balance**: Keep music at 0.3-0.4 so it doesn't overpower
✅ **Fade In/Out**: Always fade to avoid abrupt starts/stops
✅ **Music Length**: Use 30-second tracks or trim longer ones
✅ **Beat Sync**: Match scene transitions to music beats (optional)
✅ **Test on Speakers**: Check volume on different audio systems

---

## Next Steps

1. **Find or create** a 30-second music track
2. **Place it** in `public/music.mp3`
3. **Add the Audio component** to IntroVideo.tsx
4. **Adjust volume** and fade timings
5. **Preview** in Remotion Studio
6. **Render** the final video with `npm run build`

Your video will now have professional background music! 🎵
```

---

## Other Audio Features Remotion Supports

- **Voiceovers**: Add narration
- **Sound Effects**: Whooshes, clicks, dings
- **Text-to-Speech**: Generate voices from text
- **Audio Visualization**: Show waveforms
- **Audio Synchronization**: Time animations to beats
- **Volume Automation**: Dynamic volume changes
- **Multi-track Audio**: Mix multiple audio sources

Remotion is a **full video production framework!** 🎬
