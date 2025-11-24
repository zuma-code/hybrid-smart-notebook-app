# 📚 Cómo Funciona la Aplicación - Guía para Principiantes

## 🎯 ¿Qué es esta aplicación?

Esta es una **aplicación de apuntes para programación** llamada "Hybrid Smart Notebook". Es como un cuaderno digital inteligente donde puedes:

- 📝 Escribir notas diarias
- 📖 Guardar conceptos de programación
- 💬 Almacenar prompts útiles
- 🏷️ Organizar todo con tags (etiquetas)
- 🔗 Conectar ideas entre sí
- 🖼️ Guardar imágenes

---

## 🚀 ¿Qué es Next.js? (Explicación Simple)

### Concepto Básico

**Next.js** es un **framework** (marco de trabajo) para crear aplicaciones web con React. Piensa en él como un "kit de herramientas" que hace más fácil construir sitios web modernos.

### Características Principales de Next.js:

#### 1. **Sistema de Archivos = Rutas** 📁
En Next.js, la estructura de carpetas **automáticamente** crea las rutas de tu sitio web.

```
app/
  ├── page.tsx          → Se convierte en: http://localhost:3000/
  ├── about/
  │   └── page.tsx      → Se convierte en: http://localhost:3000/about
  └── (dashboard)/
      ├── page.tsx      → Se convierte en: http://localhost:3000/ (dashboard)
      └── concepts/
          └── page.tsx  → Se convierte en: http://localhost:3000/concepts
```

**Ejemplo práctico:**
- Si creas un archivo `app/concepts/page.tsx`, automáticamente tendrás una página en `/concepts`
- No necesitas configurar rutas manualmente como en otros frameworks

#### 2. **Server Components vs Client Components** 🖥️

Next.js tiene dos tipos de componentes:

**Server Components** (por defecto):
- Se ejecutan en el **servidor** antes de enviar la página al navegador
- Son más rápidos porque el servidor hace el trabajo pesado
- No pueden usar interactividad (botones, formularios, etc.)

```typescript
// app/concepts/page.tsx - Server Component
export default function ConceptsPage() {
  return <ConceptList />;
}
```

**Client Components** (necesitas `"use client"`):
- Se ejecutan en el **navegador** (cliente)
- Pueden usar interactividad: botones, formularios, estados
- Necesitas agregar `"use client"` al inicio del archivo

```typescript
// components/concepts/ConceptList.tsx - Client Component
"use client";

export function ConceptList() {
  const [concepts, setConcepts] = useState([]); // ← Esto solo funciona en client components
  
  return <div>...</div>;
}
```

#### 3. **API Routes** 🔌

Next.js permite crear **APIs** (endpoints) dentro de la misma aplicación.

```
app/
  └── api/
      └── concepts/
          └── route.ts  → Crea: http://localhost:3000/api/concepts
```

Estos archivos pueden manejar:
- `GET` - Obtener datos
- `POST` - Crear datos
- `PUT` - Actualizar datos
- `DELETE` - Eliminar datos

**Ejemplo:**
```typescript
// app/api/concepts/route.ts
export async function GET() {
  // Obtener conceptos de la base de datos
  const concepts = await prisma.concept.findMany();
  return NextResponse.json(concepts);
}

export async function POST(request: NextRequest) {
  // Crear un nuevo concepto
  const body = await request.json();
  const concept = await prisma.concept.create({ data: body });
  return NextResponse.json(concept);
}
```

#### 4. **Layouts (Plantillas)** 🎨

Los **layouts** son componentes que envuelven otras páginas. Son perfectos para:
- Sidebars (barras laterales)
- Headers (encabezados)
- Navegación común

```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>{children}</main> {/* ← Aquí se renderiza la página actual */}
    </SidebarProvider>
  );
}
```

**Nota:** Los paréntesis `(dashboard)` crean un **route group** - no afecta la URL, solo organiza el código.

---

