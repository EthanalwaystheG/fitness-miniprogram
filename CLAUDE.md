# 健身记录微信小程序 (Diet Record)

基于微信小程序原生框架的健身与饮食追踪应用。

## 技术栈

- **框架**: 微信小程序原生 (Skyline 渲染引擎 + glass-easel 组件框架)
- **语言**: TypeScript (strict 模式)
- **样式**: SCSS
- **数据**: 本地存储 `wx.setStorageSync`，无后端/云开发
- **基础库**: 2.32.3

## 目录结构

```
miniprogram/
├── app.json / app.ts / app.scss    ← 应用入口与全局配置
├── types/index.ts                  ← 所有 TS 类型定义
├── data/
│   ├── foods.ts                    ← 食物预设数据库 (6分类46种)
│   └── exercises.ts                ← 动作库 (6部位60动作)
├── utils/
│   ├── storage.ts                  ← 本地存储 CRUD 封装
│   ├── bmr.ts                      ← BMR/TDEE 计算 (Mifflin-St Jeor)
│   ├── date.ts                     ← 日期工具函数
│   └── util.ts                     ← formatTime 等通用工具
├── components/
│   ├── navigation-bar/             ← 自定义导航栏
│   ├── chart-view/                 ← 纯 view 体重趋势折线图
│   ├── exercise-editor/            ← 训练动作编辑弹窗
│   ├── food-editor/                ← 食物编辑弹窗
│   └── macro-bar/                  ← 宏量营养素占比条
└── pages/
    ├── index/                      ← Tab1 今日概览 Dashboard
    ├── workout/                    ← Tab2 训练记录
    ├── diet/                       ← Tab3 饮食记录
    └── profile/                    ← Tab4 我的 (BMR + 体重趋势)
```

## 标准文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 功能需求 | [docs/requirements.md](docs/requirements.md) | 模块功能清单、数据模型、页面要求 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 渲染引擎、语言规范、存储方案、计算公式 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩系统、间距、圆角、字体、组件规范 |
| 开发流程 | [docs/dev-procedures.md](docs/dev-procedures.md) | 环境搭建、新建页面/组件步骤、提交规范 |
| 迭代路线 | [docs/roadmap.md](docs/roadmap.md) | 后续功能优先级与版本规划 |
| 开发日志 | [devlog/](devlog/) | 每日开发记录（已完成 + 待办） |

## 开发约定

### 页面模式
- 所有页面使用 `Component()` 模式（非旧式 `Page()`）
- 页面生命周期用 `lifetimes.attached()` 初始化，`pageLifetimes.show()` 刷新

### 数据层
- 所有持久化数据通过 `utils/storage.ts` 操作，不直接调用 `wx.setStorageSync`
- Storage Key 统一前缀 `fitness_`，定义在 `utils/storage.ts` 常量中
- 新记录 ID 使用 `generateId()` 生成

### TypeScript
- 所有接口定义在 `types/index.ts`
- 使用 `WechatMiniprogram.Input` 等命名空间类型标注事件参数
- 组件 properties 通过类型断言读取：`this.properties.xxx as Type`

### 样式
- 全局 CSS 变量定义在 `app.scss` 的 `page` 选择器中
- 组件使用 `styleIsolation: "apply-shared"` 继承页面变量
- 使用 `rpx` 单位，1rpx = 0.5px (iPhone 6 基准)

### 存储 Key

| Key | 类型 |
|-----|------|
| `fitness_user_profile` | `UserProfile \| null` |
| `fitness_weight_history` | `WeightRecord[]` |
| `fitness_workouts` | `WorkoutRecord[]` |
| `fitness_diets` | `DietRecord[]` |

## 当前状态
- 4 个 Tab 页面功能完整
- 5 个自定义组件可用
- 食物预设数据库 6 分类 46 种食物（每 100g 营养数据）
- 动作库 6 部位 60 个预设动作（含目标肌群）
- food-editor / exercise-editor 支持从预设库选择
- 本地存储 CRUD 已封装
- 待完善: Tab 图标、数据导出、真机测试
