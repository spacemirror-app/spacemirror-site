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
    { id: 'h1', name: '阳光花园 · 89㎡ 三居', area: '89㎡ · 3室2厅', updated: '2026-10-07', scans: 1, device: 'iPhone 17 Pro', shared: false, glb: '阳光花园_89.glb' },
    { id: 'h2', name: '江景壹号 · 120㎡ 四居', area: '120㎡ · 4室2厅', updated: '2026-09-28', scans: 1, device: 'iPhone 17 Pro', shared: true, glb: '江景壹号_120.glb' },
    { id: 'h3', name: '出租屋 · 60㎡ 一居', area: '60㎡ · 1室1厅', updated: '2026-09-15', scans: 1, device: 'iPhone 15', shared: false, glb: '出租屋_60.glb' }
  ];
  function loadHomes() {
    try { var h = JSON.parse(localStorage.getItem(HOMES_KEY)); if (h && h.length) HOMES = h; } catch (e) {}
    return HOMES;
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
    // 复扫对比
    RESCAN: RESCAN, rescanComposite: rescanComposite,
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
