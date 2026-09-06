import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Bot,
  Brain,
  Cpu,
  Download,
  GraduationCap,
  MapPin,
  Send,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CodePlayground from './CodePlayground';
import FloatingSymbols from './FloatingSymbols';

// ---------- Real numbers, pulled from the resume — nothing invented ----------

const QUICK_FACTS = [
  { icon: MapPin, label: 'Chandigarh, India' },
  { icon: GraduationCap, label: 'B.Tech EE, PEC' },
  { icon: Sparkles, label: 'AI/ML · Software Engineering' },
] as const;

// Icons orbiting the avatar — a small visual echo of the Skills network globe,
// so the two sections feel like they belong to the same site.
const ORBIT_ICONS = [
  { Icon: Cpu, angle: 0, color: '#3776AB' },
  { Icon: Brain, angle: 90, color: '#5AC8FA' },
  { Icon: Shield, angle: 180, color: '#2E7D5B' },
  { Icon: Bot, angle: 270, color: '#C792EA' },
] as const;

// ---------- Small building blocks ----------

function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.25,
      y: (e.clientY - rect.top - rect.height / 2) * 0.25,
    });
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.3 }}
    >
      {children}
    </motion.a>
  );
}

function OrbitAvatar({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative w-48 h-48 mx-auto mb-5">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {ORBIT_ICONS.map(({ Icon, angle, color }) => (
          <div
            key={angle}
            className="absolute w-8 h-8 -mt-4 -ml-4 left-1/2 top-1/2"
            style={{ transform: `rotate(${angle}deg) translateX(78px) rotate(-${angle}deg)` }}
          >
            <motion.div
              className="flex items-center justify-center w-8 h-8 border rounded-full shadow-md backdrop-blur-sm"
              style={{
                borderColor: color,
                background: isDark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.95)',
                boxShadow: `0 0 12px ${color}55`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </motion.div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className={`absolute inset-0 m-auto flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white ${
          isDark
            ? 'bg-gradient-to-br from-cyan-400 to-purple-400'
            : 'bg-gradient-to-br from-blue-400 to-purple-400'
        }`}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        DJ
      </motion.div>
    </div>
  );
}

// ---------- Component ----------

const About: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const sectionBg = isDark
    ? 'radial-gradient(ellipse 70% 55% at 15% 10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(ellipse 60% 55% at 90% 30%, rgba(168,85,247,0.08), transparent 60%), #0f172a'
    : 'radial-gradient(ellipse 70% 55% at 15% 10%, rgba(96,165,250,0.12), transparent 60%), radial-gradient(ellipse 60% 55% at 90% 30%, rgba(196,181,253,0.12), transparent 60%), #ffffff';

  const gridLineColor = isDark ? 'rgba(148,163,184,0.10)' : 'rgba(71,85,105,0.07)';

  const badgeClass = isDark
    ? 'border-cyan-500/30 bg-slate-900/70 text-cyan-300'
    : 'border-blue-300 bg-white text-blue-700';

  const chipClass = isDark
    ? 'border-slate-700 bg-slate-800/60 text-slate-300'
    : 'border-slate-200 bg-slate-50 text-slate-600';

  const primaryBtnClass = isDark
    ? 'bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950'
    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';

  const secondaryBtnClass = isDark
    ? 'border border-cyan-500/40 bg-slate-900/70 text-cyan-300'
    : 'border border-blue-200 bg-white text-blue-700';

  const cardClass = isDark
    ? 'bg-gradient-to-br from-gray-800/50 to-purple-900/50 border border-cyan-500/20'
    : 'bg-gradient-to-br from-blue-50/50 to-white border border-gray-200';

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: sectionBg }}>
      <FloatingSymbols />

      {/* Faint grid, masked toward the edges — matches the depth treatment used
          on the Skills globe so the two sections read as one design system. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridLineColor} 1px, transparent 1px), linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 75% 75% at 50% 30%, black, transparent)',
        }}
      />

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm ${badgeClass}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            The person behind the code
          </div>

          <h2
            className={`text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text
            ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
          >
            About Me
          </h2>

          <div className={`w-20 h-1 mx-auto rounded ${isDark ? 'bg-cyan-400' : 'bg-blue-500'}`} />
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Section – Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Software &amp; AI/ML Engineer
            </h3>

            <div className={`space-y-4 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>
                I'm pursuing a B.Tech in Electrical Engineering at Punjab Engineering College, but most
                of my hands-on work lives at the intersection of machine learning, LLM-powered systems,
                and backend engineering — turning research-grade ideas into software that actually ships.
              </p>

              <p>
                Recent work spans a biomechanical signal-processing pipeline for unsupervised anomaly
                detection, a multi-LLM content pipeline with adaptive prompting, and a fault-tolerant
                learning platform built to hold up under real concurrent load. Underneath it all sits the
                same backend toolkit — Python, Django, REST APIs, and SQL — built for clean architecture,
                not just working demos.
              </p>

              <p>
                Outside of core projects, I've contributed to open source (top 1% of 200+ participants in
                PEC's Winter of Code), helped run technical workshops as an Executive Body Member of the
                Robotics Club, and compete in data-structures-focused problem solving with the ACM Coding
                Club.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {QUICK_FACTS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${chipClass}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {/* Point this at wherever the résumé PDF is actually served from. */}
              <MagneticButton
                href="/resume.pdf"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-lg ${primaryBtnClass}`}
              >
                <Download className="w-4 h-4" />
                Download Resume
              </MagneticButton>

              <MagneticButton
                href="#contact"
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold backdrop-blur-sm ${secondaryBtnClass}`}
              >
                <Send className="w-4 h-4" />
                Let's Connect
              </MagneticButton>
            </div>
          </motion.div>

          {/* Right Section – Animation + Playground */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <CodePlayground />

            <div className={`relative p-6 rounded-2xl backdrop-blur-sm ${cardClass}`}>
              <OrbitAvatar isDark={isDark} />

              <div className="text-center">
                <div className={`text-sm font-mono ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  &gt; console.log("Hello World!");
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;