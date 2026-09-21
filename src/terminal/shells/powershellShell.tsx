import React from 'react';
import type { ShellDefinition, CommandResult } from '../terminalTypes';
import { coreCommands } from '../commandRegistry';
import { toWindowsPath } from '../terminalUtils';

export const powershellShell: ShellDefinition = {
  type: 'powershell',
  name: 'PowerShell',
  title: 'Windows PowerShell',
  formatPrompt: (cwd: string): string => {
    return `PS ${toWindowsPath(cwd)}>`;
  },
  formatCommandNotFound: (cmd: string): string =>
    `${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
  welcomeBanner: (
    <div className="space-y-1 mb-3 text-xs font-mono text-slate-300">
      <div>Windows PowerShell (Simulated Runtime)</div>
      <div>Copyright (C) Microsoft Corporation. All rights reserved. [VNX.OS Environment]</div>
      <div className="text-slate-400">Install the latest PowerShell for new features and improvements! https://microsoft.com/PowerShell</div>
    </div>
  ),
  commands: {
    'get-help': {
      name: 'Get-Help',
      description: 'Displays help for PowerShell cmdlets and topics',
      execute: (): CommandResult => {
        const cmdList = [
          ['Get-Help', 'Displays help information about cmdlets'],
          ['Get-ChildItem', 'Gets the items and child items in a folder (alias: dir, ls)'],
          ['Set-Location', 'Sets the current working location to a specified path (alias: cd)'],
          ['Get-Location', 'Gets information about the current working location (alias: pwd)'],
          ['Get-Content', 'Gets the content of the item at the specified location (alias: cat, type)'],
          ['Write-Output', 'Sends the specified objects down the pipeline (alias: echo)'],
          ['Clear-Host', 'Clears the display in the host program (alias: cls, clear)'],
          ['Get-Date', 'Gets the current date and time'],
          ['Get-ComputerInfo', 'Gets system and operating system properties'],
          ['whoami', 'Displays current domain and username'],
          ['projects', 'Lists technical portfolio projects'],
          ['skills', 'Lists categorized technical skills'],
          ['github', 'Shows GitHub profile and repository links'],
          ['resume', 'Displays resume status and location'],
          ['vnx', 'Displays VNX.OS identity banner'],
          ['neofetch', 'Displays system hardware & software specs'],
          ['coffee', 'Developer fuel'],
          ['fortune', 'Displays random developer quote'],
          ['matrix', 'Triggers digital rain animation'],
          ['devmode', 'Toggles Developer Mode HUD overlay'],
          ['exit', 'Exits the current PowerShell session'],
        ];

        return {
          output: (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="text-cyan-400 font-bold">PowerShell Cmdlets:</div>
              <div className="space-y-0.5 pt-1">
                {cmdList.map(([name, desc]) => (
                  <div key={name} className="flex">
                    <span className="text-amber-300 w-36 font-semibold flex-shrink-0">{name}</span>
                    <span className="text-slate-300">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
      },
    },
    'help': {
      name: 'help',
      description: 'Alias for Get-Help',
      execute: () => powershellShell.commands['get-help'].execute([], null as any),
    },
    'get-childitem': coreCommands.ls,
    'dir': coreCommands.ls,
    'ls': coreCommands.ls,
    'set-location': coreCommands.cd,
    'cd': coreCommands.cd,
    'get-location': coreCommands.pwd,
    'pwd': coreCommands.pwd,
    'get-content': coreCommands.cat,
    'cat': coreCommands.cat,
    'type': coreCommands.cat,
    'write-output': coreCommands.echo,
    'echo': coreCommands.echo,
    'clear-host': coreCommands.clear,
    'clear': coreCommands.clear,
    'cls': coreCommands.clear,
    'get-date': coreCommands.date,
    'date': coreCommands.date,
    'get-computerinfo': coreCommands.getComputerInfo,
    'whoami': coreCommands.whoami,
    'projects': coreCommands.projects,
    'skills': coreCommands.skills,
    'github': coreCommands.github,
    'resume': coreCommands.resume,
    'neofetch': coreCommands.neofetch,
    'uname': coreCommands.uname,
    'fortune': coreCommands.fortune,
    'coffee': coreCommands.coffee,
    'vnx': coreCommands.vnx,
    'matrix': coreCommands.matrix,
    'sudo': coreCommands.sudo,
    'devmode': coreCommands.devmode,
    'developer': coreCommands.developer,
    'exit': coreCommands.exit,
  },
};
