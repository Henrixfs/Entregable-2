# Diagramas de Arquitectura — Monolito Modular, Servicio de IA y Cliente sin Conexión

Describe el **estilo arquitectónico** de SIJASS: cómo se organiza el sistema completo. Cómo se organiza cada módulo por dentro se explica en `enfoque-arquitectonico.md`.

---

## Estilos combinados

SIJASS no usa un único estilo: combina varios, cada uno elegido para responder a un driver concreto (ver `07-decisiones-arquitectonicas.md`).

| Estilo | Dónde se aplica | Driver | Decisión |
| --- | --- | --- | --- |
| **Cliente-servidor con API REST sin estado** | PWA ↔ API Backend, con JWT en cada petición | DA08, DA06 | ADR-002, ADR-008 |
| **Monolito modular** | Backend: Identidad y acceso, Asociados y cuotas, Cloración, Sincronización | DA05, DA07 | ADR-001 |
| **En capas** | Dentro de cada módulo del backend | DA07 | ADR-006 |
| **Sin conexión primero (*offline-first*) con inferencia en el borde** | PWA: Service Worker, IndexedDB y ONNX Runtime Web | DA01, DA02, DA03 | ADR-002, ADR-003 |
| **Servicio independiente** | Servicio de IA (Python), único componente separado del monolito | DA02, DA04 | ADR-007 |
| **Procesamiento por lotes idempotente** | Cola local en el teléfono y `POST /sync` en el servidor | DA01, DA09 | ADR-005 |

---

## DIAGRAMA 1: Arquitectura del sistema (Visión Global)

Muestra la **estructura global**: actores, la PWA con su capacidad sin conexión, el monolito con sus 4 módulos, el servicio de IA, los almacenes de datos y los sistemas externos.

