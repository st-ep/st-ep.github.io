/* Poppies, Unordered (SetONet). A summer hillside after Monet's Poppy Field near Argenteuil, as a 4:3 landscape.
   A wide sky of cumulus over the top third, a line of trees and a farmhouse on the horizon, and a meadow that
   rises to the left. Poppies come from a density field, dense in drifts and sparse elsewhere, never on a grid:
   samples at unordered locations. The main drift climbs diagonally from the lower middle to the walkers at the
   upper left, a second patch lies across the mid right, and strays are sprinkled everywhere.
   Sky, trees, meadow and the walkers are painted once onto an opaque offscreen canvas. Each frame blits it,
   drifts the cloud sprites (whole device pixels, so the blit stays a plain copy), and paints a few hundred
   live dabs: tall grasses and poppies leaning as gusts travel across the field, poppy heads nodding on their
   own phases, and a sheen of bent, light-catching grass that rides each gust front. */
(function () {
  window.Vignettes = window.Vignettes || {};
  var PI = Math.PI;

  function mb(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hs(i, j) { var h = Math.imul(i, 374761393) + Math.imul(j, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296; }
  function lp(a, b, t) { return a + (b - a) * t; }
  function cl(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ss(a, b, x) { var t = cl((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function vn(x, y) { var i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v); return lp(lp(hs(i, j), hs(i + 1, j), a), lp(hs(i, j + 1), hs(i + 1, j + 1), a), b); }
  function fb(x, y) { return .6 * vn(x, y) + .3 * vn(x * 2.3 + 5.1, y * 2.3 + 1.7) + .1 * vn(x * 5.1 + 9.3, y * 5.1 + 3.1); }
  function hx(s) { return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]; }
  function pl(s) { return s.split(' ').map(hx); }
  function mx(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgb(q) { return 'rgb(' + (q[0] | 0) + ',' + (q[1] | 0) + ',' + (q[2] | 0) + ')'; }
  function ramp(st, t) { if (t <= st[0][0]) return st[0][1]; for (var i = 1; i < st.length; i++) if (t <= st[i][0]) return mx(st[i - 1][1], st[i][1], (t - st[i - 1][0]) / (st[i][0] - st[i - 1][0])); return st[st.length - 1][1]; }
  function ip(P, x) { if (x <= P[0][0]) return P[0][1]; for (var i = 1; i < P.length; i++) if (x <= P[i][0]) return lp(P[i - 1][1], P[i][1], (x - P[i - 1][0]) / (P[i][0] - P[i - 1][0])); return P[P.length - 1][1]; }
  function ell(x, y, cx, cy, rx, ry) { var dx = (x - cx) / rx, dy = (y - cy) / ry; return dx * dx + dy * dy; }

  /* One brush dab: blunt tail, tapered head, slight belly. */
  function dab(c, x, y, a, l, w, col, al, bd) {
    var ca = Math.cos(a), sa = Math.sin(a), h = l / 2, nx = -sa, ny = ca, q = w / 2, b = (bd || 0) * l,
      tx = x - ca * h, ty = y - sa * h, hx2 = x + ca * h, hy2 = y + sa * h, mx2 = x + nx * b, my2 = y + ny * b;
    c.globalAlpha = al; c.fillStyle = col; c.beginPath(); c.moveTo(tx + nx * q, ty + ny * q);
    c.quadraticCurveTo(mx2 + nx * q * 1.4, my2 + ny * q * 1.4, hx2 - ca * q * .3, hy2 - sa * q * .3);
    c.quadraticCurveTo(mx2 - nx * q * 1.4, my2 - ny * q * 1.4, tx - nx * q, ty - ny * q);
    c.quadraticCurveTo(tx - ca * q * 1.3, ty - sa * q * 1.3, tx + nx * q, ty + ny * q); c.fill();
  }
  function line(c, P, w, col, al) { c.globalAlpha = al; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (var i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.stroke(); }

  /* Palettes */
  var SKYS = [[0, hx('6597D0')], [.3, hx('78A6DA')], [.55, hx('93B8E2')], [.78, hx('B3CEE8')], [.92, hx('CCDBE4')], [1, hx('E0E1D4')]];
  var LAVB = hx('A0A6DC'), GRB = hx('9CCAD6'), PNK = hx('ECD6D0');
  var CW = pl('FFF8E8 FCF0DA FFF4E0 FAEBD2 FFFBF2'), CMd = pl('F1EEEC ECE9EE F4EEE4 E8E6EC EEEAE6'), CLg = pl('DEDBE6 D8D7E6 E3DCE0 D6D8E6'), CSd = pl('CBCADF C4C6DE CFC7DA C0C4DE'), CBs = pl('B6B8D8 B0B6D6 BCB8D6'), CPk = pl('ECD8D2 E9D3CE F0DCD0');
  var TL = pl('9DB46A A8BA70 B4BE76 92AE66 BFC27A'), TM = pl('5E7F60 668866 5A7E6A 6E8C68'), TS = pl('4A6080 50628A 46647E 5A6888 4E5C80'), HAZ = [170, 188, 206];
  var MZ = [[0, hx('BFC69E')], [.1, hx('B2BE82')], [.28, hx('A0B862')], [.55, hx('86A64A')], [1, hx('6E9842')]];
  var GOLDM = hx('D4BE5E'), COOLM = hx('6E8CA0'), POPT = hx('C98060'), SHADM = hx('5E7E80');
  var MW = pl('DCC05A E4B64C D2BE66 E6CA6C'), MC = pl('6E7EAC 7A8AB4 8690BE 7090AA'), MDK = pl('557A3E 4E7246 5E8048'), PALE = hx('CCD474'), CREAM = hx('EEE4B8');
  var PR = pl('D9442E E0533A CE3E2C E6623E D64A32'), PLt = pl('F27A4A F4884F EE6E40 F69460'), PDk = pl('AA303C B2363F 9E2D46 BA423C'),
    PH = pl('FBB088 F9A476 FFC29A'), PFAR = hx('E2907C');
  var STEMC = pl('5E8A4A 668E4E 587E52 6A8A50'), GL = pl('B7C66A C6CA72 AABF5E D4CE76 BFCB6E'), GM = pl('80A44E 8BAB53 739A4A 92AE58'), GOLD = pl('E4C66C D9BA5C ECD282 CCAA54 F1DA92');
  var SHEEN = pl('E2E4A2 ECE6AE D8DEA0 F2EABC E6E8B4');
  var CORN = pl('5E78C8 6A84D2 7890D8'), DAISY = pl('FAF4E4 FFF9EE F4EEE2');
  var DL = pl('6E78B0 7A84B8 8890C0'), DM = pl('4A5490 525C98 46508A'), DSh = pl('363E72 3B3C70 30386C');

  /* Wind: two gust trains travel left to right across the ground plane (g is a ground coordinate),
     each a narrow bump with a small recoil behind it, under slow envelopes. Smooth and aperiodic. */
  function b4(p) { var s = .5 + .5 * Math.sin(p); s *= s; return s * s; }
  function b8(p) { var s = b4(p); return s * s; }
  function wind(g, t) {
    var e1 = .78 + .22 * Math.sin(.093 * t + 1.3), e2 = .62 + .38 * Math.sin(.061 * t + .4),
      p1 = .0105 * g - .8 * t, p2 = .0172 * g - 1.21 * t + 2.1;
    return .05 * Math.sin(.7 * t + g * .004) + .3 * e1 * (b4(p1) - .3 * b4(p1 + .9)) + .17 * e2 * (b8(p2) - .3 * b8(p2 + .8));
  }
  function gustOnly(g, t) {
    var e1 = .78 + .22 * Math.sin(.093 * t + 1.3), e2 = .62 + .38 * Math.sin(.061 * t + .4);
    return (.3 * e1 * b4(.0105 * g - .8 * t) + .17 * e2 * b8(.0172 * g - 1.21 * t + 2.1)) / .36;
  }

  function build(cv) {
    var W = Math.max(40, cv.clientWidth || 400), H = Math.max(30, cv.clientHeight || 300);
    var dp = Math.min(2, window.devicePixelRatio || 1);
    var PW = Math.max(1, Math.round(W * dp)), PHh = Math.max(1, Math.round(H * dp));
    cv.width = PW; cv.height = PHh;
    var X = cv.getContext('2d');
    var S = W / 400, DS = dp * S, DH = H / S;
    var R = mb(1);
    function sd(n) { R = mb(n * 7919 + 13); }
    function rr(a, b) { return a + (b - a) * R(); }
    function pk(a) { return a[Math.floor(R() * a.length)]; }
    function cj(q, j) { return 'rgb(' + (cl(q[0] + (R() - .5) * 2 * j, 0, 255) | 0) + ',' + (cl(q[1] + (R() - .5) * 2 * j, 0, 255) | 0) + ',' + (cl(q[2] + (R() - .5) * 2 * j, 0, 255) | 0) + ')'; }
    function mk(w, h, opaque) { var o = document.createElement('canvas'); o.width = Math.max(1, w); o.height = Math.max(1, h); var c = o.getContext('2d', opaque ? { alpha: false } : undefined); c.lineCap = 'round'; c.lineJoin = 'round'; return [o, c]; }

    /* Geometry, in design units: 400 wide, DH (about 300) tall. The hill crest rises to the left. */
    var CR = [[-20, 85], [30, 88], [80, 93], [130, 100], [180, 107], [230, 112], [290, 115], [420, 117]], HZ = 120;
    var CRT = new Float32Array(462);
    for (var i = 0; i < 462; i++) { var xx = i - 30; CRT[i] = ip(CR, xx) + (vn(xx * .07, 3.3) - .5) * 2.6 + (vn(xx * .25, 8.1) - .5) * 1; }
    function crest(x) { var f = cl(x + 30, 0, 460.999), i = f | 0; return lp(CRT[i], CRT[i + 1], f - i); }
    function zOf(x, y) { var c = crest(x); return (y - c) / (DH - c); }
    function szz(z, x) { z = cl(z, 0, 1.1); return lp(.13, 1, Math.pow(z, 1.1)) + .09 * (1 - Math.min(z, 1)) * cl(1 - x / 220, 0, 1); }
    function yAt(x, z) { var c = crest(x); return c + z * (DH - c); }
    function lOf(z) { return 3.2 + 14.5 * Math.pow(cl(z, 0, 1.1), 1.2); }
    function wOf(z) { return 1.4 + 6 * Math.pow(cl(z, 0, 1.1), 1.3); }
    function gOf(x, z) { return (x - 200) / Math.max(.12, szz(z, x)) + (vn(z * 9, 4.4) - .5) * 70; }
    /* Ground-plane coordinates for texture noise: across (perspective-divided) and depth (foreshortened), so clumps
       and colour patches are round on the ground and shrink with distance instead of radiating as furrows. */
    function grX(x, z) { return (x - 200) / szz(z, 200); }
    function grZ(z) { return 720 / (szz(z, 200) + .15); }

    /* Poppy density, in ground coordinates (x, z): the main drift climbing from the lower middle to the walkers
       at the upper left (after Argenteuil), a long patch across the mid right, a sparse corner scatter, a thin far
       band below the trees, and strays everywhere. Two scales of noise break each drift into clumps and gaps. */
    function pd(x, y) {
      var z = zOf(x, y); if (z <= 0) return 0;
      var cA = 52 + 118 * z - 28 * z * z + 14 * Math.sin(z * 5 - .6) + (fb(z * 7.5, 7.7) - .5) * 40,
        wA = (12 + 96 * Math.pow(z, .85)) * (.8 + .28 * Math.sin(5.2 * z - .7)) * (1 - .28 * ss(.7, 1, z)),
        dA = Math.exp(-Math.pow((x - cA) / wA, 2)) * (1 - .3 * Math.exp(-Math.pow((z - .47) / .07, 2))) * (1 - .6 * ss(.6, 1, z)),
        dB = .95 * Math.exp(-Math.pow((x - 306) / 60, 2) - Math.pow((z - .3) / .065, 2)),
        dC = .62 * Math.exp(-Math.pow((x - 386) / 46, 2) - Math.pow((z - .9) / .13, 2)),
        dD = .6 * Math.exp(-Math.pow((x - 236) / 46, 2) - Math.pow((z - .085) / .022, 2)),
        d = Math.max(dA, dB, dC, dD), gx = grX(x, z), gz = grZ(z),
        clump = ss(.3, .66, fb(gx / 34 + 3.1, gz / 30 + 1.7)) * lp(.5, 1.3, fb(gx / 110 + 9, gz / 80));
      return cl(d * clump * 1.2, 0, 1) * .95 + .034;
    }
    function mdc(x, y) {
      var z = cl(zOf(x, y), 0, 1), q = ramp(MZ, z), n = fb(grX(x, z) / 60, grZ(z) / 40);
      if (n > .55) q = mx(q, GOLDM, Math.min(.65, (n - .55) * 2.4)); else if (n < .45) q = mx(q, COOLM, Math.min(.55, (.45 - n) * 1.8));
      q = mx(q, GOLDM, .28 * ss(1, .25, ell(x, z, 110, .19, 150, .094) + (fb(x / 30, y / 10) - .5) * .7));
      q = mx(q, SHADM, .45 * ss(1.05, .4, ell(x, z, 335, .15, 100, .09) + (fb(x / 26 + 4, y / 9) - .5) * .7));
      q = mx(q, hx('5E8448'), .3 * ss(1, .3, ell(x, z, 300, .74, 140, .22) + (fb(x / 40 + 2, y / 14) - .5) * .8));
      var p = pd(x, y); if (p > .12) q = mx(q, POPT, .3 * (p - .12) * ss(.03, .2, z));
      return q;
    }

    /* ---------- still layer (opaque, so each frame's blit is a plain copy) ---------- */
    var BO = mk(PW, PHh, true), B = BO[1];
    B.setTransform(DS, 0, 0, DS, 0, 0);
    B.fillStyle = '#ECDDBC'; B.fillRect(-5, -5, 410, DH + 10);

    // sky
    (function () {
      var g = B.createLinearGradient(0, 0, 0, HZ + 4);
      g.addColorStop(0, '#5F92CE'); g.addColorStop(.35, '#7FACDC'); g.addColorStop(.72, '#ABC9E6'); g.addColorStop(1, '#DCE0D4');
      B.globalAlpha = 1; B.fillStyle = g; B.fillRect(-5, -5, 410, HZ + 8);
      sd(11);
      for (var i = 0; i < 1100; i++) {
        var x = rr(-8, 408), y = Math.pow(R(), 1.1) * (HZ + 6) - 6;
        if (y > crest(x) + 1) continue;
        var t = cl(y / HZ, 0, 1), n = fb(x / 60 + 2, y / 24), q = ramp(SKYS, cl(t + (n - .5) * .24 + rr(-.04, .04), 0, 1)), r = R();
        if (r < .08) q = mx(q, LAVB, .5); else if (r < .13) q = mx(q, GRB, .4); else if (r < .2 && t > .72) q = mx(q, PNK, .5);
        dab(B, x, y, -.48 + rr(-.32, .32) + (R() < .2 ? .85 : 0), lp(16, 7, t) * rr(.7, 1.3), lp(6, 2.6, t) * rr(.8, 1.2), cj(q, 5), rr(.5, .78), rr(-.08, .08));
      }
      // low static haze clouds near the horizon, behind trees and hill
      sd(12);
      var WS = [[262, 84, 66, 4], [376, 78, 36, 3.2], [176, 91, 44, 3]];
      for (var k = 0; k < WS.length; k++) {
        var w = WS[k];
        for (var j = 0; j < w[2] * 1.8; j++) {
          var u = rr(-1, 1), x2 = w[0] + u * w[2], y2 = w[1] + rr(-1, 1) * w[3] * (1 - u * u * .6) - (1 - u * u) * w[3] * .6;
          if (y2 > crest(x2) - 1) continue;
          var lit = (w[1] - y2) / w[3] + rr(-.4, .4);
          dab(B, x2, y2, rr(-.08, .08), rr(6, 12), rr(1.7, 2.8), cj(lit > .3 ? hx('F6EEE0') : lit > -.3 ? hx('E8E0E4') : hx('D4CFE0'), 4), .6 * (1 - u * u * .8), 0);
        }
      }
    })();

    // distant trees and a farmhouse
    (function () {
      sd(21);
      // [x, top, half width, poplar]: broad crowns of mixed size, a few tall poplars, a low gap by the house
      var TR = [[129, 103, 9], [143, 97, 11], [158, 100, 10], [172, 82, 7, 1], [186, 91, 13], [206, 97, 11], [227, 83, 17],
        [251, 89, 14], [268, 81, 7.5, 1], [282, 94, 10], [318, 98, 9], [332, 86, 14], [349, 81, 7, 1], [364, 87, 14], [385, 92, 13], [405, 82, 16]];
      var yb = 122;
      // a continuous low mass of foliage behind the crowns, so the line reads as one wood, not a row of bushes
      for (var i0 = 0; i0 < 900; i0++) {
        var x0 = rr(122, 412), top0 = 108 + (fb(x0 / 14, 2.2) - .5) * 12, y0 = rr(top0, yb);
        if (y0 > crest(x0) + 2) continue;
        var e0 = (y0 - top0) / (yb - top0) + rr(-.3, .3), q00 = e0 < .25 ? pk(TL) : e0 < .6 ? pk(TM) : pk(TS);
        dab(B, x0, y0, rr(-PI, PI), rr(3, 5), rr(1.5, 2.4), cj(mx(q00, HAZ, .12), 6), .9, rr(-.2, .2));
      }
      for (var k = 0; k < TR.length; k++) {
        var cx = TR[k][0], top = TR[k][1], hw = TR[k][2], cy = (top + yb) / 2, hh = (yb - top) / 2, N = hw * hh * (TR[k][3] ? 1.8 : 1.3), tall = TR[k][3] || hh > 16;
        for (var i = 0; i < N; i++) {
          var x = cx + rr(-1.25, 1.25) * hw, y = cy + rr(-1.15, 1.1) * hh, ex = (x - cx) / hw, ey = (y - cy) / hh;
          if (ex * ex + ey * ey > 1 + (fb(x / 6 + cx, y / 6) - .5) * 1.1) continue;
          if (y > crest(x) + 2) continue;
          var li = -(ex * .62 + ey * .78) + rr(-.35, .35), q = li > .42 ? pk(TL) : li > -.08 ? pk(TM) : pk(TS);
          q = mx(q, HAZ, .08 + .1 * vn(cx * .1, 1));
          var w = (i < N * .3 ? rr(2.4, 3.4) : rr(1.4, 2.2)) * (TR[k][3] ? .8 : 1);
          dab(B, x, y, tall ? -PI / 2 + rr(-.7, .7) : rr(-PI, PI), w * rr(1.5, 2.3), w, cj(q, 6), .88, rr(-.2, .2));
        }
      }
      var hx0 = 300, hk = 1.15, hy0 = crest(300) - 7 * hk;
      for (var i2 = 0; i2 < 30; i2++) dab(B, hx0 + rr(-5, 5) * hk, hy0 + rr(0, 7) * hk, rr(-.3, .3), rr(2.3, 3.6), rr(1.3, 1.8), cj(pk(pl('F0DCC6 F4E4CE EBD4BE')), 4), .9);
      for (var i3 = 0; i3 < 10; i3++) dab(B, hx0 + (7 + rr(-1.5, 1.5)) * hk, hy0 + rr(0, 7) * hk, rr(1.2, 1.9), rr(2.3, 3.1), rr(1.2, 1.6), cj(pk(pl('BCA8C4 C4AEC2')), 4), .9);
      for (var i4 = 0; i4 < 22; i4++) { var x4 = rr(-7, 9), y4 = rr(-5, 0); if (y4 < -5 + Math.abs(x4 - 1) * .55) continue; dab(B, hx0 + x4 * hk, hy0 + y4 * hk, rr(-.3, .3), rr(2.3, 3.6), rr(1.2, 1.8), cj(pk(pl('D47E60 C96E56 DC8C6C')), 5), .92); }
      for (var i5 = 0; i5 < 320; i5++) { var x5 = rr(126, 410), y5 = yb - rr(0, 7); if (y5 > crest(x5) + 1) continue; dab(B, x5, y5, rr(-.4, .4), rr(2.6, 5), rr(1.4, 2.2), cj(mx(R() < .45 ? pk(TM) : pk(TS), HAZ, .14), 5), .85); }
    })();

    // meadow: wash, lay-in, then rows of dabs from far to near, poppies placed where the density field asks
    (function () {
      var g = B.createLinearGradient(0, 84, 0, DH);
      g.addColorStop(0, '#C6C9A0'); g.addColorStop(.18, '#B8BC80'); g.addColorStop(.45, '#A0AE5C'); g.addColorStop(1, '#7E9C48');
      B.beginPath(); B.moveTo(-6, crest(-6) + 1); for (var x = -6; x <= 406; x += 4) B.lineTo(x, crest(x) + 1); B.lineTo(406, DH + 6); B.lineTo(-6, DH + 6); B.closePath();
      B.globalAlpha = .5; B.fillStyle = g; B.fill();
      sd(31);
      for (var i = 0; i < 460; i++) {
        var x1 = rr(-10, 410), y1 = rr(84, DH + 6), z1 = zOf(x1, y1); if (z1 < .004) continue;
        dab(B, x1, y1, rr(-.3, .3) - z1 * .5, 10 + 30 * z1, 3.5 + 12 * z1, rgb(mx(mdc(x1, y1), [94, 120, 80], .15 * z1)), .5, 0);
      }
      sd(32);
      var y = 82, zb = 117;
      while (y < DH + 8) {
        var zr = cl((y - zb) / (DH - zb), 0, 1), w0 = wOf(zr), x2 = -8 + rr(0, 4);
        while (x2 < 410) {
          var cr = crest(x2), yy = y + rr(-.4, .4) * w0, z = (yy - cr) / (DH - cr);
          if (z < -.004) { x2 += 2.4; continue; }
          z = cl(z, 0, 1.08);
          var w = wOf(z), l = lOf(z), p = pd(x2, yy);
          if (R() < p * .58) {
            // a poppy, as Monet would place it: one vermilion dab, a lit or shaded second touch
            var s = 1.3 + 6.8 * Math.pow(z, 1.3), q0 = pk(PR);
            if (z < .3) q0 = mx(q0, PFAR, .55 * (1 - z / .3));
            dab(B, x2, yy - s * .3, rr(-.9, .9), s * rr(1.1, 1.7), s * rr(.7, 1), cj(q0, 8), .92, rr(-.3, .3));
            if (s > 2.6 && R() < .6) dab(B, x2 + rr(-.35, .35) * s, yy - s * .3 + rr(-.1, .35) * s, rr(-1, 1), s * .75, s * .5, cj(R() < .6 ? pk(PDk) : pk(PLt), 8), .6);
            if (s > 4.2 && R() < .25) dab(B, x2 - .3 * s, yy - .7 * s, -.6, s * .5, s * .28, cj(pk(PH), 6), .6);
            x2 += l * rr(.38, .62);
            continue;
          }
          var q = mdc(x2 + rr(-5, 5), yy + rr(-3, 3)), r = R();
          if (r < .07) q = mx(q, pk(MW), .55); else if (r < .145 && z > .06) q = mx(q, pk(MC), .55); else if (r < .2 + .07 * ss(.4, 1, z) && z > .2) q = mx(q, pk(MDK), .62); else if (r < .25 && z > .14) q = mx(q, PALE, .45); else if (r < .265 && z > .3) q = mx(q, CREAM, .5);
          var slp = Math.atan2(crest(x2 + 4) - crest(x2 - 4), 8);
          var a = lp(slp + rr(-.2, .14), -PI / 2 + .16 + rr(-.55, .55), ss(.1, .75, z)) + (fb(x2 / 45, yy / 16) - .5) * 1.2 * ss(.06, .4, z);
          var ll = l * rr(.75, 1.25), ww = w * rr(.8, 1.2);
          dab(B, x2, yy, a, ll, ww, cj(q, 9), lp(.62, .9, ss(0, .3, z)), rr(-.15, .15));
          if (ww > 3) {
            // a loaded brush leaves ridges: two or three thin streaks of a nearby tone inside the stroke
            var ca2 = Math.cos(a), sa2 = Math.sin(a), nb = R() < .5 ? 2 : 3;
            for (var bi = 0; bi < nb; bi++) { var o2 = rr(-.3, .3) * ww, f0 = rr(.2, .38), f1 = rr(.15, .36); line(B, [[x2 - ca2 * ll * f0 - sa2 * o2, yy - sa2 * ll * f0 + ca2 * o2], [x2 + ca2 * ll * f1 - sa2 * o2, yy + sa2 * ll * f1 + ca2 * o2]], ww * rr(.1, .18), cj(mx(q, R() < .55 ? [250, 244, 206] : [66, 86, 124], rr(.15, .3)), 5), .4); }
          }
          if (z > .22 && R() < .016) { var fq = R() < .55 ? pk(DAISY) : pk(CORN); dab(B, x2 + rr(-2, 2), yy - w, rr(0, 3), w * .55, w * .45, cj(fq, 5), .9); }
          x2 += l * rr(.38, .62) * (z < .12 ? 1.2 : 1);
        }
        y += w0 * .6;
      }
      sd(33);
      for (var k = 0; k < 150; k++) { var x3 = rr(-4, 290), c3 = crest(x3); dab(B, x3, c3 - rr(-.5, 1.4), -PI / 2 + rr(-.6, .6), rr(1.6, 3), rr(.9, 1.4), cj(mx(ramp(MZ, .05), GOLDM, rr(0, .5)), 6), .75); }
    })();

    // the walkers: a woman with a parasol and a child in a red hat, wading in the drift
    var FX = 72, FZ = .15, FS = 1, FY = yAt(FX, FZ);
    (function () {
      sd(61);
      var fx = FX, fy = FY, f = FS;
      function D(x, y, a, l, w, col, al) { dab(B, fx + x * f, fy + y * f, a, l * f, w * f, col, al); }
      for (var i = 0; i < 12; i++) D(3 + rr(-1, 7), rr(-.6, 1), rr(-.1, .1), rr(4, 7), rr(1.3, 1.9), cj(pk(pl('8A86B8 7E84B4 9A90C0')), 4), .55);
      for (var j = 0; j < 46; j++) {
        var v = R(), y = lp(-12.5, -.4, v), hw = lp(1.5, 3.7, v), u = rr(-1, 1), lit = -u * .8 + rr(-.3, .3);
        D(u * hw, y, PI / 2 + rr(-.2, .2), rr(2.4, 4.2), rr(1.1, 1.7), cj(lit > .35 ? pk(DL) : lit > -.25 ? pk(DM) : pk(DSh), 4), .92);
      }
      for (var k = 0; k < 10; k++) D(rr(-1.4, 1.2), -rr(12.5, 16.5), PI / 2 + rr(-.3, .3), rr(1.8, 3), rr(1, 1.5), cj(R() < .7 ? hx('F6F0E6') : hx('C8C6DC'), 3), .95);
      D(-.2, -18, .3, 2.6, 2.2, cj(hx('E6BC98'), 3), .95);
      D(-.5, -19.2, 0, 3.4, 1.4, cj(hx('ECD6A6'), 3), .95);
      line(B, [[fx - .8 * f, fy - 15 * f], [fx - 3.4 * f, fy - 22.5 * f]], .55 * f, '#5A4E5E', .8);
      var px = -4.2, py = -23.5;
      for (var m = 0; m < 26; m++) {
        var q = rr(-PI, 0), rd = Math.sqrt(R()) * 6.4, x2 = px + Math.cos(q - .35) * rd, y2 = py + Math.sin(q - .35) * rd * .62, lt = -Math.cos(q) * .55 + .12 - Math.sin(q) * .15 + rr(-.3, .3);
        D(x2, y2, q + PI / 2 - .35 + rr(-.3, .3), rr(2.2, 3.6), rr(1.1, 1.6), cj(lt > .3 ? hx('B4CCC4') : lt > -.15 ? hx('62849A') : hx('435A7E'), 5), .92);
      }
      for (var m2 = 0; m2 < 8; m2++) D(px - 5 + m2 * 1.1, py - 1.5 + m2 * .55 + rr(-.3, .3), .45, 2, 1, cj(hx('C6D6CC'), 4), .8);
      var cx = 8.5, cy = 2.5;
      for (var n = 0; n < 18; n++) { var v2 = R(), u2 = rr(-1, 1); D(cx + u2 * lp(1, 2.2, v2), lp(cy - 6, cy, v2), PI / 2 + rr(-.2, .2), rr(1.8, 3), rr(1, 1.4), cj(u2 < .2 ? hx('F4EEE6') : hx('BEBCD8'), 3), .92); }
      D(cx, cy - 7.2, 0, 3, 1.6, cj(hx('D24A30'), 4), .95);
      D(cx - .2, cy - 6.3, 0, 1.6, 1.4, cj(hx('E6BC98'), 3), .9);
      for (var p2 = 0; p2 < 22; p2++) { var x3 = rr(-6, cx + 5), y3 = rr(-1.5, cy + 1.2), ax = fx + x3 * f, ay = fy + y3 * f; D(x3, y3, -PI / 2 + .2 + rr(-.5, .5), rr(2, 3.4), rr(1, 1.6), cj(R() < .3 ? mx(pk(PR), PFAR, .4) : mdc(ax, ay), 6), .85); }
    })();

    // warm afternoon light from the upper left
    (function () {
      B.globalCompositeOperation = 'soft-light';
      var g = B.createRadialGradient(40, 90, 10, 40, 90, 380);
      g.addColorStop(0, 'rgba(255,214,150,.55)'); g.addColorStop(1, 'rgba(255,214,150,0)');
      B.globalAlpha = .45; B.fillStyle = g; B.fillRect(-5, -5, 410, DH + 10);
      B.globalCompositeOperation = 'source-over'; B.globalAlpha = 1;
    })();

    /* ---------- clouds: cumulus sprites that drift right and wrap, always above the trees and the crest ---------- */
    var CM = 10, CLOUDS = [];
    function cloud(cx, yb, puffs, v, seed, flat, k) {
      sd(seed);
      var P = [], x0 = 1e9, x1 = -1e9, y0 = 1e9, ks = lp(1, k, .7);
      for (var i = 0; i < puffs.length; i++) { var p = puffs[i], px = cx + p[0] * k, py = yb + p[1] * k, r = p[2] * k, ry = (p[3] || p[2]) * k; P.push([px, py, r * r, ry * ry]); x0 = Math.min(x0, px - r); x1 = Math.max(x1, px + r); y0 = Math.min(y0, py - ry); }
      x0 -= 6 * k; x1 += 6 * k; y0 -= 6 * k; var y1 = yb + 8 * k, w = x1 - x0, h = y1 - y0;
      function den(x, y) {
        var s = 0; for (var i = 0; i < P.length; i++) { var p = P[i], dx = x - p[0], dy = y - p[1]; s += Math.exp(-dx * dx / p[2] - dy * dy / p[3]); }
        var yl = yb + (vn(x / (18 * k), seed) - .5) * 5 * k;
        if (y > yl) s *= Math.exp(-Math.pow((y - yl) / ((flat ? 3 : 5) * k), 2));
        return s + (fb(x / (14 * k) + seed, y / (10 * k)) - .5) * .32;
      }
      function nrm(x, y) { var e = 5 * k, gx = den(x + e, y) - den(x - e, y), gy = den(x, y + e) - den(x, y - e), gm = Math.sqrt(gx * gx + gy * gy) + 1e-6; return [gx / gm, gy / gm, gm]; }
      var ow = Math.ceil((w + 2 * CM) * DS), oh = Math.ceil((h + 2 * CM) * DS), O = mk(ow, oh), c = O[1];
      c.setTransform(DS, 0, 0, DS, (CM - x0) * DS, (CM - y0) * DS);
      // soft body so strokes sit on a continuous form
      c.save(); c.filter = 'blur(' + (3.6 * k * DS).toFixed(2) + 'px)'; c.globalAlpha = flat ? .5 : .62; c.fillStyle = '#E8E6EE';
      for (var i2 = 0; i2 < P.length; i2++) { c.beginPath(); c.ellipse(P[i2][0], Math.min(P[i2][1], yb - 2 * k), Math.sqrt(P[i2][2]) * .8, Math.sqrt(P[i2][3]) * .8, 0, 0, 7); c.fill(); }
      c.globalAlpha = flat ? .35 : .55; c.fillStyle = '#FFF6E4';
      for (var i3 = 0; i3 < P.length; i3++) { var r3 = Math.sqrt(P[i3][2]), q3 = Math.sqrt(P[i3][3]); c.beginPath(); c.ellipse(P[i3][0] - r3 * .2, P[i3][1] - q3 * .3, r3 * .55, q3 * .55, 0, 0, 7); c.fill(); }
      c.restore();
      var N = w * h * (flat ? .05 : .055) / ks;
      for (var j = 0; j < N; j++) {
        var x = rr(x0, x1), y = rr(y0, y1), d = den(x, y);
        if (d < .42) continue;
        var n = nrm(x, y), lit = n[0] * .55 + n[1] * .83, edge = ss(.015, .12, n[2]), vv = (y - y0) / h,
          k2 = .6 + .45 * lit * edge + .22 * (1 - vv) - .36 * ss(.6, 1.05, vv) + rr(-.12, .12) - (flat ? .08 : 0);
        var q = k2 > .8 ? pk(CW) : k2 > .58 ? pk(CMd) : k2 > .42 ? pk(CLg) : k2 > .26 ? (R() < .22 && vv > .7 ? pk(CPk) : pk(CSd)) : pk(CBs);
        var a = edge > .5 && R() < .75 ? Math.atan2(n[1], n[0]) + PI / 2 + rr(-.25, .25) : -.4 + rr(-.45, .45);
        if (flat) a = rr(-.12, .12);
        dab(c, x, y, a, rr(8, 16) * (flat ? 1.3 : 1) * ks, rr(3, 5.5) * (flat ? .7 : 1) * ks, cj(q, 4), .3 + .55 * ss(.42, .75, d), rr(-.12, .12));
      }
      for (var m = 0; m < N * .2; m++) {
        var x2 = rr(x0, x1), y2 = rr(y0, yb), d2 = den(x2, y2); if (d2 < .5) continue;
        var n2 = nrm(x2, y2); if (n2[0] * .55 + n2[1] * .83 < .35 || n2[2] < .04) continue;
        dab(c, x2, y2, Math.atan2(n2[1], n2[0]) + PI / 2 + rr(-.3, .3), rr(6, 11) * ks, rr(2.2, 3.4) * ks, cj(pk(CW), 3), .8);
      }
      for (var s2 = 0; s2 < N * .25; s2++) {
        var x3 = rr(x0, x1), y3 = rr(y0, y1), d3 = den(x3, y3);
        if (d3 < .3 || d3 > .5) continue;
        var n3 = nrm(x3, y3);
        dab(c, x3, y3, Math.atan2(n3[1], n3[0]) + PI / 2 + rr(-.4, .4), rr(6, 12) * ks, rr(2.4, 4) * ks, cj(ramp(SKYS, cl(y3 / HZ, 0, 1)), 4), .5);
      }
      CLOUDS.push({ o: O[0], x0: x0, y0: y0, w: w, v: v, span: 400 + w + 2 * CM + 30 });
    }
    cloud(112, 66, [[-62, -2, 14, 4], [-40, -3, 18, 5], [-14, -4, 20, 6], [12, -4, 20, 6], [38, -3, 18, 5], [62, -2, 13, 4]], 1.27, 74, 1, .62);
    cloud(252, 62, [[-92, -9, 16], [-70, -17, 21], [-44, -26, 26], [-12, -34, 30], [22, -38, 31], [54, -29, 27], [82, -18, 21], [104, -8, 14], [-28, -54, 20], [6, -62, 22], [34, -53, 19], [-58, -38, 14], [64, -44, 14]], 1.87, 71, 0, .68);
    // a fourth cumulus waits just past the right edge at the start and wraps in from the left after about 20 s,
    // so the sky is never left bare while the big one is between passes
    cloud(441, 50, [[-46, -5, 11], [-28, -12, 15], [-6, -19, 19], [18, -21, 18], [40, -13, 14], [58, -6, 10], [6, -33, 13], [-16, -29, 11]], 2.13, 75, 0, .66);
    cloud(52, 42, [[-58, -6, 12], [-40, -12, 16], [-18, -20, 20], [8, -23, 21], [32, -16, 16], [52, -8, 11], [-6, -36, 14], [18, -34, 12]], 2.41, 72, 0, .7);
    cloud(366, 21, [[-26, -4, 8], [-12, -8, 11], [4, -11, 12], [18, -7, 9], [30, -3, 6]], 2.93, 73, 0, .72);

    /* ---------- live layer ---------- */
    // gust sheen: clusters of bent, light-catching grass strokes, pre-painted at fixed places;
    // a passing gust raises their opacity, so the light runs across the field with the wind
    sd(81);
    var SL = [], SP = [], wx0 = FX - 10 * FS, wx1 = FX + 15 * FS, wy0 = FY - 30 * FS, wy1 = FY + 7 * FS;
    for (var i6 = 0; i6 < 3000 && SP.length < 110; i6++) {
      var x6 = rr(-10, 410), z6 = lp(.1, 1.04, R()), s6 = szz(z6, x6);
      if (R() > Math.min(1, Math.pow(.3 / s6, 1.2))) continue;
      var y6 = yAt(x6, z6), ok = true;
      if (x6 > wx0 - 6 && x6 < wx1 + 6 && y6 > wy0 && y6 < wy1 + 4) continue;
      for (var j6 = 0; j6 < SP.length; j6++) { var dx6 = SP[j6][0] - x6, dy6 = (SP[j6][1] - y6) * 1.7, md6 = 12.5 * (s6 + SP[j6][2]); if (dx6 * dx6 + dy6 * dy6 < md6 * md6) { ok = false; break; } }
      if (ok) SP.push([x6, y6, s6, z6]);
    }
    for (var k6 = 0; k6 < SP.length; k6++) {
      var px6 = SP[k6][0], py6 = SP[k6][1], ps6 = SP[k6][2], pz6 = SP[k6][3], rad6 = 12.5 * ps6 + 2.5, st6 = [], b6 = [1e9, 1e9, -1e9, -1e9], n6 = Math.round(rr(5, 9));
      for (var m6 = 0; m6 < n6; m6++) {
        var sx = px6 + rr(-1, 1) * rad6, sy = py6 + rr(-.6, .6) * rad6 * .55, sz6 = cl(zOf(sx, sy), 0, 1.08);
        if (pd(sx, sy) > .32) continue;
        var l6 = lOf(sz6) * rr(.85, 1.25), w6 = wOf(sz6) * rr(.6, .85), e6 = l6 * .62 + w6;
        st6.push([sx, sy, -PI / 2 + .55 + rr(-.25, .25), l6, w6, cj(mx(mx(mdc(sx, sy), pk(GL), .35), pk(SHEEN), rr(.4, .6)), 6), rr(.7, 1)]);
        b6[0] = Math.min(b6[0], sx - e6); b6[1] = Math.min(b6[1], sy - e6); b6[2] = Math.max(b6[2], sx + e6); b6[3] = Math.max(b6[3], sy + e6);
      }
      if (!st6.length) continue;
      var ox6 = Math.floor(b6[0] * DS), oy6 = Math.floor(b6[1] * DS), O6 = mk(Math.ceil(b6[2] * DS) - ox6, Math.ceil(b6[3] * DS) - oy6), c6 = O6[1];
      c6.setTransform(DS, 0, 0, DS, -ox6, -oy6);
      for (var q6 = 0; q6 < st6.length; q6++) { var t6 = st6[q6]; dab(c6, t6[0], t6[1], t6[2], t6[3], t6[4], t6[5], t6[6], -.1); }
      SL.push({ o: O6[0], x: ox6, y: oy6, g: gOf(px6, pz6) });
    }

    // tall grasses and nodding poppies, sorted by their roots
    var LV = [];
    sd(82);
    for (var i7 = 0; i7 < 3000 && LV.length < 64; i7++) {
      var x7 = rr(-6, 406), z7 = lp(.3, 1.08, Math.pow(R(), .8)), y7 = yAt(x7, z7), s7 = szz(z7, x7);
      if (R() > Math.min(1, Math.pow(.42 / s7, .8))) continue;
      var rq = R(), q7 = mx(rq < .4 ? pk(GL) : rq < .75 ? pk(GM) : pk(GOLD), mdc(x7, y7), rr(.25, .5)), oat = R() < .25;
      LV.push({ k: 0, x: x7, y: y7, g: gOf(x7, z7), a0: -PI / 2 + .1 + rr(-.22, .22), l: lOf(z7) * rr(1.3, 2.1), w: wOf(z7) * rr(.3, .5), c: rgb(q7), fx: rr(.8, 1.2), lg: rr(0, .15),
        oat: oat ? rr(-.6, .6) : null, oc: cj(pk(GOLD), 6) });
    }
    sd(83);
    var npp = 0;
    for (var i8 = 0; i8 < 16000 && npp < 80; i8++) {
      var x8 = rr(-6, 406), z8 = lp(.22, 1.06, R()), y8 = yAt(x8, z8), s8 = szz(z8, x8), p8 = pd(x8, y8);
      if (R() > p8 * p8 * Math.min(1, Math.pow(.4 / s8, 1.2)) + .004) continue;
      npp++;
      var sz8 = (1.5 + 7.6 * Math.pow(cl(z8, 0, 1.06), 1.3)) * rr(.9, 1.15), li = R();
      LV.push({ k: 1, x: x8, y: y8, g: gOf(x8, z8), ls: lOf(z8) * rr(.55, 1), s: sz8, fx: rr(.9, 1.15), lg: rr(.05, .3), na: rr(.06, .12), nw: rr(1.3, 2.4), np: rr(0, 6.283),
        a1: rr(-.8, .8), c1: cj(z8 < .3 ? mx(pk(PR), PFAR, .5 * (1 - z8 / .3)) : pk(PR), 8), c2: cj(li < .55 ? pk(PDk) : pk(PLt), 8), two: sz8 > 3.6,
        sc: cj(pk(STEMC), 6), st: z8 > .5, d2: [rr(-.3, .3), rr(0, .35), rr(-1, 1)] });
    }
    LV.sort(function (a, b) { return a.y - b.y; });

    var BC = BO[0];
    function frame(t) {
      X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
      X.drawImage(BC, 0, 0);
      for (var i = 0; i < CLOUDS.length; i++) {
        var c = CLOUDS[i], x = ((c.x0 + c.w + CM + c.v * t) % c.span + c.span) % c.span - c.w - CM;
        X.drawImage(c.o, Math.round((x - CM) * DS), Math.round((c.y0 - CM) * DS));
      }
      for (var j = 0; j < SL.length; j++) {
        var sl = SL[j], gI = gustOnly(sl.g, t);
        if (gI < .22) continue;
        X.globalAlpha = .62 * ss(.22, .95, gI);
        X.drawImage(sl.o, sl.x, sl.y);
      }
      X.setTransform(DS, 0, 0, DS, 0, 0);
      for (var k = 0; k < LV.length; k++) {
        var it = LV[k], L, ca, sa;
        if (it.k === 0) {
          L = it.fx * wind(it.g, t - it.lg); var a = it.a0 + L; ca = Math.cos(a); sa = Math.sin(a);
          dab(X, it.x + ca * it.l * .5, it.y + sa * it.l * .5, a, it.l, it.w, it.c, .88, -L * .35);
          if (it.oat !== null) dab(X, it.x + ca * it.l * .96, it.y + sa * it.l * .96, a + it.oat + L * .6, it.w * 2.6, it.w * 1.2, it.oc, .85, .1);
        } else {
          L = it.fx * wind(it.g, t - it.lg) + it.na * Math.sin(it.nw * t + it.np);
          ca = Math.sin(L); sa = -Math.cos(L);
          var hxp = it.x + ca * it.ls, hyp = it.y + sa * it.ls, s = it.s;
          if (it.st) dab(X, (it.x + hxp) * .5, (it.y + hyp + s * .3) * .5, Math.atan2(hyp - it.y, hxp - it.x), it.ls, Math.max(.6, s * .14), it.sc, .7, -L * .25);
          dab(X, hxp, hyp, it.a1 + L, s * 1.4, s * .9, it.c1, .93, .15);
          if (it.two) dab(X, hxp + it.d2[0] * s, hyp + it.d2[1] * s, it.d2[2] + L, s * .75, s * .5, it.c2, .62);
        }
      }
      X.globalAlpha = 1; X.setTransform(1, 0, 0, 1, 0, 0);
    }
    return { frame: frame };
  }

  window.Vignettes.setonet = {
    title: 'Poppies, Unordered',
    aspect: 4 / 3,
    create: function (canvas) {
      var st = build(canvas);
      return {
        frame: function (t) { st.frame(t); },
        resize: function () { st = build(canvas); }
      };
    }
  };
})();
