// app/leaderboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown,
  Star,
  Users,
  Calendar,
  Filter,
  ChevronUp,
  ChevronDown,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';

const Container = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(180deg, rgba(255, 0, 110, 0.05) 0%, transparent 50%);
`;

const Header = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 4rem);
  margin-bottom: 1rem;
  
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
  margin-bottom: 3rem;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${({ active, theme }) => 
    active ? theme.colors.gradient.primary : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ active }) => 
    active ? 'transparent' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 2rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.gradient.primary : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-2px);
  }
`;

const LeaderboardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;

const TopThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const TopCard = styled(motion.div)<{ rank: number }>`
  background: ${({ rank }) => 
    rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
    rank === 2 ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)' :
    'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'};
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  ${({ rank }) => rank === 1 && 'transform: scale(1.1);'}
  
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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 3s linear infinite;
  }
  
  @media (max-width: 768px) {
    transform: scale(1);
  }
`;

const RankBadge = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
`;

const UserAvatar = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.5);
`;

const UserName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
`;

const UserStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
`;

const RankingList = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 2rem;
`;

const RankingItem = styled(motion.div)<{ isCurrentUser?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ isCurrentUser }) => 
    isCurrentUser ? 'rgba(131, 56, 236, 0.2)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ isCurrentUser, theme }) => 
    isCurrentUser ? theme.colors.secondary : 'transparent'};
  border-radius: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Rank = styled.div`
  width: 50px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const Name = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Level = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Score = styled.div`
  text-align: right;
`;

const Points = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Change = styled.div<{ positive: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => 
    positive ? theme.colors.success : theme.colors.danger};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin: 2rem auto;
