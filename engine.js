/**
 * engine.js — Sıla'nın Kliniği · Oyun Motoru
 *
 * DOM İletişimi:
 *  - #story-scroll      : hikaye mesajları buraya eklenir
 *  - #choices-grid      : seçenek butonları buraya enjekte edilir
 *  - #typing-indicator  : "değerlendiriyor…" animasyonu
 *  - #vital-hr/temp/resp: hayati değer sayıları
 *  - #bar-hr/temp/resp  : hayati değer bar dolulukları
 *  - #ecg-canvas        : ECG animasyonu
 *  - #stat-rep/budget   : üst bar itibar & bütçe
 *  - #case-id           : vaka numarası
 *  - #p-*               : hasta kartı alanları
 */

'use strict';

// ─── DOM referansları ────────────────────────────────────────────────────────
const DOM = {
  storyScroll:    document.getElementById('story-scroll'),
  choicesGrid:    document.getElementById('choices-grid'),
  typingIndicator:document.getElementById('typing-indicator'),
  caseId:         document.getElementById('case-id'),

  // Vitals
  vitalHR:   document.getElementById('vital-hr'),
  vitalTemp: document.getElementById('vital-temp'),
  vitalResp: document.getElementById('vital-resp'),
  barHR:     document.getElementById('bar-hr'),
  barTemp:   document.getElementById('bar-temp'),
  barResp:   document.getElementById('bar-resp'),
  ecgCanvas: document.getElementById('ecg-canvas'),

  // Üst bar
  statRep:    document.getElementById('stat-rep'),
  statBudget: document.getElementById('stat-budget'),
  statTime:   document.getElementById('stat-time'),

  // Hasta kartı
  pSpecies:   document.getElementById('p-species'),
  pName:      document.getElementById('p-name'),
  pAge:       document.getElementById('p-age'),
  pWeight:    document.getElementById('p-weight'),
  pComplaint: document.getElementById('p-complaint'),
};

// ─── ECG animasyonu ──────────────────────────────────────────────────────────
const ECG = (() => {
  const c   = DOM.ecgCanvas;
  const ctx = c.getContext('2d');
  let points = [];
  let x = 0;
  let animId = null;
  let bpm = 0;
  let phase = 0;
  let dead = false;

  function ecgSample(ph) {
    // QRS kompleksi yaklaşımı
    const t = ph % (Math.PI * 2);
    if (t < 0.3)  return Math.sin(t * 10) * 4;           // P dalgası
    if (t < 0.55) return 0;
    if (t < 0.65) return -8;                              // Q
    if (t < 0.75) return 36 * Math.exp(-Math.pow((t-0.7)*30,2)); // R spike
    if (t < 0.85) return -6;                              // S
    if (t < 1.2)  return Math.sin((t-0.85)*5) * 5;       // T
    return 0;
  }

  function draw() {
    const W = c.width, H = c.height, mid = H / 2;
    ctx.clearRect(0, 0, W, H);

    if (dead) {
      // Düz çizgi
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, mid); ctx.lineTo(W, mid);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    const speed = bpm > 0 ? bpm / 60 * 0.08 : 0;
    phase += speed;

    const sample = bpm > 0 ? ecgSample(phase) : 0;
    points.push({ x, y: mid - sample });
    if (points.length > W) points.shift();
    points.forEach(p => p.x--);

    // Izgara
    ctx.strokeStyle = 'rgba(46,166,138,0.1)';
    ctx.lineWidth = 0.5;
    for (let gx = 0; gx < W; gx += 20) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();

    // ECG çizgisi
    const color = bpm < 40 || bpm > 200 ? '#e05c5c' : bpm < 60 || bpm > 160 ? '#e8a838' : '#3fb950';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.shadowBlur = 0;

    x++;
    if (x > W) x = 0;
  }

  return {
    start(newBpm) {
      bpm = newBpm;
      dead = false;
      if (!animId) (function loop() { draw(); animId = requestAnimationFrame(loop); })();
    },
    update(newBpm) { bpm = newBpm; },
    flatline() { dead = true; bpm = 0; },
    stop() { cancelAnimationFrame(animId); animId = null; },
  };
})();