```mermaid
flowchart TB
    subgraph ACT["ACTORES"]
        direction LR
        Operador["👷 Operador técnico"]
        Tesorero["👤 Tesorero"]
        Consejo["👤 Consejo directivo"]
    end

    subgraph DISP["📱 DISPOSITIVO · Navegador Chromium (Android 8+)"]
        direction TB
        PWA["PWA · React + Vite<br/>Interfaz móvil, medición en 3 pasos"]
        ORT["ONNX Runtime Web<br/>Inferencia local · MobileNetV3-Small INT8"]
        SW["Service Worker · Workbox<br/>Caché de la app y del modelo .onnx"]
        IDB[("IndexedDB · Dexie<br/>Cola de operaciones pendientes<br/>UUID generado en el teléfono")]
        PWA --> ORT
        PWA --> IDB
        PWA --> SW
    end

    subgraph MONO["« MONOLITO MODULAR » API Backend<br/>Node.js + NestJS · Un proceso · Un despliegue"]
        MW["Entrada transversal<br/>HTTPS · verificación de JWT · RBAC · validación de entrada"]

        subgraph MI["módulo: IDENTIDAD Y ACCESO"]
            direction TB
            IC["AuthController"]
            IU["IniciarSesion · AsignarRol"]
            IP["JWT · bcrypt"]
            IC --> IU --> IP
        end

        subgraph MA["módulo: ASOCIADOS Y CUOTAS"]
            direction TB
            AC["AsociadoController · PagoController"]
            AU["RegistrarPago · ConsultarMorosidad"]
            AP["Repositorio PostgreSQL"]
            AC --> AU --> AP
        end

        subgraph MC["módulo: CLORACIÓN"]
            direction TB
            CC["MedicionController"]
            CU["RegistrarMedicion · CalcularDosis"]
            CP["Repositorio · Cliente IA<br/>Almacén de objetos · Notificador"]
            CC --> CU --> CP
        end

        subgraph MS["módulo: SINCRONIZACIÓN"]
            direction TB
            SC["SyncController"]
            SU["ProcesarLote · ResolverConflicto"]
            SP["Claves de idempotencia"]
            SC --> SU --> SP
        end
    end

    IA["🧠 Servicio de IA<br/>Python · FastAPI · ONNX Runtime<br/>Verificación asíncrona · versiones del modelo"]
    PG[("🗄️ PostgreSQL<br/>Datos transaccionales")]
    RD[("⚡ Redis<br/>Caché e idempotencia")]
    OBJ[("📦 Almacén de objetos<br/>Fotos y modelos .onnx")]
    MSG["📨 Servicio de mensajería<br/>Alertas de cloro fuera de rango"]
    TRAIN["🧪 Pipeline de entrenamiento<br/>Python · PyTorch · fuera de línea"]

    Operador & Tesorero & Consejo --> PWA
    PWA -->|"HTTPS · REST · JWT<br/>solo cuando hay señal"| MW
    MW --> IC & AC & CC & SC

    SU -.->|"registra mediante<br/>interfaces"| CU
    SU -.->|"registra mediante<br/>interfaces"| AU

    AP --> PG
    CP --> PG
    SP --> RD
    CP -->|"fotos"| OBJ
    CP -->|"HTTP asíncrono"| IA
    CP -->|"asíncrono"| MSG
    IA -->|"lee fotos"| OBJ
    TRAIN -->|"publica modelo versionado"| IA
    OBJ -.->|"descarga del modelo .onnx"| SW

    classDef actor fill:#1a3a6b,stroke:#0d1f3c,color:#fff
    classDef cli fill:#dce8f5,stroke:#2c5f9e,color:#000
    classDef mw fill:#2c5f9e,stroke:#0d1f3c,color:#fff
    classDef pres fill:#e8eef5,stroke:#2c5f9e,color:#000
    classDef neg fill:#fdf0d5,stroke:#d79b00,color:#000
    classDef adapt fill:#4a6fa5,stroke:#0d1f3c,color:#fff
    classDef store fill:#c5e8e0,stroke:#2a9d8f,color:#000
    classDef ext fill:#e8eef5,stroke:#666,color:#000

    class Operador,Tesorero,Consejo actor
    class PWA,ORT,SW,IDB cli
    class MW mw
    class IC,AC,CC,SC pres
    class IU,AU,CU,SU neg
    class IP,AP,CP,SP adapt
    class PG,RD,OBJ store
    class IA,MSG,TRAIN ext

    style ACT fill:#f0f4f8,stroke:#1a3a6b,stroke-width:2px,color:#000
    style DISP fill:#f0f4f8,stroke:#2c5f9e,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style MONO fill:#fafafa,stroke:#424242,stroke-width:3px,color:#000
    style MI fill:#ffffff,stroke:#9e9e9e,stroke-dasharray: 5 5,color:#000
    style MA fill:#ffffff,stroke:#9e9e9e,stroke-dasharray: 5 5,color:#000
    style MC fill:#ffffff,stroke:#9e9e9e,stroke-dasharray: 5 5,color:#000
    style MS fill:#ffffff,stroke:#9e9e9e,stroke-dasharray: 5 5,color:#000
```

**Cómo leerlo:**
- La **inferencia ocurre en el teléfono** (ONNX Runtime Web): el servidor no está en el camino crítico de una medición.
- El **servicio de IA** es el único componente fuera del monolito; solo verifica las fotos después de sincronizar.
- Los módulos del monolito se comunican **por interfaces**, no por dependencias directas (línea punteada).
- Los **datos climáticos** (analítica predictiva) quedan fuera del MVP y no aparecen en el diagrama.

---

## DIAGRAMA 2: Arquitectura en capas (Visión Interna)

Muestra cómo está **organizado cada módulo internamente** en capas. El ejemplo es el módulo **Cloración**, el más completo porque integra el servicio de IA, el almacén de objetos y la mensajería.

