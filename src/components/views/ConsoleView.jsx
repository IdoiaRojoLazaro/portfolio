import React from 'react';
import { CommandTerminal } from '../CommandTerminal';
import { WindowControls } from '../WindowControls';

export const ConsoleView = ({ commandInput, setCommandInput, handleKeyDown, commandHistory }) => (
  <div className="min-h-screen bg-vscode-bg text-vscode-fg font-mono text-sm">
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 border-b border-vscode-border pb-4">
        <WindowControls path="~/portfolio" />
        <div className="text-xs text-gray-500">
          <span className="text-syntax-keyword">const</span>{' '}
          <span className="text-syntax-function">welcome</span>{' '}
          <span className="text-vscode-fg">=</span>{' '}
          <span className="text-syntax-string">'Type "help" to get started'</span>
          <span className="text-gray-500">;</span>
        </div>
      </div>

      <CommandTerminal
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        handleKeyDown={handleKeyDown}
        commandHistory={commandHistory}
        placeholder='Type "help" to see available commands'
      />

      <div className="mt-12 text-gray-500 text-xs text-center">
        <div className="mb-4">Available sections:</div>
        <div className="flex gap-6 justify-center flex-wrap">
          <div className="text-accent-success">→ show cv</div>
          <div className="text-accent-warning">→ show activity</div>
        </div>
      </div>
    </div>
  </div>
);
