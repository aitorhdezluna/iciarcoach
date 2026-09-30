(() => {
  const d = document, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('ready')));

  /* menú */
  const btn = d.getElementById('menuBtn'), menu = d.getElementById('menu'), bar = d.getElementById('bar');
  const setMenu = open => {
    menu.hidden = !open; btn.setAttribute('aria-expanded', open); btn.textContent = open ? 'Cerrar' : 'Menú';
    d.body.style.overflow = open ? 'hidden' : ''; if (open) menu.querySelector('a').focus();
  };
  btn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  d.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

  /* palabras de la idea central */
  const pt = d.getElementById('pauseText');
  if (pt && !reduce) {
    const txt = pt.textContent.trim();
    pt.setAttribute('aria-label', txt);
    pt.innerHTML = txt.split(' ').map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  }
  const words = [...d.querySelectorAll('.pause__t .w')];

  /* scroll: barra, recorrido, palabras */
  const dot = d.getElementById('trailDot'); let last = 0, tick = false;
  const update = () => {
    tick = false;
    const y = scrollY, max = root.scrollHeight - innerHeight;
    dot.style.setProperty('--y', (y / max * (innerHeight - 7)) + 'px');
    bar.classList.toggle('is-hidden', y > last && y > 120); last = y;
    if (words.length) {
      const r = pt.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .75 - r.top) / (r.height + innerHeight * .25)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  /* imágenes y línea final */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in', 'draw'); io.unobserve(e.target); }
  }), { threshold: .25 });
  d.querySelectorAll('.reveal, .end__line').forEach(el => io.observe(el));
})();
