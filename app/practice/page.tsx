// app/practice/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock, 
  SkipForward,
  Flag,
  AlertCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import { quizQuestions } from '@/data/studyData';
import { Howl } from 'howler';
import confetti from 'canvas-confetti';

const Container = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: radial-gradient(ellipse at center, rgba(58, 134, 255, 0.1) 0%, transparent 70%);
`;

const QuizContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 0 2rem;
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 4px;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const QuestionCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem;
  position: relative;
  overflow: hidden;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const QuestionNumber = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: 0.5rem;
`;

const DifficultyBadge = styled.div<{ difficulty: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  background: ${({ difficulty, theme }) => 
    difficulty === 'hard' ? 'rgba(255, 67, 101, 0.2)' :
    difficulty === 'medium' ? 'rgba(255, 183, 0, 0.2)' :
    'rgba(6, 255, 165, 0.2)'
  };
  color: ${({ difficulty, theme }) => 
    difficulty === 'hard' ? theme.colors.danger :
    difficulty === 'medium' ? theme.colors.warning :
    theme.colors.success
  };
  border: 1px solid currentColor;
`;

const QuestionText = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const OptionCard = styled(motion.button)<{ 
  selected: boolean; 
  correct?: boolean; 
  incorrect?: boolean;
  disabled: boolean;
}>`
  background: ${({ selected, correct, incorrect }) =>
    correct ? 'rgba(6, 255, 165, 0.2)' :
    incorrect ? 'rgba(255, 67, 101, 0.2)' :
    selected ? 'rgba(131, 56, 236, 0.2)' :
    'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${({ selected, correct, incorrect, theme }) =>
    correct ? theme.colors.success :
    incorrect ? theme.colors.danger :
    selected ? theme.colors.secondary :
    'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: left;
  cursor: ${({ disabled }) => disabled ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover:not(:disabled) {
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-2px)'};
    border-color: ${({ disabled, theme }) => 
      disabled ? 'inherit' : theme.colors.primary
    };
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover:not(:disabled)::before {
    left: 100%;
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionLabel = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const OptionText = styled.div`
  flex: 1;
`;

const OptionIcon = styled.div`
  margin-left: auto;
`;

const RationaleCard = styled(motion.div)<{ correct: boolean }>`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${({ correct }) =>
    correct ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 183, 0, 0.1)'
  };
  border: 1px solid ${({ correct, theme }) =>
    correct ? theme.colors.success : theme.colors.warning
  };
  border-radius: 1rem;
`;

const RationaleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const RationaleText = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 1rem 2rem;
  background: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.gradient.primary : 'transparent'
  };
  border: 2px solid ${({ variant, theme }) =>
    variant === 'primary' ? 'transparent' : 'rgba(255, 255, 255, 0.2)'
  };
  color: white;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ variant }) =>
      variant === 'primary' ? '0 10px 30px rgba(131, 56, 236, 0.4)' : 'none'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ResultsScreen = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem;
  text-align: center;
`;

const ScoreDisplay = styled.div`
  font-size: 5rem;
  font-weight: 900;
  margin: 2rem 0;
  background: ${({ theme }) => theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 3rem 0;
`;

const StatCard = styled.div`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[400]};
  font-size: 0.875rem;
`;

export default function PracticePage() {
  const router = useRouter();
  const {
    addQuizResult,
    addXP,
    unlockAchievement,
    soundEnabled,
    hapticEnabled,
  } = useAppStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showRationale, setShowRationale] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [incorrectQuestions, setIncorrectQuestions] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  
  // Shuffle and select 10 questions for the quiz
  const questions = quizQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  const playSound = (type: 'correct' | 'incorrect' | 'complete') => {
    if (!soundEnabled) return;
    
    const soundMap = {
      correct: '/sounds/correct.mp3',
      incorrect: '/sounds/incorrect.mp3',
      complete: '/sounds/complete.mp3',
    };
    
    const sound = new Howl({
      src: [soundMap[type]],
      volume: 0.5,
    });
    sound.play();
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (showRationale) return;
    
    setSelectedAnswer(answerIndex);
    setShowRationale(true);
    
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('correct');
    } else {
      setIncorrectQuestions(prev => [...prev, currentQuestion.id]);
      playSound('incorrect');
    }
    
    // Haptic feedback
    if (hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(isCorrect ? 50 : [50, 50, 50]);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowRationale(false);
    } else {
      completeQuiz();
    }
  };
  
  const completeQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalScore = (score / questions.length) * 100;
    
    // Add quiz result
    addQuizResult({
      id: `quiz-${Date.now()}`,
      moduleId: 'practice',
      score: score,
      totalQuestions: questions.length,
      timeSpent: timeElapsed,
      completedAt: new Date(),
      incorrectQuestions,
    });
    
    // Award XP based on score
    const xpEarned = Math.round(finalScore * 2);
    addXP(xpEarned);
    
    // Check for achievements
    if (finalScore === 100) {
      unlockAchievement('perfect-score');
    }
    if (timeElapsed < 120 && finalScore >= 80) {
      unlockAchievement('speed-demon');
    }
    
    playSound('complete');
    
    // Celebration for high scores
    if (finalScore >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5'],
      });
    }
    
    setQuizComplete(true);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSkip = () => {
    setIncorrectQuestions(prev => [...prev, currentQuestion.id]);
    handleNextQuestion();
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowRationale(false);
    setScore(0);
    setTimeElapsed(0);
    setQuizComplete(false);
    setIncorrectQuestions([]);
  };
  
  if (quizComplete) {
    const finalScore = Math.round((score / questions.length) * 100);
    const avgTimePerQuestion = Math.round(timeElapsed / questions.length);
    
    return (
      <Container>
        <Navigation />
        <QuizContainer>
          <ResultsScreen
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1>Quiz Complete! 🎉</h1>
            
            <ScoreDisplay>{finalScore}%</ScoreDisplay>
            
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              You got {score} out of {questions.length} questions correct!
            </p>
            
            <StatsGrid>
              <StatCard>
                <StatValue>{formatTime(timeElapsed)}</StatValue>
                <StatLabel>Total Time</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{avgTimePerQuestion}s</StatValue>
                <StatLabel>Avg. per Question</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>+{Math.round(finalScore * 2)}</StatValue>
                <StatLabel>XP Earned</StatLabel>
              </StatCard>
            </StatsGrid>
            
            <ActionButtons>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="primary"
                onClick={handleRestart}
              >
                <RotateCcw size={20} />
                Try Again
              </Button>
            </ActionButtons>
          </ResultsScreen>
        </QuizContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <Navigation />
      <QuizContainer>
        <Header>
          <div>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <ProgressBar>
            <ProgressFill
              progress={progress}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressBar>
          <Timer>
            <Clock size={20} />
            {formatTime(timeElapsed)}
          </Timer>
        </Header>
        
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionHeader>
              <div>
                <QuestionNumber>
                  {currentQuestion.topic} • Question {currentQuestionIndex + 1}
                </QuestionNumber>
              </div>
              <DifficultyBadge difficulty={currentQuestion.difficulty}>
                {currentQuestion.difficulty}
              </DifficultyBadge>
            </QuestionHeader>
            
            <QuestionText>{currentQuestion.question}</QuestionText>
            
            <OptionsGrid>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = showRationale && index === currentQuestion.correctAnswer;
                const isIncorrect = showRationale && isSelected && !isCorrect;
                
                return (
                  <OptionCard
                    key={index}
                    selected={isSelected}
                    correct={isCorrect}
                    incorrect={isIncorrect}
                    disabled={showRationale}
                    onClick={() => handleAnswerSelect(index)}
                    whileHover={!showRationale ? { scale: 1.02 } : {}}
                    whileTap={!showRationale ? { scale: 0.98 } : {}}
                  >
                    <OptionContent>
                      <OptionLabel>
                        {String.fromCharCode(65 + index)}
                      </OptionLabel>
                      <OptionText>{option}</OptionText>
                      {showRationale && (
                        <OptionIcon>
                          {isCorrect && <CheckCircle color="#06FFA5" />}
                          {isIncorrect && <XCircle color="#FF4365" />}
                        </OptionIcon>
                      )}
                    </OptionContent>
                  </OptionCard>
                );
              })}
            </OptionsGrid>
            
            {showRationale && (
              <RationaleCard
                correct={selectedAnswer === currentQuestion.correctAnswer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RationaleHeader>
                  <AlertCircle size={20} />
                  Rationale
                </RationaleHeader>
                <RationaleText>{currentQuestion.rationale}</RationaleText>
              </RationaleCard>
            )}
            
            <ActionButtons>
              {!showRationale && (
                <Button variant="secondary" onClick={handleSkip}>
                  <SkipForward size={20} />
                  Skip Question
                </Button>
              )}
              {showRationale && (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ChevronRight size={20} />
                    </>
                  ) : (
                    <>
                      Finish Quiz
                      <Flag size={20} />
                    </>
                  )}
                </Button>
              )}
            </ActionButtons>
          </QuestionCard>
        </AnimatePresence>
      </QuizContainer>
    </Container>
  );
}