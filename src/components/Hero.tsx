import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Download, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import CodeRain from './CodeRain';
import FloatingSymbols from './FloatingSymbols';

const Hero: React.FC = () => {
  const { isDark } = useTheme();

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={`
      min-h-screen flex items-center justify-center relative overflow-hidden
      ${isDark 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'
      }
    `}>
      {/* Animated Background Elements */}
      <CodeRain />
      <FloatingSymbols />
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`
              absolute w-2 h-2 rounded-full
              ${isDark ? 'bg-cyan-400/20' : 'bg-blue-400/20'}
            `}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className={`
              text-4xl md:text-6xl lg:text-7xl font-bold mb-6
              ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'
              }
            `}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Hi, I'm Dhruv Jindal
          </motion.h1>

          <motion.div
            className={`text-xl md:text-2xl lg:text-3xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-light">I'm a </span>
            <motion.span
              className={`font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}
              animate={{ 
                textShadow: isDark 
                  ? ['0 0 0px #00FFFF', '0 0 20px #00FFFF', '0 0 0px #00FFFF']
                  : ['0 0 0px #3B82F6', '0 0 10px #3B82F6', '0 0 0px #3B82F6']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Software Development Engineer
            </motion.span>
          </motion.div>

          <motion.p
            className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Aspiring Software Development Engineer with hands-on experience in building full-stack web applications using React, Django, and MySQL. 
            Skilled in responsive UI development, backend integration, and scalable solutions in team settings.
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className={`
                px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
                ${isDark 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-400 hover:to-purple-400'
                }
                shadow-lg transform hover:scale-105 active:scale-95
              `}
              whileHover={{ 
                boxShadow: isDark 
                  ? '0 20px 40px rgba(0, 255, 255, 0.3)' 
                  : '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              View My Work
            </motion.button>

            <div className="flex gap-4">
              <motion.a
                href="https://drive.google.com/file/d/1U8rpkx-_Tro8GezSd14-Ezs3TZvIYOoj/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  px-6 py-4 rounded-full border-2 font-semibold text-lg transition-all duration-300
                  ${isDark 
                    ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900' 
                    : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                  }
                  flex items-center gap-2
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={20} />
                Resume
              </motion.a>

              <motion.button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className={`
                  px-6 py-4 rounded-full border-2 font-semibold text-lg transition-all duration-300
                  ${isDark 
                    ? 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-gray-900' 
                    : 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
                  }
                  flex items-center gap-2
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail size={20} />
                Contact
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute transform -translate-x-1/2 bottom-10 left-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.button
            onClick={scrollToNext}
            className={`p-2 rounded-full ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-500 hover:text-blue-400'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronDown size={32} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;