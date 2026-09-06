import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Sparkles, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { easing } from 'maath';
import * as THREE from 'three';
import {
  Atom,
  Award,
  Binary,
  BarChart3,
  Boxes,
  Bot,
  Box,
  Brain,
  ChevronRight,
  CircuitBoard,
  Cloud,
  Code,
  Cpu,
  Database,
  FileCode,
  Flame,
  Gauge,
  GitBranch,
  HardDrive,
  Layers,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Network,
  PenTool,
  PieChart,
  Plug,
  RotateCcw,
  Server,
  Shield,
  Shuffle,
  Sigma,
  Slash,
  Table,
  Target,
  Terminal,
  TreePine,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// ---------- Types ----------

type Persona = 'sde' | 'aiml' | 'ds' | 'hardware';

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  categoryColor: string;
  level: number;
  experience: string;
  personas: Persona[];
  // A real, concrete accomplishment for this skill — not an invented
  // certificate. Keeping this honest matters more than keeping the modal
  // visually "complete" with fields that would otherwise have to be made up.
  highlight: {
    title: string;
    detail: string;
  };
  projects: string[];
  color: string;
  connections: string[];
}

interface PositionedSkill extends Skill {
  position: { x: number; y: number; z: number };
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

// ---------- Layout constants ----------

const SPHERE_RADIUS = 2.4;

// Default camera framing — also the target the "Reset View" animation eases back to.
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 8.5);
const DEFAULT_CONTROLS_TARGET = new THREE.Vector3(0, 0, 0);

const CATEGORY_COLORS: Record<string, string> = {
  Languages: '#FFD166',
  'Backend & APIs': '#7EE787',
  'ML & AI': '#5AC8FA',
  'Data & Analytics': '#8CA6FF',
  'Databases & DevOps': '#C792EA',
  'Hardware & EE': '#FDBA74',
};

const PERSONAS: { id: Persona; label: string }[] = [
  { id: 'sde', label: 'Software Engineering' },
  { id: 'aiml', label: 'AI / ML' },
  { id: 'ds', label: 'Data Science' },
  { id: 'hardware', label: 'Hardware & EE' },
];

// ---------- Pure helpers ----------

function spherePosition(index: number, total: number, radius = SPHERE_RADIUS) {
  if (total <= 1) return { x: 0, y: 0, z: radius };
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  return {
    x: radius * Math.cos(theta) * Math.sin(phi),
    y: radius * Math.sin(theta) * Math.sin(phi),
    z: radius * Math.cos(phi),
  };
}

function seededStrength(seed: number) {
  const x = Math.sin(seed) * 10000;
  return 0.5 + (x - Math.floor(x)) * 0.5;
}

// ---------- Skill data ----------
// `personas` tags which filtered view a node shows up in. Nodes that show up
// in more than one (python, sql, pandas, mysql) are genuinely shared across
// those resumes — they keep their identity (and animate smoothly) when you
// switch tabs instead of disappearing and reappearing as a "new" node.

