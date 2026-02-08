import {useState, useEffect, useCallback} from 'react';

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
  completions?: string[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

export const CommandTerminal = ({ commandInput, setCommandInput, handleKeyDown, commandHistory, placeholder, completions = [] }: Props) => {
  const isMobile = useIsMobile();
  const [tabSuggestions, setTabSuggestions] = useState<string[] | null>(null);
  const effectivePlaceholder = isMobile ? 'Type "help"' : (placeholder ?? '');
  const historySlice = isMobile ? commandHistory.slice(-6) : commandHistory.slice(-14);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCommandInput(e.target.value);
      setTabSuggestions(null);
    },
    [setCommandInput]
  );

  const handleKeyDownWithTab = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab' && completions.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        const trimmed = commandInput.trim().toLowerCase();
        const matches = completions.filter((c) => c.toLowerCase().startsWith(trimmed));
        if (matches.length === 1) {
          setCommandInput(matches[0]);
          setTabSuggestions(null);
        } else if (matches.length > 1) {
          const prefix = commonPrefix(matches);
          setCommandInput(prefix);
          setTabSuggestions(matches);
        } else {
          setTabSuggestions(null);
        }
        return;
      }
      setTabSuggestions(null);
      handleKeyDown(e);
    },
    [commandInput, completions, handleKeyDown, setCommandInput]
  );

  return (
  <div className="mb-6 bg-vscode-card border border-vscode-border p-4">
    <div className="flex items-center gap-2 mb-3 min-w-0">
      <span className="text-accent-success shrink-0">➜</span>
      <span className="text-gray-500 shrink-0">~</span>
      <input
        type="text"
        value={commandInput}
        onChange={handleChange}
        onKeyDown={handleKeyDownWithTab}
        placeholder={effectivePlaceholder}
        className="flex-1 min-w-0 w-0 bg-transparent border-none outline-none text-vscode-fg font-mono placeholder-gray-500 text-sm"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    </div>

    {tabSuggestions !== null && tabSuggestions.length > 1 && (
      <div className="text-xs text-gray-500 mb-2">
        Tab: {tabSuggestions.join('  ')}
      </div>
    )}

    {commandHistory.length > 0 && (
      <div className="text-xs overflow-y-auto max-h-24 sm:max-h-48">
        {[...historySlice].reverse().map((item: CommandHistoryItem, idx: number) => (
          <div
            key={`${historySlice.length - 1 - idx}`}
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
};
