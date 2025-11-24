# ⚛️ React para Principiantes - Conceptos Clave

## 🎯 ¿Qué es React?

**React** es una **biblioteca de JavaScript** (ahora también TypeScript) que te permite crear **interfaces de usuario** de forma fácil y organizada.

### Analogía Simple 🏗️

Imagina que estás construyendo una casa:
- **React** = El sistema de construcción modular
- **Componentes** = Las habitaciones (cada una tiene su función)
- **Props** = Las instrucciones que pasas entre habitaciones
- **Estado (useState)** = Los muebles que puedes mover o cambiar
- **Efectos (useEffect)** = Las acciones automáticas (como encender la luz cuando entras)

---

## 1. 📦 Componentes

### ¿Qué es un Componente?

Un **componente** es como una **pieza de LEGO** reutilizable. Es una función que devuelve código HTML (JSX) que se muestra en la pantalla.

### Ejemplo Básico

```typescript
// Esto es un componente simple
function Saludo() {
  return <h1>¡Hola Mundo!</h1>;
}
```

### Componente en tu App

Mira este ejemplo real de tu aplicación:

```typescript
// components/concepts/ConceptCard.tsx
export function ConceptCard({ concept }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{concept.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{concept.content}</p>
      </CardContent>
    </Card>
  );
}
```

**¿Qué hace este componente?**
- Recibe información de un concepto (`concept`)
- Muestra una tarjeta bonita con el título y contenido
- Es **reutilizable**: puedes usarlo muchas veces con diferentes conceptos

### Usar un Componente

```typescript
// En otro componente, puedes usar ConceptCard así:
<ConceptCard concept={miConcepto} />
<ConceptCard concept={otroConcepto} />
<ConceptCard concept={tercerConcepto} />
```

**Cada vez que usas `<ConceptCard />`, React crea una nueva "instancia" del componente.**

### Tipos de Componentes

#### 1. **Componente de Función** (el más común hoy en día)

```typescript
function MiComponente() {
  return <div>Hola</div>;
}
```

#### 2. **Componente con Arrow Function**

```typescript
const MiComponente = () => {
  return <div>Hola</div>;
};
```

**En tu app usas principalmente componentes de función.**

---

## 2. 🎁 Props (Propiedades)

### ¿Qué son las Props?

**Props** son como **parámetros** que pasas a una función, pero específicos para componentes React. Son la forma de pasar datos de un componente padre a un componente hijo.

### Analogía Simple 📮

Imagina que envías un paquete:
- **Props** = El contenido del paquete
- **Componente hijo** = El destinatario que recibe el paquete
- **Componente padre** = El remitente que envía el paquete

### Ejemplo Básico

```typescript
// Componente PADRE
function App() {
  const nombre = "Juan";
  return <Saludo nombre={nombre} />; // ← Pasando la prop "nombre"
}

// Componente HIJO (recibe la prop)
function Saludo({ nombre }) {
  return <h1>¡Hola {nombre}!</h1>; // ← Usando la prop
}
```

### Ejemplo Real de tu App

Mira cómo se usan props en tu aplicación:

```typescript
// components/concepts/ConceptList.tsx
export function ConceptList() {
  const [concepts, setConcepts] = useState([]);
  
  return (
    <div>
      {concepts.map((concept) => (
        <ConceptCard key={concept.id} concept={concept} />
        //                    ↑                    ↑
        //              prop "key"          prop "concept"
      ))}
    </div>
  );
}
```

**¿Qué está pasando?**
1. `ConceptList` tiene un array de conceptos
2. Para cada concepto, crea un `<ConceptCard />`
3. Le pasa cada concepto como prop: `concept={concept}`
4. `ConceptCard` recibe esa prop y la usa para mostrar la información

### Definir Props con TypeScript

En tu app usas TypeScript, así que defines el tipo de las props:

```typescript
// ConceptCard recibe props con este formato:
interface ConceptCardProps {
  concept: {
    id: string;
    title: string;
    slug: string;
    content: string;
  };
}

export function ConceptCard({ concept }: ConceptCardProps) {
  return (
    <Card>
      <CardTitle>{concept.title}</CardTitle>
      {/* ... */}
    </Card>
  );
}
```

