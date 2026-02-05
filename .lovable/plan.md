
# Plan: Sincronizacion de Horarios con Google Calendar

## Estado Actual

Las siguientes mejoras ya fueron implementadas:
- Hero Section con colores azul y rojo de la marca
- Tabla `services` en la base de datos con RLS
- Componente ServicesSection con ofertas del mes
- Panel de administrador con gestion de servicios
- SEO (sitemap.xml, robots.txt, JSON-LD estructurado)
- Headers de seguridad CSP y X-Frame-Options

## Objetivo Pendiente

Sincronizar los horarios disponibles con Google Calendar para mostrar solo los espacios libres cuando el usuario seleccione una fecha.

---

## Implementacion Tecnica

### 1. Conectar Google Calendar API

Vincular el conector de Google Calendar para obtener acceso a la API. Esto proporcionara las credenciales necesarias para consultar eventos del calendario.

### 2. Crear Edge Function `get-available-slots`

```text
Archivo: supabase/functions/get-available-slots/index.ts

Flujo:
1. Recibir fecha seleccionada como parametro
2. Consultar eventos del calendario para esa fecha
3. Calcular horarios ocupados
4. Retornar slots disponibles (09:00-18:00)
```

**Logica de slots:**
- Horario base: 09:00 a 18:00 (intervalos de 30 min)
- Excluir slots que coincidan con eventos existentes
- Considerar pausa de almuerzo (13:00-14:00 opcional)

### 3. Actualizar AppointmentSection

**Cambios necesarios:**
- Agregar estado para slots disponibles y carga
- Llamar a la edge function cuando se seleccione una fecha
- Mostrar indicador de carga mientras consulta
- Renderizar solo los horarios disponibles
- Mensaje cuando no hay disponibilidad

---

## Experiencia de Usuario

```text
+----------------------------------+
|  1. Usuario selecciona fecha     |
|         [Calendario]             |
|                                  |
|  2. Sistema consulta Google Cal  |
|      [Cargando horarios...]      |
|                                  |
|  3. Muestra solo disponibles     |
|   [09:00] [10:30] [15:00] [17:00]|
|                                  |
|  4. Usuario selecciona horario   |
|                                  |
+----------------------------------+
```

---

## Archivos a Crear

| Archivo | Descripcion |
|---------|-------------|
| `supabase/functions/get-available-slots/index.ts` | Edge function para calcular disponibilidad |

## Archivos a Modificar

| Archivo | Cambios |
|---------|---------|
| `src/components/AppointmentSection.tsx` | Agregar logica de carga dinamica de slots |
| `supabase/config.toml` | Configurar JWT para la nueva funcion |

---

## Requisito Previo

Para implementar esta funcionalidad, es necesario conectar el conector de Google Calendar que permite acceder a la API de Google Calendar a traves del gateway de Lovable.
