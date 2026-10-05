'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../lib/ThemeContext';

const RECURSOS = [
  { nombre: 'Vocabulary', ruta: '/vocabulario', color: 'text-red-500' },
  { nombre: 'Phrases', ruta: '/frases', color: 'text-emerald-500' },
  { nombre: 'Stories', ruta: '/historias', color: 'text-sky-500' },
];

export default function Sidebar({ abierto, cerrar }) {
  const pathname = usePathname();
  const { oscuro, alternar } = useTheme();

  return (
    <>
      {/* Fondo oscuro detrás del menú, solo visible en móvil cuando está abierto */}
      {abierto && (
        <div onClick={cerrar} className="fixed inset-0 z-20 bg-black/40 sm:hidden" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 transform flex-col justify-between border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-200 dark:border-indigo-500/10 dark:bg-slate-950 sm:static sm:translate-x-0 ${
          abierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between px-2">
            <h1 className="text-lg font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
              ENGLISH PLATFORM
            </h1>
            <button onClick={cerrar} className="text-slate-400 sm:hidden">✕</button>
          </div>

          <nav className="mt-8 space-y-6">
            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Discover
              </p>
              <Link
                href="/leccion"
                onClick={cerrar}
                className={`mt-2 flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition ${
                  pathname === '/leccion'
                    ? 'bg-slate-100 text-slate-900 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                }`}
              >
                🏠 Home
              </Link>
            </div>

            <div>
              <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Resources
              </p>
              <div className="mt-2 space-y-1">
                {RECURSOS.map((r) => (
                  <Link
                    key={r.ruta}
                    href={r.ruta}
                    onClick={cerrar}
                    className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition ${
                      pathname === r.ruta
                        ? 'bg-slate-100 text-slate-900 dark:bg-indigo-500/10 dark:text-indigo-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900'
                    }`}
                  >
                    <span className={r.color}>●</span> {r.nombre}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <button
          onClick={alternar}
          className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {oscuro ? '☀️ Modo claro' : '🌙 Modo oscuro'}
        </button>
      </aside>
    </>
  );
}