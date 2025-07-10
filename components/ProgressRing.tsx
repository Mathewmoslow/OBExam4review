// @ts-nocheck
// components/ProgressRing.tsx
'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Svg = styled.svg`
  transform: rotate(-90deg);
`;

const BackgroundCircle = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
`;

const ProgressCircle = styled(motion.circle)`
  fill: none;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
`;

const Text = styled.text`
  fill: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
`;

interface Props {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showText?: boolean;
  gradientId?: string;
}

export default function ProgressRing({ 
  progress, 
  size = 100, 
  strokeWidth = 8,
  showText = true,
  gradientId = 'progress-gradient'
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <Svg width={size} height={size}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF006E" />
            <stop offset="50%" stopColor="#8338EC" />
            <stop offset="100%" stopColor="#3A86FF" />
          </linearGradient>
        </defs>
        
        <BackgroundCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        
        <ProgressCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </Svg>
      
      {showText && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: size / 4,
          fontWeight: 'bold'
        }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}