const rawSkills = [
  // ---- Languages ----
  {
    id: 'python',
    name: 'Python',
    icon: <Cpu className="w-6 h-6" />,
    category: 'Languages',
    level: 92,
    experience: 'Primary language',
    color: '#3776AB',
    personas: ['sde', 'aiml', 'ds'] as Persona[],
    highlight: {
      title: 'Backbone of every ML & backend project',
      detail: 'Used across the gait-analysis pipeline, content optimizer, EduPortal, and segmentation dashboard.',
    },
    projects: ['Gait Analysis Pipeline (CSIR-CSIO)', 'AI Content Marketing Optimizer', 'Customer Segmentation & Retention Analysis'],
    connections: ['django', 'sql', 'ml', 'pandas', 'nlp', 'mysql'],
  },
  {
    id: 'sql',
    name: 'SQL',
    icon: <Database className="w-6 h-6" />,
    category: 'Languages',
    level: 82,
    experience: 'Data querying',
    color: '#8CA6FF',
    personas: ['sde', 'ds'] as Persona[],
    highlight: {
      title: 'Querying and shaping data for analysis',
      detail: 'Used alongside MySQL for structured data work across backend and analytics projects.',
    },
    projects: ['Customer Segmentation & Retention Analysis', 'Restaurant Website'],
    connections: ['python', 'mysql'],
  },
  {
    id: 'cpp',
    name: 'C++',
    icon: <Terminal className="w-6 h-6" />,
    category: 'Languages',
    level: 75,
    experience: 'Systems & DSA',
    color: '#00599C',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Data structures & algorithms foundation',
      detail: 'Core language for CS fundamentals and competitive programming with the ACM Coding Club.',
    },
    projects: ['ACM Coding Club', 'Competitive Programming'],
    connections: ['python'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: <Code className="w-6 h-6" />,
    category: 'Languages',
    level: 78,
    experience: 'Full-stack ES6',
    color: '#F7DF1E',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Frontend logic for full-stack features',
      detail: 'Used for dynamic menus and order flows in the Restaurant Website.',
    },
    projects: ['Restaurant Website'],
    connections: ['restapis', 'reactjs'],
  },
  {
    id: 'php',
    name: 'PHP',
    icon: <FileCode className="w-6 h-6" />,
    category: 'Languages',
    level: 70,
    experience: 'Server-side scripting',
    color: '#777BB4',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Backend logic for the booking platform',
      detail: 'Powered server-side logic for the Laravel-based Hotel Booking Management System.',
    },
    projects: ['Hotel Booking Management System'],
    connections: ['laravel'],
  },

  // ---- Backend & APIs (SDE) ----
  {
    id: 'django',
    name: 'Django',
    icon: <Shield className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 85,
    experience: 'Backend framework',
    color: '#2E7D5B',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'REST APIs, WebSockets, and role-based auth',
      detail: 'Built full-stack functionality for dynamic menus, ordering, and authentication in the Restaurant Website.',
    },
    projects: ['Restaurant Website', 'Gokaddal Technologies — Global Web Portal'],
    connections: ['python', 'mysql', 'restapis', 'redis', 'websockets', 'systemdesign'],
  },
  {
    id: 'restapis',
    name: 'REST APIs',
    icon: <Network className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 85,
    experience: 'API design',
    color: '#7EE787',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Optimized core backend APIs at scale',
      detail: 'Enhanced scalability and responsiveness of backend APIs for a global website portal at Gokaddal Technologies.',
    },
    projects: ['Gokaddal Technologies — Global Web Portal', 'EduPortal'],
    connections: ['django', 'redis', 'javascript', 'reactjs', 'systemdesign'],
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: <Server className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 72,
    experience: 'Caching layer',
    color: '#DC382D',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Caching for backend responsiveness',
      detail: 'Paired with Django and REST APIs to support fault-tolerant, low-latency backend workflows.',
    },
    projects: ['EduPortal'],
    connections: ['django', 'restapis'],
  },
  {
    id: 'reactjs',
    name: 'ReactJS',
    icon: <Atom className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 76,
    experience: 'Frontend library',
    color: '#61DAFB',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Frontend layer for full-stack apps',
      detail: 'Used with Django and MySQL to build dynamic menus and ordering flows in the Restaurant Website.',
    },
    projects: ['Restaurant Website'],
    connections: ['javascript', 'redux', 'restapis'],
  },
  {
    id: 'redux',
    name: 'Redux',
    icon: <Layers className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 68,
    experience: 'State management',
    color: '#764ABC',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Predictable UI state',
      detail: 'Paired with ReactJS for state management in full-stack project work.',
    },
    projects: ['Restaurant Website'],
    connections: ['reactjs'],
  },
  {
    id: 'laravel',
    name: 'Laravel',
    icon: <Flame className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 72,
    experience: 'PHP framework',
    color: '#FF2D20',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Booking platform built end-to-end',
      detail: 'Engineered a Laravel-based hotel booking platform with role-based access control and real-time status tracking.',
    },
    projects: ['Hotel Booking Management System'],
    connections: ['php', 'mysql'],
  },
  {
    id: 'websockets',
    name: 'WebSockets',
    icon: <Zap className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 70,
    experience: 'Real-time comms',
    color: '#F0B90B',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Real-time features in a Django backend',
      detail: 'Used for real-time functionality alongside Django in full-stack project work.',
    },
    projects: ['Restaurant Website'],
    connections: ['django'],
  },
  {
    id: 'systemdesign',
    name: 'System Design',
    icon: <GitBranch className="w-6 h-6" />,
    category: 'Backend & APIs',
    level: 74,
    experience: 'CS fundamentals',
    color: '#94A3B8',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Applied CS fundamentals in real systems',
      detail: 'DBMS, OS, and networks fundamentals applied while building scalable backend APIs at scale.',
    },
    projects: ['Gokaddal Technologies — Global Web Portal', 'EduPortal'],
    connections: ['restapis', 'django'],
  },

  // ---- ML & AI ----
  {
    id: 'ml',
    name: 'Machine Learning',
    icon: <Brain className="w-6 h-6" />,
    category: 'ML & AI',
    level: 90,
    experience: 'Core ML toolkit',
    color: '#5AC8FA',
    personas: ['aiml'] as Persona[],
    highlight: {
      title: '~99% model agreement on anomaly detection',
      detail: 'Built One-Class SVM & Isolation Forest models for unsupervised gait anomaly detection at CSIR-CSIO.',
    },
    projects: ['Gait Analysis Pipeline (CSIR-CSIO)', 'AI Content Marketing Optimizer'],
    connections: ['python', 'nlp', 'llms', 'pandas', 'opencv', 'anomalydetection'],
  },
  {
    id: 'nlp',
    name: 'NLP',
    icon: <MessageSquare className="w-6 h-6" />,
    category: 'ML & AI',
    level: 82,
    experience: 'Text & sentiment',
    color: '#8CA6FF',
    personas: ['aiml'] as Persona[],
    highlight: {
      title: 'Multi-layer sentiment analysis at scale',
      detail: 'Applied NLTK and spaCy for sentiment scoring in the AI Content Marketing Optimizer, lifting content relevance by 45%.',
    },
    projects: ['AI Content Marketing Optimizer'],
    connections: ['ml', 'llms', 'python'],
  },
  {
    id: 'llms',
    name: 'LLMs & Prompting',
    icon: <Bot className="w-6 h-6" />,
    category: 'ML & AI',
    level: 88,
    experience: 'LLM orchestration',
    color: '#C792EA',
    personas: ['aiml'] as Persona[],
    highlight: {
      title: 'Multi-LLM orchestration with adaptive prompting',
      detail: 'Architected an end-to-end LLM content pipeline and a semantic ranking system powering 1,000+ concurrent users on EduPortal.',
    },
    projects: ['AI Content Marketing Optimizer', 'EduPortal'],
    connections: ['ml', 'nlp'],
  },
  {
    id: 'opencv',
    name: 'OpenCV',
    icon: <Boxes className="w-6 h-6" />,
    category: 'ML & AI',
    level: 70,
    experience: 'Computer vision',
    color: '#5C3EE8',
    personas: ['aiml'] as Persona[],
    highlight: {
      title: 'Colorimetric quantification pipeline',
      detail: 'Built an OpenCV pipeline for ELISA plate colorimetric quantification at CSIR-CSIO.',
    },
    projects: ['CSIR-CSIO Research Internship'],
    connections: ['ml', 'python'],
  },
  {
    id: 'anomalydetection',
    name: 'Anomaly Detection',
    icon: <Target className="w-6 h-6" />,
    category: 'ML & AI',
    level: 88,
    experience: 'Unsupervised detection',
    color: '#FF6B6B',
    personas: ['aiml'] as Persona[],
    highlight: {
      title: '~99% model agreement across 11,000+ gait cycles',
      detail: 'Combined One-Class SVM and Isolation Forest for unsupervised anomaly detection on IMU-derived gait data.',
    },
    projects: ['Gait Analysis Pipeline (CSIR-CSIO)'],
    connections: ['ml', 'randomforest', 'svm'],
  },

  // ---- Data & Analytics ----
  {
    id: 'pandas',
    name: 'Pandas & NumPy',
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 88,
    experience: 'Data wrangling',
    color: '#8CA6FF',
    personas: ['aiml', 'ds'] as Persona[],
    highlight: {
      title: 'RFM features from 1M+ transactions',
      detail: 'Engineered Recency-Frequency-Monetary features and clustered 5,878 customers into 4 actionable segments.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['python', 'ml', 'streamlit', 'excel', 'eda'],
  },
  {
    id: 'excel',
    name: 'Excel',
    icon: <Table className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 75,
    experience: 'Spreadsheet analysis',
    color: '#217346',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Early-stage data analysis and reporting',
      detail: 'Used for exploratory analysis alongside Python and SQL in data-analytics work.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'eda'],
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 78,
    experience: 'Data visualization',
    color: '#11557C',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Visualizing model and segment behavior',
      detail: 'Used for charting distributions and cluster behavior across analytics work.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'eda'],
  },
  {
    id: 'plotly',
    name: 'Plotly',
    icon: <PieChart className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 76,
    experience: 'Interactive charts',
    color: '#3F4F75',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Interactive charts for dashboards',
      detail: 'Used alongside Streamlit for interactive KPI visualizations.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'matplotlib'],
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    icon: <LayoutDashboard className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 80,
    experience: 'Dashboarding',
    color: '#FF4B4B',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Interactive KPI & segment-lookup dashboard',
      detail: 'Built a runtime cluster-labeling system plus a dashboard for KPI reporting and on-demand segment prediction.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas'],
  },
  {
    id: 'kmeans',
    name: 'K-Means Clustering',
    icon: <Slash className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 84,
    experience: 'Unsupervised clustering',
    color: '#8CA6FF',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Segmented 5,878 customers into 4 groups',
      detail: 'Applied K-Means with the Elbow Method and Silhouette Score to find optimal clusters for RFM segmentation.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'eda'],
  },
  {
    id: 'randomforest',
    name: 'Random Forest',
    icon: <TreePine className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 80,
    experience: 'Ensemble modeling',
    color: '#4CAF50',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Automated ML retraining workflows',
      detail: 'Used Random Forest with GridSearch and SMOTE to automate A/B variant evaluation and retraining, cutting manual effort by 60%.',
    },
    projects: ['AI Content Marketing Optimizer'],
    connections: ['pandas', 'featureengineering', 'smote', 'anomalydetection'],
  },
  {
    id: 'svm',
    name: 'SVM',
    icon: <Sigma className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 82,
    experience: 'Classification & anomaly detection',
    color: '#F59E0B',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Core model for anomaly detection',
      detail: 'One-Class SVM applied for unsupervised gait anomaly detection with ~99% model agreement.',
    },
    projects: ['Gait Analysis Pipeline (CSIR-CSIO)'],
    connections: ['anomalydetection'],
  },
  {
    id: 'featureengineering',
    name: 'Feature Engineering',
    icon: <Wrench className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 82,
    experience: 'Feature design',
    color: '#8CA6FF',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'RFM features from 1M+ transactions',
      detail: 'Engineered Recency-Frequency-Monetary features to power customer segmentation clustering.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'smote'],
  },
  {
    id: 'smote',
    name: 'SMOTE',
    icon: <Shuffle className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 74,
    experience: 'Class balancing',
    color: '#C792EA',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Balancing data for retraining pipelines',
      detail: 'Applied SMOTE alongside Random Forest and GridSearch in automated ML retraining workflows.',
    },
    projects: ['AI Content Marketing Optimizer'],
    connections: ['randomforest', 'featureengineering'],
  },
  {
    id: 'eda',
    name: 'Statistical Analysis',
    icon: <LineChart className="w-6 h-6" />,
    category: 'Data & Analytics',
    level: 80,
    experience: 'Exploratory analysis',
    color: '#60A5FA',
    personas: ['ds'] as Persona[],
    highlight: {
      title: 'Turning raw transactions into insight',
      detail: 'Performed exploratory and statistical analysis to shape the RFM segmentation approach.',
    },
    projects: ['Customer Segmentation & Retention Analysis'],
    connections: ['pandas', 'matplotlib', 'kmeans', 'excel'],
  },

  // ---- Databases & DevOps ----
  {
    id: 'mysql',
    name: 'MySQL',
    icon: <HardDrive className="w-6 h-6" />,
    category: 'Databases & DevOps',
    level: 78,
    experience: 'Relational data',
    color: '#4479A1',
    personas: ['sde', 'ds'] as Persona[],
    highlight: {
      title: 'Relational backbone for backend projects',
      detail: 'Modeled data for the Restaurant Website and Gokaddal backend systems.',
    },
    projects: ['Restaurant Website', 'Gokaddal Technologies — Global Web Portal'],
    connections: ['sql', 'django', 'docker', 'laravel'],
  },
  {
    id: 'docker',
    name: 'Docker',
    icon: <Boxes className="w-6 h-6" />,
    category: 'Databases & DevOps',
    level: 75,
    experience: 'Containerization',
    color: '#2496ED',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Containerized backend workflows',
      detail: 'Used for consistent deployment across development and internship projects.',
    },
    projects: ['Gokaddal Technologies — Global Web Portal'],
    connections: ['mysql', 'azure'],
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    icon: <Cloud className="w-6 h-6" />,
    category: 'Databases & DevOps',
    level: 72,
    experience: 'Cloud deployment',
    color: '#0078D4',
    personas: ['sde'] as Persona[],
    highlight: {
      title: 'Cloud deployment for backend services',
      detail: 'Applied for hosting and deployment alongside Docker-based workflows.',
    },
    projects: ['Gokaddal Technologies — Global Web Portal'],
    connections: ['docker'],
  },

  // ---- Hardware & EE ----
  {
    id: 'matlab',
    name: 'MATLAB/Simulink',
    icon: <Binary className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 80,
    experience: 'System simulation',
    color: '#E16737',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'Grid-connected PV system simulation',
      detail: 'Modeled a three-phase grid-connected PV system with MPPT, PWM inverter control, and grid synchronization.',
    },
    projects: ['Three-Phase Grid-Connected PV System'],
    connections: ['powersystems', 'controlsystems'],
  },
  {
    id: 'powersystems',
    name: 'Power Systems',
    icon: <Plug className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 76,
    experience: 'Power & grid design',
    color: '#F59E0B',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'Grid synchronization & PV integration',
      detail: 'Applied power-systems fundamentals to simulate grid-connected solar generation.',
    },
    projects: ['Three-Phase Grid-Connected PV System'],
    connections: ['matlab', 'electricalmachines'],
  },
  {
    id: 'controlsystems',
    name: 'Control Systems',
    icon: <Gauge className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 74,
    experience: 'Feedback & stability',
    color: '#FDBA74',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'MPPT and stability control',
      detail: 'Applied control theory for MPPT tracking and for optimizing hovercraft lift, thrust, and stability.',
    },
    projects: ['Three-Phase Grid-Connected PV System', 'Hovercraft'],
    connections: ['matlab', 'electronics'],
  },
  {
    id: 'electricalmachines',
    name: 'Electrical Machines',
    icon: <CircuitBoard className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 70,
    experience: 'Core EE coursework',
    color: '#FB923C',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'Foundation for power-electronics design',
      detail: 'Core electrical-machines knowledge underpinning power-electronics project work.',
    },
    projects: ['Three-Phase Grid-Connected PV System'],
    connections: ['powersystems'],
  },
  {
    id: 'electronics',
    name: 'Analog & Digital Electronics',
    icon: <Zap className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 76,
    experience: 'Circuit design',
    color: '#FCD34D',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'Hardware builds from RC car to charger',
      detail: 'Applied analog and digital electronics in an ESP32-based RC car and a solar mobile charger with MPPT and boost conversion.',
    },
    projects: ['Remote Controlled Bluetooth Car', 'Solar Mobile Charger'],
    connections: ['controlsystems', 'autocad'],
  },
  {
    id: 'autocad',
    name: 'AutoCAD',
    icon: <PenTool className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 68,
    experience: 'Mechanical drafting',
    color: '#E5484D',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'Mechanical design for a hovercraft',
      detail: 'Designed the hovercraft structure ahead of 3D-printing its maneuvering fan components.',
    },
    projects: ['Hovercraft'],
    connections: ['electronics', 'fusion360'],
  },
  {
    id: 'fusion360',
    name: 'Fusion 360',
    icon: <Box className="w-6 h-6" />,
    category: 'Hardware & EE',
    level: 72,
    experience: '3D CAD modeling',
    color: '#F97316',
    personas: ['hardware'] as Persona[],
    highlight: {
      title: 'CAD for a hand-rehabilitation device',
      detail: 'Designed and refined mechanical components for a hand-rehabilitation device (Project Dheeraj), also used for hovercraft design.',
    },
    projects: ['Project Dheeraj (CSIR-CSIO)', 'Hovercraft'],
    connections: ['autocad'],
  },
] as const;

