import { obtenerInfoDia, obtenerDiaActual, construirPromptLeccion } from '../../../lib/curriculum';
import { generarConCache } from '../../../lib/generarConCache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const diaParam = searchParams.get('dia');
    const dia = diaParam ? parseInt(diaParam, 10) : obtenerDiaActual();
    const datosDia = obtenerInfoDia(dia);
    const prompt = construirPromptLeccion(datosDia);
    const datos = await generarConCache({ coleccion: 'lecciones', dia: datosDia.dia, prompt });
    return Response.json(datos);
  } catch (error) {
    return Response.json({ error: 'No se pudo generar la lección: ' + error.message }, { status: 500 });
  }
}