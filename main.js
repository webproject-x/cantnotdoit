document.addEventListener("DOMContentLoaded", () => {
  const dd = document.getElementById("langDD");
  const btn = document.getElementById("langBtn");
  const menu = document.getElementById("langMenu");
  const txt = document.getElementById("langTxt");
  if (!dd || !btn || !menu || !txt) return;

  const KEY = "site_lang";
  const items = Array.from(menu.querySelectorAll(".lang-dd__item"));

  const labels = { en: "English", ru: "Русский" };

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
        "Фиксируйте идеи сразу, как только они появляются. Приложение помогает быстро превратить заметки в понятные задачи, чтобы ни одна мысль не потерялась и сразу получила практическое продолжение.",
        "Сосредоточьтесь на том, что действительно важно. Система приоритетов помогает выделить ключевые задачи, правильно распределить внимание и не тратить время на менее значимые дела.",
        "Планируйте день в удобной и понятной структуре. Задачи распределяются по времени так, чтобы нагрузка была более сбалансированной, а рабочий процесс — более организованным и предсказуемым.",
        "Не упускайте важные дела из виду. Напоминания помогают вовремя возвращаться к задачам, соблюдать намеченный план и поддерживать стабильный ритм выполнения в течение дня.",
        "Следите за прогрессом и двигайтесь к результату шаг за шагом. Наглядное выполнение задач делает процесс более понятным, позволяет видеть движение вперёд и поддерживает мотивацию в работе.",
        "Держите весь процесс в одной системе — от записи идеи до завершения задачи. Это делает планирование более целостным, удобным и понятным, а работу с задачами — более последовательной."
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
        "Capture ideas the moment they appear. The app helps turn quick notes into clear tasks so that no important thought gets lost and every idea can move into action.",
        "Focus on what truly matters. The priority system helps highlight key tasks, direct your attention more effectively, and avoid spending time on less important work.",
        "Plan your day in a clear and practical structure. Tasks are arranged across time blocks to create a more balanced workload and a workflow that feels more organized and predictable.",
        "Stay on top of important tasks. Timely reminders help you return to your work when needed, follow your plan, and maintain a steady rhythm throughout the day.",
        "Track your progress and move toward results step by step. Clear progress visibility makes the process easier to follow, shows steady forward movement, and helps maintain motivation.",
        "Keep the entire process in one system, from capturing an idea to completing a task. This makes planning more consistent, more convenient, and easier to manage in everyday work."
      ]
    }
  };

  function applyI18n(lang) {
    const t = I18N[lang] || I18N.en;

    const taglineEl = document.querySelector(".title p");
    if (taglineEl) taglineEl.textContent = t.tagline; 

    const idle = document.querySelector(".cta-label--idle");
    if (idle) idle.textContent = t.ctaDownload;

    const loaderText = document.querySelector(".cta-loader-text");
    if (loaderText) loaderText.textContent = t.ctaLoading;

    const done = document.querySelector(".cta-label--done");
    if (done) {
      const txtNode = Array.from(done.childNodes).find(
        n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length
      );
      if (txtNode) txtNode.textContent = " " + t.ctaInstalled;
    }

    const hint = document.querySelector(".screen-hint");
    if (hint) hint.textContent = t.hint;

    const fly = Array.from(document.querySelectorAll(".flyout-text"));
    fly.forEach((el, i) => {
      if (!t.flyouts[i]) return;

    el.dataset.text = t.flyouts[i];
      el.dataset.typed = "0";
      el.dataset.twToken = String(Number(el.dataset.twToken || "0") + 1);

      const isMobileText =
        window.matchMedia("(max-width: 1150px), (hover: none) and (pointer: coarse)").matches;

      if (isMobileText || el.classList.contains("visible")) {
        el.textContent = t.flyouts[i];
        el.dataset.typed = "1";
      } else {
        el.textContent = "";
      }
    });

    if (typeof prepareAllFlyoutTextHeights === "function") {
      prepareAllFlyoutTextHeights(true);
    }

    requestAnimationFrame(() => {
      if (typeof prepareAllFlyoutTextHeights === "function") {
        prepareAllFlyoutTextHeights(true);
      }
    });

    document.querySelectorAll(".store-top").forEach(el => {
      el.textContent = t.storeTop;
    });

    const copy = document.querySelector(".footer-copy");
    if (copy) copy.textContent = t.footerCopy;
  }

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


      requestAnimationFrame(() => {
      if (window.__roadAPI) {
        window.__roadAPI.rebuild();
        window.__roadAPI.update();
      }
    });
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

  const startRotateY = -28;
  const startRotateX = 5;
  const startZ = 18;

  const endRotateY = 0;
  const endRotateX = 0;
  const endZ = 40;

  function updatePhoneRotation() {
    if (window.__imgModalOpen || phoneFrozen) return;
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

      const tPressStart = 0.26;  
      const tPressEnd   = 0.34;   
      const tLoadingEnd = 0.86;  

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
  updatePhoneRotation();

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

  const cs = getComputedStyle(el);
  const clone = document.createElement("div");

  clone.style.position = "absolute";
  clone.style.left = "-99999px";
  clone.style.top = "0";
  clone.style.visibility = "hidden";
  clone.style.pointerEvents = "none";

  clone.style.boxSizing = cs.boxSizing;
  clone.style.width = cs.width;
  clone.style.maxWidth = cs.maxWidth;

  clone.style.fontFamily = cs.fontFamily;
  clone.style.fontSize = cs.fontSize;
  clone.style.fontWeight = cs.fontWeight;
  clone.style.lineHeight = cs.lineHeight;
  clone.style.letterSpacing = cs.letterSpacing;
  clone.style.textAlign = cs.textAlign;

  clone.style.whiteSpace = "normal";
  clone.style.wordBreak = cs.wordBreak;
  clone.style.overflowWrap = cs.overflowWrap;
  clone.style.hyphens = cs.hyphens;

  clone.style.padding = cs.padding;
  clone.style.border = cs.border;
  clone.style.borderRadius = cs.borderRadius;

  clone.textContent = text;
  document.body.appendChild(clone);

  const h = Math.ceil(clone.getBoundingClientRect().height);

  el.style.minHeight = h + "px";
  el.style.height = h + "px";
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

    cancelAnimationFrame(prepareAllFlyoutTextHeights._raf || 0);
    prepareAllFlyoutTextHeights._raf = requestAnimationFrame(() => {
      prepareAllFlyoutTextHeights(true);
    });
  });

  document.querySelectorAll('.flyout-text-stack').forEach((stack) => ro.observe(stack));
}

