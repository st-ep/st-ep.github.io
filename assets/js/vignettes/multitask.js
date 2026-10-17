/* Boats, Many Winds: after Monet's regattas at Argenteuil. A sunlit river basin with four small sailboats,
   each heeled and trimmed to its own wind, for "Neural Operators for Multi-Task Control and Adaptation".
   Still layers are painted once in a 600-unit-wide design space (composed at 600 x 400, hung at 4:3 by lowering the
   horizon and spreading the water); frame(t) blits them and adds a cheap live layer:
   wobbling reflections, glints on the water, boats that bob and breathe, clouds that drift and loop. */
(function () {
'use strict';
window.Vignettes = window.Vignettes || {};
const PI = Math.PI;
const mb = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const cl = (v, a, b) => v < a ? a : v > b ? b : v, lp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hs = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
const vn = (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return lp(lp(hs(i, j), hs(i + 1, j), a), lp(hs(i, j + 1), hs(i + 1, j + 1), a), b); };
const fb = (x, y) => .65 * vn(x, y) + .35 * vn(x * 2.7 + 5, y * 2.7 + 9);
const sp = s => s.split(' ').map(v => '#' + v);
const hx = h => { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const rgb = c => 'rgb(' + (cl(c[0], 0, 255) | 0) + ',' + (cl(c[1], 0, 255) | 0) + ',' + (cl(c[2], 0, 255) | 0) + ')';

/* One dab: a short tapered, slightly bent brush stroke centred at (x,y), angle a, length l, width w. */
function B(c, x, y, a, l, w, col, al, bd) {
  const ca = Math.cos(a), sa = Math.sin(a), h = l / 2, nx = -sa, ny = ca, q = w / 2, b = (bd || 0) * l;
  const tx = x - ca * h, ty = y - sa * h, ex = x + ca * h, ey = y + sa * h, mx = x + nx * b, my = y + ny * b;
  c.globalAlpha = al; c.fillStyle = col; c.beginPath(); c.moveTo(tx + nx * q, ty + ny * q);
  c.quadraticCurveTo(mx + nx * q * 1.4, my + ny * q * 1.4, ex - ca * q * .3, ey - sa * q * .3);
  c.quadraticCurveTo(mx - nx * q * 1.4, my - ny * q * 1.4, tx - nx * q, ty - ny * q);
  c.quadraticCurveTo(tx - ca * q * 1.3, ty - sa * q * 1.3, tx + nx * q, ty + ny * q); c.fill();
}
function Ln(c, pts, w, col, al) { c.globalAlpha = al; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
const qp = (A, K, C, t) => { const u = 1 - t; return [u * u * A[0] + 2 * u * t * K[0] + t * t * C[0], u * u * A[1] + 2 * u * t * K[1] + t * t * C[1]]; };
/* Control point that bows the segment PQ away from point O by a fraction of its length. */
const bow = (P, Q, O, k) => { const mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, dx = Q[0] - P[0], dy = Q[1] - P[1], L = Math.hypot(dx, dy) || 1; let nx = -dy / L, ny = dx / L; if (nx * (mx - O[0]) + ny * (my - O[1]) < 0) { nx = -nx; ny = -ny; } return [mx + nx * k * L, my + ny * k * L]; };

const P = {
  sky: sp('6F9FD4 7DA8D9 8BB4DE 9AC0E3 AACBE8 BAD5EC CADEEF'), skw: sp('F1E7CF EEDDD0 F4E5C6 E9D9D6 DCE4EC'),
  cl: sp('FBF5E6 F7EEDC FFF8EA F4ECE0'), cs: sp('D2CCDD C6C8DF DAD0D9 BFC3DC'), cm: sp('EFE6E4 E8E0E6 F2EAE0'),
  hz: sp('9AA8CC 8E9CC8 A7A6CF B7AACB A9B4D2'),
  gl: sp('B9C46A C2C26A A8BE62 D2C46A 9DBA62'), gm: sp('7FA35A 6E9A56 86A062 94A866 72925A'), gs: sp('4E7E62 4A6E7A 5E6E96 6E7FA0 56708A 4E6A6A'),
  pl: sp('9DB866 A8BE6E B5C27A 92B262'), pm: sp('6E9466 5E8A5E 7A9A6A 5E865A'), ps: sp('4E6E6E 56708A 5E6E96 4A6A62 627A9A'),
  bk: sp('C9C25E D9C35A E2C866 B9C46A D9A855 E8C88A'),
  wh: sp('FFF8EA FBF3E0 FFF6DA'), wl: sp('F4E6CC F0DFC0 F6EAD2 EDD8B6 F2E2C6'), wm: sp('E6DCD6 E2D9DC EADFD4'),
  wv: sp('D2CADE CCC6DE D8CEDC'), ws: sp('BDB6D6 C4BED8 B0AED4 B8B4D6'), wd: sp('A4A2CE 9EA0CC AAA4D0 9C9ECA'),
  roof: sp('C8553D D9663F E07A50 CC5E3E'), roofS: sp('9A4A4E 8A5A6E A0545A'), wall: sp('F4E6D8 F2E2CC F7EEDF EFDCC8'), wallS: sp('C4BED8 B8B4D6 C6B8D0')
};

/* The four boats. Positions are the waterline centre in the 600 x 400 scene (WY and YO carry them into a taller window);
   heel in degrees (+ leans right). At 4:3 the mid boat's sail still cuts the far bank and the big sail clears it. */
const BOATS = [
  { x: 92, y: 198, L: 42, dir: 1, heel: -14, mh: 1.32, mpos: .12, boom: .58, lift: .14, belly: .12, jib: 0, lit: 1, seed: 101, pen: -.25 },
  { x: 511, y: 191, L: 35, dir: -1, heel: 18, mh: 1.26, mpos: .1, boom: .74, lift: .05, belly: .16, jib: .72, lit: 0, seed: 102, pen: PI + .2 },
  { x: 391, y: 226.5, L: 60, dir: -1, heel: 5, mh: 1.36, mpos: .1, boom: .62, lift: .1, belly: .1, jib: .8, lit: 1, seed: 103, pen: -1.0, stripe: '#C8553D' },
  { x: 205, y: 311, L: 104, dir: 1, heel: -9, jibLit: 0, mh: 1.36, mpos: .15, boom: .56, lift: .15, belly: .11, jib: .8, lit: 1, seed: 104, pen: PI - .5, stripe: '#3E6B3A', fig: 1 }
];
const WL = 161, LX = -.62, LY = -.78;
/* Tree crowns along the far bank; their tops make the treeline. */
const CR = []; { const r0 = mb(777); for (let x = -40; x < 650;) { const r = 5 + r0() * 8, hill = 9 * Math.exp(-(((x - 165) / 50) ** 2)) + 8 * Math.exp(-(((x - 326) / 30) ** 2)) + 8 * Math.exp(-(((x - 600) / 45) ** 2)); CR.push([x, 148 - r0() * 9 - hill, r]); x += r * (.7 + r0() * .8); } }
const TTA = new Float32Array(700); for (let i = 0; i < 700; i++) { const x = i - 40; let m = 150; for (const [cx, cy, r] of CR) { const dx = x - cx; if (dx * dx < r * r) m = Math.min(m, cy - Math.sqrt(r * r - dx * dx) * .8); } TTA[i] = m + (vn(x * .3, 7.7) - .5) * 2.6; }
const TT = x => { const u = cl(x + 40, 0, 698), i = Math.floor(u); return lp(TTA[i], TTA[i + 1], u - i); };
const HL = x => 147 - 8 * fb(x * .009 + 4, 1.7);
const PO = [[14, 108, 5.5], [29, 97, 7], [45, 111, 5], [287, 114, 5], [300, 104, 6.5], [409, 99, 5.5], [421, 89, 7], [436, 85, 7.5], [447, 96, 6], [463, 91, 6.5], [482, 105, 5.5], [537, 110, 5], [550, 100, 6.5], [563, 113, 5]];
const CLOUDS = [[150, 40, 50, 17, 9, 1.05], [420, 25, 38, 13, 7, 1.45], [578, 60, 22, 8, 5, 1.25], [300, 63, 28, 8, 5, .9]];

function build(cv) {
  const W = Math.max(1, cv.clientWidth || 520), H = Math.max(1, cv.clientHeight || Math.round(W * .75));
  const dp = Math.min(2, window.devicePixelRatio || 1), CW = Math.max(1, Math.round(W * dp)), CH = Math.max(1, Math.round(H * dp));
  cv.width = CW; cv.height = CH;
  const X = cv.getContext('2d'), DS = CW / 600, VH = CH / DS;
  /* The scene was composed for a 600 x 400 window. A taller window (4:3 gives 600 x 450) lowers the horizon by YO so the
     sky keeps about 40% of the height, and the water below the horizon stretches by WS so boats and depth fill it. */
  const YO = Math.max(0, (VH - 400) * .45), WB = VH - YO, WS = (WB - WL) / (400 - WL), WY = y => WL + (y - WL) * WS, YP = YO * DS;
  const Z = 1 + .3 * cl((520 - W) / 300, 0, 1), NQ = 1 / (Z * Z);
  let R = mb(1); const sd = n => { R = mb(n * 7919 + 13); }, rr = (a, b) => a + (b - a) * R(), pk = a => a[Math.floor(R() * a.length)];
  const b = (c, x, y, a, l, w, col, al, bd) => B(c, x, y, a, l * Z, w * Z, col, al, bd);
  const mkL = (x0, y0, x1, y1) => { const o = document.createElement('canvas'); o.width = Math.max(1, Math.ceil((x1 - x0) * DS)); o.height = Math.max(1, Math.ceil((y1 - y0) * DS)); const c = o.getContext('2d'); c.setTransform(DS, 0, 0, DS, -x0 * DS, -y0 * DS); c.lineCap = 'round'; c.lineJoin = 'round'; return { o, c, ox: x0, oy: y0 }; };

  const mkI = (x0, y0, x1, y1) => { const ox = Math.floor(x0 * DS), oy = Math.floor(y0 * DS), o = document.createElement('canvas'); o.width = Math.max(1, Math.ceil(x1 * DS) - ox); o.height = Math.max(1, Math.ceil(y1 * DS) - oy); const c = o.getContext('2d'); c.setTransform(DS, 0, 0, DS, -ox, -oy); c.lineCap = 'round'; c.lineJoin = 'round'; return { o, c, ox, oy }; };
  /* Background: sky, far bank and water, painted with a horizontal margin so wobbling strips never show an edge. */
  const MP = Math.ceil(8 * DS), BG = document.createElement('canvas'); BG.width = CW + 2 * MP; BG.height = CH;
  const G = BG.getContext('2d'); G.setTransform(DS, 0, 0, DS, MP, YP); G.lineCap = 'round'; G.lineJoin = 'round';
  const XL = -MP / DS, XR = 600 + MP / DS;

  function sky(c) {
    sd(11); c.globalAlpha = 1; c.fillStyle = '#EFE3C8'; c.fillRect(XL, -YO - 2, XR - XL, VH + 4);
    const g = c.createLinearGradient(0, -YO, 0, WL); g.addColorStop(0, '#7BA7DA'); g.addColorStop(.55, '#A6C6E8'); g.addColorStop(1, '#EADFCC');
    c.globalAlpha = .86; c.fillStyle = g; c.fillRect(XL, -YO - 2, XR - XL, WL + YO + 3);
    const n = Math.round(2500 * NQ * (WL + YO + 5) / (WL + 5));
    for (let i = 0; i < n; i++) {
      const x = rr(XL, XR), y = rr(-YO - 4, WL + 1), t = cl((y + YO) / (WL + YO), 0, 1);
      const col = R() < cl((t - .64) * 2.2, 0, .85) ? pk(P.skw) : P.sky[Math.floor(cl(t * .95 + (fb(x * .012, y * .025) - .5) * .32 + rr(-.07, .07), 0, .999) * P.sky.length)];
      b(c, x, y, -.3 + (fb(x * .008 + 2, y * .016) - .5) * 1.1 + rr(-.22, .22) + t * .2, rr(8, 15) * (1.15 - t * .4), rr(2.8, 4.6) * (1.1 - t * .35), col, rr(.45, .62), rr(-.08, .08));
    }
    for (let i = 0; i < 36; i++) b(c, rr(0, 600), rr(8 - YO * .6, 62), -.12 + rr(-.05, .05), rr(14, 26), rr(1.4, 2.2), pk(sp('F4ECE0 EEE4E8 F7EEDC')), rr(.16, .28), rr(-.1, .1));
  }
  function haze(c) {
    sd(21); const n = Math.round(1300 * NQ);
    for (let i = 0; i < n; i++) { const x = rr(XL, XR), y = rr(132, WL); if (y < HL(x)) continue; b(c, x, y, rr(-.15, .15), rr(3, 6), rr(1.3, 2), pk(P.hz), rr(.55, .85)); }
  }
  function poplars(c) {
    sd(41);
    for (const [cx, top, w] of PO) {
      const base = 156, h = base - top, n = Math.round(h * w * 1.7 * NQ), wf = y => { const p = cl((y - top) / h, 0, 1); return w * Math.pow(p, .45) * (1 - .32 * p * p) + .5; };
      c.globalAlpha = .7; c.fillStyle = '#6A8A78'; c.beginPath();
      for (let y = top + 3; y <= base; y += 2) c.lineTo(cx - wf(y) * .75 + (vn(y * .2, cx) - .5) * 1.5, y);
      for (let y = base; y >= top + 3; y -= 2) c.lineTo(cx + wf(y) * .75 + (vn(y * .2, cx + 9) - .5) * 1.5, y);
      c.fill();
      for (let i = 0; i < n; i++) {
        const y = rr(top - 1, base), ww = wf(y), s = rr(-1.15, 1.15), x = cx + s * ww + (vn(y * .15, cx * .1) - .5) * 2.4;
        const lt = -s * .5 + (1 - (y - top) / h) * .2 + rr(-.3, .3) + (fb(x * .2, y * .08) - .5) * .6;
        const col = lt > .38 ? pk(P.pl) : lt > .02 ? pk(P.pm) : lt > -.3 ? pk(P.ps) : pk(P.hz);
        b(c, x, y, PI / 2 + rr(-.35, .35) + s * .2, rr(3, 6.5), rr(1.5, 2.6), col, Math.abs(s) > 1 ? rr(.4, .6) : rr(.75, .92), rr(-.12, .12));
      }
    }
  }
  function trees(c) {
    sd(51);
    c.globalAlpha = .92; c.fillStyle = '#607A6A'; c.beginPath(); c.moveTo(XL, WL + .5);
    for (let x = XL; x <= XR + 2; x += 2) c.lineTo(x, TT(x) + 2.5); c.lineTo(XR + 2, WL + .5); c.fill();
    const near = (x, y) => { let best = null, bd = 1e9; for (const cr of CR) { const dx = x - cr[0]; if (dx > 25 || dx < -25) continue; const dy = (y - cr[1]) * 1.2, e = (dx * dx + dy * dy) / (cr[2] * cr[2]); if (e < bd) { bd = e; best = cr; } } return best; };
    const n = Math.round(3400 * NQ);
    for (let i = 0; i < n; i++) {
      const x = rr(XL, XR), tp = TT(x), y = rr(tp - 1.2, WL), cr = near(x, y), r = cr ? cr[2] : 8;
      const ux = cr ? (x - cr[0]) / r : 0, uy = cr ? cl((y - cr[1]) / (r * .8), -1.2, 1.6) : .5, dep = cl((y - tp) / (WL - tp + 1), 0, 1);
      const lt = .55 * (ux * LX + uy * LY) + (fb(x * .05 + 3, y * .09) - .5) * .9 + .1 - dep * .45 + rr(-.22, .22);
      const col = lt > .42 ? pk(P.gl) : lt > .02 ? pk(P.gm) : lt > -.36 ? pk(P.gs) : pk(sp('56608E 5E6696 4E5E86'));
      b(c, x, y, -1 + rr(-.8, .8), rr(2.6, 5.2), rr(1.5, 2.5), col, y < tp + .8 ? rr(.5, .7) : rr(.75, .92), rr(-.18, .18));
    }
    for (let i = 0; i < 160 * NQ; i++) { const x = rr(XL, XR), y = WL - rr(0, 5); b(c, x, y, rr(-.2, .2), rr(4, 8), rr(1.6, 2.4), pk(sp('4A6E7A 5E6E96 56708A 4E5E86')), rr(.5, .75)); }
  }
  function plane(c, pts, base, n, fn) {
    c.save(); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.globalAlpha = 1; c.fillStyle = base; c.fill(); c.clip();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let i = 0; i < n; i++) fn(rr(x0 - 1, x1 + 1), rr(y0 - 1, y1 + 1));
    c.restore();
  }
  function house(c) {
    sd(61);
    plane(c, [[316, 147], [338, 147], [338, 160.5], [316, 160.5]], '#EEDCC8', 70, (x, y) => b(c, x, y, PI / 2 + rr(-.2, .2), rr(2.5, 4.5), rr(1.4, 2), R() < .15 ? '#E9C9B0' : pk(P.wall), .92));
    plane(c, [[338, 147], [345, 145.6], [345, 159.6], [338, 160.5]], '#C2BAD6', 26, (x, y) => b(c, x, y, PI / 2 + rr(-.2, .2), rr(2.5, 4), rr(1.4, 2), pk(P.wallS), .9));
    plane(c, [[323.5, 130.5], [326.8, 130.5], [326.8, 138], [323.5, 138]], '#B9503E', 6, (x, y) => b(c, x, y, PI / 2, 2.4, 1.4, pk(P.roofS.concat(P.roof)), .9));
    plane(c, [[312.5, 147.6], [341.5, 147.6], [335, 135.6], [319.5, 135.6]], '#D0603F', 80, (x, y) => b(c, x, y, rr(-.25, .25), rr(2.6, 4.5), rr(1.3, 1.9), R() < .12 ? '#E89A6A' : y > 145.5 && R() < .5 ? pk(P.roofS) : pk(P.roof), .92));
    plane(c, [[341.5, 147.6], [347.8, 145.8], [342, 135.2], [335, 135.6]], '#8E5262', 30, (x, y) => b(c, x, y, rr(-.6, .2), rr(2.4, 4), rr(1.3, 1.8), pk(P.roofS), .9));
    Ln(c, [[312.8, 147.9], [341.6, 147.9]], .8, '#7A5A7A', .5);
    for (const x of [320.4, 326.4, 332.4]) b(c, x, 151, PI / 2, 2.6, 1.7, pk(sp('8A94B4 949CBA 8690B2')), .7);
    b(c, 320.4, 156.4, PI / 2, 2.6, 1.7, '#8A94B4', .65); b(c, 332.6, 157.6, PI / 2, 4.4, 2.1, '#9A7A86', .7);
    plane(c, [[292, 153.4], [307, 153.4], [307, 160.6], [292, 160.6]], '#EBCDB8', 26, (x, y) => b(c, x, y, PI / 2 + rr(-.2, .2), rr(2.4, 3.6), rr(1.3, 1.8), pk(sp('EBC9B4 F2DED2 E6C2B0')), .9));
    plane(c, [[290.6, 153.8], [308.6, 153.8], [305, 149.8], [294.2, 149.8]], '#8E9CC8', 18, (x, y) => b(c, x, y, rr(-.2, .2), rr(2.4, 3.6), rr(1.2, 1.7), pk(sp('8E9CC8 9AA8CC 7F93C4 A7A6CF')), .9));
    b(c, 302.5, 157.4, PI / 2, 4, 2.2, '#7A7EAE', .75);
  }
  function bank(c) {
    sd(71); const n = Math.round(1300 * NQ);
    for (let i = 0; i < n; i++) {
      const x = rr(XL, XR), f = fb(x * .022 + 2, 5.5), th = 1.2 + 2.6 * ss(.35, .8, f), y = WL + .4 - rr(0, th);
      if (f < .3 || (x > 312 && x < 348 && y < 160.5) || (x > 290 && x < 309 && y < 160.6)) continue;
      const u = (WL - y) / th, col = R() < .14 ? pk(sp('F2E2C6 EADBB8 F4E8D4')) : u > .55 && R() < .5 ? pk(P.gl) : R() < .3 ? pk(P.gm) : pk(P.bk);
      b(c, x, y, rr(-.15, .15), rr(3, 6.5), rr(1.2, 2), col, rr(.7, .9));
    }
    for (let x = XL; x < XR; x += rr(3, 6)) b(c, x, WL + .5, rr(-.05, .05), rr(4, 8), 1.1, pk(sp('4A6E7A 5E6E96 3E6B5A 6E7FA0')), .7);
  }
  /* A small moored rowboat near the far bank: a warm accent whose reflection sways with the band. */
  function rowboat(c) {
    sd(75); const x0 = 462, y0 = 166.5, L = 15;
    c.save(); c.beginPath(); c.moveTo(x0 - L / 2, y0 - 2.2); c.quadraticCurveTo(x0, y0 - 1.4, x0 + L / 2, y0 - 2.8); c.quadraticCurveTo(x0 + L * .42, y0, x0 + L * .3, y0); c.lineTo(x0 - L * .38, y0); c.closePath();
    c.globalAlpha = 1; c.fillStyle = '#C0603E'; c.fill(); c.clip();
    for (let i = 0; i < 26; i++) b(c, x0 + rr(-L / 2, L / 2), y0 - rr(0, 2.8), rr(-.1, .1), rr(2.4, 4), rr(1, 1.5), R() < .3 ? pk(P.roofS) : pk(sp('C8553D D9663F E07A50')), .9);
    c.restore(); Ln(c, [[x0 - L / 2, y0 - 2.1], [x0 + L / 2, y0 - 2.7]], .7, '#F2D9B0', .8);
    for (let i = 0; i < 16; i++) { const yy = y0 + rr(.6, 7); b(c, x0 + rr(-.4, .4) * L + rr(-1, 1), yy, rr(-.05, .05), rr(2.5, 5), rr(.9, 1.4), pk(sp('B9604A A8604E C87050 9A5A5E')), .75 - (yy - y0) * .07); }
  }
  function water(c, D) {
    sd(81);
    const smp = (x, y) => { const px = cl(Math.round(MP + x * DS), 0, D.width - 1), py = cl(Math.round(y * DS + YP), 0, D.height - 1), i = (py * D.width + px) * 4; return [D.data[i], D.data[i + 1], D.data[i + 2]]; };
    const g = c.createLinearGradient(0, WL, 0, WB); g.addColorStop(0, '#4E7F86'); g.addColorStop(.3, '#5285B4'); g.addColorStop(1, '#3E6CA2');
    c.globalAlpha = .9; c.fillStyle = g; c.fillRect(XL, WL - .5, XR - XL, VH - WL + 3);
    const TE = hx('#4A8A8E'), BL = hx('#3F7AB8'), DE = hx('#2F5C9C'), TU = hx('#3E9A9A'), VI = hx('#5A5EAA'), LI = hx('#C8DDEE'), DK = hx('#2C5486'), SKT = hx('#86AED8');
    for (let y = WL + .6; y < WB + 4;) {
      const d = cl((y - WL) / (WB - WL), 0, 1), dy = lp(1.1, 4.2, Math.pow(d, 1.1));
      for (let x = XL - rr(0, 10); x < XR;) {
        const l = lp(4, 24, Math.pow(d, 1.15)) * rr(.6, 1.4), w = lp(1.3, 5.4, d) * rr(.8, 1.2), yy = y + rr(-.3, .3) * dy;
        const sx = x + rr(-.3, .3) * l, ys = WL - (yy - WL) / 1.12 + rr(-1, 1) * (.5 + d * 3);
        let base = mix(mix(TE, BL, ss(0, .3, d)), DE, ss(.45, 1, d) * .6); const n = fb(x * .011 + 7, yy * .028);
        if (n > .56) base = mix(base, TU, Math.min(.6, (n - .56) * 1.6)); else if (n < .38) base = mix(base, VI, (.38 - n) * 1.1);
        let col = ys > -YO ? mix(smp(sx, ys), base, cl(lp(.32, .8, ss(0, .7, d)) + rr(-.08, .08), 0, 1)) : mix(SKT, base, .6);
        col = [col[0] * .94, col[1] * .95, col[2] * .98];
        const rp = vn(x * .03 + 3, yy * .2), ck = lp(1.4, 2, d); if (rp > .68) col = mix(col, LI, Math.min(.7, (rp - .68) * ck)); else if (rp < .32) col = mix(col, DK, Math.min(.6, (.32 - rp) * ck * 1.1));
        b(c, x, yy, rr(-.04, .04), l, w, rgb(col), rr(.82, .95), rr(-.08, .08));
        x += l * rr(.5, .85);
      }
      y += dy;
    }
    sd(83);
    for (const [yc, sp2, n] of [[184, 5, 14], [214, 6, 16], [262, 8, 16], [330, 10, 14]]) for (let i = 0; i < n; i++) {
      const y = WY(yc + rr(-sp2, sp2)), d = cl((y - WL) / (WB - WL), 0, 1);
      b(c, rr(-10, 610), y, rr(-.02, .02), lp(10, 42, d) * rr(.6, 1.2), lp(.8, 2.4, d), pk(sp('DCE8F0 EEF3F2 CFE2F0 F4ECE0')), rr(.3, .55), rr(-.05, .05));
    }
    for (let i = 0; i < 40; i++) { const y = rr(WL + 8, WB), d = cl((y - WL) / (WB - WL), 0, 1), x = rr(0, 600); if (R() > 1.15 - x / 600) continue; b(c, x, y, rr(-.03, .03), lp(3, 14, d) * rr(.7, 1.3), lp(1, 3, d), pk(sp('F4E2BC F6E8C8 F2D9A8')), rr(.3, .5)); }
  }
  function glow(c) {
    c.save(); c.setTransform(DS, 0, 0, DS, MP, YP); c.globalCompositeOperation = 'soft-light';
    const g = c.createRadialGradient(80, 30, 10, 80, 30, 600); g.addColorStop(0, 'rgba(255,212,145,.55)'); g.addColorStop(.6, 'rgba(255,214,150,.22)'); g.addColorStop(1, 'rgba(255,214,150,0)');
    c.globalAlpha = .8; c.fillStyle = g; c.fillRect(XL, -YO, XR - XL, VH); c.restore();
  }

  sky(G); haze(G); poplars(G); trees(G); house(G); bank(G);
  const top = G.getImageData(0, 0, BG.width, Math.min(CH, Math.ceil((WL + 2) * DS + YP)));
  water(G, top); rowboat(G); glow(G);

  /* Clouds: small sprites that drift and wrap off-screen. */
  const CLD = CLOUDS.map(([cx, cy, rx, ry, np, v], k) => {
    const s = mkL(-rx - 12, cy - ry * 1.9 - 8, rx + 12, cy + ry + 8), c = s.c; sd(91 + k);
    const pf = [], yb = cy + ry * .45;
    for (let i = 0; i < np; i++) { const u = lp(-1, 1, i / (np - 1)) + rr(-.09, .09), r = ry * rr(.45, .82) * (1.2 - u * u * .62) * (1 + .18 * Math.sin(u * 2.3 + k)); pf.push([u * rx, yb - r * rr(.55, .85) - (1 - u * u) * ry * .25, r]); }
    c.save(); c.filter = 'blur(' + (2.2 * DS) + 'px)'; c.globalAlpha = .8; c.fillStyle = '#E2DCE6'; for (const [x, y, r] of pf) { c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
    c.globalAlpha = .55; c.fillStyle = '#FFF6E4'; for (const [x, y, r] of pf) { c.beginPath(); c.arc(x - r * .22, y - r * .3, r * .72, 0, 7); c.fill(); }
    c.globalAlpha = .5; c.fillStyle = '#C3BFD8'; c.beginPath(); c.ellipse(rx * .08, yb - ry * .12, rx * .9, ry * .2, 0, 0, 7); c.fill(); c.restore();
    for (const [px, py, r] of pf) for (let k2 = 0; k2 < r * 1.6; k2++) {
      const q = rr(-PI, PI), rd = r * Math.sqrt(R()) * .95, x = px + Math.cos(q) * rd, y = py + Math.sin(q) * rd; if (y > yb + 2) continue;
      const lt = (Math.cos(q) * LX * .7 + Math.sin(q) * LY) * rd / r - (y - py + r) / (yb - py + r + 1) * .45 + .3 + rr(-.2, .2);
      let ta = (q + PI / 2) % PI; if (ta > PI / 2) ta -= PI;
      b(c, x, y, ta * .5 + rr(-.15, .15), rr(5, 10), rr(2.2, 3.4), lt > .35 ? pk(P.cl) : lt < -.05 ? pk(P.cs) : pk(P.cm), rr(.45, .7));
    }
    return { s, x0: cx, v: v, m: rx + 14, py: Math.round((s.oy + YO * .5) * DS) };
  });

  /* Boats: a rig sprite (heel baked in, rocked live about the mast foot), a hull sprite, and a broken reflection. */
  const BS = BOATS.map(bt => {
    sd(bt.seed);
    const L = bt.L, d = bt.dir, th = bt.heel * PI / 180, sz = .42 + .58 * L / 104;
    const hsf = v => L * (.07 + .1 * v * v + .024 * v);
    const foot = [d * bt.mpos * L, -hsf(bt.mpos)], md = [Math.sin(th), -Math.cos(th)], Hm = bt.mh * L;
    const at = s => [foot[0] + md[0] * s, foot[1] + md[1] * s];
    const pa = [-d * Math.cos(th), -d * Math.sin(th)], ga = d * bt.lift, bd = [pa[0] * Math.cos(ga) - pa[1] * Math.sin(ga), pa[0] * Math.sin(ga) + pa[1] * Math.cos(ga)];
    const MT = at(Hm), Hd = at(Hm * .96), Tk = at(L * .07), Ck = [Tk[0] + bd[0] * bt.boom * L, Tk[1] + bd[1] * bt.boom * L];
    const lc = bow(Hd, Ck, Tk, bt.belly), fc = bow(Tk, Ck, Hd, .035);
    const bowTop = [d * .47 * L, -hsf(.47)], Jh = at(Hm * (bt.jib || .5)), Jc = [foot[0] + d * .12 * L, foot[1] - .07 * L];
    const jl = bow(Jh, Jc, bowTop, .12), jf = bow(bowTop, Jc, Jh, .05);
    const pts = [MT, Hd, Tk, Ck, lc, foot].concat(bt.jib ? [Jh, bowTop, Jc, jl] : []);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const rig = mkL(x0 - 4, y0 - 4, x1 + 4, y1 + 4), rc = rig.c, ang = Math.atan2(md[1], md[0]);
    const triA = (A, T, C) => Math.abs((T[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (T[1] - A[1])) / 2;
    /* A sail: luff A to T (straight), foot T to C and leech C to A (curved), with a slightly irregular hand-drawn outline. */
    function sail(A, T, C, fk, lk, lit) {
      const O = [], seg = (P0, K, P1, n, amp, sd2) => { for (let i = 0; i < n; i++) { const t = i / n, p0 = K ? qp(P0, K, P1, t) : [lp(P0[0], P1[0], t), lp(P0[1], P1[1], t)], p1 = K ? qp(P0, K, P1, t + .01) : P1, dx = p1[0] - p0[0], dy = p1[1] - p0[1], l = Math.hypot(dx, dy) || 1, w = (vn(t * n * .45 + sd2, bt.seed) - .5) * 2 * amp * Math.sin(PI * t); O.push([p0[0] - dy / l * w, p0[1] + dx / l * w]); } };
      seg(A, null, T, 14, .25 * sz, 1); seg(T, fk, C, 12, .45 * sz, 7); seg(C, lk, A, 18, .55 * sz, 13);
      rc.save(); rc.beginPath(); O.forEach((p, i) => i ? rc.lineTo(p[0], p[1]) : rc.moveTo(p[0], p[1])); rc.closePath();
      rc.globalAlpha = 1; rc.fillStyle = lit ? '#EADFD2' : '#BEB6D4'; rc.fill(); rc.clip();
      const cx = (A[0] + T[0] + C[0]) / 3, cy = (A[1] + T[1] + C[1]) / 3, n = Math.round(triA(A, T, C) * .2 / (sz * sz) * NQ) + 24;
      for (let i = 0; i < n; i++) {
        let u = R(), v = R(); if (u + v > 1) { u = 1 - u; v = 1 - v; } const wc = 1 - u - v;
        const x = cx + (u * A[0] + v * T[0] + wc * C[0] - cx) * 1.2, y = cy + (u * A[1] + v * T[1] + wc * C[1] - cy) * 1.2, nz = fb(x * .06 + 3, y * .035) - .5;
        let col;
        if (lit) {
          const k = .66 + .2 * u - .3 * wc - .22 * Math.pow(v, 3) + nz * .32 + rr(-.08, .08);
          col = k > .72 ? (R() < .55 ? pk(P.wh) : pk(P.wl)) : k > .53 ? pk(P.wl) : k > .41 ? (R() < .3 ? '#DCE4EC' : pk(P.wm)) : k > .28 ? pk(P.wv) : pk(P.ws);
          if (wc > .62 && R() < .1) col = pk(sp('F2D9A8 F6E2B4 EFD3A0'));
        } else {
          const k = .32 + .18 * u - .12 * wc + nz * .3 + rr(-.1, .1);
          col = k > .42 ? pk(P.wv) : k > .26 ? pk(P.ws) : pk(P.wd);
          if (v < .1 && R() < .45) col = pk(sp('F2D9A8 F6E2B4 EBC98A'));
        }
        b(rc, x, y, ang + rr(-.08, .08), rr(5, 10) * sz, rr(1.8, 2.8) * sz, col, rr(.8, .92), rr(-.06, .06));
      }
      rc.restore();
      const E = O.slice(26).concat([O[0]]);
      Ln(rc, E, Math.max(.7, .9 * sz), lit ? '#FFF8EA' : '#F6E2B4', lit ? .65 : .8);
      return O;
    }
    sail(Hd, Tk, Ck, fc, lc, bt.lit);
    { const F = []; for (let i = 0; i <= 10; i++) F.push(qp(Tk, fc, Ck, i / 10)); Ln(rc, F, Math.max(.6, .8 * sz), bt.lit ? '#A9A2CC' : '#8E86B4', .55); }
    Ln(rc, [Tk, Ck], Math.max(.8, 1.3 * sz), '#86708E', .9);
    Ln(rc, [foot, MT], Math.max(.9, 1.55 * sz), '#7A6890', .92);
    Ln(rc, [[foot[0] - .35 * sz, foot[1]], [MT[0] - .35 * sz, MT[1]]], Math.max(.4, .6 * sz), '#D9A880', .6);
    if (bt.jib) {
      Ln(rc, [Jh, bowTop], Math.max(.5, .6 * sz), '#8E86B4', .55);
      sail(Jh, bowTop, Jc, jf, jl, bt.jibLit === undefined ? bt.lit : bt.jibLit);
    }

    const hb = mkI(-.54 * L, -hsf(.5) - (bt.fig ? .17 * L : .02 * L) - 1.5, .54 * L, .07 * L + 1.5), hc = hb.c;
    if (bt.fig) {
      const fx = d * -.27 * L, fy = -hsf(-.27);
      b(hc, fx, fy - .055 * L, PI / 2, .13 * L, .055 * L, '#45549A', .95); b(hc, fx - .012 * L, fy - .06 * L, PI / 2, .1 * L, .02 * L, '#6A7AB8', .8);
      b(hc, fx, fy - .118 * L, 0, .03 * L, .028 * L, '#E0A07A', .95); b(hc, fx, fy - .133 * L, rr(-.1, .1), .072 * L, .022 * L, '#E8C65A', .95); b(hc, fx - .006 * L, fy - .136 * L, 0, .04 * L, .01 * L, '#F6E6B0', .9);
    }
    hc.save(); hc.beginPath();
    for (let i = 0; i <= 20; i++) { const v = -.5 + i / 20; hc.lineTo(d * v * L, -hsf(v)); }
    for (let i = 1; i <= 6; i++) { const s = i / 6, v = .5 - .1 * s * s; hc.lineTo(d * v * L, -hsf(.5) * (1 - s)); }
    hc.lineTo(d * -.47 * L, 0); hc.closePath(); hc.globalAlpha = 1; hc.fillStyle = '#DCD3DA'; hc.fill(); hc.clip();
    for (let i = 0, n = Math.round(L * L * .06 / (sz * sz) * NQ) + 40; i < n; i++) {
      const x = rr(-.52 * L, .52 * L), v = cl(x * d / L, -.5, .5), h = hsf(v), y = rr(-h - 1, .6), f = cl(-y / h, 0, 1);
      const lt = .18 + .78 * f + rr(-.12, .12) + (v > .38 ? -.1 : 0) + (v < -.46 ? -.12 : 0) + (fb(x * .1, y * .3) - .5) * .2;
      const col = f < .16 && R() < .55 ? pk(sp('8FB4C4 9CC0D0 86A8C8')) : lt > .74 ? pk(P.wh) : lt > .56 ? pk(P.wl) : lt > .4 ? pk(P.wm) : lt > .26 ? pk(P.wv) : pk(P.ws);
      b(hc, x, y, Math.atan(-d * (.2 * v + .024)) * f, rr(4, 8) * sz, rr(1.3, 2.1) * sz, col, rr(.85, .95));
    }
    hc.restore();
    { const E = [], S2 = []; for (let i = 0; i <= 20; i++) { const v = -.5 + i / 20; E.push([d * v * L, -hsf(v) + .3 * sz]); S2.push([d * v * L, -hsf(v) * .78]); }
      Ln(hc, E, Math.max(.6, .85 * sz), '#FFF8EA', .85); if (bt.stripe) Ln(hc, S2, Math.max(.5, .75 * sz), bt.stripe, .8); }
    for (let i = 0, n = Math.round(L * .5); i < n; i++) b(hc, rr(-.47, .4) * L * d, rr(.2, .045 * L + .6), rr(-.03, .03), rr(.08, .16) * L, rr(.8, 1.5) * sz, pk(sp('4A5290 565A9A 3E5A8A 5E6AA6')), rr(.5, .78));
    for (let i = 0, n = Math.round(L * .25); i < n; i++) b(hc, rr(-.5, .42) * L * d, rr(-.5, .3), rr(-.03, .03), rr(.05, .1) * L, rr(.7, 1.1) * sz, pk(sp('4F80B8 5A8EC0 6A9AC4')), rr(.45, .7));

    /* Reflection: horizontal broken dabs sampled from the mirrored boat, longer and bluer with depth. */
    const q = 2, bx0 = Math.min(x0, -.54 * L) - 2, bx1 = Math.max(x1, .54 * L) + 2, by0 = y0 - 2;
    const tw = Math.ceil((bx1 - bx0) * q), th2 = Math.ceil((1 - by0) * q), tmp = document.createElement('canvas'); tmp.width = tw; tmp.height = th2;
    const tc = tmp.getContext('2d');
    tc.drawImage(rig.o, (rig.ox - bx0) * q, (rig.oy - by0) * q, rig.o.width / DS * q, rig.o.height / DS * q);
    tc.drawImage(hb.o, (hb.ox / DS - bx0) * q, (hb.oy / DS - by0) * q, hb.o.width / DS * q, hb.o.height / DS * q);
    const TD = tc.getImageData(0, 0, tw, th2).data;
    const smp = (x, y) => { const px = Math.round((x - bx0) * q), py = Math.round((y - by0) * q); if (px < 0 || py < 0 || px >= tw || py >= th2) return null; const i = (py * tw + px) * 4; return TD[i + 3] < 110 ? null : [TD[i], TD[i + 1], TD[i + 2]]; };
    const ST = 1.14, Hr = -by0 * ST + 4, rf = mkL(bx0 - 6, 0, bx1 + 6, Hr), WT = hx('#5285B4');
    for (let yr = .3; yr < Hr;) {
      const f = yr / Hr, dy = lp(.9, 2.1, f) * lp(.8, 1, sz);
      for (let x = bx0; x < bx1;) {
        const l = lp(2.8, 7, f) * rr(.75, 1.8) * sz, jx = rr(-1, 1) * (.7 + yr * .06), s = smp(x + jx * .5, -yr / ST);
        if (s && R() > .2 + .34 * f) b(rf.c, x + jx, yr + rr(-.25, .25) * dy, rr(-.05, .05), l, dy * rr(.85, 1.15), rgb(mix(s, WT, cl(.14 + .42 * f + rr(-.05, .05), 0, 1))), (.9 - .35 * f) * rr(.85, 1), rr(-.1, .1));
        x += l * rr(.45, .75);
      }
      yr += dy;
    }
    { const hf = -foot[1]; for (let yr = hf * ST; yr < Hm * ST + hf * ST;) { const s = yr / ST - hf, x = foot[0] + md[0] * s + Math.sin(yr * .7) * (.4 + yr * .02), f = yr / Hr; if (R() > .25 + .3 * f) b(rf.c, x, yr, rr(-.2, .2), rr(1.6, 2.8) * sz, Math.max(.8, 1.2 * sz), rgb(mix(hx('#6E5F8E'), WT, .2 + .4 * f)), .75 - .3 * f); yr += rr(1.4, 2.6) * sz; } }
    const strips = []; for (let ya = 0, hh = 2; ya < Hr; ya += hh, hh = Math.min(8, hh * 1.14)) strips.push([ya, Math.min(Hr, ya + hh), hs(strips.length, bt.seed) - .5]);
    /* Pose strip: the rig rocked and its sail filled along one gust parameter s in [-1, 1], cached once,
       so each frame is two integer blits cross-faded instead of a filtered rotation. */
    const K = 13, AR = .036, ABr = .045, BB = .2 + .006 * L;
    const poseT = (sk, x, y) => { let px = x - foot[0], py = y - foot[1]; const c1 = Math.cos(-th), s1 = Math.sin(-th); let qx = px * c1 - py * s1, qy = px * s1 + py * c1; qx *= 1 + ABr * sk; const c2 = Math.cos(th + AR * sk), s2 = Math.sin(th + AR * sk); return [foot[0] + qx * c2 - qy * s2, foot[1] + qx * s2 + qy * c2]; };
    let ex0 = 1e9, ex1 = -1e9, ey0 = 1e9, ey1 = -1e9;
    for (const sk of [-1, 0, 1]) for (const [x, y] of pts) { const [u, v] = poseT(sk, x, y); ex0 = Math.min(ex0, u); ex1 = Math.max(ex1, u); ey0 = Math.min(ey0, v); ey1 = Math.max(ey1, v); }
    const pox = Math.floor((ex0 - 2.5) * DS), poy = Math.floor((ey0 - 2.5 - BB) * DS), pw = Math.ceil((ex1 + 2.5) * DS) - pox, ph = Math.ceil((ey1 + 2 + BB) * DS) - poy;
    const PS = document.createElement('canvas'); PS.width = pw * K; PS.height = ph; const pc = PS.getContext('2d');
    for (let k = 0; k < K; k++) {
      const sk = -1 + 2 * k / (K - 1);
      pc.setTransform(DS, 0, 0, DS, k * pw - pox, -poy);
      pc.save(); pc.beginPath(); pc.rect(pox / DS, poy / DS, pw / DS, ph / DS); pc.clip(); pc.translate(foot[0], foot[1] + BB * sk); pc.rotate(AR * sk); pc.rotate(th); pc.scale(1 + ABr * sk, 1); pc.rotate(-th); pc.translate(-foot[0], -foot[1]);
      pc.drawImage(rig.o, rig.ox, rig.oy, rig.o.width / DS, rig.o.height / DS); pc.restore();
    }
    /* The hull rides the same gust parameter, dipping slightly as the rig heels. */
    const hw = hb.o.width, hh = hb.o.height + Math.ceil(2 * BB * DS) + 2, hoy = hb.oy - Math.ceil(BB * DS) - 1, HS = document.createElement('canvas'); HS.width = hw * K; HS.height = hh;
    const hsc = HS.getContext('2d'); for (let k = 0; k < K; k++) hsc.drawImage(hb.o, k * hw, hb.oy - hoy + BB * (-1 + 2 * k / (K - 1)) * DS);
    sd(bt.seed + 50);
    return { bt, OY: Math.round((WY(bt.y) + YO) * DS), L, d, th, sz, foot, MT, rf, strips, Hr, hf: -foot[1], PS, pox, poy, pw, ph, K, AR, BB, HS, hw, hh, hox: hb.ox, hoy, w1: rr(.8, 1.2), w2: rr(.55, .8), p: [rr(0, 6.3), rr(0, 6.3), rr(0, 6.3), rr(0, 6.3), rr(0, 6.3), rr(0, 6.3), rr(0, 6.3), rr(0, 6.3)] };
  });

  /* Glints: small dabs on the water whose alpha breathes in and out slowly, each on its own phase. */
  const GC = sp('CFE2F0 DCEAF2 BFD8EC EEF3F2 F8EED4 F4E2BC FFF6DA 3F5F9E 4A5A9A 5A6AAA');
  sd(301);
  const GL = []; for (let i = 0; i < 3000 && GL.length < 150; i++) {
    const y = rr(WL + 3, WB), d = cl((y - WL) / (WB - WL), 0, 1), x = rr(-5, 605);
    if (fb(x * .018 + 11, y * .09) < .5 + rr(-.08, .08)) continue;
    const r = R(), ci = r < .42 ? Math.floor(R() * 4) : r < .58 ? 4 + Math.floor(R() * 3) : 7 + Math.floor(R() * 3);
    GL.push([x, y + YO, lp(3, 18, Math.pow(d, 1.2)) * rr(.7, 1.3) * Z, lp(.7, 2.2, d) * rr(.8, 1.2) * Z, ci, rr(.35, .65) * (ci > 6 ? .9 : 1), rr(.45, 1.2), rr(0, 6.3), lp(.5, 3, d), rr(.25, .6), rr(0, 6.3)]);
  }
  /* Band of the far-bank reflection, re-blitted in strips with a slow horizontal sway. */
  const BAND = []; for (let y = WL + .6; y < WL + 76; y += 3.6) { const p0 = Math.round(y * DS + YP), p1 = Math.round((y + 3.6) * DS + YP); BAND.push([p0, p1 - p0, .5 + .016 * (y - WL), y, hs(BAND.length, 7) - .5]); }
  const BT0 = BAND[0][0], BT1 = BAND[BAND.length - 1][0] + BAND[BAND.length - 1][1];

  function frame(t) {
    X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
    X.drawImage(BG, MP, 0, CW, BT0, 0, 0, CW, BT0); if (CH > BT1) X.drawImage(BG, MP, BT1, CW, CH - BT1, 0, BT1, CW, CH - BT1);
    for (const k of CLD) { const span = 600 + 2 * k.m, x = ((k.x0 + k.v * t + k.m) % span + span) % span - k.m; X.drawImage(k.s.o, Math.round((x + k.s.ox) * DS), k.py); }
    for (const [p0, ph, a, y, r] of BAND) { const off = a * (.62 * Math.sin(1.07 * t + y * .31) + .38 * Math.sin(.71 * t - y * .19 + 1.3)); X.drawImage(BG, MP - Math.round(off * DS + r), p0, CW, ph, 0, p0, CW, ph); }
    const live = BS.map(B2 => { const p = B2.p, t1 = B2.w1 * t, t2 = B2.w2 * t, bt = B2.bt;
      const s = (Math.sin(t2 + p[2]) + .35 * Math.sin(2.31 * t2 + p[3]) + .25 * Math.sin(1.37 * t1 + p[0])) / 1.6;
      return { s, del: B2.AR * s, bob: B2.BB * s, OX: Math.round(bt.x * DS), OY: B2.OY }; });
    BS.forEach((B2, i) => {
      const lv = live[i], rf = B2.rf, bt = B2.bt, oy = lv.OY, ph0 = B2.p[7];
      for (const [ya, yb, r] of B2.strips) {
        const p0 = Math.round(ya * DS), p1 = Math.round(yb * DS); if (p1 <= p0 || oy + p0 > CH) continue;
        const dd = (ya + yb) / 2, off = Math.max(0, dd / 1.14 - B2.hf) * lv.del + (.4 + .022 * dd) * (.65 * Math.sin(1.3 * t - dd * .45 + ph0) + .35 * Math.sin(.83 * t + dd * .29 + ph0 * 1.7));
        X.drawImage(rf.o, 0, p0, rf.o.width, p1 - p0, lv.OX + Math.round(rf.ox * DS) + Math.round(off * DS + r), oy + p0, rf.o.width, p1 - p0);
      }
    });
    for (const g of GL) {
      const f = Math.sin(g[6] * t + g[7]); if (f <= .02) continue;
      B(X, (g[0] + g[8] * Math.sin(g[9] * t + g[10])) * DS, g[1] * DS, 0, g[2] * DS, g[3] * DS, GC[g[4]], g[5] * f * Math.sqrt(f), 0);
    }
    BS.forEach((B2, i) => {
      const lv = live[i], bt = B2.bt, f = B2.foot, L = B2.L, p = B2.p, u = (lv.s + 1) / 2 * (B2.K - 1), k = Math.min(B2.K - 2, Math.max(0, Math.floor(u))), fr = cl(u - k, 0, 1);
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
      X.drawImage(B2.PS, k * B2.pw, 0, B2.pw, B2.ph, lv.OX + B2.pox, lv.OY + B2.poy, B2.pw, B2.ph);
      if (fr > .004) { X.globalAlpha = fr; X.drawImage(B2.PS, (k + 1) * B2.pw, 0, B2.pw, B2.ph, lv.OX + B2.pox, lv.OY + B2.poy, B2.pw, B2.ph); }
      const wx = lv.OX / DS, wy = lv.OY / DS + lv.bob, ca = Math.cos(lv.del), sa = Math.sin(lv.del), vx = B2.MT[0] - f[0], vy = B2.MT[1] - f[1];
      const mx = wx + f[0] + ca * vx - sa * vy, my = wy + f[1] + sa * vx + ca * vy;
      const pa = bt.pen + .16 * Math.sin(2.2 * t + p[1]) + .07 * Math.sin(5.3 * t + p[2]), pl = Math.max(4, .11 * L) * Z, pw = Math.max(1.5, .03 * L) * Z, bend = .1 * Math.sin(4.1 * t + p[3]);
      X.setTransform(DS, 0, 0, DS, 0, 0);
      B(X, mx + Math.cos(pa) * pl * .5, my + Math.sin(pa) * pl * .5 + pw * .3, pa, pl, pw, '#C8553D', .95, bend);
      B(X, mx + Math.cos(pa) * pl * .4, my + Math.sin(pa) * pl * .4, pa, pl * .55, pw * .4, '#E8865A', .8, bend);
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(B2.HS, k * B2.hw, 0, B2.hw, B2.hh, lv.OX + B2.hox, lv.OY + B2.hoy, B2.hw, B2.hh);
      if (fr > .004) { X.globalAlpha = fr; X.drawImage(B2.HS, (k + 1) * B2.hw, 0, B2.hw, B2.hh, lv.OX + B2.hox, lv.OY + B2.hoy, B2.hw, B2.hh); }
      X.setTransform(DS, 0, 0, DS, 0, 0);
      for (let j = 0; j < 3; j++) { const a = Math.sin(1.7 * t + j * 2.1 + p[4]); if (a > 0) B(X, wx + B2.d * (.4 + .04 * j) * L, wy + .3 + .4 * j * B2.sz, 0, (1.5 + 2 * B2.sz) * Z, .9 * Z * Math.max(.8, B2.sz), '#FFF8EA', .75 * a); }
    });
    X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  }
  return frame;
}

window.Vignettes.multitask = {
  title: 'Boats, Many Winds',
  aspect: 4 / 3,
  create: function (canvas) {
    let fr = build(canvas);
    return { frame: function (t) { fr(t); }, resize: function () { fr = build(canvas); } };
  }
};
})();
