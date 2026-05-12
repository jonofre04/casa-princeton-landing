// Casa Princeton — Google Ads landing page interactions

// ── Year (footer) ──
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ══════════════════════════════════════════════
// Sticky concession banner — close + persist
// ══════════════════════════════════════════════
(function setupConcessionBanner() {
  // Versioned key — bump suffix when banner copy changes so users who dismissed
  // the previous offer still see the new one. Current: 8 weeks free rent / May 31st.
  const STORAGE_KEY = 'cp_concession_dismissed_v2';
  const banner = document.getElementById('concessionBanner');
  if (!banner) return;
  let dismissed = false;
  try { dismissed = localStorage.getItem(STORAGE_KEY) === '1'; } catch (_) {}
  if (dismissed) {
    banner.classList.add('is-dismissed');
    // Remove from layout after CSS transitions are no longer needed
    banner.addEventListener('transitionend', () => banner.remove(), { once: true });
    // Fallback if no transition fires (banner started already collapsed)
    setTimeout(() => banner.remove(), 500);
    return;
  }
  const closeBtn = document.getElementById('concessionClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      banner.classList.add('is-dismissed');
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (_) {}
      if (window.gtag) gtag('event', 'concession_banner_dismissed');
      // Remove from DOM after the slide-up transition so it doesn't take vertical space
      banner.addEventListener('transitionend', () => banner.remove(), { once: true });
      setTimeout(() => banner.remove(), 600);
    });
  }
})();

// ══════════════════════════════════════════════
// Mobile hamburger menu — toggle nav__links on legal pages
// ══════════════════════════════════════════════
(function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav__links');
  if (!toggle || !links) return;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('is-open')) {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();

// ══════════════════════════════════════════════
// Hero photo carousel — auto-rotate, dots, swipe, keyboard
// ══════════════════════════════════════════════
(function setupHeroCarousel() {
  const root = document.getElementById('heroCarousel');
  if (!root) return;
  const hero = root.closest('.hero-landing') || document;
  const slides = Array.from(root.querySelectorAll('.hero-landing__slide'));
  const dots = Array.from(hero.querySelectorAll('.hero-landing__dot'));
  if (slides.length < 2) return;
  const INTERVAL = 6500;
  let current = 0;
  let timer = null;
  let paused = false;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }
  function next() { show(current + 1); }
  function prev() { show(current - 1); }
  function start() {
    stop();
    if (paused) return;
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.slide, 10);
      if (!isNaN(i)) { show(i); start(); }
    });
  });

  // Pause on hover (desktop)
  root.addEventListener('mouseenter', () => { paused = true; stop(); });
  root.addEventListener('mouseleave', () => { paused = false; start(); });

  // Pause briefly on touch (mobile)
  root.addEventListener('touchstart', () => { paused = true; stop(); }, { passive: true });
  root.addEventListener('touchend', () => {
    setTimeout(() => { paused = false; start(); }, 1500);
  }, { passive: true });

  // Swipe gesture
  let touchStartX = 0;
  root.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  root.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  // Keyboard navigation when carousel has focus
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); start(); }
    else if (e.key === 'ArrowLeft') { prev(); start(); }
  });

  // Respect prefers-reduced-motion: keep first slide, no auto-rotate
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) start();
})();

// ══════════════════════════════════════════════
// Floor plan modal — open from any [data-floorplan] button
// ══════════════════════════════════════════════
(function setupFloorplanModal() {
  const modal = document.getElementById('floorplanModal');
  if (!modal) return;
  const img = document.getElementById('floorplanImage');
  const title = document.getElementById('floorplanTitle');
  let lastFocus = null;

  function open(planSlug, unitName, triggerEl) {
    img.onerror = () => { img.onerror = null; img.src = `assets/img/floorplans/${planSlug}.jpg`; };
    img.src = `assets/img/floorplans/${planSlug}.webp`;
    img.alt = `${unitName} floor plan`;
    title.textContent = unitName;
    lastFocus = triggerEl || document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.floorplan-modal__close');
    if (closeBtn) closeBtn.focus();
    if (window.gtag) gtag('event', 'view_floorplan', { plan: planSlug, unit: unitName });
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-floorplan]');
    if (trigger) {
      e.preventDefault();
      open(trigger.dataset.floorplan, trigger.dataset.unitName || 'Floor plan', trigger);
      return;
    }
    if (e.target.closest('[data-close]') && e.target.closest('.floorplan-modal')) {
      close();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

// ══════════════════════════════════════════════
// Contact CTA tracking (GA4 + Meta Pixel)
// All CTAs go to sms: directly — no iOS detection needed.
// ══════════════════════════════════════════════
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-wa-source]');
  if (!link) return;
  const source = link.dataset.waSource || 'unknown';
  const medium = link.protocol === 'tel:' ? 'tel' : 'sms';
  if (window.gtag) {
    gtag('event', 'click_contact', {
      source: source,
      medium: medium,
      transport_type: 'beacon'
    });
  }
  if (window.fbq) {
    fbq('track', 'Contact', { source: source, medium: medium });
  }
});

