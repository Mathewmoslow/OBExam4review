// components/EmergencySimulation.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Text3D, 
  Center,
  Float,
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';
import { 
  AlertTriangle, 
  Heart, 
  Activity,
  Stethoscope,
  Timer,
  CheckCircle,
  XCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { EmergencyScenario } from '@/data/studyData';
import { useAppStore } from '@/store/useAppStore';
import { Howl } from 'howler';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 600px;
  background: #0A0E27;
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SceneCanvas = styled.div`
  position: absolute;
  inset: 0;
`;

const UIOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to bottom, rgba(10, 14, 39, 0.9), transparent);
  pointer-events: auto;
`;

const VitalsDisplay = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const VitalCard = styled(motion.div)<{ alert?: boolean }>`
  background: ${({ alert }) => 
    alert ? 'rgba(255, 67, 101, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ alert, theme }) => 
    alert ? theme.colors.danger : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  ${({ alert }) => alert && `
    animation: pulse 1s ease-in-out infinite;
  `}
`;

const VitalLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VitalValue = styled.div`
  font-size: 1.125rem;
  font-weight: bold;
`;

const TimerDisplay = styled(motion.div)<{ urgent: boolean }>`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: ${({ urgent }) => 
    urgent ? 'rgba(255, 67, 101, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(10px);
  border: 1px solid ${({ urgent, theme }) => 
    urgent ? theme.colors.danger : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  pointer-events: auto;
  
  ${({ urgent }) => urgent && `
    animation: shake 0.5s ease-in-out infinite;
  `}
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
`;

const DecisionPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(10, 14, 39, 0.95), transparent);
  pointer-events: auto;
`;

const ScenarioTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const DecisionPrompt = styled.p`
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.gray[200]};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const OptionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ResultOverlay = styled(motion.div)<{ success: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ success }) => 
    success ? 'rgba(6, 255, 165, 0.1)' : 'rgba(255, 67, 101, 0.1)'};
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 2rem;
  text-align: center;
`;

const ResultIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 1rem;
`;

const ResultTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const ResultMessage = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const SoundToggle = styled.button`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// 3D Components
function PatientModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Simple patient representation */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.5, 2, 4, 8]} />
          <meshStandardMaterial 
            color="#FFE5CC" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial 
            color="#FFE5CC" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Hospital bed simplified */}
        <mesh position={[0, -1.5, 0]}>
          <boxGeometry args={[3, 0.5, 2]} />
          <meshStandardMaterial color="#4A5568" />
        </mesh>
      </group>
    </Float>
  );
}

function VitalSignsDisplay({ vitals }: { vitals: any }) {
  return (
    <group position={[3, 2, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 3]} />
        <meshBasicMaterial color="#0A0E27" opacity={0.8} transparent />
      </mesh>
      
      <Center position={[0, 1, 0.01]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.3}
          height={0.05}
          curveSegments={12}
        >
          VITALS
          <meshStandardMaterial color="#FF006E" emissive="#FF006E" emissiveIntensity={0.5} />
        </Text3D>
      </Center>
      
      {/* ECG Wave Animation */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2, 0.8]} />
        <meshBasicMaterial color="#06FFA5" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}

interface Props {
  scenario: EmergencyScenario;
  onComplete: (score: number) => void;
}

