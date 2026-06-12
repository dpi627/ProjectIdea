# Ophan 開發計畫

## 開發策略

採用並行重構。保留目前根目錄靜態網站作為 legacy reference，新版 Ophan 實作於 `apps/web`，核心邏輯放在 `packages/core`，資料存取放在 `packages/storage`。

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
- 檢查 legacy root app 未被破壞。
- 驗證：`npm run check`、`npm run build`、`node --check app.js`。
- Commit：`refactor: 簡化 Ophan 實作並完成收斂`
