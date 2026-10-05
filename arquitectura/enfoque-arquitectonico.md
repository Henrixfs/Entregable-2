# Clean Architecture — Diagrama y Tabla (SIJASS)

Describe el **enfoque arquitectónico** de SIJASS: cómo se organiza cada módulo del backend por dentro. El estilo que organiza el sistema completo está en `estilo-arquitectonico.md`.

| Pregunta | Respuesta |
| --- | --- |
| **¿Qué enfoque se adopta?** | Clean Architecture en cuatro capas dentro de cada módulo del monolito (ADR-006). |
| **¿Qué driver responde?** | DA07 — Modificabilidad (RNF07): agregar un módulo, como el reporte de fugas, sin modificar los existentes. |
| **¿Qué protege?** | Las reglas de negocio, como la fórmula de dosificación y el rango normativo de cloro, no dependen de la base de datos ni del framework. |

---

## Diagrama: Las 4 Capas

Las flechas indican **dependencias de código**. Las dependencias apuntan siempre hacia el dominio: la infraestructura implementa las interfaces que el dominio define.

```mermaid
flowchart TB
    subgraph MOD["MÓDULO (Clean Architecture)"]
        subgraph PRES["PRESENTACIÓN"]
            direction LR
            Ctrl["🎛️ controller<br/>Recibe HTTP<br/>Verifica token y rol<br/>Valida entrada"]
        end

        subgraph APP["APLICACIÓN"]
            direction LR
            UC["⚙️ caso de uso<br/>Orquesta dominio<br/>e infraestructura"]
            DTO["📦 DTO<br/>Data Transfer"]
            Exc["⚠️ Excepciones"]
            UC --> DTO & Exc
        end

        subgraph DOM["DOMINIO"]
            direction LR
            Entity["📋 entity<br/>Reglas puras"]
            Port["🔌 interfaces (puertos)<br/>repositorios y servicios"]
            Entity --> Port
        end

        subgraph INF["INFRAESTRUCTURA"]
            direction LR
            Repo["💾 repository<br/>PostgreSQL"]
            Adapter["🔌 adapter<br/>IA · objetos · mensajería<br/>JWT · bcrypt · Redis"]
        end

        PRES --> APP
        APP --> DOM
        INF -->|"implementa"| DOM
    end

    DB[("🗄️ PostgreSQL")]
    EXT["🔗 Servicios externos<br/>IA · mensajería · almacén de objetos"]
    RD[("⚡ Redis")]

    Repo --> DB
    Adapter --> EXT
    Adapter --> RD

    classDef pres fill:#1a3a6b,stroke:#0d1f3c,color:#fff
    classDef app fill:#2c5f9e,stroke:#0d1f3c,color:#fff
    classDef dom fill:#fdf0d5,stroke:#d79b00,stroke-width:2px,color:#000
    classDef inf fill:#4a6fa5,stroke:#0d1f3c,color:#fff
    classDef data fill:#c5e8e0,stroke:#2a9d8f,color:#000
    classDef ext fill:#e8eef5,stroke:#666,color:#000

    class Ctrl pres
    class UC,DTO,Exc app
    class Entity,Port dom
    class Repo,Adapter inf
    class DB,RD data
    class EXT ext

    style PRES fill:#e8eef5,stroke:#1a3a6b,stroke-width:2px,color:#000
    style APP fill:#dce8f5,stroke:#2c5f9e,stroke-width:2px,color:#000
    style DOM fill:#fff8e7,stroke:#d79b00,stroke-width:3px,color:#000
    style INF fill:#e3eaf4,stroke:#4a6fa5,stroke-width:2px,color:#000
    style MOD fill:#fafafa,stroke:#424242,stroke-width:2px,color:#000
```

**Regla de dependencia:** `Presentación → Aplicación → Dominio ← Infraestructura`

---

## Tabla: Capas y Responsabilidades

Los nombres de archivo siguen la convención de NestJS con TypeScript (RC06). Son una convención propuesta para el equipo.

