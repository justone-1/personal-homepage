// 手机导航：同步可见状态和读屏工具读取的展开状态。
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '打开导航菜单');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);

// 关于我：标题关键词与标签切换同一组内容，照片随学习/生活视角同步。
const aboutSection = document.querySelector('#about');
const aboutTabs = [...aboutSection.querySelectorAll('[role="tab"]')];
const aboutPanels = [...aboutSection.querySelectorAll('[role="tabpanel"]')];
const aboutPhoto = aboutSection.querySelector('.about-photo');
function showAbout(view) {
  const selectedTab = aboutTabs.find(tab => tab.dataset.aboutView === view);
  if (!selectedTab) return;
  aboutTabs.forEach(tab => {
    const selected = tab === selectedTab;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  aboutPanels.forEach(panel => { panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls'); });
  aboutSection.querySelectorAll('.about-title-link').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.aboutView === view));
  });
  const studying = view === 'study';
  aboutPhoto.dataset.aboutMode = view;
  aboutPhoto.querySelector('.about-photo-study').setAttribute('aria-hidden', String(!studying));
  aboutPhoto.querySelector('.about-photo-life').setAttribute('aria-hidden', String(studying));
  aboutPhoto.querySelector('.about-photo-note').textContent = studying ? '学习的一页' : '生活的一页';
  document.querySelector('#about-photo-label').textContent = studying ? '01 / A NEW CHAPTER' : '02 / OFF THE SCREEN';
  document.querySelector('#about-photo-caption').textContent = studying ? '记录一个新的起点，继续好奇。' : '运动、听歌，让日常有自己的节奏。';
}
aboutSection.querySelectorAll('button[data-about-view]').forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => showAbout(button.dataset.aboutView));
});
aboutTabs.forEach((tab, index) => {
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % aboutTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + aboutTabs.length) % aboutTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = aboutTabs.length - 1;
    else return;
    event.preventDefault();
    showAbout(aboutTabs[next].dataset.aboutView);
    aboutTabs[next].focus();
  });
});
aboutSection.querySelector('.about-tabs').hidden = false;
aboutSection.querySelector('.about-invitation').hidden = false;

// 项目详情：只收录用户简历中的实际经历，不虚构链接或研究成果。
const projects = {
  warehouse: {
    category: 'DEVELOPMENT / 开发项目',
    title: '仓库管理系统',
    period: '2023.11 — 2024.09 · 项目组成员',
    description: '针对企业仓库管理效率问题，开发包含物资查询、库存盘点和数据可视化功能的仓库管理系统，帮助管理人员梳理仓储流程。',
    contributions: ['负责前端功能开发与交互优化，使用 Vue.js 构建界面。', '使用 ECharts 展示库存数据，提升信息的可读性。', '通过 Axios 进行数据请求，优化页面加载与核心功能交互。'],
    note: '技术：Vue.js / ECharts / Axios。封面为本站原创概念示意；暂未提供原项目截图与公开仓库。'
  },
  agv: {
    category: 'INTERNSHIP / 企业实习',
    title: 'AGV 可视化任务调度平台',
    period: '2025.07 — 2025.08 · 广东嘉腾机器人自动化有限公司 · 实习生',
    description: '实习期间接触面向物流场景的 AGV 可视化任务调度平台。平台涵盖地图编辑、设备协同、任务管理与实时监控，我参与其中的插件与信息管理功能开发。',
    contributions: ['参与部分插件功能开发，增加信息交互按钮。', '对接后端系统，在界面中显示信息及信息总量。', '实现信息分类与一键删除功能，完善相关交互。'],
    note: '此处仅介绍个人参与范围，不展示企业内部代码或资料。封面为原创概念示意。'
  },
  learning: {
    category: 'LEARNING / 竞赛与学习经历',
    title: '蓝桥杯 Python 竞赛',
    period: '2025 · 第十六届蓝桥杯 Python B 组大赛',
    description: '参加第十六届蓝桥杯 Python B 组大赛，获得省级二等奖。这段经历属于本科阶段的编程竞赛与问题求解实践。',
    contributions: ['参赛组别：Python B 组。', '竞赛结果：省级二等奖。', '学习方向：Python 编程与问题求解。'],
    note: '竞赛年份、组别与奖项依据本人简历整理；未编造具体题目、分数、排名或公开代码链接。'
  }
};
const dialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    document.querySelector('#dialog-category').textContent = project.category;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-period').textContent = project.period;
    document.querySelector('#dialog-description').textContent = project.description;
    document.querySelector('#dialog-note').textContent = project.note;
    const list = document.querySelector('#dialog-contributions');
    list.replaceChildren(...project.contributions.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
dialog.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

// 复制邮箱；不支持剪贴板时明确提示手动复制，不假装成功。
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('2382390225@qq.com');
    status.textContent = '邮箱已复制，可以粘贴到邮件客户端。';
  } catch {
    status.textContent = '当前浏览器不允许自动复制，请选中上方邮箱手动复制。';
  }
});

// 轻量滚动出现：默认显示内容；支持且未选择减少动效时才启用。
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.documentElement.classList.add('reveal-enabled');
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}
