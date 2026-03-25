/* ═══════════════════════════════════════
   HEADER: scroll + burger
═══════════════════════════════════════ */
const header   = document.getElementById('header');
const burger   = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const menuOverlay = document.getElementById('menuOverlay');

function closeMenu() {
  burger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  if (menuOverlay) {
    menuOverlay.classList.remove('visible');
    setTimeout(() => menuOverlay.classList.remove('open'), 250);
  }
}

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (menuOverlay) {
    if (open) {
      menuOverlay.classList.add('open');
      requestAnimationFrame(() => menuOverlay.classList.add('visible'));
    } else {
      closeMenu();
    }
  }
});

// Close menu on tap outside or overlay click
document.addEventListener('click', (e) => {
  if (!mobileMenu.classList.contains('open')) return;
  if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) closeMenu();
});
if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const delay = parseInt(e.target.dataset.d || 0);
    setTimeout(() => e.target.classList.add('in'), delay);
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════
   CHART BARS ANIMATION
═══════════════════════════════════════ */
const chartObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add('animated'), 200);
    chartObs.unobserve(e.target);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.chart-bars').forEach(el => chartObs.observe(el));

/* ═══════════════════════════════════════
   INTERACTIVE TESTER
═══════════════════════════════════════ */
const buyBtn       = document.getElementById('buyBtn');
const iphForm      = document.getElementById('iphForm');
const iphSuccess   = document.getElementById('iphSuccess');
const macNewRow    = document.getElementById('macNewRow');
const macNewStatus = document.getElementById('macNewStatus');
const macBadge     = document.getElementById('macBadge');
const testerHint   = document.getElementById('testerHint');
const testerReset  = document.getElementById('testerReset');
const resetBtn     = document.getElementById('resetBtn');
const tdMac        = document.querySelector('.td--mac');
const iosNotif     = document.getElementById('iosNotif');
const testerTip    = document.getElementById('testerTip');
const hsPhone    = document.getElementById('hsPhone');
const hsMac      = document.getElementById('hsMac');
const hsAdemo    = document.getElementById('hsAdemo');
const hsAnalytics = document.getElementById('hsAnalytics');
function hsGone(el) { if (el) el.classList.add('hotspot--gone'); }
function hsBack(el) { if (el) el.classList.remove('hotspot--gone'); }

let testerDone = false;

if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (testerDone) return;
    testerDone = true;

    // Hide tooltip + phone hotspot
    if (testerTip) testerTip.classList.add('hidden');
    hsGone(hsPhone);

    buyBtn.disabled = true;
    buyBtn.textContent = 'Оформляем...';

    // Step 1 — iPhone success (700ms)
    setTimeout(() => {
      iphForm.style.display = 'none';
      iphSuccess.style.display = 'flex';
    }, 700);

    // Step 1b — iOS notification (900ms)
    setTimeout(() => {
      if (iosNotif) {
        iosNotif.classList.add('show');
        setTimeout(() => iosNotif.classList.remove('show'), 3800);
      }
    }, 900);

    // On mobile: scroll to MacBook
    if (window.innerWidth < 860) {
      setTimeout(() => {
        tdMac && tdMac.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    }

    // Step 2 — new row in admin (1200ms)
    setTimeout(() => {
      macNewRow.style.display = 'grid';
      macBadge.style.display = 'inline-flex';
      if (testerHint) testerHint.style.display = 'none';
      hsGone(hsMac);
    }, 1200);

    // Step 3 — paid (2700ms)
    setTimeout(() => {
      macNewStatus.textContent = 'Оплачено';
      macNewStatus.className = 'mst mst--paid';
      macNewRow.style.background = '#dcfce7';
      macNewRow.style.borderColor = '#bbf7d0';
      setTimeout(() => {
        macNewRow.style.background = '';
        macNewRow.style.borderColor = '';
      }, 800);
    }, 2700);

    // Step 4 — show reset (3600ms)
    setTimeout(() => {
      testerReset.style.display = 'block';
    }, 3600);
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    iphForm.style.display = 'flex';
    iphSuccess.style.display = 'none';
    buyBtn.disabled = false;
    buyBtn.textContent = 'Оплатить';
    if (testerTip) testerTip.classList.remove('hidden');

    macNewRow.style.display = 'none';
    macNewRow.style.background = '';
    macNewRow.style.borderColor = '';
    macBadge.style.display = 'none';
    macNewStatus.textContent = 'Ожидает оплаты';
    macNewStatus.className = 'mst mst--pending';

    testerReset.style.display = 'none';
    if (testerHint) testerHint.style.display = '';
    hsBack(hsPhone); hsBack(hsMac); hsBack(hsAdemo); hsBack(hsAnalytics);
    testerDone = false;
  });
}

