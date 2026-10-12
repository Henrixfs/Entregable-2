import { crearMedicion, type Medicion } from '../dominio/medicion.js';
import type { RepositorioMediciones } from '../dominio/puertos.js';
export class RegistrarMedicionCasoUso {
 constructor(private readonly repositorio: RepositorioMediciones) {}
 async ejecutar(input: Medicion): Promise<Medicion> {
  const med = crearMedicion(input); await this.repositorio.guardar(med); return med;
 }
}
