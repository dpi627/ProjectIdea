import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const ModelUsageScene: React.FC = () => {
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
  
  const barProgress = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Animated donut chart segments
  const segment1 = interpolate(frame, [0, 40], [0, 140], {
    extrapolateRight: 'clamp',
  });
  const segment2 = interpolate(frame, [10, 50], [0, 100], {
    extrapolateRight: 'clamp',
  });
  const segment3 = interpolate(frame, [20, 60], [0, 120], {
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <svg width="140" height="140" viewBox="0 0 100 100">
            {/* Outer circle */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            {/* Donut segments - animated */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={`${segment1} 220`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
              opacity="0.9"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={`${segment2} 220`}
              strokeDashoffset={-segment1}
              transform="rotate(-90 50 50)"
              opacity="0.7"
            />
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={`${segment3} 220`}
              strokeDashoffset={-(segment1 + segment2)}
              transform="rotate(-90 50 50)"
              opacity="0.5"
            />
            {/* Center hole */}
            <circle cx="50" cy="50" r="23" fill="transparent" />
          </svg>
        }
        title="Model Usage Monitor"
        description="Track AI model usage with real-time charts and filters. Stay within your limits effortlessly."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#e9b3ff"
        extraContent={
          <div style={{marginTop: 30, width: '60%'}}>
            {[0.8, 0.6, 0.9].map((height, i) => (
              <div
                key={i}
                style={{
                  display: 'inline-block',
                  width: 60,
                  height: 100 * height * barProgress,
                  background: 'rgba(255, 255, 255, 0.3)',
                  marginRight: 20,
                  borderRadius: 8,
                  transition: 'height 0.3s ease',
                }}
              />
            ))}
          </div>
        }
      />
    </AbsoluteFill>
  );
};
