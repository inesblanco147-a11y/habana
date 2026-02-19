

# Reestructuracion Completa de la Seccion de Productos

## Resumen

Se reestructurara la seccion de productos en tres niveles: una landing page informativa (`/productos`), una pagina de catalogo con filtros y buscador (`/productos/catalogo`), y un modal de detalle con galeria de imagenes. Se actualizara la base de datos para soportar multiples imagenes por producto y especificaciones tecnicas. El panel de admin se mejorara con subida de multiples imagenes y previsualizacion.

---

## Paso 1: Migracion de Base de Datos

Agregar nuevos campos a la tabla `products`:

- `images` (text[], default '{}') - Array de URLs de imagenes multiples
- `main_image_index` (integer, default 0) - Indice de la imagen principal
- `specifications` (jsonb, default '{}') - Especificaciones tecnicas del producto

Nota: Se mantiene el campo `image` existente para compatibilidad. La logica usara `images[main_image_index]` como imagen principal, con fallback a `image` si `images` esta vacio.

---

## Paso 2: Actualizar Tipos y Hooks

### `src/types/product.ts`
- Agregar campos: `images: string[]`, `mainImageIndex: number`, `specifications: Record<string, string>`

### `src/hooks/useProducts.ts`
- Mapear los nuevos campos de la BD al tipo Product
- Mantener compatibilidad: si `images` esta vacio, usar `image` como fallback

### `src/hooks/useProductMutations.ts`
- Incluir `images`, `main_image_index`, `specifications` en insert/update

---

## Paso 3: Nueva Landing Page de Productos (`/productos`)

### Nuevo archivo: `src/pages/ProductosPage.tsx` (reescribir)

Estructura similar a `AboutSection` con:

- **Hero section**: Titulo "Nuestros Productos", subtitulo descriptivo, grid de 3 imagenes destacadas (tomadas de productos marcados como featured)
- **Contenido**: Parrafo introductorio, descripcion de categorias disponibles (listadas dinamicamente desde `product_categories`), beneficios de comprar
- **Boton CTA**: "Explorar Catalogo" que redirige a `/productos/catalogo` con estilo `bg-hasace-red`

---

## Paso 4: Pagina de Catalogo (`/productos/catalogo`)

### Nuevo archivo: `src/pages/ProductosCatalogoPage.tsx`

Incluye:

- **Barra de filtros**: Filtro por categoria (pills existentes), buscador por texto, selector de ordenamiento (nombre, precio, categoria)
- **Grid responsive**: 3 columnas desktop, 2 tablet, 1 movil
- **Cards de producto**:
  - Carrusel de imagenes usando `embla-carousel-react` (ya instalado) con flechas y dots indicadores
  - Titulo, categoria (badge), precio, descripcion truncada a 2 lineas
  - Boton "Ver detalles" que abre modal
- **Modal de detalle**:
  - Galeria de imagenes grande con navegacion
  - Titulo, descripcion completa, categoria, precio, tallas, especificaciones
  - Boton "Consultar por WhatsApp" con mensaje prellenado

### Ruta nueva en `src/App.tsx`:
- `/productos/catalogo` -> `ProductosCatalogoPage`

---

## Paso 5: Actualizar Home y Seccion de Productos Existente

### `src/components/ProductsSection.tsx`
- Limitar a mostrar solo 3-6 productos destacados (`featured = true` o los primeros 6)
- Agregar boton "Ver todos los productos" al final, con link a `/productos/catalogo`
- Usar carrusel de imagenes en las cards si el producto tiene multiples imagenes

---

## Paso 6: Panel de Admin - Multiples Imagenes

### `src/pages/AdminPanel.tsx` (modal de productos)
- Reemplazar `ImageUpload` individual por `MultiImageUpload` con `maxImages={5}`
- Agregar selector de "imagen principal" (click en miniatura para marcarla)
- Agregar seccion de "Especificaciones" con pares clave-valor dinamicos
- Mantener campo `image` sincronizado con `images[mainImageIndex]` para compatibilidad

---

## Paso 7: SEO y Navegacion

### `src/components/SEOHead.tsx`
- Agregar entrada para `/productos/catalogo` con titulo y descripcion especificos

### `src/components/Breadcrumbs.tsx`
- Agregar entrada para `/productos/catalogo`: "Productos > Catalogo"

### `src/components/Header.tsx`
- El link "Productos" seguira apuntando a `/productos` (landing page)
- La navegacion activa resaltara tanto `/productos` como `/productos/catalogo`

---

## Paso 8: Optimizacion de Imagenes (en el componente de upload)

### `src/components/MultiImageUpload.tsx` (mejoras)
- Redimensionar imagenes a max 1200px de ancho antes de subir (usando Canvas API nativa del navegador)
- Comprimir calidad al 85%
- Convertir a WebP cuando el navegador lo soporte
- Mantener relacion de aspecto

Nota: Se usara la Canvas API nativa del navegador en lugar de una libreria externa de crop/editor, ya que esto cubre los requisitos de optimizacion sin agregar dependencias pesadas. El editor de recorte/rotacion completo puede agregarse como mejora futura con `react-easy-crop`.

---

## Archivos a Crear/Modificar

| Archivo | Accion |
|---|---|
| Migracion SQL | Crear (agregar campos images, main_image_index, specifications) |
| `src/types/product.ts` | Modificar (nuevos campos) |
| `src/hooks/useProducts.ts` | Modificar (mapear nuevos campos) |
| `src/hooks/useProductMutations.ts` | Modificar (insert/update nuevos campos) |
| `src/pages/ProductosPage.tsx` | Reescribir (landing page) |
| `src/pages/ProductosCatalogoPage.tsx` | Crear (catalogo con filtros) |
| `src/components/ProductsSection.tsx` | Modificar (limitar a destacados + CTA) |
| `src/components/ProductImageCarousel.tsx` | Crear (carrusel reutilizable) |
| `src/components/MultiImageUpload.tsx` | Modificar (optimizacion de imagenes) |
| `src/App.tsx` | Modificar (nueva ruta) |
| `src/components/SEOHead.tsx` | Modificar (nueva entrada SEO) |
| `src/components/Breadcrumbs.tsx` | Modificar (nueva breadcrumb) |
| `src/pages/AdminPanel.tsx` | Modificar (multi-imagen + especificaciones) |
| `src/data/mockData.ts` | Modificar (nuevos campos) |