**Esto significa:**
- `ConceptCard` espera recibir una prop llamada `concept`
- `concept` debe tener: `id`, `title`, `slug`, `content` (todos strings)

### Reglas de las Props

1. **Props son de solo lectura** - No puedes modificarlas dentro del componente hijo
2. **Props fluyen hacia abajo** - Solo de padre a hijo, nunca al revés
3. **Puedes pasar cualquier cosa** - Strings, números, objetos, arrays, funciones

### Ejemplo: Pasar una Función como Prop

```typescript
// Componente PADRE
function ConceptList() {
  const handleDelete = (id: string) => {
    console.log("Eliminar concepto:", id);
  };
  
  return (
    <ConceptCard 
      concept={concept} 
      onDelete={handleDelete}  // ← Pasando una función
    />
  );
}

// Componente HIJO
function ConceptCard({ concept, onDelete }) {
  return (
    <Card>
      <Button onClick={() => onDelete(concept.id)}>
        Eliminar
      </Button>
    </Card>
  );
}
```

---

## 3. 🔄 useState - Estado del Componente

### ¿Qué es el Estado?

El **estado** es información que puede **cambiar** y cuando cambia, React **actualiza automáticamente** lo que se muestra en pantalla.

### Analogía Simple 🎚️

Imagina un interruptor de luz:
- **Estado** = ¿Está la luz encendida o apagada?
- **Cambiar el estado** = Presionar el interruptor
- **React actualiza** = La luz se enciende/apaga automáticamente

### ¿Por qué necesitamos Estado?

Sin estado, los componentes son "estáticos" (no cambian). Con estado, pueden ser "dinámicos" (reaccionan a cambios).

### Sintaxis de useState

```typescript
const [valor, setValor] = useState(valorInicial);
```

**Desglose:**
- `valor` = El valor actual del estado
- `setValor` = Función para cambiar el valor
- `useState(valorInicial)` = Hook que crea el estado con un valor inicial

### Ejemplo Básico: Contador

```typescript
function Contador() {
  const [contador, setContador] = useState(0);
  //     ↑              ↑              ↑
  //   valor      función      valor inicial
  
  return (
    <div>
      <p>Has hecho clic {contador} veces</p>
      <button onClick={() => setContador(contador + 1)}>
        Clic aquí
      </button>
    </div>
  );
}
```

**¿Qué pasa cuando haces clic?**
1. Se ejecuta `setContador(contador + 1)`
2. El estado `contador` cambia (0 → 1 → 2 → 3...)
3. React detecta el cambio
4. React vuelve a renderizar el componente
5. El número en pantalla se actualiza automáticamente ✨

### Ejemplo Real de tu App

Mira cómo usas `useState` en `ConceptList`:

```typescript
// components/concepts/ConceptList.tsx
export function ConceptList() {
  // Estado para guardar la lista de conceptos
  const [concepts, setConcepts] = useState<Concept[]>([]);
  //     ↑              ↑
  //   array de      función para
  //   conceptos     actualizar la lista
  
  // Estado para saber si está cargando
  const [loading, setLoading] = useState(true);
  
  // Estado para el texto de búsqueda
  const [search, setSearch] = useState("");
  
  // ... resto del código
}
```

**¿Qué hace cada estado?**

1. **`concepts`** - Guarda la lista de conceptos que vienen de la API
2. **`loading`** - Indica si los datos están cargando (true/false)
3. **`search`** - Guarda lo que el usuario escribe en el buscador

### Actualizar el Estado

```typescript
// ❌ INCORRECTO - No modifiques el estado directamente
concepts.push(nuevoConcepto); // ¡NO HAGAS ESTO!

// ✅ CORRECTO - Usa la función setter
setConcepts([...concepts, nuevoConcepto]);
//            ↑
//      Crea un nuevo array con los conceptos existentes + el nuevo
```

### Ejemplo: Actualizar Estado en tu App