// ─── Klinik saati ────────────────────────────────────────────────────────────
const Clock = (() => {
  const DAYS = ['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
  let day = 0, hour = 9, minute = 0, timerId = null;

  function fmt() {
    const h = String(hour).padStart(2,'0');
    const m = String(minute).padStart(2,'0');
    DOM.statTime.textContent = `${DAYS[day]} · ${h}:${m}`;
  }

  return {
    start() {
      fmt();
      timerId = setInterval(() => {
        minute += 15;
        if (minute >= 60) { minute = 0; hour++; }
        if (hour >= 20)   { hour = 9; minute = 0; day = (day + 1) % 7; }
        fmt();
      }, 8000); // her 8 saniyede 15 dakika geçer
    },
    stop() { clearInterval(timerId); },
  };
})();

// ─── Yardımcı: hikaye mesajı ekle ───────────────────────────────────────────
function addStoryEntry(text, type = 'normal') {
  const entry = document.createElement('div');
  entry.className = 'story-entry';

  const who  = document.createElement('div');
  const msg  = document.createElement('div');

  who.className = 'who';
  msg.className = 'msg';

  if (type === 'system') {
    who.classList.add('system');
    msg.classList.add('system');
    who.textContent = 'Sistem';
  } else if (type === 'alert') {
    who.textContent = '⚠ Kritik';
    msg.classList.add('alert');
  } else if (type === 'death') {
    who.textContent = '✖ Eksitus';
    msg.classList.add('alert');
  } else {
    who.textContent = 'Dr. Sıla';
  }

  msg.textContent = text;
  entry.appendChild(who);
  entry.appendChild(msg);
  DOM.storyScroll.appendChild(entry);
  DOM.storyScroll.scrollTop = DOM.storyScroll.scrollHeight;
}

// ─── Yardımcı: yazıyor animasyonu ───────────────────────────────────────────
function showTyping(ms = 900) {
  return new Promise(resolve => {
    DOM.typingIndicator.classList.add('visible');
    setTimeout(() => {
      DOM.typingIndicator.classList.remove('visible');
      resolve();
    }, ms);
  });
}

// ─── updateUI(): DOM'u player.js verisiyle senkronize et ────────────────────
function updateUI() {
  const state  = Player.getState();   // player.js'den gelir
  const vitals = state.vitals;

  // ── Üst bar ──
  DOM.statRep.textContent    = `★ ${state.reputation.toFixed(1)}`;
  DOM.statBudget.textContent = `₺ ${state.budget.toLocaleString('tr-TR')}`;

  // ── Hayati değerler ──
  // Kalp ritmi (kedi: 120-140, köpek: 60-120, kuş: 250-350)
  const hrVal  = vitals.heartRate;
  const hrNorm = vitals.hrNormal || { min: 60, max: 140 };
  const hrPct  = Math.min(100, Math.max(0, ((hrVal - 0) / 300) * 100));
  DOM.vitalHR.textContent = hrVal > 0 ? `${hrVal} bpm` : '— bpm';
  DOM.barHR.style.width   = hrPct + '%';
  colorVital(DOM.vitalHR, DOM.barHR, hrVal, hrNorm.min, hrNorm.max);
  ECG.update(hrVal);

  // Vücut ısısı (normal: 38.0–39.5)
  const tmp    = vitals.temperature;
  const tmpPct = Math.min(100, Math.max(0, ((tmp - 35) / 8) * 100));
  DOM.vitalTemp.textContent = tmp > 0 ? `${tmp.toFixed(1)} °C` : '— °C';
  DOM.barTemp.style.width   = tmpPct + '%';
  colorVital(DOM.vitalTemp, DOM.barTemp, tmp, 38.0, 39.5);

  // Solunum (normal: 15-30)
  const rsp    = vitals.respiration;
  const rspPct = Math.min(100, Math.max(0, (rsp / 60) * 100));
  DOM.vitalResp.textContent = rsp > 0 ? `${rsp} /dk` : '— /dk';
  DOM.barResp.style.width   = rspPct + '%';
  colorVital(DOM.vitalResp, DOM.barResp, rsp, 15, 30);

  // ── Hasta kartı ──
  const p = state.patient;
  if (p) {
    const icons = { cat: '🐱 Kedi', dog: '🐶 Köpek', bird: '🐦 Kuş' };
    DOM.pSpecies.innerHTML = `<span class="species-badge">${icons[p.species] || p.species}</span>`;
    DOM.pName.textContent      = p.name      || '—';
    DOM.pAge.textContent       = p.age       || '—';
    DOM.pWeight.textContent    = p.weight    || '—';
    DOM.pComplaint.textContent = p.complaint || '—';
  }
}

// Vital değerine göre renk ver (ok / warn / danger)
function colorVital(label, bar, val, min, max) {
  const margin = (max - min) * 0.2;
  label.classList.remove('ok','warn','danger');
  bar.style.background = '';
  if (val <= 0) return;
  if (val >= min && val <= max) {
    label.classList.add('ok');
    bar.style.background = 'var(--ok)';
  } else if (val >= min - margin && val <= max + margin) {
    label.classList.add('warn');
    bar.style.background = 'var(--warn)';
  } else {
    label.classList.add('danger');
    bar.style.background = 'var(--danger)';
  }
}

// ─── loadNode(): node'u yükle, metin ve butonları güncelle ──────────────────
async function loadNode(nodeId) {
  // Tüm butonları devre dışı bırak (spam koruması)
  setChoicesEnabled(false);

  // Node'u levels.js'den bul
  const node = Levels.getNode(nodeId);
  if (!node) {
    addStoryEntry(`[HATA] Node bulunamadı: ${nodeId}`, 'system');
    return;
  }

  // Vaka numarasını güncelle
  DOM.caseId.textContent = `Vaka #${Player.getState().caseNumber} / Node: ${nodeId}`;

  // Yazıyor animasyonu göster, sonra metni yaz
  await showTyping(700 + Math.random() * 500);

  const type = node.type || 'normal';
  addStoryEntry(node.text, type);

  // Eğer bu bir "bitiş" node'uysa (death veya success)
  if (type === 'death') {
    ECG.flatline();
    renderGameOver(node);
    return;
  }
  if (type === 'success') {
    renderSuccess(node);
    return;
  }

  // Seçenekleri oluştur
  renderChoices(node.choices || []);
  updateUI();
}

// ─── makeChoice(): seçenek butonuna tıklandığında çalışır ───────────────────
async function makeChoice(choice) {
  setChoicesEnabled(false);

  // Seçimi hikayeye yansıt
  addStoryEntry(`› ${choice.label}`, 'system');

  // Etkileri uygula (player.js)
  if (choice.effects) {
    Player.applyEffects(choice.effects);
  }

  updateUI();

  // Hasta öldü mü?
  if (Player.isPatientDead()) {
    await showTyping(600);
    addStoryEntry(
      'Hastanın hayati fonksiyonları durdu. Tüm müdahalelere rağmen hasta kaybedildi.',
      'death'
    );
    ECG.flatline();
    renderGameOver(null);
    return;
  }

  // Sonraki node'a geç
  await loadNode(choice.nextNodeId);
}

// ─── Buton oluşturma ─────────────────────────────────────────────────────────
const KEYS = ['A','B','C','D','E','F'];

function renderChoices(choices) {
  DOM.choicesGrid.innerHTML = '';

  if (!choices.length) {
    DOM.choicesGrid.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:8px">Vaka sonuçlandı.</p>';
    return;
  }

  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `
      <span class="ch-key">${KEYS[i] || i + 1}</span>
      ${escapeHTML(choice.label)}
    `;

    btn.addEventListener('click', () => makeChoice(choice));

    // Klavye kısayolu
    DOM.choicesGrid.appendChild(btn);
  });

  // Klavye kısayolları
  document.onkeydown = (e) => {
    const idx = KEYS.indexOf(e.key.toUpperCase());
    if (idx >= 0) {
      const btns = DOM.choicesGrid.querySelectorAll('.choice-btn:not(:disabled)');
      if (btns[idx]) btns[idx].click();
    }
  };
}

