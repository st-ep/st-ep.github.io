/* One Light, Many Courses (Neural Operators for Multi-Task Control and Adaptation). A harbour mouth seen from a cliff
   top, after Monet's Lighthouse at Honfleur and his cliff walks at Pourville, as a 4:3 landscape. One white lighthouse
   stands on a spit at the mouth; behind it lie the harbour basin and the town. Boats come in across the bay from
   every side, each on a course of its own (two beating up the near bay in long tacks, two reaching in from the right,
   a long run from the far right, a speck running down from the horizon), and every course ends at the same light:
   the paper learns one operator that hands each task its own control law. A boat that has moored is followed, a
   round later, by another from the same quarter on a line it has never sailed, and it finds the mouth too.
   Design space is 400 x 300, horizon at 96; things on the sea shrink with their height above the bottom edge.
   One wind blows over the whole picture, at us and a little to the left: the clouds drift with it, the cliff-top
   grass leans with it, and every boat is set to it. A boat is not a picture of a boat slid along a line: each frame
   it is built on the water where it is, its hull along its course, its boom out to leeward by as much as its point
   of sail asks, heeling the same way, so a boat sailing away shows its stern and one that cannot point at the mouth
   tacks toward it.
   Painted once: an opaque still canvas (sky, the far shore and town, the sea), the spit with its lighthouse and the
   cliff top as two small layers over the boats' water, and the cloud sprites. Each frame lays the still canvas,
   drifts the clouds, and paints a small live layer: glints, foam, each boat's wake (its course, drawn on the
   water), the boats and their broken reflections, the lamp's double flash and its answer on the sails and the sea,
   gulls, and the cliff-top grass leaning in the wind. With motion reduced, frame(6) is the still. */
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
  const ramp = (st, t) => { if (t <= st[0][0]) return st[0][1]; for (let i = 1; i < st.length; i++) if (t <= st[i][0]) return mx(st[i - 1][1], st[i][1], (t - st[i - 1][0]) / (st[i][0] - st[i - 1][0])); return st[st.length - 1][1]; };
  /* polylines: a smooth curve through points, and the point a fraction u along a running measure L of it */
  const cr = (P, k) => { const O = [], f = (a, b, c, d, t) => .5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (3 * b - a - 3 * c + d) * t * t * t);
    for (let i = 0; i < P.length - 1; i++) { const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], d = P[Math.min(P.length - 1, i + 2)]; for (let j = 0; j < k; j++) O.push([f(a[0], b[0], c[0], d[0], j / k), f(a[1], b[1], c[1], d[1], j / k)]); }
    O.push(P[P.length - 1]); return O; };
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
  function line(c, P, w, col, al) { c.globalAlpha = al; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.stroke(); }

  /* Palettes */
  const SKYS = [[0, hx('5E92CE')], [.3, hx('74A4D9')], [.55, hx('90B7E2')], [.78, hx('B2CDE8')], [.92, hx('CDDBE2')], [1, hx('E2E1D2')]];
  const LAV = hx('A0A6DC'), GRB = hx('9CCAD6'), PNK = hx('ECD6D0'), HAZ = [170, 188, 206];
  const CW = pl('FFF8E8 FCF0DA FFF4E0 FAEBD2 FFFBF2'), CMd = pl('F1EEEC ECE9EE F4EEE4 E8E6EC EEEAE6'), CLg = pl('DEDBE6 D8D7E6 E3DCE0 D6D8E6'), CSd = pl('CBCADF C4C6DE CFC7DA C0C4DE'), CBs = pl('B6B8D8 B0B6D6 BCB8D6'), CPk = pl('ECD8D2 E9D3CE F0DCD0');
  /* the sea from the horizon to the foot of the cliff; turquoise where it is shallow, violet under cloud */
  const SEA = [[0, hx('CFDBE8')], [.025, hx('AFC6E2')], [.1, hx('86ABD8')], [.26, hx('5C8DC8')], [.5, hx('4480B8')], [.78, hx('3A7AA4')], [1, hx('31708E')]];
  const TU = hx('56B4B0'), EM = hx('86CDB6'), VI = hx('6268B4'), LI = hx('E0ECF2'), DK = hx('2C5A90'), BAS = hx('8FC2D6');
  /* land: sunlit grass, grass, shade; rocks lit and shaded; walls, roofs */
  const FOL = pl('B9C46A C2C26A A8BE62 D2C46A 9DBA62 C8CC72'), FOM = pl('7FA35A 6E9A56 86A062 94A866 72925A'), FOS = pl('4E7E62 4A6E7A 5E6E96 56708A 4E6A6A 5A7A70');
  const RKL = pl('E6D2B0 DCC49E EEDCC0 D8BE9C E8CDB4'), RKM = pl('B89C8A A8908E C4A692 9E8A96'), RKS = pl('6E6A92 62648A 7A6E92 5A6088');
  const WALL = pl('F4E6D8 F2E2CC F7EEDF EFDCC8 F0D8C8'), WALLS = pl('C4BED8 B8B4D6 C6B8D0'), ROOF = pl('C8553D D9663F E07A50 CC5E3E'), ROOFS = pl('9A4A4E 8A5A6E A0545A'), SLATE = pl('8E9CC8 7F93C4 9AA8CC');
  /* the lighthouse: sunlit side, face, shade, deep shade */
  const LHL = pl('FFFBEE FFF6E2 FDF2DC'), LHM = pl('F4EEE8 EEE8EA F0EAE0'), LHS = pl('CFCCE4 C6C4E0 D4CEE2'), LHD = pl('A8A8D2 9EA0CC B0AAD0');
  /* the cliff top */
  const GRL = pl('B7C66A C6CA72 AABF5E D4CE76 BFCB6E'), GRM = pl('80A44E 8BAB53 739A4A 92AE58'), GOLDP = pl('E4C66C D9BA5C ECD282 CCAA54 F1DA92'), STEMC = pl('5E8A4A 668E4E 587E52 6A8A50');
  const MZ = [[0, hx('B0C66A')], [.5, hx('96B652')], [1, hx('7EA648')]], GOLDM = hx('D8C460'), COOLM = hx('6E90A0');
  /* its flowers: thrift, bird's-foot trefoil, sea campion */
  const FLW = [{ c: pl('EE9CB0 F2ACBC E88CA4 F4B8C6'), d: pl('CC6E90 D47C98'), o: 1.3, k: 1 }, { c: pl('F6D95C F2CE48 FAE272'), d: pl('E0B040 D6A63A'), o: 7.9, k: .8 }, { c: pl('FBF6EA FFFBF2 F6F0E4'), d: pl('D6D2E6 CBC8E2'), o: 13.1, k: .6 }];
  /* three boats: white sails, tanned sails, the red-brown sails of the fishing fleet */
  const BOAT = [
    { l: pl('FFF8EA FBF3E0 FFF6DA'), m: pl('F4E6CC F0DFC0 EADFD4'), s: pl('D2CADE CCC6DE BDB6D6'), hull: pl('F4ECE0 EADFD4 FFF8EA'), hs: pl('BDB6D6 A9A2CC'), stripe: '#C8553D', ref: hx('EEEAF0'), cd: '#E9DCC0' },
    { l: pl('F0D8A8 E8C890 F4E0B4'), m: pl('DDB878 D6AE70 E2C088'), s: pl('B8946E AE8A6E C09A7A'), hull: pl('3E5E6E 46667A 37566A'), hs: pl('2E4A5E 34506A'), stripe: '#F2E2C6', ref: hx('E6CFA0'), cd: '#D9C7A2' },
    { l: pl('D8845C D07C54 E09068'), m: pl('C06A48 B86242 C87250'), s: pl('8E4E4E 84485A 9A5650'), hull: pl('4A4258 524A60 443C54'), hs: pl('3A344C 40384E'), stripe: '#F4ECE0', ref: hx('D08A6A'), cd: '#CDB592' }];
  BOAT.forEach(P => { P.cm = rgb(P.m[0]); P.ch = rgb(P.hull[0]); P.rf = [0, 1, 2, 3, 4, 5].map(k => rgb(mx(P.ref, hx('4E86C0'), .25 + .4 * (k + .6) / 6))); });

  /* Wind over the cliff top: two gust trains travel along a coordinate g, which the cliff sets running right to left. */
  const b4 = p => { let s = .5 + .5 * Math.sin(p); s *= s; return s * s; }, b8 = p => { const s = b4(p); return s * s; };
  const wind = (g, t) => { const e1 = .78 + .22 * Math.sin(.093 * t + 1.3), e2 = .62 + .38 * Math.sin(.061 * t + .4), p1 = .0105 * g - .8 * t, p2 = .0172 * g - 1.21 * t + 2.1;
    return .05 * Math.sin(.7 * t + g * .004) + .3 * e1 * (b4(p1) - .3 * b4(p1 + .9)) + .17 * e2 * (b8(p2) - .3 * b8(p2 + .8)); };
  /* The lamp: two flashes, then a rest, every LAMP seconds. */
  const LAMP = 6, flash = t => { const q = (((t + .7) % LAMP) + LAMP) % LAMP; return Math.exp(-Math.pow((q - .7) / .17, 2)) + .8 * Math.exp(-Math.pow((q - 1.5) / .17, 2)); };

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
    /* a transparent layer over the design rectangle (x0, y0)-(x1, y1), drawn back at whole device pixels */
    const part = (x0, y0, x1, y1) => { const px = Math.floor(x0 * DS), py = Math.floor(y0 * DS), L = mk(Math.ceil(x1 * DS) - px, Math.ceil(y1 * DS) - py); L[1].setTransform(DS, 0, 0, DS, -px, -py); return { o: L[0], c: L[1], px: px, py: py }; };

    /* Geometry: the sea's horizon, the far shore with its town, the spit, the harbour mouth between them. */
    const HZ = 96, sc = y => cl((y - HZ) / 204, .02, 1.3);
    const MLt = x => lp(78, 101, Math.pow(ss(-10, 172, x), 1.2)) - 5 * fb(x * .03 + 2, 7.1) + 1.5;       // the far shore's hills
    const MLs = x => lp(112, 106.5, ss(112, 178, x)) + .8 * Math.sin(x * .09), CAPE = 178;             // its waterline, and where it ends
    const SPf = x => 143 + 1.6 * Math.sin(x * .045 + 1) - 1.5 * ss(120, 152, x);                        // the spit: far shore
    const SPn = x => 167 + 1.4 * Math.sin(x * .06) - 15 * Math.pow(ss(92, 154, x), 1.6), TIP = 154;    // near shore, and its tip
    const LX = 136, LB = 151, LT = 93;                                                                  // the lighthouse: axis, foot, gallery
    const M = [171, 127];                                                                                // the mouth
    const CE = x => 316 - 116 * Math.pow(ss(214, 414, x), .8) + (vn(x * .06, 2.7) - .5) * 7;           // the cliff's edge
    const basin = (x, y) => { if (x > CAPE + 12 || y < MLs(Math.min(x, CAPE - 1))) return 0; const n = SPf(Math.min(x, TIP)); return ss(CAPE + 12, CAPE - 36, x) * (x < TIP ? ss(n, n - 4, y) : ss(n + 6, n - 8, y)); };   // 1 inside the harbour, fading out through the mouth

    /* ---------- the still canvas: sky, far shore and town, then the sea ---------- */
    const BGL = mk(PW, PH, true), BG = BGL[0], B = BGL[1]; B.setTransform(DS, 0, 0, DS, 0, 0);
    B.fillStyle = '#ECDDBC'; B.fillRect(-5, -5, 410, DH + 10);
    (function () {
      const g = B.createLinearGradient(0, 0, 0, HZ + 4);
      g.addColorStop(0, '#5F92CE'); g.addColorStop(.35, '#7FACDC'); g.addColorStop(.72, '#ABC9E6'); g.addColorStop(1, '#DDE0D2');
      B.globalAlpha = 1; B.fillStyle = g; B.fillRect(-5, -5, 410, HZ + 8);
      sd(11);
      for (let i = 0; i < 1150; i++) {
        const x = rr(-8, 408), y = Math.pow(R(), 1.1) * (HZ + 6) - 6, t = cl(y / HZ, 0, 1), n = fb(x / 60 + 2, y / 24), r = R();
        let q = ramp(SKYS, cl(t + (n - .5) * .24 + rr(-.04, .04), 0, 1));
        if (r < .08) q = mx(q, LAV, .5); else if (r < .13) q = mx(q, GRB, .4); else if (r < .2 && t > .72) q = mx(q, PNK, .5);
        dab(B, x, y, -.48 + rr(-.32, .32) + (R() < .2 ? .85 : 0), lp(16, 7, t) * rr(.7, 1.3), lp(6, 2.6, t) * rr(.8, 1.2), cj(q, 5), rr(.5, .78), rr(-.08, .08));
      }
      /* a far cape on the right, pale with distance */
      sd(12);
      for (let i = 0; i < 150; i++) { const x = rr(318, 412), top = 96.5 - 5.5 * ss(318, 372, x) * (.6 + .4 * fb(x * .05, 3.3)), y = rr(top, 97); dab(B, x, y, rr(-.15, .15), rr(4, 8), rr(1.2, 1.9), cj(mx(y < top + 1.6 ? hx('D6CFC8') : hx('A9B2D2'), HAZ, .3), 4), rr(.6, .85)); }
    })();
    /* the far shore: hills in haze, hedged fields, a pale cliff at the cape; the town along its quay */
    (function () {
      sd(21);
      B.globalAlpha = 1; B.fillStyle = '#9DB48A'; B.beginPath(); for (let x = -8; x <= CAPE; x += 3) B.lineTo(x, MLt(x)); for (let x = CAPE; x >= -8; x -= 3) B.lineTo(x, MLs(x) + .5); B.closePath(); B.fill();
      for (let i = 0; i < 1500; i++) {
        const x = rr(-8, CAPE), top = MLt(x), sh = MLs(x), y = rr(top - .5, sh); if (y < top) continue;
        const v = (y - top) / Math.max(1, sh - top), n = fb(x / 24 + 4, y / 6), li = (1 - v) * .5 + (n - .5) * 1.2 + rr(-.2, .2);
        let q = li > .42 ? pk(FOL) : li > 0 ? pk(FOM) : pk(FOS); if (n > .62 && v > .3) q = mx(q, GOLDM, .5);
        dab(B, x, y, rr(-.2, .25), rr(3, 6.5), rr(1.3, 2.1), cj(mx(q, HAZ, lp(.42, .16, ss(-10, 170, x)) + .1 * (1 - v)), 5), rr(.7, .9), rr(-.1, .1));
      }
      for (let i = 0; i < 90; i++) { const x = rr(146, CAPE - .5), sh = MLs(x), h = 2 + 4.6 * ss(140, 172, x), y = sh - rr(0, 1) * h; dab(B, x, y, PI / 2 + rr(-.2, .2), rr(2.2, 3.6), rr(1.2, 1.8), cj(x > CAPE - 7 || R() < .3 ? pk(RKS) : pk(RKL), 5), .9); }
      /* the town: walls, red and slate roofs, a church, trees between; then the quay and the boats tied up along it */
      sd(22);
      const house = (x, up, w, h, roof, rh, hz) => { const y = MLs(x) - .3 - up, j = () => rr(-.25, .25);
        B.globalAlpha = .97; B.fillStyle = rgb(mx(pk(WALL), HAZ, hz)); B.fillRect(x - w / 2, y - h, w, h); B.fillStyle = rgb(mx(pk(WALLS), HAZ, hz)); B.fillRect(x + w * .16, y - h, w * .34, h);
        B.fillStyle = rgb(mx(pk(roof), HAZ, hz)); B.beginPath(); B.moveTo(x - w / 2 - .5, y - h + .25); B.lineTo(x - w * .28 + j(), y - h - rh + j()); B.lineTo(x + w * .3 + j(), y - h - rh + j()); B.lineTo(x + w / 2 + .5, y - h + .25); B.closePath(); B.fill();
        B.fillStyle = rgb(mx(pk(roof === ROOF ? ROOFS : SLATE), HAZ, hz + .1)); B.beginPath(); B.moveTo(x + w * .14, y - h + .25); B.lineTo(x + w * .2, y - h - rh); B.lineTo(x + w * .3, y - h - rh); B.lineTo(x + w / 2 + .5, y - h + .25); B.closePath(); B.fill();
        if (w > 5.6 && !up) { B.globalAlpha = .7; B.fillStyle = '#6E78A8'; B.fillRect(x - w * .3, y - h * .66, .9, 1.2); B.fillRect(x - w * .04, y - h * .66, .9, 1.2); } };
      for (let i = 0; i < 14; i++) { const x = rr(10, 128); house(x, rr(5, 9), rr(3.4, 5.4), rr(2.6, 3.8), R() < .6 ? ROOF : SLATE, rr(1.8, 2.4), .3); }            // the back streets, hazier
      for (let i = 0; i < 300; i++) { const x = rr(4, 136), y = MLs(x) - rr(.5, 10); dab(B, x, y, rr(-PI, PI), rr(2.2, 3.6), rr(1.3, 2), cj(mx(R() < .4 ? pk(FOM) : pk(FOS), HAZ, .2), 5), .9); }
      for (let x = 14, k = 0; x < 128; k++) { const w = rr(4.4, 8.4), h = rr(3.4, 6.2); if (Math.abs(x - 60) > 7) house(x, 0, w, h, hs(k, 5) < .62 ? ROOF : SLATE, rr(2, 3.2), .06); x += w * rr(.75, 1.5); }
      house(62, 0, 8, 6, SLATE, 3, .04);                                                         // the church and its spire
      B.globalAlpha = .97; B.fillStyle = rgb(pk(WALL)); B.fillRect(56, MLs(57) - 13.4, 3.2, 13); B.fillStyle = rgb(pk(WALLS)); B.fillRect(58, MLs(57) - 13.4, 1.2, 13);
      B.fillStyle = '#7E8CBE'; B.beginPath(); B.moveTo(55.5, MLs(57) - 13.2); B.lineTo(57.6, MLs(57) - 22); B.lineTo(59.7, MLs(57) - 13.2); B.closePath(); B.fill();
      for (let x = 6; x < 136; x += rr(2, 4)) dab(B, x, MLs(x) + .2, rr(-.05, .05), rr(3, 6), rr(.9, 1.3), cj(R() < .3 ? hx('B4A8C4') : hx('E6DAC2'), 4), .9);
    })();

    /* the sea, in rows of strokes that grow toward us; the basin also carries the town upside down */
    (function () {
      const D = B.getImageData(0, 0, PW, PH).data;
      const smp = (x, y) => { const px = cl(Math.round(x * DS), 0, PW - 1), py = cl(Math.round(y * DS), 0, PH - 1), i = (py * PW + px) * 4; return [D[i], D[i + 1], D[i + 2]]; };
      const sea = (x, y) => { const d = cl((y - HZ) / 204, 0, 1), n1 = fb(x * .0065 + 3, y * .055 + d * 2), n2 = fb(x * .0045 + 9.3, y * .034 + 4.1); let q = ramp(SEA, d);
        if (n1 > .56) q = mx(q, TU, Math.min(.55, (n1 - .56) * 2.6) * ss(.03, .2, d));
        if (n2 < .38) q = mx(q, VI, Math.min(.5, (.38 - n2) * 2.4) * ss(.02, .15, d));
        const dn = x < TIP + 4 ? y - SPn(Math.min(x, TIP)) : 99, dt = Math.hypot(x - TIP - 3, (y - 148) * 1.4);      // shallows off the spit and round its tip
        if (dn > -1 && dn < 15) q = mx(q, EM, .55 * (1 - dn / 15)); if (dt < 22) q = mx(q, EM, .5 * (1 - dt / 22));
        const dc = y - CE(x); if (dc > -34 && x > 216) q = mx(q, EM, .42 * ss(-34, -4, dc));                              // and under the cliff
        return q; };
      sd(31);
      const g = B.createLinearGradient(0, HZ, 0, DH); g.addColorStop(0, '#C3D3E6'); g.addColorStop(.08, '#8FB0DA'); g.addColorStop(.4, '#4E86C0'); g.addColorStop(1, '#346F94');
      B.save(); B.beginPath(); B.rect(-8, HZ, 418, DH + 8 - HZ); B.moveTo(-8, MLt(-8)); for (let x = -8; x <= CAPE; x += 3) B.lineTo(x, MLt(x)); for (let x = CAPE; x >= -8; x -= 3) B.lineTo(x, MLs(x)); B.closePath(); B.clip('evenodd');
      B.globalAlpha = 1; B.fillStyle = g; B.fillRect(-8, HZ, 418, DH);
      for (let y = HZ + .5; y < DH + 6;) {
        const s0 = sc(y), dy = lp(.9, 4.6, Math.pow(s0, 1.1));
        for (let x = -12 - rr(0, 8); x < 414;) {
          const l = lp(3.5, 26, Math.pow(s0, 1.15)) * rr(.6, 1.4), w = lp(1.1, 5.6, s0) * rr(.8, 1.2), yy = y + rr(-.3, .3) * dy, inb = basin(x, yy);
          if (x < CAPE && yy > MLt(x) + 1 && yy < MLs(x) - 1) { x += l * .7; continue; }
          let col = sea(x, yy);
          if (inb > 0) { const sh = MLs(Math.min(x, CAPE - 1)); col = mx(col, mx(mx(smp(Math.min(x, CAPE - 1) + rr(-1, 1), sh - (yy - sh) / .62 - .4), col, cl(.34 + .5 * ss(0, 26, yy - sh) + rr(-.08, .08), 0, 1)), BAS, .28), inb); }
          const rp = vn(x * .04 + 3, yy * .22), ck = lp(1.1, 1.9, s0) * (1 - .4 * inb);
          if (rp > .68) col = mx(col, LI, Math.min(.6, (rp - .68) * ck)); else if (rp < .3) col = mx(col, DK, Math.min(.5, (.3 - rp) * ck));
          dab(B, x, yy, rr(-.05, .05), l, w, rgb(col), rr(.82, .95), rr(-.1, .1));
          x += l * rr(.5, .85);
        }
        y += dy;
      }
      /* whitecaps, more of them toward us; cloud light lying on the bay */
      sd(32);
      for (let i = 0; i < 180; i++) { const y = HZ + 6 + Math.pow(R(), .7) * (DH - HZ), x = rr(-6, 406), s = sc(y); if (basin(x, y) > .3) continue; dab(B, x, y, rr(-.06, .06), lp(3, 15, s) * rr(.6, 1.3), lp(.7, 2.2, s), cj(pk(pl('E6F0F4 F4F6F2 DCE8F0 FFFBF0')), 3), rr(.3, .6), rr(-.12, .12)); }
      for (const [cx, cy, rx, ry, n] of [[250, 178, 60, 9, 40], [70, 236, 50, 12, 34]]) for (let i = 0; i < n; i++) { const u = rr(-1, 1), v = rr(-1, 1), e = u * u + v * v; if (e > 1) continue; const y = cy + v * ry, s = sc(y);
        dab(B, cx + u * rx, y, 0, rr(8, 16) * (s + .2), rr(1.6, 2.6) * (s + .3), cj(v < 0 ? hx('F4EEE4') : hx('D9D6E6'), 4), rr(.2, .42) * (1 - e * .6), 0); }
      /* the dark the spit lays on the water, the lighthouse standing in it, and the tied-up boats with theirs */
      sd(33);
      for (let x = -10; x < TIP; x += rr(2, 4.2)) { const y = SPn(x), s = sc(y); for (let k = 0; k < 2; k++) dab(B, x + rr(-1, 1), y + rr(.6, 5) * (s + .5), rr(-.05, .05), rr(5, 10) * (s + .35), rr(1.2, 2) * (s + .4), cj(R() < .5 ? hx('3E6E78') : hx('4A5E94'), 5), rr(.35, .6)); }
      for (let i = 0; i < 46; i++) { const v = Math.pow(R(), .85), y = SPn(LX) + 1.5 + v * 52, s = sc(y); dab(B, LX + rr(-1, 1) * (3 + v * 5) + rr(-1, 1), y, rr(-.04, .04), (4 + 9 * s) * rr(.7, 1.3), (1 + 2.4 * s) * rr(.8, 1.2), cj(R() < .78 ? pk(LHM) : pk(LHS), 4), lp(.7, .16, v)); }
      sd(34);
      for (const [x, h, sl] of [[26, 11, 0], [33, 9, 1], [44, 12, 0], [70, 10, 0], [78, 12, 2], [89, 9, 0], [98, 11, 0], [110, 10, 1]]) { const y = MLs(x) + 2.6;
        line(B, [[x, y], [x + .3, y - h]], .5, '#5E5878', .9); dab(B, x, y, rr(-.05, .05), 5.6, 1.5, cj(sl === 2 ? hx('4A4258') : hx('EDE4D8'), 4), .95); dab(B, x, y + .9, 0, 5, .9, '#3E4E86', .5);
        if (sl) dab(B, x - 1.2, y - h * .5, -PI / 2 + .12, h * .8, 2.2, cj(sl === 2 ? pk(BOAT[2].m) : pk(BOAT[0].m), 4), .92);
        for (let k = 0; k < 4; k++) dab(B, x + rr(-.5, .5), y + 2 + k * 1.7, rr(-.05, .05), rr(2.4, 4), .8, cj(k < 1 ? hx('E4DCD4') : hx('6A6690'), 4), .5 - k * .09); }
      B.restore();
      /* rocks of the shoal, awash */
      sd(35);
      for (const [x, y, r] of [[58, 246, 7], [70, 241, 4.4], [48, 251, 3.4]]) { const s = sc(y);
        for (let i = 0; i < r * 3; i++) { const u = rr(-1, 1), v = R(), li = -u * .6 + v * .5 + rr(-.3, .3); dab(B, x + u * r, y - v * r * .5, rr(-.3, .3), rr(2.6, 4.6) * (s + .5), rr(1.4, 2.2) * (s + .5), cj(li > .55 ? pk(RKM) : li > -.1 ? pk(pl('7A6E86 6E6480 84748A')) : pk(pl('4E4A72 46466C 564E76')), 5), .94); }
        for (let i = 0; i < r * 1.6; i++) dab(B, x + rr(-1.3, 1.3) * r, y + rr(.2, 1.6), rr(-.08, .08), rr(3, 6) * (s + .4), rr(.9, 1.5), cj(hx('F2F6F4'), 3), rr(.5, .8)); }
    })();
    /* warm afternoon light from the upper left */
    (function () { const g = B.createRadialGradient(40, 50, 10, 40, 50, 400); g.addColorStop(0, 'rgba(255,214,150,.55)'); g.addColorStop(1, 'rgba(255,214,150,0)');
      B.globalCompositeOperation = 'soft-light'; B.globalAlpha = .45; B.fillStyle = g; B.fillRect(-5, -5, 410, DH + 10); B.globalCompositeOperation = 'source-over'; B.globalAlpha = 1; })();

    /* ---------- the spit and its lighthouse: boats in the basin pass behind this layer ---------- */
    const SP = part(-12, 70, 182, 178), Sc = SP.c;
    (function () {
      sd(41);
      Sc.globalAlpha = 1; Sc.fillStyle = '#9FB868'; Sc.beginPath(); for (let x = -12; x <= TIP; x += 3) Sc.lineTo(x, SPf(x)); Sc.quadraticCurveTo(TIP + 6, (SPf(TIP) + SPn(TIP)) / 2, TIP, SPn(TIP)); for (let x = TIP; x >= -12; x -= 3) Sc.lineTo(x, SPn(x)); Sc.closePath(); Sc.fill();
      /* turf, a pale path to the light, shingle and rock along the near shore, boulders and foam at the tip */
      for (let i = 0; i < 1100; i++) { const x = rr(-12, TIP + 3), f = SPf(Math.min(x, TIP)), n = SPn(Math.min(x, TIP)), y = rr(f - .5, n + .5), v = (y - f) / Math.max(1, n - f), e = x > TIP ? (x - TIP) / 5 : 0; if (Math.abs(v - .5) > .52 - e * .5) continue;
        const gn = fb(x / 22 + 2, y / 5), pth = Math.abs(v - .4 - .05 * Math.sin(x * .07)) < .07 && x > 16 && x < LX - 5; let q, a = .92;
        if (v > .84) q = gn > .5 || R() < .3 ? pk(RKL) : pk(RKM); else if (v > .68) q = mx(pk(FOM), GOLDM, .35 + .3 * gn); else if (v < .12) q = R() < .6 ? pk(RKS) : pk(FOS);
        else if (pth) q = pk(pl('EAD9A8 E4CC96 F0E2BC')); else q = gn > .56 ? pk(FOL) : gn > .36 ? mx(pk(FOL), pk(FOM), .5) : pk(FOM);
        dab(Sc, x, y, rr(-.12, .12), rr(4.5, 8.5), rr(1.3, 2), cj(q, 4), a, rr(-.08, .08)); }
      for (let x = -12; x < TIP; x += rr(1.6, 3)) { const y = SPn(x); dab(Sc, x, y - .2, rr(-.1, .1), rr(3, 5.5), rr(1.2, 1.8), cj(R() < .55 ? pk(RKS) : pk(RKM), 5), .8); }         // the shingle's shaded foot
      for (let i = 0; i < 60; i++) { const a = rr(-1.2, 1.2), r = rr(2, 8), x = TIP + 1 + Math.cos(a) * r, y = (SPf(TIP) + SPn(TIP)) / 2 + Math.sin(a) * r * .75, li = -Math.cos(a) * .2 - Math.sin(a) * .5 + rr(-.3, .3); dab(Sc, x, y, rr(-.4, .4), rr(3, 5), rr(1.6, 2.6), cj(li > .2 ? pk(RKL) : li > -.2 ? pk(RKM) : pk(RKS), 5), .94); }
      for (let x = -12; x < TIP + 8; x += rr(2.2, 4.4)) { const xx = Math.min(x, TIP), y = x > TIP ? (SPf(TIP) + SPn(TIP)) / 2 + rr(-6, 7) : SPn(xx) + rr(.3, 1.3); dab(Sc, x + rr(-.6, .6), y, rr(-.1, .1), rr(3, 6), rr(.9, 1.4), cj(hx('F4F7F4'), 3), rr(.45, .8)); }
      /* the keeper's house, and the long shadow the tower throws across the turf */
      sd(42);
      for (let i = 0; i < 26; i++) dab(Sc, LX + 5 + rr(0, 26), LB + rr(-.6, 2.4) + rr(0, 26) * .08, .1 + rr(-.06, .06), rr(4, 7), rr(1.3, 1.9), cj(pk(pl('5A6E8E 62749A 566A84')), 4), .6);
      for (let i = 0; i < 34; i++) dab(Sc, 107 + rr(-5.5, 5.5), LB - rr(0, 6.4), PI / 2 + rr(-.15, .15), rr(2.4, 3.6), rr(1.2, 1.7), cj(R() < .3 ? pk(WALLS) : pk(WALL), 4), .95);
      for (let i = 0; i < 30; i++) { const u = rr(-.6, .6), v = R(); if (v > 1 - Math.abs(u) * 1.2) continue; dab(Sc, 107 + u * 12, LB - 6.4 - v * 4.4, rr(-.2, .2), rr(2.4, 3.6), rr(1.1, 1.6), cj(u > .2 ? pk(ROOFS) : pk(ROOF), 5), .95); }
      dab(Sc, 105, LB - 2.6, PI / 2, 2.4, 1.3, '#6E78A8', .8); dab(Sc, 109.5, LB - 3, PI / 2, 2, 1.2, '#7E88B4', .75);
      /* the lighthouse: a tapering white tower in long upright strokes, lit from the left; gallery, lantern, red cap */
      sd(43);
      const hw = y => lp(3.5, 5.7, (y - LT) / (LB - LT));
      Sc.globalAlpha = 1; Sc.fillStyle = '#EFEAEA'; Sc.beginPath(); Sc.moveTo(LX - hw(LB) - .5, LB + .8); Sc.lineTo(LX - hw(LT), LT); Sc.lineTo(LX + hw(LT), LT); Sc.lineTo(LX + hw(LB) + .5, LB + .8); Sc.closePath(); Sc.fill();
      for (let i = 0; i < 210; i++) { const y = rr(LT + 1, LB), u = rr(-1, 1), li = -u * 1.1 + rr(-.22, .22) + .1; dab(Sc, LX + u * hw(y) * .88, y, -PI / 2 + rr(-.035, .035), rr(5, 10), rr(1.1, 1.9), cj(li > .55 ? pk(LHL) : li > -.15 ? pk(LHM) : li > -.75 ? pk(LHS) : pk(LHD), 3), .93); }
      for (let i = 0; i < 12; i++) dab(Sc, LX - hw(LB) * .9 + rr(-.3, .3) + (LB - LT) * 0, rr(LT + 3, LB - 2), -PI / 2 + .04, rr(6, 11), rr(.7, 1), cj(hx('FFFDF4'), 2), .75);                 // the sun down its left edge
      for (const y of [LT + 13, LT + 28, LT + 43]) dab(Sc, LX - .6 + rr(-.3, .3), y, PI / 2, 2.3, 1.2, '#566496', .8);
      dab(Sc, LX - .4, LB - 1.9, PI / 2, 3.8, 2, '#4E5A8C', .85);
      for (let i = 0; i < 16; i++) dab(Sc, LX + rr(-1.15, 1.15) * hw(LB), LB + rr(-2.6, 1), rr(-.2, .2), rr(2.6, 4), rr(1.3, 1.9), cj(R() < .4 ? pk(RKL) : pk(RKM), 5), .9);                 // its stone footing
      /* gallery, lantern and cap */
      Sc.globalAlpha = 1; Sc.fillStyle = '#6A6C98'; Sc.fillRect(LX - 5.1, LT - 1.5, 10.2, 1.7); Sc.fillStyle = '#F6F0E4'; Sc.fillRect(LX - 5.1, LT - 1.7, 4.8, .7);
      line(Sc, [[LX - 5, LT - 3.7], [LX + 5, LT - 3.7]], .4, '#4E5080', .85); for (const u of [-4.9, -2.5, 0, 2.5, 4.9]) line(Sc, [[LX + u, LT - 1.5], [LX + u, LT - 3.7]], .32, '#4E5080', .8);
      Sc.globalAlpha = 1; Sc.fillStyle = '#56648E'; Sc.fillRect(LX - 2.9, LT - 9.8, 5.8, 8.3); Sc.fillStyle = '#9FB2D2'; Sc.fillRect(LX - 2.9, LT - 9.8, 2.3, 8.3);
      dab(Sc, LX - .1, LT - 5.9, -PI / 2, 5.4, 2.7, '#FFE9A8', .96);                                                                                                    // the lamp behind its glass
      line(Sc, [[LX - .6, LT - 9.6], [LX - .6, LT - 1.6]], .28, '#3E4878', .7); line(Sc, [[LX + 1.4, LT - 9.6], [LX + 1.4, LT - 1.6]], .28, '#3E4878', .7);
      Sc.globalAlpha = 1; Sc.fillStyle = '#C8553D'; Sc.beginPath(); Sc.moveTo(LX - 4, LT - 9.6); Sc.lineTo(LX, LT - 15.4); Sc.lineTo(LX + 4, LT - 9.6); Sc.closePath(); Sc.fill();
      Sc.fillStyle = '#E88A62'; Sc.beginPath(); Sc.moveTo(LX - 4, LT - 9.6); Sc.lineTo(LX, LT - 15.4); Sc.lineTo(LX - .7, LT - 9.6); Sc.closePath(); Sc.fill();
      dab(Sc, LX + 1.4, LT - 11.2, -PI / 2 - .5, 3, 1.2, '#A8434A', .7);
      line(Sc, [[LX, LT - 15.2], [LX, LT - 18.6]], .38, '#4E5080', .9);
    })();

    /* ---------- the cliff top, nearest of all ---------- */
    const FG = part(206, 186, 412, DH + 6), Fc = FG.c;
    const mdc = (x, y) => { const z = cl((y - CE(x)) / 70 + .35, 0, 1), n = fb(x / 46 + 3, y / 22); let q = ramp(MZ, z); if (n > .56) q = mx(q, GOLDM, Math.min(.6, (n - .56) * 2.6)); else if (n < .42) q = mx(q, COOLM, Math.min(.45, (.42 - n) * 2)); return q; };
    const fden = (i, x, y) => ss(.5, .74, fb(x / 44 + FLW[i].o, y / 22 + FLW[i].o * .7)) * FLW[i].k;
    (function () {
      Fc.globalAlpha = 1; Fc.fillStyle = '#93B454'; Fc.beginPath(); for (let x = 208; x <= 414; x += 3) Fc.lineTo(x, CE(x) + 1.5); Fc.lineTo(414, DH + 8); Fc.lineTo(208, DH + 8); Fc.closePath(); Fc.fill();
      sd(51);
      for (let x = 208; x < 414; x += rr(1.6, 3.2)) { const y = CE(x); dab(Fc, x, y + rr(.5, 4), rr(-.5, -.1), rr(5, 10), rr(2, 3.4), cj(R() < .55 ? pk(pl('E2CFA4 D8C090 EADBB6')) : pk(pl('B4A0A8 A8949E')), 5), .9); }     // bare earth at the lip
      let y = 188;
      while (y < DH + 8) {
        let x = 206 + rr(0, 4);
        while (x < 414) {
          const yy = y + rr(-1.5, 1.5), d = yy - CE(x); if (d < rr(1.5, 5)) { x += 3; continue; }
          const z = cl(d / 70 + .35, 0, 1.1), w = 1.6 + 3 * z, l = 5 + 9 * z;
          let fl = -1; for (let i = 0; i < 3 && fl < 0; i++) if (R() < fden(i, x, yy) * .4) fl = i;
          if (fl >= 0) { const f = FLW[fl], s = (2 + 3.2 * z) * (fl === 0 ? 1.05 : .9);
            dab(Fc, x, yy - s * .35, rr(-PI, PI), s * rr(1.05, 1.3), s * rr(.85, 1.05), cj(pk(f.c), 6), .94, rr(-.1, .1));
            if (R() < .65) dab(Fc, x + rr(.1, .4) * s, yy - s * .35 + rr(.05, .35) * s, rr(-PI, PI), s * .7, s * .5, cj(pk(f.d), 6), .6);
            x += l * rr(.3, .5); continue; }
          let q = mdc(x + rr(-5, 5), yy + rr(-3, 3)); const r = R();
          if (r < .08) q = mx(q, pk(GOLDP), .5); else if (r < .16) q = mx(q, hx('6E7EAC'), .45); else if (r < .26) q = mx(q, hx('557A3E'), .55);
          dab(Fc, x, yy, -PI / 2 - .2 + rr(-.55, .55) + (fb(x / 45, yy / 16) - .5), l * rr(.75, 1.25), w * rr(.8, 1.2), cj(q, 9), .9, rr(-.15, .15));
          x += l * rr(.3, .5);
        }
        y += 2.5;
      }
      for (let x = 208; x < 414; x += rr(1.3, 2.6)) { const y2 = CE(x), h = rr(5, 11); dab(Fc, x, y2 + 3 - h * .4, -PI / 2 - .2 + rr(-.35, .35), h, rr(1.4, 2.4), cj(R() < .25 ? pk(GOLDP) : R() < .6 ? pk(GRL) : pk(GRM), 6), .92, rr(-.15, .15)); }   // grass standing over the lip
    })();

    /* ---------- the boats: built on the water every frame, hull along the course, sails set to the one wind ---------- */
    const MAST = 86, PITCH = .54;          // a mast at the bottom edge, in design units; how much a length lying away from us shows there, against one lying across
    const WX = -.3, WZ = -.954;            // the wind, as a direction over the water (x to the right, z away from us): it blows at us and a little to the left
    const SUNX = -.75, SUNZ = -.66;        // where the light comes from, in the same terms
    const HULL = [[-.33, -.075], [-.1, -.105], [.12, -.1], [.3, -.04], [.37, 0], [.3, .04], [.12, .1], [-.1, .105], [-.33, .075]], HXA = new Float32Array(9), HYA = new Float32Array(9);   // the deck from above: along the keel, across it; one unit to the mast

    /* ---------- the courses: six ways in to the mouth, then on to a mooring in the basin ---------- */
    const COURSE = [                       // waypoints to the mouth, the mooring, when in the round it sets out, how long it takes; tack: it has to beat there
      { p: [[-90, 295], [270, 262], [156, 202], [392, 177], [173, 127.6]], m: [122, 131], at: 2, dur: 54, tack: 1 },                      // up the near bay, in four boards
      { p: [[416, 156], [330, 152], [252, 143], [206, 135.6], [173, 131]], m: [92, 127], at: 10, dur: 46 },                                 // reaching in from the right, hardening up
      { p: [[416, 130], [300, 129], [215, 129], [172, 129]], m: [76, 136], at: 20, dur: 40 },                                             // a straight reach along the middle
      { p: [[250, 332], [150, 249.5], [300, 225], [190, 176.5], [330, 164.5], [174, 131]], m: [64, 131], at: 28, dur: 50, tack: 1 },    // out from under the cliff, in five
      { p: [[416, 104], [356, 107], [292, 112], [232, 119], [171, 127]], m: [38, 129], at: 38, dur: 50 },                     // a long run from the far right
      { p: [[308, 98.5], [272, 102], [234, 109], [202, 119], [171, 126]], m: [104, 135], at: 46, dur: 54 }];                              // a speck from the horizon, running
    const ROUND = 56, T0 = 6, TURN = 45;   // the first boat sets out at 2, not 0, so that the still at t = 6 finds it on its first board and not half way through a tack
    /* Courses are laid out on a chart of the water, not on the canvas. Across is the canvas's own x; away is v, which counts a length
       lying away from us as the canvas would show it lying across, so on the chart a direction is a true heading: a board sailed on
       one heading is a straight line there, and a tack is an arc. (Back on the canvas that board climbs ever more slowly as it recedes.) */
    const VK = 204 / PITCH, chart = p => [p[0], -VK * Math.log(Math.max(1e-3, p[1] - HZ))], canvas = q => [q[0], HZ + Math.exp(-q[1] / VK)];
    /* how far along its course a boat is: lengths measured on the chart, so it keeps its speed through a tack and on a board lying
       away from us; a near boat covers the chart a little faster than a far one */
    const gm = P => { const L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]) / Math.pow(sc(canvas([0, (P[i][1] + P[i - 1][1]) / 2])[1]), .3)); return L; };
    const dense = (O, step) => { const D = [O[0]]; for (let i = 1; i < O.length; i++) { const a = O[i - 1], b = O[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); for (let j = 1; j <= n; j++) D.push([lp(a[0], b[0], j / n), lp(a[1], b[1], j / n)]); } return D; };
    const beat = P => { const O = [P[0]];      // boards joined by round turns, each some three quarters of a boat's length in radius where it is made
      for (let i = 1; i < P.length - 1; i++) { const a = P[i - 1], b = P[i], c = P[i + 1], l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]),
          ux = (b[0] - a[0]) / l1, uy = (b[1] - a[1]) / l1, wx = (c[0] - b[0]) / l2, wy = (c[1] - b[1]) / l2, th = Math.acos(cl(ux * wx + uy * wy, -1, 1)), sg = ux * wy - uy * wx < 0 ? -1 : 1,
          tn = Math.max(Math.tan(th / 2), 1e-3), d = Math.min((TURN * sc(canvas(b)[1]) + 8) * tn, .42 * l1, .42 * l2), R = d / tn, px = sg * uy * R, py = -sg * ux * R, cx = b[0] - ux * d - px, cy = b[1] - uy * d - py;
        for (let j = 0, n = Math.max(3, Math.ceil(th * 7)); j <= n; j++) { const an = sg * th * j / n; O.push([cx + px * Math.cos(an) - py * Math.sin(an), cy + px * Math.sin(an) + py * Math.cos(an)]); } }
      O.push(P[P.length - 1]); return dense(O, 8); };
    const route = (C, i, n) => {      // crossing n of course i: the same landfall, a new line through the water
      const P = C.p.map((q, k) => { const j = k === 0 ? 0 : k === C.p.length - 1 ? .35 : 1, a = (C.tack ? 5 : 15) * sc(q[1]) * j, c = chart(q); return [c[0] + (hs(i * 7 + k, n * 13 + 1) - .5) * 2 * a, c[1] + (hs(i * 7 + k, n * 13 + 2) - .5) * a]; }).concat([chart(C.m)]);   // shifted on the chart, so a heading shifts little
      const Q = C.tack ? beat(P) : cr(P, 7); return { Q: Q.map(canvas), L: gm(Q) }; };
    COURSE.forEach(C => { C.cache = {}; });
    const routeOf = (i, n) => { const C = COURSE[i]; return C.cache[n] || (C.cache = {}, C.cache[n] = route(C, i, n)); };
    /* Where boat i is at time t: its place and size, the way it heads over the water (read off a half second of its course, so its
       hull always lies along its own track), how much of it shows, and whether it is inside the basin. null while it is away. */
    function boat(i, t) {
      const C = COURSE[i], tt = t + T0 - C.at, n = Math.floor(tt / ROUND), q = tt - n * ROUND; if (q >= C.dur) return null;
      const r = routeOf(i, n), u = q / C.dur, e = .25 / C.dur, p = pat(r.Q, r.L, u), a = pat(r.Q, r.L, u - e), c = pat(r.Q, r.L, u + e), s = sc(p[1]);
      let fx = c[0] - a[0], fz = (a[1] - c[1]) / (PITCH * s); const fl = Math.hypot(fx, fz) || 1; fx /= fl; fz /= fl;
      return { i: i, n: n, u: u, r: r, x: p[0], y: p[1], s: s, fx: fx, fz: fz, inb: p[0] < 172 && p[1] < (p[0] < TIP ? SPf(p[0]) : 142), v: (i + n) % 3,
        al: ss(0, .035, u) * (1 - ss(.9, 1, u)), ph: i * 2.1 + n, dur: C.dur };
    }

    /* ---------- clouds: cumulus sprites that drift left, down the wind, and wrap ---------- */
    const CM = 8, CLOUDS = [];
    function cloud(cx, yb, puffs, v, seed, flat, k) {
      sd(seed);
      const P = [], ks = lp(1, k, .7); let x0 = 1e9, x1 = -1e9, y0 = 1e9;
      for (const p of puffs) { const px = cx + p[0] * k, py = yb + p[1] * k, r = p[2] * k, ry = (p[3] || p[2]) * k; P.push([px, py, r * r, ry * ry]); x0 = Math.min(x0, px - r); x1 = Math.max(x1, px + r); y0 = Math.min(y0, py - ry); }
      x0 -= 6 * k; x1 += 6 * k; y0 -= 6 * k; const y1 = yb + 8 * k, w = x1 - x0, h = y1 - y0;
      const den = (x, y) => { let s = 0; for (const p of P) { const dx = x - p[0], dy = y - p[1]; s += Math.exp(-dx * dx / p[2] - dy * dy / p[3]); }
        const yl = yb + (vn(x / (18 * k), seed) - .5) * 5 * k; if (y > yl) s *= Math.exp(-Math.pow((y - yl) / ((flat ? 3 : 5) * k), 2));
        return s + (fb(x / (14 * k) + seed, y / (10 * k)) - .5) * .32; };
      const nrm = (x, y) => { const e = 5 * k, gx = den(x + e, y) - den(x - e, y), gy = den(x, y + e) - den(x, y - e), gm2 = Math.sqrt(gx * gx + gy * gy) + 1e-6; return [gx / gm2, gy / gm2, gm2]; };
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
      CLOUDS.push({ o: O[0], x0: x0, y0: y0, w: w, v: v, span: 400 + w + 2 * CM + 30 });
    }
    cloud(268, 58, [[-92, -9, 16], [-70, -17, 21], [-44, -26, 26], [-12, -34, 30], [22, -38, 31], [54, -29, 27], [82, -18, 21], [104, -8, 14], [-28, -54, 20], [6, -62, 22], [34, -53, 19], [-58, -38, 14], [64, -44, 14]], 1.7, 71, 0, .6);
    cloud(66, 40, [[-58, -6, 12], [-40, -12, 16], [-18, -20, 20], [8, -23, 21], [32, -16, 16], [52, -8, 11], [-6, -36, 14], [18, -34, 12]], 2.2, 72, 0, .62);
    cloud(150, 74, [[-62, -2, 14, 4], [-40, -3, 18, 5], [-14, -4, 20, 6], [12, -4, 20, 6], [38, -3, 18, 5], [62, -2, 13, 4]], 1.2, 74, 1, .56);
    cloud(470, 30, [[-46, -5, 11], [-28, -12, 15], [-6, -19, 19], [18, -21, 18], [40, -13, 14], [58, -6, 10], [6, -33, 13], [-16, -29, 11]], 2.5, 75, 0, .58);
    cloud(384, 22, [[-26, -4, 8], [-12, -8, 11], [4, -11, 12], [18, -7, 9], [30, -3, 6]], 2.9, 73, 0, .7);

    /* ---------- the live layer ---------- */
    /* glints whose light breathes in and out, each on its own phase */
    const GC = ['#CFE2F0', '#DCEAF2', '#EEF3F2', '#F8EED4', '#FFF6DA', '#3F5F9E', '#4A5A9A'], GL = [];
    sd(81);
    for (let i = 0; i < 6000 && GL.length < 130; i++) {
      const y = HZ + 3 + Math.pow(R(), .8) * (DH - HZ - 3), x = rr(-5, 405); if (fb(x * .018 + 11, y * .09) < .5 + rr(-.08, .08)) continue;
      if ((x < CAPE && y < MLs(x) + 2) || (x < TIP + 6 && y > SPf(Math.min(x, TIP)) - 2 && y < SPn(Math.min(x, TIP)) + 2) || y > CE(x) - 3) continue;
      const s = sc(y), r = R(), ci = r < .5 ? R() * 3 | 0 : r < .7 ? 3 + (R() * 2 | 0) : 5 + (R() * 2 | 0);
      GL.push([x, y, lp(3, 17, Math.pow(s, 1.2)) * rr(.7, 1.3), lp(.7, 2.2, s) * rr(.8, 1.2), ci, rr(.35, .65) * (1 - .4 * basin(x, y)), rr(.45, 1.2), rr(0, 6.3), lp(.5, 3, s), rr(.25, .6), rr(0, 6.3)]);
    }
    /* foam that comes and goes: round the spit's tip, along its near shore, on the shoal */
    const FM = []; sd(83);
    for (let i = 0; i < 16; i++) { const a = rr(-1.3, 1.3); FM.push([TIP + 2 + Math.cos(a) * rr(7, 10), (SPf(TIP) + SPn(TIP)) / 2 + Math.sin(a) * rr(6, 8), rr(3, 6), rr(1, 1.5), rr(.5, 1.1), rr(0, 6.3)]); }
    for (let i = 0; i < 20; i++) { const x = rr(-8, TIP - 4); FM.push([x, SPn(x) + rr(1.4, 2.6), rr(4, 8), rr(1, 1.5), rr(.5, 1.1), rr(0, 6.3)]); }
    for (let i = 0; i < 12; i++) { const a = rr(0, 6.3); FM.push([60 + Math.cos(a) * rr(8, 13), 246 + Math.sin(a) * rr(3, 5) + 1, rr(4, 7), rr(1.1, 1.7), rr(.5, 1.1), rr(0, 6.3)]); }
    /* gulls, each on its own slow loop */
    const GU = []; sd(85);
    for (const [cx, cy, rx, ry, z] of [[150, 62, 46, 14, 1], [214, 118, 60, 12, .8], [316, 150, 50, 18, 1.2], [96, 196, 44, 12, 1.1], [352, 84, 36, 12, .7], [258, 44, 52, 12, .9]]) GU.push({ cx: cx, cy: cy, rx: rx, ry: ry, z: z, w: rr(.16, .26) * (R() < .5 ? 1 : -1), ph: rr(0, 6.3), fl: rr(5, 7.5), fp: rr(0, 6.3) });
    /* tall grasses and flowers on the cliff top that lean with the wind, sorted by their roots */
    const LV = []; sd(87);
    for (let i = 0; i < 4000 && LV.length < 60; i++) {
      const x = rr(212, 410), y = rr(194, DH + 4), d = y - CE(x); if (d < 5) continue;
      const z = cl(d / 70 + .35, 0, 1.1), l = 5 + 9 * z, w = 1.6 + 3 * z, g = -x * 2 + y * 1.2;
      if (R() < .5) { const r = R(); LV.push({ k: 0, x: x, y: y, g: g, a0: -PI / 2 - .2 + rr(-.22, .22), l: l * rr(1.3, 2.1), w: w * rr(.3, .5), c: rgb(mx(r < .4 ? pk(GRL) : r < .75 ? pk(GRM) : pk(GOLDP), mdc(x, y), rr(.25, .5))), fx: rr(.8, 1.2), lg: rr(0, .15) }); }
      else { let fi = 0, best = -1; for (let j = 0; j < 3; j++) { const dd = fden(j, x, y) + rr(0, .5); if (dd > best) { best = dd; fi = j; } }
        const f = FLW[fi], s = (2.2 + 3.4 * z) * rr(.9, 1.15);
        LV.push({ k: 1, x: x, y: y, g: g, ls: l * rr(.6, 1.05), s: s, fx: rr(.9, 1.15), lg: rr(.05, .3), na: rr(.06, .12), nw: rr(1.3, 2.4), np: rr(0, 6.283), a1: rr(-PI, PI), c1: cj(pk(f.c), 6), c2: cj(pk(f.d), 6), sc: cj(pk(STEMC), 6), d2: [rr(.1, .4), rr(.05, .35), rr(-1, 1)] }); }
    }
    LV.sort((a, b) => a.y - b.y);

    const WK = 36, WDT = .5, NB = COURSE.length, LY = LT - 5.9;       // wake samples and the seconds between them; the lamp's height
    const softs = c => c / Math.sqrt(c * c + .0225);                 // which side, easing through the middle
    const tone = (P, k) => k < .5 ? mx(P.s[0], P.m[0], cl(k * 2, 0, 1)) : mx(P.m[0], P.l[0], cl(k * 2 - 1, 0, 1));
    /* A sail: head A, tack T, clew C, its leech bowed out through (kx, ky). Long strokes run up from the foot toward the head, a light line down the leech. */
    function sail(A, T, C, kx, ky, q, P, al, K) {
      X.globalAlpha = al; X.fillStyle = rgb(q); X.beginPath(); X.moveTo(A[0], A[1]); X.lineTo(T[0], T[1]); X.lineTo(C[0], C[1]); X.quadraticCurveTo(kx, ky, A[0], A[1]); X.closePath(); X.fill();
      const fw = Math.hypot(C[0] - T[0], C[1] - T[1]);
      if (fw > 1.6) for (let j = 0; j < 6; j++) { const f = (j + .5) / 6, bx = lp(T[0], C[0], f), by = lp(T[1], C[1], f), u1 = .1 + .76 * (1 - .62 * f), x0 = lp(bx, A[0], .06), y0 = lp(by, A[1], .06), x1 = lp(bx, A[0], u1), y1 = lp(by, A[1], u1);
        dab(X, (x0 + x1) / 2, (y0 + y1) / 2, Math.atan2(y1 - y0, x1 - x0), Math.hypot(x1 - x0, y1 - y0), fw * .15, rgb(mx(q, j % 2 ? P.s[0] : P.l[0], j % 2 ? .3 : .42)), .55 * al, 0); }
      X.globalAlpha = .75 * al; X.strokeStyle = rgb(mx(q, P.l[0], .6)); X.lineWidth = Math.max(.3, .012 * K); X.beginPath(); X.moveTo(C[0], C[1]); X.quadraticCurveTo(kx, ky, A[0], A[1]); X.stroke();
    }
    function drawBoat(b, t, I) {
      const s = b.s, K = MAST * s, pt = PITCH * s, P = BOAT[b.v], fx = b.fx, fz = b.fz, rx = fz, rz = -fx, x0 = b.x, y0 = b.y + .5 * s * Math.sin(1.7 * t + b.ph);   // (rx, rz): her own starboard
      /* The wind on this heading: how far off it she points (th), how hard it presses across her, to starboard (c). From those, the sheet
         she carries, the side the boom lies (to leeward; to port when she runs square), where the boom points, and how she heels. */
      const th = Math.acos(cl(-(fx * WX + fz * WZ), -1, 1)), c = WX * rx + WZ * rz, phi = lp(.21, 1.4, ss(.78, 3, th)), side = softs(c - .45 * ss(2.4, 3, th)), be = phi * side,
        bx = -Math.cos(be) * fx + Math.sin(be) * rx, bz = -Math.cos(be) * fz + Math.sin(be) * rz,
        roll = .16 * c * (1 - .6 * ss(1.6, 3, th)) + .03 * Math.sin(1.3 * t + b.ph), pch = .022 * Math.sin(1.9 * t + b.ph * 1.7),
        lx = Math.sin(roll) * rx + Math.sin(pch) * fx, lz = Math.sin(roll) * rz + Math.sin(pch) * fz, lh = Math.cos(roll) * Math.cos(pch),      // the masthead, against the mast's foot
        wd = ss(5, 7.5, K), ha = Math.atan2(-fz * pt, fx), hl = Math.hypot(fx, fz * pt);      // how much detail her size can carry; her keel as the canvas shows it
      X.setTransform(DS, 0, 0, DS, 0, 0);
      if (wd < 1) { const a0 = b.al * (1 - wd);       // far off she is two touches: a sail standing, a hull along her track
        dab(X, x0 + (.15 * bx + .5 * lx) * K, y0 - K * .52, -PI / 2 + lx, K * .95, Math.max(.8, K * (.1 + .3 * Math.abs(bx))), P.cm, .95 * a0, 0);
        dab(X, x0, y0, ha, Math.max(1.6, K * .68 * hl), Math.max(.6, K * .08), P.ch, .9 * a0, 0); }
      if (wd <= 0) return;
      const a = b.al * wd, dk = .055 * K, bwx = x0 + .37 * fx * K, bwy = y0 - .37 * fz * K * pt;
      const wave = () => { for (let j = 0; j < 2; j++) dab(X, bwx - Math.cos(ha) * j * 2 * s, bwy + .5 * s + j * .8 * s, ha, (3 + 3 * j) * s + 1, 1.2 * s + .4, '#F4F8F6', (.7 - .2 * j) * a, 0); };
      const helm = () => { const qx = x0 - .22 * fx * K, qy = y0 + .22 * fz * K * pt - dk; dab(X, qx, qy - .05 * K, PI / 2, .1 * K, .045 * K, '#45549A', .95 * a, 0); dab(X, qx, qy - .115 * K, 0, .034 * K, .03 * K, '#E0A07A', .95 * a, 0); dab(X, qx, qy - .132 * K, 0, .07 * K, .022 * K, '#E8C65A', .95 * a, 0); };
      /* her reflection, broken by the water; the dark she lays on it */
      const rw = cl(.25 + .75 * Math.abs(bx), .25, 1), rcx = x0 + (.06 * fx + .14 * bx) * K;
      for (let k = 0; k < 6; k++) { const v = (k + .6) / 6; dab(X, rcx + (.4 + 1.6 * s) * Math.sin(1.2 * t + k * 1.7 + b.ph) * (1 + k * .25) - lx * K * v * .5, y0 + 1.2 * s + v * K * .62, .03, K * rw * lp(.3, .07, v) * (k % 2 ? .8 : 1), Math.max(.7, 2.6 * s), P.rf[k], (.66 - .46 * v) * a, 0); }
      dab(X, x0, y0 + .7 * s, ha, K * .7 * hl, Math.max(.6, .04 * K), '#3E4E86', .38 * a, 0);
      if (fz > 0) wave();
      /* the hull: the sides turned to us, each lit by how it faces the sun, then the deck over them and a stripe along its edge */
      for (let i = 0; i < 9; i++) { const gx = HULL[i][0] * fx + HULL[i][1] * rx, gz = HULL[i][0] * fz + HULL[i][1] * rz; HXA[i] = x0 + gx * K; HYA[i] = y0 - gz * K * pt; }
      X.lineJoin = 'round'; X.lineWidth = Math.max(.25, .006 * K);
      for (let i = 0; i < 9; i++) { const j = (i + 1) % 9, da = HULL[j][0] - HULL[i][0], dc = HULL[j][1] - HULL[i][1], l = Math.hypot(da, dc), na = dc / l, nc = -da / l, nx = na * fx + nc * rx, nz = na * fz + nc * rz; if (nz > .02) continue;
        const q = rgb(mx(P.hs[0], P.hull[0], cl(.55 + .45 * (nx * SUNX + nz * SUNZ), 0, 1)));
        X.globalAlpha = a; X.fillStyle = q; X.strokeStyle = q; X.beginPath(); X.moveTo(HXA[i], HYA[i] - dk); X.lineTo(HXA[j], HYA[j] - dk); X.lineTo(HXA[j], HYA[j]); X.lineTo(HXA[i], HYA[i]); X.closePath(); X.fill(); X.stroke(); }
      X.globalAlpha = a; X.fillStyle = P.cd; X.beginPath(); for (let i = 0; i < 9; i++) X.lineTo(HXA[i], HYA[i] - dk); X.closePath(); X.fill();
      X.globalAlpha = .85 * a; X.strokeStyle = P.stripe; X.lineWidth = Math.max(.3, .014 * K); X.stroke();
      const dq = Math.hypot(rx, rz * pt);                                                                  // her beam as the canvas shows it
      dab(X, x0 + (.04 * fx + .04 * rx) * K, y0 - (.04 * fz + .04 * rz) * K * pt - dk, ha, .44 * K * hl, Math.max(.4, .05 * K * dq), '#FFF6E2', .5 * a, 0);
      dab(X, x0 + (.02 * fx - .045 * rx) * K, y0 - (.02 * fz - .045 * rz) * K * pt - dk, ha, .38 * K * hl, Math.max(.4, .045 * K * dq), '#B9A27C', .42 * a, 0);
      dab(X, x0 - .13 * fx * K, y0 + .13 * fz * K * pt - dk, ha, .17 * K * hl, Math.max(.4, .075 * K * dq), '#857668', .6 * a, 0);
      if (fz <= 0) wave(); else helm();
      /* mast and sails. The mainsail hangs from the mast with its foot along the boom; the jib from the forestay, sheeted to the same side,
         or goosewinged across to the other when she runs square. Each takes its tone from the face we see and how that face meets the sun. */
      const mx0 = x0 + .06 * fx * K, my0 = y0 - .06 * fz * K * pt - dk, MXv = v => mx0 + v * lx * K, MYv = v => my0 - v * (lz * pt + lh) * K,
        hd = [MXv(.97), MYv(.97)], tk = [MXv(.14), MYv(.14)], cw = [tk[0] + bx * .42 * K, tk[1] - bz * .42 * K * pt + .012 * K], nm = bx > 0 ? 1 : -1,
        bj = (phi * .95 + .05) * side * (1 - 2 * ss(2.75, 3.05, th)), jx = -Math.cos(bj) * fx + Math.sin(bj) * rx, jz = -Math.cos(bj) * fz + Math.sin(bj) * rz, nj = jx > 0 ? 1 : -1,
        jh = [MXv(.8), MYv(.8)], jt = [x0 + .36 * fx * K, y0 - .36 * fz * K * pt - dk - .01 * K], jc = [jt[0] + jx * .3 * K, jt[1] - jz * .3 * K * pt - .09 * K];
      const jib = () => sail(jh, jt, jc, (jc[0] + jh[0]) / 2 + (jx * .03 + rx * side * .03) * K, (jc[1] + jh[1]) / 2 - (jz * .03 + rz * side * .03) * K * pt, tone(P, .5 + .42 * (nj * jz * SUNX - nj * jx * SUNZ)), P, a, K);
      if (fz > 0) jib();
      sail(hd, tk, cw, (cw[0] + hd[0]) / 2 + (bx * .07 + rx * side * .035) * K, (cw[1] + hd[1]) / 2 - (bz * .07 + rz * side * .035) * K * pt, tone(P, .55 + .45 * (nm * bz * SUNX - nm * bx * SUNZ)), P, a, K);
      line(X, [tk, cw], Math.max(.3, .014 * K), '#86708E', .9 * a);
      if (fz <= 0) jib();
      line(X, [[mx0, my0], [MXv(1.02), MYv(1.02)]], Math.max(.35, .017 * K), '#7A6890', .95 * a); line(X, [[mx0 - .006 * K, my0], [MXv(1.02) - .006 * K, MYv(1.02)]], Math.max(.2, .006 * K), '#D9A880', .6 * a);
      if (fz <= 0) helm();
      const pa = Math.atan2(-WZ * pt, WX) + .18 * Math.sin(7 * t + b.ph);                                      // the pennant streams down the wind
      dab(X, MXv(1.02) + Math.cos(pa) * .045 * K, MYv(1.02) + Math.sin(pa) * .045 * K, pa, .09 * K, .026 * K, '#C8553D', .95 * a, .1 * Math.sin(9 * t + b.ph));
      if (I > .03) dab(X, (hd[0] + tk[0] + cw[0]) / 3, (hd[1] + tk[1] + cw[1]) / 3, Math.atan2(hd[1] - tk[1], hd[0] - tk[0]), .5 * K, Math.max(.6, Math.abs(cw[0] - tk[0]) * .3), '#FFF2C4', .34 * I * a, 0);     // the lamp's flash, caught on the sail
    }
    function frame(t) {
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
      X.drawImage(BG, 0, 0);
      for (const c of CLOUDS) { const x = ((c.x0 + c.w + CM - c.v * t) % c.span + c.span) % c.span - c.w - CM; X.drawImage(c.o, Math.round((x - CM) * DS), Math.round((c.y0 - CM) * DS)); }
      X.setTransform(DS, 0, 0, DS, 0, 0);
      const I = flash(t), BS = [];
      for (let i = 0; i < NB; i++) { const b = boat(i, t); if (b) BS.push(b); }
      /* on the water: glints, foam, the lamp's path, and behind each boat its course */
      for (const g of GL) { const f = Math.sin(g[6] * t + g[7]); if (f <= .02) continue; dab(X, g[0] + g[8] * Math.sin(g[9] * t + g[10]), g[1], 0, g[2], g[3], GC[g[4]], g[5] * f * Math.sqrt(f), 0); }
      for (const f of FM) { const a = .5 + .5 * Math.sin(f[4] * t + f[5]); dab(X, f[0] + .8 * Math.sin(f[4] * .7 * t + f[5]), f[1], 0, f[2] * (.7 + .5 * a), f[3], '#F6F9F6', .75 * a * a, 0); }
      if (I > .02) for (let k = 0; k < 8; k++) { const v = k / 8, y = SPn(LX) + 2 + v * 50; dab(X, LX + (1 + 3 * v) * Math.sin(2.1 * t + k * 1.9), y, 0, (5 + 10 * sc(y)) * (1 - .3 * v), 1 + 2 * sc(y), '#FFF0BE', .6 * I * (1 - v * .8), 0); }
      for (const b of BS) { let q = [b.x, b.y];
        for (let k = 1; k <= WK; k++) { const u = b.u - k * WDT / b.dur; if (u < 0) break;
          const p = pat(b.r.Q, b.r.L, u), s = sc(p[1]), ag = k / WK, tx = q[0] - p[0], ty = q[1] - p[1], tl = Math.hypot(tx, ty) + 1e-6, a = Math.atan2(ty, tx), fade = Math.pow(1 - ag, 1.15) * b.al * ss(0, .1, b.u) * lp(.5, 1, ss(.04, .4, s)), len = Math.max(tl * 1.25, 3 * s + 1);
          q = p;
          if (k < 12) dab(X, p[0] + tx * .5, p[1] + ty * .5 + .5 * s, a, len, (2.4 + 3.4 * ag) * s + .5, '#D2EAEC', .34 * (1 - k / 12) * fade, 0);
          for (let sd2 = -1; sd2 <= 1; sd2 += 2) { if (hs(k * 3 + sd2 + b.i * 31, b.n + 9) < .16) continue; const o = sd2 * (.8 + 12 * ag) * s + (.5 + 2 * ag) * s * Math.sin(k * 1.9 + 1.1 * t + sd2 * 2), h2 = hs(k + sd2 * 7 + b.i * 13, b.n + 3);
            dab(X, p[0] + tx * .5 - ty / tl * o, p[1] + ty * .5 + tx / tl * o * .55 + .5 * s, a + sd2 * .07, len, (1.1 + 2.6 * ag) * s + .4, k > 20 ? '#D2E4EE' : '#EEF5F6', (.34 + .34 * h2) * fade, sd2 * .04); } } }
      /* boats in the basin, then the spit and the lighthouse over them, then the lamp */
      BS.sort((a, b) => a.y - b.y);
      for (const b of BS) if (b.inb) drawBoat(b, t, I);
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(SP.o, SP.px, SP.py);
      X.setTransform(DS, 0, 0, DS, 0, 0);
      dab(X, LX, LY, 0, 3.4, 3, '#FFF6D0', .55 + .45 * Math.min(1, I), 0);
      if (I > .02) { const J = Math.min(1, I); dab(X, LX, LY, 0, 6 + 15 * J, 5 + 11 * J, '#FFF2C0', .42 * J, 0); for (let k = 0; k < 4; k++) dab(X, LX, LY, k * PI / 4, (k % 2 ? 15 : 26) * J, .7, '#FFF8DC', .5 * J, 0); dab(X, LX, LY, 0, 4.2, 3.4, '#FFFFFF', J, 0); }
      for (const b of BS) if (!b.inb) drawBoat(b, t, I);
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.drawImage(FG.o, FG.px, FG.py);
      X.setTransform(DS, 0, 0, DS, 0, 0);
      for (const it of LV) {
        if (it.k === 0) { const L = it.fx * wind(it.g, t - it.lg), a = it.a0 - L, ca = Math.cos(a), sa = Math.sin(a); dab(X, it.x + ca * it.l * .5, it.y + sa * it.l * .5, a, it.l, it.w, it.c, .88, L * .35); }
        else { const L = it.fx * wind(it.g, t - it.lg) + it.na * Math.sin(it.nw * t + it.np), ca = -Math.sin(L + .2), sa = -Math.cos(L + .2), hx2 = it.x + ca * it.ls, hy2 = it.y + sa * it.ls, s = it.s;
          dab(X, (it.x + hx2) * .5, (it.y + hy2 + s * .3) * .5, Math.atan2(hy2 - it.y, hx2 - it.x), it.ls, Math.max(.6, s * .14), it.sc, .7, L * .25);
          dab(X, hx2, hy2, it.a1 - L, s * 1.2, s * .98, it.c1, .94, .08); dab(X, hx2 + it.d2[0] * s, hy2 + it.d2[1] * s, it.d2[2] - L, s * .7, s * .5, it.c2, .6, 0); }
      }
      for (const g of GU) { const a = g.w * t + g.ph, x = g.cx + g.rx * Math.cos(a), y = g.cy + g.ry * Math.sin(2 * a) * .7 + g.ry * .3 * Math.sin(a), wg = .2 + .42 * Math.sin(g.fl * t + g.fp), r = 4.6 * g.z, ca = Math.cos(wg), sa = Math.sin(wg);
        dab(X, x - ca * r * .5, y - sa * r * .5, PI + wg, r, .95 * g.z, '#FBF8F0', .95, .16); dab(X, x + ca * r * .5, y - sa * r * .5, -wg, r, .95 * g.z, '#F1EEF2', .95, -.16); dab(X, x, y + .2 * g.z, 0, 1.7 * g.z, 1 * g.z, '#D8D6E2', .9, 0); }
      X.globalAlpha = 1; X.setTransform(1, 0, 0, 1, 0, 0);
    }
    return { frame: frame };
  }

  window.Vignettes.multitask = {
    title: 'One Light, Many Courses',
    aspect: 4 / 3,
    create: function (canvas) {
      let st = build(canvas);
      return { frame: function (t) { st.frame(t); }, resize: function () { st = build(canvas); } };
    }
  };
})();
