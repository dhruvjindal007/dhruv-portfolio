import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// ---------- Snippets — the same work, told simply ----------

interface Snippet {
  filename: string;
  code: string;
  output: string[];
}

const SNIPPETS: Snippet[] = [
  {
    filename: 'developer.js',
    code: `const developer = {
  name: 'Dhruv Jindal',
  role: 'Software & AI Engineer',
  superpower: 'Turning ideas into working apps',
  currentlyTeaching: 'Computers to notice things humans miss'
};`,
    output: [
      '> loading developer profile...',
      '> role: Software & AI Engineer',
      '> status: building cool things daily',
    ],
  },
  {
    filename: 'spot_the_outlier.js',
    code: `function spotTheOddOneOut(walkingPatterns) {
  // Teach a model what a "normal" walk looks like
  const normal = learnWhatsNormal(walkingPatterns);
  return normal.flagAnythingWeird(walkingPatterns);
}`,
    output: [
      '> studying 11,000+ walking patterns...',
      '> found the ones that stand out',
      '> accuracy: nearly perfect',
    ],
  },
  {
    filename: 'make_it_interesting.js',
    code: `function makeItInteresting(topic) {
  const trend = checkWhatsHot(topic);
  const angle = mixIdeas(topic, trend);
  return ai.write(angle);
}`,
    output: [
      "> checking what's trending...",
      '> mixing in a fresh angle',
      '> readers 45% more interested',
    ],
  },
  {
    filename: 'group_the_shoppers.js',
    code: `function groupTheShoppers(customers) {
  const habits = studyShoppingHabits(customers);
  return sortIntoGroups(habits, ['VIP', 'Regular', 'At-Risk', 'Lost']);
}`,
    output: [
      '> studying 1M+ shopping habits...',
      '> sorting everyone into 4 friendly groups',
      '> done: VIP · Regular · At-Risk · Lost',
    ],
  },
  {
    filename: 'answer_the_question.js',
    code: `function answerQuestion(question) {
  const answer = ai.think(question);
  return reply(answer);
}`,
    output: [
      "> \"what's gluten-free tonight?\"",
      '> thinking...',
      '> answered in under 200ms',
    ],
  },
];

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'class', 'constructor', 'this',
  'new', 'import', 'from', 'export', 'default', 'if', 'else', 'for', 'while',
  'in', 'of', 'true', 'false', 'null', 'undefined', 'async', 'await',
]);

// Lightweight single-pass tokenizer: comments, strings, numbers, identifiers,
// then colors identifiers as keywords / function calls / plain names. Runs on
// each render, including mid-typing partial lines, so highlighting stays live
// as the "cursor" moves across the code.
const TOKEN_RE = /(\/\/.*$)|('[^']*'|"[^"]*")|(\b\d+\.?\d*%?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_])/g;

function highlightLine(line: string, palette: Record<string, string>) {
  const parts: { text: string; color?: string }[] = [];
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    const [, comment, string, number, word, space, punct] = match;
    if (comment) parts.push({ text: comment, color: palette.comment });
    else if (string) parts.push({ text: string, color: palette.string });
    else if (number) parts.push({ text: number, color: palette.number });
    else if (word) {
      if (KEYWORDS.has(word)) {
        parts.push({ text: word, color: palette.keyword });
      } else {
        const rest = line.slice((match.index ?? 0) + word.length);
        parts.push({ text: word, color: /^\s*\(/.test(rest) ? palette.func : palette.plain });
      }
    } else if (space) parts.push({ text: space });
    else if (punct) parts.push({ text: punct, color: palette.plain });
  }
  return parts;
}

// ---------- Timing ----------

const TYPE_SPEED_MS = 22;
const PAUSE_BEFORE_OUTPUT_MS = 500;
const OUTPUT_LINE_DELAY_MS = 450;
const HOLD_AFTER_OUTPUT_MS = 2600;

