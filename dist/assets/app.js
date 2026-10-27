(() => {
  "use strict";

  const STORAGE_KEY = "mateng-progress-v1";
  const app = document.getElementById("app");
  const curriculum = window.MATENG_CURRICULUM || [];
  const lessonStages = ["Khám phá", "Hiểu", "Ghép câu", "Nói", "Vận dụng", "Hoàn thành"];
  let onboardingGrade = 1;
  let lessonSession = null;
  let mediaRecorder = null;
  let mediaStream = null;
  let audioChunks = [];
  let audioUrl = null;

  const defaultState = {
    onboarded: false,
    grade: 1,
    completed: {},
    review: {},
    streak: 0,
    lastActive: null,
    sound: true
  };

  const state = loadState();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return { ...defaultState, ...(saved || {}) };
    } catch {
      return { ...defaultState };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function icon(name) {
    const paths = {
      home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10M9.5 20v-6h5v6"/>',
      learn: '<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v16H7.5A3.5 3.5 0 0 0 4 21.5z"/><path d="M4 5.5v16M8 7h8M8 11h7"/>',
      review: '<path d="M20 11a8 8 0 1 1-2.34-5.66"/><path d="M20 4v7h-7"/>',
      adult: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      sound: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
      muted: '<path d="M11 5 6 9H3v6h3l5 4zM17 9l4 4M21 9l-4 4"/>',
      lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      arrow: '<path d="m9 18 6-6-6-6"/>',
      spark: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</svg>`;
  }

  function getGrade(grade = state.grade) {
    return curriculum.find((item) => item.id === Number(grade)) || curriculum[0];
  }

  function allLessons(grade = state.grade) {
    return getGrade(grade).units.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unit })));
  }

  function findLesson(id) {
    for (const grade of curriculum) {
      for (const unit of grade.units) {
        const lesson = unit.lessons.find((item) => item.id === id);
        if (lesson) return { ...lesson, unit, grade };
      }
    }
    return null;
  }

  function nextLesson() {
    const lessons = allLessons();
    return lessons.find((lesson) => !state.completed[lesson.id]) || lessons[0];
  }

  function completedCount(grade = state.grade) {
    return allLessons(grade).filter((lesson) => state.completed[lesson.id]).length;
  }

  function shell(content, active = "home") {
    const nav = [
      ["home", "Hôm nay", "home"],
      ["learn", "Bài học", "learn"],
      ["review", "Ôn tập", "review"],
      ["adult", "Người lớn", "adult"]
    ];
    const navButtons = nav.map(([route, label, ico]) => `<button class="nav-button ${active === route ? "active" : ""}" data-route="${route}" aria-current="${active === route ? "page" : "false"}">${icon(ico)}<span>${label}</span></button>`).join("");
    return `
      <header class="topbar">
        <div class="topbar-inner">
          <button class="brand" data-route="home" aria-label="Về trang hôm nay"><span class="brand-mark"></span><span>MatEng</span></button>
          <nav class="desktop-nav" aria-label="Điều hướng chính">${navButtons}</nav>
          <span class="topbar-spacer"></span>
          <button class="grade-chip" data-action="open-grade-picker" aria-label="Đổi lớp, đang học lớp ${state.grade}" aria-haspopup="dialog" aria-expanded="false"><span>Lớp ${state.grade}</span><span class="grade-chip-caret" aria-hidden="true">⌄</span></button>
          <button class="icon-button" data-action="toggle-sound" aria-label="${state.sound ? "Tắt âm thanh" : "Bật âm thanh"}">${icon(state.sound ? "sound" : "muted")}</button>
        </div>
      </header>
      <div class="grade-picker-backdrop" data-grade-picker hidden>
        <section class="grade-picker" role="dialog" aria-modal="true" aria-labelledby="grade-picker-title">
          <div class="grade-picker-header">
            <div><p class="eyebrow">Chọn chương trình</p><h2 id="grade-picker-title">Con đang học lớp mấy?</h2></div>
            <button class="grade-picker-close" data-action="close-grade-picker" aria-label="Đóng bộ chọn lớp">×</button>
          </div>
          <p class="subtle">Chuyển lớp bất cứ lúc nào. Tiến độ của từng bài vẫn được giữ nguyên trên thiết bị này.</p>
          <div class="grade-picker-grid">
            ${curriculum.map((grade) => {
              const active = grade.id === state.grade;
              const total = grade.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
              return `<button class="grade-picker-option ${active ? "active" : ""}" data-action="choose-grade" data-grade="${grade.id}" aria-pressed="${active}"><span class="grade-picker-number">${grade.id}</span><span><strong>Lớp ${grade.id}</strong><small>${total} bài · ${grade.note}</small></span>${active ? '<span class="grade-picker-check" aria-hidden="true">✓</span>' : ""}</button>`;
            }).join("")}
          </div>
        </section>
      </div>
      <main id="app-main">${content}</main>
      <nav class="bottom-nav" aria-label="Điều hướng di động">${navButtons}</nav>
    `;
  }

  function openGradePicker() {
    const picker = document.querySelector("[data-grade-picker]");
    if (!picker) return;
    picker.hidden = false;
    document.body.classList.add("grade-picker-open");
    document.querySelector('[data-action="open-grade-picker"]')?.setAttribute("aria-expanded", "true");
    picker.querySelector(".grade-picker-option.active")?.focus();
  }

  function closeGradePicker() {
    const picker = document.querySelector("[data-grade-picker]");
    if (!picker || picker.hidden) return;
    picker.hidden = true;
    document.body.classList.remove("grade-picker-open");
    const trigger = document.querySelector('[data-action="open-grade-picker"]');
    trigger?.setAttribute("aria-expanded", "false");
    trigger?.focus();
  }

  function chooseGrade(grade) {
    const selected = curriculum.find((item) => item.id === Number(grade));
    if (!selected) return;
    const changed = state.grade !== selected.id;
    state.grade = selected.id;
    saveState();
    stopRecording();
    lessonSession = null;
    document.body.classList.remove("grade-picker-open");
    history.replaceState(null, "", `${location.pathname}${location.search}`);
    renderHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast(changed ? `Đã chuyển sang lớp ${state.grade}.` : `Con đang học lớp ${state.grade}.`);
  }

  function renderOnboarding() {
    app.innerHTML = `
      <main class="onboarding" id="app-main">
        <section class="onboarding-art" aria-label="Giới thiệu MatEng">
          <div class="onboarding-logo"><span class="brand-mark"></span> MatEng</div>
          <h1>Toán con đã biết.<br><span>Tiếng Anh con sẽ nói.</span></h1>
          <div class="onboarding-illustration" aria-hidden="true">
            <div class="number-block">3</div><div class="number-block">＋</div><div class="number-block">2</div>
          </div>
        </section>
        <section class="onboarding-panel">
          <div class="onboarding-form">
            <p class="eyebrow">Bắt đầu trong 10 giây</p>
            <h2>Con đang học lớp mấy?</h2>
            <p class="subtle">MatEng sẽ chọn bài Toán vừa sức. Tiếng Anh luôn ngắn và có hình minh họa.</p>
            <div class="grade-options" role="radiogroup" aria-label="Chọn lớp">
              ${curriculum.map((grade) => `<button class="grade-option ${onboardingGrade === grade.id ? "selected" : ""}" data-action="select-onboarding-grade" data-grade="${grade.id}" role="radio" aria-checked="${onboardingGrade === grade.id}">Lớp ${grade.id}<span>${grade.units.length * 2} bài</span></button>`).join("")}
            </div>
            <button class="primary-button blue full" data-action="finish-onboarding">Bắt đầu học</button>
            <p class="privacy-note">${icon("lock")} Không cần tài khoản. Tiến độ chỉ được lưu trên thiết bị này và không gửi đi đâu.</p>
          </div>
        </section>
      </main>
    `;
  }

  function renderHome() {
    const grade = getGrade();
    const lesson = nextLesson();
    const total = allLessons().length;
    const done = completedCount();
    const percent = Math.round((done / total) * 100);
    const content = `
      <div class="page">
        <section class="home-hero">
          <div class="hero-copy">
            <p class="eyebrow">Mỗi ngày một câu Toán</p>
            <h1>Nói tiếng Anh<br>từ điều con<br><strong>đã hiểu.</strong></h1>
            <p class="subtle">Mỗi bài chỉ mất 5–8 phút: nhìn, nghe, ghép câu, nói và dùng ngay trong một bài Toán quen thuộc.</p>
            <div class="hero-tags"><span class="tag">Không áp lực thời gian</span><span class="tag">Câu thật ngắn</span><span class="tag">Học bằng hình</span></div>
          </div>
          <article class="today-card">
            <div class="today-top"><span class="today-label">Bài tiếp theo</span><span class="lesson-time">${icon("clock")} ${lesson.minutes} phút</span></div>
            <div class="lesson-visual-mini" aria-hidden="true">${miniVisual(lesson.visual)}</div>
            <h2>${lesson.title}</h2>
            <p>${lesson.sentence}</p>
            <button class="primary-button full" data-lesson="${lesson.id}">${state.completed[lesson.id] ? "Học lại bài này" : "Học ngay"} →</button>
          </article>
        </section>

        <section>
          <div class="section-heading">
            <div><p class="eyebrow">Lộ trình lớp ${grade.id}</p><h2>Đi từng bước nhỏ</h2><p class="subtle">${grade.note}</p></div>
            <div style="min-width:210px"><div class="subtle" style="font-size:.8rem;margin-bottom:7px">Đã xong ${done}/${total} bài</div><div class="progress-line"><span style="width:${percent}%"></span></div></div>
          </div>
          <div class="unit-grid">
            ${grade.units.map((unit) => unitCard(unit)).join("")}
          </div>
        </section>
      </div>`;
    app.innerHTML = shell(content, "home");
  }

  function unitCard(unit) {
    const completed = unit.lessons.filter((lesson) => state.completed[lesson.id]).length;
    return `<button class="unit-card" data-unit="${unit.id}">
      <span class="unit-symbol" aria-hidden="true">${unit.emoji}</span>
      <span><h3>${unit.title}</h3><p>${unit.description}</p><span class="unit-meta">${completed}/${unit.lessons.length} bài · ${unit.enTitle}</span></span>
      <span class="unit-arrow" aria-hidden="true">→</span>
    </button>`;
  }

  function renderLibrary(unitId = null) {
    const grade = getGrade();
    const selected = grade.units.find((unit) => unit.id === unitId);
    const content = selected ? `
      <div class="page">
        <button class="ghost-button" data-route="learn">← Tất cả chủ đề</button>
        <div class="page-title" style="margin-top:24px"><p class="eyebrow">${selected.enTitle}</p><h1>${selected.title}</h1><p class="subtle">${selected.description}</p></div>
        <section class="surface-card unit-detail">
          <div class="lesson-list">${selected.lessons.map((lesson, index) => lessonRow(lesson, index)).join("")}</div>
        </section>
      </div>` : `
      <div class="page">
        <div class="page-title"><p class="eyebrow">Chương trình lớp ${grade.id}</p><h1>Bài học của con</h1><p class="subtle">Mỗi chủ đề chỉ có hai bài ngắn. Con có thể học lại bất cứ lúc nào.</p></div>
        <div class="unit-grid">${grade.units.map((unit) => unitCard(unit)).join("")}</div>
      </div>`;
    app.innerHTML = shell(content, "learn");
  }

  function lessonRow(lesson, index) {
    const complete = Boolean(state.completed[lesson.id]);
    return `<button class="lesson-row ${complete ? "complete" : ""}" data-lesson="${lesson.id}">
      <span class="lesson-index">${complete ? "✓" : index + 1}</span>
      <span><h3>${lesson.title}</h3><p>${lesson.sentence} · ${lesson.minutes} phút</p></span>
      <span class="lesson-state">${complete ? "Học lại" : "Bắt đầu"}</span>
    </button>`;
  }

  function startLesson(id) {
    const lesson = findLesson(id);
    if (!lesson) return navigate("home");
    stopRecording();
    lessonSession = {
      lesson,
      stage: 0,
      meaningAnswered: false,
      meaningCorrect: false,
      useAnswered: false,
      useCorrect: false,
      buildWords: shuffle(sentenceTokens(lesson.sentence)),
      built: [],
      recordingReady: false
    };
    location.hash = `lesson/${id}`;
    renderLesson();
  }

  function renderLesson() {
    if (!lessonSession) {
      const id = location.hash.split("/")[1];
      const found = findLesson(id);
      if (!found) return navigate("home");
      lessonSession = { lesson: found, stage: 0, meaningAnswered: false, meaningCorrect: false, useAnswered: false, useCorrect: false, buildWords: shuffle(sentenceTokens(found.sentence)), built: [], recordingReady: false };
    }
    const { lesson, stage } = lessonSession;
    const percent = Math.round(((stage + 1) / lessonStages.length) * 100);
    const stageContent = [renderDiscover, renderUnderstand, renderBuild, renderSpeak, renderUse, renderCelebrate][stage](lesson);
    app.innerHTML = shell(`
      <div class="page lesson-page">
        <div class="lesson-header">
          <button class="back-button" data-unit="${lesson.unit.id}" aria-label="Thoát bài học">←</button>
          <div class="lesson-progress"><div class="lesson-progress-labels"><span>${lessonStages[stage]}</span><span>${stage + 1}/${lessonStages.length}</span></div><div class="progress-line"><span style="width:${percent}%"></span></div></div>
        </div>
        ${stageContent}
      </div>`, "learn");
  }

  function renderDiscover(lesson) {
    return `<section class="lesson-stage-card">
      <div class="stage-kicker"><span class="stage-dot"></span> Nhìn và nghe</div>
      <div class="visual-stage">${renderVisual(lesson.visual)}</div>
      <div class="english-sentence">${lesson.sentence}</div>
      <p class="translation">${lesson.vi}</p>
      <div class="speech-row"><button class="secondary-button listen-button" data-speak="${escapeAttr(lesson.sentence)}">${icon("sound")} Nghe câu</button></div>
      <div class="word-list">${lesson.words.map((word) => `<span class="vocab-pill">${word.en}<small>${word.vi}</small></span>`).join("")}</div>
      <div class="stage-actions"><button class="primary-button blue" data-action="next-stage">Con đã hiểu →</button></div>
    </section>`;
  }

  function renderUnderstand(lesson) {
    const word = lesson.words[0];
    const distractors = getDistractors(word.en, lesson);
    const options = shuffle([word.vi, ...distractors]);
    return `<section class="lesson-stage-card">
      <div class="stage-kicker"><span class="stage-dot"></span> Nghe và hiểu</div>
      <div class="question-box"><p class="eyebrow" style="margin-top:28px">Từ mới</p><div class="question-display">${word.en}</div><h2>Từ này có nghĩa là gì?</h2></div>
      <div class="answer-grid">${options.map((option) => answerButton(option, word.vi, lessonSession.meaningAnswered, lessonSession.meaningCorrect, "meaning-answer")).join("")}</div>
      ${lessonSession.meaningAnswered ? feedback(lessonSession.meaningCorrect) : ""}
      <div class="stage-actions"><button class="primary-button blue" data-action="next-stage" ${lessonSession.meaningCorrect ? "" : "disabled"}>Tiếp tục →</button></div>
    </section>`;
  }

  function getDistractors(correctEn, lesson) {
    const words = allLessons().flatMap((item) => item.words).filter((word) => word.en !== correctEn).map((word) => word.vi);
    return [...new Set(words)].slice(0, 2);
  }

  function answerButton(option, answer, answered, isCorrect, action) {
    let cls = "";
    if (answered && option === answer) cls = "correct";
    else if (answered && !isCorrect) cls = "";
    return `<button class="answer-button ${cls}" data-action="${action}" data-value="${escapeAttr(option)}" ${answered ? "disabled" : ""}>${option}</button>`;
  }

  function feedback(correct) {
    return `<div class="feedback ${correct ? "correct" : "wrong"}" role="status">${correct ? "Chính xác! Con đã hiểu từ này." : "Chưa đúng. Mình nhìn lại một chút nhé."}</div>`;
  }

  function renderBuild(lesson) {
    const complete = normalizeSentence(lessonSession.built.join(" ")) === normalizeSentence(lesson.sentence);
    return `<section class="lesson-stage-card">
      <div class="stage-kicker"><span class="stage-dot"></span> Chạm để ghép câu</div>
      <h1 style="text-align:center">Xếp câu đúng</h1>
      <p class="translation">${lesson.vi}</p>
      <div class="build-zone">
        <div class="sentence-slots" aria-label="Câu đang ghép">${lessonSession.built.length ? lessonSession.built.map((word, i) => `<button class="word-chip" data-action="remove-word" data-index="${i}">${word}</button>`).join("") : '<span class="build-hint">Chạm vào các từ ở dưới</span>'}</div>
        <div class="word-bank" aria-label="Các từ để chọn">${lessonSession.buildWords.map((word, i) => `<button class="word-chip" data-action="add-word" data-index="${i}">${word}</button>`).join("")}</div>
        ${lessonSession.built.length && !complete ? '<button class="ghost-button" data-action="reset-build">Làm lại</button>' : ""}
        ${complete ? '<div class="feedback correct">Tuyệt! Con đã ghép đúng cả câu.</div>' : ""}
      </div>
      <div class="stage-actions"><button class="primary-button blue" data-action="next-stage" ${complete ? "" : "disabled"}>Tiếp tục →</button></div>
    </section>`;
  }

  function renderSpeak(lesson) {
    return `<section class="lesson-stage-card">
      <div class="stage-kicker"><span class="stage-dot"></span> Nghe rồi nói</div>
      <div class="english-sentence">${lesson.sentence}</div>
      <p class="translation">Bấm nghe, sau đó tự nói thật chậm.</p>
      <div class="speech-row"><button class="secondary-button listen-button" data-speak="${escapeAttr(lesson.sentence)}">${icon("sound")} Nghe mẫu</button></div>
      <div class="record-panel">
        <button class="record-orb ${mediaRecorder?.state === "recording" ? "recording" : ""}" data-action="record" aria-label="${mediaRecorder?.state === "recording" ? "Dừng ghi âm" : "Bắt đầu ghi âm"}">${icon("mic")}</button>
        <strong>${mediaRecorder?.state === "recording" ? "Con đang nói…" : audioUrl ? "Nghe lại giọng của con" : "Ghi âm để tự nghe lại"}</strong>
        <p class="record-status">Giọng nói chỉ ở trên thiết bị này. MatEng không chấm điểm phát âm.</p>
        ${audioUrl ? `<audio controls src="${audioUrl}"></audio>` : ""}
      </div>
      <div class="stage-actions"><button class="ghost-button" data-action="skip-speaking">Để lần sau</button><button class="primary-button blue" data-action="next-stage">Con đã nói →</button></div>
    </section>`;
  }

  function renderUse(lesson) {
    const q = lesson.check;
    return `<section class="lesson-stage-card">
      <div class="stage-kicker"><span class="stage-dot"></span> Dùng trong bài Toán</div>
      <div class="question-box"><div class="question-display">${q.display}</div><h2>${q.prompt}</h2><p class="translation">${q.vi}</p></div>
      <div class="answer-grid">${q.choices.map((option) => {
        let cls = "";
        if (lessonSession.useAnswered && option === q.answer) cls = "correct";
        return `<button class="answer-button ${cls}" data-action="use-answer" data-value="${escapeAttr(option)}" ${lessonSession.useAnswered ? "disabled" : ""}>${option}</button>`;
      }).join("")}</div>
      ${lessonSession.useAnswered ? feedback(lessonSession.useCorrect) : ""}
      <div class="stage-actions"><button class="primary-button blue" data-action="next-stage" ${lessonSession.useCorrect ? "" : "disabled"}>Xong bài →</button></div>
    </section>`;
  }

  function renderCelebrate(lesson) {
    completeLesson(lesson);
    return `<section class="lesson-stage-card celebration">
      <div class="celebration-mark" aria-hidden="true">★</div>
      <p class="eyebrow">Hoàn thành bài học</p>
      <h1>Con vừa dùng được một câu Toán bằng tiếng Anh!</h1>
      <div class="english-sentence">${lesson.sentence}</div>
      <div class="reward-row"><span class="reward">+1 bài hoàn thành</span><span class="reward">+${lesson.words.length} từ đã gặp</span></div>
      <div class="speech-row"><button class="secondary-button" data-speak="${escapeAttr(lesson.sentence)}">${icon("sound")} Nghe lại</button><button class="primary-button blue" data-action="finish-lesson">Về trang hôm nay</button></div>
    </section>`;
  }

  function completeLesson(lesson) {
    if (state.completed[lesson.id]) return;
    const today = dayKey(new Date());
    const yesterday = dayKey(new Date(Date.now() - 86400000));
    state.streak = state.lastActive === yesterday ? state.streak + 1 : state.lastActive === today ? state.streak : 1;
    state.lastActive = today;
    state.completed[lesson.id] = { completedAt: Date.now(), attempts: 1 };
    state.review[lesson.id] = { dueAt: Date.now() + 20 * 60 * 60 * 1000, interval: 1, strength: 1 };
    saveState();
  }

  function renderReview() {
    const completed = allLessons().filter((lesson) => state.completed[lesson.id]);
    const due = completed.filter((lesson) => (state.review[lesson.id]?.dueAt || 0) <= Date.now());
    const totalWords = new Set(completed.flatMap((lesson) => lesson.words.map((word) => word.en))).size;
    const content = `<div class="page">
      <div class="page-title"><p class="eyebrow">Nhớ lâu hơn</p><h1>Ôn tập nhẹ nhàng</h1><p class="subtle">MatEng chỉ đưa lại những câu đã học. Không có đồng hồ đếm ngược.</p></div>
      <div class="review-card">
        <div class="review-summary"><div class="stat"><strong>${completed.length}</strong><span>bài đã học</span></div><div class="stat"><strong>${totalWords}</strong><span>từ đã gặp</span></div><div class="stat"><strong>${state.streak}</strong><span>ngày liên tiếp</span></div></div>
        ${due.length ? reviewQuestion(due[0]) : `<div class="empty-state"><div class="empty-icon">☀️</div><h2>${completed.length ? "Hôm nay con đã ôn đủ" : "Học bài đầu tiên nhé"}</h2><p class="subtle">${completed.length ? "MatEng sẽ nhắc lại đúng lúc để con nhớ lâu." : "Sau khi hoàn thành một bài, câu đã học sẽ xuất hiện ở đây."}</p><button class="primary-button blue" data-route="home">${completed.length ? "Học tiếp" : "Bắt đầu học"}</button></div>`}
      </div>
    </div>`;
    app.innerHTML = shell(content, "review");
  }

  function reviewQuestion(lesson) {
    const q = lesson.check;
    return `<div class="question-box"><p class="eyebrow">Ôn lại · ${lesson.title}</p><div class="question-display">${q.display}</div><h2>${q.prompt}</h2><p class="translation">Chọn đáp án rồi MatEng sẽ hẹn lần ôn tiếp theo.</p></div><div class="answer-grid">${q.choices.map((option) => `<button class="answer-button" data-action="review-answer" data-value="${escapeAttr(option)}" data-lesson-id="${lesson.id}">${option}</button>`).join("")}</div>`;
  }

  function renderAdult() {
    const grade = getGrade();
    const done = completedCount();
    const total = allLessons().length;
    const content = `<div class="page">
      <div class="page-title"><p class="eyebrow">Dành cho phụ huynh và giáo viên</p><h1>Tiến độ rõ ràng, dữ liệu tối giản</h1><p class="subtle">MatEng tập trung vào khả năng nghe, hiểu và nói câu Toán ngắn; không xếp hạng và không tạo áp lực điểm số.</p></div>
      <div class="adult-grid">
        <section class="surface-card"><h2>Tiến độ lớp ${state.grade}</h2><div class="review-summary"><div class="stat"><strong>${done}/${total}</strong><span>bài hoàn thành</span></div><div class="stat"><strong>${state.streak}</strong><span>ngày liên tiếp</span></div><div class="stat"><strong>${grade.units.length}</strong><span>chủ đề</span></div></div><div class="progress-line"><span style="width:${Math.round(done / total * 100)}%"></span></div><p class="subtle" style="margin-top:18px">Khuyến nghị: 1 bài/ngày, khoảng 5–8 phút. Có thể cho trẻ nghe và nói lại câu vừa học trong lúc làm bài Toán trên giấy.</p></section>
        <section class="surface-card"><h2>Cài đặt</h2><label for="grade-select" class="subtle">Chọn lớp</label><select id="grade-select" class="grade-selector" data-action="change-grade">${curriculum.map((item) => `<option value="${item.id}" ${item.id === state.grade ? "selected" : ""}>Lớp ${item.id} — ${item.note}</option>`).join("")}</select><h3 style="margin-top:28px">Quyền riêng tư</h3><ul class="privacy-list"><li>Không cần tài khoản.</li><li>Không có quảng cáo hoặc mã theo dõi.</li><li>Tiến độ lưu trong trình duyệt.</li><li>Bản ghi giọng nói không được tải lên.</li></ul><button class="danger-button" data-action="reset-progress">Xóa toàn bộ tiến độ</button></section>
      </div>
    </div>`;
    app.innerHTML = shell(content, "adult");
  }

  function renderVisual(visual) {
    if (!visual) return "";
    switch (visual.type) {
      case "objects": return `<div class="visual-objects">${Array.from({ length: visual.count }, () => `<span class="visual-object ${visual.color === "mint" ? "mint" : ""}">${visual.symbol}</span>`).join("")}</div>`;
      case "equation": return `<div class="visual-content">${visual.left} ${visual.operator} ${visual.right} = ${visual.result}</div>`;
      case "groups": return `<div class="visual-content small">${visual.symbol.repeat(visual.a)} &nbsp;＋&nbsp; ${visual.symbol.repeat(visual.b)}</div>`;
      case "shape": return `<div class="visual-content">${visual.shape === "triangle" ? "△" : visual.shape === "circle" ? "○" : "□"}</div>`;
      case "position": return `<div class="visual-content">${visual.top}<br>${visual.bottom}</div>`;
      case "position-row": return `<div class="visual-content">${visual.left} &nbsp;&nbsp;&nbsp; ${visual.right}</div>`;
      case "base-ten": return `<div class="visual-content small">${"▮ ".repeat(visual.tens)} &nbsp; ${"● ".repeat(visual.ones)}</div>`;
      case "number": return `<div class="visual-content">${visual.value}</div>`;
      case "equation-text": return `<div class="visual-content small">${visual.value}</div>`;
      case "ruler": return `<div class="visual-content small">✏️<br><span style="font-size:.55em">0 ━━━━━━━ ${visual.value} cm</span></div>`;
      case "lines": return `<div style="display:grid;gap:28px;width:70%"><span style="width:${visual.a}px;max-width:80%;border-top:9px solid var(--coral)"></span><span style="width:${visual.b}px;max-width:100%;border-top:9px solid var(--blue)"></span></div>`;
      case "clock": return `<div class="visual-content">${visual.minute === 30 ? (visual.hour === 4 ? "🕟" : "🕞") : "🕒"}</div>`;
      case "array": return `<div style="display:grid;grid-template-columns:repeat(${visual.cols},44px);gap:12px">${Array.from({ length: visual.rows * visual.cols }, () => '<span style="width:34px;height:34px;border-radius:50%;background:var(--mint);display:block"></span>').join("")}</div>`;
      case "fraction": return `<div class="visual-content">${visual.parts === 2 ? "◐" : "◔"}</div>`;
      case "bars": return `<div style="height:170px;display:flex;align-items:end;gap:30px">${visual.values.map((v, i) => `<span style="display:block;width:55px;height:${v * 22}px;background:${["var(--coral)","var(--blue)","var(--mint)"][i]};border-radius:12px 12px 3px 3px"></span>`).join("")}</div>`;
      case "compare": return `<div class="visual-content small">${visual.left} ${visual.sign} ${visual.right}</div>`;
      case "angle": return `<div class="visual-content">${visual.kind === "right" ? "∟" : "∠"}</div>`;
      case "rectangle": return `<div style="width:240px;height:120px;border:9px solid var(--blue);background:${visual.outline ? "transparent" : "var(--sky)"}"></div>`;
      case "grid": return `<div style="display:grid;grid-template-columns:repeat(${visual.cols},48px);gap:4px">${Array.from({ length: visual.rows * visual.cols }, () => '<span style="width:48px;height:48px;background:var(--mint-soft);border:2px solid var(--mint)"></span>').join("")}</div>`;
      case "percent": return `<div style="width:190px;height:190px;border-radius:50%;background:conic-gradient(var(--mango) 0 ${visual.value}%, var(--sky) ${visual.value}% 100%);display:grid;place-items:center"><span style="width:112px;height:112px;background:white;border-radius:50%;display:grid;place-items:center;font-size:1.8rem;font-weight:800">${visual.value}%</span></div>`;
      case "cubes": return `<div class="visual-content">▦</div>`;
      case "conversion": return `<div class="visual-content small">${visual.from} = ${visual.to}</div>`;
      default: return `<div class="visual-content">${miniVisual(visual)}</div>`;
    }
  }

  function miniVisual(visual) {
    if (!visual) return "＋ ＝";
    switch (visual.type) {
      case "objects": return String(visual.symbol || "●").repeat(Math.min(Number(visual.count) || 0, 5));
      case "equation": return `${visual.left}＋${visual.right}`;
      case "groups": return `${visual.a}＋${visual.b}`;
      case "shape": return "△ ○ □";
      case "position": return `${visual.top} ↑ ${visual.bottom}`;
      case "position-row": return `${visual.left} ${visual.right}`;
      case "base-ten": return "10＋1";
      case "number":
      case "equation-text": return visual.value;
      case "ruler": return `↔ ${visual.value}cm`;
      case "lines": return "━━ ━━━━━";
      case "clock": return visual.minute === 30 ? "🕟" : "🕒";
      case "array": return `${visual.rows}×${visual.cols}`;
      case "fraction": return visual.parts === 2 ? "½" : "¼";
      case "bars": return "▥";
      case "compare": return `${visual.left} ${visual.sign} ${visual.right}`;
      case "angle": return visual.kind === "right" ? "∟" : "∠";
      case "rectangle": return "▭";
      case "grid": return `${visual.rows}×${visual.cols}`;
      case "percent": return `${visual.value}%`;
      case "cubes": return "▦";
      case "conversion": return `${visual.from}→${visual.to}`;
      default: return "＋ ＝";
    }
  }

  function speak(text) {
    if (!state.sound || !("speechSynthesis" in window)) {
      showToast(state.sound ? "Thiết bị này chưa hỗ trợ giọng đọc." : "Âm thanh đang tắt.");
      return;
    }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.78;
    utterance.pitch = 1.04;
    const voices = speechSynthesis.getVoices();
    utterance.voice = voices.find((voice) => voice.lang === "en-US" && /Samantha|Ava|Google US English/i.test(voice.name)) || voices.find((voice) => voice.lang.startsWith("en")) || null;
    speechSynthesis.speak(utterance);
  }

  async function toggleRecording() {
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      showToast("Thiết bị này chưa hỗ trợ ghi âm. Con vẫn có thể nói theo nhé.");
      return;
    }
    try {
      audioChunks = [];
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.addEventListener("dataavailable", (event) => event.data.size && audioChunks.push(event.data));
      mediaRecorder.addEventListener("stop", () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        audioUrl = URL.createObjectURL(new Blob(audioChunks, { type: mediaRecorder.mimeType || "audio/webm" }));
        lessonSession.recordingReady = true;
        mediaStream?.getTracks().forEach((track) => track.stop());
        mediaStream = null;
        renderLesson();
      });
      mediaRecorder.start();
      renderLesson();
    } catch {
      showToast("Không mở được micro. Con có thể nói theo mà không cần ghi âm.");
    }
  }

  function stopRecording() {
    if (mediaRecorder?.state === "recording") mediaRecorder.stop();
    mediaStream?.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  function sentenceTokens(sentence) {
    return sentence.replace(/[.!?]/g, "").split(/\s+/).filter(Boolean);
  }

  function normalizeSentence(sentence) {
    return sentence.toLowerCase().replace(/[.!?]/g, "").replace(/\s+/g, " ").trim();
  }

  function shuffle(input) {
    const array = [...input];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    if (array.length > 2 && array.join(" ") === input.join(" ")) [array[0], array[1]] = [array[1], array[0]];
    return array;
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function showToast(message) {
    document.querySelector(".toast")?.remove();
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

  function navigate(route) {
    stopRecording();
    lessonSession = null;
    location.hash = route === "home" ? "" : route;
    renderRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderRoute() {
    if (!state.onboarded) return renderOnboarding();
    const route = location.hash.replace(/^#/, "") || "home";
    if (route.startsWith("lesson/")) {
      const id = route.split("/")[1];
      if (!lessonSession || lessonSession.lesson.id !== id) {
        const found = findLesson(id);
        if (found) lessonSession = { lesson: found, stage: 0, meaningAnswered: false, meaningCorrect: false, useAnswered: false, useCorrect: false, buildWords: shuffle(sentenceTokens(found.sentence)), built: [], recordingReady: false };
      }
      return renderLesson();
    }
    if (route.startsWith("unit/")) return renderLibrary(route.split("/")[1]);
    if (route === "learn") return renderLibrary();
    if (route === "review") return renderReview();
    if (route === "adult") return renderAdult();
    return renderHome();
  }

  app.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.route) return navigate(target.dataset.route);
    if (target.dataset.lesson) return startLesson(target.dataset.lesson);
    if (target.dataset.unit) {
      lessonSession = null;
      location.hash = `unit/${target.dataset.unit}`;
      return renderLibrary(target.dataset.unit);
    }
    if (target.dataset.speak) return speak(target.dataset.speak);
    const action = target.dataset.action;
    if (action === "select-onboarding-grade") {
      onboardingGrade = Number(target.dataset.grade);
      return renderOnboarding();
    }
    if (action === "open-grade-picker") return openGradePicker();
    if (action === "close-grade-picker") return closeGradePicker();
    if (action === "choose-grade") return chooseGrade(target.dataset.grade);
    if (action === "finish-onboarding") {
      state.grade = onboardingGrade;
      state.onboarded = true;
      saveState();
      return navigate("home");
    }
    if (action === "toggle-sound") {
      state.sound = !state.sound;
      speechSynthesis?.cancel();
      saveState();
      return renderRoute();
    }
    if (action === "next-stage") {
      if (lessonSession.stage < 5) lessonSession.stage += 1;
      return renderLesson();
    }
    if (action === "meaning-answer") {
      lessonSession.meaningAnswered = true;
      lessonSession.meaningCorrect = target.dataset.value === lessonSession.lesson.words[0].vi;
      if (!lessonSession.meaningCorrect) {
        setTimeout(() => { lessonSession.meaningAnswered = false; renderLesson(); }, 1100);
      }
      return renderLesson();
    }
    if (action === "add-word") {
      const index = Number(target.dataset.index);
      lessonSession.built.push(lessonSession.buildWords[index]);
      lessonSession.buildWords.splice(index, 1);
      return renderLesson();
    }
    if (action === "remove-word") {
      const index = Number(target.dataset.index);
      lessonSession.buildWords.push(lessonSession.built[index]);
      lessonSession.built.splice(index, 1);
      return renderLesson();
    }
    if (action === "reset-build") {
      lessonSession.buildWords = shuffle(sentenceTokens(lessonSession.lesson.sentence));
      lessonSession.built = [];
      return renderLesson();
    }
    if (action === "record") return toggleRecording();
    if (action === "skip-speaking") {
      lessonSession.stage = 4;
      return renderLesson();
    }
    if (action === "use-answer") {
      lessonSession.useAnswered = true;
      lessonSession.useCorrect = target.dataset.value === lessonSession.lesson.check.answer;
      if (!lessonSession.useCorrect) {
        setTimeout(() => { lessonSession.useAnswered = false; renderLesson(); }, 1100);
      }
      return renderLesson();
    }
    if (action === "finish-lesson") return navigate("home");
    if (action === "review-answer") {
      const lesson = findLesson(target.dataset.lessonId);
      const correct = target.dataset.value === lesson.check.answer;
      const item = state.review[lesson.id] || { interval: 1, strength: 1 };
      item.strength = correct ? Math.min(5, item.strength + 1) : 1;
      item.interval = correct ? Math.min(14, Math.max(1, item.interval * 2)) : 1;
      item.dueAt = Date.now() + item.interval * 86400000;
      state.review[lesson.id] = item;
      saveState();
      showToast(correct ? "Chính xác! Hẹn con lần ôn tiếp theo." : "Không sao, ngày mai mình gặp lại câu này.");
      return setTimeout(renderReview, 450);
    }
    if (action === "reset-progress") {
      if (window.confirm("Xóa toàn bộ tiến độ trên thiết bị này? Hành động này không thể hoàn tác.")) {
        state.completed = {};
        state.review = {};
        state.streak = 0;
        state.lastActive = null;
        saveState();
        renderAdult();
        showToast("Đã xóa tiến độ.");
      }
    }
  });

  app.addEventListener("change", (event) => {
    const target = event.target;
    if (target.dataset.action === "change-grade") {
      chooseGrade(target.value);
    }
  });

  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("beforeunload", stopRecording);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGradePicker();
  });
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
  renderRoute();
})();
