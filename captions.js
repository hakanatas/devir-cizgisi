/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: '4 saatte 7 derece düştü', en: 'It fell 7 degrees in 4 hours',
      note: 'Saat 18’de hava 3 derece, saat 22’de eksi 4 derece. 4 saatte sıcaklık 7 derece düştü. Saatte ortalama eksi 7 bölü 4 derece değişti. Bu sayı ondalık gösterimle kaç?' },
    { scene: 2, start: 10.8, end: 20.6, tr: '7 ÷ 4 = 1,75', en: '7 ÷ 4 = 1.75',
      note: 'Bir kesrin ondalık gösterimini bulmak için pay paydaya bölünür. 7 bölü 4: 1, kalan 3. 30 bölü 4: 7, kalan 2. 20 bölü 4: 5, kalan 0. Kalan 0 oldu, bölme bitti: 1,75.' },
    { scene: 2, start: 21.0, end: 27.8, tr: '−7/4 = −1,75', en: '−7/4 = −1.75',
      note: 'Eksi 7 bölü 4, eksi 1,75. Sıcaklık saatte 1,75 derece düştü. Her rasyonel sayı, pay paydaya bölünerek ondalık gösterime çevrilir.' },
    { scene: 3, start: 28.6, end: 39.2, tr: '5 ÷ 6: kalan hep 2', en: '5 ÷ 6: the remainder is always 2',
      note: 'Şimdi 5 bölü 6. 50 bölü 6: 8, kalan 2. 20 bölü 6: 3, kalan 2. Yine 20, yine 3, yine kalan 2. Bölme hiç bitmiyor: 0,8333 diye sürüp gidiyor.' },
    { scene: 3, start: 39.6, end: 45.8, tr: 'Devir çizgisi: 0,8333…', en: 'The repeating bar: 0.8333…',
      note: 'Tekrar eden 3 rakamının üstüne bir çizgi çekeriz: devir çizgisi. Bu bir devirli ondalık gösterimdir.' },
    { scene: 4, start: 46.6, end: 55.4, tr: '−2/11 = −0,1818…', en: '−2/11 = −0.1818…',
      note: 'Eksi 2 bölü 11: kalanlar 2, 9, 2, 9 diye tekrar ediyor. Rakamlar da 1, 8, 1, 8. Tekrar eden 18’in üstüne devir çizgisi çekeriz.' },
    { scene: 4, start: 55.8, end: 63.8, tr: '1/7: kalanlar yine 1’e döner', en: '1/7: the remainders come back to 1',
      note: '1 bölü 7’de kalanlar 1, 3, 2, 6, 4, 5 ve yine 1. 7’ye bölerken kalan en çok 6 farklı değer alabilir; bu yüzden kalan ya 0 olur ya da bir yerde tekrar eder.' },
    { scene: 5, start: 64.6, end: 74.6, tr: 'Devirsiz mi, devirli mi?', en: 'Terminating or repeating?',
      note: '3 bölü 8, 0,375: bölme bitti, devirsiz. Eksi 7 bölü 4, eksi 1,75: devirsiz. 5 bölü 6, eksi 2 bölü 11, 1 bölü 7: kalan tekrar etti, devirli.' },
    { scene: 5, start: 75.0, end: 79.8, tr: 'Ya devirsiz ya devirli', en: 'Either terminating or repeating',
      note: 'Her rasyonel sayının ondalık gösterimi ya devirsizdir ya da devirlidir.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Pay ÷ payda, kalana bak', en: 'Numerator ÷ denominator, watch the remainder',
      note: 'Aklında kalsın: ondalık gösterim için pay paydaya bölünür. Kalan 0 olursa devirsiz, kalan tekrar ederse devirli bir gösterim çıkar.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Tekrar edene devir çizgisi!', en: 'A bar over the repeating digits!',
      note: 'Tekrar eden rakamların üstüne devir çizgisi!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
