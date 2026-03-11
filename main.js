document.addEventListener("DOMContentLoaded", () => {
  const dd = document.getElementById("langDD");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  const txt = document.getElementById("langTxt");
  if (!dd || !btn || !menu || !txt) return;

  const KEY = "site_lang";
  const items = Array.from(menu.querySelectorAll(".lang-dd__item"));

  const labels = { en: "English", ru: "Русский" };
   // ===== i18n =====
  const I18N = {
    ru: {
      tagline: "Доведи каждую задачу до конца",
      ctaDownload: "Скачать",
      ctaLoading: "Загрузка",
      ctaInstalled: "Установлено",
      hint: "Доступно для iOS (MacOS) и Android",
      storeTop: "Скачать в",
      footerCopy: "© 2026 Can't not do it. Все права защищены.",
      flyouts: [
        "Записывай мысли как заметки — приложение само превращает их в понятные задачи. Больше не нужно держать всё в голове: идеи сразу становятся действиями, которые можно выполнить.",
        "Приоритеты расставляются так, чтобы ты всегда видел “что реально важно сейчас”. Это помогает избегать ловушки срочности и не тратить день на мелкие дела вместо ключевых.",
        "План на день собирается вокруг твоих задач, а не наоборот. Когда у тебя есть ясный план (по сути — тайм-блоки), меньше переключений, меньше хаоса и проще держать фокус.",
        "Напоминания приходят вовремя, чтобы ты не “забыл и не отложил”. Это особенно важно для задач на будущее: исследования по prospective memory показывают, что напоминания реально помогают вспоминать и выполнять намерения.",
        "Каждая задача ведёт к результату: видишь прогресс и закрываешь этапы по пути. Меньше “начал и бросил”, больше ощущения движения вперёд — ровно то, что в твоём слогане “доведи до конца”.",
        "Система простая: “записал → уточнил → организовал → сделал”. Это очень близко к логике GTD, где главное — выгрузить всё из головы и перевести в следующий конкретный шаг."
      ]
    },
    en: {
      tagline: "Finish every task you start",
      ctaDownload: "Download",
      ctaLoading: "Loading",
      ctaInstalled: "Installed",
      hint: "Available for iOS (macOS) and Android",
      storeTop: "Download on",
      footerCopy: "© 2026 Can't not do it. All rights reserved.",
      flyouts: [
        "Write thoughts as notes — the app turns them into clear tasks. No need to keep everything in your head: ideas become actions you can complete.",
        "Priorities are arranged so you always see what truly matters now. This helps you avoid the urgency trap and focus on key work instead of small stuff.",
        "Your day plan is built around your tasks (think time blocks). Fewer context switches, less chaos, and it’s easier to stay focused.",
        "Reminders arrive at the right time so you don’t “forget and postpone”. That’s crucial for future tasks: research on prospective memory shows reminders really help people follow through.",
        "Every task leads to a result: you see progress and close milestones on the way. Less “started and dropped”, more forward momentum — exactly what “finish it” is about.",
        "Simple flow: “capture → clarify → organize → do”. It’s close to GTD: get everything out of your head and turn it into the next concrete action."
      ]
    }
  };

  function applyI18n(lang) {
    const t = I18N[lang] || I18N.en;

    // Заголовок под H1
    const taglineEl = document.querySelector(".title p");
    if (taglineEl) taglineEl.textContent = t.tagline; // textContent: :contentReference[oaicite:0]{index=0}

    // Кнопка на экране телефона
    const idle = document.querySelector(".cta-label--idle");
    if (idle) idle.textContent = t.ctaDownload;

    const loaderText = document.querySelector(".cta-loader-text");
    if (loaderText) loaderText.textContent = t.ctaLoading;

    const done = document.querySelector(".cta-label--done");
    if (done) {
      // меняем только текстовый узел "Установлено", не трогая SVG
      const txtNode = Array.from(done.childNodes).find(
        n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length
      );
      if (txtNode) txtNode.textContent = " " + t.ctaInstalled;
    }

    const hint = document.querySelector(".screen-hint");
    if (hint) hint.textContent = t.hint;

    // Тексты флаеров (у тебя они в data-text)
    const fly = Array.from(document.querySelectorAll(".flyout-text"));
    fly.forEach((el, i) => {
      if (!t.flyouts[i]) return;
      el.dataset.text = t.flyouts[i]; // dataset: :contentReference[oaicite:1]{index=1}
    });

    // Пересчитать высоты/переносы, чтобы блоки не резали текст
    if (typeof prepareAllFlyoutTextHeights === "function") {
      prepareAllFlyoutTextHeights(true);
    }

    // Футер: "Скачать в" -> "Download on"
    document.querySelectorAll(".store-top").forEach(el => {
      el.textContent = t.storeTop;
    });

    const copy = document.querySelector(".footer-copy");
    if (copy) copy.textContent = t.footerCopy;
  }
  // ===== /i18n =====

  function close(){
    dd.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }
  function open(){
    dd.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }
  function toggle(){
    dd.classList.contains("open") ? close() : open();
  }

  function setLang(lang){
    document.documentElement.lang = lang;
    txt.textContent = labels[lang] || lang;
    applyI18n(lang);
    items.forEach(it => it.setAttribute("aria-selected", it.dataset.lang === lang ? "true" : "false"));

    try { localStorage.setItem(KEY, lang); } catch(e) {}
    close();
  }

  let lang = "en";
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) lang = saved;
    else lang = (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en";
  } catch(e){}
  setLang(lang);

  btn.addEventListener("click", toggle);

  items.forEach(it => {
    it.addEventListener("click", () => setLang(it.dataset.lang));
  });

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
});

    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

