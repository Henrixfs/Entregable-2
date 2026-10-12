# 06. Drivers arquitectónicos — SIJASS
| DA | Motivación | Decisión asociada |
|---|---|---|
| DA01 | Operación offline (RC01, RNF01, RF10) | PWA, IndexedDB, cola UUID |
| DA02 | IA sin conectividad (RF07, RC07) | ONNX Runtime Web |
| DA03 | Bajo rendimiento de equipos (RNF02) | Modelo compacto y cuantización |
| DA04 | Confiabilidad de estimación (RNF03) | Modelo versionado y revisión humana |
| DA05 | Equipo reducido (RC04) | Monolito modular |
| DA06 | Privacidad y seguridad (RNF05) | HTTPS/JWT/RBAC |
| DA07 | Mantenibilidad (RNF07) | Clean Architecture y DIP |
| DA08 | Instalación sencilla (RC08) | PWA |
| DA09 | Consistencia offline (RNF04) | Idempotencia por UUID en servidor |
| DA10 | Parámetros de dosificación (RC11) | Reglas configurables y auditables |
