import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Calendar, ExternalLink, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  certificate: {
    name: string;
    organization: string;
    date: string;
    thumbnail?: string;
    url?: string;
  };
}

interface SkillCategory {
  name: string;
  skills: Skill[];
}

const SkillFlowDiagram: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  // Clean, logically-separated categories
  const skillCategories: SkillCategory[] = [
    {
      name: 'Languages',
      skills: [
        {
          id: 'c',
          name: 'C',
          icon: '🧮',
          category: 'languages',
          certificate: {
            name: 'Hands-on systems & DSA practice',
            organization: 'Self-directed learning & academic work',
            date: '2023–2025',
          },
        },
        {
          id: 'cpp',
          name: 'C++ (C++14)',
          icon: '⚡',
          category: 'languages',
          certificate: {
            name: 'Data structures & algorithms with C/C++',
            organization: 'Self-directed learning & online resources',
            date: '2023–2025',
          },
        },
        {
          id: 'java',
          name: 'Java',
          icon: '☕',
          category: 'languages',
          certificate: {
            name: 'Object-oriented programming in Java',
            organization: 'Self-directed learning & academic work',
            date: '2023–2025',
          },
        },
        {
          id: 'javascript',
          name: 'JavaScript (ES6)',
          icon: '🟨',
          category: 'languages',
          certificate: {
            name: 'Modern ES6+ JavaScript for the web',
            organization: 'Self-directed learning & project work',
            date: '2023–2025',
          },
        },
        {
          id: 'python',
          name: 'Python',
          icon: '🐍',
          category: 'languages',
          certificate: {
            name: 'Scripting, automation & ML prototyping',
            organization: 'Self-directed learning & academic work',
            date: '2022–2025',
          },
        },
        {
          id: 'sql',
          name: 'SQL',
          icon: '📊',
          category: 'languages',
          certificate: {
            name: 'Relational queries & data modelling',
            organization: 'Self-directed learning & project work',
            date: '2023–2025',
          },
        },
      ],
    },
    {
      name: 'Cloud & DevOps',
      skills: [
        {
          id: 'docker',
          name: 'Docker',
          icon: '🐳',
          category: 'cloud-devops',
          certificate: {
            name: 'Containerised dev & deployment workflows',
            organization: 'Self-directed learning & project work',
            date: '2024–2025',
          },
        },
        {
          id: 'git',
          name: 'Git',
          icon: '🔧',
          category: 'cloud-devops',
          certificate: {
            name: 'Version control & branching strategies',
            organization: 'Team & solo projects',
            date: '2022–2025',
          },
        },
        {
          id: 'github',
          name: 'GitHub',
          icon: '🐙',
          category: 'cloud-devops',
          certificate: {
            name: 'Collaboration, PRs & CI integration',
            organization: 'Open-source & personal projects',
            date: '2022–2025',
          },
        },
        {
          id: 'gcp',
          name: 'Google Cloud',
          icon: '☁️',
          category: 'cloud-devops',
          certificate: {
            name: 'Deploying & experimenting with cloud services',
            organization: 'Self-directed learning',
            date: '2024–2025',
          },
        },
        {
          id: 'azure',
          name: 'Microsoft Azure',
          icon: '🔵',
          category: 'cloud-devops',
          certificate: {
            name: 'Fundamentals of Azure services',
            organization: 'Self-directed learning',
            date: '2024–2025',
          },
        },
        {
          id: 'aws',
          name: 'AWS',
          icon: '🌩️',
          category: 'cloud-devops',
          certificate: {
            name: 'Core AWS services & deployment basics',
            organization: 'Self-directed learning',
            date: '2024–2025',
          },
        },
        {
          id: 'insomnia',
          name: 'Insomnia',
          icon: '🌙',
          category: 'cloud-devops',
          certificate: {
            name: 'API testing & workflow automation',
            organization: 'Backend & full-stack projects',
            date: '2023–2025',
          },
        },
      ],
    },
    {
      name: 'Frontend & UI',
      skills: [
        {
          id: 'react',
          name: 'React (18.x)',
          icon: '⚛️',
          category: 'frontend',
          certificate: {
            name: 'SPA development with React 18',
            organization: 'Full-stack project experience',
            date: '2023–2025',
          },
        },
        {
          id: 'redux',
          name: 'Redux',
          icon: '🌀',
          category: 'frontend',
          certificate: {
            name: 'State management in complex UIs',
            organization: 'React app experience',
            date: '2023–2025',
          },
        },
        {
          id: 'websocket-client',
          name: 'WebSocket (Client)',
          icon: '🔌',
          category: 'frontend',
          certificate: {
            name: 'Real-time UI updates in web apps',
            organization: 'Full-stack project work',
            date: '2024–2025',
          },
        },
        {
          id: 'figma',
          name: 'Figma',
          icon: '🎨',
          category: 'frontend',
          certificate: {
            name: 'UI flows, wireframes & design systems',
            organization: 'Portfolio & product design',
            date: '2023–2025',
          },
        },
      ],
    },
    {
      name: 'Backend & APIs',
      skills: [
        {
          id: 'node',
          name: 'Node.js (18.x)',
          icon: '🟢',
          category: 'backend',
          certificate: {
            name: 'Backend services with Node.js',
            organization: 'Full-stack project experience',
            date: '2023–2025',
          },
        },
        {
          id: 'django',
          name: 'Django (4.x)',
          icon: '🎯',
          category: 'backend',
          certificate: {
            name: 'REST APIs & auth with Django',
            organization: 'Full-stack project experience',
            date: '2023–2025',
          },
        },
        {
          id: 'php',
          name: 'PHP',
          icon: '💜',
          category: 'backend',
          certificate: {
            name: 'Server-side web development with PHP',
            organization: 'Backend & CRUD app builds',
            date: '2024–2025',
          },
        },
        {
          id: 'laravel',
          name: 'Laravel',
          icon: '🔥',
          category: 'backend',
          certificate: {
            name: 'Laravel-based REST APIs & MVC',
            organization: 'Full-stack project experience',
            date: '2024–2025',
          },
        },
        {
          id: 'redis',
          name: 'Redis',
          icon: '🧠',
          category: 'backend',
          certificate: {
            name: 'Caching & fast data access patterns',
            organization: 'Backend & system design practice',
            date: '2024–2025',
          },
        },
        {
          id: 'websocket-server',
          name: 'WebSocket (Server)',
          icon: '🔌',
          category: 'backend',
          certificate: {
            name: 'Real-time communication in web apps',
            organization: 'Full-stack project work',
            date: '2024–2025',
          },
        },
      ],
    },
    {
      name: 'Databases',
      skills: [
        {
          id: 'mysql',
          name: 'MySQL',
          icon: '🗄️',
          category: 'databases',
          certificate: {
            name: 'Relational schemas & complex joins',
            organization: 'Full-stack apps & coursework',
            date: '2022–2025',
          },
        },
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          icon: '🐘',
          category: 'databases',
          certificate: {
            name: 'Postgres-based app development',
            organization: 'Self-directed learning & projects',
            date: '2024–2025',
          },
        },
      ],
    },
    {
      name: 'Simulation & Engineering',
      skills: [
        {
          id: 'matlab',
          name: 'MATLAB (R2025)',
          icon: '📈',
          category: 'simulation',
          certificate: {
            name: 'Simulation & numerical computing',
            organization: 'Academic & research projects',
            date: '2023–2025',
          },
        },
      ],
    },
  ];

  const allSkills = skillCategories.flatMap((category) => category.skills);

  // Generate SVG path for flowing connection
  const generateFlowPath = () => {
    const totalSkills = allSkills.length;
    if (totalSkills === 0) return 'M 0 0';

    const pathWidth = 800;
    const pathHeight = 400;
    const amplitude = 80;

    let path = `M 50 ${pathHeight / 2}`;

    for (let i = 0; i <= totalSkills; i++) {
      const x = 50 + (i * (pathWidth - 100)) / totalSkills;
      const y =
        pathHeight / 2 +
        Math.sin((i / totalSkills) * Math.PI * 2) * amplitude;
      path += ` Q ${x - 30} ${y - 20} ${x} ${y}`;
    }

    return path;
  };

  return (
    <section
      className={`py-20 relative overflow-hidden ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-cyan-400/20' : 'bg-blue-400/20'
            }`}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2
            className={`
            text-4xl md:text-5xl font-bold mb-6
            ${
              isDark
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }
          `}
          >
            Skills & Certifications
          </h2>
          <div
            className={`w-20 h-1 mx-auto rounded ${
              isDark ? 'bg-cyan-400' : 'bg-blue-500'
            }`}
          />
          <p
            className={`mt-6 text-lg max-w-3xl mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Follow my learning journey through interactive skill badges. Click
            any skill to view how I&apos;ve used it and the certifications or
            projects behind it.
          </p>
        </motion.div>

        {/* Interactive Flow Diagram */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* SVG Flow Path */}
          {allSkills.length > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 900 500"
              style={{ zIndex: 1 }}
            >
              <defs>
                <linearGradient
                  id="flowGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={isDark ? '#00FFFF' : '#3B82F6'}
                  />
                  <stop
                    offset="50%"
                    stopColor={isDark ? '#8B5CF6' : '#6366F1'}
                  />
                  <stop
                    offset="100%"
                    stopColor={isDark ? '#EC4899' : '#8B5CF6'}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <motion.path
                d={generateFlowPath()}
                stroke="url(#flowGradient)"
                strokeWidth="3"
                strokeDasharray="10,5"
                fill="none"
                filter={isDark ? 'url(#glow)' : 'none'}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </svg>
          )}

          {/* Skill Categories and Badges */}
          <div className="relative z-10 grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.name}
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.6 + categoryIndex * 0.2,
                }}
              >
                {/* Category Label */}
                <div
                  className={`
                  text-center py-2 px-4 rounded-full text-sm font-semibold
                  ${
                    isDark
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
                  }
                  backdrop-blur-sm
                `}
                >
                  {category.name}
                </div>

                {/* Skills in Category */}
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.6,
                        delay:
                          0.8 + categoryIndex * 0.2 + skillIndex * 0.1,
                      }}
                    >
                      {/* Skill Badge */}
                      <motion.button
                        className={`
                          relative w-16 h-16 rounded-full flex items-center justify-center text-2xl
                          ${
                            isDark
                              ? 'bg-gray-900/80 border-2 border-cyan-500/30 hover:border-cyan-400'
                              : 'bg-white border-2 border-blue-200 hover:border-blue-400'
                          }
                          backdrop-blur-sm transition-all duration-300 cursor-pointer
                          hover:scale-110 active:scale-95
                        `}
                        onClick={() => setSelectedSkill(skill)}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        whileHover={{
                          boxShadow: isDark
                            ? '0 0 20px rgba(0, 255, 255, 0.4)'
                            : '0 0 20px rgba(59, 130, 246, 0.4)',
                        }}
                      >
                        <span className="select-none">{skill.icon}</span>

                        {/* Certificate Indicator */}
                        <div
                          className={`
                          absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
                          ${isDark ? 'bg-green-500' : 'bg-green-600'}
                          text-white text-xs
                        `}
                        >
                          <Award size={12} />
                        </div>
                      </motion.button>

                      {/* Skill Name */}
                      <span
                        className={`
                        mt-2 text-sm font-medium text-center
                        ${isDark ? 'text-gray-300' : 'text-gray-700'}
                      `}
                      >
                        {skill.name}
                      </span>

                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        {hoveredSkill?.id === skill.id && (
                          <motion.div
                            className={`
                              absolute z-20 mt-20 p-3 rounded-lg shadow-lg max-w-xs
                              ${
                                isDark
                                  ? 'bg-gray-900/95 border border-cyan-500/30 text-gray-200'
                                  : 'bg-white/95 border border-gray-200 text-gray-800'
                              }
                              backdrop-blur-sm
                            `}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="mb-1 text-sm font-semibold">
                              {skill.certificate.name}
                            </div>
                            <div
                              className={`text-xs ${
                                isDark
                                  ? 'text-cyan-400'
                                  : 'text-blue-600'
                              }`}
                            >
                              {skill.certificate.organization}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                isDark
                                  ? 'text-gray-400'
                                  : 'text-gray-600'
                              }`}
                            >
                              {skill.certificate.date}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certificate Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSelectedSkill(null)}
              />

              <motion.div
                className={`
                  relative max-w-md w-full p-6 rounded-2xl
                  ${
                    isDark
                      ? 'bg-gray-900/95 border border-cyan-500/30'
                      : 'bg-white/95 border border-gray-200'
                  }
                  backdrop-blur-sm shadow-2xl
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <button
                  onClick={() => setSelectedSkill(null)}
                  className={`
                    absolute top-4 right-4 p-2 rounded-full
                    ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
                    transition-colors duration-200
                  `}
                >
                  <X
                    size={20}
                    className={
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }
                  />
                </button>

                <div className="mb-6 text-center">
                  <div
                    className={`
                    w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl
                    ${
                      isDark
                        ? 'bg-gradient-to-br from-cyan-500 to-purple-500'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }
                    text-white
                  `}
                  >
                    {selectedSkill.icon}
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {selectedSkill.name}
                  </h3>
                </div>

                <div
                  className={`
                  p-4 rounded-lg mb-4
                  ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}
                `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award
                      className={`w-5 h-5 ${
                        isDark ? 'text-cyan-400' : 'text-blue-600'
                      }`}
                    />
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Certificate / Experience
                    </span>
                  </div>

                  <h4
                    className={`font-medium mb-2 ${
                      isDark ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    {selectedSkill.certificate.name}
                  </h4>

                  <div
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    } space-y-1`}
                  >
                    <div>{selectedSkill.certificate.organization}</div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {selectedSkill.certificate.date}
                    </div>
                  </div>
                </div>

                {selectedSkill.certificate.url && (
                  <motion.a
                    href={selectedSkill.certificate.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`
                      w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold
                      ${
                        isDark
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400'
                      }
                      text-white transition-all duration-300
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={18} />
                    View Certificate
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SkillFlowDiagram;