import React from 'react';

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconScale: number;
  textOpacity: number;
  accentColor: string;
  isDark?: boolean;
  extraContent?: React.ReactNode;
};

export const FeatureCard: React.FC<Props> = ({
  icon,
  title,
  description,
  iconScale,
  textOpacity,
  accentColor,
  isDark = true,
  extraContent,
}) => {
  const textColor = isDark ? 'white' : '#2c3e50';
  
  return (
    <div
      style={{
        textAlign: 'center',
        maxWidth: 900,
        padding: 60,
      }}
    >
      {/* Icon */}
      <div
        style={{
          transform: `scale(${iconScale})`,
          marginBottom: 50,
          color: accentColor,
          filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
        }}
      >
        {icon}
      </div>
      
      {/* Title */}
      <h2
        style={{
          fontSize: 68,
          fontWeight: 800,
          color: textColor,
          marginBottom: 30,
          opacity: textOpacity,
          textShadow: isDark 
            ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          letterSpacing: '-1px',
        }}
      >
        {title}
      </h2>
      
      {/* Description */}
      <p
        style={{
          fontSize: 32,
          fontWeight: 400,
          color: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(44, 62, 80, 0.85)',
          lineHeight: 1.5,
          opacity: textOpacity,
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {description}
      </p>
      
      {/* Extra content */}
      {extraContent && (
        <div style={{opacity: textOpacity, display: 'flex', justifyContent: 'center'}}>
          {extraContent}
        </div>
      )}
    </div>
  );
};