## 🏗️ Estructura de Nuestra Aplicación

### 📂 Carpetas Principales

```
apuntes-app/
├── app/                    # ← Aquí vive Next.js (rutas y páginas)
│   ├── layout.tsx         # Layout principal (fuentes, estilos globales)
│   ├── (dashboard)/       # Grupo de rutas del dashboard
│   │   ├── layout.tsx     # Layout con sidebar y header
│   │   ├── page.tsx       # Página principal (Dashboard)
│   │   ├── daily/         # Notas diarias
│   │   ├── concepts/      # Conceptos
│   │   └── prompts/       # Prompts
│   └── api/               # API Routes (endpoints)
│       ├── concepts/
│       ├── daily/
│       └── prompts/
│
├── components/            # Componentes reutilizables
│   ├── concepts/
│   ├── daily/
│   ├── dashboard/
│   └── ui/               # Componentes de UI (botones, cards, etc.)
│
├── lib/                   # Utilidades y configuraciones
│   ├── db.ts             # Conexión a la base de datos (Prisma)
│   └── utils.ts          # Funciones auxiliares
│
├── prisma/               # Base de datos
│   ├── schema.prisma     # Modelos de datos (tablas)
│   └── dev.db            # Base de datos SQLite
│
└── docs/                 # Documentación
```

---

## 🔄 Flujo de Datos en la Aplicación

### Ejemplo: Ver Lista de Conceptos

```
1. Usuario visita: http://localhost:3000/concepts
   ↓
2. Next.js busca: app/(dashboard)/concepts/page.tsx
   ↓
3. La página renderiza: <ConceptList />
   ↓
4. ConceptList (Client Component) hace fetch:
   fetch('/api/concepts')
   ↓
5. Next.js busca: app/api/concepts/route.ts
   ↓
6. La API ejecuta: prisma.concept.findMany()
   ↓
7. Prisma consulta la base de datos SQLite
   ↓
8. Los datos vuelven: API → Component → Pantalla
```

**Código real:**

```typescript
// 1. Página (Server Component)
// app/(dashboard)/concepts/page.tsx
export default function ConceptsPage() {
  return <ConceptList />;
}

// 2. Componente (Client Component)
// components/concepts/ConceptList.tsx
"use client";

export function ConceptList() {
  const [concepts, setConcepts] = useState([]);
  
  useEffect(() => {
    fetch('/api/concepts')  // ← Llamada a la API
      .then(res => res.json())
      .then(data => setConcepts(data));
  }, []);
  
  return <div>{/* Mostrar conceptos */}</div>;
}

// 3. API Route
// app/api/concepts/route.ts
export async function GET() {
  const concepts = await prisma.concept.findMany(); // ← Consulta BD
  return NextResponse.json(concepts);
}
```

---

## 💾 Base de Datos (Prisma + SQLite)

### ¿Qué es Prisma?

**Prisma** es una herramienta que te permite trabajar con bases de datos de forma fácil y segura con TypeScript.

### Modelos de Datos (Tablas)

En `prisma/schema.prisma` definimos nuestras "tablas":

```prisma
model Concept {
  id        String   @id @default(cuid())
  title     String
  slug      String   @unique
  content   String   @default("")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Esto significa:**
- Cada concepto tiene: `id`, `title`, `slug`, `content`, `createdAt`, `updatedAt`
- `@id` = identificador único
- `@unique` = no puede haber dos conceptos con el mismo slug
- `@default(now())` = fecha automática al crear

### Usar Prisma en el Código

```typescript
// lib/db.ts - Conexión a la base de datos
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

// app/api/concepts/route.ts - Usar Prisma
import { prisma } from "@/lib/db";

// Obtener todos los conceptos
const concepts = await prisma.concept.findMany();

// Crear un concepto
const newConcept = await prisma.concept.create({
  data: {
    title: "React Hooks",
    slug: "react-hooks",
    content: "Los hooks son funciones especiales..."
  }
});

