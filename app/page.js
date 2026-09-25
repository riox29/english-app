import Link from 'next/link';
import FondoParticulas from '../components/FondoParticulas';

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <FondoParticulas />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600 dark:bg-brand-600/20 dark:text-indigo-300">
          Plan de 12 semanas
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Domina el inglés, un día a la vez
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          Una lección nueva cada día, generada con inteligencia artificial y
          adaptada a tu nivel — desde lo básico (A1) hasta avanzado (C1).
        </p>
        <Link
          href="/leccion"
          className="mt-8 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          Ver la lección de hoy →
        </Link>
      </div>

      <div className="mt-20 grid gap-6 sm:grid-cols-3">
        {[
          { titulo: 'Estructura clara', texto: '12 semanas organizadas por nivel y tema gramatical.' },
          { titulo: 'Contenido con IA', texto: 'Cada lección se genera con Gemini, sin repetirse.' },
          { titulo: 'Progreso guardado', texto: 'Tu avance queda registrado en tu cuenta.' },
        ].map((item) => (
          <div
            key={item.titulo}
            className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{item.titulo}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.texto}</p>
          </div>
        ))}
           </div>
      </div>
    </main>
  );
}