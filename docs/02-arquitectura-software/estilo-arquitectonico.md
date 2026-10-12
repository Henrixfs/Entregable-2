# Estilos arquitectónicos combinados
| Estilo | Aplicación | Justificación |
|---|---|---|
| Monolito modular | API NestJS | Menor coste operativo |
| Clean Architecture | Interior de cada módulo | DIP y cambios controlados |
| Offline-first | PWA e IndexedDB | Reservorios sin cobertura |
| Edge inference | ONNX Runtime Web | Clasificación sin internet |
| Eventual consistency | Cola UUID y endpoint sync | Reintentos confiables |
| Servicio independiente | Verificador de IA en Python | Ciclo de modelo distinto |

La sincronización lleva errores aislados por operación; la API responde `accepted`, `duplicate` o `rejected`. No se promete resolución automática de conflictos de actualización simultánea.
