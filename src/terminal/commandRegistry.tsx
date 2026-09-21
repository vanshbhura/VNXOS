import React from 'react';
import type { CommandContext, CommandResult } from './terminalTypes';
import { normalizeToVfsPath, findVfsNode, toWindowsPath, NEOFETCH_ASCII, getSystemInfoLines } from './terminalUtils';
import { profileData } from '../data/profile';
import { projectsData } from '../data/projects';
import { skillsData } from '../data/skills';
import { experienceData } from '../data/experience';
import { certificatesData } from '../data/certificates';
import MatrixRain from '../features/easter-eggs/MatrixRain';
import { useEasterEggStore } from '../features/easter-eggs/easterEggStore';
import { useOSStore } from '../store/osStore';
import { getApp } from '../data/apps';

export const coreCommands = {
  clear: {
    name: 'clear',
    description: 'Clear terminal screen',
    aliases: ['cls', 'Clear-Host'],
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      ctx.clear();
      return {};
    },
  },

  pwd: {
    name: 'pwd',
    description: 'Print working directory',
    aliases: ['Get-Location'],
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      if (ctx.shellType === 'cmd') {
        return { output: toWindowsPath(ctx.cwd) };
      }
      if (ctx.shellType === 'powershell') {
        return {
          output: (
            <div className="space-y-1">
              <div className="text-slate-400">Path</div>
              <div className="text-slate-400">----</div>
              <div>{toWindowsPath(ctx.cwd)}</div>
            </div>
          ),
        };
      }
      return { output: ctx.cwd };
    },
  },

  cd: {
    name: 'cd',
    description: 'Change simulated directory',
    aliases: ['chdir', 'Set-Location'],
    usage: 'cd [directory]',
    execute: (args: string[], ctx: CommandContext): CommandResult => {
      const target = args[0] || (ctx.shellType === 'bash' ? '/home/vansh' : 'C:\\Users\\vansh');
      const normalized = normalizeToVfsPath(target, ctx.cwd);

      const targetNode = Object.values(ctx.fs.nodes).find((n) => n.path === normalized);

      if (!targetNode) {
        return {
          error:
            ctx.shellType === 'cmd'
              ? 'The system cannot find the path specified.'
              : ctx.shellType === 'powershell'
              ? `Set-Location : Cannot find path '${target}' because it does not exist.`
              : `cd: no such file or directory: ${args[0]}`,
        };
      }

      if (targetNode.type !== 'folder') {
        return {
          error:
            ctx.shellType === 'cmd'
              ? 'The directory name is invalid.'
              : ctx.shellType === 'powershell'
              ? `Set-Location : Cannot find path '${target}' because it is not a directory.`
              : `cd: not a directory: ${args[0]}`,
        };
      }

      ctx.setCwd(targetNode.path);
      return {};
    },
  },

  ls: {
    name: 'ls',
    description: 'List simulated directory contents',
    aliases: ['dir', 'Get-ChildItem'],
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      const currentDirNode = Object.values(ctx.fs.nodes).find((n) => n.path === ctx.cwd);
      if (!currentDirNode) {
        return { error: 'Current directory not found in filesystem.' };
      }

      const children = ctx.fs.getChildren(currentDirNode.id);

      if (children.length === 0) {
        return { output: <span className="text-slate-500 italic">(empty directory)</span> };
      }

      // Format for Windows CMD
      if (ctx.shellType === 'cmd') {
        return {
          output: (
            <div className="space-y-1 font-mono text-xs">
              <div className="text-slate-400"> Volume in drive C has no label.</div>
              <div className="text-slate-400"> Directory of {toWindowsPath(ctx.cwd)}</div>
              <div className="py-1">
                {children.map((child) => (
                  <div key={child.id} className="flex gap-4">
                    <span className="text-slate-400">
                      {new Date(child.modifiedDate).toLocaleDateString()}{' '}
                      {new Date(child.modifiedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="w-16 text-slate-400">
                      {child.type === 'folder' ? '<DIR>' : (child.size || 0).toString().padStart(6, ' ')}
                    </span>
                    <span className={child.type === 'folder' ? 'text-cyan-300 font-semibold' : 'text-slate-200'}>
                      {child.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-slate-400 pt-1">
                {children.filter((c) => c.type !== 'folder').length} File(s),{' '}
                {children.filter((c) => c.type === 'folder').length} Dir(s)
              </div>
            </div>
          ),
        };
      }

      // Format for PowerShell
      if (ctx.shellType === 'powershell') {
        return {
          output: (
            <div className="space-y-1 font-mono text-xs">
              <div className="text-slate-400">
                Mode{' '.repeat(8)}LastWriteTime{' '.repeat(10)}Length Name
              </div>
              <div className="text-slate-400">
                ----{' '.repeat(8)}-------------{' '.repeat(10)}------ ----
              </div>
              {children.map((child) => (
                <div key={child.id} className="flex gap-4">
                  <span className="text-slate-400">
                    {child.type === 'folder' ? 'd-----' : '-a----'}
                  </span>
                  <span className="text-slate-400">
                    {new Date(child.modifiedDate).toLocaleDateString()}{' '}
                    {new Date(child.modifiedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="w-12 text-slate-400 text-right">
                    {child.type === 'folder' ? '' : child.size || 0}
                  </span>
                  <span className={child.type === 'folder' ? 'text-amber-300 font-semibold' : 'text-slate-200'}>
                    {child.name}
                  </span>
                </div>
              ))}
            </div>
          ),
        };
      }

      // Format for Bash
      return {
        output: (
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs">
            {children.map((child) => (
              <span
                key={child.id}
                className={
                  child.type === 'folder'
                    ? 'text-sky-400 font-semibold flex items-center gap-1'
                    : child.extension === '.pdf'
                    ? 'text-rose-400 font-medium'
                    : 'text-slate-200'
                }
              >
                {child.name}
                {child.type === 'folder' ? '/' : ''}
              </span>
            ))}
          </div>
        ),
      };
    },
  },

  cat: {
    name: 'cat',
    description: 'Display text file contents',
    aliases: ['type', 'Get-Content'],
    usage: 'cat <filename>',
    execute: (args: string[], ctx: CommandContext): CommandResult => {
      if (!args[0]) {
        return {
          error:
            ctx.shellType === 'cmd'
              ? 'The syntax of the command is incorrect.'
              : ctx.shellType === 'powershell'
              ? 'Get-Content : Cannot bind argument to parameter "Path" because it is null or empty.'
              : 'cat: missing file operand',
        };
      }

      const node = findVfsNode(args[0], ctx.cwd, ctx.fs.nodes);

      if (!node) {
        return {
          error:
            ctx.shellType === 'cmd'
              ? `The system cannot find the file specified: ${args[0]}`
              : ctx.shellType === 'powershell'
              ? `Get-Content : Cannot find path '${args[0]}' because it does not exist.`
              : `cat: ${args[0]}: No such file or directory`,
        };
      }

      if (node.type === 'folder') {
        return {
          error:
            ctx.shellType === 'cmd'
              ? `Access is denied: ${args[0]}`
              : ctx.shellType === 'powershell'
              ? `Get-Content : Cannot read folder contents '${args[0]}'.`
              : `cat: ${args[0]}: Is a directory`,
        };
      }

      if (node.name === 'Notes.txt') {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('vnx-notes-content') : null;
        if (stored) {
          return { output: <div className="whitespace-pre-wrap font-mono text-xs">{stored}</div> };
        }
      }

      return {
        output: (
          <div className="whitespace-pre-wrap font-mono text-xs">
            {node.content || `[Binary or static asset: ${node.name}]`}
          </div>
        ),
      };
    },
  },

  whoami: {
    name: 'whoami',
    description: 'Print current user and developer identity',
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      if (ctx.shellType === 'cmd' || ctx.shellType === 'powershell') {
        return { output: 'vnxos\\vansh (Vansh Bhura — AI/ML Engineer & Systems Developer)' };
      }
      return { output: 'vansh — AI/ML Engineer & Systems Developer (NIMS University B.Tech AIML)' };
    },
  },

  about: {
    name: 'about',
    description: 'Display developer profile overview',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-2 text-xs font-mono">
            <div className="text-violet-400 font-bold text-sm">{profileData.name} — {profileData.role}</div>
            <div className="text-slate-300">{profileData.introduction}</div>
            <div className="pt-2">
              <span className="text-emerald-400 font-semibold">Education: </span>
              <span className="text-slate-300">
                {profileData.education[0]?.degree} ({profileData.education[0]?.institution})
                {profileData.education[0]?.cgpa ? ` • CGPA: ${profileData.education[0].cgpa}` : ''}
              </span>
            </div>
            <div>
              <span className="text-rose-400 font-semibold">Current Focus: </span>
              <span className="text-slate-300">{profileData.currentFocus}</span>
            </div>
          </div>
        ),
      };
    },
  },

  projects: {
    name: 'projects',
    description: 'List technical portfolio projects',
    aliases: ['portfolio'],
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-3 text-xs font-mono">
            <div className="text-amber-400 font-bold border-b border-amber-400/30 pb-1">
              CONFIGURED PORTFOLIO PROJECTS ({projectsData.length})
            </div>
            {projectsData.map((p) => (
              <div key={p.id} className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">{p.name}</span>
                  <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                    {p.category}
                  </span>
                  {p.status && <span className="text-[10px] text-violet-400">[{p.status}]</span>}
                </div>
                <div className="text-slate-400">{p.shortDescription}</div>
                <div className="text-[11px] text-slate-500">
                  Tech: {p.technologies.join(' • ')}
                </div>
                {p.githubUrl && (
                  <div className="text-[11px] text-sky-400">
                    GitHub: <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-sky-300">{p.githubUrl}</a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  skills: {
    name: 'skills',
    description: 'Display categorized technical skills',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-2.5 text-xs font-mono">
            <div className="text-sky-400 font-bold border-b border-sky-400/30 pb-1">
              TECHNICAL SKILLS MATRIX
            </div>
            {skillsData.map((cat, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-slate-400 font-semibold">{cat.category}: </span>
                <span className="text-slate-200">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  experience: {
    name: 'experience',
    description: 'Display professional work experience',
    execute: (): CommandResult => {
      if (experienceData.length === 0) {
        return {
          output: <span className="text-slate-400 italic">No experience entries configured yet.</span>,
        };
      }
      return {
        output: (
          <div className="space-y-3 text-xs font-mono">
            {experienceData.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="font-bold text-violet-300">{exp.title} @ {exp.organization}</div>
                <div className="text-slate-400">{exp.duration} • {exp.type}</div>
                <div className="text-slate-300">{exp.description}</div>
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  certificates: {
    name: 'certificates',
    description: 'Display verified certificates',
    execute: (): CommandResult => {
      if (certificatesData.length === 0) {
        return {
          output: <span className="text-slate-400 italic">No certificates configured yet.</span>,
        };
      }
      return {
        output: (
          <div className="space-y-2 text-xs font-mono">
            {certificatesData.map((c) => (
              <div key={c.id}>
                <span className="text-emerald-400 font-bold">{c.name}</span> — {c.issuer} ({c.date})
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  github: {
    name: 'github',
    description: 'View GitHub repository links',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-1 text-xs font-mono">
            <div>
              <span className="text-slate-400">Profile: </span>
              <a href="https://github.com/vanshbhura" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300">
                https://github.com/vanshbhura
              </a>
            </div>
            <div>
              <span className="text-slate-400">Featured Repo: </span>
              <a href="https://github.com/vanshbhura/VNXOS" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline hover:text-sky-300">
                https://github.com/vanshbhura/VNXOS
              </a>
            </div>
          </div>
        ),
      };
    },
  },

  resume: {
    name: 'resume',
    description: 'Check status of resume file',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-1 text-xs font-mono">
            <div className="text-amber-300 font-semibold">Resume Status:</div>
            <div className="text-slate-300">Resume viewer is wired to: <span className="text-cyan-300 font-mono">/assets/resume.pdf</span></div>
            <div className="text-slate-400">Open Resume.pdf from Desktop or File Manager to view or download.</div>
          </div>
        ),
      };
    },
  },

  neofetch: {
    name: 'neofetch',
    description: 'Display system architecture summary and logo',
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      const shellName =
        ctx.shellType === 'cmd'
          ? 'Command Prompt'
          : ctx.shellType === 'powershell'
          ? 'PowerShell'
          : 'VNX Shell';
      const specs = getSystemInfoLines(shellName);
      return {
        output: (
          <div className="flex flex-col md:flex-row gap-6 items-start font-mono text-xs">
            <pre className="text-violet-400 font-bold text-[10px] leading-tight select-none">
              {NEOFETCH_ASCII}
            </pre>
            <div className="space-y-1 pt-2">
              <div className="text-white font-bold text-sm">vansh@vnxos</div>
              <div className="text-slate-500 border-b border-white/10 pb-1 mb-2">-------------</div>
              {specs.map((item, idx) => (
                <div key={idx}>
                  <span className="text-violet-400 font-semibold">{item.label}: </span>
                  <span className="text-slate-300">{item.value}</span>
                </div>
              ))}
              <div className="pt-2 flex gap-1.5">
                <span className="w-3 h-3 bg-red-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-green-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-yellow-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-blue-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-purple-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-cyan-500 inline-block rounded-xs" />
                <span className="w-3 h-3 bg-white inline-block rounded-xs" />
              </div>
            </div>
          </div>
        ),
      };
    },
  },

  date: {
    name: 'date',
    description: 'Display current date and time',
    aliases: ['Get-Date'],
    execute: (): CommandResult => {
      return { output: new Date().toString() };
    },
  },

  time: {
    name: 'time',
    description: 'Display current simulated system time',
    execute: (): CommandResult => {
      return { output: `The current time is: ${new Date().toLocaleTimeString()}` };
    },
  },

  echo: {
    name: 'echo',
    description: 'Print text to terminal output',
    aliases: ['Write-Output'],
    usage: 'echo [text...]',
    execute: (args: string[]): CommandResult => {
      return { output: args.join(' ') };
    },
  },

  history: {
    name: 'history',
    description: 'Display session command history',
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      if (ctx.history.length === 0) {
        return { output: <span className="text-slate-500 italic">(no history)</span> };
      }
      return {
        output: (
          <div className="space-y-0.5 font-mono text-xs">
            {ctx.history.map((cmd, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-slate-500 w-8 text-right">{i + 1}</span>
                <span className="text-slate-200">{cmd}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  },

  uname: {
    name: 'uname',
    description: 'Print simulated kernel information',
    execute: (args: string[]): CommandResult => {
      const flag = args[0]?.toLowerCase();
      if (flag === '-s') return { output: 'VNXOS' };
      if (flag === '-r') return { output: '6.0.2026-simulated-web' };
      if (flag === '-m') return { output: 'x86_64' };
      if (flag === '-o') return { output: 'GNU/VNX' };
      return {
        output: 'VNXOS vnxos 6.0.2026-simulated-web #1 SMP PREEMPT 2026 x86_64 WebAssembly/React GNU/VNX',
      };
    },
  },

  fortune: {
    name: 'fortune',
    description: 'Display a random short developer quote',
    execute: (): CommandResult => {
      const quotes = [
        '“There are only two hard things in Computer Science: cache invalidation and naming things.” — Phil Karlton',
        '“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra',
        '“First, solve the problem. Then, write the code.” — John Johnson',
        '“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” — Martin Fowler',
        '“Experience is the name everyone gives to their mistakes.” — Oscar Wilde',
        '“It’s not a bug – it’s an undocumented feature.”',
        '“Code is like humor. When you have to explain it, it’s bad.” — Cory House',
        '“The best error message is the one that never shows up.”',
        '“Make it work, make it right, make it fast.” — Kent Beck',
        '“Ideas > Code > Impact.” — VNX.OS Philosophy',
      ];
      const selected = quotes[Math.floor(Math.random() * quotes.length)];
      return {
        output: <div className="text-violet-300 italic font-mono text-xs py-1">🔮 {selected}</div>,
      };
    },
  },

  coffee: {
    name: 'coffee',
    description: 'Brew simulated developer fuel',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-1 font-mono text-xs text-amber-300 py-1">
            <div>☕ Brewing a fresh cup of dark roast...</div>
            <div className="text-slate-300">Developer stamina restored to 100%.</div>
            <div className="text-slate-500 text-[11px]">[HTTP 418: I&apos;m a teapot, but I served coffee anyway.]</div>
          </div>
        ),
      };
    },
  },

  vnx: {
    name: 'vnx',
    description: 'Display VNX.OS banner and identity',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-1.5 font-mono text-xs py-1">
            <pre className="text-violet-400 font-bold text-[11px] leading-tight select-none">
{` __     ___   ___  __   ___  ____  
 \\ \\   / / \\ | \\ \\/ /  / _ \\/ ___| 
  \\ \\ / /|  \\| |\\  /  | | | \\___ \\ 
   \\ V / | |\\  |/  \\  | |_| |___) |
    \\_/  |_| \\_/_/\\_\\  \\___/|____/ `}
            </pre>
            <div className="text-white font-bold">VNX.OS v6.0 — Web Operating System &amp; Developer Workspace</div>
            <div className="text-sky-300">Philosophy: IDEAS &gt; CODE &gt; IMPACT</div>
            <div className="text-slate-400">Architect: Vansh Bhura (AI/ML Engineer)</div>
            <div className="text-slate-500 text-[11px]">Stack: React + TypeScript + Framer Motion on Vite</div>
          </div>
        ),
      };
    },
  },

  matrix: {
    name: 'matrix',
    description: 'Trigger terminal falling code visual effect',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="py-2">
            <MatrixRain height={280} />
          </div>
        ),
      };
    },
  },

  sudo: {
    name: 'sudo',
    description: 'Execute a command with simulated root privileges',
    execute: (args: string[]): CommandResult => {
      const targetCmd = args.join(' ');
      return {
        output: (
          <div className="space-y-1 font-mono text-xs text-rose-400 py-1">
            <div>[sudo] password for vansh: ••••••••</div>
            <div>vansh is not in the sudoers file. This incident will be reported to the virtual kernel administrator.</div>
            {targetCmd && <div className="text-slate-500 text-[11px]">Attempted command: {targetCmd}</div>}
          </div>
        ),
      };
    },
  },

  devmode: {
    name: 'devmode',
    description: 'Toggle Developer Mode HUD overlay',
    execute: (): CommandResult => {
      useEasterEggStore.getState().toggleDevModeOverlay();
      return {
        output: <div className="text-sky-400 font-mono text-xs">Developer Mode HUD toggled. Press Esc or Alt+D to exit.</div>,
      };
    },
  },

  developer: {
    name: 'developer',
    description: 'Open the classified Developer Dossier',
    execute: (): CommandResult => {
      useEasterEggStore.getState().openDevModal();
      return {
        output: <div className="text-violet-400 font-mono text-xs">Developer Dossier unlocked.</div>,
      };
    },
  },

  games: {
    name: 'games',
    description: 'Launch VNX.OS Games Center (or games snake|tictactoe|flappy)',
    aliases: ['arcade', 'play'],
    execute: (args: string[]): CommandResult => {
      const sub = (args[0] || '').toLowerCase();
      if (sub === 'snake') {
        const app = getApp('snake');
        if (app) useOSStore.getState().openWindow(app);
        return { output: 'Launching Snake...' };
      }
      if (sub === 'tictactoe' || sub === 'ttt') {
        const app = getApp('tictactoe');
        if (app) useOSStore.getState().openWindow(app);
        return { output: 'Launching Impossible Tic Tac Toe...' };
      }
      if (sub === 'flappy' || sub === 'bird') {
        const app = getApp('flappy');
        if (app) useOSStore.getState().openWindow(app);
        return { output: 'Launching Flappy Bird...' };
      }
      const app = getApp('games');
      if (app) useOSStore.getState().openWindow(app);
      return { output: 'Launching VNX.OS Games Center...' };
    },
  },

  snake: {
    name: 'snake',
    description: 'Launch Snake arcade game',
    execute: (): CommandResult => {
      const app = getApp('snake');
      if (app) useOSStore.getState().openWindow(app);
      return { output: 'Launching Snake...' };
    },
  },

  tictactoe: {
    name: 'tictactoe',
    description: 'Launch Impossible Tic Tac Toe (Minimax)',
    aliases: ['ttt'],
    execute: (): CommandResult => {
      const app = getApp('tictactoe');
      if (app) useOSStore.getState().openWindow(app);
      return { output: 'Launching Impossible Tic Tac Toe...' };
    },
  },

  flappy: {
    name: 'flappy',
    description: 'Launch Flappy Bird',
    aliases: ['flappybird'],
    execute: (): CommandResult => {
      const app = getApp('flappy');
      if (app) useOSStore.getState().openWindow(app);
      return { output: 'Launching Flappy Bird...' };
    },
  },

  ver: {
    name: 'ver',
    description: 'Display simulated OS version',
    execute: (): CommandResult => {
      return { output: 'VNX.OS [Version 6.0.2026.0 - Web Kernel]' };
    },
  },

  getComputerInfo: {
    name: 'Get-ComputerInfo',
    description: 'Display simulated system hardware and OS information',
    execute: (): CommandResult => {
      return {
        output: (
          <div className="space-y-1 font-mono text-xs">
            <div>WindowsProductName  : VNX.OS Browser Workstation</div>
            <div>WindowsVersion      : 2026.0</div>
            <div>TotalPhysicalMemory : 16.00 GB (Simulated)</div>
            <div>Architecture        : x64 / WebAssembly</div>
            <div>CsProcessors        : Client-Side Web Virtual CPU</div>
          </div>
        ),
      };
    },
  },

  exit: {
    name: 'exit',
    description: 'Close the current terminal window',
    execute: (_args: string[], ctx: CommandContext): CommandResult => {
      if (ctx.exit) ctx.exit();
      return { output: 'Session terminated.' };
    },
  },
};
