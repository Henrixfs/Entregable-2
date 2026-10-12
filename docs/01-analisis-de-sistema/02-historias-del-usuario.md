# 02. Historias de usuario — SIJASS
| ID | Historia | Prioridad | Aceptación principal |
|---|---|---|---|
| HU01 | Como operador quiero fotografiar DPD y estimar el cloro para evitar lecturas subjetivas. | Must | Estimación incluye confianza |
| HU02 | Como operador quiero corregir lecturas dudosas para asegurar su trazabilidad. | Must | Se guarda valor corregido y autor |
| HU03 | Como operador quiero consultar un cálculo de dosificación validado para apoyar mi trabajo. | Must | Parámetros y versión de regla auditables |
| HU04 | Como operador quiero registrar sin internet y sincronizar más tarde. | Must | No duplicar UUID |
| HU05 | Como tesorero quiero actualizar asociados para mantener el padrón. | Must | Altas y bajas lógicas |
| HU06 | Como tesorero quiero registrar cuotas por periodo para mantener registros. | Must | Constancia y fecha |
| HU07 | Como tesorero quiero ver morosidad por asociado. | Must | Periodos pendientes visibles |
| HU08 | Como consejo quiero registrar JASS y reservorios. | Must | Reservorios asociados a JASS |
| HU09 | Como consejo quiero gestionar usuarios y roles. | Must | Control RBAC |
| HU10 | Como consejo quiero consultar historial de mediciones. | Should | Filtrar fecha y reservorio |
| HU11 | Como consejo quiero alertas por mediciones fuera de límites. | Could | Configuración y bitácora |

## Criterios transversales
Cada operación persistida incluye identificador UUID, fecha, actor y origen. Las operaciones offline muestran estado pendiente, sincronizado o error. La estimación IA es apoyo a la decisión y **no sustituye** una medición validada.