| Capa | Archivos | Responsabilidad | No Contiene |
| --- | --- | --- | --- |
| **PRESENTACIÓN** | `*.controller.ts`, guards de JWT y rol | Recibir HTTP, verificar token y rol, validar entrada, responder JSON | Lógica de negocio |
| **APLICACIÓN** | `*.use-case.ts`, `dtos/`, `exceptions/` | Orquestar dominio e infraestructura en cada caso de uso | Detalles técnicos (NestJS, SQL) |
| **DOMINIO** | `*.entity.ts`, `*.repository.ts` (solo interfaz), reglas como `ReglaDosificacion` | Reglas de negocio puras e interfaces de los puertos | NestJS, SQL, HTTP, Redis |
| **INFRAESTRUCTURA** | `*.postgres-repository.ts`, `*.adapter.ts` | Persistencia, servicio de IA, almacén de objetos, mensajería, JWT, bcrypt, Redis | Lógica de negocio |

---

## Capas aplicadas a los 4 módulos de SIJASS

| Capa ↓ / Módulo → | Identidad y acceso | Asociados y cuotas | Cloración | Sincronización |
| --- | --- | --- | --- | --- |
| **Presentación** | `AuthController` | `AsociadoController`<br/>`PagoController` | `MedicionController` | `SyncController` |
| **Aplicación** | `IniciarSesion`<br/>`AsignarRol` | `RegistrarPago`<br/>`ConsultarMorosidad` | `RegistrarMedicion`<br/>`CalcularDosis` | `ProcesarLote`<br/>`ResolverConflicto` |
| **Dominio** | `Usuario`, `Rol` | `Asociado`, `Cuota`, `Pago` | `Medicion`, `Reservorio`,<br/>`ReglaDosificacion` | `Operacion`, `Lote` |
| **Infraestructura** | JWT, bcrypt | Repositorio PostgreSQL | Repositorio, cliente IA,<br/>almacén de objetos, mensajería | Redis (claves de idempotencia) |

---

## Puertos y adaptadores

La inversión de dependencias se concreta en los puntos donde el sistema toca el mundo exterior. El dominio define la interfaz (puerto); la infraestructura aporta la implementación (adaptador).

| Puerto (dominio) | Adaptador (infraestructura) | Motivo |
| --- | --- | --- |
| `MedicionRepository`, `PagoRepository`, `AsociadoRepository`, `UsuarioRepository` | Repositorios sobre PostgreSQL | La lógica de cuotas y cloración no conoce el motor de base de datos (RC07). |
| `VerificadorDeLecturas` | Cliente HTTP del Servicio de IA | El servicio de IA tiene otro lenguaje y otro ciclo de vida (ADR-007). |
| `AlmacenDeFotos` | Cliente del almacén de objetos | Las fotos y los modelos no viven en la base transaccional. |
| `NotificadorDeAlertas` | Adaptador del servicio de mensajería | Su caída no debe impedir registrar una medición (RC10, ADR-011). |
| `RegistroDeIdempotencia` | Adaptador de Redis | Verificar rápido si un UUID ya fue procesado (ADR-009). |
| `HasheadorDeClaves`, `EmisorDeTokens` | bcrypt y JWT | El módulo de identidad no depende de una librería concreta (ADR-008). |

---

## Alcance del enfoque

- **Backend:** Clean Architecture se aplica a los cuatro módulos del monolito.
- **Servicio de IA:** es un servicio independiente en Python con su propio ciclo de vida; no sigue esta estructura.
- **PWA:** la inferencia, el cálculo de la dosis y el registro de operaciones corren en el teléfono sin conexión (RF07, RF09, RF10), por lo que el cliente se organiza por funcionalidades y no por estas capas.

---

## Referencias

- Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.
- Bass, L., Clements, P., & Kazman, R. (2021). *Software Architecture in Practice* (4th ed.). Addison-Wesley.
