import React from 'react';
import type { ShellDefinition, CommandResult } from '../terminalTypes';
import { coreCommands } from '../commandRegistry';
import { toWindowsPath } from '../terminalUtils';

export const cmdShell: ShellDefinition = {
  type: 'cmd',
  name: 'Command Prompt',
  title: 'Command Prompt',
  formatPrompt: (cwd: string): string => {
    return `${toWindowsPath(cwd)}>`;
  },
  formatCommandNotFound: (cmd: string): string =>
    `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`,
  welcomeBanner: (
    <div className="space-y-1 mb-3 text-xs font-mono text-slate-300">
      <div>Microsoft Windows [Version 10.0.22631.3000] (Simulated)</div>
      <div>(c) Microsoft Corporation. All rights reserved. [VNX.OS Environment]</div>
    </div>
  ),
  commands: {
    help: {
      name: 'help',
      description: 'Provides help information for Windows commands',
      execute: (): CommandResult => {
        const cmdList = [
          ['HELP', 'Provides help information for commands'],
          ['CLS', 'Clears the screen'],
          ['DIR', 'Displays a list of files and subdirectories in a directory'],
          ['CD', 'Displays the name of or changes the current directory'],
          ['TYPE', 'Displays the contents of a text file'],
          ['ECHO', 'Displays messages on screen'],
          ['WHOAMI', 'Displays current user info'],
          ['VER', 'Displays the simulated Windows/VNX.OS version'],
          ['DATE', 'Displays the date'],
          ['TIME', 'Displays the time'],
          ['PROJECTS', 'Lists portfolio projects'],
          ['SKILLS', 'Lists technical skills'],
          ['GITHUB', 'Displays GitHub repository links'],
          ['EXIT', 'Quits the CMD program'],
        ];

        return {
          output: (
            <div className="space-y-1 font-mono text-xs">
              <div className="text-slate-300">For more information on a specific command, type HELP command-name:</div>
              <div className="space-y-0.5 pt-1">
                {cmdList.map(([name, desc]) => (
                  <div key={name} className="flex">
                    <span className="text-slate-100 w-24 font-bold flex-shrink-0">{name}</span>
                    <span className="text-slate-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
      },
    },
    cls: coreCommands.clear,
    clear: coreCommands.clear,
    dir: coreCommands.ls,
    cd: coreCommands.cd,
    type: coreCommands.cat,
    echo: coreCommands.echo,
    whoami: coreCommands.whoami,
    ver: coreCommands.ver,
    date: coreCommands.date,
    time: coreCommands.time,
    github: coreCommands.github,
    projects: coreCommands.projects,
    skills: coreCommands.skills,
    exit: coreCommands.exit,
  },
};
