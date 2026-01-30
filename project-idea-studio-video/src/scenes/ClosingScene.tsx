import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const titleScale = spring({
    frame,
    fps,
    config: {damping: 200},
  });
  
  const ctaOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const ctaY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const shine = interpolate(frame, [50, 80], [-200, 1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1f8a70 0%, #15a085 50%, #0d7a5f 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Shine effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: shine,
          width: 200,
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transform: 'skewX(-20deg)',
        }}
      />
      
      <div style={{textAlign: 'center', zIndex: 1}}>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: 'white',
            marginBottom: 40,
            transform: `scale(${titleScale})`,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          Start Building Your Ideas Today
        </h2>
        
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '20px 60px',
              background: 'white',
              borderRadius: 50,
              fontSize: 32,
              fontWeight: 700,
              color: '#1f8a70',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              marginBottom: 30,
            }}
          >
            Open index.html
          </div>
          
          <p
            style={{
              fontSize: 28,
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 400,
              margin: 0,
              marginTop: 20,
            }}
          >
            No installation • No authentication • Just works
          </p>
          
          <div style={{marginTop: 40, fontSize: 20, color: 'rgba(255, 255, 255, 0.7)'}}>
            © 2026 Brian Li • AI-Pair-Programming
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
