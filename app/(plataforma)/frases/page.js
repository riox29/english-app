'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { obtenerDiaActual } from '../../../lib/curriculum';
import SelectorDia from '../../../components/SelectorDia';

function FrasesContenido() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaSeleccionado = searchParams.get('dia') ? Number(searchParams.get('dia')) : obtenerDiaActual();

  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!cargandoAuth && !usuario) router.push('/login');
  }, [cargandoAuth, usuario, router]);

  useEffect(() => {
    setCargando(true);
    setDatos(null);
    setError(null);
    fetch(`/api/frases?dia=${diaSeleccionado}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron generar las frases.');
        return res.json();
      })
      .then((data) => { setDatos(data); setCargando(false); })
      .catch((err) => { setError(err.message); setCargando(false); });
  }, [diaSeleccionado]);

  if (cargandoAuth || !usuario) return null;

  return (
    <div>
      <SelectorDia diaActual={diaSeleccionado} basePath="/frases" />
      <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Phrases — Día {diaSeleccionado}</h1>
      {cargando && <p className="text-sm text-slate-500 dark:text-slate-400">Generando frases... ⏳</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {datos && (
        <div className="space-y-3">
          {datos.frases.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-white">"{f.frase}"</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.significado}</p>
              <p className="mt-1 text-xs italic text-slate-400 dark:text-slate-500">{f.contexto}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FrasesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500 dark:text-slate-400">Cargando...</p>}>
      <FrasesContenido />
    </Suspense>
  );
}