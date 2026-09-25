# Aprende Inglés en 3 Meses — App con Next.js + Gemini

## ¿Qué hace esta app?

Cada vez que entras a `/leccion`, la página le pide a Gemini que genere
la lección de ese día del plan de 3 meses (12 semanas, de A1 a C1),
según la fecha de inicio que definas.

## Estructura de archivos

```
ingles-app/
├── package.json              → Lista de dependencias del proyecto
├── next.config.mjs           → Configuración de Next.js (vacía, valores por defecto)
├── .env.local.example        → Plantilla para tu API key (copiar y renombrar)
├── .gitignore                → Le dice a Git qué archivos NO subir (como tu API key)
├── app/
│   ├── layout.js             → Plantilla base que envuelve todas las páginas
│   ├── page.js                → Página de inicio ("/")
│   ├── leccion/
│   │   └── page.js            → Página de la lección del día ("/leccion")
│   └── api/
│       └── leccion/
│           └── route.js       → Función del servidor que llama a Gemini
└── lib/
    └── curriculum.js          → El plan de 12 semanas y el prompt para Gemini
```

### Explicación de cada archivo

- **`package.json`**: le dice a Node.js qué librerías necesita instalar
  (Next.js, React, y el SDK de Gemini) y qué comandos existen (`npm run dev`, etc).

- **`next.config.mjs`**: archivo de configuración de Next.js. Aquí lo
  dejamos vacío porque no necesitamos ninguna configuración especial.

- **`app/layout.js`**: es la "plantilla" que envuelve TODAS las páginas
  del sitio (define el `<html>`, el `<body>`, el título de la pestaña, etc).

- **`app/page.js`**: es la página de inicio, la que ve el usuario al
  entrar al dominio principal. Tiene un botón que lleva a `/leccion`.

- **`app/leccion/page.js`**: esta es la página de la lección diaria.
  Cuando se carga, pide los datos a `app/api/leccion/route.js` y los
  muestra: vocabulario, gramática, oraciones de ejemplo y un ejercicio
  interactivo.

- **`app/api/leccion/route.js`**: este archivo NO se ve visualmente,
  es una función que corre en el servidor. Toma el prompt armado en
  `lib/curriculum.js`, se lo envía a Gemini, y devuelve el resultado
  como JSON a la página `leccion/page.js`. Aquí es donde se usa tu
  `GEMINI_API_KEY` de forma segura (nunca se expone al navegador).

- **`lib/curriculum.js`**: contiene dos cosas:
  1. El plan completo de 12 semanas (nivel y tema gramatical de cada una).
  2. Una función que calcula automáticamente en qué día/semana del plan
     estás hoy (según la fecha de inicio que definas), y otra que arma
     el prompt exacto que se le envía a Gemini.

- **`.env.local.example`**: es una plantilla. Debes copiarla y renombrarla
  a `.env.local`, y ahí pegar tu API key real. Este archivo de ejemplo
  SÍ se sube a GitHub (no tiene datos secretos), pero `.env.local` NUNCA
  se sube (está protegido en `.gitignore`).

- **`.gitignore`**: le dice a Git qué carpetas/archivos ignorar al subir
  el proyecto — así tu API key nunca queda pública en GitHub.

## Cómo correrlo en tu computadora (antes de publicarlo)

1. Instala [Node.js](https://nodejs.org) si no lo tienes (versión 18 o más reciente).
2. Abre una terminal dentro de la carpeta `ingles-app`.
3. Instala las dependencias:
   ```
   npm install
   ```
4. Copia el archivo de ejemplo y ponle tu API key real:
   ```
   cp .env.local.example .env.local
   ```
   Luego abre `.env.local` y pega tu key después del signo `=`.
5. Corre el proyecto:
   ```
   npm run dev
   ```
6. Abre tu navegador en `http://localhost:3000`.

## Cómo cambiar la fecha de inicio de tu curso

Abre `lib/curriculum.js` y cambia esta línea con la fecha en la que
quieres que empiece tu plan de 3 meses:

```js
const FECHA_INICIO = '2026-09-16';
```

## Siguiente paso: publicarlo gratis

Cuando quieras subirlo a internet gratis con Vercel:
1. Sube esta carpeta a un repositorio de GitHub.
2. Conecta ese repositorio en vercel.com.
3. En Vercel, ve a Settings → Environment Variables y agrega
   `GEMINI_API_KEY` con tu key real (igual que en `.env.local`, pero
   ahora en el servidor de Vercel).
4. Vercel te da una URL pública gratis.

## Nota sobre el progreso del usuario

Esta versión calcula el día/semana según la fecha del calendario, no
según quién entra. Es la forma más simple de empezar. Más adelante,
si quieres que cada persona tenga su propio progreso guardado (por si
un día no entra y no quieres que se "salte" lecciones), se puede
agregar una base de datos gratuita como Firebase o Supabase — ese
sería el siguiente paso natural del proyecto.
