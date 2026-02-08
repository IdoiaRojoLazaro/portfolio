import {useMemo, useState, useEffect} from 'react';
import {activityEntries} from '../../data/activityData';
import {PATH_CONSOLE, CATEGORIES, ACTIVITY_ROLES} from '../../utils/constants';
import {CommandTerminal} from '../CommandTerminal';
import {WindowControls} from '../WindowControls';

type CategoryKey = keyof typeof CATEGORIES;

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

const DESCRIPTION_PREVIEW_LENGTH = 120;

interface ActivityEntry {
  date: string;
  title: string;
  category: string;
  role?: 'lead' | 'developer';
  description: string;
  tags: string[];
}

interface GroupedMonth {
  label: string;
  entries: ActivityEntry[];
}

interface Props {
  commandInput: string;
  setCommandInput: (value: string | ((prev: string) => string)) => void;
  handleKeyDown: (e: { key: string }) => void;
  commandHistory: {type: string; text: string}[];
  selectedCategories: string[];
  searchTerm: string;
  selectedRoles: ('lead' | 'developer')[];
  handleNavigateToConsole: () => void;
  onToggleCategory: (category: string) => void;
  onToggleRole: (role: 'lead' | 'developer') => void;
  onExportLog: () => void;
  onExportActivity: (payload: {
    entries: ActivityEntry[];
    isFiltered: boolean;
    selectedCategories: string[];
    selectedRoles: string[];
    searchTerm: string;
  }) => void;
}