function createSkills(): Skill[] {
  return rawSkills.map((skill) => ({
    ...skill,
    categoryColor: CATEGORY_COLORS[skill.category] ?? skill.color,
    personas: [...skill.personas],
    projects: [...skill.projects],
    connections: [...skill.connections],
  }));
}

// ---------- Hooks ----------

function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || inView) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView] as const;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);
  return reduced;
}

// ---------- 3D scene pieces ----------

function RotatingCore({ isDark, reducedMotion }: { isDark: boolean; reducedMotion: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y += delta * 0.15;
    ref.current.rotation.x += delta * 0.05;
  });
  return (
    <group ref={ref}>
      {/* Faint frosted fill so the wireframe reads as an object, not just lines —
          matters most on a light background where thin strokes alone nearly vanish. */}
      {!isDark && (
        <mesh scale={0.97}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshBasicMaterial color="#c7d9ff" transparent opacity={0.1} toneMapped={false} />
        </mesh>
      )}
      <mesh>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color={isDark ? '#5AC8FA' : '#1d4ed8'}
          wireframe
          transparent
          opacity={isDark ? 0.18 : 0.32}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Atmosphere({ isDark, reducedMotion }: { isDark: boolean; reducedMotion: boolean }) {
  if (reducedMotion) return null;
  if (isDark) {
    return <Stars radius={16} depth={10} count={900} factor={1.4} fade speed={0.4} />;
  }
  // Light mode gets warm floating dust instead of a night sky — same sense of
  // depth and motion, tuned to sit on a bright background instead of a dark one.
  return (
    <>
      <Sparkles count={90} scale={9} size={4} speed={0.25} color="#60a5fa" opacity={0.55} />
      <Sparkles count={70} scale={9} size={3} speed={0.2} color="#c4b5fd" opacity={0.5} />
    </>
  );
}

function ConnectionLine({
  from,
  to,
  color,
  opacity,
  hovered,
  reducedMotion,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  opacity: number;
  hovered: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !ref.current?.material) return;
    ref.current.material.dashOffset -= delta * (hovered ? 0.8 : 0.2);
  });
  return (
    <Line
      ref={ref}
      points={[from, to]}
      color={color}
      lineWidth={hovered ? 2 : 1}
      dashed
      dashSize={0.06}
      dashScale={1}
      gapSize={0.05}
      transparent
      opacity={opacity}
      toneMapped={false}
    />
  );
}

