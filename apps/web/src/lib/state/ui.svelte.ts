const THEME_KEY = "ophan.theme";
const UI_KEY = "ophan.ui";

export type Theme = "light" | "dark";
export type ProjectCategoryFilter = "CI" | "MP" | "SP" | "NA";

const getBrowserStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

export const ui = $state({
  theme: "light" as Theme,
  railCollapsed: false,
  logCollapsed: true,
  logOpenedOnce: false,
  categoryFilters: [] as ProjectCategoryFilter[],
});

const isProjectCategoryFilter = (
  value: unknown
): value is ProjectCategoryFilter =>
  value === "CI" || value === "MP" || value === "SP" || value === "NA";

const normalizeCategoryFilters = (
  value: unknown,
  legacyValue?: unknown
): ProjectCategoryFilter[] => {
  if (Array.isArray(value)) {
    return value.filter(isProjectCategoryFilter);
  }
  if (isProjectCategoryFilter(legacyValue)) return [legacyValue];
  return [];
};

const applyThemeToDocument = () => {
  document.documentElement.dataset.theme = ui.theme;
};

const saveUi = () => {
  getBrowserStorage()?.setItem(
    UI_KEY,
    JSON.stringify({
      railCollapsed: ui.railCollapsed,
      logCollapsed: ui.logCollapsed,
      categoryFilters: ui.categoryFilters,
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
      ui.categoryFilters = normalizeCategoryFilters(
        parsed.categoryFilters,
        parsed.categoryFilter
      );
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

export const toggleCategoryFilter = (next: ProjectCategoryFilter) => {
  ui.categoryFilters = ui.categoryFilters.includes(next)
    ? ui.categoryFilters.filter((filter) => filter !== next)
    : [...ui.categoryFilters, next];
  saveUi();
};
