const STORAGE_KEY = "project-idea-collection.v1";
const THEME_KEY = "project-idea-collection.theme";
const UI_STATE_KEY = "project-idea-collection.ui";
const LOCAL_FILE_NAME = "project-ideas.json";
const APP_VERSION = "20260127155339";
const DEFAULT_UPDATE_CHECK_INTERVAL_MS = 60_000;
const MIN_UPDATE_CHECK_INTERVAL_MS = 10_000;
const MAX_UPDATE_CHECK_INTERVAL_MS = 3_600_000;
const CHART_JS_SRC =
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
const PRISM_VERSION = "1.29.0";
const PRISM_THEME_HREF =
  `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}/themes/prism-tomorrow.min.css`;
const PRISM_CORE_SRC =
  `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}/components/prism-core.min.js`;
const PRISM_CLIKE_SRC =
  `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}/components/prism-clike.min.js`;
const PRISM_JAVASCRIPT_SRC =
  `https://cdn.jsdelivr.net/npm/prismjs@${PRISM_VERSION}/components/prism-javascript.min.js`;
const GANTT_CATEGORY_OPTIONS = ["CI", "MP", "SP"];
const PROJECT_CATEGORY_FILTER_OPTIONS = [...GANTT_CATEGORY_OPTIONS, "none"];

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const serializeProjects = (projects) =>
  projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    dueDate: project.dueDate,
    category: project.category,
    pinned: Boolean(project.pinned),
    ideas: project.ideas.map((idea) => ({
      id: idea.id,
      text: idea.text,
      done: idea.done,
      createdAt: idea.createdAt,
      finishedAt: idea.finishedAt,
      pinned: Boolean(idea.pinned),
    })),
  }));


const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad2 = (part) => String(part).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };
    return map[char] || char;
  });

const ICONS = {
  edit: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,
  trash: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  `,
  sun: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  `,
  moon: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  `,
  circle: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" />
    </svg>
  `,
  checkCircle: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  `,
  check: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  `,
  copy: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  `,
  log: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.6" />
      <circle cx="4" cy="12" r="1.6" />
      <circle cx="4" cy="18" r="1.6" />
    </svg>
  `,
  logOff: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <line x1="9" y1="6" x2="21" y2="6" />
      <line x1="9" y1="12" x2="19" y2="12" />
      <line x1="9" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.6" />
      <circle cx="4" cy="12" r="1.6" />
      <circle cx="4" cy="18" r="1.6" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  `,
  reopen: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.5 15a9 9 0 1 0 2.3-9.7L1 10" />
    </svg>
  `,
  pin: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="2.5" width="10" height="3.6" rx="0.8" ry="0.8" />
      <path d="M9 8.1h6v5.1l3 2.8H6l3-2.8V8.1z" />
      <line x1="12" y1="16" x2="12" y2="21" />
    </svg>
  `,
  pinOff: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7" y="2.5" width="10" height="3.6" rx="0.8" ry="0.8" />
      <path d="M9 8.1h6v5.1l3 2.8H6l3-2.8V8.1z" />
      <line x1="12" y1="16" x2="12" y2="21" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  `,
  download: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  `,
  upload: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  `,
  gear: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 0 0 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,
  clock: `
    <svg class="meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  `,
  checkCircleMini: `
    <svg class="meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  `,
  calendarClock: `
    <svg class="meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <circle cx="16" cy="16" r="6" />
      <path d="M16 14v2l1 1" />
    </svg>
  `,
  refreshCw: `
    <svg class="meta-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  `,
  gantt: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 6h8" />
      <path d="M3 6h3" />
      <path d="M6 12h10" />
      <path d="M3 12h1" />
      <path d="M12 18h6" />
      <path d="M3 18h5" />
    </svg>
  `,
  tech: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.5 6.5A2.5 2.5 0 0 1 6 4h4.6A4.4 4.4 0 0 1 12 6.2V18.4A4.4 4.4 0 0 0 8.6 16H6a2.5 2.5 0 0 1-2.5-2.5V6.5z" />
      <path d="M20.5 6.5A2.5 2.5 0 0 0 18 4h-4.6A4.4 4.4 0 0 0 12 6.2V18.4A4.4 4.4 0 0 1 15.4 16H18a2.5 2.5 0 0 0 2.5-2.5V6.5z" />
      <line x1="12" y1="6.2" x2="12" y2="20.4" />
      <path d="M6.2 8.6h3.4" />
      <path d="M6.2 11.6h3.4" />
      <path d="M14.4 8.6h3.4" />
      <path d="M14.4 11.6h3.4" />
      <path d="M3.5 18.6Q7.2 16.8 11.1 18.4Q12 18.8 12.9 18.4Q16.8 16.8 20.5 18.6" />
    </svg>
  `,
  database: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  `,
  folderOpen: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <path d="M2 10h20" />
    </svg>
  `,
};

const TECH_SNIPPETS = {
  escapeHtml: String.raw`const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;",
    };
    return map[char] || char;
  });`,
  domainModel: String.raw`class Idea {
  constructor({
    id = createId(),
    text,
    done = false,
    createdAt = Date.now(),
    finishedAt = null,
  }) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.createdAt = createdAt;
    this.finishedAt = finishedAt;
  }
}

class Project {
  constructor({ id = createId(), name, description = "", startDate = null, dueDate = null, category = null, ideas = [] }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.category = category;
    this.ideas = ideas.map((idea) => new Idea(idea));
  }

  stats() {
    const total = this.ideas.length;
    const done = this.ideas.filter((idea) => idea.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }
}`,
  localStorageRepo: String.raw`class LocalStorageProjectRepository {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((project) => new Project(project));
    } catch (error) {
      console.warn("Failed to parse stored data", error);
      return [];
    }
  }

  save(projects) {
    const payload = serializeProjects(projects);
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }
}`,
  fileSystemRepo: String.raw`async openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(this.DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.DB_STORE)) {
        db.createObjectStore(this.DB_STORE);
      }
    };
  });
}

async saveFileHandle(handle) {
  const db = await this.openDatabase();
  const tx = db.transaction(this.DB_STORE, "readwrite");
  tx.objectStore(this.DB_STORE).put(handle, "currentFile");
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}`,
  toggleIdea: String.raw`toggleIdea(projectId, ideaId) {
  const project = this.findProject(projectId);
  const index = project.ideas.findIndex((item) => item.id === ideaId);
  if (index === -1) throw new Error("Idea not found");
  const [idea] = project.ideas.splice(index, 1);
  idea.done = !idea.done;
  idea.finishedAt = idea.done ? new Date().toISOString() : null;
  if (idea.done) {
    project.ideas.push(idea);
  } else {
    project.ideas.unshift(idea);
  }
  this.repository.save(this.projects);
  this.notifyChange();
}`,
  mergeProjects: String.raw`mergeProjects(currentProjects, newProjects) {
  const merged = [...currentProjects];
  const projectMap = new Map(merged.map((p) => [p.id, p]));

  for (const newProject of newProjects) {
    const existing = projectMap.get(newProject.id);
    if (!existing) {
      merged.push(newProject);
      projectMap.set(newProject.id, newProject);
      continue;
    }
    const ideaMap = new Map(existing.ideas.map((i) => [i.id, i]));
    for (const newIdea of newProject.ideas) {
      if (!ideaMap.has(newIdea.id)) {
        existing.ideas.push(newIdea);
        continue;
      }
      const existingIdea = ideaMap.get(newIdea.id);
      const existingTime = Math.max(
        existingIdea.createdAt || 0,
        existingIdea.finishedAt || 0
      );
      const newTime = Math.max(
        newIdea.createdAt || 0,
        newIdea.finishedAt || 0
      );
      if (newTime > existingTime) {
        Object.assign(existingIdea, newIdea);
      }
    }
  }
  return merged;
}`,
  ensureChartJs: String.raw`ensureChartJs() {
  if (typeof Chart !== "undefined") {
    return Promise.resolve(true);
  }
  if (this.chartJsPromise) {
    return this.chartJsPromise;
  }
  this.chartJsPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = CHART_JS_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      this.chartJsPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return this.chartJsPromise;
}`,
  ganttProject: String.raw`renderGanttProject(project, rangeStart, rangeEnd) {
  const stats = project.stats();
  const projectStart = new Date(project.startDate);
  const projectEnd = new Date(project.dueDate);
  const totalRange = rangeEnd - rangeStart;
  const leftPercent = Math.max(0, (projectStart - rangeStart) / totalRange * 100);
  const rightPercent = Math.min(100, (projectEnd - rangeStart) / totalRange * 100);
  const widthPercent = Math.max(0, rightPercent - leftPercent);

  return \`
    <div class="gantt-project" data-project-id="\${project.id}">
      <div class="gantt-project-header" style="left: \${leftPercent}%; min-width: \${widthPercent}%;">
        <div class="gantt-project-label">
          <span class="gantt-project-name">\${escapeHtml(project.name)}</span>
        </div>
        <div class="gantt-project-actions">
          <span class="gantt-project-stats">\${stats.done}/\${stats.total} · \${stats.percent}%</span>
        </div>
      </div>
      <div class="gantt-bar" style="left: \${leftPercent}%; width: \${widthPercent}%;">
        <div class="gantt-bar-progress" style="--progress: \${stats.percent}%;"></div>
      </div>
    </div>
  \`;
}`,
  checkForUpdate: String.raw`async checkForUpdate({ force = false } = {}) {
  if (this.updateCheckInFlight) return;
  if (this.updatePrompted && !force) return;
  this.setUpdateCheckLoading(true);
  try {
    const response = await fetch(\`version.json?v=\${Date.now()}\`, {
      cache: "no-store",
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data?.version && data.version !== APP_VERSION) {
      this.queueUpdatePrompt(data.version);
    }
  } finally {
    this.setUpdateCheckLoading(false);
  }
}`,
  themeApply: String.raw`applyThemePreference(preference) {
  const next =
    preference === "dark" || preference === "light" || preference === "system"
      ? preference
      : "system";
  this.preference = next;
  const resolved = this.resolveTheme(next);
  document.documentElement.dataset.theme = resolved;
  localStorage.setItem(this.storageKey, next);
  return resolved;
}`,
  serviceMonitor: String.raw`const controller = new AbortController();
const timeoutId = window.setTimeout(
  () => controller.abort(),
  this.serviceMonitorTimeoutMs
);
try {
  const response = await fetch(this.serviceMonitorUrl, {
    method: "GET",
    mode: "no-cors",
    signal: controller.signal,
  });
  const alive = Boolean(response);
  this.updateServiceMonitor(alive ? "alive" : "offline");
} catch (error) {
  this.updateServiceMonitor("offline");
} finally {
  window.clearTimeout(timeoutId);
}`,
};

// Domain layer
const partitionByPinned = (items) => {
  const pinned = [];
  const unpinned = [];
  items.forEach((item) => {
    if (item?.pinned) {
      pinned.push(item);
      return;
    }
    unpinned.push(item);
  });
  return { pinned, unpinned };
};

const reorderPinnedFirst = (items) => {
  const { pinned, unpinned } = partitionByPinned(items);
  return [...pinned, ...unpinned];
};

const countPinned = (items) =>
  items.reduce((total, item) => total + (item?.pinned ? 1 : 0), 0);

class Idea {
  constructor({
    id = createId(),
    text,
    done = false,
    createdAt = Date.now(),
    finishedAt = null,
    pinned = false,
  }) {
    this.id = id;
    this.text = text;
    this.done = done;
    this.createdAt = createdAt;
    this.finishedAt = finishedAt;
    this.pinned = Boolean(pinned);
  }
}

class Project {
  constructor({
    id = createId(),
    name,
    description = "",
    startDate = null,
    dueDate = null,
    category = null,
    ideas = [],
    pinned = false,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.dueDate = dueDate;
    this.category = category; // null | "CI" | "MP" | "SP"
    this.pinned = Boolean(pinned);
    this.ideas = reorderPinnedFirst(ideas.map((idea) => new Idea(idea)));
  }

  stats() {
    const total = this.ideas.length;
    const done = this.ideas.filter((idea) => idea.done).length;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }
}

// Data layer
class LocalStorageProjectRepository {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.map((project) => new Project(project));
    } catch (error) {
      console.warn("Failed to parse stored data", error);
      return [];
    }
  }

  save(projects) {
    const payload = serializeProjects(projects);
    localStorage.setItem(this.storageKey, JSON.stringify(payload));
  }
}

class FileSystemDataRepository {
  constructor() {
    this.fileHandle = null;
    this.DB_NAME = "project-idea-studio";
    this.DB_STORE = "fileHandles";
  }

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.DB_STORE)) {
          db.createObjectStore(this.DB_STORE);
        }
      };
    });
  }

  async saveFileHandle(handle) {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction(this.DB_STORE, "readwrite");
      const store = tx.objectStore(this.DB_STORE);
      store.put(handle, "currentFile");
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      console.warn("Failed to save file handle to IndexedDB", error);
    }
  }

  async loadFileHandle() {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction(this.DB_STORE, "readonly");
      const store = tx.objectStore(this.DB_STORE);
      const request = store.get("currentFile");
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn("Failed to load file handle from IndexedDB", error);
      return null;
    }
  }

  async clearFileHandle() {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction(this.DB_STORE, "readwrite");
      const store = tx.objectStore(this.DB_STORE);
      store.delete("currentFile");
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      console.warn("Failed to clear file handle from IndexedDB", error);
    }
  }

  async init() {
    this.fileHandle = await this.loadFileHandle();
    if (this.fileHandle) {
      const hasPermission = await this.verifyPermission();
      if (!hasPermission) {
        this.fileHandle = null;
      }
    }
    return !!this.fileHandle;
  }

  async selectFile() {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    this.fileHandle = handle;
    await this.saveFileHandle(handle);
    return handle;
  }

  async selectStorageLocation() {
    if ("showDirectoryPicker" in window) {
      const directoryHandle = await window.showDirectoryPicker();
      const fileHandle = await directoryHandle.getFileHandle(LOCAL_FILE_NAME, {
        create: true,
      });
      this.fileHandle = fileHandle;
      await this.saveFileHandle(fileHandle);
      return fileHandle;
    }
    return this.createFile();
  }

  async createFile() {
    const handle = await window.showSaveFilePicker({
      suggestedName: LOCAL_FILE_NAME,
      types: [
        {
          description: "JSON Files",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    this.fileHandle = handle;
    await this.saveFileHandle(handle);
    return handle;
  }

  async load() {
    if (!this.fileHandle) return null;
    try {
      const file = await this.fileHandle.getFile();
      const text = await file.text();
      return text.trim() ? JSON.parse(text) : null;
    } catch (error) {
      console.warn("Failed to load data from file", error);
      return null;
    }
  }

  async save(data) {
    if (!this.fileHandle) throw new Error("No file selected");
    const writable = await this.fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
  }

  async verifyPermission() {
    const options = { mode: "readwrite" };
    try {
      if ((await this.fileHandle.queryPermission(options)) === "granted") {
        return true;
      }
      if ((await this.fileHandle.requestPermission(options)) === "granted") {
        return true;
      }
    } catch (error) {
      console.warn("Permission check failed", error);
    }
    return false;
  }

  getFileName() {
    return this.fileHandle?.name || null;
  }
}

const daysAgo = (days) =>
  new Date(Date.now() - days * 24 * 60 * 60_000).toISOString();

const createMockProjects = () => [
  new Project({
    name: "Weekend Build",
    description: "Launch a one-weekend prototype.",
    startDate: "2026-02-03",
    dueDate: "2026-04-15",
    category: "MP",
    ideas: [
      { text: "Sketch 3 quick UX flows", done: true, finishedAt: daysAgo(12) },
      { text: "Finalize launch checklist", done: true, finishedAt: daysAgo(4) },
      { text: "Run a quick usability test", done: true, finishedAt: daysAgo(9) },
      { text: "Draft a one-page pitch", done: false },
      { text: "Prototype core screen", done: false },
    ],
  }),
  new Project({
    name: "Growth Experiments",
    description: "Short tests to unlock new channels.",
    startDate: "2026-05-10",
    dueDate: "2026-08-20",
    category: "CI",
    ideas: [
      { text: "Interview 5 creators", done: true, finishedAt: daysAgo(18) },
      { text: "Ship referral prompt v1", done: true, finishedAt: daysAgo(7) },
      { text: "Analyze activation funnel", done: true, finishedAt: daysAgo(2) },
      { text: "Draft growth experiment doc", done: true, finishedAt: daysAgo(1) },
      { text: "Write launch email v1", done: false },
      { text: "Plan onboarding nudge", done: false },
      { text: "Collect waitlist insights", done: false },
    ],
  }),
];

// Use case layer
class ProjectService {
  constructor(repository) {
    this.repository = repository;
    this.projects = this.repository.load();
    this.wasSeeded = false;
    this.onChange = null;

    this.normalizePinnedOrder();

    if (this.projects.length === 0) {
      this.projects = createMockProjects();
      this.normalizePinnedOrder();
      this.repository.save(this.projects);
      this.wasSeeded = true;
    }
  }

  normalizePinnedOrder() {
    this.projects = reorderPinnedFirst(this.projects);
    this.projects.forEach((project) => {
      project.ideas = reorderPinnedFirst(project.ideas);
    });
  }

  getProjects() {
    return this.projects;
  }

  reloadFromStorage() {
    this.projects = this.repository.load();
    this.normalizePinnedOrder();
    return this.projects;
  }

  notifyChange() {
    if (typeof this.onChange === "function") {
      this.onChange();
    }
  }

  getFinishedLog() {
    const entries = [];
    this.projects.forEach((project) => {
      project.ideas.forEach((idea) => {
        if (idea.done && idea.finishedAt) {
          entries.push({ projectId: project.id, projectName: project.name, idea });
        }
      });
    });
    return entries.sort(
      (a, b) => new Date(b.idea.finishedAt) - new Date(a.idea.finishedAt)
    );
  }

  createProject(name, description = "") {
    const project = new Project({
      name: name.trim(),
      description: description.trim(),
    });
    const pinnedCount = countPinned(this.projects);
    this.projects.splice(pinnedCount, 0, project);
    this.repository.save(this.projects);
    this.notifyChange();
    return project;
  }

  persist() {
    this.repository.save(this.projects);
  }

  exportProjects() {
    return serializeProjects(this.projects);
  }

  importProjects(payload) {
    if (!Array.isArray(payload)) {
      throw new Error("Import data must be an array of projects.");
    }
    const projects = payload.map((project) => {
      if (!project || typeof project.name !== "string") {
        throw new Error("Each project must include a name.");
      }
      const ideas = Array.isArray(project.ideas)
        ? project.ideas
            .filter((idea) => idea && typeof idea.text === "string")
            .map((idea) => ({
              id: idea.id,
              text: idea.text,
              done: Boolean(idea.done),
              createdAt: Number.isFinite(idea.createdAt) ? idea.createdAt : Date.now(),
              finishedAt: idea.finishedAt || null,
              pinned: Boolean(idea.pinned),
            }))
        : [];
      const validCategories = [null, "CI", "MP", "SP"];
      const category = validCategories.includes(project.category) ? project.category : null;
      return new Project({
        id: project.id,
        name: project.name,
        description: project.description || "",
        startDate: project.startDate || null,
        dueDate: project.dueDate || null,
        category,
        ideas,
        pinned: Boolean(project.pinned),
      });
    });
    this.projects = projects;
    this.normalizePinnedOrder();
    this.repository.save(this.projects);
    this.notifyChange();
    return this.projects;
  }

  updateProjectName(projectId, name) {
    const project = this.findProject(projectId);
    project.name = name.trim();
    this.repository.save(this.projects);
    this.notifyChange();
  }

  updateProjectDescription(projectId, description) {
    const project = this.findProject(projectId);
    project.description = description.trim();
    this.repository.save(this.projects);
    this.notifyChange();
  }

  updateProjectDates(projectId, startDate, dueDate) {
    const project = this.findProject(projectId);
    project.startDate = startDate || null;
    project.dueDate = dueDate || null;
    this.repository.save(this.projects);
    this.notifyChange();
  }

  updateProjectCategory(projectId, category) {
    const project = this.findProject(projectId);
    const validCategories = [null, "CI", "MP", "SP"];
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }
    project.category = category;
    this.repository.save(this.projects);
    this.notifyChange();
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter((item) => item.id !== projectId);
    this.repository.save(this.projects);
    this.notifyChange();
  }

  addIdea(projectId, text) {
    const project = this.findProject(projectId);
    const pinnedCount = countPinned(project.ideas);
    project.ideas.splice(pinnedCount, 0, new Idea({ text: text.trim() }));
    this.repository.save(this.projects);
    this.notifyChange();
  }

  toggleProjectPin(projectId) {
    const index = this.projects.findIndex((item) => item.id === projectId);
    if (index === -1) throw new Error("Project not found");
    const [project] = this.projects.splice(index, 1);
    const nextPinned = !project.pinned;
    project.pinned = nextPinned;
    const { pinned, unpinned } = partitionByPinned(this.projects);
    const targetList = nextPinned ? pinned : unpinned;
    targetList.unshift(project);
    this.projects = [...pinned, ...unpinned];
    this.repository.save(this.projects);
    this.notifyChange();
    return project;
  }

  updateIdeaText(projectId, ideaId, text) {
    const idea = this.findIdea(projectId, ideaId);
    idea.text = text.trim();
    this.repository.save(this.projects);
    this.notifyChange();
  }

  deleteIdea(projectId, ideaId) {
    const project = this.findProject(projectId);
    project.ideas = project.ideas.filter((idea) => idea.id !== ideaId);
    this.repository.save(this.projects);
    this.notifyChange();
  }

  toggleIdea(projectId, ideaId) {
    const project = this.findProject(projectId);
    const index = project.ideas.findIndex((item) => item.id === ideaId);
    if (index === -1) throw new Error("Idea not found");
    const [idea] = project.ideas.splice(index, 1);
    idea.done = !idea.done;
    idea.finishedAt = idea.done ? new Date().toISOString() : null;
    const { pinned, unpinned } = partitionByPinned(project.ideas);
    const targetList = idea.pinned ? pinned : unpinned;
    if (idea.done) {
      targetList.push(idea);
    } else {
      targetList.unshift(idea);
    }
    project.ideas = [...pinned, ...unpinned];
    this.repository.save(this.projects);
    this.notifyChange();
  }

  toggleIdeaPin(projectId, ideaId) {
    const project = this.findProject(projectId);
    const index = project.ideas.findIndex((item) => item.id === ideaId);
    if (index === -1) throw new Error("Idea not found");
    const [idea] = project.ideas.splice(index, 1);
    const nextPinned = !idea.pinned;
    idea.pinned = nextPinned;
    const { pinned, unpinned } = partitionByPinned(project.ideas);
    const targetList = nextPinned ? pinned : unpinned;
    targetList.unshift(idea);
    project.ideas = [...pinned, ...unpinned];
    this.repository.save(this.projects);
    this.notifyChange();
    return idea;
  }

  moveIdea(projectId, ideaId, direction) {
    const project = this.findProject(projectId);
    const index = project.ideas.findIndex((idea) => idea.id === ideaId);
    const nextIndex = index + direction;
    if (index === -1 || nextIndex < 0 || nextIndex >= project.ideas.length) return;
    const [moved] = project.ideas.splice(index, 1);
    project.ideas.splice(nextIndex, 0, moved);
    project.ideas = reorderPinnedFirst(project.ideas);
    this.repository.save(this.projects);
    this.notifyChange();
  }

  moveIdeaTo(projectId, ideaId, targetIdeaId) {
    const project = this.findProject(projectId);
    if (ideaId === targetIdeaId) return;
    const fromIndex = project.ideas.findIndex((idea) => idea.id === ideaId);
    const toIndex = project.ideas.findIndex((idea) => idea.id === targetIdeaId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = project.ideas.splice(fromIndex, 1);
    project.ideas.splice(toIndex, 0, moved);
    project.ideas = reorderPinnedFirst(project.ideas);
    this.repository.save(this.projects);
    this.notifyChange();
  }

  moveProject(projectId, targetProjectId) {
    if (projectId === targetProjectId) return;
    const fromIndex = this.projects.findIndex((item) => item.id === projectId);
    const toIndex = this.projects.findIndex((item) => item.id === targetProjectId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = this.projects.splice(fromIndex, 1);
    this.projects.splice(toIndex, 0, moved);
    this.projects = reorderPinnedFirst(this.projects);
    this.repository.save(this.projects);
    this.notifyChange();
  }

  findProject(projectId) {
    const project = this.projects.find((item) => item.id === projectId);
    if (!project) throw new Error("Project not found");
    return project;
  }

  findIdea(projectId, ideaId) {
    const project = this.findProject(projectId);
    const idea = project.ideas.find((item) => item.id === ideaId);
    if (!idea) throw new Error("Idea not found");
    return idea;
  }
}

class ThemeService {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.preference = "system";
  }

  init() {
    const preference = this.getPreference();
    return this.applyThemePreference(preference);
  }

  toggle() {
    const current = this.getResolvedTheme();
    const next = current === "dark" ? "light" : "dark";
    return this.applyThemePreference(next);
  }

  getPreference() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  }

  getCurrentTheme() {
    return this.preference || this.getPreference();
  }

  getResolvedTheme() {
    return (
      document.documentElement.dataset.theme ||
      this.resolveTheme(this.getPreference())
    );
  }

  resolveTheme(preference) {
    if (preference === "dark") return "dark";
    if (preference === "light") return "light";
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  applyThemePreference(preference) {
    const next =
      preference === "dark" || preference === "light" || preference === "system"
        ? preference
        : "system";
    this.preference = next;
    const resolved = this.resolveTheme(next);
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem(this.storageKey, next);
    return resolved;
  }
}

class PolyBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.pointer = { x: 0, y: 0, lastMove: 0, active: false };
    this.motion = { offsetX: 0, offsetY: 0 };
    this.palette = { line: "#1f8a70", accent: "#e9b44c" };

    this.resize();
    this.createPoints();
    this.bindEvents();
    this.updatePalette();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    this.width = width;
    this.height = height;
    this.canvas.width = width * ratio;
    this.canvas.height = height * ratio;
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (this.points.length) {
      this.createPoints();
    }
  }

  createPoints() {
    this.points = Array.from({ length: 48 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (event) => this.handleMove(event.clientX, event.clientY));
    window.addEventListener("mouseleave", () => {
      this.pointer.active = false;
      this.pointer.lastMove = 0;
    });
    window.addEventListener("touchmove", (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      this.handleMove(touch.clientX, touch.clientY);
    });
    window.addEventListener("touchend", () => {
      this.pointer.active = false;
      this.pointer.lastMove = 0;
    });
  }

  handleMove(x, y) {
    this.pointer.x = x;
    this.pointer.y = y;
    this.pointer.lastMove = Date.now();
    this.pointer.active = true;
  }

  updatePalette() {
    const styles = getComputedStyle(document.documentElement);
    this.palette = {
      line: styles.getPropertyValue("--accent").trim() || "#1f8a70",
      accent: styles.getPropertyValue("--accent-2").trim() || "#e9b44c",
    };
  }

  animate() {
    const now = Date.now();
    const isMoving = now - this.pointer.lastMove < 700;
    this.pointer.active = isMoving;
    const targetX = isMoving ? (this.pointer.x - this.width / 2) * 0.07 : 0;
    const targetY = isMoving ? (this.pointer.y - this.height / 2) * 0.07 : 0;
    this.motion.offsetX += (targetX - this.motion.offsetX) * 0.03;
    this.motion.offsetY += (targetY - this.motion.offsetY) * 0.03;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updatePoints(now);
    this.drawNetwork(now);
    requestAnimationFrame(this.animate);
  }

  updatePoints(now) {
    this.points.forEach((point) => {
      point.vx += Math.sin(now / 1800 + point.phase) * 0.018;
      point.vy += Math.cos(now / 1700 + point.phase) * 0.018;
      point.vx *= 0.965;
      point.vy *= 0.965;
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < 0 || point.x > this.width) point.vx *= -1;
      if (point.y < 0 || point.y > this.height) point.vy *= -1;
    });
  }

  drawNetwork(now) {
    const maxDistance = 210;
    const scale = 0.72 + ((Math.sin(now / 4500) + 1) / 2) * 0.56;
    const centerX = this.width / 2 + this.motion.offsetX;
    const centerY = this.height / 2 + this.motion.offsetY;
    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.scale(scale, scale);
    this.ctx.translate(-this.width / 2, -this.height / 2);
    for (let i = 0; i < this.points.length; i += 1) {
      for (let j = i + 1; j < this.points.length; j += 1) {
        const dx = this.points[i].x - this.points[j].x;
        const dy = this.points[i].y - this.points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.7;
          this.ctx.strokeStyle = `${this.palette.line}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`;
          this.ctx.lineWidth = 1.4;
          this.ctx.beginPath();
          this.ctx.moveTo(this.points[i].x, this.points[i].y);
          this.ctx.lineTo(this.points[j].x, this.points[j].y);
          this.ctx.stroke();
        }
      }
    }
    this.ctx.restore();
  }

}

