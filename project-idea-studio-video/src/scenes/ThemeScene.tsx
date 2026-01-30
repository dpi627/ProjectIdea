import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const ThemeScene: React.FC = () => {
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
  
  const themeSwitchProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const isDark = themeSwitchProgress > 0.5;
  
  // Sun rotation animation
  const sunRotation = (frame * 2) % 360;
  // Moon glow pulse
  const moonGlow = 1 + Math.sin(frame * 0.1) * 0.15;
  
  return (
    <AbsoluteFill
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        transition: 'background 0.3s ease',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          isDark ? (
            <div style={{transform: `scale(${moonGlow})`}}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          ) : (
            <div style={{transform: `rotate(${sunRotation}deg)`}}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
          )
        }
        title="Light & Dark Theme"
        description="Seamless theme switching with smooth transitions. Your eyes will thank you."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor={isDark ? "#ffd93d" : "#f39c12"}
        isDark={isDark}
      />
    </AbsoluteFill>
  );
};
