// Casa Princeton — Google Ads landing page interactions

// ── Year (footer) ──
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ══════════════════════════════════════════════
// Sticky concession banner — close + persist
// ══════════════════════════════════════════════
(function setupConcessionBanner() {
  const STORAGE_KEY = 'cp_concession_dismissed';
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
// iOS detection — rewrite Contact Us hrefs to sms: (iMessage)
// Android/desktop keep wa.me/ for WhatsApp.
// SMS body deeplink format on iOS: sms:NUMBER&body=TEXT
// ══════════════════════════════════════════════
(function setupContactMedium() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const PHONE = '+17869773672';
  if (!isIOS) return;
  document.querySelectorAll('a[data-wa-source]').forEach(a => {
    let text = "Hi, I'm interested in Casa Princeton";
    try {
      const url = new URL(a.href);
      text = url.searchParams.get('text') || text;
    } catch (_) {}
    a.href = `sms:${PHONE}&body=${encodeURIComponent(text)}`;
    a.target = '_self';
    a.removeAttribute('rel');
  });
})();

// ══════════════════════════════════════════════
// Contact CTA tracking (GA4 + Meta Pixel)
// Reports the medium (whatsapp on Android/desktop, sms on iOS)
// and the placement source via data-wa-source.
// ══════════════════════════════════════════════
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-wa-source]');
  if (!link) return;
  const source = link.dataset.waSource || 'unknown';
  const medium = link.href.startsWith('sms:') ? 'sms' : 'whatsapp';
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
const fab = document.querySelector('.fab-whatsapp');
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
const revealEls = document.querySelectorAll('.unit-row, .amenities-grid-6 figure, .trust-bar__item, .final-cta__inner, .fees-card');
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
  "First month free": "Primer mes gratis",
  "on 12-month leases.": "en contratos de 12 meses.",
  "Close offer banner": "Cerrar banner de oferta",

  // Header
  "Casa Princeton — top of page": "Casa Princeton — inicio de página",
  "Princeton · FL": "Princeton · FL",
  "Page sections": "Secciones de la página",
  "Floor plans": "Planos",
  "Pricing": "Precios",
  "Amenities": "Amenidades",
  "Location": "Ubicación",
  "Switch to Spanish": "Cambiar a español",
  "Switch to English": "Cambiar a inglés",
  "Contact Us": "Contáctanos",

  // Hero
  "Brand-new luxury apartments": "Apartamentos de lujo recién estrenados",
  "in": "en",
  "Princeton, FL.": "Princeton, FL.",
  "1 BR from": "1 DOR desde",
  "2 BR from": "2 DOR desde",
  "Brand-new homes in Princeton, FL. Tours available daily.": "Hogares recién estrenados en Princeton, FL. Tours disponibles todos los días.",
  "/mo": "/mes",

  // Trust bar
  "Why Casa Princeton": "Por qué Casa Princeton",
  "Brand new": "Recién estrenado",
  "Built in 2025": "Construido en 2025",
  "Lowest price/sqft": "Menor precio/sqft",
  "in South Dade": "en South Dade",
  "Managed by ZRS": "Gestionado por ZRS",
  "Professional management": "Gestión profesional",

  // Units
  "Find your home.": "Encuentra tu hogar.",
  "Tap WhatsApp on the unit you want — we reply within minutes.": "Toca Contáctanos en la unidad que te interese — respondemos en minutos.",
  "MOST POPULAR": "MÁS POPULAR",
  "1 BR": "1 DOR",
  "2 BR": "2 DOR",
  "3 BR": "3 DOR",
  "The Cypress": "The Cypress",
  "The Magnolia": "The Magnolia",
  "The Royal Palm": "The Royal Palm",
  "The Coral Reef": "The Coral Reef",
  "· Townhome": "· Townhome",
  "From": "Desde",
  "See floor plan": "Ver plano",
  "See Cypress floor plan": "Ver plano de Cypress",
  "See Magnolia floor plan": "Ver plano de Magnolia",
  "See Royal Palm floor plan": "Ver plano de Royal Palm",
  "See Coral Reef floor plan": "Ver plano de Coral Reef",

  // Fees section (mirror of casaprincetonfl.com Fee Overview)
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
  "Pet-friendly community": "Comunidad pet-friendly",
  "Maximum pets": "Máximo de mascotas",
  "2 per home": "2 por hogar",
  "Weight limit": "Límite de peso",
  "75 lbs / pet": "75 lbs / mascota",
  "One-time pet fee": "Cuota única de mascota",
  "Monthly pet rent": "Renta mensual de mascota",
  "Breed restrictions apply. Service and emotional-support animals exempt from fees per Fair Housing Act. Ask us about your pet.": "Aplican restricciones de raza. Los animales de servicio y de apoyo emocional están exentos de cuotas según la Fair Housing Act. Consúltanos sobre tu mascota.",
  "Parking on-site": "Estacionamiento en el sitio",
  "Open parking": "Estacionamiento abierto",
  "Included": "Incluido",
  "Covered (reserved)": "Cubierto (reservado)",
  "Open parking is unassigned and available to all residents. Covered spots are limited and assigned by request.": "El estacionamiento abierto no está asignado y está disponible para todos los residentes. Los puestos cubiertos son limitados y se asignan a pedido.",

  // FAQs
  "Frequently asked.": "Preguntas frecuentes.",
  "Don't see your question? Tap Contact Us — we reply within minutes.": "¿No ves tu pregunta? Toca Contáctanos — respondemos en minutos.",
  "What's included in my monthly rent?": "¿Qué incluye mi renta mensual?",
  "Base rent covers your home. Trash service ($20), water & sewer ($55–85), and 1 GB fiber internet ($60) are billed monthly in addition. Pet rent applies if you have pets.": "La renta base cubre tu hogar. Servicio de basura ($20), agua y alcantarillado ($55–85), e internet de fibra 1 GB ($60) se facturan mensualmente además. La renta de mascota aplica si tienes mascotas.",
  "What lease terms are available?": "¿Qué plazos de contrato están disponibles?",
  "12-month leases qualify for the First Month Free promotion. Other lease terms may be available — ask our leasing team.": "Los contratos de 12 meses califican para la promoción de Primer Mes Gratis. Otros plazos pueden estar disponibles — consulta a nuestro equipo de leasing.",
  "Is there an application fee?": "¿Hay cuota de aplicación?",
  "$49 per applicant covers credit, background, and identity verification, plus a $275 administrative fee per household.": "$49 por aplicante cubre verificación de crédito, antecedentes e identidad, más $275 de cuota administrativa por hogar.",
  "Are pets allowed?": "¿Se permiten mascotas?",
  "Yes — up to 2 pets per home, 75 lb max per pet. $250 one-time fee plus $20/mo per pet. Breed restrictions apply. Service and emotional-support animals are exempt from fees.": "Sí — hasta 2 mascotas por hogar, 75 lb máx por mascota. $250 de cuota única más $20/mes por mascota. Aplican restricciones de raza. Los animales de servicio y de apoyo emocional están exentos de cuotas.",
  "Do you offer covered parking?": "¿Ofrecen estacionamiento cubierto?",
  "Open parking is included for all residents. Reserved covered spots are $100/mo (limited availability). EV charging stations are available on-site, billed by usage.": "El estacionamiento abierto está incluido para todos los residentes. Los puestos cubiertos reservados son $100/mes (disponibilidad limitada). Las estaciones de carga eléctrica están disponibles en el sitio, facturadas por consumo.",
  "When can I move in?": "¿Cuándo puedo mudarme?",
  "Most homes are available within 14–30 days of application approval. Some plans are immediately move-in ready — contact us for current availability.": "La mayoría de los hogares están disponibles entre 14 y 30 días después de la aprobación. Algunos planes están listos para mudanza inmediata — contáctanos para disponibilidad actual.",
  "Do I need renter's insurance?": "¿Necesito seguro de renta?",
  "Yes. All residents are required to carry minimum liability renter's insurance. Affordable plans are available — we can recommend providers at lease signing.": "Sí. Todos los residentes deben tener un seguro de renta de responsabilidad mínima. Hay planes asequibles disponibles — podemos recomendar proveedores al firmar el contrato.",

  // Amenities
  "Amenities.": "Amenidades.",
  "Resort-style pool": "Piscina estilo resort",
  "24/7 fitness": "Gym 24/7",
  "Co-working lounge": "Lounge de coworking",
  "Modern exteriors": "Exteriores modernos",
  "Lit at night": "Iluminado de noche",
  "Dog park": "Parque para perros",

  // Location
  "Minutes from US-1, Cutler Bay & the Florida Keys.": "A minutos de US-1, Cutler Bay y los Cayos de Florida.",
  "Easy access to the Florida Turnpike.": "Acceso fácil al Florida Turnpike.",

  // Final CTA
  "Ready to see it?": "¿Listo para verlo?",
  "Tour available daily.": "Tours disponibles todos los días.",

  // Footer
  "Casa Princeton Apartments": "Casa Princeton Apartments",
  "Leasing": "Leasing",
  "Equal Housing Opportunity": "Igualdad de Oportunidad de Vivienda",
  "Privacy": "Privacidad",
  "Terms": "Términos",
  "Fair Housing": "Vivienda Justa",

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