const CodePlayground: React.FC = () => {
  const { isDark } = useTheme();
  const [snippetIdx, setSnippetIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [visibleOutputLines, setVisibleOutputLines] = useState(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  const snippet = SNIPPETS[snippetIdx];

  const goToSnippet = (index: number) => {
    window.clearTimeout(timeoutRef.current);
    setSnippetIdx(index);
    setCharCount(0);
    setShowOutput(false);
    setVisibleOutputLines(0);
  };

  // Typing phase
  useEffect(() => {
    if (showOutput) return;
    if (charCount < snippet.code.length) {
      timeoutRef.current = window.setTimeout(() => setCharCount((c) => c + 1), TYPE_SPEED_MS);
    } else {
      timeoutRef.current = window.setTimeout(() => setShowOutput(true), PAUSE_BEFORE_OUTPUT_MS);
    }
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charCount, showOutput, snippetIdx]);

  // Output reveal + auto-advance
  useEffect(() => {
    if (!showOutput) return;
    if (visibleOutputLines < snippet.output.length) {
      timeoutRef.current = window.setTimeout(
        () => setVisibleOutputLines((n) => n + 1),
        OUTPUT_LINE_DELAY_MS
      );
    } else {
      timeoutRef.current = window.setTimeout(() => {
        goToSnippet((snippetIdx + 1) % SNIPPETS.length);
      }, HOLD_AFTER_OUTPUT_MS);
    }
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOutput, visibleOutputLines, snippetIdx]);

  const typedLines = snippet.code.slice(0, charCount).split('\n');
  const isTyping = !showOutput && charCount < snippet.code.length;

  // ---------- Theme tokens ----------

  const palette = isDark
    ? {
        comment: '#64748b',
        string: '#7dd3fc',
        number: '#fbbf24',
        keyword: '#c792ea',
        func: '#7ee787',
        plain: '#e2e8f0',
      }
    : {
        comment: '#94a3b8',
        string: '#0369a1',
        number: '#b45309',
        keyword: '#7c3aed',
        func: '#15803d',
        plain: '#1e293b',
      };

  const windowClass = isDark
    ? 'border-slate-700 bg-slate-950/95'
    : 'border-slate-200 bg-slate-900';

  const tabBarClass = isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-800/80 border-slate-700';

  const activeTabClass = isDark ? 'bg-slate-950 text-cyan-300' : 'bg-slate-900 text-cyan-300';
  const idleTabClass = 'text-slate-500 hover:text-slate-300';

  const outputBg = isDark ? 'border-slate-800 bg-black/40' : 'border-slate-800 bg-black/30';

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-xl ${windowClass}`}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-xs text-slate-400">dhruv — zsh</span>
      </div>

      {/* Tabs — click any file to jump straight to its snippet */}
      <div className={`flex items-center gap-1 border-b px-2 pt-2 ${tabBarClass}`}>
        {SNIPPETS.map((s, i) => (
          <button
            key={s.filename}
            type="button"
            onClick={() => goToSnippet(i)}
            className={`rounded-t-md px-3 py-1.5 font-mono text-xs transition-colors ${
              i === snippetIdx ? activeTabClass : idleTabClass
            }`}
          >
            {s.filename}
          </button>
        ))}
      </div>

      {/* Code body */}
      <div className="px-4 py-5 font-mono text-sm leading-6">
        {typedLines.map((line, i) => {
          const parts = highlightLine(line, palette);
          const isLastLine = i === typedLines.length - 1;
          return (
            <div key={i} className="flex">
              <span className="w-6 mr-4 text-right select-none text-slate-600/70">{i + 1}</span>
              <span className="whitespace-pre">
                {parts.map((part, j) => (
                  <span key={j} style={{ color: part.color }}>
                    {part.text}
                  </span>
                ))}
                {isLastLine && isTyping && (
                  <motion.span
                    className="inline-block w-[2px] h-[1em] -mb-[2px] ml-0.5 bg-cyan-400 align-middle"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Output panel */}
      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t px-4 py-3 font-mono text-xs ${outputBg}`}
          >
            {snippet.output.slice(0, visibleOutputLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="text-emerald-400"
              >
                {line}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CodePlayground;