window.addEventListener('load', async () => {

  prepareAllFlyoutTextHeights(true);

  if (document.fonts && document.fonts.ready) {
    try { await document.fonts.ready; } catch(e) {}
    prepareAllFlyoutTextHeights(true);
  }

  if (window.__roadAPI) {
    window.__roadAPI.rebuild();
    window.__roadAPI.update();
  }
});

  (function() {
  let phoneFrozen = false;
  let phoneFrozenTransform = "";
  const phone = document.getElementById('phone');

  const startRotateY = -28;  // Теперь совпадает с тем, что было в CSS
  const startRotateX = 5;
  const startZ = 18;

  const endRotateY = 0;
  const endRotateX = 0;
  const endZ = 40;

  function updatePhoneRotation() {
    if (window.__imgModalOpen || phoneFrozen) return; // ✅ не трогаем телефон в модалке

    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    let progress = scrollY / (windowHeight * 0.5);
    progress = Math.min(1, Math.max(0, progress));

    const rotY = startRotateY + (endRotateY - startRotateY) * progress;
    const rotX = startRotateX + (endRotateX - startRotateX) * progress;
    const z = startZ + (endZ - startZ) * progress;

    phone.style.transform = `scale(var(--phoneScale)) rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${z}px)`;

    const screen = phone.querySelector('.screen');
    const btn = document.getElementById('screenCta');

    if (screen && btn) {

      const tPressStart = 0.26;   // рука прилетела к кнопке
      const tPressEnd   = 0.34;   // "нажала"
      const tLoadingEnd = 0.86;   // почти фронтально: готово

      screen.classList.remove('is-loading', 'is-done');

      if (progress > tPressEnd && progress < tLoadingEnd) {
        screen.classList.add('is-loading');
      }

      if (progress >= tLoadingEnd) {
        screen.classList.add('is-done');
      }

      let pressP = 0;
      if (progress >= tPressStart && progress <= tPressEnd) {
        const mid = (tPressStart + tPressEnd) * 0.5;
        const span = (tPressEnd - tPressStart) * 0.5;
        pressP = 1 - Math.min(1, Math.abs(progress - mid) / (span || 1));
      }

      const doneP = Math.max(0, Math.min(1, (progress - tLoadingEnd) / (1 - tLoadingEnd)));

      screen.style.setProperty('--cPress', String(pressP));

      screen.style.setProperty('--ctaDone', String(doneP));
    }
  }

  phone.style.transition = 'none';
  updatePhoneRotation(); // Устанавливаем начальное положение

  requestAnimationFrame(() => {
    phone.style.transition = 'transform 0.05s linear';
  });

  window.addEventListener('scroll', updatePhoneRotation);
  window.addEventListener('resize', updatePhoneRotation);
})();

    const blocks = document.querySelectorAll('.flyout');
    const texts = document.querySelectorAll('.flyout-text');

    function prepareHeight(el, text, force = false) {
      if (!force && el.dataset.prepared === "1") return;
      el.dataset.prepared = "1";

      const clone = document.createElement("div");
      clone.style.width = el.getBoundingClientRect().width + "px";
      clone.style.fontFamily = getComputedStyle(el).fontFamily;
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.pointerEvents = "none";
      clone.style.whiteSpace = "normal";
      clone.style.maxWidth = getComputedStyle(el).maxWidth;
      clone.style.fontSize = getComputedStyle(el).fontSize;
      clone.style.fontWeight = getComputedStyle(el).fontWeight;
      clone.style.lineHeight = getComputedStyle(el).lineHeight;
      clone.style.padding = getComputedStyle(el).padding;

      
      clone.textContent = text;
      document.body.appendChild(clone);

      el.style.minHeight = clone.scrollHeight + "px";
      el.style.height = clone.scrollHeight + "px";
      el.style.overflow = "hidden";
      clone.remove();
    }

    function prepareAllFlyoutTextHeights(force = false) {
      document.querySelectorAll(".flyout-text").forEach((el) => {
        if (force) el.dataset.prepared = "0";
        prepareHeight(el, el.dataset.text || "", force);
      });
    }

if ('ResizeObserver' in window) {
  const ro = new ResizeObserver(() => {
    const freezeUntil = window.__roadFreezeUntil || 0;
    if (window.__imgModalOpen || performance.now() < freezeUntil) return;

    cancelAnimationFrame(recalcFlyoutTextHeights._raf || 0);
    recalcFlyoutTextHeights._raf = requestAnimationFrame(recalcFlyoutTextHeights);
  });

  document.querySelectorAll('.flyout-text-stack').forEach((stack) => ro.observe(stack));
}

const MOBILE_TEXT_MODE = window.matchMedia("(max-width: 1150px), (hover: none) and (pointer: coarse)").matches;

