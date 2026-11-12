/* GamitoFX · site v2 */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* toast */
  const toastEl = $('#toast');
  let tt;
  const toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('on'), 2400); };

  /* scroll progress */
  const prog = $('#prog');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* menu */
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) $('.mi', menu).focus();
  };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); } });
  matchMedia('(min-width:900px)').addEventListener('change', e => e.matches && setMenu(false));

  /* reveal */
  const rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) rv.forEach(el => el.classList.add('seen'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  }

  /* long-form tabs */
  const tabs = [$('#tab-v'), $('#tab-s')];
  const panels = [$('#pv'), $('#ps')];
  const select = (i) => {
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1; panels[j].hidden = i !== j; });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const n = (i + 1) % 2; select(n); tabs[n].focus(); } });
  });

  /* long-form player: YouTube (unlisted) on demand */
  const play = $('#lf-play'), thumb = $('#lf-thumb'), yt = play.dataset.yt;
  if (yt) $('#lf-yt').href = `https://www.youtube.com/watch?v=${yt}`;
  const startYT = () => {
    if (!yt) { toast('The full video is coming to YouTube soon.'); return null; }
    let f = $('iframe', thumb);
    if (!f) {
      f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
      f.title = 'The Psychological Productivity Hacks That Actually Rewire Your Brain';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      thumb.appendChild(f);
    }
    return f;
  };
  play.addEventListener('click', startYT);
  $('#lf-full').addEventListener('click', () => { const f = startYT(); if (f && f.requestFullscreen) f.requestFullscreen().catch(() => {}); });
  $('#lf-yt').addEventListener('click', e => { if (!yt) { e.preventDefault(); toast('The full video is coming to YouTube soon.'); } });

  /* shorts carousel */
  const car = $('#car'), cards = $$('.vc', car), dots = $$('#dots i');
  const step = () => cards[0].getBoundingClientRect().width + 12;
  const current = () => Math.round(car.scrollLeft / step());
  const sync = () => {
    const i = Math.min(cards.length - 1, current());
    dots.forEach((d, j) => d.classList.toggle('on', j === i));
    $('#prev').disabled = car.scrollLeft < 8;
    $('#next').disabled = car.scrollLeft + car.clientWidth >= car.scrollWidth - 8;
  };
  car.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  addEventListener('resize', sync); sync();
  $('#prev').addEventListener('click', () => car.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
  $('#next').addEventListener('click', () => car.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));

  const stopAll = (except) => cards.forEach(c => { const v = $('video', c); if (c !== except && !v.paused) { v.pause(); c.classList.remove('playing'); } });
  cards.forEach(c => {
    const v = $('video', c);
    $('.hit', c).addEventListener('click', () => {
      if (v.paused) { stopAll(c); v.controls = false; v.play(); c.classList.add('playing'); }
      else { v.pause(); c.classList.remove('playing'); }
    });
    v.addEventListener('ended', () => c.classList.remove('playing'));
  });
  /* pause shorts that leave the screen */
  if ('IntersectionObserver' in window) {
    const vo = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) { const v = $('video', e.target); if (!v.paused) { v.pause(); e.target.classList.remove('playing'); } } }), { threshold: .2 });
    cards.forEach(c => vo.observe(c));
  }

  /* storyboard sheet */
  const data = JSON.parse($('#sb-data').textContent);
  const sheet = $('#sheet');
  let openCard = null;
  const openSheet = (card) => {
    const s = data[card.dataset.sb]; if (!s) return;
    openCard = card;
    $('#sh-l').textContent = `Storyboard · ${s.d}`;
    $('#sh-t').textContent = s.t;
    $('#sh-d').textContent = s.x;
    $('#sh-f').innerHTML = s.f.map(([img, tc, b, p]) =>
      `<div class="vf"><div class="im"><img src="/assets/img/sb/${img}.webp" width="240" height="427" alt=""><span class="tc">${tc}</span></div><p><b>${b}</b>${p}</p></div>`).join('');
    stopAll(null);
    if (sheet.showModal) sheet.showModal(); else sheet.setAttribute('open', '');
  };
  const closeSheet = () => { if (sheet.close) sheet.close(); else sheet.removeAttribute('open'); };
  $$('.sbo').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); openSheet(b.closest('.vc')); }));
  $('#sh-x').addEventListener('click', closeSheet);
  sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(); });
  $('#sh-w').addEventListener('click', () => {
    closeSheet();
    if (!openCard) return;
    openCard.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center', inline: 'start' });
    const c = openCard; setTimeout(() => $('.hit', c).click(), reduce ? 0 : 450);
  });

  /* copy e-mail */
  $('#copy').addEventListener('click', async (e) => {
    const btn = e.currentTarget, t = btn.dataset.copy;
    try { await navigator.clipboard.writeText(t); btn.textContent = 'Copied'; toast('E-mail copied'); setTimeout(() => { btn.textContent = 'Copy'; }, 2000); }
    catch { location.href = `mailto:${t}`; }
  });

  /* brief form → e-mail draft */
  const form = $('#brief');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const email = (f.get('email') || '').trim(), link = (f.get('link') || '').trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Add a valid e-mail'); form.email.focus(); return; }
    if (!link) { toast('Add your channel or product link'); form.link.focus(); return; }
    const subject = `Project brief: ${f.get('need')}`;
    const text = `What I need: ${f.get('need')}\nMy e-mail: ${email}\nChannel or product: ${link}\n\nWhat the next video should do:\n${(f.get('goal') || '').trim() || '-'}`;
    location.href = `mailto:joaogamitomkt@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    toast('Opening your e-mail app…');
  });

  /* giant wordmark: always fits the container */
  const giant = $('#giant');
  const fit = () => {
    const w = giant.parentElement.clientWidth;
    giant.style.fontSize = '100px';
    giant.style.fontSize = (100 * w / giant.scrollWidth) + 'px';
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);
  addEventListener('resize', fit);
})();
