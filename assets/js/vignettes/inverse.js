/* Stepping Stones (Learning Generalizable Neural Operators for Inverse Problems). A stream between a sunlit meadow
   and a shady wood, after Monet's river pictures around Giverny, as a 4:3 landscape. The water cannot be crossed
   where you like, only on a handful of stones: the paper maps one space of functions to another through a few
   coefficients of a basis learned on each side, never through the functions themselves. The two banks are painted
   in two hands, round flower dabs in the meadow and long upright strokes in the wood. A walker in white crosses
   from the meadow (what was observed) into the wood (what caused it). Past the last stone the path fans into three
   trails and on each crossing she takes a different one: an ill-posed inverse has several plausible answers.
   Design space is 400 x 300, horizon at 78; things on the ground shrink with their height above the bottom edge.
   Painted once: an opaque still canvas (sky, far fields, water, meadow), the water alone (for its shimmer), and two
   transparent layers of the wood, one behind the walker (the depth of the wood, its floor and trails, the stones)
   and one in front of her (the near trunks, the canopy, the reeds). Each frame lays the still canvas, drifts the
   clouds behind the canopy, sways the water in strips and paints a small live layer: glints, leaves riding the
   current between the stones, wakes below them, a ring where she lands, flecks of sun on the wood floor, the
   walker, and a few nodding flowers. With motion reduced, frame(6) shows her resting on the fourth stone. */
