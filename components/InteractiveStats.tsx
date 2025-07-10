'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Bar, 
  Line, 
  Doughnut,
  Radar 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title as ChartTitle,  // Renamed to avoid conflict
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  ChartTitle,  // Using renamed import
  Tooltip,
  Legend,
  Filler
);

const Section = styled.section`
  padding: 6rem 0;
  background: linear-gradient(180deg, transparent 0%, rgba(131, 56, 236, 0.1) 50%, transparent 100%);
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 5vw, 4rem);
  text-align: center;
  margin-bottom: 4rem;
  
  .gradient {
    background: ${({ theme }) => theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  height: 300px;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${({ theme }) => theme.colors.gradient.primary};
    border-radius: 1.5rem;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.1;
  }
`;

const ChartTitleText = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const BigNumber = styled(motion.div)`
  text-align: center;
  margin: 4rem 0;
`;

const Number = styled(motion.span)`
  font-size: clamp(4rem, 8vw, 8rem);
  font-weight: 900;
  background: ${({ theme }) => theme.colors.gradient.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
`;

const NumberLabel = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.gray[300]};
  margin-top: 1rem;
`;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
      },
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)',
      },
    },
  },
};

export default function InteractiveStats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [animatedNumber, setAnimatedNumber] = useState(0);
  
  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const targetNumber = 98.5;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = easeOutQuart * targetNumber;
        
        setAnimatedNumber(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [inView]);
  
  const passRateData = {
    labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
    datasets: [
      {
        label: 'Pass Rate',
        data: [85, 88, 91, 94, 96, 98.5],
        borderColor: '#FF006E',
        backgroundColor: 'rgba(255, 0, 110, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const moduleCompletionData = {
    labels: ['Module 7', 'Module 8', 'Practice', 'Simulations', 'Case Studies'],
    datasets: [
      {
        label: 'Completion Rate',
        data: [92, 88, 85, 79, 95],
        backgroundColor: [
          'rgba(255, 0, 110, 0.8)',
          'rgba(131, 56, 236, 0.8)',
          'rgba(58, 134, 255, 0.8)',
          'rgba(6, 255, 165, 0.8)',
          'rgba(255, 183, 0, 0.8)',
        ],
      },
    ],
  };
  
  const timeSpentData = {
    labels: ['Videos', 'Quizzes', 'Simulations', 'Reading'],
    datasets: [
      {
        label: 'Average Time (minutes)',
        data: [45, 30, 60, 25],
        backgroundColor: 'rgba(131, 56, 236, 0.5)',
        borderColor: '#8338EC',
        borderWidth: 2,
      },
    ],
  };
  
  const skillsRadarData = {
    labels: ['Emergency Response', 'Medication Knowledge', 'Clinical Judgment', 'Patient Care', 'Communication'],
    datasets: [
      {
        label: 'Average Score',
        data: [85, 92, 88, 95, 90],
        backgroundColor: 'rgba(58, 134, 255, 0.2)',
        borderColor: '#3A86FF',
        borderWidth: 2,
        pointBackgroundColor: '#3A86FF',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3A86FF',
      },
    ],
  };
  
  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
          backdropColor: 'transparent',
        },
      },
    },
  };
  
  return (
    <Section ref={ref}>
      <Container>
        <SectionTitle
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Our <span className="gradient">Success Metrics</span>
        </SectionTitle>
        
        <BigNumber>
          <Number
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {animatedNumber.toFixed(1)}%
          </Number>
          <NumberLabel>NCLEX Pass Rate Among Our Students</NumberLabel>
        </BigNumber>
        
        <StatsGrid>
          <ChartCard
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ChartTitleText>Pass Rate Trend</ChartTitleText>
            <Line data={passRateData} options={chartOptions} />
          </ChartCard>
          
          <ChartCard
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ChartTitleText>Module Completion</ChartTitleText>
            <Doughnut data={moduleCompletionData} options={chartOptions} />
          </ChartCard>
          
          <ChartCard
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <ChartTitleText>Time Investment</ChartTitleText>
            <Bar data={timeSpentData} options={chartOptions} />
          </ChartCard>
          
          <ChartCard
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ gridColumn: 'span 3' }}
          >
            <ChartTitleText>Skills Assessment</ChartTitleText>
            <Radar data={skillsRadarData} options={radarOptions} />
          </ChartCard>
        </StatsGrid>
      </Container>
    </Section>
  );
}