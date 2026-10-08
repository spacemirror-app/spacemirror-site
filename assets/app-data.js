/* 空间镜 · 诊断→方案→购买 闭环共享数据 & 购物车逻辑
   被 plan/index.html 与 cart/index.html 共用 */
(function (global) {
  'use strict';

  // —— 诊断结果 + 改造方案数据（与 MVP 原型诊断屏保持一致）——
  var DIAGNOSIS = {
    totalScore: 72,
    date: '2026-10-07',
    home: '89㎡ · 3 室 2 厅',
    radar: [
      { label: '动线流畅', score: 72, color: '#60a5fa' },
      { label: '采光充足', score: 58, color: '#f59e0b' },
      { label: '收纳合理', score: 45, color: '#22d3ee' },
      { label: '噪音控制', score: 68, color: '#34d399' }
    ],
    plans: [
      {
        id: 'balcony-light',
        group: '阳台采光改造',
        room: '客厅', dimension: '采光', priority: 'high',
        problem: '客厅采光 58 分，南向阳台隔断阻光',
        action: '替换极窄边框玻璃门',
        effect: '采光提升至约 85，客厅整体亮度 +30%',
        beforeScore: 58, afterScore: 85,
        budgetMin: 3000, budgetMax: 5000, duration: '1 天',
        products: [
          { pid: 'p-bd', name: '极窄边框推拉玻璃门', spec: '1.8m×2.4m 双开', price: 3200, qty: 1, required: true, merchant: '欧派旗舰店', icon: '🚪', hue: 210 },
          { pid: 'p-sheer', name: '透光白纱帘', spec: '定制 2.4m', price: 380, qty: 1, required: false, merchant: '宜家家居', icon: '🪟', hue: 40 }
        ]
      },
      {
        id: 'bedroom-storage',
        group: '主卧收纳扩容',
        room: '主卧', dimension: '收纳', priority: 'high',
        problem: '主卧收纳 45 分，衣柜容量与利用率不足',
        action: '增加 1.2m 顶天立地定制柜 + 收纳配件',
        effect: '收纳分提升至 80，可用储物 +60%',
        beforeScore: 45, afterScore: 80,
        budgetMin: 6000, budgetMax: 9000, duration: '2 天',
        products: [
          { pid: 'p-wardrobe', name: '顶天立地定制衣柜', spec: '1.2m 宽 · 到顶', price: 6500, qty: 1, required: true, merchant: '索菲亚', icon: '🗄️', hue: 280 },
          { pid: 'p-box', name: '布艺收纳盒套装', spec: '6 件装', price: 180, qty: 1, required: false, merchant: '网易严选', icon: '📦', hue: 200 }
        ]
      },
      {
        id: 'kitchen-flow',
        group: '厨房动线优化',
        room: '厨房', dimension: '动线', priority: 'medium',
        problem: '厨房动线 72 分，L 型存在折返、冰箱位过远',
        action: '冰箱移至入口 + 增设移动中岛推车',
        effect: '动线效率提升至 88，备餐往返 -40%',
        beforeScore: 72, afterScore: 88,
        budgetMin: 800, budgetMax: 1500, duration: '1 天',
        products: [
          { pid: 'p-cart', name: '移动中岛推车', spec: '双层 · 带轮', price: 760, qty: 1, required: true, merchant: '林氏木业', icon: '🛒', hue: 30 },
          { pid: 'p-hook', name: '免钉挂钩套装', spec: '10 只', price: 39, qty: 2, required: false, merchant: '太力', icon: '🪝', hue: 120 }
        ]
      },
      {
        id: 'living-storage',
        group: '客厅收纳整理',
        room: '客厅', dimension: '收纳', priority: 'medium',
        problem: '客厅收纳 45 分，杂物无归处、线缆裸露',
        action: '增设靠墙隐藏式收纳柜 + 线缆整理',
        effect: '收纳分提升至 75，视觉整洁度显著提升',
        beforeScore: 45, afterScore: 75,
        budgetMin: 1200, budgetMax: 2500, duration: '1 天',
        products: [
          { pid: 'p-cabinet', name: '靠墙隐藏收纳柜', spec: '1.5m 宽', price: 1680, qty: 1, required: true, merchant: '源氏木语', icon: '🗄️', hue: 25 },
          { pid: 'p-cable', name: '理线收纳盒', spec: '3 格', price: 49, qty: 1, required: false, merchant: '太力', icon: '🔌', hue: 200 }
        ]
      },
      {
        id: 'bedroom-noise',
        group: '主卧隔音降噪',
        room: '主卧', dimension: '噪音', priority: 'low',
        problem: '主卧噪音 68 分，临街低频噪声干扰睡眠',
        action: '加装隔音遮光窗帘 + 窗缝密封条',
        effect: '噪音分提升至 82，夜间声压 -8dB',
        beforeScore: 68, afterScore: 82,
        budgetMin: 600, budgetMax: 1200, duration: '1 天',
        products: [
          { pid: 'p-curtain2', name: '隔音遮光窗帘', spec: '2.6m 宽', price: 560, qty: 1, required: true, merchant: '金蝉', icon: '🪟', hue: 260 },
          { pid: 'p-seal', name: '窗缝密封条', spec: '5m', price: 39, qty: 1, required: false, merchant: '太力', icon: '🧱', hue: 210 }
        ]
      },
      {
        id: 'kitchen-light',
        group: '厨房操作补光',
        room: '厨房', dimension: '采光', priority: 'low',
        problem: '厨房采光 58 分，操作台局部偏暗',
        action: '补充感应 LED 灯带 + 浅色台面贴',
        effect: '采光分提升至 78，操作照明均匀度提升',
        beforeScore: 58, afterScore: 78,
        budgetMin: 400, budgetMax: 900, duration: '0.5 天',
        products: [
          { pid: 'p-led', name: '感应 LED 灯带', spec: '2m 人体感应', price: 128, qty: 1, required: true, merchant: '雷士', icon: '💡', hue: 50 },
          { pid: 'p-film', name: '防污台面贴', spec: '60cm×200cm', price: 69, qty: 1, required: false, merchant: '太力', icon: '🟫', hue: 35 }
        ]
      }
    ]
  };

  var PRIORITY_LABEL = { high: '高', medium: '中', low: '低' };
  var PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

  // —— 账号（localStorage）——
  var ACCOUNT_KEY = 'spacemirror_account_v1';
  var ACCOUNT = {
    phone: '', name: '空间镜用户', plan: '免费版',
    devices: [
      { type: 'phone', name: 'iPhone 17 Pro', meta: '采集端 · 最近同步 2 小时前', on: true },
      { type: 'pc', name: 'MacBook Pro', meta: '编辑端 · 最近同步 今天 09:12', on: true },
      { type: 'pad', name: 'iPad Air', meta: '查看端 · 最近同步 昨天', on: false }
    ]
  };
  function loadAccount() {
    try { var a = JSON.parse(localStorage.getItem(ACCOUNT_KEY)); if (a && a.phone) ACCOUNT = a; } catch (e) {}
    return ACCOUNT;
  }
  function saveAccount() { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(ACCOUNT)); }
  function login(phone) {
    ACCOUNT.phone = phone;
    ACCOUNT.name = '用户 ' + phone.slice(-4);
    saveAccount(); renderBadges();
  }
  function logout() { ACCOUNT = { phone: '', name: '空间镜用户', plan: '免费版', devices: ACCOUNT.devices }; saveAccount(); }

  // —— 数字孪生家资产（localStorage）——
  var HOMES_KEY = 'spacemirror_homes_v1';
  var HOMES = [
    { id: 'h1', name: '阳光花园 · 89㎡ 三居', area: '89㎡ · 3室2厅', updated: '2026-10-07', scans: 1, device: 'iPhone 17 Pro', shared: false, glb: '阳光花园_89.glb',
      versions: [{ v: 1, label: 'v1 · 初始建档扫描', date: '2026-10-07', source: 'scan', by: 'iPhone 17 Pro', note: '首次扫描建档',
        scores: { '动线流畅': 72, '采光充足': 58, '收纳合理': 45, '噪音控制': 68 } }] },
    { id: 'h2', name: '江景壹号 · 120㎡ 四居', area: '120㎡ · 4室2厅', updated: '2026-09-28', scans: 1, device: 'iPhone 17 Pro', shared: true, glb: '江景壹号_120.glb',
      versions: [{ v: 1, label: 'v1 · 初始建档扫描', date: '2026-09-28', source: 'scan', by: 'iPhone 17 Pro', note: '首次扫描建档',
        scores: { '动线流畅': 66, '采光充足': 74, '收纳合理': 52, '噪音控制': 70 } }] },
    { id: 'h3', name: '出租屋 · 60㎡ 一居', area: '60㎡ · 1室1厅', updated: '2026-09-15', scans: 2, device: 'iPhone 15', shared: false, glb: '出租屋_60.glb',
      versions: [
        { v: 1, label: 'v1 · 初始建档扫描', date: '2026-09-15', source: 'scan', by: 'iPhone 15', note: '首次扫描建档',
          scores: { '动线流畅': 80, '采光充足': 62, '收纳合理': 38, '噪音控制': 55 } },
        { v: 2, label: 'v2 · 客厅收纳整理完工复扫', date: '2026-09-27', source: 'order', by: '王师傅 · SM-2603', note: '隐藏式收纳柜安装完成后复扫',
          scores: { '动线流畅': 80, '采光充足': 62, '收纳合理': 75, '噪音控制': 55 } }
      ] }
  ];
  function loadHomes() {
    try { var h = JSON.parse(localStorage.getItem(HOMES_KEY)); if (h && h.length) HOMES = h; } catch (e) {}
    HOMES.forEach(ensureVersions);
    return HOMES;
  }
  // 家资产版本管理：每次复扫落一个新版本快照，改造前后对比读的就是这两个版本
  function ensureVersions(h) {
    if (!h.versions || !h.versions.length) {
      h.versions = [{ v: 1, label: 'v1 · 初始建档扫描', date: h.updated || DIAGNOSIS.date, source: 'scan', by: h.device || 'iPhone',
        note: '首次扫描建档', scores: { '动线流畅': 72, '采光充足': 58, '收纳合理': 45, '噪音控制': 68 } }];
    }
    return h.versions;
  }
  function getVersions(homeId) { var h = getHome(homeId); return h ? ensureVersions(h) : []; }
  function latestVersion(homeId) { var v = getVersions(homeId); return v[v.length - 1]; }
  function addVersion(homeId, patch, meta) {
    var h = getHome(homeId); if (!h) return null;
    ensureVersions(h);
    var last = h.versions[h.versions.length - 1];
    var scores = {}, keys = Object.keys(last.scores);
    keys.forEach(function (k) { scores[k] = (patch && (k in patch)) ? patch[k] : last.scores[k]; });
    var v = last.v + 1;
    var ver = {
      v: v, label: 'v' + v + (meta && meta.label ? ' · ' + meta.label : ' · 复扫'),
      date: todayStr(), source: (meta && meta.source) || 'rescan',
      by: (meta && meta.by) || last.by, note: (meta && meta.note) || ''
    };
    ver.scores = scores;
    h.versions.push(ver);
    h.scans = (h.scans || 1) + 1;
    h.updated = todayStr();
    saveHomes();
    return ver;
  }
  function versionComposite(ver) {
    var keys = Object.keys(ver.scores || {});
    if (!keys.length) return 0;
    return Math.round(keys.reduce(function (s, k) { return s + ver.scores[k]; }, 0) / keys.length);
  }
  function saveHomes() { localStorage.setItem(HOMES_KEY, JSON.stringify(HOMES)); }
  function renameHome(id, name) { var h = HOMES.filter(function (x) { return x.id === id; })[0]; if (h) { h.name = name; saveHomes(); } }
  function toggleShare(id) { var h = HOMES.filter(function (x) { return x.id === id; })[0]; if (h) { h.shared = !h.shared; saveHomes(); } }
  function getHome(id) { return HOMES.filter(function (x) { return x.id === id; })[0]; }

  // —— 复扫对比（改造后重新扫描）——
  var RESCAN = {
    homeId: 'h1', homeName: '阳光花园 · 89㎡ 三居',
    dateBefore: '2026-10-07', dateAfter: '2026-11-20',
    before: [
      { label: '动线流畅', score: 72, color: '#60a5fa' },
      { label: '采光充足', score: 58, color: '#f59e0b' },
      { label: '收纳合理', score: 45, color: '#22d3ee' },
      { label: '噪音控制', score: 68, color: '#34d399' }
    ],
    after: [
      { label: '动线流畅', score: 88, color: '#60a5fa' },
      { label: '采光充足', score: 85, color: '#f59e0b' },
      { label: '收纳合理', score: 80, color: '#22d3ee' },
      { label: '噪音控制', score: 82, color: '#34d399' }
    ]
  };
  function rescanComposite(arr) { return Math.round(arr.reduce(function (s, x) { return s + x.score; }, 0) / arr.length); }

  // —— 订单状态机：预约 → 商家接单 → 工长施工 → 完工复扫 → 案例回流 ——
  // 三个 App（C端 / 商家端 / 工长端）同源部署，共用这一份订单数据，互通是真的
  var ORDERS_KEY = 'spacemirror_orders_v1';
  var STAGES = [
    { key: 'lead', label: '意向登记', actor: '系统', tab: 'wait' },
    { key: 'pending', label: '待接单', actor: '商家', tab: 'wait' },
    { key: 'design', label: '方案中', actor: '商家', tab: 'doing' },
    { key: 'assigned', label: '已派工', actor: '商家', tab: 'doing' },
    { key: 'onsite', label: '施工中', actor: '工长', tab: 'doing' },
    { key: 'checking', label: '待验收', actor: '工长', tab: 'doing' },
    { key: 'rescan', label: '完工复扫', actor: '业主', tab: 'doing' },
    { key: 'done', label: '已完成', actor: '系统', tab: 'done' }
  ];
  function stageInfo(key) { return STAGES.filter(function (s) { return s.key === key; })[0] || STAGES[0]; }
  function stageLabel(key) { return stageInfo(key).label; }
  function stageTab(key) { return stageInfo(key).tab; }

  var DIM_OF = { '动线': '动线流畅', '采光': '采光充足', '收纳': '收纳合理', '噪音': '噪音控制' };
  function planById(id) { return DIAGNOSIS.plans.filter(function (p) { return p.id === id; })[0]; }
  function todayStr() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function nowStr() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return todayStr() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  var SEED_ORDERS = [
    {
      id: 'o1', no: 'SM-2601', homeId: 'h1', homeName: '阳光花园 89㎡',
      planId: 'balcony-light', planName: '阳台采光改造', amount: 3580, stage: 'pending',
      created: '2026-10-08', requestedTime: '周末上午',
      customer: { name: '陈女士', phone: '138****6621', community: '阳光花园 3 栋', budget: '3000–5000' },
      crew: null, need: '阳台隔断太挡光，想换极窄边框玻璃门',
      timeline: [{ stage: 'pending', time: '2026-10-08 10:12', by: '系统', note: '来自 C 端「提交预约」' }],
      logs: [], checks: {}, rescan: null
    },
    {
      id: 'o2', no: 'SM-2602', homeId: 'h2', homeName: '江景壹号 120㎡',
      planId: 'bedroom-storage', planName: '主卧收纳扩容', amount: 6680, stage: 'assigned',
      created: '2026-10-05', requestedTime: '下周三下午',
      customer: { name: '林先生', phone: '135****3300', community: '江景壹号 A 座', budget: '6000–9000' },
      crew: { name: '王师傅', team: '金牌施工队', phone: '139****0088' },
      need: '主卧衣物放不下，要顶天立地柜',
      timeline: [
        { stage: 'pending', time: '2026-10-05 09:40', by: '系统', note: '来自 C 端「提交预约」' },
        { stage: 'design', time: '2026-10-06 14:20', by: '欧派旗舰店', note: '已上传初步方案与效果图' },
        { stage: 'assigned', time: '2026-10-07 10:05', by: '欧派旗舰店', note: '派工给 王师傅（金牌施工队）' }
      ],
      logs: [], checks: {}, rescan: null
    },
    {
      id: 'o3', no: 'SM-2603', homeId: 'h3', homeName: '出租屋 60㎡',
      planId: 'living-storage', planName: '客厅收纳整理', amount: 1680, stage: 'done',
      created: '2026-09-20', requestedTime: '尽快',
      customer: { name: '赵小姐', phone: '186****7712', community: '城建花园 7 栋', budget: '1200–2500' },
      crew: { name: '王师傅', team: '金牌施工队', phone: '139****0088' },
      need: '客厅杂物没地方放',
      timeline: [
        { stage: 'pending', time: '2026-09-20 11:00', by: '系统', note: '来自 C 端「提交预约」' },
        { stage: 'design', time: '2026-09-21 09:30', by: '欧派旗舰店', note: '方案已确认' },
        { stage: 'assigned', time: '2026-09-22 08:50', by: '欧派旗舰店', note: '派工给 王师傅' },
        { stage: 'onsite', time: '2026-09-25 09:10', by: '王师傅', note: '已进场，完成成品保护' },
        { stage: 'checking', time: '2026-09-26 17:40', by: '王师傅', note: '柜体安装完成，材料逐项核对通过' },
        { stage: 'rescan', time: '2026-09-27 10:20', by: '系统', note: '业主完成复扫，四维分已刷新' },
        { stage: 'done', time: '2026-09-27 10:22', by: '系统', note: '已归档，案例已回流社区' }
      ],
      logs: [
        { time: '2026-09-25 09:15', kind: 'photo', text: '成品保护完成，地面铺防尘膜' },
        { time: '2026-09-25 15:30', kind: 'photo', text: '隐藏式收纳柜定位放线' },
        { time: '2026-09-26 17:20', kind: 'check', text: '材料到场 2 项，逐项验收通过' }
      ],
      checks: {}, rescan: { date: '2026-09-27', before: 45, after: 75 }
    }
  ];

  var ORDERS = [];
  function loadOrders() {
    try { var o = JSON.parse(localStorage.getItem(ORDERS_KEY)); ORDERS = (o && o.length) ? o : SEED_ORDERS; }
    catch (e) { ORDERS = SEED_ORDERS; }
    if (!ORDERS.length) ORDERS = SEED_ORDERS;
    return ORDERS;
  }
  function saveOrders() { localStorage.setItem(ORDERS_KEY, JSON.stringify(ORDERS)); }
  function resetOrders() { ORDERS = SEED_ORDERS; saveOrders(); return ORDERS; }
  function listOrders(tab) {
    loadOrders();
    if (!tab || tab === 'all') return ORDERS;
    return ORDERS.filter(function (o) { return stageTab(o.stage) === tab; });
  }
  function getOrder(id) { return listOrders('all').filter(function (o) { return o.id === id; })[0]; }
  function ensureChecks(o) {
    var p = planById(o.planId);
    if (!o.checks) o.checks = {};
    if (p) p.products.forEach(function (pr) { if (!(pr.pid in o.checks)) o.checks[pr.pid] = false; });
    return o.checks;
  }
  function setStage(id, stage, by, note) {
    var o = getOrder(id); if (!o) return null;
    o.stage = stage;
    o.timeline = o.timeline || [];
    o.timeline.push({ stage: stage, time: nowStr(), by: by || stageInfo(stage).actor, note: note || '' });
    saveOrders(); return o;
  }
  // 生成下一个订单号
  function nextOrderNo() {
    loadOrders();
    return 'SM-' + (2600 + ORDERS.length + 1);
  }
  function createOrderFromBooking(b) {
    loadOrders();
    var id = 'o' + (Date.now() + '').slice(-6);
    var o = {
      id: id, no: nextOrderNo(),
      homeId: b.homeId || 'h1', homeName: b.homeName || '阳光花园 89㎡',
      version: b.version || 1,
      planId: b.planId || '', planName: b.planName || '全屋综合改造',
      amount: b.amount || 0, stage: 'pending',
      created: todayStr(), requestedTime: b.time || '待商定',
      customer: { name: b.name || '', phone: b.phone || '', community: b.community || '', budget: b.budget || '' },
      crew: null, need: b.need || '',
      timeline: [{ stage: 'pending', time: nowStr(), by: '系统', note: '来自 C 端「提交预约」' }],
      logs: [], checks: {}, rescan: null
    };
    ensureChecks(o);
    ORDERS.unshift(o);
    saveOrders();
    return o;
  }
  function acceptOrder(id) { return setStage(id, 'design', '欧派旗舰店', '已接单，进入方案设计'); }
  function rejectOrder(id) { ORDERS = listOrders('all').filter(function (o) { return o.id !== id; }); saveOrders(); }
  // 上传方案 = 确认方案并派工给默认施工队（保证工长端能立刻看到单）
  function uploadDesign(id) {
    var o = getOrder(id); if (!o) return null;
    if (!o.crew) o.crew = { name: '王师傅', team: '金牌施工队', phone: '139****0088' };
    saveOrders();
    return setStage(id, 'assigned', '欧派旗舰店', '方案已上传并派工给 ' + o.crew.name + '（' + o.crew.team + '）');
  }
  function assignCrew(id, crew) {
    var o = getOrder(id); if (!o) return null;
    o.crew = crew; return setStage(id, 'assigned', '欧派旗舰店', '派工给 ' + crew.name + '（' + crew.team + '）');
  }
  function startWork(id) { var o = getOrder(id); return setStage(id, 'onsite', o && o.crew ? o.crew.name : '工长', '已进场，完成成品保护'); }
  function toggleCheck(id, pid) {
    var o = getOrder(id); if (!o) return null;
    ensureChecks(o);
    o.checks[pid] = !o.checks[pid];
    saveOrders();
    return o;
  }
  function checkStats(o) {
    var p = planById(o.planId); if (!p) return { done: 0, total: 0 };
    var c = ensureChecks(o);
    var done = p.products.filter(function (pr) { return c[pr.pid]; }).length;
    return { done: done, total: p.products.length };
  }
  function allChecked(o) { var s = checkStats(o); return s.total > 0 && s.done === s.total; }
  function addLog(id, text, kind) {
    var o = getOrder(id); if (!o) return null;
    o.logs = o.logs || [];
    o.logs.unshift({ time: nowStr(), text: text, kind: kind || 'photo', by: o.crew ? o.crew.name : '工长' });
    saveOrders(); return o;
  }
  function requestRescan(id) {
    var o = getOrder(id); if (!o) return null;
    return setStage(id, 'rescan', o.crew ? o.crew.name : '工长', '施工与验收完成，请业主复扫');
  }
  // 完工复扫 → 在家资产上落一个新版本快照 → 自动写一条社区案例
  function completeRescan(id) {
    var o = getOrder(id); if (!o) return null;
    var p = planById(o.planId);
    var dimKey = p ? DIM_OF[p.dimension] : null;
    var patch = {};
    if (dimKey && p) patch[dimKey] = p.afterScore;
    var ver = addVersion(o.homeId, patch, {
      label: (p ? p.group : '改造') + '完工复扫', source: 'order',
      by: (o.crew ? o.crew.name + ' · ' + o.no : o.no), note: p ? p.action : ''
    });
    var beforeMap = getVersions(o.homeId)[0].scores;
    var afterMap = ver ? ver.scores : beforeMap;
    // 注意顺序：setStage 内部会重新取一次订单对象，rescan 必须在它之后落到新对象上
    var fresh = setStage(id, 'done', '系统', '复扫完成 · 家资产落到 ' + (ver ? 'v' + ver.v : '新版本') + '，案例已回流社区');
    fresh.rescan = {
      date: todayStr(), version: ver ? ver.v : 2,
      before: p ? p.beforeScore : versionComposite(getVersions(o.homeId)[0]),
      after: p ? p.afterScore : (ver ? versionComposite(ver) : 0),
      beforeScores: beforeMap, afterScores: afterMap
    };
    saveOrders();
    return fresh;
  }
  // 按「同一套房的不同版本快照」算改造前后（v1 建档 vs 最新版本），而不是写死的常量
  function rescanForHome(homeId) {
    loadOrders();
    var vs = getVersions(homeId);
    var h = getHome(homeId);
    var name = h ? h.name : RESCAN.homeName;
    if (!vs.length) {
      return { homeId: homeId, homeName: name, dateBefore: RESCAN.dateBefore, dateAfter: RESCAN.dateAfter,
        before: RESCAN.before.map(copyScore), after: RESCAN.after.map(copyScore),
        source: 'seed', sourceLabel: '示例数据（尚无版本快照）' };
    }
    var v0 = vs[0], vLast = vs[vs.length - 1];
    if (vs.length < 2) {
      return { homeId: homeId, homeName: name, dateBefore: v0.date, dateAfter: vLast.date,
        before: mapScores(v0), after: mapScores(vLast),
        source: 'seed', sourceLabel: '仅有 v1 建档版本，完成复扫后才有对照' };
    }
    var done = ORDERS.filter(function (o) { return o.homeId === homeId && o.rescan; });
    var crews = done.map(function (o) { return o.crew ? o.crew.name : '业主自助改造'; });
    var uniq = crews.filter(function (c, i) { return crews.indexOf(c) === i; });
    return {
      homeId: homeId, homeName: name,
      dateBefore: v0.date, dateAfter: vLast.date,
      before: mapScores(v0), after: mapScores(vLast),
      source: 'order',
      sourceLabel: v0.label.split(' · ')[0] + ' → ' + vLast.label.split(' · ')[0] +
        ' · ' + done.length + ' 个完工工单 · ' + uniq.join('、'),
      versions: vs
    };
  }
  function copyScore(r) { return { label: r.label, score: r.score, color: r.color }; }
  function mapScores(ver) {
    return DIAGNOSIS.radar.map(function (r) {
      return { label: r.label, score: ver.scores[r.label], color: r.color };
    });
  }
  // —— 权限矩阵：谁（角色）在哪个状态下能干什么 ——
  // actor: merchant 商家 / crew 工长 / owner 业主 / ops 系统运营
  var ACTIONS = [
    { key: 'match', label: '系统匹配服务商', actor: 'ops', from: ['lead'], to: 'pending', note: '自动匹配后进入商家抢单池' },
    { key: 'accept', label: '接单', actor: 'merchant', from: ['pending'], to: 'design', note: '我来接单' },
    { key: 'reject', label: '婉拒', actor: 'merchant', from: ['pending'], to: null, note: '本店暂不承接' },
    { key: 'design', label: '上传方案并派工', actor: 'merchant', from: ['design'], to: 'assigned', note: '方案已确认' },
    { key: 'assign', label: '改派工长', actor: 'merchant', from: ['assigned'], to: 'assigned', note: '更换施工队伍' },
    { key: 'start', label: '进场开工', actor: 'crew', from: ['assigned'], to: 'onsite', note: '已进场，完成成品保护' },
    { key: 'log', label: '施工打卡', actor: 'crew', from: ['onsite', 'checking'], to: null, note: '' },
    { key: 'check', label: '提交验收', actor: 'crew', from: ['onsite'], to: 'checking', need: 'allChecked', note: '材料逐项核对通过' },
    { key: 'askRescan', label: '申请业主复扫', actor: 'crew', from: ['checking'], to: 'rescan', note: '等待业主复扫' },
    { key: 'doRescan', label: '完工复扫', actor: 'owner', from: ['rescan'], to: 'done', note: '复扫完成，落新版本' }
  ];
  function actInfo(key) { return ACTIONS.filter(function (a) { return a.key === key; })[0]; }
  function actionsFor(o, role) {
    if (!o) return [];
    return ACTIONS.filter(function (a) { return a.actor === role && a.from.indexOf(o.stage) >= 0; });
  }
  // 权限校验：返回 {ok, reason}
  function canAct(o, key, role) {
    var a = actInfo(key);
    if (!a) return { ok: false, reason: '未知操作' };
    if (a.actor !== role) return { ok: false, reason: '「' + a.label + '」只允许 ' + ROLE_LABEL[a.actor] + ' 操作' };
    if (a.from.indexOf(o.stage) < 0) {
      return { ok: false, reason: '当前状态「' + stageLabel(o.stage) + '」不可执行「' + a.label + '」，允许的状态：' + a.from.map(stageLabel).join(' / ') };
    }
    if (a.need === 'allChecked' && !allChecked(o)) {
      return { ok: false, reason: '材料尚未全部验收通过，不能提交验收' };
    }
    return { ok: true };
  }
  // 唯一执行入口：所有端都必须走它，越权会被拦下来
  // ⚠️ 注意：getOrder() 每次都从 localStorage 重新反序列化，返回的是"快照"而不是同一引用。
  //    因此下面任何分支都必须【重新 getOrder 一次】再返回，否则调用方拿到的是改动前的旧对象
  //    （典型症状：写了 doRescan，返回值里 stage 还是 rescan、rescan 字段还是 null）。
  function doAct(id, key, opts) {
    var o = getOrder(id); if (!o) return { ok: false, reason: '订单不存在' };
    var a = actInfo(key); if (!a) return { ok: false, reason: '未知操作' };
    opts = opts || {};
    var v = canAct(o, key, opts.role || a.actor);
    if (!v.ok) return v;
    // 统一出口：所有分支共用，保证返回的永远是落库后的最新对象
    function done(extra) {
      var fresh = getOrder(id);
      var res = { ok: true, order: fresh, stage: fresh ? fresh.stage : null };
      if (extra) { for (var k in extra) res[k] = extra[k]; }
      return res;
    }
    if (a.to === null) {
      // 不改变状态：打卡 / 婉拒
      if (key === 'log') { addLog(id, opts.text || '上传施工照片', opts.kind || 'photo'); return done(); }
      if (key === 'reject') { rejectOrder(id); return done({ toast: '已婉拒该订单' }); }
      return done();
    }
    if (key === 'doRescan') { completeRescan(id); return done(); }
    if (key === 'design') { uploadDesign(id); return done(); }
    if (key === 'assign') { assignCrew(id, opts.crew || { name: '王师傅', team: '金牌施工队', phone: '139****0088' }); return done(); }
    setStage(id, a.to, opts.by || '', a.note);
    return done();
  }
  var ROLE_LABEL = { merchant: '商家', crew: '工长', owner: '业主', ops: '系统' };

  // —— 意向登记：C 端提交预约 → 生成一条 lead，返回"已推送/已匹配"回执 ——
  function createLeadFromBooking(b) {
    loadOrders();
    var id = 'o' + (Date.now() + '').slice(-6);
    var matched = b.matched || MATCH_POOL.slice(0, 2);
    var o = {
      id: id, no: nextOrderNo(),
      homeId: b.homeId || 'h1', homeName: b.homeName || '阳光花园 89㎡',
      version: b.version || 1,
      planId: b.planId || '', planName: b.planName || '全屋综合改造',
      amount: b.amount || 0, stage: 'lead',
      created: todayStr(), requestedTime: b.time || '待商定',
      customer: { name: b.name || '', phone: b.phone || '', community: b.community || '', budget: b.budget || '' },
      crew: null, need: b.need || '', matched: matched,
      timeline: [{ stage: 'lead', time: nowStr(), by: '系统', note: '来自 C 端「提交预约」意向登记' }],
      logs: [], checks: {}, rescan: null
    };
    ensureChecks(o);
    ORDERS.unshift(o);
    saveOrders();
    return o;
  }
  // 意向 → 待接单（系统匹配服务商）
  function pushLeadToPool(id) {
    var o = getOrder(id); if (!o) return null;
    o.matched = o.matched || MATCH_POOL.slice(0, 2);
    return setStage(id, 'pending', '系统', '已推送给 ' + o.matched.map(function (m) { return m.name; }).join('、'));
  }
  var MATCH_POOL = [
    { name: '欧派旗舰店', tag: '全屋定制 · 已认证', dist: '1.2km', eta: '30 分钟内联系' },
    { name: '金牌施工队 · 王师傅', tag: 'M0 已接入 · 好评 4.9', dist: '3.6km', eta: '2 小时内联系' },
    { name: '索菲亚定制体验店', tag: '设计 + 施工一体', dist: '5.1km', eta: '今日 18:00 前联系' }
  ];
  function createOrderFromBooking(b) { return createLeadFromBooking(b); }

  // 社区案例 = 手写种子 + 完工订单自动生成
  function communityCases() {
    loadOrders();
    var gen = ORDERS.filter(function (o) { return o.rescan; }).map(function (o, i) {
      var p = planById(o.planId);
      var beforeVal = o.rescan.before, afterVal = o.rescan.after;
      if (p && o.rescan.beforeScores) {
        var k = DIM_OF[p.dimension];
        if (k && (k in o.rescan.beforeScores)) beforeVal = o.rescan.beforeScores[k];
        if (k && o.rescan.afterScores && (k in o.rescan.afterScores)) afterVal = o.rescan.afterScores[k];
      }
      return {
        id: 'gen-' + o.id, user: o.crew ? o.crew.name : '业主自助', home: o.homeName,
        before: beforeVal, after: afterVal,
        dim: p ? p.dimension : '综合',
        text: p ? p.action + '，' + p.effect.replace(/约\s*/, '') : '改造完工',
        likes: 12 + i * 7, hue: p ? (p.dimension === '采光' ? 40 : p.dimension === '收纳' ? 280 : 210) : 200,
        auto: true, orderNo: o.no, date: o.rescan.date
      };
    });
    return gen.concat(COMMUNITY);
  }

  // —— 逛街实景孪生（M5）——
  var MALL = [
    { id: 's1', name: '红星美凯龙 · 北店', cat: '家居旗舰', dist: '1.2km', live: true, hue: 210,
      tags: ['玻璃门', '定制柜', '中岛'], items: [{ n: '极窄边框推拉玻璃门', price: 3200 }, { n: '顶天立地定制衣柜', price: 6500 }] },
    { id: 's2', name: '宜家家居 · 荟聚', cat: '自选仓储', dist: '3.4km', live: true, hue: 40,
      tags: ['纱帘', '收纳盒', '理线'], items: [{ n: '透光白纱帘', price: 380 }, { n: '布艺收纳盒套装', price: 180 }] },
    { id: 's3', name: '索菲亚定制 · 体验店', cat: '全屋定制', dist: '5.1km', live: false, hue: 280,
      tags: ['全屋定制', '预约'], items: [{ n: '顶天立地定制衣柜', price: 6500 }] }
  ];

  // —— 智能家居场景编排（M4）——
  var SMART = {
    devices: ['客厅主灯', '阳台玻璃门', '空调', '扫地机器人', '窗帘', '新风'],
    scenes: [
      { id: 'home', name: '回家模式', icon: '🏠', desc: '开门即亮、窗帘打开、空调 26℃、播报今日日程',
        actions: [{ d: '客厅主灯', s: '开' }, { d: '阳台玻璃门', s: '关' }, { d: '空调', s: '26℃' }, { d: '窗帘', s: '开' }] },
      { id: 'away', name: '离家模式', icon: '🚪', desc: '全部关闭、扫地机启动、布防',
        actions: [{ d: '全部灯光', s: '关' }, { d: '空调', s: '关' }, { d: '窗帘', s: '关' }, { d: '扫地机器人', s: '开始' }] },
      { id: 'sleep', name: '睡眠模式', icon: '🌙', desc: '灯光调暗、静音、门锁布防',
        actions: [{ d: '主灯', s: '关' }, { d: '夜灯', s: '开 10%' }, { d: '空调', s: '睡眠' }, { d: '门锁', s: '布防' }] }
    ]
  };

  // —— 会员 / 订阅（8）——
  var MEMBERSHIP = {
    current: '免费版',
    plans: [
      { id: 'free', name: '免费版', price: 0, per: '永久', feats: ['每月 1 次空间扫描', '基础四维诊断', '方案查看与对比'] },
      { id: 'pro', name: '高级方案', price: 39, per: '月', feats: ['无限次扫描', 'AI 方案生成', 'AR 实景叠加', '复扫对比跟踪', '购物清单与比价'] },
      { id: 'family', name: '家庭版', price: 99, per: '月', feats: ['5 位家庭成员', '共享家资产', '跨设备编辑', '专属改造顾问'] }
    ]
  };
  function upgrade(planId) { ACCOUNT.plan = MEMBERSHIP.plans.filter(function (p) { return p.id === planId; })[0].name; saveAccount(); }

  // —— 商家 / B 端工作台（10）——
  var MERCHANT = {
    shop: '欧派旗舰店', role: '全屋定制 · 已认证',
    orders: [
      { id: 'o1', customer: '阳光花园 89㎡', plan: '阳台采光改造', amount: 3580, status: '待接单' },
      { id: 'o2', customer: '江景壹号 120㎡', plan: '主卧收纳扩容', amount: 6680, status: '方案中' },
      { id: 'o3', customer: '出租屋 60㎡', plan: '客厅收纳整理', amount: 1680, status: '已完成' }
    ],
    settle: { month: '2026-09', orders: 12, gmv: 38600, commission: 3860, paid: 3200 }
  };

  // —— 改造案例社区（11）——
  var COMMUNITY = [
    { id: 'c1', user: '设计师阿May', home: '89㎡ 三居', before: 45, after: 82, dim: '收纳',
      text: '顶天立地柜 + 隐藏式收纳，杂物终于有家。', likes: 128, hue: 280 },
    { id: 'c2', user: '老王改造', home: '60㎡ 一居', before: 58, after: 85, dim: '采光',
      text: '拆除非承重隔断换极窄玻璃门，客厅亮了一个度。', likes: 96, hue: 40 },
    { id: 'c3', user: 'Lina', home: '120㎡ 四居', before: 68, after: 88, dim: '噪音',
      text: '隔音窗帘 + 窗缝密封条，终于睡个好觉。', likes: 74, hue: 260 }
  ];

  // —— 购物车（localStorage）——
  var CART_KEY = 'spacemirror_cart_v1';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveCart(lines) {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    renderBadges();
  }
  // 把某方案的必买+可选商品加入清单（已存在则跳过）
  function addPlanToCart(planId) {
    var plan = DIAGNOSIS.plans.filter(function (p) { return p.id === planId; })[0];
    if (!plan) return 0;
    var cart = getCart();
    var added = 0;
    plan.products.forEach(function (pr) {
      if (!cart.some(function (l) { return l.pid === pr.pid; })) {
        cart.push({
          pid: pr.pid, planId: plan.id, group: plan.group,
          name: pr.name, spec: pr.spec, price: pr.price,
          qty: pr.qty, required: pr.required, merchant: pr.merchant,
          icon: pr.icon, hue: pr.hue
        });
        added += pr.qty;
      }
    });
    saveCart(cart);
    return added;
  }
  function changeQty(pid, delta) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].pid === pid) {
        cart[i].qty += delta;
        if (cart[i].qty < 1) cart[i].qty = 1;
        break;
      }
    }
    saveCart(cart);
    return cart;
  }
  function cartCount() {
    return getCart().reduce(function (s, l) { return s + l.qty; }, 0);
  }
  function cartTotal() {
    return getCart().reduce(function (s, l) { return s + l.price * l.qty; }, 0);
  }
  // 套餐优惠：满 3000 减 300 后再 95 折
  function cartDiscount(total) {
    if (total <= 0) return 0;
    var after = total;
    if (total >= 3000) after -= 300;
    after = Math.round(after * 0.95);
    return total - after;
  }
  function renderBadges() {
    var n = cartCount();
    document.querySelectorAll('[data-cart-badge]').forEach(function (el) {
      el.textContent = n;
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }

  global.SPACE_MIRROR = {
    DIAGNOSIS: DIAGNOSIS,
    PRIORITY_LABEL: PRIORITY_LABEL,
    PRIORITY_ORDER: PRIORITY_ORDER,
    // 账号
    ACCOUNT: ACCOUNT, loadAccount: loadAccount, saveAccount: saveAccount,
    login: login, logout: logout,
    // 家资产
    HOMES: HOMES, loadHomes: loadHomes, saveHomes: saveHomes,
    renameHome: renameHome, toggleShare: toggleShare, getHome: getHome,
    getVersions: getVersions, latestVersion: latestVersion, addVersion: addVersion,
    versionComposite: versionComposite, ensureVersions: ensureVersions,
    // 复扫对比
    RESCAN: RESCAN, rescanComposite: rescanComposite,
    // 订单状态机（开放平台 M0 · 施工接入）
    STAGES: STAGES, stageInfo: stageInfo, stageLabel: stageLabel, stageTab: stageTab,
    loadOrders: loadOrders, saveOrders: saveOrders, resetOrders: resetOrders,
    listOrders: listOrders, getOrder: getOrder, ensureChecks: ensureChecks,
    setStage: setStage, nextOrderNo: nextOrderNo, createOrderFromBooking: createOrderFromBooking,
    acceptOrder: acceptOrder, rejectOrder: rejectOrder, uploadDesign: uploadDesign,
    assignCrew: assignCrew, startWork: startWork, toggleCheck: toggleCheck,
    checkStats: checkStats, allChecked: allChecked, addLog: addLog,
    requestRescan: requestRescan, completeRescan: completeRescan,
    rescanForHome: rescanForHome, communityCases: communityCases,
    ACTIONS: ACTIONS, actInfo: actInfo, actionsFor: actionsFor,
    canAct: canAct, doAct: doAct, ROLE_LABEL: ROLE_LABEL,
    createLeadFromBooking: createLeadFromBooking, pushLeadToPool: pushLeadToPool,
    MATCH_POOL: MATCH_POOL, mapScores: mapScores,
    DIM_OF: DIM_OF, planById: planById, todayStr: todayStr, nowStr: nowStr,
    // 逛街
    MALL: MALL,
    // 智能家居
    SMART: SMART,
    // 会员
    MEMBERSHIP: MEMBERSHIP, upgrade: upgrade,
    // 商家
    MERCHANT: MERCHANT,
    // 社区
    COMMUNITY: COMMUNITY,
    // 购物车
    getCart: getCart,
    addPlanToCart: addPlanToCart,
    changeQty: changeQty,
    cartCount: cartCount,
    cartTotal: cartTotal,
    cartDiscount: cartDiscount,
    renderBadges: renderBadges
  };
})(window);
