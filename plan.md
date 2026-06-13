# Ophan 開發計畫

## 開發策略

採用並行重構。保留 legacy 靜態網站於 `lagcy/` 作為 reference，新版 Ophan 實作於 `apps/web`，核心邏輯放在 `packages/core`，資料存取放在 `packages/storage`。

每個階段需完成後執行可用的編譯或測試驗證，修正錯誤後再 commit。commit message 使用 Conventional Commit 格式並以繁體中文撰寫。

## 階段一：文件與方向鎖定

- 建立 `spec.md`。
- 建立 `plan.md`。
- 建立 `task.md`。
- 確認新版方向是保留舊 UI 配色與版面語言，不採用新品牌色。
- 確認所有 UI icon 需改為 lucide component。
- 驗證：`npm run check`、`npm run build`。
- Commit：`docs: 新增 Ophan 重構規格與開發計畫`

## 階段二：核心架構與資料相容

- 檢查並調整 `packages/core` 資料模型。
- 保留 legacy array JSON 匯入能力。
- 保留 legacy compressed LocalStorage 轉換能力。
- 保留 project、idea 的 CRUD、pin、order、done、log、stats helper。
- 補上最小測試或 smoke script 驗證 legacy import 與核心操作。
- 驗證：`npm run check`、`npm run build`、核心 smoke test。
- Commit：`feat: 建立相容舊資料的核心專案模型`

## 階段三：UI 視覺與 lucide icon 對齊

- 將 `apps/web` 色票、字體、panel、topbar、workspace layout 改為沿用 legacy 視覺。
- 安裝並使用官方 `@lucide/svelte`。
- 移除自製 SVG、符號字元、emoji。
- 將主要操作按鈕改為 lucide icon 搭配文字或 accessible label。
- 保持 UI 密度與舊版工具型介面相近。
- 驗證：`npm run check`、`npm run build`、UI smoke test。
- Commit：`feat: 對齊舊版視覺並導入 lucide 圖示`

## 階段四：專案與 idea 管理功能完成

- 確保 project create/edit/delete 可用。
- 確保 idea create/edit/delete 可用。
- 確保 done/todo/all、progress、log 可用。
- 確保 pin 與排序行為可用。
- 確保匯出、匯入、legacy import 可用。
- 驗證：`npm run check`、`npm run build`、Playwright smoke test。
- Commit：`feat: 完成 Ophan 專案與 idea 管理流程`

## 階段五：快速審核與簡化

- 檢查是否有不必要的抽象、重複邏輯、未使用狀態或不符合 KISS 的實作。
- 檢查 UI 是否仍有 emoji、自製圖示或偏離舊版色票。
- 檢查 legacy app 未被破壞。
- 驗證：`npm run check`、`npm run build`、`node --check lagcy/app.js`。
- Commit：`refactor: 簡化 Ophan 實作並完成收斂`

## 階段六：UI 全面現代化重新設計（完成）

6 個子階段，每個獨立 commit：

1. **refactor: state 抽離 + 元件拆分** — `App.svelte`（622 行）拆為 12 個元件，建立 `.svelte.ts` state modules（`app`/`ui`/`dialogs`），全面改為 Svelte 5 runes mode。
2. **feat: 100dvh app-shell 版面** — `grid-template-rows: auto 1fr; height: 100dvh`，三欄 CSS custom property 展合動畫（`--rail-w`/`--log-w` transition），`inert` 鍵盤隔離，`ophan.ui` 持久化，右欄預設收合。
3. **feat: 新視覺系統 + 操作效率** — 移除大陰影、漸層 token（`--grad-accent`/`--grad-border`）、hover-revealed icon actions、category chips（all/CI/MP/SP/NA）、native `<dialog>` 表單、completion log reopen。
4. **feat: 動畫** — GSAP 一次性進場 stagger、Svelte `animate:flip` 排序動畫、`transition:slide/fade` 增刪動畫、shimmer skeleton、`prefers-reduced-motion` 全域總閘。
5. **feat: 拖曳排序** — core additive：`moveProjectTo`/`moveIdeaTo`（`reorderTo` helper）+ smoke test；UI：HTML5 DnD，只在 drop 時 reorder 避免與 FLIP 衝突。
6. **feat: ECharts 趨勢圖** — `echarts-lite.ts` 隔離 value import；`TrendChart.svelte` 動態 `import()` → Vite code-split（~509KB 獨立 chunk）；14 天 bucket 聚合；`$effect` 讀 CSS 變數實現主題同步。

驗證：`npm run check && npm run build` 通過，`node --check lagcy/app.js` 通過，Playwright 煙霧測試驗證所有功能。
