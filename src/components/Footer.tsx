import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';

const TERMINAL_LINES = [
  'dhruv@portfolio:~$ git commit -m "ship it"',
  'dhruv@portfolio:~$ npm run build',
  'dhruv@portfolio:~$ pytest -q',
  'dhruv@portfolio:~$ docker build -t portfolio .',
  'dhruv@portfolio:~$ python train_model.py --epochs 20',
  'dhruv@portfolio:~$ curl -s api/status | jq .ok',
  'dhruv@portfolio:~$ echo "building things that matter"',
  'dhruv@portfolio:~$ git push origin main',
];

const Footer: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const year = useMemo(() => new Date().getFullYear(), []);

  // Cycled, not randomized-per-render — keeps the background stable across
  // theme toggles instead of reshuffling every re-render.
  const backgroundLines = useMemo(
    () => Array.from({ length: 20 }, (_, i) => TERMINAL_LINES[i % TERMINAL_LINES.length]),
    []
  );

  const socialLinks = [
    { icon: Github, href: 'https://github.com/dhruvjindal007', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/dhruv-jindal-322408294', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:jindal10dhruv@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const sectionId = href.replace('#', '');
    const scrollAction = () => {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollAction, 200);
    } else {
      scrollAction();
    }
  };

  return (
    <footer
      className={`
        py-12 border-t relative overflow-hidden
        ${isDark ? 'bg-gray-900 border-cyan-500/20' : 'bg-white border-gray-200'}
      `}
    >
      {/* Terminal-style background */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-5">
        <div className={`font-mono text-xs leading-5 ${isDark ? 'text-green-400' : 'text-gray-600'}`}>
          {backgroundLines.map((line, i) => (
            <div key={i} className="overflow-hidden whitespace-nowrap">
              {line}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.h2
              className={`text-2xl font-bold mb-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}
              whileHover={{ scale: 1.05 }}
            >
              Dhruv Jindal
            </motion.h2>
            <p className={`leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Software & AI/ML engineer passionate about creating exceptional digital experiences.
              Always learning, always building, always pushing the boundaries of modern web technologies.
            </p>
            <div className="flex items-center gap-4">
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Theme:</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className={`
                    block text-left transition-colors duration-200 w-full
                    ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600'}
                  `}
                  whileHover={{ x: 5 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isDark
                      ? 'bg-gray-800 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900'
                      : 'bg-gray-100 text-blue-600 hover:bg-blue-600 hover:text-white'}
                  `}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div
            className={`
              p-4 rounded-lg font-mono text-sm mb-4
              ${isDark
                ? 'bg-gray-800/50 border border-green-500/30 text-green-400'
                : 'bg-gray-100 border border-gray-300 text-gray-700'}
            `}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={isDark ? 'text-green-400' : 'text-blue-600'}>dhruv@portfolio:~$</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                built with passion and code
              </motion.span>
            </div>
            <div className="text-xs opacity-70">&gt; Status: Ready for new opportunities ✓</div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <motion.p
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              © {year} Dhruv Jindal. Made with <Heart className="w-4 h-4 text-red-500" fill="currentColor" /> and lots of ☕
            </motion.p>
            <motion.div
              className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Built with React, TypeScript & Framer Motion
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;