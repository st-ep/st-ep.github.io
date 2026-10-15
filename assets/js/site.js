/* Page behaviour: brush marks, the portrait underpainting, videos that play when seen, the live nav. */
(function () {
  document.documentElement.classList.remove('no-js');
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var PALETTES = {
    wheat: ['#E8C27A', '#D9A85B', '#F1D597', '#C98F4E', '#B7A0C8'],
    meadow: ['#8DB35A', '#6E9A4A', '#B9C46A', '#9DBB62', '#D9C25A'],
    sea: ['#8FB6D9', '#A9C8E4', '#6E93C2', '#B9D4EA', '#9DB4DC'],
    poppy: ['#C8553D', '#D9744F', '#E8A06A', '#B9A9C4', '#F1C27A'],
    violet: ['#A99BBB', '#B9A9C4', '#8E86B0', '#C4B6CC', '#E8C27A']
  };

  /* A short cluster of broken-colour strokes under each heading. */
  function brush(cv, i) {
    var dp = Math.min(2, window.devicePixelRatio || 1), w = 132, h = 16;
    cv.width = w * dp; cv.height = h * dp;
    var c = cv.getContext('2d'), R = rng(97 + i * 31), pal = PALETTES[cv.dataset.p] || PALETTES.wheat;
    c.setTransform(dp, 0, 0, dp, 0, 0); c.lineCap = 'round';
    var strokes = [];
    for (var k = 0; k < 26; k++) {
      var x = 4 + R() * (w - 18), y = 4 + R() * 8 + (x / w) * 2;
      strokes.push({ x: x, y: y, l: 7 + R() * 9, a: (R() - .5) * .35 - .06, w: 2.6 + R() * 1.6, c: pal[Math.floor(R() * pal.length)] });
    }
    strokes.sort(function (a, b) { return a.x - b.x; });
    function paint(n) {
      c.clearRect(0, 0, w, h);
      for (var j = 0; j < n; j++) {
        var s = strokes[j], ex = Math.cos(s.a) * s.l / 2, ey = Math.sin(s.a) * s.l / 2;
        c.globalAlpha = .9; c.strokeStyle = s.c; c.lineWidth = s.w;
        c.beginPath(); c.moveTo(s.x - ex, s.y - ey); c.lineTo(s.x + ex, s.y + ey); c.stroke();
      }
    }
    if (still) { paint(strokes.length); return; }
    paint(0);
    cv._reveal = function () {
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var f = Math.min(1, (ts - t0) / 700);
        paint(Math.round(strokes.length * f));
        if (f < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
  }

  /* Until the portrait arrives: a warm underpainting on the canvas, the way a study begins. */
  function underpainting(cv) {
    var box = cv.parentNode, dp = Math.min(2, window.devicePixelRatio || 1);
    var w = box.clientWidth || 220, h = box.clientHeight || 275;
    cv.width = w * dp; cv.height = h * dp;
    var c = cv.getContext('2d'), R = rng(2026);
    c.setTransform(dp, 0, 0, dp, 0, 0); c.lineCap = 'round';
    c.fillStyle = '#F2E6CC'; c.fillRect(0, 0, w, h);
    var warm = ['#E9D2A6', '#E3C795', '#EFDDB8', '#DCC9A6', '#E6D5B8', '#D8C2A0'];
    for (var i = 0; i < 900; i++) {
      var x = R() * w, y = R() * h, a = -0.6 + (R() - .5) * .5, l = 8 + R() * 14;
      c.globalAlpha = .55; c.strokeStyle = warm[Math.floor(R() * warm.length)]; c.lineWidth = 3 + R() * 2;
      c.beginPath(); c.moveTo(x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2); c.lineTo(x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2); c.stroke();
    }
    /* a loose sienna sketch of head and shoulders */
    c.globalAlpha = .38; c.strokeStyle = '#A9744F'; c.lineWidth = 1.4;
    var cx = w * .5, cy = h * .4;
    c.beginPath(); c.ellipse(cx, cy, w * .16, h * .16, 0, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(cx - w * .07, cy + h * .15); c.lineTo(cx - w * .08, cy + h * .24);
    c.quadraticCurveTo(cx - w * .36, cy + h * .29, cx - w * .45, h); c.stroke();
    c.beginPath(); c.moveTo(cx + w * .07, cy + h * .15); c.lineTo(cx + w * .08, cy + h * .24);
    c.quadraticCurveTo(cx + w * .36, cy + h * .29, cx + w * .45, h); c.stroke();
    c.globalAlpha = .18; c.fillStyle = '#B9A9C4';
    c.beginPath(); c.ellipse(cx + w * .05, cy + h * .02, w * .12, h * .13, 0, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1;
  }

  var brushes = document.querySelectorAll('canvas.brush');
  for (var i = 0; i < brushes.length; i++) brush(brushes[i], i);
  var up = document.getElementById('underpainting');
  if (up) underpainting(up);

  /* Reveal sections gently as they arrive. */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        var b = e.target.querySelector('canvas.brush');
        if (b && b._reveal) { b._reveal(); b._reveal = null; }
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  /* Robot videos play only while on screen. */
  var vids = document.querySelectorAll('video[data-auto]');
  if (still) {
    vids.forEach(function (v) { v.controls = true; });
  } else if ('IntersectionObserver' in window) {
    vids.forEach(function (v) { v.controls = false; });
    var vo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () { v.controls = true; }); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vo.observe(v); });
  }

  /* Underline the section in view. */
  var links = document.querySelectorAll('.topbar li a');
  var secs = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var current = null, ticking = false;
  function mark() {
    ticking = false;
    var y = window.scrollY, doc = document.documentElement, pick = null;
    if (secs.length && secs[0].getBoundingClientRect().top <= innerHeight * 0.45) {
      if (innerHeight + y >= doc.scrollHeight - 2) pick = secs[secs.length - 1];
      else secs.forEach(function (sec) { if (sec.getBoundingClientRect().top <= innerHeight * 0.45) pick = sec; });
    }
    var id = pick ? pick.id : null;
    if (id === current) return;
    current = id;
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('on', on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        var ul = a.closest('ul');
        if (ul && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: a.getBoundingClientRect().left - ul.getBoundingClientRect().left + ul.scrollLeft - 24, behavior: still ? 'auto' : 'smooth' });
      } else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  window.addEventListener('resize', mark);
  mark();

  /* On a phone the cliff is too small to read, so the CV opens as text beneath it. */
  var cvText = document.querySelector('details.cv-text');
  if (cvText && window.matchMedia && matchMedia('(max-width: 600px)').matches) cvText.open = true;

  /* The paintings start after the page's first paint, each on its own so one failure cannot stop the other. */
  var hero = document.getElementById('riviera'), strata = document.getElementById('strata');
  requestAnimationFrame(function () {
    setTimeout(function () {
      try { if (hero && window.Riviera) window.Riviera.mount(hero); }
      catch (e) { hero.classList.add('poster-only'); }
      try { if (strata && window.Strata) window.Strata.mount(strata); }
      catch (e) { strata.hidden = true; if (cvText) cvText.open = true; }
    }, 0);
  });
})();
