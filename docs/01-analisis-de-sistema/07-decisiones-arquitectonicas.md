# 07. Decisiones arquitectónicas — SIJASS
**Estado:** Propuestas aceptadas para el diseño académico; pendientes de validación productiva.
| ADR | Decisión | Drivers | Alternativa descartada | Consecuencia |
|---|---|---|---|---|
| ADR-001 | Monolito modular NestJS | DA05 DA07 | Microservicios desde el inicio | Operación sencilla, módulos aislados |
| ADR-002 | React PWA, IndexedDB | DA01 DA08 | Aplicación solo online | Cola y caché local |
| ADR-003 | ONNX Runtime Web en móvil | DA02 DA03 | Inferencia únicamente remota | Requiere pruebas de dispositivos |
| ADR-004 | PostgreSQL | DA09 | Archivo local central | Transacciones y FK |
| ADR-005 | UUID cliente y sync idempotente | DA01 DA09 | Repetir POST sin claves | Reintentos seguros |
| ADR-006 | Capas presentación/aplicación/dominio/infraestructura | DA07 | Lógica en controladores | Menor acoplamiento |
| ADR-007 | Servicio Python para verificación posterior | DA04 | IA central en backend JS | Ciclo de modelo independiente |
| ADR-008 | JWT, RBAC, hash robusto | DA06 | Claves compartidas | Identidades auditables |
| ADR-009 | Redis opcional para caché | DA03 DA09 | Caché como fuente de verdad | PostgreSQL sigue siendo la fuente de verdad |
| ADR-010 | Regla de cloro parametrizada | DA10 | Constantes rígidas | Configuración y auditoría |

La infraestructura implementa los puertos del dominio. Nunca introducir dependencias de framework dentro de entidades de negocio.