function setChoicesEnabled(enabled) {
  DOM.choicesGrid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = !enabled;
  });
  if (enabled) document.onkeydown = null; // geçici devre dışı, renderChoices yeniden kurar
}

// ─── Game Over ───────────────────────────────────────────────────────────────
function renderGameOver(node) {
  DOM.choicesGrid.innerHTML = '';
  const msg = node?.text || '';

  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.gridColumn = '1 / -1';
  btn.style.justifyContent = 'center';
  btn.style.borderColor = 'var(--danger)';
  btn.innerHTML = '<span class="ch-key" style="background:var(--danger);color:#fff">↺</span> Yeni Vakaya Geç';
  btn.addEventListener('click', () => startGame());
  DOM.choicesGrid.appendChild(btn);

  Player.recordLoss();
  updateUI();
}

// ─── Başarı Ekranı ───────────────────────────────────────────────────────────
function renderSuccess(node) {
  DOM.choicesGrid.innerHTML = '';

  const btn = document.createElement('button');
  btn.className = 'choice-btn';
  btn.style.gridColumn = '1 / -1';
  btn.style.justifyContent = 'center';
  btn.style.borderColor = 'var(--ok)';
  btn.innerHTML = '<span class="ch-key" style="background:var(--ok);color:#fff">★</span> Sonraki Vakaya Geç';
  btn.addEventListener('click', () => startGame());
  DOM.choicesGrid.appendChild(btn);

  Player.recordWin();
  updateUI();
}

// ─── startGame(): oyunu/vakayı sıfırla ve başlat ─────────────────────────────
function startGame() {
  // DOM'u temizle
  DOM.storyScroll.innerHTML = '';
  DOM.choicesGrid.innerHTML = '';

  // Yeni vaka oluştur (player.js + levels.js)
  const caseData = Levels.getRandomCase();
  Player.initCase(caseData);

  // Hasta kartını doldur
  updateUI();

  // ECG'yi başlat
  ECG.start(Player.getState().vitals.heartRate);

  // Açılış mesajı
  addStoryEntry(
    `Yeni hasta muayene odasına alındı. İyi şanslar, Dr. Sıla.`,
    'system'
  );

  // İlk node'u yükle
  loadNode(caseData.startNodeId);
}

// ─── XSS koruması ────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ─── Başlat ──────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  Clock.start();
  startGame();
});

// Diğer dosyaların erişimi için global
window.Engine = { startGame, loadNode, makeChoice, updateUI };
