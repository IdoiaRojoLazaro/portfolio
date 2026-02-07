import {useEffect, useRef} from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  color: string;
  size: number;
  density: number;
  vx: number;
  vy: number;
  draw(ctx: CanvasRenderingContext2D): void;
  update(): void;
}

interface ParticleTextProps {
  text?: string;
  particleGap?: number;
  particleSize?: number;
  mouseRadius?: number;
  returnSpeed?: number;
  mouseForce?: number;
  colors?: string[];
  fontSize?: number;
  fontFamily?: string;
  className?: string;
}

/**
 * ParticleText Component
 * Interactive particle text effect for React
 */
export const ParticleText = ({
  text = 'IDOIA ROJO',
  particleGap = 4,
  particleSize = 2,
  mouseRadius = 80,
  returnSpeed = 0.05,
  mouseForce = 0.3,
  colors = ['#00ff88', '#00ccff', '#ff00ff', '#ffff00'],
  fontSize = 120,
  fontFamily = 'Arial',
  className = '',
}: ParticleTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{x: number | null; y: number | null; radius: number}>({
    x: null,
    y: null,
    radius: mouseRadius,
  });
  const animationRef = useRef<number | null>(null);

  // Create particle factory (replaces class for proper typing)
  const createParticle = (
    x: number,
    y: number,
    color: string
  ): Particle => {
    const particle: Particle = {
      baseX: x,
      baseY: y,
      x,
      y,
      color,
      size: particleSize,
      density: Math.random() * 30 + 1,
      vx: 0,
      vy: 0,
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      },
      update() {
        const mouse = mouseRef.current;
        const mouseX = mouse.x;
        const mouseY = mouse.y;
        if (mouseX === null || mouseY === null) {
          particle.vx += (particle.baseX - particle.x) * returnSpeed;
          particle.vy += (particle.baseY - particle.y) * returnSpeed;
          particle.vx *= 0.85;
          particle.vy *= 0.85;
          particle.x += particle.vx;
          particle.y += particle.vy;
          return;
        }
        let dx = mouseX - particle.x;
        let dy = mouseY - particle.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * particle.density * mouseForce;
        let directionY = forceDirectionY * force * particle.density * mouseForce;

        if (distance < mouse.radius) {
          particle.vx -= directionX;
          particle.vy -= directionY;
        } else {
          particle.vx += (particle.baseX - particle.x) * returnSpeed;
          particle.vy += (particle.baseY - particle.y) * returnSpeed;
        }

        particle.vx *= 0.85;
        particle.vy *= 0.85;
        particle.x += particle.vx;
        particle.y += particle.vy;
      },
    };
    return particle;
  };

  // Create particles from text
  const createParticles = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    textContent: string
  ) => {
    particlesRef.current = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillText(textContent, centerX, centerY);

    const textCoords = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += particleGap) {
      for (let x = 0; x < canvas.width; x += particleGap) {
        const index = (y * canvas.width + x) * 4;
        const alpha = textCoords.data[index + 3];

        if (alpha > 128) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          particlesRef.current.push(createParticle(x, y, color));
        }
      }
    }

    // Initial animation
    setTimeout(() => {
      particlesRef.current.forEach((particle, i) => {
        setTimeout(() => {
          particle.x = particle.baseX + (Math.random() - 0.5) * 500;
          particle.y = particle.baseY + (Math.random() - 0.5) * 500;
        }, i * 0.5);
      });
    }, 100);
  };

  // Animation loop
  const animate = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particlesRef.current) {
      particle.update();
      particle.draw(ctx);
    }

    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx));
  };

  // Setup canvas and initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles(canvas, ctx, text);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Touch events
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current.x = touch.clientX - rect.left;
        mouseRef.current.y = touch.clientY - rect.top;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Start animation
    animate(canvas, ctx);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    text,
    particleGap,
    particleSize,
    mouseRadius,
    returnSpeed,
    mouseForce,
    fontSize,
    fontFamily,
  ]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};

export default ParticleText;
