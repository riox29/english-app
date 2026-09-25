'use client';

import { useRouter } from 'next/navigation';
import { TOTAL_DIAS, DIAS_POR_MES, TOTAL_MESES } from '../lib/curriculum';

export default function SelectorDia({ diaActual, basePath }) {
  const router = useRouter();
  const diasAnteriores = [diaActual - 2, diaActual - 1].filter((d) => d >= 1);

  function irADia(dia) {
    router.push(`${basePath}?dia=${dia}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {diasAnteriores.map((d) => (
        <button
          key={d}
          onClick={() => irADia(d)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Día {d}
        </button>
      ))}

      <span className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white">
        Día {diaActual}
      </span>

      <select
        value={diaActual}
        onChange={(e) => irADia(Number(e.target.value))}
        className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {Array.from({ length: TOTAL_DIAS }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>Día {d}</option>
        ))}
      </select>

      <select
        value={Math.ceil(diaActual / DIAS_POR_MES)}
        onChange={(e) => irADia((Number(e.target.value) - 1) * DIAS_POR_MES + 1)}
        className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
      >
        {Array.from({ length: TOTAL_MESES }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>Mes {m}</option>
        ))}
      </select>
    </div>
  );
}