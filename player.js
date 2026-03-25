/**
 * player.js — Sıla'nın Kliniği · Karakter & Klinik Durumu
 *
 * Bu dosya oyunun tüm "state"ini tutar.
 * engine.js bu dosyadaki Player nesnesini çağırarak
 * vitalleri, bütçeyi ve itibarı okur/günceller.
 */

'use strict';

const Player = (() => {

  // ─── Tür başına normal vital aralıkları ───────────────────────────────────
  const SPECIES_NORMS = {
    cat:  { hrMin: 120, hrMax: 140, tempMin: 38.1, tempMax: 39.2, respMin: 20, respMax: 30 },
    dog:  { hrMin:  60, hrMax: 120, tempMin: 38.0, tempMax: 39.5, respMin: 15, respMax: 30 },
    bird: { hrMin: 250, hrMax: 350, tempMin: 40.0, tempMax: 42.0, respMin: 25, respMax: 40 },
  };

  // ─── Ölümcül sınırlar (tüm türler için genel) ────────────────────────────
  const DEATH_LIMITS = {
    hrMin:   0,    // kalp durması
    hrMax:   400,  // ventriküler fibrilasyon
    tempMin: 34.0, // hipotermik şok
    tempMax: 43.5, // hipertermik koma
    respMin: 0,    // apne
    respMax: 80,   // hiperventilasyon krizi
  };

  // ─── Klinik istatistikleri ────────────────────────────────────────────────
  let clinicStats = {
    budget:     12400,
    reputation: 4.8,
    totalCases: 0,
    wins:       0,
    losses:     0,
  };

  // ─── Hasta anlık durumu ───────────────────────────────────────────────────
  let currentPatient = {
    species:   null,   // 'cat' | 'dog' | 'bird'
    name:      null,
    age:       null,
    weight:    null,
    complaint: null,
    vitals: {
      heartRate:   0,
      temperature: 0,
      respiration: 0,
      hrNormal:    { min: 60, max: 140 },
    },
    isDead: false,
    deathCause: null,
  };

  // ─── Vaka sayacı ──────────────────────────────────────────────────────────
  let caseNumber = 0;

  // ═══════════════════════════════════════════════════════════════════════════
  //  GETTER
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * engine.js'in her updateUI() çağrısında kullandığı tam state nesnesi.
   */
  function getState() {
    return {
      budget:     clinicStats.budget,
      reputation: clinicStats.reputation,
      totalCases: clinicStats.totalCases,
      wins:       clinicStats.wins,
      losses:     clinicStats.losses,
      caseNumber,
      patient: {
        species:   currentPatient.species,
        name:      currentPatient.name,
        age:       currentPatient.age,
        weight:    currentPatient.weight,
        complaint: currentPatient.complaint,
      },
      vitals: {
        heartRate:   currentPatient.vitals.heartRate,
        temperature: currentPatient.vitals.temperature,
        respiration: currentPatient.vitals.respiration,
        hrNormal:    currentPatient.vitals.hrNormal,
      },
      isDead:     currentPatient.isDead,
      deathCause: currentPatient.deathCause,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VAKA BAŞLATMA
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * levels.js'in ürettiği vaka verisini alır ve state'i sıfırlar.
   * @param {object} caseData - Levels.getRandomCase() çıktısı
   */
  function initCase(caseData) {
    caseNumber++;
    clinicStats.totalCases++;

    const norms = SPECIES_NORMS[caseData.patient.species] || SPECIES_NORMS.dog;

    currentPatient = {
      species:   caseData.patient.species,
      name:      caseData.patient.name,
      age:       caseData.patient.age,
      weight:    caseData.patient.weight,
      complaint: caseData.patient.complaint,
      vitals: {
        heartRate:   caseData.patient.vitals.heartRate,
        temperature: caseData.patient.vitals.temperature,
        respiration: caseData.patient.vitals.respiration,
        hrNormal: { min: norms.hrMin, max: norms.hrMax },
      },
      isDead:     false,
      deathCause: null,
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  VİTAL GÜNCELLEME
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Hayati değerleri delta olarak günceller.
   * @param {number} hrChange   - kalp ritmi değişimi (bpm)
   * @param {number} tempChange - sıcaklık değişimi (°C)
   * @param {number} respChange - solunum değişimi (/dk)
   */
  function updateVitals(hrChange = 0, tempChange = 0, respChange = 0) {
    const v = currentPatient.vitals;
    v.heartRate   = clamp(v.heartRate   + hrChange,   DEATH_LIMITS.hrMin,   DEATH_LIMITS.hrMax);
    v.temperature = clamp(v.temperature + tempChange,  DEATH_LIMITS.tempMin, DEATH_LIMITS.tempMax);
    v.respiration = clamp(v.respiration + respChange,  DEATH_LIMITS.respMin, DEATH_LIMITS.respMax);
  }

  /**
   * Hayati değerleri doğrudan set eder (belirli bir müdahale sonrası).
   * @param {object} vals - { heartRate?, temperature?, respiration? }
   */
  function setVitals(vals = {}) {
    const v = currentPatient.vitals;
    if (vals.heartRate   !== undefined) v.heartRate   = clamp(vals.heartRate,   DEATH_LIMITS.hrMin,   DEATH_LIMITS.hrMax);
    if (vals.temperature !== undefined) v.temperature = clamp(vals.temperature, DEATH_LIMITS.tempMin, DEATH_LIMITS.tempMax);
    if (vals.respiration !== undefined) v.respiration = clamp(vals.respiration, DEATH_LIMITS.respMin, DEATH_LIMITS.respMax);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ETKİ UYGULAMA (levels.js'deki choice.effects → buraya gelir)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Bir seçeneğin effects objesini alır ve tüm değişimleri uygular.
   *
   * Desteklenen anahtar/değerler:
   *   hrDelta       : number  — kalp ritmi delta
   *   tempDelta     : number  — sıcaklık delta
   *   respDelta     : number  — solunum delta
   *   hrSet         : number  — kalp ritmi direkt set
   *   tempSet       : number  — sıcaklık direkt set
   *   respSet       : number  — solunum direkt set
   *   budgetDelta   : number  — bütçe değişimi (negatif = gider)
   *   repDelta      : number  — itibar değişimi
   *   killPatient   : boolean — anında ölüm (yanlış anestezi vb.)
   *   deathCause    : string  — ölüm sebebi açıklaması
   *
   * @param {object} effects
   */
  function applyEffects(effects = {}) {
    if (!effects) return;

    // Vital deltalar
    updateVitals(
      effects.hrDelta   || 0,
      effects.tempDelta || 0,
      effects.respDelta || 0,
    );

    // Vital set (anestezi stabil etme gibi durumlarda)
    setVitals({
      heartRate:   effects.hrSet,
      temperature: effects.tempSet,
      respiration: effects.respSet,
    });

    // Bütçe
    if (effects.budgetDelta !== undefined) {
      clinicStats.budget = Math.max(0, clinicStats.budget + effects.budgetDelta);
    }

    // İtibar
    if (effects.repDelta !== undefined) {
      clinicStats.reputation = clamp(clinicStats.reputation + effects.repDelta, 0, 5.0);
    }

    // Anlık ölüm (doz fazlası, yanlış ilaç vs.)
    if (effects.killPatient) {
      currentPatient.vitals.heartRate   = 0;
      currentPatient.vitals.respiration = 0;
      currentPatient.isDead   = true;
      currentPatient.deathCause = effects.deathCause || 'Bilinmeyen sebep';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ÖLÜM KONTROLÜ
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * engine.js her makeChoice() sonrasında bu fonksiyonu çağırır.
   * true dönerse engine game-over akışını başlatır.
   */
  function isPatientDead() {
    if (currentPatient.isDead) return true;

    const v = currentPatient.vitals;

    // Kalp durması
    if (v.heartRate <= 0) {
      currentPatient.isDead = true;
      currentPatient.deathCause = 'Kardiyak arrest';
      return true;
    }

    // Ventriküler fibrilasyon
    if (v.heartRate >= DEATH_LIMITS.hrMax) {
      currentPatient.isDead = true;
      currentPatient.deathCause = 'Ventriküler fibrilasyon';
      return true;
    }

    // Hipotermi
    if (v.temperature <= DEATH_LIMITS.tempMin) {
      currentPatient.isDead = true;
      currentPatient.deathCause = 'Hipotermik şok';
      return true;
    }

    // Hipertermi
    if (v.temperature >= DEATH_LIMITS.tempMax) {
      currentPatient.isDead = true;
      currentPatient.deathCause = 'Hipertermik koma';
      return true;
    }

    // Apne
    if (v.respiration <= DEATH_LIMITS.respMin) {
      currentPatient.isDead = true;
      currentPatient.deathCause = 'Solunum durması (apne)';
      return true;
    }

    return false;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  KAZANMA / KAYBETME KAYDI
  // ═══════════════════════════════════════════════════════════════════════════

  function recordWin() {
    clinicStats.wins++;
    clinicStats.reputation = clamp(clinicStats.reputation + 0.1, 0, 5.0);
    clinicStats.budget += 500; // başarılı vaka ücreti
  }

  function recordLoss() {
    clinicStats.losses++;
    clinicStats.reputation = clamp(clinicStats.reputation - 0.2, 0, 5.0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  YARDIMCI
  // ═══════════════════════════════════════════════════════════════════════════

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  // ─── Public API ───────────────────────────────────────────────────────────
  return {
    getState,
    initCase,
    applyEffects,
    updateVitals,
    setVitals,
    isPatientDead,
    recordWin,
    recordLoss,
  };

})();
