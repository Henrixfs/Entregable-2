import type { Medicion } from '../dominio/medicion.js';
import type { RepositorioMediciones, RepositorioOperaciones } from '../dominio/puertos.js';
export class MedicionesMemoria implements RepositorioMediciones {
 private readonly items = new Map<string, Medicion>();
 async guardar(m: Medicion): Promise<void> { if(this.items.has(m.id)) throw new Error('Medición duplicada'); this.items.set(m.id,m); }
 async buscar(id: string): Promise<Medicion | undefined> { return this.items.get(id); }
}
export class OperacionesMemoria implements RepositorioOperaciones {
 private readonly uuids = new Set<string>();
 async registrar(uuid: string): Promise<'accepted'|'duplicate'> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) throw new Error('UUID inválido');
  if (this.uuids.has(uuid)) return 'duplicate'; this.uuids.add(uuid); return 'accepted';
 }
}
