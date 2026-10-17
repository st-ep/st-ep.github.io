/* Chladni Sand: a square brass Chladni plate seen from above, clamped by a bolt at its centre and lying in the
   sun on a light wooden studio table. Pale sand is heaped along the nodal lines of one classic low mode (both
   diagonals and four arcs: the zero set of cos 2pi x cos 4pi y - cos 4pi x cos 2pi y) and, over a slow 14 s
   cycle, twists smoothly into a nearby pinwheel mode and back, the clamped centre always staying a node.
   Vignette for "Learning Generalizable Neural Operators for Inverse Problems". Painting space is 100 units tall
   and as wide as the frame (133 units at 4:3); the plate keeps its size against the height and stays square, with
   sunlit table on both sides and a violin bow resting on the left, its tip against the plate's lit edge.
   Value plan: sunlit table (light), brass plate (a darker field), sand (lightest), deep blue violet cast shadow.
   Still layers: table, cast shadow and plate in one canvas, plus the sand alone baked at NK modes.
   Every frame lays the whole still canvas, then the trembling sunlight on the brass, then the sand. The sand
   changes mode as a union of neighbouring keyframes with an opaque layer always on top (the next mode fades in
   beneath, the two trade places briefly, the old one fades out beneath), so a ridge never goes see-through.
   Live grains ride the moving lines and shiver as the plate hums, stray grains dance, and glints catch the sun. */
