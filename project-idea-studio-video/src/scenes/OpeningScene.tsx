import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';

type Props = {
  title: string;
  tagline: string;
};

export const OpeningScene: React.FC<Props> = ({title, tagline}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const logoScale = spring({
    frame,
    fps,
    config: {damping: 200},
  });
  
  const titleOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const backgroundY = interpolate(frame, [0, 120], [0, -50]);
  
  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1f8a70 0%, #15a085 50%, #0d7a5f 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Animated background shapes */}
      <AbsoluteFill
        style={{
          opacity: 0.1,
          transform: `translateY(${backgroundY}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: 400,
            height: 400,
            background: 'white',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: 500,
            height: 500,
            background: 'white',
            borderRadius: '50%',
            filter: 'blur(100px)',
          }}
        />
      </AbsoluteFill>
      
      {/* Content */}
      <div style={{textAlign: 'center', zIndex: 1}}>
        {/* Logo/Icon */}
        <div
          style={{
            transform: `scale(${logoScale})`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 180,
              height: 180,
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <svg width="100" height="100" viewBox="0 0 64 64">
              <polygon
                points="32 10 54 32 32 54 10 32"
                fill="white"
                opacity="0.95"
              />
            </svg>
          </div>
        </div>
        
        {/* Title */}
        <h1
          style={{
            fontSize: 82,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            marginBottom: 20,
            opacity: titleOpacity,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-2px',
          }}
        >
          {title}
        </h1>
        
        {/* Tagline */}
        <p
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            opacity: taglineOpacity,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {tagline}
        </p>
      </div>
    </AbsoluteFill>
  );
};
