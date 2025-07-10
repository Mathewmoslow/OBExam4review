// app/modules/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  FileText, 
  AlertTriangle,
  ChevronRight,
  Clock,
  CheckCircle,
  Lock,
  Play,
  Pill
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import EmergencySimulation from '@/components/EmergencySimulation';
import { modules } from '@/data/studyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

const Container = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(180deg, rgba(131, 56, 236, 0.05) 0%, transparent 50%);
`;

const Header = styled.div`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ModuleTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon {
    font-size: 3rem;
  }
`;

const ModuleDescription = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: 4px;
`;

const ProgressText = styled.div`
  text-align: right;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
`;

const TabsContainer = styled(Tabs)`
  width: 100%;
`;

const StyledTabsList = styled(TabsList)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 1rem;
`;

const StyledTabsTrigger = styled(TabsTrigger)`
  flex: 1;
  padding: 1rem 2rem;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[300]};
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &[data-state='active'] {
    background: ${({ theme }) => theme.colors.gradient.primary};
    color: white;
  }
  
  &:hover:not([data-state='active']) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TopicGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const TopicCard = styled(motion.div)<{ completed?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid ${({ completed, theme }) => 
    completed ? theme.colors.success : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ completed, theme }) => 
      completed ? theme.colors.success : theme.colors.gradient.primary};
    transform: scaleX(${({ completed }) => completed ? 1 : 0});
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 40px rgba(131, 56, 236, 0.3);
    
    &::before {
      transform: scaleX(1);
    }
  }
`;

const TopicHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TopicTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const TopicDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const KeyPoints = styled.ul`
  list-style: none;
  padding: 0;
`;

const KeyPoint = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
`;

const CaseStudyCard = styled(TopicCard)`
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
`;

const SimulationCard = styled(TopicCard)`
  background: linear-gradient(135deg, rgba(255, 0, 110, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
`;

const MedicationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MedicationCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const MedicationName = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

const MedicationInfo = styled.div`
  margin-bottom: 1rem;
`;

const MedicationLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: 0.25rem;
`;

const MedicationValue = styled.div`
  font-weight: 500;
`;

const WarningList = styled.ul`
  list-style: none;
  padding: 0;
`;

const WarningItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.danger};
  
  svg {
    flex-shrink: 0;
  }
`;

const ActionButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(131, 56, 236, 0.4);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 2rem;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
  }
