document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initHamburgerMenu();
  initSurfaceFilter();
  initFaqAccordion();
  initCalculator();
  initSmoothScroll();
  initCookieBanner();
  setFooterYear();
  setDynamicDates();
});

/* 1. STICKY HEADER */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  update();
  window.addEventListener('scroll', update);
}

/* 2. HAMBURGER MENU MOBILE */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('nav-open');
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('nav-open');
    }
  });
}

/* 3. FILTRO POR SUPERFICIE */
function initSurfaceFilter() {
  const buttons = document.querySelectorAll('.surface-card');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      button.classList.add('active');

      const targetSelector = button.getAttribute('data-target');
      if (!targetSelector) return;

      if (targetSelector.startsWith('#')) {
        const target = document.querySelector(targetSelector);
        if (target) scrollToTarget(target);
      } else {
        window.location.href = targetSelector;
      }
    });
  });
}

/* 4. FAQ ACORDEÓN */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* 5. CALCULADORA DE SUPERFICIE */
const PRODUCTOS_POR_SUPERFICIE = [
  {
    maxSuperficie: 200,
    rango: '250 m²',
    nombre: 'MOVA ViAX 250',
    specs: '250 m² · 55 min · 58 dB',
    precio: '499€',
    imagen: 'assets/images/products/mova-viax250.jpg',
    enlace: 'https://amzn.to/4evIDUi'
  },
  {
    maxSuperficie: 500,
    rango: '500 m²',
    nombre: 'ANTHBOT M5',
    specs: '500 m² · 60 min · 62 dB',
    precio: '625,74€',
    imagen: 'assets/images/products/anthbot-m5.jpg',
    enlace: 'https://amzn.to/4exkKfd'
  },
  {
    maxSuperficie: 650,
    rango: '500 m²',
    nombre: 'MOVA ViAX 500',
    specs: '500 m² · 90 min · 57 dB',
    precio: '749€',
    imagen: 'assets/images/products/mova-viax500.jpg',
    enlace: 'https://amzn.to/4bO4N2k'
  },
  {
    maxSuperficie: 800,
    rango: '800 m²',
    nombre: 'Cecotec Conga GrassHopper 800 ProAI',
    specs: '800 m² · 65 min · 55 dB',
    precio: '629€',
    imagen: 'assets/images/products/cecotec-grasshopper-800-proai.jpg',
    enlace: 'https://amzn.to/4bO4V1O'
  },
  {
    maxSuperficie: 1000,
    rango: '1.000 m²',
    nombre: 'ANTHBOT M9',
    specs: '1.000 m² · 90 min · 64 dB',
    precio: '750,68€',
    imagen: 'assets/images/products/anthbot-m9.jpg',
    enlace: 'https://amzn.to/4vyxxnH'
  },
  {
    maxSuperficie: Infinity,
    rango: 'más de 1.000 m²',
    nombre: 'Ecovacs Goat A1600 LiDAR Pro',
    specs: '1.600 m² · 120 min · 60 dB',
    precio: '899€',
    imagen: 'assets/images/products/ecovacs-goat-a1600.jpg',
    enlace: 'https://amzn.to/4uZRXEO'
  }
];

function getProductoRecomendado(superficie) {
  return PRODUCTOS_POR_SUPERFICIE.find((p) => superficie <= p.maxSuperficie);
}

function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;

  const largoInput = document.getElementById('largo');
  const anchoInput = document.getElementById('ancho');
  const desnivelInput = document.getElementById('desnivel');
  const errorEl = document.getElementById('calcError');
  const resultEl = document.getElementById('calcResult');
  const surfaceEl = document.getElementById('resultSurface');
  const recEl = document.getElementById('resultRec');
  const productImageLink = document.getElementById('calcProductImageLink');
  const productImage = document.getElementById('calcProductImage');
  const productName = document.getElementById('calcProductName');
  const productSpecs = document.getElementById('calcProductSpecs');
  const productPrice = document.getElementById('calcProductPrice');
  const ctaEl = document.getElementById('resultCta');

  const formatter = new Intl.NumberFormat('es-ES');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const largo = parseFloat(largoInput.value);
    const ancho = parseFloat(anchoInput.value);

    if (!largo || !ancho || largo <= 0 || ancho <= 0) {
      errorEl.style.display = 'block';
      resultEl.classList.remove('visible');
      return;
    }

    errorEl.style.display = 'none';

    let superficie = largo * ancho;
    if (desnivelInput.checked) {
      superficie *= 1.3;
    }

    const producto = getProductoRecomendado(superficie);

    surfaceEl.textContent = `Tu jardín tiene aprox. ${formatter.format(Math.round(superficie))} m²`;
    recEl.textContent = `Te recomendamos un robot para jardines de hasta ${producto.rango}`;

    productImageLink.href = producto.enlace;
    productImage.src = producto.imagen;
    productImage.alt = producto.nombre;
    productName.textContent = producto.nombre;
    productSpecs.textContent = producto.specs;
    productPrice.textContent = producto.precio;
    ctaEl.href = producto.enlace;
    ctaEl.textContent = `Ver ${producto.nombre} en Amazon →`;

    resultEl.classList.remove('visible');
    requestAnimationFrame(() => resultEl.classList.add('visible'));
  });
}

function getRangoRecomendado(superficie) {
  if (superficie <= 200) return 'hasta 250 m²';
  if (superficie <= 400) return 'hasta 500 m²';
  if (superficie <= 700) return 'hasta 800 m²';
  return 'más de 1.000 m²';
}

/* 6. SMOOTH SCROLL */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      scrollToTarget(target);
    });
  });
}

function scrollToTarget(target) {
  const header = document.getElementById('siteHeader');
  const offset = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.scrollY - offset - 12;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* 7. BANNER DE COOKIES (RGPD) */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const STORAGE_KEY = 'cookies_robotcesped';

  if (!localStorage.getItem(STORAGE_KEY)) {
    banner.classList.remove('hidden');
  }

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'aceptadas');
    banner.classList.add('hidden');
  });

  document.getElementById('cookieMinimal').addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'minimas');
    banner.classList.add('hidden');
  });
}

/* Año dinámico en footer */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* Fechas de "actualizado" siempre al mes y año actuales */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MESES_ABR = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];

function setDynamicDates() {
  const now = new Date();
  const year = now.getFullYear();
  const monthFull = MESES[now.getMonth()];
  const monthAbbr = MESES_ABR[now.getMonth()];

  document.querySelectorAll('.current-month-year').forEach((el) => {
    el.textContent = `${monthFull} ${year}`;
  });

  document.querySelectorAll('.current-month-year-abbr').forEach((el) => {
    el.textContent = `${monthAbbr} ${year}`;
  });
}
