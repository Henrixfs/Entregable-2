import type { Medicion } from './medicion.js';
export interface RepositorioMediciones { guardar(medicion: Medicion): Promise<void>; buscar(id: string): Promise<Medicion | undefined>; }
export interface RepositorioOperaciones { registrar(uuid: string): Promise<'accepted'|'duplicate'>; }
