import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AppWindow } from '../../../types/os';
import type { ShellType, TerminalTheme, TerminalLine, CommandContext } from '../../../terminal/terminalTypes';
import { shellDefinitions, executeCommand, getAutocompleteSuggestions } from '../../../terminal/commandEngine';
import { useFileSystemStore } from '../../../store/fsStore';
import { useOSStore } from '../../../store/osStore';
import { getApp } from '../../../data/apps';
import { Sun, Moon, Eye, Trash2, Folder } from 'lucide-react';

interface TerminalViewProps {
  shell?: ShellType;
  window: AppWindow;
}

export default function TerminalView({ shell = 'bash', window: appWindow }: TerminalViewProps) {
  const currentShellDef = shellDefinitions[shell] || shellDefinitions.bash;
  const fs = useFileSystemStore();
  const openWindow = useOSStore((s) => s.openWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);

  // Local instance state — completely isolated per terminal window
  const [cwd, setCwd] = useState<string>('/home/vansh');
  const [theme, setTheme] = useState<TerminalTheme>('dark');
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const initial: TerminalLine[] = [];
    if (currentShellDef.welcomeBanner) {
      initial.push({
        id: 'banner',
        type: 'system',
        content: currentShellDef.welcomeBanner,
      });
    } else {
      initial.push({
        id: 'welcome',
        type: 'system',
        content: (
          <div className="space-y-1 mb-2 text-xs font-mono text-slate-400">
            <div>Welcome to <span className="text-violet-400 font-bold">VNX.OS Terminal</span> (Simulated Environment).</div>
            <div>Type <span className="text-cyan-300 font-bold">help</span> to view available commands.</div>
          </div>
        ),
      });
    }
    return initial;
  });

  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on output
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, suggestions]);

  // Focus input when window becomes active or on click
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (appWindow.isFocused) {
      focusInput();
    }
  }, [appWindow.isFocused, focusInput]);

  const handleClear = useCallback(() => {
    setLines([]);
    setSuggestions(null);
  }, []);

  const handleExit = useCallback(() => {
    closeWindow(appWindow.id);
  }, [closeWindow, appWindow.id]);

  // Context passed to commands
  const commandContext: CommandContext = {
    cwd,
    setCwd,
    fs,
    history,
    theme,
    setTheme,
    clear: handleClear,
    exit: handleExit,
    shellType: shell,
  };

  const handleRunCommand = async (cmdString: string) => {
    const promptStr = currentShellDef.formatPrompt(cwd);
    const lineId = crypto.randomUUID();

    // Add input command line
    const inputLine: TerminalLine = {
      id: `${lineId}-in`,
      type: 'input',
      content: cmdString,
      prompt: promptStr,
    };

    if (!cmdString.trim()) {
      setLines((prev) => [...prev, inputLine]);
      return;
    }

    // Update history
    setHistory((prev) => [...prev, cmdString]);
    setHistoryIndex(-1);

    // Execute
    const result = await executeCommand(cmdString, shell, commandContext);

    const newLines: TerminalLine[] = [inputLine];

    if (result.error) {
      newLines.push({
        id: `${lineId}-err`,
        type: 'error',
        content: (
          <div className="text-rose-400 font-mono text-xs whitespace-pre-wrap">
            {result.error}
          </div>
        ),
      });
    } else if (result.output !== undefined && result.output !== null) {
      newLines.push({
        id: `${lineId}-out`,
        type: 'output',
        content: result.output,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
    setSuggestions(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl + L -> clear screen
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      handleClear();
      return;
    }

    // Ctrl + C -> cancel line
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      const promptStr = currentShellDef.formatPrompt(cwd);
      setLines((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: 'input',
          content: `${input}^C`,
          prompt: promptStr,
        },
      ]);
      setInput('');
      setHistoryIndex(-1);
      setSuggestions(null);
      return;
    }

    // Ctrl + Shift + T -> open new terminal window
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'T') {
      e.preventDefault();
      const app = getApp(appWindow.appId);
      if (app) openWindow(app, undefined, undefined, true);
      return;
    }

    // Tab -> Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const res = getAutocompleteSuggestions(input, shell, commandContext);
      if (res.completed !== input) {
        setInput(res.completed);
        setSuggestions(null);
      } else if (res.suggestions && res.suggestions.length > 0) {
        setSuggestions(res.suggestions);
      }
      return;
    }

    // Arrow Up -> Previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
      return;
    }

    // Arrow Down -> Next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
      return;
    }

    // Enter -> Run command
    if (e.key === 'Enter') {
      e.preventDefault();
      const commandToRun = input;
      setInput('');
      handleRunCommand(commandToRun);
      return;
    }

    // Clear suggestion banner on any other key
    if (suggestions) {
      setSuggestions(null);
    }
  };

  // Theme styling configurations
  const themeClasses = {
    dark: {
      bg: 'bg-[#0c0d14]/95',
      text: 'text-slate-100',
      border: 'border-white/10',
      prompt: shell === 'cmd' ? 'text-slate-300' : shell === 'powershell' ? 'text-sky-400' : 'text-emerald-400',
      caret: 'bg-emerald-400',
      headerBg: 'bg-white/5',
    },
    light: {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      border: 'border-slate-300',
      prompt: shell === 'cmd' ? 'text-slate-700' : shell === 'powershell' ? 'text-blue-700' : 'text-emerald-700',
      caret: 'bg-slate-800',
      headerBg: 'bg-slate-200/80',
    },
    'high-contrast': {
      bg: 'bg-black',
      text: 'text-[#00ff66]',
      border: 'border-[#00ff66]',
      prompt: 'text-[#ffff00]',
      caret: 'bg-[#00ff66]',
      headerBg: 'bg-black border-b border-[#00ff66]',
    },
  }[theme];

  return (
    <div
      className={`w-full h-full flex flex-col font-mono text-xs select-text ${themeClasses.bg} ${themeClasses.text}`}
      onClick={focusInput}
    >
      {/* Mini Terminal Sub-Header toolbar */}
      <div
        className={`px-4 py-1.5 flex items-center justify-between border-b ${themeClasses.border} ${themeClasses.headerBg} select-none text-[11px]`}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold uppercase tracking-wider text-violet-400">
            {currentShellDef.name}
          </span>
          <span className="text-slate-500">|</span>
          <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-[240px]">
            <Folder size={12} className="text-sky-400 flex-shrink-0" />
            <span className="truncate">{cwd}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggles */}
          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded border border-white/5">
            <button
              onClick={() => setTheme('dark')}
              title="Dark Theme"
              className={`p-1 rounded ${theme === 'dark' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Moon size={11} />
            </button>
            <button
              onClick={() => setTheme('light')}
              title="Light Theme"
              className={`p-1 rounded ${theme === 'light' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Sun size={11} />
            </button>
            <button
              onClick={() => setTheme('high-contrast')}
              title="High Contrast Theme"
              className={`p-1 rounded ${theme === 'high-contrast' ? 'bg-[#00ff66] text-black font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Eye size={11} />
            </button>
          </div>

          <button
            onClick={handleClear}
            title="Clear Terminal (Ctrl+L)"
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Terminal Output Buffer */}
      <div ref={containerRef} className="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
        {lines.map((line) => (
          <div key={line.id} className="space-y-1">
            {line.type === 'input' && (
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-semibold select-none ${themeClasses.prompt}`}>
                  {line.prompt}
                </span>
                <span className="text-white font-medium">{line.content}</span>
              </div>
            )}
            {line.type !== 'input' && (
              <div className="py-0.5 leading-relaxed">{line.content}</div>
            )}
          </div>
        ))}

        {/* Autocomplete Suggestions Box */}
        {suggestions && suggestions.length > 0 && (
          <div className="p-2 my-1 rounded bg-black/40 border border-violet-500/30 text-slate-300 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <span className="text-slate-500 font-semibold w-full">Suggestions:</span>
            {suggestions.map((item, idx) => (
              <span key={idx} className="text-cyan-300 font-medium hover:underline cursor-pointer" onClick={() => {
                setInput(item + ' ');
                setSuggestions(null);
                focusInput();
              }}>
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Active Input Line */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`font-semibold select-none flex-shrink-0 ${themeClasses.prompt}`}>
            {currentShellDef.formatPrompt(cwd)}
          </span>
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none p-0 text-inherit font-mono font-medium"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
