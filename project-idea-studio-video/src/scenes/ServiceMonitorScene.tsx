import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {FeatureCard} from '../components/FeatureCard';

export const ServiceMonitorScene: React.FC = () => {
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
  
  const pulseScale = 1 + Math.sin(frame * 0.15) * 0.1;
  
  // Animated heartbeat wave
  const waveOffset = (frame * 2) % 100;
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <FeatureCard
        icon={
          <div style={{position: 'relative', display: 'inline-block'}}>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2">
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-100"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
            <div
              style={{
                position: 'absolute',
                top: -10,
                right: -10,
                width: 30,
                height: 30,
                background: '#27ae60',
                borderRadius: '50%',
                transform: `scale(${pulseScale})`,
                boxShadow: '0 0 20px rgba(39, 174, 96, 0.6)',
              }}
            />
          </div>
        }
        title="Service Detection"
        description="Real-time health checks keep you informed. Know your service status at a glance."
        iconScale={iconScale}
        textOpacity={textOpacity}
        accentColor="#27ae60"
      />
    </AbsoluteFill>
  );
};
