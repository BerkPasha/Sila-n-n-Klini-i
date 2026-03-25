/**
 * levels.js — Sıla'nın Kliniği · Vaka Ağacı v2
 *
 * Her node:
 *   id          : string  — benzersiz tanımlayıcı
 *   text        : string  — ekrana basılacak metin
 *   type        : string  — 'normal' | 'alert' | 'death' | 'success'
 *   choices     : array   — seçenek butonları
 *
 * Her choice:
 *   label       : string  — buton metni
 *   nextNodeId  : string  — sonraki node
 *   effects     : object  — player.js applyEffects() girdisi
 */

'use strict';

const Levels = (() => {

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA 1 — Parvoviral Hemorajik Gastroenterit
  //  4 aylık, aşısız Golden Retriever erkek
  // ═══════════════════════════════════════════════════════════════════════════
  const CASE_1 = {
    id: 'case1', startNodeId: 'c1_giris',
    patient: {
      species: 'dog', name: 'Pamuq', age: '4 aylık', weight: '5,2 kg',
      complaint: 'Kanlı ishal, şiddetli kusma, letarji',
      vitals: { heartRate: 155, temperature: 39.9, respiration: 36 },
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA 2 — Yumurta Tıkanması (Egg Binding)
  //  3 yaşında dişi Sultan Papağanı
  // ═══════════════════════════════════════════════════════════════════════════
  const CASE_2 = {
    id: 'case2', startNodeId: 'c2_giris',
    patient: {
      species: 'bird', name: 'Mavi', age: '3 yaşında', weight: '86 g',
      complaint: 'Kabarma, halsizlik, tabanda durma, ıkınma',
      vitals: { heartRate: 310, temperature: 38.2, respiration: 48 },
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA 3 — FLUTD / Üretra Tıkanıklığı
  //  2 yaşında erkek Scottish Fold
  // ═══════════════════════════════════════════════════════════════════════════
  const CASE_3 = {
    id: 'case3', startNodeId: 'c3_giris',
    patient: {
      species: 'cat', name: 'Atlas', age: '2 yaşında', weight: '4,8 kg',
      complaint: '2 gündür idrara çıkamama, ıkınma, kusma',
      vitals: { heartRate: 210, temperature: 38.6, respiration: 34 },
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA 4 — GDV (Mide Volvolüsü / Mide Dönmesi)
  //  5 yaşında Alman Çoban Köpeği
  // ═══════════════════════════════════════════════════════════════════════════
  const CASE_4 = {
    id: 'case4', startNodeId: 'c4_giris',
    patient: {
      species: 'dog', name: 'Ares', age: '5 yaşında', weight: '38 kg',
      complaint: 'Yemekten sonra karın şişliği, öğürme ama kusamama, ajitasyon',
      vitals: { heartRate: 148, temperature: 38.3, respiration: 42 },
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA 5 — Kursak Mantarı / Bakteriyel Enfeksiyon
  //  1 yaşında erkek Muhabbet Kuşu
  // ═══════════════════════════════════════════════════════════════════════════
  const CASE_5 = {
    id: 'case5', startNodeId: 'c5_giris',
    patient: {
      species: 'bird', name: 'Sarı', age: '1 yaşında', weight: '32 g',
      complaint: 'Sürekli uyuklama, tüy kabarıklığı, yeşil/sulu dışkı',
      vitals: { heartRate: 295, temperature: 39.8, respiration: 52 },
    },
  };

  const ALL_CASES = [CASE_1, CASE_2, CASE_3, CASE_4, CASE_5];

  // ═══════════════════════════════════════════════════════════════════════════
  //  NODE LİSTESİ
  // ═══════════════════════════════════════════════════════════════════════════
  const NODES = {

    // ──────────────────────────────────────────────────────────────────────────
    // VAKA 1: Parvoviral Enterit
    // ──────────────────────────────────────────────────────────────────────────

    c1_giris: {
      id: 'c1_giris', type: 'normal',
      text: `Muayene odasına dört aylık Golden Retriever yavrusu getirildi. Sahip panikle anlatıyor:\n\n"Dün gece kanla karışık ishal başladı, sabahtan beri sürekli kusuyor, artık ayağa bile kalkamıyor."\n\nHızlı gözlem:\n• Belirgin letarji, göz çökmüş\n• Mukoza membranlar soluk ve yapışkan\n• Kapiller dolum zamanı: 3 saniye\n• Dışkı kanlı, çok kötü kokulu\n\nAşılama durumu: Aşısız (sahip "doğal bağışıklık" inanıyor)\n\nNasıl devam edersiniz?`,
      choices: [
        { label: 'Sistematik anamnez al + fizik muayene yap + SNAP Parvo testi iste', nextNodeId: 'c1_tani', effects: { budgetDelta: -120 } },
        { label: 'Anamnezi atla, semptomatik tedaviye başla — zaman kaybetme', nextNodeId: 'c1_anamnez_atlama', effects: { repDelta: -0.1 } },
        { label: 'Besin zehirlenmesi ol, eve gönder + metronidazol yaz', nextNodeId: 'c1_yanlis_tani', effects: { hrDelta: +25, tempDelta: +0.6, respDelta: +8, budgetDelta: -30, repDelta: -0.3 } },
      ],
    },

    c1_anamnez_atlama: {
      id: 'c1_anamnez_atlama', type: 'alert',
      text: `Anamnez atlandı — kör seçimler yapılıyor.\n\nBu tür tabloda atlandığında Parvo ile Salmonella, HGE ve intussusepsiyon ayırt edilemiyor. Protokol dışı tedavi başlandı.\n\nHasta vital olarak kötüleşiyor. İtibara zarar geldi ama kriz henüz atlatılabilir.`,
      choices: [
        { label: 'Geri dön, doğru anamnez + SNAP test yap', nextNodeId: 'c1_tani', effects: { hrDelta: +10, tempDelta: +0.2, repDelta: -0.1, budgetDelta: -80 } },
      ],
    },

    c1_yanlis_tani: {
      id: 'c1_yanlis_tani', type: 'death',
      text: `Hasta 8 saat sonra şoka girdi.\n\n📋 Klinik Not:\nParvoviral enterit ile besin zehirlenmesi benzer semptom gösterir. Ancak Parvo'da:\n• Kan-bariyeri yıkımından kaynaklanan endotoksemi\n• Hızlı dehidrasyon ve elektrolit dengesizliği\n• IV sıvı olmadan tablo saatler içinde ölüme gider\n\nMetronidazol tek başına Parvo'da viral replikasyonu durdurmaz. Pamuq gelen 8. saatte kardiyojenik şoka girdi.\n\n💀 ÖLÜM NEDENİ: Tedavisiz kalan Parvoviral enterit → Hipovolemik şok → Kardiyak arrest\n\nDOĞRU YAKLAŞIM: SNAP Parvo testi + agresif IV rehidrasyon + antibiyotik protokolü`,
    },

    c1_tani: {
      id: 'c1_tani', type: 'alert',
      text: `SNAP Parvo Antijen Testi: ✅ POZİTİF\n\nKan tablosu:\n• PCV: %22 (anemi + dehidrasyon)\n• Total protein: 3.8 g/dL (hipoalbuminemi)\n• Glukoz: 52 mg/dL (hipoglisemi)\n• BUN: 52 mg/dL (prerenal azotemi)\n\nTanı konfirme: Parvoviral Hemorajik Gastroenterit\n\nHasta kritik. IV erişim açıldı. Hangi sıvı protokolünü seçiyorsunuz?`,
      choices: [
        { label: 'IV Laktatlı Ringer — şok dozu 90 mL/kg/gün + Ampisilin + Maropitant', nextNodeId: 'c1_dogru_tedavi', effects: { budgetDelta: -380, hrDelta: -15 } },
        { label: 'IV %0.9 NaCl + Enrofloksasin + Maropitant — geniş spektrum daha iyi', nextNodeId: 'c1_enro_tedavi', effects: { budgetDelta: -350 } },
        { label: 'IV Laktatlı Ringer + Gentamisin + Maropitant — aminoglikozid etkili', nextNodeId: 'c1_gentamisin_olum', effects: { budgetDelta: -320, hrDelta: -15, tempDelta: +0.3 } },
        { label: 'Sadece antiemetik (Metoklopramid) ver, kusmayı durdur önce', nextNodeId: 'c1_sivi_yok', effects: { hrDelta: +20, tempDelta: +0.5, respDelta: +5, budgetDelta: -40 } },
      ],
    },

    c1_enro_tedavi: {
      id: 'c1_enro_tedavi', type: 'alert',
      text: `Enrofloksasin başlandı.\n\n⚠ Klinik Uyarı:\nEnrofloksasin (florokinolon) büyümekte olan köpeklerde kıkırdak toksisitesi yapar. 4 aylık yavru için kontrendike.\n\nAyrıca gram-pozitif kapsamı zayıftır — Parvo'daki sekonder bakteriyemi'de yetersiz.\n\nHasta toparlanmıyor, ek komplikasyon riski arttı. Antibiyotiği değiştirmek gerekiyor.`,
      choices: [
        { label: 'Enrofloksasini kes, Ampisilin-Sulbaktam başla', nextNodeId: 'c1_dogru_tedavi', effects: { hrDelta: -8, repDelta: -0.1, budgetDelta: -150 } },
        { label: 'Enrofloksasine devam et, doz artır', nextNodeId: 'c1_enro_devam', effects: { hrDelta: +15, tempDelta: +0.2, repDelta: -0.3 } },
      ],
    },

    c1_enro_devam: {
      id: 'c1_enro_devam', type: 'death',
      text: `Doz arttırıldı. 48 saat sonra:\n\n• Hasta topallıyor — ön ayak eklemlerinde şişlik\n• Artropati gelişti (florokinolon kıkırdak toksisitesi)\n• Hipoglisemi nedeniyle nöbet geçirdi\n• Karaciğer enzimleri 3 kat yükseldi\n\n💀 ÖLÜM NEDENİ: Florokinolon toksisitesi + kontrol edilemeyen Parvo seyri → Multiorgan yetmezliği\n\nDOĞRU YAKLAŞIM: Yavru köpekte (<1 yıl) enrofloksasin KONTRENDİKE. Beta-laktam antibiyotikler (Ampisilin) tercih edilmeli.`,
    },

    c1_gentamisin_olum: {
      id: 'c1_gentamisin_olum', type: 'death',
      text: `Gentamisin başlandı.\n\n📋 Klinik Not:\nAminoglikozidler (gentamisin, amikacin) ciddi derecede dehidrate, hipoalbuminemik hastada doğrudan nefrotoksisiteye gider.\n\nPamuq'un Total Protein: 3.8 g/dL → İlaç proteine bağlanamıyor → Serbest ilaç konsantrasyonu toksik seviyeye çıkıyor.\n\n6 saat sonra:\n• İdrar çıkışı durdu → Akut böbrek yetmezliği\n• BUN: 148 mg/dL, Kreatinin: 8.2 mg/dL\n• Kalp ritmi: 22 bpm → Hiperkalemik bradikardi\n\n💀 ÖLÜM NEDENİ: Aminoglikozid nefrotoksisitesi → Akut böbrek yetmezliği → Hiperkalemik kardiyak arrest\n\nDOĞRU YAKLAŞIM: Dehidrate + hipoalbuminemik hastada aminoglikozid KESİNLİKLE kullanılmaz.`,
    },

    c1_sivi_yok: {
      id: 'c1_sivi_yok', type: 'death',
      text: `Sadece antiemetik verildi, IV sıvı başlanmadı.\n\nParvo'da kusmanın kaynağı SSS'dir (maropitant hem santral hem periferik etki eder), metoklopramid ise sadece periferik prokinetidir ve yeterli değildir.\n\nDaha kritik sorun: 4 saat içinde:\n• PCV %22 → %16'ya geriledi\n• Kan glukozu: 32 mg/dL → Hipoglisemik kriz\n• Tansiyon: 55/30 mmHg → Distributif şok\n\n💀 ÖLÜM NEDENİ: IV sıvı verilmemesi → İlerleyici hipovolemi → Hipoglisemik koma + kardiyovasküler kollaps\n\nDOĞRU YAKLAŞIM: Parvo'da sıvı tedavisi HAYAT KURTARICIDIR, semptomatik tedavi tek başına yeterli değildir.`,
    },

    c1_dogru_tedavi: {
      id: 'c1_dogru_tedavi', type: 'normal',
      text: `Tedavi protokolü başlandı:\n\n💉 IV Laktatlı Ringer — 90 mL/kg/24h\n💊 Ampisilin-Sulbaktam 22 mg/kg IV q8h\n💊 Maropitant (Cerenia) 1 mg/kg SC\n\n4 saat sonra:\n• Kalp ritmi: 128 bpm ↓\n• Kapiller dolum: 2 sn (düzeldi)\n• Kusma frekansı belirgin azaldı\n\nHasta cevap veriyor. Beslenme desteği zamanı:`,
      choices: [
        { label: '24 saat NPO, ardından %5 glukoz+elektrolit ile başla', nextNodeId: 'c1_dogru_beslenme', effects: { hrDelta: -18, tempDelta: -0.5, respDelta: -10, budgetDelta: -50 } },
        { label: 'Zayıf düşmesin, hemen mama ver', nextNodeId: 'c1_yanlis_beslenme', effects: { hrDelta: +12, tempDelta: +0.2, respDelta: +5 } },
        { label: 'Nazogastrik tüp — yüksek proteinli mama', nextNodeId: 'c1_yanlis_beslenme', effects: { hrDelta: +15, tempDelta: +0.3, respDelta: +6 } },
      ],
    },

    c1_yanlis_beslenme: {
      id: 'c1_yanlis_beslenme', type: 'alert',
      text: `Pamuq verilen mamayı anında kustu. Mide ve bağırsak mukozası henüz onarılmamış — erken enteral yükleme inflamasyonu artırdı.\n\n⚠ Aspirasyon pnömonisi riski oluştu. Solunum takibe alındı.\n\nNeyse ki kritik değerlere ulaşmadı, ama iyileşme süreci uzadı.`,
      choices: [
        { label: 'NPO uygula, doğru protokole dön', nextNodeId: 'c1_dogru_beslenme', effects: { hrDelta: -5, tempDelta: -0.1, respDelta: -4, budgetDelta: -150, repDelta: -0.05 } },
      ],
    },

    c1_dogru_beslenme: {
      id: 'c1_dogru_beslenme', type: 'normal',
      text: `24 saat NPO. Ardından %5 glukoz + elektrolit solüsyonu.\n48. saatte düşük yağlı ıslak mama başlandı.\n\n72 saat sonra:\n• Kalp ritmi: 108 bpm ✓\n• Sıcaklık: 38.7°C ✓\n• İshal ve kusma durdu\n• Pamuq başını kaldırıp kuyruk sallıyor\n\nTaburculuk kararı?`,
      choices: [
        { label: 'Taburcu et — ev bakım talimatları + 10 gün sonra kontrol', nextNodeId: 'c1_basari', effects: { hrSet: 108, tempSet: 38.7, respSet: 22, budgetDelta: +600, repDelta: +0.2 } },
        { label: '1 gün daha gözlemde tut', nextNodeId: 'c1_ek_gozlem', effects: { budgetDelta: -180, repDelta: +0.05 } },
      ],
    },

    c1_ek_gozlem: {
      id: 'c1_ek_gozlem', type: 'normal',
      text: `Pamuq 1 gün daha klinikte kaldı. Tüm vitaller stabil. Sabah mama yedi, su içti. Sahibine koştu.\n\nEk gözlem gereksizdi ama ihtiyatlı tutum sahibi memnun etti.`,
      choices: [
        { label: 'Taburcu et', nextNodeId: 'c1_basari', effects: { budgetDelta: +600, repDelta: +0.15 } },
      ],
    },

    c1_basari: {
      id: 'c1_basari', type: 'success',
      text: `🏆 VAKA BAŞARIYLA TAMAMLANDI\n\nParvoviral Hemorajik Gastroenterit — Tam İyileşme\n\nDoğru adımlar:\n✓ SNAP Parvo antijen testi\n✓ IV Laktatlı Ringer ile agresif rehidrasyon\n✓ Ampisilin (yaşa uygun antibiyotik)\n✓ Maropitant (güçlü antiemetik)\n✓ NPO → Kademeli beslenme\n\n"Doğru teşhis, yarı tedavidir." — Dr. Sıla`,
    },

    // ──────────────────────────────────────────────────────────────────────────
    // VAKA 2: Yumurta Tıkanması
    // ──────────────────────────────────────────────────────────────────────────

    c2_giris: {
      id: 'c2_giris', type: 'normal',
      text: `Küçük bir kutuda titreyen Sultan Papağanı.\n\nSahip: "Dün akşamdan beri kafes tabanında oturuyor, tüyleri kabarık, ıkınıp duruyor ama bir şey çıkmıyor."\n\nGözlem:\n• Tüyler kabarık — hipotermi işareti\n• Karın bölgesi belirgin şişkin\n• Mukuslarda solgunluk\n• Sürekli ıkınma\n\n⚠ Kuşlar strese aşırı hassastır. Yanlış müdahale saniyeler içinde ölüme yol açar.`,
      choices: [
        { label: 'Nazik fizik muayene + hafif karın palpasyonu + radyografi', nextNodeId: 'c2_muayene', effects: { budgetDelta: -180 } },
        { label: 'Hızlı elle muayene — kaba palpasyon', nextNodeId: 'c2_kaba_muayene', effects: { hrDelta: +60, tempDelta: -0.8, respDelta: +15 } },
        { label: 'Yumurtayı doğrudan elle çıkarmaya çalış', nextNodeId: 'c2_manuel_olum', effects: { killPatient: true, deathCause: 'Stres kaynaklı kardiyak arrest + yumurta rüptürü' } },
      ],
    },

    c2_kaba_muayene: {
      id: 'c2_kaba_muayene', type: 'death',
      text: `Kuş tutularak güçlü palpasyon uygulandı.\n\n📋 Klinik Not:\nKuşlarda katekolamin artışı saniyeler içinde ventriküler taşikardiye gider. "Capture myopathy" olarak bilinen bu tablo memelilerden tamamen farklıdır.\n\n30 saniye içinde:\n• Kalp ritmi: 420 bpm → Ventriküler fibrilasyon\n• Aniden durdu, gözler kapandı\n• Kuşlarda kardiyak masaj anatomik olarak imkânsız\n\n💀 ÖLÜM NEDENİ: Akut stres kaynaklı kardiyak arrest (capture myopathy)\n\nDOĞRU YAKLAŞIM: Kuş muayenesi MİNİMAL STRES ilkesiyle, kısa süreli ve deneyimli tutuşla yapılır.`,
    },

    c2_manuel_olum: {
      id: 'c2_manuel_olum', type: 'death',
      text: `Yumurta kırıldı — kabuk parçaları ovidukt içinde kaldı.\n\nYolk karın boşluğuna sızdı.\n\n📋 Klinik Not:\nYolk (yumurta sarısı) steril olmayan bir ortamda vücut boşluğuna girdiğinde şiddetli kimyasal peritonit yaratır. Kuş büyüklüğüyle orantılı bakteri yükü 12-18 saatte septisemiye dönüşür.\n\n💀 ÖLÜM NEDENİ: İyatrojenik yumurta rüptürü → Yolk peritoniti → Septisemi\n\nDOĞRU YAKLAŞIM: Yumurta tıkanmasında ASLA kör manuel müdahale yapılmaz.`,
    },

    c2_muayene: {
      id: 'c2_muayene', type: 'alert',
      text: `Radyografi çekildi.\n\n📋 Bulgular:\n• Kloaka bölgesinde 2.1 cm çapında kalsifiye yumurta\n• Pelvis çıkımını tamamen tıkıyor\n• Yumurta kabuğu bütünlüğü korunuyor\n\nTanı: Egg Binding — konfirme\n\nVitaller:\n• Kalp: 310 bpm (stres taşikardisi)\n• Isı: 38.2°C → Hipotermi (normal: 40–42°C)\n• Solunum: 48/dk\n\n⏰ STABİLİZASYON ÖNCELİKLİ — müdahale öncesi zorunlu.`,
      choices: [
        { label: 'Isıtma (28–32°C kuluçka kutusu) + oksijen desteği', nextNodeId: 'c2_stabil', effects: { hrDelta: -30, tempDelta: +1.2, respDelta: -8, budgetDelta: -60 } },
        { label: 'Stabilizasyonu atla, vakit kaybı — hemen ilaç başlat', nextNodeId: 'c2_stabil_atlama', effects: { hrDelta: +20, tempDelta: -0.3 } },
      ],
    },

    c2_stabil_atlama: {
      id: 'c2_stabil_atlama', type: 'alert',
      text: `Isıtma yapılmadan Kalsiyum enjeksiyonu uygulandı.\n\nAncak hipotermi nedeniyle ilaç metabolizması bozulmuş — kalsiyum hücre düzeyinde çalışamıyor.\n\n2 saat boşa harcandı. İtibar zarar gördü.`,
      choices: [
        { label: 'Şimdi ısıtma + oksijen uygula ve protokole dön', nextNodeId: 'c2_stabil', effects: { hrDelta: -10, tempDelta: +0.6, repDelta: -0.1, budgetDelta: -60 } },
      ],
    },

    c2_stabil: {
      id: 'c2_stabil', type: 'normal',
      text: `Hasta kuluçka kutusuna alındı (30°C, %60 nem). Oksijen (%40).\n\n45 dakika sonra:\n• Kalp ritmi: 275 bpm ↓ (stabilize)\n• Sıcaklık: 39.8°C ✓\n• Hafifçe ötmeye başladı\n\nMedikal müdahale başlıyor. Protokol seçin:`,
      choices: [
        { label: 'Kalsiyum Glukonat IM + 30 dk bekle + Oksitosin SC', nextNodeId: 'c2_kalsiyum_oksit', effects: { budgetDelta: -90, hrDelta: -5 } },
        { label: 'Sadece Oksitosin ver — kalsiyum gerekmez', nextNodeId: 'c2_oksit_tek', effects: { budgetDelta: -40, hrDelta: +25, tempDelta: -0.5 } },
        { label: 'Karın masajı — yumurtayı aşağı it', nextNodeId: 'c2_masaj', effects: {} },
        { label: 'Direkt cerrahiye al — medikal tedavi zaman kaybı', nextNodeId: 'c2_erken_cerrahi', effects: { budgetDelta: -500 } },
      ],
    },

    c2_oksit_tek: {
      id: 'c2_oksit_tek', type: 'death',
      text: `Kalsiyum verilmeden Oksitosin uygulandı.\n\n📋 Klinik Not:\nOksitosin, ovidukt kaslarının kasılmasını sağlar. Ancak bu kasılma için kalsiyum iyonu ZORUNLUDUR. Kalsiyum eksikliğinde oksitosin düzenli kasılma yerine tetanik spazm yaratır.\n\nSonuç:\n• Oviduktta tetanik kasılma → Yumurta sıkıştı\n• Ovidukt duvarı rüptürü\n• Kalp ritmi: 450 bpm → Ventriküler fibrilasyon\n\n💀 ÖLÜM NEDENİ: Hipokalsinemik ovidukt spazmı → Ovidukt rüptürü → Hemorajik şok\n\nDOĞRU YAKLAŞIM: Oksitosin ASLA kalsiyum takviyesiz verilmez. Protokol: Ca++ → 30 dk bekleme → Oksitosin.`,
    },

    c2_masaj: {
      id: 'c2_masaj', type: 'alert',
      text: `Nazik karın masajı uygulandı — yumurta hafifçe ilerledi ama kanalda sıkıştı.\n\nKabuk bütünlüğü henüz korunuyor. Şans yaver gitti.\n\n⚠ Risk yüksek: Her ek basınç kabuk rüptürüne yol açabilir.`,
      choices: [
        { label: 'Masajı bırak, Kalsiyum + Oksitosin protokolüne geç', nextNodeId: 'c2_kalsiyum_oksit', effects: { budgetDelta: -90, hrDelta: +10 } },
        { label: 'Masaja devam et, biraz daha kuvvet uygula', nextNodeId: 'c2_masaj_ruptur', effects: { killPatient: true, deathCause: 'Masaj ile yumurta kabuğu kırıldı → Yolk peritoniti → Septisemi' } },
      ],
    },

    c2_masaj_ruptur: {
      id: 'c2_masaj_ruptur', type: 'death',
      text: `Kabuk "çat" sesiyle kırıldı. Yolk karın boşluğuna aktı.\n\n💀 ÖLÜM NEDENİ: İyatrojenik yumurta rüptürü → Yolk peritoniti → Septisemi`,
    },

    c2_erken_cerrahi: {
      id: 'c2_erken_cerrahi', type: 'alert',
      text: `Medikal tedavi atlanarak direkt cerrahiye alındı.\n\nStabilize olmuş hasta anesteziye alınacak. Kuşlarda anestezi seçimi kritik:`,
      choices: [
        { label: 'İzofloran inhalasyon anestezisi — maske indüksiyon', nextNodeId: 'c2_dogru_anestezi', effects: { budgetDelta: -300 } },
        { label: 'Ketamin IM 10 mg/kg — hızlı ve pratik', nextNodeId: 'c2_ketamin_olum', effects: { hrDelta: +50, respDelta: -18, budgetDelta: -80 } },
        { label: 'Propofol IV 6 mg/kg — bildiğimiz standart anestezi', nextNodeId: 'c2_propofol_olum', effects: { hrDelta: -60, respDelta: -22, budgetDelta: -100 } },
      ],
    },

    c2_kalsiyum_oksit: {
      id: 'c2_kalsiyum_oksit', type: 'normal',
      text: `Protokol uygulandı:\n\n💉 Kalsiyum Glukonat %10 — 50 mg/kg IM (dilüe, yavaş)\n⏳ 30 dakika beklendi\n💉 Oksitosin — 2 IU/kg IM\n\nOvidukta kasılmaları düzenli hale geldi. Yumurta kloakadan görünmeye başladı — ama tam çıkamadı.\n\nMedikal tedavi yetersiz kaldı. Cerrahi müdahale gerekiyor.`,
      choices: [
        { label: 'Ovosentez + İzofloran anestezisi', nextNodeId: 'c2_anestezi_secimi', effects: { budgetDelta: -50 } },
      ],
    },

    c2_anestezi_secimi: {
      id: 'c2_anestezi_secimi', type: 'alert',
      text: `Cerrahi için anestezi seçimi:\n\nKuşlarda anestezi yönetimi memelilerden tamamen farklıdır. Yanlış ajan dakikalar içinde ölüme yol açar.`,
      choices: [
        { label: 'İzofloran inhalasyon anestezisi — maske indüksiyon', nextNodeId: 'c2_dogru_anestezi', effects: { budgetDelta: -300 } },
        { label: 'Ketamin IM 10 mg/kg — yaygın kullanılıyor', nextNodeId: 'c2_ketamin_olum', effects: { hrDelta: +50, respDelta: -18, budgetDelta: -80 } },
        { label: 'Propofol IV 6 mg/kg — titrasyon kolayı', nextNodeId: 'c2_propofol_olum', effects: { hrDelta: -60, respDelta: -22, budgetDelta: -100 } },
        { label: 'Anestezisiz ovosentez — lokal + minimal stres', nextNodeId: 'c2_lokal_anestezi', effects: { budgetDelta: -50 } },
      ],
    },

    c2_ketamin_olum: {
      id: 'c2_ketamin_olum', type: 'death',
      text: `Ketamin uygulandı.\n\n📋 Klinik Not:\nKetamin kuşlarda uzun süreli konvülsif iyileşmeye, solunumu baskılayan kas rijiditesine ve kardiyak aritmilere yol açar. 10 mg/kg dozu Sultan Papağanı için aşırı yüksektir.\n\n5 dakika içinde:\n• Tonik-klonik konvülziyon\n• Solunum arresti\n• Resüsitasyon başarısız\n\n💀 ÖLÜM NEDENİ: Ketamin nörotoksisitesi + solunum baskılanması → Respiratuar arrest\n\nDOĞRU YAKLAŞIM: Kuşlarda ALTIN STANDART anestezi İZOFLORAN inhalasyondur.`,
    },

    c2_propofol_olum: {
      id: 'c2_propofol_olum', type: 'death',
      text: `Propofol IV verildi.\n\n📋 Klinik Not:\nPropofol kuşlarda derin kardiyovasküler depresyona yol açar. Kanatlıların kardiyak rezervi son derece sınırlıdır — 6 mg/kg doz memelilerde standart olsa da kuşlarda ölümcüldür.\n\n2 dakika içinde:\n• Kalp ritmi: 80 bpm (normal 280+)\n• Periferik damar direnci sıfıra yakın → Derin hipotansiyon\n• Solunum durması\n\n💀 ÖLÜM NEDENİ: Propofol kaynaklı kardiyovasküler kollaps → Kardiyak arrest\n\nDOĞRU YAKLAŞIM: Kuşlarda IV anestezi son derece risklidir. İnhalasyon anestezisi (izofloran) tercih edilmelidir.`,
    },

    c2_lokal_anestezi: {
      id: 'c2_lokal_anestezi', type: 'normal',
      text: `Lokal anestezi + minimal stres pozisyonu ile ovosentez uygulandı.\n\nYumurta iğne ile aspire edildi, kabuk çöktü. Hasta herhangi bir komplikasyon yaşamadan prosedürü atlattı.\n\nBu yaklaşım stabilize edilmiş, göreceli olarak dengeli hastalarda uygulanabilir.`,
      choices: [
        { label: 'İyileşmeyi takip et, taburcu protokolü başlat', nextNodeId: 'c2_iyilesme', effects: { hrDelta: -40, tempDelta: +0.5, respDelta: -10, budgetDelta: +200, repDelta: +0.1 } },
      ],
    },

    c2_dogru_anestezi: {
      id: 'c2_dogru_anestezi', type: 'normal',
      text: `İzofloran maske indüksiyon uygulandı.\n\nAnestezi derinliği kuşa özgü parametrelerle takip edildi:\n• Korneal refleks\n• Pedal refleks\n• Göz pozisyonu\n\nOvosentez başarıyla tamamlandı. Yumurta bütünlüğü korundu.`,
      choices: [
        { label: 'Anestezi sonrası ısıtma + iyileşme takibi', nextNodeId: 'c2_iyilesme', effects: { hrDelta: -35, tempDelta: +0.8, respDelta: -12, budgetDelta: +100 } },
      ],
    },

    c2_iyilesme: {
      id: 'c2_iyilesme', type: 'normal',
      text: `Mavi ısıtma kutusunda derlenmeye bırakıldı.\n\n2 saat sonra:\n• Kalp ritmi: 290 bpm ✓\n• Sıcaklık: 41.2°C ✓\n• Tünemek istedi — çok iyi işaret\n\nSahibe taburculuk talimatları ve diyet planı verildi.`,
      choices: [
        { label: 'Vakayı kapat', nextNodeId: 'c2_basari', effects: { budgetDelta: +350, repDelta: +0.2 } },
      ],
    },

    c2_basari: {
      id: 'c2_basari', type: 'success',
      text: `🏆 VAKA BAŞARIYLA TAMAMLANDI\n\nYumurta Tıkanması — Tam İyileşme\n\nDoğru adımlar:\n✓ Minimal stres muayene\n✓ Radyografi ile konfirmasyon\n✓ Isıtma + oksijen ile stabilizasyon\n✓ Kalsiyum → bekleme → Oksitosin protokolü\n✓ İzofloran anestezisi\n\n"Kuş hastası, köpek hastasından beş kat dikkat gerektirir." — Dr. Sıla`,
    },

    // ──────────────────────────────────────────────────────────────────────────
    // VAKA 3: FLUTD / Üretra Tıkanıklığı (Scottish Fold, erkek)
    // ──────────────────────────────────────────────────────────────────────────

    c3_giris: {
      id: 'c3_giris', type: 'normal',
      text: `Atlas, 2 yaşında erkek Scottish Fold. Sahip sabahın 3'ünde aradı:\n\n"2 gündür kum kabına giriyor, çok ıkınıyor ama hiç idrar çıkmıyor. Şimdi kusuyur, sürekli bağırıyor. Altına yatamıyor bile."\n\nHızlı muayene:\n• Mesane palpe edildiğinde taş gibi sert ve çok büyük\n• Kaslar gergili — ağrı belirgin\n• Mukozalar soluk-sarımsı (ikterus değil — üremik renk)\n• Kalp ritmi 210 bpm ama ritim düzensiz (EKG alınmalı!)\n\n⚠ ÜRETRA TIKANIKLIĞI — Tedavisiz her saat böbrek hasarını artırır.`,
      choices: [
        { label: 'Acil kan tahlili (BUN, Kreatinin, Elektrolit paneli) + EKG + IV erişim', nextNodeId: 'c3_kan_tahlili', effects: { budgetDelta: -280 } },
        { label: 'Hemen sedasyon ve üretral sonda takımına geç — vakit kaybetme', nextNodeId: 'c3_sonda_direkt', effects: { hrDelta: -20, tempDelta: -0.5, killPatient: true, deathCause: 'Hiperkalemik kardiyak arrest: Potasyum düzeyi kontrol edilmeden anestezi verildi' } },
        { label: 'Ağrı kesici (Meloksikam) ver, sakin olunca muayene et', nextNodeId: 'c3_nsaid_hata', effects: { hrDelta: +15, tempDelta: +0.2, budgetDelta: -40 } },
      ],
    },

    c3_nsaid_hata: {
      id: 'c3_nsaid_hata', type: 'death',
      text: `Meloksikam verildi.\n\n📋 Klinik Not:\nNSAID'lar (meloksikam, karprofen) böbreklerdeki prostaglandin aracılı vazodilatasyon üzerine etki eder. Tıkanan hastada renal kan akışı zaten kısıtlıdır.\n\nMeloksikam renal kan akışını daha da düşürdü → Akut böbrek hasarı hızlandı.\n\nAyrıca K+ zaten 7.2 mEq/L — EKG'de sinüzoidal dalga: kardiyak arrest riski yüksek.\n\n2 saat içinde:\n• Bradikardi → Asistol\n• Böbrek yetmezliği tam yerleşti\n\n💀 ÖLÜM NEDENİ: Böbrek yetmezliğindeki hastada NSAID kullanımı → Renal kan akışı baskılanması + Hiperkalemik kardiyak arrest\n\nDOĞRU YAKLAŞIM: Böbrek yetmezliği şüphesinde NSAID KONTRENDİKE. Ağrı yönetimi için buprenorfin/tramadol tercih edilir.`,
    },

    c3_sonda_direkt: {
      id: 'c3_sonda_direkt', type: 'death',
      text: `Sedasyon verildi ve sonda takma girişimi başlandı.\n\n📋 Klinik Not:\nAtlas'ın potasyum seviyesi ölçülmeden müdahaleye geçildi. Üretra tıkanan hastalarda 48+ saat sonra serum K+ 7–8.5 mEq/L'ye çıkabilir.\n\nSedasyonda kullanılan ajan kardiyak iletimi baskıladı. Halihazırda 7.2 mEq/L olan K+ bu stres altında hücresel pompaları çökürttü.\n\nSonda girişimi sırasında:\n• Sinüs bradikardisi → Ventriküler fibrilasyon\n• Defibrilatör mevcut değil (hayvan kliniği)\n• Resüsitasyon başarısız\n\n💀 ÖLÜM NEDENİ: Kontrol edilemeyen hiperkalemi (K+ 7.2 mEq/L) + sedasyon kaynaklı kardiyak iletim baskılanması → Ventriküler fibrilasyon\n\nDOĞRU YAKLAŞIM: Tıkanan kedide ÖNCE K+ ve BUN/Kreatinin ölç, kardiyoprotektif tedavi başla, SONRA sedasyona geç.`,
    },

    c3_kan_tahlili: {
      id: 'c3_kan_tahlili', type: 'alert',
      text: `Kan sonuçları geldi:\n\n🔴 K+: 7.8 mEq/L → Kritik hiperkalemi (ölüm eşiği: >8.0)\n🔴 BUN: 124 mg/dL → Ağır azotemi\n🔴 Kreatinin: 6.4 mg/dL → Akut böbrek yetmezliği\n🔴 pH: 7.12 → Metabolik asidoz\n\nEKG: Zirve T dalgaları, geniş QRS → Hiperkalemik kardiyak değişiklikler\n\n⚡ K+ 7.8 — kalbi korumak için müdahale edilmezse her an arrest olabilir.\n\nİLK ADIM olarak ne yapıyorsunuz?`,
      choices: [
        { label: 'IV Kalsiyum Glukonat — kardiyak membranı stabilize et, sonra sıvı ve sonda', nextNodeId: 'c3_kalp_koruma', effects: { hrDelta: -30, budgetDelta: -180 } },
        { label: 'Hemen sonda tak, idrar boşalınca K+ kendisi düşer', nextNodeId: 'c3_sonda_erken', effects: { hrDelta: +20, killPatient: true, deathCause: 'K+ 7.8 mEq/L iken kardiyak hazırlık yapılmadan sonda takıldı — prosedür stresi ventriküler fibrilasyonu tetikledi' } },
        { label: 'İnsülin + Dekstroz IV — K+ hücre içine çek', nextNodeId: 'c3_insulin_oncesi', effects: { hrDelta: -10, budgetDelta: -120 } },
        { label: 'Bikarbonat IV — asidozu düzelt, K+ kendisi düşer', nextNodeId: 'c3_bikarbonat', effects: { hrDelta: -5, budgetDelta: -100 } },
      ],
    },

    c3_sonda_erken: {
      id: 'c3_sonda_erken', type: 'death',
      text: `Sonda takma sırasında Atlas bir anda kasıldı.\n\n📋 Klinik Not:\nK+ 7.8 mEq/L seviyesinde kardiyomiyosit membran potansiyeli zaten dengesizdir. Prosedür stresi (ağrı + otonomik aktivasyon) son damlaydı.\n\n• EKG: Sinüzoidal dalgalar → Ventriküler fibrilasyon\n• Resüsitasyon 12 dakika sürdü\n• Spontan dolaşım geri dönmedi\n\n💀 ÖLÜM NEDENİ: Tedavisiz hiperkalemi (K+ 7.8) + prosedürel stres → Ventriküler fibrilasyon\n\nDOĞRU YAKLAŞIM: Kardiyak stabilizasyon (Ca++ IV) olmadan K+ >7.0 hastada HİÇBİR invasif işlem yapılmaz.`,
    },

    c3_insulin_oncesi: {
      id: 'c3_insulin_oncesi', type: 'alert',
      text: `İnsülin + Dekstroz protokolü: K+'yu hücre içine çeker, geçici ama etkilidir.\n\nAncak bir sorun var: Kalsiyum vermeden insülin verdiniz.\n\nİnsülin-dekstroz K+'u düşürür ama kardiyak membranı stabilize etmez. Atlas'ın EKG'si hâlâ anormal.\n\n30 dakika sonra K+: 6.4 mEq/L ↓ — iyileşiyor ama kalp hâlâ risk altında.`,
      choices: [
        { label: 'Şimdi Kalsiyum Glukonat IV ekle, ardından sonda protokolüne geç', nextNodeId: 'c3_kalp_koruma', effects: { hrDelta: -20, budgetDelta: -120 } },
        { label: 'K+ düştü, yeterli — hemen sondaya geç', nextNodeId: 'c3_sonda_erken', effects: { hrDelta: +15, killPatient: true, deathCause: 'K+ düşmüş görünse de kardiyak membran hâlâ instabil — sonda stresi fibrilasyonu tetikledi' } },
      ],
    },

    c3_bikarbonat: {
      id: 'c3_bikarbonat', type: 'alert',
      text: `IV Bikarbonat verildi.\n\nBikarbonat, asidozu düzelterek K+'un hücre içine geçişini kolaylaştırır. pH: 7.12 → 7.24 yükseldi.\n\nK+ 7.8 → 7.1 mEq/L ↓ — kısmen iyileşti.\n\nAncak kardiyak membran hâlâ stabilize edilmedi. EKG'de T dalgaları devam ediyor.`,
      choices: [
        { label: 'Kalsiyum Glukonat IV ekle, kardiyak korumayı tamamla', nextNodeId: 'c3_kalp_koruma', effects: { hrDelta: -20, budgetDelta: -100 } },
        { label: 'pH düzeldi, K+ kabul edilebilir — sondaya geç', nextNodeId: 'c3_sonda_erken', effects: { hrDelta: +10, killPatient: true, deathCause: 'K+ 7.1 mEq/L iken kardiyak membran stabilizasyonu yapılmadan sonda takıldı — arrest gelişti' } },
      ],
    },

    c3_kalp_koruma: {
      id: 'c3_kalp_koruma', type: 'normal',
      text: `IV Kalsiyum Glukonat %10 — 0.5 mL/kg yavaş IV push\n\nKalsiyum kardiyak membranı stabilize eder — EKG normalleşmeye başladı:\n• T dalgaları küçüldü\n• QRS genişliği azaldı\n• Ritim düzenlendi\n\nK+ etkisi devam ediyor: 7.8 → 6.6 mEq/L\n\nSıradaki adım:`,
      choices: [
        { label: 'IV Laktatlı Ringer — diürez başlat, K+\'yu seyrelt + sonda protokolü', nextNodeId: 'c3_sivi_sonda', effects: { hrDelta: -25, tempDelta: -0.2, budgetDelta: -250 } },
        { label: 'Furosemid IV — hızlı diürez yap, K+ hızla düşsün', nextNodeId: 'c3_furosemid_hata', effects: { hrDelta: -10, budgetDelta: -80 } },
      ],
    },

    c3_furosemid_hata: {
      id: 'c3_furosemid_hata', type: 'death',
      text: `Furosemid IV verildi.\n\n📋 Klinik Not:\nFurosemid loop diüretiğidir ve idrar üretimini artırarak K+'yu atmayı hedefler. ANCAK:\n\nÜretra tıkanan hastada idrar sisteme giremiyor — furosemid böbrekleri daha fazla çalıştırdı, mesaneden boşalma sağlanamadı.\n\nEk sorun: Furosemid içinde zaten azalmış olan tübüler kan akışını daha da baskıladı.\n\n• Akut tübüler nekroz hızlandı\n• 4 saat içinde oligüri → anüri\n• BUN: 248 mg/dL → Üremik koma\n\n💀 ÖLÜM NEDENİ: Tıkalı üretrada furosemid kullanımı → İlerlemiş akut böbrek nekrozu → Üremik koma\n\nDOĞRU YAKLAŞIM: Mekanik tıkanıklıkta diüretik vermek KONTRENDIKE. Tıkanıklığı gider, sıvı ver.`,
    },

    c3_sivi_sonda: {
      id: 'c3_sivi_sonda', type: 'normal',
      text: `IV sıvı başlandı. Sedasyon protokolü:\n\n💊 Buprenorfin 0.02 mg/kg IV (opioid — kardiyak etkisi minimal)\n💊 Midazolam 0.2 mg/kg IV (sedasyon — kardiyak güvenli)\n\nAtlas sakinleşti. Üretral sonda takıldı.\n\n"POP" — siyah-kahve idrarda kan ve mukus çıktı.\n\n50 mL birikmiş idrar boşaldı. Mesane serbestleşti.\n\nK+ 1 saat sonra: 5.2 mEq/L ✓\nBUN: düşüş başladı\n\nTedavi planı seçin:`,
      choices: [
        { label: 'Sonda sabitlenmiş halde gözlemde tut + IV sıvı 48 saat + diyet değişikliği', nextNodeId: 'c3_dogru_tedavi', effects: { hrDelta: -40, tempDelta: -0.3, respDelta: -12, budgetDelta: -400 } },
        { label: 'Tıkanıklık açıldı, sondayı hemen çek — stres oluşturmasın', nextNodeId: 'c3_erken_sonda_cekme', effects: { hrDelta: +30, tempDelta: +0.5 } },
      ],
    },

    c3_erken_sonda_cekme: {
      id: 'c3_erken_sonda_cekme', type: 'alert',
      text: `Sonda erken çekildi.\n\n6 saat sonra Atlas yine ıkınıyor. Üretra tekrar tıkandı.\n\nMukoza ödemi henüz geçmemişti — en az 48 saat sonda kalmalıydı.\n\nAcil müdahale tekrarlandı. Hasta ek stresin üstüne girdi, itibar azaldı.`,
      choices: [
        { label: 'Sondayı yeniden tak, 48 saat protokolüne devam et', nextNodeId: 'c3_dogru_tedavi', effects: { hrDelta: -15, budgetDelta: -300, repDelta: -0.2 } },
      ],
    },

    c3_dogru_tedavi: {
      id: 'c3_dogru_tedavi', type: 'normal',
      text: `Atlas 48 saat gözlemde tutuldu.\n\nSon kontroller:\n• K+: 4.1 mEq/L ✓\n• BUN: 38 mg/dL ↓ (normale yaklaşıyor)\n• Kreatinin: 1.8 mg/dL ↓\n• pH: 7.38 ✓\n• İdrar akışı serbest ve yeterli\n\nSonda çıkarıldı. Atlas 4 saat gözlemlendi — spontan idrar yaptı.\n\nSahibe taburculuk talimatları:`,
      choices: [
        { label: 'Özel idrar yolu diyeti + bol su + aylık kontrol + kastrasyon önerisi', nextNodeId: 'c3_basari', effects: { budgetDelta: +700, repDelta: +0.25 } },
      ],
    },

    c3_basari: {
      id: 'c3_basari', type: 'success',
      text: `🏆 VAKA BAŞARIYLA TAMAMLANDI\n\nFLUTD / Üretra Tıkanıklığı — Tam İyileşme\n\nDoğru adımlar:\n✓ Acil elektrolit + böbrek fonksiyon testi\n✓ EKG ile kardiyak değerlendirme\n✓ Kalsiyum Glukonat IV — kardiyak stabilizasyon\n✓ Güvenli sedasyon (buprenorfin + midazolam)\n✓ Üretral sonda + 48 saat gözlem\n✓ Böbrek dostu diyet + uzun vadeli plan\n\n"Tıkanan kedi her şeyi söylüyor — dinlemeyi bil." — Dr. Sıla`,
    },

    // ──────────────────────────────────────────────────────────────────────────
    // VAKA 4: GDV — Mide Dönmesi (Alman Çoban Köpeği)
    // ──────────────────────────────────────────────────────────────────────────

    c4_giris: {
      id: 'c4_giris', type: 'normal',
      text: `Ares, 5 yaşında 38 kg'lık Alman Çoban Köpeği. Derin göğüslü, yemekten hemen sonra egzersiz yapmış.\n\nSahip: "Yemekten 30 dakika sonra karını görünce dondum — balonlanmış gibi. Öğürüyor ama hiçbir şey çıkmıyor. Yerde dolaşıp duruyor, oturamıyor."\n\nFizik muayene:\n• Karın tipan sesi (tef gibi) — sağda tympani yüksek\n• Karın belirgin distansiyon\n• Zayıf, hızlı nabız\n• Mukoza membranlar beyazımsı\n\n⚠ KIRMIZI ALARMI: Bu tablo GDV (Gastrik Dilatasyon-Volvolüs) ile uyumlu. ÖLÜMCÜL ACİL.`,
      choices: [
        { label: 'Hemen IV erişim aç + kan basıncı + şok sıvısı başla + radyografi çek', nextNodeId: 'c4_stabilizasyon', effects: { budgetDelta: -320, hrDelta: -10 } },
        { label: 'Direkt anestezi ve ameliyata al — her dakika önemli', nextNodeId: 'c4_anestezi_erken', effects: { killPatient: true, deathCause: 'Dekompresyon yapılmadan anestezi verildi — mide basıncı vena cavayı bastırdı, kardiyak output sıfıra indi' } },
        { label: 'Önce radyografi, kesin tanı sonra hareket et', nextNodeId: 'c4_rontgen_once', effects: { hrDelta: +20, tempDelta: +0.3, budgetDelta: -80 } },
      ],
    },

    c4_anestezi_erken: {
      id: 'c4_anestezi_erken', type: 'death',
      text: `Anestezi verildi.\n\n📋 Klinik Not:\nGDV'de şişmiş mide vena cava inferior'u doğrudan sıkıştırır. Venöz dönüş zaten %40–60 azalmış durumdadır.\n\nAnestezi ajanları periferal vasküler direnci düşürür. Bu iki etki üst üste gelince:\n\n• Kardiyak output sıfıra yaklaştı\n• Sistemik arteriyel basınç: 30/10 mmHg → Dolaşım kollapsı\n• EKG: Sinüs bradikardisi → PEA → Asistol\n\n💀 ÖLÜM NEDENİ: Mide dekompresyonu yapılmadan genel anestezi → Vena cava basısı + vazodilatasyon → İrreversible kardiyovasküler kollaps\n\nDOĞRU YAKLAŞIM: GDV'de ANESTEZİ ÖNCESİ mutlaka mide dekompresyonu (gastrik tüp veya trokar) + agresif sıvı resüsitasyonu yapılmalıdır.`,
    },

    c4_rontgen_once: {
      id: 'c4_rontgen_once', type: 'alert',
      text: `Radyografi çekildi.\n\nBekleme sırasında hasta daha da kötüleşti:\n• Kalp ritmi 148 → 168 bpm\n• Mukoza membranlar tamamen beyaz\n• Periferik nabız kaybolmaya başladı\n\n⚠ GDV'de radyografi konfirmasyonu için zaman kaybetmek hayatını riske atar. Klinik bulgular yeterliydi.\n\nRadyografi sonucu: "Ters C işareti" görünümü — GDV konfirme.\n\nAma değerli zaman harcandı.`,
      choices: [
        { label: 'Hemen IV erişim + şok sıvısı + gastrik dekompresyon', nextNodeId: 'c4_stabilizasyon', effects: { hrDelta: +15, repDelta: -0.15, budgetDelta: -320 } },
      ],
    },

    c4_stabilizasyon: {
      id: 'c4_stabilizasyon', type: 'normal',
      text: `Resüsitasyon başlatıldı:\n\n💉 IV kristaloid — 90 mL/kg/30 dk (şok dozu)\n💉 IV koloid (Hetastarch) — 5 mL/kg\n💊 Opioid analjezi — butorfanol 0.4 mg/kg\n\n20 dakika sonra:\n• Tansiyon: 85/50 mmHg (iyileşiyor)\n• Mukozalar hafif pembeleşti\n\nGastrik dekompresyon gerekiyor. Hangi yöntemi seçiyorsunuz?`,
      choices: [
        { label: 'Orogastrik tüp — ağızdan mideye geç, gazı boşalt', nextNodeId: 'c4_tup_basarili', effects: { hrDelta: -20, respDelta: -8, budgetDelta: -150 } },
        { label: 'Perkutan trokar — karın duvarından iğne ile gaz boşalt', nextNodeId: 'c4_trokar', effects: { hrDelta: -15, budgetDelta: -80 } },
        { label: 'Sıvı yeterli, anestezi artık güvenli — direkt cerrahiye al', nextNodeId: 'c4_anestezi_erken_2', effects: { killPatient: true, deathCause: 'Mide hâlâ tam dolu ve distanse — anestezi sırasında vena cava basısı devam etti, kardiyak arrest' } },
      ],
    },

    c4_anestezi_erken_2: {
      id: 'c4_anestezi_erken_2', type: 'death',
      text: `Anestezi başlandı. Mide dekompresyonu yapılmamıştı.\n\nSıvı resüsitasyonu kısmi düzelme sağlamıştı ama mide hâlâ maksimum distansiyondaydı. Anestezi ile birlikte kardiyak output tekrar çöktü.\n\n💀 ÖLÜM NEDENİ: Yeterli gastrik dekompresyon yapılmadan anestezi → Vena cava basısı + vazodilatasyon → Kardiyak arrest\n\nDOĞRU YAKLAŞIM: Ameliyat odasına girmeden ÖNCE mide mutlaka dekomprese edilmelidir.`,
    },

    c4_trokar: {
      id: 'c4_trokar', type: 'normal',
      text: `Perkutan trokar uygulandı — karın sağ tarafından iğne girişiyle gaz boşaltıldı.\n\nİşe yaradı ama sınırlı: Sadece serbest gaz çıktı, mide içeriği kaldı.\n\nKarın distansiyonu kısmen azaldı.\n• Tansiyon yükseldi: 100/65 mmHg\n• Kalp ritmi: 130 bpm\n\nAnestezi için daha güvenli ama ideal değil. Orogastrik tüp hâlâ önerilir.`,
      choices: [
        { label: 'Şimdi orogastrik tüp ile tam dekompresyon, ardından cerrahi', nextNodeId: 'c4_cerrahi_hazir', effects: { hrDelta: -15, budgetDelta: -120 } },
        { label: 'Trokar yeterli — anestezi başlat, cerrahiye al', nextNodeId: 'c4_cerrahi_hazir', effects: { hrDelta: -10, budgetDelta: -50 } },
      ],
    },

    c4_tup_basarili: {
      id: 'c4_tup_basarili', type: 'normal',
      text: `Orogastrik tüp yerleştirildi.\n\n"Fssssss" — büyük miktarda gaz boşaldı. Ardından sıvı mide içeriği.\n\nKarın distansiyonu belirgin azaldı:\n• Tansiyon: 105/70 mmHg ✓\n• Kalp ritmi: 118 bpm ↓\n• Mukozalar pembe\n\nMide repoze mi edildi (döndü mü) kontrol edilemez — cerrahi şart.`,
      choices: [
        { label: 'Anestezi protokolü + cerrahi hazırlık başlat', nextNodeId: 'c4_cerrahi_hazir', effects: { hrDelta: -10, budgetDelta: -200 } },
      ],
    },

    c4_cerrahi_hazir: {
      id: 'c4_cerrahi_hazir', type: 'normal',
      text: `Cerrahi anestezi — GDV protokolü:\n\n💊 Fentanil 5 mcg/kg IV (premedikasyon)\n💊 Propofol 4 mg/kg IV (indüksiyon)\n💨 İzofloran — idame\n\nKarın açıldı. Bulgular:\n• Mide 270° saat yönünde dönmüş\n• Dalak mideye yapışık — hafif iskemi\n• Mide duvarı rengi: koyu kırmızı bölgeler var\n\nNe yapıyorsunuz?`,
      choices: [
        { label: 'Mideyi anatomik pozisyona getir + nekrotik alanları değerlendir + gastropeksi', nextNodeId: 'c4_dogru_cerrahi', effects: { hrDelta: -20, budgetDelta: -800, repDelta: +0.1 } },
        { label: 'Mideyi döndür, hepsi iyi görünüyor — gastropeksi gerekmiyor', nextNodeId: 'c4_gastropeksi_yok', effects: { hrDelta: -15, budgetDelta: -500 } },
        { label: 'Nekrotik görünen tüm mide duvarını hemen çıkar', nextNodeId: 'c4_agresif_rezeksiyon', effects: { hrDelta: +20, budgetDelta: -1200, repDelta: -0.1 } },
      ],
    },

    c4_gastropeksi_yok: {
      id: 'c4_gastropeksi_yok', type: 'alert',
      text: `Operasyon tamamlandı, gastropeksi yapılmadı.\n\n⚠ 3 gün sonra Ares tekrar getirildi: Aynı semptomlar.\n\nGDV'de gastropeksi yapılmayan hastalarda tekrarlama oranı %75–80'dir. Prophylaktik gastropeksi standart prosedürdür.\n\nAcil ikinci ameliyat gerekti. Sahip çok sinirli. İtibar ciddi zarar gördü.`,
      choices: [
        { label: 'İkinci ameliyatta gastropeksi yap', nextNodeId: 'c4_dogru_cerrahi', effects: { hrDelta: -10, budgetDelta: -900, repDelta: -0.25 } },
      ],
    },

    c4_agresif_rezeksiyon: {
      id: 'c4_agresif_rezeksiyon', type: 'alert',
      text: `Mide duvarının büyük bölümü çıkarıldı.\n\nSonradan belli oldu: Koyu renkli alanların çoğu hipoperfüzyon sonucu geçici renk değişikliğiydi, gerçek nekroz değildi. Reperfüzyonla geri dönürdü.\n\nGereksiz rezeksiyon → Kısa bağırsak sendromu → Beslenme sorunları\n\nAres yaşıyor ama uzun vadeli malabsorpsiyon riski taşıyor.`,
      choices: [
        { label: 'Gastropeksi ekle, ameliyatı tamamla', nextNodeId: 'c4_dogru_cerrahi', effects: { hrDelta: -10, budgetDelta: -400, repDelta: -0.15 } },
      ],
    },

    c4_dogru_cerrahi: {
      id: 'c4_dogru_cerrahi', type: 'normal',
      text: `Gastropeksi tamamlandı:\n\n✓ Mide anatomik pozisyona alındı\n✓ İskemik alanlar değerlendirildi (reperfüzyon beklendi)\n✓ Profilaktik gastropeksi — mide ön duvarı karın duvarına sütüre edildi\n✓ Dalak gözlemlendi — kanlanma normale döndü\n\nPostop yoğun bakım:\n• EKG monitörizasyon (GDV sonrası 24-48 saat aritmik dönem)\n• IV sıvı devam\n• Oral beslemeye 24 saat sonra başlandı\n\n48 saat sonra Ares ayağa kalktı.`,
      choices: [
        { label: 'Vakayı kapat ve taburculuk planla', nextNodeId: 'c4_basari', effects: { budgetDelta: +1200, repDelta: +0.3 } },
      ],
    },

    c4_basari: {
      id: 'c4_basari', type: 'success',
      text: `🏆 VAKA BAŞARIYLA TAMAMLANDI\n\nGDV / Gastrik Dilatasyon-Volvolüs — Hayat Kurtarıldı\n\nDoğru adımlar:\n✓ Klinik bulgularla hızlı GDV şüphesi\n✓ Agresif IV resüsitasyon — mide dekompresyonundan ÖNCE\n✓ Orogastrik tüp ile gastrik dekompresyon\n✓ GDV-güvenli anestezi protokolü\n✓ Gastropeksi — rekürrans önlemi\n\n"GDV'de her dakika = daha fazla nekroz = daha yüksek ölüm riski." — Dr. Sıla`,
    },

    // ──────────────────────────────────────────────────────────────────────────
    // VAKA 5: Muhabbet Kuşu — Megabakteri / Bakteriyel Enfeksiyon
    // ──────────────────────────────────────────────────────────────────────────

    c5_giris: {
      id: 'c5_giris', type: 'normal',
      text: `Sarı, 1 yaşında erkek Muhabbet Kuşu. Küçük bir kutu içinde getirildi.\n\nSahip: "3 gündür uyuyor. Normalde çok konuşkan, ama şimdi tüylerini kabarık tutup gözlerini yumup duruyor. Dışkısı yeşil ve sulu."\n\nGözlem — KUTUYU AÇMADAN önce:\n• Tüyler kabarık (kritik bulgu — hipotermi veya ağır hastalık)\n• Gözler yarı kapalı — ağır letarji\n• Kafes tabanında dışkı: Yeşil + sulu + az katı kısım\n• Solunum hafif güçleşmiş\n\nVitaller (minimal stres ile alındı):\n• Kalp: 295 bpm (hipoperfüzyon taşikardisi)\n• Isı: 39.8°C (normal sınırda ama tüyler kabartılıyorsa bu yanıltıcı)\n• Solunum: 52/dk (taşipne)\n\nNasıl devam edersiniz?`,
      choices: [
        { label: 'Önce stabilizasyon: ısıtma (32°C) + oksijen + sonra tam muayene', nextNodeId: 'c5_stabil', effects: { hrDelta: -20, tempDelta: +0.3, respDelta: -8, budgetDelta: -80 } },
        { label: 'Hemen tutup tam fizik muayene yap — ne olduğunu anlamalıyız', nextNodeId: 'c5_erken_muayene', effects: { hrDelta: +80, tempDelta: -0.5, killPatient: true, deathCause: 'Strese bağlı kardiyak arrest: Zayıf Muhabbet Kuşu tutulma stresiyle kardiyovasküler rezervini tüketti' } },
        { label: 'Geniş spektrum antibiyotik başla, ne olduğunu sormaya gerek yok', nextNodeId: 'c5_kör_antibiyotik', effects: { budgetDelta: -60 } },
      ],
    },

    c5_erken_muayene: {
      id: 'c5_erken_muayene', type: 'death',
      text: `Sarı tutularak muayene başlandı.\n\n📋 Klinik Not:\n32 gram ağırlığındaki hasta 3 gündür hasta ve enerji rezervleri tükenmiş. Bu boyuttaki bir kuşta kardiyak reserv sadece dakikalar içinde bitebilir.\n\nTutulmanın üçüncü saniyesinde:\n• Kanatlar çırpmayı bıraktı\n• Gözler kapandı\n• Nabız alınamıyor\n\nResüsitasyon: Muhabbet Kuşu'nda kardiyak masaj uygulanamaz (anatomik imkânsızlık), şırınga ile ağız-burun resüsitasyonu denendi — başarısız.\n\n💀 ÖLÜM NEDENİ: Kritik hastada prematüre fiziksel muayene → Katekolamin artışı → Ani kardiyak arrest\n\nDOĞRU YAKLAŞIM: Kritik kuş hastasında ÖNCE stabilizasyon, SONRA muayene. Her işlem minimum stres koşullarında yapılır.`,
    },

    c5_kör_antibiyotik: {
      id: 'c5_kör_antibiyotik', type: 'alert',
      text: `Tanı koymadan Enrofloksasin başlandı.\n\nMuhabbet Kuşlarında yeşil dışkının 5 temel nedeni vardır:\n• Megabakteri (AGY — Avian Gastric Yeast) → Antifungal gerekir\n• Gram-negatif bakteriyel → Antibiyotik uygun\n• Viral (Cirkovirus, PBFD) → Antibiyotiğe yanıtsız\n• Karaciğer hastalığı → Antibiyotik yetmez\n• Ağır metal zehirlenmesi (kurşun, çinko) → Şelasyon gerekir\n\nEnrofloksasin başlandı ama Sarı Megabakteri taşıyıcısı — mantar ilacı olmadan yanıt vermeyecek.\n\n2 gün sonra daha da kötüleşti.`,
      choices: [
        { label: 'Dışkı sitolojisi + Gram boyama + kursak muayenesi yap', nextNodeId: 'c5_tani', effects: { hrDelta: +10, budgetDelta: -120, repDelta: -0.1 } },
      ],
    },

    c5_stabil: {
      id: 'c5_stabil', type: 'normal',
      text: `Sarı ısıtma kutusuna (32°C, %60 nem) alındı. Oksijen (%35) verildi.\n\n45 dakika sonra:\n• Gözlerini açtı\n• Tüyleri hafif düzeldi\n• Solunum: 40/dk ↓\n\nArtık minimal stres muayenesi mümkün. Tanı adımları:`,
      choices: [
        { label: 'Dışkı sitolojisi + Gram boyama + kursak palpasyonu (kısa, nazik)', nextNodeId: 'c5_tani', effects: { budgetDelta: -150, hrDelta: -10 } },
        { label: 'Hemen geniş spektrum antibiyotik + antifungal birlikte başla', nextNodeId: 'c5_ikili_baslama', effects: { budgetDelta: -180 } },
      ],
    },

    c5_ikili_baslama: {
      id: 'c5_ikili_baslama', type: 'alert',
      text: `Enrofloksasin + Amfoterisin B birlikte başlandı.\n\n⚠ İlaç Etkileşimi:\nAmfoterisin B nefrotoksik bir antifungaldir. Enrofloksasin de hafif nefrotoksik etkilidir. Bu küçük hastada kombine kullanım böbrek hasarı riskini artırıyor.\n\nAyrıca Amfoterisin B kuşlarda oral biyoyararlanımı çok düşük — sistematik fungal enfeksiyonda IV gerekir.\n\nSarı kısmen yanıt verdi ama 48 saat sonra iştah yok, dışkı hâlâ anormal.\n\nSitoloji yapılmadan ampirik tedavi yetersiz kaldı.`,
      choices: [
        { label: 'Dışkı sitolojisi ile tanıyı netleştir, tedaviyi düzenle', nextNodeId: 'c5_tani', effects: { hrDelta: +5, budgetDelta: -120, repDelta: -0.1 } },
      ],
    },

    c5_tani: {
      id: 'c5_tani', type: 'alert',
      text: `Dışkı sitolojisi ve Gram boyama sonuçları:\n\n🔬 Bulgu: Dışkıda yoğun mantar sporları — boyutu ve morfolojisi Macrorhabdus ornithogaster (Megabakteri / AGY) ile uyumlu\n\nAyrıca dışkıda az miktarda gram-negatif çomak — sekonder bakteriyel komponent mevcut\n\nKursak palpasyonu: Şiş ve dolgun — kursak içeriği boşalmıyor\n\n📋 Tanı: Megabakteri enfeksiyonu + sekonder gram-negatif enfeksiyon\n\nTedavi protokolü seçin:`,
      choices: [
        { label: 'Amfoterisin B kursağa direkt (oral — kuşlara has protokol) + Enrofloksasin (düşük doz)', nextNodeId: 'c5_dogru_tedavi', effects: { hrDelta: -15, tempDelta: -0.2, respDelta: -8, budgetDelta: -280 } },
        { label: 'Flukonazol oral + Enrofloksasin tam doz (20 mg/kg)', nextNodeId: 'c5_enro_yüksek_doz', effects: { hrDelta: +10, budgetDelta: -220 } },
        { label: 'Sadece Enrofloksasin — bakteriyeli kes, mantar kendi geçer', nextNodeId: 'c5_mantar_ihmal', effects: { hrDelta: +20, budgetDelta: -120 } },
        { label: 'Nystatin oral + Trimetoprim-Sulfa — yaygın kuş reçetesi', nextNodeId: 'c5_nystatin_hata', effects: { hrDelta: +5, budgetDelta: -180 } },
      ],
    },

    c5_enro_yüksek_doz: {
      id: 'c5_enro_yüksek_doz', type: 'death',
      text: `Enrofloksasin 20 mg/kg verildi.\n\n📋 Klinik Not:\nMuhabbet Kuşlarında enrofloksasin dozu 5-10 mg/kg önerilen aralıktır. 20 mg/kg yoğun nörotoksisiteye yol açar.\n\nBu küçük hastada (32 g) ilaç konsantrasyonu hızla toksik seviyeye ulaştı:\n\n• 6 saat sonra: Koordinasyon kaybı, başını tutamıyor\n• Konvülsif hareketler\n• Solunum arresti\n\n💀 ÖLÜM NEDENİ: Enrofloksasin doz aşımı (20 mg/kg) → Nörotoksisite → Solunum arresti\n\nDOĞRU YAKLAŞIM: Kuşlarda ilaç dozu mg/kg değil, GRAM cinsinden hesaplanır. 32 gramlık kuş için mikrogram hassasiyeti şarttır.`,
    },

    c5_mantar_ihmal: {
      id: 'c5_mantar_ihmal', type: 'death',
      text: `Sadece antibiyotik verildi, antifungal başlanmadı.\n\nMegabakteri kursak duvarını istila etmeye devam etti:\n\n• Kursak motilitesi tamamen durdu\n• Besinler sindirilemiyor — Sarı açlıktan ölüyor\n• 5 gün sonra: Ağırlık 32 g → 21 g\n• Hipoglisemi → Nöbet → Kardiyak arrest\n\n💀 ÖLÜM NEDENİ: Tanı konulmuş Megabakteri enfeksiyonunda antifungal tedavi yapılmaması → Progresif kursak yetmezliği → Ağır malnütrisyon → Hipoglisemik arrest\n\nDOĞRU YAKLAŞIM: AGY (Megabakteri) etken mantardır, antibiyotiğe yanıt vermez. Spesifik antifungal (Amfoterisin B kursak içi) zorunludur.`,
    },

    c5_nystatin_hata: {
      id: 'c5_nystatin_hata', type: 'alert',
      text: `Nystatin + Trimetoprim-Sulfa başlandı.\n\n⚠ Klinik Not:\nNystatin, Candida türlerine karşı etkilidir. Ancak Macrorhabdus ornithogaster (Megabakteri) Nystatin'e doğal olarak dirençlidir — 20 yıldır yanlış kullanılan bir protokol.\n\nTrimetoprim-Sulfa ise bazı gram-negatiflere karşı etkili olsa da, Sarı'da tespit edilen gram-negatif suş muhtemelen dirençli.\n\nHasta yanıt vermedi. 3 gün sonra daha da kötüleşti.`,
      choices: [
        { label: 'Amfoterisin B direkt kursak içi protokolüne geç', nextNodeId: 'c5_dogru_tedavi', effects: { hrDelta: +15, budgetDelta: -280, repDelta: -0.1 } },
      ],
    },

    c5_dogru_tedavi: {
      id: 'c5_dogru_tedavi', type: 'normal',
      text: `Tedavi protokolü:\n\n💊 Amfoterisin B — kursağa direkt oral uygulama (q12h, 14 gün)\n💊 Enrofloksasin — 7.5 mg/kg PO q12h (düşük-güvenli doz)\n🌡 Isı desteği devam (30°C kuluçka kutusu)\n🥣 Kolay sindirilebilir kursak diyeti\n\n5. günde:\n• Dışkı rengi normale dönüyor (sarı-kahve)\n• Kursak palpasyonunda dolgunluk azaldı\n• Sarı seslenmeye başladı\n\n10. günde:\n• Dışkı sitolojisi: Mantar sporları negatif\n• İştah normale döndü\n• Ağırlık: 34 g (başlangıç 32 g)',`,
      choices: [
        { label: 'Tedaviyi tamamla ve taburcu et', nextNodeId: 'c5_basari', effects: { hrSet: 290, tempSet: 41.0, respSet: 38, budgetDelta: +300, repDelta: +0.2 } },
      ],
    },

    c5_basari: {
      id: 'c5_basari', type: 'success',
      text: `🏆 VAKA BAŞARIYLA TAMAMLANDI\n\nMegabakteri Enfeksiyonu — Tam İyileşme\n\nDoğru adımlar:\n✓ Önce stabilizasyon, sonra muayene\n✓ Dışkı sitolojisi ile kesin tanı\n✓ Megabakteri'ye spesifik Amfoterisin B (kursak içi)\n✓ Güvenli doz enrofloksasin (7.5 mg/kg — toksik doz değil)\n✓ Isı desteği ve diyet yönetimi\n\n"Küçük hasta, büyük dikkat ister. Gram başına doz hesapla." — Dr. Sıla`,
    },

  }; // NODES sonu

  // ─── Yardımcı: node getir ──────────────────────────────────────────────────
  function getNode(id) {
    return NODES[id] || null;
  }

  // ─── Yardımcı: rastgele vaka ──────────────────────────────────────────────
  let _lastCaseIndex = -1;

  function getRandomCase() {
    let idx;
    do {
      idx = Math.floor(Math.random() * ALL_CASES.length);
    } while (idx === _lastCaseIndex && ALL_CASES.length > 1);
    _lastCaseIndex = idx;
    return ALL_CASES[idx];
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  return { getNode, getRandomCase };

})();
