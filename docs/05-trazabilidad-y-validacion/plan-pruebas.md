# Plan de validación — SIJASS
| ID | Tipo | Caso | Resultado esperado |
|---|---|---|---|
| PT01 | Unitario | Medición negativa | Rechazo |
| PT02 | Unitario | Confianza fuera de [0,1] | Rechazo |
| PT03 | Unitario | Persistir medición correcta | Recuperación por ID |
| PT04 | Unitario | Repetir UUID de operación | duplicate; no sobrescribir |
| PT05 | Integración futura | Reconectar tras 100 operaciones | 100 persistidas, 0 pérdidas |
| PT06 | Seguridad futura | Rol tesorero intenta modificar medición | 403 |
| PT07 | Rendimiento futuro | Modelo en Android de gama media | P95 objetivo ≤ 2 s |
| PT08 | Validación IA futura | Muestras con referencia de laboratorio | Evaluar MAE y matriz de confusión |

**Alcance:** PT01–PT04 están preparados en tests ejecutables; PT05–PT08 requieren implementación e infraestructura real.