```typescript
const fetchConcepts = async () => {
  setLoading(true); // ← Cambiar estado: ahora está cargando
  
  try {
    const res = await fetch('/api/concepts');
    const data = await res.json();
    setConcepts(data); // ← Cambiar estado: guardar los conceptos
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false); // ← Cambiar estado: ya no está cargando
  }
};
```

### Tipos de Estado Comunes

```typescript
// String
const [nombre, setNombre] = useState("");

// Número
const [edad, setEdad] = useState(0);

// Boolean (verdadero/falso)
const [activo, setActivo] = useState(false);

// Array
const [items, setItems] = useState([]);

// Objeto
const [usuario, setUsuario] = useState({ nombre: "", email: "" });

// null (cuando no hay valor aún)
const [datos, setDatos] = useState(null);
```

### Reglas Importantes de useState

1. **Solo en Client Components** - Necesitas `"use client"` al inicio del archivo
2. **No modifiques directamente** - Siempre usa la función setter
3. **Los cambios son asíncronos** - El estado no cambia inmediatamente después de `setX()`
4. **React re-renderiza** - Cada vez que cambias el estado, React vuelve a dibujar el componente

---

## 4. ⚡ useEffect - Efectos Secundarios

### ¿Qué es useEffect?

**useEffect** te permite ejecutar código **después** de que React haya renderizado el componente. Es perfecto para:
- Cargar datos de una API
- Suscribirse a eventos
- Limpiar recursos
- Ejecutar código cuando algo cambia

### Analogía Simple 🎬

Imagina una película:
- **Render del componente** = La escena se muestra
- **useEffect** = Las acciones que pasan después de que la escena se muestra
- **Cleanup** = Limpiar cuando la escena termina

### Sintaxis Básica

```typescript
useEffect(() => {
  // Código que se ejecuta
}, [dependencias]);
//   ↑
// Array de dependencias (opcional)
```

### Ejemplo Básico: Cargar Datos

```typescript
function ConceptList() {
  const [concepts, setConcepts] = useState([]);
  
  useEffect(() => {
    // Este código se ejecuta cuando el componente se monta
    fetch('/api/concepts')
      .then(res => res.json())
      .then(data => setConcepts(data));
  }, []); // ← Array vacío = solo una vez al inicio
}
```

**¿Qué hace?**
1. Cuando el componente aparece en pantalla
2. Se ejecuta el código dentro de `useEffect`
3. Hace una petición a la API
4. Guarda los datos en el estado
5. React actualiza la pantalla con los nuevos datos

### Ejemplo Real de tu App

```typescript
// components/concepts/ConceptList.tsx
export function ConceptList() {
  const [concepts, setConcepts] = useState([]);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    fetchConcepts(); // ← Se ejecuta cuando cambia 'search'
  }, [search]); // ← Dependencia: se ejecuta cuando 'search' cambia
  
  const fetchConcepts = async () => {
    const url = search
      ? `/api/concepts?search=${encodeURIComponent(search)}`
      : "/api/concepts";
    const res = await fetch(url);
    const data = await res.json();
    setConcepts(data);
  };
}
```

**¿Qué pasa aquí?**
- Cuando el usuario escribe en el buscador, `search` cambia
- `useEffect` detecta el cambio (porque `search` está en las dependencias)
- Se ejecuta `fetchConcepts()` automáticamente
- Se buscan los conceptos con el nuevo término
- La lista se actualiza en tiempo real 🔍

### Diferentes Casos de Uso

#### 1. **Solo una vez al inicio** (array vacío)

```typescript
useEffect(() => {
  // Cargar datos iniciales
  fetchData();
}, []); // ← Solo se ejecuta una vez
```

#### 2. **Cada vez que cambia algo** (con dependencias)

```typescript
useEffect(() => {
  // Buscar cuando cambia el término de búsqueda
  buscar(searchTerm);
}, [searchTerm]); // ← Se ejecuta cuando searchTerm cambia
```

#### 3. **Cada vez que se renderiza** (sin array)

```typescript
useEffect(() => {
  // ⚠️ CUIDADO: Esto se ejecuta en CADA render
  console.log("Componente renderizado");
}); // ← Sin array = cada render (puede causar loops infinitos)
```

