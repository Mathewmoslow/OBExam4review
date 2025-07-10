// @ts-nocheck
// app/modules/page.tsx
'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Lock,
  CheckCircle,
  Users,
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import { modules } from '@/data/studyData';
import ProgressRing from '@/components/ProgressRing';

const Container = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(180deg, rgba(58, 134, 255, 0.05) 0%, transparent 50%);
`;

const Header = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 4rem);
  margin-bottom: 1rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.secondary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  max-width: 600px;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 0.75rem;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => 
    active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: none;
  border-radius: 0.5rem;
  color: ${({ active }) => active ? 'white' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const SortDropdown = styled.select`
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  
  option {
    background: ${({ theme }) => theme.colors.dark};
  }
`;

const ModulesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;

const ModulesGrid = styled.div<{ view: 'grid' | 'list' }>`
  display: grid;
  grid-template-columns: ${({ view }) => 
    view === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : '1fr'};
  gap: 2rem;
`;

const ModuleCard = styled(motion.div)<{ locked?: boolean }>`
  background: ${({ locked }) => 
    locked 
      ? 'rgba(255, 255, 255, 0.02)' 
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ locked }) => 
    locked ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: ${({ locked }) => locked ? 'not-allowed' : 'pointer'};
  opacity: ${({ locked }) => locked ? 0.5 : 1};
  transition: all 0.3s ease;
  
  &:hover:not([disabled]) {
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
    transition: transform 0.5s ease;
  }
  
  &:hover:not([disabled])::before {
    transform: scaleX(1);
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ModuleIcon = styled.div`
  font-size: 3rem;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LockIcon = styled(Lock)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const ModuleDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.6;
`;

const ModuleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
`;

const StatValue = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const ModuleFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 4px;
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  min-width: 45px;
`;

const StartButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border: none;
  border-radius: 2rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 20px rgba(131, 56, 236, 0.4);
  }
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Badge = styled.div<{ type: 'new' | 'popular' | 'advanced' }>`
  padding: 0.25rem 0.75rem;
  background: ${({ type }) => 
    type === 'new' ? 'rgba(6, 255, 165, 0.2)' :
    type === 'popular' ? 'rgba(255, 183, 0, 0.2)' :
    'rgba(255, 67, 101, 0.2)'};
  color: ${({ type, theme }) => 
    type === 'new' ? theme.colors.success :
    type === 'popular' ? theme.colors.warning :
    theme.colors.danger};
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid currentColor;
`;

const OverallProgress = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OverallInfo = styled.div`
  flex: 1;
`;

const OverallTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const OverallSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
`;

// Mock additional data for modules
const moduleMetadata = {
  'module-7': {
    topics: 8,
    duration: '3-4 hours',
    students: 1243,
    rating: 4.8,
    badges: ['popular', 'advanced'],
    locked: false,
  },
  'module-8': {
    topics: 10,
    duration: '4-5 hours',
    students: 987,
    rating: 4.9,
    badges: ['new'],
    locked: false,
  },
};

export default function ModulesPage() {
  const { studyProgress } = useAppStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('progress');
  
  const calculateOverallProgress = () => {
    const totalModules = modules.length;
    const totalProgress = modules.reduce((acc, module) => {
      return acc + (studyProgress[module.id]?.progress || 0);
    }, 0);
    return Math.round(totalProgress / totalModules);
  };
  
  const getSortedModules = () => {
    const modulesWithProgress = modules.map(module => ({
      ...module,
      progress: studyProgress[module.id]?.progress || 0,
      metadata: moduleMetadata[module.id as keyof typeof moduleMetadata] || {
        topics: 5,
        duration: '2-3 hours',
        students: 500,
        rating: 4.5,
        badges: [],
        locked: false,
      },
    }));
    
    switch (sortBy) {
      case 'progress':
        return modulesWithProgress.sort((a, b) => b.progress - a.progress);
      case 'name':
        return modulesWithProgress.sort((a, b) => a.title.localeCompare(b.title));
      case 'difficulty':
        return modulesWithProgress;
      default:
        return modulesWithProgress;
    }
  };
  
  const sortedModules = getSortedModules();
  const overallProgress = calculateOverallProgress();
  
  return (
    <Container>
      <Navigation />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen size={48} style={{ verticalAlign: 'middle', marginRight: '1rem' }} />
          <span className="gradient">Study Modules</span>
        </Title>
        
        <Subtitle>
          Master obstetric complications with comprehensive, interactive modules
        </Subtitle>
      </Header>
      
      <ModulesContainer>
        <OverallProgress
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <OverallInfo>
            <OverallTitle>Your Learning Journey</OverallTitle>
            <OverallSubtitle>
              Keep up the great work! You're making excellent progress.
            </OverallSubtitle>
          </OverallInfo>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ProgressRing progress={overallProgress} size={100} />
            <div>
              <StatValue style={{ fontSize: '2rem' }}>{overallProgress}%</StatValue>
              <StatLabel>Overall Completion</StatLabel>
            </div>
          </div>
        </OverallProgress>
        
        <FilterSection>
          <ViewToggle>
            <ViewButton
              active={view === 'grid'}
              onClick={() => setView('grid')}
            >
              Grid View
            </ViewButton>
            <ViewButton
              active={view === 'list'}
              onClick={() => setView('list')}
            >
              List View
            </ViewButton>
          </ViewToggle>
          
          <SortDropdown
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="progress">Sort by Progress</option>
            <option value="name">Sort by Name</option>
            <option value="difficulty">Sort by Difficulty</option>
          </SortDropdown>
        </FilterSection>
        
        <ModulesGrid view={view}>
          {sortedModules.map((module, index) => {
            const isLocked = module.metadata.locked;
            
            return isLocked ? (
              <ModuleCard
                key={module.id}
                locked
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ModuleHeader>
                  <ModuleIcon>{module.icon}</ModuleIcon>
                  <ModuleInfo>
                    <ModuleTitle>
                      {module.title}
                      <LockIcon />
                    </ModuleTitle>
                    <ModuleDescription>{module.description}</ModuleDescription>
                  </ModuleInfo>
                </ModuleHeader>
                
                <div style={{ textAlign: 'center', padding: '2rem 0', opacity: 0.5 }}>
                  Complete previous modules to unlock
                </div>
              </ModuleCard>
            ) : (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <ModuleCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <ModuleHeader>
                    <ModuleIcon>{module.icon}</ModuleIcon>
                    <ModuleInfo>
                      <ModuleTitle>{module.title}</ModuleTitle>
                      <ModuleDescription>{module.description}</ModuleDescription>
                      {module.metadata.badges.length > 0 && (
                        <BadgeRow>
                          {module.metadata.badges.map(badge => (
                            <Badge key={badge} type={badge as any}>
                              {badge === 'new' && '✨ New'}
                              {badge === 'popular' && '🔥 Popular'}
                              {badge === 'advanced' && '💪 Advanced'}
                            </Badge>
                          ))}
                        </BadgeRow>
                      )}
                    </ModuleInfo>
                  </ModuleHeader>
                  
                  <ModuleStats>
                    <StatItem>
                      <StatIcon>📚</StatIcon>
                      <StatValue>{module.metadata.topics}</StatValue>
                      <StatLabel>Topics</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatIcon>⏱️</StatIcon>
                      <StatValue>{module.metadata.duration}</StatValue>
                      <StatLabel>Duration</StatLabel>
                    </StatItem>
                    <StatItem>
                      <StatIcon>⭐</StatIcon>
                      <StatValue>{module.metadata.rating}</StatValue>
                      <StatLabel>Rating</StatLabel>
                    </StatItem>
                  </ModuleStats>
                  
                  <ModuleFooter>
                    <ProgressSection>
                      <ProgressBar>
                        <ProgressFill
                          progress={module.progress}
                          initial={{ width: 0 }}
                          animate={{ width: `${module.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </ProgressBar>
                      <ProgressText>{module.progress}%</ProgressText>
                    </ProgressSection>
                    
                    <StartButton
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {module.progress > 0 ? 'Continue' : 'Start'}
                      <ChevronRight size={20} />
                    </StartButton>
                  </ModuleFooter>
                </ModuleCard>
              </Link>
            );
          })}
        </ModulesGrid>
      </ModulesContainer>
    </Container>
  );
}