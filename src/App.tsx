import {useState, useEffect, useCallback} from 'react';
import './App.css';
import {ActivityView} from './components/views/ActivityView';
import {ConsoleView} from './components/views/ConsoleView';
import {CVView} from './components/views/CVView';
import {HomeView} from './components/views/HomeView';
import {MobileNotice} from './components/MobileNotice';
import {CATEGORIES} from './utils/constants';
import {useCommands} from './hooks/useCommands';

function getViewFromHash(): string {
  const hash = window.location.hash.replace(/^#\/?/, '') || '';
  if (hash === 'cv' || hash === 'activity' || hash === 'console') return hash;
  return 'home';
}

function App() {
  // Navigation state: initial view from URL so /#/cv and /#/activity open directly
  const [currentView, setCurrentViewState] = useState(getViewFromHash);
  const setCurrentView = useCallback((view: string) => {
    setCurrentViewState(view);
    if (view === 'cv' || view === 'activity' || view === 'console') {
      window.location.hash = `#/${view}`;
    } else if (view === 'home') {
      window.location.hash = '';
    }
  }, []);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<
    {type: string; text: string}[]
  >([]);

  // Activity filters
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(CATEGORIES)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<('lead' | 'developer')[]>([]);

  // Command execution hook
  const {executeCommand} = useCommands(
    currentView,
    setCurrentView,
    setCommandHistory,
    setSelectedCategories,
    setSearchTerm,
    setSelectedRoles
  );

  const handleKeyDown = (e: {key: string}) => {
    if (e.key === 'Enter') {
      executeCommand(commandInput, commandHistory);
      setCommandInput('');
    }
  };

  const handleVeilComplete = () => {
    setCurrentView('console');
    setCommandHistory([
      {type: 'success', text: 'Welcome! Type "help" to see available commands'},
    ]);
  };

  // Función para volver a la consola desde cualquier vista
  const handleNavigateToConsole = () => {
    setCurrentView('console');
    setCommandInput('');
    setCommandHistory((prev) => [
      ...prev,
      {type: 'info', text: 'Returned to console. Type "help" for commands.'},
    ]);
  };

  // Keep view in sync with URL (e.g. user edits hash or uses browser back/forward)
  useEffect(() => {
    const onHashChange = () => setCurrentViewState(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleExportActivityLog = useCallback(() => {
    const logContent = [
      '='.repeat(60),
      'TECH LEAD SESSION LOG',
      '='.repeat(60),
      `Session started: ${new Date().toISOString()}`,
      '',
      'COMMAND HISTORY:',
      '-'.repeat(60),
      ...commandHistory.map((h) => `${h.type === 'command' ? '> ' : '  '}${h.text}`),
      '',
      '-'.repeat(60),
      `Total commands executed: ${commandHistory.filter((h) => h.type === 'command').length}`,
      `Session ended: ${new Date().toISOString()}`,
      '='.repeat(60),
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
    setCommandHistory((prev) => [
      ...prev,
      { type: 'command', text: 'export log' },
      { type: 'success', text: 'Session log exported successfully' },
    ]);
  }, [commandHistory]);

  const handleExportActivity = useCallback(
    (payload: {
      entries: { date: string; title: string; category: string; role?: string; description: string; tags: string[] }[];
      isFiltered: boolean;
      selectedCategories: string[];
      selectedRoles: string[];
      searchTerm: string;
    }) => {
      const { entries, isFiltered, selectedCategories, selectedRoles, searchTerm } = payload;
      const lines: string[] = [
        '='.repeat(60),
        'TECH LEAD ACTIVITY LOG',
        '='.repeat(60),
        `Exported: ${new Date().toISOString()}`,
        '',
      ];
      if (isFiltered) {
        lines.push('*** FILTERED EXPORT — NOT THE FULL LIST ***');
        lines.push('');
        lines.push('This file contains only the entries that match the current filters.');
        lines.push(`Entries in this export: ${entries.length}`);
        lines.push('');
        const parts: string[] = [];
        if (selectedCategories.length > 0) parts.push(`Categories: ${selectedCategories.join(', ')}`);
        if (selectedRoles.length > 0) parts.push(`Roles: ${selectedRoles.join(', ')}`);
        if (searchTerm) parts.push(`Search: "${searchTerm}"`);
        if (parts.length) lines.push('Applied filters: ' + parts.join(' | '));
        lines.push('');
        lines.push('To export the full activity log (all entries), clear all filters and export again.');
        lines.push('');
        lines.push('-'.repeat(60));
        lines.push('');
      }
      entries.forEach((entry) => {
        lines.push(`[${entry.date}] ${entry.category}${entry.role ? ` · ${entry.role}` : ''}`);
        lines.push(entry.title);
        lines.push('');
        lines.push(entry.description);
        if (entry.tags?.length) lines.push('Tags: ' + entry.tags.join(', '));
        lines.push('');
        lines.push('-'.repeat(40));
        lines.push('');
      });
      lines.push(`Total entries in this export: ${entries.length}`);
      lines.push('='.repeat(60));
      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}${isFiltered ? '-filtered' : ''}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setCommandHistory((prev) => [
        ...prev,
        { type: 'command', text: 'export activity' },
        { type: 'success', text: isFiltered ? `Exported ${entries.length} filtered entries` : `Exported ${entries.length} entries` },
      ]);
    },
    []
  );

  // Render views
  if (currentView === 'home') {
    return (
      <>
        <HomeView onComplete={handleVeilComplete} />
        <MobileNotice />
      </>
    );
  }

  if (currentView === 'console') {
    return (
      <>
        <ConsoleView
          commandInput={commandInput}
          setCommandInput={setCommandInput}
          handleKeyDown={handleKeyDown}
          commandHistory={commandHistory}
          handleNavigateToConsole={handleNavigateToConsole}
          onNavigateToSection={(section: 'cv' | 'activity') => {
            const cmd = section === 'cv' ? 'show cv' : 'show activity';
            executeCommand(cmd, commandHistory);
            setCommandInput('');
          }}
        />
        <MobileNotice />
      </>
    );
  }

  if (currentView === 'cv') {
    return (
      <>
        <CVView
          commandInput={commandInput}
          setCommandInput={setCommandInput}
          handleKeyDown={handleKeyDown}
          commandHistory={commandHistory}
          handleNavigateToConsole={handleNavigateToConsole}
        />
        <MobileNotice />
      </>
    );
  }

  if (currentView === 'activity') {
    return (
      <>
        <ActivityView
          commandInput={commandInput}
          setCommandInput={setCommandInput}
          handleKeyDown={handleKeyDown}
          commandHistory={commandHistory}
          selectedCategories={selectedCategories}
          searchTerm={searchTerm}
          selectedRoles={selectedRoles}
          handleNavigateToConsole={handleNavigateToConsole}
          onToggleCategory={(category) => {
            setSelectedCategories((prev) => {
              const next = prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category];
              return next;
            });
            setCommandHistory((p) => {
              const next = selectedCategories.includes(category)
                ? selectedCategories.filter((c) => c !== category)
                : [...selectedCategories, category];
              return [
                ...p,
                { type: 'command', text: `filter:${category}` },
                { type: 'success', text: next.length === 0 ? 'Showing all categories' : `Categories: ${next.join(', ')}` },
              ];
            });
          }}
          onToggleRole={(role) => {
            setSelectedRoles((prev) => {
              const next = prev.includes(role)
                ? prev.filter((r) => r !== role)
                : [...prev, role];
              return next;
            });
            setCommandHistory((p) => {
              const next = selectedRoles.includes(role)
                ? selectedRoles.filter((r) => r !== role)
                : [...selectedRoles, role];
              return [
                ...p,
                { type: 'command', text: `role:${role}` },
                { type: 'success', text: next.length === 0 ? 'Showing all roles' : `Roles: ${next.join(', ')}` },
              ];
            });
          }}
          onExportLog={handleExportActivityLog}
          onExportActivity={handleExportActivity}
        />
        <MobileNotice />
      </>
    );
  }

  return <div>View: {currentView}</div>;
}

export default App;
