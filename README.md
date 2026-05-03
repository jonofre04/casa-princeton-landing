# Casa Princeton — Landing page

Página de aterrizaje para campañas de Google Ads con un solo objetivo: **conversión a contacto** (WhatsApp en Android/desktop, iMessage en iOS).

**Stack:** HTML + CSS + JS estático puro. Sin build step. Sin frameworks.
**Hosting:** Netlify (auto-deploy en cada commit a `main`).
**Idiomas:** Inglés (default) + Español (toggle en header con persistencia en localStorage).

---

## 🛠️ Cómo editar la página (guía para el cliente)

Cualquier cambio que hagas aquí en GitHub se publica **automáticamente** en la página en ~30 segundos. No necesitas saber programar — solo HTML básico para tocar texto.

### ⚠️ Reglas de oro antes de tocar nada

1. **NO borres etiquetas HTML** — son las cosas entre `<` y `>` (ej. `<h1>`, `<span>`, `</div>`). Si borras una, rompes el sitio.
2. **Toca solo el TEXTO entre etiquetas**. Por ejemplo en `<strong>$1,885</strong>`, solo cambia `$1,885`. Deja `<strong>` y `</strong>` como están.
3. **Cuando guardes un cambio**, GitHub te pregunta "Commit changes". Click ese botón y se publica automático.
4. **Si rompes algo**, no entres en pánico — aquí está el historial de cambios y se puede revertir en 1 click. Avísame.

### Cómo editar paso a paso (en GitHub web)

1. En el repo de GitHub, abre el archivo `index.html`
2. Click en el icono ✏️ (lápiz) arriba a la derecha
3. Cambia el texto
4. Baja al final → "Commit changes" → confirma
5. Espera 30 segundos → entra a la URL del sitio → ya está publicado

---

## 📝 Cambios más comunes — dónde tocar

### 1. Cambiar la concesión del banner sticky (arriba de todo)

Buscá en `index.html` (Ctrl+F):
```html
<strong>First month free</strong> on 12-month leases.
```
Cambiá el texto. Mantené las etiquetas `<strong>` y `</strong>` intactas.

**Nota:** este texto también aparece en el final CTA cerca del fondo de la página. Cambialo en los 2 lugares para mantener consistencia.

### 2. Cambiar precios de las unidades

Buscá `From <strong>$1,885</strong>/mo` (Cypress) — cambiá $1,885 por el nuevo precio.

Repetí para:
- `<strong>$2,145</strong>` (Magnolia)
- `<strong>$2,310</strong>` (Royal Palm)
- `<strong>$2,435</strong>` (Coral Reef)

Y también en el hero, los chips:
- `<span class="hero__price-value">$1,885<small>/mo</small></span>` (1BR)
- `<span class="hero__price-value">$2,145<small>/mo</small></span>` (2BR)

### 3. Cambiar valores en la tabla de Fees

Buscá la sección `<!-- ════════ 3.5. Fees & Pricing` y dentro de cada `<li>`, cambiá el `<strong>$XX</strong>` correspondiente.

Ejemplo:
```html
<li><span>Application fee</span><strong>$49 / applicant</strong></li>
```
Solo tocá `$49 / applicant`. Dejá `<span>` y `<strong>` como están.

### 4. Editar una pregunta de FAQ

Buscá la sección `<!-- ════════ 5.5. FAQs ════════` y dentro de cada `<details>`:
```html
<details class="faq">
  <summary>Pregunta aquí</summary>
  <p>Respuesta aquí.</p>
</details>
```
Tocá solo el texto adentro de `<summary>` y `<p>`.

### 5. Cambiar el número de WhatsApp / iMessage

Buscá (Ctrl+F): `17869773672` — aparece varias veces. Reemplazá por el nuevo número (sin espacios ni guiones, formato internacional sin el +). Ejemplo: `13055551234`.

También buscá `+17869773672` y `(786) 977-3672` para los enlaces tel: y el footer.

### 6. Reemplazar una foto (cuando exista)

1. En GitHub, navegá a la carpeta `assets/img/gallery/`
2. Click en "Add file" → "Upload files"
3. Arrastrá el JPG nuevo con el nombre exacto que reemplaza (ej. `pool.jpg`)
4. Commit

La foto se actualiza inmediatamente.

### 7. Agregar una traducción al español que falta

Las traducciones están en `script.js`. Buscá el objeto `I18N_ES = { ... }`.

Cada entrada es:
```js
"Texto en inglés": "Texto en español",
```

Para agregar una traducción:
1. Encontrá el texto exacto en inglés que aparece en la página
2. Agregá una línea nueva en `I18N_ES` con la traducción
3. Importante: respetá las comas y comillas

---

## 📁 Estructura de archivos

```
/
├── index.html              ← Landing page (todo el contenido visible)
├── styles.css              ← Estilos visuales
├── script.js               ← Interacciones + traducciones
├── privacy.html            ← Política de privacidad (link en footer)
├── terms.html              ← Términos (link en footer)
├── fair-housing.html       ← Equal Housing (link en footer)
├── accessibility.html      ← Declaración ADA (no linkeada, accesible vía URL)
├── favicon.svg             ← Icono de la pestaña del navegador
├── favicon-32.png          ← Icono fallback PNG
├── favicon-64.png          ← Icono fallback PNG retina
├── apple-touch-icon.png    ← Icono para iOS (cuando se agrega como atajo)
├── robots.txt              ← Instrucciones para crawlers de Google
├── sitemap.xml             ← Mapa del sitio para SEO
└── assets/img/             ← Carpeta de fotos
    ├── hero.jpg            ← (drop-in pendiente) Hero principal
    ├── gallery/            ← Fotos de amenities
    ├── floorplans/         ← Planos de las 4 unidades
    ├── og/                 ← Imágenes de redes sociales (preview al compartir)
    └── team/               ← Fotos del staff (opcional)
```

---

## 🔑 IDs y configuración pendiente (TODO)

Buscá `TODO[CLIENT]` en `index.html` para encontrar todos los placeholders. Los actuales:

- `G-XXXXXXXXXX` → reemplazar por el Measurement ID de Google Analytics 4
- `XXXXXXXXXXXXXXX` → reemplazar por el Pixel ID de Meta (Facebook/Instagram)
- Número de WhatsApp `17869773672` → confirmar o cambiar

---

## 🚀 Workflow recomendado

1. **Cambios pequeños** (precios, copy, FAQs): editar directo en GitHub web → commit → auto-deploy
2. **Cambios grandes** (nueva sección, rediseño): pedir al desarrollador
3. **Si rompiste algo**: en GitHub → Commits → encontrar el commit anterior → "Revert"

---

## 📞 Contacto técnico

Si tenés dudas, te contactás con quien te pasó el repo. Mejor preguntar antes que romper.
