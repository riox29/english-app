'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../lib/AuthContext';
import { obtenerDiaActual } from '../../../lib/curriculum';
import SelectorDia from '../../../components/SelectorDia';

function LeccionContenido() {
  const { usuario, cargando: cargandoAuth } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const diaSeleccionado = searchParams.get('dia') ? Number(searchParams.get('dia')) : obtenerDiaActual();

  const [leccion, setLeccion] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [completada, setCompletada] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!cargandoAuth && !usuario) router.push('/login');
  }, [cargandoAuth, usuario, router]);

  useEffect(() => {
    setCargando(true);
    setLeccion(null);
    setError(null);
    fetch(`/api/leccion?dia=${diaSeleccionado}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo generar la lección.');
        return res.json();
      })
      .then((data) => {
        setLeccion(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, [diaSeleccionado]);

  useEffect(() => {
    if (usuario && leccion) {
      const referenciaProgreso = doc(db, 'progreso', usuario.uid);
      getDoc(referenciaProgreso).then((snap) => {
        const dias = snap.exists() ? snap.data().diasCompletados || [] : [];
        setCompletada(dias.includes(leccion.dia));
      });
    }
  }, [usuario, leccion]);

  async function marcarCompletada() {
    if (!usuario || !leccion) return;
    setGuardando(true);
    const referenciaProgreso = doc(db, 'progreso', usuario.uid);
    await setDoc(referenciaProgreso, { diasCompletados: arrayUnion(leccion.dia) }, { merge: true });
    setCompletada(true);
    setGuardando(false);
  }

  if (cargandoAuth || !usuario) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Verificando tu sesión...</p>;
  }

  return (
    <div>
      <SelectorDia diaActual={diaSeleccionado} basePath="/leccion" />

      {cargando && <p className="text-sm text-slate-500 dark:text-slate-400">Generando la lección... ⏳</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {leccion && !cargando && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            <span>Mes {leccion.mes} de 3</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Día {leccion.dia}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Nivel {leccion.nivel}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{leccion.titulo_leccion}</h1>

          <Seccion titulo="Vocabulario">
            <ul className="space-y-3">
              {leccion.vocabulario.map((v, i) => (
                <li key={i} className="text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{v.ingles}</span>
                  <span className="text-slate-500 dark:text-slate-400"> — {v.espanol}</span>
                  <div className="italic text-slate-400 dark:text-slate-500">{v.ejemplo}</div>
                </li>
              ))}
            </ul>
          </Seccion>

          <Seccion titulo="Gramática">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{leccion.explicacion_gramatical}</p>
          </Seccion>

          <Seccion titulo="Oraciones de ejemplo">
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {leccion.oraciones_ejemplo.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </Seccion>

          <Seccion titulo={`Ejercicios (${leccion.ejercicios.length})`}>
            <div className="space-y-6">
              {leccion.ejercicios.map((ej, i) => (
                <Ejercicio key={i} numero={i + 1} ejercicio={ej} />
              ))}
            </div>
          </Seccion>

          <button
            onClick={marcarCompletada}
            disabled={completada || guardando}
            className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition ${
              completada ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'
            } disabled:opacity-70`}
          >
            {completada ? '✓ Lección completada' : guardando ? 'Guardando...' : 'Marcar como completada'}
          </button>
        </div>
      )}
    </div>
  );
}

function Seccion({ titulo, children }) {
  return (
    <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{titulo}</h2>
      {children}
    </div>
  );
}

function Ejercicio({ numero, ejercicio }) {
  const [seleccion, setSeleccion] = useState(null);
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">{numero}. {ejercicio.pregunta}</p>
      <div className="space-y-2">
        {ejercicio.opciones.map((op, i) => {
          const esCorrecta = op === ejercicio.respuesta_correcta;
          const estaSeleccionada = seleccion === op;
          return (
            <button
              key={i}
              onClick={() => setSeleccion(op)}
              className={`block w-full rounded-lg border px-4 py-2 text-left text-sm transition ${
                estaSeleccionada
                  ? esCorrecta
                    ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
                    : 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-300'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
            >
              {op}
            </button>
          );
        })}
      </div>
      {seleccion && (
        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {seleccion === ejercicio.respuesta_correcta ? '✓ ¡Correcto!' : `✗ La respuesta correcta era: ${ejercicio.respuesta_correcta}`}
        </p>
      )}
    </div>
  );
}

export default function LeccionPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500 dark:text-slate-400">Cargando...</p>}>
      <LeccionContenido />
    </Suspense>
  );
}