/* ═══════════════════════════════════════
   ADMIN DEMO: tabs + interactive table
═══════════════════════════════════════ */
const ademoAddBtn = document.getElementById('ademoAddBtn');
const ademoList   = document.getElementById('ademoList');

// Tab switching
document.querySelectorAll('.ademo__sb-item').forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    // Update active sidebar item
    document.querySelectorAll('.ademo__sb-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (tab === 'analytics') hsGone(hsAnalytics);
    // Show/hide panels
    const tabCerts = document.getElementById('tabCerts');
    const tabAnalytics = document.getElementById('tabAnalytics');
    if (tabCerts) tabCerts.classList.toggle('ademo__main--hidden', tab !== 'certs');
    if (tabAnalytics) tabAnalytics.classList.toggle('ademo__main--hidden', tab !== 'analytics');
  });
});

let demoStep = 0;
const demoEntries = [
  { name: 'Анна С.',  sum: '3 000 ₽', status: 'pending', label: 'Ожидает' },
  { name: 'Дима В.',  sum: '7 500 ₽', status: 'paid',    label: 'Оплачено' },
  { name: 'Света К.', sum: '1 500 ₽', status: 'paid',    label: 'Оплачено' },
];

if (ademoAddBtn) {
  ademoAddBtn.addEventListener('click', () => {
    hsGone(hsAdemo);
    const entry = demoEntries[demoStep % demoEntries.length];
    demoStep++;

    const row = document.createElement('div');
    row.className = 'ademo__row ademo__row--new';
    row.innerHTML = `
      <span>${entry.name}</span>
      <span>${entry.sum}</span>
      <span class="ast ast--${entry.status}">${entry.label}</span>
      <span class="ademo__close-btn">✕</span>
    `;
    ademoList.appendChild(row);

    if (entry.status === 'pending') {
      setTimeout(() => {
        const st = row.querySelector('.ast');
        if (st) { st.textContent = 'Оплачено'; st.className = 'ast ast--paid'; }
        row.style.background = '#f0fdf4';
        setTimeout(() => { row.style.background = ''; }, 600);
      }, 1500);
    }

    row.querySelector('.ademo__close-btn').addEventListener('click', () => {
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      row.style.transition = 'all 0.25s ease';
      setTimeout(() => row.remove(), 260);
    });
  });

  document.querySelectorAll('.ademo__close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('.ademo__row');
      if (!row) return;
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      row.style.transition = 'all 0.25s ease';
      setTimeout(() => row.remove(), 260);
    });
  });
}

