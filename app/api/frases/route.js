import { obtenerInfoDia, obtenerDiaActual, construirPromptFrases } from '../../../lib/curriculum';
import { generarConCache } from '../../../lib/generarConCache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const diaParam = searchParams.get('dia');
    const dia = diaParam ? parseInt(diaParam, 10) : obtenerDiaActual();
    const datosDia = obtenerInfoDia(dia);
    const prompt = construirPromptFrases(datosDia);
    const datos = await generarConCache({ coleccion: 'frases', dia: datosDia.dia, prompt });
    return Response.json(datos);
  } catch (error) {
    return Response.json({ error: 'No se pudieron generar las frases: ' + error.message }, { status: 500 });
  }
}