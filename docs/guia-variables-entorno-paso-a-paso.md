# 🎓 Guía Paso a Paso: Variables de Entorno para Principiantes

## 📚 ¿Qué son las Variables de Entorno?

Imagina que las **variables de entorno** son como **notas adhesivas** que le dices a tu aplicación:
- "Hey, guarda los datos AQUÍ"
- "Usa esta configuración"

La ventaja es que puedes cambiar estas "notas" sin tocar el código. ¡Muy práctico! 🎯

---

## 🎯 ¿Qué Hemos Implementado?

Hemos configurado tu aplicación para que use un archivo llamado `.env.local` donde puedes escribir:
- **Dónde guardar la base de datos** (Daily Notes, Conceptos, Prompts)
- **Dónde guardar las imágenes** que subes

---

## 📝 PASO 1: Crear el Archivo `.env.local`

### ¿Qué es este archivo?
Es un archivo de texto simple donde escribes las configuraciones. Next.js lo lee automáticamente.

### Cómo crearlo:

**Opción A: Desde el editor (Cursor/VS Code)**
1. En la raíz del proyecto (donde está `package.json`)
2. Crea un nuevo archivo llamado: `.env.local`
3. Copia este contenido:

```env
# Base de datos - Por ahora usamos la ubicación por defecto
DATABASE_URL="file:./prisma/dev.db"

# Carpeta de imágenes - Por ahora usamos la ubicación por defecto
UPLOADS_DIR=""
```

**Opción B: Desde la terminal**
```bash
# Desde la raíz del proyecto
touch .env.local
```

Luego abre el archivo y pega el contenido de arriba.

### ✅ Verificación:
- El archivo debe estar en: `/Users/usuario/Desktop/Dev/apuntes-app/.env.local`
- Debe tener exactamente ese nombre (con el punto al inicio)

---

## 🔍 PASO 2: Entender Qué Hemos Cambiado en el Código

### Cambio 1: `prisma/schema.prisma`

**ANTES:**
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"  ← Ruta fija en el código
}
```

**AHORA:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")  ← Lee del archivo .env.local
}
```

**¿Qué significa?**
- Antes: La ruta estaba "quemada" en el código
- Ahora: Lee la ruta del archivo `.env.local`
- Si no existe `.env.local`, usará la ruta por defecto

---

### Cambio 2: `app/api/images/upload/route.ts`

**ANTES:**
```typescript
const uploadsDir = join(process.cwd(), "public", "uploads");
```

**AHORA:**
```typescript
const uploadsDir = process.env.UPLOADS_DIR 
  ? process.env.UPLOADS_DIR 
  : join(process.cwd(), "public", "uploads");
```

**¿Qué significa?**
- `process.env.UPLOADS_DIR` → Lee la variable del archivo `.env.local`
- Si existe → usa esa ruta
- Si no existe o está vacía → usa la ruta por defecto (`public/uploads`)

---

### Cambio 3: `app/api/images/[id]/route.ts`

Similar al anterior, ahora también lee de variables de entorno para eliminar imágenes.

---

## 🚀 PASO 3: Regenerar Prisma Client

### ¿Por qué?
Prisma necesita "recompilar" para entender los cambios en el schema.

### Cómo hacerlo:
```bash
npx prisma generate
```

**Explicación simple:**
- `npx` → Ejecuta un comando de Node.js
- `prisma` → La herramienta de base de datos
- `generate` → "Genera" el código necesario

**Resultado esperado:**
Deberías ver algo como:
```
✔ Generated Prisma Client
```

---

## ✅ PASO 4: Probar que Todo Funciona

### 4.1. Reiniciar la aplicación
```bash
# Si está corriendo, deténla (Ctrl+C) y luego:
npm run dev
```

### 4.2. Verificar que carga
- Abre el navegador en `http://localhost:3000`
- Debería cargar normalmente

### 4.3. Probar crear un Daily Note
- Crea un nuevo Daily Note
- Verifica que se guarda correctamente

### 4.4. Probar subir una imagen
- Sube una imagen
- Verifica que se guarda en `public/uploads/`

---

## 🎨 PASO 5: Cambiar la Ubicación de los Datos (Opcional)

### Ejemplo: Mover todo a `~/Documents/apuntes-data/`

#### 5.1. Crear la carpeta de destino
```bash
mkdir -p ~/Documents/apuntes-data/uploads
```

**Explicación:**
- `mkdir` → Crea carpetas
- `-p` → Crea todas las carpetas necesarias (si no existen)
- `~/Documents/apuntes-data/uploads` → La ruta donde guardaremos todo

#### 5.2. Mover los datos existentes