/* ═══════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));

    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// Nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  });
}, {
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
});

sections.forEach(s => secObs.observe(s));


/* ═══════════════════════════════════════
   HERO CHARACTERS ANIMATION
═══════════════════════════════════════ */
(function() {
  const charM = document.getElementById('hcharM');
  const charG = document.getElementById('hcharG');
  const charK1 = document.getElementById('hcharK1');
  const charK2 = document.getElementById('hcharK2');
  const hero  = document.getElementById('hero');
  if (!charM || !charG || !hero) return;

  let swapTimer1 = null;
  let swapTimer2 = null;
  let entranceDone = false;

  // ── Запуск анимации смены кадров ──
  function runSwap() {
    clearTimeout(swapTimer1);
    clearTimeout(swapTimer2);

    charM.classList.remove('hchar--swapped');
    charG.classList.remove('hchar--swapped');

    swapTimer1 = setTimeout(() => {
      charM.classList.add('hchar--swapped');
      swapTimer2 = setTimeout(() => {
        charG.classList.add('hchar--swapped');
      }, 300);
    }, 900);
  }

  // ── Entrance: m/g + k1/k2 вплываем сразу после загрузки ──
  setTimeout(() => {
    charM.classList.add('visible');
    charG.classList.add('visible');
    if (charK1) charK1.classList.add('visible');
    if (charK2) charK2.classList.add('visible');
    entranceDone = true;
  }, 200);

  // ── IntersectionObserver: следим за hero ──
  const heroObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) runSwap();
    });
  }, { threshold: 0.2 });

  heroObs.observe(hero);

  // ── Параллакс на скролле ──
  // k2 (top-left) уезжает влево, k1 (bottom-right) уезжает вправо
  const benefits = document.querySelector('.benefits');

  function updateParallax() {
    if (!benefits) return;
    const benefitsRect = benefits.getBoundingClientRect();
    const heroH = hero.offsetHeight;

    const overlap = Math.max(0, heroH - benefitsRect.top);
    const progress = Math.min(1, overlap / (heroH * 0.7));

    const maxShift = 160;
    const shift = progress * maxShift;

    // m уезжает вправо, g — влево (как было)
    charM.style.transform = `translateX(${shift}px)`;
    charG.style.transform = `translateX(${-shift}px)`;

    // k2 (top-left) — влево, k1 (bottom-right) — вправо
    if (charK2) charK2.style.transform = `translateX(${-shift}px)`;
    if (charK1) charK1.style.transform = `translateX(${shift}px)`;
  }

  setTimeout(() => {
    charM.style.transition = 'opacity 0.1s ease';
    charG.style.transition = 'opacity 0.1s ease';
    if (charK1) charK1.style.transition = 'none';
    if (charK2) charK2.style.transition = 'none';
  }, 1100);

  window.addEventListener('scroll', updateParallax, { passive: true });

})();

/* ═══════════════════════════════════════════════════════════
   SECURITY SECTION
   ═══════════════════════════════════════════════════════════ */
(function () {
  const panelObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const delay = Number(e.target.dataset.d || 0);
      setTimeout(() => e.target.classList.add('sec--active'), delay + 200);
      panelObs.unobserve(e.target);
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.sec__panel').forEach(p => panelObs.observe(p));
})();

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS — appear on scroll (both directions) + hover-like active
   ═══════════════════════════════════════════════════════════ */
(function () {
  const steps   = Array.from(document.querySelectorAll('.how__step'));
  const section = document.querySelector('.how');
  if (!steps.length || !section) return;
 
  const STEP_APPEAR = 200;  // мс между появлением соседних шагов
  const STEP_HOLD   = 1800;  // мс сколько горит иконка на каждом шаге
  const STEP_GAP    = 100;  // мс пауза между окончанием одного и началом следующего
 
  let played = false;
 
  function runSequence() {
    if (played) return;
    played = true;
 
    // 1. Показываем все шаги по очереди (появление)
    steps.forEach((s, i) => {
      setTimeout(() => s.classList.add('is-visible'), i * STEP_APPEAR);
    });
 
    // 2. Последовательно подсвечиваем иконки
    steps.forEach((s, i) => {
      const onAt  = i * (STEP_HOLD + STEP_GAP) + 300;
      const offAt = onAt + STEP_HOLD;
 
      setTimeout(() => {
        steps.forEach(x => x.classList.remove('is-active'));
        s.classList.add('is-active');
      }, onAt);
 
      setTimeout(() => {
        s.classList.remove('is-active');
      }, offAt);
    });
  }
 
  const howObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) runSequence();
    });
  }, { threshold: 0.15 });
 
  howObs.observe(section);
})();
/* ═══════════════════════════════════════════════════════════
   EDITOR PROMO DEMO ANIMATION
   1. Курсор едет к строке "Для кого"
   2. Клик → Анна Иванова пропадает, появляется синий маркер
   3. Тянем маркер вниз под "Срок действия"
   4. Отпускаем → строка "Для кого: Анна Иванова" появляется снизу
   5. Пауза → сброс
   ═══════════════════════════════════════════════════════════ */
