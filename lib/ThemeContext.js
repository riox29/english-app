'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ oscuro: false, alternar: () => {} });

export function ThemeProvider({ children }) {
  const [oscuro, setOscuro] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem('tema');
    const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setOscuro(guardado ? guardado === 'oscuro' : prefiereOscuro);
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    document.documentElement.classList.toggle('dark', oscuro);
    localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro');
  }, [oscuro, listo]);

  function alternar() {
    setOscuro((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={{ oscuro, alternar }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}