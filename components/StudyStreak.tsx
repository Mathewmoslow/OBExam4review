// components/StudyStreak.tsx
'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Fire } from 'lucide-react';

const Container = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const FireIcon = styled(motion.div)<{ intensity: number }>`
  color: ${({ intensity }) => 
    intensity > 30 ? '#FF006E' :
    intensity > 14 ? '#FF4365' :
    intensity > 7 ? '#FFB700' :
    intensity > 0 ? '#FF8C00' : '#666'
  };
  filter: ${({ intensity }) => 
    intensity > 0 ? `drop-shadow(0 0 ${intensity / 5}px currentColor)` : 'none'
  };
`;

const StreakBadge = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${({ theme }) => theme.colors.gradient.danger};
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  min-width: 20px;
  text-align: center;
`;

interface Props {
  streak: number;
  size?: number;
  showBadge?: boolean;
}

export default function StudyStreak({ streak, size = 24, showBadge = true }: Props) {
  const intensity = Math.min(streak, 50); // Cap visual intensity at 50 days
  
  return (
    <Container>
      <FireIcon
        intensity={intensity}
        animate={{
          scale: intensity > 0 ? [1, 1.1, 1] : 1,
          rotate: intensity > 0 ? [-5, 5, -5] : 0,
        }}
        transition={{
          duration: 2,
          repeat: intensity > 0 ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <Fire size={size} fill={intensity > 0 ? 'currentColor' : 'none'} />
      </FireIcon>
      
      {showBadge && streak > 0 && (
        <StreakBadge
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {streak}
        </StreakBadge>
      )}
    </Container>
  );
}