// ══════════════════════════════════════════════
// Floating Contact FAB visibility
// Appears once user scrolls past 70% of viewport (i.e. past the hero)
// ══════════════════════════════════════════════
const fab = document.querySelector('.fab-contact');
if (fab) {
  let ticking = false;
  const updateFab = () => {
    if (window.scrollY > window.innerHeight * 0.7) {
      fab.classList.add('is-visible');
    } else {
      fab.classList.remove('is-visible');
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateFab);
      ticking = true;
    }
  }, { passive: true });
  updateFab();
}

// ══════════════════════════════════════════════
// Reveal on scroll (subtle entrance animation)
// ══════════════════════════════════════════════
const revealEls = document.querySelectorAll('.unit-row, .gallery-item, .final-cta__inner, .fees-card');
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ══════════════════════════════════════════════
// Smooth scroll for in-page anchors (header logo → top, etc.)
// ══════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const targetId = a.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ══════════════════════════════════════════════
// EN ⇄ ES translation engine + dictionary
// ══════════════════════════════════════════════
const I18N_ES = {
  // Concession banner
  "8 weeks free rent": "8 semanas de renta gratis",
  "— Lease by May 31st": "— Firma antes del 31 de mayo",
  "Close offer banner": "Cerrar banner de oferta",

  // Header
  "Casa Princeton — top of page": "Casa Princeton — inicio de página",
  "Page sections": "Secciones de la página",
  "Floor plans": "Planos",
  "Pricing": "Precios",
  "Amenities": "Amenidades",
  "Community": "Comunidad",
  "Location": "Ubicación",
  "Switch to Spanish": "Cambiar a español",
  "Switch to English": "Cambiar a inglés",
  "Contact Us": "Contáctanos",

  // Hero
  "New Apartments": "Apartamentos Nuevos",
  "in Princeton, FL": "en Princeton, FL",
  "— Now Leasing": "— Ahora alquilando",
  "1 BR from": "1 DOR desde",
  "2 BR from": "2 DOR desde",
  "8 weeks free rent — Lease by May 31st. Tour by appointment — text us and we'll book you in 5 minutes.": "8 semanas de renta gratis — firma antes del 31 de mayo. Tour con cita previa — escríbenos y te agendamos en 5 minutos.",
  "Book a Tour": "Agenda tu Tour",
  "/mo": "/mes",

  // Units (simplified to 2 generic cards)
  "Find your home.": "Encuentra tu hogar.",
  "Tap Contact Us on the unit you want — we reply within minutes.": "Toca Contáctanos en la unidad que te interese — respondemos en minutos.",
  "1 BR": "1 DOR",
  "2 BR": "2 DOR",
  "1 Bedroom": "1 Dormitorio",
  "2 Bedrooms": "2 Dormitorios",
  "from 616 sqft": "desde 616 pies²",
  "from 834 sqft": "desde 834 pies²",
  "from 554 to 739 sqft": "desde 554 a 739 pies²",
  "from 798 to 965 sqft": "desde 798 a 965 pies²",
  "Including: 1 GB high-speed internet, trash & water fee": "Incluye: internet de alta velocidad de 1 GB, basura y cuota de agua",
  "From": "Desde",
  "See floor plan": "Ver plano",
  "See 1 Bedroom floor plan": "Ver plano de 1 Dormitorio",
  "See 2 Bedroom floor plan": "Ver plano de 2 Dormitorios",
  "Other floor plans available — talk with our team →": "Otros planos disponibles — habla con nuestro equipo →",

  // Fees section (mirror of casaprincetonflorida.com Fee Overview)
  "Transparent pricing.": "Precios transparentes.",
  "All fees broken down — no surprises at lease signing.": "Todas las cuotas desglosadas — sin sorpresas al firmar el contrato.",
  "Move-In Basics": "Básicos de Mudanza",
  "One-time · Mandatory": "Única · Obligatoria",
  "Essentials": "Esenciales",
  "Monthly · Mandatory": "Mensual · Obligatoria",
  "Personalized Add-Ons": "Opcionales Personalizados",
  "Optional": "Opcional",
  "Application fee": "Cuota de aplicación",
  "Administrative fee": "Cuota administrativa",
  "Security deposit": "Depósito de seguridad",
  "Trash fee": "Cuota de basura",
  "Water & sewer": "Agua y alcantarillado",
  "1 GB high-speed internet": "Internet de alta velocidad 1 GB",
  "Water/sewer: $55 (1/1) · $65 (2/2) · $85 (3/2)": "Agua/alcantarillado: $55 (1/1) · $65 (2/2) · $85 (3/2)",
  "Parking (2nd vehicle)": "Estacionamiento (2do vehículo)",
  "Pet fee (one-time, max 2 pets)": "Cuota de mascota (única, máx. 2)",
  "Pet rent": "Renta de mascota",
  "Covered parking": "Estacionamiento cubierto",
  "Rent Plus (enrolled residents)": "Rent Plus (residentes inscritos)",
  "Security deposit waiver": "Exención de depósito",
  "$49 / applicant": "$49 / aplicante",
  "$275": "$275",
  "$800 or higher": "$800 o más",
  "$55–$85": "$55–$85",
  "$250 / pet": "$250 / mascota",
  "$20 / pet": "$20 / mascota",
  "$100 / mo": "$100 / mes",
  "$50 / mo": "$50 / mes",
  "$22 / mo": "$22 / mes",
  "$8.95–$14.95 / mo": "$8.95–$14.95 / mes",
  "View situational fees": "Ver cuotas situacionales",
  "Late fee": "Cuota por pago tardío",
  "Returned payment / bank fee": "Pago devuelto / cuota bancaria",
  "Transfer fee": "Cuota de transferencia",
  "Early lease agreement": "Terminación anticipada de contrato",
  "Legal / eviction fee": "Cuota legal / desalojo",
  "$200 / occurrence": "$200 / ocurrencia",
  "$150 / occurrence": "$150 / ocurrencia",
  "$1,000 / occurrence": "$1,000 / ocurrencia",
  "Varies": "Varía",
  "Varies (may be $0 based on option)": "Varía (puede ser $0 según opción)",
  "Please note that fees may change at any time and may not be applicable to all residents.": "Por favor ten en cuenta que las cuotas pueden cambiar en cualquier momento y pueden no aplicar a todos los residentes.",

  // Pet & parking policy
  "Pet & parking policy.": "Política de mascotas y estacionamiento.",
  "Pet-friendly community & dog-friendly grounds": "Comunidad pet-friendly y áreas para perros",
  "Maximum pets": "Máximo de mascotas",
  "2 per home": "2 por hogar",
  "Each additional animal": "Cada animal adicional",
  "Pet services nearby": "Servicios para mascotas cerca",
  "Milo's Daycare & Boarding": "Milo's Daycare & Boarding",
  "Robert's Pet Shop": "Robert's Pet Shop",
  "Gilley Animal Clinic": "Gilley Animal Clinic",
  "4 min": "4 min",
  "5 min": "5 min",
  "10 min": "10 min",
  "Casa Princeton mascot — French Bulldog with sunglasses": "Mascota de Casa Princeton — Bulldog Francés con gafas",
  "One-time pet fee": "Cuota única de mascota",
  "Monthly pet rent": "Renta mensual de mascota",
  "Breed restrictions apply. Service and emotional-support animals exempt from fees per Fair Housing Act. Ask us about your pet.": "Aplican restricciones de raza. Los animales de servicio y de apoyo emocional están exentos de cuotas según la Fair Housing Act. Consúltanos sobre tu mascota.",
  "Parking on-site": "Estacionamiento en el sitio",
  "Open parking": "Estacionamiento abierto",
  "Included": "Incluido",
  "Covered (reserved)": "Cubierto (reservado)",
  "Open parking is unassigned and available to all residents. Covered spots are limited and assigned by request.": "El estacionamiento abierto no está asignado y está disponible para todos los residentes. Los puestos cubiertos son limitados y se asignan a pedido.",
  "Our community offers parking spaces for each of our residents relative to occupancy guidelines for each apartment. If you have a motorcycle, it may be parked in the designated spaces for vehicles.": "Nuestra comunidad ofrece estacionamiento para cada residente según las pautas de ocupación de cada apartamento. Si tienes una motocicleta, puede estacionarse en los espacios designados para vehículos.",
  "Casa Princeton townhomes with covered parking": "Townhomes de Casa Princeton con estacionamiento cubierto",

  // FAQs
  "Frequently asked.": "Preguntas frecuentes.",
  "Don't see your question? Tap Contact Us — we reply within minutes.": "¿No ves tu pregunta? Toca Contáctanos — respondemos en minutos.",
  "What floor plans does Casa Princeton offer?": "¿Qué planos ofrece Casa Princeton?",
  "We currently offer One Bedroom (from $1,845/mo) and Two Bedroom (from $1,995/mo) apartments. Click": "Actualmente ofrecemos apartamentos de 1 dormitorio (desde $1,845/mes) y de 2 dormitorios (desde $1,995/mes). Haz clic",
  "We currently offer One Bedroom (from $1,945/mo) and Two Bedroom (from $2,225/mo) apartments. Both include 1 GB high-speed internet, trash and water fee. Click": "Actualmente ofrecemos apartamentos de 1 dormitorio (desde $1,945/mes) y de 2 dormitorios (desde $2,225/mes). Ambos incluyen internet de alta velocidad de 1 GB, basura y cuota de agua. Haz clic",
  "/month on a 12-month lease, with floor plans from 554 to 739 sqft. Price includes 1 GB high-speed internet, trash and water fee.": "/mes en un contrato de 12 meses, con planos desde 554 a 739 pies². El precio incluye internet de alta velocidad de 1 GB, basura y cuota de agua.",
  "/month on a 12-month lease, with floor plans from 798 to 965 sqft. Price includes 1 GB high-speed internet, trash and water fee.": "/mes en un contrato de 12 meses, con planos desde 798 a 965 pies². El precio incluye internet de alta velocidad de 1 GB, basura y cuota de agua.",
  "Your monthly rent includes 1 GB high-speed internet, trash service and water & sewer fee. Pet rent applies if you have pets and is billed separately.": "Tu renta mensual incluye internet de alta velocidad de 1 GB, servicio de basura y cuota de agua y alcantarillado. La renta de mascota aplica si tienes mascotas y se factura por separado.",
  "here": "aquí",
  "to view floor plans.": "para ver los planos.",
  "What are the starting prices on One Bedroom apartments?": "¿Cuál es el precio inicial de los apartamentos de 1 dormitorio?",
  "Our One Bedroom starts at": "Nuestro 1 Dormitorio comienza en",
  "base rent (12-month lease). Estimated total monthly cost around $1,980 — base rent plus mandatory monthly fees (trash $20, water/sewer $55, 1 GB internet $60). Fees billed monthly in addition to rent.": "renta base (contrato de 12 meses). Costo mensual estimado total alrededor de $1,980 — renta base más cuotas mensuales obligatorias (basura $20, agua/alcantarillado $55, internet 1 GB $60). Las cuotas se facturan mensualmente además de la renta.",
  "What are the starting prices on Two Bedroom apartments?": "¿Cuál es el precio inicial de los apartamentos de 2 dormitorios?",
  "Our Two Bedroom starts at": "Nuestro 2 Dormitorios comienza en",
  "base rent (12-month lease). Estimated total monthly cost around $2,140 — base rent plus mandatory monthly fees (trash $20, water/sewer $65, 1 GB internet $60). Fees billed monthly in addition to rent.": "renta base (contrato de 12 meses). Costo mensual estimado total alrededor de $2,140 — renta base más cuotas mensuales obligatorias (basura $20, agua/alcantarillado $65, internet 1 GB $60). Las cuotas se facturan mensualmente además de la renta.",
  "What's included in my monthly rent?": "¿Qué incluye mi renta mensual?",
  "Base rent covers your home. Trash service ($20), water & sewer ($55–85), and 1 GB fiber internet ($60) are billed monthly in addition. Pet rent applies if you have pets.": "La renta base cubre tu hogar. Servicio de basura ($20), agua y alcantarillado ($55–85), e internet de fibra 1 GB ($60) se facturan mensualmente además. La renta de mascota aplica si tienes mascotas.",
  "What lease terms are available?": "¿Qué plazos de contrato están disponibles?",
  "12-month leases qualify for our current": "Los contratos de 12 meses califican para nuestra promoción actual de",
  "promotion (lease by May 31st). Other lease terms may be available — ask our leasing team.": "(firma antes del 31 de mayo). Otros plazos pueden estar disponibles — consulta a nuestro equipo de leasing.",
  "Is there an application fee?": "¿Hay cuota de aplicación?",
  "$49 per applicant covers credit, background, and identity verification, plus a $275 administrative fee per household.": "$49 por aplicante cubre verificación de crédito, antecedentes e identidad, más $275 de cuota administrativa por hogar.",
  "Are pets allowed?": "¿Se permiten mascotas?",
  "Yes — up to 2 pets per home. $250 one-time fee plus $20/mo per pet. Breed restrictions apply. Service and emotional-support animals are exempt from fees.": "Sí — hasta 2 mascotas por hogar. $250 de cuota única más $20/mes por mascota. Aplican restricciones de raza. Los animales de servicio y de apoyo emocional están exentos de cuotas.",
  "Do you offer covered parking?": "¿Ofrecen estacionamiento cubierto?",
  "Open parking is included for all residents. Reserved covered spots are $100/mo (limited availability). EV charging stations are available on-site, billed by usage.": "El estacionamiento abierto está incluido para todos los residentes. Los puestos cubiertos reservados son $100/mes (disponibilidad limitada). Las estaciones de carga eléctrica están disponibles en el sitio, facturadas por consumo.",
  "When can I move in?": "¿Cuándo puedo mudarme?",
  "Most homes are available within 14–30 days of application approval. Some plans are immediately move-in ready — contact us for current availability.": "La mayoría de los hogares están disponibles entre 14 y 30 días después de la aprobación. Algunos planes están listos para mudanza inmediata — contáctanos para disponibilidad actual.",
  "Do I need renter's insurance?": "¿Necesito seguro de renta?",
  "Yes. All residents are required to carry minimum liability renter's insurance. Affordable plans are available — we can recommend providers at lease signing.": "Sí. Todos los residentes deben tener un seguro de renta de responsabilidad mínima. Hay planes asequibles disponibles — podemos recomendar proveedores al firmar el contrato.",

  // Amenities & community gallery
  "Amenities & community.": "Amenidades y comunidad.",
  "Designed for everyday comfort and weekend living.": "Diseñadas para la comodidad diaria y la vida de fin de semana.",
  "Modern exteriors": "Exteriores modernos",
  "Clubhouse lobby": "Lobby clubhouse",
  "Lounge": "Lounge",
  "Resident lounge": "Lounge para residentes",
  "Outdoor lounge & BBQ area": "Lounge al aire libre y zona de BBQ",
  "Resort-style pool": "Piscina estilo resort",
  "Sunlit living spaces": "Espacios iluminados",
  "Modern kitchens": "Cocinas modernas",
  "Sunset views": "Vistas al atardecer",
  "Spacious bedrooms": "Dormitorios espaciosos",
  "Designer bathrooms": "Baños de diseño",
  "24/7 fitness center": "Gimnasio 24/7",
  "Resident mailroom": "Sala de correo",

  // Community / site plan
  "The community.": "La comunidad.",
  "Three residential blocks, central courtyard, and on-site amenities — all within a gated, landscaped community.": "Tres bloques residenciales, patio central y amenidades en el sitio — todo dentro de una comunidad cerrada y arbolada.",
  "Site plan · Phase II": "Plano del sitio · Fase II",
  "Casa Princeton site plan — Phase II layout showing residential blocks, courtyard, parking, and amenities": "Plano de Casa Princeton — Fase II mostrando bloques residenciales, patio, estacionamiento y amenidades",

  // Floor plan modal
  "Floor plan": "Plano",
  "Renderings — actual finishes and dimensions may vary.": "Renderizaciones — los acabados y dimensiones reales pueden variar.",
  "Close floor plan": "Cerrar plano",
  "1 Bedroom — Floor plan": "1 Dormitorio — Plano",
  "2 Bedrooms — Floor plan": "2 Dormitorios — Plano",
  "Casa Princeton": "Casa Princeton",

  // Location
  "Minutes from US-1, Cutler Bay & the Florida Keys.": "A minutos de US-1, Cutler Bay y los Cayos de Florida.",
  "Easy access to the Florida Turnpike.": "Acceso fácil al Florida Turnpike.",

  // Final CTA
  "Ready to see it?": "¿Listo para verlo?",
  "Tour by appointment — usually same-day.": "Tour con cita previa — generalmente el mismo día.",
  "8 weeks free rent — Lease by May 31st.": "8 semanas de renta gratis — firma antes del 31 de mayo.",

  // Footer
  "Casa Princeton Apartments": "Casa Princeton Apartments",
  "Leasing": "Leasing",
  "Equal Housing Opportunity": "Igualdad de Oportunidad de Vivienda",
  "Privacy": "Privacidad",
  "Terms": "Términos",
  "Fair Housing": "Vivienda Justa",
  "Sun 12 PM – 5 PM": "Dom 12 PM – 5 PM",
  "Do Not Sell or Share My Personal Information": "No vender ni compartir mi información personal",

  // H2 availability
  "3 available": "3 disponibles",
  "5 available": "5 disponibles",

  // H6 trust strip
  "Why renters choose Casa Princeton": "Por qué los inquilinos eligen Casa Princeton",
  "Professionally managed": "Gestión profesional",
  "Act-aligned community": "Comunidad alineada con la Ley",
  "2026 construction": "Construcción 2026",
  "Brand-new": "Estreno",
  "Live Local": "Live Local",

  // H14 tap-to-call
  "or call": "o llama al",

  // Skip link
  "Skip to main content": "Saltar al contenido principal"
};

