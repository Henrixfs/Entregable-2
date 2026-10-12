# 04. Atributos de calidad — SIJASS
| RNF | Estímulo y contexto | Respuesta | Métrica objetivo (por validar) |
|---|---|---|---|
| RNF01 Disponibilidad offline | Red ausente en reservorio | Registrar datos localmente | 100 % de operaciones aceptadas persisten |
| RNF02 Rendimiento | Inferencia en Android objetivo | Resultado de clasificación | ≤ 2 s tras carga de modelo |
| RNF03 Precisión IA | Muestras etiquetadas y calibradas | Estimación y confianza | ≥ 85 % clases, MAE ≤ 0.2 mg/L |
| RNF04 Integridad | Reintento mismo UUID | Evitar duplicados | 0 registros adicionales |
| RNF05 Seguridad | Petición no autorizada | Rechazar acceso | 100 % endpoints protegidos |
| RNF06 Usabilidad | Operador nuevo | Flujo simple | ≤ 3 pasos para medición |
| RNF07 Modificabilidad | Nuevo módulo | Aislar cambios | Sin tocar núcleo del dominio |
| RNF08 Portabilidad | Teléfono Android objetivo | Ejecutar PWA | Validar Android 8+ y Chromium |

Estos indicadores son **criterios de aceptación propuestos**, no cifras alcanzadas.
