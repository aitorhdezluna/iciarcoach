(() => {
  const d = document, root = d.documentElement;
  root.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));

  /* menú */
  const btn = d.getElementById('menuBtn');
  const menu = d.getElementById('menu');
  const bar = d.getElementById('bar');

  if (btn && menu) {
    const setMenu = open => {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Cerrar' : 'Menú';
      d.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    };

    btn.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', e => {
      if (e.target.closest('a')) setMenu(false);
    });

    d.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        btn.focus();
      }
    });
  }

  /* palabras de la idea central */
  const pt = d.getElementById('pauseText');
  if (pt && !reduce) {
    const txt = pt.textContent.trim();
    pt.setAttribute('aria-label', txt);
    pt.innerHTML = txt.split(' ').map(w => {
      const span = d.createElement('span');
      span.className = 'w';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = w;
      return span.outerHTML;
    }).join(' ');
  }
  const words = [...d.querySelectorAll('.pause__t .w')];

  /* scroll: barra, recorrido, palabras */
  const dot = d.getElementById('trailDot');
  let last = 0, tick = false;
  const update = () => {
    tick = false;
    const y = scrollY;
    const max = Math.max(1, root.scrollHeight - innerHeight);

    if (dot) dot.style.setProperty('--y', (y / max * (innerHeight - 7)) + 'px');
    if (bar) {
      bar.classList.toggle('is-hidden', y > last && y > 120);
      last = y;
    }

    if (words.length && pt) {
      const r = pt.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (r.height + innerHeight * .25)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
  };

  addEventListener('scroll', () => {
    if (!tick) {
      tick = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();

  /* imágenes y línea final */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in', 'draw');
        io.unobserve(e.target);
      }
    }), { threshold: .25 });

    d.querySelectorAll('.reveal, .end__line').forEach(el => io.observe(el));
  }

  /* testimonios */
  const vs = [...d.querySelectorAll('.voz')];
  const vn = d.getElementById('vocesNav');

  if (vs.length > 1 && vn) {
    vn.hidden = false;
    let k = 0;

    const show = n => {
      k = (n + vs.length) % vs.length;
      vs.forEach((v, i) => v.classList.toggle('is-on', i === k));
      const count = d.getElementById('vCount');
      if (count) count.textContent = String(k + 1).padStart(2, '0') + ' / ' + String(vs.length).padStart(2, '0');
    };

    const prev = d.getElementById('vPrev');
    const next = d.getElementById('vNext');
    if (prev) prev.onclick = () => show(k - 1);
    if (next) next.onclick = () => show(k + 1);
  }
})();