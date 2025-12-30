// Color palette
export const COLORS = {
  background: '#1E1E1E',
  foreground: '#D4D4D4',
  border: '#3E3E42',
  cardBg: '#252526',
  
  // Syntax highlighting
  keyword: '#569CD6',
  className: '#4EC9B0',
  function: '#4FC1FF',
  variable: '#9CDCFE',
  string: '#CE9178',
  comment: '#6A9955',
  import: '#C586C0',
  
  // UI colors
  success: '#4EC9B0',
  error: '#F48771',
  warning: '#D4A574',
  info: '#569CD6',
  
  // Window controls
  red: '#F48771',
  yellow: '#D4A574',
  green: '#4EC9B0',
  
  // Categories
  architecture: '#D4A574',
  project: '#4EC9B0',
  incident: '#F48771',
  process: '#569CD6',
  research: '#C586C0'
};

// Categories configuration
export const CATEGORIES = {
  architecture: { label: 'architecture', color: COLORS.architecture },
  project: { label: 'project', color: COLORS.project },
  incident: { label: 'incident', color: COLORS.incident },
  process: { label: 'process', color: COLORS.process },
  research: { label: 'research', color: COLORS.research }
};

// Font families
export const FONTS = {
  mono: '"Consolas", "Monaco", "Courier New", monospace',
  sans: 'system-ui, -apple-system, sans-serif'
};
