'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

const AuthContext = createContext({ usuario: null, cargando: true });

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // onAuthStateChanged "escucha" en tiempo real si alguien inició o cerró sesión
    const dejarDeEscuchar = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });
    return () => dejarDeEscuchar();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

// Esta función la usamos en cualquier página que necesite saber quién inició sesión
export function useAuth() {
  return useContext(AuthContext);
}