`;

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const { 
    studyProgress, 
    updateProgress, 
    addXP,
    setCurrentModule,
    setCurrentTopic
  } = useAppStore();
  
  const [activeTab, setActiveTab] = useState('topics');
  const [selectedScenario, setSelectedScenario] = useState<any>(null);
  
  const module = modules.find(m => m.id === params.id);
  
  if (!module) {
    router.push('/modules');
    return null;
  }
  
  const moduleProgress = studyProgress[module.id]?.progress || 0;
  const completedTopics = studyProgress[module.id]?.topicsCompleted || [];
  
  const handleTopicClick = (topicId: string) => {
    setCurrentModule(module.id);
    setCurrentTopic(topicId);
    router.push(`/modules/${module.id}/topic/${topicId}`);
  };
  
  const handleCaseStudyClick = (caseStudyId: string) => {
    router.push(`/modules/${module.id}/case/${caseStudyId}`);
  };
  
  const handleScenarioComplete = (score: number) => {
    addXP(score * 3); // Triple XP for simulations
    setSelectedScenario(null);
    
    // Update progress
    const newProgress = Math.min(moduleProgress + 10, 100);
    updateProgress(module.id, { progress: newProgress });
  };
  
  return (
    <Container>
      <Navigation />
      
      <Header>
        <ModuleTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="icon">{module.icon}</span>
          {module.title}
        </ModuleTitle>
        
        <ModuleDescription>{module.description}</ModuleDescription>
        
        <div>
          <ProgressBar>
            <ProgressFill
              progress={moduleProgress}
              initial={{ width: 0 }}
              animate={{ width: `${moduleProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </ProgressBar>
          <ProgressText>{moduleProgress}% Complete</ProgressText>
        </div>
      </Header>
      
      <Content>
        <TabsContainer value={activeTab} onValueChange={setActiveTab}>
          <StyledTabsList>
            <StyledTabsTrigger value="topics">
              <BookOpen size={20} />
              Topics ({module.topics.length})
            </StyledTabsTrigger>
            <StyledTabsTrigger value="cases">
              <FileText size={20} />
              Case Studies ({module.caseStudies.length})
            </StyledTabsTrigger>
            {module.emergencyScenarios && (
              <StyledTabsTrigger value="simulations">
                <AlertTriangle size={20} />
                Simulations ({module.emergencyScenarios.length})
              </StyledTabsTrigger>
            )}
            {module.medications && (
              <StyledTabsTrigger value="medications">
                <Pill size={20} />
                Medications ({module.medications.length})
              </StyledTabsTrigger>
            )}
          </StyledTabsList>
          
          <TabsContent value="topics">
            <TopicGrid>
              {module.topics.map((topic, index) => {
                const isCompleted = completedTopics.includes(topic.id);
                
                return (
                  <TopicCard
                    key={topic.id}
                    completed={isCompleted}
                    onClick={() => handleTopicClick(topic.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <TopicHeader>
                      <div>
                        <TopicTitle>{topic.title}</TopicTitle>
                        <TopicDescription>{topic.description}</TopicDescription>
                      </div>
                      {isCompleted && <CheckCircle color="#06FFA5" />}
                    </TopicHeader>
                    
                    <KeyPoints>
                      {topic.keyPoints.slice(0, 3).map((point, i) => (
                        <KeyPoint key={i}>
                          <ChevronRight size={16} />
                          {point}
                        </KeyPoint>
                      ))}
                    </KeyPoints>
                  </TopicCard>
                );
              })}
            </TopicGrid>
          </TabsContent>
          
          <TabsContent value="cases">
            <TopicGrid>
              {module.caseStudies.map((caseStudy, index) => (
                <CaseStudyCard
                  key={caseStudy.id}
                  onClick={() => handleCaseStudyClick(caseStudy.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <TopicHeader>
                    <div style={{ flex: 1 }}>
                      <TopicTitle>{caseStudy.title}</TopicTitle>
                      <TopicDescription>{caseStudy.scenario}</TopicDescription>
                    </div>
                    <Brain size={24} />
                  </TopicHeader>
                  
                  <ActionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={20} />
                    Start Case Study
                  </ActionButton>
                </CaseStudyCard>
              ))}
            </TopicGrid>
          </TabsContent>
          
          {module.emergencyScenarios && (
            <TabsContent value="simulations">
              <TopicGrid>
                {module.emergencyScenarios.map((scenario, index) => (
                  <SimulationCard
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <TopicHeader>
                      <div style={{ flex: 1 }}>
                        <TopicTitle>{scenario.title}</TopicTitle>
                        <TopicDescription>{scenario.description}</TopicDescription>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Clock size={16} />
                          {Math.floor(scenario.timeLimit / 60)} min
                        </div>
                        <AlertTriangle size={24} color="#FF006E" />
                      </div>
                    </TopicHeader>
                    
                    <ActionButton
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play size={20} />
                      Start Simulation
                    </ActionButton>
                  </SimulationCard>
                ))}
              </TopicGrid>
            </TabsContent>
          )}
          
          {module.medications && (
            <TabsContent value="medications">
              <MedicationGrid>
                {module.medications.map((medication, index) => (
                  <MedicationCard
                    key={medication.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <MedicationName>
                      <Pill size={20} />
                      {medication.name}
                    </MedicationName>
                    
                    <MedicationInfo>
                      <MedicationLabel>Dosage</MedicationLabel>
                      <MedicationValue>{medication.dosage}</MedicationValue>
                    </MedicationInfo>
                    
                    <MedicationInfo>
                      <MedicationLabel>Contraindications</MedicationLabel>
                      <WarningList>
                        {medication.contraindications.map((contra, i) => (
                          <WarningItem key={i}>
                            <AlertTriangle size={14} />
                            {contra}
                          </WarningItem>
                        ))}
                      </WarningList>
                    </MedicationInfo>
                    
                    <MedicationInfo>
                      <MedicationLabel>Side Effects</MedicationLabel>
                      <MedicationValue>
                        {medication.sideEffects.join(', ')}
                      </MedicationValue>
                    </MedicationInfo>
                  </MedicationCard>
                ))}
              </MedicationGrid>
            </TabsContent>
          )}
        </TabsContainer>
      </Content>
      
      <AnimatePresence>
        {selectedScenario && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedScenario(null)}
          >
            <ModalContent
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setSelectedScenario(null)}>
                ×
              </CloseButton>
              
              <EmergencySimulation
                scenario={selectedScenario}
                onComplete={handleScenarioComplete}
              />
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
}