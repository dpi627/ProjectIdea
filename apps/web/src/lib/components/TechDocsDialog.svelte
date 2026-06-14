<script lang="ts">
  import { tick } from "svelte";
  import {
    AlertTriangle,
    BookOpen,
    Check,
    Circle,
    Code2,
    FileText,
    LayoutGrid,
    Palette,
    PanelLeft,
    Pin,
    Plus,
    Save,
    SlidersHorizontal,
    Trash2,
    Type,
    X,
    Zap,
  } from "@lucide/svelte";
  import {
    closeTechDocs,
    dialogs,
    setTechDocsChapter,
    type TechDocsChapterId,
  } from "../state/dialogs.svelte";
  import { i18n, t } from "../state/i18n.svelte";

  type DesignSystemAnchorId =
    | "overview"
    | "color"
    | "typography"
    | "layout"
    | "controls"
    | "components"
    | "forms"
    | "feedback"
    | "motion";

  type ChapterCopy = {
    id: TechDocsChapterId;
    label: string;
    summary: string;
  };

  type CodeExamples = {
    html: string;
    css: string;
    js: string;
  };

  type RuleCopy = {
    title: string;
    body: string;
  };

  type TokenCopy = {
    token: string;
    role: string;
    use: string;
  };

  type SectionCopy = {
    id: DesignSystemAnchorId;
    label: string;
    title: string;
    body: string;
    examples: CodeExamples;
  };

  type Copy = {
    title: string;
    subtitle: string;
    docsIntro: string;
    chapters: Record<TechDocsChapterId, ChapterCopy>;
    labels: {
      chapter: string;
      sectionNav: string;
      sample: string;
      required: string;
      avoid: string;
      html: string;
      css: string;
      js: string;
      light: string;
      dark: string;
    };
    sections: Record<DesignSystemAnchorId, SectionCopy>;
    overview: {
      badge: string;
      facts: RuleCopy[];
      principles: RuleCopy[];
    };
    color: {
      tokens: TokenCopy[];
      pairTitle: string;
      pairBody: string;
    };
    typography: {
      display: string;
      paragraph: string;
      meta: string;
      rules: RuleCopy[];
    };
    layout: {
      rhythm: RuleCopy[];
    };
    controls: {
      primary: string;
      secondary: string;
      danger: string;
      tool: string;
      active: string;
      inactive: string;
    };
    components: {
      chips: string;
      project: string;
      projectBody: string;
      idea: string;
      ideaStamp: string;
    };
    forms: {
      name: string;
      description: string;
      save: string;
      cancel: string;
      delete: string;
      helper: string;
    };
    feedback: {
      emptyTitle: string;
      emptyBody: string;
      loading: string;
      toast: string;
      warning: string;
    };
    motion: {
      rules: RuleCopy[];
    };
  };

  let el: HTMLDialogElement | undefined = $state();
  let activeAnchor = $state<DesignSystemAnchorId>("overview");

  const chapterOrder: TechDocsChapterId[] = ["design-system"];

  const anchorOrder: DesignSystemAnchorId[] = [
    "overview",
    "color",
    "typography",
    "layout",
    "controls",
    "components",
    "forms",
    "feedback",
    "motion",
  ];

  const zhExamples: Record<DesignSystemAnchorId, CodeExamples> = {
    overview: {
      html: `<section class="tech-docs-section">
  <h4>設計目標</h4>
  <p>先確認 token，再建立元件狀態。</p>
</section>`,
      css: `.tech-docs-section {
  display: grid;
  gap: 16px;
  background: var(--docs-panel);
}`,
      js: `const sectionOrder = ["overview", "color", "controls"];
const current = sectionOrder[0];`,
    },
    color: {
      html: `<button class="primary" type="button">
  <span>主要動作</span>
</button>`,
      css: `.primary {
  background: var(--primary-bg);
  color: var(--primary-fg);
}`,
      js: `document.documentElement.dataset.theme = ui.theme;`,
    },
    typography: {
      html: `<h3>Local-first planning stays readable</h3>
<p class="body-copy">短句、清楚、可掃描。</p>`,
      css: `h3 {
  font-weight: 650;
  line-height: 1.1;
  text-wrap: balance;
}`,
      js: `const meta = ["14 天", "完成 4/6", "CI"].join(" - ");`,
    },
    layout: {
      html: `<div class="rhythm-ladder">
  <article><strong>12px</strong><p>控制群組</p></article>
</div>`,
      css: `.rhythm-ladder {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}`,
      js: `const steps = [8, 10, 12, 14, 16];`,
    },
    controls: {
      html: `<div class="segmented" role="group">
  <button class="active">啟用</button>
  <button>未啟用</button>
</div>`,
      css: `.segmented button.active {
  background: var(--active-bg);
  color: var(--active-fg);
}`,
      js: `const setActive = (next) => {
  ui.categoryFilters = [next];
};`,
    },
    components: {
      html: `<article class="project-card active">
  <h3>專案卡片</h3>
  <p class="project-desc">短描述與進度</p>
</article>`,
      css: `.project-card.active {
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    var(--grad-border) border-box;
}`,
      js: `const progress = Math.round((done / total) * 100);`,
    },
    forms: {
      html: `<label>
  名稱
  <input required />
</label>`,
      css: `input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
}`,
      js: `if (!draft.name.trim()) return;`,
    },
    feedback: {
      html: `<div class="empty-state compact">
  <p>尚無資料</p>
  <span>建立第一個專案後會出現在這裡</span>
</div>`,
      css: `.skeleton::after {
  transform: translateX(-100%);
  animation: shimmer 1.4s infinite;
}`,
      js: `showToast(t("toast.projectUpdated"));`,
    },
    motion: {
      html: `<button class="tool-button" type="button">
  <span class="sr-only">工具</span>
</button>`,
      css: `@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}`,
      js: `const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;`,
    },
  };

  const enExamples: Record<DesignSystemAnchorId, CodeExamples> = {
    overview: {
      html: `<section class="tech-docs-section">
  <h4>Design goals</h4>
  <p>Align tokens before designing states.</p>
</section>`,
      css: `.tech-docs-section {
  display: grid;
  gap: 16px;
  background: var(--docs-panel);
}`,
      js: `const sectionOrder = ["overview", "color", "controls"];
const current = sectionOrder[0];`,
    },
    color: {
      html: `<button class="primary" type="button">
  <span>Primary action</span>
</button>`,
      css: `.primary {
  background: var(--primary-bg);
  color: var(--primary-fg);
}`,
      js: `document.documentElement.dataset.theme = ui.theme;`,
    },
    typography: {
      html: `<h3>Local-first planning stays readable</h3>
<p class="body-copy">Short, clear, scannable copy.</p>`,
      css: `h3 {
  font-weight: 650;
  line-height: 1.1;
  text-wrap: balance;
}`,
      js: `const meta = ["14 days", "4/6 done", "CI"].join(" - ");`,
    },
    layout: {
      html: `<div class="rhythm-ladder">
  <article><strong>12px</strong><p>Control groups</p></article>
</div>`,
      css: `.rhythm-ladder {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}`,
      js: `const steps = [8, 10, 12, 14, 16];`,
    },
    controls: {
      html: `<div class="segmented" role="group">
  <button class="active">Active</button>
  <button>Inactive</button>
</div>`,
      css: `.segmented button.active {
  background: var(--active-bg);
  color: var(--active-fg);
}`,
      js: `const setActive = (next) => {
  ui.categoryFilters = [next];
};`,
    },
    components: {
      html: `<article class="project-card active">
  <h3>Project card</h3>
  <p class="project-desc">Short description and progress</p>
</article>`,
      css: `.project-card.active {
  background:
    linear-gradient(var(--surface), var(--surface)) padding-box,
    var(--grad-border) border-box;
}`,
      js: `const progress = Math.round((done / total) * 100);`,
    },
    forms: {
      html: `<label>
  Name
  <input required />
</label>`,
      css: `input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent);
}`,
      js: `if (!draft.name.trim()) return;`,
    },
    feedback: {
      html: `<div class="empty-state compact">
  <p>No data yet</p>
  <span>Create the first project and it will appear here</span>
</div>`,
      css: `.skeleton::after {
  transform: translateX(-100%);
  animation: shimmer 1.4s infinite;
}`,
      js: `showToast(t("toast.projectUpdated"));`,
    },
    motion: {
      html: `<button class="tool-button" type="button">
  <span class="sr-only">Tool</span>
</button>`,
      css: `@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}`,
      js: `const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;`,
    },
  };

  const zhCopy: Copy = {
    title: "技術文件",
    subtitle: "文件中心",
    docsIntro: "Design System 是技術文件的一個章節。之後可以在同一個視窗加入資料模型、同步、匯入匯出等章節。",
    chapters: {
      "design-system": {
        id: "design-system",
        label: "Design System",
        summary: "Token、元件狀態、版面與實作範例",
      },
    },
    labels: {
      chapter: "文件章節",
      sectionNav: "Design System 小節",
      sample: "樣本",
      required: "應該做",
      avoid: "避免",
      html: "HTML",
      css: "CSS",
      js: "JS",
      light: "淺色",
      dark: "深色",
    },
    sections: {
      overview: {
        id: "overview",
        label: "總覽",
        title: "設計目標",
        body: "Ophan 是需要長時間停留的工作工具。介面要能快速掃描，不搶輸入焦點，也不把品牌色當裝飾。",
        examples: zhExamples.overview,
      },
      color: {
        id: "color",
        label: "色彩",
        title: "色彩與主題",
        body: "色彩沿用目前 emerald、mint、amber 與 charcoal。新增樣式只能由既有 token 推導，不能新增任意強色。",
        examples: zhExamples.color,
      },
      typography: {
        id: "typography",
        label: "文字",
        title: "字型與文字階層",
        body: "維持目前中文友善 UI stack。標題用 weight、尺寸和行距建立差異，不使用負字距。",
        examples: zhExamples.typography,
      },
      layout: {
        id: "layout",
        label: "版面",
        title: "間距、圓角與版面",
        body: "文件頁可以比工作區更有呼吸，但元件樣本仍要貼近實際 app。桌面與手機都要明確定義 collapse 行為。",
        examples: zhExamples.layout,
      },
      controls: {
        id: "controls",
        label: "控制項",
        title: "按鈕與控制狀態",
        body: "控制項必須用語意選樣式。顏色只補強狀態，不能成為唯一辨識方式。",
        examples: zhExamples.controls,
      },
      components: {
        id: "components",
        label: "元件",
        title: "工作區元件樣本",
        body: "文件頁的樣本要接近實際 UI，讓新增元件時能直接比對 spacing、state 與文字密度。",
        examples: zhExamples.components,
      },
      forms: {
        id: "forms",
        label: "表單",
        title: "表單與對話框",
        body: "欄位 label 固定在上方。focus ring 使用 accent-soft，dialog action 維持取消在主動作左側。",
        examples: zhExamples.forms,
      },
      feedback: {
        id: "feedback",
        label: "回饋",
        title: "空狀態、載入與回饋",
        body: "回饋狀態要降低焦慮。loading 要符合最終版面形狀，toast 只回報已發生的狀態。",
        examples: zhExamples.feedback,
      },
      motion: {
        id: "motion",
        label: "動效",
        title: "動效與可及性",
        body: "動效服務於狀態理解。進場、hover 與 active feedback 必須短促，且尊重 reduced motion。",
        examples: zhExamples.motion,
      },
    },
    overview: {
      badge: "Local-first 工作區",
      facts: [
        { title: "Design variance", body: "5 - 有節奏的非對稱，不重排主工作流。" },
        { title: "Motion intensity", body: "4 - 使用短轉場與 hover feedback，不做 scroll hijack。" },
        { title: "Visual density", body: "6 - 適合工具介面，內容密集但保留行距。" },
      ],
      principles: [
        { title: "安靜", body: "用 surface、空間與文字權重建立層級，避免高彩度背景堆疊。" },
        { title: "精準", body: "每個狀態都要有語意。主要動作、危險動作與工具按鈕不能互換樣式。" },
        { title: "高密度", body: "列表資訊要短、穩定、可重複掃描。不要為了裝飾犧牲可讀性。" },
      ],
    },
    color: {
      tokens: [
        { token: "--bg", role: "頁面背景", use: "只用於 app shell 與全頁底色。" },
        { token: "--surface", role: "主要面板", use: "承載 dialog、panel 與清楚的內容層。" },
        { token: "--surface-2", role: "次層背景", use: "承載 card、input、nav rail 與範例容器。" },
        { token: "--ink", role: "主文字", use: "標題、主要資訊與高重要操作。" },
        { token: "--muted", role: "輔助文字", use: "描述、說明、時間與低重要 metadata。" },
        { token: "--accent", role: "品牌狀態", use: "active、focus、主要動作與少量重點。" },
        { token: "--accent-2", role: "次要提示", use: "category 與溫和提示，不用於主要 CTA。" },
        { token: "--danger", role: "破壞性動作", use: "刪除、失敗與不可復原警示。" },
      ],
      pairTitle: "成對 token",
      pairBody: "有背景色就必須使用對應前景色，例如 primary-bg 配 primary-fg，active-bg 配 active-fg。",
    },
    typography: {
      display: "Local-first planning stays readable",
      paragraph: "內文上限控制在可快速閱讀的長度。英文、中文與數字混排時，行距要保留呼吸空間。",
      meta: "14 天 - 完成 4/6 - CI",
      rules: [
        { title: "標題", body: "使用 650 weight，行高 1.1 到 1.2，避免單字落行。" },
        { title: "內文", body: "使用 muted token，寬度控制在 65ch 以內。" },
        { title: "數字", body: "進度、日期與計數使用 tabular 數字，方便列表掃描。" },
      ],
    },
    layout: {
      rhythm: [
        { title: "8px", body: "icon 與緊湊 metadata 間距。" },
        { title: "10px", body: "card 內部短距離排列。" },
        { title: "12px", body: "表單欄位與控制群組。" },
        { title: "14px", body: "panel padding 與區塊間距。" },
        { title: "16px", body: "section 內主要留白。" },
      ],
    },
    controls: {
      primary: "主要動作",
      secondary: "次要動作",
      danger: "刪除",
      tool: "工具",
      active: "啟用",
      inactive: "未啟用",
    },
    components: {
      chips: "篩選 chip",
      project: "專案卡片",
      projectBody: "以 active border、短描述與進度建立掃描層級。",
      idea: "想法項目",
      ideaStamp: "建立於今日",
    },
    forms: {
      name: "名稱",
      description: "描述",
      save: "儲存",
      cancel: "取消",
      delete: "刪除",
      helper: "只讀範例，用來檢查欄位高度、對比與 action 排列。",
    },
    feedback: {
      emptyTitle: "尚無資料",
      emptyBody: "建立第一個專案後，項目會出現在這裡。",
      loading: "載入骨架",
      toast: "已儲存變更",
      warning: "刪除前需要確認，並清楚寫出影響範圍。",
    },
    motion: {
      rules: [
        { title: "使用", body: "transform、opacity、短 duration 與一致 cubic-bezier。" },
        { title: "避免", body: "長循環、scroll hijack、用顏色當唯一狀態。" },
        { title: "保留", body: "鍵盤 focus、aria label、對話框 Escape 關閉行為。" },
      ],
    },
  };

  const enCopy: Copy = {
    title: "Technical documentation",
    subtitle: "Documentation center",
    docsIntro: "Design System is one chapter inside the technical documentation. Data model, sync, import, and export chapters can use this same window later.",
    chapters: {
      "design-system": {
        id: "design-system",
        label: "Design System",
        summary: "Tokens, component states, layout, and implementation examples",
      },
    },
    labels: {
      chapter: "Docs chapters",
      sectionNav: "Design System sections",
      sample: "Sample",
      required: "Do",
      avoid: "Avoid",
      html: "HTML",
      css: "CSS",
      js: "JS",
      light: "Light",
      dark: "Dark",
    },
    sections: {
      overview: {
        id: "overview",
        label: "Overview",
        title: "Design goals",
        body: "Ophan is a work tool for long sessions. The interface should scan quickly, preserve input focus, and avoid using brand color as decoration.",
        examples: enExamples.overview,
      },
      color: {
        id: "color",
        label: "Color",
        title: "Color and theme",
        body: "The palette keeps the current emerald, mint, amber, and charcoal system. New docs surfaces must derive from existing tokens.",
        examples: enExamples.color,
      },
      typography: {
        id: "typography",
        label: "Type",
        title: "Typography hierarchy",
        body: "Keep the current Chinese-friendly UI stack. Hierarchy comes from weight, size, and line-height, not negative letter spacing.",
        examples: enExamples.typography,
      },
      layout: {
        id: "layout",
        label: "Layout",
        title: "Spacing, radius, and layout",
        body: "The docs page can breathe more than the workspace, but specimens should still match real app density. Desktop and mobile need explicit collapse behavior.",
        examples: enExamples.layout,
      },
      controls: {
        id: "controls",
        label: "Controls",
        title: "Buttons and control states",
        body: "Controls must be styled by meaning. Color reinforces state but cannot be the only state signal.",
        examples: enExamples.controls,
      },
      components: {
        id: "components",
        label: "Components",
        title: "Workspace component specimens",
        body: "Documentation specimens should look close to the real UI so new components can be compared against spacing, state, and text density.",
        examples: enExamples.components,
      },
      forms: {
        id: "forms",
        label: "Forms",
        title: "Forms and dialogs",
        body: "Labels stay above fields. Focus rings use accent-soft, and dialog actions keep cancel to the left of the primary action.",
        examples: enExamples.forms,
      },
      feedback: {
        id: "feedback",
        label: "Feedback",
        title: "Empty, loading, and feedback",
        body: "Feedback states should lower uncertainty. Loading should match the final shape, and toast messages should report completed state.",
        examples: enExamples.feedback,
      },
      motion: {
        id: "motion",
        label: "Motion",
        title: "Motion and accessibility",
        body: "Motion should explain state. Entry, hover, and active feedback must stay short and respect reduced motion.",
        examples: enExamples.motion,
      },
    },
    overview: {
      badge: "Local-first workspace",
      facts: [
        { title: "Design variance", body: "5 - rhythmic asymmetry without changing the core workflow." },
        { title: "Motion intensity", body: "4 - short transitions and hover feedback, no scroll hijack." },
        { title: "Visual density", body: "6 - tool-grade density with enough line-height to read." },
      ],
      principles: [
        { title: "Calm", body: "Use surfaces, spacing, and type weight for hierarchy. Avoid stacked high-chroma backgrounds." },
        { title: "Precise", body: "Every state needs meaning. Primary, danger, and tool buttons cannot trade styles." },
        { title: "Dense", body: "List content should be short, stable, and easy to rescan. Decoration cannot reduce readability." },
      ],
    },
    color: {
      tokens: [
        { token: "--bg", role: "Page background", use: "Only for the app shell and full-page base." },
        { token: "--surface", role: "Primary panel", use: "Dialogs, panels, and clear content layers." },
        { token: "--surface-2", role: "Secondary panel", use: "Cards, inputs, nav rails, and specimens." },
        { token: "--ink", role: "Primary text", use: "Headings, core information, and important actions." },
        { token: "--muted", role: "Secondary text", use: "Descriptions, timestamps, hints, and low-emphasis metadata." },
        { token: "--accent", role: "Brand state", use: "Active, focus, primary action, and sparse emphasis." },
        { token: "--accent-2", role: "Secondary cue", use: "Category hints and warm support, not primary CTA." },
        { token: "--danger", role: "Destructive state", use: "Delete, failure, and irreversible warning states." },
      ],
      pairTitle: "Paired tokens",
      pairBody: "Every strong background needs its paired foreground, such as primary-bg with primary-fg and active-bg with active-fg.",
    },
    typography: {
      display: "Local-first planning stays readable",
      paragraph: "Body copy should stay short enough to scan. Mixed Chinese, English, and numbers need generous line-height.",
      meta: "14 days - 4/6 done - CI",
      rules: [
        { title: "Headings", body: "Use 650 weight, 1.1 to 1.2 line-height, and balanced wrapping." },
        { title: "Body", body: "Use muted text and keep paragraph width under 65ch." },
        { title: "Numbers", body: "Use tabular figures for progress, dates, and counts inside lists." },
      ],
    },
    layout: {
      rhythm: [
        { title: "8px", body: "Icon gaps and compact metadata." },
        { title: "10px", body: "Short spacing inside cards." },
        { title: "12px", body: "Fields and control groups." },
        { title: "14px", body: "Panel padding and section rhythm." },
        { title: "16px", body: "Primary spacing inside documentation sections." },
      ],
    },
    controls: {
      primary: "Primary action",
      secondary: "Secondary action",
      danger: "Delete",
      tool: "Tool",
      active: "Active",
      inactive: "Inactive",
    },
    components: {
      chips: "Filter chips",
      project: "Project card",
      projectBody: "Active border, short description, and progress build the scan hierarchy.",
      idea: "Idea item",
      ideaStamp: "Created today",
    },
    forms: {
      name: "Name",
      description: "Description",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      helper: "Read-only specimen for checking field height, contrast, and action order.",
    },
    feedback: {
      emptyTitle: "No data yet",
      emptyBody: "Create the first project and items will appear here.",
      loading: "Loading skeleton",
      toast: "Changes saved",
      warning: "Confirm destructive actions and describe the impact clearly.",
    },
    motion: {
      rules: [
        { title: "Use", body: "Transform, opacity, short duration, and consistent cubic-bezier timing." },
        { title: "Avoid", body: "Long loops, scroll hijacks, and color-only state communication." },
        { title: "Keep", body: "Keyboard focus, aria labels, and Escape-to-close dialog behavior." },
      ],
    },
  };

  const copy = $derived(i18n.locale === "zh-TW" ? zhCopy : enCopy);
  const chapters = $derived(chapterOrder.map((id) => copy.chapters[id]));
  const anchorItems = $derived(anchorOrder.map((id) => copy.sections[id]));
  const codeLines = (value: string) => value.trim().split("\n");
  const isReducedMotion = () =>
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  const openChapter = (chapterId: TechDocsChapterId) => {
    setTechDocsChapter(chapterId);
    activeAnchor = "overview";
  };

  const selectAnchor = async (anchorId: DesignSystemAnchorId) => {
    activeAnchor = anchorId;
    await tick();
    const target = el?.querySelector<HTMLElement>(`#tech-docs-${anchorId}`);
    target?.scrollIntoView({
      block: "start",
      behavior: isReducedMotion() ? "auto" : "smooth",
    });
  };

  const backdropClose = (event: MouseEvent) => {
    if (event.target === el) closeTechDocs();
  };

  $effect(() => {
    const state = dialogs.techDocs;
    if (state && el && !el.open) {
      activeAnchor = "overview";
      el.showModal();
    } else if (!state && el?.open) {
      el.close();
    }
  });
