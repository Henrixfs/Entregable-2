# 03. Requisitos funcionales — SIJASS
| RF | Función | HU | Validación |
|---|---|---|---|
| RF01 | Autenticar y autorizar por rol | HU09 | Prohibir acciones fuera del rol |
| RF02 | Configurar JASS, localidad y reservorio | HU08 | Relaciones consistentes |
| RF03 | Registrar y actualizar asociados | HU05 | Validación de campos y baja lógica |
| RF04 | Registrar cuotas por periodo | HU06 | No duplicar misma operación |
| RF05 | Consultar morosidad | HU07 | Consulta por periodo/asociado |
| RF06 | Capturar imágenes DPD | HU01 | Validar tipo y tamaño |
| RF07 | Estimar cloro con modelo versionado y confianza | HU01 | Valor y modelo registrados |
| RF08 | Confirmar/corregir baja confianza | HU02 | Auditoría de corrección |
| RF09 | Consultar cálculo de dosificación parametrizado | HU03 | Revisión humana obligatoria |
| RF10 | Guardar local y sincronizar lote | HU04 | Idempotencia por UUID |
| RF11 | Generar historial de calidad del agua | HU10 | Fechas, reservorio y autor |
| RF12 | Enviar alertas configurables | HU11 | Registro de envío y reintento |

## Reglas
**RF10:** Un lote reintentado no debe crear registros dobles; si una operación falla, se registra su error sin perder el resto. **RF07:** Una imagen sin calidad suficiente produce resultado inconcluso. **RF09:** El cálculo no representa recomendación sanitaria automática: confirmar parámetros y procedimiento de campo con personal competente.