// Buscar por slug
const concept = await prisma.concept.findUnique({
  where: { slug: "react-hooks" }
});
```

---

## 🎨 Componentes UI (shadcn/ui)

Usamos **shadcn/ui** para los componentes visuales. Son componentes de React pre-construidos y personalizables.

**Componentes que usamos:**
- `<Button>` - Botones
- `<Card>` - Tarjetas
- `<Input>` - Campos de texto
- `<Dialog>` - Ventanas modales
- `<Sidebar>` - Barra lateral

**Ejemplo:**
```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Hacer algo</Button>
  </CardContent>
</Card>
```

---

## 🔑 Conceptos Clave de React (Usados en la App)

### 1. **useState** - Estado del Componente

Guarda datos que pueden cambiar y actualizan la pantalla automáticamente.

```typescript
const [concepts, setConcepts] = useState([]);

// concepts = valor actual
// setConcepts = función para cambiar el valor
```

### 2. **useEffect** - Efectos Secundarios

Ejecuta código cuando algo cambia (cargar datos, suscripciones, etc.).

```typescript
useEffect(() => {
  fetchConcepts(); // ← Se ejecuta cuando el componente se monta
}, []); // ← Array vacío = solo una vez
```

### 3. **Props** - Pasar Datos entre Componentes

```typescript
// Componente padre
<ConceptCard concept={conceptData} />

// Componente hijo
function ConceptCard({ concept }) {
  return <div>{concept.title}</div>;
}
```

---

## 📱 Funcionalidades Actuales de la App

### ✅ Lo que ya funciona:

1. **Dashboard Principal**
   - Muestra estadísticas (notas, conceptos, prompts)
   - Actividad reciente
   - Nota del día

2. **Daily Notes (Notas Diarias)**
   - Crear notas diarias
   - Listar notas agrupadas por fecha
   - Editar y eliminar notas

3. **Conceptos**
   - Crear conceptos con título y contenido
   - Listar todos los conceptos
   - Buscar conceptos
   - Ver concepto individual

4. **Prompts**
   - Crear prompts
   - Categorizar prompts
   - Marcar como favoritos

5. **Navegación**
   - Sidebar con menú
   - Header con información
   - Diseño responsive

### 🚧 Lo que está pendiente:

- Editor rico de texto (TipTap) - actualmente usa textarea básico
- Sistema de tags completo
- Galería de imágenes
- Búsqueda avanzada
- Enlaces entre notas (wiki-links)

---

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start

# Formatear código
npm run format

# Verificar formato
npm run format:check
```

---

## 🎓 Resumen para Principiantes

### ¿Cómo funciona Next.js?

1. **Archivos = Rutas**: La estructura de carpetas crea las URLs automáticamente
2. **Server vs Client**: Algunos componentes corren en el servidor, otros en el navegador
3. **API Routes**: Puedes crear APIs dentro de la misma app
4. **Layouts**: Plantillas que envuelven páginas

### ¿Cómo funciona nuestra app?

1. **Frontend**: Componentes React que muestran la interfaz
2. **Backend**: API Routes que manejan las peticiones
3. **Base de Datos**: Prisma + SQLite guarda los datos
4. **Flujo**: Usuario → Componente → API → Base de Datos → Respuesta → Pantalla

### ¿Qué necesitas saber para entender el código?

- **React básico**: componentes, props, useState, useEffect
- **TypeScript básico**: tipos, interfaces
- **Next.js básico**: rutas, layouts, API routes
- **Prisma básico**: modelos, consultas

---

## 📚 Recursos para Aprender Más

- [Next.js Docs](https://nextjs.org/docs) - Documentación oficial
- [React Docs](https://react.dev) - Documentación de React
- [Prisma Docs](https://www.prisma.io/docs) - Documentación de Prisma
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Guía de TypeScript

---

**¿Tienes preguntas?** Revisa el código y experimenta. La mejor forma de aprender es practicando! 🚀


