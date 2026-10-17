/* Water and Honey (Physically Viable World Models).
   The sunlit garden table of the FORM study, with two plain tumblers on the linen, both two thirds full: water at the
   left, a step nearer, honey at the right. Two identical ivory balls appear on their marks, the same distance from each
   glass, and start rolling at the same instant at the same speed; they strike both glasses together and both glasses
   tip over onto their sides the same way. Then the outcomes part: the water surges to the lip as the glass goes over,
   gushes out, bursts into a fan of droplets on landing and races away as a thin glinting sheet that soaks into the cloth;
   the honey stays pressed against the closed base, slumps slowly into one gentle slope down to the lip, and comes out as
   a thick glossy tongue that folds onto itself in an S and merges into a low lobed pool whose edge keeps creeping.
   A soft one second cross-fade restores the standing glasses for the next 12 s loop.
   Contract: window.Vignettes.pvwm = { title, aspect, create(canvas) -> { frame(t), resize() } }.
   Everything is painted once into offscreen layers in a 400 x 300 design frame; frame(t) composites them with a small
   live layer: the turning glasses and the liquid inside them, the gush and splash, the spreading sheet, the honey rope
   and pool, the balls, the drifting leaf light and the glints on the sea. */
(function () {
'use strict';
const PI = Math.PI, TAU = 2 * PI, UW = 400, UH = 300, T = 12;
const mb = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const cl = (v, a, b) => v < a ? a : v > b ? b : v, lp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const s5 = x => { x = cl(x, 0, 1); return x * x * x * (x * (x * 6 - 15) + 10); };
const hs = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
const vn = (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return lp(lp(hs(i, j), hs(i + 1, j), a), lp(hs(i, j + 1), hs(i + 1, j + 1), a), b); };
const fb = (x, y) => .62 * vn(x, y) + .38 * vn(x * 2.3 + 5.1, y * 2.3 + 9.7);
const sp = s => s.split(' ').map(v => '#' + v);
const ip = (P, x) => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; };
const sq = v => v * v;
const pk2 = (k, a) => a[k % a.length];

/* During the cross-fade each state's live layers are drawn at a share GA of their own opacity. */
let GA = 1;
/* A tapered leaf of paint, the same stroke as the hero. */
function B(c, x, y, a, l, w, col, al, bd) { const ca = Math.cos(a), sa = Math.sin(a), h = l / 2, nx = -sa, ny = ca, q = w / 2, b = (bd || 0) * l, tx = x - ca * h, ty = y - sa * h, hx = x + ca * h, hy = y + sa * h, mx = x + nx * b, my = y + ny * b; c.globalAlpha = al * GA; c.fillStyle = col; c.beginPath(); c.moveTo(tx + nx * q, ty + ny * q); c.quadraticCurveTo(mx + nx * q * 1.4, my + ny * q * 1.4, hx - ca * q * .3, hy - sa * q * .3); c.quadraticCurveTo(mx - nx * q * 1.4, my - ny * q * 1.4, tx - nx * q, ty - ny * q); c.quadraticCurveTo(tx - ca * q * 1.3, ty - sa * q * 1.3, tx + nx * q, ty + ny * q); c.fill(); }
function D(c, x, y, a, l, w, col, al) { const dx = Math.cos(a) * l / 2, dy = Math.sin(a) * l / 2; c.globalAlpha = al * GA; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x - dx, y - dy); c.lineTo(x + dx, y + dy); c.stroke(); }

const C = {
  sky: sp('9EC2E4 A9C9E7 B5D1EB C3DAEE CFE1F0'), skw: sp('F1E7CF EEDDD0 F4E5C6 E9D9D6'),
  cpl: sp('E2C3C6 EBCDBE D8BACC E4CCC4'), cps: sp('A59CC8 9A98C6 B0A2CC 9C9ECA'),
  sf: sp('8FB0DA 9DB4DC A9B8DA 7FA5D6'), sm: sp('4A74B6 5680C0 6187C6 3F69AE 7092CC 5A7EC0'), sn: sp('4FA0B8 62B2BE 5E9FC0'), sl: sp('8C8ACB 9A9AD0 7E8EC8'),
  gl: sp('A9B866 B9BE6A 9DB45E C4BE6C B2C470 D2C062'), gm: sp('6E9A4A 7FA34E 5E8A4A 6E8A5A 7E9A56'), gs: sp('3E6B5A 4A6E7A 4E7E6A 5E6E96 4E5A84 3E5A72'), gd: sp('2F4E46 355A5E 3A4E6A 2F4A52 3E4A70'),
  fr: sp('D8553A E2643F C8453A EE7A52'), fp: sp('F2A0A8 E8A0B4 F4B8B8 EBA0C0'), fw: sp('F6EEE6 FBF3E2 F2EAE8'),
  wl: sp('D9966C E0A47E C98A62 E8B088'), wm: sp('B97A5E A86E5A B4785C'), ws: sp('8A6A7E 7A6890 866E8E'),
  cl: sp('F6E8CC F4E4C4 F8ECD4 F2E0BE FBF0D8'), ch: sp('FFF4D4 FFF8E4 FBEECC'), cm: sp('E8DCD4 E6DCD6 EADFD4 E2D6DA'), cs: sp('C4BED8 BDB6D6 B0AED4 C8C0DA'), cd: sp('A4A2CE 9C9ECA A9A2CC'),
  sh: sp('9A86B4 8A8FC0 A286AE 7E86B8 9B92C2'), she: sp('B4A8D0 B8AED4 BCB2D6'), shd: sp('7E76B0 7A70A8 8478B4'),
  dap: sp('A8A0D2 B0A8D8 A49ED0 B4AAD6'), spk: sp('F4E9C9 EEF3F2 F8EED4 DDEBF2'), flk: sp('D6C35A C9C25E E2CC70 BFC468'),
  /* water: pale aqua where it gathers the light, cobalt and violet where it turns away, white glints */
  wA: sp('D4EEEA C4E6E2 CFEAE6 DDF2EE'), wB: sp('A8D4DC 9FCFD0 8FC4D0 B4DCE6'), wC: sp('6A9EC8 5E8FB8 7A9CCC 5A86B8'), wV: sp('8A8ACB 7E86C0 9A92CC'), wG: sp('8FBFA8 9CC4A8 86B8A4'),
  aqB: sp('A6E6E6 BDF0EE 92DADF CFF4F2 B0EAEA'),
  /* honey: cream gold in the light, gold and amber in its body, burnt sienna in the depths */
  hH: sp('FFF2C0 FFF6D2 FCE8A8'), hG: sp('F6C24C F8D068 F2BA44 F4C858'), hA: sp('E8A034 E09430 EAA83C E49C36'), hO: sp('D07A24 C8701E D4822A CC7626'),
  hR: sp('B4561E A8501E B85E28 AC5424'), hS: sp('9C4A1E A4501E 94441C AA5624'), hT: sp('F7B04A F9BC5A F4A844 FAC066'),
  /* the same honey in value bands, deep to light, each band broken in hue (redder, yellower) at one value */
  hv: ['9C4A1E A4521C 964224 A8501E', 'BE6422 C66C1E B86028 C2682A', 'D88A2C DE9230 D2842E E09034', 'E9A63A EEAC38 E4A040 ECA846', 'F2BC4A F6C450 EEB64C F4C058', 'F8D070 FAD67C F6CC6A FCDC88'].map(sp),
  /* water in value bands, cobalt violet to the palest aqua */
  wv: ['6A86C0 7280C2 6490BC 7A7CC0', '7FA4CE 86A8D2 78A0CC 8C9ED0', '9CC4D8 A2C8DC 96C0D6 A0BEDC', 'B4DCE0 BCE0E2 AED8DE B8DCE6', 'CDEAE8 D4EEEA C8E8E6 D2ECEE', 'E6F6F2 F0FAF6 E2F4F4'].map(sp),
  /* ivory balls */
  iH: sp('FFFBEA FFF8E4 FDF4DC'), iL: sp('F6EEDC F4EAD4 F8F0E0'), iM: sp('E8DCCB E4D8CC EADFCF E2D8D4'), iS: sp('C8BCD8 C0B6D6 CCC2DA'), iD: sp('A8A0CC A49ED0 ACA2CE'), iR: sp('EED8B8 F0DCC0 EAD4B4'),
  /* glass, and the colours it picks up: sky, hedge, violet shade, warm linen */
  gE: sp('A8B8CC 9FB0C8 B4C0D4'), gD: sp('6E86A8 7A8EC0 5E7FA0 6A7AB0'), gW: sp('FFFFFF FFF8EA F4F8FA'),
  gRs: sp('CFE4F4 C2DCF0 DAEAF6 BCD6EE'), gRg: sp('A2BE84 94B476 AEC690 88AA70'), gRg2: sp('6E9A70 7AA27A 628E6A'), gRv: sp('A49ED2 9A94CC B0A8D8 9290C8'), gRw: sp('F8EACC F4E2C2 FBF0D8'),
  /* the spilt water on the linen: sky and aqua while it runs, a cooler blue violet once it has soaked in */
  sk: sp('C4DAF0 B4D0EA D0E2F2 C8DEF0'), aq: sp('B4DCE0 C2E4E4 A8D6DC'), wt: sp('B8B4D6 C4BED8 BCB8DA'),
  stn: sp('A4B2DE 9CACDA ACB8E2 98A8D8 A8B0DC'), stt: sp('8C98CE 8892CA 9098D0')
};

/* ---------- scene geometry, in a 400 x 300 unit frame (the garden of the FORM study) ---------- */
const HZ = 40;
const yT = x => 195 + x * .006 + (vn(x * .045, 4.2) - .5) * 1.4;           // back edge of the table
const yC = x => yT(x) + 5 + (vn(x * .06, 9.1) - .5) * 2.2;                  // back hem of the cloth
const xF = y => 232 + 15 * Math.sin(y * .062 + .4) - y * .12 + (vn(y * .09, 2.3) - .5) * 12;  // edge of the left foliage
const yBu = x => 96 - (x - 200) * .06 + (vn(x * .045, 5.5) - .5) * 18 + 6 * Math.sin(x * .05); // top of the lower bushes
const capeH = x => x < 292 ? 0 : ip([[292, 0], [314, 3], [338, 7], [360, 9.5], [382, 8.5], [404, 6]], x) + (vn(x * .12, 1.3) - .5) * 1.2;
/* 0 sky, 1 sea, 2 foliage, 3 wood, 4 cloth, 5 distant cape */
function rg(x, y) { if (y >= yC(x)) return 4; if (y >= yT(x)) return 3; if (x > xF(y) && y < yBu(x)) { if (y < HZ - capeH(x)) return 0; if (y < HZ) return 5; return 1; } return 2; }

/* ---------- the two glasses ----------
   A tumbler in its own frame: u across, w up from the centre of its foot. It widens a little toward the rim. Seen from a
   little above, its rim is an ellipse ET as deep as it is wide, its foot EB. Both glasses tip about the right edge of the
   foot until the right wall lies on the cloth, a little under a quarter turn because the glass widens upward. The water
   glass stands a step nearer than the honey glass, so the water can run out across the front of the cloth while the
   honey pools behind it, and the two read as a pair at nearly the same scale. */
const ET = .24, EB = .3, TI = 2.4;
const GLS = [{ cx: 82, cy: 257, s: 1.38, wat: 1 }, { cx: 220, cy: 247, s: 1.32, wat: 0 }];
const dOf = (g, sn, cs, u, w) => (u - g.rb) * sn - w * cs;
/* the interior cut by the half plane d >= c, where d runs "down" for a surface turned by phi; returns [polygon, chord] */
function clipQ(g, sn, cs, c) { const P = g.Q, out = [], ch = []; for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) & 3], fa = dOf(g, sn, cs, a[0], a[1]) - c, fz = dOf(g, sn, cs, b[0], b[1]) - c;
  if (fa >= 0) out.push(a); if ((fa >= 0) !== (fz >= 0)) { const t = fa / (fa - fz), p = [lp(a[0], b[0], t), lp(a[1], b[1], t)]; out.push(p); ch.push(p); } } return [out, ch]; }
const area = P => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
function level(g, phi, A) { const sn = Math.sin(phi), cs = Math.cos(phi); let lo = 1e9, hi = -1e9; for (const p of g.Q) { const d = dOf(g, sn, cs, p[0], p[1]); lo = Math.min(lo, d); hi = Math.max(hi, d); }
  for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (area(clipQ(g, sn, cs, m)[0]) > A) lo = m; else hi = m; } return (lo + hi) / 2; }
for (const g of GLS) { const s = g.s; g.rb = 13 * s; g.rt = 15.6 * s; g.h = 54 * s; g.wl = 1.4 * s; g.bt = 4.4 * s; g.rbi = g.rb - g.wl; g.rti = g.rt - g.wl; g.px = g.cx + g.rb; g.py = g.cy;
  g.vl = g.bt + (g.h - g.bt) * .66; g.rB = 6.6 * s; g.Q = [[-g.rbi, g.bt], [g.rbi, g.bt], [g.rti, g.h], [-g.rti, g.h]]; g.A0 = area(clipQ(g, 0, 1, -g.vl)[0]); g.Ai = area(g.Q); }