// UI layer
class ProjectIdeaUI {
  constructor(service, themeService, background) {
    this.service = service;
    this.themeService = themeService;
    this.background = background;
    this.dragState = { type: null, id: null };
    this.dragOverProject = null;
    this.dragOverIdea = null;
    const uiState = this.loadUiState();
    this.seedState = this.normalizeSeedState(uiState.seedState);
    if (this.seedState.localStorage === null) {
      this.seedState.localStorage = this.service.wasSeeded;
    }
    if (this.seedState.localDevice === null) {
      this.seedState.localDevice = false;
    }
    this.isLogVisible =
      typeof uiState.isLogVisible === "boolean" ? uiState.isLogVisible : false;
    this.activeProjectId = this.resolveActiveProjectId(uiState.activeProjectId);

    this.projectsList = document.getElementById("projectsList");
    this.projectForm = document.getElementById("projectForm");
    this.projectNameInput = document.getElementById("projectName");
    this.projectFilterInput = document.getElementById("projectFilterInput");
    this.projectCategoryFilters = document.getElementById("projectCategoryFilters");
    this.activeProjectName = document.getElementById("activeProjectName");
    this.progressFill = document.getElementById("progressFill");
    this.progressLabel = document.getElementById("progressLabel");
    this.projectDescription = document.getElementById("projectDescription");
    this.themeToggle = document.getElementById("themeToggle");
    this.techToggle = document.getElementById("techToggle");
    this.settingsToggle = document.getElementById("settingsToggle");
    this.exportButton = document.getElementById("exportData");
    this.importButton = document.getElementById("importData");
    this.importFileInput = document.getElementById("importFile");
    this.logToggle = document.getElementById("logToggle");
    this.notifyStack = document.getElementById("notifyStack");
    this.workspace = document.querySelector(".workspace");
    this.topbar = document.querySelector(".topbar");
    this.topbarSpacer = document.getElementById("topbarSpacer");
    this.ideasPanel = document.querySelector(".ideas-panel");
    this.topbarStickyThreshold = 0;
    this.isTopbarSticky = false;
    this.logPanel = document.querySelector(".log-panel");
    this.logViewAll = document.getElementById("logViewAll");
    this.footerFeatures = document.getElementById("footerFeatures");
    this.logDialog = document.getElementById("logDialog");
    this.logDialogClose = document.getElementById("logDialogClose");
    this.logDialogSearch = document.getElementById("logDialogSearch");
    this.logDialogProjectFilter = document.getElementById(
      "logDialogProjectFilter"
    );
    this.logDialogStart = document.getElementById("logDialogStart");
    this.logDialogEnd = document.getElementById("logDialogEnd");
    this.logDialogScroll = document.getElementById("logDialogScroll");
    this.logDialogList = document.getElementById("logDialogList");
    this.logDialogEmpty = document.getElementById("logDialogEmpty");
    this.logChartUnit = document.getElementById("logChartUnit");
    this.logChart = document.getElementById("logChart");
    this.logPieChart = document.getElementById("logPieChart");
    this.logChartNote = document.querySelector(".log-dialog-chart .chart-note");
    this.serviceMonitorButton = document.getElementById("serviceMonitor");
    this.limitsDialog = document.getElementById("limitsDialog");
    this.limitsClose = document.getElementById("limitsClose");
    this.limitsSearch = document.getElementById("limitsSearch");
    this.limitsFilterInputs = Array.from(
      document.querySelectorAll(".limits-filters input[type='checkbox']")
    );
    this.limitsList = document.getElementById("limitsList");
    this.limitsEmpty = document.getElementById("limitsEmpty");
    this.limitsLoading = document.getElementById("limitsLoading");
    this.limitsAccountSelector = document.getElementById("limitsAccountSelector");
    this.limitsAccountSelect = document.getElementById("limitsAccountSelect");
    this.limitsAccountCount = document.getElementById("limitsAccountCount");
    this.settingsDialog = document.getElementById("settingsDialog");
    this.settingsClose = document.getElementById("settingsClose");
    this.settingsMenuButtons = Array.from(
      document.querySelectorAll(".settings-menu button[data-panel]")
    );
    this.settingsPanels = Array.from(
      document.querySelectorAll(".settings-panel")
    );
    this.settingsExportButton = document.getElementById("settingsExport");      
    this.settingsImportButton = document.getElementById("settingsImport");      
    this.settingsProxyToggle = document.getElementById("settingsProxyToggle");
    this.settingsIdeaToggle = document.getElementById("settingsIdeaToggle");
    this.settingsProxyUrlInput = document.getElementById("settingsProxyUrl");   
    this.settingsUsageUrlInput = document.getElementById("settingsUsageUrl");
    this.settingsIntervalInput = document.getElementById("settingsIntervalSec");
    this.settingsProxyForm = document.getElementById("settingsProxyForm");
    this.settingsUpdateForm = document.getElementById("settingsUpdateForm");
    this.settingsUpdateIntervalInput = document.getElementById(
      "settingsUpdateIntervalSec"
    );
    this.settingsUpdateNowButton = document.getElementById("settingsUpdateNow");
    this.settingsThemeOptions = Array.from(
      document.querySelectorAll('input[name="themePreference"]')
    );
    this.settingsCode = document.querySelector(".settings-code");
    this.dataSourceSelector = document.getElementById("dataSourceSelector");
    this.dataSourceStatus = document.getElementById("dataSourceStatus");
    this.settingsResetData = document.getElementById("settingsResetData");
    this.dataSourceDialog = document.getElementById("dataSourceDialog");
    this.dataSourceForm = document.getElementById("dataSourceForm");
    this.dataSourceCancel = document.getElementById("dataSourceCancel");
    this.ganttToggle = document.getElementById("ganttToggle");
    this.ganttDialog = document.getElementById("ganttDialog");
    this.ganttTimeline = document.getElementById("ganttTimeline");
    this.ganttProjects = document.getElementById("ganttProjects");
    this.ganttRange = document.getElementById("ganttRange");
    this.ganttCategoryTabs = document.getElementById("ganttCategoryTabs");
    this.ganttTotalButton = document.getElementById("ganttTotalButton");
    this.ganttTotalCount = document.getElementById("ganttTotalCount");
    this.ganttCategoryFilter = new Set(GANTT_CATEGORY_OPTIONS);
    this.ganttClose = document.getElementById("ganttClose");
    this.ganttActionFrame = null;
    this.techDialog = document.getElementById("techDialog");
    this.techClose = document.getElementById("techClose");
    this.techContent = document.getElementById("techContent");
    this.techCatalog = document.getElementById("techCatalog");
    this.dialogs = Array.from(document.querySelectorAll("dialog"));

    this.ideaForm = document.getElementById("ideaForm");
    this.ideaTextInput = document.getElementById("ideaText");
    this.ideaTabs = document.getElementById("ideaTabs");
    this.ideasList = document.getElementById("ideasList");
    this.ideasEmpty = document.getElementById("ideasEmpty");
    this.logList = document.getElementById("logList");
    this.logEmpty = document.getElementById("logEmpty");
    this.logFilter = document.getElementById("logFilter");
    this.logProjectFilter = document.getElementById("logProjectFilter");
    this.editDialog = document.getElementById("editDialog");
    this.editForm = document.getElementById("editForm");
    this.editTitle = document.getElementById("editTitle");
    this.editInput = document.getElementById("editInput");
    this.editDescriptionInput = document.getElementById("editDescription");
    this.editDateFields = document.getElementById("editDateFields");
    this.editStartDateInput = document.getElementById("editStartDate");
    this.editDueDateInput = document.getElementById("editDueDate");
    this.editCategoryField = document.getElementById("editCategoryField");
    this.editCategoryInput = document.getElementById("editCategory");
    this.editDelete = document.getElementById("editDelete");
    this.editCancel = document.getElementById("editCancel");
    this.confirmDialog = document.getElementById("confirmDialog");
    this.confirmForm = document.getElementById("confirmForm");
    this.confirmTitle = document.getElementById("confirmTitle");
    this.confirmMessage = document.getElementById("confirmMessage");
    this.confirmCancel = document.getElementById("confirmCancel");
    this.confirmConfirm = document.getElementById("confirmConfirm");
    this.updateDialog = document.getElementById("updateDialog");
    this.updateForm = document.getElementById("updateForm");
    this.updateMessage = document.getElementById("updateMessage");
    this.updateLater = document.getElementById("updateLater");
    this.updateRefresh = document.getElementById("updateRefresh");
    this.editingIdeaId = null;
    this.editingProjectId = null;
    this.editingMode = null;
    this.pendingConfirm = null;
    this.pendingConfirmCancel = null;
    this.animateProjectsOnNextRender = true;
    this.animateIdeasOnNextRender = true;
    this.logFilterValue = "";
    this.logProjectFilterValue = "all";
    this.projectFilterQuery = this.resolveProjectFilterQuery(uiState.projectFilterQuery);
    this.projectCategoryFilter = this.normalizeProjectCategoryFilter(
      uiState.projectCategoryFilter
    );
    if (!this.projectFilterInput && this.projectFilterQuery) {
      this.projectFilterQuery = "";
    }
    this.ideaFilter = this.resolveIdeaFilter(uiState.ideaFilter);
    this.copyWithUltrathink =
      typeof uiState.copyWithUltrathink === "boolean"
        ? uiState.copyWithUltrathink
        : false;
    this.logDialogEntries = [];
    this.logDialogRenderedCount = 0;
    this.logDialogBatchSize = 24;
    this.logDialogChartUnit = this.logChartUnit?.value || "month";
    this.logDialogRangeStart = null;
    this.logDialogRangeEnd = null;
    this.logChartInstance = null;
    this.logPieChartInstance = null;
    this.logChartNoteBase = this.logChartNote?.textContent || "";
    this.chartJsPromise = null;
    this.prismPromise = null;
    this.techTopics = this.buildTechTopics();
    this.techTopicCache = new Map();
    this.techActiveTopicId = this.resolveTechTopicId(uiState.techActiveTopicId);
    this.techSwitchTimer = null;
    this.techCatalogBound = false;
    this.limitsModels = [];
    this.limitsCharts = new Map();
    this.limitsRefreshMs = 30000;
    this.limitsTimer = null;
    this.limitsInFlight = false;
    this.limitsIsLoading = false;
    this.limitsHasRendered = false;
    this.limitsHasData = false;
    this.limitsAccounts = [];
    this.limitsActiveAccountIndex = -1;
    this.limitsRawPayload = null;
    this.updateCheckIntervalMs = this.normalizeUpdateCheckIntervalMs(
      uiState.updateCheckIntervalMs
    );
    this.updatePrompted = false;
    this.pendingUpdateVersion = null;
    this.updateTimer = null;
    this.updateCheckInFlight = false;
    this.serviceMonitorEnabled =
      typeof uiState.serviceMonitorEnabled === "boolean"
        ? uiState.serviceMonitorEnabled
        : false;
    this.serviceMonitorUrl = this.normalizeProxyUrl(uiState.serviceMonitorUrl);
    this.modelUsageUrl = this.normalizeModelUsageUrl(uiState.modelUsageUrl);
    this.serviceMonitorIntervalMs =
      typeof uiState.serviceMonitorIntervalMs === "number" &&
      uiState.serviceMonitorIntervalMs >= 1000
        ? uiState.serviceMonitorIntervalMs
        : 30000;
    this.serviceMonitorTimeoutMs = 2500;
    this.serviceMonitorTimer = null;
    this.serviceMonitorInFlight = false;
    this.serviceMonitorStatus = "checking";
    this.notifyLimit = 4;
    this.notifyDuration = 3200;
    this.dataSource = uiState.dataSource || "localStorage";
    this.fileSystemRepo = new FileSystemDataRepository();
    this.dataSourcePendingStrategy = null;
    this.service.onChange = () => {
      this.markDataSourceDirty();
    };

    const initialTheme = this.themeService.init();
    this.updateThemeLabel(initialTheme);
    this.background.updatePalette();
    this.applyLogVisibility();
    this.updateDataButtons();
    this.initDataSource();
    this.persistUiState();
    this.initServiceMonitor();
    this.initUpdateMonitor();

    this.bindEvents();
    this.render();
  }