(function () {
  var pin      = document.getElementById('epPin');
  var cursor   = document.getElementById('epCursor');
  var whoVal   = document.getElementById('epWhoVal');
  var fieldWho = document.getElementById('epFieldWho');
  var ghost    = document.getElementById('epGhostField');
  var xEl      = document.getElementById('epDemoX');
  var yEl      = document.getElementById('epDemoY');
  var section  = document.querySelector('.editor-promo');

  if (!pin || !cursor || !section) return;

  var started = false;

  function L(a, b, t) { return a + (b - a) * t; }
  function eio(t) { return t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2; }
  function eo(t)  { return 1 - Math.pow(1 - t, 3); }

  /* % от canvas */
  var WX = 5,  WY = 16; /* "Для кого" строка   */
  var AX = 5,  AY = 52; /* под "Срок действия" */

  var CX_W = 446, CY_W = 74;   /* координаты для сайдбара */
  var CX_A = 446, CY_A = 410;

  var TOTAL = 5200;
  var startTime = null;

  function reset() {
    pin.style.display = 'none';
    pin.style.left = WX + '%'; pin.style.top = WY + '%';
    var dot = pin.querySelector('.ep__pin-dot--active');
    if (dot) dot.style.transform = 'scale(1)';
    if (whoVal)   { whoVal.style.opacity = '1'; }
    if (fieldWho) fieldWho.classList.remove('ep__cfield--selected');
    if (ghost)    ghost.classList.remove('show');
    cursor.style.left = '85%'; cursor.style.top = '8%';
    if (xEl) xEl.textContent = CX_W;
    if (yEl) yEl.textContent = CY_W;
  }

  function step(ts) {
    if (!startTime) startTime = ts;
    var p = Math.min((ts - startTime) / TOTAL, 1);
    var t, l, tv, dot;

    if (p < 0.13) {
      /* Фаза 1: курсор летит к строке "Для кого" */
      t = eio(p / 0.13);
      cursor.style.left = L(85, WX + 3, t) + '%';
      cursor.style.top  = L(8,  WY + 2, t) + '%';

    } else if (p < 0.25) {
      /* Фаза 2: курсор на месте, кликает — текст исчезает, маркер появляется */
      t = (p - 0.13) / 0.12;
      cursor.style.left = (WX + 3) + '%';
      cursor.style.top  = (WY + 2) + '%';
      /* text fade out */
      if (whoVal) whoVal.style.opacity = Math.max(0, 1 - eio(Math.max(0, t - 0.2) / 0.5)) + '';
      /* pin появляется */
      if (t > 0.4) {
        pin.style.display = 'flex';
        if (fieldWho) fieldWho.classList.add('ep__cfield--selected');
      }
      pin.style.left = WX + '%'; pin.style.top = WY + '%';

    } else if (p < 0.68) {
      /* Фаза 3: тащим маркер вниз */
      t  = eio((p - 0.25) / 0.63);
      l  = L(WX, AX, t);
      tv = L(WY, AY, t);
      pin.style.left = l + '%'; pin.style.top = tv + '%';
      cursor.style.left = (l + 3) + '%'; cursor.style.top = (tv + 2) + '%';
      dot = pin.querySelector('.ep__pin-dot--active');
      if (dot) dot.style.transform = 'scale(1.3)';
      if (xEl) xEl.textContent = Math.round(L(CX_W, CX_A, t));
      if (yEl) yEl.textContent = Math.round(L(CY_W, CY_A, t));

    } else if (p < 0.76) {
      /* Фаза 4: drop — отпускаем, курсор уходит, ghost-строка появляется */
      t = eio((p - 0.68) / 0.08);
      pin.style.left = AX + '%'; pin.style.top = AY + '%';
      cursor.style.left = L(AX + 3, AX + 16, t) + '%';
      cursor.style.top  = L(AY + 2, AY - 6,  t) + '%';
      dot = pin.querySelector('.ep__pin-dot--active');
      if (dot) dot.style.transform = 'scale(1)';
      if (ghost && !ghost.classList.contains('show')) ghost.classList.add('show');
      if (xEl) xEl.textContent = CX_A;
      if (yEl) yEl.textContent = CY_A;

    } else if (p < 0.9) {
      /* Фаза 5: пауза */
      pin.style.left = AX + '%'; pin.style.top = AY + '%';
      cursor.style.left = (AX + 16) + '%'; cursor.style.top = (AY - 6) + '%';

    } else {
      /* Фаза 6: курсор уходит, сброс */
      t = eo((p - 0.9) / 0.1);
      cursor.style.left = L(AX + 16, 85, t) + '%';
      cursor.style.top  = L(AY - 6,  8,  t) + '%';
      if (t > 0.6) reset();
    }

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      startTime = null;
      requestAnimationFrame(step);
    }
  }

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !started) {
        started = true;
        reset();
        requestAnimationFrame(step);
      }
    });
  }, { threshold: 0.25 });

  obs.observe(section);
})();