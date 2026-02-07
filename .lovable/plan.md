
## Ajustes de layout en la seccion de Galeria

### Problemas actuales

1. **Galeria de Momentos** esta dentro de un `max-w-3xl` que la hace mas angosta que las cards de eventos (que usan el ancho completo del container).
2. **Videos** esta fuera del `container`, por lo que no tiene el mismo padding/ancho que los eventos.
3. Los video cards tienen `p-4` en el CardContent vs `p-5` en los event cards, y no tienen la misma estructura visual.

### Cambios en `src/components/EventsSection.tsx`

**1. Expandir la Galeria de Momentos al ancho completo del grid de eventos:**
- Sacar el carrusel de la galeria fuera del `div.max-w-3xl` que lo contiene actualmente (linea 53-88).
- Mantener solo el titulo/descripcion de la seccion dentro del `max-w-3xl`.
- El carrusel usara el ancho completo del `container`, alineandose con el grid de 3 columnas de eventos.

**2. Mover la seccion de Videos dentro del `container`:**
- Actualmente la seccion de videos (lineas 137-175) esta fuera del `div.container`. Moverla dentro para que comparta el mismo ancho y padding que los event cards.

**3. Unificar el estilo de video cards con event cards:**
- Cambiar `CardContent className="p-4"` a `p-5` para igualar el padding de los event cards.
- Cambiar `h4` a `h3` con las mismas clases que los event cards: `text-lg font-bold text-foreground mb-2 line-clamp-2`.
- Agregar `mb-4` al parrafo de descripcion del video para igualar el espaciado.
- Mantener el mismo `gap-6` en el grid de videos (ya lo tiene).

**4. Asegurar que el modal de video tenga reproductor funcional:**
- El modal de video ya existe con iframe de YouTube embebido (lineas 244-265). Solo se verificara que funcione correctamente; no requiere cambios.

### Resultado esperado
- La galeria de momentos ocupara el mismo ancho que las 3 columnas de event cards.
- Los video cards tendran exactamente el mismo tamano, padding y espaciado que los event cards.
- Al hacer clic en un video se abrira el reproductor de YouTube en un modal (funcionalidad existente).