  loadUiState() {
    const raw = localStorage.getItem(UI_STATE_KEY);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn("Failed to parse UI state", error);
      return {};
    }
  }

  normalizeSeedState(value) {
    if (!value || typeof value !== "object") {
      return { localStorage: null, localDevice: null };
    }
    return {
      localStorage:
        typeof value.localStorage === "boolean" ? value.localStorage : null,
      localDevice:
        typeof value.localDevice === "boolean" ? value.localDevice : null,
    };
  }

  isSeedDataSource(source) {
    return Boolean(this.seedState?.[source]);
  }

  setSeedState(source, isSeed, { skipPersist = false } = {}) {
    if (!source) return;
    this.seedState[source] = Boolean(isSeed);
    if (!skipPersist) {
      this.persistUiState();
    }
  }

  markDataSourceDirty() {
    if (!this.seedState || this.seedState[this.dataSource] === false) return;
    this.seedState[this.dataSource] = false;
    this.persistUiState();
  }

  buildFilePayload(projects, { seed = false } = {}) {
    return {
      meta: {
        seed: Boolean(seed),
        updatedAt: new Date().toISOString(),
        appVersion: APP_VERSION,
      },
      projects: serializeProjects(projects),
    };
  }

  getFileSeedState(data) {
    if (!data || typeof data !== "object") return false;
    if (data.meta && typeof data.meta === "object") {
      return data.meta.seed === true;
    }
    return false;
  }

  applyProjects(projects) {
    this.service.projects = projects;
    this.service.normalizePinnedOrder();
    this.activeProjectId = this.resolveActiveProjectId(this.activeProjectId);
  }

  buildSeedProjects() {
    return createMockProjects();
  }

  shouldPromptToMigrate(source, projects) {
    if (this.isSeedDataSource(source)) return false;
    return Array.isArray(projects) && projects.length > 0;
  }

  supportsLocalFileAccess() {
    return (
      "showDirectoryPicker" in window || "showSaveFilePicker" in window
    );
  }

  resolveActiveProjectId(projectId) {
    const projects = this.service.getProjects();
    if (!projectId) return projects[0]?.id || null;
    const matches = projects.some((project) => project.id === projectId);
    return matches ? projectId : projects[0]?.id || null;
  }

  resolveProjectFilterQuery(query) {
    if (typeof query !== "string") return "";
    return query.trim();
  }

  normalizeProjectCategoryFilter(value) {
    if (!Array.isArray(value)) {
      return new Set(PROJECT_CATEGORY_FILTER_OPTIONS);
    }
    const allowed = new Set(PROJECT_CATEGORY_FILTER_OPTIONS);
    const next = value.filter((item) => allowed.has(item));
    return new Set(next);
  }

  isAllProjectCategoriesSelected() {
    return PROJECT_CATEGORY_FILTER_OPTIONS.every((category) =>
      this.projectCategoryFilter.has(category)
    );
  }

  getProjectCategoryKey(project) {
    return project?.category || "none";
  }

  filterProjects(projects) {
    const query = (this.projectFilterQuery || "").toLowerCase();
    const allowNameFilter = Boolean(this.projectFilterInput);
    const hasQuery = allowNameFilter && query.length > 0;
    const allCategoriesSelected = this.isAllProjectCategoriesSelected();
    const activeCategories = this.projectCategoryFilter;
    return projects.filter((project) => {
      const nameMatch =
        !hasQuery || project.name.toLowerCase().includes(query);
      if (!nameMatch) return false;
      if (allCategoriesSelected) return true;
      const categoryKey = this.getProjectCategoryKey(project);
      return activeCategories.has(categoryKey);
    });
  }

  syncProjectFilterUI(projects, visibleProjects) {
    if (this.projectFilterInput) {
      const currentValue = this.projectFilterInput.value;
      if (currentValue !== this.projectFilterQuery) {
        this.projectFilterInput.value = this.projectFilterQuery;
      }
    }
    if (!this.projectCategoryFilters) return;
    const buttons = Array.from(
      this.projectCategoryFilters.querySelectorAll("button[data-category]")
    );
    const counts = new Map();
    projects.forEach((project) => {
      const key = this.getProjectCategoryKey(project);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    buttons.forEach((button) => {
      const category = button.dataset.category;
      if (!category) return;
      const isActive = this.projectCategoryFilter.has(category);
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
      const baseLabel = category === "none" ? "NA" : category;
      const total = counts.get(category) || 0;
      button.textContent = `${baseLabel} ${total}`;
    });
  }

  ensureActiveProjectVisible(visibleProjects) {
    const isActiveVisible = visibleProjects.some(
      (project) => project.id === this.activeProjectId
    );
    if (isActiveVisible) return;
    const nextActiveId = visibleProjects[0]?.id || null;
    if (nextActiveId === this.activeProjectId) return;
    this.setActiveProjectId(nextActiveId);
  }

  resolveIdeaFilter(filter) {
    const allowed = ["todo", "done", "all"];
    return allowed.includes(filter) ? filter : "todo";
  }

  resolveTechTopicId(topicId) {
    if (!Array.isArray(this.techTopics) || this.techTopics.length === 0) {
      return null;
    }
    const fallback = this.techTopics[0].id;
    if (!topicId) return fallback;
    const matches = this.techTopics.some((topic) => topic.id === topicId);
    return matches ? topicId : fallback;
  }

  getUiState() {
    return {
      activeProjectId: this.activeProjectId,
      isLogVisible: this.isLogVisible,
      projectFilterQuery: this.projectFilterQuery,
      projectCategoryFilter: Array.from(this.projectCategoryFilter),
      ideaFilter: this.ideaFilter,
      copyWithUltrathink: this.copyWithUltrathink,
      serviceMonitorEnabled: this.serviceMonitorEnabled,
      serviceMonitorUrl: this.serviceMonitorUrl,
      serviceMonitorIntervalMs: this.serviceMonitorIntervalMs,
      updateCheckIntervalMs: this.updateCheckIntervalMs,
      modelUsageUrl: this.modelUsageUrl,
      dataSource: this.dataSource,
      seedState: this.seedState,
      techActiveTopicId: this.techActiveTopicId,
    };
  }

  persistUiState() {
    const payload = this.getUiState();
    localStorage.setItem(UI_STATE_KEY, JSON.stringify(payload));
  }

  getActiveDialog() {
    if (!this.dialogs.length) return null;
    for (let i = this.dialogs.length - 1; i >= 0; i -= 1) {
      const dialog = this.dialogs[i];
      if (dialog?.open || dialog?.hasAttribute("open")) {
        return dialog;
      }
    }
    return null;
  }

  syncNotifyLayer() {
    if (!this.notifyStack) return;
    const target = this.getActiveDialog() || document.body;
    if (this.notifyStack.parentElement !== target) {
      target.appendChild(this.notifyStack);
    }
  }

  formatNotificationText(text, maxLength = 70) {
    if (!text) return "";
    const clean = String(text).trim();
    if (!clean) return "";
    if (clean.length <= maxLength) return clean;
    return `${clean.slice(0, Math.max(0, maxLength - 3))}...`;
  }

  dismissNotification(toast) {
    if (!toast || toast.dataset.state === "leaving") return;
    toast.dataset.state = "leaving";
    toast.classList.add("is-hiding");
    window.setTimeout(() => {
      toast.remove();
    }, 240);
  }

  pushNotification({ title, message, tone = "info", duration } = {}) {
    if (!this.notifyStack || !title) return;
    this.syncNotifyLayer();
    const toast = document.createElement("div");
    toast.className = "notify-toast";
    toast.dataset.tone = tone;
    toast.setAttribute("role", "status");

    const dot = document.createElement("span");
    dot.className = "notify-dot";
    dot.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "notify-body";

    const titleEl = document.createElement("p");
    titleEl.className = "notify-title";
    titleEl.textContent = title;
    body.appendChild(titleEl);

    const finalMessage = this.formatNotificationText(message);
    if (finalMessage) {
      const messageEl = document.createElement("p");
      messageEl.className = "notify-message";
      messageEl.textContent = finalMessage;
      body.appendChild(messageEl);
    }

    toast.append(dot, body);
    this.notifyStack.appendChild(toast);

    const displayDuration = Number.isFinite(duration)
      ? duration
      : this.notifyDuration;
    const timeoutId = window.setTimeout(
      () => this.dismissNotification(toast),
      displayDuration
    );

    toast.addEventListener("click", () => {
      window.clearTimeout(timeoutId);
      this.dismissNotification(toast);
    });

    while (this.notifyStack.children.length > this.notifyLimit) {
      this.dismissNotification(this.notifyStack.firstElementChild);
    }
  }

  normalizeProxyUrl(value) {
    const clean = String(value || "").trim();
    return clean || "http://localhost:8080/health";
  }

  normalizeModelUsageUrl(value) {
    const clean = String(value || "").trim();
    return clean || "http://localhost:8080/account-limits";
  }

  normalizeUpdateCheckIntervalMs(value) {
    if (value === null || value === undefined) {
      return DEFAULT_UPDATE_CHECK_INTERVAL_MS;
    }
    const ms = Number(value);
    if (!Number.isFinite(ms)) return DEFAULT_UPDATE_CHECK_INTERVAL_MS;
    const clamped = Math.min(
      MAX_UPDATE_CHECK_INTERVAL_MS,
      Math.max(MIN_UPDATE_CHECK_INTERVAL_MS, Math.round(ms))
    );
    return clamped;
  }

  async exportData() {
    try {
      if (this.dataSource === "localDevice") {
        await this.persistToFile();
      }
      const data = this.buildExportPayload();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `project-ideas-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      this.pushNotification({
        title: "Export failed",
        message: "Unable to export workspace data.",
        tone: "warning",
      });
    }
  }

  triggerImport() {
    if (!this.importFileInput) return;
    this.importFileInput.value = "";
    this.importFileInput.click();
  }

  setSettingsPanel(panel) {
    if (!panel) return;
    this.settingsMenuButtons.forEach((button) => {
      const isActive = button.dataset.panel === panel;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive);
    });
    this.settingsPanels.forEach((section) => {
      const isActive = section.dataset.panel === panel;
      section.classList.toggle("is-active", isActive);
      section.setAttribute("aria-hidden", !isActive);
    });
  }

  syncSettingsState() {
    if (this.settingsProxyUrlInput) {
      this.settingsProxyUrlInput.value = this.serviceMonitorUrl;
    }
    if (this.settingsUsageUrlInput) {
      this.settingsUsageUrlInput.value = this.modelUsageUrl;
    }
    if (this.settingsIntervalInput) {
      this.settingsIntervalInput.value = Math.round(
        this.serviceMonitorIntervalMs / 1000
      );
    }
    if (this.settingsUpdateIntervalInput) {
      this.settingsUpdateIntervalInput.value = Math.round(
        this.updateCheckIntervalMs / 1000
      );
    }
    if (this.settingsThemeOptions.length) {
      const preference = this.themeService.getCurrentTheme();
      this.settingsThemeOptions.forEach((option) => {
        option.checked = option.value === preference;
      });
    }
    this.updateProxyToggle(this.serviceMonitorEnabled);
    this.updateIdeaToggle(this.copyWithUltrathink);
  }

  buildTechTopics() {
    const storageKey = escapeHtml(STORAGE_KEY);
    const themeKey = escapeHtml(THEME_KEY);
    const uiKey = escapeHtml(UI_STATE_KEY);
    const version = escapeHtml(APP_VERSION);
    const healthUrl = escapeHtml(this.normalizeProxyUrl(""));
    const usageUrl = escapeHtml(this.normalizeModelUsageUrl(""));

    const inline = (text) => `<span class="tech-inline-code">${text}</span>`;
    const codeBlock = (code, language = "javascript") =>
      `
        <pre><code class="language-${language}">${escapeHtml(code)}</code></pre>
      `;
    const section = ({ title, body = "", points = [], code = "", language }) => {
      const pointsHtml = points.length
        ? `<ul class="tech-points">${points.map((item) => `<li>${item}</li>`).join("")}</ul>`
        : "";
      const codeHtml = code ? codeBlock(code, language) : "";
      return `
        <section class="tech-section">
          <h4>${title}</h4>
          ${body ? `<p>${body}</p>` : ""}
          ${pointsHtml}
          ${codeHtml}
        </section>
      `;
    };
    const callout = (title, note) => `
      <div class="tech-callout">
        <strong>${title}</strong>
        <span>${note}</span>
      </div>
    `;
    const topic = ({ id, title, subtitle, sections }) => ({
      id,
      title,
      subtitle,
      render: () => `
        <article class="tech-topic" data-tech-topic="${escapeHtml(id)}">
          <header class="tech-topic-header">
            <h3 class="tech-topic-title">${title}</h3>
            <p class="tech-topic-subtitle">${subtitle}</p>
          </header>
          ${sections.join("")}
        </article>
      `,
    });

    return [
      topic({
        id: "architecture",
        title: "架構分層（單檔但分層清楚）",
        subtitle:
          `核心邏輯集中在 ${inline("app.js")}，但用 class 將 Domain / Data / Use Case / UI / Visual utilities 分開，維持可讀性與維護性。`,
        sections: [
          section({
            title: "分層對照表",
            points: [
              `${inline("Idea")} / ${inline("Project")}: Domain 資料模型`,
              `${inline("LocalStorageProjectRepository")} / ${inline("FileSystemDataRepository")}: 資料存取`,
              `${inline("ProjectService")}: 用例與商業規則`,
              `${inline("ProjectIdeaUI")}: DOM 組裝、事件、畫面`,
              `${inline("ThemeService")} / ${inline("PolyBackground")}: 視覺與主題`,
            ],
          }),
          callout("關鍵技術點", "沒有框架也能用分層思維，降低「所有邏輯攪在一起」的風險。"),
          section({
            title: "Domain 模型與統計計算",
            body:
              "進度百分比不是存表，而是由當下 ideas 狀態即時計算，避免一致性問題。",
            code: TECH_SNIPPETS.domainModel,
          }),
        ],
      }),
      topic({
        id: "data-flow",
        title: "資料流與狀態更新",
        subtitle:
          `所有變更會回到 ${inline("ProjectService")} 內完成，最後統一 ${inline("repository.save")} 並觸發 ${inline("notifyChange")}。`,
        sections: [
          section({
            title: "完成 / 取消完成的排序策略",
            body:
              "切換完成狀態時，同步更新 finishedAt，並把完成項目移到尾端、未完成移到前端，讓清單自然分群。",
            code: TECH_SNIPPETS.toggleIdea,
          }),
          callout("關鍵技術點", "用「行為即排序」的規則，減少 UI 額外排序邏輯。"),
        ],
      }),
      topic({
        id: "storage",
        title: "儲存策略與 LocalStorage Keys",
        subtitle:
          `資料預設存在瀏覽器端（無後端、無登入）。Key 命名清楚且分工明確。`,
        sections: [
          section({
            title: "三個主要儲存 key",
            points: [
              `${inline(storageKey)}: 專案與 ideas 主資料`,
              `${inline(themeKey)}: 主題偏好（system / light / dark）`,
              `${inline(uiKey)}: UI 狀態（篩選、資料來源、更新頻率等）`,
            ],
          }),
          section({
            title: "LocalStorage Repository（純粹、可替換）",
            body:
              "Repository 只負責 load/save；資料規則都放在 service 層，避免資料層過度膨脹。",
            code: TECH_SNIPPETS.localStorageRepo,
          }),
        ],
      }),
      topic({
        id: "data-source",
        title: "資料來源切換（LocalStorage ↔ Local File）",
        subtitle:
          `透過 File System Access API + IndexedDB 快取檔案 handle，支援真正的本機檔案儲存與資料遷移策略。`,
        sections: [
          section({
            title: "檔案 handle 的 IndexedDB 快取",
            body:
              "用 IndexedDB 存 handle，重整後可嘗試恢復檔案存取權限，避免每次都重新挑檔案。",
            code: TECH_SNIPPETS.fileSystemRepo,
          }),
          section({
            title: "合併策略（以時間戳為準）",
            body:
              "當雙方都有資料時可選 merge。衝突以較新的 createdAt / finishedAt 覆蓋，降低資料遺失風險。",
            code: TECH_SNIPPETS.mergeProjects,
          }),
          callout(
            "實務提醒",
            "File System Access API 在 file:// 來源可能受限，建議使用 python -m http.server。"
          ),
        ],
      }),
      topic({
        id: "log-analytics",
        title: "完成紀錄與分析圖表（Chart.js Lazy Load）",
        subtitle:
          `圖表採 lazy loading：只有打開對話框時才載入 ${inline("Chart.js")}，降低初始載入成本。`,
        sections: [
          section({
            title: "Chart.js 的延遲載入模式",
            body:
              "如果全域沒有 Chart，就動態插入 script；載入失敗則允許 graceful fallback。",
            code: TECH_SNIPPETS.ensureChartJs,
          }),
          callout("關鍵技術點", "把「重量級依賴」延後到真正需要時載入，對純前端靜態頁很實用。"),
        ],
      }),
      topic({
        id: "gantt",
        title: "Gantt 時程視覺化（用百分比定位）",
        subtitle:
          "Gantt 視圖用日期換算成百分比位置與寬度，搭配 CSS 呈現時間軸與進度條。",
        sections: [
          section({
            title: "從日期推導位置與寬度",
            body:
              "核心做法是把日期轉成與年度範圍的相對比例，再餵給 inline style。",
            code: TECH_SNIPPETS.ganttProject,
          }),
          callout("關鍵技術點", "不用任何圖表套件也能做時間軸：關鍵在「比例換算 + CSS」。"),
        ],
      }),
      topic({
        id: "service-monitor",
        title: "服務監控與用量面板",
        subtitle:
          `右下角的狀態點會定期打 ${inline(healthUrl)}，成功後才開放讀取 ${inline(usageUrl)} 的用量資料。`,
        sections: [
          section({
            title: "健康檢查的超時控制（AbortController）",
            body:
              "透過 AbortController 設定超時，避免請求卡住。即使 no-cors 也能作為存活訊號。",
            code: TECH_SNIPPETS.serviceMonitor,
          }),
          section({
            title: "多格式 payload 正規化",
            body:
              "用量資料支援多帳號與多種 payload 格式，會先正規化再渲染卡片與環圖。",
            points: [
              "支援 accounts 陣列與 legacy 物件格式",
              "會排除包含 -image 的模型名稱",
              "同時處理 used / limit / percent / remaining 等不同欄位命名",
            ],
          }),
        ],
      }),
      topic({
        id: "versioning",
        title: "版本號、快取破壞與更新檢查",
        subtitle:
          `版本號集中在 ${inline("APP_VERSION")}（目前：${inline(version)}），並同步到 ${inline("index.html")} 與 ${inline("version.json")}。`,
        sections: [
          section({
            title: "更新檢查流程（version.json）",
            body:
              "用 no-store + 時間戳 query 避免快取，版本不同就彈出更新對話框。",
            code: TECH_SNIPPETS.checkForUpdate,
          }),
          callout(
            "專案規則（很重要）",
            "每次改動都要同步更新：index.html 的 ?v=、app.js 的 APP_VERSION、version.json 的 version。"
          ),
        ],
      }),
      topic({
        id: "theme-security",
        title: "主題系統、背景動畫與安全性",
        subtitle:
          `主題用 ${inline("data-theme")} + CSS 變數切換；背景動畫用 ${inline("canvas")}；HTML 輸出前會走 ${inline("escapeHtml")}。`,
        sections: [
          section({
            title: "主題切換的核心落點（data-theme）",
            body:
              "主題不是改 class，而是改 documentElement 的 data-theme，所有顏色透過 CSS variables 連動。",
            code: TECH_SNIPPETS.themeApply,
          }),
          section({
            title: "避免 HTML 注入（必做）",
            body:
              "所有使用者輸入在塞進 innerHTML 前，都先 escape。這是這個專案非常正確的習慣。",
            code: TECH_SNIPPETS.escapeHtml,
          }),
        ],
      }),
    ];
  }

  getTechTopicById(topicId) {
    return this.techTopics.find((topic) => topic.id === topicId) || null;
  }

  renderTechCatalog() {
    if (!this.techCatalog || !this.techTopics.length) return;
    this.techCatalog.innerHTML = this.techTopics
      .map(
        (topic) => `
          <button
            class="tech-topic-button"
            type="button"
            data-topic-id="${escapeHtml(topic.id)}"
            aria-pressed="false"
          >
            <span class="tech-topic-button-title">${topic.title}</span>
            <span class="tech-topic-button-desc">${topic.subtitle}</span>
          </button>
        `
      )
      .join("");

    if (!this.techCatalogBound) {
      this.techCatalog.addEventListener("click", (event) => {
        const button = event.target.closest(".tech-topic-button");
        if (!button) return;
        this.setTechTopic(button.dataset.topicId);
      });
      this.techCatalogBound = true;
    }

    this.updateTechCatalogActive(this.techActiveTopicId);
  }

  updateTechCatalogActive(topicId) {
    if (!this.techCatalog) return;
    const buttons = Array.from(
      this.techCatalog.querySelectorAll(".tech-topic-button")
    );
    buttons.forEach((button) => {
      const isActive = button.dataset.topicId === topicId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive);
    });
  }

  renderTechLoading(message = "載入技術文件中…") {
    if (!this.techContent) return;
    this.techContent.innerHTML = `<div class="tech-loading">${escapeHtml(
      message
    )}</div>`;
  }

  prefetchTechTopic(topicId) {
    const index = this.techTopics.findIndex((topic) => topic.id === topicId);
    if (index === -1) return;
    const next = this.techTopics[index + 1] || this.techTopics[0];
    if (!next || this.techTopicCache.has(next.id)) return;
    window.setTimeout(() => {
      if (this.techTopicCache.has(next.id)) return;
      this.techTopicCache.set(next.id, next.render());
    }, 0);
  }

  setTechTopic(topicId, { force = false } = {}) {
    const resolvedId = this.resolveTechTopicId(topicId);
    if (!resolvedId) return;
    const topic = this.getTechTopicById(resolvedId);
    if (!topic || !this.techContent) return;

    if (!force && this.techActiveTopicId === resolvedId) return;

    this.techActiveTopicId = resolvedId;
    this.persistUiState();
    this.updateTechCatalogActive(resolvedId);

    const hasCached = this.techTopicCache.has(resolvedId);
    if (this.techSwitchTimer) {
      window.clearTimeout(this.techSwitchTimer);
      this.techSwitchTimer = null;
    }

    this.techContent.classList.add("is-switching");

    if (!hasCached) {
      window.setTimeout(() => {
        if (this.techContent?.dataset.topicId === resolvedId) return;
        this.renderTechLoading("整理重點中…");
      }, 90);
    }

    const delay = hasCached ? 110 : 170;
    this.techSwitchTimer = window.setTimeout(() => {
      const html = hasCached ? this.techTopicCache.get(resolvedId) : topic.render();
      if (!hasCached) {
        this.techTopicCache.set(resolvedId, html);
      }
      this.techContent.dataset.topicId = resolvedId;
      this.techContent.innerHTML = html;
      this.techContent.scrollTop = 0;
      this.techContent.classList.remove("is-switching");
      this.highlightTechCode();
      this.prefetchTechTopic(resolvedId);
    }, delay);
  }

  openTechDialog(topicId = null) {
    if (!this.techDialog) return;
    // Warm up Prism.js in parallel with rendering to reduce perceived latency.
    this.ensurePrism();
    this.renderTechCatalog();
    const targetId = this.resolveTechTopicId(topicId || this.techActiveTopicId);
    this.setTechTopic(targetId, { force: true });
    if (typeof this.techDialog.showModal === "function") {
      this.techDialog.showModal();
    } else {
      this.techDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
  }

  closeTechDialog() {
    if (!this.techDialog) return;
    if (this.techDialog.open) {
      this.techDialog.close();
    } else {
      this.techDialog.removeAttribute("open");
    }
    this.syncNotifyLayer();
  }

  ensurePrismTheme() {
    const existing = document.querySelector(
      `link[data-prism-theme="${PRISM_THEME_HREF}"]`
    );
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = PRISM_THEME_HREF;
    link.dataset.prismTheme = PRISM_THEME_HREF;
    const applyStylesheet = () => {
      if (link.rel !== "stylesheet") {
        link.rel = "stylesheet";
      }
    };
    link.onload = applyStylesheet;
    link.onerror = applyStylesheet;
    // Fallback for browsers that ignore rel=preload for styles.
    window.setTimeout(applyStylesheet, 1500);
    document.head.appendChild(link);
  }

  loadPrismScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (
          existing.dataset.loaded === "true" ||
          existing.readyState === "complete" ||
          existing.readyState === "loaded"
        ) {
          existing.dataset.loaded = "true";
          resolve(true);
        } else {
          existing.addEventListener("load", () => resolve(true), {
            once: true,
          });
          existing.addEventListener("error", () => reject(new Error(src)), {
            once: true,
          });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        script.dataset.loaded = "true";
        resolve(true);
      };
      script.onerror = () => reject(new Error(src));
      document.head.appendChild(script);
    });
  }

  ensurePrism() {
    if (
      typeof window.Prism !== "undefined" &&
      window.Prism.languages?.javascript
    ) {
      return Promise.resolve(true);
    }
    if (this.prismPromise) {
      return this.prismPromise;
    }
    this.ensurePrismTheme();
    // Disable Prism's auto-run; we highlight on-demand after injecting HTML.
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
    this.prismPromise = this.loadPrismScript(PRISM_CORE_SRC)
      .then(() => this.loadPrismScript(PRISM_CLIKE_SRC))
      .then(() => this.loadPrismScript(PRISM_JAVASCRIPT_SRC))
      .then(() => true)
      .catch(() => {
        this.prismPromise = null;
        return false;
      });
    return this.prismPromise;
  }

  highlightTechCode() {
    if (!this.techContent) return;
    this.ensurePrism().then((loaded) => {
      if (!loaded || typeof window.Prism === "undefined") return;
      const blocks = this.techContent.querySelectorAll(
        'pre code[class*="language-"]'
      );
      blocks.forEach((block) => {
        if (block.dataset.prismHighlighted === "true") return;
        window.Prism.highlightElement(block);
        block.dataset.prismHighlighted = "true";
      });
    });
  }

  openGanttDialog() {
    if (!this.ganttDialog) return;
    this.initGanttYearOptions();
    this.updateGanttCategoryTabs();
    this.renderGanttChart();
    if (typeof this.ganttDialog.showModal === "function") {
      this.ganttDialog.showModal();
    } else {
      this.ganttDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
    this.queueGanttProjectActions();
  }

  updateGanttCategoryTabs() {
    if (!this.ganttCategoryTabs) return;
    const selectedYear = parseInt(this.ganttRange?.value || new Date().getFullYear(), 10);
    const { start, end } = this.calculateGanttTimeRange(selectedYear);

    // 計算每個分類的專案數量
    const allProjects = this.service.getProjects()
      .filter(p => p.startDate && p.dueDate)
      .filter(p => {
        const projectStart = new Date(p.startDate);
        const projectEnd = new Date(p.dueDate);
        return projectEnd >= start && projectStart < end;
      });

    const counts = {
      CI: 0,
      MP: 0,
      SP: 0,
    };
    allProjects.forEach((project) => {
      if (counts[project.category] !== undefined) {
        counts[project.category] += 1;
      }
    });

    if (this.ganttTotalCount) {
      this.ganttTotalCount.textContent = allProjects.length;
    }

    this.ganttCategoryTabs.querySelectorAll(".gantt-tab-button").forEach((btn) => {
      const category = btn.dataset.category;
      const countEl = btn.querySelector(".tab-count");
      if (countEl && category) {
        countEl.textContent = counts[category] || 0;
      }
    });
    this.syncGanttCategoryButtons();
  }

  syncGanttCategoryButtons() {
    if (!this.ganttCategoryTabs) return;
    this.ganttCategoryTabs.querySelectorAll(".gantt-tab-button").forEach((button) => {
      const category = button.dataset.category;
      const isActive = category ? this.ganttCategoryFilter.has(category) : false;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive);
    });
  }

  initGanttYearOptions() {
    if (!this.ganttRange) return;
    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    const endYear = currentYear + 1;

    // 只在選項尚未設定時初始化
    if (this.ganttRange.options.length === 0) {
      for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
          option.selected = true;
        }
        this.ganttRange.appendChild(option);
      }
    }
  }

  renderGanttChart() {
    const selectedYear = parseInt(this.ganttRange?.value || new Date().getFullYear(), 10);
    const activeCategories = Array.from(this.ganttCategoryFilter || []);
    const allCategoriesSelected =
      activeCategories.length === GANTT_CATEGORY_OPTIONS.length;
    const { start, end, monthLabels } = this.calculateGanttTimeRange(selectedYear);
    const now = new Date();
    const currentYM = `${now.getFullYear()}/${now.getMonth() + 1}`;

    // 渲染月份時間軸
    this.ganttTimeline.innerHTML = monthLabels
      .map(label => `<div class="gantt-month${label === currentYM ? ' is-current' : ''}">${escapeHtml(label)}</div>`)
      .join("");

    // 篩選有日期的專案並排序（起始時間近的在上）
    let projectsWithDates = this.service.getProjects()
      .filter(p => p.startDate && p.dueDate);

    // 套用分類過濾
    if (!allCategoriesSelected) {
      if (activeCategories.length === 0) {
        projectsWithDates = [];
      } else {
        projectsWithDates = projectsWithDates.filter((project) =>
          activeCategories.includes(project.category)
        );
      }
    }

    // 套用年度過濾 - 專案起迄日期必須與選擇年度有交集
    projectsWithDates = projectsWithDates.filter(p => {
      const projectStart = new Date(p.startDate);
      const projectEnd = new Date(p.dueDate);
      // 專案結束日期 >= 年度開始 且 專案開始日期 < 年度結束
      return projectEnd >= start && projectStart < end;
    });

    projectsWithDates.sort((a, b) => {
      const pinnedDiff = Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
      if (pinnedDiff !== 0) return pinnedDiff;
      return new Date(a.startDate) - new Date(b.startDate);
    });

    if (projectsWithDates.length === 0) {
      const categoryLabel = activeCategories.join(" / ");
      const message = activeCategories.length === 0
        ? "Select at least one category to view projects."
        : allCategoriesSelected
          ? `No projects in ${selectedYear}`
          : `No ${categoryLabel} projects in ${selectedYear}`;
      this.ganttProjects.innerHTML = `<div class="gantt-empty">${escapeHtml(message)}</div>`;
      return;
    }

    // 渲染專案條形圖
    this.ganttProjects.innerHTML = projectsWithDates
      .map(project => this.renderGanttProject(project, start, end))
      .join("");
    this.queueGanttProjectActions();
  }

  queueGanttProjectActions() {
    if (!this.ganttDialog || !this.ganttProjects) return;
    if (!this.ganttDialog.open && !this.ganttDialog.hasAttribute("open")) return;
    if (this.ganttActionFrame) return;
    this.ganttActionFrame = requestAnimationFrame(() => {
      this.ganttActionFrame = null;
      this.syncGanttProjectActions();
    });
  }

  syncGanttProjectActions() {
    if (!this.ganttProjects) return;
    const containerRect = this.ganttProjects.getBoundingClientRect();
    if (!containerRect.width) return;
    const projects = Array.from(this.ganttProjects.querySelectorAll(".gantt-project"));
    projects.forEach((project) => {
      const header = project.querySelector(".gantt-project-header");
      const label = project.querySelector(".gantt-project-label");
      const actions = project.querySelector(".gantt-project-actions");
      if (!header || !label || !actions) return;
      const labelRect = label.getBoundingClientRect();
      const headerRect = header.getBoundingClientRect();
      const actionsWidth = this.measureGanttActionsWidth(actions);
      const gapValue = parseFloat(getComputedStyle(header).gap);
      const gap = Number.isFinite(gapValue) ? gapValue : 12;
      const projectedRight = headerRect.left + labelRect.width + gap + actionsWidth;
      const shouldFlip = projectedRight > containerRect.right - 4;
      project.classList.toggle("is-actions-left", shouldFlip);
    });
  }

  measureGanttActionsWidth(actions) {
    const computed = getComputedStyle(actions);
    if (computed.display !== "none") {
      return actions.getBoundingClientRect().width;
    }
    const prevDisplay = actions.style.display;
    const prevVisibility = actions.style.visibility;
    const prevPosition = actions.style.position;
    const prevPointerEvents = actions.style.pointerEvents;
    actions.style.display = "flex";
    actions.style.visibility = "hidden";
    actions.style.position = "absolute";
    actions.style.pointerEvents = "none";
    const width = actions.getBoundingClientRect().width;
    actions.style.display = prevDisplay;
    actions.style.visibility = prevVisibility;
    actions.style.position = prevPosition;
    actions.style.pointerEvents = prevPointerEvents;
    return width;
  }

  calculateGanttTimeRange(year) {
    const start = new Date(year, 0, 1); // 1月1日
    const end = new Date(year, 12, 1); // 隔年1月1日（即12個月）

    const monthLabels = [];
    const current = new Date(start);
    while (current < end) {
      monthLabels.push(`${current.getFullYear()}/${current.getMonth() + 1}`);
      current.setMonth(current.getMonth() + 1);
    }

    return { start, end, monthLabels };
  }

  renderGanttProject(project, rangeStart, rangeEnd) {
    const stats = project.stats();
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.dueDate);

    // 計算位置百分比
    const totalRange = rangeEnd - rangeStart;
    const leftPercent = Math.max(0, (projectStart - rangeStart) / totalRange * 100);
    const rightPercent = Math.min(100, (projectEnd - rangeStart) / totalRange * 100);
    const widthPercent = Math.max(0, rightPercent - leftPercent);

    const categoryTag = project.category
      ? `<span class="gantt-category gantt-category-${project.category.toLowerCase()}">${escapeHtml(project.category)}</span>`
      : "";

    return `
      <div class="gantt-project" data-project-id="${project.id}">
        <div class="gantt-project-header" style="left: ${leftPercent}%; min-width: ${widthPercent}%;">
          <div class="gantt-project-label">
            ${categoryTag}
            <span class="gantt-project-name">${escapeHtml(project.name)}</span>
          </div>
          <div class="gantt-project-actions">
            <span class="gantt-project-stats">${stats.done}/${stats.total} · ${stats.percent}%</span>
            <button class="gantt-edit-btn" type="button" data-action="edit-project" aria-label="Edit project" title="Edit project">
              ${ICONS.edit}
            </button>
          </div>
        </div>
        <div class="gantt-bar" style="left: ${leftPercent}%; width: ${widthPercent}%;">
          <div class="gantt-bar-progress" style="--progress: ${stats.percent}%;"></div>
        </div>
      </div>
    `;
  }

  openSettingsDialog(panel = "theme") {
    if (!this.settingsDialog) return;
    this.syncSettingsState();
    this.setSettingsPanel(panel);
    if (typeof this.settingsDialog.showModal === "function") {
      this.settingsDialog.showModal();
    } else {
      this.settingsDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
  }

  closeSettingsDialog() {
    if (!this.settingsDialog) return;
    if (this.settingsDialog.open) {
      this.settingsDialog.close();
    } else {
      this.settingsDialog.removeAttribute("open");
    }
    this.syncNotifyLayer();
  }

  updateProxyToggle(isEnabled) {
    if (!this.settingsProxyToggle) return;
    this.settingsProxyToggle.classList.toggle("is-active", isEnabled);
    this.settingsProxyToggle.setAttribute("aria-pressed", isEnabled);
    const label = isEnabled ? "Enabled" : "Disabled";
    const textNode = this.settingsProxyToggle.querySelector(".toggle-text");
    if (textNode) textNode.textContent = label;
  }

  updateIdeaToggle(isEnabled) {
    if (!this.settingsIdeaToggle) return;
    this.settingsIdeaToggle.classList.toggle("is-active", isEnabled);
    this.settingsIdeaToggle.setAttribute("aria-pressed", isEnabled);
    const label = isEnabled ? "Enabled" : "Disabled";
    const textNode = this.settingsIdeaToggle.querySelector(".toggle-text");
    if (textNode) textNode.textContent = label;
  }

  setCopyWithUltrathink(isEnabled, { skipPersist = false } = {}) {
    this.copyWithUltrathink = Boolean(isEnabled);
    if (!skipPersist) {
      this.persistUiState();
    }
    this.updateIdeaToggle(this.copyWithUltrathink);
  }

  setServiceMonitorUrl(url, { skipPersist = false } = {}) {
    this.serviceMonitorUrl = this.normalizeProxyUrl(url);
    if (this.settingsProxyUrlInput) {
      this.settingsProxyUrlInput.value = this.serviceMonitorUrl;
    }
    if (!skipPersist) {
      this.persistUiState();
    }
    if (this.serviceMonitorEnabled) {
      this.checkServiceAlive(true);
    }
  }

  setModelUsageUrl(url, { skipPersist = false } = {}) {
    this.modelUsageUrl = this.normalizeModelUsageUrl(url);
    if (this.settingsUsageUrlInput) {
      this.settingsUsageUrlInput.value = this.modelUsageUrl;
    }
    if (!skipPersist) {
      this.persistUiState();
    }
    if (this.limitsDialog?.open || this.limitsDialog?.hasAttribute("open")) {
      this.fetchModelLimits();
    }
  }

  setServiceMonitorEnabled(isEnabled, { skipPersist = false } = {}) {
    this.serviceMonitorEnabled = Boolean(isEnabled);
    if (!skipPersist) {
      this.persistUiState();
    }
    if (!this.serviceMonitorButton) return;
    this.serviceMonitorButton.classList.toggle(
      "hidden",
      !this.serviceMonitorEnabled
    );
    if (this.serviceMonitorEnabled) {
      this.startServiceMonitor();
    } else {
      this.stopServiceMonitor();
      if (this.limitsDialog?.open || this.limitsDialog?.hasAttribute("open")) {
        this.closeLimitsDialog();
      }
    }
    this.updateProxyToggle(this.serviceMonitorEnabled);
  }

  startServiceMonitor() {
    if (!this.serviceMonitorButton) return;
    if (this.serviceMonitorTimer) {
      window.clearInterval(this.serviceMonitorTimer);
    }
    this.updateServiceMonitor("checking");
    this.checkServiceAlive();
    this.serviceMonitorTimer = window.setInterval(() => {
      this.checkServiceAlive();
    }, this.serviceMonitorIntervalMs);
  }

  stopServiceMonitor() {
    if (this.serviceMonitorTimer) {
      window.clearInterval(this.serviceMonitorTimer);
    }
    this.serviceMonitorTimer = null;
    this.serviceMonitorInFlight = false;
  }

  setServiceMonitorInterval(seconds) {
    const sec = Number(seconds);
    if (!Number.isFinite(sec) || sec < 1) return;
    const ms = Math.round(sec * 1000);
    if (ms === this.serviceMonitorIntervalMs) return;
    this.serviceMonitorIntervalMs = ms;
    this.persistUiState();
    if (this.serviceMonitorEnabled) {
      this.startServiceMonitor();
    }
    if (this.settingsIntervalInput) {
      this.settingsIntervalInput.value = sec;
    }
  }

  applyThemePreference(preference) {
    const resolved = this.themeService.applyThemePreference(preference);
    this.updateThemeLabel(resolved);
    this.background.updatePalette();
    if (this.logDialog.open || this.logDialog.hasAttribute("open")) {
      this.renderLogDialogChart();
    }
    if (this.limitsDialog?.open || this.limitsDialog?.hasAttribute("open")) {
      this.renderLimits();
    }
  }

  setLimitsLoading(isLoading, message = "Loading model usage...") {
    this.limitsIsLoading = Boolean(isLoading);
    if (!this.limitsLoading) return;
    this.limitsLoading.classList.toggle("hidden", !this.limitsIsLoading);
    const text = this.limitsLoading.querySelector("p");
    if (text && message) {
      text.textContent = message;
    }
    if (this.limitsIsLoading) {
      this.updateLimitsEmptyState("", false);
    }
  }

  getAccountLimitsUrl() {
    return this.normalizeModelUsageUrl(this.modelUsageUrl);
  }

  async openLimitsDialog() {
    if (!this.limitsDialog || !this.serviceMonitorEnabled) return;
    const alive = await this.checkServiceAlive(true);
    if (!alive) {
      this.pushNotification({
        title: "Service offline",
        message: "Cannot load model usage.",
        tone: "warning",
      });
      return;
    }
    if (this.limitsDialog.open || this.limitsDialog.hasAttribute("open")) {
      await this.fetchModelLimits();
      this.startLimitsUpdates();
      return;
    }
    if (typeof this.limitsDialog.showModal === "function") {
      this.limitsDialog.showModal();
    } else {
      this.limitsDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
    this.limitsHasRendered = false;
    this.setLimitsLoading(true);
    await this.fetchModelLimits({ showLoading: true });
    this.startLimitsUpdates();
  }

  closeLimitsDialog() {
    if (!this.limitsDialog) return;
    if (this.limitsDialog.open) {
      this.limitsDialog.close();
    } else {
      this.limitsDialog.removeAttribute("open");
    }
    this.stopLimitsUpdates();
    this.syncNotifyLayer();
    // Reset account selection
    this.limitsActiveAccountIndex = -1;
    if (this.limitsAccountSelect) {
      this.limitsAccountSelect.value = "-1";
    }
  }

  startLimitsUpdates() {
    if (this.limitsTimer) {
      window.clearInterval(this.limitsTimer);
    }
    this.limitsTimer = window.setInterval(() => {
      this.fetchModelLimits();
    }, this.limitsRefreshMs);
  }

  stopLimitsUpdates() {
    if (this.limitsTimer) {
      window.clearInterval(this.limitsTimer);
    }
    this.limitsTimer = null;
  }

  normalizeLimitsPayload(payload) {
    const items = [];

    // Store raw payload for account switching
    this.limitsRawPayload = payload;

    // Extract accounts array for multi-account support
    const accounts = Array.isArray(payload?.accounts) ? payload.accounts : [];
    this.limitsAccounts = accounts;

    // Determine which accounts to process based on active selection
    let accountsToProcess = [];
    if (accounts.length > 0) {
      if (this.limitsActiveAccountIndex === -1) {
        // All accounts
        accountsToProcess = accounts.map((acc, idx) => ({ account: acc, index: idx }));
      } else if (this.limitsActiveAccountIndex >= 0 && this.limitsActiveAccountIndex < accounts.length) {
        // Single account
        accountsToProcess = [{ account: accounts[this.limitsActiveAccountIndex], index: this.limitsActiveAccountIndex }];
      }
    }

    // Process multi-account format
    if (accountsToProcess.length > 0) {
      accountsToProcess.forEach(({ account, index }) => {
        const accountModels = account?.limits || account?.models;
        const accountEmail = account?.email || account?.id || `Account ${index + 1}`;
        if (accountModels && typeof accountModels === "object") {
          Object.entries(accountModels).forEach(([name, value]) => {
            items.push({
              name,
              ...value,
              lastUsed: account?.lastUsed,
              accountEmail,
              accountIndex: index,
            });
          });
        }
      });
    }

    // Fallback to single account or legacy format
    if (!items.length) {
      if (payload && typeof payload === "object") {
        const account = Array.isArray(payload.accounts) ? payload.accounts[0] : null;
        const accountModels = account?.limits || account?.models;
        if (accountModels && typeof accountModels === "object") {
          Object.entries(accountModels).forEach(([name, value]) => {
            items.push({ name, ...value, lastUsed: account?.lastUsed });
          });
        }
      }
    }

    // Fallback to other legacy formats
    if (!items.length) {
      if (Array.isArray(payload)) {
        payload.forEach((item) => items.push(item));
      } else if (payload && typeof payload === "object") {
        const list =
          payload.models || payload.data || payload.usage || payload.items || null;
        if (Array.isArray(list)) {
          list.forEach((item) => items.push(item));
        } else {
          Object.entries(payload).forEach(([key, value]) => {
            if (value && typeof value === "object") {
              items.push({ name: key, ...value });
            }
          });
        }
      }
    }
    const toPercentValue = (value) => {
      if (typeof value === "string" && value.includes("%")) {
        return Number.parseFloat(value);
      }
      return Number(value);
    };

    return items
      .map((item) => {
        const name = String(
          item?.name || item?.model || item?.id || item?.key || ""
        ).trim();
        if (!name) return null;
        // Filter out models containing "-image"
        if (name.toLowerCase().includes("-image")) return null;
        const used = Number(
          item?.used ??
            item?.usage ??
            item?.consumed ??
            item?.usedTokens ??
            item?.tokensUsed ??
            item?.tokens_used ??
            item?.requestCount ??
            item?.requests
        );
        const limitValue =
          item?.limit ?? item?.quota ?? item?.max ?? item?.capacity;
        const limit = Number(limitValue);
        const rawPercent = toPercentValue(
          item?.usagePercent ??
            item?.usage_percent ??
            item?.usedPercent ??
            item?.used_percent ??
            item?.percent
        );
        const remainingFraction = Number(
          item?.remainingFraction ?? item?.remaining_fraction
        );
        const remainingPercent = toPercentValue(
          item?.remainingPercent ?? item?.remaining_percent ?? item?.remaining
        );
        const usedPercent = Number.isFinite(rawPercent)
          ? Math.max(0, Math.min(100, Math.round(rawPercent)))
          : Number.isFinite(remainingFraction)
            ? Math.max(
                0,
                Math.min(100, Math.round((1 - remainingFraction) * 100))
              )
            : Number.isFinite(remainingPercent)
              ? Math.max(
                  0,
                  Math.min(100, Math.round(100 - remainingPercent))
                )
              : Number.isFinite(used) && Number.isFinite(limit) && limit > 0
            ? Math.max(0, Math.min(100, Math.round((used / limit) * 100)))      
            : null;
        let availablePercent = Number.isFinite(remainingFraction)
          ? Math.max(0, Math.min(100, Math.round(remainingFraction * 100)))
          : Number.isFinite(remainingPercent)
            ? Math.max(0, Math.min(100, Math.round(remainingPercent)))
            : Number.isFinite(usedPercent)
              ? Math.max(0, Math.min(100, Math.round(100 - usedPercent)))
              : null;
        if (
          !Number.isFinite(availablePercent) &&
          limitValue !== null &&
          limitValue !== undefined &&
          limit === 0
        ) {
          availablePercent = 0;
        }
        const lastUsed =
          item?.lastUsed ??
          item?.last_used ??
          item?.lastUsedAt ??
          item?.last_used_at ??
          item?.lastRequestAt;
        const resetAt =
          item?.quotaReset ??
          item?.resetAt ??
          item?.reset_at ??
          item?.resetTime ??
          item?.reset_time ??
          item?.quota_reset ??
          item?.quotaResetAt;
        return {
          name,
          used: Number.isFinite(used) ? used : null,
          limit: Number.isFinite(limit) ? limit : null,
          usedPercent,
          availablePercent,
          lastUsed,
          resetAt,
          accountEmail: item?.accountEmail || null,
          accountIndex: item?.accountIndex ?? null,
        };
      })
      .filter(Boolean);
  }

  updateAccountSelector() {
    if (!this.limitsAccountSelector || !this.limitsAccountSelect) return;

    const accounts = this.limitsAccounts;
    const hasMultipleAccounts = accounts.length > 1;

    // Show/hide account selector
    this.limitsAccountSelector.classList.toggle("hidden", !hasMultipleAccounts);

    if (!hasMultipleAccounts) return;

    // Update account count
    if (this.limitsAccountCount) {
      this.limitsAccountCount.textContent = `${accounts.length} accounts`;
    }

    // Build options
    const currentValue = this.limitsAccountSelect.value;
    this.limitsAccountSelect.innerHTML = "";

    // Add "All accounts" option
    const allOption = document.createElement("option");
    allOption.value = "-1";
    allOption.textContent = "All accounts";
    this.limitsAccountSelect.appendChild(allOption);

    // Add individual account options
    accounts.forEach((account, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      const email = account?.email || account?.id || `Account ${index + 1}`;
      const tier = account?.tier || account?.plan || "";
      option.textContent = tier ? `${email} (${tier})` : email;
      this.limitsAccountSelect.appendChild(option);
    });

    // Restore selection
    this.limitsAccountSelect.value = currentValue || "-1";
  }

  getModelCategory(name) {
    const lower = name.toLowerCase();
    if (lower.includes("claude")) return "claude";
    if (lower.includes("gemini-3")) return "gemini-3";
    if (lower.includes("gemini-2.5") || lower.includes("gemini-2_5")) {
      return "gemini-2.5";
    }
    return "other";
  }

  getLimitsFilters() {
    const active = new Set(
      this.limitsFilterInputs.filter((input) => input.checked).map((input) => {
        return input.dataset.filter;
      })
    );
    const query = (this.limitsSearch?.value || "").trim().toLowerCase();
    return { active, query };
  }

  updateLimitsEmptyState(message, show) {
    if (!this.limitsEmpty) return;
    const text = this.limitsEmpty.querySelector("p");
    if (text && message) {
      text.textContent = message;
    }
    const shouldShow = show && !this.limitsIsLoading;
    this.limitsEmpty.classList.toggle("hidden", !shouldShow);
  }

  async fetchModelLimits({ showLoading = false } = {}) {
    if (this.limitsInFlight) return;
    this.limitsInFlight = true;
    if (showLoading) {
      this.setLimitsLoading(true);
    }
    try {
      const response = await fetch(
        `${this.getAccountLimitsUrl()}?t=${Date.now()}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch account limits.");
      }
      const payload = await response.json();
      this.limitsModels = this.normalizeLimitsPayload(payload);
      this.limitsHasData = this.limitsModels.length > 0;
      this.updateAccountSelector();
      this.updateServiceMonitor("alive");
      this.setLimitsLoading(false);
      this.renderLimits();
    } catch (error) {
      this.limitsHasData = false;
      this.limitsModels = [];
      this.limitsList.innerHTML = "";
      this.limitsCharts.forEach((chart) => chart.destroy());
      this.limitsCharts.clear();
      this.setLimitsLoading(true, "Reconnecting...");
      this.pushNotification({
        title: "Usage unavailable",
        message: "Check service status or proxy URL.",
        tone: "warning",
      });
      this.updateServiceMonitor("offline");
    } finally {
      if (showLoading) {
        this.setLimitsLoading(false);
      }
      this.limitsInFlight = false;
    }
  }

  renderLimits() {
    if (!this.limitsList) return;
    const { active, query } = this.getLimitsFilters();
    const visible = this.limitsModels
      .filter((model) => {
      if (query && !model.name.toLowerCase().includes(query)) {
        return false;
      }
      if (active.size === 0) return true;
      return active.has(this.getModelCategory(model.name));
      })
      .sort((a, b) => {
        // Sort by account first, then by model name
        const accountA = a.accountEmail || "";
        const accountB = b.accountEmail || "";
        const accountCompare = accountA.localeCompare(accountB, undefined, {
          sensitivity: "base",
        });
        if (accountCompare !== 0) return accountCompare;
        return a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

    const shouldAnimate = !this.limitsHasRendered;
    this.limitsList.innerHTML = "";
    this.limitsCharts.forEach((chart) => chart.destroy());
    this.limitsCharts.clear();

    this.setLimitsLoading(false);

    if (!visible.length) {
      if (!this.limitsIsLoading) {
        const message = this.limitsModels.length
          ? "No models match the current filters."
          : "No model usage data available.";
        this.updateLimitsEmptyState(message, true);
      }
      return;
    }

    this.updateLimitsEmptyState("", false);
    const theme = this.getLogChartTheme();
    const chartTasks = [];

    visible.forEach((model, index) => {
      const card = document.createElement("article");
      card.className = "limits-card-item";
      if (shouldAnimate) {
        card.classList.add("fade-in");
        card.style.setProperty("--fade-delay", `${index * 70}ms`);
      }

      const chartWrap = document.createElement("div");
      chartWrap.className = "limits-chart";

      const canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;
      chartWrap.appendChild(canvas);

      const available = model.availablePercent;
      const availableColor = this.getAvailabilityColor(available, theme);

      const percentLabel = document.createElement("span");
      percentLabel.className = "limits-percent";
      percentLabel.textContent =
        available !== null ? `${available}%` : "—";
      percentLabel.style.color = availableColor;
      chartWrap.appendChild(percentLabel);

      const info = document.createElement("div");
      info.className = "limits-info";

      const title = document.createElement("h4");
      title.className = "limits-title";
      title.textContent = model.name;
      info.appendChild(title);

      // Add account badge for multi-account "All accounts" view
      if (model.accountEmail && this.limitsActiveAccountIndex === -1 && this.limitsAccounts.length > 1) {
        const accountBadge = document.createElement("div");
        accountBadge.className = "limits-account-badge";
        accountBadge.textContent = model.accountEmail;
        accountBadge.setAttribute("title", model.accountEmail);
        info.appendChild(accountBadge);
      }

      const meta = document.createElement("div");
      meta.className = "limits-meta";
      const lastUsed = formatDate(model.lastUsed);
      const resetAt = formatDate(model.resetAt);

      const lastRow = document.createElement("div");
      lastRow.className = "limits-meta-row";
      const lastLabel = document.createElement("span");
      lastLabel.innerHTML = ICONS.calendarClock;
      lastLabel.setAttribute("title", "Last used");
      const lastValue = document.createElement("span");
      lastValue.textContent = lastUsed || "—";
      lastRow.append(lastLabel, lastValue);

      const resetRow = document.createElement("div");
      resetRow.className = "limits-meta-row";
      const resetLabel = document.createElement("span");
      resetLabel.innerHTML = ICONS.refreshCw;
      resetLabel.setAttribute("title", "Quota reset");
      const resetValue = document.createElement("span");
      resetValue.textContent = resetAt || "—";
      resetRow.append(resetLabel, resetValue);

      meta.append(lastRow, resetRow);
      info.appendChild(meta);

      card.append(chartWrap, info);
      this.limitsList.appendChild(card);

      chartTasks.push({ canvas, model, theme, available, availableColor });
    });

    this.ensureChartJs().then((loaded) => {
      if (!loaded) return;
      chartTasks.forEach(({ canvas, model, theme: chartTheme, available, availableColor }) => {
        const availableValue = Number.isFinite(available) ? available : 0;
        const usedValue = Number.isFinite(available)
          ? Math.max(100 - available, 0)
          : 100;
        const chart = new Chart(canvas.getContext("2d"), {
          type: "doughnut",
          data: {
            labels: ["Available", "Used"],
            datasets: [
              {
                data: [availableValue, usedValue],
                backgroundColor: [availableColor, chartTheme.border],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: false,
            cutout: "72%",
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
          },
        });
        this.limitsCharts.set(model.name, chart);
      });
    });
    if (shouldAnimate) {
      this.limitsHasRendered = true;
    }
  }

  buildExportPayload() {
    return {
      projects: this.service.exportProjects(),
      theme: this.themeService.getCurrentTheme(),
      uiState: this.getUiState(),
    };
  }

  normalizeImportPayload(payload) {
    if (Array.isArray(payload)) {
      return { projects: payload };
    }
    if (!payload || typeof payload !== "object") {
      throw new Error("Import data must be an array of projects.");
    }
    if (Array.isArray(payload.projects)) {
      return {
        projects: payload.projects,
        theme: payload.theme,
        uiState: payload.uiState,
      };
    }
    throw new Error("Import data must be an array of projects.");
  }

  applyImportedTheme(theme) {
    if (theme !== "dark" && theme !== "light" && theme !== "system") return;
    this.applyThemePreference(theme);
  }

  applyImportedUiState(uiState) {
    if (!uiState || typeof uiState !== "object") return false;
    const nextProjectFilterQuery =
      typeof uiState.projectFilterQuery === "string"
        ? this.resolveProjectFilterQuery(uiState.projectFilterQuery)
        : this.projectFilterQuery;
    const nextProjectCategoryFilter = Array.isArray(uiState.projectCategoryFilter)
      ? this.normalizeProjectCategoryFilter(uiState.projectCategoryFilter)
      : this.projectCategoryFilter;
    const nextIdeaFilter =
      typeof uiState.ideaFilter === "string"
        ? this.resolveIdeaFilter(uiState.ideaFilter)
        : this.ideaFilter;
    if (typeof uiState.serviceMonitorUrl === "string") {
      this.setServiceMonitorUrl(uiState.serviceMonitorUrl, { skipPersist: true });
    }
    if (typeof uiState.modelUsageUrl === "string") {
      this.setModelUsageUrl(uiState.modelUsageUrl, { skipPersist: true });
    }
    if (
      typeof uiState.serviceMonitorIntervalMs === "number" &&
      uiState.serviceMonitorIntervalMs >= 1000
    ) {
      this.serviceMonitorIntervalMs = uiState.serviceMonitorIntervalMs;
    }
    if (typeof uiState.updateCheckIntervalMs === "number") {
      this.setUpdateCheckInterval(uiState.updateCheckIntervalMs / 1000, {
        skipPersist: true,
      });
    }
    if (typeof uiState.serviceMonitorEnabled === "boolean") {
      this.setServiceMonitorEnabled(uiState.serviceMonitorEnabled, {
        skipPersist: true,
      });
    }
    if (typeof uiState.copyWithUltrathink === "boolean") {
      this.setCopyWithUltrathink(uiState.copyWithUltrathink, {
        skipPersist: true,
      });
    }
    this.isLogVisible =
      typeof uiState.isLogVisible === "boolean"
        ? uiState.isLogVisible
        : this.isLogVisible;
    this.projectFilterQuery = nextProjectFilterQuery;
    this.projectCategoryFilter = nextProjectCategoryFilter;
    this.ideaFilter = nextIdeaFilter;
    this.activeProjectId = this.resolveActiveProjectId(uiState.activeProjectId);
    this.persistUiState();
    this.applyLogVisibility();
    return true;
  }

  setActiveProjectId(projectId) {
    this.activeProjectId = projectId;
    this.persistUiState();
  }

  setProjectFilterQuery(query, { skipPersist = false } = {}) {
    const next = this.resolveProjectFilterQuery(query);
    if (next === this.projectFilterQuery) return;
    this.projectFilterQuery = next;
    if (!skipPersist) {
      this.persistUiState();
    }
  }

  setProjectCategoryFilterAll({ skipPersist = false } = {}) {
    this.projectCategoryFilter = new Set(PROJECT_CATEGORY_FILTER_OPTIONS);
    if (!skipPersist) {
      this.persistUiState();
    }
  }

  toggleProjectCategoryFilter(category, { skipPersist = false } = {}) {
    if (!PROJECT_CATEGORY_FILTER_OPTIONS.includes(category)) return;
    const next = new Set(this.projectCategoryFilter);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    this.projectCategoryFilter = next;
    if (!skipPersist) {
      this.persistUiState();
    }
  }

  shouldAutoScrollToIdeasPanel() {
    return true;
  }

  isDesktopViewport() {
    return typeof window !== "undefined" && window.innerWidth > 1100;
  }

  scrollToIdeasPanelTop({ force = false, behavior = "smooth" } = {}) {
    if (!this.ideasPanel) return;
    if (!force && !this.shouldAutoScrollToIdeasPanel()) return;

    if (this.isDesktopViewport()) {
      const deltaTop = Math.abs(window.scrollY);
      if (!force && deltaTop < 6) return;
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const rect = this.ideasPanel.getBoundingClientRect();
    const panelTop = window.scrollY + rect.top;
    const topbarHeight = this.topbar
      ? Math.round(this.topbar.getBoundingClientRect().height)
      : 0;
    const stickyOffset = Math.max(0, topbarHeight) + 10;
    const targetWithStickyOffset = panelTop - stickyOffset;
    const wouldStickAtTarget =
      typeof this.topbarStickyThreshold === "number" &&
      targetWithStickyOffset >= this.topbarStickyThreshold;
    const offset = wouldStickAtTarget ? stickyOffset : 10;
    const targetTop = Math.max(0, panelTop - offset);
    const delta = Math.abs(targetTop - window.scrollY);
    if (!force && delta < 6) return;

    window.scrollTo({ top: targetTop, behavior });
  }

  setLogVisibility(isVisible) {
    this.isLogVisible = isVisible;
    this.persistUiState();
  }

  setIdeaFilter(filter) {
    this.ideaFilter = this.resolveIdeaFilter(filter);
    this.persistUiState();
  }

  openLogDialog() {
    this.updateLogDialogProjectFilter();
    this.applyLogDialogFilters();
    if (typeof this.logDialog.showModal === "function") {
      this.logDialog.showModal();
    } else {
      this.logDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
    requestAnimationFrame(() => {
      this.ensureChartJs().then((loaded) => {
        if (!loaded) return;
        this.resizeLogChart();
        this.renderLogDialogChart();
      });
    });
  }

  closeLogDialog() {
    if (this.logDialog.open) {
      this.logDialog.close();
    } else {
      this.logDialog.removeAttribute("open");
    }
    this.syncNotifyLayer();
  }

  updateLogDialogProjectFilter() {
    const projects = this.service.getProjects();
    const previous = this.logDialogProjectFilter.value || "all";
    this.logDialogProjectFilter.innerHTML = `<option value="all">All projects</option>`;
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      this.logDialogProjectFilter.appendChild(option);
    });
    const hasPrevious =
      previous !== "all" &&
      projects.some((project) => project.id === previous);
    this.logDialogProjectFilter.value = hasPrevious ? previous : "all";
  }

  parseDateInput(value, endOfDay = false) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(
      year,
      month - 1,
      day,
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0
    );
  }

  applyLogDialogFilters() {
    const entries = this.service.getFinishedLog();
    const query = this.logDialogSearch.value.trim().toLowerCase();
    const projectFilter = this.logDialogProjectFilter.value;
    let start = this.parseDateInput(this.logDialogStart.value);
    let end = this.parseDateInput(this.logDialogEnd.value, true);
    if (start && end && start > end) {
      [start, end] = [end, start];
    }

    this.logDialogEntries = entries.filter(({ projectId, projectName, idea }) => {
      if (projectFilter !== "all" && projectId !== projectFilter) {
        return false;
      }
      if (query) {
        const haystack = `${projectName} ${idea.text}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      const finishedAt = new Date(idea.finishedAt);
      if (Number.isNaN(finishedAt.getTime())) return false;
      if (start && finishedAt < start) return false;
      if (end && finishedAt > end) return false;
      return true;
    });
    this.logDialogRangeStart = start;
    this.logDialogRangeEnd = end;

    this.logDialogRenderedCount = 0;
    this.logDialogList.innerHTML = "";
    this.logDialogScroll.scrollTop = 0;
    this.renderMoreLogDialogItems();
    this.updateLogDialogEmptyState();
    this.renderLogDialogChart();
  }

  updateLogDialogEmptyState() {
    const isEmpty = this.logDialogEntries.length === 0;
    this.logDialogEmpty.style.display = isEmpty ? "block" : "none";
  }

  renderMoreLogDialogItems() {
    const nextEntries = this.logDialogEntries.slice(
      this.logDialogRenderedCount,
      this.logDialogRenderedCount + this.logDialogBatchSize
    );
    if (nextEntries.length === 0) return;
    nextEntries.forEach(({ projectId, projectName, idea }) => {
      const item = document.createElement("li");
      item.className = "log-item";
      item.dataset.projectId = projectId;
      item.dataset.ideaId = idea.id;
      item.innerHTML = `
        <span>${escapeHtml(idea.text)}</span>
        <small>${ICONS.checkCircleMini}${formatDate(idea.finishedAt)}</small>
        <small>${escapeHtml(projectName)}</small>
        <button class="icon-button log-reopen" type="button" data-action="reopen" aria-label="Reopen idea" title="Reopen idea">
          ${ICONS.reopen}
          <span class="sr-only">Reopen</span>
        </button>
      `;
      this.logDialogList.appendChild(item);
    });
    this.logDialogRenderedCount += nextEntries.length;
  }

  handleLogDialogScroll() {
    if (this.logDialogRenderedCount >= this.logDialogEntries.length) return;
    const { scrollTop, clientHeight, scrollHeight } = this.logDialogScroll;
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      this.renderMoreLogDialogItems();
    }
  }

  getWeekNumber(date) {
    const target = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
    return { year: target.getUTCFullYear(), week };
  }

  getBucketStart(date, unit) {
    const start = new Date(date);
    if (unit === "day") {
      start.setHours(0, 0, 0, 0);
      return start;
    }
    if (unit === "week") {
      const day = start.getDay();
      const diff = (day + 6) % 7;
      start.setDate(start.getDate() - diff);
      start.setHours(0, 0, 0, 0);
      return start;
    }
    if (unit === "month") {
      return new Date(start.getFullYear(), start.getMonth(), 1);
    }
    return new Date(start.getFullYear(), 0, 1);
  }

  formatBucketLabel(date, unit) {
    const pad2 = (value) => String(value).padStart(2, "0");
    if (unit === "day") {
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
        date.getDate()
      )}`;
    }
    if (unit === "week") {
      const { year, week } = this.getWeekNumber(date);
      return `${year} W${pad2(week)}`;
    }
    if (unit === "month") {
      return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
    }
    return `${date.getFullYear()}`;
  }

  buildLogDialogBuckets(entries, unit) {
    const buckets = new Map();
    entries.forEach(({ idea }) => {
      const finishedAt = new Date(idea.finishedAt);
      if (Number.isNaN(finishedAt.getTime())) return;
      const start = this.getBucketStart(finishedAt, unit);
      const key = start.getTime();
      const existing = buckets.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        buckets.set(key, {
          label: this.formatBucketLabel(start, unit),
          count: 1,
        });
      }
    });
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([, value]) => value);
  }

  getChartEndDate() {
    if (this.logDialogRangeEnd) return this.logDialogRangeEnd;
    if (this.logDialogEntries.length > 0) {
      const latest = this.logDialogEntries.reduce((max, { idea }) => {
        const finishedAt = new Date(idea.finishedAt).getTime();
        if (Number.isNaN(finishedAt)) return max;
        return Math.max(max, finishedAt);
      }, 0);
      if (latest) return new Date(latest);
    }
    return new Date();
  }

  buildLogDialogBucketsWindow(entries, unit, endDate) {
    const counts = new Map();
    entries.forEach(({ idea }) => {
      const finishedAt = new Date(idea.finishedAt);
      if (Number.isNaN(finishedAt.getTime())) return;
      const start = this.getBucketStart(finishedAt, unit);
      const key = start.getTime();
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const windowSizes = {
      day: 7,
      week: 4,
      month: 6,
      year: 3,
    };
    const total = windowSizes[unit] || 6;
    const endStart = this.getBucketStart(endDate, unit);
    const buckets = [];
    for (let index = 0; index < total; index += 1) {
      const offset = total - 1 - index;
      let start;
      if (unit === "day") {
        start = new Date(endStart);
        start.setDate(start.getDate() - offset);
      } else if (unit === "week") {
        start = new Date(endStart);
        start.setDate(start.getDate() - offset * 7);
      } else if (unit === "month") {
        start = new Date(endStart.getFullYear(), endStart.getMonth(), 1);
        start.setMonth(start.getMonth() - offset);
      } else {
        start = new Date(endStart.getFullYear() - offset, 0, 1);
      }
      const key = start.getTime();
      buckets.push({
        label: this.formatBucketLabel(start, unit),
        count: counts.get(key) || 0,
      });
    }
    return buckets;
  }

  ensureChartJs() {
    if (typeof Chart !== "undefined") {
      return Promise.resolve(true);
    }
    if (this.chartJsPromise) {
      return this.chartJsPromise;
    }
    this.chartJsPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = CHART_JS_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        this.chartJsPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });
    return this.chartJsPromise;
  }

  getLogChartTheme() {
    const styles = getComputedStyle(document.documentElement);
    const isDark = document.documentElement.dataset.theme === "dark";
    return {
      isDark,
      accent: styles.getPropertyValue("--accent").trim() || "#1f8a70",
      accentAlt: styles.getPropertyValue("--accent-2").trim() || "#e9b44c",
      muted: styles.getPropertyValue("--muted").trim() || "#5b6473",
      border:
        styles.getPropertyValue("--border").trim() || "rgba(0, 0, 0, 0.08)",
      surface: styles.getPropertyValue("--surface").trim() || "#ffffff",
      ink: styles.getPropertyValue("--ink").trim() || "#0d1b2a",
    };
  }

  parseHexColor(value) {
    if (!value) return null;
    const hex = value.trim().replace("#", "");
    if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return null;
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const int = parseInt(normalized, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }

  interpolateColor(start, end, t) {
    const clamp = Math.max(0, Math.min(1, t));
    const r = Math.round(start.r + (end.r - start.r) * clamp);
    const g = Math.round(start.g + (end.g - start.g) * clamp);
    const b = Math.round(start.b + (end.b - start.b) * clamp);
    return `rgb(${r} ${g} ${b})`;
  }

  getAvailabilityColor(percent, theme) {
    if (!Number.isFinite(percent)) return theme.muted;
    const green = this.parseHexColor(theme.accent) || { r: 31, g: 138, b: 112 };
    const yellow = this.parseHexColor(theme.accentAlt) || {
      r: 233,
      g: 180,
      b: 76,
    };
    const red = { r: 209, g: 73, b: 91 };
    if (percent >= 50) {
      return this.interpolateColor(yellow, green, (percent - 50) / 50);
    }
    if (percent >= 25) {
      return this.interpolateColor(red, yellow, (percent - 25) / 25);
    }
    return this.interpolateColor(red, red, 0);
  }

  rgbToHsl({ r, g, b }) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === rNorm) {
        h = ((gNorm - bNorm) / delta) % 6;
      } else if (max === gNorm) {
        h = (bNorm - rNorm) / delta + 2;
      } else {
        h = (rNorm - gNorm) / delta + 4;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  buildPieColors(count, theme) {
    const base = this.parseHexColor(theme.accent) || {
      r: 31,
      g: 138,
      b: 112,
    };
    const { h, s } = this.rgbToHsl(base);
    const baseLight = theme.isDark ? 62 : 46;
    const saturation = Math.max(50, s);
    const colors = Array.from({ length: count }, (_, index) => {
      const hue = Math.round((h + index * 36) % 360);
      const lightness = Math.min(72, baseLight + (index % 4) * 6);
      return `hsl(${hue} ${saturation}% ${lightness}%)`;
    });
    if (count > 1 && theme.accentAlt) {
      colors[1] = theme.accentAlt;
    }
    return colors;
  }

  buildLogDialogPieData(entries) {
    const counts = new Map();
    entries.forEach(({ projectName }) => {
      if (!projectName) return;
      counts.set(projectName, (counts.get(projectName) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }

  updateLogChartNote(totalCount) {
    if (!this.logChartNote) return;
    if (totalCount === 0) {
      this.logChartNote.textContent = "No data yet.";
      return;
    }
    this.logChartNote.textContent = this.logChartNoteBase;
  }

  buildLogChartConfig(labels, data, theme) {
    return {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: theme.accent,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 320,
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme.muted,
              font: {
                size: 10,
              },
              maxTicksLimit: 6,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: theme.border,
            },
            ticks: {
              color: theme.muted,
              font: {
                size: 10,
              },
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: theme.surface,
            titleColor: theme.ink,
            bodyColor: theme.ink,
            borderColor: theme.border,
            borderWidth: 1,
            displayColors: false,
          },
        },
      },
    };
  }

  buildLogPieChartConfig(labels, data, theme, colors) {
    return {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderColor: theme.surface,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 320,
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.muted,
              font: {
                size: 11,
              },
              usePointStyle: true,
              boxWidth: 8,
            },
          },
          tooltip: {
            backgroundColor: theme.surface,
            titleColor: theme.ink,
            bodyColor: theme.ink,
            borderColor: theme.border,
            borderWidth: 1,
            displayColors: false,
          },
        },
      },
    };
  }

  ensureLogChartInstance(labels, data, theme) {
    if (!this.logChart || typeof Chart === "undefined") return null;
    if (!this.logChartInstance) {
      this.logChartInstance = new Chart(
        this.logChart,
        this.buildLogChartConfig(labels, data, theme)
      );
    }
    return this.logChartInstance;
  }

  ensureLogPieChartInstance(labels, data, theme, colors) {
    if (!this.logPieChart || typeof Chart === "undefined") return null;
    if (!this.logPieChartInstance) {
      this.logPieChartInstance = new Chart(
        this.logPieChart,
        this.buildLogPieChartConfig(labels, data, theme, colors)
      );
    }
    return this.logPieChartInstance;
  }

  resizeLogChart() {
    if (this.logChartInstance) {
      this.logChartInstance.resize();
    }
    if (this.logPieChartInstance) {
      this.logPieChartInstance.resize();
    }
  }

  renderLogDialogChart() {
    if (!this.logChart) return;
    if (typeof Chart === "undefined") {
      this.ensureChartJs().then((loaded) => {
        if (loaded) {
          this.renderLogDialogChart();
        }
      });
      return;
    }
    const unit = this.logChartUnit?.value || this.logDialogChartUnit;
    const endDate = this.getChartEndDate();
    const buckets = this.buildLogDialogBucketsWindow(
      this.logDialogEntries,
      unit,
      endDate
    );
    const labels = buckets.map((item) => item.label);
    const data = buckets.map((item) => item.count);
    const totalCount = data.reduce((sum, value) => sum + value, 0);
    const theme = this.getLogChartTheme();
    const chart = this.ensureLogChartInstance(labels, data, theme);
    if (!chart) return;

    this.updateLogChartNote(totalCount);
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.data.datasets[0].backgroundColor = theme.accent;
    chart.options.scales.x.ticks.color = theme.muted;
    chart.options.scales.y.ticks.color = theme.muted;
    chart.options.scales.y.grid.color = theme.border;
    chart.options.plugins.tooltip.backgroundColor = theme.surface;
    chart.options.plugins.tooltip.titleColor = theme.ink;
    chart.options.plugins.tooltip.bodyColor = theme.ink;
    chart.options.plugins.tooltip.borderColor = theme.border;
    chart.update();

    const pieSeries = this.buildLogDialogPieData(this.logDialogEntries);
    const pieLabels = pieSeries.map((item) => item.label);
    const pieValues = pieSeries.map((item) => item.count);
    const pieColors = this.buildPieColors(pieLabels.length, theme);
    const pieChart = this.ensureLogPieChartInstance(
      pieLabels,
      pieValues,
      theme,
      pieColors
    );
    if (!pieChart) return;
    pieChart.data.labels = pieLabels;
    pieChart.data.datasets[0].data = pieValues;
    pieChart.data.datasets[0].backgroundColor = pieColors;
    pieChart.data.datasets[0].borderColor = theme.surface;
    pieChart.options.plugins.legend.display = pieLabels.length > 0;
    pieChart.options.plugins.legend.labels.color = theme.muted;
    pieChart.options.plugins.tooltip.backgroundColor = theme.surface;
    pieChart.options.plugins.tooltip.titleColor = theme.ink;
    pieChart.options.plugins.tooltip.bodyColor = theme.ink;
    pieChart.options.plugins.tooltip.borderColor = theme.border;
    pieChart.update();
  }

  initUpdateMonitor() {
    this.startUpdateMonitor();
  }

  startUpdateMonitor() {
    if (this.updateTimer) {
      window.clearInterval(this.updateTimer);
    }
    this.checkForUpdate();
    this.updateTimer = window.setInterval(
      () => this.checkForUpdate(),
      this.updateCheckIntervalMs
    );
  }

  setUpdateCheckInterval(seconds, { skipPersist = false } = {}) {
    const sec = Number(seconds);
    if (!Number.isFinite(sec)) return;
    const ms = this.normalizeUpdateCheckIntervalMs(sec * 1000);
    if (ms === this.updateCheckIntervalMs) {
      if (this.settingsUpdateIntervalInput) {
        this.settingsUpdateIntervalInput.value = Math.round(ms / 1000);
      }
      return;
    }
    this.updateCheckIntervalMs = ms;
    if (this.settingsUpdateIntervalInput) {
      this.settingsUpdateIntervalInput.value = Math.round(ms / 1000);
    }
    if (!skipPersist) {
      this.persistUiState();
    }
    this.startUpdateMonitor();
  }

  setUpdateCheckLoading(isLoading) {
    this.updateCheckInFlight = Boolean(isLoading);
    if (!this.settingsUpdateNowButton) return;
    this.settingsUpdateNowButton.disabled = isLoading;
    this.settingsUpdateNowButton.innerHTML = isLoading
      ? '<span class="button-loading-indicator"><span></span><span></span><span></span></span>Checking...'
      : "Check now";
  }

  queueUpdatePrompt(version) {
    if (!version) return;
    this.updatePrompted = true;
    this.pendingUpdateVersion = String(version);
    this.flushPendingUpdate();
  }

  flushPendingUpdate() {
    if (!this.pendingUpdateVersion) return;
    const activeDialog = this.getActiveDialog();
    if (activeDialog && activeDialog !== this.updateDialog) return;
    const version = this.pendingUpdateVersion;
    this.pendingUpdateVersion = null;
    if (!this.openUpdateDialog(version)) {
      this.pendingUpdateVersion = version;
    }
  }

  async checkForUpdate({ force = false, showUpToDate = false } = {}) {
    if (this.updateCheckInFlight) return;
    if (this.updatePrompted && !force) return;
    this.setUpdateCheckLoading(true);
    try {
      const response = await fetch(`version.json?v=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        if (showUpToDate) {
          this.pushNotification({
            title: "Update check failed",
            message: "Unable to reach the update endpoint.",
            tone: "warning",
          });
        }
        return;
      }
      const data = await response.json();
      if (data && data.version && data.version !== APP_VERSION) {
        this.queueUpdatePrompt(data.version);
        return;
      }
      if (showUpToDate) {
        this.pushNotification({
          title: "Up to date",
          message: "You're on the latest version.",
          tone: "neutral",
        });
      }
    } catch (error) {
      if (showUpToDate) {
        this.pushNotification({
          title: "Update check failed",
          message: "Unable to reach the update endpoint.",
          tone: "warning",
        });
      }
    } finally {
      this.setUpdateCheckLoading(false);
    }
  }

  initDataSource() {
    this.updateDataSourceUI();
    if (this.dataSource === "localDevice") {
      this.fileSystemRepo.init().then((hasAccess) => {
        if (hasAccess) {
          this.fileSystemRepo.load().then((data) => {
            const projects = Array.isArray(data?.projects) ? data.projects : [];
            if (projects.length > 0) {
              this.applyProjects(projects.map((p) => new Project(p)));
              this.setSeedState(
                "localDevice",
                this.getFileSeedState(data)
              );
              this.render();
              return;
            }
            const seedProjects = this.buildSeedProjects();
            this.applyProjects(seedProjects);
            this.setSeedState("localDevice", true);
            this.persistToFile();
            this.render();
          });
        } else {
          this.dataSource = "localStorage";
          this.persistUiState();
          this.updateDataSourceUI();
          this.pushNotification({
            title: "File access lost",
            message: "Switched back to browser storage.",
            tone: "warning",
          });
        }
      });
    }
  }

  updateDataSourceUI() {
    if (this.dataSourceSelector) {
      const buttons = this.dataSourceSelector.querySelectorAll("button");
      buttons.forEach((btn) => {
        const source = btn.dataset.source;
        btn.classList.toggle("is-active", source === this.dataSource);
      });
      const localDeviceBtn = this.dataSourceSelector.querySelector(
        '[data-source="localDevice"]'
      );
      if (localDeviceBtn && !this.supportsLocalFileAccess()) {
        localDeviceBtn.disabled = true;
        localDeviceBtn.title = "Not supported in this browser";
      }
      const dbIcon = this.dataSourceSelector.querySelector('[data-icon="database"]');
      const folderIcon = this.dataSourceSelector.querySelector('[data-icon="folder"]');
      if (dbIcon) dbIcon.innerHTML = ICONS.database;
      if (folderIcon) folderIcon.innerHTML = ICONS.folderOpen;
    }
    if (this.dataSourceStatus) {
      const isFile = this.dataSource === "localDevice";
      this.dataSourceStatus.classList.toggle("is-file", isFile);
      const statusText = this.dataSourceStatus.querySelector(".status-text");
      if (statusText) {
        if (isFile && this.fileSystemRepo.getFileName()) {
          statusText.textContent = `Using file: ${this.fileSystemRepo.getFileName()}`;
        } else if (isFile) {
          statusText.textContent = "Using local file";
        } else {
          statusText.textContent = "Using browser localStorage";
        }
      }
    }
  }

  async switchDataSource(newSource) {
    if (newSource === this.dataSource) return;
    if (!this.supportsLocalFileAccess() && newSource === "localDevice") {
      this.pushNotification({
        title: "Not supported",
        message: "Your browser doesn't support local file access.",
        tone: "warning",
      });
      return;
    }

    if (newSource === "localDevice") {
      try {
        const currentSource = this.dataSource;
        const currentProjects = this.service.getProjects();
        const shouldPrompt = this.shouldPromptToMigrate(
          currentSource,
          currentProjects
        );
        const currentIsSeed = this.isSeedDataSource(currentSource);
        const hasHandle = await this.fileSystemRepo.init();
        if (!hasHandle) {
          await this.fileSystemRepo.selectStorageLocation();
        }

        const fileData = await this.fileSystemRepo.load();
        const fileProjects = Array.isArray(fileData?.projects)
          ? fileData.projects
          : [];
        const fileHasData = fileProjects.length > 0;
        const currentHasData = currentProjects.length > 0;

        if (fileHasData && currentHasData) {
          if (currentIsSeed) {
            this.applyProjects(fileProjects.map((p) => new Project(p)));
            this.setSeedState(
              "localDevice",
              this.getFileSeedState(fileData),
              { skipPersist: true }
            );
          } else {
            const strategy = await this.showDataSourceDialog();
            if (strategy === "cancel") {
              this.updateDataSourceUI();
              return;
            }
            if (strategy === "overwrite") {
              this.applyProjects(fileProjects.map((p) => new Project(p)));
              this.setSeedState(
                "localDevice",
                this.getFileSeedState(fileData),
                { skipPersist: true }
              );
            } else {
              const merged = this.mergeProjects(
                currentProjects,
                fileProjects.map((p) => new Project(p))
              );
              this.applyProjects(merged);
              this.setSeedState("localDevice", false, { skipPersist: true });
            }
          }
        } else if (fileHasData) {
          this.applyProjects(fileProjects.map((p) => new Project(p)));
          this.setSeedState(
            "localDevice",
            this.getFileSeedState(fileData),
            { skipPersist: true }
          );
        } else {
          if (shouldPrompt) {
            const shouldMove = await this.confirmAction({
              title: "Move data to local file?",
              message:
                "Your current workspace has custom data. Move it to the local file, or start the file with sample data.",
              confirmText: "Move data",
            });
            if (shouldMove) {
              this.setSeedState("localDevice", false, { skipPersist: true });
            } else {
              const seedProjects = this.buildSeedProjects();
              this.applyProjects(seedProjects);
              this.setSeedState("localDevice", true, { skipPersist: true });
            }
          } else {
            const seedProjects = this.buildSeedProjects();
            this.applyProjects(seedProjects);
            this.setSeedState("localDevice", true, { skipPersist: true });
          }
        }

        this.dataSource = "localDevice";
        await this.persistToFile();
        this.persistUiState();
        this.updateDataSourceUI();
        this.render();
        this.pushNotification({
          title: "Data source changed",
          message: `Now using: ${this.fileSystemRepo.getFileName()}`,
          tone: "success",
        });
      } catch (e) {
        if (e.name !== "AbortError") {
          this.pushNotification({
            title: "Error",
            message: e.message,
            tone: "warning",
          });
        }
        this.updateDataSourceUI();
      }
    } else {
      const currentSource = this.dataSource;
      const currentProjects = this.service.getProjects();
      const shouldPrompt = this.shouldPromptToMigrate(
        currentSource,
        currentProjects
      );
      if (shouldPrompt) {
        const shouldMove = await this.confirmAction({
          title: "Move data to browser storage?",
          message:
            "Move the local file data into browser storage? Cancel to stay on the local file.",
          confirmText: "Move data",
        });
        if (!shouldMove) {
          this.updateDataSourceUI();
          return;
        }
        this.setSeedState("localStorage", false, { skipPersist: true });
        this.service.persist();
      } else {
        this.setSeedState("localStorage", this.isSeedDataSource(currentSource), {
          skipPersist: true,
        });
        this.service.persist();
      }
      this.dataSource = "localStorage";
      this.persistUiState();
      this.updateDataSourceUI();
      this.render();
      this.pushNotification({
        title: "Data source changed",
        message: "Now using browser localStorage.",
        tone: "success",
      });
    }
  }

  showDataSourceDialog() {
    return new Promise((resolve) => {
      if (!this.dataSourceDialog) {
        resolve("overwrite");
        return;
      }
      this.dataSourcePendingStrategy = resolve;
      this.dataSourceDialog.showModal();
    });
  }

  async applyMergeStrategy(fileData, strategy) {
    if (strategy === "overwrite") {
      this.service.projects = fileData.projects.map((p) => new Project(p));
    } else if (strategy === "merge") {
      this.service.projects = this.mergeProjects(
        this.service.projects,
        fileData.projects.map((p) => new Project(p))
      );
    }
    this.service.normalizePinnedOrder();
  }

  mergeProjects(currentProjects, newProjects) {
    const merged = [...currentProjects];
    const projectMap = new Map(merged.map((p) => [p.id, p]));

    for (const newProject of newProjects) {
      const existing = projectMap.get(newProject.id);
      if (!existing) {
        merged.push(newProject);
        projectMap.set(newProject.id, newProject);
      } else {
        existing.pinned = Boolean(existing.pinned || newProject.pinned);
        const ideaMap = new Map(existing.ideas.map((i) => [i.id, i]));
        for (const newIdea of newProject.ideas) {
          if (!ideaMap.has(newIdea.id)) {
            existing.ideas.push(newIdea);
          } else {
            const existingIdea = ideaMap.get(newIdea.id);
            const existingTime = Math.max(
              existingIdea.createdAt || 0,
              existingIdea.finishedAt || 0
            );
            const newTime = Math.max(
              newIdea.createdAt || 0,
              newIdea.finishedAt || 0
            );
            if (newTime > existingTime) {
              Object.assign(existingIdea, newIdea);
            }
          }
        }
      }
    }
    return merged;
  }

  async persistToFile() {
    if (this.dataSource !== "localDevice" || !this.fileSystemRepo.fileHandle) {
      return;
    }
    try {
      const payload = this.buildFilePayload(this.service.projects, {
        seed: this.isSeedDataSource("localDevice"),
      });
      await this.fileSystemRepo.save(payload);
    } catch (error) {
      console.warn("Failed to persist to file", error);
      this.pushNotification({
        title: "Save failed",
        message: "Could not write to file. Data saved to browser storage.",
        tone: "warning",
      });
      this.dataSource = "localStorage";
      this.service.persist();
      this.persistUiState();
      this.updateDataSourceUI();
    }
  }

  resetAllData() {
    this.service.projects = this.buildSeedProjects();
    this.service.normalizePinnedOrder();
    this.service.persist();
    this.setSeedState(this.dataSource, true, { skipPersist: true });
    if (this.dataSource === "localDevice") {
      this.persistToFile();
    }
    this.activeProjectId = this.service.projects[0]?.id || null;
    this.persistUiState();
    this.closeSettingsDialog();
    this.render();
    this.pushNotification({
      title: "Data reset",
      message: "Workspace has been reset with sample data.",
      tone: "neutral",
    });
  }

  initServiceMonitor() {
    if (!this.serviceMonitorButton) return;
    this.serviceMonitorButton.addEventListener("click", () => {
      if (!this.serviceMonitorEnabled) return;
      this.openLimitsDialog();
    });
    this.setServiceMonitorEnabled(this.serviceMonitorEnabled, {
      skipPersist: true,
    });
  }

  updateServiceMonitor(state) {
    if (!this.serviceMonitorButton) return;
    this.serviceMonitorStatus = state;
    this.serviceMonitorButton.classList.toggle("is-alive", state === "alive");
    this.serviceMonitorButton.classList.toggle(
      "is-checking",
      state === "checking"
    );
    this.serviceMonitorButton.classList.toggle(
      "is-offline",
      state === "offline"
    );
    if (state === "alive") {
      this.serviceMonitorButton.title = "Service status: Alive";
      return;
    }
    if (state === "offline") {
      this.serviceMonitorButton.title = "Service status: Offline";
      return;
    }
    this.serviceMonitorButton.title = "Service status: Checking";
  }

  async checkServiceAlive(showChecking = false) {
    if (!this.serviceMonitorButton || !this.serviceMonitorEnabled) {
      return false;
    }
    if (this.serviceMonitorInFlight) {
      return this.serviceMonitorStatus === "alive";
    }
    this.serviceMonitorInFlight = true;
    if (showChecking) {
      this.updateServiceMonitor("checking");
    }
    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      this.serviceMonitorTimeoutMs
    );
    let alive = false;
    try {
      const response = await fetch(this.serviceMonitorUrl, {
        method: "GET",
        mode: "no-cors",
        signal: controller.signal,
      });
      alive = Boolean(response);
      this.updateServiceMonitor(alive ? "alive" : "offline");
    } catch (error) {
      this.updateServiceMonitor("offline");
    } finally {
      window.clearTimeout(timeoutId);
      this.serviceMonitorInFlight = false;
    }
    return alive;
  }

  setDragOverTarget(type, element) {
    const key = type === "project" ? "dragOverProject" : "dragOverIdea";
    const current = this[key];
    if (current && current !== element) {
      current.classList.remove("drag-over");
    }
    if (!element) {
      if (current) current.classList.remove("drag-over");
      this[key] = null;
      return;
    }
    if (current !== element) {
      element.classList.add("drag-over");
      this[key] = element;
    }
  }

  initStickyTopbar() {
    if (!this.topbar || !this.topbarSpacer) return;
    let ticking = false;

    const measure = () => {
      const wasSticky = this.isTopbarSticky;
      if (wasSticky) {
        this.topbar.classList.remove("is-sticky");
        this.topbarSpacer.style.height = "0px";
      }
      const rect = this.topbar.getBoundingClientRect();
      this.topbarStickyThreshold = rect.bottom + window.scrollY;
      if (wasSticky) {
        this.topbar.classList.add("is-sticky");
        const height = Math.round(this.topbar.getBoundingClientRect().height);
        this.topbarSpacer.style.height = `${height}px`;
      }
    };

    const update = () => {
      const shouldStick = window.scrollY >= this.topbarStickyThreshold;
      if (shouldStick === this.isTopbarSticky) return;
      this.isTopbarSticky = shouldStick;
      this.topbar.classList.toggle("is-sticky", shouldStick);
      const height = shouldStick
        ? Math.round(this.topbar.getBoundingClientRect().height)
        : 0;
      this.topbarSpacer.style.height = shouldStick ? `${height}px` : "0px";
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      measure();
      update();
    });
  }

  initSettingsCodeHighlight() {
    if (!this.settingsCode) return;
    if (this.settingsCode.dataset.highlighted === "true") return;
    const raw = this.settingsCode.textContent;
    if (!raw) return;
    const pattern =
      /("(?:\\.|[^"\\])*")(?=\s*:)|("(?:\\.|[^"\\])*")|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
    let lastIndex = 0;
    let html = "";
    let match;
    while ((match = pattern.exec(raw)) !== null) {
      html += escapeHtml(raw.slice(lastIndex, match.index));
      if (match[1]) {
        html += `<span class="json-key">${escapeHtml(match[1])}</span>`;
      } else if (match[2]) {
        html += `<span class="json-string">${escapeHtml(match[2])}</span>`;
      } else if (match[3]) {
        html += `<span class="json-literal">${escapeHtml(match[3])}</span>`;
      } else {
        html += `<span class="json-number">${escapeHtml(match[0])}</span>`;
      }
      lastIndex = pattern.lastIndex;
    }
    html += escapeHtml(raw.slice(lastIndex));
    this.settingsCode.innerHTML = html;
    this.settingsCode.dataset.highlighted = "true";
  }

  syncFooterFeatures() {
    if (!this.footerFeatures) return;
    const track = this.footerFeatures.querySelector(".footer-features-track");
    const baseGroup = track?.querySelector(".footer-features-group");
    if (!track || !baseGroup) return;
    const groups = Array.from(track.querySelectorAll(".footer-features-group"));
    groups.slice(1).forEach((group) => group.remove());
    const groupWidth = baseGroup.getBoundingClientRect().width;
    if (!groupWidth) return;
    const containerWidth = this.footerFeatures.clientWidth;
    const minGroups = Math.max(
      2,
      Math.ceil((containerWidth + groupWidth) / groupWidth)
    );
    for (let i = 1; i < minGroups; i += 1) {
      const clone = baseGroup.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    }
    track.style.setProperty("--marquee-distance", `${groupWidth}px`);
  }

  initFooterFeatures() {
    if (!this.footerFeatures) return;
    this.syncFooterFeatures();
    let isDragging = false;
    let startX = 0;
    let startScroll = 0;

    const handlePointerDown = (event) => {
      if (event.button !== 0) return;
      isDragging = true;
      startX = event.clientX;
      startScroll = this.footerFeatures.scrollLeft;
      this.footerFeatures.classList.add("is-dragging");
      this.footerFeatures.setPointerCapture?.(event.pointerId);
    };

    const handlePointerMove = (event) => {
      if (!isDragging) return;
      const delta = event.clientX - startX;
      this.footerFeatures.scrollLeft = startScroll - delta;
    };

    const stopDragging = (event) => {
      if (!isDragging) return;
      isDragging = false;
      this.footerFeatures.classList.remove("is-dragging");
      this.footerFeatures.releasePointerCapture?.(event.pointerId);
    };

    this.footerFeatures.addEventListener("pointerdown", handlePointerDown);
    this.footerFeatures.addEventListener("pointermove", handlePointerMove);
    this.footerFeatures.addEventListener("pointerup", stopDragging);
    this.footerFeatures.addEventListener("pointercancel", stopDragging);
    this.footerFeatures.addEventListener("pointerleave", stopDragging);
    this.footerFeatures.addEventListener(
      "wheel",
      (event) => {
        const { deltaX, deltaY } = event;
        if (deltaX === 0 && deltaY === 0) return;
        const delta =
          Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
        this.footerFeatures.scrollLeft += delta;
        event.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      this.syncFooterFeatures();
    });
  }

  bindEvents() {
    this.dialogs.forEach((dialog) => {
      dialog.addEventListener("close", () => {
        this.syncNotifyLayer();
        this.flushPendingUpdate();
      });
    });

    this.projectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = this.projectNameInput.value.trim();
      if (!name) return;
      const project = this.service.createProject(name, "");
      this.animateProjectsOnNextRender = true;
      this.pushNotification({
        title: "Project added",
        message: project.name,
        tone: "success",
      });
      this.projectNameInput.value = "";
      const shouldScroll = this.shouldAutoScrollToIdeasPanel();
      this.setActiveProjectId(project.id);
      this.render();
      if (shouldScroll) {
        window.requestAnimationFrame(() => this.scrollToIdeasPanelTop());
      }
    });

    this.projectFilterInput?.addEventListener("input", (event) => {
      this.setProjectFilterQuery(event.target.value);
      this.render();
    });

    this.projectCategoryFilters?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      const category = button.dataset.category;
      if (!category) return;
      if (category === "all") {
        this.setProjectCategoryFilterAll();
      } else {
        this.toggleProjectCategoryFilter(category);
      }
      this.render();
    });

    this.projectsList.addEventListener("click", (event) => {
      const actionButton = event.target.closest("button[data-action]");
      if (actionButton) {
        const card = actionButton.closest(".project-card");
        if (!card) return;
        const projectId = card.dataset.id;
        const action = actionButton.dataset.action;

        if (action === "pin-project") {
          const project = this.service.findProject(projectId);
          const nextPinned = !project.pinned;
          this.service.toggleProjectPin(projectId);
          this.pushNotification({
            title: nextPinned ? "Project pinned" : "Project unpinned",
            message: project.name,
            tone: "info",
          });
          this.render();
          return;
        }
        if (action === "edit-project") {
          const project = this.service.findProject(projectId);
          this.openEditDialog({
            mode: "project",
            id: project.id,
            text: project.name,
            description: project.description,
            startDate: project.startDate,
            dueDate: project.dueDate,
            category: project.category,
            title: "Edit project",
            maxLength: 50,
          });
          return;
        }
        if (action === "delete-project") {
          this.requestProjectDeletion(projectId);
          return;
        }
        return;
      }

      const card = event.target.closest(".project-card");
      if (!card) return;
      const shouldScroll = this.shouldAutoScrollToIdeasPanel();
      this.setActiveProjectId(card.dataset.id);
      this.render();
      if (shouldScroll) {
        window.requestAnimationFrame(() => this.scrollToIdeasPanelTop());
      }
    });

    this.projectsList.addEventListener("dragstart", (event) => {
      const card = event.target.closest(".project-card");
      if (!card) return;
      this.dragState = { type: "project", id: card.dataset.id };
      this.setDragOverTarget("project", null);
      card.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.id);
    });

    this.projectsList.addEventListener("dragend", (event) => {
      const card = event.target.closest(".project-card");
      card?.classList.remove("dragging");
      this.setDragOverTarget("project", null);
      this.dragState = { type: null, id: null };
    });

    this.projectsList.addEventListener("dragover", (event) => {
      const card = event.target.closest(".project-card");
      if (!card || this.dragState.type !== "project") return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      this.setDragOverTarget("project", card);
    });

    this.projectsList.addEventListener("drop", (event) => {
      const card = event.target.closest(".project-card");
      if (!card || this.dragState.type !== "project") return;
      event.preventDefault();
      this.service.moveProject(this.dragState.id, card.dataset.id);
      this.setDragOverTarget("project", null);
      this.render();
    });

    this.ideaForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.activeProjectId) return;
      const text = this.ideaTextInput.value.trim();
      if (!text) return;
      this.service.addIdea(this.activeProjectId, text);
      this.animateIdeasOnNextRender = true;
      this.pushNotification({
        title: "Idea added",
        message: text,
        tone: "success",
      });
      this.ideaTextInput.value = "";
      this.render();
    });

    this.ideaTabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;
      this.setIdeaFilter(button.dataset.filter);
      this.renderIdeas();
    });

    this.ideasList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button || !this.activeProjectId) return;
      const ideaId = button.closest("li")?.dataset.id;
      if (!ideaId) return;
      const action = button.dataset.action;

      if (action === "pin-idea") {
        const idea = this.service.findIdea(this.activeProjectId, ideaId);
        const nextPinned = !idea.pinned;
        this.service.toggleIdeaPin(this.activeProjectId, ideaId);
        this.pushNotification({
          title: nextPinned ? "Idea pinned" : "Idea unpinned",
          message: idea.text,
          tone: "info",
        });
        this.render();
        return;
      }
      if (action === "toggle") {
        const idea = this.service.findIdea(this.activeProjectId, ideaId);
        if (idea.done) {
          this.openConfirmDialog({
            title: "Reopen idea",
            message: `Reopen "${idea.text}"?`,
            confirmText: "Reopen idea",
            onConfirm: () => {
              this.service.toggleIdea(this.activeProjectId, ideaId);
              this.animateIdeasOnNextRender = false;
              this.pushNotification({
                title: "Idea reopened",
                message: idea.text,
                tone: "info",
              });
              this.render();
            },
          });
        } else {
          this.service.toggleIdea(this.activeProjectId, ideaId);
          this.animateIdeasOnNextRender = false;
          this.pushNotification({
            title: "Idea completed",
            message: idea.text,
            tone: "success",
          });
          this.render();
        }
        return;
      }
      if (action === "copy") {
        const idea = this.service.findIdea(this.activeProjectId, ideaId);
        this.copyIdeaText(idea.text);
        return;
      }
      if (action === "edit") {
        const idea = this.service.findIdea(this.activeProjectId, ideaId);
          this.openEditDialog({
            mode: "idea",
            id: idea.id,
            text: idea.text,
            title: "Edit idea",
            maxLength: 160,
          });
        return;
      }
      if (action === "delete") {
        const idea = this.service.findIdea(this.activeProjectId, ideaId);
        this.openConfirmDialog({
          title: "Delete idea",
          message: `Delete "${idea.text}"?`,
          confirmText: "Delete idea",
          onConfirm: () => {
            this.service.deleteIdea(this.activeProjectId, ideaId);
            this.animateIdeasOnNextRender = true;
            this.pushNotification({
              title: "Idea deleted",
              message: idea.text,
              tone: "warning",
            });
            this.render();
          },
        });
        return;
      }

      this.render();
    });

    this.ideasList.addEventListener("dragstart", (event) => {
      const item = event.target.closest(".idea-item");
      if (!item) return;
      this.dragState = { type: "idea", id: item.dataset.id };
      this.setDragOverTarget("idea", null);
      item.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.dataset.id);
    });

    this.ideasList.addEventListener("dragend", (event) => {
      const item = event.target.closest(".idea-item");
      item?.classList.remove("dragging");
      this.setDragOverTarget("idea", null);
      this.dragState = { type: null, id: null };
    });

    this.ideasList.addEventListener("dragover", (event) => {
      const item = event.target.closest(".idea-item");
      if (!item || this.dragState.type !== "idea") return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      this.setDragOverTarget("idea", item);
    });

    this.ideasList.addEventListener("drop", (event) => {
      const item = event.target.closest(".idea-item");
      if (!item || this.dragState.type !== "idea" || !this.activeProjectId) return;
      event.preventDefault();
      this.service.moveIdeaTo(this.activeProjectId, this.dragState.id, item.dataset.id);
      this.setDragOverTarget("idea", null);
      this.render();
    });

    this.themeToggle.addEventListener("click", () => {
      const theme = this.themeService.toggle();
      this.updateThemeLabel(theme);
      this.background.updatePalette();
      if (this.logDialog.open || this.logDialog.hasAttribute("open")) {
        this.renderLogDialogChart();
      }
      if (this.techDialog?.open || this.techDialog?.hasAttribute("open")) {
        this.highlightTechCode();
      }
    });

    this.techToggle?.addEventListener("click", () => {
      this.openTechDialog();
    });

    this.ganttToggle?.addEventListener("click", () => {
      this.openGanttDialog();
    });

    this.ganttClose?.addEventListener("click", () => {
      this.ganttDialog.close();
    });

    this.ganttRange?.addEventListener("change", () => {
      this.updateGanttCategoryTabs();
      this.renderGanttChart();
    });

    this.ganttTotalButton?.addEventListener("click", () => {
      this.ganttCategoryFilter = new Set(GANTT_CATEGORY_OPTIONS);
      this.syncGanttCategoryButtons();
      this.renderGanttChart();
    });

    this.ganttCategoryTabs?.addEventListener("click", (e) => {
      const btn = e.target.closest(".gantt-tab-button");
      if (!btn) return;
      const category = btn.dataset.category;
      if (!category || !GANTT_CATEGORY_OPTIONS.includes(category)) return;
      if (this.ganttCategoryFilter.has(category)) {
        this.ganttCategoryFilter.delete(category);
      } else {
        this.ganttCategoryFilter.add(category);
      }
      this.syncGanttCategoryButtons();
      this.renderGanttChart();
    });

    this.ganttDialog?.addEventListener("click", (e) => {
      if (e.target === this.ganttDialog) this.ganttDialog.close();
    });

    this.ganttProjects?.addEventListener("click", (e) => {
      const actionButton = e.target.closest("button[data-action]");
      if (actionButton && actionButton.dataset.action === "edit-project") {
        const projectRow = actionButton.closest(".gantt-project");
        if (!projectRow) return;
        const projectId = projectRow.dataset.projectId;
        const project = this.service.findProject(projectId);
        if (!project) return;

        this.openEditDialog({
          mode: "project",
          id: project.id,
          text: project.name,
          description: project.description,
          startDate: project.startDate,
          dueDate: project.dueDate,
          category: project.category,
          title: "Edit project",
          maxLength: 50,
        });
      }
    });

    this.settingsToggle?.addEventListener("click", () => {
      this.openSettingsDialog("data");
    });

    this.exportButton?.addEventListener("click", () => {
      this.exportData();
    });

    this.importButton?.addEventListener("click", () => {
      this.triggerImport();
    });

    this.importFileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const payload = JSON.parse(reader.result);
          const fileName = this.fileSystemRepo.getFileName();
          const importMessage =
            this.dataSource === "localDevice"
              ? `Importing will replace all current projects and overwrite ${fileName || "your local file"}. Continue?`
              : "Importing will replace all current projects and ideas. Continue?";
          this.openConfirmDialog({
            title: "Import data",
            message: importMessage,
            confirmText: "Import data",
            onConfirm: () => {
              this.applyImport(payload);
            },
          });
        } catch (error) {
          window.alert("Import failed. Please select a valid JSON file.");
        }
      };
      reader.readAsText(file);
    });

    this.logToggle.addEventListener("click", () => {
      this.setLogVisibility(!this.isLogVisible);
      this.applyLogVisibility();
    });

    this.logViewAll.addEventListener("click", () => {
      this.openLogDialog();
    });

    this.logDialogClose.addEventListener("click", () => {
      this.closeLogDialog();
    });

    this.logDialog.addEventListener("click", (event) => {
      if (event.target === this.logDialog) {
        this.closeLogDialog();
      }
    });

    this.logDialogSearch.addEventListener("input", () => {
      this.applyLogDialogFilters();
    });

    this.logDialogProjectFilter.addEventListener("change", () => {
      this.applyLogDialogFilters();
    });

    this.logDialogStart.addEventListener("change", () => {
      this.applyLogDialogFilters();
    });

    this.logDialogEnd.addEventListener("change", () => {
      this.applyLogDialogFilters();
    });

    this.logChartUnit.addEventListener("change", () => {
      this.logDialogChartUnit = this.logChartUnit.value;
      this.renderLogDialogChart();
    });

    this.logDialogScroll.addEventListener("scroll", () => {
      this.handleLogDialogScroll();
    });

    this.logDialogList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      if (action !== "reopen") return;
      const item = button.closest(".log-item");
      const projectId = item?.dataset.projectId;
      const ideaId = item?.dataset.ideaId;
      if (!projectId || !ideaId) return;
      const idea = this.service.findIdea(projectId, ideaId);
      this.openConfirmDialog({
        title: "Reopen idea",
        message: `Reopen "${idea.text}"?`,
        confirmText: "Reopen idea",
        onConfirm: () => {
          this.service.toggleIdea(projectId, ideaId);
          if (this.activeProjectId === projectId) {
            this.animateIdeasOnNextRender = false;
          }
          this.pushNotification({
            title: "Idea reopened",
            message: idea.text,
            tone: "info",
          });
          this.applyLogDialogFilters();
          this.render();
        },
      });
    });

    window.addEventListener("resize", () => {
      if (this.logDialog.open || this.logDialog.hasAttribute("open")) {
        this.resizeLogChart();
        this.renderLogDialogChart();
      }
      if (this.ganttDialog?.open || this.ganttDialog?.hasAttribute("open")) {
        this.queueGanttProjectActions();
      }
    });

    this.logFilter.addEventListener("input", (event) => {
      this.logFilterValue = event.target.value.trim().toLowerCase();
      this.renderLog();
    });

    this.logProjectFilter.addEventListener("change", (event) => {
      this.logProjectFilterValue = event.target.value;
      this.renderLog();
    });

    this.logList.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const action = button.dataset.action;
      if (action !== "reopen") return;
      const item = button.closest(".log-item");
      const projectId = item?.dataset.projectId;
      const ideaId = item?.dataset.ideaId;
      if (!projectId || !ideaId) return;
      const idea = this.service.findIdea(projectId, ideaId);
      this.openConfirmDialog({
        title: "Reopen idea",
        message: `Reopen "${idea.text}"?`,
        confirmText: "Reopen idea",
        onConfirm: () => {
          this.service.toggleIdea(projectId, ideaId);
          if (this.activeProjectId === projectId) {
            this.animateIdeasOnNextRender = false;
          }
          this.pushNotification({
            title: "Idea reopened",
            message: idea.text,
            tone: "info",
          });
          this.render();
        },
      });
    });

    this.editForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = this.editInput.value.trim();
      if (!text) {
        this.closeEditDialog();
        return;
      }

      if (this.editingMode === "idea" && this.activeProjectId && this.editingIdeaId) {
        this.service.updateIdeaText(this.activeProjectId, this.editingIdeaId, text);
        this.animateIdeasOnNextRender = true;
        this.pushNotification({
          title: "Idea updated",
          message: text,
          tone: "neutral",
        });
      }

      if (this.editingMode === "project" && this.editingProjectId) {
        this.service.updateProjectName(this.editingProjectId, text);
        this.service.updateProjectDescription(
          this.editingProjectId,
          this.editDescriptionInput.value
        );
        this.service.updateProjectDates(
          this.editingProjectId,
          this.editStartDateInput.value || null,
          this.editDueDateInput.value || null
        );
        const categoryValue = this.editCategoryInput.value || null;
        this.service.updateProjectCategory(this.editingProjectId, categoryValue);
        this.animateProjectsOnNextRender = true;
        this.pushNotification({
          title: "Project updated",
          message: text,
          tone: "neutral",
        });
      }

      this.closeEditDialog();
      this.render();

      // Re-render gantt if it's open
      if (this.ganttDialog?.open) {
        this.updateGanttCategoryTabs();
        this.renderGanttChart();
      }
    });

    this.editDelete?.addEventListener("click", () => {
      if (this.editingMode !== "project" || !this.editingProjectId) return;
      this.requestProjectDeletion(this.editingProjectId, {
        closeEditDialog: true,
      });
    });

    this.editCancel.addEventListener("click", () => {
      this.closeEditDialog();
    });

    this.editDialog.addEventListener("click", (event) => {
      if (event.target === this.editDialog) {
        this.closeEditDialog();
      }
    });

    this.confirmForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.pendingConfirm) {
        this.pendingConfirm();
      }
      this.closeConfirmDialog({ wasConfirmed: true });
    });

    this.confirmCancel.addEventListener("click", () => {
      this.closeConfirmDialog();
    });

    this.confirmDialog.addEventListener("click", (event) => {
      if (event.target === this.confirmDialog) {
        this.closeConfirmDialog();
      }
    });
    this.confirmDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.closeConfirmDialog();
    });

    this.updateForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      window.location.reload();
    });

    this.updateLater?.addEventListener("click", () => {
      this.closeUpdateDialog();
    });

    this.updateDialog?.addEventListener("click", (event) => {
      if (event.target === this.updateDialog) {
        this.closeUpdateDialog();
      }
    });

    this.techClose?.addEventListener("click", () => {
      this.closeTechDialog();
    });

    this.techDialog?.addEventListener("click", (event) => {
      if (event.target === this.techDialog) {
        this.closeTechDialog();
      }
    });

    this.techDialog?.addEventListener("close", () => {
      if (this.techSwitchTimer) {
        window.clearTimeout(this.techSwitchTimer);
        this.techSwitchTimer = null;
      }
    });

    this.limitsClose?.addEventListener("click", () => {
      this.closeLimitsDialog();
    });

    this.limitsDialog?.addEventListener("click", (event) => {
      if (event.target === this.limitsDialog) {
        this.closeLimitsDialog();
      }
    });

    this.limitsDialog?.addEventListener("close", () => {
      this.stopLimitsUpdates();
    });

    this.limitsSearch?.addEventListener("input", () => {
      this.renderLimits();
    });

    this.limitsFilterInputs.forEach((input) => {
      input.addEventListener("change", () => {
        this.renderLimits();
      });
    });

    this.limitsAccountSelect?.addEventListener("change", () => {
      this.limitsActiveAccountIndex = parseInt(this.limitsAccountSelect.value, 10);
      if (this.limitsRawPayload) {
        this.limitsModels = this.normalizeLimitsPayload(this.limitsRawPayload);
        this.renderLimits();
      }
    });

    this.settingsClose?.addEventListener("click", () => {
      this.closeSettingsDialog();
    });

    this.settingsDialog?.addEventListener("click", (event) => {
      if (event.target === this.settingsDialog) {
        this.closeSettingsDialog();
      }
    });

    this.settingsMenuButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setSettingsPanel(button.dataset.panel);
      });
    });

    this.settingsExportButton?.addEventListener("click", () => {
      this.exportData();
    });

    this.settingsImportButton?.addEventListener("click", () => {
      this.triggerImport();
    });

    this.settingsProxyToggle?.addEventListener("click", () => {
      this.setServiceMonitorEnabled(!this.serviceMonitorEnabled);
    });

    this.settingsIdeaToggle?.addEventListener("click", () => {
      this.setCopyWithUltrathink(!this.copyWithUltrathink);
    });

    this.settingsProxyForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.settingsProxyUrlInput) return;
      this.setServiceMonitorUrl(this.settingsProxyUrlInput.value);
      if (this.settingsUsageUrlInput) {
        this.setModelUsageUrl(this.settingsUsageUrlInput.value);
      }
      if (this.settingsIntervalInput) {
        this.setServiceMonitorInterval(this.settingsIntervalInput.value);
      }
      this.pushNotification({
        title: "Proxy updated",
        message: this.serviceMonitorUrl,
        tone: "neutral",
      });
    });

    this.settingsUpdateForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!this.settingsUpdateIntervalInput) return;
      this.setUpdateCheckInterval(this.settingsUpdateIntervalInput.value);
      const seconds = Math.round(this.updateCheckIntervalMs / 1000);
      this.pushNotification({
        title: "Update interval saved",
        message: `Checking every ${seconds}s.`,
        tone: "neutral",
      });
    });

    this.settingsUpdateNowButton?.addEventListener("click", () => {
      this.checkForUpdate({ force: true, showUpToDate: true });
    });

    this.settingsThemeOptions.forEach((option) => {
      option.addEventListener("change", (event) => {
        const target = event.target;
        if (!target || !target.value) return;
        this.applyThemePreference(target.value);
        this.syncSettingsState();
      });
    });

    this.dataSourceSelector?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-source]");
      if (!button || button.disabled) return;
      const source = button.dataset.source;
      if (source) {
        this.switchDataSource(source);
      }
    });

    this.settingsResetData?.addEventListener("click", () => {
      this.openConfirmDialog({
        title: "Reset all data",
        message:
          "This will permanently delete all projects and ideas. This action cannot be undone.",
        confirmText: "Reset",
        onConfirm: () => {
          this.resetAllData();
        },
      });
    });

    this.dataSourceForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const strategy = formData.get("mergeStrategy") || "overwrite";
      if (this.dataSourcePendingStrategy) {
        this.dataSourcePendingStrategy(strategy);
        this.dataSourcePendingStrategy = null;
      }
      this.dataSourceDialog?.close();
    });

    this.dataSourceCancel?.addEventListener("click", () => {
      if (this.dataSourcePendingStrategy) {
        this.dataSourcePendingStrategy("cancel");
        this.dataSourcePendingStrategy = null;
      }
      this.dataSourceDialog?.close();
    });

    this.dataSourceDialog?.addEventListener("click", (event) => {
      if (event.target === this.dataSourceDialog) {
        if (this.dataSourcePendingStrategy) {
          this.dataSourcePendingStrategy("cancel");
          this.dataSourcePendingStrategy = null;
        }
        this.dataSourceDialog.close();
      }
    });

    this.initStickyTopbar();
    this.initSettingsCodeHighlight();
    this.initFooterFeatures();
  }

  updateThemeLabel(theme) {
    const label = theme === "dark" ? "Light mode" : "Dark mode";
    const icon = theme === "dark" ? ICONS.sun : ICONS.moon;
    this.themeToggle.innerHTML = `${icon}<span class="sr-only">${label}</span>`;
    this.themeToggle.setAttribute("aria-label", label);
    this.themeToggle.title = label;
  }

  updateDataButtons() {
    if (this.exportButton) {
      this.exportButton.innerHTML = `${ICONS.download}<span class="sr-only">Export data</span>`;
      this.exportButton.setAttribute("aria-label", "Export data");
      this.exportButton.title = "Export data";
    }

    if (this.importButton) {
      this.importButton.innerHTML = `${ICONS.upload}<span class="sr-only">Import data</span>`;
      this.importButton.setAttribute("aria-label", "Import data");
      this.importButton.title = "Import data";
    }

    if (this.techToggle) {
      this.techToggle.innerHTML = `${ICONS.tech}<span class="sr-only">Tech Details</span>`;
      this.techToggle.setAttribute("aria-label", "Tech Details");
      this.techToggle.title = "Tech Details";
    }

    if (this.ganttToggle) {
      this.ganttToggle.innerHTML = `${ICONS.gantt}<span class="sr-only">Project Timeline</span>`;
      this.ganttToggle.setAttribute("aria-label", "Project Timeline");
      this.ganttToggle.title = "Project Timeline";
    }

    if (this.settingsToggle) {
      this.settingsToggle.innerHTML = `${ICONS.gear}<span class="sr-only">Settings</span>`;
      this.settingsToggle.setAttribute("aria-label", "Settings");
      this.settingsToggle.title = "Settings";
    }
  }

  updateLogToggleLabel() {
    const label = this.isLogVisible ? "Hide log" : "Show log";
    const icon = this.isLogVisible ? ICONS.logOff : ICONS.log;
    this.logToggle.innerHTML = `${icon}<span class="sr-only">${label}</span>`;
    this.logToggle.setAttribute("aria-label", label);
    this.logToggle.setAttribute("aria-pressed", this.isLogVisible);
    this.logToggle.title = label;
  }

  applyLogVisibility() {
    this.logPanel.classList.toggle("is-hidden", !this.isLogVisible);
    this.workspace.classList.toggle("log-hidden", !this.isLogVisible);
    this.updateLogToggleLabel();
  }

  applyImport(payload) {
    try {
      const normalized = this.normalizeImportPayload(payload);
      this.service.importProjects(normalized.projects);
      if (normalized.theme) {
        this.applyImportedTheme(normalized.theme);
      }
      const appliedUiState = this.applyImportedUiState(normalized.uiState);
      if (!appliedUiState) {
        this.setActiveProjectId(this.service.getProjects()[0]?.id || null);
      }
      this.animateProjectsOnNextRender = true;
      this.animateIdeasOnNextRender = true;
      this.render();
    } catch (error) {
      window.alert("Import failed. Please check the file format.");
    }
  }

  openEditDialog({ mode, id, text, description = "", startDate = null, dueDate = null, category = null, title, maxLength }) {
    if (!id) return;
    this.editingMode = mode;
    this.editingIdeaId = mode === "idea" ? id : null;
    this.editingProjectId = mode === "project" ? id : null;
    this.editTitle.textContent = title;
    this.editInput.value = text;
    this.editInput.maxLength = maxLength || 80;
    const showDescription = mode === "project";
    this.editDescriptionInput.classList.toggle("hidden", !showDescription);
    this.editDescriptionInput.value = showDescription ? description : "";
    this.editDateFields.classList.toggle("hidden", !showDescription);
    this.editStartDateInput.value = startDate || "";
    this.editDueDateInput.value = dueDate || "";
    this.editCategoryField.classList.toggle("hidden", !showDescription);
    this.editCategoryInput.value = showDescription ? (category || "") : "";
    if (this.editDelete) {
      const showDelete = mode === "project";
      this.editDelete.classList.toggle("hidden", !showDelete);
      this.editDelete.disabled = !showDelete;
    }

    if (typeof this.editDialog.showModal === "function") {
      this.editDialog.showModal();
      this.editInput.focus();
      this.editInput.select();
      this.syncNotifyLayer();
    } else {
      const nextText = window.prompt(title, text);
      if (nextText !== null && nextText.trim()) {
        if (mode === "idea" && this.activeProjectId) {
          this.service.updateIdeaText(this.activeProjectId, id, nextText);
          this.animateIdeasOnNextRender = true;
          this.pushNotification({
            title: "Idea updated",
            message: nextText,
            tone: "neutral",
          });
          this.render();
          this.closeEditDialog();
          return;
        }
        if (mode === "project") {
          const nextDescription = window.prompt(
            "Project description (optional)",
            description
          );
          this.service.updateProjectName(id, nextText);
          if (nextDescription !== null) {
            this.service.updateProjectDescription(id, nextDescription);
          }
          this.animateProjectsOnNextRender = true;
          this.pushNotification({
            title: "Project updated",
            message: nextText,
            tone: "neutral",
          });
          this.render();
          this.closeEditDialog();
          return;
        }
      }
      this.closeEditDialog();
    }
  }

  closeEditDialog() {
    if (this.editDialog.open) {
      this.editDialog.close();
    }
    this.editingMode = null;
    this.editingIdeaId = null;
    this.editingProjectId = null;
    this.editTitle.textContent = "Edit idea";
    this.editInput.value = "";
    this.editDescriptionInput.value = "";
    this.editDescriptionInput.classList.add("hidden");
    this.editDateFields.classList.add("hidden");
    this.editStartDateInput.value = "";
    this.editDueDateInput.value = "";
    this.editCategoryField.classList.add("hidden");
    this.editCategoryInput.value = "";
    if (this.editDelete) {
      this.editDelete.classList.add("hidden");
      this.editDelete.disabled = true;
    }
    this.syncNotifyLayer();
  }

  openUpdateDialog(version) {
    if (!this.updateDialog) return false;
    const message = "A new version is available. Refresh to update.";
    if (this.updateMessage) {
      this.updateMessage.textContent = message;
    }
    const activeDialog = this.getActiveDialog();
    if (activeDialog && activeDialog !== this.updateDialog) {
      return false;
    }
    if (this.updateDialog.open || this.updateDialog.hasAttribute("open")) {
      this.syncNotifyLayer();
      return true;
    }
    if (typeof this.updateDialog.showModal === "function") {
      this.updateDialog.showModal();
    } else {
      this.updateDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
    return true;
  }

  closeUpdateDialog() {
    if (!this.updateDialog) return;
    if (this.updateDialog.open) {
      this.updateDialog.close();
    } else {
      this.updateDialog.removeAttribute("open");
    }
    this.syncNotifyLayer();
  }

  confirmAction({ title, message, confirmText }) {
    return new Promise((resolve) => {
      this.openConfirmDialog({
        title,
        message,
        confirmText,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }

  requestProjectDeletion(projectId, { closeEditDialog = false } = {}) {
    if (!projectId) return;
    const project = this.service.findProject(projectId);
    this.openConfirmDialog({
      title: "Delete project",
      message: `Delete "${project.name}"?`,
      confirmText: "Delete project",
      onConfirm: () => {
        this.service.deleteProject(projectId);
        this.animateProjectsOnNextRender = true;
        this.pushNotification({
          title: "Project deleted",
          message: project.name,
          tone: "warning",
        });
        if (this.activeProjectId === projectId) {
          this.setActiveProjectId(this.service.getProjects()[0]?.id || null);
        }
        if (closeEditDialog) {
          this.closeEditDialog();
        }
        this.render();
        if (this.ganttDialog?.open) {
          this.updateGanttCategoryTabs();
          this.renderGanttChart();
        }
      },
    });
  }

  openConfirmDialog({ title, message, confirmText, onConfirm, onCancel }) {
    this.confirmTitle.textContent = title;
    this.confirmMessage.textContent = message;
    this.confirmConfirm.textContent = confirmText || "Delete";
    this.pendingConfirm = onConfirm;
    this.pendingConfirmCancel = onCancel;

    if (typeof this.confirmDialog.showModal === "function") {
      this.confirmDialog.showModal();
    } else {
      this.confirmDialog.setAttribute("open", "true");
    }
    this.syncNotifyLayer();
  }

  closeConfirmDialog({ wasConfirmed = false } = {}) {
    if (this.confirmDialog.open) {
      this.confirmDialog.close();
    } else {
      this.confirmDialog.removeAttribute("open");
    }
    if (!wasConfirmed && this.pendingConfirmCancel) {
      this.pendingConfirmCancel();
    }
    this.pendingConfirm = null;
    this.pendingConfirmCancel = null;
    this.confirmTitle.textContent = "Delete";
    this.confirmMessage.textContent = "";
    this.confirmConfirm.textContent = "Delete";
    this.syncNotifyLayer();
  }

  copyIdeaText(text) {
    const prefix = this.copyWithUltrathink ? "use ultrathink, " : "";
    const copyText = `${prefix}${text}`;
    const notify = () => {
      const noticeText = this.copyWithUltrathink
        ? "Copied with ultrathink"
        : text;
      this.pushNotification({
        title: this.copyWithUltrathink ? "Copied with ultrathink" : "Idea copied",
        message: noticeText,
        tone: "info",
      });
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(copyText).then(notify).catch(() => {
        this.copyIdeaTextFallback(copyText);
        notify();
      });
      return;
    }
    this.copyIdeaTextFallback(copyText);
    notify();
  }

  copyIdeaTextFallback(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      console.warn("Copy failed", error);
    }
    document.body.removeChild(textarea);
  }

  updateIdeaTabs(stats) {
    const buttons = Array.from(this.ideaTabs.querySelectorAll("button[data-filter]"));
    const counts = {
      todo: stats.total - stats.done,
      done: stats.done,
      all: stats.total,
    };
    buttons.forEach((button) => {
      const filter = button.dataset.filter;
      const isActive = filter === this.ideaFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive);
      const countSpan = button.querySelector(".tab-count");
      if (countSpan && filter in counts) {
        countSpan.textContent = counts[filter];
      }
    });
  }

  filterIdeas(ideas) {
    let filtered = ideas;
    if (this.ideaFilter === "done") {
      filtered = ideas.filter((idea) => idea.done);
    } else if (this.ideaFilter === "todo") {
      filtered = ideas.filter((idea) => !idea.done);
    }
    return reorderPinnedFirst(filtered);
  }

  getIdeasEmptyMessage() {
    if (this.ideaFilter === "done") {
      return "No finished ideas yet.";
    }
    if (this.ideaFilter === "all") {
      return "Add an idea and keep the momentum going.";
    }
    return "Add an idea and keep the momentum going.";
  }

  render() {
    this.renderProjects();
    this.renderIdeas();
    this.renderLog();
    if (this.dataSource === "localDevice") {
      this.persistToFile();
    }
  }

  renderProjects() {
    const projects = this.service.getProjects();
    const visibleProjects = this.filterProjects(projects);
    this.syncProjectFilterUI(projects, visibleProjects);
    this.projectsList.innerHTML = "";
    const shouldAnimate = this.animateProjectsOnNextRender;
    this.animateProjectsOnNextRender = false;

    if (projects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Create your first project to get started.";
      this.projectsList.appendChild(empty);
      return;
    }

    this.ensureActiveProjectVisible(visibleProjects);

    if (visibleProjects.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      if (this.projectCategoryFilter.size === 0) {
        empty.textContent = "Select at least one category to show projects.";
      } else if (this.projectFilterQuery) {
        empty.textContent = `No projects found for "${this.projectFilterQuery}".`;
      } else {
        empty.textContent = "No projects match your current filters.";
      }
      this.projectsList.appendChild(empty);
      return;
    }

    visibleProjects.forEach((project, index) => {
      const stats = project.stats();
      const hasOpenIdeas = stats.total > 0 && stats.done < stats.total;
      const description = (project.description || "").trim();
      const descriptionMarkup = description
        ? `<p class="project-description">${escapeHtml(description)}</p>`
        : "";
      const liveIndicator = hasOpenIdeas
        ? '<span class="project-live" aria-hidden="true"></span>'
        : "";
      const pinLabel = project.pinned ? "Unpin project" : "Pin project";
      const pinIcon = project.pinned ? ICONS.pinOff : ICONS.pin;
      const categoryMarkup = project.category
        ? `<span class="project-category project-category-${project.category.toLowerCase()}">${escapeHtml(project.category)}</span>`
        : "";
      const card = document.createElement("div");
      card.className = shouldAnimate ? "project-card fade-in" : "project-card";
      if (shouldAnimate) {
        card.style.setProperty("--fade-delay", `${index * 40}ms`);
      }
      card.draggable = true;
      if (project.id === this.activeProjectId) {
        card.classList.add("active");
      }
      if (project.pinned) {
        card.classList.add("is-pinned");
      }
      card.dataset.id = project.id;
      card.innerHTML = `
        <div class="project-card-header">
          <div class="project-title-block">
            <div class="project-title-row">
              ${categoryMarkup}
              <h3>${escapeHtml(project.name)}</h3>
              ${liveIndicator}
            </div>
            ${descriptionMarkup}
          </div>
          <div class="project-actions">
            <button class="icon-button pin-button${project.pinned ? " is-active" : ""}" type="button" data-action="pin-project" aria-pressed="${project.pinned}" aria-label="${pinLabel}" title="${pinLabel}">
              ${pinIcon}
              <span class="sr-only">${pinLabel}</span>
            </button>
            <button class="icon-button" type="button" data-action="edit-project" aria-label="Edit project" title="Edit project">
              ${ICONS.edit}
              <span class="sr-only">Edit</span>
            </button>
          </div>
        </div>
        <div class="project-meta">
          <span>${stats.done}/${stats.total}</span>
          <span>${stats.percent}%</span>
        </div>
        <div class="progress-track" style="margin-top:10px;">
          <div class="progress-fill" style="width:${stats.percent}%;"></div>
        </div>
      `;
      this.projectsList.appendChild(card);
    });
  }

  renderIdeas() {
    const project = this.activeProjectId
      ? this.service.getProjects().find((item) => item.id === this.activeProjectId)
      : null;
    const shouldAnimate = this.animateIdeasOnNextRender;
    this.animateIdeasOnNextRender = false;

    if (!project) {
      this.activeProjectName.textContent = "Select a project";
      this.progressFill.style.width = "0%";
      this.progressLabel.textContent = "0%";
      this.projectDescription.textContent = "";
      this.ideaForm.classList.add("hidden");
      this.ideaTabs.classList.add("hidden");
      this.ideasList.innerHTML = "";
      this.ideasEmpty.style.display = "block";
      return;
    }

    this.ideaForm.classList.remove("hidden");
    this.ideaTabs.classList.remove("hidden");
    this.activeProjectName.textContent = project.name;
    this.projectDescription.textContent = project.description || "";
    const stats = project.stats();
    this.progressFill.style.width = `${stats.percent}%`;
    this.progressLabel.textContent = `${stats.percent}%`;

    this.ideasList.innerHTML = "";

    this.updateIdeaTabs(stats);
    const visibleIdeas = this.filterIdeas(project.ideas);

    if (visibleIdeas.length === 0) {
      this.ideasEmpty.style.display = "block";
      this.ideasEmpty.textContent = this.getIdeasEmptyMessage();
      return;
    }

    this.ideasEmpty.style.display = "none";

    visibleIdeas.forEach((idea, index) => {
      const item = document.createElement("li");
      item.className = shouldAnimate ? "idea-item fade-in" : "idea-item";
      if (shouldAnimate) {
        item.style.setProperty("--fade-delay", `${index * 30}ms`);
      }
      item.draggable = true;
      if (idea.done) item.classList.add("completed");
      if (idea.pinned) item.classList.add("is-pinned");
      item.dataset.id = idea.id;
      const finishedLabel = idea.done && idea.finishedAt ? formatDate(idea.finishedAt) : "";
      const createdLabel = formatDate(idea.createdAt);
      const toggleLabel = idea.done ? "Reopen" : "Mark complete";
      const toggleIcon = idea.done ? ICONS.reopen : ICONS.check;
      const pinLabel = idea.pinned ? "Unpin idea" : "Pin idea";
      const pinIcon = idea.pinned ? ICONS.pinOff : ICONS.pin;
      item.innerHTML = `
        <span class="idea-text">
          <span class="idea-title">${escapeHtml(idea.text)}</span>
          <small>${ICONS.clock}${createdLabel}</small>
          ${finishedLabel ? `<small>${ICONS.checkCircleMini}${finishedLabel}</small>` : ""}
        </span>
        <div class="idea-actions">
          <button class="icon-button pin-button${idea.pinned ? " is-active" : ""}" type="button" data-action="pin-idea" aria-pressed="${idea.pinned}" aria-label="${pinLabel}" title="${pinLabel}">
            ${pinIcon}
            <span class="sr-only">${pinLabel}</span>
          </button>
          <button class="icon-button toggle-button" type="button" data-action="toggle" aria-pressed="${idea.done}" aria-label="${toggleLabel}" title="${toggleLabel}">
            ${toggleIcon}
            <span class="sr-only">${toggleLabel}</span>
          </button>
          <button class="icon-button" type="button" data-action="copy" aria-label="Copy idea" title="Copy idea">
            ${ICONS.copy}
            <span class="sr-only">Copy</span>
          </button>
          <button class="icon-button" type="button" data-action="edit" aria-label="Edit idea" title="Edit idea">
            ${ICONS.edit}
            <span class="sr-only">Edit</span>
          </button>
          <button class="icon-button" type="button" data-action="delete" aria-label="Delete idea" title="Delete idea">
            ${ICONS.trash}
            <span class="sr-only">Delete</span>
          </button>
        </div>
      `;
      this.ideasList.appendChild(item);
    });
  }

  renderLog() {
    const entries = this.service.getFinishedLog();
    this.logList.innerHTML = "";
    const projects = this.service.getProjects();
    const previousProjectFilter = this.logProjectFilterValue;
    this.logProjectFilter.innerHTML = `<option value="all">All projects</option>`;
    projects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = project.name;
      this.logProjectFilter.appendChild(option);
    });
    const hasProjectFilter =
      previousProjectFilter !== "all" &&
      projects.some((project) => project.id === previousProjectFilter);
    this.logProjectFilterValue = hasProjectFilter ? previousProjectFilter : "all";
    this.logProjectFilter.value = this.logProjectFilterValue;

    const query = this.logFilterValue;
    const filteredEntries = entries.filter(({ projectId, projectName, idea }) => {
      if (this.logProjectFilterValue !== "all" && projectId !== this.logProjectFilterValue) {
        return false;
      }
      if (!query) return true;
      const haystack = `${projectName} ${idea.text}`.toLowerCase();
      return haystack.includes(query);
    });
    const visibleEntries = filteredEntries.slice(0, 5);
    const hasEntries = entries.length > 5;
    this.logViewAll.disabled = !hasEntries;
    this.logViewAll.classList.toggle("hidden", !hasEntries);

    if (visibleEntries.length === 0) {
      this.logEmpty.style.display = "block";
      return;
    }

    this.logEmpty.style.display = "none";
    visibleEntries.forEach(({ projectId, projectName, idea }) => {
      const item = document.createElement("li");
      item.className = "log-item";
      item.dataset.projectId = projectId;
      item.dataset.ideaId = idea.id;
      item.innerHTML = `
        <span>${escapeHtml(idea.text)}</span>
        <small>${ICONS.checkCircleMini}${formatDate(idea.finishedAt)}</small>
        <small>${escapeHtml(projectName)}</small>
        <button class="icon-button log-reopen" type="button" data-action="reopen" aria-label="Reopen idea" title="Reopen idea">
          ${ICONS.reopen}
          <span class="sr-only">Reopen</span>
        </button>
      `;
      this.logList.appendChild(item);
    });
  }
}

const repository = new LocalStorageProjectRepository(STORAGE_KEY);
const service = new ProjectService(repository);
const themeService = new ThemeService(THEME_KEY);
const background = new PolyBackground(document.getElementById("bgCanvas"));
new ProjectIdeaUI(service, themeService, background);
