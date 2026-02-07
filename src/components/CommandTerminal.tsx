interface CommandHistoryItem {
  type: string;
  text: string;
}

interface Props {
  commandInput: string;
  setCommandInput: (value: string) => void;
  handleKeyDown: (e: { key: string }) => void;
  commandHistory: CommandHistoryItem[];
  placeholder?: string;
}

export const CommandTerminal = ({ commandInput, setCommandInput, handleKeyDown, commandHistory, placeholder }: Props) => (
  <div className="mb-6 bg-vscode-card border border-vscode-border p-4">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-accent-success">➜</span>
      <span className="text-gray-500">~</span>
      <input
        type="text"
        value={commandInput}
        onChange={(e) => setCommandInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-none outline-none text-vscode-fg font-mono placeholder-gray-500"
        autoFocus
      />
    </div>

    {commandHistory.length > 0 && (
      <div className="text-xs max-h-32 overflow-y-auto">
        {commandHistory.slice(-5).map((item: CommandHistoryItem, idx: number) => (
          <div
            key={idx}
            className={`mb-1 ${
              item.type === 'command' ? 'text-accent-success' :
              item.type === 'error' ? 'text-accent-error' :
              item.type === 'success' ? 'text-accent-success' :
              'text-gray-500'
            }`}
          >
            {item.type === 'command' ? '➜ ' : '  '}
            {item.text}
          </div>
        ))}
      </div>
    )}
  </div>
);