</script>

<dialog
  class="tech-docs-dialog"
  bind:this={el}
  onclick={backdropClose}
  onclose={() => {
    if (dialogs.techDocs) closeTechDocs();
  }}
>
  {#if dialogs.techDocs}
    <div class="dialog-head tech-docs-head">
      <div>
        <span class="tech-docs-kicker">{copy.subtitle}</span>
        <h2>{copy.title}</h2>
      </div>
      <button class="action-btn" type="button" aria-label={t("common.close")} onclick={closeTechDocs}>
        <X size={15} />
      </button>
    </div>

    <div class="tech-docs-layout">
      <aside class="tech-docs-chapter-rail" aria-label={copy.labels.chapter}>
        <p>{copy.docsIntro}</p>
        <nav>
          {#each chapters as chapter (chapter.id)}
            <button
              type="button"
              class:active={dialogs.techDocs.chapterId === chapter.id}
              onclick={() => openChapter(chapter.id)}
            >
              <span>{chapter.label}</span>
              <small>{chapter.summary}</small>
            </button>
          {/each}
        </nav>
      </aside>

      <article class="tech-docs-content">
        <section class="tech-docs-hero" id="tech-docs-overview" aria-labelledby="tech-docs-title">
          <div>
            <span class="tech-docs-badge">
              <BookOpen size={14} />
              {copy.overview.badge}
            </span>
            <h3 id="tech-docs-title">{copy.chapters["design-system"].label}</h3>
            <p>{copy.chapters["design-system"].summary}</p>
          </div>

          <div class="docs-snapshot" aria-label={copy.sections.overview.title}>
            {#each copy.overview.facts as fact (fact.title)}
              <div>
                <strong>{fact.title}</strong>
                <span>{fact.body}</span>
              </div>
            {/each}
          </div>
        </section>

        <nav class="design-system-anchor-nav" aria-label={copy.labels.sectionNav}>
          {#each anchorItems as item (item.id)}
            <button
              type="button"
              class:active={activeAnchor === item.id}
              onclick={() => selectAnchor(item.id)}
            >
              {item.label}
            </button>
          {/each}
        </nav>

        <section class="tech-docs-section docs-overview-panel">
          <div class="section-copy">
            <FileText size={18} />
            <div>
              <h4>{copy.sections.overview.title}</h4>
              <p>{copy.sections.overview.body}</p>
            </div>
          </div>
          <div class="principle-grid">
            {#each copy.overview.principles as principle (principle.title)}
              <article class="principle-card">
                <strong>{principle.title}</strong>
                <span>{principle.body}</span>
              </article>
            {/each}
          </div>
          {@render CodeExamples({
            examples: copy.sections.overview.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-color">
          <div class="section-copy">
            <Palette size={18} />
            <div>
              <h4>{copy.sections.color.title}</h4>
              <p>{copy.sections.color.body}</p>
            </div>
          </div>

          <div class="token-board">
            {#each copy.color.tokens as token (token.token)}
              <article class="token-row">
                <span class="color-swatch" style={`background: var(${token.token})`}></span>
                <div>
                  <code>{token.token}</code>
                  <strong>{token.role}</strong>
                  <span>{token.use}</span>
                </div>
              </article>
            {/each}
          </div>

          <div class="theme-pair-grid">
            <article class="theme-demo-card docs-theme-light">
              <span>{copy.labels.light}</span>
              <button class="primary" type="button">
                <Plus size={16} />
                {copy.controls.primary}
              </button>
              <div class="segmented" role="group" aria-label="Light active sample">
                <button class="active" type="button">{copy.controls.active}</button>
                <button type="button">{copy.controls.inactive}</button>
              </div>
            </article>
            <article class="theme-demo-card docs-theme-dark">
              <span>{copy.labels.dark}</span>
              <button class="primary" type="button">
                <Plus size={16} />
                {copy.controls.primary}
              </button>
              <div class="segmented" role="group" aria-label="Dark active sample">
                <button class="active" type="button">{copy.controls.active}</button>
                <button type="button">{copy.controls.inactive}</button>
              </div>
            </article>
            <article class="theme-pair-note">
              <strong>{copy.color.pairTitle}</strong>
              <p>{copy.color.pairBody}</p>
            </article>
          </div>
          {@render CodeExamples({
            examples: copy.sections.color.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-typography">
          <div class="section-copy">
            <Type size={18} />
            <div>
              <h4>{copy.sections.typography.title}</h4>
              <p>{copy.sections.typography.body}</p>
            </div>
          </div>
          <div class="type-panel">
            <div class="type-specimen">
              <span>{copy.labels.sample}</span>
              <h3>{copy.typography.display}</h3>
              <p>{copy.typography.paragraph}</p>
              <code>{copy.typography.meta}</code>
            </div>
            <div class="type-rules">
              {#each copy.typography.rules as rule (rule.title)}
                <article>
                  <strong>{rule.title}</strong>
                  <span>{rule.body}</span>
                </article>
              {/each}
            </div>
          </div>
          {@render CodeExamples({
            examples: copy.sections.typography.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-layout">
          <div class="section-copy">
            <LayoutGrid size={18} />
            <div>
              <h4>{copy.sections.layout.title}</h4>
              <p>{copy.sections.layout.body}</p>
            </div>
          </div>
          <div class="rhythm-ladder">
            {#each copy.layout.rhythm as item, index (item.title)}
              <article style={`--step:${index + 1}`}>
                <span></span>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </article>
            {/each}
          </div>
          {@render CodeExamples({
            examples: copy.sections.layout.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-controls">
          <div class="section-copy">
            <SlidersHorizontal size={18} />
            <div>
              <h4>{copy.sections.controls.title}</h4>
              <p>{copy.sections.controls.body}</p>
            </div>
          </div>
          <div class="control-board">
            <div class="control-group">
              <button class="primary" type="button">
                <Save size={16} />
                {copy.controls.primary}
              </button>
              <button class="ghost" type="button">{copy.controls.secondary}</button>
              <button class="danger" type="button">
                <Trash2 size={15} />
                {copy.controls.danger}
              </button>
            </div>
            <div class="control-group compact">
              <button class="tool-button" type="button" title={copy.controls.tool}>
                <PanelLeft size={16} />
                <span class="sr-only">{copy.controls.tool}</span>
              </button>
              <button class="action-btn is-on" type="button" title={copy.controls.active}>
                <Pin size={14} />
                <span class="sr-only">{copy.controls.active}</span>
              </button>
              <div class="segmented" role="group" aria-label={copy.sections.controls.title}>
                <button class="active" type="button">{copy.controls.active}</button>
                <button type="button">{copy.controls.inactive}</button>
              </div>
            </div>
          </div>
          {@render CodeExamples({
            examples: copy.sections.controls.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-components">
          <div class="section-copy">
            <LayoutGrid size={18} />
            <div>
              <h4>{copy.sections.components.title}</h4>
              <p>{copy.sections.components.body}</p>
            </div>
          </div>
          <div class="component-specimen-grid">
            <article class="component-strip">
              <strong>{copy.components.chips}</strong>
              <div class="chip-row">
                <button class="chip active" type="button">CI</button>
                <button class="chip" type="button">MP</button>
                <button class="chip" type="button">SP</button>
              </div>
            </article>
            <article class="project-card active specimen-card">
              <div class="card-title-row">
                <span class="pin-indicator"><Pin size={13} /></span>
                <h3>{copy.components.project}</h3>
                <span class="category-badge">CI</span>
              </div>
              <p class="project-desc">{copy.components.projectBody}</p>
              <div class="project-meta">
                <div class="progress-track">
                  <div class="progress-fill" style="width: 64%"></div>
                </div>
                <span class="mono">4/6</span>
              </div>
            </article>
            <article class="idea-card specimen-idea">
              <button class="check-button" type="button" aria-label={copy.components.idea}>
                <Circle size={16} />
              </button>
              <div class="idea-body">
                <p class="idea-text">{copy.components.idea}</p>
                <span class="idea-stamp">{copy.components.ideaStamp}</span>
              </div>
            </article>
          </div>
          {@render CodeExamples({
            examples: copy.sections.components.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-forms">
          <div class="section-copy">
            <FileText size={18} />
            <div>
              <h4>{copy.sections.forms.title}</h4>
              <p>{copy.sections.forms.body}</p>
            </div>
          </div>
          <div class="form-specimen">
            <label>
              {copy.forms.name}
              <input value="Project Aurora" aria-label={copy.forms.name} readonly />
            </label>
            <label>
              {copy.forms.description}
              <textarea rows="3" aria-label={copy.forms.description} readonly>Local-first planning workflow</textarea>
            </label>
            <p>{copy.forms.helper}</p>
            <div class="dialog-actions">
              <button class="danger" type="button">{copy.forms.delete}</button>
              <span class="spacer"></span>
              <button class="ghost" type="button">{copy.forms.cancel}</button>
              <button class="primary" type="button">{copy.forms.save}</button>
            </div>
          </div>
          {@render CodeExamples({
            examples: copy.sections.forms.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-feedback">
          <div class="section-copy">
            <Check size={18} />
            <div>
              <h4>{copy.sections.feedback.title}</h4>
              <p>{copy.sections.feedback.body}</p>
            </div>
          </div>
          <div class="feedback-board">
            <div class="empty-state compact">
              <p>{copy.feedback.emptyTitle}</p>
              <span>{copy.feedback.emptyBody}</span>
            </div>
            <div class="skeleton-stack" aria-label={copy.feedback.loading}>
              <div class="skeleton line"></div>
              <div class="skeleton line"></div>
              <div class="skeleton"></div>
            </div>
            <div class="feedback-side">
              <div class="doc-toast">
                <Check size={15} />
                {copy.feedback.toast}
              </div>
              <p>
                <AlertTriangle size={15} />
                {copy.feedback.warning}
              </p>
            </div>
          </div>
          {@render CodeExamples({
            examples: copy.sections.feedback.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>

        <section class="tech-docs-section" id="tech-docs-motion">
          <div class="section-copy">
            <Zap size={18} />
            <div>
              <h4>{copy.sections.motion.title}</h4>
              <p>{copy.sections.motion.body}</p>
            </div>
          </div>
          <div class="motion-rules">
            {#each copy.motion.rules as rule, index (rule.title)}
              <article class:indexed={index === 0}>
                <span>{index === 1 ? copy.labels.avoid : copy.labels.required}</span>
                <strong>{rule.title}</strong>
                <p>{rule.body}</p>
              </article>
            {/each}
          </div>
          {@render CodeExamples({
            examples: copy.sections.motion.examples,
            labels: copy.labels,
            codeLines,
          })}
        </section>
      </article>
    </div>
  {/if}
</dialog>

{#snippet CodeExamples({
  examples,
  labels,
  codeLines,
}: {
  examples: CodeExamples;
  labels: Copy["labels"];
  codeLines: (value: string) => string[];
})}
  <div class="section-code-grid">
    {#each [
      { label: labels.html, value: examples.html },
      { label: labels.css, value: examples.css },
      { label: labels.js, value: examples.js },
    ] as sample (sample.label)}
      <figure class="code-card">
        <figcaption>
          <span>
            <Code2 size={13} />
            {sample.label}
          </span>
        </figcaption>
        <pre class="code-block" aria-label={sample.label}>{#each codeLines(sample.value) as line, index (`${sample.label}-${index}`)}<span class="code-line"><span class="code-line-no">{index + 1}</span><code>{line || " "}</code></span>{/each}</pre>
      </figure>
    {/each}
  </div>
{/snippet}
