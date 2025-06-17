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

    const drawStroke = (stroke: Stroke) => {
      ctx.beginPath();
      stroke.path.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(drawStroke);
  }, [strokes]);

  const drawLivePath = (path: Point[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas ||!ctx || path.length < 2) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((s) => {
      ctx.beginPath();
      s.path.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    });

    ctx.beginPath();
    path.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };

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
    const updated = [...currentPath, pos];
    setCurrentPath(updated);
    drawLivePath(updated);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (currentPath.length > 1 && user) {
      const strokeRef = push(ref(db, 'strokes'));
      const newStroke: Stroke = {
        id: strokeRef.key!,
        path: currentPath,
        userId: user.uid,
        timestamp: Date.now(),
      };
      push(ref(db, 'strokes'), newStroke);
    }
    setCurrentPath([]);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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