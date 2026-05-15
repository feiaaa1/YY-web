# 主题系统设计文档

**日期：** 2026-05-15  
**范围：** 为现有暗色 UI 添加亮色主题，支持手动切换，偏好持久化到 localStorage

---

## 目标

- 提供暗色（默认）和亮色两套主题
- 用户手动切换，偏好跨会话保留
- 不修改任何现有组件代码（纯 CSS 变量驱动）

---

## 架构

### 机制：`data-theme` attribute on `<html>`

在 `<html>` 元素上设置 `data-theme="dark"` 或 `data-theme="light"`，CSS 通过属性选择器覆盖变量。所有组件已使用 `var(--*)` 内联样式，无需改动。

```
localStorage('theme') → ThemeProvider → document.documentElement.dataset.theme
                                       ↓
                              CSS [data-theme="light"] { ... }
                                       ↓
                         所有组件自动响应（无需修改）
```

---

## 文件变更

### 1. `src/index.css`

新增 `[data-theme="light"]` 块，覆盖所有语义变量：

| 变量 | 暗色（默认） | 亮色 |
|---|---|---|
| `--ink` | `#0f0e0d` | `#f5f0e8` |
| `--ink-soft` | `#1c1a18` | `#ede8dc` |
| `--ink-muted` | `#2e2b27` | `#d4cfc4` |
| `--text-primary` | `#f5f0e8` | `#1a1714` |
| `--text-secondary` | `#a09a90` | `#5a5248` |
| `--text-muted` | `#6b6560` | `#8a8278` |
| `--border` | `rgba(245,240,232,0.08)` | `rgba(26,23,20,0.1)` |
| `--border-warm` | `rgba(201,168,76,0.2)` | `rgba(201,168,76,0.35)` |
| `--gold` | `#c9a84c` | `#c9a84c`（不变） |
| `--gold-light` | `#e8c96a` | `#e8c96a`（不变） |
| `--gold-dim` | `#8a6f2e` | `#8a6f2e`（不变） |

亮色主题下滚动条颜色也跟随调整（track: `--ink-soft`，thumb: `--ink-muted`）。

grain overlay 在亮色下 opacity 降至 `0.015`（暗色 `0.025`），通过 CSS 变量 `--grain-opacity` 控制。

### 2. `src/hooks/useTheme.ts`（新建）

```ts
type Theme = 'dark' | 'light';

export function useTheme(): { theme: Theme; toggleTheme: () => void }
```

- 初始化：读 `localStorage.getItem('theme')`，fallback `'dark'`
- `toggleTheme()`：翻转当前值，写 `localStorage`，更新 `document.documentElement.dataset.theme`
- 用 `useState` 管理，无需 Context（Navbar 是唯一消费者）

### 3. `src/components/ThemeProvider.tsx`（新建）

```tsx
export function ThemeProvider({ children }: { children: React.ReactNode })
```

- 在 `useEffect` 中读 localStorage 并同步 `data-theme` 到 `<html>`
- 防止首次渲染闪烁：在 `<html>` 上设置初始值（读 localStorage，fallback `'dark'`）
- 在 `src/main.tsx` 中包裹 `<RouterProvider>`

### 4. `src/components/Navbar.tsx`（修改）

在右侧操作区加切换按钮：

- 图标：亮色主题显示月亮（切换到暗色），暗色主题显示太阳（切换到亮色）
- 样式：圆形边框按钮，与现有"搜索案例"按钮风格一致
- 调用 `useTheme()` 的 `toggleTheme`

---

## 亮色调色板说明

延续现有设计语言（Playfair Display + DM Sans + 金色点缀），亮色版本：

- 背景：暖米白 `#f5f0e8`（即原暗色的 `--paper`）
- 次级背景：奶油色 `#ede8dc`（原 `--paper-warm`）
- 文字：深墨棕 `#1a1714`，次级 `#5a5248`
- 金色点缀保持不变，在亮色背景上同样醒目
- 整体感觉：高端印刷品 / 日式文具店

---

## 不在范围内

- 跟随系统 `prefers-color-scheme`（用户明确要求手动切换）
- 动画过渡（切换时无 transition，保持简洁）
- 其他主题色（仅暗/亮两套）