const toS = (g, th, u, w) => { const c = Math.cos(th), s = Math.sin(th); return [g.px + (u - g.rb) * c + w * s, g.py + (u - g.rb) * s - w * c]; };
/* The fall: a rigid tumbler pivoting on its foot. The blow carries it just past the point of balance, where it hesitates,
   then it falls ever faster onto its side and bounces twice, a few degrees. One table serves both glasses, so they fall
   exactly together. */
const TL = Math.atan2(54, 2.6);
const TIP = (() => { const rb = 13, hc = .36 * 54, a0 = Math.atan2(rb, hc), K = 1500 / (1.35 * Math.hypot(rb, hc)), q = .32, w0 = Math.sqrt(2 * K * (1 - Math.cos(a0)) / (1 - q * q));
  const th = [0], dt = 1 / 2000; let a = 0, w = w0, land = -1;
  for (let i = 1; i <= 3200; i++) { w += K * Math.sin(a - a0) * dt; a += w * dt; if (a >= TL) { a = TL; if (land < 0) land = i * dt; w = Math.abs(w) < .7 ? 0 : -.36 * w; } if (i % 8 === 0) th.push(a); }
  return { th, dt: 8 * dt, land }; })();
const thAt = ph => { const x = (ph - TI) / TIP.dt; if (x <= 0) return 0; const i = Math.floor(x); if (i >= TIP.th.length - 1) return TL; return lp(TIP.th[i], TIP.th[i + 1], x - i); };
const TLAND = TI + TIP.land, FADE0 = 10.8;
/* The balls: identical, resting on their marks the same distance from each glass. At TR both start rolling at the same
   instant, gather speed together and meet their glasses at TI, then bounce back a little way. */
const TR = 1.34, BV = 44, BRP = .3, BRB = 9, BRA = 30, BD = BV * (TI - TR - BRP / 2);
const ballC = g => g.cx - g.rb - (g.rt - g.rb) * g.rB / g.h - g.rB;
const ballX = (g, ph) => { const xc = ballC(g);
  if (ph <= TI) { const u = Math.max(0, ph - TR); return xc - BD + (u < BRP ? BV * u * u / (2 * BRP) : BV * (u - BRP / 2)); }
  const tau = Math.min(ph - TI, BRB / BRA); return xc - g.s * (BRB * tau - .5 * BRA * tau * tau); };
/* The water is thrown toward the falling lip as the glass goes over (its surface turns past level), so it reaches the lip
   at about 37 degrees and gushes; when the glass strikes the cloth it surges on out of the mouth, then settles level. */
const SLK = .48;
const phiW = ph => { if (ph <= TI) return 0; const th = thAt(ph); if (ph < TLAND) return th + Math.min(SLK, SLK * th); return th + SLK * Math.exp(-(ph - TLAND) / .12); };
/* The honey hardly moves inside the falling glass: its surface stays square to the glass. Once the glass lies still it
   slumps as a viscous gravity current: a thin-film flow along the glass, h_t = (G h^3 h_x)_x, with no flux through the
   closed base and a free fall over the lip. It stays pressed against the base, its surface slumps from square to the
   axis into one gentle convex slope, reaches the lip after about a second and drains ever more slowly. HSIM keeps the
   profile (the depth as a share of the glass's width, along the glass from base to lip) and the honey let out so far. */
const HN = 28, HDT = .04, HTS = 8.4;
const HSIM = (() => { const N = HN, dx = 1 / N, G = .6, K = 1.4, dts = .0006, spf = Math.round(HDT / dts), H = new Float64Array(N), q = new Float64Array(N + 1), P = [], O = [];
  for (let i = 0; i < N; i++) H[i] = cl((.66 - (i + .5) * dx) / dx + .5, 0, 1);
  let out = 0, t = 0;
  for (let k = 0; k * HDT <= HTS + 1e-9; k++) {
    P.push(Float32Array.from(H)); O.push(out);
    for (let s = 0; s < spf; s++) { const gg = G * ss(0, .3, t);
      for (let i = 1; i < N; i++) { const hm = (H[i - 1] + H[i]) / 2; q[i] = -gg * (hm * hm * hm + 1e-5) * (H[i] - H[i - 1]) / dx; }
      const hN = H[N - 1]; q[N] = gg * hN * hN * hN * hN / (dx / 2) * K;
      for (let i = 0; i < N; i++) H[i] = Math.max(0, H[i] - dts * (q[i + 1] - q[i]) / dx);
      out += dts * q[N]; t += dts; }
  }
  return { P, O }; })();
const HB = new Float32Array(HN);
/* the profile at tau seconds after landing, into HB; returns the honey let out so far */
const hAt = tau => { const x = cl(tau, 0, HTS) / HDT, i = Math.min(HSIM.P.length - 2, Math.floor(x)), f = x - i, a = HSIM.P[i], b = HSIM.P[i + 1]; for (let k = 0; k < HN; k++) HB[k] = a[k] + (b[k] - a[k]) * f; return lp(HSIM.O[i], HSIM.O[i + 1], f); };
const hOutAt = tau => { const x = cl(tau, 0, HTS) / HDT, i = Math.min(HSIM.O.length - 2, Math.floor(x)); return lp(HSIM.O[i], HSIM.O[i + 1], x - i); };
const OS = hOutAt(4.4), OF = hOutAt(FADE0 - TLAND);   // let out by the time the S is laid, and by the end of the hold
const TE = (() => { for (let t = 0; t < HTS; t += .01) if (hOutAt(t) > OF * .004) return TLAND + t; return TLAND + 1; })();   // the honey reaches the lip

