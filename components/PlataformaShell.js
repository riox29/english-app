'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function PlataformaShell({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar abierto={menuAbierto} cerrar={() => setMenuAbierto(false)} />
      <div className="flex flex-1 flex-col">
        <TopBar onAbrirMenu={() => setMenuAbierto(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}