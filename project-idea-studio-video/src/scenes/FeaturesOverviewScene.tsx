import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

const features = [
  {icon: '📁', text: 'Local File System', delay: 0},
  {icon: '🌈', text: 'Animated Background', delay: 10},
  {icon: '🎯', text: 'Drag & Reorder', delay: 20},
  {icon: '📊', text: 'Category Filters', delay: 30},
  {icon: '💾', text: 'Export/Import', delay: 40},
  {icon: '📄', text: 'Tech Documentation', delay: 50},
];

export const FeaturesOverviewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const titleY = interpolate(frame, [0, 20], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{textAlign: 'center', padding: 60}}>
        <h2
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            marginBottom: 60,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          And Even More...
        </h2>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
            maxWidth: 1200,
          }}
        >
          {features.map((feature, i) => {
            const featureOpacity = interpolate(
              frame,
              [20 + feature.delay, 40 + feature.delay],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );
            
            const featureY = interpolate(
              frame,
              [20 + feature.delay, 40 + feature.delay],
              [50, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }
            );
            
            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 20,
                  padding: 30,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  opacity: featureOpacity,
                  transform: `translateY(${featureY}px)`,
                }}
              >
                <div style={{fontSize: 60, marginBottom: 15}}>{feature.icon}</div>
                <div style={{fontSize: 24, fontWeight: 600, color: 'white'}}>
                  {feature.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
