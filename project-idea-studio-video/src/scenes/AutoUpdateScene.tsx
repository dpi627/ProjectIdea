import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const AutoUpdateScene: React.FC = () => {
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
  
  const rotateAngle = interpolate(frame, [0, 75], [0, 360]);
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <div style={{transform: `rotate(${rotateAngle}deg)`}}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </div>
        }
        title="Auto Update Check"
        description="Stay current with automatic version detection. Never miss an important update."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#e74c3c"
      />
    </AbsoluteFill>
  );
};
