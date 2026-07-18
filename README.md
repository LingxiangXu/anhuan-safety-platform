# 太重集团安全管理平台（演示系统）

太重数智 · 安全生产综合管理平台产品演示 Demo（基于 V4 版本迁移）。

## 技术栈

- Vue 2.7 + vue-router 3（Hash 模式）
- Webpack 5 + sass-loader
- ECharts 6（数据可视化）
- 高德地图 JS API v2（风险四色图）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:8081）
npm run dev

# 生产构建
npm run build
```

## 目录结构

```
src/
├── App.vue                 # 根组件
├── main.js                 # 入口
├── router/index.js         # 路由（21 条）
├── store/safeData.js       # Mock 数据中心
├── assets/styles/          # global.scss + variables.scss（品牌 SCSS 变量）
├── components/
│   ├── common/             # BrandLogo、SideNav
│   └── safety/             # FactoryMap、RealMap
└── views/
    ├── ProductCenter.vue   # 产品中心首页
    └── safety-platform/    # 安全平台各功能页面
```

## 品牌规范

统一采用太重数智品牌色：工业蓝 `#0075E6` / 数智绿 `#00AA1C`，所有颜色通过 `variables.scss` SCSS 变量引用。

## 核心模块

驾驶舱 · 风险管理（LEC 审批链 + 四色图）· 隐患治理与集团督办 · 特殊作业管控 · BPM 审批对接 · 培训管理 · 移动工作台 · 建设规划与预算。
