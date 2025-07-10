// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  User, 
  Target, 
  Calendar,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import confetti from 'canvas-confetti';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at center, rgba(131, 56, 236, 0.2) 0%, transparent 70%);
  padding: 2rem;
`;

const OnboardingCard = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem;
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
      rgba(255, 0, 110, 0.1),
      transparent
    );
    animation: shimmer 3s linear infinite;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: ${({ active }) => (active ? '40px' : '10px')};
  height: 10px;
  border-radius: 5px;
  background: ${({ active, completed, theme }) =>
    active
      ? theme.colors.primary
      : completed
      ? theme.colors.success
      : 'rgba(255, 255, 255, 0.2)'};
  transition: all 0.3s ease;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  text-align: center;
  margin-bottom: 3rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 20px rgba(255, 0, 110, 0.3);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const AvatarOption = styled(motion.button)<{ selected: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.gradient.primary : 'rgba(255, 255, 255, 0.1)'};
  border: 2px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GoalCard = styled(motion.button)<{ selected: boolean }>`
  padding: 1.5rem;
  background: ${({ selected }) =>
    selected ? 'rgba(255, 0, 110, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GoalTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const GoalDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  font-size: 0.875rem;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const DateOption = styled(motion.button)<{ selected: boolean }>`
  padding: 1rem;
  background: ${({ selected }) =>
    selected ? 'rgba(255, 0, 110, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled(motion.button)`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: 1.25rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 0, 110, 0.4);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.gray[300]};
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const avatars = ['👩‍⚕️', '👨‍⚕️', '🧑‍⚕️', '👩‍🎓', '👨‍🎓', '🧑‍🎓', '💪', '🌟'];

const goals = [
  {
    icon: Target,
    title: 'Pass NCLEX-RN',
    description: 'Focused preparation for the licensing exam',
  },
  {
    icon: Sparkles,
    title: 'Master OB Content',
    description: 'Deep understanding of obstetric complications',
  },
  {
    icon: CheckCircle,
    title: 'Clinical Excellence',
    description: 'Prepare for real-world emergency scenarios',
  },
];

const examDates = [
  { label: 'Within 1 month', value: 30 },
  { label: '1-3 months', value: 90 },
  { label: '3-6 months', value: 180 },
  { label: 'Just exploring', value: 365 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setUserName, setUserAvatar, addXP } = useAppStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '👩‍⚕️',
    goal: '',
    examDate: 90,
  });
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const completeOnboarding = () => {
    setUserName(formData.name);
    setUserAvatar(formData.avatar);
    addXP(100); // Welcome bonus XP
    
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5'],
    });
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };
  
  const isStepValid = () => {
    switch (step) {
      case 0:
        return formData.name.trim().length >= 2;
      case 1:
        return true; // Avatar is always selected
      case 2:
        return formData.goal !== '';
      case 3:
        return true; // Date is always selected
      default:
        return false;
    }
  };
  
  return (
    <Container>
      <OnboardingCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <StepIndicator>
          {[0, 1, 2, 3].map((i) => (
            <Step
              key={i}
              active={i === step}
              completed={i < step}
            />
          ))}
        </StepIndicator>
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Title>
                Welcome to <span className="gradient">OB Review</span>
              </Title>
              <Subtitle>Let's personalize your learning experience</Subtitle>
              
              <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <InputGroup>
                  <Label>What should we call you?</Label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    autoFocus
                  />
                </InputGroup>
              </Form>
            </motion.div>
          )}
          
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Title>
                Choose Your <span className="gradient">Avatar</span>
              </Title>
              <Subtitle>Pick an emoji that represents you</Subtitle>
              
              <AvatarGrid>
                {avatars.map((avatar) => (
                  <AvatarOption
                    key={avatar}
                    selected={formData.avatar === avatar}
                    onClick={() => setFormData({ ...formData, avatar })}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {avatar}
                  </AvatarOption>
                ))}
              </AvatarGrid>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Title>
                What's Your <span className="gradient">Goal</span>?
              </Title>
              <Subtitle>We'll customize your experience based on your needs</Subtitle>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.title}
                    selected={formData.goal === goal.title}
                    onClick={() => setFormData({ ...formData, goal: goal.title })}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GoalTitle>
                      <goal.icon size={24} />
                      {goal.title}
                    </GoalTitle>
                    <GoalDescription>{goal.description}</GoalDescription>
                  </GoalCard>
                ))}
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Title>
                When's Your <span className="gradient">Exam</span>?
              </Title>
              <Subtitle>We'll help you create the perfect study schedule</Subtitle>
              
              <DateGrid>
                {examDates.map((date) => (
                  <DateOption
                    key={date.value}
                    selected={formData.examDate === date.value}
                    onClick={() =>
                      setFormData({ ...formData, examDate: date.value })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Calendar size={20} style={{ marginBottom: '0.5rem' }} />
                    <div>{date.label}</div>
                  </DateOption>
                ))}
              </DateGrid>
            </motion.div>
          )}
        </AnimatePresence>
        
        <ButtonGroup>
          {step > 0 && (
            <BackButton onClick={handleBack}>Back</BackButton>
          )}
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ flex: 1 }}
          >
            {step === 3 ? (
              <>
                Get Started
                <Sparkles size={20} />
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={20} />
              </>
            )}
          </Button>
        </ButtonGroup>
      </OnboardingCard>
    </Container>
  );
}