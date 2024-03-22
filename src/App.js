import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const BALL_RADIUS = 20;
  const BALL_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

  const canvasRef = useRef(null);
  const [balls, setBalls] = useState([]);
  const [selectedBallIndex, setSelectedBallIndex] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      balls.forEach((ball, index) => {
        const distance = Math.sqrt((mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2);
        if (distance <= BALL_RADIUS) {
          setSelectedBallIndex(index);
        }
      });
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [balls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach(ball => {
        context.beginPath();
        context.arc(ball.x, ball.y, BALL_RADIUS, 0, 2 * Math.PI);
        context.fillStyle = ball.color;
        context.fill();
        context.closePath();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [balls]);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (selectedBallIndex !== null) {
      setBalls(prevBalls =>
        prevBalls.map((ball, index) =>
          index === selectedBallIndex ? { ...ball, x: mouseX, y: mouseY } : ball
        )
      );
    }
  };

  const handleMouseUp = () => {
    setSelectedBallIndex(null);
  };

  const addBall = () => {
    const randomColor = BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)];
    const newBall = {
      x: Math.random() * (canvasRef.current.width - 2 * BALL_RADIUS) + BALL_RADIUS,
      y: Math.random() * (canvasRef.current.height - 2 * BALL_RADIUS) + BALL_RADIUS,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1,
      color: randomColor,
    };
    setBalls(prevBalls => [...prevBalls, newBall]);
  };

  return (
    <div className="billiards-container">
      <canvas
        ref={canvasRef}
        className="billiards-canvas"
        width={800}
        height={600}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="controls">
        <button onClick={addBall}>Add Ball</button>
      </div>
    </div>
  );
}

export default App;