export const ActivityView = ({
  commandInput,
  setCommandInput,
  handleKeyDown,
  commandHistory,
  selectedCategories,
  searchTerm,
  selectedRoles,
  handleNavigateToConsole,
  onToggleCategory,
  onToggleRole,
  onExportLog,
  onExportActivity,
}: Props) => {
  // Filter and group activities
  const groupedEntries = useMemo(() => {
    const filtered = activityEntries.filter((entry) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(entry.category);
      const matchesRole =
        selectedRoles.length === 0 ||
        (entry.role != null && selectedRoles.includes(entry.role));
      const matchesSearch =
        searchTerm === '' ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesRole && matchesSearch;
    });

    const grouped = filtered.reduce<Record<string, GroupedMonth>>((acc, entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel,
          entries: [],
        };
      }
      acc[monthKey].entries.push(entry);
      return acc;
    }, {});

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [selectedCategories, selectedRoles, searchTerm]);

  const flatFilteredEntries = useMemo(
    () => groupedEntries.flatMap(([, month]) => month.entries),
    [groupedEntries]
  );

  const isFiltered =
    (selectedCategories.length > 0 && selectedCategories.length < (Object.keys(CATEGORIES) as CategoryKey[]).length) ||
    selectedRoles.length > 0 ||
    searchTerm !== '';

  const handleExportActivityClick = () => {
    onExportActivity({
      entries: flatFilteredEntries.map((e) => ({
        ...e,
        role: e.role,
      })),
      isFiltered,
      selectedCategories,
      selectedRoles,
      searchTerm,
    });
  };

  const isMobile = useIsMobile();
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(() => new Set());

  const toggleDescription = (key: string) => {
    setExpandedDescriptions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      architecture: 'text-cat-architecture',
      project: 'text-cat-project',
      incident: 'text-cat-incident',
      process: 'text-cat-process',
      research: 'text-cat-research',
    };
    return colorMap[category] ?? 'text-gray-500';
  };

  const getCategoryBgColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      architecture: 'bg-cat-architecture',
      project: 'bg-cat-project',
      incident: 'bg-cat-incident',
      process: 'bg-cat-process',
      research: 'bg-cat-research',
    };
    return colorMap[category] ?? 'bg-gray-500';
  };

  return (
    <div className='min-h-screen bg-vscode-bg text-vscode-fg font-mono text-sm'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <div className='mb-6 border-b border-vscode-border pb-4'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div>
              <WindowControls
                path={`${PATH_CONSOLE}/activity`}
                handleNavigateToConsole={handleNavigateToConsole}
              />
              <div className='text-xs text-gray-500 mt-1'>
            <span className='text-syntax-keyword'>const</span>{' '}
            <span className='text-syntax-function'>session</span>{' '}
            <span className='text-vscode-fg'>=</span>{' '}
            <span className='text-syntax-string'>
              '{new Date().toISOString()}'
            </span>
            <span className='text-gray-500'>;</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <button
                type='button'
                onClick={onExportLog}
                className='px-3 py-1.5 border border-vscode-border bg-vscode-card text-vscode-fg text-xs font-mono hover:bg-vscode-border/50 transition-colors cursor-pointer'
              >
                Export logs
              </button>
              <button
                type='button'
                onClick={handleExportActivityClick}
                className='px-3 py-1.5 border border-vscode-border bg-vscode-card text-vscode-fg text-xs font-mono hover:bg-vscode-border/50 transition-colors cursor-pointer'
              >
                Export activity
              </button>
            </div>
          </div>
        </div>

        <CommandTerminal
          commandInput={commandInput}
          setCommandInput={setCommandInput}
          handleKeyDown={handleKeyDown}
          commandHistory={commandHistory}
          placeholder='Type "help" for filter and search commands'
          completions={[
            'help', 'clear', 'show all', 'back', 'home', 'export log',
            ...(Object.keys(CATEGORIES) as CategoryKey[]).map((c) => `filter:${c}`),
            'role:lead', 'role:developer', 'role:all',
            'search:'
          ]}
        />

        {/* Categories: active = selected (click to toggle). None selected = show all. */}
        <div className='mb-3 flex gap-2 flex-wrap items-center text-xs'>
          <span className='text-gray-500'>Categories:</span>
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => {
            const isActive = selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                type='button'
                onClick={() => {
                  setCommandInput(`filter:${cat}`);
                  onToggleCategory(cat);
                }}
                className={`px-2 py-1 border cursor-pointer transition-colors ${
                  isActive
                    ? `border-current ${getCategoryColor(cat)} bg-transparent`
                    : 'bg-transparent border-gray-600 text-gray-500'
                }`}
              >
                {CATEGORIES[cat].label}
              </button>
            );
          })}
        </div>

        {/* Roles: active = selected (click to toggle). None selected = show all. */}
        <div className='mb-6 flex gap-2 flex-wrap items-center text-xs'>
          <span className='text-gray-500'>Role:</span>
          {(Object.keys(ACTIVITY_ROLES) as ('lead' | 'developer')[]).map((role) => {
            const isActive = selectedRoles.includes(role);
            return (
              <button
                key={role}
                type='button'
                onClick={() => {
                  setCommandInput(`role:${role}`);
                  onToggleRole(role);
                }}
                className={`px-2 py-1 border cursor-pointer transition-colors ${
                  isActive ? 'bg-transparent border-current' : 'bg-transparent border-gray-600 text-gray-500'
                }`}
                style={isActive ? { color: ACTIVITY_ROLES[role].color, borderColor: ACTIVITY_ROLES[role].color } : undefined}
              >
                {ACTIVITY_ROLES[role].label}
              </button>
            );
          })}
        </div>

        {searchTerm && (
          <div className='mb-6 flex gap-2 flex-wrap items-center text-xs'>
            <span className='text-gray-500'>Search:</span>
            <span className='px-2 py-1 bg-vscode-card border border-vscode-border text-syntax-string'>
              "{searchTerm}"
            </span>
          </div>
        )}

        {/* Timeline */}
        <div className='flex flex-col gap-8'>
          {groupedEntries.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              <div>No entries found</div>
              <div className='text-xs mt-2'>Use "clear" to reset filters</div>
            </div>
          ) : (
            groupedEntries.map(([monthKey, monthData]: [string, GroupedMonth]) => (
              <div key={monthKey}>
                <div className='mb-4 sticky top-0 bg-vscode-bg py-2 z-10'>
                  <div className='text-gray-500 text-xs mb-1'>
                    // {monthKey}
                  </div>
                  <div className='text-lg text-syntax-function'>
                    <span className='text-syntax-keyword'>export</span>{' '}
                    <span className='text-vscode-fg'>const</span>{' '}
                    {monthData.label.toLowerCase().replace(' ', '_')} = {'{'}
                  </div>
                </div>

                <div className='ml-6 border-l-2 border-vscode-border pl-6 flex flex-col gap-3'>
                  {monthData.entries.map((entry: ActivityEntry, idx: number) => (
                    <div key={idx} className='relative'>
                      <div
                        className={`absolute -left-[29px] top-2 w-2 h-2 rounded-full border-2 border-vscode-bg ${getCategoryBgColor(
                          entry.category
                        )}`}
                      ></div>

                      <div className='bg-vscode-card border border-vscode-border p-4'>
                        <div className='mb-2'>
                          <div className='text-gray-500 text-xs mb-1 flex flex-wrap items-center gap-x-2'>
                            <span>[{entry.date}]</span>
                            <span className={getCategoryColor(entry.category)}>
                              {entry.category in CATEGORIES ? CATEGORIES[entry.category as CategoryKey].label : entry.category}
                            </span>
                            {entry.role && entry.role in ACTIVITY_ROLES && (
                              <>
                                <span className='text-vscode-border'>·</span>
                                <span
                                  className='font-medium'
                                  style={{ color: ACTIVITY_ROLES[entry.role as keyof typeof ACTIVITY_ROLES].color }}
                                >
                                  {ACTIVITY_ROLES[entry.role as keyof typeof ACTIVITY_ROLES].label}
                                </span>
                              </>
                            )}
                          </div>
                          <div className='text-vscode-fg font-medium mb-2'>
                            {entry.title}
                          </div>
                          {isMobile ? (
                            <div className='text-gray-500 text-xs leading-relaxed'>
                              {(() => {
                                const key = `${monthKey}-${idx}`;
                                const isExpanded = expandedDescriptions.has(key);
                                const needsCollapse = entry.description.length > DESCRIPTION_PREVIEW_LENGTH;
                                const text = needsCollapse && !isExpanded
                                  ? `${entry.description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}…`
                                  : entry.description;
                                return (
                                  <>
                                    {text}
                                    {needsCollapse && (
                                      <button
                                        type='button'
                                        onClick={() => toggleDescription(key)}
                                        className='ml-1 text-accent-success hover:underline focus:outline-none'
                                      >
                                        {isExpanded ? 'Show less' : 'Read more'}
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          ) : (
                            <div className='text-gray-500 text-xs leading-relaxed'>
                              {entry.description}
                            </div>
                          )}
                        </div>

                        {entry.tags && entry.tags.length > 0 && (
                          <div className='flex gap-2 flex-wrap mt-3'>
                            {entry.tags.map((tag: string, tagIdx: number) => (
                              <span
                                key={tagIdx}
                                className='text-xs px-2 py-0.5 bg-vscode-bg border border-vscode-border text-syntax-string'
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='text-syntax-function text-lg mt-2'>{'};'}</div>
              </div>
            ))
          )}
        </div>

        <div className='mt-12 pt-6 border-t border-vscode-border text-xs text-gray-500 flex justify-between'>
          <span>// EOF</span>
          <span>
            {groupedEntries.reduce(
              (acc: number, [_key, monthData]: [string, GroupedMonth]) => acc + monthData.entries.length,
              0
            )}{' '}
            total entries
          </span>
        </div>
      </div>
    </div>
  );
};
