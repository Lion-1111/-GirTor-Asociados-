/* =====================================================
   GIRTOR & ASOCIADOS — INTERACTIVIDAD MULTI-PÁGINA
===================================================== */

/* ── Splash Intro Screen (Animación original GR + retardo exacto + muestra hero al salir) ── */
(function () {
  const splash = document.getElementById('splash');
  const sheen = document.getElementById('logo-sheen');
  const waFloat = document.getElementById('wa-float');
  const hero = document.getElementById('hero');

  function showWaButton() {
    if (waFloat) waFloat.classList.add('show');
  }

  function revealHero() {
    if (hero) hero.classList.add('hero-ready');
  }

  if (!splash) {
    // En páginas internas, WhatsApp visible de inmediato
    showWaButton();
    revealHero();
    return;
  }

  function hideSplash() {
    splash.classList.add('hide');
    showWaButton();
    revealHero();
    setTimeout(() => {
      splash.style.display = 'none';
    }, 800);
  }

  // Solo omitir splash si el enlace apunta directamente a una sección inferior (no #hero)
  const hash = window.location.hash;
  if (hash && hash.length > 1 && hash !== '#hero') {
    splash.style.display = 'none';
    showWaButton();
    revealHero();
    return;
  }

  if (sheen) {
    setTimeout(() => { sheen.classList.add('sheen-go'); }, 2200);
  }
  setTimeout(hideSplash, 3300);
  splash.addEventListener('click', hideSplash);
})();

/* ── Navbar Scroll & Mobile Hamburger Drawer (Estilo Mijares) ── */
(function () {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const drawer = document.getElementById('mobileDrawer');
  const practiceToggle = document.getElementById('drawerPracticeToggle');
  const drawerAccordion = document.getElementById('drawerAccordion');

  if (nav && !nav.classList.contains('nav-solid')) {
    const toggleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', toggleScroll, { passive: true });
    toggleScroll();
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('active');
    if (hamburger) {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('active');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (drawerAccordion) {
      drawerAccordion.classList.remove('open');
      if (practiceToggle) practiceToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      drawer.classList.contains('active') ? closeDrawer() : openDrawer();
    });
  }

  // Acordeón de Áreas de Práctica en el Menú Móvil
  if (practiceToggle && drawerAccordion) {
    practiceToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = drawerAccordion.classList.toggle('open');
      practiceToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  window.closeDrawer = closeDrawer;
  window.openDrawer = openDrawer;
})();

/* ── Scroll Reveal ── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  els.forEach((el) => io.observe(el));
})();

/* ── Pre-seleccionar materia en contacto.html si viene por URL (?area=Penal) ── */
(function () {
  const select = document.getElementById('formArea');
  if (!select) return;
  const params = new URLSearchParams(window.location.search);
  const area = params.get('area');
  if (area) {
    select.value = area;
  }
})();

/* ── Selector Flotante de 3 Líneas WhatsApp ── */
(function () {
  const waFloat = document.getElementById('wa-float');
  if (!waFloat) return;
  const triggerBtn = waFloat.querySelector('.wa-float-btn');
  const triggerLabel = waFloat.querySelector('.wa-float-label');

  function toggleWaMenu(e) {
    if (e) e.preventDefault();
    waFloat.classList.toggle('menu-active');
  }

  if (triggerBtn) triggerBtn.addEventListener('click', toggleWaMenu);
  if (triggerLabel) triggerLabel.addEventListener('click', toggleWaMenu);

  document.addEventListener('click', (e) => {
    if (!waFloat.contains(e.target)) {
      waFloat.classList.remove('menu-active');
    }
  });
})();

/* ── Formulario de Contacto -> Envío directo a la línea WhatsApp elegida ── */
function handleForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const nombre = document.getElementById('formName')?.value.trim() || '';
  const contacto = document.getElementById('formPhone')?.value.trim() || '';
  const area = document.getElementById('formArea')?.value || 'General';
  const targetPhone = document.getElementById('formTarget')?.value || '525616878494';
  const caso = document.getElementById('formCase')?.value.trim() || '';

  const acceptBox = document.getElementById('formAccept');
  if (acceptBox && !acceptBox.checked) {
    acceptBox.focus();
    return;
  }

  const originalText = btn.textContent;
  btn.textContent = 'Generando solicitud…';
  btn.disabled = true;

  const msg =
    `*SOLICITUD DE CONSULTA JURÍDICA*%0A%0A` +
    `👤 *Nombre:* ${encodeURIComponent(nombre)}%0A` +
    `📞 *Contacto:* ${encodeURIComponent(contacto)}%0A` +
    `⚖️ *Materia:* ${encodeURIComponent(area)}%0A` +
    `📝 *Síntesis:* ${encodeURIComponent(caso || 'Deseo solicitar atención jurídica.')}`;

  setTimeout(() => {
    btn.textContent = '✓ Abriendo WhatsApp…';
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      form.reset();
    }, 2800);
  }, 600);
}
window.handleForm = handleForm;

