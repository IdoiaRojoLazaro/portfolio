import { CATEGORIES } from '../utils/constants';

export const useCommands = (currentView, setCurrentView, setCommandHistory, setSelectedCategories, setSearchTerm) => {
  
  const executeConsoleCommand = (trimmed, original) => {
    if (trimmed === 'help') {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  show cv        - Display curriculum vitae' },
        { type: 'output', text: '  show activity  - Display tech lead activity log' },
        { type: 'output', text: '  help           - Show this help' },
        { type: 'output', text: '  clear          - Clear command history' }
      ]);
    } else if (trimmed === 'show cv') {
      setCurrentView('cv');
      setCommandHistory([{ type: 'success', text: 'Loading CV...' }]);
    } else if (trimmed === 'show activity') {
      setCurrentView('activity');
      setSelectedCategories(Object.keys(CATEGORIES));
      setCommandHistory([{ type: 'success', text: 'Loading activity log...' }]);
    } else if (trimmed === 'clear') {
      setCommandHistory([]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` }
      ]);
    }
  };

  const executeCVCommand = (trimmed, original) => {
    if (trimmed === 'help') {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  print          - Print CV' },
        { type: 'output', text: '  export pdf     - Download CV as PDF' },
        { type: 'output', text: '  back           - Return to console' },
        { type: 'output', text: '  help           - Show this help' }
      ]);
    } else if (trimmed === 'print') {
      window.print();
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Opening print dialog...' }
      ]);
    } else if (trimmed === 'export pdf') {
      window.print();
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Opening print dialog... (select "Save as PDF")' }
      ]);
    } else if (trimmed === 'back' || trimmed === 'home') {
      setCurrentView('console');
      setCommandHistory([]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` }
      ]);
    }
  };

  const executeActivityCommand = (trimmed, original, commandHistory) => {
    if (trimmed === 'help') {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  filter:<category>  - Filter by category (architecture|project|incident|process|research)' },
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
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Filters cleared' }
      ]);
    } else if (trimmed === 'show all') {
      setSelectedCategories(Object.keys(CATEGORIES));
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Showing all categories' }
      ]);
    } else if (trimmed === 'back' || trimmed === 'home') {
      setCurrentView('console');
      setCommandHistory([]);
      setSearchTerm('');
    } else if (trimmed === 'export log') {
      const logContent = [
        '='.repeat(60),
        'TECH LEAD SESSION LOG',
        '='.repeat(60),
        `Session started: ${new Date().toISOString()}`,
        '',
        'COMMAND HISTORY:',
        '-'.repeat(60),
        ...commandHistory.map(h => `${h.type === 'command' ? '> ' : '  '}${h.text}`),
        '',
        '-'.repeat(60),
        `Total commands executed: ${commandHistory.filter(h => h.type === 'command').length}`,
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

      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: 'Session log exported successfully' }
      ]);
    } else if (trimmed.startsWith('filter:')) {
      const category = trimmed.replace('filter:', '').trim();
      if (Object.keys(CATEGORIES).includes(category)) {
        setSelectedCategories([category]);
        setCommandHistory(prev => [...prev,
          { type: 'command', text: original },
          { type: 'success', text: `Filtering by: ${category}` }
        ]);
      } else {
        setCommandHistory(prev => [...prev,
          { type: 'command', text: original },
          { type: 'error', text: `Invalid category: ${category}` }
        ]);
      }
    } else if (trimmed.startsWith('search:')) {
      const term = original.replace(/search:/i, '').trim();
      setSearchTerm(term);
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'success', text: `Searching: "${term}"` }
      ]);
    } else if (trimmed === '') {
      return;
    } else {
      setCommandHistory(prev => [...prev,
        { type: 'command', text: original },
        { type: 'error', text: `Command not recognized: "${original}". Type "help" for available commands` }
      ]);
    }
  };

  const executeCommand = (cmd, commandHistory) => {
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
