/* Publications gallery: the five live paintings share one loop. Each is painted when it nears the screen,
   one per frame so the page never stalls, and only those in view keep moving. */
(function () {
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cs = document.querySelectorAll('canvas[data-vignette]');
  if (!cs.length || !window.Vignettes) return;

  var items = [], queue = [], raf = 0, clock = 0, last = null, pumping = false;
  for (var i = 0; i < cs.length; i++) items.push({ cv: cs[i], key: cs[i].getAttribute('data-vignette'), inst: null, vis: false, queued: false, w: 0 });

  function make(it) {
    var v = window.Vignettes[it.key];
    if (!v) return;
    try { it.inst = v.create(it.cv); it.w = it.cv.clientWidth; it.inst.frame(still ? 6 : clock); }
    catch (e) { it.inst = null; }
  }
  function pump() {
    var it = queue.shift();
    if (!it) { pumping = false; start(); return; }
    make(it);
    setTimeout(pump, 24);
  }
  function enqueue(it) {
    if (it.queued) return;
    it.queued = true; queue.push(it);
    if (!pumping) { pumping = true; setTimeout(pump, 0); }
  }

  function loop(ts) {
    raf = 0;
    if (last !== null) clock += Math.min(0.1, (ts - last) / 1000);
    last = ts;
    var any = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.vis && it.inst) { it.inst.frame(clock); any = true; }
    }
    if (any) start();
  }
  function start() {
    if (still || raf || document.hidden) return;
    for (var i = 0; i < items.length; i++) if (items[i].vis && items[i].inst) { raf = requestAnimationFrame(loop); return; }
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }

  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { enqueue(find(e.target)); near.unobserve(e.target); } });
    }, { rootMargin: '600px 0px' });
    var seen = new IntersectionObserver(function (es) {
      es.forEach(function (e) { find(e.target).vis = e.isIntersecting; });
      start();
    }, { rootMargin: '40px 0px' });
    items.forEach(function (it) { near.observe(it.cv); seen.observe(it.cv); });
  } else {
    items.forEach(function (it) { it.vis = true; enqueue(it); });
  }
  function find(cv) { for (var i = 0; i < items.length; i++) if (items[i].cv === cv) return items[i]; }

  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      items.forEach(function (it) {
        if (it.inst && Math.abs(it.cv.clientWidth - it.w) > 1) {
          it.w = it.cv.clientWidth;
          try { it.inst.resize(); it.inst.frame(still ? 6 : clock); } catch (e) {}
        }
      });
    }, 200);
  });
})();
