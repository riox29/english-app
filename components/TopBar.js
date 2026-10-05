'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function TopBar({ onAbrirMenu }) {
  const { usuario } = useAuth();
  const router = useRouter();

  async function cerrarSesion() {
    await signOut(auth);
    router.push('/login');
  }

  if (!usuario) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 sm:justify-end sm:px-8">
      <button
        onClick={onAbrirMenu}
        className="rounded-md p-2 text-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 sm:hidden"
      >
        ☰
      </button>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-500 dark:text-slate-400 sm:inline">
          {usuario.email}
        </span>
        <button
          onClick={cerrarSesion}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}