```mermaid
flowchart TB
    subgraph MOD["MÓDULO CLORACIÓN (ejemplo)"]
        subgraph PRES["CAPA 1: PRESENTACIÓN"]
            direction LR
            Guard["🛡️ Verificación de JWT y rol<br/>Solo operador y consejo"]
            Ctrl["🎛️ MedicionController<br/>Recibe HTTP · valida entrada<br/>Responde JSON"]
            Guard --> Ctrl
        end

        subgraph APP["CAPA 2: APLICACIÓN"]
            direction LR
            UC1["⚙️ RegistrarMedicion<br/>Orquesta dominio e infraestructura"]
            UC2["⚙️ CalcularDosis<br/>Usa ReglaDosificacion"]
            DTO["📦 DTOs<br/>MedicionDTO · DosisDTO"]
            Exc["⚠️ Excepciones de aplicación<br/>ej.: ReservorioNoEncontrado"]
            UC1 --> DTO & Exc
        end

        subgraph DOM["CAPA 3: DOMINIO"]
            direction LR
            Ent["📋 Medicion · Reservorio<br/>(entidades)"]
            Regla["⚖️ ReglaDosificacion<br/>Rango objetivo configurable<br/>Dosis por carga · dosis diaria"]
            Port["🔌 Interfaces (puertos)<br/>MedicionRepository<br/>VerificadorDeLecturas<br/>NotificadorDeAlertas"]
            Ent --> Regla
            Ent --> Port
        end

        subgraph INF["CAPA 4: INFRAESTRUCTURA"]
            direction LR
            Repo["💾 Repositorio PostgreSQL<br/>implementa MedicionRepository"]
            ClIA["🌐 Cliente del Servicio de IA<br/>HTTP asíncrono"]
            Foto["📦 Cliente del almacén de objetos<br/>Guarda y lee fotos"]
            Noti["📨 Adaptador de mensajería<br/>implementa NotificadorDeAlertas"]
        end

        PRES --> APP
        APP --> DOM
        INF -->|"implementa"| DOM
    end

    DB[("🗄️ PostgreSQL<br/>mediciones · reservorios")]
    SIA["🧠 Servicio de IA"]
    OBJ[("📦 Almacén de objetos")]
    MSG["📨 Servicio de mensajería"]

    Repo -->|"SQL"| DB
    ClIA -->|"HTTP"| SIA
    Foto --> OBJ
    Noti -->|"HTTPS"| MSG

    classDef pres fill:#1a3a6b,stroke:#0d1f3c,color:#fff
    classDef app fill:#2c5f9e,stroke:#0d1f3c,color:#fff
    classDef dom fill:#fdf0d5,stroke:#d79b00,stroke-width:2px,color:#000
    classDef inf fill:#4a6fa5,stroke:#0d1f3c,color:#fff
    classDef data fill:#c5e8e0,stroke:#2a9d8f,color:#000
    classDef ext fill:#e8eef5,stroke:#666,color:#000

    class Guard,Ctrl pres
    class UC1,UC2,DTO,Exc app
    class Ent,Regla,Port dom
    class Repo,ClIA,Foto,Noti inf
    class DB,OBJ data
    class SIA,MSG ext

    style PRES fill:#e8eef5,stroke:#1a3a6b,stroke-width:2px,color:#000
    style APP fill:#dce8f5,stroke:#2c5f9e,stroke-width:2px,color:#000
    style DOM fill:#fff8e7,stroke:#d79b00,stroke-width:3px,color:#000
    style INF fill:#e3eaf4,stroke:#4a6fa5,stroke-width:2px,color:#000
    style MOD fill:#fafafa,stroke:#424242,stroke-width:2px,color:#000
```

### Explicación de las capas

| Capa | Responsabilidad | No contiene | Ejemplo en Cloración |
| --- | --- | --- | --- |
| **PRESENTACIÓN** | Recibir HTTP, verificar token y rol, validar entrada, responder JSON | Lógica de negocio | `MedicionController` |
| **APLICACIÓN** | Orquestar los casos de uso coordinando dominio e infraestructura | Detalles técnicos | `RegistrarMedicion`, `CalcularDosis` |
| **DOMINIO** | Reglas de negocio puras e interfaces de los puertos | NestJS, SQL, HTTP | `ReglaDosificacion`, `Medicion` |
| **INFRAESTRUCTURA** | Detalles técnicos: PostgreSQL, servicio de IA, almacén de objetos, mensajería | Lógica de negocio | Repositorio PostgreSQL |

---

## DIAGRAMA 3: Flujo de ejecución (Caso de Uso: Sincronizar datos pendientes)

Muestra cómo interactúan las capas y los módulos cuando el teléfono recupera señal (CU04, RF10). Es el flujo que más ejercita el backend: idempotencia, persistencia transaccional y tareas asíncronas posteriores.

