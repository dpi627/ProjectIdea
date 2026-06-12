const THEME_KEY = "ophan.theme";
const UI_KEY = "ophan.ui";

export type Theme = "light" | "dark";
export type CategoryFilter = "all" | "CI" | "MP" | "SP";

const getBrowserStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

export const ui = $state({
  theme: "light" as Theme,
  railCollapsed: false,
  logCollapsed: true,
  logOpenedOnce: false,
  categoryFilter: "all" as CategoryFilter,
});

const isCategoryFilter = (value: unknown): value is CategoryFilter =>
  value === "all" || value === "CI" || value === "MP" || value === "SP";

const applyThemeToDocument = () => {
  document.documentElement.dataset.theme = ui.theme;
};

const saveUi = () => {
  getBrowserStorage()?.setItem(
    UI_KEY,
    JSON.stringify({
      railCollapsed: ui.railCollapsed,
      logCollapsed: ui.logCollapsed,
      categoryFilter: ui.categoryFilter,
    })
  );
};

export const loadUi = () => {
  const storage = getBrowserStorage();
  ui.theme = storage?.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  try {
    const raw = storage?.getItem(UI_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      ui.railCollapsed = parsed.railCollapsed === true;
      ui.logCollapsed = parsed.logCollapsed !== false;
      if (isCategoryFilter(parsed.categoryFilter)) {
        ui.categoryFilter = parsed.categoryFilter;
      }
    }
  } catch (error) {
    console.warn("Failed to restore UI state", error);
  }
  ui.logOpenedOnce = !ui.logCollapsed;
  applyThemeToDocument();
};

export const setTheme = (next: Theme) => {
  ui.theme = next;
  applyThemeToDocument();
  getBrowserStorage()?.setItem(THEME_KEY, next);
};

export const toggleTheme = () => {
  setTheme(ui.theme === "dark" ? "light" : "dark");
};

export const toggleRail = () => {
  ui.railCollapsed = !ui.railCollapsed;
  saveUi();
};

export const toggleLog = () => {
  ui.logCollapsed = !ui.logCollapsed;
  if (!ui.logCollapsed) ui.logOpenedOnce = true;
  saveUi();
};

export const setCategoryFilter = (next: CategoryFilter) => {
  ui.categoryFilter = next;
  saveUi();
};
