# Square Grid Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a global background texture as a very subtle square grid behind the site, while keeping the hero visually clean.

**Architecture:** Add one fixed, body-level overlay that renders a square grid. Keep the hero opaque enough to mask it, and let the rest of the site inherit the texture without changing section layouts or internal borders.

**Tech Stack:** Nuxt, Vue 3, CSS custom properties

---

### Task 1: Global Grid Overlay

**Files:**
- Modify: `app/assets/css/tokens.css`
- Modify: `app/assets/css/global.css`

- [ ] **Step 1: Add the grid size and tone tokens**

```css
--grid-square-size: 160px;
--grid-square-line: rgba(0, 0, 0, 0.06);
--grid-square-line-soft: rgba(0, 0, 0, 0.035);
--grid-square-opacity: 0.32;
--grid-square-dark-line: rgba(245, 245, 242, 0.08);
--grid-square-dark-line-soft: rgba(245, 245, 242, 0.05);
--grid-square-dark-opacity: 0.22;
```

- [ ] **Step 2: Reintroduce a fixed `body::before` overlay using those tokens**

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--grid-square-line) var(--border-width), transparent var(--border-width)),
    linear-gradient(to bottom, var(--grid-square-line-soft) var(--border-width), transparent var(--border-width));
  background-size: var(--grid-square-size) var(--grid-square-size);
  opacity: var(--grid-square-opacity);
  z-index: 0;
}
```

- [ ] **Step 3: Swap the overlay for dark zone tones**

```css
body.is-dark-zone::before {
  background-image:
    linear-gradient(to right, var(--grid-square-dark-line) var(--border-width), transparent var(--border-width)),
    linear-gradient(to bottom, var(--grid-square-dark-line-soft) var(--border-width), transparent var(--border-width));
  opacity: var(--grid-square-dark-opacity);
}
```

- [ ] **Step 4: Verify the hero still hides the texture and the rest of the page shows it**

Run: `npm run build:css`
Expected: CSS builds cleanly and the hero remains visually clean while the rest of the site keeps the new square grid.
