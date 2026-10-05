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

---

