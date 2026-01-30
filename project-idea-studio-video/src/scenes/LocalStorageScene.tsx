import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const LocalStorageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const iconScale = spring({
    frame,
    fps,
    config: {damping: 200},
  });
  
  const textOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Pulsing animation for the box
  const pulse = 1 + Math.sin(frame * 0.1) * 0.05;
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <div style={{transform: `scale(${pulse})`}}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        }
        title="Local Data Storage"
        description="Your data stays on your device. Browser LocalStorage or local file system — you choose."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#3498db"
      />
    </AbsoluteFill>
  );
};
