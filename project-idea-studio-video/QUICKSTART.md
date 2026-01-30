# Quick Start Guide

## 🚀 Getting Started

### 1. Preview the Video in Browser
```bash
cd project-idea-studio-video
npm start
```
- Opens at http://localhost:3000
- Real-time preview with scrubbing
- Edit code and see changes instantly
- Use spacebar to play/pause

### 2. Render the Final Video
```bash
cd project-idea-studio-video
npm run build
```
- Renders to `out/intro.mp4`
- Full HD 1920x1080 resolution
- Takes ~2-5 minutes to render

### 3. Customize Scenes

Want to change colors? Edit the gradient in any scene file:

```tsx
// Example: Change LocalStorageScene background
style={{
  background: 'linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%)',
}}
```

Want to change text? Edit the strings directly:

```tsx
<FeatureCard
  title="Your New Title"
  description="Your new description here"
/>
```

### 4. Adjust Timing

Edit `src/IntroVideo.tsx` to change scene durations:

```tsx
<TransitionSeries.Sequence durationInFrames={90}> {/* 3 seconds at 30fps */}
  <LocalStorageScene />
</TransitionSeries.Sequence>
```

## 🎨 Quick Customization Tips

### Change Brand Colors
Edit `src/scenes/OpeningScene.tsx` and `src/scenes/ClosingScene.tsx`:
```tsx
background: 'linear-gradient(135deg, #1f8a70 0%, #15a085 50%, #0d7a5f 100%)'
// Replace #1f8a70 with your brand color
```

### Change Logo
Edit the SVG in `src/scenes/OpeningScene.tsx`:
```tsx
<svg width="100" height="100" viewBox="0 0 64 64">
  {/* Replace with your logo SVG */}
</svg>
```

### Add More Features
Duplicate any scene file and add it to `src/IntroVideo.tsx`:
```tsx
import {YourNewScene} from './scenes/YourNewScene';

// Add to TransitionSeries
<TransitionSeries.Sequence durationInFrames={90}>
  <YourNewScene />
</TransitionSeries.Sequence>
```

## 📊 Common Render Commands

### Different Quality
```bash
# High quality (slower)
npx remotion render ProjectIdeaStudioIntro out/intro-hq.mp4 --quality=100

# Fast preview (lower quality)
npx remotion render ProjectIdeaStudioIntro out/intro-preview.mp4 --quality=50
```

### Different Resolution
```bash
# 4K
npx remotion render ProjectIdeaStudioIntro out/intro-4k.mp4 --scale=2

# 720p (smaller file)
npx remotion render ProjectIdeaStudioIntro out/intro-720p.mp4 --scale=0.67
```

### GIF Export
```bash
npx remotion render ProjectIdeaStudioIntro out/intro.gif --codec=gif
```

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=3001 npm start
```

### Clear Cache
```bash
rm -rf node_modules/.cache
npm start
```

### Update Remotion
```bash
npm run upgrade
```

## 📚 Learn More

- [Remotion Documentation](https://remotion.dev)
- [React Documentation](https://react.dev)
- [Animation Examples](https://remotion.dev/docs/animate)

## 🎬 Video Specs Summary

- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 30 seconds
- **File Size**: ~5-10 MB (varies with quality)

## ✅ Next Steps

1. Run `npm start` to preview
2. Customize colors, text, and timing
3. Run `npm run build` to render
4. Share your awesome video! 🎉

---

**Need help?** Check VIDEO_SUMMARY.md for detailed scene breakdown and customization options.
