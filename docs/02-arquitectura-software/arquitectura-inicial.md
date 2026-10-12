# Arquitectura inicial
La solución se basa en un **monolito modular** para identidad, asociados/cuotas, cloración y sincronización; PWA offline; servicio de validación IA separado.
```mermaid
flowchart TB
 U[Operador / Tesorero / Consejo] --> P[PWA React y ONNX Web]
 P --> I[(IndexedDB y cola UUID)]
 P -->|cuando hay red| A[API NestJS]
 A --> M1[Identidad y acceso]
 A --> M2[Asociados y cuotas]
 A --> M3[Cloración]
 A --> M4[Sincronización]
 M2 --> DB[(PostgreSQL)]
 M3 --> DB
 M4 --> DB
 M3 --> IA[Servicio IA FastAPI]
```
**Reglas:** almacenamiento transaccional en PostgreSQL; comunicación TLS; lectura de cloro condicionada a revisión humana ante baja confianza. No se incluyen redes ni servicios productivos en este entregable.
