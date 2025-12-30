import React, { useMemo } from 'react';
import { CommandTerminal } from '../CommandTerminal';
import { WindowControls } from '../WindowControls';
import { activityEntries } from '../../data/activityData';
import { CATEGORIES } from '../../utils/constants';

export const ActivityView = ({ 
  commandInput, 
  setCommandInput, 
  handleKeyDown, 
  commandHistory,
  selectedCategories,
  searchTerm 
}) => {
  // Filter and group activities
  const groupedEntries = useMemo(() => {
    const filtered = activityEntries.filter(entry => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(entry.category);
      const matchesSearch = searchTerm === '' ||
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    const grouped = filtered.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel,
          entries: []
        };
      }
      acc[monthKey].entries.push(entry);
      return acc;
    }, {});

    return Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));
  }, [selectedCategories, searchTerm]);

  const getCategoryColor = (category) => {
    const colorMap = {
      architecture: 'text-cat-architecture',
      project: 'text-cat-project',
      incident: 'text-cat-incident',
      process: 'text-cat-process',
      research: 'text-cat-research'
    };
    return colorMap[category] || 'text-gray-500';
  };

  const getCategoryBgColor = (category) => {
    const colorMap = {
      architecture: 'bg-cat-architecture',
      project: 'bg-cat-project',
      incident: 'bg-cat-incident',
      process: 'bg-cat-process',
      research: 'bg-cat-research'
    };
    return colorMap[category] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-vscode-bg text-vscode-fg font-mono text-sm">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 border-b border-vscode-border pb-4">
          <WindowControls path="~/portfolio/activity" />
          <div className="text-xs text-gray-500">
            <span className="text-syntax-keyword">const</span>{' '}
            <span className="text-syntax-function">session</span>{' '}
            <span className="text-vscode-fg">=</span>{' '}
            <span className="text-syntax-string">'{new Date().toISOString()}'</span>
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

        {/* Active Filters */}
        <div className="mb-6 flex gap-2 flex-wrap text-xs">
          <span className="text-gray-500">Active filters:</span>
          {selectedCategories.map(cat => (
            <span 
              key={cat} 
              className={`px-2 py-1 bg-vscode-card border border-vscode-border ${getCategoryColor(cat)}`}
            >
              {CATEGORIES[cat].label}
            </span>
          ))}
          {searchTerm && (
            <span className="px-2 py-1 bg-vscode-card border border-vscode-border text-syntax-string">
              search: "{searchTerm}"
            </span>
          )}
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-8">
          {groupedEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div>No entries found</div>
              <div className="text-xs mt-2">Use "clear" to reset filters</div>
            </div>
          ) : (
            groupedEntries.map(([monthKey, { label, entries }]) => (
              <div key={monthKey}>
                <div className="mb-4 sticky top-0 bg-vscode-bg py-2 z-10">
                  <div className="text-gray-500 text-xs mb-1">
                    // {monthKey}
                  </div>
                  <div className="text-lg text-syntax-function">
                    <span className="text-syntax-keyword">export</span>{' '}
                    <span className="text-vscode-fg">const</span>{' '}
                    {label.toLowerCase().replace(' ', '_')} = {'{'}
                  </div>
                </div>

                <div className="ml-6 border-l-2 border-vscode-border pl-6 flex flex-col gap-3">
                  {entries.map((entry, idx) => (
                    <div key={idx} className="relative">
                      <div 
                        className={`absolute -left-[29px] top-2 w-2 h-2 rounded-full border-2 border-vscode-bg ${getCategoryBgColor(entry.category)}`}
                      ></div>

                      <div className="bg-vscode-card border border-vscode-border p-4">
                        <div className="mb-2">
                          <div className="text-gray-500 text-xs mb-1">
                            [{entry.date}]{' '}
                            <span className={getCategoryColor(entry.category)}>
                              {CATEGORIES[entry.category].label}
                            </span>
                          </div>
                          <div className="text-vscode-fg font-medium mb-2">
                            {entry.title}
                          </div>
                          <div className="text-gray-500 text-xs leading-relaxed">
                            {entry.description}
                          </div>
                        </div>

                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-3">
                            {entry.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-xs px-2 py-0.5 bg-vscode-bg border border-vscode-border text-syntax-string"
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

                <div className="text-syntax-function text-lg mt-2">
                  {'};'}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-vscode-border text-xs text-gray-500 flex justify-between">
          <span>// EOF</span>
          <span>
            {groupedEntries.reduce((acc, [_, { entries }]) => acc + entries.length, 0)} total entries
          </span>
        </div>
      </div>
    </div>
  );
};