/* ── Hero Carousel (Carga diferida de diapositivas 2-4 para apertura instantánea) ── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  function hydrateDeferredSlides() {
    slides.forEach((slide) => {
      const img = slide.querySelector('.hero-slide-img[data-bg]');
      if (img && !img.style.backgroundImage) {
        img.style.backgroundImage = `url('${img.getAttribute('data-bg')}')`;
        img.removeAttribute('data-bg');
      }
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(hydrateDeferredSlides, 600);
  } else {
    window.addEventListener('load', () => setTimeout(hydrateDeferredSlides, 600), { once: true });
  }

  let currentIndex = 0;
  let isPaused = false;

  function updateSlide(index) {
    hydrateDeferredSlides();
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentIndex));
  }

  setInterval(() => {
    if (!isPaused) updateSlide(currentIndex + 1);
  }, 4000);

  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mouseenter', () => { isPaused = true; });
    hero.addEventListener('mouseleave', () => { isPaused = false; });
  }
})();

/* ── ScrollPortraitWall Animation & Grid Generation ── */
(function () {
  const photos = [
    { name: 'Sala de Juntas', role: 'Santa Fe, Ciudad de México', src: 'assets/fto1.jpeg' },
    { name: 'Defensa Corporativa', role: 'Estrategia Jurídica', src: 'assets/fto.2.jpeg' },
    { name: 'Espacios de Análisis', role: 'Atención Personalizada', src: 'assets/fto3.jpeg' },
    { name: 'Oficinas Corporativas', role: 'Santa Fe, Ciudad de México', src: 'assets/fto4.jpeg' },
    { name: 'Consultoría Especializada', role: 'Rigor Técnico', src: 'assets/fto5.jpeg' },
    { name: 'Alcance Nacional', role: 'República Mexicana', src: 'assets/fto6.jpeg' }
  ];

  const gridContainer = document.getElementById('spwGrid');
  if (!gridContainer) return;

  function getResponsiveColumns() {
    const w = window.innerWidth;
    if (w >= 1024) return 4;
    if (w >= 640) return 3;
    return 2;
  }

  function buildLayout(count, cols) {
    const rows = [];
    let i = 0;
    let r = 0;
    while (i < count) {
      const row = new Array(cols).fill(-1);
      const a = (r * 2 + (r % 2)) % cols;
      row[a] = i++;
      if (r % 3 === 0 && i < count) {
        let b = (a + 2) % cols;
        if (b === a) b = (a + 1) % cols;
        row[b] = i++;
      }
      rows.push(row);
      r++;
    }
    return rows;
  }

  let currentCols = 0;

  function renderGrid() {
    const cols = getResponsiveColumns();
    if (cols === currentCols) return;
    currentCols = cols;

    const layout = buildLayout(photos.length, cols);
    gridContainer.innerHTML = '';

    layout.forEach((rowIndices) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'spw-row';

      rowIndices.forEach((photoIdx, ci) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = 'spw-cell';

        if (photoIdx === -1) {
          cellDiv.classList.add('spw-cell-empty');
        } else {
          const p = photos[photoIdx];
          const origin = ci < cols / 2 ? 'right bottom' : 'left bottom';

          cellDiv.innerHTML = `
            <div class="spw-item" style="transform-origin: ${origin}; transform: scale(0.8);">
              <img src="${p.src}" alt="${p.name}" class="spw-img" loading="lazy" decoding="async" />
              <div class="spw-caption">
                <span class="spw-name">${p.name}</span>
                <span class="spw-role">${p.role}</span>
              </div>
            </div>
          `;
        }
        rowDiv.appendChild(cellDiv);
      });

      gridContainer.appendChild(rowDiv);
    });

    initAnimation();
  }

  function initAnimation() {
    const hint = document.getElementById('spwHint');
    const root = document.getElementById('portrait-wall');
    const items = document.querySelectorAll('.spw-item');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      items.forEach((el) => { el.style.transform = 'scale(1)'; });
      return;
    }

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      if (hint && root) {
        gsap.to(hint, {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: '+=30%', scrub: true }
        });
      }

      items.forEach((el) => {
        gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        })
          .fromTo(el, { scale: 0.68, autoAlpha: 0.72 }, { scale: 1, autoAlpha: 1, ease: 'power2.out', duration: 0.5 })
          .to(el, { scale: 0.68, autoAlpha: 0.72, ease: 'power2.in', duration: 0.5 });
      });

      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    } else {
      function onNativeScroll() {
        const vh = window.innerHeight;
        if (hint && root) {
          const rRect = root.getBoundingClientRect();
          hint.style.opacity = rRect.top < 0 ? Math.max(0.2, 1 + rRect.top / (vh * 0.4)) : '1';
        }
        items.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const progress = center / vh;
          const dist = Math.abs(progress - 0.5) * 2;
          const factor = Math.max(0, Math.min(1, 1 - Math.pow(dist, 1.8)));
          const scale = 0.68 + 0.32 * factor;
          el.style.transform = `scale(${scale.toFixed(3)})`;
        });
      }
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      onNativeScroll();
    }
  }

  window.addEventListener('resize', renderGrid);
  renderGrid();
})();

/* ── Pestañas Interactivas (Misión, Visión y Valores) & Selector de Metodología ── */
(function () {
  const tabBtns = document.querySelectorAll('[data-tab-target]');
  const tabPanels = document.querySelectorAll('.editorial-tab-panel');
  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab-target');
        tabBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
      });
    });
  }

  const methodBtns = document.querySelectorAll('[data-method-target]');
  const methodPanels = document.querySelectorAll('.method-detail-panel');
  if (methodBtns.length && methodPanels.length) {
    methodBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-method-target');
        methodBtns.forEach((b) => b.classList.remove('active'));
        methodPanels.forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
      });
    });
  }
})();
