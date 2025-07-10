// app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { 
  Heart, 
  Brain, 
  Award, 
  Zap, 
  Users, 
  BookOpen,
  Play,
  ChevronRight,
  Star,
  Shield,
  Clock
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import HeroScene from '@/components/HeroScene';
import ParticleBackground from '@/components/ParticleBackground';
import FloatingCards from '@/components/FloatingCards';
import InteractiveStats from '@/components/InteractiveStats';
import TestimonialCarousel from '@/components/TestimonialCarousel';

gsap.registerPlugin(ScrollTrigger);

const Container = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at center, rgba(131, 56, 236, 0.1) 0%, transparent 70%);
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  z-index: 10;
  position: relative;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  
  .gradient {
    background: linear-gradient(135deg, #FF006E 0%, #8338EC 50%, #3A86FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: 1.25rem 3rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(131, 56, 236, 0.4);
    
    &::before {
      width: 300px;
      height: 300px;
    }
  }
`;

const StatsSection = styled.section`
  padding: 4rem 0;
  background: rgba(10, 14, 39, 0.5);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
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
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.5s;
  }
  
  &:hover::before {
    animation: shimmer 0.5s ease;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  background: ${({ theme }) => theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  position: relative;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
  margin-bottom: 4rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.secondary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 30px;
    height: 30px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.7;
`;

const TestimonialsSection = styled.section`
  padding: 6rem 0;
  background: rgba(10, 14, 39, 0.5);
  position: relative;
  overflow: hidden;
`;

const FooterCTA = styled.section`
  padding: 6rem 0;
  text-align: center;
  position: relative;
`;

const features = [
  {
    icon: Brain,
    title: 'Interactive 3D Simulations',
    description: 'Experience realistic emergency scenarios with 3D anatomical models and real-time decision making.',
  },
  {
    icon: Award,
    title: 'Gamified Learning',
    description: 'Earn achievements, climb leaderboards, and track your progress with our engaging reward system.',
  },
  {
    icon: Zap,
    title: 'Adaptive Quizzes',
    description: 'Smart algorithms adjust difficulty based on your performance for optimal learning.',
  },
  {
    icon: Users,
    title: 'Case Study Library',
    description: 'Learn from real-world scenarios with detailed explanations and critical thinking exercises.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description: 'Cover all aspects of labor and postpartum complications with evidence-based material.',
  },
  {
    icon: Shield,
    title: 'NCLEX-Focused',
    description: 'Questions and content specifically designed to prepare you for NCLEX success.',
  },
];

const stats = [
  { number: '98%', label: 'Pass Rate' },
  { number: '10K+', label: 'Active Students' },
  { number: '500+', label: 'Practice Questions' },
  { number: '4.9', label: 'App Rating' },
];

const testimonials = [
  {
    name: 'Sarah Johnson, RN',
    role: 'Recent Graduate',
    content: 'This app made studying for my OB exam actually enjoyable! The emergency simulations were incredibly helpful.',
    rating: 5,
  },
  {
    name: 'Michael Chen, BSN',
    role: 'Nursing Student',
    content: 'The 3D visualizations and interactive case studies helped me understand complex concepts so much better.',
    rating: 5,
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Nursing Educator',
    content: 'I recommend this app to all my students. The gamification keeps them engaged and motivated to learn.',
    rating: 5,
  },
];

export default function HomePage() {
  const { userName, userLevel, userXP } = useAppStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    setIsLoaded(true);
    
    // GSAP animations
    const tl = gsap.timeline();
    
    tl.from('.hero-title span', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5')
    .from('.hero-cta', {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    }, '-=0.3');
    
    // Parallax effect
    gsap.to('.hero-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
    
    // Feature cards animation
    gsap.from('.feature-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 80%',
      },
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <Container>
      <Navigation />
      <ParticleBackground />
      
      <HeroSection ref={heroRef}>
        <div className="hero-bg" style={{ position: 'absolute', inset: 0 }}>
          <HeroScene />
        </div>
        
        <HeroContent>
          <Title
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-title">
              <span>Master</span>{' '}
              <span className="gradient">OB Complications</span>
              <br />
              <span>with</span>{' '}
              <span className="gradient">Confidence</span>
            </div>
          </Title>
          
          <Subtitle className="hero-subtitle">
            Interactive 3D simulations, gamified learning, and real-world scenarios
            to ace your exams and save lives.
          </Subtitle>
          
          <Link href={userName ? '/dashboard' : '/onboarding'}>
            <CTAButton
              className="hero-cta"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {userName ? 'Continue Learning' : 'Start Your Journey'}
              <ChevronRight size={20} />
            </CTAButton>
          </Link>
          
          {userName && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              style={{ marginTop: '2rem' }}
            >
              <p>Welcome back, {userName}! Level {userLevel} • {userXP} XP</p>
            </motion.div>
          )}
        </HeroContent>
        
        <FloatingCards />
      </HeroSection>
      
      <StatsSection>
        <StatsGrid>
          <AnimatePresence>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </AnimatePresence>
        </StatsGrid>
      </StatsSection>
      
      <FeaturesSection>
        <FeaturesContainer>
          <SectionTitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Why Choose <span className="gradient">OB Exam Review</span>?
          </SectionTitle>
          
          <FeaturesGrid className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                className="feature-card"
                whileHover={{ y: -5 }}
              >
                <FeatureIcon>
                  <feature.icon />
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesContainer>
      </FeaturesSection>
      
      <InteractiveStats />
      
      <TestimonialsSection>
        <FeaturesContainer>
          <SectionTitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What <span className="gradient">Students Say</span>
          </SectionTitle>
          
          <TestimonialCarousel testimonials={testimonials} />
        </FeaturesContainer>
      </TestimonialsSection>
      
      <FooterCTA>
        <FeaturesContainer>
          <SectionTitle
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to <span className="gradient">Excel</span>?
          </SectionTitle>
          
          <Subtitle>
            Join thousands of nursing students who have mastered
            OB complications with our innovative platform.
          </Subtitle>
          
          <Link href="/onboarding">
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
              <Play size={20} />
            </CTAButton>
          </Link>
        </FeaturesContainer>
      </FooterCTA>
    </Container>
  );
}