`;

// Mock leaderboard data
const generateMockData = (currentUser: any) => {
  const names = [
    'Emma Thompson', 'James Wilson', 'Sarah Chen', 'Michael Brown',
    'Jessica Davis', 'Ryan Martinez', 'Ashley Johnson', 'David Lee',
    'Emily Rodriguez', 'Christopher Taylor', 'Olivia Anderson', 'Daniel White'
  ];
  
  const avatars = ['👩‍⚕️', '👨‍⚕️', '🧑‍⚕️', '👩‍🎓', '👨‍🎓', '🧑‍🎓'];
  
  const users = names.map((name, index) => ({
    id: `user-${index}`,
    name,
    avatar: avatars[index % avatars.length],
    level: Math.floor(Math.random() * 20) + 5,
    xp: Math.floor(Math.random() * 10000) + 2000,
    streak: Math.floor(Math.random() * 30) + 1,
    achievements: Math.floor(Math.random() * 15) + 5,
    weeklyChange: Math.floor(Math.random() * 1000) - 300,
  }));
  
  // Add current user if logged in
  if (currentUser.userName) {
    users.push({
      id: 'current-user',
      name: currentUser.userName,
      avatar: currentUser.userAvatar,
      level: currentUser.userLevel,
      xp: currentUser.userXP,
      streak: currentUser.userStats.studyStreak,
      achievements: currentUser.userStats.achievementsUnlocked,
      weeklyChange: 250,
    });
  }
  
  // Sort by XP
  return users.sort((a, b) => b.xp - a.xp);
};

export default function LeaderboardPage() {
  const { userName, userAvatar, userLevel, userXP, userStats } = useAppStore();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('weekly');
  const [category, setCategory] = useState<'xp' | 'streak' | 'achievements'>('xp');
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const data = generateMockData({ userName, userAvatar, userLevel, userXP, userStats });
      setLeaderboardData(data);
      setLoading(false);
      
      // Celebrate if user is in top 3
      const userRank = data.findIndex(u => u.id === 'current-user') + 1;
      if (userRank > 0 && userRank <= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF006E'],
        });
      }
    }, 1000);
  }, [timeframe, category]);
  
  const getSortedData = () => {
    const sorted = [...leaderboardData];
    
    switch (category) {
      case 'streak':
        return sorted.sort((a, b) => b.streak - a.streak);
      case 'achievements':
        return sorted.sort((a, b) => b.achievements - a.achievements);
      default:
        return sorted.sort((a, b) => b.xp - a.xp);
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={40} color="#FFD700" />;
      case 2:
        return <Medal size={40} color="#C0C0C0" />;
      case 3:
        return <Medal size={40} color="#CD7F32" />;
      default:
        return rank;
    }
  };
  
  const sortedData = getSortedData();
  const topThree = sortedData.slice(0, 3);
  const restOfList = sortedData.slice(3);
  
  return (
    <Container>
      <Navigation />
      
      <Header>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy size={48} style={{ verticalAlign: 'middle', marginRight: '1rem' }} />
          <span className="gradient">Leaderboard</span>
        </Title>
        
        <Subtitle>
          Compete with fellow students and climb the ranks!
        </Subtitle>
        
        <FilterBar>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <FilterButton
              active={timeframe === 'daily'}
              onClick={() => setTimeframe('daily')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daily
            </FilterButton>
            <FilterButton
              active={timeframe === 'weekly'}
              onClick={() => setTimeframe('weekly')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={18} />
              Weekly
            </FilterButton>
            <FilterButton
              active={timeframe === 'monthly'}
              onClick={() => setTimeframe('monthly')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Monthly
            </FilterButton>
            <FilterButton
              active={timeframe === 'all'}
              onClick={() => setTimeframe('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Time
            </FilterButton>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <FilterButton
              active={category === 'xp'}
              onClick={() => setCategory('xp')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={18} />
              XP Points
            </FilterButton>
            <FilterButton
              active={category === 'streak'}
              onClick={() => setCategory('streak')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔥 Streak
            </FilterButton>
            <FilterButton
              active={category === 'achievements'}
              onClick={() => setCategory('achievements')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy size={18} />
              Achievements
            </FilterButton>
          </div>
        </FilterBar>
      </Header>
      
      <LeaderboardContainer>
        {loading ? (
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            <TopThree>
              {topThree[1] && (
                <TopCard
                  rank={2}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <RankBadge>{getRankIcon(2)}</RankBadge>
                  <UserAvatar>{topThree[1].avatar}</UserAvatar>
                  <UserName>{topThree[1].name}</UserName>
                  <Level>Level {topThree[1].level}</Level>
                  <UserStats>
                    <Stat>
                      <StatValue>
                        <CountUp end={topThree[1][category === 'xp' ? 'xp' : category === 'streak' ? 'streak' : 'achievements']} />
                      </StatValue>
                      <StatLabel>
                        {category === 'xp' ? 'XP' : category === 'streak' ? 'Days' : 'Badges'}
                      </StatLabel>
                    </Stat>
                  </UserStats>
                </TopCard>
              )}
              
              {topThree[0] && (
                <TopCard
                  rank={1}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <RankBadge>{getRankIcon(1)}</RankBadge>
                  <UserAvatar>{topThree[0].avatar}</UserAvatar>
                  <UserName>{topThree[0].name}</UserName>
                  <Level>Level {topThree[0].level}</Level>
                  <UserStats>
                    <Stat>
                      <StatValue>
                        <CountUp end={topThree[0][category === 'xp' ? 'xp' : category === 'streak' ? 'streak' : 'achievements']} />
                      </StatValue>
                      <StatLabel>
                        {category === 'xp' ? 'XP' : category === 'streak' ? 'Days' : 'Badges'}
                      </StatLabel>
                    </Stat>
                  </UserStats>
                </TopCard>
              )}
              
              {topThree[2] && (
                <TopCard
                  rank={3}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <RankBadge>{getRankIcon(3)}</RankBadge>
                  <UserAvatar>{topThree[2].avatar}</UserAvatar>
                  <UserName>{topThree[2].name}</UserName>
                  <Level>Level {topThree[2].level}</Level>
                  <UserStats>
                    <Stat>
                      <StatValue>
                        <CountUp end={topThree[2][category === 'xp' ? 'xp' : category === 'streak' ? 'streak' : 'achievements']} />
                      </StatValue>
                      <StatLabel>
                        {category === 'xp' ? 'XP' : category === 'streak' ? 'Days' : 'Badges'}
                      </StatLabel>
                    </Stat>
                  </UserStats>
                </TopCard>
              )}
            </TopThree>
            
            <RankingList>
              <AnimatePresence>
                {restOfList.map((user, index) => {
                  const rank = index + 4;
                  const isCurrentUser = user.id === 'current-user';
                  
                  return (
                    <RankingItem
                      key={user.id}
                      isCurrentUser={isCurrentUser}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Rank>{rank}</Rank>
                      <UserInfo>
                        <Avatar>{user.avatar}</Avatar>
                        <UserDetails>
                          <Name>
                            {user.name}
                            {isCurrentUser && ' (You)'}
                          </Name>
                          <Level>Level {user.level}</Level>
                        </UserDetails>
                      </UserInfo>
                      <Score>
                        <Points>
                          {category === 'xp' && `${user.xp.toLocaleString()} XP`}
                          {category === 'streak' && `${user.streak} days`}
                          {category === 'achievements' && `${user.achievements} badges`}
                        </Points>
                        {category === 'xp' && (
                          <Change positive={user.weeklyChange > 0}>
                            {user.weeklyChange > 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            {Math.abs(user.weeklyChange)}
                          </Change>
                        )}
                      </Score>
                    </RankingItem>
                  );
                })}
              </AnimatePresence>
            </RankingList>
          </>
        )}
      </LeaderboardContainer>
    </Container>
  );
}