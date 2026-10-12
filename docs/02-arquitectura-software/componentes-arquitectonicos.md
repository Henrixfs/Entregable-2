# Componentes arquitectónicos
| Componente | Entrada | Salida | Dependencias |
|---|---|---|---|
| CapturaDPD | Imagen | Captura validada | Cámara navegador |
| EstimadorCloro | Imagen validada | Estimación + confianza | ONNX local |
| ConfirmacionManual | Estimación | Medición confirmada | Operador |
| RegistroOffline | Comando | UUID pendiente | IndexedDB |
| Sincronizador | Lote UUID | Estado por elemento | API REST |
| Identidad | Credenciales/rol | Sesión autorizada | API NestJS |
| AsociadosCuotas | Altas y pagos | Padrón y movimientos | PostgreSQL |
| Reportes | Parámetros | Reporte | PostgreSQL |
| VerificadorIA | Lectura/imagen | Verificación posterior | Python FastAPI |

```mermaid
flowchart LR
 CAP[Captura DPD] --> EST[Estimador local ONNX]
 EST --> CON[Confirmación humana]
 CON --> COLA[Cola IndexedDB]
 COLA --> SYNC[Sincronizador]
 SYNC --> API[API modular]
 API --> PG[(PostgreSQL)]
 API -. validación .-> IA[Verificador IA]
```
