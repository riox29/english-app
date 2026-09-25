'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../lib/AuthContext';
import { obtenerDiaActual } from '../../../lib/curriculum';
import SelectorDia from '../../../components/SelectorDia';

function HistoriasContenido() {
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
    fetch(`/api/historias?dia=${diaSeleccionado}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudieron generar las historias.');
        return res.json();
      })
      .then((data) => { setDatos(data); setCargando(false); })
      .catch((err) => { setError(err.message); setCargando(false); });
  }, [diaSeleccionado]);

  if (cargandoAuth || !usuario) return null;

  return (
    <div>
      <SelectorDia diaActual={diaSeleccionado} basePath="/historias" />
      <h1 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Stories — Día {diaSeleccionado}</h1>
      {cargando && <p className="text-sm text-slate-500 dark:text-slate-400">Generando historias... ⏳</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {datos && (
        <div className="space-y-6">
          {datos.historias.map((h, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">{h.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{h.texto_ingles}</p>
              <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">{h.resumen_espanol}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoriasPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500 dark:text-slate-400">Cargando...</p>}>
      <HistoriasContenido />
    </Suspense>
  );
}