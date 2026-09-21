import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  onClose?: () => void;
  height?: number | string;
}

export default function MatrixRain({ onClose, height = 300 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = typeof height === 'number' ? height : (canvas.parentElement?.clientHeight || 300);
    };

    resize();
    window.addEventListener('resize', resize);

    const chars = '0123456789ABCDEFabcdef$+-*/=%\"\'#&_(),.;:?!\\|{}<>^~日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
    const fontSize = 12;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));

    const draw = () => {
      ctx.fillStyle = 'rgba(12, 13, 20, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      if (columns !== Math.floor(canvas.width / fontSize)) {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -50));
      }

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright tip
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#a7f3d0';
        } else {
          ctx.fillStyle = '#10b981';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Reversible listener on window / keypress
    const handleKey = () => {
      if (onClose) onClose();
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose, height]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: 8,
        overflow: 'hidden',
        background: '#0c0d14',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
        cursor: 'pointer',
      }}
      onClick={onClose}
      title="Click or press any key to exit Matrix mode"
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 12,
          fontSize: 10,
          fontFamily: 'monospace',
          color: '#34d399',
          background: 'rgba(0, 0, 0, 0.75)',
          padding: '2px 8px',
          borderRadius: 4,
          border: '1px solid rgba(52, 211, 153, 0.3)',
          pointerEvents: 'none',
        }}
      >
        Press any key or click to return
      </div>
    </div>
  );
}
