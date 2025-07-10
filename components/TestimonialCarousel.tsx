// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const Section = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, rgba(10, 14, 39, 0.8) 0%, transparent 100%);
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Title = styled.h2`
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
  margin-bottom: 4rem;
  
  .gradient {
    background: linear-gradient(135deg, #06FFA5 0%, #3A86FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CarouselContainer = styled.div`
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TestimonialCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem;
  max-width: 800px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #06FFA5 0%, #3A86FF 100%);
    border-radius: 2rem;
    opacity: 0.1;
    z-index: -1;
  }
`;

const QuoteIcon = styled(Quote)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 48px;
  height: 48px;
  color: rgba(6, 255, 165, 0.3);
`;

const TestimonialContent = styled.p`
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
  text-align: center;
`;

const TestimonialAuthor = styled.div`
  text-align: center;
`;

const AuthorName = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const AuthorTitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
`;

const NavigationButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => $direction === 'left' ? 'left: -60px' : 'right: -60px'};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
  }
  
  @media (max-width: 768px) {
    ${({ $direction }) => $direction === 'left' ? 'left: 0' : 'right: 0'};
  }
`;

const Indicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Indicator = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => $active ? '24px' : '8px'};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active }) => $active ? '#06FFA5' : 'rgba(255, 255, 255, 0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const testimonials = [
  {
    content: "This platform transformed my study experience! The 3D simulations and emergency scenarios helped me understand complex concepts in a way textbooks never could. I passed my NCLEX on the first try!",
    author: "Sarah Johnson",
    title: "Nursing Graduate, Class of 2024",
    rating: 5,
  },
  {
    content: "The gamification aspect kept me motivated throughout my studies. I loved competing on the leaderboard and earning achievements. It made studying feel less like a chore and more like a game!",
    author: "Michael Chen",
    title: "RN, Labor & Delivery Unit",
    rating: 5,
  },
  {
    content: "The case studies and clinical judgment scenarios were incredibly realistic. They prepared me for real-world situations I now face daily in the maternity ward. Highly recommend!",
    author: "Emily Rodriguez",
    title: "Registered Nurse, Postpartum Unit",
    rating: 5,
  },
  {
    content: "As a visual learner, the interactive 3D models and animations were game-changers. I finally understood fetal positioning and the mechanics of labor. Worth every penny!",
    author: "David Kim",
    title: "New Graduate Nurse",
    rating: 5,
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  return (
    <Section>
      <Container>
        <Title>
          What Our <span className="gradient">Students Say</span>
        </Title>
        
        <CarouselContainer>
          <NavigationButton $direction="left" onClick={goToPrevious}>
            <ChevronLeft />
          </NavigationButton>
          
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <QuoteIcon />
              <TestimonialContent>
                "{testimonials[currentIndex].content}"
              </TestimonialContent>
              <TestimonialAuthor>
                <AuthorName>{testimonials[currentIndex].author}</AuthorName>
                <AuthorTitle>{testimonials[currentIndex].title}</AuthorTitle>
                <Stars>
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FFB700" color="#FFB700" />
                  ))}
                </Stars>
              </TestimonialAuthor>
            </TestimonialCard>
          </AnimatePresence>
          
          <NavigationButton $direction="right" onClick={goToNext}>
            <ChevronRight />
          </NavigationButton>
        </CarouselContainer>
        
        <Indicators>
          {testimonials.map((_, index) => (
            <Indicator
              key={index}
              $active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Indicators>
      </Container>
    </Section>
  );
}