function typeWrite(el, text) {
  const token = String((Number(el.dataset.twToken || "0") + 1));
  el.dataset.twToken = token;

  if (MOBILE_TEXT_MODE) {
    el.textContent = text;
    return;
  }

  el.textContent = "";
  let i = 0;

  function step() {
    if (el.dataset.twToken !== token) return;

    if (i < text.length) {
      el.textContent += text[i];
      i++;
      requestAnimationFrame(step);
    }
  }

  step();
}

    let lastScroll = 0;

    function onScroll() {
  const scroll = window.scrollY;
  const directionDown = scroll > lastScroll;
  lastScroll = scroll;

  const enterPoint = window.innerHeight * 0.75;
  const leavePoint = window.innerHeight * 0.85;

  blocks.forEach((block, idx) => {
  const text = texts[idx];
  if (!text) return;

  const rect = block.getBoundingClientRect();

  if (rect.top < enterPoint) {
    block.classList.add('visible');
    text.classList.add('visible');

    if (text.dataset.typed !== "1") {
      prepareHeight(text, text.dataset.text || "");
      typeWrite(text, text.dataset.text || "");
      text.dataset.typed = "1";
    }
  }

  if (!MOBILE_TEXT_MODE && !directionDown && rect.top > leavePoint) {
    block.classList.remove('visible');
    text.classList.remove('visible');

    text.dataset.twToken = String(Number(text.dataset.twToken || "0") + 1);
    text.textContent = "";
    text.dataset.typed = "0";
  }
});
    }

    window.addEventListener('scroll', onScroll);
    onScroll();

    (function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  const cfg = {
    radius: 140,
    phoneLead: 70,
    exitStub: 22,
    entryInset: 2,

    startVh: 0.88,
    endVh: 0.42,
    minGap: 40,
    minDuration: 280,
    footerMinDuration: 700,

    cpR: window.innerWidth <= 768 ? 18 : 28,
    cpRingW: window.innerWidth <= 768 ? 3.5 : 5,
    cpCheckW: window.innerWidth <= 768 ? 4.5 : 7,
    cpWindow: 240,
    cpCheckDelay: 0.55,
    cpSearchSteps: 44,
    checkSquashAmount: 0.18,

    bottomSnapPx: 2,
    afterLastCpSpeed: 2, // во сколько раз быстрее после последней галочки
    segOverlapPx: 120,
    footerFalseDelayPx: 250, // сколько px отъехать вверх от низа, чтобы стало false
    cpYOffset: 0,          // по умолчанию
    cpYOffsetMobile: -11,// НА СКОЛЬКО ПОДНЯТЬ ГАЛОЧКИ на мобилке (подбери)
    lastCpExtraDownMobile: 400
  };

  const svg = document.getElementById("roadSvg");
  if (!svg) return;

  svg.querySelectorAll("path.road-shadow, path.road-path, g#roadCheckpoints").forEach(n => n.remove());

  const shadowPath = document.createElementNS(SVG_NS, "path");
  shadowPath.classList.add("road-shadow");

  const mainPath = document.createElementNS(SVG_NS, "path");
  mainPath.classList.add("road-path");

  const cpsLayer = document.createElementNS(SVG_NS, "g");
  cpsLayer.setAttribute("id", "roadCheckpoints");

  svg.appendChild(shadowPath);
  svg.appendChild(mainPath);
  svg.appendChild(cpsLayer);

  let segments = [];      // [{len, start, end}]
  let totalLen = 0;
  let checkpoints = [];   // [{atLen, x, y, ring, fill, check, checkLen, circ, markG}]
  let cornerHints = [];   // [{hint, startLen, endLen}]
  let __atFooterPrev = null;
  window.__roadState = window.__roadState || { atFooter: false };
  let __footerState = null;      // null = “ещё не начинали”
  let __footerArmed = false;     // станет true после первого true
  let flagEl = null;
  let __flagPrev = null;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function syncSvgSize() {
    const doc = document.documentElement;
    const body = document.body;

    const w = Math.max(doc.clientWidth, doc.scrollWidth, body.scrollWidth, body.clientWidth);
    const h = Math.max(
      doc.scrollHeight, body.scrollHeight,
      doc.offsetHeight, body.offsetHeight,
      doc.clientHeight, body.clientHeight
    );

    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  }

  function getTranslate(el) {
    const t = getComputedStyle(el).transform;
    if (!t || t === "none") return { x: 0, y: 0 };
    const m = new DOMMatrixReadOnly(t);
    return { x: m.m41, y: m.m42 };
  }

  function getAbsRect(el, ignoreTransform) {
    const r = el.getBoundingClientRect();
    let tx = 0, ty = 0;
    if (ignoreTransform) {
      const tr = getTranslate(el);
      tx = tr.x; ty = tr.y;
    }
    const left = r.left + window.scrollX - tx;
    const top = r.top + window.scrollY - ty;
    return {
      left, top,
      right: left + r.width,
      bottom: top + r.height,
      width: r.width,
      height: r.height
    };
  }

  function dedupePoints(points) {
    const out = [];
    for (const p of points) {
      const last = out[out.length - 1];
      if (!last || Math.abs(last.x - p.x) > 0.01 || Math.abs(last.y - p.y) > 0.01) {
        out.push(p);
      }
    }
    return out;
  }

  function roundedPolylineD(points, radius) {
    const pts = dedupePoints(points);
    if (pts.length < 2) return "";

    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 1; i < pts.length - 1; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];

      const v1x = p0.x - p1.x, v1y = p0.y - p1.y;
      const v2x = p2.x - p1.x, v2y = p2.y - p1.y;

      const len1 = Math.hypot(v1x, v1y);
      const len2 = Math.hypot(v2x, v2y);

      if (len1 < 0.001 || len2 < 0.001) {
        d += ` L ${p1.x} ${p1.y}`;
        continue;
      }

      const r = Math.min(radius, len1 * 0.5, len2 * 0.5);

      const pA = { x: p1.x + (v1x / len1) * r, y: p1.y + (v1y / len1) * r };
      const pB = { x: p1.x + (v2x / len2) * r, y: p1.y + (v2y / len2) * r };

      d += ` L ${pA.x} ${pA.y}`;
      d += ` Q ${p1.x} ${p1.y} ${pB.x} ${pB.y}`;
    }

    const last = pts[pts.length - 1];
    d += ` L ${last.x} ${last.y}`;
    return d;
  }

  function joinParts(parts) {
    return parts.map((d, i) => {
      const s = d.trim();
      if (i === 0) return s;
      return s.replace(/^M\s*[-\d.]+\s+[-\d.]+\s*/, "");
    }).join(" ").trim();
  }

  function measureD(d) {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    const len = p.getTotalLength();
    svg.removeChild(p);
    return len;
  }

  function findNearestLenInRange(hint, startLen, endLen) {
    const steps = cfg.cpSearchSteps;
    let bestLen = startLen;
    let bestDist = Infinity;

    for (let i = 0; i <= steps; i++) {
      const t = startLen + (endLen - startLen) * (i / steps);
      const p = mainPath.getPointAtLength(t);
      const dx = p.x - hint.x;
      const dy = p.y - hint.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestDist) {
        bestDist = d2;
        bestLen = t;
      }
    }
    return bestLen;
  }

  function clearCheckpoints() {
    while (cpsLayer.firstChild) cpsLayer.removeChild(cpsLayer.firstChild);
    checkpoints = [];
  }

  function createCheckpoint(atLen) {
    const p = mainPath.getPointAtLength(atLen);

    const g = document.createElementNS(SVG_NS, "g");
    g.classList.add("cp");
    const isMobile = window.matchMedia("(max-width: 1029px)").matches;
    const yOff = isMobile ? cfg.cpYOffsetMobile : cfg.cpYOffset;
    g.setAttribute("transform", `translate(${p.x} ${p.y + yOff})`);
    g.setAttribute("filter", "url(#cpShadow)");

    const fill = document.createElementNS(SVG_NS, "circle");
    fill.setAttribute("r", String(cfg.cpR));
    fill.setAttribute("fill", "#fff");
    fill.setAttribute("opacity", "0");

    const ring = document.createElementNS(SVG_NS, "circle");
    ring.setAttribute("r", String(cfg.cpR));
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "#0b0b0b");
    ring.setAttribute("stroke-width", String(cfg.cpRingW));
    ring.setAttribute("stroke-linecap", "round");

    const circ = 2 * Math.PI * cfg.cpR;
    ring.style.strokeDasharray = String(circ);
    ring.style.strokeDashoffset = String(circ);

    const markG = document.createElementNS(SVG_NS, "g");

    const check = document.createElementNS(SVG_NS, "path");
    check.setAttribute("d", `M -12 0 L -4 8 L 14 -12`);
    check.setAttribute("fill", "none");
    check.setAttribute("stroke", "#0b0b0b");
    check.setAttribute("stroke-width", String(cfg.cpCheckW));
    check.setAttribute("stroke-linecap", "round");
    check.setAttribute("stroke-linejoin", "round");

    markG.appendChild(check);

    const checkLen = check.getTotalLength();
    check.style.strokeDasharray = String(checkLen);
    check.style.strokeDashoffset = String(checkLen);

    g.appendChild(fill);
    g.appendChild(ring);
    g.appendChild(markG);
    cpsLayer.appendChild(g);

    checkpoints.push({
      atLen, x: p.x, y: p.y,
      ring, fill, check, checkLen, circ, markG,
      g
    });
  }

  const kT = [0.0, 0.20, 0.377, 0.60, 1.0];
  const kSX = [1.0, 1.0, 0.70, 1.10, 1.0];
  const kSY = [1.0, 0.80, 1.30, 0.90, 1.0];

  function lerp(a, b, t) { return a + (b - a) * t; }

  function sampleSquash(t) {
    t = clamp(t, 0, 1);
    for (let i = 0; i < kT.length - 1; i++) {
      if (t >= kT[i] && t <= kT[i + 1]) {
        const lt = (t - kT[i]) / (kT[i + 1] - kT[i] || 1);
        const sxRaw = lerp(kSX[i], kSX[i + 1], lt);
        const syRaw = lerp(kSY[i], kSY[i + 1], lt);
        const amt = cfg.checkSquashAmount;
        return {
          sx: 1 + (sxRaw - 1) * amt,
          sy: 1 + (syRaw - 1) * amt
        };
      }
    }
    return { sx: 1, sy: 1 };
  }

  function updateCheckpoints(revealed) {
    for (const cp of checkpoints) {
      const local = clamp((revealed - cp.atLen) / cfg.cpWindow, 0, 1);
      cp.g.style.opacity = local > 0 ? "1" : "0";
      const ringP = easeOutCubic(clamp(local / 0.65, 0, 1));
      cp.ring.style.strokeDashoffset = String(cp.circ * (1 - ringP));

      const fillP = easeOutCubic(clamp((local - 0.18) / 0.40, 0, 1));
      cp.fill.setAttribute("opacity", String(fillP));

      const checkLocal = clamp((local - cfg.cpCheckDelay) / (1 - cfg.cpCheckDelay), 0, 1);
      cp.check.style.strokeDashoffset = String(cp.checkLen * (1 - checkLocal));

      const sq = sampleSquash(checkLocal);
      cp.markG.setAttribute("transform", `scale(${sq.sx} ${sq.sy})`);
    }
  }

  function buildClothD(p) {
    const x0 = 26;
    const yTop = 18;
    const yBot = 44;

    const maxW = 88;
    const w = maxW * p;

    const x1 = x0 + w;
    const midY = (yTop + yBot) * 0.5;

    const notchMax = 26;
    const notch = Math.min(notchMax, w * 0.45);

    const wave = Math.sin(Math.PI * p);
    const a = 10 * wave * (0.4 + 0.6 * (1 - p));

    if (w < 1) {
      return `M ${x0} ${yTop} L ${x0} ${yBot} L ${x0} ${yBot} Z`;
    }

    return `
      M ${x0} ${yTop}
      C ${x0 + w*0.35} ${yTop - a}, ${x0 + w*0.70} ${yTop + a}, ${x1} ${yTop}
      L ${x1 - notch} ${midY}
      L ${x1} ${yBot}
      C ${x0 + w*0.70} ${yBot + a}, ${x0 + w*0.35} ${yBot - a}, ${x0} ${yBot}
      Z
    `.trim();
  }

  function buildSegment(from, entry, exit, leadDown) {
    const pts = [from];

    if (leadDown > 0) pts.push({ x: from.x, y: from.y + leadDown });
    const yMid = pts[pts.length - 1].y;

    pts.push({ x: entry.x, y: yMid });
    pts.push({ x: entry.x, y: entry.y });

    pts.push({ x: entry.x, y: exit.y });
    pts.push({ x: exit.x, y: exit.y });

    return {
      d: roundedPolylineD(pts, cfg.radius),
      corner: { x: entry.x, y: yMid } // “внешний” поворот дуги к карточке
    };
  }

  function buildFooter(from, footerEntry) {
    const pts = [
      from,
      { x: footerEntry.x, y: from.y },
      footerEntry
    ];
    return {
      d: roundedPolylineD(pts, cfg.radius),
      corner: { x: footerEntry.x, y: from.y }
    };
  }

  function rebuild() {
    syncSvgSize();
    clearCheckpoints();

    // ВАЖНО: логика "прямой дороги" должна совпадать с CSS-брейкпоинтом,
    // где карточки становятся в одну колонку.
    // У тебя это @media (max-width: 1029px)
    const isNarrow = window.matchMedia("(max-width: 1150px)").matches;
    // Отдельно оставим очень маленькие экраны — только для размеров/радиусов.
    const isSmall = window.matchMedia("(max-width: 600px)").matches;
    const centerX = window.innerWidth * 0.5;
    const isBelow1514 = window.matchMedia("(max-width: 1514px)").matches;

    if (isNarrow) {
      // почти прямая на узких (<=1029)
      cfg.radius = 40;
      // на совсем маленьких можно чуть меньше чекпоинты
      cfg.cpR = isSmall ? 26 : 28;
      cfg.cpRingW = 4;
      cfg.cpCheckW = 6;
    } else {
      cfg.radius = 140;
      cfg.cpR = 28;
      cfg.cpRingW = 5;
      cfg.cpCheckW = 7;
    }

    cornerHints = [];

    const phone = document.getElementById("phone");
    const flyouts = Array.from(document.querySelectorAll(".flyout"));
    const footer = document.querySelector("footer.footer") || document.querySelector(".footer");

    if (!phone || flyouts.length === 0 || !footer) {
      segments = [];
      return;
    }

    const pr = getAbsRect(phone, false);
    let from = { x: pr.left + pr.width / 2, y: pr.bottom -30 };

    const dParts = [];
    const segLens = [];
    const targets = [];

    let cumLen = 0;

    flyouts.forEach((el, idx) => {
      const r = getAbsRect(el, true);

    const entry = isNarrow
      ? { x: centerX, y: r.top + cfg.entryInset }
      : { x: r.left + r.width / 2, y: r.top + cfg.entryInset };

    let exit, built;

    if (isNarrow) {

      // Чекпоинт должен быть "ПЕРЕД" карточкой (перед картинкой),
      // а не под ней. Поэтому ставим hint чуть выше верхней границы flyout.
      // (cpR + небольшой зазор)
      const cpGap = 10;
      const desiredCpY = r.top - cfg.cpR - cpGap;
      // На всякий случай держим чекпоинт внутри вертикального участка сегмента:
      const cpY = Math.min(entry.y - 1, Math.max(from.y + 1, desiredCpY));

      exit = { x: centerX, y: r.top + r.height / 2 };

      built = {
        d: roundedPolylineD(
          [
            from,
            { x: centerX, y: from.y },  // выравниваем X к центру
            { x: centerX, y: entry.y }, // до “входа”
            exit                         // до центра карточки
          ],
          Math.min(cfg.radius, 40)
        ),
        // IMPORTANT: hint теперь "перед" карточкой
        corner: { x: centerX, y: cpY }
      };
    } else {
    const isLeft = el.classList.contains("left");
    const isLastFlyout = idx === flyouts.length - 1;
    const sideY = r.top + r.height / 2;
    const sideEdgeX = isLeft ? r.right : r.left;

    let exitStub = cfg.exitStub;

    // Убираем боковой вылет именно у последней картинки на экранах <= 1514
    if (isLastFlyout && isBelow1514) {
      exitStub = -40;
    }

    exit = {
      x: sideEdgeX + (isLeft ? exitStub : -exitStub),
      y: sideY
    };

    const lead = (idx === 0) ? cfg.phoneLead : 0;
    built = buildSegment(from, entry, exit, lead);
    }

      const lenSeg = measureD(built.d);

      dParts.push(built.d);
      segLens.push(lenSeg);
      targets.push(el);

      if (idx > 0) {
        cornerHints.push({
          hint: built.corner,
          startLen: cumLen,
          endLen: cumLen + lenSeg
        });
      }

      cumLen += lenSeg;
      from = exit;
    });

   const fr = getAbsRect(footer, false);

const footerEntry = {
  x: isNarrow ? centerX : (fr.left + fr.width / 2),
  y: fr.top + cfg.entryInset
};

    const builtFooter = isNarrow
      ? {
          d: roundedPolylineD(
            [from, { x: centerX, y: from.y }, footerEntry],
            Math.min(cfg.radius, 40)
          ),
          corner: { x: centerX, y: from.y }
        }
      : buildFooter(from, footerEntry);

    const lenFooter = measureD(builtFooter.d);

    dParts.push(builtFooter.d);
    segLens.push(lenFooter);
    targets.push(footer);

    cornerHints.push({
      hint: builtFooter.corner,
      startLen: cumLen,
      endLen: cumLen + lenFooter
    });

    cumLen += lenFooter;
    from = footerEntry;

    const fullD = joinParts(dParts);
    shadowPath.setAttribute("d", fullD);
    mainPath.setAttribute("d", fullD);

    totalLen = mainPath.getTotalLength();
    shadowPath.style.strokeDasharray = totalLen;
    shadowPath.style.strokeDashoffset = totalLen;
    mainPath.style.strokeDasharray = totalLen;
    mainPath.style.strokeDashoffset = totalLen;

    const vh = window.innerHeight;

    const raw = segLens.map((len, i) => {
      const tEl = targets[i];
      const rr = tEl.classList.contains && tEl.classList.contains("flyout")
        ? getAbsRect(tEl, true)
        : getAbsRect(tEl, false);

      const triggerTop = rr.top;

      let start = triggerTop - vh * cfg.startVh;
      let end   = triggerTop - vh * cfg.endVh;

      end = Math.max(end, start + cfg.minDuration);
      return { len, start, end };
    });

    segments = [];
    let prevEnd = raw[0]?.end ?? 0;

    for (let i = 0; i < raw.length; i++) {
      let start = raw[i].start;
      let end   = raw[i].end;

      if (i === 0) {

        end = Math.max(end, start + cfg.minDuration);
      } else {

        start = Math.min(start, prevEnd - cfg.segOverlapPx);

        start = Math.max(start, prevEnd - Math.max(cfg.segOverlapPx, 1));

        end = Math.max(end, start + cfg.minDuration);
      }

      if (i > 0) start = Math.max(start, segments[i - 1].start + 1);

      segments.push({ len: raw[i].len, start, end });
      prevEnd = end;
    }

    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const last = segments.length - 1;

    segments[last].end = maxScroll;

    segments[last].start = Math.min(segments[last].start, maxScroll - cfg.footerMinDuration);
    if (last > 0) segments[last].start = Math.max(segments[last].start, segments[last - 1].end + cfg.minGap);
    segments[last].start = Math.max(0, segments[last].start);

    for (const ch of cornerHints) {
      const atLen = findNearestLenInRange(ch.hint, ch.startLen, ch.endLen);
      createCheckpoint(atLen);
    }
        // --- shift ONLY last checkpoint on mobile, but keep reveal timing correct ---
    (function shiftLastCheckpointMobile() {
      const isMobile = window.matchMedia("(max-width: 1029px)").matches;
      if (!isMobile) return;
      if (!checkpoints.length) return;

      const extraDownPx = cfg.lastCpExtraDownMobile ?? 0; // сколько опустить (в px)
      if (!extraDownPx) return;

      const lastCp = checkpoints[checkpoints.length - 1];

      // 1) берём текущую точку на пути по длине
      const p0 = mainPath.getPointAtLength(lastCp.atLen);

      // 2) целевая точка: та же X, но ниже по Y
      const target = { x: p0.x, y: p0.y + extraDownPx };

      // 3) находим "настоящую" длину пути, ближайшую к этой целевой точке
      const newLen = findNearestLenInRange(target, lastCp.atLen, totalLen);

      // 4) обновляем atLen (ЭТО фиксит раннее появление)
      lastCp.atLen = newLen;

      // 5) и переставляем галочку в новую точку пути (плюс твой общий y-offset для mobile)
      const p1 = mainPath.getPointAtLength(newLen);
      const yOff = cfg.cpYOffsetMobile; // как в createCheckpoint():contentReference[oaicite:3]{index=3}
      lastCp.g.setAttribute("transform", `translate(${p1.x} ${p1.y + yOff})`);
      lastCp.x = p1.x;
      lastCp.y = p1.y;
    })();
  }

  function update() {
    if (window.__imgModalOpen) return;
    if (!segments.length || totalLen <= 0) return;

    const y = window.__smoothScrollY ?? window.scrollY;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    let revealed = 0;
    let lastSegP = 0;

    for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    let p = clamp((y - s.start) / (s.end - s.start), 0, 1);

    if (i === segments.length - 1 && checkpoints.length) {
      const lastCp = checkpoints[checkpoints.length - 1];

      const thresholdLen = lastCp.atLen + cfg.cpWindow;

      const lastSeg = s;
      const beforeLast = totalLen - lastSeg.len;

      const thresholdP = clamp((thresholdLen - beforeLast) / lastSeg.len, 0, 1);

      if (p > thresholdP) {
        const tail = p - thresholdP;
        p = clamp(thresholdP + tail * cfg.afterLastCpSpeed, 0, 1);
      }
    }

    revealed += s.len * p;
    if (i === segments.length - 1) lastSegP = p;
  }

    if (maxScroll - y <= cfg.bottomSnapPx) {
      revealed = totalLen;
      lastSegP = 1;
    }

    const off = totalLen - clamp(revealed, 0, totalLen);
    shadowPath.style.strokeDashoffset = off;
    mainPath.style.strokeDashoffset = off;

    updateCheckpoints(revealed);

    const distToBottom = maxScroll - y;

    const reachedFooterNow = (lastSegP >= 0.999) || (revealed >= totalLen - 0.5);

    if (reachedFooterNow) {
      __footerArmed = true;
      if (__footerState !== true) __footerState = true;
    }

    if (__footerArmed && __footerState === true && distToBottom >= cfg.footerFalseDelayPx) {
      __footerState = false;
    }

    window.__roadState.atFooter = (__footerState === true);

    if (!flagEl) flagEl = document.querySelector(".footer-flag"); // ✅ найдем, когда появится в DOM

    if (flagEl) {
      const atFooter = (window.__roadState.atFooter === true); // true/false
      if (__flagPrev !== atFooter) {

        document.documentElement.style.setProperty("--flag-y", atFooter ? "-81%" : "-42%");
        __flagPrev = atFooter;
      }
    }

    if (__footerState !== null && __atFooterPrev !== __footerState) {
      __atFooterPrev = __footerState;
      console.log("Road at footer:", __footerState, "| distToBottom:", Math.round(distToBottom));
    }
  }

