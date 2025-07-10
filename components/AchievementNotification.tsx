// @ts-nocheck
// components/AchievementNotification.tsx
'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const NotificationCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(131, 56, 236, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shimmer 2s linear infinite;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
`;

const TrophyContainer = styled(motion.div)`
  font-size: 5rem;
  margin-bottom: 1rem;
  display: inline-block;
  position: relative;
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255, 183, 0, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(20px);
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const AchievementName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.warning};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const Points = styled.div`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.success};
  font-weight: bold;
  
  span {
    font-size: 2rem;
  }
`;

interface Props {
  achievementId: string;
  onClose: () => void;
}

export default function AchievementNotification({ achievementId, onClose }: Props) {
  const achievements = useAppStore(state => state.progress.achievements);
  const soundEnabled = useAppStore(state => state.preferences.soundEnabled);
  const achievement = achievements.find(a => a.id === achievementId);
  
  useEffect(() => {
    if (!achievement) return;
    
    // Play sound effect
    if (soundEnabled) {
      const sound = new Howl({
        src: ['/sounds/achievement.mp3'],
        volume: 0.5,
      });
      sound.play();
    }
    
    // Trigger confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };
    
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }
    
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5', '#FFB700'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5', '#FFB700'],
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, [achievement, soundEnabled]);
  
  if (!achievement) return null;
  
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <NotificationCard
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
          
          <TrophyContainer
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <GlowEffect
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            {achievement.icon}
          </TrophyContainer>
          
          <Title>
            <span className="gradient">Achievement Unlocked!</span>
          </Title>
          
          <AchievementName>{achievement.name}</AchievementName>
          
          <Description>{achievement.description}</Description>
          
          <Points>
            +<span>{achievement.points}</span> XP
          </Points>
        </NotificationCard>
      </Overlay>
    </AnimatePresence>
  );
}