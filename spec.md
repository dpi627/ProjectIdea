# Ophan 專案規格書

## 目標

Ophan 是 Project Idea Studio 的核心功能重構版，保留目前靜態網站的主要使用體驗、配色與版面語言，移除與專案管理無直接關係的展示型功能，建立容易理解、擴充與維護的最小架構。

第一版聚焦本機資料與資料轉移，不實作 Google Sheets 同步與桌面殼。架構需保留日後加入 Google Sheets repository 與 Tauri desktop 的空間。

## 使用者需求

- 使用者可以管理專案。
- 使用者可以在專案內管理 ideas。
- 使用者可以切換 idea 的 todo、done、all 視圖。
- 使用者可以看到專案完成進度與完成紀錄。
- 使用者可以匯出、匯入資料。
- 使用者可以從目前 Project Idea Studio 的資料格式匯入並轉移到 Ophan。
- 使用者可以切換 light、dark theme。
- 使用者看到的 UI 應保留目前網站的設計語言與配色，而不是重新設計成另一套品牌視覺。

## 保留功能

- 專案新增、編輯、刪除。
- 專案 description、category、start date、due date。
- 專案 pin、排序。
- idea 新增、編輯、刪除。
- idea done/todo 切換、完成時間記錄。
- idea pin、排序。
- 專案進度統計。
- 完成紀錄 log。
- JSON 匯出與匯入。
- 舊資料格式轉換匯入。
- light/dark theme。

## 移除功能

新版 Ophan 不移植下列功能：

- 技術文件 dialog。
- service monitor。
- model usage monitor。
- auto update dialog。
- splash video。
- Remotion intro video workflow。
- CLI 或與 CLI 相關的說明文案。

## UI 與圖示規範

- 新版 UI 必須沿用目前 `styles.css` 的主要視覺系統。
- light theme 色票：
  - `--bg: #f6f6f1`
  - `--bg-soft: #f9efe4`
  - `--surface: #ffffff`
  - `--surface-2: #f1f4f0`
  - `--ink: #0d1b2a`
  - `--muted: #5b6473`
  - `--accent: #1f8a70`
  - `--accent-2: #e9b44c`
- dark theme 色票：
  - `--bg: #0b1116`
  - `--bg-soft: #141f28`
  - `--surface: rgba(22, 32, 40, 0.95)`
  - `--surface-2: rgba(20, 30, 38, 0.95)`
  - `--ink: #f4f6f9`
  - `--muted: #b1bcc7`
  - `--accent: #33c1a0`
  - `--accent-2: #f0c56d`
- 字體沿用 `Epilogue`、`Fraunces`、`JetBrains Mono`。
- 版面保留 topbar、三欄工作區、panel、tab、progress、log panel 的語言。
- 所有圖示必須使用 lucide icon component。
- UI 不使用 emoji。
- Ophan logo 使用 lucide icon 組合或 lucide 單一圖示，不使用自製 SVG。

## 架構規範

- `packages/core` 僅包含純 TypeScript domain 與 use-case helper，不依賴 DOM、IndexedDB、LocalStorage、Svelte、Google、Tauri。
- `packages/storage` 包含資料存取 adapter，例如 IndexedDB 與 legacy LocalStorage 匯入。
- `apps/web` 包含 Svelte UI 與瀏覽器互動。
- 資料存取需透過 `ProjectRepository` 介面。
- 核心資料操作應保持 pure function，讓 UI 只負責事件、狀態與 rendering。
- 優先 KISS，不過度抽象。
- 避免重複資料轉換邏輯，匯入、正規化、匯出集中在 core/storage。

## 資料格式

Ophan 使用 `WorkspaceData`：

```ts
type WorkspaceData = {
  schemaVersion: 1;
  projects: Project[];
  ideas: Idea[];
  meta: {
    appName: "ophan";
    updatedAt: string;
    deviceId: string;
  };
};
```

`Project` 與 `Idea` 必須有：

- `id`
- `createdAt`
- `updatedAt`
- `deletedAt`
- `pinned`
- `order`

相容要求：

- 可匯入目前 Project Idea Studio 匯出的 array-based legacy JSON。
- 可讀取目前 LocalStorage key `project-idea-collection.v1`。
- 支援 legacy `lz:` compressed payload。
- legacy project 內嵌 ideas 必須轉換為 Ophan 的扁平 `ideas` 陣列並保留 `projectId` 關聯。

## 驗收條件

- `npm run check` 通過。
- `npm run build` 通過。
- 可建立、編輯、刪除 project。
- 可建立、編輯、刪除 idea。
- 可切換 done/todo 並更新進度與 log。
- 可 pin/unpin project 與 idea。
- 可排序 project 與 idea。
- 可匯出 Ophan JSON。
- 可匯入 Ophan JSON。
- 可匯入 legacy JSON。
- 若瀏覽器有 legacy LocalStorage 資料，UI 會提供匯入轉移入口。
- UI 無 emoji。
- Ophan UI 圖示皆由 lucide component 提供。
