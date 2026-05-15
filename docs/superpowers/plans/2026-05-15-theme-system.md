# Theme System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有暗色 UI 添加亮色主题，通过 `data-theme` attribute + CSS 变量实现手动切换，偏好持久化到 localStorage。

**Architecture:** 在 `<html>` 上切换 `data-theme="dark"/"light"`，CSS `[data-theme="light"]` 块覆盖所有语义变量。`useTheme` hook 管理状态，`ThemeProvider` 负责初始化同步，Navbar 提供切换按钮。所有现有组件无需修改。

**Tech Stack:** React 19, CSS 变量, localStorage, lucide-react (Sun/Moon 图标)

---

### Task 1: CSS 亮色变量 + grain opacity 变量

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 在 `src/index.css` 的 `:root` 块中添加 `--grain-opacity` 变量，并更新 grain overlay 使用该变量**

将 `:root` 块改为：

```css
:root {
  --ink: #0f0e0d;
  --ink-soft: #1c1a18;
  --ink-muted: #2e2b27;
  --paper: #f5f0e8;
  --paper-warm: #ede8dc;
  --paper-dim: #d4cfc4;
  --gold: #c9a84c;
  --gold-light: #e8c96a;
  --gold-dim: #8a6f2e;
  --accent: #e05c3a;
  --accent-soft: #f07a5a;
  --text-primary: #f5f0e8;
  --text-secondary: #a09a90;
  --text-muted: #6b6560;
  --border: rgba(245, 240, 232, 0.08);
  --border-warm: rgba(201, 168, 76, 0.2);
  --grain-opacity: 0.025;
}
```

将 `body::before` 的 `opacity: 0.025;` 改为 `opacity: var(--grain-opacity);`

- [ ] **Step 2: 在 `:root` 块之后添加亮色主题变量块**

在 `:root { ... }` 结束后、`* { box-sizing: border-box; }` 之前插入：

```css
[data-theme="light"] {
  --ink: #f5f0e8;
  --ink-soft: #ede8dc;
  --ink-muted: #d4cfc4;
  --text-primary: #1a1714;
  --text-secondary: #5a5248;
  --text-muted: #8a8278;
  --border: rgba(26, 23, 20, 0.1);
  --border-warm: rgba(201, 168, 76, 0.35);
  --grain-opacity: 0.015;
}
```

- [ ] **Step 3: 更新亮色主题下的滚动条颜色**

在 `[data-theme="light"]` 块之后添加：

```css
[data-theme="light"] ::-webkit-scrollbar-track {
  background: var(--ink-soft);
}
[data-theme="light"] ::-webkit-scrollbar-thumb {
  background: var(--ink-muted);
}
[data-theme="light"] ::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
```

- [ ] **Step 4: 更新 Navbar 的 scrolled 背景色为 CSS 变量**

当前 Navbar 的 scrolled 背景色硬编码为 `rgba(15, 14, 13, 0.95)`（暗色值），亮色主题下会显示错误颜色。需要改为 CSS 变量。

在 `src/index.css` 末尾添加：

```css
.navbar-scrolled {
  background-color: rgba(from var(--ink) r g b / 0.95);
}
```

> 注意：`rgba(from ...)` 是 CSS color-mix 语法，部分浏览器支持有限。改用更兼容的方案：在 `[data-theme="light"]` 块中添加 `--navbar-bg: rgba(245, 240, 232, 0.95);`，在 `:root` 中添加 `--navbar-bg: rgba(15, 14, 13, 0.95);`，然后在 Navbar 组件中使用该变量（Task 3 处理）。

将 `[data-theme="light"]` 块更新为：

```css
[data-theme="light"] {
  --ink: #f5f0e8;
  --ink-soft: #ede8dc;
  --ink-muted: #d4cfc4;
  --text-primary: #1a1714;
  --text-secondary: #5a5248;
  --text-muted: #8a8278;
  --border: rgba(26, 23, 20, 0.1);
  --border-warm: rgba(201, 168, 76, 0.35);
  --grain-opacity: 0.015;
  --navbar-bg: rgba(245, 240, 232, 0.95);
}
```

将 `:root` 块更新，添加 `--navbar-bg`:

```css
:root {
  --ink: #0f0e0d;
  --ink-soft: #1c1a18;
  --ink-muted: #2e2b27;
  --paper: #f5f0e8;
  --paper-warm: #ede8dc;
  --paper-dim: #d4cfc4;
  --gold: #c9a84c;
  --gold-light: #e8c96a;
  --gold-dim: #8a6f2e;
  --accent: #e05c3a;
  --accent-soft: #f07a5a;
  --text-primary: #f5f0e8;
  --text-secondary: #a09a90;
  --text-muted: #6b6560;
  --border: rgba(245, 240, 232, 0.08);
  --border-warm: rgba(201, 168, 76, 0.2);
  --grain-opacity: 0.025;
  --navbar-bg: rgba(15, 14, 13, 0.95);
}
```