const MOBILE_TEXT_MODE = window.matchMedia("(max-width: 1150px), (hover: none) and (pointer: coarse)").matches;

const TYPE_CHAR_MS = 10; 

function typeWrite(el, text) {
  const token = String((Number(el.dataset.twToken || "0") + 1));
  el.dataset.twToken = token;

  if (MOBILE_TEXT_MODE) {
    el.textContent = text;
    return;
  }

  el.textContent = "";
  let startTime = null;
  let lastCount = 0;

  function step(now) {
    if (el.dataset.twToken !== token) return;

    if (startTime === null) startTime = now;

    const elapsed = now - startTime;
    const count = Math.min(text.length, Math.floor(elapsed / TYPE_CHAR_MS));

    if (count !== lastCount) {
      el.textContent = text.slice(0, count);
      lastCount = count;
    }

    if (count < text.length) {
      requestAnimationFrame(step);
    } else {
      el.textContent = text;
    }
  }

  requestAnimationFrame(step);
}

    let lastScroll = 0;

  const PHONE_ONLY_MODE = window.matchMedia("(max-width: 768px) and (pointer: coarse)").matches;
  
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

    if (PHONE_ONLY_MODE) {

      if (rect.top < enterPoint) {
        block.classList.add('visible');
        text.classList.add('visible');
      }

      if (!directionDown && rect.top > leavePoint) {
        block.classList.remove('visible');
        text.classList.remove('visible');
      }

      return;
    }

    if (rect.top < enterPoint) {
      block.classList.add('visible');
      text.classList.add('visible');

      if (!MOBILE_TEXT_MODE && text.dataset.typed !== "1") {
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


    if (MOBILE_TEXT_MODE) {
      texts.forEach((text) => {
        const value = text.dataset.text || "";
        prepareHeight(text, value, true);
        text.textContent = value;
        text.dataset.typed = "1";
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
    afterLastCpSpeed: 2,
    segOverlapPx: 120,
    footerFalseDelayPx: 250,
    cpYOffset: 0,
    cpYOffsetMobile: -11,
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

  let segments = [];
  let totalLen = 0;
  let checkpoints = [];
  let cornerHints = [];
  let __atFooterPrev = null;
  window.__roadState = window.__roadState || { atFooter: false };
  let __footerState = null;
  let __footerArmed = false;
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

    const fill = document.createElementNS(SVG_NS, "circle");
    fill.setAttribute("r", String(cfg.cpR));
    fill.setAttribute("fill", "#fff");
    fill.setAttribute("opacity", "0");
    fill.setAttribute("filter", "url(#cpShadow)");

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
      corner: { x: entry.x, y: yMid }
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

    const isNarrow = window.matchMedia("(max-width: 1150px)").matches;
    const isSmall = window.matchMedia("(max-width: 600px)").matches;
    const centerX = window.innerWidth * 0.5;
    const isBelow1514 = window.matchMedia("(max-width: 1514px)").matches;

    if (isNarrow) {
      cfg.radius = 40;
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

      const cpGap = 10;
      const desiredCpY = r.top - cfg.cpR - cpGap;
      const cpY = Math.min(entry.y - 1, Math.max(from.y + 1, desiredCpY));

      exit = { x: centerX, y: r.top + r.height / 2 };

      built = {
        d: roundedPolylineD(
          [
            from,
            { x: centerX, y: from.y },
            { x: centerX, y: entry.y },
            exit
          ],
          Math.min(cfg.radius, 40)
        ),
        corner: { x: centerX, y: cpY }
      };
    } else {
    const isLeft = el.classList.contains("left");
    const isLastFlyout = idx === flyouts.length - 1;
    const sideY = r.top + r.height / 2;
    const sideEdgeX = isLeft ? r.right : r.left;

    let exitStub = cfg.exitStub;

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
       
    (function shiftLastCheckpointMobile() {
      const isMobile = window.matchMedia("(max-width: 1029px)").matches;
      if (!isMobile) return;
      if (!checkpoints.length) return;

      const extraDownPx = cfg.lastCpExtraDownMobile ?? 0;
      if (!extraDownPx) return;

      const lastCp = checkpoints[checkpoints.length - 1];

      const p0 = mainPath.getPointAtLength(lastCp.atLen);

      const target = { x: p0.x, y: p0.y + extraDownPx };

      const newLen = findNearestLenInRange(target, lastCp.atLen, totalLen);

      lastCp.atLen = newLen;

      const p1 = mainPath.getPointAtLength(newLen);
      const yOff = cfg.cpYOffsetMobile;
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

    if (!flagEl) flagEl = document.querySelector(".footer-flag");

    if (flagEl) {
      const atFooter = (window.__roadState.atFooter === true);
      const storeWrap = document.getElementById("storeButtons");
      if (storeWrap) {
        storeWrap.classList.toggle("is-inview", atFooter);
      }
      if (__flagPrev !== atFooter) {

        document.documentElement.style.setProperty("--flag-y", atFooter ? "-81%" : "-42%");
        __flagPrev = atFooter;
      }
    }

    if (__footerState !== null && __atFooterPrev !== __footerState) {
      __atFooterPrev = __footerState;
      //console.log("Road at footer:", __footerState, "| distToBottom:", Math.round(distToBottom));
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
  if (window.__roadNoSmoothOnce) {
    window.__roadNoSmoothOnce--;

    targetScroll = window.scrollY;
    currentScroll = targetScroll;
    window.__smoothScrollY = currentScroll;

    isRunning = false;
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
        totalLen
      };
    },
    restore(snap) {
      if (!snap) return;
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
  const dlg = document.getElementById("imgModal");
  if (!dlg) return;

  const body = dlg.querySelector(".img-modal__body");
  const closeBtn = dlg.querySelector(".img-modal__close");

  const flyouts = Array.from(document.querySelectorAll(".flyout"));
  window.__imgModalOpen = false;

  const htmlEl = document.documentElement;
  let savedScrollY = 0;
  let savedTop = "";
  let savedRoadSnap = null;
  const MODAL_DUR = 240;
  let closeTimer = 0;
  let modalClosing = false;

    function lockScroll() {
      savedScrollY = window.scrollY || 0;

      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${sbw}px`);

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

      document.documentElement.classList.remove("modal-lock");

      document.documentElement.style.setProperty("--sbw", "0px");
      window.scrollTo(0, y);

      requestAnimationFrame(() => {
        document.documentElement.classList.remove("no-smooth");
      });
    }

    flyouts.forEach((el) => {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Open image");
    });

    function openFromFlyout(srcEl){
      body.innerHTML = "";

      const clone = srcEl.cloneNode(true);

      clone.classList.remove("left", "right", "visible");

      body.appendChild(clone);

    window.__roadFreezeUntil = performance.now() + 800;
      if (window.__phoneAPI) window.__phoneAPI.freeze();
      savedRoadSnap = window.__roadAPI ? window.__roadAPI.snapshot() : null;
      lockScroll();
      window.__imgModalOpen = true;
      clearTimeout(closeTimer);
      modalClosing = false;
      dlg.classList.remove("is-open", "is-closing");
      dlg.showModal();
      requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dlg.classList.add("is-open");
      });
    });
      closeBtn.focus();
      
    }

    window.__phoneAPI = {
  freeze() {
    phoneFrozen = true;
    phoneFrozenTransform = phone.style.transform || getComputedStyle(phone).transform;
    phone.style.transform = phoneFrozenTransform;
    phone.style.transition = "none";
  },
  unfreeze() {
    phoneFrozen = false;
    phone.style.transition = "transform 0.05s linear";
    if (phoneFrozenTransform) phone.style.transform = phoneFrozenTransform;
  }
};

dlg.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal();
});

function closeModal(){
  if (!dlg.open || modalClosing) return;

  modalClosing = true;
  dlg.classList.remove("is-open");
  dlg.classList.add("is-closing");

  clearTimeout(closeTimer);
  closeTimer = window.setTimeout(() => {
    dlg.classList.remove("is-closing");
    if (dlg.open) dlg.close();
    modalClosing = false;
  }, MODAL_DUR);
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

  closeBtn.addEventListener("click", closeModal);

  dlg.addEventListener("click", (e) => {
    const rect = body.getBoundingClientRect();
    const inBox =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom;

    if (!inBox) closeModal();

  });

  dlg.addEventListener("close", () => {
    clearTimeout(closeTimer);
    modalClosing = false;
    dlg.classList.remove("is-open", "is-closing");
    window.__roadFreezeUntil = performance.now() + 900;

    window.__roadNoSmoothOnce = 2;
    window.__imgModalOpen = true;

    unlockScroll();
    if (window.__roadAPI) window.__roadAPI.restore(savedRoadSnap);
    if (window.__phoneAPI) window.__phoneAPI.unfreeze();
    targetScroll = savedScrollY;
    currentScroll = savedScrollY;
    window.__smoothScrollY = savedScrollY;
    if (window.__roadAPI) window.__roadAPI.update();

    body.innerHTML = "";

    targetScroll = savedScrollY;
    currentScroll = savedScrollY;
    window.__smoothScrollY = savedScrollY;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.__imgModalOpen = false;

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