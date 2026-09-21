import React from 'react';
import type { ShellDefinition, CommandDefinition, CommandContext, CommandResult } from '../terminalTypes';
import { coreCommands } from '../commandRegistry';

export const bashShell: ShellDefinition = {
  type: 'bash',
  name: 'VNX Bash',
  title: 'Terminal — bash',
  formatPrompt: (cwd: string): string => {
    let displayPath = cwd;
    if (cwd === '/home/vansh') {
      displayPath = '~';
    } else if (cwd.startsWith('/home/vansh/')) {
      displayPath = '~' + cwd.substring('/home/vansh'.length);
    }
    return `vansh@vnxos:${displayPath}$`;
  },
  formatCommandNotFound: (cmd: string): string => `bash: command not found: ${cmd}`,
  commands: {
    help: {
      name: 'help',
      description: 'Display available bash commands',
      execute: (): CommandResult => {
        const cmdList = [
          ['help', 'Display available commands'],
          ['clear', 'Clear terminal screen (Ctrl+L)'],
          ['ls', 'List directory contents'],
          ['cd [dir]', 'Change working directory'],
          ['pwd', 'Print current directory path'],
          ['cat <file>', 'Display content of text file'],
          ['whoami', 'Print current user identity'],
          ['about', 'Display developer bio & profile'],
          ['projects', 'List portfolio technical projects'],
          ['skills', 'List categorized developer skills'],
          ['experience', 'View professional work experience'],
          ['certificates', 'List verified certificates'],
          ['github', 'Show GitHub profile and repo links'],
          ['resume', 'Display resume status and asset info'],
          ['neofetch', 'Show system architecture & specs'],
          ['uname', 'Simulated system/kernel info'],
          ['fortune', 'Random developer quote'],
          ['coffee', 'Developer fuel'],
          ['vnx', 'VNX.OS identity banner'],
          ['matrix', 'Falling code rain visual effect'],
          ['sudo', 'Execute with simulated root privileges'],
          ['devmode', 'Toggle Developer Mode HUD overlay'],
          ['developer', 'Unlock Developer Dossier'],
          ['date', 'Display current browser date & time'],
          ['echo [text]', 'Print text to terminal'],
          ['history', 'Show command history for session'],
          ['exit', 'Close the terminal window'],
        ];

        return {
          output: (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-violet-400 font-bold">VNX.OS Bash Shell — Available Commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                {cmdList.map(([name, desc]) => (
                  <div key={name} className="flex">
                    <span className="text-sky-300 w-28 font-semibold flex-shrink-0">{name}</span>
                    <span className="text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
      },
    },
    clear: coreCommands.clear,
    ls: coreCommands.ls,
    cd: coreCommands.cd,
    pwd: coreCommands.pwd,
    cat: coreCommands.cat,
    whoami: coreCommands.whoami,
    about: coreCommands.about,
    projects: coreCommands.projects,
    portfolio: coreCommands.projects,
    skills: coreCommands.skills,
    experience: coreCommands.experience,
    certificates: coreCommands.certificates,
    github: coreCommands.github,
    resume: coreCommands.resume,
    neofetch: coreCommands.neofetch,
    uname: coreCommands.uname,
    fortune: coreCommands.fortune,
    coffee: coreCommands.coffee,
    vnx: coreCommands.vnx,
    matrix: coreCommands.matrix,
    sudo: coreCommands.sudo,
    devmode: coreCommands.devmode,
    developer: coreCommands.developer,
    date: coreCommands.date,
    echo: coreCommands.echo,
    history: coreCommands.history,
    exit: coreCommands.exit,
  },
};
