import type { Dispatch, SetStateAction } from 'react';
import { CATEGORIES } from '../utils/constants';

type CommandHistoryItem = { type: string; text: string };

type ActivityRole = 'lead' | 'developer';

export const useCommands = (
  currentView: string,
  setCurrentView: (view: string) => void,
  setCommandHistory: Dispatch<SetStateAction<CommandHistoryItem[]>>,
  setSelectedCategories: (categories: string[] | ((prev: string[]) => string[])) => void,
  setSearchTerm: (term: string) => void,
  setSelectedRoles: (roles: ActivityRole[] | ((prev: ActivityRole[]) => ActivityRole[])) => void
) => {
  const executeConsoleCommand = (trimmed: string, original: string) => {
    if (trimmed === 'help') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  show cv        - Display curriculum vitae' },
        { type: 'output', text: '  show activity  - Display tech lead activity log' },
        { type: 'output', text: '  help           - Show this help' },
        { type: 'output', text: '  clear          - Clear command history' }
      ]);
    } else if (trimmed === 'show cv') {
      setCurrentView('cv');
      setCommandHistory([{ type: 'success', text: 'CV loaded' }]);
    } else if (trimmed === 'show activity') {
      setCurrentView('activity');
      setSelectedCategories(Object.keys(CATEGORIES));
      setSelectedRoles([]);
      setCommandHistory([{ type: 'success', text: 'Activity log loaded' }]);
    } else if (trimmed === 'clear') {
      setCommandHistory([]);
    } else if (trimmed === '') {
      return;
    } else if (trimmed === 'sudo' || trimmed === 'sudo su' || trimmed === 'su') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Nice try. This is a portfolio, not a server 😄' },
        { type: 'output', text: '(You\'re already the only user here.)' }
      ]);
    } else if (trimmed.startsWith('rm ') && (trimmed.includes('-rf') || trimmed.includes('rm -rf'))) {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: 'rm: cannot remove: read-only filesystem.' },
        { type: 'output', text: '(Good instincts to not run that for real.)' }
      ]);
    } else if (trimmed === 'vim' || trimmed === ':wq' || trimmed === ':q!' || trimmed === ':q') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Escape not found.' },
        { type: 'output', text: '(Stuck in vim? Try :wq in real life. Here, you\'re safe.)' }
      ]);
    } else if (trimmed === 'neofetch' || trimmed === 'screenfetch') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: '       idoia@portfolio' },
        { type: 'output', text: '       ---------------' },
        { type: 'output', text: '  OS: Portfolio.js (React)' },
        { type: 'output', text: '  Kernel: 5.x.x-vite' },
        { type: 'output', text: '  Shell: /bin/curious' },
        { type: 'output', text: '  Theme: VS Code Dark' },
        { type: 'output', text: '  Terminal: your browser' }
      ]);
    } else if (trimmed === 'whoami') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'idoia' }
      ]);
    } else if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'ls -l' || trimmed === 'll') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'cv  activity  help  readme  (use show <name>)' }
      ]);
    } else if (trimmed === 'cat readme' || trimmed === 'cat README' || trimmed === 'cat readme.md') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: '# Hi there 👋' },
        { type: 'output', text: 'This portfolio runs on React + Vite. No servers were harmed.' },
        { type: 'output', text: 'Try: show cv, show activity, or help' }
      ]);
    } else if (trimmed === 'exit' || trimmed === 'quit') {
      setCurrentView('home');
      setCommandHistory([]);
    } else if (trimmed === 'hello' || trimmed === 'hello world') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'World! 👋' }
      ]);
    } else if (trimmed === 'fortune') {
      const fortunes = [
        'There are only 10 types of people: those who get binary and those who don\'t.',
        'sudo make me a sandwich → What? Make it yourself.',
        'It works on my machine. (It\'s your machine now.)',
        '// TODO: add more easter eggs'
      ];
      const i = Math.floor(Math.random() * fortunes.length);
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: fortunes[i] }
      ]);
    } else {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` },
        { type: 'output', text: '  (Try: help)' }
      ]);
    }
  };

  const executeCVCommand = (trimmed: string, original: string) => {
    if (trimmed === 'help') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  print          - Print CV' },
        { type: 'output', text: '  export pdf     - Download CV as PDF' },
        { type: 'output', text: '  back           - Return to console' },
        { type: 'output', text: '  help           - Show this help' }
      ]);
    } else if (trimmed === 'print') {
      window.print();
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Opening print dialog...' }
      ]);
    } else if (trimmed === 'export pdf') {
      window.print();
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Opening print dialog... (select "Save as PDF")' }
      ]);
    } else if (trimmed === 'back' || trimmed === 'home') {
      setCurrentView('console');
      setCommandHistory([]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` }
      ]);
    }
  };

  const executeActivityCommand = (trimmed: string, original: string, commandHistory: CommandHistoryItem[]) => {
    if (trimmed === 'help') {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  filter:<category>  - Filter by category (architecture|project|incident|process|research)' },
        { type: 'output', text: '  role:lead|developer|all - Filter by activity role' },
        { type: 'output', text: '  search:<text>      - Search in titles and descriptions' },
        { type: 'output', text: '  show all           - Show all categories' },
        { type: 'output', text: '  clear              - Clear filters' },
        { type: 'output', text: '  export log         - Download session log' },
        { type: 'output', text: '  back               - Return to console' },
        { type: 'output', text: '  help               - Show this help' }
      ]);
    } else if (trimmed === 'clear') {
      setSelectedCategories(Object.keys(CATEGORIES));
      setSearchTerm('');
      setSelectedRoles([]);
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Filters cleared' }
      ]);
    } else if (trimmed === 'show all') {
      setSelectedCategories(Object.keys(CATEGORIES));
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Showing all categories' }
      ]);
    } else if (trimmed === 'back' || trimmed === 'home') {
      setCurrentView('console');
      setCommandHistory([]);
      setSearchTerm('');
      setSelectedRoles([]);
    } else if (trimmed === 'export log') {
      const logContent = [
        '='.repeat(60),
        'TECH LEAD SESSION LOG',
        '='.repeat(60),
        `Session started: ${new Date().toISOString()}`,
        '',
        'COMMAND HISTORY:',
        '-'.repeat(60),
        ...commandHistory.map((h: CommandHistoryItem) => `${h.type === 'command' ? '> ' : '  '}${h.text}`),
        '',
        '-'.repeat(60),
        `Total commands executed: ${commandHistory.filter((h: CommandHistoryItem) => h.type === 'command').length}`,
        `Session ended: ${new Date().toISOString()}`,
        '='.repeat(60)
      ].join('\n');

      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tech-lead-log-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Session log exported successfully' }
      ]);
    } else if (trimmed.startsWith('filter:')) {
      const category = trimmed.replace('filter:', '').trim();
      if (Object.keys(CATEGORIES).includes(category)) {
        setSelectedCategories([category]);
        setCommandHistory((prev) => [...prev,
          { type: 'command', text: original },
          { type: 'success', text: `Filtering by: ${category}` }
        ]);
      } else {
        setCommandHistory((prev) => [...prev,
          { type: 'command', text: original },
          { type: 'error', text: `Invalid category: ${category}` }
        ]);
      }
    } else if (trimmed.startsWith('role:')) {
      const roleArg = trimmed.replace('role:', '').trim();
      if (roleArg === 'all') {
        setSelectedRoles([]);
        setCommandHistory((prev) => [...prev,
          { type: 'command', text: original },
          { type: 'success', text: 'Showing all roles' }
        ]);
      } else if (roleArg === 'lead' || roleArg === 'developer') {
        setSelectedRoles([roleArg]);
        setCommandHistory((prev) => [...prev,
          { type: 'command', text: original },
          { type: 'success', text: `Filtering by role: ${roleArg}` }
        ]);
      } else {
        setCommandHistory((prev) => [...prev,
          { type: 'command', text: original },
          { type: 'error', text: `Invalid role: ${roleArg}. Use lead, developer, or all` }
        ]);
      }
    } else if (trimmed.startsWith('search:')) {
      const term = original.replace(/search:/i, '').trim();
      setSearchTerm(term);
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: `Searching: "${term}"` }
      ]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandHistory((prev) => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` }
      ]);
    }
  };

  const executeCommand = (cmd: string, commandHistory: CommandHistoryItem[]) => {
    const trimmed = cmd.trim().toLowerCase();

    if (currentView === 'console') {
      executeConsoleCommand(trimmed, cmd);
    } else if (currentView === 'cv') {
      executeCVCommand(trimmed, cmd);
    } else if (currentView === 'activity') {
      executeActivityCommand(trimmed, cmd, commandHistory);
    }
  };

  return { executeCommand };
};