```mermaid
sequenceDiagram
    autonumber
    participant PWA as PWA (Service Worker)
    participant IDB as IndexedDB
    participant GRD as Verificación JWT y rol
    participant CTRL as SyncController
    participant PL as ProcesarLote
    participant RDS as Redis
    participant MOD as Módulos de dominio<br/>(Cloración · Cuotas)
    participant DB as PostgreSQL
    participant SIA as Servicio de IA
    participant MSG as Servicio de mensajería

    Note over PWA,IDB: Se recupera la señal
    PWA->>IDB: leer operaciones pendientes
    IDB-->>PWA: lote con un UUID por operación
    PWA->>GRD: POST /sync (JWT + lote) por HTTPS
    GRD->>CTRL: token válido y rol autorizado
    CTRL->>PL: procesarLote(lote)

    loop por cada operación del lote
        PL->>RDS: ¿UUID ya procesado?
        alt UUID nuevo
            PL->>MOD: registrar medición o pago
            MOD->>DB: INSERT (transacción ACID)
            DB-->>MOD: confirmado
            PL->>RDS: registrar UUID como procesado
        else UUID repetido
            PL->>PL: descartar sin duplicar
        end
    end

    PL-->>CTRL: identificadores confirmados
    CTRL-->>PWA: 200 OK + identificadores
    PWA->>IDB: marcar operaciones como sincronizadas

    Note over MOD,MSG: Tareas asíncronas, fuera de la respuesta al teléfono
    MOD->>SIA: verificar(foto)
    MOD->>MSG: alerta si el cloro está fuera de rango
```

**Puntos clave:**
- Reenviar el mismo lote por un corte de red produce el mismo estado final (RNF04).
- La verificación de la IA y el envío de alertas **no bloquean** la respuesta: si la mensajería falla, la medición ya quedó registrada (RC10).

---

## DIAGRAMA 4: Vista de Despliegue (conceptual del MVP)

Muestra dónde vive cada componente. Es una **vista conceptual**: la tecnología concreta de alojamiento se definirá en el siguiente entregable (niveles de componentes y despliegue).

Se diseña para el MVP de un solo desarrollador (DA05): pocos componentes que operar. El backend no guarda estado de sesión (JWT), de modo que **agregar instancias es posible más adelante** sin rediseñar; por eso aparece punteada.

```mermaid
flowchart LR
    subgraph CLI["📱 Teléfonos de los usuarios"]
        NAV["Navegador Chromium<br/>PWA + Service Worker<br/>IndexedDB · ONNX Runtime Web<br/>(funciona sin red)"]
    end

    TLS["🔒 Terminación HTTPS"]

    subgraph SRV["🖥️ Servidor del MVP"]
        direction TB
        API["API Backend<br/>NestJS · sin estado"]
        APIN["API Backend — instancia adicional<br/>(evolución futura)"]
        IA["Servicio de IA<br/>FastAPI + ONNX Runtime"]
        PG[("🗄️ PostgreSQL")]
        RD[("⚡ Redis")]
        OBJ[("📦 Almacén de objetos<br/>fotos y modelos .onnx")]
    end

    MSG["📨 Servicio de mensajería<br/>(externo)"]
    TRAIN["🧪 Entrenamiento<br/>fuera de línea"]

    NAV -->|"HTTPS · solo con señal"| TLS
    TLS --> API
    TLS -.-> APIN

    API --> PG
    API --> RD
    API --> OBJ
    API -->|"HTTP asíncrono"| IA
    APIN -.-> PG
    APIN -.-> RD
    IA --> OBJ

    API -->|"HTTPS"| MSG
    TRAIN -->|"modelo versionado"| IA
    OBJ -.->|"descarga del modelo<br/>(caché del Service Worker)"| NAV

    classDef cli fill:#dce8f5,stroke:#2c5f9e,color:#000
    classDef lb fill:#2c5f9e,stroke:#0d1f3c,color:#fff
    classDef inst fill:#fdf0d5,stroke:#d79b00,color:#000
    classDef future fill:#f5f5f5,stroke:#999,stroke-dasharray: 5 5,color:#000
    classDef db fill:#c5e8e0,stroke:#2a9d8f,color:#000
    classDef ext fill:#e8eef5,stroke:#666,color:#000

    class NAV cli
    class TLS lb
    class API,IA inst
    class APIN future
    class PG,RD,OBJ db
    class MSG,TRAIN ext

    style CLI fill:#f0f4f8,stroke:#2c5f9e,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style SRV fill:#fafafa,stroke:#424242,stroke-width:2px,color:#000
```

---


