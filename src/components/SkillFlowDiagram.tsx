import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Award,
  Calendar,
  ExternalLink,
  X,
  Zap,
  Shield,
  Cpu,
  Database,
  Globe,
  Code,
  Layers,
  Cloud,
  Brain,
  Network,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  level: number; // 0–100
  experience: string;
  certificate: {
    name: string;
    organization: string;
    date: string;
    url?: string;
    credentialId?: string;
  };
  projects: string[];
  color: string;
  position: { x: number; y: number; z: number };
  connections: string[];
}

interface Connection {
  from: string;
  to: string;
  strength: number;
}

const FuturisticSkills: React.FC = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [autoRotate, setAutoRotate] = useState(true);
  const animationRef = useRef<number>();

  // ---------- 3D positioning ----------

  const generateSpherePosition = (
    index: number,
    total: number,
    radius = 190
  ) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    return {
      x: radius * Math.cos(theta) * Math.sin(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(phi),
    };
  };

  // ---------- Skills (static) ----------

  const skills: Skill[] = useMemo(() => {
    const skillsData = [
      {
        id: 'react',
        name: 'React',
        icon: <Code className="w-6 h-6" />,
        category: 'Frontend',
        level: 90,
        experience: '2+ years',
        certificate: {
          name: 'Meta Front-End Developer Certificate',
          organization: 'Meta via Coursera',
          date: 'December 2024',
          credentialId: 'META-FE-2024-DJ',
          url: '#',
        },
        projects: ['Portfolio Website', 'Restaurant App Frontend', 'E-commerce Dashboard'],
        color: '#61DAFB',
        connections: ['javascript', 'html', 'css'],
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        icon: <Zap className="w-6 h-6" />,
        category: 'Languages',
        level: 92,
        experience: '3+ years',
        certificate: {
          name: 'JavaScript Algorithms and Data Structures',
          organization: 'FreeCodeCamp',
          date: 'September 2024',
          credentialId: 'FCC-JS-2024',
          url: '#',
        },
        projects: ['Interactive Web Apps', 'Node.js APIs', 'Frontend Frameworks'],
        color: '#F7DF1E',
        connections: ['react', 'html', 'css', 'python'],
      },
      {
        id: 'python',
        name: 'Python',
        icon: <Cpu className="w-6 h-6" />,
        category: 'Languages',
        level: 88,
        experience: '3+ years',
        certificate: {
          name: 'Python for Everybody Specialization',
          organization: 'University of Michigan',
          date: 'July 2024',
          credentialId: 'UMICH-PY-2024',
          url: '#',
        },
        projects: ['Data Analysis Scripts', 'Backend APIs', 'Automation Tools'],
        color: '#3776AB',
        connections: ['django', 'mysql', 'gcp'],
      },
      {
        id: 'django',
        name: 'Django',
        icon: <Shield className="w-6 h-6" />,
        category: 'Backend',
        level: 85,
        experience: '2+ years',
        certificate: {
          name: 'Django for Everybody Specialization',
          organization: 'University of Michigan',
          date: 'August 2024',
          credentialId: 'UMICH-DJ-2024',
          url: '#',
        },
        projects: ['Restaurant Management System', 'Blog Platform', 'API Development'],
        color: '#092E20',
        connections: ['python', 'mysql', 'html'],
      },
      {
        id: 'mysql',
        name: 'MySQL',
        icon: <Database className="w-6 h-6" />,
        category: 'Database',
        level: 80,
        experience: '2+ years',
        certificate: {
          name: 'MySQL Database Administration',
          organization: 'Oracle University',
          date: 'March 2024',
          credentialId: 'ORACLE-SQL-2024',
          url: '#',
        },
        projects: ['E-commerce Database', 'User Management System', 'Analytics Dashboard'],
        color: '#4479A1',
        connections: ['django', 'python', 'php'],
      },
      {
        id: 'html',
        name: 'HTML5',
        icon: <Globe className="w-6 h-6" />,
        category: 'Frontend',
        level: 95,
        experience: '4+ years',
        certificate: {
          name: 'Web Development Fundamentals',
          organization: 'FreeCodeCamp',
          date: 'November 2024',
          credentialId: 'FCC-HTML-2024',
          url: '#',
        },
        projects: ['Semantic Web Structure', 'Accessibility Implementation', 'SEO Optimization'],
        color: '#E34F26',
        connections: ['css', 'javascript', 'react'],
      },
      {
        id: 'css',
        name: 'CSS3',
        icon: <Layers className="w-6 h-6" />,
        category: 'Frontend',
        level: 90,
        experience: '3+ years',
        certificate: {
          name: 'Advanced CSS and Sass',
          organization: 'Udemy',
          date: 'October 2024',
          credentialId: 'UDEMY-CSS-2024',
          url: '#',
        },
        projects: ['Responsive Design', 'Animation Systems', 'Component Libraries'],
        color: '#1572B6',
        connections: ['html', 'javascript', 'react'],
      },
      {
        id: 'gcp',
        name: 'Google Cloud',
        icon: <Cloud className="w-6 h-6" />,
        category: 'Cloud',
        level: 75,
        experience: '1+ years',
        certificate: {
          name: 'Google Cloud Platform Fundamentals',
          organization: 'Google Cloud',
          date: 'January 2024',
          credentialId: 'GCP-FUND-2024',
          url: '#',
        },
        projects: ['Cloud Deployment', 'Serverless Functions', 'Database Hosting'],
        color: '#4285F4',
        connections: ['python', 'django', 'mysql'],
      },
      {
        id: 'php',
        name: 'PHP',
        icon: <Code className="w-6 h-6" />,
        category: 'Backend',
        level: 78,
        experience: '2+ years',
        certificate: {
          name: 'PHP Web Development',
          organization: 'Udemy',
          date: 'June 2024',
          credentialId: 'UDEMY-PHP-2024',
          url: '#',
        },
        projects: ['Blog Platform', 'CMS Development', 'API Integration'],
        color: '#777BB4',
        connections: ['mysql', 'html', 'css'],
      },
      {
        id: 'laravel',
        name: 'Laravel',
        icon: <Shield className="w-6 h-6" />,
        category: 'Backend',
        level: 72,
        experience: '1+ years',
        certificate: {
          name: 'Laravel Framework Mastery',
          organization: 'Laracasts',
          date: 'September 2024',
          credentialId: 'LARACASTS-2024',
          url: '#',
        },
        projects: ['Hotel Booking System', 'E-commerce Platform', 'Admin Dashboard'],
        color: '#FF2D20',
        connections: ['php', 'mysql', 'html'],
      },
    ] as const;

    return skillsData.map((skill, index) => ({
      ...skill,
      position: generateSpherePosition(index, skillsData.length),
    }));
  }, []);

  // ---------- Connections (deterministic strengths) ----------

  const connections: Connection[] = useMemo(() => {
    const conns: Connection[] = [];
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    skills.forEach((skill, i) => {
      skill.connections.forEach((connId, j) => {
        const targetSkill = skills.find((s) => s.id === connId);
        if (targetSkill) {
          const strength = 0.5 + rng(i * 97 + j * 31) * 0.5;
          conns.push({ from: skill.id, to: connId, strength });
        }
      });
    });
    return conns;
  }, [skills]);

  // ---------- Auto-rotation ----------

  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const animate = () => {
      setRotation((prev) => ({
        x: (prev.x + 0.08) % 360,
        y: (prev.y + 0.12) % 360,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoRotate, isDragging]);

  // ---------- Pointer interactions (mouse + touch) ----------

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: clientX, y: clientY });
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart) return;
    const { clientX, clientY } = e;

    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;

    setRotation((prev) => ({
      x: prev.x + deltaY * 0.35,
      y: prev.y + deltaX * 0.35,
    }));

    setDragStart({ x: clientX, y: clientY });
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragStart(null);
    setTimeout(() => setAutoRotate(true), 1200);
  };

  // ---------- Project 3D -> 2D with depth factor ----------

  const project3DTo2D = (pos: { x: number; y: number; z: number }) => {
    const rotX = (rotation.x * Math.PI) / 180;
    const rotY = (rotation.y * Math.PI) / 180;

    let x = pos.x;
    let y = pos.y * Math.cos(rotX) - pos.z * Math.sin(rotX);
    let z = pos.y * Math.sin(rotX) + pos.z * Math.cos(rotX);

    const newX = x * Math.cos(rotY) + z * Math.sin(rotY);
    const newZ = -x * Math.sin(rotY) + z * Math.cos(rotY);

    const perspective = 800;
    const scale = perspective / (perspective + newZ);

    // depthNorm: 0 = far back, 1 = front
    const depthNorm = Math.max(0, Math.min(1, (newZ + 220) / 440));

    return {
      x: newX * scale,
      y: y * scale,
      z: newZ,
      scale: Math.max(0.45, Math.min(1.15, scale)),
      depth: depthNorm,
    };
  };

  return (
    <section
      id="skills"
      className={`
        relative py-20 overflow-hidden
        ${isDark ? 'bg-transparent' : 'bg-slate-50'}
      `}
    >
      {/* Very subtle gradient overlay to tie with dark About Me background */}
      <div
        className={`
          pointer-events-none absolute inset-0
          ${isDark ? 'bg-[radial-gradient(circle_at_top,_#1e293b_0,_transparent_55%)]' : ''}
        `}
      />

      <div className="relative z-10 max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header – toned down, still strong */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain
              className={`w-8 h-8 ${
                isDark ? 'text-cyan-400' : 'text-blue-600'
              }`}
            />
            <Network
              className={`w-8 h-8 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}
            />
          </div>

          <h2
            className={`
              text-4xl md:text-5xl font-bold mb-3
              ${
                isDark
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
              }
            `}
          >
            Neural Skill Network
          </h2>

          <div
            className={`
              w-24 h-1 mx-auto rounded-full mb-5
              ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }
            `}
          />

          <p
            className={`
              text-base md:text-lg max-w-3xl mx-auto
              ${isDark ? 'text-slate-300' : 'text-slate-600'}
            `}
          >
            A 3D view of how my core technologies connect. Skills closer to the
            front are stronger and more active in my current work.
          </p>

          <div
            className={`
              mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm
              ${
                isDark
                  ? 'bg-slate-900/80 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white text-blue-700 border border-blue-200'
              }
              backdrop-blur-sm
            `}
          >
            🖱️ Drag or swipe to rotate · Click a node to view details
          </div>
        </motion.div>

        {/* Globe + network */}
        <motion.div
          className="relative w-full h-[480px] mx-auto cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[420px] h-[420px] max-w-full max-h-full">
              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, index) => {
                  const fromSkill = skills.find((s) => s.id === conn.from);
                  const toSkill = skills.find((s) => s.id === conn.to);
                  if (!fromSkill || !toSkill) return null;

                  const fromPos = project3DTo2D(fromSkill.position);
                  const toPos = project3DTo2D(toSkill.position);

                  const avgDepth = (fromPos.depth + toPos.depth) / 2;
                  const strokeOpacity = 0.12 + avgDepth * 0.5; // front = stronger
                  const cx = 210;
                  const cy = 210;

                  const strokeColor = isDark
                    ? `rgba(34,211,238,${strokeOpacity})` // cyan-400
                    : `rgba(59,130,246,${strokeOpacity})`; // blue-500

                  return (
                    <motion.line
                      key={`${conn.from}-${conn.to}-${index}`}
                      x1={cx + fromPos.x}
                      y1={cy + fromPos.y}
                      x2={cx + toPos.x}
                      y2={cy + toPos.y}
                      stroke={strokeColor}
                      strokeWidth={1 + conn.strength}
                      strokeDasharray="6,6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: strokeOpacity, strokeDashoffset: [0, -12] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {skills.map((skill, index) => {
                const projected = project3DTo2D(skill.position);
                const depth = projected.depth; // 0 back, 1 front
                const cx = 210;
                const cy = 210;

                const isVisible = projected.z > -260;
                const nodeOpacity = 0.2 + depth * 0.8; // front darker/stronger

                return (
                  <motion.div
                    key={skill.id}
                    className={`
                      absolute -translate-x-1/2 -translate-y-1/2
                      ${!isVisible ? 'pointer-events-none' : 'cursor-pointer'}
                    `}
                    style={{
                      left: cx + projected.x,
                      top: cy + projected.y,
                      zIndex: Math.floor(depth * 1000),
                      opacity: isVisible ? nodeOpacity : 0,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: projected.scale,
                      opacity: isVisible ? nodeOpacity : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.06,
                      type: 'spring',
                      stiffness: 110,
                    }}
                    whileHover={{
                      scale: projected.scale * 1.1,
                    }}
                    onClick={() => setSelectedSkill(skill)}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    {/* Bubble */}
                    <div
                      className={`
                        relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                        ${
                          isDark
                            ? 'bg-slate-950/90 border border-slate-700'
                            : 'bg-white/95 border border-slate-200'
                        }
                        backdrop-blur-md shadow-lg overflow-hidden
                      `}
                      style={{
                        boxShadow: depth
                          ? `0 0 28px rgba(56,189,248,${
                              0.15 + depth * 0.5
                            })`
                          : undefined,
                      }}
                    >
                      <span
                        className="relative z-10"
                        style={{ color: skill.color }}
                      >
                        {skill.icon}
                      </span>

                      {/* subtle radial glow */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${skill.color}35, transparent 65%)`,
                          opacity: 0.6 * depth + 0.1,
                        }}
                      />

                      {/* small cert dot */}
                      <div
                        className={`
                          absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
                          ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}
                        `}
                      >
                        <Award className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>

                    {/* Label */}
                    <div
                      className={`
                        mt-2 px-3 py-1 rounded-full text-[11px] font-medium text-center whitespace-nowrap
                        ${
                          isDark
                            ? 'bg-slate-900/90 text-slate-100 border border-slate-700'
                            : 'bg-white/95 text-slate-800 border border-slate-200'
                        }
                        backdrop-blur-sm
                      `}
                      style={{ opacity: 0.4 + depth * 0.6 }}
                    >
                      {skill.name}
                    </div>

                    {/* Hover hint */}
                    <AnimatePresence>
                      {hoveredSkill?.id === skill.id && (
                        <motion.div
                          className={`
                            absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md text-[11px]
                            ${
                              isDark
                                ? 'bg-slate-900/95 text-cyan-300 border border-cyan-500/40'
                                : 'bg-white/95 text-blue-700 border border-blue-200'
                            }
                            shadow-lg backdrop-blur-md
                          `}
                          initial={{ opacity: 0, y: 8, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.9 }}
                          transition={{ duration: 0.15 }}
                        >
                          Click for certificate & projects
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Wireframe rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className={`
                w-[360px] h-[360px] rounded-full border border-dashed
                ${
                  isDark
                    ? 'border-cyan-500/20'
                    : 'border-blue-500/20'
                }
              `}
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className={`
                absolute w-[280px] h-[280px] rounded-full border border-dashed
                ${
                  isDark
                    ? 'border-purple-500/20'
                    : 'border-purple-500/20'
                }
              `}
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={() => setAutoRotate((prev) => !prev)}
            className={`
              px-5 py-2.5 rounded-full text-sm font-medium
              ${
                autoRotate
                  ? isDark
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-blue-500 text-white'
                  : isDark
                    ? 'bg-slate-900/80 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white text-blue-700 border border-blue-200'
              }
              backdrop-blur-sm transition-all
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {autoRotate ? 'Pause Auto-Rotate' : 'Resume Auto-Rotate'}
          </motion.button>

          <motion.button
            onClick={() => setRotation({ x: 0, y: 0 })}
            className={`
              px-5 py-2.5 rounded-full text-sm font-medium
              ${
                isDark
                  ? 'bg-slate-900/80 text-slate-200 border border-slate-700'
                  : 'bg-white text-slate-800 border border-slate-200'
              }
              backdrop-blur-sm transition-all
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Reset View
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FuturisticSkills;