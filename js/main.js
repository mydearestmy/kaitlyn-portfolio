(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);

  // Page-load transition
  const start = performance.now();
  const reveal = () => setTimeout(() => document.documentElement.classList.add('loaded'),
    Math.max(0, 900 - (performance.now() - start)));
  document.readyState === 'complete' ? reveal() : addEventListener('load', reveal);

  // Rotating "Welcome"
  const words = [...document.querySelectorAll('.rot span')];
  let w = 0;
  if (words.length) setInterval(() => {
    const cur = words[w]; w = (w + 1) % words.length; const nxt = words[w];
    cur.classList.replace('is-in', 'is-out');
    nxt.classList.remove('is-out'); nxt.classList.add('is-in');
    setTimeout(() => cur.classList.remove('is-out'), 800);
  }, 2600);

  // Scroll reveal
  const io = new IntersectionObserver((entries) => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Nav background on scroll
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Hero record: spins faster when scrolling, tilts toward the cursor
  const rec = $('#heroRecord'), par = $('#parallax');
  if (rec) {
  let angle = 0, lastY = scrollY, boost = 0;
  const tick = () => {
    boost += (Math.abs(scrollY - lastY) - boost) * .1; lastY = scrollY;
    angle += reduce ? 0 : .25 + Math.min(boost * .15, 8);
    rec.style.transform = `rotate(${angle}deg)`;
    requestAnimationFrame(tick);
  };
  tick();
  addEventListener('pointermove', (e) => {
    if (reduce || scrollY > innerHeight) return;
    const x = (e.clientX / innerWidth - .5) * 24, y = (e.clientY / innerHeight - .5) * 24;
    par.style.transform = `translate(${x}px,${y}px)`;
  });

  }

  // Projects: endless automatic slide (pauses on hover so you can play a record)
  const group = $('#group'), marquee = $('#marquee');
  if (group && !reduce) {
    const originals = [...group.children];
    const dupe = (n) => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('a').forEach(a => a.tabIndex = -1); return c; };
    while (group.scrollWidth < innerWidth + 200 && group.children.length < 40) originals.forEach(n => group.appendChild(dupe(n)));
    const copy = dupe(group); copy.removeAttribute('id'); marquee.appendChild(copy);
    marquee.style.animationDuration = Math.round(group.scrollWidth / 60) + 's';
  }

  $('#year').textContent = new Date().getFullYear();
})();