function SkillNode({
  skill,
  isHero,
  hasInteracted,
  hoveredId,
  setHoveredId,
  onSelect,
  labelClass,
  hoverTooltipClass,
  nodeBg,
  nodeBorderIdle,
  reducedMotion,
}: {
  skill: PositionedSkill;
  isHero: boolean;
  hasInteracted: boolean;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onSelect: () => void;
  labelClass: string;
  hoverTooltipClass: string;
  nodeBg: string;
  nodeBorderIdle: string;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const hasPositionedRef = useRef(false);
  // Read fresh every render so the group's useFrame closure always damps
  // toward the *current* target — this is what makes a shared skill (e.g.
  // Python) glide to its new slot when the persona filter changes instead of
  // snapping, while keeping the same component identity (and this ref).
  const targetRef = useRef(new THREE.Vector3());
  targetRef.current.set(skill.position.x, skill.position.y, skill.position.z);

  const glowRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredId === skill.id;

  // Fade-in for nodes that are newly mounted when switching personas. Plain
  // CSS transition on the DOM label/icon — cheaper and simpler than animating
  // opacity through Html's per-frame projection, and the effect reads the
  // same either way.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!hasPositionedRef.current && groupRef.current) {
      groupRef.current.position.copy(targetRef.current);
      hasPositionedRef.current = true;
    }
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (reducedMotion) {
        groupRef.current.position.copy(targetRef.current);
      } else {
        easing.damp3(groupRef.current.position, targetRef.current, 0.32, delta);
      }
    }
    if (glowRef.current) {
      const t = state.clock.elapsedTime;
      const pulse = isHero && !hasInteracted ? 1 + Math.sin(t * 3) * 0.18 : isHovered ? 1.25 : 1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={glowRef}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshBasicMaterial color={skill.color} toneMapped={false} transparent opacity={isHovered ? 1 : 0.85} />
      </mesh>

      {/* `center` on Html already applies a -50%,-50% transform to anchor the
          DOM node on this group's 3D position. The button inside must NOT
          re-apply its own translate — doing both was compounding the offset
          and visibly pulling every icon away from where its connection lines
          actually terminate. Centering now happens exactly once. */}
      <Html center distanceFactor={7} zIndexRange={[60, 0]} style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          aria-label={`View details for ${skill.name}`}
          className={`relative flex flex-col items-center outline-none group focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
          onClick={onSelect}
          onMouseEnter={() => setHoveredId(skill.id)}
          onMouseLeave={() => setHoveredId(null)}
          onFocus={() => setHoveredId(skill.id)}
          onBlur={() => setHoveredId(null)}
        >
          <div
            className="relative flex items-center justify-center transition-transform duration-150 border rounded-full shadow-lg h-14 w-14 backdrop-blur-md group-hover:scale-110"
            style={{
              background: nodeBg,
              borderColor: isHovered ? skill.categoryColor : nodeBorderIdle,
              boxShadow: `0 0 ${isHovered ? 32 : 18}px ${skill.color}55`,
            }}
          >
            <span style={{ color: skill.color }}>{skill.icon}</span>
            <div
              className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1"
              style={{ backgroundColor: skill.categoryColor }}
            >
              <Award className="h-2.5 w-2.5 text-slate-950" />
            </div>
            {isHero && !hasInteracted && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ border: `2px solid ${skill.categoryColor}`, animationDuration: '1.6s' }}
              />
            )}
          </div>

          <span
            className={`mt-2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-medium backdrop-blur-sm ${labelClass}`}
          >
            {skill.name}
          </span>

          {isHovered && (
            <span
              className={`absolute -top-9 whitespace-nowrap rounded-md border px-3 py-1.5 text-[11px] shadow-lg backdrop-blur-md ${hoverTooltipClass}`}
            >
              Click for highlights & projects
            </span>
          )}
        </button>
      </Html>
    </group>
  );
}

// Eases the camera and orbit target back to their default framing whenever
// `resetSignal` changes, instead of OrbitControls' instant, jarring `reset()`.
// `maath`'s `easing.damp3` is a frame-rate-independent critically-damped
// interpolator — the same primitive used throughout the r3f/drei ecosystem
// for camera work, so motion stays smooth regardless of device frame rate.
function CameraResetRig({
  resetSignal,
  controlsRef,
  autoRotate,
  setAutoRotate,
  reducedMotion,
}: {
  resetSignal: number;
  controlsRef: React.MutableRefObject<any>;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const isResetting = useRef(false);
  const wasAutoRotating = useRef(autoRotate);
  const prevSignal = useRef(resetSignal);

  useEffect(() => {
    if (resetSignal === prevSignal.current) return;
    prevSignal.current = resetSignal;
    wasAutoRotating.current = autoRotate && !reducedMotion;
    isResetting.current = true;
    setAutoRotate(false);
  }, [resetSignal, autoRotate, reducedMotion, setAutoRotate]);

  useFrame((_, delta) => {
    if (!isResetting.current || !controlsRef.current) return;

    if (reducedMotion) {
      // Respect reduced-motion: jump straight there instead of animating.
      camera.position.copy(DEFAULT_CAMERA_POSITION);
      controlsRef.current.target.copy(DEFAULT_CONTROLS_TARGET);
      controlsRef.current.update();
      isResetting.current = false;
      return;
    }

    easing.damp3(camera.position, DEFAULT_CAMERA_POSITION, 0.28, delta);
    easing.damp3(controlsRef.current.target, DEFAULT_CONTROLS_TARGET, 0.28, delta);
    controlsRef.current.update();

    const settled =
      camera.position.distanceTo(DEFAULT_CAMERA_POSITION) < 0.005 &&
      controlsRef.current.target.distanceTo(DEFAULT_CONTROLS_TARGET) < 0.005;

    if (settled) {
      camera.position.copy(DEFAULT_CAMERA_POSITION);
      controlsRef.current.target.copy(DEFAULT_CONTROLS_TARGET);
      controlsRef.current.update();
      isResetting.current = false;
      if (wasAutoRotating.current) setAutoRotate(true);
    }
  });

  return null;
}

function Scene({
  skills,
  connections,
  isDark,
  reducedMotion,
  autoRotate,
  setAutoRotate,
  hasInteracted,
  setHasInteracted,
  hoveredId,
  setHoveredId,
  onSelectSkill,
  heroId,
  controlsRef,
  resetSignal,
  labelClass,
  hoverTooltipClass,
  nodeBg,
  nodeBorderIdle,
  lineBaseColor,
  lineHighlightColor,
  fogColor,
}: {
  skills: PositionedSkill[];
  connections: Connection[];
  isDark: boolean;
  reducedMotion: boolean;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (v: boolean) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onSelectSkill: (skill: PositionedSkill) => void;
  heroId: string;
  controlsRef: React.MutableRefObject<any>;
  resetSignal: number;
  labelClass: string;
  hoverTooltipClass: string;
  nodeBg: string;
  nodeBorderIdle: string;
  lineBaseColor: string;
  lineHighlightColor: string;
  fogColor: string;
}) {
  // NOTE: connection lines snap to the new layout immediately on a persona
  // switch while the nodes glide into place over ~0.3s (see SkillNode's
  // damp3). Animating the lines in lockstep would mean mutating shared
  // Vector3s that drei's <Line> doesn't re-read per frame — not worth the
  // extra plumbing for a dashed line that's already visually secondary to
  // the nodes it connects.
  const positions = useMemo(
    () => new Map(skills.map((s) => [s.id, new THREE.Vector3(s.position.x, s.position.y, s.position.z)])),
    [skills]
  );

  return (
    <>
      {/* No solid background color here — the canvas is transparent so the
          CSS aurora gradient behind it shows through. Fog still blends
          distant geometry toward this tone so depth reads correctly. */}
      <fog attach="fog" args={[fogColor, 6.5, 15]} />
      <ambientLight intensity={isDark ? 0.35 : 0.7} />
      <pointLight position={[4, 3, 6]} intensity={0.8} color={isDark ? '#5AC8FA' : '#60a5fa'} />
      <pointLight position={[-4, -3, -4]} intensity={0.5} color={isDark ? '#C792EA' : '#a78bfa'} />

      <Atmosphere isDark={isDark} reducedMotion={reducedMotion} />
      <RotatingCore isDark={isDark} reducedMotion={reducedMotion} />

      {connections.map((conn) => {
        const from = positions.get(conn.from);
        const to = positions.get(conn.to);
        if (!from || !to) return null;
        const isHighlighted = !!hoveredId && (conn.from === hoveredId || conn.to === hoveredId);
        const restOpacity = isDark ? 0.4 + conn.strength * 0.2 : 0.55 + conn.strength * 0.25;
        const dimmedOpacity = isDark ? 0.12 : 0.18;
        return (
          <ConnectionLine
            key={`${conn.from}-${conn.to}`}
            from={from}
            to={to}
            color={isHighlighted ? lineHighlightColor : lineBaseColor}
            opacity={isHighlighted ? 0.95 : hoveredId ? dimmedOpacity : restOpacity}
            hovered={isHighlighted}
            reducedMotion={reducedMotion}
          />
        );
      })}

      {skills.map((skill) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          isHero={skill.id === heroId}
          hasInteracted={hasInteracted}
          hoveredId={hoveredId}
          setHoveredId={setHoveredId}
          onSelect={() => {
            onSelectSkill(skill);
            setHasInteracted(true);
          }}
          labelClass={labelClass}
          hoverTooltipClass={hoverTooltipClass}
          nodeBg={nodeBg}
          nodeBorderIdle={nodeBorderIdle}
          reducedMotion={reducedMotion}
        />
      ))}

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
        autoRotate={autoRotate && !reducedMotion}
        autoRotateSpeed={0.7}
        minPolarAngle={Math.PI / 2 - 1.1}
        maxPolarAngle={Math.PI / 2 + 1.1}
        onStart={() => {
          setAutoRotate(false);
          setHasInteracted(true);
        }}
        onEnd={() => {
          window.setTimeout(() => setAutoRotate(!reducedMotion), 1200);
        }}
      />

      <CameraResetRig
        resetSignal={resetSignal}
        controlsRef={controlsRef}
        autoRotate={autoRotate}
        setAutoRotate={setAutoRotate}
        reducedMotion={reducedMotion}
      />

      {!reducedMotion && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={isDark ? 0.15 : 0.55}
            luminanceSmoothing={isDark ? 0.85 : 0.75}
            intensity={isDark ? 1.1 : 0.5}
            mipmapBlur
            radius={isDark ? 0.55 : 0.35}
          />
        </EffectComposer>
      )}
    </>
  );
}

// ---------- Component ----------

const FuturisticSkills: React.FC = () => {
  const { isDark } = useTheme();
  const reducedMotion = useReducedMotion();
  const [sectionRef, inView] = useInViewOnce<HTMLElement>(0.15);

  const allSkills = useMemo(createSkills, []);

  const [activePersona, setActivePersona] = useState<Persona>('sde');
  const [selectedSkill, setSelectedSkill] = useState<PositionedSkill | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(!reducedMotion);
  const [resetSignal, setResetSignal] = useState(0);
  const controlsRef = useRef<any>(null);

  // Recompute the sphere layout for just the skills visible in the active
  // persona — this is what keeps a 7-node view (Hardware) looking intentional
  // instead of sparse, rather than hiding nodes from a fixed 30-node layout.
  const positionedSkills = useMemo<PositionedSkill[]>(() => {
    const visible = allSkills.filter((s) => s.personas.includes(activePersona));
    return visible.map((skill, index) => ({
      ...skill,
      position: spherePosition(index, visible.length),
    }));
  }, [allSkills, activePersona]);

  const connections = useMemo<Connection[]>(() => {
    const visibleIds = new Set(positionedSkills.map((s) => s.id));
    const unique = new Map<string, Connection>();
    positionedSkills.forEach((skill, i) => {
      skill.connections.forEach((connId, j) => {
        if (!visibleIds.has(connId)) return;
        const key = [skill.id, connId].sort().join(':');
        if (!unique.has(key)) {
          unique.set(key, { from: skill.id, to: connId, strength: seededStrength(i * 97 + j * 31) });
        }
      });
    });
    return Array.from(unique.values());
  }, [positionedSkills]);

  // Soft-reset the camera on every persona switch — the layout underneath
  // has changed meaningfully, so re-centering keeps the new sphere legible
  // instead of leaving the user orbiting a stale framing.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setResetSignal((n) => n + 1);
    setSelectedSkill(null);
  }, [activePersona]);

  useEffect(() => {
    setAutoRotate(!reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (!selectedSkill) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedSkill(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedSkill]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    return positionedSkills
      .filter((s) => (seen.has(s.category) ? false : (seen.add(s.category), true)))
      .map((s) => ({ name: s.category, color: s.categoryColor }));
  }, [positionedSkills]);

  const heroId = useMemo(
    () =>
      positionedSkills.length
        ? positionedSkills.reduce((best, s) => (s.level > best.level ? s : best), positionedSkills[0]).id
        : '',
    [positionedSkills]
  );

  // ---------- Theme-derived tokens ----------

  const sectionBg = isDark
    ? 'radial-gradient(ellipse 80% 60% at 50% 0%, #16233d 0%, #0a1120 45%, #05070f 100%)'
    : 'radial-gradient(ellipse 80% 60% at 50% 0%, #eaf1ff 0%, #f4f7fd 45%, #ffffff 100%)';

  const gridLineColor = isDark ? 'rgba(148,163,184,0.15)' : 'rgba(71,85,105,0.10)';
  const glowClass = isDark ? 'bg-cyan-500/10' : 'bg-blue-400/15';
  const glowClass2 = isDark ? 'bg-purple-500/10' : 'bg-purple-400/15';
  const glowClass3 = isDark ? 'bg-blue-500/10' : 'bg-cyan-400/15';

  const headingText = isDark
    ? 'bg-gradient-to-r from-cyan-300 via-sky-300 to-purple-300'
    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600';
  const bodyTextClass = isDark ? 'text-slate-300' : 'text-slate-600';
  const badgeClass = isDark
    ? 'border-cyan-500/30 bg-slate-900/80 text-cyan-300'
    : 'border-blue-300 bg-white text-blue-700';
  const legendTextClass = isDark ? 'text-slate-400' : 'text-slate-500';

  const lineBaseColor = isDark ? '#5AC8FA' : '#2563eb';
  const lineHighlightColor = isDark ? '#a5e6ff' : '#1D4ED8';

  const nodeBorderIdle = isDark ? 'rgba(100,116,139,0.35)' : 'rgba(100,116,139,0.3)';
  const nodeBg = isDark
    ? 'linear-gradient(160deg, rgba(15,23,42,0.95), rgba(2,6,23,0.95))'
    : 'linear-gradient(160deg, rgba(255,255,255,0.97), rgba(241,245,249,0.97))';
  const labelClass = isDark
    ? 'border-slate-700 bg-slate-900/90 text-slate-100'
    : 'border-slate-200 bg-white/95 text-slate-800';
  const hoverTooltipClass = isDark
    ? 'border-cyan-500/40 bg-slate-900/95 text-cyan-300'
    : 'border-blue-200 bg-white/95 text-blue-700';

  const controlActiveClass = isDark ? 'bg-cyan-500 text-slate-950' : 'bg-blue-600 text-white';
  const controlIdleClass = isDark
    ? 'border border-cyan-500/40 bg-slate-900/80 text-cyan-300'
    : 'border border-blue-200 bg-white text-blue-700';
  const resetClass = isDark
    ? 'border-slate-700 bg-slate-900/80 text-slate-200'
    : 'border-slate-200 bg-white text-slate-700';

  const dialogBg = isDark ? 'linear-gradient(160deg, #10192e, #060a14)' : 'linear-gradient(160deg, #ffffff, #f1f5f9)';
  const dialogBorder = isDark ? 'border-slate-700' : 'border-slate-200';
  const dialogText = isDark ? 'text-slate-100' : 'text-slate-900';
  const dialogMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const dialogBarTrack = isDark ? 'bg-slate-800' : 'bg-slate-200';

  // The globe's own backdrop and depth-fog tint — this is what replaces the
  // flat pastel fill light mode had before.
  const globeBg = isDark
    ? 'radial-gradient(60% 60% at 50% 35%, rgba(56,189,248,0.16), transparent 70%), radial-gradient(55% 55% at 70% 70%, rgba(168,85,247,0.14), transparent 70%), #05070f'
    : 'radial-gradient(65% 65% at 50% 30%, rgba(96,165,250,0.4), transparent 70%), radial-gradient(55% 55% at 70% 75%, rgba(196,181,253,0.4), transparent 70%), linear-gradient(180deg, #f8fbff 0%, #eaf1ff 100%)';
  const fogColor = isDark ? '#05070f' : '#dce8ff';
  const globeSurfaceClass = isDark ? '' : 'ring-1 ring-blue-100/80 shadow-[0_25px_70px_-20px_rgba(37,99,235,0.35)]';

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: sectionBg }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute left-[8%] top-[10%] h-72 w-72 rounded-full blur-[100px] ${glowClass}`} />
        <div className={`absolute right-[10%] top-[35%] h-80 w-80 rounded-full blur-[110px] ${glowClass2}`} />
        <div className={`absolute bottom-[5%] left-[35%] h-64 w-64 rounded-full blur-[100px] ${glowClass3}`} />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 40%, black, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className={`h-8 w-8 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
            <Network className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>

          <h2 className={`mb-3 bg-clip-text text-4xl font-bold text-transparent md:text-6xl ${headingText}`}>
            Neural Skill Network
          </h2>

          <div className="w-24 h-1 mx-auto mb-5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />

          <p className={`mx-auto max-w-2xl text-base md:text-lg ${bodyTextClass}`}>
            A 3D view of how my core technologies connect. Switch lenses to see
            how the same network reshapes around each discipline.
          </p>

          <div className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs backdrop-blur-sm md:text-sm ${badgeClass}`}>
            🖱️ Drag to orbit · Click a node for details
          </div>

          {/* Persona filter — reuses the same active/idle button tokens as the
              rotate/reset controls below so it reads as native chrome, not a
              bolted-on widget. */}
          <div
            role="tablist"
            aria-label="Filter skill network by discipline"
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            {PERSONAS.map((persona) => {
              const isActive = persona.id === activePersona;
              return (
                <button
                  key={persona.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActivePersona(persona.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium backdrop-blur-sm transition-all md:text-sm ${
                    isActive ? controlActiveClass : controlIdleClass
                  }`}
                >
                  {persona.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center mt-5 gap-x-5 gap-y-2">
            {categories.map((cat) => (
              <div key={cat.name} className={`flex items-center gap-2 text-xs ${legendTextClass}`}>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                />
                {cat.name}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-[560px] w-full max-w-[720px] sm:h-[640px]"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <AnimatePresence>
            {!hasInteracted && inView && (
              <motion.div
                className={`pointer-events-none absolute -top-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm md:text-sm ${badgeClass}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.4 } }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✨ Drag to spin the network — click the pulsing node to start
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className={`absolute inset-0 overflow-hidden rounded-3xl transition-shadow ${globeSurfaceClass}`}
            style={{ background: globeBg }}
          >
            {inView && (
              <Canvas
                dpr={[1, 2]}
                camera={{ position: DEFAULT_CAMERA_POSITION.toArray(), fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                className="!touch-none"
              >
                <Scene
                  skills={positionedSkills}
                  connections={connections}
                  isDark={isDark}
                  reducedMotion={reducedMotion}
                  autoRotate={autoRotate}
                  setAutoRotate={setAutoRotate}
                  hasInteracted={hasInteracted}
                  setHasInteracted={setHasInteracted}
                  hoveredId={hoveredSkillId}
                  setHoveredId={setHoveredSkillId}
                  onSelectSkill={setSelectedSkill}
                  heroId={heroId}
                  controlsRef={controlsRef}
                  resetSignal={resetSignal}
                  labelClass={labelClass}
                  hoverTooltipClass={hoverTooltipClass}
                  nodeBg={nodeBg}
                  nodeBorderIdle={nodeBorderIdle}
                  lineBaseColor={lineBaseColor}
                  lineHighlightColor={lineHighlightColor}
                  fogColor={fogColor}
                />
              </Canvas>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all ${
              autoRotate ? controlActiveClass : controlIdleClass
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {autoRotate ? 'Pause Auto-Rotate' : 'Resume Auto-Rotate'}
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setResetSignal((n) => n + 1)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition-all ${resetClass}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset View
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/70 p-5 backdrop-blur-md"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={() => setSelectedSkill(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skill-dialog-title"
              className={`relative w-full max-w-lg rounded-2xl border p-7 shadow-2xl ${dialogBorder} ${dialogText}`}
              style={{ background: dialogBg }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close skill details"
                className={`absolute right-4 top-4 transition ${isDark ? 'text-slate-400 hover:text-cyan-300' : 'text-slate-400 hover:text-blue-600'}`}
                onClick={() => setSelectedSkill(null)}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full border ${dialogBorder}`}
                  style={{ color: selectedSkill.color, boxShadow: `0 0 20px ${selectedSkill.color}40` }}
                >
                  {selectedSkill.icon}
                </span>
                <div>
                  <p
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wide"
                    style={{ color: selectedSkill.categoryColor }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedSkill.categoryColor }}
                    />
                    {selectedSkill.category} · {selectedSkill.experience}
                  </p>
                  <h3 id="skill-dialog-title" className="text-2xl font-bold">
                    {selectedSkill.name}
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <div className={`mb-2 flex justify-between text-xs uppercase tracking-wide ${dialogMuted}`}>
                  <span>Working confidence</span>
                  <span>{selectedSkill.level}%</span>
                </div>
                <div className={`h-1.5 rounded-full ${dialogBarTrack}`}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedSkill.level}%`,
                      background: `linear-gradient(90deg, ${selectedSkill.color}, ${selectedSkill.categoryColor})`,
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <p className={`mb-3 flex items-center gap-1.5 text-xs uppercase tracking-wide ${dialogMuted}`}>
                    <Award className="h-3.5 w-3.5" /> Highlight
                  </p>
                  <p className="text-sm font-medium leading-6">{selectedSkill.highlight.title}</p>
                  <p className={`mt-1 text-xs leading-5 ${dialogMuted}`}>{selectedSkill.highlight.detail}</p>
                </div>
                <div>
                  <p className={`mb-3 text-xs uppercase tracking-wide ${dialogMuted}`}>Used in</p>
                  <ul className="space-y-2 text-sm">
                    {selectedSkill.projects.map((project) => (
                      <li key={project} className="flex items-start gap-2">
                        <ChevronRight className={`mt-1 h-3.5 w-3.5 shrink-0 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                        {project}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FuturisticSkills;