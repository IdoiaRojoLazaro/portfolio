import React, {useState} from 'react';
import './App.css';
import {ActivityView} from './components/views/ActivityView';
import {ConsoleView} from './components/views/ConsoleView';
import {CVView} from './components/views/CVView';
import {HomeView} from './components/views/HomeView';
import {CATEGORIES} from './utils/constants';
import {useCommands} from './hooks/useCommands';

function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<
    {type: string; text: string}[]
  >([]);

  // Activity filters
  const [selectedCategories, setSelectedCategories] = useState(
    Object.keys(CATEGORIES)
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Command execution hook
  const {executeCommand} = useCommands(
    currentView,
    setCurrentView,
    setCommandHistory,
    setSelectedCategories,
    setSearchTerm
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
    // Opcionalmente puedes agregar un mensaje al historial
    setCommandHistory((prev) => [
      ...prev,
      {type: 'info', text: 'Returned to console. Type "help" for commands.'},
    ]);
  };

  // Render views
  if (currentView === 'home') {
    return <HomeView onComplete={handleVeilComplete} />;
  }

  if (currentView === 'console') {
    return (
      <ConsoleView
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        handleKeyDown={handleKeyDown}
        commandHistory={commandHistory}
      />
    );
  }

  if (currentView === 'cv') {
    return (
      <CVView
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        handleKeyDown={handleKeyDown}
        commandHistory={commandHistory}
        handleNavigateToConsole={handleNavigateToConsole}
      />
    );
  }

  if (currentView === 'activity') {
    return (
      <ActivityView
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        handleKeyDown={handleKeyDown}
        commandHistory={commandHistory}
        selectedCategories={selectedCategories}
        searchTerm={searchTerm}
        handleNavigateToConsole={handleNavigateToConsole}
      />
    );
  }

  return <div>View: {currentView}</div>;
}

export default App;
