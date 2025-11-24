# 🧪 Guía para Probar la Búsqueda Avanzada

## 📋 Pasos para Probar Manualmente

### 1. Iniciar el Servidor

```bash
npm run dev
```

Abre tu navegador en: `http://localhost:3000`

### 2. Crear Datos de Prueba (si no tienes)

Antes de probar la búsqueda, asegúrate de tener algunos datos:

#### Crear una Daily Note:
1. Ve a `/daily`
2. Crea una nota con título "Mi primera nota" y contenido "Aprendiendo Next.js y React"

#### Crear un Concepto:
1. Ve a `/concepts`
2. Crea un concepto con título "React Hooks" y contenido "Los hooks son funciones especiales..."

#### Crear un Prompt:
1. Ve a `/prompts`
2. Crea un prompt con título "Debugging Tips" y contenido "Usa console.log para depurar..."

### 3. Probar la Búsqueda Global

#### Método 1: Atajo de Teclado (Recomendado)
1. Presiona **Cmd+K** (Mac) o **Ctrl+K** (Windows/Linux)
2. Debería abrirse el diálogo de búsqueda
3. Escribe tu búsqueda (ej: "React")
4. Verás resultados en tiempo real

#### Método 2: Botón en el Header
1. Mira el header superior
2. Haz clic en el botón "Buscar..." (con icono de lupa)
3. Se abrirá el mismo diálogo

### 4. Funcionalidades a Probar

#### ✅ Búsqueda en Tiempo Real
- Escribe "React" → Debería mostrar resultados mientras escribes
- Escribe "Hooks" → Debería filtrar resultados
- Escribe algo que no existe → Debería mostrar "No se encontraron resultados"

#### ✅ Navegación con Teclado
- **Flecha Abajo (↓)**: Selecciona el siguiente resultado
- **Flecha Arriba (↑)**: Selecciona el resultado anterior
- **Enter**: Navega al resultado seleccionado
- **Escape**: Cierra el diálogo

#### ✅ Resaltado de Coincidencias
- Los términos que coinciden aparecen resaltados en amarillo
- Verifica que el resaltado funcione en títulos y contenido

#### ✅ Agrupación por Tipo
- Los resultados están agrupados por:
  - 📅 Nota diaria
  - 📖 Concepto
  - 💬 Prompt
  - 🖼️ Imagen

#### ✅ Búsqueda Difusa
- Prueba con errores de escritura:
  - "Reat" → Debería encontrar "React"
  - "Hook" → Debería encontrar "Hooks"
  - "Debug" → Debería encontrar "Debugging"

### 5. Casos de Prueba Específicos

#### Test 1: Búsqueda Exacta
```
Query: "React Hooks"
Resultado esperado: Debería encontrar el concepto "React Hooks"
```

#### Test 2: Búsqueda Parcial
```
Query: "Hook"
Resultado esperado: Debería encontrar cualquier item con "Hook" o "Hooks"
```

#### Test 3: Búsqueda en Contenido
```
Query: "Next.js"
Resultado esperado: Debería encontrar la daily note que menciona "Next.js"
```

#### Test 4: Búsqueda Vacía
```
Query: "" (vacío)
Resultado esperado: No debería mostrar resultados, solo el mensaje de ayuda
```

#### Test 5: Sin Resultados
```
Query: "xyz123noexiste"
Resultado esperado: Debería mostrar "No se encontraron resultados"
```

### 6. Verificar la Navegación

1. Abre la búsqueda (Cmd+K)
2. Escribe "React"
3. Usa las flechas para seleccionar un resultado
4. Presiona Enter
5. Deberías navegar a la página del resultado seleccionado

### 7. Probar en Diferentes Páginas

La búsqueda global debería funcionar desde cualquier página:
- `/` (Dashboard)
- `/daily`
- `/concepts`
- `/prompts`
- `/gallery`

## 🐛 Problemas Comunes

### El atajo Cmd+K no funciona
- Verifica que no haya otra aplicación usando ese atajo
- Prueba hacer clic en el botón de búsqueda manualmente

### No aparecen resultados
- Verifica que tengas datos creados
- Abre la consola del navegador (F12) y revisa errores
- Verifica que `/api/search` esté funcionando

### La búsqueda es muy lenta
- Normal en la primera carga (carga todos los items)
- Las búsquedas siguientes deberían ser instantáneas

## ✅ Checklist de Pruebas

- [ ] El atajo Cmd+K abre el diálogo
- [ ] El botón de búsqueda en el header funciona
- [ ] La búsqueda muestra resultados en tiempo real
- [ ] Los resultados están agrupados por tipo
- [ ] Las coincidencias están resaltadas
- [ ] La navegación con teclado funciona (↑↓ Enter)
- [ ] Al presionar Enter navega al resultado
- [ ] Escape cierra el diálogo
- [ ] La búsqueda difusa funciona (errores de escritura)
- [ ] Muestra mensaje cuando no hay resultados

