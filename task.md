# Ophan 開發階段任務

## Task 1：建立規格與開發文件

狀態：完成

- 建立 `spec.md`。
- 建立 `plan.md`。
- 建立 `task.md`。
- 文件需明確列出保留功能、移除功能、UI 規範、資料相容要求與驗收條件。
- 驗證：
  - `npm run check`
  - `npm run build`
- 完成後 commit：
  - `docs: 新增 Ophan 重構規格與開發計畫`

## Task 2：核心模型與相容匯入確認

狀態：完成

- 檢查 `packages/core` 的 `WorkspaceData`、`Project`、`Idea`。
- 確認 legacy JSON array 可轉換。
- 確認 legacy LocalStorage compressed payload 可轉換。
- 補上核心 smoke test。
- 驗證：
  - `npm run check`
  - `npm run build`
  - 核心 smoke test
- 完成後 commit：
  - `feat: 建立相容舊資料的核心專案模型`

## Task 3：UI 視覺與 lucide icon 對齊

狀態：完成

- 安裝 `@lucide/svelte`。
- 所有 UI icon 改用 lucide component。
- 移除自製 SVG 與符號式圖示。
- 移除 emoji。
- `apps/web/src/app.css` 改為沿用 legacy `styles.css` 的色票、字體、panel、topbar、workspace layout。
- 驗證：
  - `npm run check`
  - `npm run build`
  - UI smoke test
- 完成後 commit：
  - `feat: 對齊舊版視覺並導入 lucide 圖示`

## Task 4：專案與 idea 管理流程完成

狀態：完成

- project create/edit/delete。
- project pin/unpin 與排序。
- idea create/edit/delete。
- idea done/todo/all。
- idea pin/unpin 與排序。
- progress 與 completion log。
- JSON export/import。
- legacy import CTA。
- 驗證：
  - `npm run check`
  - `npm run build`
  - Playwright smoke test
- 完成後 commit：
  - `feat: 完成 Ophan 專案與 idea 管理流程`

## Task 5：快速審核與簡化

狀態：完成

- 移除未使用程式碼。
- 簡化過度抽象。
- 確認 core 不依賴 UI 或 browser API。
- 確認 storage 是 browser API 邊界。
- 確認 legacy app 可通過 syntax check。
- 驗證：
  - `npm run check`
  - `npm run build`
  - `node --check lagcy/app.js`
- 完成後 commit：
  - `refactor: 簡化 Ophan 實作並完成收斂`

## Task 6：UI 全面重新設計

狀態：完成

- 100dvh app-shell 三欄版面（左：專案、中：ideas、右：完成紀錄），左右欄可收合並持久化狀態。
- 視覺系統：移除大陰影、漸層 token（`--grad-accent`/`--grad-border`）、hover-revealed icon actions、category filter chips。
- GSAP 進場動畫、Svelte FLIP 排序動畫、shimmer skeleton、`prefers-reduced-motion` 支援。
- 拖曳排序（HTML5 DnD），core 新增 `moveProjectTo`/`moveIdeaTo`（additive only，含 smoke test）。
- ECharts 完成趨勢圖（延遲載入，獨立 Vite chunk ~509KB，主題即時同步）。
- 驗證：
  - `npm run check`（0 errors）
  - `npm run build`（通過）
  - `node --check lagcy/app.js`（通過）
  - Playwright 煙霧測試驗證所有功能
- 完成後 commits（6 個）：
  - `refactor: 抽離 state 模組並拆分 UI 元件`
  - `feat: 改為 100dvh app-shell 版面與可收合三欄`
  - `feat: 重新設計視覺系統並提升操作效率`
  - `feat: 加入漸進式載入與進場動畫`
  - `feat: 加回專案與 idea 的拖曳排序`
  - `feat: 右欄加入 ECharts 完成趨勢圖（延遲載入）`
