# 开发流程

## 环境搭建

1. 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开项目目录 `miniprogram-1/`
3. AppID: `wxaf129634179422e4`（或使用测试号）
4. 确认基础库版本 ≥ 2.32.3
5. 确认已启用"将 JS 编译成 ES5"和"增强编译"

## 新建页面

```bash
# 1. 在 miniprogram/pages/ 下创建目录
mkdir miniprogram/pages/my-page

# 2. 创建 4 个文件
touch miniprogram/pages/my-page/my-page.json
touch miniprogram/pages/my-page/my-page.ts
touch miniprogram/pages/my-page/my-page.wxml
touch miniprogram/pages/my-page/my-page.scss
```

### 页面模板

**my-page.json**:
```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar"
  }
}
```

**my-page.ts**:
```typescript
Component({
  data: {},

  lifetimes: {
    attached() {
      this.loadData();
    },
  },

  pageLifetimes: {
    show() {
      this.loadData();
    },
  },

  methods: {
    loadData() {
      // 从 storage 读取数据
    },
  },
});
```

### 注册页面
在 `app.json` 的 `pages` 数组中添加路径。Tab 页面还需在 `tabBar.list` 中配置。

## 新建组件

组件放在 `miniprogram/components/` 下，每个组件一个目录，包含 json/ts/wxml/scss 四个文件。

**my-component.json**:
```json
{
  "component": true,
  "styleIsolation": "apply-shared"
}
```

**my-component.ts**:
```typescript
Component({
  properties: {
    title: { type: String, value: '' },
  },
  data: {},
  methods: {},
});
```

在页面 json 中注册：`"my-component": "/components/my-component/my-component"`

## 数据层规范

### 新增存储类型
1. 在 `types/index.ts` 定义接口
2. 在 `utils/storage.ts` 添加：
   - 常量 key（前缀 `fitness_`）
   - 私有 getter（全量读取）
   - 公开的 CRUD 函数
3. 页面中通过 `import { xxx } from '../../utils/storage'` 引用

### ID 生成
使用 `generateId()` (timestamp36 + random36)，不依赖 UUID 库。

### 日期格式
- 存储: `YYYY-MM-DD` (通过 `utils/date.ts` 的 `today()` / `formatDate()`)
- 展示: `XXXX年XX月XX日` (通过 `formatDisplay()`)
- 图表标签: `MM/DD` (组件内 `formatDateLabel()`)

## 新增 Tab

1. 创建页面目录和文件
2. 在 `app.json` 的 `pages` 数组和 `tabBar.list` 中注册
3. 如需图标，准备 81×81 PNG（未选中 + 选中各一张）

## 提交规范

- 提交信息中文或英文均可，简洁描述改动内容
- 功能开发使用 `feat: xxx`
- Bug 修复使用 `fix: xxx`
- 文档更新使用 `docs: xxx`
- 每次提交前在微信开发者工具中编译验证

## 调试技巧

- 微信开发者工具 → 调试器 → Storage 查看本地数据
- Console 面板查看日志
- AppData 面板查看当前页面 data
- 使用 `wx.showToast({ title: 'xxx', icon: 'none' })` 临时调试
- Skyline 渲染问题可通过 `rendererOptions.skyline.disableABTest` 排查
