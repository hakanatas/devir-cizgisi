/* SAHNE 1 — SAATTE KAÇ DERECE? (0–10 s)  4 saatte 7 derece düştü: saatte −7/4 °C.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const label = (v) => (v < 0 ? '−' + String(-v) : String(v));

  /** a thermometer from −10 to +10 °C; level v */
  function thermo(ctx, TH, v, a, t) {
    if (a <= 0) return;
    const f = F(), Y = (u) => lerp(TH.y0, TH.y1, (10 - u) / 20), x = TH.x, s = 30;
    Ink.path(ctx, [[x - 16, TH.y0 - 20], [x - 16, TH.y1 + 12]], { w: 4, alpha: a, seed: 4001, taper: [0, 0] });
    Ink.path(ctx, [[x + 16, TH.y0 - 20], [x + 16, TH.y1 + 12]], { w: 4, alpha: a, seed: 4002, taper: [0, 0] });
    Ink.path(ctx, [[x - 16, TH.y0 - 20], [x, TH.y0 - 34], [x + 16, TH.y0 - 20]], { w: 4, alpha: a, seed: 4003, taper: [0, 0] });
    ctx.fillStyle = amber(0.85 * a); ctx.beginPath(); ctx.arc(x, TH.y1 + 38, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 8, Y(v), 16, TH.y1 + 20 - Y(v));
    for (let u = -10; u <= 10; u += 2) {
      const y = Y(u), big = u % 10 === 0 || u === 0;
      Ink.path(ctx, [[x - 16, y], [x - 16 - (big ? 26 : 14), y]], { w: 3, alpha: a, seed: 4010 + u, taper: [0, 0] });
      if (u % 5 === 0) f.T(ctx, label(u), x - 80, y, { size: s, alpha: a, align: 'right', color: u === 0 ? A.amber : undefined });
    }
    Ink.path(ctx, [[x + 24, Y(0)], [x + 330, Y(0)]], { w: 2.5, alpha: 0.5 * a * seg(t, 6.6, 7.2), seed: 4040, taper: [0, 0] });
  }

  /** division steps: rows [text, remainder, hot], row i appears at t0 + i*dt */
  function steps(ctx, D, rows, t, t0, dt, a, s) {
    if (a <= 0) return;
    const f = F();
    rows.forEach(([q, r, hot], i) => {
      const k = seg(t, t0 + i * dt, t0 + i * dt + 0.5) * a; if (k <= 0) return;
      const y = D.y0 + i * D.dy;
      f.T(ctx, q, D.x, y, { size: s * 0.85, alpha: k, align: 'left', halo: true });
      f.T(ctx, r, D.x + (s > 42 ? 300 : 280), y, { size: s * 0.85, alpha: k, align: 'left', halo: true, color: hot ? A.amber : undefined });
    });
  }
  /** a decimal: parts [text, barred]; drawn as one string, the bars draw in with bk */
  function dec(ctx, parts, x, y, s, a, bk, color) {
    if (a <= 0) return;
    const f = F(), full = parts.map(([txt]) => txt).join(''), tw = f.width(ctx, full, s), x0 = x - tw / 2;
    f.T(ctx, full, x0, y, { size: s, alpha: a, align: 'left', halo: true, color });
    let pre = '';
    parts.forEach(([txt, bar], i) => {
      const cx = x0 + f.width(ctx, pre, s), w = f.width(ctx, txt, s);
      if (bar && bk > 0) Ink.path(ctx, [[cx + 3, y - s * 0.62], [cx + 3 + (w - 6) * bk, y - s * 0.62]], { w: Math.max(3, s * 0.07), alpha: a, seed: 5100 + i, taper: [0, 0], color: LI.AMBER_RGB });
      pre += txt;
    });
  }
  /** a lead-in like "7/4 =" followed by a decimal */
  function eq(ctx, lead, parts, x, y, s, a, bk, color) {
    if (a <= 0) return;
    const f = F();
    const lw = lead.reduce((u, it) => u + (typeof it === 'string' ? f.width(ctx, it, s) : Math.max(f.width(ctx, String(it.n), s * 0.72), f.width(ctx, String(it.d), s * 0.72)) + s * 0.25), 0);
    const dw = parts.reduce((u, [txt]) => u + f.width(ctx, txt, s), 0), tw = lw + dw;
    f.expr(ctx, lead, x - tw / 2 + lw / 2, y, s, { alpha: a, halo: true, color });
    dec(ctx, parts, x - tw / 2 + lw + dw / 2, y, s, a, bk, color);
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, '4 saatte sıcaklık 7 derece düştü. Saatte kaç derece?'],
      [10.6, 27.8, 'Bir rasyonel sayının ondalık gösterimi: pay ÷ payda'],
      [28.4, 45.8, 'Her bölme biter mi?'],
      [46.4, 63.8, 'Kalan neden tekrar eder?'],
      [64.4, 79.8, 'Devirsiz mi, devirli mi?'],
    ]);
  }

  const S74 = [['7 ÷ 4 = 1', 'kalan 3'], ['30 ÷ 4 = 7', 'kalan 2'], ['20 ÷ 4 = 5', 'kalan 0', true]];
  const S56 = [['5 ÷ 6 = 0', 'kalan 5'], ['50 ÷ 6 = 8', 'kalan 2'], ['20 ÷ 6 = 3', 'kalan 2', true], ['20 ÷ 6 = 3', 'kalan 2 …', true]];
  const S211 = [['2 ÷ 11 = 0', 'kalan 2'], ['20 ÷ 11 = 1', 'kalan 9'], ['90 ÷ 11 = 8', 'kalan 2', true], ['20 ÷ 11 = 1', 'kalan 9 …', true]];
  const TABLE = [[[fr(3, 8)], [['0,375']], 'devirsiz'], [['−', fr(7, 4)], [['−1,75']], 'devirsiz'], [[fr(5, 6)], [['0,8'], ['3', 1]], 'devirli'], [['−', fr(2, 11)], [['−0,'], ['18', 1]], 'devirli'], [[fr(1, 7)], [['0,'], ['142857', 1]], 'devirli']];

  function figure(ctx, env, t) {
    const L = KD.L(env), f = F(), a = END(t), s = L.G.s, D = L.DV, R = L.RS;
    // 0–10: thermometer from +3 to −4
    const th = win(t, 4.6, 10.2) * a;
    if (th > 0) {
      const v = lerp(3, -4, inOut(seg(t, 6.6, 8.4))) * seg(t, 5.0, 5.8);
      thermo(ctx, L.TH, v, th, t);
      const Y = (u) => lerp(L.TH.y0, L.TH.y1, (10 - u) / 20);
      f.T(ctx, 'Saat 18.00: +3 °C', L.TH.x + 60, Y(3), { size: s * 0.8, alpha: th * seg(t, 5.8, 6.3), align: 'left', halo: true });
      f.T(ctx, 'Saat 22.00: −4 °C', L.TH.x + 60, Y(-4), { size: s * 0.8, alpha: th * seg(t, 8.4, 8.9), align: 'left', halo: true, color: A.amber });
    }
    // 10–28: 7 ÷ 4
    const s2 = win(t, 11.8, 27.8) * a;
    if (s2 > 0) {
      steps(ctx, D, S74, t, 12.4, 1.6, s2, s);
      const r = t < 14.0 ? '1' : t < 15.6 ? '1,7' : '1,75';
      eq(ctx, [fr(7, 4), ' = '], [[r]], R.x, R.y, s * 1.2, s2 * seg(t, 12.6, 13.0));
      eq(ctx, ['−', fr(7, 4), ' = '], [['−1,75']], R.x, R.y + 110, s * 1.2, s2 * seg(t, 18.6, 19.0), 0, A.amber);
    }
    // 28–46: 5 ÷ 6
    const s3 = win(t, 28.8, 45.8) * a;
    if (s3 > 0) {
      steps(ctx, D, S56, t, 29.4, 1.4, s3, s);
      const r = t < 30.8 ? '0' : t < 32.2 ? '0,8' : t < 33.6 ? '0,83' : t < 35.0 ? '0,833' : '0,8333…';
      eq(ctx, [fr(5, 6), ' = '], [[r]], R.x, R.y, s * 1.2, s3 * seg(t, 29.6, 30.0));
      eq(ctx, [fr(5, 6), ' = '], [['0,8'], ['3', 1]], R.x, R.y + 110, s * 1.2, s3 * seg(t, 38.0, 38.4), seg(t, 38.6, 39.4), A.amber);
    }
    // 46–56: −2/11
    const s4 = win(t, 46.8, 55.4) * a;
    if (s4 > 0) {
      steps(ctx, D, S211, t, 47.4, 1.4, s4, s);
      const r = t < 48.8 ? '−0' : t < 50.2 ? '−0,1' : t < 51.6 ? '−0,18' : t < 53.0 ? '−0,181' : '−0,1818…';
      eq(ctx, ['−', fr(2, 11), ' = '], [[r]], R.x, R.y, s * 1.2, s4 * seg(t, 47.6, 48.0));
      eq(ctx, ['−', fr(2, 11), ' = '], [['−0,'], ['18', 1]], R.x, R.y + 110, s * 1.2, s4 * seg(t, 53.4, 53.8), seg(t, 53.8, 54.6), A.amber);
    }
    // 56–64: 1/7, the remainders come back
    const s5 = win(t, 55.8, 63.8) * a, cx = L.TB.x;
    if (s5 > 0) {
      const R7 = ['1', '3', '2', '6', '4', '5', '1'];
      const items = []; R7.forEach((r, i) => { if (t > 56.2 + i * 0.5) items.push(i ? ' → ' + r : r); });
      f.expr(ctx, ['kalanlar: ' + items.join('')], cx, D.y0 + D.dy * 0.5, s * 0.95, { alpha: s5, halo: true });
      if (t > 59.4) f.T(ctx, 'aynı kalan!', cx + (env.V ? 250 : 300), D.y0 + D.dy * 1.5, { size: s * 0.7, alpha: s5 * seg(t, 59.4, 59.8), color: A.amber, halo: true });
      eq(ctx, [fr(1, 7), ' = '], [['0,142857142857…']], cx, D.y0 + D.dy * 3, s * 1.1, s5 * seg(t, 57.0, 57.4));
      eq(ctx, [fr(1, 7), ' = '], [['0,'], ['142857', 1]], cx, D.y0 + D.dy * 4.3, s * 1.1, s5 * seg(t, 60.6, 61.0), seg(t, 61.0, 61.8), A.amber);
    }
    // 64–80: the table
    const s6 = win(t, 65.0, 79.8) * a, T = L.TB;
    if (s6 > 0) {
      const hk = seg(t, 65.2, 65.6) * s6;
      ['Rasyonel sayı', 'Ondalık gösterim', 'Tür'].forEach((h, j) => f.T(ctx, h, T.x + T.cols[j], T.y0, { size: s * 0.72, alpha: hk, halo: true }));
      if (hk > 0) Ink.path(ctx, [[T.x + T.cols[0] - 150, T.y0 + 30], [T.x + T.cols[2] + 130, T.y0 + 30]], { w: 3, p: seg(t, 65.4, 66.2), alpha: hk, seed: 5200, taper: [0, 0] });
      TABLE.forEach(([q, d, kind], i) => {
        const k = seg(t, 66.4 + i * 1.1, 66.9 + i * 1.1) * s6; if (k <= 0) return;
        const y = T.y0 + (i + 1) * T.dy + 12, hot = kind === 'devirli';
        f.expr(ctx, q, T.x + T.cols[0], y, s * 0.85, { alpha: k, halo: true });
        dec(ctx, d, T.x + T.cols[1], y, s * 0.85, k, 1);
        f.T(ctx, kind, T.x + T.cols[2], y, { size: s * 0.8, alpha: k, halo: true, color: hot ? A.amber : undefined });
      });
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.4, 10.2, '7 derece 4 saatte düştü: saatte −7/4 derece'], [11.4, 27.8, 'Pay paydaya bölünür: 7 ÷ 4'],
      [29.4, 45.8, '5 ÷ 6: kalan hep 2 çıkıyor'], [47.4, 55.4, '−2/11: kalanlar 2, 9, 2, 9, … ve 18 tekrar ediyor'],
      [55.8, 63.8, '1/7: kalanlar 1, 3, 2, 6, 4, 5 ve yine 1'], [65.0, 79.8, 'Bölme biterse: devirsiz ondalık gösterim']]);
    exprs(ctx, t, at(W, 1), [[16.2, 27.8, 'Kalan 0 oldu, bölme bitti: 7/4 = 1,75'], [35.0, 45.8, 'Bölme bitmiyor: 3 rakamı sonsuza kadar tekrar eder'],
      [51.8, 55.4, 'Tekrar eden rakam grubunun üstüne devir çizgisi'], [56.6, 63.8, '7’ye bölerken kalan en çok 6 farklı değer alabilir'],
      [70.6, 79.8, 'Kalan tekrar ederse: devirli ondalık gösterim']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, '−7/4 ondalık gösterimle kaç?', true], [21.0, 27.8, 'Her rasyonel sayı, pay paydaya bölünerek ondalık gösterime çevrilir', true],
      [39.6, 45.8, 'Tekrar eden rakamların üstüne devir çizgisi çekilir: devirli ondalık gösterim', true],
      [58.0, 63.8, 'Kalan ya 0 olur ya da bir yerde tekrar eder', true],
      [75.0, 79.8, 'Her rasyonel sayının ondalık gösterimi ya devirsiz ya devirlidir', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Pay ÷ payda: ondalık gösterim', 80.6], ['Kalan 0 olursa devirsiz: 7/4 = 1,75', 81.6], ['Kalan tekrar ederse devirli: 5/6 = 0,8333…', 82.6], ['Tekrar eden rakamlara devir çizgisi!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Degrees per hour', nameTr: 'Saatte kaç derece?', concept: '−7/4 °C', conceptTr: '−7/4 °C', render });
})(window.LI = window.LI || {});
