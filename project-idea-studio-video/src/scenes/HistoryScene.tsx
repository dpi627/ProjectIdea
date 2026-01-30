import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const HistoryScene: React.FC = () => {
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
  
  const chartProgress = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Animated line drawing
  const lineProgress = interpolate(frame, [0, 50], [0, 100], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 3v18h18" strokeWidth="3" />
            <path 
              d="m19 9-5 5-4-4-3 3" 
              strokeWidth="3"
              strokeDasharray="100"
              strokeDashoffset={100 - lineProgress}
            />
            <circle cx="19" cy="9" r="1.5" fill="currentColor" opacity={lineProgress > 80 ? 1 : 0} />
            <circle cx="14" cy="14" r="1.5" fill="currentColor" opacity={lineProgress > 60 ? 1 : 0} />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" opacity={lineProgress > 40 ? 1 : 0} />
            <circle cx="7" cy="13" r="1.5" fill="currentColor" opacity={lineProgress > 20 ? 1 : 0} />
          </svg>
        }
        title="History Diagrams"
        description="Beautiful charts powered by Chart.js. Track your progress and analyze your productivity."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#ffb8a3"
        extraContent={
          <div style={{marginTop: 30, display: 'flex', gap: 10}}>
            {[4, 7, 5, 9, 6, 8, 7].map((height, i) => {
              const barHeight = height * 10 * chartProgress;
              return (
                <div
                  key={i}
                  style={{
                    width: 40,
                    height: barHeight,
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '8px 8px 0 0',
                    alignSelf: 'flex-end',
                  }}
                />
              );
            })}
          </div>
        }
      />
    </AbsoluteFill>
  );
};
