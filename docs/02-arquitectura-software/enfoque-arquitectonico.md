# Enfoque: Clean Architecture
La regla de dependencia es `Presentación → Aplicación → Dominio ← Infraestructura`.
| Capa | Responsabilidad | Ejemplo |
|---|---|---|
| Presentación | Validar entradas, autenticación y transporte | MedicionController |
| Aplicación | Orquestar transacciones y operaciones | RegistrarMedicionCasoUso |
| Dominio | Invariantes y contratos | Medicion, RepositorioMediciones |
| Infraestructura | Base de datos, IA, mensajería | PostgresMedicionesRepository |

El cálculo de parámetros del cloro no debe llamar a PostgreSQL ni a ONNX directamente. Los adaptadores dependen de contratos de dominio. Los tests de dominio no requieren red.
