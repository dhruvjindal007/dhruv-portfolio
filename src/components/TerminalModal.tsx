import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, isDark = true }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  const commands = [
    "Initializing developer profile...",
    "Loading system modules...",
    "",
    "[OK] Identity: Dhruv Jindal",
    "[OK] Role: Software Development Engineer",
    "",
    "Running diagnostics...",
    "[OK] React Engine ............... active",
    "[OK] Django REST Server ......... active",
    "[OK] Database Cluster ........... synced (MySQL/PostgreSQL)",
    "[OK] AI Module .................. operational",
    "",
    "Scanning major projects...",
    "|-- restaurant-app/        (Django + React + AI Q&A <200ms)",
    "|-- eduportal-ai/          (Django REST + JWT + Auto-Curriculum Builder)",
    "|-- raytracer-cpp/         (1M+ rays rendered in 0.079s)",
    "\\-- hotel-booking-laravel/ (Role-based + MySQL + Dashboard)",
    "",
    "Compiling achievements...",
    "[+] PWOC: Top 1% Open Source Contributor",
    "[+] Backend Optimization @ Gokaddal",
    "[+] AI Integration workflows (LLaMA API, automation)",
    "",
    "Running career-build sequence...",
    "> Improving performance...",
    "> Shipping clean code...",
    "> Learning new technologies...",
    "> Contributing to open source...",
    "System status: STABLE",
    "",
    "dhruv@portfolio:~$ echo \"Ready to build something extraordinary.\"",
    "Ready to build something extraordinary.",
    "",
    "dhruv@portfolio:~$ _"
  ];

  useEffect(() => {
    if (!isOpen) {
      setLines([]);
      setCurrentLineIndex(0);
      setCurrentChar(0);
      return;
    }

    if (currentLineIndex >= commands.length) return;

    const currentLine = commands[currentLineIndex];

    // If empty line, add it immediately and move to next
    if (currentLine === "") {
      setLines(prev => [...prev, ""]);
      setCurrentLineIndex(prev => prev + 1);
      setCurrentChar(0);
      return;
    }

    // Type out character by character
    if (currentChar < currentLine.length) {
      const timer = setTimeout(() => {
        setCurrentChar(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    }

    // Line complete, move to next line
    if (currentChar === currentLine.length) {
      const timer = setTimeout(() => {
        setLines(prev => [...prev, currentLine]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentChar(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentLineIndex, currentChar, commands]);

  if (!isOpen) return null;

  const currentLine = commands[currentLineIndex] || "";
  const displayCurrentLine = currentLine.slice(0, currentChar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 animate-in fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`
          relative w-full max-w-4xl h-96 rounded-lg overflow-hidden shadow-2xl
          ${isDark 
            ? 'bg-gray-900 border border-cyan-500/30' 
            : 'bg-gray-900 border border-gray-600'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="font-mono text-sm text-gray-300">dhruv@portfolio:~</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 transition-colors bg-red-500 rounded-full hover:bg-red-600"
              aria-label="Close terminal"
            />
            <button
              className="w-3 h-3 transition-colors bg-yellow-500 rounded-full hover:bg-yellow-600"
              aria-label="Minimize terminal"
            />
            <button
              className="w-3 h-3 transition-colors bg-green-500 rounded-full hover:bg-green-600"
              aria-label="Maximize terminal"
            />
          </div>
        </div>

        {/* Terminal Content */}
        <div className="h-full p-4 overflow-y-auto font-mono text-sm text-green-400 bg-black">
          {lines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div>
            {displayCurrentLine}
            {currentLineIndex < commands.length && (
              <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalModal;