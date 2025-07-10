// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Baby, 
  Stethoscope,
  Activity,
  AlertCircle
} from 'lucide-react';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Card = styled(motion.div)`
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: auto;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${({ $color }) => $color};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const CardContent = styled.div`
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const cards = [
  {
    icon: Brain,
    title: 'Clinical Judgment',
    description: 'Develop critical thinking',
    color: '#FF006E',
    position: { top: '10%', left: '5%' },
  },
  {
    icon: Heart,
    title: 'Patient Care',
    description: 'Master care protocols',
    color: '#8338EC',
    position: { top: '20%', right: '10%' },
  },
  {
    icon: Baby,
    title: 'Newborn Assessment',
    description: 'Learn APGAR & more',
    color: '#3A86FF',
    position: { bottom: '30%', left: '8%' },
  },
  {
    icon: Stethoscope,
    title: 'Physical Assessment',
    description: 'Perfect your skills',
    color: '#06FFA5',
    position: { bottom: '15%', right: '5%' },
  },
  {
    icon: Activity,
    title: 'Emergency Response',
    description: 'Quick interventions',
    color: '#FFB700',
    position: { top: '50%', left: '10%' },
  },
  {
    icon: AlertCircle,
    title: 'Risk Recognition',
    description: 'Identify complications',
    color: '#FF4365',
    position: { top: '40%', right: '15%' },
  },
];

export default function FloatingCards() {
  return (
    <Container>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            style={card.position}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              repeat: Infinity,
              repeatType: 'reverse',
              repeatDelay: 5 + index * 2,
            }}
            whileHover={{ scale: 1.1 }}
          >
            <IconWrapper $color={card.color}>
              <Icon />
            </IconWrapper>
            <CardContent>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
