import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Experience as ExperienceType } from '../types';

const Experience: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const experiences: ExperienceType[] = [
    {
      id: 6,
      title: 'Artificial Intelligence Intern',
      company: 'Infosys Springboard',
      period: 'September 2025 - Present',
      description: 'Engaged in Artificial Intelligence-focused internship program with structured training and project-based learning.',
      type: 'work'
    },
    {
      id: 5,
      title: 'Software Development Engineer',
      company: 'Gokaddal Technologies (Remote)',
      period: 'June 2025 - August 2025',
      description: 'Built and optimized core modules of a global website portal, enhancing backend APIs and frontend scalability. Delivered full SDLC features (design to deployment) in collaboration with cross-functional teams, achieving 100% on-time delivery.',
      type: 'work'
    },
    {
      id: 4,
      title: 'Software Engineering Intern',
      company: 'WoRisGo (Remote)',
      period: 'May 2025 - June 2025',
      description: 'Built server-side logic and backend architecture. Reduced backend response time by 30%.',
      type: 'work'
    },
    {
      id: 3,
      title: 'B.Tech (Electrical Engineering)',
      company: 'Punjab Engineering College (PEC)',
      period: '2022 - Present',
      description: 'Currently pursuing Bachelor of Technology in Electrical Engineering. Active participant in tech competitions and open-source contributions.',
      type: 'education'
    },
    {
      id: 2,
      title: '12th Class (CBSE)',
      company: "St. Peter's Senior Secondary School",
      period: '2021 - 2022',
      description: 'Completed higher secondary education in CBSE board. Strong foundation in Mathematics and Physics.',
      type: 'education'
    },
    {
      id: 1,
      title: '10th Class (CBSE)',
      company: 'Ryan International School',
      period: '2019 - 2020',
      description: 'Completed secondary education in CBSE board. Strong academic foundation with focus on Science and Mathematics.',
      type: 'education'
    }
  ];

  return (
    <section id="experience" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6
            ${isDark 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }
          `}>
            Experience & Education
          </h2>
          <div className={`w-20 h-1 mx-auto rounded ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`} />
          <p className={`mt-6 text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            My journey through various roles and educational experiences that shaped my expertise.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className={`
            absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 transform md:-translate-x-1/2
            ${isDark ? 'bg-gradient-to-b from-cyan-400 to-purple-400' : 'bg-gradient-to-b from-blue-500 to-purple-500'}
          `} />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`
                  relative flex items-center
                  ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}
                `}
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`
                    absolute left-8 md:left-1/2 transform md:-translate-x-1/2 z-10
                    w-4 h-4 rounded-full
                    ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}
                    border-4 ${isDark ? 'border-gray-800' : 'border-gray-50'}
                  `}
                  whileHover={{ scale: 1.5 }}
                  animate={{ 
                    boxShadow: isDark 
                      ? ['0 0 0 0 rgba(0, 255, 255, 0.4)', '0 0 0 20px rgba(0, 255, 255, 0)']
                      : ['0 0 0 0 rgba(59, 130, 246, 0.4)', '0 0 0 20px rgba(59, 130, 246, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Content Card */}
                <motion.div
                  className={`
                    ml-16 md:ml-0 md:w-5/12 p-6 rounded-2xl
                    ${isDark 
                      ? 'bg-gray-900/50 border border-cyan-500/20' 
                      : 'bg-white border border-gray-200'
                    }
                    backdrop-blur-sm hover:scale-105 transition-all duration-300
                  `}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {exp.type === 'work' ? (
                      <Briefcase className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                    ) : (
                      <GraduationCap className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {exp.title}
                  </h3>
                  <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {exp.company}
                  </h4>
                  <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {exp.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;