### Cleanup (Limpieza)

A veces necesitas limpiar cuando el componente se desmonta:

```typescript
useEffect(() => {
  // Suscribirse a algo
  const subscription = subscribe();
  
  // Función de limpieza
  return () => {
    // Limpiar cuando el componente se desmonta
    subscription.unsubscribe();
  };
}, []);
```

**Ejemplo real: Timer**

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);
  
  return () => {
    clearInterval(timer); // ← Limpiar el timer cuando el componente se desmonta
  };
}, []);
```

### Ejemplo Completo: ConceptList con useEffect

```typescript
"use client"; // ← Necesario para usar hooks

import { useEffect, useState } from "react";

export function ConceptList() {
  // 1. Estados
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // 2. Efecto: Cargar conceptos cuando cambia 'search'
  useEffect(() => {
    fetchConcepts();
  }, [search]);
  
  // 3. Función para obtener conceptos
  const fetchConcepts = async () => {
    setLoading(true);
    try {
      const url = search
        ? `/api/concepts?search=${search}`
        : "/api/concepts";
      const res = await fetch(url);
      const data = await res.json();
      setConcepts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // 4. Render
  if (loading) return <p>Cargando...</p>;
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {concepts.map(concept => (
        <div key={concept.id}>{concept.title}</div>
      ))}
    </div>
  );
}
```

**Flujo completo:**
1. Componente se monta → `useEffect` se ejecuta → Carga conceptos
2. Usuario escribe en el buscador → `search` cambia
3. `useEffect` detecta el cambio → Vuelve a cargar conceptos
4. Los conceptos se actualizan → La pantalla se actualiza automáticamente

---

## 🎓 Resumen Visual

### Componente Completo con Todo

```typescript
"use client";

import { useState, useEffect } from "react";

// 1. COMPONENTE
export function ConceptList() {
  
  // 2. ESTADO (useState)
  const [concepts, setConcepts] = useState([]);
  const [search, setSearch] = useState("");
  
  // 3. EFECTO (useEffect)
  useEffect(() => {
    fetchConcepts();
  }, [search]);
  
  // Función auxiliar
  const fetchConcepts = async () => {
    const res = await fetch(`/api/concepts?search=${search}`);
    const data = await res.json();
    setConcepts(data);
  };
  
  // 4. RENDER (lo que se muestra)
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {concepts.map(concept => (
        <ConceptCard 
          key={concept.id}
          concept={concept}  // ← 5. PROPS
        />
      ))}
    </div>
  );
}

// Componente hijo que recibe props
function ConceptCard({ concept }) {  // ← 5. PROPS
  return <div>{concept.title}</div>;
}
```

---

## 🎯 Conceptos Clave Resumidos

### Componentes
- ✅ Piezas reutilizables de UI
- ✅ Funciones que devuelven JSX
- ✅ Se pueden anidar (componente dentro de componente)

### Props
- ✅ Datos que pasas de padre a hijo
- ✅ Solo lectura (no se modifican en el hijo)
- ✅ Pueden ser cualquier cosa (string, objeto, función)

### useState
- ✅ Guarda datos que pueden cambiar
- ✅ Cuando cambia, React actualiza la pantalla
- ✅ Siempre usa la función setter para cambiar

### useEffect
- ✅ Ejecuta código después del render
- ✅ Perfecto para cargar datos, suscripciones, etc.
- ✅ Puede tener dependencias para ejecutarse cuando algo cambia

---

## 🚀 Próximos Pasos

Ahora que entiendes estos conceptos, puedes:
1. Leer el código de tus componentes y entender qué hacen
2. Modificar componentes existentes
3. Crear nuevos componentes
4. Entender cómo fluyen los datos en tu app

**¡La mejor forma de aprender es practicando!** 🎉

---

## 📚 Recursos Adicionales

- [React Docs - Componentes](https://react.dev/learn/your-first-component)
- [React Docs - Props](https://react.dev/learn/passing-props-to-a-component)
- [React Docs - useState](https://react.dev/reference/react/useState)
- [React Docs - useEffect](https://react.dev/reference/react/useEffect)

