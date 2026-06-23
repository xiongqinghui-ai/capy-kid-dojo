const KidDojo = (() => {
  const STORE_KEY = "capyKidDojo.v2";

  const categories = [
    { id: "study", name: "学习", icon: "ABC", color: "#6b8f35" },
    { id: "sports", name: "运动", icon: "GO", color: "#d9822b" },
    { id: "life", name: "生活", icon: "HI", color: "#b66b3e" },
    { id: "art", name: "艺术", icon: "DO", color: "#8a6f47" },
    { id: "reading", name: "阅读", icon: "BOOK", color: "#5d8b7f" }
  ];

  const demoState = {
    child: {
      name: "小小队长",
      homeTitle: "卡皮成长小屋",
      avatar: "assets/avatar.png"
    },
    score: 42,
    activeCategoryId: "study",
    activeWishId: "wish-hockey",
    categories,
    activities: [
      { id: "act-en", categoryId: "study", name: "英语阅读或听力", points: 6, targetPerDay: 1, note: "20 分钟，能讲出一个重点" },
      { id: "act-math", categoryId: "study", name: "数学练习订正", points: 8, targetPerDay: 1, note: "错题写原因" },
      { id: "act-cn", categoryId: "study", name: "语文朗读积累", points: 6, targetPerDay: 1, note: "朗读清楚，摘一句好句" },
      { id: "act-course", categoryId: "study", name: "其他课程完成", points: 5, targetPerDay: 1, note: "科学、编程或课堂任务" },
      { id: "act-hockey", categoryId: "sports", name: "冰球训练", points: 10, targetPerDay: 1, note: "认真训练并整理装备" },
      { id: "act-fitness", categoryId: "sports", name: "每日体能训练", points: 7, targetPerDay: 1, note: "按计划完成" },
      { id: "act-swim", categoryId: "sports", name: "游泳训练", points: 8, targetPerDay: 1, note: "记住一个技术重点" },
      { id: "act-ride", categoryId: "sports", name: "马术训练", points: 9, targetPerDay: 1, note: "注意安全和礼仪" },
      { id: "act-help", categoryId: "life", name: "主动帮助家人", points: 5, targetPerDay: 1, note: "不用提醒主动做" },
      { id: "act-family", categoryId: "life", name: "家庭活动积极参与", points: 4, targetPerDay: 1, note: "一起整理、出行或沟通" },
      { id: "act-sax", categoryId: "art", name: "萨克斯练习", points: 8, targetPerDay: 1, note: "30 分钟，注意节奏音准" },
      { id: "act-read", categoryId: "reading", name: "自主阅读", points: 7, targetPerDay: 1, note: "30 分钟，讲一个故事点" },
      { id: "act-note", categoryId: "reading", name: "阅读摘记", points: 6, targetPerDay: 1, note: "写一句喜欢的话" }
    ],
    wishes: [
      { id: "wish-hockey", name: "新冰球杆", cost: 120, icon: "🏒", status: "open" },
      { id: "wish-book", name: "一套冒险故事书", cost: 80, icon: "📚", status: "open" },
      { id: "wish-museum", name: "周末科学馆", cost: 60, icon: "🚀", status: "open" }
    ],
    history: seedHistory()
  };

  const capyStages = [
    { id: "egg", name: "还未出生", range: "0-150分", min: 0, max: 150, icon: "🥚", image: "assets/stages/stage-1-egg.svg", desc: "小卡皮还在壳里，正在安静积蓄能量。" },
    { id: "hatching", name: "破壳状态", range: "151-300分", min: 151, max: 300, icon: "🐣", image: "assets/stages/stage-2-hatching.svg", desc: "壳开始裂开，小卡皮马上就要探出头。" },
    { id: "baby", name: "幼崽阶段", range: "301-500分", min: 301, max: 500, icon: "🦫", image: "assets/stages/stage-3-baby.svg", desc: "幼崽开始探索，每天都在长本领。" },
    { id: "teen", name: "少年阶段", range: "501-750分", min: 501, max: 750, icon: "🌿", image: "assets/stages/stage-4-teen.svg", desc: "少年卡皮更有力量，能坚持更长的任务。" },
    { id: "young", name: "青年阶段", range: "751-1000分", min: 751, max: 1000, icon: "🏅", image: "assets/stages/stage-5-young.svg", desc: "青年卡皮已经很稳，开始形成自己的节奏。" },
    { id: "adult", name: "成年阶段", range: "1001-1500分", min: 1001, max: 1500, icon: "👑", image: "assets/stages/stage-6-adult.svg", desc: "成年卡皮很可靠，代表长期坚持的成果。" }
  ];

  function seedHistory() {
    const now = new Date();
    const data = [
      ["act-en", "study", "英语阅读或听力", 6, 0],
      ["act-math", "study", "数学练习订正", 8, 0],
      ["act-hockey", "sports", "冰球训练", 10, 0],
      ["act-help", "life", "主动帮助家人", 5, 0],
      ["act-read", "reading", "自主阅读", 7, 1],
      ["act-sax", "art", "萨克斯练习", 8, 1],
      ["act-fitness", "sports", "每日体能训练", 7, 2]
    ];
    return data.map(([activityId, categoryId, title, points, daysAgo], index) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      d.setHours(18 - index, 12, 0, 0);
      return {
        id: `seed-${index}`,
        kind: "activity",
        activityId,
        categoryId,
        title,
        points,
        createdAt: d.toISOString()
      };
    });
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return clone(demoState);
    try {
      return migrate(JSON.parse(raw));
    } catch {
      return clone(demoState);
    }
  }

  function migrate(input) {
    const base = clone(demoState);
    return {
      ...base,
      ...input,
      child: { ...base.child, ...(input.child || {}) },
      categories: input.categories?.length ? input.categories : base.categories,
      activities: input.activities || base.activities,
      wishes: input.wishes || base.wishes,
      history: input.history || []
    };
  }

  function save(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  function reset() {
    const state = clone(demoState);
    save(state);
    return state;
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function todayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  function isSameDay(iso, date = new Date()) {
    return todayKey(new Date(iso)) === todayKey(date);
  }

  function categoryById(state, id) {
    return state.categories.find(item => item.id === id) || state.categories[0];
  }

  function activeWish(state) {
    return state.wishes.find(w => w.id === state.activeWishId && w.status !== "redeemed")
      || state.wishes.find(w => w.status !== "redeemed")
      || null;
  }

  function todayEntries(state) {
    return state.history.filter(item => isSameDay(item.createdAt));
  }

  function todayActivityMap(state) {
    return todayEntries(state).reduce((acc, item) => {
      if (item.activityId) acc[item.activityId] = (acc[item.activityId] || 0) + 1;
      return acc;
    }, {});
  }

  function todayScore(state) {
    return todayEntries(state)
      .filter(item => item.kind !== "redeem")
      .reduce((sum, item) => sum + item.points, 0);
  }

  function completionStats(state) {
    const doneMap = todayActivityMap(state);
    const stats = state.categories.map(category => {
      const activities = state.activities.filter(a => a.categoryId === category.id);
      const required = activities.reduce((sum, a) => sum + Math.max(1, Number(a.targetPerDay || 1)), 0);
      const done = activities.reduce((sum, a) => {
        return sum + Math.min(doneMap[a.id] || 0, Math.max(1, Number(a.targetPerDay || 1)));
      }, 0);
      return {
        ...category,
        required,
        done,
        percent: required ? Math.round((done / required) * 100) : 0
      };
    });
    const totalRequired = stats.reduce((sum, item) => sum + item.required, 0);
    const totalDone = stats.reduce((sum, item) => sum + item.done, 0);
    return {
      stats,
      totalRequired,
      totalDone,
      totalPercent: totalRequired ? Math.round((totalDone / totalRequired) * 100) : 0
    };
  }

  function capyStage(score) {
    const clampedScore = Math.max(0, Number(score || 0));
    const currentIndex = capyStages.findIndex(stage => clampedScore >= stage.min && clampedScore <= stage.max);
    const index = currentIndex >= 0 ? currentIndex : capyStages.length - 1;
    const stage = capyStages[index];
    const span = Math.max(1, stage.max - stage.min);
    const progress = Math.min(100, Math.max(0, Math.round(((clampedScore - stage.min) / span) * 100)));
    const next = capyStages[index + 1] || null;
    return {
      stage,
      stages: capyStages,
      index,
      progress,
      next,
      remaining: next ? Math.max(0, next.min - clampedScore) : Math.max(0, stage.max - clampedScore)
    };
  }

  function recordActivity(state, activityId, options = {}) {
    const activity = state.activities.find(item => item.id === activityId);
    if (!activity) return state;
    const next = clone(state);
    next.score = Math.max(0, next.score + Number(activity.points));
    next.history.unshift({
      id: uid("h"),
      kind: "activity",
      activityId: activity.id,
      categoryId: activity.categoryId,
      title: activity.name,
      points: Number(activity.points),
      detail: options.detail || "",
      rating: Number(options.rating || 0),
      createdAt: new Date().toISOString()
    });
    next.history = next.history.slice(0, 400);
    save(next);
    return next;
  }

  function redeemWish(state, wishId) {
    const next = clone(state);
    const wish = next.wishes.find(item => item.id === wishId);
    if (!wish || next.score < wish.cost) return { state, ok: false };
    next.score -= Number(wish.cost);
    wish.status = "redeemed";
    wish.redeemedAt = new Date().toISOString();
    next.history.unshift({
      id: uid("h"),
      kind: "redeem",
      title: `兑换：${wish.name}`,
      points: -Number(wish.cost),
      createdAt: new Date().toISOString()
    });
    next.activeWishId = next.wishes.find(item => item.status !== "redeemed")?.id || "";
    save(next);
    return { state: next, ok: true };
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(iso) {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(iso));
  }

  return {
    STORE_KEY,
    load,
    save,
    reset,
    clone,
    uid,
    escapeHtml,
    formatTime,
    categoryById,
    activeWish,
    todayEntries,
    todayScore,
    todayActivityMap,
    completionStats,
    capyStage,
    recordActivity,
    redeemWish,
    migrate
  };
})();
