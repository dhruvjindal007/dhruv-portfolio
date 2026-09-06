import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import TerminalModal from './TerminalModal';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark } = useTheme();

  // Scroll shell state + a thin progress bar along the bottom of the nav
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: highlight whichever section is actually in view
  useEffect(() => {
    const sections = NAV_ITEMS
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock background scroll and support Escape while the mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-[9990] h-16
          transition-all duration-300
          ${isScrolled
            ? isDark
              ? 'bg-gray-900/90 backdrop-blur-md border-b border-cyan-500/20'
              : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'
            : 'bg-transparent'}
        `}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              onClick={() => scrollToSection('#home')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`
                text-xl font-bold text-transparent bg-clip-text
                ${isDark
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600'}
              `}
            >
              Dhruv Jindal
            </motion.button>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-1 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      group relative px-3 py-2 text-sm font-medium transition-colors duration-200
                      ${isActive
                        ? isDark ? 'text-cyan-400' : 'text-blue-600'
                        : isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'}
                    `}
                  >
                    {item.label}
                    <span
                      className={`
                        absolute bottom-0 left-3 right-3 h-[2px] origin-left transition-transform duration-200
                        ${isDark ? 'bg-cyan-400' : 'bg-blue-600'}
                        ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                      `}
                    />
                  </button>
                );
              })}

              <button
                onClick={() => setIsTerminalOpen(true)}
                title="Open terminal"
                aria-label="Open terminal"
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isDark ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Terminal size={18} />
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={() => setIsTerminalOpen(true)}
                title="Open terminal"
                aria-label="Open terminal"
                className={`p-2 ${isDark ? 'text-green-400' : 'text-gray-700'}`}
              >
                <Terminal size={18} />
              </button>

              <ThemeToggle />

              <button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll progress — quiet, matches the gradient already used elsewhere */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
          <div
            className={`h-full ${
              isDark
                ? 'bg-gradient-to-r from-cyan-400 to-purple-400'
                : 'bg-gradient-to-r from-blue-600 to-purple-600'
            }`}
            style={{ width: `${scrollProgress * 100}%`, transition: 'width 100ms linear' }}
          />
        </div>
      </nav>

      {/* Mobile Menu — real open/close animation + backdrop, replacing the
          previous height:'auto' transition (which CSS can't animate) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              key="nav-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[9985] bg-black/40 md:hidden"
              aria-hidden
            />
            <motion.div
              key="nav-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className={`
                fixed top-16 left-0 right-0 z-[9989] space-y-1
                border-t px-2 py-3 md:hidden
                ${isDark ? 'bg-gray-900/95 border-cyan-500/20' : 'bg-white/95 border-gray-200/50'}
              `}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href;
                return (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      block w-full rounded-md px-3 py-2 text-left text-base font-medium
                      ${isActive
                        ? isDark ? 'text-cyan-400 bg-gray-800' : 'text-blue-600 bg-gray-50'
                        : isDark
                          ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
};

export default Navigation;