'use client';

import { useEffect, useRef } from 'react';

const COLORES = ['#818cf8', '#a78bfa', '#38bdf8', '#f472b6', '#34d399'];
const CANTIDAD_PUNTOS = 100;

export default function FondoParticulas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animacionId;

    function ajustarTamano() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    ajustarTamano();
    window.addEventListener('resize', ajustarTamano);

    // Creamos los puntos con posición, velocidad y color aleatorios
    const puntos = Array.from({ length: CANTIDAD_PUNTOS }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radio: Math.random() * 3 + 2,
      velocidadX: (Math.random() - 0.5) * 0.4,
      velocidadY: (Math.random() - 0.5) * 0.4,
      color: COLORES[Math.floor(Math.random() * COLORES.length)],
    }));

    function dibujar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      puntos.forEach((p) => {
        p.x += p.velocidadX;
        p.y += p.velocidadY;

        // Si el punto sale de la pantalla, reaparece del otro lado
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });

      animacionId = requestAnimationFrame(dibujar);
    }
    dibujar();

    return () => {
      cancelAnimationFrame(animacionId);
      window.removeEventListener('resize', ajustarTamano);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}