**Mover la base de datos:**
```bash
cp prisma/dev.db ~/Documents/apuntes-data/dev.db
```

**Mover las imágenes:**
```bash
# Si tienes imágenes en public/uploads/
cp -r public/uploads/* ~/Documents/apuntes-data/uploads/
```

**Explicación:**
- `cp` → Copia archivos
- `-r` → Copia recursivamente (carpetas completas)
- `*` → Todos los archivos dentro de uploads

#### 5.3. Actualizar `.env.local`

Abre el archivo `.env.local` y cámbialo a:

```env
# Base de datos en nueva ubicación
DATABASE_URL="file:/Users/usuario/Documents/apuntes-data/dev.db"

# Imágenes en nueva ubicación
UPLOADS_DIR="/Users/usuario/Documents/apuntes-data/uploads"
```

**⚠️ IMPORTANTE:**
- Para la base de datos: usa `file:/ruta/completa` (con `file:` al inicio)
- Para las imágenes: usa la ruta completa sin `file:`
- En macOS/Linux: `~` significa tu carpeta de usuario, pero en `.env.local` debes usar la ruta completa

#### 5.4. Regenerar Prisma (otra vez)
```bash
npx prisma generate
```

#### 5.5. Reiniciar la aplicación
```bash
npm run dev
```

---

## 🔍 PASO 6: Verificar que los Datos Están en la Nueva Ubicación

### Verificar base de datos:
```bash
ls -lh ~/Documents/apuntes-data/dev.db
```

Deberías ver el archivo con su tamaño.

### Verificar imágenes:
```bash
ls -lh ~/Documents/apuntes-data/uploads/
```

Deberías ver tus imágenes (si las moviste).

---

## 🆘 Solución de Problemas

### Problema 1: "Cannot find module '@prisma/client'"
**Solución:**
```bash
npm install
npx prisma generate
```

### Problema 2: "Database file not found"
**Causa:** La ruta en `DATABASE_URL` es incorrecta
**Solución:**
- Verifica que la ruta sea absoluta (empieza con `/`)
- Verifica que el archivo existe en esa ubicación
- En macOS: usa `/Users/usuario/...` no `~/...`

### Problema 3: "Permission denied" al guardar imágenes
**Causa:** No tienes permisos de escritura en la carpeta
**Solución:**
```bash
chmod -R 755 ~/Documents/apuntes-data
```

### Problema 4: Las imágenes no se ven en el navegador
**Causa:** Si moviste las imágenes fuera de `public/`, Next.js no las sirve automáticamente
**Solución:** Necesitarías crear una ruta API para servir las imágenes, o mantenerlas en `public/`

---

## 📋 Resumen de Archivos Modificados

1. ✅ `prisma/schema.prisma` → Ahora usa `env("DATABASE_URL")`
2. ✅ `app/api/images/upload/route.ts` → Ahora usa `process.env.UPLOADS_DIR`
3. ✅ `app/api/images/[id]/route.ts` → Ahora usa `process.env.UPLOADS_DIR`
4. ✅ `.env.local` → **TÚ debes crearlo** (hay un `.env.example` como referencia)

---

## 🎯 ¿Qué Sigue?

Ahora puedes:
- ✅ Cambiar la ubicación de los datos editando solo `.env.local`
- ✅ No necesitas tocar el código para mover datos
- ✅ Tener diferentes configuraciones para desarrollo y producción

---

## 💡 Conceptos Clave para Principiantes

### ¿Qué es `process.env`?
- Es un objeto en Node.js que contiene las variables de entorno
- `process.env.UPLOADS_DIR` → Lee la variable `UPLOADS_DIR` del archivo `.env.local`

### ¿Qué es `env("DATABASE_URL")`?
- Es una función de Prisma que lee variables de entorno
- Equivale a `process.env.DATABASE_URL` pero específico para Prisma

### ¿Por qué `.env.local` y no `.env`?
- `.env.local` → Solo en tu máquina, no se sube a Git (está en `.gitignore`)
- `.env` → Se puede compartir (pero no debería tener datos sensibles)

---

## ✅ Checklist Final

- [ ] Archivo `.env.local` creado en la raíz del proyecto
- [ ] Contenido del archivo configurado correctamente
- [ ] Ejecutado `npx prisma generate`
- [ ] Aplicación reiniciada (`npm run dev`)
- [ ] Probado crear un Daily Note
- [ ] Probado subir una imagen
- [ ] (Opcional) Datos movidos a nueva ubicación
- [ ] (Opcional) `.env.local` actualizado con nuevas rutas

---

¡Listo! 🎉 Ahora tu aplicación es más flexible y puedes cambiar dónde se guardan los datos fácilmente.

