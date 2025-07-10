// @ts-nocheck
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Trophy, 
  Brain, 
  Clock, 
  Target,
  BookOpen,
  Zap,
  Calendar,
  ChevronRight,
  Fire,
  Star,
  Award
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import ProgressRing from '@/components/ProgressRing';
import AchievementNotification from '@/components/AchievementNotification';
import StudyStreak from '@/components/StudyStreak';
import { modules } from '@/data/studyData';

const Container = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(180deg, rgba(131, 56, 236, 0.05) 0%, transparent 50%);
`;

const DashboardHeader = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const WelcomeSection = styled.div`
  margin-bottom: 3rem;
`;

const Greeting = styled(motion.h1)`
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 0.5rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme }) => theme.colors.gradient.primary};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.section``;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ModuleGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ModuleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
  }
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
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const ModuleDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ModuleProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const Sidebar = styled.aside``;

const SidebarCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  margin-bottom: 1rem;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const QuickActionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuickActionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuickActionText = styled.div`
  font-weight: 500;
`;

const AchievementCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AchievementIcon = styled.div`
  font-size: 2rem;
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const AchievementDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const AchievementProgress = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getMotivationalMessage = (userLevel: number) => {
  if (userLevel < 5) return "You're just getting started! Keep going!";
  if (userLevel < 10) return "You're making great progress!";
  if (userLevel < 20) return "You're becoming an OB expert!";
  return "You're a master of obstetric care!";
};

export default function DashboardPage() {
  const { 
    userName, 
    userAvatar,
    userLevel,
    userXP,
    userStats,
    studyProgress,
    achievements,
    startSession
  } = useAppStore();
  
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  
  useEffect(() => {
    startSession();
    
    // Check for new achievements
    const recentAchievement = achievements.find(
      a => a.unlocked && 
      a.unlockedAt && 
      new Date(a.unlockedAt).getTime() > Date.now() - 5000
    );
    
    if (recentAchievement) {
      setShowAchievement(recentAchievement.id);
    }
  }, []);
  
  const calculateOverallProgress = () => {
    const totalModules = modules.length;
    const completedProgress = Object.values(studyProgress).reduce(
      (acc, progress) => acc + (progress.progress || 0),
      0
    );
    return Math.round((completedProgress / (totalModules * 100)) * 100);
  };
  
  const quickActions = [
    {
      icon: Brain,
      text: 'Practice Quiz',
      href: '/practice',
      color: '#FF006E',
    },
    {
      icon: Zap,
      text: 'Quick Review',
      href: '/flashcards',
      color: '#8338EC',
    },
    {
      icon: Trophy,
      text: 'Leaderboard',
      href: '/leaderboard',
      color: '#3A86FF',
    },
  ];
  
  const nextAchievements = achievements
    .filter(a => !a.unlocked)
    .slice(0, 3);
  
  return (
    <Container>
      <Navigation />
      
      {showAchievement && (
        <AchievementNotification
          achievementId={showAchievement}
          onClose={() => setShowAchievement(null)}
        />
      )}
      
      <DashboardHeader>
        <WelcomeSection>
          <Greeting
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {getGreeting()}, <span className="gradient">{userName}</span>! {userAvatar}
          </Greeting>
          <Subtitle>{getMotivationalMessage(userLevel)}</Subtitle>
        </WelcomeSection>
        
        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatHeader>
              <StatIcon>
                <Star />
              </StatIcon>
              <ProgressRing 
                progress={userXP % 1000 / 10} 
                size={50}
                strokeWidth={5}
              />
            </StatHeader>
            <StatValue>Level {userLevel}</StatValue>
            <StatLabel>{userXP} XP Total</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatHeader>
              <StatIcon>
                <Fire />
              </StatIcon>
              <StudyStreak streak={userStats.studyStreak} />
            </StatHeader>
            <StatValue>{userStats.studyStreak}</StatValue>
            <StatLabel>Day Study Streak</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatHeader>
              <StatIcon>
                <Target />
              </StatIcon>
              <span style={{ fontSize: '2rem' }}>🎯</span>
            </StatHeader>
            <StatValue>{userStats.averageQuizScore}%</StatValue>
            <StatLabel>Average Quiz Score</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
          >
            <StatHeader>
              <StatIcon>
                <Clock />
              </StatIcon>
              <span style={{ fontSize: '2rem' }}>⏱️</span>
            </StatHeader>
            <StatValue>{Math.floor(userStats.totalTimeSpent / 60)}h</StatValue>
            <StatLabel>Total Study Time</StatLabel>
          </StatCard>
        </StatsGrid>
      </DashboardHeader>
      
      <MainContent>
        <ContentSection>
          <SectionTitle>
            <BookOpen />
            Study Modules
          </SectionTitle>
          
          <ModuleGrid>
            {modules.map((module, index) => {
              const progress = studyProgress[module.id]?.progress || 0;
              
              return (
                <Link key={module.id} href={`/modules/${module.id}`}>
                  <ModuleCard
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <ModuleIcon>{module.icon}</ModuleIcon>
                    <ModuleInfo>
                      <ModuleTitle>{module.title}</ModuleTitle>
                      <ModuleDescription>{module.description}</ModuleDescription>
                      <ModuleProgress>
                        <ProgressBar>
                          <ProgressFill progress={progress} />
                        </ProgressBar>
                        <ProgressText>{progress}%</ProgressText>
                      </ModuleProgress>
                    </ModuleInfo>
                  </ModuleCard>
                </Link>
              );
            })}
          </ModuleGrid>
        </ContentSection>
        
        <Sidebar>
          <SidebarCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionTitle style={{ fontSize: '1.25rem' }}>
              <Zap />
              Quick Actions
            </SectionTitle>
            
            {quickActions.map((action) => (
              <QuickAction key={action.href} href={action.href}>
                <QuickActionInfo>
                  <QuickActionIcon style={{ background: action.color }}>
                    <action.icon size={20} />
                  </QuickActionIcon>
                  <QuickActionText>{action.text}</QuickActionText>
                </QuickActionInfo>
                <ChevronRight size={20} />
              </QuickAction>
            ))}
          </SidebarCard>
          
          <SidebarCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionTitle style={{ fontSize: '1.25rem' }}>
              <Award />
              Next Achievements
            </SectionTitle>
            
            {nextAchievements.map((achievement) => (
              <AchievementCard key={achievement.id}>
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementInfo>
                  <AchievementName>{achievement.name}</AchievementName>
                  <AchievementDescription>
                    {achievement.description}
                  </AchievementDescription>
                  <AchievementProgress>
                    <ProgressBar style={{ height: '4px' }}>
                      <ProgressFill progress={50} />
                    </ProgressBar>
                    <span style={{ fontSize: '0.75rem', color: '#8993A4' }}>
                      50%
                    </span>
                  </AchievementProgress>
                </AchievementInfo>
              </AchievementCard>
            ))}
          </SidebarCard>
          
          <SidebarCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectionTitle style={{ fontSize: '1.25rem' }}>
              <Calendar />
              Daily Goal
            </SectionTitle>
            
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <ProgressRing 
                progress={calculateOverallProgress()} 
                size={120}
                strokeWidth={8}
              />
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {calculateOverallProgress()}%
                </div>
                <div style={{ color: '#8993A4' }}>Overall Progress</div>
              </div>
            </div>
          </SidebarCard>
        </Sidebar>
      </MainContent>
    </Container>
  );
}