export default function EmergencySimulation({ scenario, onComplete }: Props) {
  const soundEnabled = useAppStore(state => state.preferences.soundEnabled);
  const hapticEnabled = useAppStore(state => state.preferences.hapticEnabled);
  const [timeRemaining, setTimeRemaining] = useState(scenario.timeLimit);
  const [currentDecision, setCurrentDecision] = useState(scenario.decisions[0]);
  const [vitals, setVitals] = useState(scenario.initialVitals);
  const [showResult, setShowResult] = useState(false);
  const [success, setSuccess] = useState(false);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [localSoundEnabled, setLocalSoundEnabled] = useState(soundEnabled);
  
  const alarmSound = useRef<Howl | null>(null);
  const heartbeatSound = useRef<Howl | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    // Initialize sounds
    if (localSoundEnabled) {
      alarmSound.current = new Howl({
        src: ['/sounds/alarm.mp3'],
        loop: true,
        volume: 0.3,
      });
      
      heartbeatSound.current = new Howl({
        src: ['/sounds/heartbeat.mp3'],
        loop: true,
        volume: 0.5,
      });
      
      alarmSound.current.play();
      heartbeatSound.current.play();
    }
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (alarmSound.current) alarmSound.current.stop();
      if (heartbeatSound.current) heartbeatSound.current.stop();
    };
  }, []);
  
  const handleDecision = (optionIndex: number) => {
    const option = currentDecision.options[optionIndex];
    
    if (option.isCorrect) {
      setCorrectDecisions(prev => prev + 1);
      
      if (hapticEnabled && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Update vitals based on correct decision
      // This is simplified - in a real app, you'd have more complex logic
      setVitals(prev => ({
        ...prev,
        bp: '120/80',
        hr: '80',
      }));
    } else {
      if (hapticEnabled && 'vibrate' in navigator) {
        navigator.vibrate([50, 50, 50]);
      }
    }
    
    // Check if there's a next decision
    if (option.nextDecisionId) {
      const nextDecision = scenario.decisions.find(
        d => d.id === option.nextDecisionId
      );
      if (nextDecision) {
        setCurrentDecision(nextDecision);
        return;
      }
    }
    
    // Complete scenario
    completeScenario(option.isCorrect);
  };
  
  const handleTimeout = () => {
    completeScenario(false);
  };
  
  const completeScenario = (lastDecisionCorrect: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (alarmSound.current) alarmSound.current.stop();
    if (heartbeatSound.current) heartbeatSound.current.stop();
    
    const totalDecisions = scenario.decisions.length;
    const score = Math.round((correctDecisions / totalDecisions) * 100);
    
    setSuccess(score >= 80);
    setShowResult(true);
    
    setTimeout(() => {
      onComplete(score);
    }, 3000);
  };
  
  const toggleSound = () => {
    setLocalSoundEnabled(prev => {
      const newState = !prev;
      if (newState) {
        alarmSound.current?.play();
        heartbeatSound.current?.play();
      } else {
        alarmSound.current?.stop();
        heartbeatSound.current?.stop();
      }
      return newState;
    });
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const isVitalCritical = (vital: string, value: string) => {
    // Simplified critical value detection
    if (vital === 'bp' && value.includes('90/60')) return true;
    if (vital === 'hr' && parseInt(value) > 120) return true;
    if (vital === 'o2sat' && parseInt(value) < 92) return true;
    return false;
  };
  
  return (
    <Container>
      <SceneCanvas>
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} />
          <OrbitControls 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
          />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -5, -10]} color="#FF006E" intensity={0.5} />
          
          <PatientModel />
          <VitalSignsDisplay vitals={vitals} />
          
          <Environment preset="hospital" />
          
          <fog attach="fog" args={['#0A0E27', 5, 30]} />
        </Canvas>
      </SceneCanvas>
      
      <UIOverlay>
        <TopBar>
          <VitalsDisplay>
            <VitalCard 
              alert={isVitalCritical('bp', vitals.bp)}
              animate={isVitalCritical('bp', vitals.bp) ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <VitalLabel>
                <Activity size={16} />
                BP
              </VitalLabel>
              <VitalValue>{vitals.bp}</VitalValue>
            </VitalCard>
            
            <VitalCard 
              alert={isVitalCritical('hr', vitals.hr)}
              animate={isVitalCritical('hr', vitals.hr) ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <VitalLabel>
                <Heart size={16} />
                HR
              </VitalLabel>
              <VitalValue>{vitals.hr}</VitalValue>
            </VitalCard>
            
            <VitalCard>
              <VitalLabel>
                <Stethoscope size={16} />
                RR
              </VitalLabel>
              <VitalValue>{vitals.rr}</VitalValue>
            </VitalCard>
            
            <VitalCard 
              alert={isVitalCritical('o2sat', vitals.o2sat)}
            >
              <VitalLabel>O₂</VitalLabel>
              <VitalValue>{vitals.o2sat}</VitalValue>
            </VitalCard>
          </VitalsDisplay>
          
          <TimerDisplay urgent={timeRemaining < 60}>
            <Timer size={20} />
            {formatTime(timeRemaining)}
          </TimerDisplay>
        </TopBar>
        
        <DecisionPanel>
          <ScenarioTitle>
            <AlertTriangle />
            {scenario.title}
          </ScenarioTitle>
          
          <DecisionPrompt>{currentDecision.prompt}</DecisionPrompt>
          
          <OptionsGrid>
            {currentDecision.options.map((option, index) => (
              <OptionButton
                key={index}
                onClick={() => handleDecision(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {option.text}
              </OptionButton>
            ))}
          </OptionsGrid>
        </DecisionPanel>
        
        <SoundToggle onClick={toggleSound}>
          {localSoundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </SoundToggle>
      </UIOverlay>
      
      <AnimatePresence>
        {showResult && (
          <ResultOverlay
            success={success}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultIcon>
              {success ? (
                <CheckCircle size={80} color="#06FFA5" />
              ) : (
                <XCircle size={80} color="#FF4365" />
              )}
            </ResultIcon>
            
            <ResultTitle>
              {success ? 'Excellent Response!' : 'Room for Improvement'}
            </ResultTitle>
            
            <ResultMessage>
              {success
                ? `You made ${correctDecisions} correct decisions and successfully managed the emergency!`
                : `You made ${correctDecisions} correct decisions. Review the scenario to improve your response.`}
            </ResultMessage>
          </ResultOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
}