import React, { useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Experience as ExperienceType } from '../types';

type Filter = 'all' | 'work' | 'education';

type TimelineItem = ExperienceType & {
  duration: string;
  current?: boolean;
};

const Experience: React.FC = () => {
  const { isDark } = useTheme();
  const [headerRef, headerInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [filter, setFilter] = useState<Filter>('all');
  const trackRef = useRef<HTMLDivElement>(null);

  // Scroll-linked progress: the rail fills in as you move through the timeline,
  // echoing the idea of a career actually progressing rather than just decorating.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.8', 'end 0.35'],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const experiences: TimelineItem[] = useMemo(
    () => [
      {
        id: 7,
        title: 'AI/ML Research Intern',
        company: 'CSIR-CSIO, Chandigarh',
        period: 'January 2026 - May 2026',
        description:
          'Built an automated gait-analysis pipeline on 17-sensor IMU data — signal filtering, biomechanical feature engineering, and unsupervised anomaly detection (One-Class SVM, Isolation Forest) across 11,000+ walking cycles, reaching ~99% model agreement for subject-level fatigue tracking.',
        type: 'work',
        duration: '5 mo',
        current: true,
      },
      {
        id: 6,
        title: 'Artificial Intelligence Intern',
        company: 'Infosys Springboard',
        period: 'September 2025 - December 2025',
        description:
          'Architected an end-to-end AI content pipeline combining LLM generation, adaptive prompting, and trend scoring — lifting content relevance by 45% — and automated A/B evaluation and retraining workflows, cutting manual review effort by 60%.',
        type: 'work',
        duration: '4 mo',
      },
      {
        id: 5,
        title: 'Software Development Engineer',
        company: 'Gokaddal Technologies (Remote)',
        period: 'June 2025 - August 2025',
        description:
          'Built and optimized core modules of a global website portal, enhancing backend APIs and frontend scalability. Delivered full SDLC features (design to deployment) in collaboration with cross-functional teams, achieving 100% on-time delivery.',
        type: 'work',
        duration: '3 mo',
      },
      {
        id: 4,
        title: 'Software Engineering Intern',
        company: 'WoRisGo (Remote)',
        period: 'May 2025 - June 2025',
        description: 'Built server-side logic and backend architecture. Reduced backend response time by 30%.',
        type: 'work',
        duration: '2 mo',
      },
      {
        id: 3,
        title: 'B.Tech (Electrical Engineering)',
        company: 'Punjab Engineering College (PEC)',
        period: '2023 - Present',
        description:
          'Pursuing a Bachelor of Technology in Electrical Engineering, alongside self-directed work in AI/ML and software engineering. Active in tech competitions and open-source contributions (Top 1%, PEC Winter of Code).',
        type: 'education',
        duration: 'Ongoing',
      },
      {
        id: 2,
        title: '12th Class (CBSE)',
        company: "St. Peter's Senior Secondary School",
        period: '2022 - 2023',
        description: 'Completed higher secondary education in CBSE board. Strong foundation in Mathematics and Physics.',
        type: 'education',
        duration: '1 yr',
      },
      {
        id: 1,
        title: '10th Class (CBSE)',
        company: 'Ryan International School',
        period: '2020 - 2021',
        description: 'Completed secondary education in CBSE board. Strong academic foundation with focus on Science and Mathematics.',
        type: 'education',
        duration: '1 yr',
      },
    ],
    []
  );

  const visible = experiences.filter((exp) => filter === 'all' || exp.type === filter);

  const accent = isDark ? 'text-cyan-400' : 'text-blue-600';
  const accentBg = isDark ? 'bg-cyan-400' : 'bg-blue-500';
  const eduAccent = isDark ? 'text-purple-400' : 'text-purple-500';

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'work', label: 'Experience' },
    { key: 'education', label: 'Education' },
  ];

  return (
    <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2
            className={`
            text-4xl md:text-5xl font-bold mb-6
            ${isDark
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
            }
          `}
          >
            Experience & Education
          </h2>
          <div className={`w-20 h-1 mx-auto rounded ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`} />
          <p className={`mt-6 text-lg max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Four internships across AI, ML, and full-stack engineering, alongside a B.Tech in Electrical Engineering.
          </p>

          {/* Filter tabs */}
          <div
            className={`
              inline-flex items-center gap-1 mt-8 p-1 rounded-full
              ${isDark ? 'bg-gray-900/60 border border-gray-700' : 'bg-white border border-gray-200'}
            `}
          >
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`
                  relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors
                  ${filter === key
                    ? isDark ? 'text-gray-900' : 'text-white'
                    : isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                {filter === key && (
                  <motion.span
                    layoutId="experience-filter-pill"
                    className={`absolute inset-0 rounded-full ${accentBg}`}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="relative" ref={trackRef}>
          {/* Base rail */}
          <div
            className={`absolute left-4 md:left-6 top-2 bottom-2 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
          />
          {/* Progress rail — fills as the section scrolls into view */}
          <motion.div
            style={{ height: railHeight }}
            className={`
              absolute left-4 md:left-6 top-2 w-px origin-top
              ${isDark ? 'bg-gradient-to-b from-cyan-400 to-purple-400' : 'bg-gradient-to-b from-blue-500 to-purple-500'}
            `}
          />

          <div className="space-y-8">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((exp, index) => (
                <TimelineCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  isDark={isDark}
                  accent={accent}
                  eduAccent={eduAccent}
                  accentBg={accentBg}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const TimelineCard: React.FC<{
  exp: TimelineItem;
  index: number;
  isDark: boolean;
  accent: string;
  eduAccent: string;
  accentBg: string;
}> = ({ exp, index, isDark, accent, eduAccent, accentBg }) => {
  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });
  const isWork = exp.type === 'work';

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }}
      className="relative pl-14 md:pl-16"
    >
      {/* Node */}
      <div className="absolute left-4 md:left-6 top-1.5 flex items-center justify-center -translate-x-1/2">
        <span
          className={`
            relative flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full border-2 z-10
            ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}
          `}
        >
          {isWork ? (
            <Briefcase className={`w-3.5 h-3.5 md:w-4 md:h-4 ${accent}`} />
          ) : (
            <GraduationCap className={`w-3.5 h-3.5 md:w-4 md:h-4 ${eduAccent}`} />
          )}
        </span>
        {exp.current && (
          <motion.span
            className={`absolute inset-0 rounded-full ${accentBg}`}
            style={{ opacity: 0.35 }}
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -3 }}
        className={`
          p-6 rounded-2xl backdrop-blur-sm transition-colors duration-300
          ${isDark ? 'bg-gray-900/50 border border-cyan-500/20 hover:border-cyan-500/40' : 'bg-white border border-gray-200 hover:border-blue-300'}
        `}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{exp.period}</span>
          </div>
          <div className="flex items-center gap-2">
            {exp.current && (
              <span
                className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isDark ? 'bg-cyan-400/10 text-cyan-300' : 'bg-blue-100 text-blue-700'}
                `}
              >
                <Sparkles className="w-3 h-3" /> Most recent
              </span>
            )}
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-medium
                ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
              `}
            >
              {exp.duration}
            </span>
          </div>
        </div>

        <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{exp.title}</h3>
        <h4 className={`text-lg font-semibold mb-3 ${isWork ? accent : eduAccent}`}>{exp.company}</h4>
        <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{exp.description}</p>
      </motion.div>
    </motion.div>
  );
};

export default Experience;