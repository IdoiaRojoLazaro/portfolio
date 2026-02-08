import {CommandTerminal} from '../CommandTerminal';
import {WindowControls} from '../WindowControls';
import {PATH_CONSOLE} from '../../utils/constants';

interface CommandHistoryItem {
  type: string;
  text: string;
}

interface Props {
  commandInput: string;
  setCommandInput: (value: string | ((prev: string) => string)) => void;
  handleKeyDown: (e: {key: string}) => void;
  commandHistory: CommandHistoryItem[];
  handleNavigateToConsole: () => void;
  onNavigateToSection: (section: 'cv' | 'activity') => void;
}

export const ConsoleView = ({
  commandInput,
  setCommandInput,
  handleKeyDown,
  commandHistory,
  handleNavigateToConsole,
  onNavigateToSection,
}: Props) => (
  <div className='min-h-screen bg-vscode-bg text-vscode-fg font-mono text-sm'>
    <div className='max-w-6xl mx-auto px-6 py-8'>
      <div className='mb-6 border-b border-vscode-border pb-4'>
        <WindowControls
          path={PATH_CONSOLE}
          handleNavigateToConsole={handleNavigateToConsole}
        />
        <div className='text-xs text-gray-500'>
          <span className='text-syntax-keyword'>const</span>{' '}
          <span className='text-syntax-function'>welcome</span>{' '}
          <span className='text-vscode-fg'>=</span>{' '}
          <span className='text-syntax-string'>
            'Type "help" to get started'
          </span>
          <span className='text-gray-500'>;</span>
        </div>
      </div>

      <CommandTerminal
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        handleKeyDown={handleKeyDown}
        commandHistory={commandHistory}
        placeholder='Type "help" to see available commands'
        completions={[
          'help',
          'clear',
          'show cv',
          'show activity',
          'neofetch',
          'whoami',
          'ls',
          'cat readme',
          'exit',
          'hello',
          'hello world',
          'fortune',
          'sudo',
          'vim',
          ':wq',
        ]}
      />

      <div className='mt-12 text-gray-500 text-xs text-center'>
        <div className='mb-4'>Available sections:</div>
        <div className='flex gap-6 justify-center flex-wrap items-center mb-4'>
          <button
            type='button'
            onClick={() => onNavigateToSection('cv')}
            className='px-3 py-1.5 border border-vscode-border bg-vscode-card text-accent-success cursor-pointer hover:bg-vscode-border/50 transition-colors'
            title='Go to CV'
          >
            → show cv
          </button>
          <button
            type='button'
            onClick={() => onNavigateToSection('activity')}
            className='px-3 py-1.5 border border-vscode-border bg-vscode-card text-accent-warning cursor-pointer hover:bg-vscode-border/50 transition-colors'
            title='Go to activity log'
          >
            → show activity
          </button>
        </div>
        <div className='text-gray-600'>
          // Try: neofetch, whoami, ls, fortune, exit, vim, :wq
        </div>
      </div>
    </div>
  </div>
);
