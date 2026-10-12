export interface Medicion { id: string; reservorioId: string; cloroMgL: number; confianza: number; confirmada: boolean; modeloId: string; registradaEn: string; }
export function crearMedicion(input: Medicion): Medicion {
 if (!input.id || !input.reservorioId || !input.modeloId) throw new Error('Identificadores requeridos');
 if (!Number.isFinite(input.cloroMgL) || input.cloroMgL < 0) throw new Error('Cloro inválido');
 if (!Number.isFinite(input.confianza) || input.confianza < 0 || input.confianza > 1) throw new Error('Confianza inválida');
 if (!Number.isFinite(Date.parse(input.registradaEn))) throw new Error('Fecha inválida');
 return Object.freeze({...input});
}
