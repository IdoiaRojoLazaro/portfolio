import {useState, useEffect} from 'react';
import {ParticleText} from './ParticleText';

interface HomeViewProps {
  onComplete: () => void;
}

/**
 * HomeView con efecto de partículas
 * Cambia de vista al hacer click, presionar SPACE o ENTER
 */
export const HomeView = ({onComplete}: HomeViewProps) => {
  const [showVeil, setShowVeil] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const handleTransition = () => {
    setShowVeil(false);
    // Esperar a que termine la animación antes de llamar onComplete
    setTimeout(onComplete, 1000);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTransition();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
          particleGap={4}
          particleSize={2}
          mouseRadius={100}
          returnSpeed={0.05}
          mouseForce={0.3}
          colors={['#00ff88', '#00ccff', '#ff00ff', '#ffff00']}
          fontSize={120}
          fontFamily='Arial'
        />
      </div>

      {/* Overlay sutil al hacer hover */}
      <div
        className={`absolute inset-0 bg-white/5 transition-opacity duration-300 pointer-events-none ${
          isHovering && showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Texto de instrucción */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-center transition-all duration-500 ${
          showVeil ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className='flex flex-col items-center gap-3'>
          <span className='text-white/60 text-sm'>
            Mueve el cursor sobre el texto
          </span>
          <div className='flex items-center gap-2'>
            <span className='text-green-400 text-base font-medium animate-pulse'>
              Click para continuar
            </span>
            <span className='text-white/40 text-xs'>o presiona SPACE</span>
          </div>
          {/* Indicador visual de click */}
          <div className='mt-2 w-12 h-12 rounded-full border-2 border-green-400/30 flex items-center justify-center animate-ping-slow'>
            <div className='w-8 h-8 rounded-full border-2 border-green-400/50' />
          </div>
        </div>
      </div>

      {/* Indicador de estado */}
      <div
        className={`absolute top-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='flex items-center gap-2 text-white/40 text-xs'>
          <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
          <span>Sistema listo</span>
        </div>
      </div>

      {/* Esquinas decorativas (opcional) */}
      <div
        className={`absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400/30 transition-opacity duration-500 ${
          showVeil ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400/30 transition-opacity duration-500 ${
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
