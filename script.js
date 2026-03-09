/* ═══════════════════════════════════════
   HEADER: scroll + burger
═══════════════════════════════════════ */
const header   = document.getElementById('header');
const burger   = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

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
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

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

let testerDone = false;

if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    if (testerDone) return;
    testerDone = true;

    // Hide tooltip
    if (testerTip) testerTip.classList.add('hidden');

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
    iphForm.style.display = 'block';
    iphSuccess.style.display = 'none';
    buyBtn.disabled = false;
    buyBtn.textContent = 'Оформить сертификат';
    if (testerTip) testerTip.classList.remove('hidden');

    macNewRow.style.display = 'none';
    macNewRow.style.background = '';
    macNewRow.style.borderColor = '';
    macBadge.style.display = 'none';
    macNewStatus.textContent = 'Ожидает оплаты';
    macNewStatus.className = 'mst mst--pending';

    testerReset.style.display = 'none';
    if (testerHint) testerHint.style.display = '';
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

/* ═══════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const name    = document.getElementById('cfName');
  const phone   = document.getElementById('cfPhone');
  const contact = document.getElementById('cfContact');
  const agree   = document.getElementById('cfAgree');

  let valid = true;

  [name, phone, contact].forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('err');
      input.addEventListener('input', () => input.classList.remove('err'), { once: true });
      valid = false;
    }
  });

  if (!agree.checked) {
    agree.style.outline = '2px solid #ef4444';
    setTimeout(() => agree.style.outline = '', 1500);
    valid = false;
  }

  if (!valid) return;

  const btn = document.getElementById('cfSubmit');
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  setTimeout(() => {
    document.getElementById('cformBody').style.display = 'none';
    const done = document.getElementById('cformDone');
    done.style.display = 'flex';
  }, 900);
}

// Smooth nav link highlight on scroll
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav__link');

const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    navLinks.forEach(a => {
      a.style.color = '';
      a.style.background = '';
      if (a.getAttribute('href') === '#' + id) {
        a.style.color = 'var(--accent)';
        a.style.background = 'var(--accent-light)';
      }
    });
  });
}, { threshold: 0.5 });

sections.forEach(s => secObs.observe(s));
