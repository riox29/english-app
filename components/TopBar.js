'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';

export default function TopBar() {
  const { usuario } = useAuth();
  const router = useRouter();

  async function cerrarSesion() {
    await signOut(auth);
    router.push('/login');
  }

  if (!usuario) return null;

  return (
    <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-950">
      <span className="text-sm text-slate-500 dark:text-slate-400">{usuario.email}</span>
      <button
        onClick={cerrarSesion}
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Cerrar sesión
      </button>
    </div>
  );
}