import React, {useState} from 'react';
import {HomeView} from './components/views/HomeView';
import {ConsoleView} from './components/views/ConsoleView';
import {CVView} from './components/views/CVView';
import {ActivityView} from './components/views/ActivityView';
import {useCommands} from './hooks/useCommands';
import {CATEGORIES} from './utils/constants';
import './App.css'; // Import Tailwind 4 CSS

function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState('home');
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);

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

  const handleKeyDown = (e) => {
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
      />
    );
  }

  return <div>View: {currentView}</div>;
}

export default App;
