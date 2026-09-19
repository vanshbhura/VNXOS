import type { ShellType, ShellDefinition, CommandContext, CommandResult } from './terminalTypes';
import { bashShell } from './shells/bashShell';
import { cmdShell } from './shells/cmdShell';
import { powershellShell } from './shells/powershellShell';

export const shellDefinitions: Record<ShellType, ShellDefinition> = {
  bash: bashShell,
  cmd: cmdShell,
  powershell: powershellShell,
};

/**
 * Safely parse a command line string into tokens (arguments),
 * properly handling single and double quoted segments.
 */
export function parseCommandLine(input: string): string[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const tokens: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
      if (inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else {
        inQuotes = true;
        quoteChar = char;
      }
    } else if (/\s/.test(char) && !inQuotes) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

/**
 * Executes a parsed command line in the given shell and context.
 */
export async function executeCommand(
  rawInput: string,
  shellType: ShellType,
  ctx: CommandContext
): Promise<CommandResult> {
  const tokens = parseCommandLine(rawInput);
  if (tokens.length === 0) return {};

  const commandName = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  const shell = shellDefinitions[shellType];
  if (!shell) {
    return { error: `Shell "${shellType}" is not supported.` };
  }

  const cmdDef = shell.commands[commandName];

  if (!cmdDef) {
    return { error: shell.formatCommandNotFound(tokens[0]) };
  }

  try {
    const res = await cmdDef.execute(args, ctx);
    return res || {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Error executing ${tokens[0]}: ${message}` };
  }
}

/**
 * Provide intelligent command and file-path autocomplete suggestions
 */
export function getAutocompleteSuggestions(
  currentInput: string,
  shellType: ShellType,
  ctx: CommandContext
): { completed: string; suggestions?: string[] } {
  const tokens = parseCommandLine(currentInput);
  const shell = shellDefinitions[shellType];
  if (!shell) return { completed: currentInput };

  const endsWithSpace = /\s$/.test(currentInput);

  // 1. If completing command name
  if (tokens.length === 0 || (tokens.length === 1 && !endsWithSpace)) {
    const prefix = (tokens[0] || '').toLowerCase();
    const commandNames = Object.keys(shell.commands);
    const matches = commandNames.filter((name) => name.toLowerCase().startsWith(prefix));

    if (matches.length === 1) {
      return { completed: matches[0] + ' ' };
    }
    if (matches.length > 1) {
      return { completed: currentInput, suggestions: matches };
    }
    return { completed: currentInput };
  }

  // 2. If completing argument (e.g. file or directory name in current directory)
  const currentDirNode = Object.values(ctx.fs.nodes).find((n) => n.path === ctx.cwd);
  if (!currentDirNode) return { completed: currentInput };

  const children = ctx.fs.getChildren(currentDirNode.id);
  const lastToken = endsWithSpace ? '' : tokens[tokens.length - 1];
  const prefix = lastToken.toLowerCase();

  const fileMatches = children
    .map((c) => c.name)
    .filter((name) => name.toLowerCase().startsWith(prefix));

  if (fileMatches.length === 1) {
    const match = fileMatches[0];
    const quote = match.includes(' ') ? '"' : '';
    const replacement = `${quote}${match}${quote}`;

    if (endsWithSpace) {
      return { completed: `${currentInput}${replacement}` };
    } else {
      const parts = currentInput.slice(0, currentInput.length - lastToken.length);
      return { completed: `${parts}${replacement}` };
    }
  }

  if (fileMatches.length > 1) {
    return { completed: currentInput, suggestions: fileMatches };
  }

  return { completed: currentInput };
}
