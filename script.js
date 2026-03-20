/* ────────────────────────────────────────
   CUT PLAN (cute version) — script.js
   ──────────────────────────────────────── */

/* ── PROGRESS BAR ── */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('progressBar').style.width = Math.min(pct, 100) + '%';
});

/* ── NAV SCROLL ── */
(function() {
  const nav = document.getElementById('mainNav');
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach(a => a.classList.toggle('active-link', a.getAttribute('href') === '#' + cur));
  });
})();

/* ── SCROLL REVEAL ── */
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── FLOATING STICKERS (background rain) ── */
(function() {
  const layer = document.getElementById('stickerLayer');
  if (!layer) return;

  // Use sticker data from sticker_data.js if available, otherwise use emoji fallbacks
  const emojiStickers = [' 😭','💗','✨','🥹','🗿','💕','🙂‍↕️','🧍🏻‍♀️','🩷','🌸',' 😭','🫶'];

  function spawnSticker() {
    const el = document.createElement('div');
    el.className = 'sticker-float';
    const sc = (0.4 + Math.random() * 0.5).toFixed(2);
    const r0 = (Math.random() * 40 - 20).toFixed(1) + 'deg';
    const r1 = (Math.random() * 40 - 20).toFixed(1) + 'deg';
    el.style.setProperty('--r0', r0);
    el.style.setProperty('--r1', r1);
    el.style.setProperty('--sc', sc);
    el.style.left = (Math.random() * 100) + '%';
    el.style.fontSize = (1.2 + Math.random() * 1.2) + 'rem';
    el.style.animationDuration = (12 + Math.random() * 16) + 's';
    el.style.animationDelay = (Math.random() * -20) + 's';

    // Use image sticker if available
    if (typeof STICKERS !== 'undefined') {
      const keys = Object.keys(STICKERS);
      if (keys.length > 0 && Math.random() > 0.6) {
        const key = keys[Math.floor(Math.random() * keys.length)];
        const img = document.createElement('img');
        img.src = STICKERS[key];
        img.style.width = (40 + Math.random() * 40) + 'px';
        img.style.opacity = '0.55';
        img.draggable = false;
        el.appendChild(img);
      } else {
        el.textContent = emojiStickers[Math.floor(Math.random() * emojiStickers.length)];
      }
    } else {
      el.textContent = emojiStickers[Math.floor(Math.random() * emojiStickers.length)];
    }

    layer.appendChild(el);
    const dur = parseFloat(el.style.animationDuration) * 1000;
    const delay = Math.abs(parseFloat(el.style.animationDelay)) * 1000;
    setTimeout(() => el.remove(), dur + delay + 1000);
  }

  // Initial batch
  for (let i = 0; i < 8; i++) setTimeout(spawnSticker, i * 800);
  // Keep spawning
  setInterval(spawnSticker, 2200);
})();

/* ── HERO STICKERS (positioned around hero) ── */
(function() {
  const zone = document.getElementById('heroStickers');
  if (!zone) return;

  const positions = [
    { right: '2%', top: '15%', size: 110, r0: '-8deg', r1: '4deg', delay: 0 },
    { left: '2%', top: '20%', size: 90, r0: '6deg', r1: '-4deg', delay: .5 },
    { right: '8%', bottom: '18%', size: 95, r0: '10deg', r1: '-6deg', delay: 1 },
    { left: '5%', bottom: '22%', size: 80, r0: '-12deg', r1: '5deg', delay: 1.5 },
    { right: '18%', top: '8%', size: 70, r0: '5deg', r1: '-10deg', delay: .3 },
    { left: '18%', top: '12%', size: 65, r0: '-6deg', r1: '8deg', delay: .8 },
  ];

  const imgs = typeof STICKERS !== 'undefined' ? Object.values(STICKERS) : [];
  const emojiFallback = ['🙂‍↕️','💗','✨','🗿','💕','🧍🏻‍♀️'];

  positions.forEach((pos, i) => {
    const el = document.createElement('div');
    el.className = 'hero-sticker';
    el.style.setProperty('--r0', pos.r0);
    el.style.setProperty('--r1', pos.r1);
    el.style.animationDelay = pos.delay + 's';
    Object.assign(el.style, {
      top: pos.top || 'auto',
      bottom: pos.bottom || 'auto',
      left: pos.left || 'auto',
      right: pos.right || 'auto',
    });

    if (imgs.length > 0 && i < imgs.length) {
      const img = document.createElement('img');
      img.src = imgs[i % imgs.length];
      img.style.width = pos.size + 'px';
      img.style.opacity = '0.75';
      img.draggable = false;
      el.appendChild(img);
    } else {
      el.style.fontSize = (pos.size / 35) + 'rem';
      el.textContent = emojiFallback[i % emojiFallback.length];
    }

    zone.appendChild(el);
  });
})();

