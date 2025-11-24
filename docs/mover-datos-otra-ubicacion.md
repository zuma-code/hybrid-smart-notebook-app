# 📦 Guía: Cómo Mover los Datos a Otra Ubicación

## 📍 ¿Dónde están los datos actualmente?

### Ubicación actual:
```
/Users/usuario/Desktop/Dev/apuntes-app/
├── prisma/
│   └── dev.db          ← Base de datos (Daily Notes, Conceptos, Prompts)
└── public/
    └── uploads/        ← Imágenes subidas
```

---

## 🎯 Opciones para Mover los Datos

Tienes **3 opciones principales**:

### **Opción 1: Mover solo los archivos (Más Simple)** ✅
Mover los archivos físicamente sin cambiar el código.

### **Opción 2: Cambiar la ubicación en el código (Más Flexible)** 🔧
Modificar el código para que los datos se guarden en otra ubicación.

### **Opción 3: Usar variables de entorno (Más Profesional)** ⚙️
Configurar rutas mediante variables de entorno.

---

## 📋 Opción 1: Mover Archivos Físicamente (Simple)

### Paso 1: Detener la aplicación
Si la app está corriendo, deténla (Ctrl+C en la terminal).

### Paso 2: Mover la base de datos
```bash
# Ejemplo: mover a ~/Documents/apuntes-data/
mkdir -p ~/Documents/apuntes-data
cp prisma/dev.db ~/Documents/apuntes-data/dev.db
```

### Paso 3: Mover las imágenes
```bash
# Mover toda la carpeta uploads
cp -r public/uploads ~/Documents/apuntes-data/uploads
```

### Paso 4: Actualizar el código
Necesitarás modificar:
- `prisma/schema.prisma` - cambiar la ruta de la base de datos
- `app/api/images/upload/route.ts` - cambiar la ruta de uploads

---

## 🔧 Opción 2: Cambiar Ubicación en el Código

### Para la Base de Datos:

**1. Modificar `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:/Users/usuario/Documents/apuntes-data/dev.db"
}
```

**2. Regenerar Prisma Client:**
```bash
npx prisma generate
```

### Para las Imágenes:

**1. Modificar `app/api/images/upload/route.ts`:**
```typescript
// Cambiar esta línea (línea 40):
const uploadsDir = join(process.cwd(), "public", "uploads");

// Por ejemplo, a:
const uploadsDir = "/Users/usuario/Documents/apuntes-data/uploads";
```

**2. También actualizar `app/api/images/[id]/route.ts`:**
```typescript
// Cambiar la línea que elimina archivos (línea 27):
const filepath = join(process.cwd(), "public", image.path);

// Por la nueva ruta:
const filepath = join("/Users/usuario/Documents/apuntes-data", image.path);
```

---

## ⚙️ Opción 3: Usar Variables de Entorno (Recomendado)

### Paso 1: Crear archivo `.env.local`
```bash
# Base de datos
DATABASE_URL="file:/Users/usuario/Documents/apuntes-data/dev.db"

# Carpeta de uploads
UPLOADS_DIR="/Users/usuario/Documents/apuntes-data/uploads"
```

### Paso 2: Modificar `prisma/schema.prisma`
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Paso 3: Modificar `app/api/images/upload/route.ts`
```typescript
const uploadsDir = process.env.UPLOADS_DIR || join(process.cwd(), "public", "uploads");
```

### Paso 4: Regenerar Prisma
```bash
npx prisma generate
```

---

## ⚠️ Importante: Actualizar Rutas de Imágenes en la BD

Si mueves las imágenes, las rutas guardadas en la base de datos seguirán apuntando a `/uploads/...`. 

**Opciones:**
1. **Actualizar manualmente** las rutas en la BD
2. **Crear un script** para actualizar todas las rutas
3. **Usar rutas relativas** que funcionen desde cualquier ubicación

---

## 🔄 Pasos Completos Recomendados (Opción 3)

### 1. Crear carpeta de destino
```bash
mkdir -p ~/Documents/apuntes-data/uploads
```

### 2. Mover datos existentes
```bash
# Mover base de datos
cp prisma/dev.db ~/Documents/apuntes-data/dev.db

# Mover imágenes
cp -r public/uploads/* ~/Documents/apuntes-data/uploads/
```

### 3. Crear `.env.local`
```env
DATABASE_URL="file:/Users/usuario/Documents/apuntes-data/dev.db"
UPLOADS_DIR="/Users/usuario/Documents/apuntes-data/uploads"
```

### 4. Actualizar código (ver sección Opción 3 arriba)

### 5. Regenerar Prisma
```bash
npx prisma generate
```

### 6. Reiniciar la aplicación
```bash
npm run dev
```

---

## ✅ Verificación

Después de mover los datos:

1. ✅ Verifica que la app carga correctamente
2. ✅ Crea un nuevo Daily Note y verifica que se guarda
3. ✅ Sube una imagen y verifica que se guarda en la nueva ubicación
4. ✅ Verifica que puedes ver las imágenes antiguas

---

## 🆘 Si algo sale mal

### Restaurar ubicación original:
1. Copiar `dev.db` de vuelta a `prisma/`
2. Copiar `uploads/` de vuelta a `public/`
3. Revertir cambios en el código
4. Regenerar Prisma: `npx prisma generate`

---

## 📝 Notas

- **Backup siempre**: Haz una copia de seguridad antes de mover datos
- **Rutas absolutas vs relativas**: Las rutas absolutas son más claras pero menos portables
- **Permisos**: Asegúrate de que la app tenga permisos de escritura en la nueva ubicación
- **Variables de entorno**: La opción 3 es la más flexible y profesional