(function () {
  'use strict';
  window.Vignettes = window.Vignettes || {};
  const PI = Math.PI;
  const mb = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const hs = (i, j) => { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; };
  const lp = (a, b, t) => a + (b - a) * t, cl = (v, a, b) => v < a ? a : v > b ? b : v;
  const ss = (a, b, x) => { const t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const vn = (x, y) => { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return lp(lp(hs(i, j), hs(i + 1, j), a), lp(hs(i, j + 1), hs(i + 1, j + 1), a), b); };
  const fb = (x, y) => .6 * vn(x, y) + .3 * vn(x * 2.3 + 5.1, y * 2.3 + 1.7) + .1 * vn(x * 5.1 + 9.3, y * 5.1 + 3.1);
  const hx = s => [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  const pl = s => s.split(' ').map(hx);
  const mx = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgb = q => 'rgb(' + (cl(q[0], 0, 255) | 0) + ',' + (cl(q[1], 0, 255) | 0) + ',' + (cl(q[2], 0, 255) | 0) + ')';
  const ip = (P, x) => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) return lp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; };
  const ramp = (st, t) => { if (t <= st[0][0]) return st[0][1]; for (let i = 1; i < st.length; i++) if (t <= st[i][0]) return mx(st[i - 1][1], st[i][1], (t - st[i - 1][0]) / (st[i][0] - st[i - 1][0])); return st[st.length - 1][1]; };
  /* polylines: a smooth curve through points, its running length, and the point a fraction u along it */
  const cr = (P, k) => { const O = [], f = (a, b, c, d, t) => .5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
    for (let i = 0; i < P.length - 1; i++) { const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], d = P[Math.min(P.length - 1, i + 2)]; for (let j = 0; j < k; j++) O.push([f(a[0], b[0], c[0], d[0], j / k), f(a[1], b[1], c[1], d[1], j / k)]); }
    O.push(P[P.length - 1]); return O; };
  const plen = P => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return L; };
  const pat = (P, L, u) => { const d = cl(u, 0, 1) * L[L.length - 1]; let i = 1; while (i < P.length - 1 && L[i] < d) i++; const f = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return [lp(P[i - 1][0], P[i][0], f), lp(P[i - 1][1], P[i][1], f)]; };

  /* One brush dab: blunt tail, tapered head, slight belly. */
  function dab(c, x, y, a, l, w, col, al, bd) {
    const ca = Math.cos(a), sa = Math.sin(a), h = l / 2, nx = -sa, ny = ca, q = w / 2, b = (bd || 0) * l,
      tx = x - ca * h, ty = y - sa * h, ex = x + ca * h, ey = y + sa * h, cx = x + nx * b, cy = y + ny * b;
    c.globalAlpha = al; c.fillStyle = col; c.beginPath(); c.moveTo(tx + nx * q, ty + ny * q);
    c.quadraticCurveTo(cx + nx * q * 1.4, cy + ny * q * 1.4, ex - ca * q * .3, ey - sa * q * .3);
    c.quadraticCurveTo(cx - nx * q * 1.4, cy - ny * q * 1.4, tx - nx * q, ty - ny * q);
    c.quadraticCurveTo(tx - ca * q * 1.3, ty - sa * q * 1.3, tx + nx * q, ty + ny * q); c.fill();
  }

  /* Palettes */
  const SKYS = [[0, hx('5E92CE')], [.3, hx('74A4D9')], [.55, hx('90B7E2')], [.78, hx('B2CDE8')], [.92, hx('CDDBE2')], [1, hx('E2E1D2')]];
  const LAV = hx('A0A6DC'), GRB = hx('9CCAD6'), PNK = hx('ECD6D0'), HAZ = [170, 188, 206];
  const CW = pl('FFF8E8 FCF0DA FFF4E0 FAEBD2 FFFBF2'), CMd = pl('F1EEEC ECE9EE F4EEE4 E8E6EC EEEAE6'), CLg = pl('DEDBE6 D8D7E6 E3DCE0 D6D8E6'), CSd = pl('CBCADF C4C6DE CFC7DA C0C4DE'), CBs = pl('B6B8D8 B0B6D6 BCB8D6'), CPk = pl('ECD8D2 E9D3CE F0DCD0');
  const HZP = pl('9AA8CC 8E9CC8 A7A6CF B7AACB A9B4D2');
  const GOLDF = hx('DCCB7C'), LAVF = hx('A8AED0');
  /* foliage: sunlit, middle, shade, deep shade */
  const FOL = pl('B9C46A C2C26A A8BE62 D2C46A 9DBA62 C8CC72'), FOM = pl('7FA35A 6E9A56 86A062 94A866 72925A'), FOS = pl('4E7E62 4A6E7A 5E6E96 56708A 4E6A6A 5A7A70'), FOD = pl('3E5A6E 45527E 3A5660 4A4E7A 3C6058'),
    DEEP = pl('34506A 3C4A76 2E4E5A 44487A'), WIL = pl('CDD080 D6D488 C2CC78 DAD890');
  /* trunks: sunlit edge, body, shaded side */
  const TRL = pl('EADCC2 E2D0B4 F0E4CC DCC8AA'), TRM = pl('A89AB0 9E94B4 B0A2B0 9C98B8'), TRS = pl('6E6890 62628A 7A6E92 585C84');
  /* the floor of the wood in shade, and where the sun gets through; the trails */
  const FLS = pl('56688A 5E6E96 4E6A6A 4A6E7A 6A6A9A 5A7A6E 64749C'), FLD = pl('D9CC7A E4D68A C8C86A EBD99A B8C870');
  const TRLT = pl('E8D8AE F0E2BC E0CCA0 EADBB6'), TRSH = pl('B4A8C4 A89EC0 C0B2C8');
  const EARTH = pl('B89868 A88A6A C4A478 9A7E72'), WLINE = pl('3E4E7A 45567E 3A5670');
  /* the meadow */
  const MZ = [[0, hx('C4CE8C')], [.25, hx('B0C66A')], [.6, hx('96B652')], [1, hx('7EA648')]], GOLDM = hx('D8C460'), COOLM = hx('6E90A0');
  const MW = pl('DCC05A E4B64C D2BE66 E6CA6C'), MC = pl('6E7EAC 7A8AB4 8690BE 7090AA'), MDK = pl('557A3E 4E7246 5E8048'), PALE = hx('CCD474');
  const GRL = pl('B7C66A C6CA72 AABF5E D4CE76 BFCB6E'), GRM = pl('80A44E 8BAB53 739A4A 92AE58'), GOLDP = pl('E4C66C D9BA5C ECD282 CCAA54 F1DA92'), STEMC = pl('5E8A4A 668E4E 587E52 6A8A50');
  const PTHL = pl('EAD9A8 E4CC96 F0E2BC DCC48E E8D2B0'), PTHS = pl('BCA8C4 B0A0C0 C8B4C4');
  /* its flowers, each a round touch: daisies, buttercups, campion, cornflowers */
  const FLW = [{ c: pl('FBF6EA FFFBF2 F6F0E4'), d: pl('D6D2E6 CBC8E2'), o: 1.3, k: 1 }, { c: pl('F6D95C F2CE48 FAE272'), d: pl('E0B040 D6A63A'), o: 7.9, k: 1 },
    { c: pl('EE9CB0 F2ACBC E88CA4'), d: pl('CC6E90 D47C98'), o: 13.1, k: .8 }, { c: pl('9E94DC A89EE2 8E8AD4'), d: pl('6E66B8 7A70C0'), o: 21.7, k: .7 }];
  /* the stones: sunlit top, top, shaded top; lit side, dark side; their shadow on the water */
  const STL = pl('F6EEDC F2E6D2 FAF2E4 EEDFCC'), STM = pl('E0D6CC D8D0D2 E6DACA'), STS = pl('BEB8D0 C6BECE B2B0CC'), SDL = pl('9A8FA8 8E88A6 A4949E'), SDD = pl('5E5A88 54547E 6A5E86 4E5A7A'), STR = pl('3E4E86 46568E 39507A 4A4C84');
  /* the walker */
  const FIG = { sk: hx('FBF5E8'), skS: hx('C4C2E0'), skF: hx('FFFDF6'), hem: hx('DEDAEC'), to: hx('FFFBF0'), toS: hx('CCC8E2'), sash: hx('D9705A'), armL: hx('ECE7F2'), armS: hx('BCBAD8'),
    hair: hx('6E4E3A'), brim: hx('E6C878'), brimS: hx('A88A5E'), crown: hx('F2E0A2'), rib: hx('C8553D') }, SHD = hx('66709E');

  /* Wind over the meadow: two gust trains travel left to right, each a narrow bump with a small recoil behind it. */
  const b4 = p => { let s = .5 + .5 * Math.sin(p); s *= s; return s * s; }, b8 = p => { const s = b4(p); return s * s; };
  const wind = (g, t) => { const e1 = .78 + .22 * Math.sin(.093 * t + 1.3), e2 = .62 + .38 * Math.sin(.061 * t + .4), p1 = .0105 * g - .8 * t, p2 = .0172 * g - 1.21 * t + 2.1;
    return .05 * Math.sin(.7 * t + g * .004) + .3 * e1 * (b4(p1) - .3 * b4(p1 + .9)) + .17 * e2 * (b8(p2) - .3 * b8(p2 + .8)); };

  /* One crossing lasts LOOP seconds: TWALK to walk in, TON onto the first stone, PAUSE resting on each stone and STEP to
     the next, then TTR along one of the trails (SEQ says which, crossing by crossing). T0 sets where the loop starts. */
  const LOOP = 29, T0 = 5.75, TWALK = 5.6, TON = .6, PAUSE = .95, STEP = .75, TTR = 6.5, SEQ = [1, 0, 2, 0, 2, 1], NS = 8;
  const A0 = TWALK + TON, aK = k => A0 + k * (PAUSE + STEP), TLAND = aK(NS - 1) + PAUSE + STEP;

  function build(cv) {
    const W = Math.max(40, cv.clientWidth || 400), H = Math.max(30, cv.clientHeight || 300);
    const dp = Math.min(2, window.devicePixelRatio || 1);
    const PW = Math.max(1, Math.round(W * dp)), PH = Math.max(1, Math.round(H * dp));
    cv.width = PW; cv.height = PH;
    const X = cv.getContext('2d');
    const S = W / 400, DS = dp * S, DH = H / S;
    let R = mb(1);
    const sd = n => { R = mb(n * 7919 + 13); }, rr = (a, b) => a + (b - a) * R(), pk = a => a[Math.floor(R() * a.length)];
    const cj = (q, j) => 'rgb(' + (cl(q[0] + (R() - .5) * 2 * j, 0, 255) | 0) + ',' + (cl(q[1] + (R() - .5) * 2 * j, 0, 255) | 0) + ',' + (cl(q[2] + (R() - .5) * 2 * j, 0, 255) | 0) + ')';
    const mk = (w, h, opaque) => { const o = document.createElement('canvas'); o.width = Math.max(1, w); o.height = Math.max(1, h); const c = o.getContext('2d', opaque ? { alpha: false } : undefined); c.lineCap = 'round'; c.lineJoin = 'round'; return [o, c]; };
    const layer = opaque => { const L = mk(PW, PH, opaque); L[1].setTransform(DS, 0, 0, DS, 0, 0); return L; };

    /* Geometry. The stream runs off to the far left: both banks leave one vanishing point on the horizon. */
    const HZ = 78, VX = -200, KF = .1856, KN = .438;
    const sc = y => cl((y - HZ) / 222, .03, 1.4);
    const FT = new Float32Array(452), NT = new Float32Array(452);
    for (let i = 0; i < 452; i++) { const x = i - 25; FT[i] = HZ + KF * (x - VX) + 4.5 * Math.sin(x * .0125 + 1.2) + 2.2 * Math.sin(x * .031 + .6) + (vn(x * .05, 3.1) - .5) * 2.4;
      NT[i] = HZ + KN * (x - VX) + 8 * Math.sin(x * .0115 + .4) + 3 * Math.sin(x * .027 + 2.2) + (vn(x * .04, 7.7) - .5) * 4; }
    const tab = T => x => { const f = cl(x + 25, 0, 450.999), i = f | 0; return lp(T[i], T[i + 1], f - i); };
    const Fy = tab(FT), Ny = tab(NT);                                        // far bank, near bank
    const WTop = x => Fy(x) - (Fy(x) - HZ) * .5 * ss(215, 262, x);           // back edge of the wood floor
    const XE = [[-6, 279], [30, 253], [60, 257], [78, 263], [100, 270], [110, 258], [130, 250]];
    const xe = y => ip(XE, y) + (vn(y * .09, 5.5) - .5) * 6;                 // the left edge of the wood's solid depth

    /* The stones, evenly spaced on the ground, so closer together with distance. y is the top face, where she stands. */
    const ST = []; sd(5);
    const SY0 = Ny(181) - 8.5, SY1 = Fy(279) + 6.5;
    for (let k = 0; k < NS; k++) { const u = lp(1 / (SY0 - HZ), 1 / (SY1 - HZ), k / (NS - 1)), y = HZ + 1 / u, x = 181 + 98 * (SY0 - y) / (SY0 - SY1), s = sc(y), e = k > 0 && k < NS - 1 ? 1 : .3;
      ST.push({ x: x + rr(-1.6, 1.6) * s * e, y: y + rr(-1, 1) * s * e, s: s, w: rr(21, 26) * s, h: rr(6.6, 8) * s, th: rr(2.6, 3.4) * s, seed: 60 + k, sh: ss(.5, 1, k / (NS - 1)) }); }
    for (const st of ST) { const f = Fy(st.x), fr = (st.y - f) / (Ny(st.x) - f), sl = lp(KF, KN, fr), m = Math.hypot(1, sl); st.fr = fr; st.dx = 1 / m; st.dy = sl / m; }
    /* The path through the meadow, the landing, and the three trails beyond it. */
    const gl = P => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]) / sc((P[i][1] + P[i - 1][1]) / 2)); return L; };   // length on the ground
    const WP = cr([[-8, 384], [18, 342], [46, 311], [78, 292], [112, 277], [145, 263], [171, Ny(171) + 5]], 6), WL = plen(WP), WG = gl(WP), LD = [291, Fy(291) - 5.5];
    const TR = [[[-14, -8], [-27, -16.5], [-37, -24.5], [-43, -31]], [[5, -12.5], [11, -23.5], [19, -31], [26, -36]], [[21, .5], [45, 4.5], [71, 11.5], [99, 21.5], [125, 32.5]]].map(T => cr([LD].concat(T.map(q => [LD[0] + q[0], LD[1] + q[1]])), 6)), TL = TR.map(plen), TG = TR.map(gl);
    const pathD = (x, y) => { let m = 9; for (let i = 0; i < WP.length; i++) { const p = WP[i], hw = 8.5 * sc(p[1]), dx = (x - p[0]) / hw, dy = (y - p[1]) / (hw * .55), d = dx * dx + dy * dy; if (d < m) m = d; } return Math.sqrt(m); };

    /* ---------- the still canvas: sky and the far fields (water and meadow are added below) ---------- */
    const BG = layer(true), B = BG[1];
    B.fillStyle = '#ECDDBC'; B.fillRect(-5, -5, 410, DH + 10);
    (function () {
      const g = B.createLinearGradient(0, 0, 0, HZ + 4);
      g.addColorStop(0, '#5F92CE'); g.addColorStop(.35, '#7FACDC'); g.addColorStop(.72, '#ABC9E6'); g.addColorStop(1, '#DDE0D2');
      B.globalAlpha = 1; B.fillStyle = g; B.fillRect(-5, -5, 410, HZ + 8);
      sd(11);
      for (let i = 0; i < 820; i++) {
        const x = rr(-8, 300), y = Math.pow(R(), 1.1) * (HZ + 6) - 6, t = cl(y / HZ, 0, 1), n = fb(x / 60 + 2, y / 24), r = R();
        let q = ramp(SKYS, cl(t + (n - .5) * .24 + rr(-.04, .04), 0, 1));
        if (r < .08) q = mx(q, LAV, .5); else if (r < .13) q = mx(q, GRB, .4); else if (r < .2 && t > .72) q = mx(q, PNK, .5);
        dab(B, x, y, -.48 + rr(-.32, .32) + (R() < .2 ? .85 : 0), lp(15, 6.5, t) * rr(.7, 1.3), lp(5.5, 2.4, t) * rr(.8, 1.2), cj(q, 5), rr(.5, .78), rr(-.08, .08));
      }
      /* low blue hills under the sky */
      sd(21);
      const HL = x => 74 - 13 * Math.pow(fb(x * .009 + 4, 1.7), 1.6) - 5 * ss(210, 30, x), HL2 = x => 76.5 - 4.5 * fb(x * .021 + 9, 5.5);
      B.globalAlpha = 1; B.fillStyle = '#AEB8D6'; B.beginPath(); B.moveTo(-6, HZ + 2); for (let x = -6; x <= 304; x += 4) B.lineTo(x, HL(x)); B.lineTo(304, HZ + 2); B.closePath(); B.fill();
      for (let i = 0; i < 520; i++) { const x = rr(-8, 300), y = rr(56, HZ + 2), h = HL(x); if (y < h) continue;
        dab(B, x, y, rr(-.25, .15), rr(3.5, 7), rr(1.3, 2), cj(mx(pk(HZP), hx('CCD5E6'), .55 * ss(h + 5, h, y)), 4), rr(.6, .85)); }
      for (let i = 0; i < 420; i++) { const x = rr(-8, 300), y = rr(70, HZ + 2), h = HL2(x); if (y < h) continue;
        dab(B, x, y, rr(-PI, PI), rr(2.4, 4), rr(1.3, 1.9), cj(mx(y < h + 2 ? pk(FOM) : pk(FOS), HAZ, .52), 4), rr(.65, .88)); }
      /* fields beyond the stream, in bands that run to the same vanishing point as its banks: pasture, wheat, grass,
         and the bank's own meadow; hedgerows part them, with a round tree here and there */
      const BND = [[0, hx('BFCBB6')], [.04, hx('C4CFAC')], [.046, hx('EAD27A')], [.08, hx('E4CA6C')], [.086, hx('A9C56C')], [.125, hx('9FBE60')], [.131, hx('BBCD7E')], [.2, hx('AEC66E')]];
      const g2 = B.createLinearGradient(0, HZ, 0, 150); g2.addColorStop(0, '#C9CFAE'); g2.addColorStop(.4, '#BFCB8E'); g2.addColorStop(1, '#A9C06C');
      B.globalAlpha = 1; B.fillStyle = g2; B.beginPath(); B.moveTo(-6, HZ - 1); B.lineTo(304, HZ - 1); for (let x = 304; x >= -6; x -= 4) B.lineTo(x, Fy(x) + 2); B.closePath(); B.fill();
      for (let i = 0; i < 1700; i++) {
        const x = rr(-8, 290), y = rr(HZ - 1, 166); if (y > Fy(x) + 1) continue;
        const s = sc(y), sl = (y - HZ) / (x - VX), n = fb(x / 40 + 3, y / 7); let q = ramp(BND, sl + (fb(x / 30, 2.2) - .5) * .008);
        if (n > .62) q = mx(q, GOLDF, Math.min(.45, (n - .62) * 3)); else if (n < .4) q = mx(q, sl > .13 ? hx('D2A6C4') : LAVF, Math.min(.5, (.4 - n) * 2.6));
        dab(B, x, y, Math.atan(sl) + rr(-.1, .1), (3 + 20 * s) * rr(.7, 1.3), (1 + 4.6 * s) * rr(.8, 1.2), cj(q, 6), rr(.72, .92), rr(-.06, .06));
      }
      sd(22);
      for (const sl of [.043, .083, .128]) {
        for (let x = -10; x < 262; x += rr(1.6, 3.4)) {            // the hedge itself: a low dark ribbon, broken by gateways
          if (fb(x / 26 + sl * 70, 8.8) < .34) continue;
          const y = HZ + sl * (x - VX), s = sc(y), up = R() < .45;
          dab(B, x, y - (up ? 1.6 + 5 * s : 0) * rr(.5, 1), Math.atan(sl) + rr(-.2, .2), (4 + 12 * s) * rr(.8, 1.2), (1.5 + 4.4 * s) * rr(.8, 1.2), cj(mx(up ? (R() < .5 ? pk(FOL) : pk(FOM)) : pk(FOS), HAZ, .36 - sl * 1.7), 5), .88, rr(-.1, .1));
        }
        for (let x = rr(0, 30); x < 250; x += rr(22, 60)) {         // round trees standing in it
          const y = HZ + sl * (x - VX), s = sc(y), r = (9 + 26 * s) * rr(.7, 1.15), cy = y - r * .95;
          for (let i = 0; i < r * r * 1.1; i++) { const u = rr(-1, 1), v = rr(-1, 1); if (u * u + v * v > 1) continue; const li = -(u * .62 + v * .78) + rr(-.3, .3);
            dab(B, x + u * r, cy + v * r * .9, rr(-PI, PI), (2 + 5 * s) * rr(.8, 1.2), (1.2 + 3 * s) * rr(.8, 1.2), cj(mx(li > .35 ? pk(FOL) : li > -.15 ? pk(FOM) : pk(FOS), HAZ, .34 - sl * 1.6), 5), .9, rr(-.2, .2)); }
        }
      }
    })();

    /* ---------- the wood, behind the walker ---------- */
    const FA = layer(false), Ac = FA[1];
    (function () {
      sd(31);
      /* its depth: a wall of leaves in shade, solid from its left edge on, so the clouds pass behind it */
      Ac.globalAlpha = 1; Ac.fillStyle = '#42586C'; Ac.beginPath(); for (let y = -6; y <= 128; y += 4) Ac.lineTo(xe(y), y); for (let x = 246; x <= 414; x += 4) Ac.lineTo(x, WTop(x) + 3); Ac.lineTo(414, -6); Ac.closePath(); Ac.fill();
      for (let i = 0; i < 2300; i++) {
        const x = rr(240, 412), y = rr(-6, 142), e = xe(y); if (y > WTop(x) + 4 || x < e - rr(0, 5)) continue;
        const dpt = cl((x - e) / 46, 0, 1), n = fb(x / 22 + 7, y / 40) + (1 - dpt) * .22, far = R() < .05 + .1 * (1 - dpt);
        const q = far ? pk(FOL) : n > .68 ? pk(FOM) : n > .5 ? pk(FOS) : n > .34 ? pk(FOD) : pk(DEEP);
        dab(Ac, x, y, -PI / 2 + rr(-.16, .16), rr(8, 16), rr(1.5, 2.8), cj(q, 6), far ? rr(.35, .6) : rr(.72, .92), rr(-.08, .08));
      }
      /* the floor: cool shade, a few flecks of sun, and a sunlit clearing where the stones land */
      sd(32);
      Ac.globalAlpha = 1; Ac.fillStyle = '#4E6480'; Ac.beginPath(); for (let x = 205; x <= 414; x += 4) Ac.lineTo(x, WTop(x) + 1); for (let x = 414; x >= 205; x -= 4) Ac.lineTo(x, Fy(x) + 1); Ac.closePath(); Ac.fill();
      for (let i = 0; i < 900; i++) {
        const x = rr(205, 412), y = rr(118, 200); if (y < WTop(x) || y > Fy(x) + .5) continue;
        const s = sc(y), c0 = Math.exp(-Math.pow((x - 292) / 24, 2) - Math.pow((y - 159) / 9, 2)), sun = fb(x / 14 + 2, y / 5 + 9) + c0 * .55;
        const q = sun > .8 ? pk(FLD) : sun > .68 ? mx(pk(FLS), pk(FLD), .4) : pk(FLS);
        dab(Ac, x, y, rr(-.15, .15) + .1, (4 + 12 * s) * rr(.7, 1.3), (1.2 + 3.4 * s) * rr(.8, 1.2), cj(q, 6), rr(.75, .92), rr(-.08, .08));
      }
      /* the trails: pale ribbons that thin and fade as they leave the clearing */
      sd(33);
      const trail = (P, Ln, w0, w1, a0, a1) => { const n = Math.ceil(Ln[Ln.length - 1] / 1.1);
        for (let i = 0; i <= n; i++) { const u = i / n, p = pat(P, Ln, u), w = lp(w0, w1, u), sun = fb(p[0] / 9 + 3, p[1] / 5 + 1) + .2 * (1 - u);
          for (let k = 0; k < 2; k++) dab(Ac, p[0] + rr(-.4, .4) * w, p[1] + rr(-.3, .3) * w * .5, rr(-.2, .2) + .1, w * rr(1.3, 1.9), w * rr(.36, .5), cj(sun > .4 ? pk(TRLT) : pk(TRSH), 5), lp(a0, a1, u) * rr(.88, 1), rr(-.08, .08)); } };
      trail(TR[0], TL[0], 5.2, 1.8, .97, .6); trail(TR[1], TL[1], 5.2, 1.7, .97, .6); trail(TR[2], TL[2], 5.2, 7, .97, .85);
      for (let i = 0; i < 60; i++) { const u = rr(-1, 1), v = rr(-1, 1); if (u * u + v * v > 1) continue; dab(Ac, LD[0] + u * 13, LD[1] - 1 + v * 5, rr(-.2, .2) + .1, rr(4, 7), rr(1.4, 2.2), cj(R() < .75 ? pk(TRLT) : pk(FLD), 5), .92); }
      /* slim trunks deeper in the wood, each a few long upright strokes; all stand beyond the trails */
      sd(34);
      for (const [x, yb, h, w] of [[256, 138, 122, 2.2], [270, 133, 126, 2], [284, 140, 130, 2.6], [299, 134, 124, 2.2], [318, 131, 112, 1.8], [328, 140, 140, 2.8], [344, 147, 150, 3], [358, 139, 132, 2.2], [374, 151, 160, 3.2], [388, 146, 150, 2.6], [404, 158, 172, 3.6]]) {
        const lean = rr(-.02, .02);
        for (let i = 0, n = Math.ceil(h / 5); i < n; i++) { const v = R(), u = rr(-.5, .5), lit = -u * 2 + rr(-.4, .4) - .45, ww = w * (1 - .55 * v);
          dab(Ac, x + lean * v * h + u * ww * .8, yb - v * h, -PI / 2 + lean + rr(-.04, .04), rr(9, 17), Math.max(.8, ww * rr(.4, .6)), cj(lit > .3 ? pk(TRL) : lit > -.5 ? pk(TRM) : pk(TRS), 5), .85 * (1 - .5 * ss(.6, 1, v)), rr(-.03, .03)); }
      }
      /* undergrowth along the back of the floor */
      for (let i = 0; i < 380; i++) { const x = rr(232, 412), y = WTop(x) + rr(-7, 3), r = R(); dab(Ac, x, y, -PI / 2 + rr(-.6, .6), rr(3, 6), rr(1.5, 2.4), cj(r < .14 ? pk(FOL) : r < .45 ? pk(FOM) : pk(FOS), 6), .88, rr(-.2, .2)); }
      /* the far bank: sunny grass at the left, earth and dark grass under the wood, and its line on the water */
      sd(35);
      for (let x = -12; x < 414; x += rr(1.5, 3)) { const y = Fy(x), s = sc(y), wd = ss(140, 215, x), r = R();
        dab(Ac, x, y - rr(0, 4.4) * s, .18 + rr(-.2, .2), rr(4, 8) * (s + .25), rr(1.4, 2.4) * (s + .3), cj(R() < wd ? (r < .4 ? pk(EARTH) : pk(FOS)) : (r < .25 ? pk(GOLDP) : pk(GRL)), 6), .9);
        dab(Ac, x, y + .9 * s + .4, .18 + rr(-.05, .05), rr(4, 8) * (s + .25), s + .5, cj(pk(WLINE), 5), .6); }
    })();

    /* ---------- the wood, in front of the walker ---------- */
    const FB = layer(false), Fc = FB[1];
    const crown = (c, cx, cy, rx, ry, n, k, hz, sp) => {
      for (let i = 0; i < n; i++) {
        const x = cx + rr(-1.2, 1.2) * rx, y = cy + rr(-1.15, 1.1) * ry, ex = (x - cx) / rx, ey = (y - cy) / ry;
        if (ex * ex + ey * ey > 1 + (fb(x / 6 + cx, y / 6) - .5) * 1.1) continue;
        const li = -(ex * .62 + ey * .78) + rr(-.35, .35) + (fb(x / 14 + 3, y / 11) - .5) * .9;
        let q = li > .42 ? pk(FOL) : li > -.08 ? pk(FOM) : li > -.55 ? pk(FOS) : pk(FOD); if (hz) q = mx(q, HAZ, hz);
        const w = (i < n * .3 ? rr(2.4, 3.4) : rr(1.4, 2.2)) * k;
        dab(c, x, y, -PI / 2 + rr(-sp, sp), w * rr(2.1, 3.3), w, cj(q, 6), .9, rr(-.15, .15));
      }
    };
    /* A trunk: a tapering body, then long upright strokes, warm on the sunlit left and violet on the right. */
    const trunk = (c, x, yb, h, wB, lean, shade) => {
      const n = Math.ceil(h / 9), cxAt = v => x + lean * v * h + (vn(v * 3 + x * .13, 1.7) - .5) * wB * 1.1 * v, wAt = v => wB * (1 - .6 * v) * (v < .08 ? 1 + (.08 - v) * 6 : 1);
      c.globalAlpha = 1; c.fillStyle = '#8E86A8'; c.beginPath();
      for (let i = 0; i <= n; i++) { const v = i / n; c.lineTo(cxAt(v) - wAt(v) / 2, yb - v * h); }
      for (let i = n; i >= 0; i--) { const v = i / n; c.lineTo(cxAt(v) + wAt(v) / 2, yb - v * h); }
      c.closePath(); c.fill();
      for (let i = 0, m = Math.ceil(h / 6 * (wB > 4 ? 3 : 2)); i < m; i++) { const v = R(), u = rr(-.5, .5), lit = -u * 2 + rr(-.35, .35) - shade;
        dab(c, cxAt(v) + u * wAt(v) * .85, yb - v * h, -PI / 2 + lean + rr(-.05, .05), rr(10, 19), Math.max(.9, wAt(v) * rr(.3, .46)), cj(lit > .45 ? pk(TRL) : lit > -.25 ? pk(TRM) : pk(TRS), 5), .92, rr(-.03, .03)); }
    };
    (function () {
      sd(41);
      /* growth along the far bank: a low hedge at the left, hazier with distance, rising to bushes before the wood */
      for (let i = 0; i < 1500; i++) {
        const x = rr(-10, 252), yb = Fy(x) - 1, hh = (4 + 10 * fb(x / 16 + 1, 4.4)) * lp(.7, 1.5, cl(x / 150, 0, 1)) + 16 * ss(150, 250, x) * fb(x / 11 + 5, 2.2), v = Math.pow(R(), 1.3), y = yb - v * hh, li = v * .9 - .35 + rr(-.3, .3) + (fb(x / 9, 1.1) - .5) * .5;
        dab(Fc, x, y, x < 150 ? rr(-PI, PI) : -PI / 2 + rr(-.5, .5), rr(2.6, 4.4), rr(1.5, 2.4), cj(mx(li > .3 ? pk(FOL) : li > -.1 ? pk(FOM) : pk(FOS), HAZ, .24 * (1 - cl(x / 150, 0, 1))), 6), .9, rr(-.2, .2));
      }
      /* a willow leaning over the water, then two young poplars */
      sd(42);
      { const x = 170, yb = Fy(x) - 1;
        for (let i = 0; i < 8; i++) dab(Fc, x + 2 + rr(-.6, .6), yb - rr(0, 12), -PI / 2 + rr(-.1, .1) - .12, rr(4, 7), rr(1.1, 1.6), cj(pk(TRM), 5), .9);
        for (let i = 0; i < 330; i++) { const u = rr(-1, 1), v = rr(-1, 1); if (u * u + v * v > 1 + (fb(u * 3 + 2, v * 3) - .5) * .8) continue; const li = -(u * .55 + v * .8) + rr(-.3, .3);
          dab(Fc, x + u * 17, yb - 17 + v * 14, PI / 2 + u * .5 + rr(-.2, .2), rr(5, 9), rr(1.2, 1.9), cj(li > .3 ? pk(WIL) : li > -.2 ? pk(FOL) : pk(FOM), 6), .9, rr(-.15, .15) + u * .1); } }
      for (const [x, h, rx] of [[207, 74, 6.5], [226, 90, 7.5]]) { const yb = Fy(x) - 1;
        for (let i = 0; i < 9; i++) dab(Fc, x + rr(-.4, .4), yb - rr(0, .32) * h, -PI / 2 + rr(-.05, .05), rr(5, 8), rr(1, 1.5), cj(R() < .35 ? pk(TRL) : pk(TRM), 5), .9);
        crown(Fc, x, yb - h * .58, rx, h * .44, rx * h * 1.1, .8, .03, .14); }
      /* the wood's first row of trunks: two flank the landing like a gate, the rest stand to its right */
      sd(43);
      for (const [x, h, w, lean, sh] of [[262, 150, 3.6, .012, 0], [312, 205, 5, -.012, .1], [338, 215, 4.4, .008, .25], [362, 232, 5.6, -.006, .25], [391, 255, 7.5, .012, .15]]) trunk(Fc, x, Fy(x) - 1.5, h, w, lean, sh);
      /* the canopy: crowns overlap into one mass, each lit from the upper left, the whole lit along the wood's edge;
         the dark strokes go down first and the sunlit ones over them, all long and upright */
      sd(44);
      const CRN = [[256, 30, 17, 28], [268, 76, 15, 24], [286, 40, 26, 46], [312, 50, 27, 48], [338, 40, 27, 46], [362, 46, 28, 50], [391, 42, 30, 52],
        [280, 96, 13, 12], [300, 84, 18, 15], [322, 100, 15, 13], [344, 88, 20, 16], [368, 104, 16, 12], [388, 92, 20, 18], [408, 106, 12, 12]], LF = [];
      for (let i = 0; i < 6800; i++) {
        const x = rr(234, 414), y = rr(-8, 122); let best = 9, bl = 0;
        for (let j = 0; j < CRN.length; j++) { const c = CRN[j], ex = (x - c[0]) / c[2], ey = (y - c[1]) / c[3], d = ex * ex + ey * ey; if (d < best) { best = d; bl = j < 7 ? -(ex * .62 + ey * .78) : -(ex * .2 + ey * .3) - .42; } }   // the low boughs hang in the shade of the rest
        if (best > 1 + (fb(x / 7 + 3, y / 7) - .5)) continue;
        LF.push([x, y, bl * .7 + .55 * ss(300, 240, x) + (fb(x / 22 + 1, y / 16 + 5) - .5) * 1.1 + rr(-.14, .14) - .12, best]);
      }
      for (let pass = 0; pass < 2; pass++) for (const f of LF) { const li = f[2]; if ((li > .1) !== (pass === 1)) continue;
        const k = lp(.9, 1.3, ss(250, 400, f[0])), q = li > .5 ? pk(FOL) : li > .1 ? pk(FOM) : li > -.35 ? pk(FOS) : pk(FOD);
        dab(Fc, f[0], f[1], -PI / 2 + rr(-.2, .2) + (fb(f[0] / 30, f[1] / 30 + 2) - .5) * .5, rr(7, 13) * k, rr(1.5, 2.5) * k, cj(q, 6), .9, rr(-.12, .12)); }
      for (const f of LF) if (f[3] > .72 && f[0] < 300 && f[1] < 74 && R() < .1) dab(Fc, f[0], f[1], rr(-PI, PI), rr(3, 5), rr(2, 3), cj(ramp(SKYS, cl(f[1] / HZ, 0, 1)), 4), .85);
      /* reeds along the far bank, upright, leaving the landing clear */
      sd(45);
      for (let i = 0; i < 300; i++) { const x = rr(148, 412); if (Math.abs(x - 289) < 9) continue; const y = Fy(x) + rr(-1, 1.5), s = sc(y), h = rr(4, 10) * s * 1.4, r = R();
        dab(Fc, x, y - h / 2, -PI / 2 + rr(-.22, .22), h, rr(.8, 1.4) * (s + .3), cj(r < .3 ? pk(GOLDP) : r < .62 ? pk(FOM) : pk(FOS), 6), .9, rr(-.1, .1)); }
    })();

    /* ---------- the water: what stands over the far bank, mirrored and shortened, then broken into strokes ---------- */
    const WAT = layer(false), Wc = WAT[1];
    (function () {
      const C = mk(PW, PH, true), c = C[1]; c.drawImage(BG[0], 0, 0); c.drawImage(FA[0], 0, 0); c.drawImage(FB[0], 0, 0);
      const D = c.getImageData(0, 0, PW, PH).data;
      const smp = (x, y) => { const px = cl(Math.round(x * DS), 0, PW - 1), py = cl(Math.round(y * DS), 0, PH - 1), i = (py * PW + px) * 4; return [D[i], D[i + 1], D[i + 2]]; };
      const RC = .55, TE = hx('4A8A8E'), BL = hx('3F7AB8'), DE = hx('2F5C9C'), TU = hx('3E9A9A'), VI = hx('5A5EAA'), LI = hx('CFE0EE'), DK = hx('2C5486'), BKR = hx('4E7A52');
      sd(51);
      Wc.save(); Wc.beginPath(); for (let x = -12; x <= 414; x += 4) Wc.lineTo(x, Fy(x)); for (let x = 414; x >= -12; x -= 4) Wc.lineTo(x, Ny(x)); Wc.closePath(); Wc.clip();
      const g = Wc.createLinearGradient(0, 110, 0, DH); g.addColorStop(0, '#5E8FA6'); g.addColorStop(.35, '#5587BE'); g.addColorStop(1, '#3F6FAE');
      Wc.globalAlpha = 1; Wc.fillStyle = g; Wc.fillRect(-12, 100, 426, DH);
      for (let y = 108; y < DH + 6;) {
        const s0 = sc(y), dy = lp(1.1, 4.4, Math.pow(s0, 1.1));
        for (let x = -12 - rr(0, 8); x < 414;) {
          const l = lp(4, 24, Math.pow(s0, 1.15)) * rr(.6, 1.4), w = lp(1.3, 5.4, s0) * rr(.8, 1.2), yy = y + rr(-.3, .3) * dy, f = Fy(x), nn = Ny(x);
          if (yy < f - 1 || yy > nn + 2) { x += l * .7; continue; }
          const ys = f - (yy - f) / RC - .6 + rr(-1, 1) * (.4 + s0 * 2.2), d = cl((yy - f) / Math.max(8, nn - f), 0, 1), n = fb(x * .016 + 7, yy * .04);
          let base = mx(mx(TE, BL, ss(0, .3, d)), DE, ss(.5, 1, d) * .55);
          if (n > .56) base = mx(base, TU, Math.min(.5, (n - .56) * 1.6)); else if (n < .38) base = mx(base, VI, (.38 - n) * 1.1);
          let col = mx(smp(x + rr(-.3, .3) * l, ys), base, cl(lp(.3, .55, ss(0, .8, d)) + rr(-.08, .08), 0, 1));
          col = [col[0] * .93, col[1] * .95, col[2] * .99];
          const nb = (nn - yy) / (9 * s0); if (nb < 1) col = mx(col, BKR, (1 - nb) * .5);
          const rp = vn(x * .04 + 3, yy * .22), ck = lp(1.2, 1.9, s0);
          if (rp > .68) col = mx(col, LI, Math.min(.6, (rp - .68) * ck)); else if (rp < .3) col = mx(col, DK, Math.min(.5, (.3 - rp) * ck));
          dab(Wc, x, yy, .08 + rr(-.04, .04), l, w, rgb(col), rr(.82, .95), rr(-.08, .08));
          x += l * rr(.5, .85);
        }
        y += dy;
      }
      /* clouds on the water, and the dark each stone leaves below itself */
      sd(52);
      for (const [cx, cy, rx, ry, n] of [[118, 178, 34, 9, 30], [226, 238, 44, 12, 36]]) for (let i = 0; i < n; i++) { const u = rr(-1, 1), v = rr(-1, 1), e = u * u + v * v; if (e > 1) continue; const y = cy + v * ry, s = sc(y);
        dab(Wc, cx + u * rx, y, .08, rr(8, 16) * (s + .2), rr(1.6, 2.6) * (s + .3), cj(v < 0 ? hx('F4EEE4') : hx('D9D6E6'), 4), rr(.25, .5) * (1 - e * .6), 0); }
      for (const st of ST) { sd(st.seed + 20); const yb = st.y + st.h / 2 + st.th; for (let i = 0; i < 9; i++) { const v = R();
        dab(Wc, st.x + rr(-.5, .6) * st.w + v * st.w * .25, yb + v * st.h * 1.5 + rr(-.3, .3), .1 + rr(-.05, .05), st.w * rr(.35, .6), st.h * rr(.22, .34), cj(pk(STR), 5), lp(.7, .3, v)); } }
      Wc.restore();
    })();
    B.setTransform(1, 0, 0, 1, 0, 0); B.globalAlpha = 1; B.drawImage(WAT[0], 0, 0); B.setTransform(DS, 0, 0, DS, 0, 0);

    /* ---------- the meadow: rows of strokes from far to near, flowers placed where their drifts ask ---------- */
    const mdc = (x, y) => { const z = cl(sc(y), 0, 1), n = fb(x / (26 + 60 * z) + 3, y / (8 + 26 * z)); let q = ramp(MZ, ss(.33, 1, z));
      if (n > .56) q = mx(q, GOLDM, Math.min(.6, (n - .56) * 2.6)); else if (n < .42) q = mx(q, COOLM, Math.min(.5, (.42 - n) * 2)); return q; };
    const fden = (i, x, y) => { const z = cl(sc(y), 0, 1.1), f = FLW[i]; return ss(.5, .75, fb(x / (20 + 50 * z) + f.o, y / (7 + 22 * z) + f.o * .7)) * f.k; };
    const flower = (c, x, y, z, i) => { const f = FLW[i], s = (1.2 + 6 * Math.pow(z, 1.3)) * (i === 0 ? 1.05 : i === 3 ? .9 : 1);
      dab(c, x, y - s * .35, rr(-PI, PI), s * rr(1.05, 1.3), s * rr(.85, 1.05), cj(pk(f.c), 6), .94, rr(-.1, .1));
      if (s > 2.4 && R() < .65) dab(c, x + rr(.1, .4) * s, y - s * .35 + rr(.05, .35) * s, rr(-PI, PI), s * .7, s * .5, cj(pk(f.d), 6), .6);
      if (i === 0 && s > 3.6) dab(c, x - .05 * s, y - s * .4, 0, s * .36, s * .32, cj(hx('F2C84A'), 5), .9); };
    (function () {
      const g = B.createLinearGradient(0, 160, 0, DH); g.addColorStop(0, '#BCC87E'); g.addColorStop(.4, '#A4BC5E'); g.addColorStop(1, '#82A64A');
      B.beginPath(); for (let x = -8; x <= 372; x += 4) B.lineTo(x, Ny(x) - .5); B.lineTo(372, DH + 8); B.lineTo(-8, DH + 8); B.closePath(); B.globalAlpha = 1; B.fillStyle = g; B.fill();
      sd(61);
      for (let i = 0; i < 300; i++) { const x = rr(-10, 340), y = rr(160, DH + 6), z = sc(y); if (y < Ny(x) + 2) continue; dab(B, x, y, rr(-.3, .3) - z * .4, 8 + 26 * z, 3 + 11 * z, rgb(mx(mdc(x, y), [94, 120, 80], .12 * z)), .5, 0); }
      sd(62);
      let y = 156;
      while (y < DH + 8) {
        const w0 = 1.3 + 5 * Math.pow(cl(sc(y), 0, 1.1), 1.3); let x = -8 + rr(0, 4);
        while (x < 366) {
          const yy = y + rr(-.4, .4) * w0; if (yy < Ny(x) + rr(-.6, 1.6)) { x += 2.6; continue; }
          const z = cl(sc(yy), 0, 1.1), w = 1.3 + 5 * Math.pow(z, 1.3), l = 3 + 13 * Math.pow(z, 1.2);
          if (pathD(x, yy) < .9 + rr(-.2, .2)) { x += l * .5; continue; }
          let fl = -1; for (let i = 0; i < 4 && fl < 0; i++) if (R() < fden(i, x, yy) * .42) fl = i;
          if (fl >= 0) { flower(B, x, yy, z, fl); x += l * rr(.36, .6); continue; }
          let q = mdc(x + rr(-5, 5), yy + rr(-3, 3)); const r = R();
          if (r < .07) q = mx(q, pk(MW), .55); else if (r < .14) q = mx(q, pk(MC), .5); else if (r < .2 + .07 * ss(.5, 1, z)) q = mx(q, pk(MDK), .6); else if (r < .26) q = mx(q, PALE, .45);
          const a = -PI / 2 + .14 + rr(-.6, .6) * lp(1.5, 1, z) + (fb(x / 45, yy / 16) - .5) * 1.1, ll = l * rr(.75, 1.25), ww = w * rr(.8, 1.2);
          dab(B, x, yy, a, ll, ww, cj(q, 9), lp(.7, .9, ss(.35, .7, z)), rr(-.15, .15));
          if (ww > 3) { const ca = Math.cos(a), sa = Math.sin(a), o2 = rr(-.3, .3) * ww, f0 = rr(.2, .38), f1 = rr(.15, .36);
            B.globalAlpha = .4; B.strokeStyle = cj(mx(q, R() < .55 ? [250, 244, 206] : [66, 86, 124], rr(.15, .3)), 5); B.lineWidth = ww * rr(.1, .18);
            B.beginPath(); B.moveTo(x - ca * ll * f0 - sa * o2, yy - sa * ll * f0 + ca * o2); B.lineTo(x + ca * ll * f1 - sa * o2, yy + sa * ll * f1 + ca * o2); B.stroke(); }
          x += l * rr(.38, .62);
        }
        y += w0 * .6;
      }
      /* the trodden path to the first stone, with the sun across it, and grass leaning over its edges */
      sd(63);
      for (let i = 0, n = Math.ceil(WL[WL.length - 1] / 1.1); i <= n; i++) { const p = pat(WP, WL, i / n), hw = 8.5 * sc(p[1]);
        for (let k = 0; k < 4; k++) { const xx = p[0] + rr(-.9, .9) * hw, yy = p[1] + rr(-.5, .5) * hw * .5, sun = fb(xx / 12 + 5, yy / 6);
          dab(B, xx, yy, -.5 + rr(-.25, .25), hw * rr(.8, 1.4), hw * rr(.24, .38), cj(sun > .68 ? pk(PTHS) : pk(PTHL), 5), rr(.82, .95), rr(-.1, .1)); } }
      for (let i = 0; i < 900; i++) { const x = rr(-6, 190), y = rr(236, DH + 4), d = pathD(x, y); if (d < .78 || d > 1.2) continue; const z = cl(sc(y), 0, 1.1);
        dab(B, x, y, -PI / 2 + .14 + rr(-.6, .6), (3 + 13 * Math.pow(z, 1.2)) * rr(.6, 1), (1.3 + 5 * Math.pow(z, 1.3)) * rr(.5, .8), cj(R() < .4 ? pk(GRL) : pk(GRM), 7), .9, rr(-.15, .15)); }
    })();

    /* warm afternoon light from the upper left, on the still canvas and on the water */
    const glow = c => { const g = c.createRadialGradient(40, 60, 10, 40, 60, 380); g.addColorStop(0, 'rgba(255,214,150,.55)'); g.addColorStop(1, 'rgba(255,214,150,0)');
      c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .45; c.fillStyle = g; c.fillRect(-5, -5, 410, DH + 10); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; };
    glow(B);
    (function () { const T = mk(PW, PH); T[1].drawImage(WAT[0], 0, 0); glow(Wc);
      Wc.setTransform(1, 0, 0, 1, 0, 0); Wc.globalCompositeOperation = 'destination-in'; Wc.drawImage(T[0], 0, 0); Wc.globalCompositeOperation = 'source-over'; Wc.setTransform(DS, 0, 0, DS, 0, 0); })();

    /* ---------- over the water: the stones, and the grass along the near bank ---------- */
    (function () {
      for (const st of ST) {
        sd(st.seed);
        const x = st.x, y = st.y, rx = st.w / 2, ry = st.h / 2, th = st.th, s = st.s, O = [];
        for (let i = 0; i < 20; i++) { const a = i / 20 * 2 * PI, k = 1 + (vn(i * .7 + st.seed, 2.2) - .5) * .24; O.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k]); }
        const path = dy => { Ac.beginPath(); O.forEach((p, i) => i ? Ac.lineTo(p[0], p[1] + dy) : Ac.moveTo(p[0], p[1] + dy)); Ac.closePath(); };
        Ac.globalAlpha = 1; Ac.fillStyle = '#625E8A'; path(th); Ac.fill(); Ac.fillRect(x - rx * .98, y, rx * 1.96, th);
        for (let i = 0; i < 12; i++) { const u = rr(-1, 1);
          dab(Ac, x + u * rx * .86, y + ry * Math.sqrt(1 - u * u * .8) * .7 + th * rr(.3, .95), rr(-.15, .15), rr(3, 5) * s, rr(1.3, 2) * s, cj(u < -.15 ? pk(SDL) : pk(SDD), 5), .9); }
        Ac.save(); path(0); Ac.globalAlpha = 1; Ac.fillStyle = rgb(mx(hx('EDE4D4'), hx('B4B2CE'), st.sh * .6)); Ac.fill(); Ac.clip();
        for (let i = 0; i < 18; i++) { const u = rr(-1, 1), v = rr(-1, 1), lit = -u * .5 - v * .5 + rr(-.3, .3) - st.sh * .45;
          dab(Ac, x + u * rx, y + v * ry, rr(-.2, .2), rr(3.5, 6) * s, rr(1.5, 2.4) * s, cj(lit > .25 ? pk(STL) : lit > -.2 ? pk(STM) : pk(STS), 4), .9); }
        Ac.restore();
        for (let i = 0; i < 5; i++) { const a = PI + rr(.15, 1.3); dab(Ac, x + Math.cos(a) * rx * .9, y + Math.sin(a) * ry * .9, a + PI / 2, rr(3, 5) * s, s, cj(hx('FFFAEC'), 3), .7 * (1 - st.sh * .6)); }
      }
      /* the near bank: grass standing over the water's edge, an iris here and there; bare where the path meets the stones */
      sd(71);
      for (let x = -12; x < 356; x += rr(1.2, 2.6)) { const y = Ny(x), s = sc(y), h = rr(5, 11) * s, r = R(), gap = Math.abs(x - 175) < 7;
        if (gap) { dab(Ac, x, y + rr(0, 2), rr(-.2, .2), rr(3, 5) * s, rr(1.4, 2) * s, cj(pk(PTHL), 5), .9); continue; }
        dab(Ac, x + rr(-1, 1), y + rr(-.5, 2) * s - h * .4, -PI / 2 + .1 + rr(-.3, .3), h, rr(1.2, 2.2) * s, cj(r < .2 ? pk(GOLDP) : r < .55 ? pk(GRL) : pk(GRM), 6), .92, rr(-.15, .15));
        if (R() < .09) dab(Ac, x, y - h * .9, rr(-.6, .6), 3.2 * s, 2.4 * s, cj(R() < .5 ? hx('F4D050') : hx('8E86D6'), 6), .95); }
    })();

    /* ---------- clouds: cumulus sprites that drift right and slip behind the wood ---------- */
    const CM = 8, CLOUDS = [];
    function cloud(cx, yb, puffs, v, seed, flat, k) {
      sd(seed);
      const P = [], ks = lp(1, k, .7); let x0 = 1e9, x1 = -1e9, y0 = 1e9;
      for (const p of puffs) { const px = cx + p[0] * k, py = yb + p[1] * k, r = p[2] * k, ry = (p[3] || p[2]) * k; P.push([px, py, r * r, ry * ry]); x0 = Math.min(x0, px - r); x1 = Math.max(x1, px + r); y0 = Math.min(y0, py - ry); }
      x0 -= 6 * k; x1 += 6 * k; y0 -= 6 * k; const y1 = yb + 8 * k, w = x1 - x0, h = y1 - y0;
      const den = (x, y) => { let s = 0; for (const p of P) { const dx = x - p[0], dy = y - p[1]; s += Math.exp(-dx * dx / p[2] - dy * dy / p[3]); }
        const yl = yb + (vn(x / (18 * k), seed) - .5) * 5 * k; if (y > yl) s *= Math.exp(-Math.pow((y - yl) / ((flat ? 3 : 5) * k), 2));
        return s + (fb(x / (14 * k) + seed, y / (10 * k)) - .5) * .32; };
      const nrm = (x, y) => { const e = 5 * k, gx = den(x + e, y) - den(x - e, y), gy = den(x, y + e) - den(x, y - e), gm = Math.sqrt(gx * gx + gy * gy) + 1e-6; return [gx / gm, gy / gm, gm]; };
      const O = mk(Math.ceil((w + 2 * CM) * DS), Math.ceil((h + 2 * CM) * DS)), c = O[1];
      c.setTransform(DS, 0, 0, DS, (CM - x0) * DS, (CM - y0) * DS);
      c.save(); c.filter = 'blur(' + (3.6 * k * DS).toFixed(2) + 'px)'; c.globalAlpha = flat ? .5 : .62; c.fillStyle = '#E8E6EE';
      for (const p of P) { c.beginPath(); c.ellipse(p[0], Math.min(p[1], yb - 2 * k), Math.sqrt(p[2]) * .8, Math.sqrt(p[3]) * .8, 0, 0, 7); c.fill(); }
      c.globalAlpha = flat ? .35 : .55; c.fillStyle = '#FFF6E4';
      for (const p of P) { const r3 = Math.sqrt(p[2]), q3 = Math.sqrt(p[3]); c.beginPath(); c.ellipse(p[0] - r3 * .2, p[1] - q3 * .3, r3 * .55, q3 * .55, 0, 0, 7); c.fill(); }
      c.restore();
      const N = w * h * (flat ? .05 : .055) / ks;
      for (let j = 0; j < N; j++) {
        const x = rr(x0, x1), y = rr(y0, y1), d = den(x, y); if (d < .42) continue;
        const n = nrm(x, y), lit = n[0] * .55 + n[1] * .83, edge = ss(.015, .12, n[2]), vv = (y - y0) / h,
          k2 = .6 + .45 * lit * edge + .22 * (1 - vv) - .36 * ss(.6, 1.05, vv) + rr(-.12, .12) - (flat ? .08 : 0);
        const q = k2 > .8 ? pk(CW) : k2 > .58 ? pk(CMd) : k2 > .42 ? pk(CLg) : k2 > .26 ? (R() < .22 && vv > .7 ? pk(CPk) : pk(CSd)) : pk(CBs);
        let a = edge > .5 && R() < .75 ? Math.atan2(n[1], n[0]) + PI / 2 + rr(-.25, .25) : -.4 + rr(-.45, .45); if (flat) a = rr(-.12, .12);
        dab(c, x, y, a, rr(8, 16) * (flat ? 1.3 : 1) * ks, rr(3, 5.5) * (flat ? .7 : 1) * ks, cj(q, 4), .3 + .55 * ss(.42, .75, d), rr(-.12, .12));
      }
      for (let m = 0; m < N * .2; m++) { const x = rr(x0, x1), y = rr(y0, yb), d = den(x, y); if (d < .5) continue; const n = nrm(x, y); if (n[0] * .55 + n[1] * .83 < .35 || n[2] < .04) continue;
        dab(c, x, y, Math.atan2(n[1], n[0]) + PI / 2 + rr(-.3, .3), rr(6, 11) * ks, rr(2.2, 3.4) * ks, cj(pk(CW), 3), .8); }
      for (let m = 0; m < N * .25; m++) { const x = rr(x0, x1), y = rr(y0, y1), d = den(x, y); if (d < .3 || d > .5) continue; const n = nrm(x, y);
        dab(c, x, y, Math.atan2(n[1], n[0]) + PI / 2 + rr(-.4, .4), rr(6, 12) * ks, rr(2.4, 4) * ks, cj(ramp(SKYS, cl(y / HZ, 0, 1)), 4), .5); }
      CLOUDS.push({ o: O[0], x0: x0, y0: y0, w: w, v: v, span: 286 + w + 2 * CM + 14 });
    }
    cloud(108, 54, [[-92, -9, 16], [-70, -17, 21], [-44, -26, 26], [-12, -34, 30], [22, -38, 31], [54, -29, 27], [82, -18, 21], [104, -8, 14], [-28, -54, 20], [6, -62, 22], [34, -53, 19], [-58, -38, 14], [64, -44, 14]], 1.5, 71, 0, .48);
    cloud(214, 34, [[-46, -5, 11], [-28, -12, 15], [-6, -19, 19], [18, -21, 18], [40, -13, 14], [58, -6, 10], [6, -33, 13], [-16, -29, 11]], 2.1, 75, 0, .5);
    cloud(30, 64, [[-62, -2, 14, 4], [-40, -3, 18, 5], [-14, -4, 20, 6], [12, -4, 20, 6], [38, -3, 18, 5], [62, -2, 13, 4]], 1.2, 74, 1, .5);
    cloud(-150, 30, [[-26, -4, 8], [-12, -8, 11], [4, -11, 12], [18, -7, 9], [30, -3, 6]], 2.6, 73, 0, .62);

    /* ---------- the live layer ---------- */
    /* the water sways in strips, each as wide as the stream is at its height */
    const BAND = [];
    for (let y = 106; y < DH; y += 3.4) { let x0 = 1e9, x1 = -1e9; for (let x = 0; x <= 400; x += 2) if (Fy(x) < y + 3.4 && Ny(x) > y) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
      const p0 = Math.round(y * DS), p1 = Math.min(PH, Math.round((y + 3.4) * DS)), a0 = Math.round(cl(x0 - 3, 0, 400) * DS), a1 = Math.round(cl(x1 + 3, 0, 400) * DS);
      if (p1 > p0 && a1 > a0) BAND.push([p0, p1 - p0, a0, a1 - a0, lp(.3, .9, sc(y)), y, hs(BAND.length, 7) - .5]); }
    /* glints whose light breathes in and out, each on its own phase, clear of the stones */
    const GC = ['#CFE2F0', '#DCEAF2', '#EEF3F2', '#F8EED4', '#FFF6DA', '#3F5F9E', '#4A5A9A'], GL = [];
    sd(81);
    for (let i = 0; i < 5000 && GL.length < 110; i++) {
      const x = rr(-5, 405), y = rr(112, DH); if (y < Fy(x) + 3 || y > Ny(x) - 3 || fb(x * .02 + 11, y * .09) < .5 + rr(-.08, .08)) continue;
      let ok = true; for (const st of ST) if (Math.abs(x - st.x) < st.w * .95 && Math.abs(y - st.y - st.th) < st.h * 1.7) ok = false; if (!ok) continue;
      const s = sc(y), r = R(), ci = r < .5 ? R() * 3 | 0 : r < .7 ? 3 + (R() * 2 | 0) : 5 + (R() * 2 | 0);
      GL.push([x, y, lp(3, 16, Math.pow(s, 1.2)) * rr(.7, 1.3), lp(.7, 2.1, s) * rr(.8, 1.2), ci, rr(.35, .65), rr(.45, 1.2), rr(0, 6.3), lp(.5, 2.6, s), rr(.25, .6), rr(0, 6.3)]);
    }
    /* leaves on the current, each keeping to a line of flow that passes between two stones */
    const LVS = []; sd(83);
    for (let i = 0; i < NS - 1; i++) LVS.push({ a: (ST[i].fr + ST[i + 1].fr) / 2 + rr(-.01, .01), x0: rr(0, 460), v: rr(7, 11), c: pk(['#E8C050', '#D99A3C', '#C8D070', '#E2B04A', '#B8C860']), ph: rr(0, 6.3), w: rr(.85, 1.2) });
    /* flecks of sun that come and go on the floor of the wood */
    const DP = []; sd(85);
    for (let i = 0; i < 600 && DP.length < 22; i++) { const x = rr(250, 406), y = rr(122, 196); if (y < WTop(x) + 2 || y > Fy(x) - 2) continue; const s = sc(y);
      DP.push([x, y, (5 + 12 * s) * rr(.7, 1.2), (1.4 + 3.2 * s) * rr(.8, 1.2), cj(pk(FLD), 6), rr(.3, .7), rr(0, 6.3), rr(.35, .6), rr(-.1, .2)]); }
    /* tall grasses and flowers in the near meadow that lean with the wind, sorted by their roots */
    const LV = []; sd(87);
    for (let i = 0; i < 6000 && LV.length < 54; i++) {
      const x = rr(-6, 330), y = rr(206, DH + 4); if (y < Ny(x) + 6 || pathD(x, y) < 1.3) continue;
      const z = cl(sc(y), 0, 1.1); if (R() > Math.pow(z, 1.6) * 1.15) continue;
      const l = 3 + 13 * Math.pow(z, 1.2), w = 1.3 + 5 * Math.pow(z, 1.3), g = x * 2 + y * 1.2;
      if (R() < .45) { const r = R(); LV.push({ k: 0, x: x, y: y, g: g, a0: -PI / 2 + .1 + rr(-.22, .22), l: l * rr(1.3, 2.1), w: w * rr(.3, .5), c: rgb(mx(r < .4 ? pk(GRL) : r < .75 ? pk(GRM) : pk(GOLDP), mdc(x, y), rr(.25, .5))), fx: rr(.8, 1.2), lg: rr(0, .15) }); }
      else { let fi = 0, best = -1; for (let j = 0; j < 4; j++) { const d = fden(j, x, y) + rr(0, .5); if (d > best) { best = d; fi = j; } }
        const f = FLW[fi], s = (1.5 + 6.6 * Math.pow(z, 1.3)) * rr(.9, 1.15);
        LV.push({ k: 1, x: x, y: y, g: g, ls: l * rr(.6, 1.05), s: s, fx: rr(.9, 1.15), lg: rr(.05, .3), na: rr(.06, .12), nw: rr(1.3, 2.4), np: rr(0, 6.283), a1: rr(-PI, PI), c1: cj(pk(f.c), 6), c2: cj(pk(f.d), 6), eye: fi === 0 && s > 3.6, sc: cj(pk(STEMC), 6), d2: [rr(.1, .4), rr(.05, .35), rr(-1, 1)] }); }
    }
    LV.sort((a, b) => a.y - b.y);

    /* Where she is at time t: feet, and how she holds herself. null between crossings. */
    function walker(t) {
      const tt = t + T0, n = Math.floor(tt / LOOP), p = tt - n * LOOP, o = { al: 1, lean: .03, arm: .1, sway: 0, hop: 0, bob: 0, sh: 0, wet: 0 };
      if (p < TWALK) { const q = pat(WP, WG, p / TWALK); o.x = q[0]; o.y = q[1]; o.bob = Math.sin(p * 11.5); o.sway = .6 * Math.sin(p * 5.75); }
      else if (p < TLAND) {
        let P0, P1, u = -1; o.wet = 1;
        if (p < A0) { P0 = WP[WP.length - 1]; P1 = ST[0]; u = (p - TWALK) / TON; o.wet = u; }
        else { const k = Math.min(NS - 1, Math.floor((p - A0) / (PAUSE + STEP))), q = p - aK(k);
          if (q < PAUSE) { o.x = ST[k].x; o.y = ST[k].y; o.arm = lp(.9, .12, ss(0, .75, q / PAUSE)); o.lean = .03 + .05 * (1 - ss(0, .5, q / PAUSE)); o.sway = .25 * Math.sin(q * 4) * (1 - q / PAUSE); }
          else { P0 = ST[k]; P1 = k < NS - 1 ? ST[k + 1] : { x: LD[0], y: LD[1] }; u = (q - PAUSE) / STEP; if (k === NS - 1) o.wet = 1 - u; } }
        if (u >= 0) { const e = ss(0, 1, u), x0 = P0.x === undefined ? P0[0] : P0.x, y0 = P0.y === undefined ? P0[1] : P0.y;
          o.x = lp(x0, P1.x, e); o.y = lp(y0, P1.y, e); o.hop = Math.sin(PI * u); o.lean = .04 + .08 * Math.sin(PI * u); o.arm = lp(.12, .95, ss(0, .4, u)); o.sway = -Math.sin(PI * u); }
      } else if (p < TLAND + TTR) { const j = SEQ[((n % 6) + 6) % 6], v = (p - TLAND) / TTR, q = pat(TR[j], TG[j], v), q2 = pat(TR[j], TG[j], v + .02);
        o.x = q[0]; o.y = q[1]; o.bob = Math.sin(p * 11.5); o.sway = .6 * Math.sin(p * 5.75); o.lean = q2[0] < q[0] ? -.03 : .03; o.al = j === 2 ? 1 - ss(.82, 1, v) : 1 - ss(.4, .96, v); o.sh = ss(0, .3, v); }
      else return null;
      o.p = p; return o;
    }
    /* The walker, a dozen dabs: white dress, straw hat with a red ribbon, arms out when she needs her balance. */
    function fig(c, fx, fy, k, o) {
      const ca = Math.cos(o.lean), sa = Math.sin(o.lean), tn = q => o.sh ? rgb(mx(q, SHD, o.sh * .4)) : rgb(q);
      const D = (u, v, a, l, w, q, al) => dab(c, fx + (u * ca + v * sa) * k, fy - (v * ca - u * sa) * k, a + o.lean, l * k, Math.max(.5, w * k), tn(q), (al || .96) * o.al, 0);
      const arm = (u, v, a, q) => D(u + Math.cos(a) * .12, v - Math.sin(a) * .12, a, .25, .055, q);
      D(.02 + .05 * o.sway, .05, 0, .36, .08, FIG.hem, .9);
      D(.075, .25, -PI / 2, .47, .17, FIG.skS);
      D(-.02 + .02 * o.sway, .27, -PI / 2, .52, .29, FIG.sk);
      D(-.09, .25, -PI / 2, .4, .07, FIG.skF, .8);
      arm(.085, .715, lp(1.36, .12, o.arm), FIG.armS);
      D(.05, .62, -PI / 2, .23, .1, FIG.toS);
      D(0, .625, -PI / 2, .26, .19, FIG.to);
      D(0, .515, 0, .18, .045, FIG.sash);
      arm(-.085, .715, lp(1.78, 3, o.arm), FIG.armL);
      D(0, .795, 0, .085, .08, FIG.hair);
      D(.05, .838, 0, .2, .035, FIG.brimS);
      D(0, .852, 0, .31, .07, FIG.brim);
      D(0, .9, 0, .15, .1, FIG.crown);
      D(0, .874, 0, .15, .03, FIG.rib);
    }

    const BC = BG[0], WC = WAT[0], AC = FA[0], FC = FB[0], FBH = Math.min(PH, Math.ceil(216 * DS));
    function frame(t) {
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
      X.drawImage(BC, 0, 0);
      for (const c of CLOUDS) { const x = ((c.x0 + c.w + CM + c.v * t) % c.span + c.span) % c.span - c.w - CM; X.drawImage(c.o, Math.round((x - CM) * DS), Math.round((c.y0 - CM) * DS)); }
      for (const b of BAND) { const off = b[4] * (.62 * Math.sin(1.07 * t + b[5] * .31) + .38 * Math.sin(.71 * t - b[5] * .19 + 1.3)); X.drawImage(WC, b[2], b[0], b[3], b[1], b[2] + Math.round(off * DS + b[6]), b[0], b[3], b[1]); }
      const wk = walker(t), p = wk ? wk.p : -1, kf = wk ? 58 * sc(wk.y) : 0;
      X.setTransform(DS, 0, 0, DS, 0, 0);
      /* on the water: leaves, glints, wakes, the ring where she last landed, her broken reflection */
      for (const lv of LVS) { const x = (lv.x0 + lv.v * t) % 460 - 30, f = Fy(x), y = lp(f, Ny(x), lv.a); if (y > DH + 4) continue; const s = sc(y);
        dab(X, x, y, .2 + .5 * Math.sin(.8 * t + lv.ph), (2.4 * s + .9) * lv.w, (1.1 * s + .5) * lv.w, lv.c, .9, .1); }
      for (const g of GL) { const f = Math.sin(g[6] * t + g[7]); if (f <= .02) continue; dab(X, g[0] + g[8] * Math.sin(g[9] * t + g[10]), g[1], .08, g[2], g[3], GC[g[4]], g[5] * f * Math.sqrt(f), 0); }
      for (const st of ST) for (let i = 0; i < 3; i++) { const ph = (t * .32 + i / 3 + st.seed * .37) % 1, d0 = st.w * (.6 + ph * 1.5), lt = (i - 1) * st.w * (.2 + ph * .35);
        dab(X, st.x + d0 * st.dx - lt * st.dy, st.y + st.th + st.h * .3 + d0 * st.dy + lt * st.dx * .5, Math.atan2(st.dy, st.dx), st.w * (.45 + ph * .4), st.s * 1.3, '#DCEAF2', Math.sin(PI * ph) * .5, 0); }
      if (wk) for (let k = 0; k < NS; k++) { const age = (p - aK(k)) / 1.9; if (age <= 0 || age >= 1) continue; const st = ST[k], rx = st.w * (.62 + 1.1 * age), ry = rx * .36, cy = st.y + st.th + st.h * .2;
        for (let i = 0; i < 10; i++) { const a = -.3 + (PI + .6) * i / 9; dab(X, st.x + Math.cos(a) * rx, cy + Math.sin(a) * ry, Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx), rx * .45, st.s * 1.1, '#E6EFF4', Math.pow(1 - age, 1.2) * .55, 0); } }
      if (wk && wk.wet > .02) for (let i = 0; i < 5; i++) { const v = [.14, .28, .42, .6, .74][i];
        dab(X, wk.x + .7 * Math.sin(1.3 * t + i * 1.7) * (1 + i * .3), wk.y + 5 * sc(wk.y) + v * .55 * kf, .05, kf * [.26, .24, .17, .13, .22][i], kf * .045, i < 2 ? '#E4E2F0' : i < 4 ? '#EEEAF0' : '#DCC88A', .3 * wk.wet * wk.al, 0); }
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(AC, 0, 0);
      X.setTransform(DS, 0, 0, DS, 0, 0);
      for (const d of DP) { const f = .5 + .5 * Math.sin(d[5] * t + d[6]); dab(X, d[0], d[1], d[8], d[2], d[3], d[4], d[7] * f * f, 0); }
      if (wk) { const fy = wk.y - (wk.hop * .1 + (wk.bob > 0 ? wk.bob * .012 : 0)) * kf;
        dab(X, wk.x + .2 * kf, wk.y + .01 * kf, .22, .5 * kf, .12 * kf, '#4A5490', .3 * wk.al * (1 - wk.sh), 0);
        fig(X, wk.x, fy, kf, wk); }
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(FC, 0, 0, PW, FBH, 0, 0, PW, FBH);
      X.setTransform(DS, 0, 0, DS, 0, 0);
      for (const it of LV) {
        if (it.k === 0) { const L = it.fx * wind(it.g, t - it.lg), a = it.a0 + L, ca = Math.cos(a), sa = Math.sin(a); dab(X, it.x + ca * it.l * .5, it.y + sa * it.l * .5, a, it.l, it.w, it.c, .88, -L * .35); }
        else { const L = it.fx * wind(it.g, t - it.lg) + it.na * Math.sin(it.nw * t + it.np), ca = Math.sin(L), sa = -Math.cos(L), hx2 = it.x + ca * it.ls, hy2 = it.y + sa * it.ls, s = it.s;
          dab(X, (it.x + hx2) * .5, (it.y + hy2 + s * .3) * .5, Math.atan2(hy2 - it.y, hx2 - it.x), it.ls, Math.max(.6, s * .14), it.sc, .7, -L * .25);
          dab(X, hx2, hy2, it.a1 + L, s * 1.2, s * .98, it.c1, .94, .08);
          if (s > 2.6) dab(X, hx2 + it.d2[0] * s, hy2 + it.d2[1] * s, it.d2[2] + L, s * .7, s * .5, it.c2, .6, 0);
          if (it.eye) dab(X, hx2 - .05 * s, hy2 - .05 * s, 0, s * .36, s * .32, '#F2C84A', .9, 0); }
      }
      X.globalAlpha = 1; X.setTransform(1, 0, 0, 1, 0, 0);
    }
    return { frame: frame };
  }

  window.Vignettes.inverse = {
    title: 'Stepping Stones',
    aspect: 4 / 3,
    create: function (canvas) {
      let st = build(canvas);
      return { frame: function (t) { st.frame(t); }, resize: function () { st = build(canvas); } };
    }
  };
})();
