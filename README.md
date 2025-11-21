# 📓 Hybrid Smart Notebook App

Una aplicación web híbrida de organización de apuntes para programación que combina cuaderno diario con base de conocimiento.

## 🎯 Características

- **Daily Notes**: Cuaderno diario con notas por fecha
- **Concept Library**: Biblioteca de conceptos de programación con enlaces bidireccionales
- **Prompt Vault**: Repositorio organizado de prompts de Cursor/chat
- **Image Gallery**: Galería de imágenes con upload drag & drop
- **Global Search**: Búsqueda avanzada en todas las notas
- **Rich Editor**: Editor Markdown con syntax highlighting

## 🛠️ Stack Tecnológico

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma + SQLite
- TipTap
- Shiki
- Fuse.js

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npx prisma migrate dev

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📚 Documentación

- [Arquitectura](./docs/architecture.md)
- [Fuentes de Investigación](./docs/research-sources.md)
- [Guía de Usuario](./docs/user-guide.md) (próximamente)

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea código con Prettier
- `npm run format:check` - Verifica formato

## 🗂️ Estructura del Proyecto

Ver [docs/architecture.md](./docs/architecture.md) para detalles completos.

## 📄 Licencia

Este proyecto es de uso personal.