let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
let isRunning = false;

const SMOOTH_FACTOR = 0.05;

function animateScroll() {
  currentScroll += (targetScroll - currentScroll) * SMOOTH_FACTOR;

  window.__smoothScrollY = currentScroll;

  update();

  if (Math.abs(targetScroll - currentScroll) > 0.1) {
    requestAnimationFrame(animateScroll);
  } else {
    currentScroll = targetScroll;
    window.__smoothScrollY = currentScroll;
    update();
    isRunning = false;
  }
}

window.addEventListener("scroll", () => {
  // если попросили "без анимации" — синкаем сразу
  if (window.__roadNoSmoothOnce) {
    window.__roadNoSmoothOnce--;

    targetScroll = window.scrollY;
    currentScroll = targetScroll;
    window.__smoothScrollY = currentScroll;

    isRunning = false;   // важно: не оставлять хвост анимации
    update();
    return;
  }

  targetScroll = window.scrollY;

  if (!isRunning) {
    isRunning = true;
    requestAnimationFrame(animateScroll);
  }
}, { passive: true });

let resizeTimer = 0;

const isRoadFrozen = () => {
  const t = window.__roadFreezeUntil || 0;
  return window.__imgModalOpen || performance.now() < t;
};

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (isRoadFrozen()) return;
    rebuild();
    update();
  }, 200);
});