(function setupI18n() {
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE']);
  const ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  const origText = new WeakMap();
  const origAttr = new WeakMap();

  window.applyLanguage = function (lang) {
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
    const dict = lang === 'es' ? I18N_ES : null;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      const original = origText.get(node) ?? node.textContent;
      if (dict) {
        const trimmed = original.trim();
        if (!trimmed || trimmed.length < 2) return;
        const replaced = dict[trimmed];
        if (!replaced) return;
        if (!origText.has(node)) origText.set(node, original);
        const lead = original.match(/^\s*/)[0];
        const tail = original.match(/\s*$/)[0];
        node.textContent = lead + replaced + tail;
      } else if (origText.has(node)) {
        node.textContent = origText.get(node);
      }
    });
    document.querySelectorAll('[placeholder], [aria-label], [alt], [title]').forEach(el => {
      let cache = origAttr.get(el);
      ATTRS.forEach(attr => {
        if (!el.hasAttribute(attr)) return;
        if (dict) {
          const val = el.getAttribute(attr);
          const replaced = dict[val.trim()];
          if (!replaced) return;
          if (!cache) { cache = {}; origAttr.set(el, cache); }
          if (!(attr in cache)) cache[attr] = val;
          el.setAttribute(attr, replaced);
        } else if (cache && (attr in cache)) {
          el.setAttribute(attr, cache[attr]);
        }
      });
    });
    try { localStorage.setItem('cp_lang', lang); } catch (_) {}
  };

  // Wire the toggle button + sync label to current state
  const btn = document.getElementById('langToggle');
  const setBtnLabel = (lang) => {
    if (!btn) return;
    if (lang === 'es') {
      btn.textContent = 'EN';
      btn.setAttribute('aria-label', 'Switch to English');
    } else {
      btn.textContent = 'ES';
      btn.setAttribute('aria-label', 'Switch to Spanish');
    }
  };
  if (btn) {
    btn.addEventListener('click', () => {
      const current = document.documentElement.lang === 'es' ? 'es' : 'en';
      const next = current === 'es' ? 'en' : 'es';
      window.applyLanguage(next);
      setBtnLabel(next);
      if (window.gtag) gtag('event', 'language_toggle', { language: next });
    });
  }

  // On load, apply stored preference (if any)
  let saved = 'en';
  try { saved = localStorage.getItem('cp_lang') || 'en'; } catch (_) {}
  if (saved === 'es') {
    window.applyLanguage('es');
    setBtnLabel('es');
  }
})();
