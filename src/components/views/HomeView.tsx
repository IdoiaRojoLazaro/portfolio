import {useState, useEffect, useRef} from 'react';
import {ParticleText} from './ParticleText';

interface HomeViewProps {
  onComplete: () => void;
}

function useResponsiveSize() {
  const [size, setSize] = useState({ fontSize: 120, particleGap: 4, particleSize: 2 });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setSize({ fontSize: 44, particleGap: 3, particleSize: 1.5 });
      } else if (w < 640) {
        setSize({ fontSize: 56, particleGap: 3, particleSize: 1.5 });
      } else {
        setSize({ fontSize: 120, particleGap: 4, particleSize: 2 });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

/**
 * HomeView with particle effect. Tap/click or press SPACE/ENTER to continue.
 */
export const HomeView = ({onComplete}: HomeViewProps) => {
  const [showVeil, setShowVeil] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const { fontSize, particleGap, particleSize } = useResponsiveSize();
  const readyForInteraction = useRef(false);

  const handleTransition = () => {
    if (!readyForInteraction.current) return;
    setShowVeil(false);
    setTimeout(onComplete, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTransition();
      }
    };

    const t = setTimeout(() => {
      readyForInteraction.current = true;
      window.addEventListener('keydown', handleKeyPress);
    }, 200);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      className='relative w-screen h-screen bg-black overflow-hidden cursor-pointer group'
      onClick={handleTransition}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Efecto de partículas */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ParticleText
          text='IDOIA ROJO'
          particleGap={particleGap}
          particleSize={particleSize}
          mouseRadius={100}
          returnSpeed={0.05}
          mouseForce={0.3}
          colors={['#00ff88', '#00ccff', '#ff00ff', '#ffff00']}
          fontSize={fontSize}
          fontFamily='Arial'
        />
      </div>

      {/* Overlay sutil al hacer hover */}
      <div
        className={`absolute inset-0 bg-white/5 transition-opacity duration-300 pointer-events-none ${
          isHovering && showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Instruction text: different copy on mobile (tap) vs desktop (cursor) */}
      <div
        className={`absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-500 px-4 w-full max-w-md ${
          showVeil ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className='flex flex-col items-center gap-2 sm:gap-3'>
          <span className='text-white/60 text-xs sm:text-sm block sm:hidden'>
            Tap anywhere to continue
          </span>
          <span className='text-white/60 text-xs sm:text-sm hidden sm:block'>
            Move the cursor over the text
          </span>
          <div className='flex items-center gap-2 flex-wrap justify-center'>
            <span className='text-green-400 text-sm sm:text-base font-medium animate-pulse'>
              <span className='sm:hidden'>Tap to continue</span>
              <span className='hidden sm:inline'>Click to continue</span>
            </span>
            <span className='text-white/40 text-xs'>or press SPACE</span>
          </div>
          <div className='mt-1 sm:mt-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-green-400/30 flex items-center justify-center animate-ping-slow'>
            <div className='w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-green-400/50' />
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={`absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='flex items-center gap-2 text-white/40 text-xs'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
          <span>System ready</span>
        </div>
      </div>

      {/* Corner accents */}
      <div
        className={`absolute top-2 sm:top-4 left-2 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-t-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute top-2 sm:top-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-t-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 border-l-2 border-b-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 border-r-2 border-b-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

// Agrega esto a tu archivo CSS o Tailwind config para la animación personalizada
// @keyframes ping-slow {
//   0%, 100% { opacity: 1; transform: scale(1); }
//   50% { opacity: 0.5; transform: scale(1.1); }
// }
// .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