function build(cv) {
  const cw = cv.clientWidth || 400, ch = cv.clientHeight || 300, dp = Math.min(2, window.devicePixelRatio || 1);
  const W = cv.width = Math.max(2, Math.round(cw * dp)), H = cv.height = Math.max(2, Math.round(ch * dp));
  const KX = W / UW, KY = H / UH, X = cv.getContext('2d');
  let R = mb(1);
  const sd = n => { R = mb(n * 7919 + 13); }, rr = (a, b) => a + (b - a) * R(), pk = a => a[Math.floor(R() * a.length)];
  const mkb = (x0, y0, x1, y1) => { const ox = Math.floor(x0 * KX), oy = Math.floor(y0 * KY), o = document.createElement('canvas'); o.width = Math.max(1, Math.ceil(x1 * KX) - ox); o.height = Math.max(1, Math.ceil(y1 * KY) - oy); const c = o.getContext('2d'); c.setTransform(KX, 0, 0, KY, -ox, -oy); c.lineCap = 'round'; c.lineJoin = 'round'; return { o, c, ox, oy, w: o.width, h: o.height }; };
  const path = (c, pts) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); };

  /* ---------- light on the foliage: big masses, a shaded hedge foot, sun on the bushes by the sea ---------- */
  const fl = (x, y) => (fb(x * .012 + 3, y * .016) - .5) * 1.7 + .3 * (fb(x * .05, y * .06) - .5) - .12 - .6 * ss(150, 195, y)
    - .3 * Math.exp(-sq((x - 115) / 60) - sq((y - 110) / 90)) + .45 * ss(150, 215, x) * (1 - ss(70, 120, y)) + .35 * ss(210, 270, x) * ss(95, 135, y) * (1 - ss(165, 195, y));

  /* The underpainting: one flat colour per region, painted per pixel at low resolution and enlarged, so it has no seams. */
  function under(c) {
    const uw = Math.max(40, Math.round(W / 8)), uh = Math.max(30, Math.round(H / 8)), o = document.createElement('canvas'); o.width = uw; o.height = uh; const u = o.getContext('2d'), im = u.createImageData(uw, uh), dt = im.data;
    const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)], P = { a: hx('#DCDCE4'), b: hx('#B9D0EA'), c: hx('#C6AFCB'), d: hx('#8CAEDA'), e: hx('#5B84C2'), f: hx('#9FB060'), g: hx('#668A4C'), h: hx('#41665E'), i: hx('#34505A'), j: hx('#C4845E'), k: hx('#E2D6D6'), l: hx('#EEE2CC') };
    for (let py = 0; py < uh; py++) for (let px = 0; px < uw; px++) {
      const cx = (px + .5) * UW / uw, cy = (py + .5) * UH / uh, r = rg(cx, cy), n = fb(cx * .03, cy * .03); let col;
      if (r === 0) col = n > .58 ? P.a : P.b; else if (r === 5) col = P.c; else if (r === 1) col = cy < HZ + 8 ? P.d : P.e;
      else if (r === 2) { const l = fl(cx, cy); col = l > .4 ? P.f : l > .02 ? P.g : l > -.4 ? P.h : P.i; }
      else if (r === 3) col = P.j; else col = n > .62 ? P.k : P.l;
      const q = (py * uw + px) * 4; dt[q] = col[0]; dt[q + 1] = col[1]; dt[q + 2] = col[2]; dt[q + 3] = 255;
    }
    u.putImageData(im, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = .9; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(o, 0, 0, W, H); c.restore();
  }
  function sky(c) {
    sd(11);
    for (let i = 0; i < 900; i++) { const x = rr(200, 404), y = rr(-4, HZ + 1), z = rg(x, y); if (z !== 0 && !(z === 2 && R() < .12)) continue; const t = cl(y / HZ, 0, 1);
      const col = R() < cl((t - .45) * 1.5, 0, .75) ? pk(C.skw) : C.sky[Math.floor(cl(t * .9 + (fb(x * .03, y * .05) - .5) * .5 + rr(-.1, .1), 0, .99) * 5)];
      B(c, x, y, -.22 + rr(-.25, .25), rr(5, 10) * (1.2 - t * .4), rr(2, 3.2), col, rr(.4, .65), rr(-.06, .06)); }
    for (let i = 0; i < 90; i++) { const q = rr(-PI, PI), d = Math.sqrt(R()), x = 336 + Math.cos(q) * d * 30, y = 13 + Math.sin(q) * d * 6; if (rg(x, y) !== 0) continue; const lt = -Math.sin(q) * d - Math.cos(q) * d * .4 + rr(-.3, .3);
      B(c, x, y, rr(-.15, .1), rr(5, 9), rr(2, 3), lt > .1 ? pk(sp('FBF5E6 F7EEDC FFF8EA')) : pk(sp('D8D2E2 CCCBE0 E2DAE0')), rr(.5, .75)); }
  }
  function cape(c) {
    sd(17);
    for (let i = 0; i < 260; i++) { const x = rr(290, 404), y = rr(HZ - 12, HZ); if (rg(x, y) !== 5) continue; const lit = (x < 360 ? .72 : .28) + (fb(x * .08, y * .2) - .5) * .5;
      B(c, x, y, Math.atan((capeH(x - 3) - capeH(x + 3)) / 6) * .7 + rr(-.2, .2), rr(2.5, 6), rr(1.3, 2.3), R() < lit ? pk(C.cpl) : pk(C.cps), rr(.5, .8)); }
    for (let x = 290; x < 404; x += rr(4, 9)) if (rg(x, HZ - .8) === 5) D(c, x, HZ - .6, 0, rr(3, 7), 1.1, pk(sp('8E9CC8 9AA8CC A7A6CF')), .7);
  }
  function sea(c) {
    sd(31);
    for (let i = 0; i < 1500; i++) { const x = rr(196, 404), y = rr(HZ, 132); if (rg(x, y) !== 1) continue; const d = cl((y - HZ) / (yBu(x) - HZ), 0, 1), f = fb(x * .04, y * .12);
      const col = d < .16 ? pk(C.sf) : d > .72 && R() < .5 ? pk(C.sn) : f > .6 && R() < .35 ? pk(C.sl) : pk(C.sm);
      B(c, x, y, rr(-.05, .05), lp(4.5, 12, d) * rr(.6, 1.4), lp(1.3, 2.8, d) * rr(.8, 1.2), col, rr(.55, .85)); }
    for (let x = 200; x < 404; x += rr(4, 9)) if (rg(x, HZ + .8) === 1) D(c, x, HZ + .7, 0, rr(4, 8), 1.1, pk(sp('D9DCEA E6E2EA CFD6EA')), .7);
  }
  function foliage(c) {
    sd(41); const L = [];
    for (let y = -8; y < 200;) { const t = cl(y / 190, 0, 1), st = lp(10, 15, t); for (let x = -8; x < 408; x += st * rr(.75, 1.2)) { const yy = y + rr(-st * .35, st * .35); if (rg(x, yy) !== 2 && rg(x, yy + st * .4) !== 2) continue; L.push([x, yy, st * rr(.7, 1.15), t]); } y += st * .6; }
    for (const [cx, cy, r, t] of L) {
      const ml = fl(cx, cy), n = Math.round(r * r * .17), ga = (vn(cx * .04 + 7, cy * .04) - .5) * 3.4 - .6, sf = lp(.72, 1.35, vn(cx * .07 + 3, cy * .07 + 1));
      for (let k = 0; k < n; k++) {
        const q = R() * TAU, rd = Math.sqrt(R()) * r, x = cx + Math.cos(q) * rd, y = cy + Math.sin(q) * rd * .8;
        if (y > yT(x) + .5) continue; const z = rg(x, y); if (z !== 2 && R() < .75) continue;
        const lt = .55 * (Math.cos(q) * -.62 + Math.sin(q) * -.78) * rd / r + ml + rr(-.2, .2);
        B(c, x, y, ga + rr(-.55, .55), (rr(.45, 1) * r * .7 + 2) * lp(.8, 1.1, t) * sf, rr(2, 3.5) * lp(.85, 1.15, t) * Math.sqrt(sf), lt > .45 ? pk(C.gl) : lt > .02 ? pk(C.gm) : lt > -.42 ? pk(C.gs) : pk(C.gd), rr(.8, .95));
      }
    }
    for (let i = 0; i < 300; i++) { const x = rr(-4, 404), y = yT(x) - 13 * Math.pow(R(), 1.7); B(c, x, y, rr(-.3, .3), rr(4, 8), rr(2, 3), R() < .7 ? pk(C.gd) : pk(C.gs), rr(.6, .85)); }
  }
  function flowers(c) {
    sd(51);
    const F = [[236, 150, 1], [262, 168, 1], [300, 140, 1], [338, 160, 1], [372, 132, 1], [392, 172, 1], [350, 112, 2], [388, 104, 2], [318, 100, 2], [22, 150, 1], [12, 112, 2], [276, 122, 3], [362, 182, 1]];
    for (const [x0, y0, k] of F) { const pal = k === 1 ? C.fr : k === 2 ? C.fp : C.fw, n = k === 3 ? 6 : 9;
      for (let i = 0; i < n; i++) { const x = x0 + rr(-7, 7), y = y0 + rr(-4, 4); if (rg(x, y) !== 2) continue; D(c, x + .6, y + .7, 0, .6, rr(2.2, 3), k === 1 ? '#8E3A5E' : '#9A86B4', .45); D(c, x, y, rr(-.4, .4), rr(.6, 1.6), rr(2, 3), pk(pal), .9); } }
  }
  function wood(c) {
    sd(61);
    for (let i = 0; i < 640; i++) { const x = rr(-6, 406), y = rr(yT(x) - .2, yC(x) + .4), e = (y - yT(x)) / (yC(x) - yT(x)), f = fb(x * .05, 3.1);
      B(c, x, y, .006 + rr(-.03, .03), rr(7, 18), rr(1.6, 2.6), e > .7 && R() < .55 ? pk(C.ws) : f > .55 ? pk(C.wl) : R() < .5 ? pk(C.wl) : pk(C.wm), rr(.6, .85)); }
    for (let i = 0; i < 70; i++) { const x = rr(-2, 404); D(c, x, yT(x) + .45, .006, rr(6, 16), .9, pk(sp('F2C8A0 F6D6B0 EBC096')), rr(.35, .6)); }
  }
  /* cloth light: soft noise, long folds toward a vanishing point, a pressed crease, a cooler band at the back */
  const crY = x => 274 + 2.2 * Math.sin(x * .028 + .7) + (vn(x * .05, 3.7) - .5) * 2;
  const tone = (x, y) => {
    let l = .66 + (fb(x * .022 + 11, y * .06) - .5) * .42 - .14 * (1 - ss(201, 216, y));
    for (const xf of [26, 262, 372]) { const k = (y + 260) / 560, dx = x - (200 + (xf - 200) * k), s = k * 3; l += .12 * Math.exp(-sq(dx / s)) - .3 * Math.exp(-sq((dx - 1.6 * s) / (1.1 * s))); }
    const cy = crY(x); l += .12 * Math.exp(-sq((y - cy + 1.6) / 1.5)) - .26 * Math.exp(-sq((y - cy - 1.8) / 2.1));
    return l;
  };
  function cloth(c) {
    sd(71);
    for (let i = 0; i < 2900; i++) {
      const x = rr(-6, 406), y = rr(196, 304); if (y < yC(x) - .5) continue; const t = cl((y - 200) / 100, 0, 1), l = tone(x, y) + rr(-.08, .08);
      let col = l > .8 ? pk(C.ch) : l > .6 ? pk(C.cl) : l > .46 ? pk(C.cm) : l > .32 ? pk(C.cs) : pk(C.cd);
      const wz = fb(x * .009 + 5, y * .028 + 2);
      if (wz < .4 && l > .5 && l < .8 && R() < .45) col = R() < .5 ? pk(C.cm) : pk(sp('DCD6E4 E0DAE6 D6D4E6')); else if (wz > .6 && l > .6 && R() < .35) col = pk(sp('F8E6BC F6DDB0 FAEAC6'));
      B(c, x, y, (x - 200) * .0004 + rr(-.07, .07), lp(6, 20, t) * rr(.6, 1.3), lp(2.2, 6, t) * rr(.7, 1.2), col, rr(.55, .85), rr(-.06, .06));
    }
    for (let x = -2; x < 404; x += rr(2.5, 6)) D(c, x, yC(x) + .3, .006, rr(3, 6), 1.1, pk(sp('FFF6DA F8EEDA FBF2DE')), .8);
    for (let x = -2; x < 404; x += rr(3, 7)) D(c, x, yC(x) + 1.6, .006, rr(3, 6), 1, pk(C.cs), .45);
  }
  function glow(c) {
    c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .5; const g = c.createRadialGradient(30, 0, 10, 30, 0, 430); g.addColorStop(0, 'rgba(255,214,150,.95)'); g.addColorStop(1, 'rgba(255,214,150,0)'); c.fillStyle = g; c.fillRect(0, 0, UW, UH);
    // afternoon sun pooled on the cloth around the glasses
    c.globalAlpha = .55; c.translate(196, 256); c.scale(1, .42); const g2 = c.createRadialGradient(0, 0, 8, 0, 0, 210); g2.addColorStop(0, 'rgba(255,220,160,.9)'); g2.addColorStop(1, 'rgba(255,220,160,0)'); c.fillStyle = g2; c.fillRect(-400, -700, 800, 1400); c.restore();
  }
  function patch(seed, w, h) {
    const s = mkb(-w / 2 - 2, -h / 2 - 2, w / 2 + 2, h / 2 + 2), c = s.c; sd(seed);
    const blob = (x, y, rx, ry, a) => { c.save(); c.translate(x, y); c.scale(rx, ry); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(0,0,0,' + a + ')'); g.addColorStop(.5, 'rgba(0,0,0,' + a * .8 + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.globalAlpha = 1; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore(); };
    for (let k = 0, n = 4 + Math.floor(R() * 3); k < n; k++) blob(rr(-w * .28, w * .28), rr(-h * .15, h * .15), rr(.18, .3) * w, rr(.32, .48) * h, .85);
    c.globalCompositeOperation = 'destination-out'; for (let k = 0, n = 1 + Math.floor(R() * 3); k < n; k++) { const r = rr(2.5, 5.5); blob(rr(-w * .3, w * .3), rr(-h * .2, h * .2), r, r * .42, .9); }
    c.globalCompositeOperation = 'source-atop'; c.globalAlpha = 1; c.fillStyle = '#ACA4D6'; c.fillRect(-w, -h, 2 * w, 2 * h);
    for (let k = 0, n = w * h * .045; k < n; k++) B(c, rr(-w / 2, w / 2), rr(-h / 2, h / 2), rr(-.08, .08), rr(8, 15), rr(3, 5), pk(C.dap), rr(.4, .7));
    c.globalCompositeOperation = 'source-over'; return s;
  }

  /* ---------- a glass, painted upright in its own frame (x = u, y = -w), empty: walls, rim, foot, reflections ---------- */
  const Rv = (g, w) => g.rb + (g.rt - g.rb) * w / g.h;
  const etan = (a, e) => Math.atan2(e * Math.cos(a), -Math.sin(a));   // the tangent of the ellipse (cos a, e sin a)
  function paintGlass(c, g) {
    sd(g.wat ? 701 : 711); const { rb, rt, h, bt, s } = g, rti = g.rti, rbi = g.rbi;
    const sil = []; for (let k = 0; k <= 20; k++) { const a = k / 20 * PI; sil.push([rb * Math.cos(a), rb * EB * Math.sin(a)]); }
    for (let k = 0; k <= 28; k++) { const a = PI + k / 28 * PI; sil.push([rt * Math.cos(a), -h + rt * ET * Math.sin(a)]); }
    const aw = Math.atan2(-h, rt - rb);   // the direction of the right wall, upward
    c.save(); path(c, sil); c.globalAlpha = 1; c.fillStyle = 'rgba(228,240,242,.12)'; c.fill(); c.clip();
    // a glassy sheen of long, thin, upright strokes
    for (let i = 0; i < 70; i++) { const w = rr(0, h), u = rr(-1, 1) * Rv(g, w); if (!g.wat && w < h * .7 && R() < .8) continue; B(c, u, -w, PI / 2 + rr(-.04, .04), rr(6, 12) * s, rr(1, 1.8) * s, pk(sp('F4F8FA E8F2F6 DCEAF0 FFFBF0 D6EAE6')), rr(.06, .15)); }
    // the far wall, seen through the near one: faint broken cool dabs inside each edge
    for (let i = 0; i < 46; i++) { const w = rr(2 * s, h - 2), r = Rv(g, w), lf = R() < .5; if (vn(w * .2 / s, lf ? 7.7 : 8.8) < .32) continue;
      B(c, lf ? -r + 2.4 * s : r - 2.6 * s, -w, lf ? PI - aw : aw, rr(2, 5) * s, rr(.5, .9) * s, lf ? pk(sp('C2D2DE B8CCDA C6DCCC')) : pk(sp('9EB2CC A6B6D0 A4A0CC')), rr(.18, .34)); }
    c.restore();
    /* The walls, broken into irregular dabs of the colours they reflect: the lit left edge takes the sky high up, the hedge
       in the middle and the warm linen low down; the turned right edge is cobalt and violet with a little hedge green. */
    const lit = f => { const z = R(); if (f > .64) return z < .42 ? '#FFFFFF' : z < .78 ? pk(C.gRs) : pk(C.gRv);
      if (f > .28) return z < .34 ? pk(C.gRg) : z < .6 ? pk(C.gRs) : z < .8 ? '#FFFFFF' : pk(C.gRv);
      return z < .45 ? pk(C.gRw) : z < .72 ? pk(C.gRs) : z < .88 ? pk(C.gRg) : '#FFFFFF'; };
    const shd = () => { const z = R(); return z < .42 ? pk(C.gD) : z < .66 ? pk(C.gRv) : z < .84 ? pk(C.gRg2) : pk(C.gRs); };
    for (let i = 0; i < 48; i++) { const w = rr(.5 * s, h - .6 * s), r = Rv(g, w), k = vn(w * .22 / s, g.wat * 3 + 1.1); if (k < .3 && R() < .8) continue;
      B(c, -r + rr(.35, .85) * s, -w, PI - aw + rr(-.06, .06), rr(2, 7.5) * s, rr(.55, 1.45) * s, lit(w / h), rr(.45, .95) * (.55 + .45 * k)); }
    for (let i = 0; i < 50; i++) { const w = rr(.5 * s, h - .6 * s), r = Rv(g, w), k = vn(w * .2 / s, g.wat * 3 + 5.3); if (k < .26 && R() < .7) continue;
      B(c, r - rr(.5, 1.1) * s, -w, aw + rr(-.05, .05), rr(3, 8) * s, rr(.6, 1.3) * s, shd(), rr(.5, .85)); }
    for (let i = 0; i < (g.wat ? 14 : 5); i++) { const w = rr(.1, .9) * h, r = Rv(g, w); B(c, r - rr(2, 2.8) * s, -w, aw + rr(-.04, .04), rr(2, 4.5) * s, rr(.6, 1) * s, pk(sp('D8F0F0 E8F6F4 DCEEDC')), rr(.3, .5)); }
    // the window of the sky on the left wall, broken, a fainter second one, and a cool reflection at the right
    for (const [f, w0, w1, wd, a0] of g.wat ? [[-.66, .1, .93, 1.9, .9], [-.42, .32, .8, .9, .45], [.6, .16, .72, 1, .32]] : [[-.68, .5, .95, 1.2, .5]]) {
      for (let w = w0 * h; w < w1 * h; w += rr(2, 4.4) * s) { if (R() < .26) continue; const e = Math.sin(PI * (w / h - w0) / (w1 - w0)), r = Rv(g, w), z = R();
        const col = f > 0 ? (z < .55 ? '#E2F2F4' : pk(C.gRv)) : z < .6 ? '#FFFFFF' : z < .76 ? '#FFF6DA' : z < .9 ? pk(C.gRs) : pk(C.gRg);
        B(c, f * r + rr(-.3, .3) * s, -w, PI / 2 + rr(-.05, .05), rr(3, 8) * s, wd * s * rr(.7, 1.1) * (.55 + .45 * e), col, a0 * (.35 + .65 * e) * rr(.75, 1), rr(-.04, .04)); }
    }
    // the foot: thick glass, greenish, bright along its front edge, a cool line where the inside floor meets it
    for (let k = 0; k < 22; k++) { const a = rr(.08, .92) * PI, x = rb * .92 * Math.cos(a), y = rb * EB * .92 * Math.sin(a) - bt * rr(.1, .7); B(c, x, y, etan(a, EB) + rr(-.1, .1), rr(2.5, 4) * s, rr(1.4, 2.2) * s, g.wat ? pk(sp('C8E6DC BFDCD4 D4ECE4 B4D4CC B8C8DE')) : pk(sp('F2C66A ECB85A F6D488 E8C890')), .55); }
    for (let k = 0; k < 16; k++) { const a = rr(.05, .95) * PI, z = R(); B(c, rb * .97 * Math.cos(a), rb * EB * .97 * Math.sin(a) - .3 * s, etan(a, EB), rr(1.8, 4.8) * s, rr(.7, 1.4) * s, Math.cos(a) > -.2 ? (z < .6 ? '#FFFFFF' : pk(C.gRs)) : z < .5 ? pk(C.gRv) : pk(sp('E8F4F4 D8ECEC')), rr(.6, .95)); }
    for (let k = 0; k < 12; k++) { const a = rr(.08, .92) * PI; B(c, rbi * Math.cos(a), -bt + rbi * EB * Math.sin(a), etan(a, EB), rr(2, 3.5) * s, rr(.6, 1) * s, pk(sp('7E98AE 8AA0B8 6E88A6 8A86C0')), .45); }
    // the rim: the far arc faint violet, sky and green, the near arc broken in white and reflected colour, the lip catching warm light
    for (let k = 0; k < 18; k++) { const a = PI + rr(.04, .96) * PI, z = R(); B(c, rt * Math.cos(a), -h + rt * ET * Math.sin(a), etan(a, ET) + rr(-.06, .06), rr(1.5, 4) * s, rr(.5, .95) * s, z < .45 ? pk(C.gRv) : z < .75 ? pk(C.gRs) : pk(C.gRg), rr(.35, .62)); }
    for (let k = 0; k < 26; k++) { const a = rr(.02, .98) * PI, x = rt * Math.cos(a), lf = x < rt * .25, z = R();
      B(c, x, -h + rt * ET * Math.sin(a) + rr(-.2, .2) * s, etan(a, ET) + rr(-.08, .08), rr(1.6, 4.6) * s, rr(.6, 1.35) * s, lf ? (z < .7 ? '#FFFFFF' : pk(C.gRs)) : z < .4 ? pk(C.gRs) : z < .7 ? pk(C.gRv) : z < .85 ? pk(C.gRg) : '#FFFFFF', lf ? rr(.7, .95) : rr(.45, .75)); }
    for (let k = 0; k < 8; k++) { const a = rr(.1, .7) * PI; B(c, (rt + rti) / 2 * Math.cos(a), -h + (rt + rti) / 2 * ET * Math.sin(a) - .2 * s, etan(a, ET), rr(1.4, 2.8) * s, rr(.5, .9) * s, pk(sp('FFF6DA FFF8E4 F8EACC')), .6); }
    // one crisp spark where the sun strikes the rim
    { const a = .78 * PI, x = rt * Math.cos(a), y = -h + rt * ET * Math.sin(a); B(c, x, y, 0, 3.2 * s, 1.6 * s, '#FFFFFF', .95); B(c, x, y, PI / 2, 2.4 * s, 1.1 * s, '#FFFBEA', .85); }
    return sil;
  }
  /* a dab colour from value band v (0 deep .. 5 light): broken in hue, but kept close to its value so the body stays smooth */
  const band = (P, v) => pk(P[cl(Math.round(v + rr(-.45, .45)), 0, P.length - 1)]);
  /* water in the glass, in the glass's frame: soft dabs of broken colour, pale aqua at the lit side, cobalt and violet
     where it turns away, a little hedge caught in it, white glints, light gathered warm on the floor of the glass */
  function paintWater(c, g) {
    sd(721); const { h, bt, s } = g, ri = w => g.rbi + (g.rti - g.rbi) * (w - bt) / (h - bt);
    const gg = c.createLinearGradient(-g.rti, 0, g.rti, 0); gg.addColorStop(0, '#CBE8E4'); gg.addColorStop(.35, '#ADD6DA'); gg.addColorStop(.75, '#88B8D2'); gg.addColorStop(1, '#6C96C2');
    c.globalAlpha = .62; c.fillStyle = gg; c.fillRect(-g.rti - 1, -h - 2, 2 * g.rti + 2, h - bt + 3);
    for (let i = 0; i < 360; i++) { const w = rr(bt, h), r = ri(w), f = rr(-1.05, 1.05), u = f * r, lo = (w - bt) / (h - bt), z = R();
      const v = 4.1 - 2.6 * ss(-.5, 1.05, f) + .5 * Math.exp(-sq((f + .55) / .25)) - .5 * (1 - ss(0, .2, lo)) * ss(0, 1, f);
      let col = band(C.wv, v); if (z < .035) col = '#FFFFFF'; else if (z < .065 && lo > .35 && lo < .85) col = pk(C.wG); else if (z < .095 && f > .2) col = pk(C.wV);
      B(c, u, -w, PI / 2 + rr(-.5, .5), rr(3, 6) * s, (z < .035 ? rr(.7, 1) : rr(1.6, 2.6)) * s, col, z < .095 ? rr(.5, .75) : rr(.32, .55)); }
    for (let i = 0; i < 12; i++) { const u = rr(-.7, .5) * g.rbi; B(c, u, -bt - rr(.8, 2.6) * s, rr(-.15, .15), rr(2.5, 5) * s, rr(1, 1.6) * s, pk(sp('FFF6DA FFFBEA F2F8E8')), .5); }
    for (let i = 0; i < 16; i++) { const w = rr(bt, h); B(c, ri(w) - rr(.6, 1.1) * s, -w, PI / 2 + rr(-.15, .15), rr(3, 6) * s, rr(.9, 1.4) * s, R() < .7 ? pk(C.wC) : pk(C.wV), .55); }
    for (let i = 0; i < 4; i++) { const w = rr(bt + 4 * s, h - 6 * s); B(c, -ri(w) * rr(.3, .6), -w, PI / 2 + rr(-.3, .3), rr(1.4, 2.6) * s, rr(.7, 1.1) * s, '#FFFFFF', .85); }
  }
  /* standing honey: deep amber, burnt sienna toward the bottom and both sides where the light travels far through it, a
     glowing gold core where the sun passes through, all in soft dabs laid across the glass, and a few slow bubbles */
  function paintHoney(c, g) {
    sd(731); const { h, bt, s } = g, ri = w => g.rbi + (g.rti - g.rbi) * (w - bt) / (h - bt), x0 = -g.rti - 1, y0 = -h - 2, ww = 2 * g.rti + 2, hh = h - bt + 3;
    const gg = c.createLinearGradient(-g.rti, 0, g.rti, 0); [[0, '#8E401C'], [.1, '#B05C22'], [.26, '#CF832C'], [.46, '#E6A03A'], [.62, '#EEAE40'], [.78, '#D68A2E'], [.92, '#AC5822'], [1, '#88401C']].forEach(q => gg.addColorStop(q[0], q[1]));
    c.globalAlpha = 1; c.fillStyle = gg; c.fillRect(x0, y0, ww, hh);
    const gv = c.createLinearGradient(0, -bt, 0, -bt - (h - bt) * .42); gv.addColorStop(0, 'rgba(118,46,20,.55)'); gv.addColorStop(1, 'rgba(118,46,20,0)'); c.fillStyle = gv; c.fillRect(x0, y0, ww, hh);
    const cy = -bt - (h - bt) * .4, gr = c.createRadialGradient(.18 * g.rti, cy, 0, .18 * g.rti, cy, g.rti * .8); gr.addColorStop(0, 'rgba(255,204,96,.74)'); gr.addColorStop(1, 'rgba(255,200,90,0)'); c.fillStyle = gr; c.fillRect(x0, y0, ww, hh);
    for (let i = 0; i < 380; i++) { const w = rr(bt, h), r = ri(w), f = rr(-1.04, 1.04), u = f * r, e = Math.abs(f), lo = (w - bt) / (h - bt), core = Math.exp(-sq((f - .18) / .45) - sq((lo - .4) / .32));
      const v = 3.3 - 2.9 * Math.pow(e, 2.2) - 1.4 * (1 - ss(0, .28, lo)) + 1.8 * core + (f < -.3 && f > -.85 ? .5 * ss(.2, .5, lo) : 0);
      B(c, u, -w, rr(-.4, .4) + f * .25, rr(3, 5.5) * s, rr(1.8, 2.8) * s, band(C.hv, v), rr(.3, .5)); }
    for (let i = 0; i < 22; i++) { const w = rr(bt, h), r = ri(w), rt_ = R() < .6; B(c, rt_ ? r - rr(.5, 1.3) * s : -r + rr(.5, 1.3) * s, -w, PI / 2 + rr(-.35, .35), rr(2, 3.6) * s, rr(1, 1.6) * s, band(C.hv, rt_ ? 0 : .6), rr(.35, .55)); }
    // a few small bubbles, hanging in it
    for (const [f, lo, r] of [[.04, .56, .85], [.42, .3, .65], [-.28, .72, .55], [.24, .82, .7]]) { const w = bt + lo * (h - bt), u = f * ri(w), q = r * s;
      c.globalAlpha = .4; c.strokeStyle = '#A85424'; c.lineWidth = .3 * s; c.beginPath(); c.arc(u + .1 * q, -w + .15 * q, q, 0, TAU); c.stroke();
      B(c, u - .3 * q, -w - .35 * q, -.6, q * .95, q * .6, '#FFF2C4', .8); }
  }
  /* fallen honey, in the same frame (the lower wall, once the glass lies on its side, is u = +ri): sienna against the
     glass, amber in the body, gold toward its surface and toward the lip where it runs thin, soft dabs laid along the glass */
  function paintHoneyLie(c, g) {
    sd(737); const { h, bt, s } = g, ri = w => g.rbi + (g.rti - g.rbi) * cl((w - bt) / (h - bt), 0, 1), x0 = -g.rti - 1, y0 = -h - 2, ww = 2 * g.rti + 2, hh = h - bt + 3;
    const gg = c.createLinearGradient(g.rti, 0, -g.rti, 0); [[0, '#9A481C'], [.08, '#BA6424'], [.24, '#D68C30'], [.45, '#EAA83E'], [.7, '#F2BA4C'], [1, '#F6C85A']].forEach(q => gg.addColorStop(q[0], q[1]));
    c.globalAlpha = 1; c.fillStyle = gg; c.fillRect(x0, y0, ww, hh);
    const gw = c.createLinearGradient(0, -bt, 0, -h); [[0, 'rgba(130,52,22,.32)'], [.4, 'rgba(130,52,22,0)'], [.7, 'rgba(252,206,108,0)'], [1, 'rgba(252,206,108,.4)']].forEach(q => gw.addColorStop(q[0], q[1]));
    c.fillStyle = gw; c.fillRect(x0, y0, ww, hh);
    for (let i = 0; i < 380; i++) { const w = rr(bt, h), r = ri(w), yf = rr(-.02, 1.02), u = r * (1 - 2 * yf), xf = (w - bt) / (h - bt), L = yf / (.95 - .72 * xf);
      B(c, u, -w, PI / 2 + rr(-.25, .25), rr(3.5, 6.5) * s, rr(1.8, 2.8) * s, band(C.hv, .15 + 4.1 * cl(L, 0, 1.1)), rr(.3, .5)); }
    // light that passes down through the honey comes out glowing low on the near side
    for (let i = 0; i < 30; i++) { const w = rr(bt + .12 * (h - bt), bt + .85 * (h - bt)), xf = (w - bt) / (h - bt), r = ri(w), yf = rr(.16, .42) * (.95 - .72 * xf);
      B(c, r * (1 - 2 * yf), -w, PI / 2 + rr(-.2, .2), rr(3, 5.5) * s, rr(1.2, 1.8) * s, band(C.hv, 4.2), .4); }
  }
  /* ---------- shadows: violet, thrown to the right; light focused by the liquid burns through them ---------- */
  const soft = (c, x, y, rx, ry, rgb, a) => { c.save(); c.translate(x, y); c.scale(rx, ry); const g = c.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(.5, 'rgba(' + rgb + ',' + a * .6 + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); c.globalAlpha = 1; c.fillStyle = g; c.beginPath(); c.arc(0, 0, 1, 0, TAU); c.fill(); c.restore(); };
  function paintShadowUp(c, g) {
    sd(g.wat ? 741 : 751); const { cx, cy, rb, h, s } = g, x0 = cx + rb * .3 + h * .46, rx = h * .52 + rb * .3, ry = rb * EB * 1.1 + 1.6 * s;
    for (let i = 0, n = rx * ry * 1.1; i < n; i++) { const u = rr(-1.1, 1.1), v = rr(-1.2, 1.2), e = u * u + v * v + (vn(u * 2 + cx, v * 2) - .5) * .4; if (e > 1.05) continue;
      const x = x0 + u * rx, y = cy + 1.2 * s + v * ry, near = 1 - ss(0, 1, (x - cx) / (rb * 1.6));
      B(c, x, y, rr(-.06, .06), rr(4.5, 9) * s, rr(1.8, 2.8) * s, near > .5 && R() < .5 ? pk(C.shd) : e > .7 ? pk(C.she) : pk(C.sh), rr(.42, .62) * (1 - ss(.7, 1.05, e) * .55)); }
    // the caustic: a bright tongue of focused light inside the shadow
    const kx = cx + rb + h * .2, kr = h * (g.wat ? .15 : .18);
    soft(c, kx, cy + 1.3 * s, kr, 2.4 * s, g.wat ? '255,250,232' : '252,206,116', g.wat ? .6 : .55);
    for (let i = 0; i < 16; i++) { const u = rr(-.8, .8), v = rr(-.6, .6), x = kx + u * kr, y = cy + 1.3 * s + v * 1.6 * s, e = 1 - u * u - v * v;
      B(c, x, y, rr(-.06, .06), rr(3, 5) * s, rr(1, 1.5) * s, g.wat ? pk(sp('FFF8E4 FFFBEA F4FAF6')) : pk(sp('FCDC8A FFE6A0 F8D27A')), .3 * e); }
    // contact shade under the front of the foot
    for (let k = 0; k < 18; k++) { const a = rr(.1, .9) * PI; B(c, cx + rb * Math.cos(a), cy + rb * EB * Math.sin(a) + .6 * s, a + PI / 2, rr(2.5, 4) * s, rr(1, 1.5) * s, pk(C.shd), .5); }
  }
  function paintShadowLie(c, g) {
    sd(g.wat ? 761 : 771); const { cy, h, s } = g, x0 = g.px + h * .58, rx = h * .64, ry = 2.6 * s + 1;
    for (let i = 0, n = rx * ry * 1.4; i < n; i++) { const u = rr(-1.1, 1.1), v = rr(-1.2, 1.2), e = u * u + v * v + (vn(u * 3 + 7, v * 2) - .5) * .4; if (e > 1.05) continue;
      const x = x0 + u * rx, y = cy + .9 * s + v * ry; B(c, x, y, rr(-.05, .05), rr(4, 8) * s, rr(1.6, 2.6) * s, v < -.2 && R() < .5 ? pk(C.shd) : e > .7 ? pk(C.she) : pk(C.sh), rr(.42, .6) * (1 - ss(.7, 1.05, e) * .55)); }
    if (!g.wat) { soft(c, g.px + h * .5, cy + 1.6 * s, h * .3, 2 * s, '246,186,90', .4); for (let i = 0; i < 10; i++) B(c, g.px + rr(.3, .7) * h, cy + 1.5 * s + rr(-.6, .8) * s, rr(-.05, .05), rr(3, 5) * s, rr(.9, 1.3) * s, pk(sp('F6C46A F2B85C')), .3); }
    else for (let i = 0; i < 12; i++) { const x = g.px + rr(.15, .8) * h, y = cy + 1.4 * s + rr(-.6, .8) * s; B(c, x, y, rr(-.05, .05), rr(3, 5) * s, rr(.9, 1.3) * s, pk(sp('FFF8E4 E6F4F2')), .45); }
    for (let x = g.px - 1; x < g.px + h * .98; x += rr(2.5, 4.5) * s) B(c, x, cy + .2 * s, rr(-.04, .04), rr(3, 6) * s, rr(1, 1.5) * s, pk(C.shd), .6);
  }
  /* an ivory ball, lit from the upper left, with the cloth's warm light thrown up into its shaded underside */
  function paintBall(c, r) {
    // smooth ivory: a soft graded body, then a few broad strokes that follow the form, a warm bounce below, one gloss
    const gr = c.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r * 1.02); [[0, '#FFF9EA'], [.45, '#F2E8D6'], [.8, '#D6CADA'], [1, '#B8AED2']].forEach(q => gr.addColorStop(q[0], q[1]));
    c.globalAlpha = 1; c.fillStyle = gr; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.save(); c.clip();
    for (let i = 0; i < r * r * .9; i++) { const q = rr(0, TAU), rd = Math.sqrt(R()), x = Math.cos(q) * rd * r, y = Math.sin(q) * rd * r;
      const k = (Math.cos(q) * .62 + Math.sin(q) * .78) * rd + rr(-.15, .15), low = Math.sin(q) * rd;
      const col = low > .5 && Math.cos(q) > -.3 && R() < .6 ? pk(C.iR) : k < -.3 ? pk(C.iH) : k < .1 ? pk(C.iL) : k < .45 ? pk(C.iM) : k < .75 ? pk(C.iS) : pk(C.iD);
      B(c, x, y, q + PI / 2 + rr(-.2, .2), rr(2.2, 3.6) * r / 6.6, rr(1.4, 2) * r / 6.6, col, .45); }
    c.restore();
    B(c, -r * .36, -r * .4, -.6, r * .46, r * .26, '#FFFFFF', .9); B(c, -r * .3, -r * .34, -.6, r * .2, r * .12, '#FFFFFF', .95);
  }
  function paintBallShadow(c, r) {
    for (let i = 0; i < 26; i++) { const u = rr(-1, 1), v = rr(-1, 1); if (u * u + v * v > 1) continue; B(c, r * .7 + u * r * 1.3, r * .92 + v * r * .3, rr(-.05, .05), rr(2.5, 4.5) * r / 6.6, rr(1.2, 1.8) * r / 6.6, R() < .4 ? pk(C.shd) : pk(C.sh), .55 * (1 - .4 * (u * u + v * v))); }
    for (let i = 0; i < 6; i++) B(c, rr(-.4, .5) * r, r * .98, 0, rr(2, 3) * r / 6.6, 1.1 * r / 6.6, pk(C.shd), .6);
  }

  /* ---------- paint everything once ---------- */
  const BS = mkb(0, 0, UW, UH), b = BS.c;
  b.fillStyle = '#EFE3CC'; b.fillRect(-2, -2, UW + 4, UH + 4);
  under(b); sky(b); cape(b); sea(b); foliage(b); flowers(b); wood(b); cloth(b); glow(b);

  for (const g of GLS) {
    const pad = 3 * g.s;
    g.GS = mkb(-g.rt - pad, -g.h - g.rt * ET - pad, g.rt + pad, g.rb * EB + pad); paintGlass(g.GS.c, g);
    g.LQ = mkb(-g.rti - 1, -g.h - 2, g.rti + 1, -g.bt + 1); (g.wat ? paintWater : paintHoney)(g.LQ.c, g);
    g.SU = mkb(g.cx - g.rb - 2, g.cy - 7, g.cx + g.rb + g.h * 1.05, g.cy + 8); paintShadowUp(g.SU.c, g);
    g.SL = mkb(g.px - 4, g.cy - 6, g.px + g.h * 1.3, g.cy + 7); paintShadowLie(g.SL.c, g);
    sd(g.wat ? 781 : 791); const r = g.rB; g.BL = mkb(-r - 1.5, -r - 1.5, r + 1.5, r + 1.5); paintBall(g.BL.c, r);
    g.BSh = mkb(-r * 1.2, r * .2, r * 2.4, r * 1.6); paintBallShadow(g.BSh.c, r);
    g.lip = toS(g, TL, g.rti, g.h);   // where the inner lower lip of the fallen glass lies
    /* the glass and its contents turned once to where they come to rest, so the fallen glass is only ever placed, not resampled */
    const turn = sp0 => { const cT = Math.cos(TL), sT = Math.sin(TL), xs = [], ys = [], x0 = sp0.ox / KX, y0 = sp0.oy / KY, x1 = x0 + sp0.w / KX, y1 = y0 + sp0.h / KY;
      for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) { xs.push(g.px + (x - g.rb) * cT - y * sT); ys.push(g.py + (x - g.rb) * sT + y * cT); }
      const o = mkb(Math.min(...xs) - 1, Math.min(...ys) - 1, Math.max(...xs) + 1, Math.max(...ys) + 1); o.c.translate(g.px, g.py); o.c.rotate(TL); o.c.translate(-g.rb, 0); o.c.drawImage(sp0.o, x0, y0, sp0.w / KX, sp0.h / KY); return o; };
    g.GL = turn(g.GS); g.LQL = turn(g.LQ);
    if (!g.wat) { g.LH = mkb(-g.rti - 1, -g.h - 2, g.rti + 1, -g.bt + 1); paintHoneyLie(g.LH.c, g); g.LHL = turn(g.LH); }
  }
  const GW = GLS[0], GH = GLS[1];
  /* a layer painted in dabs, then given soft edges pixel by pixel from a field */
  const maskBy = (s, f) => { const im = s.c.getImageData(0, 0, s.w, s.h), d = im.data; for (let j = 0; j < s.h; j++) for (let i = 0; i < s.w; i++) { const q = (j * s.w + i) * 4 + 3; d[q] = Math.round(d[q] * f((s.ox + i + .5) / KX, (s.oy + j + .5) / KY)); } s.c.putImageData(im, 0, 0); };

  /* ---------- the water: the gush as the glass goes over, the burst on landing, the racing sheet and the stain ---------- */
  const GV = 1500;   // the same gravity the glasses fall under
  const WT = (() => { const g = GW, n = TIP.th.length, A = [], Q = []; let a = g.A0;
    for (let i = 0; i < n; i++) { const phi = phiW(TI + i * TIP.dt), sn = Math.sin(phi), cs = Math.cos(phi), cap = area(clipQ(g, sn, cs, dOf(g, sn, cs, g.rti, g.h))[0]), out = Math.max(0, a - cap) * (1 - Math.exp(-30 * TIP.dt));
      a -= out; A.push(Math.max(a, g.A0 * .03)); Q.push(out); } return { A, Q }; })();
  const wArea = ph => { if (ph <= TI) return GW.A0; const x = (ph - TI) / TIP.dt, i = Math.floor(x); if (i >= WT.A.length - 1) return WT.A[WT.A.length - 1]; return lp(WT.A[i], WT.A[i + 1], x - i); };
  sd(801);
  const GU = [];   // gush droplets: [birth, x0, y0, vx, vy, land time, colour, width]
  { const tot = WT.Q.reduce((a, q) => a + q, 0); let acc = 0, k = 0; const N = 46;
    for (let i = 0; i < WT.Q.length && k < N; i++) { acc += WT.Q[i]; while (k < N && acc >= (k + .5) / N * tot) {
      const tb = TI + i * TIP.dt, th = TIP.th[i], th2 = TIP.th[Math.min(TIP.th.length - 1, i + 1)], u = GW.rti - rr(0, .5) * GW.rti;
      const wq = GW.h - rr(0, 1.5), p = toS(GW, th, u, wq), q = toS(GW, th2, u, wq), ax = Math.sin(th), ay = -Math.cos(th), sp0 = rr(50, 120);
      const vx = (q[0] - p[0]) / TIP.dt * rr(.85, 1.05) + ax * sp0 + rr(-10, 10), vy = (q[1] - p[1]) / TIP.dt * rr(.85, 1.05) + ay * sp0 + rr(-12, 6), yl = GW.cy + rr(-2.5, 3.5);
      const tl = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * GV * (yl - p[1])))) / GV;
      GU.push([tb, p[0], p[1], vx, vy, Math.max(.02, tl), R() < .55 ? '#FFFFFF' : pk(C.aqB), rr(.8, 1.4) * GW.s]); k++; } } }
  /* the burst: a fan of droplets thrown up and out where the glass and its water strike, falling back within a third of a
     second, over a quick bright slap of water */
  const SPL = [];
  for (let i = 0; i < 64; i++) { const bk = R() < .2, tf = rr(.2, .34), rx = bk ? -rr(6, 16) : rr(18, 42), x0 = GW.lip[0] + rr(-1, 8), y0 = GW.cy - rr(.5, 3.5), yl = y0 + rr(1, 14);
    SPL.push([TLAND + rr(-.03, .05), x0, y0, rx / tf, (yl - y0 - .5 * GV * tf * tf) / tf, tf, R() < .3 ? '#FFFFFF' : pk(C.aqB), rr(2, 3.3)]); }
  const SLX = GW.lip[0] + 7, SLY = GW.cy - 1.5, SLP = mkb(SLX - 27, SLY - 10, SLX + 27, SLY + 10);
  soft(SLP.c, SLX, SLY, 25, 7, '228,250,248', .85); soft(SLP.c, SLX - 3, SLY - 1, 13, 3.8, '255,255,255', .8);
  const W0 = GU.length ? Math.min(...GU.map(d => d[0] + d[5])) : TLAND;   // the first water to reach the cloth
  /* the sheet: overlapping lobes spreading from the mouth across the front of the cloth, flatter with depth */
  const AX = GW.lip[0] - 1, AY = GW.cy + .6, ws = GW.s;
  const LOBES = [[-2, 1.2, 9, 3.4], [12, 1.6, 16, 4.6], [32, 2.8, 22, 5.6], [56, 4.6, 20, 5], [80, 6.8, 18, 4.4], [100, 8.8, 11, 3.2], [22, -1.6, 14, 3], [44, 7.6, 16, 3.4], [68, 2, 14, 3.2], [6, 4.8, 9, 2.6]].map(l => [l[0] * ws, l[1] * ws, l[2] * ws, l[3] * ws]);
  const inSheet = (x, y, k) => { let m = -1; for (const [lx, ly, rx, ry] of LOBES) m = Math.max(m, 1 - sq((x - AX - lx) / (rx * k)) - sq((y - AY - ly) / (ry * k))); return m + (vn(x * .18, y * .4) - .5) * .25; };
  const SH = mkb(AX - 18 * ws, AY - 8 * ws, AX + 126 * ws, AY + 18 * ws), ST = mkb(AX - 20 * ws, AY - 9 * ws, AX + 130 * ws, AY + 19 * ws);
  { const c = SH.c; sd(811); c.globalAlpha = .55; c.fillStyle = '#C6E2EE'; c.fillRect(AX - 18 * ws, AY - 8 * ws, 144 * ws, 26 * ws);
    for (let i = 0; i < 1500; i++) { const x = rr(AX - 13 * ws, AX + 117 * ws), y = rr(AY - 7 * ws, AY + 16 * ws), m = inSheet(x, y, 1); if (m < 0) continue; const z = R(), edge = m < .15, back = inSheet(x, y + 1.5, 1) > m;
      let col = z < .3 ? pk(C.sk) : z < .56 ? pk(C.aqB) : z < .7 ? pk(C.aq) : z < .82 ? pk(sp('94B2DE 8AA8DA 9CB8E2')) : z < .9 ? pk(C.wt) : '#FFFFFF';
      if (edge) col = back ? (R() < .75 ? '#FFFFFF' : pk(sp('E8F6F4 DDF2F2'))) : pk(sp('9AA2D4 9098CE A2A8D6'));
      B(c, x, y, rr(-.06, .06), (edge ? rr(2.5, 5) : rr(3.5, 8.5)) * ws, (edge ? rr(.8, 1.3) : z > .9 ? rr(.8, 1.2) : rr(1.3, 2.3)) * ws, col, edge ? rr(.7, .92) : rr(.6, .88)); }
    maskBy(SH, (x, y) => ss(-.02, .1, inSheet(x, y, 1))); }
  { const c = ST.c; sd(821); c.globalAlpha = .5; c.fillStyle = '#A8B4DE'; c.fillRect(AX - 20 * ws, AY - 9 * ws, 150 * ws, 28 * ws);
    /* wet linen: darker, cooler and bluer than the dry cloth and its violet leaf shadows, with a faint tide line where the water stopped */
    for (let i = 0; i < 1300; i++) { const x = rr(AX - 15 * ws, AX + 121 * ws), y = rr(AY - 8 * ws, AY + 17 * ws), m = inSheet(x, y, 1.06); if (m < 0) continue;
      if (m < .08) B(c, x, y, rr(-.06, .06), rr(2.5, 5) * ws, rr(.8, 1.3) * ws, pk(C.stt), .55);
      else B(c, x, y, rr(-.06, .06), rr(4, 8) * ws, rr(1.8, 3) * ws, pk(C.stn), rr(.42, .62) * (.6 + .4 * ss(0, .3, m))); }
    maskBy(ST, (x, y) => ss(-.03, .06, inSheet(x, y, 1.06))); }
  const WGL = []; sd(831);
  for (let i = 0; i < 600 && WGL.length < 18; i++) { const x = rr(AX, AX + 108 * ws), y = rr(AY - 4 * ws, AY + 13 * ws); if (inSheet(x, y, 1) < .22) continue; WGL.push([x, y, rr(1.6, 3.6) * ws, rr(.35, .9), rr(0, TAU), R() < .7 ? '#FFFFFF' : '#FFF6DA']); }
  /* the leading edge of the racing sheet: points just inside its outline, along rays from the mouth */
  const EG = []; for (let k = 0; k < 11; k++) { const a = lp(-.35, .55, k / 10), ca = Math.cos(a), sa = Math.sin(a) * .4; let d = 4; while (d < 170 && inSheet(AX + ca * d, AY + sa * d, 1) > .02) d += 1; if (d > 8) EG.push([AX + ca * (d - 2), AY + sa * (d - 2), Math.atan2(sa, ca) + PI / 2]); }

  /* ---------- the honey outside the glass: a thick tongue over the lip, laid in an S of folds onto a lobed pool ---------- */
  const HX = GH.lip[0], HY = GH.cy, hk = GH.s / 1.2, r0 = 1.75 * GH.s, LT = 7 * hk;
  const PAX = HX - 1, PAY = HY + .5, PL = 48 * hk;
  const PLOB = [[14, 0, 15, 5.4], [28, 2, 12, 4.8], [26, -2.6, 9, 3.2], [39, 1.2, 8, 3.6], [6, .8, 7.5, 5], [18, 4.2, 8, 2.8]].map(l => [l[0] * hk, l[1] * hk, l[2] * hk, l[3] * hk]);
  const pFld = (x, y, dx, dy) => { let m = -1; for (const [lx, ly, rx, ry] of PLOB) m = Math.max(m, 1 - sq((x - PAX - dx - lx) / rx) - sq((y - PAY - dy - ly) / ry)); return m + (vn(x * .3 + 4, y * .5) - .5) * .3; };
  const HPU = mkb(PAX - 3, PAY - 9 * hk, PAX + PL + 4, PAY + 10 * hk), HPS = mkb(PAX - 1, PAY - 8 * hk, PAX + PL + 8, PAY + 12 * hk);
  { const c = HPU.c; sd(841); c.globalAlpha = 1; c.fillStyle = '#E6A23C'; c.fillRect(PAX - 3, PAY - 9 * hk, PL + 7, 19 * hk);
    /* deep amber where it is thick by the folds, amber and gold further out, pale translucent gold at its thin edge */
    for (let i = 0; i < 480; i++) { const x = rr(PAX - 3, PAX + PL + 4), y = rr(PAY - 9 * hk, PAY + 10 * hk), m = pFld(x, y, 0, 0); if (m < -.05) continue; const xf = (x - PAX) / PL;
      const v = 4.3 - 2.4 * ss(.1, .7, m) * (1 - .6 * ss(.35, .8, xf)) + .5 * ss(.2, -.05, m) + (y < PAY - 1 ? .4 : 0);
      B(c, x, y, rr(-.05, .05), rr(5, 10) * hk, rr(1.6, 2.6) * hk, band(C.hv, v), rr(.35, .55)); }
    // the near rim shows the pool's thickness in sienna; its back catches the sky in one long gold-cream light
    for (let i = 0; i < 100; i++) { const x = rr(PAX, PAX + PL), y = rr(PAY, PAY + 9 * hk), m = pFld(x, y, 0, 0); if (m < .02 || m > .2 || pFld(x, y - 1, 0, 0) < m) continue; B(c, x, y - .4, rr(-.1, .1), rr(2.5, 4.5) * hk, rr(1, 1.5) * hk, pk(C.hR), .55); }
    for (let k = 0; k < 9; k++) { const f = k / 8, x = PAX + lp(17, 40, f) * hk, y = PAY - (.6 + .9 * Math.sin(PI * f)) * hk; B(c, x, y, -.05 + .1 * f, 3.8 * hk, (.6 + 1.1 * Math.sin(PI * f)) * hk, f < .6 ? '#FFF4CC' : '#FCE6A6', .92); }
    B(c, PAX + 25 * hk, PAY - 1.4 * hk, 0, 2.8 * hk, 1.1 * hk, '#FFFFFF', .75);
    maskBy(HPU, (x, y) => { const m = pFld(x, y, 0, 0); return ss(-.04, .12, m) * (.55 + .45 * ss(.05, .35, m)); }); }
  { const c = HPS.c; sd(845);   // its shadow, violet, warmed by the light the honey lets through
    for (let i = 0; i < 300; i++) { const x = rr(PAX, PAX + PL + 8), y = rr(PAY - 7 * hk, PAY + 12 * hk), m = pFld(x, y, 4 * hk, 1.8 * hk); if (m < -.05) continue;
      B(c, x, y, rr(-.06, .06), rr(3, 6) * hk, rr(1.4, 2.4) * hk, m > .45 && R() < .55 ? pk(sp('E8A848 F0B85A ECAE50')) : pk(C.sh), rr(.45, .7)); }
    maskBy(HPS, (x, y) => ss(-.05, .4, pFld(x, y, 4 * hk, 1.8 * hk)) * .8); }
  /* the S: the rope lands and runs out along the cloth, folds back over itself, then forward again on top.
     RP holds [x, height above the cloth, stretch, arc length, angle, time laid] at rest, before it slumps. */
  const xL = HX + 5.5 * hk, LA = 13 * hk, LB0 = 3 * hk, LC = 7.5 * hk, RP = [], RZ = [], ur = .8 * r0, dz = 2 * ur;
  { let acc = 0, pv = null; const st = 1.5 * hk, add = (x, y, l, z) => { if (pv) acc += Math.hypot(x - pv[0], y - pv[1]); RP.push([x, y, l, acc, 0]); RZ.push(z * hk); pv = [x, y]; };
    for (let x = xL; x < xL + LA; x += st) add(x, r0 + .2 * Math.sin((x - xL) * .5), 0, 0);
    for (let a = PI / 2 - st / ur; a > -PI / 2; a -= st / ur) add(xL + LA + 1.15 * ur * Math.cos(a), r0 + ur - ur * Math.sin(a), 1, .35 - .35 * Math.sin(a));
    for (let x = xL + LA; x > xL + LB0; x -= st) add(x, r0 + dz + .2 * Math.sin(x * .5), 2, .7);
    for (let a = PI / 2 + st / ur; a < 1.5 * PI; a += st / ur) add(xL + LB0 + 1.15 * ur * Math.cos(a), r0 + dz + ur - ur * Math.sin(a), 3, 1 - .3 * Math.sin(a));
    for (let x = xL + LB0; x <= xL + LB0 + LC; x += st) add(x, r0 + 2 * dz + .2 * Math.sin(x * .6), 4, 1.3);
    for (let i = 0; i < RP.length; i++) { const a = RP[Math.max(0, i - 1)], b2 = RP[Math.min(RP.length - 1, i + 1)]; RP[i][4] = Math.atan2(-(b2[1] - a[1]), b2[0] - a[0]); } }
  const LTOT = LT + RP[RP.length - 1][3], lrAt = tau => LTOT * Math.min(1, hOutAt(tau) / OS);
  { let k = 0; for (let tau = 0; tau < HTS && k < RP.length; tau += .02) while (k < RP.length && lrAt(tau) >= LT + RP[k][3]) RP[k++].push(tau); while (k < RP.length) RP[k++].push(HTS); }

  /* ---------- the live sparkles and leaf light (from the FORM study) ---------- */
  const DAP = []; sd(501);
  for (const [bx, by, big] of [[20, 216, 1], [170, 210, 1], [330, 214, 1], [96, 256, 1], [282, 228, 1], [392, 262, 1], [40, 294, 1], [214, 292, 1], [356, 298, 1], [-6, 246, 0], [330, 284, 0], [236, 224, 0]]) {
    const w = big ? rr(80, 104) : rr(34, 48), h = big ? rr(18, 25) : rr(9, 13);
    DAP.push({ s: patch(510 + DAP.length, w, h), hh: h / 2 + 2, bx, by, ax: rr(12, 24), ay: rr(1.5, 3.5), px: rr(11, 19), py: rr(9, 15), p1: rr(0, TAU), p2: rr(0, TAU), p3: rr(0, TAU), p4: rr(0, TAU), a0: big ? rr(.5, .68) : rr(.42, .6) });
  }
  sd(601); const SPK = [];
  for (let i = 0; i < 400 && SPK.length < 30; i++) { const x = rr(206, 404), y = rr(HZ + 2, 120); if (rg(x, y) !== 1 || rg(x, y + 4) !== 1) continue; const d = cl((y - HZ) / (yBu(x) - HZ), 0, 1); SPK.push([x, y, lp(2.5, 7, d) * rr(.7, 1.3), lp(1, 1.8, d), pk(C.spk), rr(.6, .95), rr(.12, .38), rr(0, TAU)]); }
  sd(611); const FLK = [];
  for (let i = 0; i < 1500 && FLK.length < 22; i++) { const x = rr(0, 400), y = rr(4, 186); if (rg(x, y) !== 2 || fl(x, y) < .3) continue; FLK.push([x, y, rr(-1.4, -.6), rr(3, 6), rr(1.8, 2.6), pk(C.flk), rr(.5, .8), rr(.1, .3), rr(0, TAU)]); }
  const DAPB = DAP.filter(q => q.by - q.hh - q.ay - 1.5 < 211), DAPF = DAP.filter(q => !DAPB.includes(q));
  const CP = new Path2D(); CP.moveTo(-2, yC(-2)); for (let x = 0; x <= 404; x += 6) CP.lineTo(x, yC(x)); CP.lineTo(404, 304); CP.lineTo(-4, 304); CP.closePath();
  sd(861); const MJ = [], HJ = []; for (let k = 0; k < 12; k++) MJ.push([rr(-.25, .25), rr(.7, 1.3), R()]); for (let k = 0; k <= 16; k++) HJ.push([rr(-.5, .5), rr(.85, 1.2), R()]);

  /* ---------- the state of the action at loop time ph ---------- */
  function state(ph) {
    const th = thAt(ph), S = { ph, th }, tau = ph - TLAND;
    S.bx = GLS.map(g => ballX(g, ph));
    S.wA = wArea(ph); S.wPhi = phiW(ph);
    S.hO = hAt(tau); S.d = HB[HN - 1] * 2 * GH.rti;
    /* the slumped surface leans into one steady slope, from the base down to the lip */
    const kt = .26 * ss(0, 1.6, tau); S.hH = HB.map((v, i) => v * (1 + kt * (1 - 2 * (i + .5) / HN)));
    S.Lr = LTOT * Math.min(1, S.hO / OS);
    const of = S.hO / OF; S.pL = of > 0 ? .22 + .65 * Math.pow(Math.min(1, of), .65) + .13 * ss(4.4, 7.8, tau) : 0;   // the pool's reach, as a share of PL
    S.sh = ph < W0 ? 0 : .16 + .84 * (1 - Math.pow(1 - cl((ph - W0) / .75, 0, 1), 3));
    S.soak = ss(W0 + 1.2, W0 + 4.4, ph);
    return S;
  }
  const S0 = state(0);

  /* ---------- drawing, onto the canvas or onto the cross-fade layer (offset ox, oy in device pixels) ---------- */
  const unit = (c, ox, oy) => c.setTransform(KX, 0, 0, KY, -ox, -oy);
  const blit = (c, s, dx, dy, ox, oy) => { c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(s.o, Math.round(dx * KX + s.ox - ox), Math.round(dy * KY + s.oy - oy)); };
  const local = (c, ox, oy, g, th) => { c.setTransform(KX, 0, 0, KY, -ox, -oy); c.translate(g.px, g.py); c.rotate(th); c.translate(-g.rb, 0); };
  const scaled = (c, s, ax, ay, kx, ky, ox, oy) => { c.setTransform(1, 0, 0, 1, 0, 0); const x0 = s.ox / KX, y0 = s.oy / KY; c.drawImage(s.o, (ax + kx * (x0 - ax)) * KX - ox, (ay + ky * (y0 - ay)) * KY - oy, s.w * kx, s.h * ky); };

  /* the liquid inside a standing or falling glass turned by th: the interior below a surface turned by phi, holding area A;
     its free surface, seen from a little above, is an ellipse across the chord, edged with a broken meniscus */
  function liquid(c, ox, oy, g, th, phi, A, wat) {
    if (A < g.A0 * .02 || GA < .003) return;
    const sn = Math.sin(phi), cs = Math.cos(phi), lv = level(g, phi, A), [P, chd] = clipQ(g, sn, cs, lv); if (P.length < 3) return;
    let el = null;
    if (chd.length === 2) { const cA = toS(g, th, chd[0][0], chd[0][1]), cB = toS(g, th, chd[1][0], chd[1][1]);
      const wm = (chd[0][1] + chd[1][1]) / 2, ri = g.rbi + (g.rti - g.rbi) * cl((wm - g.bt) / (g.h - g.bt), 0, 1);
      let dep = 0; for (const p of P) dep = Math.max(dep, dOf(g, sn, cs, p[0], p[1]) - lv); const hw = Math.sqrt(Math.max(0, ri * ri - sq(ri - Math.min(dep, ri))));
      el = [(cA[0] + cB[0]) / 2, (cA[1] + cB[1]) / 2, Math.hypot(cB[0] - cA[0], cB[1] - cA[1]) / 2, Math.max(.4, hw * ET * 1.05) * (wat ? 1 : 1 - ss(0, .5, th)), Math.atan2(cB[1] - cA[1], cB[0] - cA[0])];
      if (el[4] > PI / 2) el[4] -= PI; else if (el[4] < -PI / 2) el[4] += PI; if (el[3] < .3) el = null; }
    const pts = P.map(p => toS(g, th, p[0], p[1]));
    let sa = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], q = pts[(i + 1) % pts.length]; sa += a[0] * q[1] - q[0] * a[1]; }
    c.save(); unit(c, ox, oy); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
    if (el) c.ellipse(el[0], el[1], el[2], el[3], el[4], 0, TAU, sa < 0);
    c.clip();
    local(c, ox, oy, g, th);
    c.globalAlpha = GA; if (th === TL) blit(c, g.LQL, 0, 0, ox, oy); else c.drawImage(g.LQ.o, g.LQ.ox / KX, g.LQ.oy / KY, g.LQ.w / KX, g.LQ.h / KY);
    unit(c, ox, oy);
    if (el) {
      const [ex, ey, rx, ry, ea] = el, ca = Math.cos(ea), sa2 = Math.sin(ea), s = g.s, fa = wat ? 1 : 1 - ss(0, .4, th);
      const at = a => [ex + rx * Math.cos(a) * ca - ry * Math.sin(a) * sa2, ey + rx * Math.cos(a) * sa2 + ry * Math.sin(a) * ca], tg = a => { const p = at(a), q = at(a + .05); return Math.atan2(q[1] - p[1], q[0] - p[0]); };
      if (fa > .01) {
        c.globalAlpha = (wat ? .45 : .72) * fa * GA; c.fillStyle = wat ? '#D8ECF2' : '#E8A43C'; c.beginPath(); c.ellipse(ex, ey, rx, ry, ea, 0, TAU); c.fill();
        // the far edge: cool for the water, deep amber for the honey
        for (let k = 0; k < 6; k++) { const a = PI + (k + .5 + MJ[k][0]) / 6 * PI, p = at(a); B(c, p[0], p[1], tg(a), Math.min(rx * .45, 3.2 * s) * MJ[k][1], .8 * s, wat ? pk2(k, C.wC) : pk2(k, C.hO), .5 * fa); }
        if (wat) for (let k = 0; k < 8; k++) { const a = PI * (1 - (k + .5 + MJ[k][0]) / 8), p = at(a); B(c, p[0], p[1], tg(a), Math.min(rx * .42, 3.4 * s) * MJ[k][1], (.55 + .4 * MJ[k][2]) * s, k < 4 ? '#FFFFFF' : pk2(k, C.aqB), .85 * fa); }
        else {
          /* a thick curved meniscus: honey climbing the near wall in a band of amber, a cream light along its crest that
             is brightest on the sunlit left, and the climb up the glass at either end */
          for (let k = 0; k < 9; k++) { const a = (k + .5) / 9 * PI, p = at(a); B(c, p[0], p[1] + 1.2 * s, tg(a), Math.min(rx * .38, 3.6 * s), 1.8 * s, pk2(k, C.hA), .6 * fa); }
          for (let k = 0; k < 5; k++) { const a = PI * (1 - (k + .7 + .6 * MJ[k][0]) / 7.2), p = at(a), e = 1 - k / 5; B(c, p[0], p[1] + .3 * s, tg(a), Math.min(rx * .55, 5 * s) * MJ[k][1], (.55 + .5 * e) * s, k < 3 ? '#FFF2C4' : '#FCE2A2', (.5 + .45 * e) * fa); }
          const pl = at(PI * .985), pr = at(PI * .015);
          B(c, pl[0] + .6 * s, pl[1] - .5 * s, PI / 2 + .25, 2.6 * s, 1 * s, '#FFF0BE', .8 * fa); B(c, pr[0] - .6 * s, pr[1] - .5 * s, PI / 2 - .25, 2.6 * s, 1 * s, '#C8742A', .6 * fa);
        }
      }
    }
    c.restore();
  }
  /* the honey in the fallen glass, from the slump profile pr: the region between the lower wall and its surface, laid in
     three passes so it is translucent where thin and rich where deep, its surface softened by broken dabs and lit by one
     long cream-gold highlight just under it */
  const KS = 14, HPASS = [[1, .58], [.62, .42], [.32, .45]], HPASS1 = [[1, .8]];   // while the glass still moves, one pass
  const Hx = (pr, x) => { const f = cl(x * HN - .5, 0, HN - 1), i = Math.min(HN - 2, Math.floor(f)); return lp(pr[i], pr[i + 1], f - i); };
  function honeyIn(c, ox, oy, g, th, pr, al) {
    const s = g.s, SP = [];
    for (let k = 0; k <= KS; k++) { const x = k / KS; SP.push([g.bt + x * (g.h - g.bt), g.rbi + (g.rti - g.rbi) * x, Hx(pr, x)]); }
    const prof = f => { c.beginPath(); for (let k = 0; k <= KS; k++) { const [w, ri, hh] = SP[k], u = ri * (1 - 2 * Math.min(1, hh * f)); k ? c.lineTo(u, -w) : c.moveTo(u, -w); } for (let k = KS; k >= 0; k--) c.lineTo(SP[k][1] + .2, -SP[k][0]); c.closePath(); };
    for (const [f, a] of th === TL ? HPASS : HPASS1) { c.save(); local(c, ox, oy, g, th); prof(f); c.clip(); c.globalAlpha = a * al * GA;
      if (th === TL) blit(c, g.LHL, 0, 0, ox, oy); else c.drawImage(g.LH.o, g.LH.ox / KX, g.LH.oy / KY, g.LH.w / KX, g.LH.h / KY); c.restore(); }
    local(c, ox, oy, g, th); const ga = GA; GA = ga * al;
    const U = k => SP[k][1] * (1 - 2 * Math.min(1, SP[k][2]));
    for (let k = 0; k < KS; k++) { if (SP[k][2] < .015 || SP[k][2] > .93) continue; const ua = U(k), ub = U(k + 1), wa = SP[k][0], wb = SP[k + 1][0], j = HJ[k];
      B(c, (ua + ub) / 2 + j[0] * .8 * s, -(wa + wb) / 2, Math.atan2(wa - wb, ub - ua), Math.hypot(ub - ua, wb - wa) * 1.5, 1.5 * s * j[1], j[2] < .5 ? pk2(k, C.hG) : pk2(k, C.hA), .5); }
    for (let k = 1; k < 10; k++) { if (SP[k][2] < .05 || SP[k][2] > .9) continue; const f = (k - 1) / 8, ua = U(k) + 1.3 * s, ub = U(k + 1) + 1.3 * s, wa = SP[k][0], wb = SP[k + 1][0];
      B(c, (ua + ub) / 2, -(wa + wb) / 2, Math.atan2(wa - wb, ub - ua), Math.hypot(ub - ua, wb - wa) * 1.25, (.55 + .5 * Math.sin(PI * f)) * s, f < .6 ? '#FFF0BE' : '#FCE4A0', .85 * (1 - .4 * f)); }
    GA = ga;
  }
  function glass(c, ox, oy, g, th) {
    c.globalAlpha = GA; if (th === 0) { blit(c, g.GS, g.cx, g.cy, ox, oy); return; } if (th === TL) { blit(c, g.GL, 0, 0, ox, oy); return; }
    local(c, ox, oy, g, th); c.drawImage(g.GS.o, g.GS.ox / KX, g.GS.oy / KY, g.GS.w / KX, g.GS.h / KY);
  }
  function drawUnder(c, ox, oy, S, t) {
    const ph = S.ph;
    // the sheet of water racing out over the linen, and the wet patch it leaves as it soaks in
    if (S.sh > 0) {
      const ka = S.soak, sx = S.sh, sy = Math.pow(S.sh, .8), full = S.sh >= 1;
      if (S.sh > .3) { c.globalAlpha = .95 * ss(W0 + .15, W0 + 2.8, ph) * GA; if (full) blit(c, ST, 0, 0, ox, oy); else scaled(c, ST, AX, AY, sx, sy, ox, oy); }
      c.globalAlpha = (1 - .82 * ka) * GA; if (full) blit(c, SH, 0, 0, ox, oy); else scaled(c, SH, AX, AY, sx, sy, ox, oy);
      unit(c, ox, oy); const g0 = ss(W0 + .15, W0 + .6, ph), ga = g0 * (.3 + .7 * (1 - ka));
      WGL.forEach(([x, y, l, f, p, col], i) => { const k = Math.sin(TAU * f * t + p); if (k > .15) D(c, AX + (x - AX) * sx, AY + (y - AY) * sy, 0, l, 1.1 * ws, col, (i < 2 ? Math.max(ga, .8 * g0) : ga) * k * k); });
      if (!full) { const ea = .95 * (1 - ss(.8, 1, S.sh)); for (const [x, y, a] of EG) B(c, AX + (x - AX) * sx, AY + (y - AY) * sy, a + PI / 2, 3.2 * ws, 1.1 * ws, '#FFFFFF', ea); }
    }
    // the shadows of the glasses, upright giving way to fallen, and of the balls
    const k = ss(.3, 1, S.th / TL);
    for (const g of GLS) { if (k < 1) { c.globalAlpha = (1 - k) * GA; blit(c, g.SU, 0, 0, ox, oy); } if (k > 0) { c.globalAlpha = k * GA; blit(c, g.SL, 0, 0, ox, oy); } }
    c.globalAlpha = GA; GLS.forEach((g, i) => { if (S.bx[i] > -12) blit(c, g.BSh, S.bx[i], g.cy - g.rB, ox, oy); });
  }
  function drawDap(c, ox, oy, t) {
    c.save(); c.globalCompositeOperation = 'multiply';
    for (const q of DAPF) { const x = q.bx + q.ax * Math.sin(TAU * t / q.px + q.p1) + 2.6 * Math.sin(TAU * t / 2.9 + q.p2), y = q.by + q.ay * Math.sin(TAU * t / q.py + q.p3) + .7 * Math.sin(TAU * t / 3.3 + q.p4); c.globalAlpha = q.a0 * (.78 + .22 * Math.sin(TAU * t / 7.3 + q.p2)); blit(c, q.s, x, y, ox, oy); }
    unit(c, ox, oy); c.clip(CP);
    for (const q of DAPB) { const x = q.bx + q.ax * Math.sin(TAU * t / q.px + q.p1) + 2.6 * Math.sin(TAU * t / 2.9 + q.p2), y = q.by + q.ay * Math.sin(TAU * t / q.py + q.p3) + .7 * Math.sin(TAU * t / 3.3 + q.p4); c.globalAlpha = q.a0 * (.78 + .22 * Math.sin(TAU * t / 7.3 + q.p2)); blit(c, q.s, x, y, ox, oy); }
    c.restore(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  }
  function ball(c, ox, oy, g, x) {
    if (x < -12 || GA < .003) return; const y = g.cy - g.rB; c.globalAlpha = GA; blit(c, g.BL, x, y, ox, oy);
    // a faint grain on the ivory turns as it rolls
    unit(c, ox, oy); const a = (x - g.cx) / g.rB; B(c, x + .5 * g.rB * Math.cos(a), y + .5 * g.rB * Math.sin(a), a + PI / 2, 1.6 * g.s, .9 * g.s, '#CDBFB8', .35);
  }
  /* the gush: one coherent tongue of water thrown out over the lower lip, as long and thick as the recent outflow, bending
     down under its own weight and laid flat along the cloth as the glass lands */
  const GQM = Math.max(...WT.Q);
  function gush(c, ph) {
    if (ph <= TI || ph > TLAND + .22) return;
    const i = Math.min(WT.Q.length - 1, Math.floor((ph - TI) / TIP.dt)); let q = 0; for (let j = Math.max(0, i - 10); j <= i; j++) q = Math.max(q, WT.Q[j]); q = Math.sqrt(q / GQM) * (1 - ss(TLAND + .05, TLAND + .22, ph));
    if (q < .05) return;
    const th = thAt(ph), ax = Math.sin(th), ay = -Math.cos(th), s = GW.s, p0 = toS(GW, th, GW.rti * .5, GW.h), L = (4 + 11 * q) * s, wd = (2.4 + 4.8 * q) * s, dn = (.45 + .2 * q) * L;
    const x1 = p0[0] + ax * L * .6, y1 = p0[1] + ay * L * .6, x2 = Math.min(p0[0] + ax * L + .3 * dn, p0[0] + 1.6 * L), y2 = Math.min(GW.cy - .4, p0[1] + ay * L + dn);
    for (let k = 0; k <= 6; k++) { const f = k / 6, a = sq(1 - f), b2 = 2 * f * (1 - f), e = f * f, x = a * p0[0] + b2 * x1 + e * x2, y = a * p0[1] + b2 * y1 + e * y2, tx = 2 * (1 - f) * (x1 - p0[0]) + 2 * f * (x2 - x1), ty = 2 * (1 - f) * (y1 - p0[1]) + 2 * f * (y2 - y1), an = Math.atan2(ty, tx), w = wd * (1 - .55 * f), nx = ty > 0 ? ty : -ty, ny = ty > 0 ? -tx : tx, nm = Math.hypot(nx, ny) || 1;
      B(c, x, y, an, L * .32, w, pk2(k, C.aqB), .85); if (k % 2 === 0) B(c, x + nx / nm * w * .25, y + ny / nm * w * .25, an, L * .26, w * .3, '#FFFFFF', .9); }
  }
  function drops(c, list, ph, s, rnd) {
    for (const [tb, x0, y0, vx, vy, tl, col, w] of list) { const u = ph - tb; if (u < 0 || u > tl) continue;
      const x = x0 + vx * u, y = y0 + vy * u + .5 * GV * u * u, wy = vy + GV * u, v = Math.hypot(vx, wy), an = Math.atan2(wy, vx), al = .95 * (1 - ss(.75, 1, u / tl)) * ss(0, .025, u);
      if (rnd) { const l = Math.max(w * 1.3, Math.min(w * 4, v * .022)); B(c, x, y, an, l, w * 1.2, col, al); if (col !== '#FFFFFF' && w > 2.6) B(c, x - .15 * w, y - .2 * w, an, l * .5, w * .45, '#FFFFFF', al); }
      else { B(c, x, y, an, Math.min(cl(v * .02, 1.6, 6) * s, 2.2 * w), w, col, .9 * al); if (col === '#FFFFFF') B(c, x - .2 * w, y - .2 * w, an, .9 * w, .45 * w, '#FFFFFF', al); } }
  }
  /* the honey outside the glass: its shadow and lobed pool, the S of rope slumping into it, and the tongue over the lip */
  function honeyOut(c, ox, oy, S, t) {
    if (S.hO <= OF * .002 || GA < .003) return;
    const tau = S.ph - TLAND, kx = S.pL, ky = .5 + .5 * Math.min(1, kx);
    if (S.Lr > LT * .8) { c.globalAlpha = ss(.002, .05, S.hO / OF) * GA; scaled(c, HPS, PAX, PAY, kx, ky, ox, oy); scaled(c, HPU, PAX, PAY, kx, ky, ox, oy); }
    unit(c, ox, oy);
    /* the S: each stretch a smooth glossy tube (amber, deeper sienna along its underside, gold where the light passes
       through, one broken cream highlight along its top), drawn in the order it was laid so each fold rests on the last */
    const Ls = S.Lr - LT; let n = 0; while (n < RP.length && RP[n][3] <= Ls) n++;
    const PX = [], PY = [], PR = [], PM = [];
    for (let i = 0; i < n; i++) { const p = RP[i], m = ss(p[5] + .5, p[5] + 3.4, tau); PM.push(m); PR.push(r0 * (1 - .32 * m)); PX.push(p[0]); PY.push(HY - (r0 * (1 - .35 * m) + (p[1] - r0) * (1 - .72 * m)) + RZ[i] * (1 - .5 * m)); }
    const line = (i0, i1, dy, w, col, al) => { if (i1 - i0 < 1) return; c.globalAlpha = al * GA; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (let i = i0; i <= i1; i++) { const y = PY[i] + dy * PR[i]; i > i0 ? c.lineTo(PX[i], y) : c.moveTo(PX[i], y); } c.stroke(); };
    for (let l = 0, i0 = 0; l < 5 && i0 < n; l++) { let i1 = i0; while (i1 + 1 < n && RP[i1 + 1][2] === l) i1++; const j0 = Math.max(0, i0 - 1), mm = PM[i0];
      if (l === 0) line(j0, i1, .75, 1.6 * r0, '#B06A30', .3);
      c.fillStyle = ['#DC9030', '#E09634', '#E49C38', '#E8A23C', '#ECA840'][l];
      for (let i = i0; i <= i1; i++) { c.globalAlpha = .96 * GA; c.beginPath(); c.arc(PX[i], PY[i], PR[i], 0, TAU); c.fill(); }
      line(j0, i1, .62, .45 * r0, l ? '#B05A22' : '#9C4A1E', (l ? .35 : .5) * (1 - .5 * mm)); line(j0, i1, .12, .7 * r0, '#F6C452', .35);
      for (let i = i0 + (l & 1); i <= i1; i += 2) B(c, PX[i] - .2 * PR[i], PY[i] - .5 * PR[i], RP[i][4], 3.4 * hk, .5 * PR[i], i % 4 < 2 ? '#FFF4CC' : '#FFE8A8', .85 * (1 - .55 * PM[i]));
      i0 = i1 + 1; }
    /* the tongue over the lip, as thick as the honey running out of the glass, thinning as it drains */
    const tr = cl(S.Lr / LT, 0, 1);
    if (tr > 0) {
      const mA = ss(RP[0][5] + .5, RP[0][5] + 3.4, tau), d = Math.max(1.8 * r0, Math.min(S.d, 8 * hk)), x0 = HX - .3, y0 = HY - GH.wl - d * .5, x2 = xL, y2 = HY - r0 * (1 - .3 * mA), x1 = HX + 3.6 * hk, y1 = y0 + .4;
      const TX = [], TY = [], TRr = [];
      for (let k = 0; k <= 8; k++) { const q = tr * k / 8, a = sq(1 - q), b2 = 2 * q * (1 - q), e = q * q; TX.push(a * x0 + b2 * x1 + e * x2); TY.push(a * y0 + b2 * y1 + e * y2); TRr.push(lp(d * .5, r0 * (1 - .28 * mA), q)); }
      c.fillStyle = '#E09634'; for (let k = 0; k <= 8; k++) { c.globalAlpha = .96 * GA; c.beginPath(); c.arc(TX[k], TY[k], TRr[k], 0, TAU); c.fill(); }
      const tl = (dy, w, col, al) => { c.globalAlpha = al * GA; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); for (let k = 0; k <= 8; k++) k ? c.lineTo(TX[k], TY[k] + dy * TRr[k]) : c.moveTo(TX[k], TY[k] + dy * TRr[k]); c.stroke(); };
      tl(.62, .55 * r0, '#9C4A1E', .5); tl(.1, .8 * r0, '#F6C452', .35);
      for (let k = 1; k <= 8; k += 2) { const an = Math.atan2(TY[k] - TY[k - 1], TX[k] - TX[k - 1]); B(c, TX[k] - .15 * TRr[k], TY[k] - .5 * TRr[k], an, 3.2 * hk, .45 * TRr[k], k % 4 === 1 ? '#FFF4CC' : '#FFE8A8', .88); }
    }
  }
  function drawOver(c, ox, oy, S, t) {
    const ph = S.ph, th = S.th;
    if (ph < TI) { c.globalAlpha = GA; blit(c, B0, 0, 0, ox, oy); ball(c, ox, oy, GH, S.bx[1]); ball(c, ox, oy, GW, S.bx[0]); return; }
    // the honey glass, at the back: what is left inside, the glass, the honey outside, its ball
    const kH = ss(.6, .95, th);   // the honey hands over from its standing look to its lying look while the glass falls
    if (kH < 1) { const ga = GA; GA = ga * (1 - kH); liquid(c, ox, oy, GH, th, 0, GH.A0, 0); GA = ga; }
    if (kH > 0) honeyIn(c, ox, oy, GH, th, S.hH, kH);
    glass(c, ox, oy, GH, th);
    honeyOut(c, ox, oy, S, t);
    ball(c, ox, oy, GH, S.bx[1]);
    // the water glass in front, its gush and burst, its ball
    liquid(c, ox, oy, GW, th, S.wPhi, S.wA, 1); glass(c, ox, oy, GW, th);
    if (ph < TLAND + 1) { unit(c, ox, oy); gush(c, ph); drops(c, GU, ph, GW.s, 0); drops(c, SPL, ph, GW.s, 1);
      const u = (ph - TLAND + .01) / .3; if (u > 0 && u < 1) { c.globalAlpha = .9 * sq(1 - u) * ss(0, .08, u) * GA; scaled(c, SLP, SLX - 6, SLY, .35 + .9 * u, .5 + .6 * u, ox, oy); } }
    ball(c, ox, oy, GW, S.bx[0]);
    c.globalAlpha = 1;
  }

  /* the standing glasses, the state each loop starts from, painted once (the honey glass behind) */
  const B0 = mkb(50, 160, 252, 272);
  for (const g of [GH, GW]) { liquid(B0.c, B0.ox, B0.oy, g, 0, 0, g.A0, g.wat); glass(B0.c, B0.ox, B0.oy, g, 0); }

  /* ---------- live layer ---------- */
  function frame(t) {
    const ph = ((t % T) + T) % T, fade = ph < FADE0 ? 0 : ph < FADE0 + 1 ? s5(ph - FADE0) : 1, S = fade >= 1 ? S0 : state(ph);
    X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'source-over'; X.globalAlpha = 1; X.drawImage(BS.o, 0, 0);
    X.setTransform(KX, 0, 0, KY, 0, 0); X.lineCap = 'round';
    for (const [x, y, l, w, col, a, f, p] of SPK) { const k = Math.sin(TAU * f * t + p); if (k > .05) D(X, x + .5 * Math.sin(TAU * t / 7 + p), y, 0, l, w, col, a * k * k); }
    for (const [x, y, an, l, w, col, a, f, p] of FLK) { const k = Math.sin(TAU * f * t + p); if (k > .05) B(X, x, y, an, l, w, col, a * k); }
    X.globalAlpha = 1;
    if (fade > 0 && fade < 1) {
      /* the cross-fade: everything the two states share is drawn once; what differs is drawn at its share of the fade */
      GA = 1 - fade; drawUnder(X, 0, 0, S, t); GA = fade; drawUnder(X, 0, 0, S0, t); GA = 1; drawDap(X, 0, 0, t);
      GA = 1 - fade; drawOver(X, 0, 0, S, t); GA = fade; drawOver(X, 0, 0, S0, t); GA = 1;
    } else { drawUnder(X, 0, 0, S, t); drawDap(X, 0, 0, t); drawOver(X, 0, 0, S, t); }
    X.globalAlpha = 1;
  }
  return { frame };
}

window.Vignettes = window.Vignettes || {};
window.Vignettes.pvwm = {
  title: 'Water and Honey', aspect: 4 / 3,
  create: function (canvas) { let st = build(canvas); return { frame: function (t) { st.frame(t); }, resize: function () { st = build(canvas); } }; }
};
})();
