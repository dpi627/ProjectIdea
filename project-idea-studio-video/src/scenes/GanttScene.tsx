import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const GanttScene: React.FC = () => {
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
  
  const bar1Progress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const bar2Progress = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const bar3Progress = interpolate(frame, [50, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  // Floating animation for calendar
  const floatY = Math.sin(frame * 0.08) * 5;
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <div style={{transform: `translateY(${floatY}px)`}}>
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth="3" />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth="3" />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth="3" />
            </svg>
          </div>
        }
        title="Simple Yearly Gantt"
        description="Visualize your project timelines at a glance. Plan your year with confidence."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#a8f5e6"
        extraContent={
          <div style={{marginTop: 30, width: '70%'}}>
            {[
              {progress: bar1Progress, width: 70, color: '#3498db'},
              {progress: bar2Progress, width: 85, color: '#e74c3c'},
              {progress: bar3Progress, width: 60, color: '#f39c12'},
            ].map((bar, i) => (
              <div
                key={i}
                style={{
                  height: 20,
                  width: `${bar.width * bar.progress}%`,
                  background: bar.color,
                  marginBottom: 15,
                  borderRadius: 10,
                  boxShadow: `0 4px 10px ${bar.color}44`,
                }}
              />
            ))}
          </div>
        }
      />
    </AbsoluteFill>
  );
};
