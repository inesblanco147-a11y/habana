

## Plan: Segunda fila de doctores desde backend Python externo

### Resumen
Agregar una fila independiente de tarjetas de doctores en la seccion "Sobre Nosotros" que consuma datos de un backend Python externo, junto con una capa de API basada en axios para operaciones CRUD.

---

### 1. Instalar axios
Se necesita agregar `axios` como dependencia del proyecto.

### 2. Crear capa de API (`src/api/`)

**`src/api/config.ts`**
- Exportar una constante `API_BASE_URL` con valor `http://127.0.0.1:8000/`
- Crear instancia `authAxios` de axios con la base URL configurada
- Configurar interceptor para incluir el token de autenticacion de la sesion actual en el header `Authorization: Bearer <token>`

**`src/api/doctors.ts`**
- `get_doctors({ pageParam })` - GET `/equipo/doctors/?page={pageParam}&pages=9` (paginado)
- `post_doctor(data)` - POST `/equipo/doctors/` con FormData
- `update_doctor(id, data)` - PUT `/equipo/doctors/{id}/` con FormData
- `delete_doctor(id)` - DELETE `/equipo/doctors/{id}/`

### 3. Crear hooks para doctores externos

**`src/hooks/useExternalDoctors.ts`**
- Hook con `useInfiniteQuery` para obtener doctores paginados desde el backend Python
- Query key: `["external_doctors"]`

**`src/hooks/useExternalDoctorMutations.ts`**
- `useCreateExternalDoctor`, `useUpdateExternalDoctor`, `useDeleteExternalDoctor`
- Misma estructura que los mutations existentes, pero usando las funciones de `src/api/doctors.ts`

### 4. Definir tipo para doctores externos

**`src/types/externalDoctor.ts`**
- Interface que refleje la estructura que devuelve el backend Python (puede diferir de la local)
- Campos esperados: id, name, title, specialty, summary, experience, education, certifications, image

### 5. Modificar `AboutSection.tsx`

- Agregar una segunda seccion de carrusel debajo del existente con titulo diferenciado (ej: "Equipo Medico Externo")
- Usar `useExternalDoctors` para obtener datos
- Reutilizar el mismo diseno de tarjetas y modal de detalle
- Manejar estados de carga y error independientemente del carrusel existente

### 6. Agregar gestion CRUD en AdminPanel

- Agregar una nueva pestana o sub-seccion dentro de la pestana "Doctores" para gestionar doctores del backend externo
- Reutilizar el mismo formulario modal pero conectado a los mutations externos

---

### Detalles tecnicos

**Interceptor de autenticacion (src/api/config.ts):**
```typescript
import axios from "axios";
import { supabase } from "@/integrations/supabase/client";

export const API_BASE_URL = "http://127.0.0.1:8000/";

export const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

authAxios.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
```

**Estructura de archivos a crear:**
```text
src/
  api/
    config.ts          -- axios instance + base URL
    doctors.ts         -- CRUD functions para backend Python
  hooks/
    useExternalDoctors.ts          -- query hook
    useExternalDoctorMutations.ts  -- mutation hooks
  types/
    externalDoctor.ts              -- interface
```

**Archivos a modificar:**
- `src/components/AboutSection.tsx` -- agregar segunda fila de cards
- `src/pages/AdminPanel.tsx` -- agregar gestion CRUD externa

