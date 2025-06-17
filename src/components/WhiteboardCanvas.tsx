/*import React, { useRef, useEffect, useState } from 'react';

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
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setMode('draw')} style={{ marginRight: '0.5rem' }}>
          ✏️ Draw Mode
        </button>
        <button onClick={() => setMode('erase')}>🧽 Erase Mode</button>
      </div>

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

export default WhiteboardCanvas;*/

import React, { useRef, useEffect, useState } from 'react';
import { getDatabase, ref, push, onChildAdded } from 'firebase/database';
import { getAuth } from 'firebase/auth';

type Point = { x: number; y: number };

type Stroke = {
  id: string;
  path: Point[];
  userId: string;
  timestamp: number;
};

const WhiteboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);

  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();

  useEffect(() => {
    const strokesRef = ref(db, 'strokes');
    onChildAdded(strokesRef, (snapshot) => {
      const stroke = snapshot.val();
      setStrokes((prev) => [...prev, stroke]);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Draw all strokes
    strokes.forEach((stroke) => {
      ctx.beginPath();
      stroke.path.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = '#000';
      ctx.stroke();
    });
  }, [strokes]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const pos = getMousePos(e);
    setCurrentPath([pos]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    setCurrentPath((prev) => [...prev, pos]);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (currentPath.length > 1 && user) {
      const newStroke: Stroke = {
        id: push(ref(db, 'strokes')).key!,
        path: currentPath,
        userId: user.uid,
        timestamp: Date.now(),
      };
      push(ref(db, 'strokes'), newStroke);
      setCurrentPath([]);
    }
  };

  return (
    <div>
      <h2>Whiteboard</h2>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          border: '2px solid #ccc',
          backgroundColor: '#fff',
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

export default WhiteboardCanvas;