- [ ] **Step 5: 运行类型检查确认 CSS 无误**

```bash
pnpm typecheck
```

Expected: 无错误输出

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat: add light theme CSS variables"
```

---

### Task 2: `useTheme` hook

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: 创建 `src/hooks/` 目录并新建 `useTheme.ts`**

```ts
import { useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme');
    return (stored === 'light' || stored === 'dark') ? stored : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
}
```

- [ ] **Step 2: 运行类型检查**

```bash
pnpm typecheck
```

Expected: 无错误输出

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTheme.ts
git commit -m "feat: add useTheme hook"
```

---

### Task 3: `ThemeProvider` 组件 + 接入 `main.tsx`

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: 创建 `src/components/ThemeProvider.tsx`**

ThemeProvider 负责在首次渲染前同步 `data-theme` 到 `<html>`，防止闪烁。

```tsx
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
  }, []);

  return <>{children}</>;
}
```

- [ ] **Step 2: 在 `src/main.tsx` 中用 `ThemeProvider` 包裹 `RouterProvider`**

将 `src/main.tsx` 改为：

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ThemeProvider } from '@/components/ThemeProvider';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
```

- [ ] **Step 3: 运行类型检查**

```bash
pnpm typecheck
```

Expected: 无错误输出

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeProvider.tsx src/main.tsx
git commit -m "feat: add ThemeProvider and wire into main"
```

---

### Task 4: Navbar 切换按钮 + 修复 scrolled 背景色

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: 在 Navbar 中引入 `useTheme` 并修复 scrolled 背景色**

将 `src/components/Navbar.tsx` 完整替换为：

```tsx
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '案例库', path: '/cases' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'border-b' : 'border-b border-transparent'
      )}
      style={{
        backgroundColor: scrolled ? 'var(--navbar-bg)' : 'transparent',
        borderColor: scrolled ? 'var(--border)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-7 h-7 flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, var(--gold), var(--gold-dim))',
                color: 'var(--ink)',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}
            >
              YY
            </div>
            <span className="font-display font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
              营销案例库
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium tracking-wide transition-colors duration-200 relative py-1',
                    isActive ? '' : 'hover:opacity-100'
                  )}
                  style={{ color: isActive ? 'var(--gold)' : 'var(--text-secondary)' }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: 'var(--gold)' }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              to="/cases"
              className="hidden sm:flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border transition-all duration-200"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border)',
                backgroundColor: 'rgba(128, 128, 128, 0.04)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              搜索案例
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border transition-all duration-200"
              style={{
                color: 'var(--text-secondary)',
                borderColor: 'var(--border)',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--gold)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-warm)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
              aria-label={theme === 'dark' ? '切换到亮色主题' : '切换到暗色主题'}
            >
              {theme === 'dark' ? (
                /* Sun icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                </svg>
              ) : (
                /* Moon icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Mobile search */}
            <Link to="/cases" className="md:hidden p-2" style={{ color: 'var(--text-secondary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: 运行类型检查**

```bash
pnpm typecheck
```

Expected: 无错误输出

- [ ] **Step 3: 启动开发服务器，手动验证**

```bash
pnpm dev
```

验证清单：
- 默认加载为暗色主题
- 点击 Navbar 右侧按钮切换到亮色，背景变为暖米白，文字变为深墨棕
- 再次点击切回暗色
- 刷新页面后主题保持（localStorage 持久化）
- 滚动后 Navbar 背景色在两个主题下均正确（暗色半透明黑，亮色半透明米白）

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add theme toggle button to Navbar"
```

---

### Task 5: 最终集成验证与收尾

**Files:** 无新文件

- [ ] **Step 1: 运行完整类型检查**

```bash
pnpm typecheck
```

Expected: 无错误

- [ ] **Step 2: 验证所有页面在两个主题下的视觉效果**

启动 `pnpm dev`，依次检查：

| 页面 | 检查项 |
|---|---|
| 首页 `/` | Hero 背景、搜索框、卡片区块 |
| 案例库 `/cases` | 侧边栏筛选、卡片列表、加载状态 |
| 案例详情 `/case/:id` | 分析卡片、标签、指标区块 |
| 404 页面 | 背景色、文字颜色 |

- [ ] **Step 3: 最终 commit**

```bash
git add -A
git commit -m "feat: complete light/dark theme system"
```
