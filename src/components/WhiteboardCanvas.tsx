import React, { useRef, useEffect, useState } from 'react';

const WhiteboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 400;

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e: MouseEvent) => {
      const { x, y } = getMousePos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
      setDrawing(true);
    };

    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      const { x, y } = getMousePos(e);

      if (mode === 'draw') {
        ctx.strokeStyle = '#000'; // black ink
        ctx.globalCompositeOperation = 'source-over'; // normal drawing
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.globalCompositeOperation = 'destination-over'; 
      }

      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [drawing, mode]);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* 🎛 Mode toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMode('draw')} style={{ marginRight: '0.5rem' }}>
          ✏️ Draw Mode
        </button>
        <button onClick={() => setMode('erase')}>🧽 Erase Mode</button>
      </div>

      {/* 🧑‍🏫 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #ccc',
          backgroundColor: '#fff',
          display: 'block',
          margin: '0 auto',
          cursor: mode === 'erase' ? 'crosshair' : 'pointer',
        }}
      />
    </div>
  );
};

export default WhiteboardCanvas;
