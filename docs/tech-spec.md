# 技术规范

## 渲染引擎

- **Skyline 渲染引擎**: 使用 WebView-free 的新一代渲染管线
  - `defaultDisplayBlock: true` — 默认块级布局
  - `defaultContentBox: true` — 默认 content-box 盒模型
  - `tagNameStyleIsolation: "legacy"` — 组件样式隔离模式
- **组件框架**: `glass-easel`（Skyline 配套组件系统）
- **Canvas 限制**: Skyline 对 Canvas 2D 支持不完整，图表使用纯 view 方案

## 编程语言

### TypeScript
- **编译目标**: ES2020
- **模块系统**: CommonJS
- **严格模式**: 全部开启 (`strict: true`, `strictNullChecks: true`, `noImplicitAny: true`)
- **类型定义**: `miniprogram-api-typings@^2.8.3-1`
- **命名空间类型**: 使用 `WechatMiniprogram.Input`、`WechatMiniprogram.PickerChange` 等标注事件

### SCSS
- `rpx` 响应式像素单位 (iPhone 6: 1rpx = 0.5px)
- CSS 自定义属性 (变量) 定义在 `app.scss` 的 `page` 选择器中
- 组件通过 `styleIsolation: "apply-shared"` 继承页面变量

## 数据持久化

### 存储方案
- 使用 `wx.setStorageSync` / `wx.getStorageSync` 同步 API
- 存储上限: 10MB/Key，对健身数据绰绰有余
- 所有读写通过 `utils/storage.ts` 封装，统一 try-catch 保护

### Storage Keys
```
fitness_user_profile    → UserProfile | null
fitness_weight_history  → WeightRecord[]
fitness_workouts        → WorkoutRecord[]
fitness_diets           → DietRecord[]
```

### 数据查询模式
- 训练/饮食按日期查询：从数组中 `find(record => record.date === date)`
- 体重按时间倒序：`unshift` 新记录，查询取 `[0]` 为最新
- 增删改均全量读取 → 修改 → 全量写回

## BMR 计算公式

**Mifflin-St Jeor (1990)**:
```
男: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 + 5
女: BMR = 10 × 体重(kg) + 6.25 × 身高(cm) - 5 × 年龄 - 161
```

**TDEE (每日总消耗)**:
```
TDEE = BMR × 活动系数
```

| 活动水平 | 系数 | 说明 |
|----------|------|------|
| 久坐不动 | 1.2 | 几乎不运动 |
| 轻度活动 | 1.375 | 每周 1-3 天 |
| 中度活动 | 1.55 | 每周 3-5 天 |
| 高度活跃 | 1.725 | 每周 6-7 天 |
| 极度活跃 | 1.9 | 运动员/体力劳动者 |

## 页面架构

### 生命周期
- 使用 `Component()` 构造器（非旧式 `Page()`）
- 初始化：`lifetimes.attached()`
- Tab 切换刷新：`pageLifetimes.show()`
- 数据加载封装为 `loadData()` / `loadDashboard()` 等方法

### 组件通信
- 父→子：`properties` 传递数据
- 子→父：`triggerEvent('save', data)` / `triggerEvent('cancel')`
- 编辑弹窗通过 `wx:if` 控制显隐

## chart-view 实现原理

纯 WXML + CSS 实现折线图，不依赖 Canvas：

1. 计算值域范围 `[min, max]`，上下留 10% padding
2. 将数据点映射到像素坐标：`x = i/(n-1) × width`, `y = height - (value-min)/(max-min) × height`
3. 折线段：绝对定位 `<view>` + `transform: rotate(atan2(dy,dx))` + 计算宽度
4. 数据点：绝对定位圆形 `<view>`，上方显示数值标签
5. 坐标轴：Y 轴 5 等分标签 + X 轴日期标签

## 组件规范
- `component: true` 声明
- `styleIsolation: "apply-shared"` 共享页面样式变量
- 属性类型声明使用 `type: Number/String/Boolean/Array/Object`
- 复杂属性通过 `observers` 监听变化重新计算