/* ── SMOOTH NAV SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  });
});

/* ── PHASE SELECTOR ── */
function setPhase(n, el) {
  document.querySelectorAll('.phase-block').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.macro-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('phase-p' + n);
  panel.classList.add('active');
  // animate bars
  panel.querySelectorAll('.macro-fill').forEach(bar => {
    bar.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      bar.style.width = (bar.dataset.w || '0') + '%';
    }));
  });
}

/* ── DAY SELECTOR ── */
function setDay(d, el) {
  document.querySelectorAll('.week-day:not(.rest)').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.session-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('day-' + d).classList.add('active');
}

/* ── CARB CYCLING PHASE ── */
function setCCPhase(n, el) {
  document.querySelectorAll('.cc-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('cc-p2').style.display = n === 2 ? 'grid' : 'none';
  document.getElementById('cc-p3').style.display = n === 3 ? 'grid' : 'none';
}

/* ── INIT MACRO BARS ── */
(function() {
  document.querySelectorAll('.macro-fill').forEach(bar => {
    const w = bar.dataset.w || bar.style.width?.replace('%','') || '0';
    bar.dataset.w = w;
    bar.style.width = '0';
  });
  setTimeout(() => {
    const active = document.querySelector('.macro-panel.active');
    if (active) active.querySelectorAll('.macro-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
  }, 500);
})();

/* ── BUILD PROJECTION ── */
(function() {
  const container = document.getElementById('projRows');
  if (!container) return;

  const losses = [0.9, 0.85, 0.9, 0.85, 0.9, 0, 0.85, 0.85, 0.9, 0, 0.9, 0.85];
  const phases = [1,1,1,1,2,2,2,2,3,3,3,3];
  const colors = ['#74b4f0','#72c98a','#ff85b3'];
  const total = 10.8;
  let curr = 75.6;

  losses.forEach((loss, i) => {
    curr = +(curr - loss).toFixed(2);
    const pct = Math.round(Math.max(0, Math.min(100, ((75.6 - curr) / total) * 100)));
    const refeed = loss === 0;
    const color = refeed ? '#f5c060' : colors[phases[i] - 1];

    const row = document.createElement('div');
    row.className = 'proj-row';
    row.innerHTML = `
      <span class="proj-wk">Sem ${i+1} ${refeed ? '<span class="proj-badge">refeed</span>' : ''}</span>
      <div class="proj-bar-wrap"><div class="proj-bar" data-pct="${pct}" style="background:${color}"></div></div>
      <span class="proj-kg" style="color:${color}">${curr.toFixed(1)} kg</span>
    `;
    container.appendChild(row);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const row = e.target;
      row.classList.add('visible');
      const bar = row.querySelector('.proj-bar');
      if (bar) setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 60);
      obs.unobserve(row);
    });
  }, { threshold: 0.3 });

  container.querySelectorAll('.proj-row').forEach((r, i) => {
    r.style.transitionDelay = (i * 0.035) + 's';
    obs.observe(r);
  });
})();
