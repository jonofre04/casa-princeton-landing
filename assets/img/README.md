# Casa Princeton — Asset Drop-In Guide

Esta carpeta es el destino de **todas las fotos** del sitio. El HTML ya tiene los `<picture>` preparados (comentados) — solo hay que (1) soltar el archivo aquí, (2) descomentar el bloque `<picture>` en el HTML, y el CSS se encarga del resto.

## Convenciones generales

- **Formato**: WebP (primario) + JPG (fallback) en cada caso.
- **Color profile**: sRGB.
- **Compresión**: WebP quality 80, JPG quality 82.
- **Naming**: kebab-case, sin acentos ni espacios. Ej: `pool-sunset.jpg`.
- Si entregan TIFF/PNG sin comprimir, convertir antes de subir.

---

## Archivos esperados

### Hero principal
| Archivo | Resolución mínima | Orientación | Descripción |
|---|---|---|---|
| `hero.jpg` / `hero.webp` | 1920×1080 | Horizontal | Edificio o piscina al atardecer. Va detrás del overlay oscuro — tolera mucho rango dinámico |

### Open Graph (redes sociales)
| Archivo | Resolución | Uso |
|---|---|---|
| `og/og-default.png` | 1200×630 | Página principal, default |
| `og/og-gallery.png` | 1200×630 | gallery.html |
| `og/og-floorplans.png` | 1200×630 | floorplans.html |
| `og/og-neighborhood.png` | 1200×630 | neighborhood.html |
| `og/og-amenities.png` | 1200×630 | amenities.html |

### Galería (gallery.html + sección galería de index.html)
**Interior del apartamento (6):**
| Archivo | Resolución mín. | Sección destino |
|---|---|---|
| `gallery/kitchen.jpg` | 1600×1200 | Chef-style kitchens |
| `gallery/living.jpg` | 1600×1200 | Light-filled living room |
| `gallery/bedroom.jpg` | 1600×1200 | Light-filled bedrooms |
| `gallery/bathroom.jpg` | 1600×1200 | Modern bathroom |
| `gallery/closet.jpg` | 1600×1200 | Walk-in closet |
| `gallery/balcony.jpg` | 1600×1200 | Private balcony / patio |

**Comunidad y exteriores (6-7):**
| Archivo | Resolución mín. | Sección destino |
|---|---|---|
| `gallery/pool.jpg` | 1600×1200 | Resort-style pool |
| `gallery/gym.jpg` | 1600×1200 | 24/7 fitness center |
| `gallery/lounge.jpg` | 1600×1200 | Co-working lounge |
| `gallery/exterior-day.jpg` | 1920×1280 | Modern exteriors (día) |
| `gallery/exterior-night.jpg` | 1920×1280 | Modern exteriors (noche, iluminado) |
| `gallery/dog-park.jpg` | 1600×1200 | Dog park |
| `gallery/bbq.jpg` (opcional) | 1600×1200 | Outdoor grilling pavilion |

### Floor plans (4 layouts)
| Archivo | Formato preferido | Descripción |
|---|---|---|
| `floorplans/cypress.png` | PNG (transparente) o PDF | The Cypress · 1BR · 728 sq ft |
| `floorplans/magnolia.png` | PNG o PDF | The Magnolia · 2BR · 1,082 sq ft |
| `floorplans/royal-palm.png` | PNG o PDF | The Royal Palm · 2BR townhome · 1,236 sq ft |
| `floorplans/coral-reef.png` | PNG o PDF | The Coral Reef · 3BR · 1,448 sq ft |

Resolución mínima 1200×900, fondo blanco o transparente, con cotas legibles.

### Staff (contact.html)
| Archivo | Resolución | Descripción |
|---|---|---|
| `team/maria-perez.jpg` | 600×600 | Foto retrato cuadrada del leasing manager |
| `team/jose-rodriguez.jpg` | 600×600 | Foto retrato cuadrada del leasing agent |

---

## Cómo activar una imagen una vez subida

1. Soltar el archivo en la subcarpeta correspondiente.
2. Abrir el HTML que la usa (ej. `index.html` para hero).
3. Buscar el comentario `<!-- TODO[PHOTOS]: ... -->`.
4. Descomentar el bloque `<picture>` que está justo debajo.
5. Recargar el navegador — el CSS-art o placeholder se esconde automáticamente (regla `:has(img)` en `styles.css`).

## Verificación rápida

- Visualmente la foto debe cubrir todo el contenedor sin recortes raros (object-fit: cover).
- En DevTools → Network: el WebP debería servirse a navegadores modernos, el JPG solo como fallback.
- Lighthouse: las imágenes deberían tener `loading="lazy"` excepto el hero (que ya viene con `loading="eager"` y `fetchpriority="high"`).
