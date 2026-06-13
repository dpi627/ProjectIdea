const LOCALE_KEY = "ophan.locale";

export type Locale = "en" | "zh-TW";

const en = {
  "app.title": "Ophan",
  "brand.subtitle": "open and use, no auth, stored in the local",
  "topbar.showProjects": "Show projects panel",
  "topbar.hideProjects": "Hide projects panel",
  "topbar.projectsPanel": "Projects panel",
  "topbar.showCompleted": "Show completed panel",
  "topbar.hideCompleted": "Hide completed panel",
  "topbar.completedPanel": "Completed panel",
  "topbar.exportJson": "Export JSON",
  "topbar.importJson": "Import JSON",
  "topbar.importLegacy": "Import legacy static data",
  "topbar.clearData": "Clear local data",
  "topbar.switchLight": "Switch to light theme",
  "topbar.switchDark": "Switch to dark theme",
  "topbar.toggleTheme": "Toggle theme",
  "topbar.language": "Language",
  "topbar.switchLanguage": "Switch language",
  "topbar.clearTitle": "Clear local data?",
  "topbar.clearMessage":
    "All projects and ideas stored in this browser will be removed. Export a backup first if you need one.",
  "topbar.clearConfirm": "Clear data",
  "projects.label": "Projects",
  "projects.new": "New project",
  "projects.filterLabel": "Filter by category",
  "projects.none": "No projects yet.",
  "projects.noneInCategory": "Nothing in this category.",
  "projects.createHint": "Create one to begin tracking ideas.",
  "projects.filterHint": "Switch category filters to see more.",
  "projects.pinned": "Pinned",
  "common.pin": "Pin",
  "common.unpin": "Unpin",
  "common.edit": "Edit",
  "common.moveUp": "Move up",
  "common.moveDown": "Move down",
  "common.delete": "Delete",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.close": "Close",
  "idea.editProject": "Edit project",
  "idea.deleteProject": "Delete project",
  "idea.deleteProjectTitle": "Delete project?",
  "idea.deleteProjectMessage":
    '"{projectName}" and all of its ideas will be removed.',
  "idea.start": "Start",
  "idea.due": "Due",
  "idea.doneCount": "{done}/{total} done",
  "idea.placeholder": "Capture an idea...",
  "idea.add": "Add",
  "idea.filterLabel": "Idea filter",
  "idea.filter.todo": "todo",
  "idea.filter.done": "done",
  "idea.filter.all": "all",
  "idea.empty": "No ideas in this view.",
  "idea.emptyFirst": "Add the first idea above.",
  "idea.emptySwitch": "Switch filters to see more.",
  "idea.markTodo": "Mark todo",
  "idea.markDone": "Mark done",
  "idea.finished": "Finished {date}",
  "idea.created": "Created {date}",
  "idea.actions": "Idea actions",
  "idea.edit": "Edit idea",
  "idea.delete": "Delete idea",
  "idea.startProject": "Start with one project.",
  "idea.localFirst":
    "Ophan keeps the workspace local first, ready for Google sync later.",
  "completed.label": "Completed",
  "completed.empty": "No completed ideas yet.",
  "completed.emptyHint": "Done items will appear here.",
  "completed.reopen": "Reopen idea",
  "chart.last14Days": "Last 14 days",
  "dialog.project.edit": "Edit project",
  "dialog.project.new": "New project",
  "dialog.project.name": "Name",
  "dialog.project.namePlaceholder": "Project name",
  "dialog.project.description": "Description",
  "dialog.project.descriptionPlaceholder": "Short note",
  "dialog.project.category": "Category",
  "dialog.project.none": "None",
  "dialog.project.start": "Start",
  "dialog.project.due": "Due",
  "dialog.project.save": "Save changes",
  "dialog.project.create": "Create project",
  "toast.importFailed": "Import failed. Check the JSON file.",
  "toast.projectCreated": "Project created.",
  "toast.projectUpdated": "Project updated.",
  "toast.projectRemoved": "Project removed.",
  "toast.ideaAdded": "Idea added.",
  "toast.ideaUpdated": "Idea updated.",
  "toast.ideaRemoved": "Idea removed.",
  "toast.ideaReopened": "Idea reopened.",
  "toast.exportReady": "Export ready.",
  "toast.workspaceImported": "Workspace imported.",
  "toast.legacyImported": "Legacy data imported.",
  "toast.legacyFailed": "Legacy import failed.",
  "toast.localCleared": "Local workspace cleared.",
  "format.noDate": "No date",
} as const;

export type MessageKey = keyof typeof en;

