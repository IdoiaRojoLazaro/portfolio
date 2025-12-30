import React from 'react';
import { useVeilDrag } from '../../hooks/useVeilDrag';

export const HomeView = ({ onComplete }) => {
  const { veilPosition, isDragging, handleMouseDown } = useVeilDrag(onComplete);

  return (
    <div className={`h-screen overflow-hidden relative ${isDragging ? 'cursor-ew-resize' : ''}`}>
      {/* Background - Code */}
      <div className="absolute inset-0 bg-vscode-bg flex items-center justify-center overflow-hidden">
        <CodeBackground />
      </div>

      {/* Veil with Image */}
      <div 
        className="absolute left-0 top-0 h-full overflow-hidden transition-[width] duration-300 ease-out"
        style={{ 
          width: `${veilPosition}%`,
          transition: isDragging ? 'none' : 'width 0.3s ease-out'
        }}
      >
        <VeilContent isDragging={isDragging} />
      </div>

      {/* Draggable Handle */}
      <DraggableHandle 
        veilPosition={veilPosition} 
        isDragging={isDragging} 
        onMouseDown={handleMouseDown} 
      />
    </div>
  );
};

const CodeBackground = () => (
  <div className="max-w-4xl px-12 w-full font-mono text-sm text-vscode-fg leading-relaxed">
    <div className="mb-8">
      <div className="mb-2">
        <span className="text-syntax-import">import</span>{' '}
        <span className="text-vscode-fg">{'{'}</span>{' '}
        <span className="text-syntax-variable">useState</span>
        <span className="text-vscode-fg">,</span>{' '}
        <span className="text-syntax-variable">useEffect</span>{' '}
        <span className="text-vscode-fg">{'}'}</span>{' '}
        <span className="text-syntax-import">from</span>{' '}
        <span className="text-syntax-string">'react'</span>
        <span className="text-vscode-fg">;</span>
      </div>
    </div>

    <div className="mb-6">
      <div className="mb-2">
        <span className="text-syntax-keyword">class</span>{' '}
        <span className="text-syntax-class">Portfolio</span>{' '}
        <span className="text-vscode-fg">{'{'}</span>
      </div>
      <div className="ml-6 mb-2">
        <span className="text-syntax-keyword">constructor</span>
        <span className="text-vscode-fg">() {'{'}</span>
      </div>
      <div className="ml-12 mb-1">
        <span className="text-syntax-keyword">this</span>
        <span className="text-vscode-fg">.</span>
        <span className="text-syntax-variable">sections</span>
        <span className="text-vscode-fg"> = ['cv', 'activity'];</span>
      </div>
      <div className="ml-6 mb-2">
        <span className="text-vscode-fg">{'}'}</span>
      </div>
      <div className="mb-2">
        <span className="text-vscode-fg">{'}'}</span>
      </div>
    </div>

    <div className="mt-8 opacity-50">
      <div className="text-syntax-comment mb-1">// Available commands:</div>
      <div className="text-syntax-comment">// - show cv</div>
      <div className="text-syntax-comment">// - show activity</div>
    </div>
  </div>
);

const VeilContent = ({ isDragging }) => (
  <>
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFE66D" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGradient)" />
      <circle cx="30%" cy="25%" r="120" fill="#FFB6B9" opacity="0.4" />
      <circle cx="70%" cy="40%" r="40" fill="#957DAD" opacity="0.3" />
      <circle cx="50%" cy="70%" r="15" fill="#FFDAC1" opacity="0.7" />
    </svg>

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full max-w-2xl px-12">
      <h1 className="text-7xl font-light mb-6 text-white drop-shadow-lg font-sans tracking-tight">
        Portfolio
      </h1>
      <div className="text-lg text-white/90 mb-12 font-sans font-light">
        Drag to enter →
      </div>
      
      <div 
        className={`inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-sm text-white font-mono ${
          isDragging ? '' : 'animate-pulse-drag'
        }`}
      >
        <span className="text-xl">←</span>
        <span>Drag left to reveal</span>
      </div>
    </div>
  </>
);

const DraggableHandle = ({ veilPosition, isDragging, onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    className="absolute top-0 bottom-0 w-15 cursor-ew-resize z-50 flex items-center justify-center"
    style={{ 
      left: `${veilPosition}%`,
      transform: 'translateX(-30px)'
    }}
  >
    <div 
      className={`w-1 h-20 rounded-sm shadow-lg relative transition-colors ${
        isDragging ? 'bg-accent-success' : 'bg-white/50'
      }`}
      style={{ transition: isDragging ? 'none' : 'background-color 0.2s' }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-2 h-2 bg-white/80 rounded-full"></div>
        ))}
      </div>
    </div>
  </div>
);
