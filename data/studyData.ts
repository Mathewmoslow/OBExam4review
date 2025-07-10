export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  keyPoints: string[];
  practiceQuestions: number;
  estimatedTime: number; // in minutes
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: Topic[];
  totalXP: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const modules: Module[] = [
  {
    id: 'module-7',
    title: 'Module 7: Childbearing Family at Risk During Labor and Delivery',
    description: 'Master the management of high-risk labor situations including PROM, dystocia, and emergency interventions.',
    icon: '🤰',
    color: '#FF006E',
    totalXP: 500,
    difficulty: 'intermediate',
    topics: [
      {
        id: 'prom',
        title: 'Premature Rupture of Membranes (PROM)',
        description: 'Understanding PROM, PPROM, and their management strategies',
        content: 'Comprehensive content about PROM types, risk factors, and interventions...',
        keyPoints: [
          'Definition: ROM before onset of labor',
          'PPROM: Preterm PROM (before 37 weeks)',
          'Risk factors: infection, trauma, smoking',
          'Diagnosis: Nitrazine test, ferning pattern',
          'Management: antibiotics, corticosteroids, monitoring',
        ],
        practiceQuestions: 15,
        estimatedTime: 30,
      },
      {
        id: 'dystocia',
        title: 'Dystocia and Labor Complications',
        description: 'Identify and manage abnormal labor patterns and complications',
        content: 'Detailed content about dystocia types and management...',
        keyPoints: [
          'Powers: Ineffective contractions',
          'Passenger: Fetal malposition, macrosomia',
          'Passage: Pelvic abnormalities',
          'Psyche: Maternal anxiety affecting labor',
          'Interventions: Position changes, augmentation',
        ],
        practiceQuestions: 20,
        estimatedTime: 45,
      },
      {
        id: 'emergency-birth',
        title: 'Emergency Birth Situations',
        description: 'Prepare for precipitous delivery and emergency scenarios',
        content: 'Emergency birth protocols and rapid response procedures...',
        keyPoints: [
          'Precipitous labor: < 3 hours',
          'Shoulder dystocia management',
          'Umbilical cord prolapse',
          'Placental emergencies',
          'Neonatal resuscitation basics',
        ],
        practiceQuestions: 25,
        estimatedTime: 60,
      },
    ],
  },
  {
    id: 'module-8',
    title: 'Module 8: Postpartum Complications',
    description: 'Recognize and respond to postpartum hemorrhage, infections, and psychological complications.',
    icon: '👶',
    color: '#8338EC',
    totalXP: 600,
    difficulty: 'advanced',
    topics: [
      {
        id: 'postpartum-hemorrhage',
        title: 'Postpartum Hemorrhage (PPH)',
        description: 'Master the 4 Ts and rapid response to hemorrhage',
        content: 'Comprehensive PPH management and prevention strategies...',
        keyPoints: [
          'Definition: >500mL vaginal, >1000mL cesarean',
          'Tone: Uterine atony (70% of cases)',
          'Trauma: Lacerations, hematomas',
          'Tissue: Retained placenta',
          'Thrombin: Coagulation disorders',
          'Management: Fundal massage, uterotonics, blood products',
        ],
        practiceQuestions: 30,
        estimatedTime: 45,
      },
      {
        id: 'postpartum-infections',
        title: 'Postpartum Infections',
        description: 'Identify and treat endometritis, wound infections, and mastitis',
        content: 'Infection prevention and treatment protocols...',
        keyPoints: [
          'Endometritis: Fever, uterine tenderness',
          'Wound infections: REEDA assessment',
          'Mastitis vs engorgement',
          'UTI and pyelonephritis',
          'Antibiotic therapy guidelines',
          'Prevention strategies',
        ],
        practiceQuestions: 20,
        estimatedTime: 35,
      },
      {
        id: 'postpartum-mood',
        title: 'Postpartum Mood Disorders',
        description: 'Differentiate blues, depression, and psychosis',
        content: 'Mental health assessment and intervention strategies...',
        keyPoints: [
          'Baby blues: 80%, days 3-5, self-limiting',
          'PPD: 10-15%, anytime first year',
          'Postpartum psychosis: 0.1-0.2%, emergency',
          'Risk factors and screening tools',
          'Edinburgh Postnatal Depression Scale',
          'Treatment and support resources',
        ],
        practiceQuestions: 18,
        estimatedTime: 40,
      },
    ],
  },
];

export const achievements = [
  {
    id: 'first-module',
    title: 'First Steps',
    description: 'Complete your first module',
    icon: '🎯',
    xp: 100,
  },
  {
    id: 'perfect-quiz',
    title: 'Perfect Score',
    description: 'Score 100% on any quiz',
    icon: '💯',
    xp: 200,
  },
  {
    id: 'week-streak',
    title: 'Dedicated Learner',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    xp: 300,
  },
  {
    id: 'all-modules',
    title: 'Master of Obstetrics',
    description: 'Complete all modules',
    icon: '👑',
    xp: 1000,
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    xp: 150,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Study after midnight',
    icon: '🦉',
    xp: 100,
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  rationale: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the typical time frame for precipitous labor?',
    options: ['Less than 3 hours', '3-6 hours', '6-12 hours', 'More than 12 hours'],
    correctAnswer: 0,
    rationale: 'Precipitous labor is usually completed in under 3 hours.'
  },
  {
    id: 'q2',
    question: 'Which medication is commonly given for PROM to enhance fetal lung maturity?',
    options: ['Magnesium sulfate', 'Betamethasone', 'Oxytocin', 'Indomethacin'],
    correctAnswer: 1,
    rationale: 'Betamethasone is a corticosteroid that promotes lung maturity.'
  },
  {
    id: 'q3',
    question: 'A postpartum patient reports feelings of hopelessness and inability to care for her newborn. Which condition is most likely?',
    options: ['Baby blues', 'Postpartum depression', 'Euphoria', 'Postpartum psychosis'],
    correctAnswer: 1,
    rationale: 'Persistent hopelessness is characteristic of postpartum depression.'
  }
];

export interface EmergencyScenario {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  initialVitals?: Record<string, number>;
  decisions?: any[];
}

export const emergencyScenarios: EmergencyScenario[] = [
  {
    id: 'e1',
    title: 'Shoulder Dystocia',
    description: 'Manage an impacted shoulder during delivery',
    timeLimit: 180,
    initialVitals: { hr: 120, bp: 90 },
    decisions: []
  }
];
