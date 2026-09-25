import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function generarConCache({ coleccion, dia, prompt }) {
  const idDocumento = `dia_${dia}`;
  const referenciaDoc = doc(db, coleccion, idDocumento);
  const snapshot = await getDoc(referenciaDoc);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Falta configurar la variable GEMINI_API_KEY.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

  const resultado = await model.generateContent(prompt);
  const texto = resultado.response.text();
  const jsonLimpio = texto.replace(/```json/g, '').replace(/```/g, '').trim();
  const datos = JSON.parse(jsonLimpio);

  await setDoc(referenciaDoc, datos);
  return datos;
}