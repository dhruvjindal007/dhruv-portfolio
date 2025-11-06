import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const codeSnippets = [
    `const developer = {
  name: 'Dhruv Jindal',
  role: 'Software Engineer',
  skills: ['React', 'Django', 'MySQL'],
  passion: 'Building amazing apps'
};`,

    `function optimizePerformance() {
  // Reduced backend response time by 30%
  return 'WoRisGo internship success!';
}`,

    `class OpenSourceContributor {
  constructor() {
    this.rank = 'Top 1%';
    this.participants = '200+';
    this.event = 'PWOC';
  }
}`,

    `const projects = [
  'Portfolio (MERN)',
  'Restaurant App (Django + React)',
  'Hotel Booking (Laravel)',
  'Blog Platform (PHP + MySQL)'
];`,
  ];

const CodePlayground: React.FC = () => {
  const { isDark } = useTheme();
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const snippet = codeSnippets[currentIndex];
    let char = 0;
    setDisplayedCode('');

    const typeInterval = setInterval(() => {
      if (char < snippet.length) {
        setDisplayedCode(snippet.slice(0, char + 1));
        char++;
      } else {
        clearInterval(typeInterval);

        const timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <motion.div
      className={`
        relative p-6 rounded-lg font-mono text-sm backdrop-blur-sm overflow-hidden
        ${isDark
          ? 'bg-gray-900/80 border border-cyan-500/30'
          : 'bg-gray-50 border border-gray-300'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full" />
        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
        <div className="w-3 h-3 bg-green-500 rounded-full" />

        <span
          className={`ml-2 text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          live-code-demo.js
        </span>
      </div>

      {/* Typing Code */}
      <pre
        className={`leading-relaxed ${
          isDark ? 'text-green-400' : 'text-gray-800'
        }`}
      >
        {displayedCode}

        {/* Blinking Cursor */}
        <motion.span
          className={`inline-block w-2 h-4 ml-1 ${
            isDark ? 'bg-cyan-400' : 'bg-blue-500'
          }`}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </pre>

      {/* Floating highlight particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`
              absolute w-1 h-1 rounded-full
              ${isDark ? 'bg-purple-400/30' : 'bg-blue-400/30'}
            `}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear',
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CodePlayground;