if (window.visualViewport) {
  visualViewport.addEventListener("resize", () => {
    if (isRoadFrozen()) return;
    rebuild();
    update();
  });
}

  window.__roadAPI = {
    rebuild,
    update,
    snapshot() {
      return {
        dash: mainPath.style.strokeDashoffset,
        dashShadow: shadowPath.style.strokeDashoffset,
        // на всякий — длина (если вдруг где-то сравниваешь)
        totalLen
      };
    },
    restore(snap) {
      if (!snap) return;
      // не пересчитываем revealed, просто возвращаем визуальное состояние 1:1
      mainPath.style.strokeDashoffset = snap.dash;
      shadowPath.style.strokeDashoffset = snap.dashShadow;
    }
  };
})();

window.setFooterLayer = function(mode){

  document.documentElement.style.setProperty(
    "--footer-z",
    mode === "above" ? "10" : "1"
  );
};

document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.getElementById("storeButtons");
  if (!wrap) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {

        wrap.classList.remove("is-inview");
        void wrap.offsetWidth; // reflow
        wrap.classList.add("is-inview");
      } else {
        wrap.classList.remove("is-inview");
      }
    });
  }, { threshold: 0.35 });

  io.observe(wrap);
});

document.addEventListener("DOMContentLoaded", () => {
  const dlg = document.getElementById("imgModal");
  if (!dlg) return;

  const body = dlg.querySelector(".img-modal__body");
  const closeBtn = dlg.querySelector(".img-modal__close");

  const flyouts = Array.from(document.querySelectorAll(".flyout"));
  window.__imgModalOpen = false;

  // ===== Scroll lock for modal (no jump on close) =====
  const htmlEl = document.documentElement;
  let savedScrollY = 0;
  let savedTop = "";
  let savedRoadSnap = null;

    function lockScroll() {
      savedScrollY = window.scrollY || 0;

      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);

      // ✅ добавляем класс на html (чтобы отключить scrollbar-gutter)
      document.documentElement.classList.add("modal-lock");

      document.body.classList.add("modal-lock");
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

      function unlockScroll() {
      const y = savedScrollY;

      document.documentElement.classList.add("no-smooth");

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      document.body.classList.remove("modal-lock");

      // ✅ убираем класс на html (возвращаем gutter как было)
      document.documentElement.classList.remove("modal-lock");

      document.documentElement.style.setProperty("--sbw", "0px");
      window.scrollTo(0, y);

      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-smooth");
      });
    }

    // делаем их “кликабельными” и с клавиатуры тоже
    flyouts.forEach((el) => {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Open image");
    });

    function openFromFlyout(srcEl){
      // чистим содержимое
      body.innerHTML = "";

      // клон плейсхолдера (потом ты просто заменишь .flyout на <img>, логика останется)
      const clone = srcEl.cloneNode(true);

      // убрать классы направления, чтобы не было смещений
      clone.classList.remove("left", "right", "visible");

      body.appendChild(clone);

      // на время модалки запрещаем rebuild дороги от ResizeObserver/resize
    window.__roadFreezeUntil = performance.now() + 800; // 0.8 сек достаточно
      if (window.__phoneAPI) window.__phoneAPI.freeze();
      savedRoadSnap = window.__roadAPI ? window.__roadAPI.snapshot() : null;
      lockScroll();        // <-- ДО showModal()
      window.__imgModalOpen = true;
      dlg.showModal();
      closeBtn.focus();
      
    }

    window.__phoneAPI = {
  freeze() {
    phoneFrozen = true;
    phoneFrozenTransform = phone.style.transform || getComputedStyle(phone).transform;
    // фиксируем transform, чтобы он не "скакал"
    phone.style.transform = phoneFrozenTransform;
    phone.style.transition = "none";
  },
  unfreeze() {
    phoneFrozen = false;
    // вернём transition как было у тебя
    phone.style.transition = "transform 0.05s linear";
    // принудительно оставляем тот же transform до следующего реального скролла
    if (phoneFrozenTransform) phone.style.transform = phoneFrozenTransform;
  }
};

    function closeModal(){
      if (dlg.open) dlg.close();
      
    }

  flyouts.forEach((el) => {
    el.addEventListener("click", () => openFromFlyout(el));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFromFlyout(el);
      }
    });
  });

  // закрытие по крестику
  closeBtn.addEventListener("click", closeModal);

  // закрытие по клику на фон (backdrop)
  dlg.addEventListener("click", (e) => {
    const rect = body.getBoundingClientRect();
    const inBox =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;

    if (!inBox) closeModal();

  });

  dlg.addEventListener("close", () => {
    // 1) Фриз должен быть ДОЛЬШЕ, чем твой resize debounce (200ms) + запас
    window.__roadFreezeUntil = performance.now() + 900;

    window.__roadNoSmoothOnce = 2; // на всякий: иногда браузер даст 2 scroll-события
    // 2) ДЕРЖИМ режим "модалка открыта" пока возвращаем скролл,
    //    чтобы update() в этот момент не дергался
    window.__imgModalOpen = true;

    // 3) Возвращаем страницу в сохранённую позицию
    unlockScroll();
    if (window.__roadAPI) window.__roadAPI.restore(savedRoadSnap);
    if (window.__phoneAPI) window.__phoneAPI.unfreeze();
    targetScroll = savedScrollY;
    currentScroll = savedScrollY;
    window.__smoothScrollY = savedScrollY;
    if (window.__roadAPI) window.__roadAPI.update();

    body.innerHTML = "";

    // 4) Синхронизируем сглаженный скролл сразу в нужную точку
    targetScroll = savedScrollY;
    currentScroll = savedScrollY;
    window.__smoothScrollY = savedScrollY;

    // 5) Снимаем "modalOpen" только ПОСЛЕ того, как браузер закончит ресайзы:
    //    2 кадра обычно достаточно, плюс мы держим freezeUntil 900ms.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.__imgModalOpen = false;

        // один финальный update — дорожка останется на том же месте
        if (window.__roadAPI) window.__roadAPI.update();
      });
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;

  const KEY = "site-theme-invert";

  function applyTheme(isInvert){
    document.documentElement.classList.toggle("theme-invert", isInvert);
    btn.setAttribute("aria-pressed", isInvert ? "true" : "false");

    try {
      localStorage.setItem(KEY, isInvert ? "1" : "0");
    } catch(e) {}
  }

  let isInvert = false;
  try {
    isInvert = localStorage.getItem(KEY) === "1";
  } catch(e) {}

  applyTheme(isInvert);

  btn.addEventListener("click", () => {
    isInvert = !isInvert;
    applyTheme(isInvert);
  });
});

document.addEventListener("copy", e => e.preventDefault());
document.addEventListener("cut", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("touchstart", (e) => {
  if (e.touches.length > 1) return;
}, { passive: true });

document.addEventListener("dragstart", e => e.preventDefault());