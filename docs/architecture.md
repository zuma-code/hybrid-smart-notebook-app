# Arquitectura del Proyecto

## Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router) con React 18+
- **Estilos**: Tailwind CSS + shadcn/ui
- **Base de datos**: SQLite (inicial) → PostgreSQL (futuro) con Prisma ORM
- **Editor**: TipTap (editor extensible basado en ProseMirror)
- **Syntax highlighting**: Shiki
- **Búsqueda**: Fuse.js para búsqueda difusa
- **Validación**: Zod para schemas
- **Iconos**: Lucide React

## Estructura de Carpetas

```
apuntes-app/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Grupo de rutas con layout compartido
│   ├── api/                # API Routes
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y helpers
│   └── hooks/              # Custom React hooks
├── prisma/                 # Schema y migraciones
├── public/                 # Archivos estáticos
├── docs/                   # Documentación
└── types/                  # TypeScript types
```

## Modelo de Datos

### Entidades Principales

- **DailyNote**: Notas diarias con fecha
- **Concept**: Conceptos de programación permanentes
- **Prompt**: Prompts guardados de chats
- **Image**: Referencias a imágenes subidas
- **Tag**: Sistema de etiquetado
- **NoteLink**: Enlaces bidireccionales entre notas

## Flujo de Datos

1. Usuario interactúa con UI
2. Componente llama a API Route
3. API Route valida con Zod
4. Prisma Client accede a BD
5. Respuesta JSON al cliente
6. UI se actualiza con React

## Decisiones de Diseño

- **SQLite inicial**: Simplicidad y portabilidad
- **TipTap**: Flexibilidad para extensiones futuras
- **Fuse.js**: Búsqueda client-side rápida
- **shadcn/ui**: Componentes accesibles y personalizables

