# 08. Escenarios de atributos de calidad — SIJASS
Cada escenario identifica **fuente, estímulo, entorno, artefacto, respuesta y medida**.

## EC-01 Trabajo desconectado (RNF01)
- Fuente: Operador de reservorio.
- Estímulo: Pierde conectividad al registrar medición y pago.
- Entorno: Android con PWA instalada, caché precargado.
- Artefacto: PWA + IndexedDB.
- Respuesta: Operaciones pendientes con UUID local; se mantienen luego de reiniciar.
- Medida: 0 pérdidas en 100 operaciones simuladas y reinicio.

## EC-02 Idempotencia (RNF04)
- Fuente: Red intermitente.
- Estímulo: El mismo lote se envía tres veces.
- Entorno: API y base de datos disponibles.
- Artefacto: Endpoint POST /sync.
- Respuesta: Registra una vez cada UUID y responde resultado por operación.
- Medida: 0 duplicados tras 3 reintentos.

## EC-03 Seguridad (RNF05)
- Fuente: Usuario con rol tesorero.
- Estímulo: Intenta modificar lectura de cloro ajena a su rol.
- Entorno: Sesión válida.
- Artefacto: API y políticas RBAC.
- Respuesta: HTTP 403, auditoría del rechazo.
- Medida: 100 % acciones restringidas rechazadas.

## EC-04 Exactitud IA (RNF03)
- Fuente: Operador en luz variable.
- Estímulo: Fotografía DPD con incertidumbre elevada.
- Entorno: Android sin red.
- Artefacto: Modelo ONNX y flujo de confirmación.
- Respuesta: Presentar confianza; pedir repetición o revisión, no afirmar un valor seguro.
- Medida: evaluación prospectiva en banco etiquetado antes de uso real.

## EC-05 Mantenibilidad (RNF07)
- Fuente: Equipo de desarrollo.
- Estímulo: Añadir reporte de fugas.
- Entorno: Código versionado.
- Artefacto: Módulos de negocio.
- Respuesta: Nuevo caso de uso/adaptador sin editar entidades existentes.
- Medida: tests previos continúan pasando.

## EC-06 Rendimiento (RNF02)
- Fuente: Operador.
- Estímulo: Procesar fotografía ya capturada.
- Entorno: Teléfono Android de gama media definido en protocolo.
- Artefacto: Motor ONNX Web.
- Respuesta: Inferencia local.
- Medida objetivo: percentil 95 ≤ 2 s (no validado).
