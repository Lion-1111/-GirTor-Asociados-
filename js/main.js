/* ── Splash logic ── */
    (function () {
      const splash  = document.getElementById('splash');
      const relief  = document.getElementById('logo-relief');
      const sheen   = document.getElementById('logo-sheen');
      

      function hideSplash () {
        splash.classList.add('hide');
        const waFloat = document.getElementById('wa-float');
        if (waFloat) waFloat.classList.add('show');
        setTimeout(() => { splash.style.display = 'none'; }, 1100);
      }

      
      /* 2 — sheen sweep */
      setTimeout(() => { sheen.classList.add('sheen-go'); }, 3200);
      /* 3 — auto-dismiss */
      setTimeout(hideSplash, 5200);
      /* click to skip */
      splash.addEventListener('click', hideSplash);
    })();

    /* ── Navbar scroll ── */
    (function () {
      const nav = document.getElementById('nav');
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    })();

    /* ── Scroll-reveal ── */
    (function () {
      const els = document.querySelectorAll('.reveal');
      const io  = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      els.forEach(el => io.observe(el));
    })();

    /* ── Accordion ── */
    function toggleAcc(trigger) {
      const item = trigger.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.acc-item.open').forEach(el => el.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    }

    /* ── Contact form handler ── */
    function handleForm(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.form-submit');
      btn.textContent = 'Enviando…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Solicitud enviada';
        btn.style.background = 'linear-gradient(135deg, #4a7c59, #2d5a3d)';
        setTimeout(() => {
          btn.textContent = 'Enviar Solicitud';
          btn.style.background = '';
          btn.disabled = false;
          e.target.reset();
        }, 3200);
      }, 1400);
    }
      /* ── Video-Carousel Cinemático Slider Logic ── */
    (function () {
      const slides = document.querySelectorAll('.hero-slide');
      if (!slides.length) return;

      let currentIndex = 0;
      const totalSlides = slides.length;
      const slideDuration = 6000;
      let isPaused = false;

      function updateSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === currentIndex);
        });
      }

      let interval = setInterval(() => {
        if (!isPaused) updateSlide(currentIndex + 1);
      }, slideDuration);

      const hero = document.getElementById('hero');
      if (hero) {
        hero.addEventListener('mouseenter', () => { isPaused = true; });
        hero.addEventListener('mouseleave', () => { isPaused = false; });
        
        let touchStartX = 0;
        hero.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        hero.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const diff = touchStartX - touchEndX;
          if (Math.abs(diff) > 40) {
            updateSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
          }
        }, { passive: true });
      }
    })();


    /* ── Contador Animado de Números (Empieza desde 0 hasta el final) ── */
    (function () {
      const counters = document.querySelectorAll('.counter');
      if (!counters.length) return;

      let started = false;

      function startCounters() {
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2200; // 2.2 segundos para subir suavemente
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart para suavidad ejecutiva
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOut * target);

            counter.textContent = currentVal;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            startCounters();
          }
        });
      }, { threshold: 0.25 });

      const statsSec = document.getElementById('stats-section');
      if (statsSec) observer.observe(statsSec);
    })();

  
    /* ── ScrollPortraitWall Animation & Grid Generation ── */
    (function () {
      const photos = [
        { name: "Lic. Girón Torres", role: "Socio Director", src: "assets/fto1.jpeg" },
        { name: "Defensa Corporativa", role: "Litigio Estratégico", src: "assets/fto.2.jpeg" },
        { name: "Representación Jurídica", role: "Penal & Fiscal", src: "assets/fto3.jpeg" },
        { name: "Sede Santa Fe", role: "Torre I · CDMX", src: "assets/fto4.jpeg" },
        { name: "Asesoría de Alto Nivel", role: "Consultoría Especializada", src: "assets/fto5.jpeg" },
        { name: "Consejo Legal", role: "Tribunales & Cortes", src: "assets/fto6.jpeg" },
        { name: "GirTor & Asociados", role: "Atención Inmediata", src: "assets/fto1.jpeg" },
        { name: "Firma Especializada", role: "Lomas de Santa Fe", src: "assets/fto.2.jpeg" },
        { name: "Defensa Estratégica", role: "Resultados Precisos", src: "assets/fto3.jpeg" },
        { name: "Litigio de Éxito", role: "Amparos & Juicios", src: "assets/fto4.jpeg" }
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

        layout.forEach((rowIndices, ri) => {
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
                <div class="spw-item" style="transform-origin: ${origin}; transform: scale(0);">
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

        if (window.gsap && window.ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);

          if (hint && root) {
            gsap.to(hint, {
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "+=35%",
                scrub: true,
              },
            });
          }

          items.forEach((el) => {
            gsap.timeline({
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            })
            .fromTo(el, { scale: 0 }, { scale: 1, ease: "power2.out", duration: 0.5 })
            .to(el, { scale: 0, ease: "power2.in", duration: 0.5 });
          });
        } else {
          // Fallback con scroll nativo reactivo si GSAP tarda en cargar
          function onNativeScroll() {
            const vh = window.innerHeight;
            if (hint && root) {
              const rRect = root.getBoundingClientRect();
              if (rRect.top < 0) {
                const fade = Math.max(0, 1 + rRect.top / (vh * 0.4));
                hint.style.opacity = fade;
              } else {
                hint.style.opacity = '1';
              }
            }

            items.forEach((el) => {
              const rect = el.getBoundingClientRect();
              const center = rect.top + rect.height / 2;
              const progress = center / vh;
              // Pico en 0.5 (centro de pantalla)
              const dist = Math.abs(progress - 0.5) * 2;
              const scale = Math.max(0, Math.min(1, 1 - Math.pow(dist, 1.8)));
              el.style.transform = `scale(${scale.toFixed(3)})`;
            });
          }

          window.addEventListener('scroll', onNativeScroll, { passive: true });
          onNativeScroll();
        }
      }

      window.addEventListener('resize', () => {
        renderGrid();
      });

      renderGrid();
    })();