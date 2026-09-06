import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SYMBOLS = [
  '{ }', '<>', 'const', '#', '//', '[]', '()', '=>', '&&', '||',
  'function', 'class', 'import', 'export', 'async', 'await',
  '===', '!==', '++', '--', '...', '?:', 'typeof', 'null',
];

interface FloatingSymbol {
  id: number;
  text: string;
  left: number; // vw
  top: number; // vh
  size: number; // px
  driftX: number; // vw
  driftY: number; // vh
  duration: number; // s
  delay: number; // s
}

// Deterministic-ish spread instead of pure random: keeps symbols from clumping
// while still feeling organic, and we only compute it once per mount.
function generateSymbols(count: number): FloatingSymbol[] {
  return Array.from({ length: count }, (_, i) => {
    const jitter = () => (Math.random() - 0.5) * 2;
    return {
      id: i,
      text: SYMBOLS[i % SYMBOLS.length],
      left: Math.random() * 96,
      top: Math.random() * 92,
      size: 11 + Math.random() * 7,
      driftX: 4 + Math.random() * 5,
      driftY: 4 + Math.random() * 5,
      duration: 16 + Math.random() * 14,
      delay: jitter() * 6,
    };
  });
}

const FloatingSymbols: React.FC = () => {
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Computed once on mount, independent of theme — toggling dark/light no
  // longer reshuffles every symbol's position.
  const symbols = useMemo(() => generateSymbols(16), []);

  if (prefersReducedMotion) {
    // A calm, static scatter respects the user's motion preference instead
    // of just turning the whole layer off.
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {symbols.map((s) => (
          <span
            key={s.id}
            className={`absolute font-mono opacity-[0.08] ${isDark ? 'text-cyan-400' : 'text-blue-500'}`}
            style={{ left: `${s.left}vw`, top: `${s.top}vh`, fontSize: s.size }}
          >
            {s.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {symbols.map((s) => (
        <motion.span
          key={s.id}
          className={`absolute font-mono select-none ${isDark ? 'text-cyan-400' : 'text-blue-500'}`}
          style={{ left: `${s.left}vw`, top: `${s.top}vh`, fontSize: s.size }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: [0, `${s.driftX}vw`, `${-s.driftX * 0.6}vw`, 0],
            y: [0, `${-s.driftY}vh`, `${s.driftY * 0.6}vh`, 0],
            opacity: [0, 0.12, 0.12, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {s.text}
        </motion.span>
      ))}
    </div>
  );
};

export default FloatingSymbols;