const zhTW: Record<MessageKey, string> = {
  "app.title": "Ophan",
  "brand.subtitle": "開啟即用，免登入，資料儲存在本機",
  "topbar.showProjects": "顯示專案面板",
  "topbar.hideProjects": "隱藏專案面板",
  "topbar.projectsPanel": "專案面板",
  "topbar.showCompleted": "顯示已完成面板",
  "topbar.hideCompleted": "隱藏已完成面板",
  "topbar.completedPanel": "已完成面板",
  "topbar.exportJson": "匯出 JSON",
  "topbar.importJson": "匯入 JSON",
  "topbar.importLegacy": "匯入舊版靜態資料",
  "topbar.clearData": "清除本機資料",
  "topbar.switchLight": "切換至淺色模式",
  "topbar.switchDark": "切換至深色模式",
  "topbar.toggleTheme": "切換主題",
  "topbar.language": "語言",
  "topbar.switchLanguage": "切換語言",
  "topbar.clearTitle": "清除本機資料？",
  "topbar.clearMessage": "此瀏覽器中的所有專案與想法都會被移除。需要保留時請先匯出備份。",
  "topbar.clearConfirm": "清除資料",
  "projects.label": "專案",
  "projects.new": "新增專案",
  "projects.filterLabel": "依類別篩選",
  "projects.none": "尚無專案。",
  "projects.noneInCategory": "此類別沒有項目。",
  "projects.createHint": "建立一個專案開始追蹤想法。",
  "projects.filterHint": "切換類別篩選以查看更多。",
  "projects.pinned": "已釘選",
  "common.pin": "釘選",
  "common.unpin": "取消釘選",
  "common.edit": "編輯",
  "common.moveUp": "上移",
  "common.moveDown": "下移",
  "common.delete": "刪除",
  "common.cancel": "取消",
  "common.save": "儲存",
  "common.close": "關閉",
  "idea.editProject": "編輯專案",
  "idea.deleteProject": "刪除專案",
  "idea.deleteProjectTitle": "刪除專案？",
  "idea.deleteProjectMessage": "「{projectName}」和其中所有想法都會被移除。",
  "idea.start": "開始",
  "idea.due": "到期",
  "idea.doneCount": "已完成 {done}/{total}",
  "idea.placeholder": "記下一個想法...",
  "idea.add": "新增",
  "idea.filterLabel": "想法篩選",
  "idea.filter.todo": "待辦",
  "idea.filter.done": "完成",
  "idea.filter.all": "全部",
  "idea.empty": "此檢視沒有想法。",
  "idea.emptyFirst": "先在上方新增第一個想法。",
  "idea.emptySwitch": "切換篩選以查看更多。",
  "idea.markTodo": "標記為待辦",
  "idea.markDone": "標記為完成",
  "idea.finished": "完成於 {date}",
  "idea.created": "建立於 {date}",
  "idea.actions": "想法操作",
  "idea.edit": "編輯想法",
  "idea.delete": "刪除想法",
  "idea.startProject": "從一個專案開始。",
  "idea.localFirst": "Ophan 以本機優先保存工作區，之後可接上 Google 同步。",
  "completed.label": "已完成",
  "completed.empty": "尚無已完成想法。",
  "completed.emptyHint": "完成的項目會出現在這裡。",
  "completed.reopen": "重新開啟想法",
  "chart.last14Days": "最近 14 天",
  "dialog.project.edit": "編輯專案",
  "dialog.project.new": "新增專案",
  "dialog.project.name": "名稱",
  "dialog.project.namePlaceholder": "專案名稱",
  "dialog.project.description": "描述",
  "dialog.project.descriptionPlaceholder": "簡短備註",
  "dialog.project.category": "類別",
  "dialog.project.none": "無",
  "dialog.project.start": "開始",
  "dialog.project.due": "到期",
  "dialog.project.save": "儲存變更",
  "dialog.project.create": "建立專案",
  "toast.importFailed": "匯入失敗，請檢查 JSON 檔案。",
  "toast.projectCreated": "已建立專案。",
  "toast.projectUpdated": "已更新專案。",
  "toast.projectRemoved": "已移除專案。",
  "toast.ideaAdded": "已新增想法。",
  "toast.ideaUpdated": "已更新想法。",
  "toast.ideaRemoved": "已移除想法。",
  "toast.ideaReopened": "已重新開啟想法。",
  "toast.exportReady": "匯出已準備完成。",
  "toast.workspaceImported": "已匯入工作區。",
  "toast.legacyImported": "已匯入舊版資料。",
  "toast.legacyFailed": "舊版資料匯入失敗。",
  "toast.localCleared": "已清除本機工作區。",
  "format.noDate": "無日期",
};

const messages: Record<Locale, Record<MessageKey, string>> = {
  en,
  "zh-TW": zhTW,
};

const getBrowserStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

const normalizeLocale = (value: unknown): Locale | null => {
  if (value === "en" || value === "zh-TW") return value;
  return null;
};

const detectLocale = (): Locale => {
  if (typeof navigator === "undefined") return "en";
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return languages.some((language) => language.toLowerCase().startsWith("zh"))
    ? "zh-TW"
    : "en";
};

export const i18n = $state({
  locale: "en" as Locale,
});

const applyLocaleToDocument = () => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = i18n.locale;
  }
};

export const initLocale = () => {
  const saved = normalizeLocale(getBrowserStorage()?.getItem(LOCALE_KEY));
  i18n.locale = saved ?? detectLocale();
  applyLocaleToDocument();
};

export const setLocale = (locale: Locale) => {
  i18n.locale = locale;
  applyLocaleToDocument();
  getBrowserStorage()?.setItem(LOCALE_KEY, locale);
};

export const toggleLocale = () => {
  setLocale(i18n.locale === "en" ? "zh-TW" : "en");
};

export const localeLabel = (locale = i18n.locale) =>
  locale === "en" ? "EN" : "繁";

export const formatLocale = (locale = i18n.locale) =>
  locale === "zh-TW" ? "zh-Hant-TW" : "en";

export const t = (
  key: MessageKey,
  values: Record<string, string | number> = {}
) => {
  let template = messages[i18n.locale][key] ?? messages.en[key];
  for (const [name, value] of Object.entries(values)) {
    template = template.replaceAll(`{${name}}`, String(value));
  }
  return template;
};