(function () {
  var PI = Math.PI, TAU = 2 * PI;
  function mb(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var R = mb(1);
  function sd(n) { R = mb(n * 7919 + 13); }
  function rr(a, b) { return a + (b - a) * R(); }
  function pk(a) { return a[Math.floor(R() * a.length)]; }
  function cl(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lp(a, b, t) { return a + (b - a) * t; }
  function ss(a, b, x) { var t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function hs(i, j) { var h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
  function vn(x, y) { var i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return lp(lp(hs(i, j), hs(i + 1, j), a), lp(hs(i, j + 1), hs(i + 1, j + 1), a), b); }
  function fb(x, y) { return 0.65 * vn(x, y) + 0.35 * vn(x * 2.7 + 5, y * 2.7 + 9); }
  function gs() { return (R() + R() + R() - 1.5) * 2; }
  function sp(s) { return s.split(' ').map(function (v) { return '#' + v; }); }

  /* A tapered, slightly bowed dab (the hero's stroke). */
  function B(c, x, y, a, l, w, col, al, bd) {
    var ca = Math.cos(a), sa = Math.sin(a), h = l / 2, nx = -sa, ny = ca, q = w / 2, b = (bd || 0) * l,
      tx = x - ca * h, ty = y - sa * h, hx = x + ca * h, hy = y + sa * h, mx = x + nx * b, my = y + ny * b;
    c.globalAlpha = al; c.fillStyle = col; c.beginPath();
    c.moveTo(tx + nx * q, ty + ny * q);
    c.quadraticCurveTo(mx + nx * q * 1.4, my + ny * q * 1.4, hx - ca * q * 0.3, hy - sa * q * 0.3);
    c.quadraticCurveTo(mx - nx * q * 1.4, my - ny * q * 1.4, tx - nx * q, ty - ny * q);
    c.quadraticCurveTo(tx - ca * q * 1.3, ty - sa * q * 1.3, tx + nx * q, ty + ny * q);
    c.fill();
  }

  var C = {
    /* table in sun: light wood, mid wood, honey, peach, rose, seam brown (seams only), sun flecks, lilac reflections,
       green gold, far-corner violet */
    tl: sp('D4AA84 CEA480 D8B08A CAA282 D2A886'), tm: sp('C4946E BE906C C89A74 BA8C6E C0926E'), th: sp('D4A46C CC9E68 D8AC76'),
    tp: sp('E0AA86 DAA282 E4B28E'), tr: sp('D69888 CE9286 DCA294'), td: sp('9A7864 927262 A07C68'), tz: sp('84626A 7C5E70 8A6862 765C6E'), ty: sp('F0D8B4 F4DEBC ECD0AA'),
    tv: sp('B4A6C2 AEA0BC BAACC6'), tg: sp('C6AE7A BEA87A'), tc: sp('9286AC 8A7EA6 988CB0 847A9E'),
    /* the plate's cast shadow on the table: blue violet core, warm reflected light, lighter rim, deepest at the corner */
    sh: sp('4E4C8A 54528E 4A4A84 585490 504E8A'), sw: sp('7C5C7C 725A80 806080'), sl: sp('706CA4 7874AA 6C68A0 7C76AA'),
    cn: sp('46447C 4C4A82 504A80 44427A'),
    /* brass: sun, light gold, old gold, bronze, deep bronze, violet, sky reflections, deep blue, copper, patina, rose */
    hi: sp('FFEFC0 FBE4AC FFE6A6 FFF2D2'), lt: sp('E2B868 DCAE60 E8C276 D8AA5C'),
    md: sp('C09248 B88A44 C69C56 B2884A BC9050'), bz: sp('A0703C 966838 A87A44 8E6238 9C6E3E'),
    dk: sp('7A4E36 724834 805438 6E4632 784C38'), vi: sp('6E5E8C 786698 665888 7E6C9C 6A588A'),
    co: sp('8A94C0 929AC4 808AB8 9AA0C8 8690BE'), cd: sp('626AA0 5C6298 6A6AA0 605E94'),
    cu: sp('B8703E C07A48 AE6A3A'), gr: sp('7E8E5E 74886A'), ro: sp('C88C7C C08474 D09A88'),
    /* sand: lit ivory, cream crest, ochre, rose, lemon, lilac shade; grain shadow; sparkle */
    sL: sp('FFF8E8 FFF4DC FCEED2 FFF6E2 FBEACA'), sC: sp('F6E6C8 F2DEB8 EFD8AE F6E2C0 EDD4A6'), sO: sp('E8C890 E2BE84 DCB47A ECCC98'),
    sR: sp('F0CDBC EAC2B0 F2D4C4'), sY: sp('FFF2BC FBEAB0'), sS: sp('B8A6C8 AC9CC6 A496C4 BCA4BE A094C2'),
    gS: sp('6A5A98 5E5690 72609C 66589A'), gW: sp('FFFFFF FFFDF4 FFF8E4'),
    /* the violin bow: pernambuco stick, its sunlit edge, its violet brown underside, the head, ivory, hair */
    bS: sp('8C4A2C 96522F 82442A 9E5A36 884830'), bL: sp('D88E52 E4A464 CC7E46 F0B878'), bD: sp('5E3440 663A44 54304A 6E3E3E'),
    bH: sp('5A3026 4E2A28 62362A 563040'), bM: sp('B4643A A8582E 8E4040 9A4C3E C0703E'), bR: sp('D49A78 C88C70 DCA686'), iv: sp('FBF2DC F4EAD0 FFF8E8'), bh: sp('F2EAD6 EAE0CA FAF4E4 E6DCCC')
  };

  /* Plate geometry: centre, half side, rotation. Light falls from the upper left. CX is set per size in build(). */
  var CX = 50, CY = 50.4, HS = 39.6, PHI = -0.056, CA = Math.cos(PHI), SA = Math.sin(PHI), LX = -0.62, LY = -0.78;
  function wx(u, v) { return CX + (u - 0.5) * 2 * HS * CA - (v - 0.5) * 2 * HS * SA; }
  function wy(u, v) { return CY + (u - 0.5) * 2 * HS * SA + (v - 0.5) * 2 * HS * CA; }
  function pu(x, y) { return 0.5 + ((x - CX) * CA + (y - CY) * SA) / (2 * HS); }
  function pv(x, y) { return 0.5 + (-(x - CX) * SA + (y - CY) * CA) / (2 * HS); }
  function inP(x, y, m) { var u = pu(x, y), v = pv(x, y); return u > m && u < 1 - m && v > m && v < 1 - m; }
  function platePath(c, m) {
    c.beginPath(); c.moveTo(wx(-m, -m), wy(-m, -m)); c.lineTo(wx(1 + m, -m), wy(1 + m, -m)); c.lineTo(wx(1 + m, 1 + m), wy(1 + m, 1 + m)); c.lineTo(wx(-m, 1 + m), wy(-m, 1 + m)); c.closePath();
  }
  /* The plate floats on its post, so its shadow falls well down and to the right. */
  var SOX = 3.6, SOY = 4.6;
  function shp(x, y) {
    var u = pu(x - SOX, y - SOY), v = pv(x - SOX, y - SOY), d = Math.max(Math.abs(u - 0.5), Math.abs(v - 0.5)) - 0.5;
    return 1 - ss(-0.028, 0.02, d + (vn(x * 0.35, y * 0.35) - 0.5) * 0.016);
  }

  /* Mode family G = cos(th) X + sin(th) P, th in [0, DM]. X: the diagonals-and-arcs mode, P = cos pi u cos pi v.
     Both vanish at the clamped centre, so the bolt always sits on a node. FG: value, d/du, d/dv. */
  var DM = 16 * PI / 180, PER = 14, NK = 7, FG = [0, 0, 0];
  function fld(u, v, c, s) {
    var cu = Math.cos(PI * u), su = Math.sin(PI * u), cv = Math.cos(PI * v), sv = Math.sin(PI * v),
      ca = 2 * cu * cu - 1, sa = 2 * su * cu, cb = 2 * cv * cv - 1, sb = 2 * sv * cv,
      c2a = 2 * ca * ca - 1, s2a = 2 * sa * ca, c2b = 2 * cb * cb - 1, s2b = 2 * sb * cb;
    FG[0] = c * 0.5 * (ca * c2b - c2a * cb) + s * cu * cv;
    FG[1] = c * 0.5 * (-TAU * sa * c2b + 2 * TAU * s2a * cb) - s * PI * su * cv;
    FG[2] = c * 0.5 * (-2 * TAU * ca * s2b + TAU * c2a * sb) - s * PI * cu * sv;
    return FG;
  }
  /* Nodal lines of X as polylines in plate coordinates: two diagonals and four arcs around the edge midpoints. */
  function nodal() {
    var E = 0.01, L = [[[E, E], [1 - E, 1 - E]], [[E, 1 - E], [1 - E, E]]], A = [[], [], [], []], k, i;
    for (k = 0; k <= 40; k++) {
      var al = PI * k / 40, dx = Math.cos(al), dy = Math.sin(al), lo = 0.05, hi = 0.32;
      for (i = 0; i < 20; i++) { var r = (lo + hi) / 2, p = Math.cos(TAU * (0.5 + r * dx)), q = Math.cos(TAU * r * dy); if (2 * p * q + 1 < 0) lo = r; else hi = r; }
      r = (lo + hi) / 2; var a = 0.5 + r * dx, b = Math.max(E, r * dy);
      A[0].push([a, b]); A[1].push([a, 1 - b]); A[2].push([b, a]); A[3].push([1 - b, a]);
    }
    return L.concat(A);
  }

  /* Brass colour. The sun bloom is a tight pool of light set inside the left triangle (between the two left arms
     of the cross and the left arc), so it never washes the sand. The field is otherwise a darker bronze and old
     gold, lighter toward the lit upper left, deeper in the middle right, and lifted again by reflected sky near
     the far edges so they stand clear of the cast shadow. */
  var BU = 0.305, BV0 = 0.5;
  function bloom(u, v) { var a = (u - BU) / 0.085, b = (v - BV0) / 0.12; return Math.exp(-(a * a + b * b)); }
  function farE(u, v) { return ss(0.84, 0.985, Math.max(u, v)); }
  /* sky reflected in broad soft passages: one in the right triangle, one above the top arc, one beside the bottom arc */
  function blob(u, v, cu, cv, r) { var a = u - cu, b = v - cv; return Math.exp(-(a * a + b * b) / (r * r)); }
  function coolz(u, v) {
    return ss(0.25, 0.8, Math.max(blob(u, v, 0.76, 0.45, 0.21), blob(u, v, 0.34, 0.82, 0.17), blob(u, v, 0.58, 0.12, 0.15)) + (fb(u * 2.2 + 11, v * 2 + 4) - 0.5) * 0.8 - bloom(u, v) * 0.8);
  }
  function pcol(u, v, x, y, j) {
    var g = bloom(u, v), fe = farE(u, v), dp = ss(0.32, 0.95, (u + v) / 2 + (fb(x * 0.07, y * 0.07) - 0.5) * 0.3) * (1 - fe), cz = coolz(u, v),
      k = 0.4 + 0.62 * g - 0.24 * dp + 0.12 * fe + (fb(x * 0.11 + 4, y * 0.11) - 0.5) * 0.32 + rr(-j, j);
    if (R() < cz * 0.66) return R() < 0.42 ? pk(C.co) : R() < 0.6 ? pk(C.vi) : pk(C.cd);
    if (fe > 0.2 && R() < fe * 0.25) return pk(C.co);
    if (R() < 0.03) return pk(C.cu);
    if (R() < 0.006) return pk(C.gr);
    if (R() < 0.014) return pk(C.ro);
    if (k > 0.9) return R() < 0.35 ? pk(C.hi) : pk(C.lt);
    if (k > 0.68) return R() < 0.5 ? pk(C.lt) : pk(C.md);
    if (k > 0.45) return R() < 0.1 ? pk(C.cu) : pk(C.md);
    if (k > 0.26) return R() < 0.12 ? pk(C.md) : pk(C.bz);
    return R() < 0.5 ? pk(C.vi) : pk(C.dk);
  }

  function create(canvas) {
    var X = canvas.getContext('2d'), st = null;
    function mk(w, h, op) { var o = document.createElement('canvas'); o.width = Math.max(1, w); o.height = Math.max(1, h); var c = o.getContext('2d', op ? { alpha: false } : undefined); c.lineCap = 'round'; c.lineJoin = 'round'; return [o, c]; }
    function build() {
      var cw = canvas.clientWidth || 400, ch = canvas.clientHeight || Math.round(cw * 0.75), dp = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(cw * dp)); canvas.height = Math.max(1, Math.round(ch * dp));
      /* one uniform scale, 100 units to the frame height; PW is the frame width in units */
      var W = canvas.width, H = canvas.height, K = Math.min(H / 100, W / 100), KX = K, KY = K, PW = W / K, PH = H / K, i, j, k, m, v, u, x, y, e, t;
      CX = PW / 2 + 1.6 * cl((PW - 100) / 33, 0, 1); CY = PH / 2 + 0.4;
      /* at small sizes the strokes grow and thin out, so they still read as strokes */
      var Z = 1 + 0.3 * cl((520 - Math.min(cw, ch)) / 300, 0, 1), NQ = 1 / (Z * Z), WQ = PW / 100;
      function b(c, x, y, a, l, w, col, al, bd) { B(c, x, y, a, l * Z, w * Z, col, al, bd); }

      /* the still canvas is opaque, so laying it each frame is a plain copy */
      var bg = mk(W, H, true), G = bg[1], pl = mk(W, H), P = pl[1];
      G.setTransform(KX, 0, 0, KY, 0, 0); P.setTransform(KX, 0, 0, KY, 0, 0);

      /* ---- the table: light boards in the sun, the plate's blue violet shadow, violet only in the far corners ---- */
      sd(11);
      var EA = 0.035, SM = [-14, 8.5, 30.5, 56, 79.5, 104];
      var tg0 = G.createLinearGradient(0, 0, PW * 0.8, PH); tg0.addColorStop(0, '#D8AE84'); tg0.addColorStop(0.55, '#C69C76'); tg0.addColorStop(1, '#B48C76');
      G.globalAlpha = 1; G.fillStyle = tg0; G.fillRect(-2, -2, PW + 4, PH + 4);
      /* the cast shadow's ground, laid first so the dabs over it never open onto light wood */
      G.save(); G.translate(SOX, SOY); G.fillStyle = '#56548E';
      [[0.014, 0.3], [0.002, 0.42], [-0.012, 0.6]].forEach(function (q) { platePath(G, q[0]); G.globalAlpha = q[1]; G.fill(); });
      G.restore();
      /* light on the table: brightest toward the window at the upper left; each board has its own tone */
      function tlt(x, y) {
        var yy = y - x * EA, bi = 0; while (bi < 5 && SM[bi + 1] < yy) bi++;
        return 0.56 + 0.4 * (1 - (x * 0.8 + y) / (0.8 * PW + PH) * 1.6) - 0.14 * (1 - ss(0, 13, Math.min(y + 2, x * 1.5 + 4))) + (hs(bi, 7) - 0.5) * 0.24 + (fb(x * 0.04 + bi * 3, y * 0.09 + bi * 1.7) - 0.5) * 0.24;
      }
      function tcol(x, y) {
        var s = shp(x, y), fc = Math.max(ss(34, 8, Math.hypot(x - PW - 6, y + 6)), ss(34, 8, Math.hypot(x + 6, y - PH - 6))), lt = tlt(x, y) + rr(-0.06, 0.06);
        if (s > 0.5 || R() < s * 1.2) return s < 0.75 && R() < 0.55 ? pk(C.sl) : R() < 0.16 ? pk(C.sw) : x - CX + y - CY > 68 && R() < 0.5 ? pk(C.cn) : pk(C.sh);
        if (fc > 0.04 && R() < fc * 0.7) return R() < 0.55 ? pk(C.tc) : pk(C.tv);
        var r = R();
        if (r < 0.04) return pk(C.tr);
        if (r < 0.06) return pk(C.tg);
        if (r < 0.15) return pk(C.tp);
        if (lt > 0.8) return R() < 0.25 ? pk(C.ty) : R() < 0.3 ? pk(C.th) : pk(C.tl);
        if (lt > 0.6) return R() < 0.2 ? pk(C.th) : R() < 0.62 ? pk(C.tl) : pk(C.tm);
        return R() < 0.72 ? pk(C.tm) : R() < 0.3 ? pk(C.tv) : pk(C.tl);
      }
      /* strokes follow the grain of the boards, except in the shadow's penumbra, where they follow its edge */
      function tang(x, y, j) {
        var s = shp(x, y); if (s < 0.06 || s > 0.94) return EA + rr(-j, j) + (R() < 0.06 ? rr(-0.2, 0.2) : 0);
        var u = pu(x - SOX, y - SOY) - 0.5, v = pv(x - SOX, y - SOY) - 0.5;
        return (Math.abs(u) > Math.abs(v) ? PHI + PI / 2 : PHI) + rr(-0.06, 0.06);
      }
      /* long plank strokes, then shorter grain strokes over them, leaving the ground showing between */
      for (i = 0; i < 430 * NQ * WQ; i++) {
        x = rr(-8, PW + 8); y = rr(-8, PH + 8);
        if (inP(x, y, 0.06)) continue;
        var pen = shp(x, y), pn = pen > 0.06 && pen < 0.94;
        b(G, x, y, tang(x, y, 0.035), rr(9, 18) * (pn ? 0.4 : 1), rr(1.7, 2.5), tcol(x, y), 0.8, rr(-0.04, 0.04));
      }
      for (i = 0; i < 1350 * NQ * WQ; i++) {
        x = rr(-4, PW + 4); y = rr(-4, PH + 4);
        if (inP(x, y, 0.025)) continue;
        var pen2 = shp(x, y), pn2 = pen2 > 0.06 && pen2 < 0.94, ln = 3.5 + 7 * R() * R();
        b(G, x, y, tang(x, y, 0.07), ln * (pn2 ? 0.5 : 1), rr(0.7, 1.15), tcol(x, y), rr(0.62, 0.86), rr(-0.08, 0.08));
      }
      /* thin streaks along the grain: lilac where the room light falls, pale gold where the sun does */
      for (i = 0; i < 120 * NQ * WQ; i++) {
        x = rr(-4, PW + 4); y = rr(-4, PH + 4);
        if (inP(x, y, 0.02) || shp(x, y) > 0.1) continue;
        var lt2 = tlt(x, y) + rr(-0.1, 0.1), sun = lt2 > 0.74;
        if (sun && R() < 0.5) continue;
        b(G, x, y, EA + rr(-0.03, 0.03), rr(4, 9), rr(0.45, 0.7), sun ? (R() < 0.6 ? pk(C.ty) : pk(C.th)) : R() < 0.75 ? pk(C.tv) : pk(C.tc), rr(0.45, 0.65), rr(-0.03, 0.03));
      }
      /* board seams: soft, broken, violet brown, with a sunlit lip below */
      for (k = 0; k < SM.length; k++) {
        var s0 = SM[k] + rr(-0.4, 0.4);
        for (t = -4; t < PW + 6; t += rr(3.5, 7)) {
          x = t; y = s0 + t * EA + rr(-0.12, 0.12);
          if (y < -3 || y > PH + 3 || inP(x, y, 0.02) || R() < 0.18) continue;
          var sh = shp(x, y);
          if (sh > 0.5) continue;
          b(G, x, y, EA + rr(-0.015, 0.015), rr(5, 9.5), rr(0.48, 0.66), pk(C.tz), rr(0.42, 0.66));
          if (R() < 0.7) b(G, x + rr(-1, 1), y + 0.95, EA, rr(3.5, 7), 0.6, R() < 0.6 ? pk(C.ty) : pk(C.tl), 0.6);
        }
      }
      /* the shadow again, laid along its two bands so the core is deep and the rim soft */
      var DU = (SOX + 1) / (2 * HS), DV = (SOY + 1) / (2 * HS);
      for (i = 0; i < 560 * NQ; i++) {
        var rt = R() < 0.5;
        u = rt ? 1 + rr(-0.004, DU) : rr(0.05, 1 + DU); v = rt ? rr(0.06, 1 + DV) : 1 + rr(-0.004, DV);
        x = wx(u, v); y = wy(u, v); var s1 = shp(x, y);
        if (s1 < 0.15 || R() > s1) continue;
        b(G, x, y, (rt ? PHI + PI / 2 : EA) + rr(-0.1, 0.1), rr(2.2, 4.4), rr(0.7, 1.2), R() < 0.14 ? pk(C.sw) : s1 < 0.6 ? pk(C.sl) : pk(C.sh), rr(0.5, 0.8) * (0.5 + 0.5 * s1), rr(-0.1, 0.1));
      }
      /* ---- the violin bow lying on the table, its point against the plate's left edge, the hair toward the sun.
         Local frame: s runs from the point out along the stick, n across it toward the light. ---- */
      var BWA = PI - 0.42, BDX = Math.cos(BWA), BDY = Math.sin(BWA), BNX = -BDY, BNY = BDX, BVB = 0.6,
        BTX = wx(-0.004, BVB) + BDX * 0.25, BTY = wy(-0.004, BVB) + BDY * 0.25, BL = 1.1 * Math.hypot(PW, PH);
      function bgap(s) { return 4.9 - 1.1 * ss(4, 40, s); }
      function bX(s, n) { return BTX + BDX * s + BNX * n; }
      function bY(s, n) { return BTY + BDY * s + BNY * n; }
      /* its cast shadow, a little down and to the right: the stick, the hair, the head */
      sd(41);
      for (t = 2; t < BL; t += rr(1.6, 2.6)) {
        x = bX(t, rr(-0.15, 0.15)) + 1.0; y = bY(t, rr(-0.15, 0.15)) + 1.25;
        b(G, x, y, BWA + rr(-0.025, 0.025), rr(5.5, 8.5), rr(1.4, 1.8), R() < 0.65 ? pk(C.sh) : pk(C.sl), rr(0.3, 0.42));
        if (t > 3 && R() < 0.7) b(G, bX(t, bgap(t)) + 0.55, bY(t, bgap(t)) + 0.7, BWA + rr(-0.03, 0.03), rr(2.4, 3.6), rr(0.5, 0.7), pk(C.sl), rr(0.25, 0.4));
      }
      for (k = 0; k < 7; k++) { var hs0 = rr(0.4, 4.4), hn0 = rr(0.4, 4.6) * (1 - hs0 / 7);
        b(G, bX(hs0, hn0) + 1.0, bY(hs0, hn0) + 1.25, BWA + PI / 2 + rr(-0.3, 0.3), rr(2, 3.4), rr(1, 1.4), pk(C.sh), 0.5); }

      /* warm light from the window at the upper left, on the table only */
      G.save(); G.globalCompositeOperation = 'soft-light';
      var gl = G.createRadialGradient(12, 5, 4, 12, 5, 150); gl.addColorStop(0, 'rgba(255,214,150,.4)'); gl.addColorStop(0.6, 'rgba(255,214,150,.1)'); gl.addColorStop(1, 'rgba(255,220,160,0)');
      G.globalAlpha = 1; G.fillStyle = gl; G.fillRect(-2, -2, PW + 4, PH + 4); G.restore();

      /* ---- the plate: painted unclipped on its own layer, then cut to a clean square ---- */
      sd(31);
      platePath(P, 0.01);
      var lg = P.createLinearGradient(wx(0, 0), wy(0, 0), wx(1, 1), wy(1, 1)); lg.addColorStop(0, '#8E6C42'); lg.addColorStop(0.6, '#6E5038'); lg.addColorStop(1, '#5E5060');
      P.globalAlpha = 1; P.fillStyle = lg; P.fill();
      function fa(x, y) { return PHI + 0.22 + 0.7 * (fb(x * 0.03 + 7, y * 0.03) - 0.5); }
      for (i = 0; i < 360 * NQ; i++) {
        u = rr(-0.03, 1.03); v = rr(-0.03, 1.03); x = wx(u, v); y = wy(u, v);
        b(P, x, y, fa(x, y) + rr(-0.1, 0.1), rr(9, 14), rr(2.8, 3.8), pcol(u, v, x, y, 0.03), 0.72, rr(-0.05, 0.05));
      }
      for (i = 0; i < 1600 * NQ; i++) {
        u = rr(-0.03, 1.03); v = rr(-0.03, 1.03); x = wx(u, v); y = wy(u, v);
        b(P, x, y, fa(x, y) + rr(-0.16, 0.16), rr(4, 7.2), rr(1.1, 1.7), pcol(u, v, x, y, 0.05), rr(0.72, 0.9), rr(-0.1, 0.1));
      }
      for (i = 0; i < 900 * NQ; i++) {
        u = rr(-0.02, 1.02); v = rr(-0.02, 1.02); x = wx(u, v); y = wy(u, v);
        b(P, x, y, fa(x, y) + rr(-0.22, 0.22), rr(2.2, 4), rr(0.6, 1), pcol(u, v, x, y, 0.06), rr(0.8, 0.95), rr(-0.12, 0.12));
      }
      /* sun glitter in the pool of light, like light on water */
      for (i = 0; i < 220 * NQ; i++) {
        u = rr(0.12, 0.5); v = rr(0.28, 0.72); var gb = bloom(u, v);
        if (R() > gb * 1.15) continue;
        x = wx(u, v); y = wy(u, v);
        b(P, x, y, PHI + 0.12 + rr(-0.12, 0.12), rr(1.6, 3.6), rr(0.5, 0.9), gb > 0.7 && R() < 0.3 ? pk(C.hi) : R() < 0.16 ? pk(C.ro) : R() < 0.22 ? pk(C.cu) : pk(C.lt), rr(0.55, 0.85));
      }
      /* scattered stray grains */
      for (i = 0; i < 130 * NQ; i++) {
        u = rr(0.03, 0.97); v = rr(0.03, 0.97); x = wx(u, v); y = wy(u, v);
        B(P, x + 0.16, y + 0.22, rr(0, PI), 0.55 * Z, 0.4 * Z, pk(C.gS), 0.35);
        B(P, x, y, rr(0, PI), rr(0.4, 0.7) * Z, rr(0.3, 0.45) * Z, R() < 0.6 ? pk(C.sC) : pk(C.sO), rr(0.7, 0.92));
      }
      /* the bevel: light along the upper and left edges, brightest at their shared corner and sinking to old gold
         toward the far ends, with a few breaks; the far edges are bronze, edged by a thin line of warm light
         reflected up from the table, which keeps them clear of the shadow */
      var EG = [[0, 0, 1, 0, 1], [0, 0, 0, 1, 1], [1, 0, 1, 1, 0], [0, 1, 1, 1, 0]], BV = 0.0115;
      for (e = 0; e < 4; e++) {
        var q = EG[e], lit = q[4], ea = Math.atan2(wy(q[2], q[3]) - wy(q[0], q[1]), wx(q[2], q[3]) - wx(q[0], q[1])),
          iu = q[0] === q[2] ? (q[0] ? -1 : 1) : 0, iv = q[1] === q[3] ? (q[1] ? -1 : 1) : 0;
        for (t = 0.005; t <= 0.995; t += rr(0.007, 0.014)) {
          var sg0 = Math.floor(t * 12 + e * 0.37), gap = hs(sg0, e + 5) < 0.3 + 0.25 * ss(0.3, 0.7, t) && (t * 12 + e * 0.37) % 1 < 0.34;
          u = lp(q[0], q[2], t); v = lp(q[1], q[3], t);
          var ins = BV * rr(0.25, 0.75); x = wx(u + iu * ins, v + iv * ins); y = wy(u + iu * ins, v + iv * ins);
          if (lit) {
            if (gap) continue;
            var bf = 1 - t + rr(-0.12, 0.12);
            B(P, x, y, ea + rr(-0.03, 0.03), rr(1.8, 3.6) * Z, BV * 2 * HS * rr(0.5, 0.8) * (0.75 + 0.25 * (1 - t)),
              bf > 0.66 ? (R() < 0.75 ? pk(C.hi) : '#FFE2B8') : bf > 0.36 ? (R() < 0.3 ? pk(C.hi) : pk(C.lt)) : R() < 0.35 ? pk(C.lt) : pk(C.md), rr(0.7, 0.95) * (0.7 + 0.3 * (1 - t)));
          } else {
            B(P, x, y, ea + rr(-0.03, 0.03), rr(2, 4) * Z, BV * 2 * HS * rr(0.6, 0.9), R() < 0.6 ? pk(C.bz) : R() < 0.5 ? pk(C.dk) : pk(C.vi), rr(0.6, 0.85));
            if (!gap && R() < 0.85) { ins = BV * rr(0.06, 0.2); x = wx(u + iu * ins, v + iv * ins); y = wy(u + iu * ins, v + iv * ins);
              B(P, x, y, ea + rr(-0.02, 0.02), rr(2, 4.5) * Z, rr(0.34, 0.5) * Z, R() < 0.5 ? '#D2A470' : R() < 0.5 ? '#C89A68' : '#DDB282', rr(0.6, 0.85)); }
          }
          if (lit && R() < 0.3) { ins = BV * rr(1.2, 1.5); x = wx(u + iu * ins, v + iv * ins); y = wy(u + iu * ins, v + iv * ins);
            B(P, x, y, ea + rr(-0.03, 0.03), rr(1.5, 3) * Z, 0.35 * Z, pk(C.bz), 0.45); }
        }
      }
      P.setTransform(1, 0, 0, 1, 0, 0); P.globalAlpha = 1; P.globalCompositeOperation = 'destination-in';
      P.setTransform(KX, 0, 0, KY, 0, 0); platePath(P, 0); P.fillStyle = '#000'; P.fill();
      P.globalCompositeOperation = 'source-over';
      G.save(); G.setTransform(1, 0, 0, 1, 0, 0); G.globalAlpha = 1; G.drawImage(pl[0], 0, 0); G.restore();
      /* a few soft shadow dabs just outside the far edges, so the square sits in its shadow */
      sd(35);
      for (e = 2; e < 4; e++) {
        var q2 = EG[e], ea2 = Math.atan2(wy(q2[2], q2[3]) - wy(q2[0], q2[1]), wx(q2[2], q2[3]) - wx(q2[0], q2[1])), on = e === 2 ? [1, 0] : [0, 1];
        for (t = 0.05; t <= 0.99; t += rr(0.02, 0.05)) {
          u = lp(q2[0], q2[2], t) + on[0] * 0.016; v = lp(q2[1], q2[3], t) + on[1] * 0.016;
          b(G, wx(u, v), wy(u, v), ea2 + rr(-0.04, 0.04), rr(2, 3.8), rr(0.5, 0.8), pk(C.sh), rr(0.4, 0.65));
        }
      }
      /* the bow itself: a red brown stick, lit along its upper edge, violet brown beneath; the pale hair ribbon
         seen edge on; the dark head with its ivory face at the point */
      sd(43);
      var gp;
      for (t = 5; t < BL; t += rr(2, 2.8)) b(G, bX(t, 0), bY(t, 0), BWA + rr(-0.02, 0.02), rr(4.4, 6), rr(1.5, 1.7), pk(C.bS), 0.92);
      /* broken colour along it: orange and red violet in the body, violet blue in the underside, a warm reflection
         from the table at its lower edge, and the sun in broken dashes on top */
      for (t = 5.5; t < BL; t += rr(2.2, 3.4)) b(G, bX(t, rr(-0.2, 0.2)), bY(t, rr(-0.2, 0.2)), BWA + rr(-0.02, 0.02), rr(2.4, 4), rr(0.7, 1), pk(C.bM), rr(0.6, 0.85));
      for (t = 5.5; t < BL; t += rr(2.4, 3.6)) b(G, bX(t, -0.5), bY(t, -0.5), BWA + rr(-0.02, 0.02), rr(3.4, 6), rr(0.5, 0.65), R() < 0.4 ? pk(C.vi) : pk(C.bD), rr(0.55, 0.8));
      for (t = 7; t < BL; t += rr(4, 7)) b(G, bX(t, -0.78), bY(t, -0.78), BWA, rr(2.4, 4), 0.32, pk(C.bR), rr(0.5, 0.7));
      for (t = 4.6; t < BL; t += rr(2.4, 4)) b(G, bX(t, 0.42), bY(t, 0.42), BWA + rr(-0.015, 0.015), rr(3, 6.5), rr(0.36, 0.5), R() < 0.2 ? pk(C.hi) : pk(C.bL), rr(0.72, 0.92));
      for (t = 3.6; t < BL; t += rr(2.4, 3.6)) { gp = bgap(t); b(G, bX(t, gp), bY(t, gp), BWA + rr(-0.012, 0.012), rr(4.5, 6.5), rr(0.42, 0.56), R() < 0.15 ? pk(C.sS) : pk(C.bh), rr(0.8, 0.95)); }
      /* the head: a hatchet from the stick down to the hair, its face sloping back from the point, its throat
         curving back up into the stick */
      var HP = [[0, -0.82], [1.8, 4.9], [3.6, 4.95], [4.6, 3.6], [5.6, 2.1], [6.8, 1.1], [8, 0.78], [8, -0.82]];
      G.globalAlpha = 0.96; G.fillStyle = '#5A3228'; G.beginPath();
      HP.forEach(function (p, i) { if (i) G.lineTo(bX(p[0], p[1]), bY(p[0], p[1])); else G.moveTo(bX(p[0], p[1]), bY(p[0], p[1])); });
      G.closePath(); G.fill();
      B(G, bX(3.4, 2.2), bY(3.4, 2.2), BWA + 0.9, 3.2, 1.6, pk(C.bH), 0.7);
      /* soften the throat's edge into the stick */
      B(G, bX(5.3, 2.2), bY(5.3, 2.2), Math.atan2(BDY * 2.4 - BNY * 2.6, BDX * 2.4 - BNX * 2.6), 3.6, 0.7, pk(C.bS), 0.55);
      B(G, bX(5.2, 0.1), bY(5.2, 0.1), BWA, 4.4, 1.2, pk(C.bS), 0.8);
      /* the sun on the throat and along the top of the head */
      B(G, bX(5.4, 2.5), bY(5.4, 2.5), Math.atan2(BDY * 2.4 - BNY * 2.6, BDX * 2.4 - BNX * 2.6), 3.4, 0.42, pk(C.bL), 0.85);
      B(G, bX(3.4, -0.55), bY(3.4, -0.55), BWA, 5.2, 0.4, pk(C.bD), 0.7);
      /* the ivory face along the front, catching the sun, and the hair meeting the head */
      var fa3 = Math.atan2(BDY * 1.8 + BNY * 5.7, BDX * 1.8 + BNX * 5.7);
      B(G, bX(0.98, 2.05), bY(0.98, 2.05), fa3, 5.8, 0.85, pk(C.iv), 0.96);
      B(G, bX(0.7, 1.1), bY(0.7, 1.1), fa3, 2.6, 0.42, '#FFFFFF', 0.9);
      B(G, bX(2.7, 4.95), bY(2.7, 4.95), BWA, 2, 0.5, pk(C.iv), 0.8);

      /* ---- sand sprites ---- */
      /* clumps: NV variants (four tones: lit flank, crest, warm flank, shade flank; two shapes) at NB orientations and NS sizes */
      var NB = 10, NV = 8, NS = 3, SCL = [0.85, 1.15, 1.55], CS = [], CR = [], ay = 0, VD = [];
      for (i = 0; i < NS; i++) { CS.push(Math.ceil(2.9 * SCL[i] * K * Z) + 2); CR.push(ay); ay += CS[i] * NV; }
      sd(100);
      for (v = 0; v < NV; v++) {
        var tone = v % 4, loose = v >= 4, n = loose ? 7 : 10, d = [];
        for (k = 0; k < n; k++) {
          var r = R(), cc = tone === 0 ? (r < 0.6 ? pk(C.sL) : r < 0.8 ? pk(C.sY) : r < 0.92 ? pk(C.sC) : pk(C.sR))
            : tone === 1 ? (r < 0.5 ? pk(C.sC) : r < 0.72 ? pk(C.sL) : r < 0.88 ? pk(C.sO) : pk(C.sR))
            : tone === 2 ? (r < 0.42 ? pk(C.sO) : r < 0.68 ? pk(C.sR) : r < 0.86 ? pk(C.sC) : pk(C.sS))
            : (r < 0.5 ? pk(C.sS) : r < 0.72 ? pk(C.sR) : r < 0.88 ? pk(C.sO) : pk(C.sC));
          d.push([rr(-1, 1) * (loose ? 1.15 : 0.95), gs() * (loose ? 0.2 : 0.12), rr(-0.4, 0.4), rr(0.55, 1.05) * (loose ? 0.85 : 1), rr(0.36, 0.6) * (loose ? 0.85 : 1), cc, rr(0.86, 0.97)]);
        }
        VD.push(d);
      }
      var at = mk(CS[NS - 1] * NB, ay), A = at[1];
      for (i = 0; i < NS; i++) for (v = 0; v < NV; v++) for (j = 0; j < NB; j++) {
        var cs = CS[i], an = j * PI / NB, can = Math.cos(an), san = Math.sin(an), dd = VD[v];
        A.save(); A.beginPath(); A.rect(j * cs, CR[i] + v * cs, cs, cs); A.clip();
        A.setTransform(K * SCL[i] * Z, 0, 0, K * SCL[i] * Z, j * cs + cs / 2, CR[i] + v * cs + cs / 2);
        for (k = 0; k < dd.length; k++) {
          var g0 = dd[k], gx = g0[0] * can - g0[1] * san, gy = g0[0] * san + g0[1] * can;
          B(A, gx, gy, an + g0[2], g0[3], g0[4], g0[5], g0[6]);
          if (v % 4 === 0 && k % 3 === 1) B(A, gx - 0.1, gy - 0.13, an + g0[2], g0[3] * 0.5, g0[4] * 0.4, pk(C.gW), 0.75);
        }
        A.restore();
      }
      /* small cells: loose grains with their own shadows, a glint, the bolt */
      var NLV = 6, lc = Math.ceil(2.0 * K * Z), bc = Math.ceil(5.8 * K), la = mk(lc * (NLV + 1) + bc, Math.max(lc, bc)), l = la[1];
      sd(150);
      for (i = 0; i < NLV; i++) {
        l.save(); l.setTransform(K * Z, 0, 0, K * Z, i * lc + lc / 2, lc / 2);
        for (j = 0; j < 2; j++) { var hx = rr(-0.3, 0.3), hy = rr(-0.25, 0.25), ha = rr(0, PI), hl = rr(0.45, 0.8), hw = rr(0.34, 0.5);
          B(l, hx + 0.14, hy + 0.2, ha, hl * 1.1, hw * 1.25, pk(C.gS), 0.3); B(l, hx, hy, ha, hl, hw, R() < 0.5 ? pk(C.sL) : R() < 0.6 ? pk(C.sC) : pk(C.sO), 0.95); }
        if (i % 2) B(l, -0.12, -0.15, rr(0, PI), 0.36, 0.24, pk(C.gW), 0.8);
        l.restore();
      }
      l.save(); l.setTransform(K * Z, 0, 0, K * Z, NLV * lc + lc / 2, lc / 2);
      var gg = l.createRadialGradient(0, 0, 0, 0, 0, 0.95); gg.addColorStop(0, 'rgba(255,250,232,.95)'); gg.addColorStop(1, 'rgba(255,246,218,0)');
      l.globalAlpha = 1; l.fillStyle = gg; l.fillRect(-1, -1, 2, 2);
      B(l, 0, 0, -0.5, 1.1, 0.34, '#FFFFFF', 0.9); B(l, 0, 0, 1.07, 0.6, 0.28, '#FFF8E0', 0.7); l.restore();
      /* the bolt: a brass washer, a dark hexagonal nut lit on its upper left, a violet shadow */
      sd(160);
      l.save(); l.setTransform(K, 0, 0, K, (NLV + 1) * lc + bc / 2, bc / 2);
      l.globalAlpha = 0.55; l.fillStyle = '#4E4282'; l.beginPath(); l.arc(0.45, 0.6, 2.05, 0, TAU); l.fill();
      for (i = 0; i < 44; i++) { var qa = rr(0, TAU), rd = rr(1.45, 2.1), lw = Math.cos(qa) * LX + Math.sin(qa) * LY + rr(-0.3, 0.3);
        B(l, Math.cos(qa) * rd, Math.sin(qa) * rd, qa + PI / 2 + rr(-0.2, 0.2), rr(0.6, 1.1), rr(0.32, 0.5), lw > 0.4 ? pk(C.hi) : lw > -0.1 ? pk(C.lt) : lw > -0.6 ? pk(C.md) : pk(C.bz), 0.92); }
      l.globalAlpha = 1; l.fillStyle = '#4A3A46'; l.beginPath();
      for (i = 0; i < 6; i++) { var ha2 = 0.3 + i * PI / 3; l.lineTo(Math.cos(ha2) * 1.35, Math.sin(ha2) * 1.35); } l.closePath(); l.fill();
      for (i = 0; i < 6; i++) {
        var fa2 = 0.3 + (i + 0.5) * PI / 3, fl = Math.cos(fa2) * LX + Math.sin(fa2) * LY;
        B(l, Math.cos(fa2) * 0.95, Math.sin(fa2) * 0.95, fa2 + PI / 2, 1.2, 0.5, fl > 0.5 ? '#C8A060' : fl > 0 ? '#8A6A50' : fl > -0.5 ? '#5E4658' : '#3E3452', 0.95);
      }
      l.fillStyle = '#5A4A5C'; l.beginPath(); l.arc(0, 0, 0.62, 0, TAU); l.fill();
      B(l, -0.22, -0.28, -0.7, 0.62, 0.24, '#FFF0C8', 0.95); B(l, -0.95, -0.55, -0.55, 0.7, 0.22, '#F8E0A0', 0.8); l.restore();

      /* ---- grains: homes on the nodal lines of X, continued through the modes by Newton steps ---- */
      var PL = nodal(), SEG = [], tot = 0;
      for (i = 0; i < PL.length; i++) for (j = 0; j + 1 < PL[i].length; j++) { var p0 = PL[i][j], p1 = PL[i][j + 1], sl = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]); tot += sl; SEG.push([tot, p0, p1, sl]); }
      function wfac(g) { return cl(Math.pow(5.5 / (g + 0.4), 0.6), 0.8, 1.9); }
      sd(200);
      var NC = Math.round(1800 * NQ), W0 = 0.0108 * Math.sqrt(Z), HU = new Float32Array(NC), HV = new Float32Array(NC), OF = new Float32Array(NC),
        SZ = new Float32Array(NC), TN = new Uint8Array(NC), SH = new Uint8Array(NC), TJ = new Float32Array(NC), FJ = new Float32Array(NC), JX = new Float32Array(NC * NK), JY = new Float32Array(NC * NK);
      for (i = 0; i < NC;) {
        var ps = R() * tot, lo2 = 0, hi2 = SEG.length - 1;
        while (lo2 < hi2) { var mid = (lo2 + hi2) >> 1; if (SEG[mid][0] < ps) lo2 = mid + 1; else hi2 = mid; }
        var sg = SEG[lo2], f2 = 1 - (sg[0] - ps) / sg[3]; u = lp(sg[1][0], sg[2][0], f2); v = lp(sg[1][1], sg[2][1], f2);
        fld(u, v, 1, 0); var gm = Math.hypot(FG[1], FG[2]);
        if (R() > wfac(gm) / 1.9) continue;
        HU[i] = u; HV[i] = v; i++;
      }
      /* per-grain draws come from their own stream, so they are not tied to where the grain landed */
      sd(210);
      for (i = 0; i < NC; i++) {
        OF[i] = R() < 0.8 ? gs() : (R() < 0.5 ? -1 : 1) * (1.5 + 2.4 * R() * R()); SZ[i] = rr(0.75, 1.2); SH[i] = R() < 0.5 ? 0 : 4; TJ[i] = rr(-0.25, 0.25); FJ[i] = rr(-0.3, 0.3);
        for (k = 0; k < NK; k++) { JX[i * NK + k] = rr(-0.03, 0.03); JY[i * NK + k] = rr(-0.03, 0.03); }
      }
      /* sort so the crest of each ridge is laid last, over its flanks */
      var ord = []; for (i = 0; i < NC; i++) ord.push(i); ord.sort(function (a, c) { return Math.abs(OF[c]) - Math.abs(OF[a]); });
      /* positions per mode: X0/Y0 in units, angle, size, and the side of the ridge that faces the sun */
      var PX = new Float32Array(NC * NK), PY = new Float32Array(NC * NK), PA = new Float32Array(NC * NK), PW = new Float32Array(NC * NK), cu2 = new Float32Array(NC), cv2 = new Float32Array(NC);
      for (i = 0; i < NC; i++) { cu2[i] = HU[i]; cv2[i] = HV[i]; }
      for (k = 0; k < NK; k++) {
        var th = DM * k / (NK - 1), cth = Math.cos(th), sth = Math.sin(th);
        for (i = 0; i < NC; i++) {
          u = cu2[i]; v = cv2[i];
          for (j = 0; j < (k ? 4 : 1); j++) {
            fld(u, v, cth, sth); var g2 = FG[1] * FG[1] + FG[2] * FG[2], mm = FG[0] / (g2 + 0.6), du = mm * FG[1], dv = mm * FG[2], dl = Math.sqrt(du * du + dv * dv);
            if (dl > 0.03) { du *= 0.03 / dl; dv *= 0.03 / dl; }
            u = cl(u - du, 0.004, 0.996); v = cl(v - dv, 0.004, 0.996);
          }
          cu2[i] = u; cv2[i] = v;
          fld(u, v, cth, sth); var gn = Math.hypot(FG[1], FG[2]) + 1e-5, nu = FG[1] / gn, nv = FG[2] / gn, wf = wfac(gn), o = OF[i] * W0 * wf;
          var uu = cl(u + nu * o, 0.021, 0.979), vv = cl(v + nv * o, 0.021, 0.979), nx = nu * CA - nv * SA, ny = nu * SA + nv * CA;
          PX[i * NK + k] = wx(uu, vv) + JX[i * NK + k]; PY[i * NK + k] = wy(uu, vv) + JY[i * NK + k];
          PA[i * NK + k] = Math.atan2(ny, nx) + PI / 2; PW[i * NK + k] = wf;
          if (k === 0) { var side = OF[i] * (nx * LX + ny * LY) + TJ[i]; TN[i] = side > 0.3 ? 0 : side < -0.45 ? 3 : Math.abs(OF[i]) > 1.3 + FJ[i] ? 2 : 1; }
        }
      }

      /* ---- keyframes: the sand alone, with its violet shadow, baked over the plate box at each mode ---- */
      var cx0 = 1e9, cy0 = 1e9, cx1 = -1e9, cy1 = -1e9;
      [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(function (p) { var X0 = wx(p[0], p[1]), Y0 = wy(p[0], p[1]); cx0 = Math.min(cx0, X0); cy0 = Math.min(cy0, Y0); cx1 = Math.max(cx1, X0); cy1 = Math.max(cy1, Y0); });
      var bx = Math.max(0, Math.floor(cx0 * KX) - 2), by = Math.max(0, Math.floor(cy0 * KY) - 2), bw = Math.min(W, Math.ceil(cx1 * KX) + 2) - bx, bh = Math.min(H, Math.ceil(cy1 * KY) + 2) - by,
        KF = [], tl = mk(bw, bh), TL = tl[1], ox = Math.max(1, Math.round(0.3 * K)), oy = Math.max(1, Math.round(0.4 * K)),
        bxp = Math.round(wx(0.5, 0.5) * KX - bc / 2), byp = Math.round(wy(0.5, 0.5) * KY - bc / 2);
      for (m = 0; m < NK; m++) {
        var kf = mk(bw, bh), kc = kf[1];
        TL.clearRect(0, 0, bw, bh);
        for (j = 0; j < NC; j++) {
          i = ord[j]; var ix = i * NK + m, X1 = PX[ix] * KX - bx, Y1 = PY[ix] * KY - by;
          if (Math.abs(OF[i]) > 2.1) { TL.drawImage(la[0], (i % NLV) * lc, 0, lc, lc, Math.round(X1 - lc / 2), Math.round(Y1 - lc / 2), lc, lc); continue; }
          var sc = SZ[i] * (0.72 + 0.32 * PW[ix]), ci = sc < 0.98 ? 0 : sc < 1.3 ? 1 : 2, cz = CS[ci], a2 = ((PA[ix] % PI) + PI) % PI, bn = Math.round(a2 / (PI / NB)) % NB;
          TL.drawImage(at[0], bn * cz, CR[ci] + (TN[i] + SH[i]) * cz, cz, cz, Math.round(X1 - cz / 2), Math.round(Y1 - cz / 2), cz, cz);
        }
        /* the sand and, in the same pass, its violet shadow thrown away from the sun */
        kc.shadowColor = 'rgba(60,52,140,0.5)'; kc.shadowOffsetX = ox; kc.shadowOffsetY = oy; kc.drawImage(tl[0], 0, 0);
        KF.push(kf[0]);
      }

      /* live grains: ridge grains followed through every mode; glints ride on some of them */
      sd(300);
      var NL = Math.round(54 * NQ), LXs = new Float32Array(NL * NK), LYs = new Float32Array(NL * NK), LP = new Float32Array(NL * 5), LV = new Uint8Array(NL), nl = 0;
      for (j = 0; j < 4000 && nl < NL; j++) {
        i = Math.floor(R() * NC); if (Math.abs(OF[i]) > 1.4) continue;
        for (k = 0; k < NK; k++) { LXs[nl * NK + k] = PX[i * NK + k] * KX - lc / 2 + rr(-0.3, 0.3) * K; LYs[nl * NK + k] = PY[i * NK + k] * KY - lc / 2 + rr(-0.3, 0.3) * K; }
        LV[nl] = Math.floor(R() * NLV); LP[nl * 5] = rr(0, TAU); LP[nl * 5 + 1] = rr(0, TAU); LP[nl * 5 + 2] = TAU * rr(1.4, 2.6); LP[nl * 5 + 3] = TAU * rr(1.4, 2.6); LP[nl * 5 + 4] = rr(0.08, 0.18) * K; nl++;
      }
      NL = nl;
      /* dancers: stray grains between the lines, hopping with the local amplitude of the vibration */
      var ND = Math.round(24 * NQ), DX = new Float32Array(ND), DY = new Float32Array(ND), DP = new Float32Array(ND * 5), DV = new Uint8Array(ND), nd = 0;
      for (j = 0; j < 3000 && nd < ND; j++) {
        u = rr(0.05, 0.95); v = rr(0.05, 0.95); fld(u, v, 1, 0); var amp = Math.abs(FG[0]);
        if (amp < 0.22 || R() > amp) continue;
        DX[nd] = wx(u, v) * KX - lc / 2; DY[nd] = wy(u, v) * KY - lc / 2; DV[nd] = Math.floor(R() * NLV);
        DP[nd * 5] = rr(0, TAU); DP[nd * 5 + 1] = rr(0, TAU); DP[nd * 5 + 2] = TAU * rr(1.8, 3.2); DP[nd * 5 + 3] = TAU * rr(1.8, 3.2); DP[nd * 5 + 4] = (0.12 + 0.3 * amp) * K; nd++;
      }
      ND = nd;
      var NG = NL ? Math.min(NL, 16) : 0, GI = new Uint16Array(NG), GP = new Float32Array(NG * 2);
      for (i = 0; i < NG; i++) { GI[i] = Math.floor(R() * NL); GP[i * 2] = rr(0, TAU); GP[i * 2 + 1] = TAU * rr(0.12, 0.3); }

      /* the sheen: soft brushed light in the pool of sun, which trembles as the plate hums; it is laid under the
         sand, so it can never veil a ridge */
      var shs = Math.ceil(22 * K), shc2 = mk(shs, shs), shc = shc2[1], scx = wx(BU, BV0), scy = wy(BU, BV0);
      shc.setTransform(K, 0, 0, K, shs / 2, shs / 2); sd(170);
      for (i = 0; i < 120; i++) { var sr = Math.sqrt(R()), sq = rr(0, TAU), sx2 = Math.cos(sq) * sr * 6, sy2 = Math.sin(sq) * sr * 8.5;
        B(shc, sx2, sy2, PHI + 0.12 + rr(-0.15, 0.15), rr(2.2, 4.4) * Z, rr(0.7, 1.2) * Z, R() < 0.6 ? pk(C.hi) : pk(C.lt), rr(0.5, 0.9)); }
      shc.setTransform(1, 0, 0, 1, 0, 0); shc.globalCompositeOperation = 'destination-in';
      var sg2 = shc.createRadialGradient(shs / 2, shs / 2, 0, shs / 2, shs / 2, shs / 2); sg2.addColorStop(0, 'rgba(0,0,0,1)'); sg2.addColorStop(0.5, 'rgba(0,0,0,.6)'); sg2.addColorStop(1, 'rgba(0,0,0,0)');
      shc.fillStyle = sg2; shc.fillRect(0, 0, shs, shs); shc.globalCompositeOperation = 'source-over';

      /* settle every cached layer now, so no first-time rasterizing lands in a later frame */
      var fz = mk(1, 1), f = fz[1];
      for (m = 0; m < NK; m++) f.drawImage(KF[m], 0, 0, 1, 1);
      f.drawImage(bg[0], 0, 0, 1, 1); f.drawImage(shc2[0], 0, 0, 1, 1); f.drawImage(la[0], 0, 0, 1, 1); f.getImageData(0, 0, 1, 1);
      st = { BG: bg[0], SH: shc2[0], shx: scx * KX - shs / 2, shy: scy * KY - shs / 2, K: K, at: la[0], lc: lc, bc: bc, bxp: bxp, byp: byp, bx: bx, by: by, KF: KF,
        NL: NL, LXs: LXs, LYs: LYs, LP: LP, LV: LV, NG: NG, GI: GI, GP: GP, NLV: NLV, ND: ND, DX: DX, DY: DY, DP: DP, DV: DV };
    }
    function frame(t) {
      var s = st, c = X, md = (1 - Math.cos(TAU * t / PER)) / 2 * (NK - 1), m = Math.min(NK - 2, Math.floor(md)), g = cl(md - m, 0, 1), i, k, x, y;
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
      /* the whole still canvas: table, shadow and the bare plate */
      c.drawImage(s.BG, 0, 0);
      /* sunlight trembling on the humming brass, under the sand */
      var sa = 0.26 + 0.12 * Math.sin(TAU * t / 3.3) + 0.06 * Math.sin(TAU * t / 1.7 + 1.3);
      c.globalAlpha = sa; c.drawImage(s.SH, Math.round(s.shx + 0.4 * s.K * Math.sin(TAU * t / 5.1)), Math.round(s.shy + 0.5 * s.K * Math.sin(TAU * t / 4.3 + 0.7)));
      /* the sand as a union of neighbouring keyframes, with a fully opaque layer always on top: first the next mode
         fades in beneath the current one, then a short exchange brings it to the top, then the current one fades
         out beneath it. The ridge envelope moves smoothly; only the grains inside it trade places, briefly. */
      var A = s.KF[m], N = s.KF[m + 1], bx = s.bx, by = s.by, w;
      if (g < 0.34) {
        w = g / 0.34; if (w > 0.003) { c.globalAlpha = w; c.drawImage(N, bx, by); }
        c.globalAlpha = 1; c.drawImage(A, bx, by);
      } else if (g < 0.66) {
        w = ss(0.34, 0.66, g);
        if (w > 0.003) { c.globalAlpha = w; c.drawImage(A, bx, by); }
        c.globalAlpha = 1; c.drawImage(N, bx, by);
        if (w < 0.997) { c.globalAlpha = 1 - w; c.drawImage(A, bx, by); }
      } else {
        w = (1 - g) / 0.34; if (w > 0.003) { c.globalAlpha = w; c.drawImage(A, bx, by); }
        c.globalAlpha = 1; c.drawImage(N, bx, by);
      }
      c.globalAlpha = 1;
      c.drawImage(s.at, (s.NLV + 1) * s.lc, 0, s.bc, s.bc, s.bxp, s.byp, s.bc, s.bc);
      /* live grains ride the moving ridges and shiver as the plate hums */
      var hum = 0.65 + 0.35 * Math.sin(TAU * t / 2.9), LXs = s.LXs, LYs = s.LYs, LP = s.LP, lc = s.lc, at = s.at;
      for (i = 0; i < s.NL; i++) {
        k = i * NK + m; var am = hum * LP[i * 5 + 4];
        x = LXs[k] + (LXs[k + 1] - LXs[k]) * g + am * Math.sin(LP[i * 5 + 2] * t + LP[i * 5]);
        y = LYs[k] + (LYs[k + 1] - LYs[k]) * g + am * Math.sin(LP[i * 5 + 3] * t + LP[i * 5 + 1]);
        c.drawImage(at, s.LV[i] * lc, 0, lc, lc, Math.round(x), Math.round(y), lc, lc);
      }
      /* stray grains dance where the plate swings most */
      var DP = s.DP;
      for (i = 0; i < s.ND; i++) {
        var ad = hum * DP[i * 5 + 4];
        c.drawImage(at, s.DV[i] * lc, 0, lc, lc, Math.round(s.DX[i] + ad * Math.sin(DP[i * 5 + 2] * t + DP[i * 5])), Math.round(s.DY[i] + ad * Math.sin(DP[i * 5 + 3] * t + DP[i * 5 + 1])), lc, lc);
      }
      /* slow glints of sun on single grains */
      for (i = 0; i < s.NG; i++) {
        var q = Math.sin(s.GP[i * 2 + 1] * t + s.GP[i * 2]);
        if (q < 0.1) continue;
        k = s.GI[i] * NK + m;
        x = LXs[k] + (LXs[k + 1] - LXs[k]) * g; y = LYs[k] + (LYs[k + 1] - LYs[k]) * g;
        c.globalAlpha = 0.85 * q * q * q;
        c.drawImage(at, s.NLV * lc, 0, lc, lc, Math.round(x), Math.round(y), lc, lc);
      }
      c.globalAlpha = 1;
    }
    build();
    return { frame: frame, resize: build };
  }

  window.Vignettes = window.Vignettes || {};
  window.Vignettes.inverse = { title: 'Chladni Sand', aspect: 4 / 3, create: create };
})();
