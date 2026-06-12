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

狀態：待辦

- 安裝 `lucide-svelte`。
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

狀態：待辦

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

狀態：待辦

- 移除未使用程式碼。
- 簡化過度抽象。
- 確認 core 不依賴 UI 或 browser API。
- 確認 storage 是 browser API 邊界。
- 確認 legacy root app 可通過 syntax check。
- 驗證：
  - `npm run check`
  - `npm run build`
  - `node --check app.js`
- 完成後 commit：
  - `refactor: 簡化 Ophan 實作並完成收斂`
