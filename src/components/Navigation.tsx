import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import TerminalModal from './TerminalModal';
import { useTheme } from '../context/ThemeContext';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 h-16 z-[9990]   /* ✅ ABOVE PAGE, BELOW CURSOR */
          transition-all duration-300
          ${isScrolled
            ? isDark
              ? 'bg-gray-900/90 border-b border-cyan-500/20'
              : 'bg-white/80 border-b border-gray-200/50'
            : 'bg-transparent'
          }
        `}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div
              className={`text-xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}
            >
              Dhruv Jindal
            </div>

            {/* Desktop Navigation */}
            <div className="items-center hidden space-x-8 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`
                    relative px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-blue-600'}
                  `}
                >
                  {item.label}

                  <div
                    className={`
                      absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 origin-left transition-transform duration-200
                      ${isDark ? 'bg-cyan-400' : 'bg-blue-600'}
                    `}
                  />
                </button>
              ))}

              {/* Terminal */}
              <button
                onClick={() => setIsTerminalOpen(true)}
                className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${isDark ? 'text-green-400 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <Terminal size={18} />
              </button>

              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={() => setIsTerminalOpen(true)}
                className={`p-2 ${isDark ? 'text-green-400' : 'text-gray-700'}`}
              >
                <Terminal size={18} />
              </button>

              <ThemeToggle />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`
              md:hidden overflow-hidden
              ${isDark ? 'bg-gray-900/95' : 'bg-white/95'}
              border-t ${isDark ? 'border-cyan-500/20' : 'border-gray-200/50'}
              transition-all duration-300
            `}
            style={{ height: isMobileMenuOpen ? 'auto' : '0' }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className={`
                    block px-3 py-2 text-base font-medium w-full text-left
                    ${isDark ? 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800'
                             : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}
                    rounded-md
                  `}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </>
  );
};

export default Navigation;