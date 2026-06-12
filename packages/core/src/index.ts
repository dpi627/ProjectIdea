export const WORKSPACE_SCHEMA_VERSION = 1 as const;

export type WorkspaceSchemaVersion = typeof WORKSPACE_SCHEMA_VERSION;
export type ProjectCategory = "CI" | "MP" | "SP" | null;
export type IdeaFilter = "todo" | "done" | "all";

export interface Project {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  startDate: string | null;
  dueDate: string | null;
  pinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Idea {
  id: string;
  projectId: string;
  text: string;
  done: boolean;
  pinned: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  finishedAt: string | null;
  deletedAt: string | null;
}

export interface WorkspaceData {
  schemaVersion: WorkspaceSchemaVersion;
  projects: Project[];
  ideas: Idea[];
  meta: {
    appName: "ophan";
    updatedAt: string;
    deviceId: string;
  };
}

export interface ProjectRepository {
  loadWorkspace(): Promise<WorkspaceData>;
  saveWorkspace(data: WorkspaceData): Promise<void>;
  exportWorkspace(data: WorkspaceData): string;
  importWorkspace(json: string): Promise<WorkspaceData>;
}

export interface ProjectStats {
  total: number;
  done: number;
  todo: number;
  percent: number;
}

export interface CompletionLogEntry {
  projectId: string;
  projectName: string;
  idea: Idea;
}

type UnknownRecord = Record<string, unknown>;

const VALID_CATEGORIES = new Set(["CI", "MP", "SP"]);

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNullableString = (value: unknown) => {
  const text = asString(value).trim();
  return text.length > 0 ? text : null;
};

const asBoolean = (value: unknown) => value === true;

const asNumber = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const nowIso = () => new Date().toISOString();

export const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const normalizeCategory = (value: unknown): ProjectCategory => {
  const category = asString(value).toUpperCase();
  return VALID_CATEGORIES.has(category) ? (category as Exclude<ProjectCategory, null>) : null;
};

export const toIsoTimestamp = (value: unknown, fallback = nowIso()) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
  }

  return fallback;
};

export const createEmptyWorkspace = (deviceId = createId()): WorkspaceData => ({
  schemaVersion: WORKSPACE_SCHEMA_VERSION,
  projects: [],
  ideas: [],
  meta: {
    appName: "ophan",
    updatedAt: nowIso(),
    deviceId,
  },
});

export const touchWorkspace = (workspace: WorkspaceData, updatedAt = nowIso()): WorkspaceData => ({
  ...workspace,
  meta: {
    ...workspace.meta,
    updatedAt,
  },
});

export const sortWorkItems = <T extends { pinned: boolean; order: number; updatedAt: string }>(items: T[]) =>
  [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.order !== b.order) return a.order - b.order;
    return a.updatedAt.localeCompare(b.updatedAt);
  });

export const getVisibleProjects = (workspace: WorkspaceData) =>
  sortWorkItems(workspace.projects.filter((project) => !project.deletedAt));

export const getIdeasForProject = (workspace: WorkspaceData, projectId: string) =>
  sortWorkItems(
    workspace.ideas.filter((idea) => idea.projectId === projectId && !idea.deletedAt)
  );

export const getFilteredIdeas = (
  workspace: WorkspaceData,
  projectId: string,
  filter: IdeaFilter
) => {
  const ideas = getIdeasForProject(workspace, projectId);
  if (filter === "done") return ideas.filter((idea) => idea.done);
  if (filter === "todo") return ideas.filter((idea) => !idea.done);
  return ideas;
};

export const getProjectStats = (workspace: WorkspaceData, projectId: string): ProjectStats => {
  const ideas = getIdeasForProject(workspace, projectId);
  const done = ideas.filter((idea) => idea.done).length;
  const total = ideas.length;
  return {
    total,
    done,
    todo: total - done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
};

export const getCompletionLog = (workspace: WorkspaceData): CompletionLogEntry[] => {
  const projectNameById = new Map(
    workspace.projects.map((project) => [project.id, project.name])
  );
  return workspace.ideas
    .filter((idea) => !idea.deletedAt && idea.done && idea.finishedAt)
    .map((idea) => ({
      projectId: idea.projectId,
      projectName: projectNameById.get(idea.projectId) || "Untitled project",
      idea,
    }))
    .sort((a, b) => {
      const aTime = a.idea.finishedAt ? new Date(a.idea.finishedAt).getTime() : 0;
      const bTime = b.idea.finishedAt ? new Date(b.idea.finishedAt).getTime() : 0;
      return bTime - aTime;
    });
};

const normalizeProject = (value: unknown, index: number, fallbackDate: string): Project => {
  const source = isRecord(value) ? value : {};
  const createdAt = toIsoTimestamp(source.createdAt, fallbackDate);
  const updatedAt = toIsoTimestamp(source.updatedAt, createdAt);
  return {
    id: asString(source.id, createId()),
    name: asString(source.name, "Untitled project").trim() || "Untitled project",
    description: asString(source.description).trim(),
    category: normalizeCategory(source.category),
    startDate: asNullableString(source.startDate),
    dueDate: asNullableString(source.dueDate),
    pinned: asBoolean(source.pinned),
    order: asNumber(source.order, index),
    createdAt,
    updatedAt,
    deletedAt: asNullableString(source.deletedAt),
  };
};

const normalizeIdea = (
  value: unknown,
  projectId: string,
  index: number,
  fallbackDate: string
): Idea => {
  const source = isRecord(value) ? value : {};
  const createdAt = toIsoTimestamp(source.createdAt, fallbackDate);
  const finishedAt = source.finishedAt ? toIsoTimestamp(source.finishedAt, createdAt) : null;
  const updatedAt = toIsoTimestamp(source.updatedAt, finishedAt || createdAt);
  return {
    id: asString(source.id, createId()),
    projectId: asString(source.projectId, projectId),
    text: asString(source.text, "Untitled idea").trim() || "Untitled idea",
    done: asBoolean(source.done),
    pinned: asBoolean(source.pinned),
    order: asNumber(source.order, index),
    createdAt,
    updatedAt,
    finishedAt,
    deletedAt: asNullableString(source.deletedAt),
  };
};

const hasNestedLegacyIdeas = (projects: unknown) =>
  Array.isArray(projects) &&
  projects.some((project) => isRecord(project) && Array.isArray(project.ideas));

export const importLegacyProjects = (
  legacyProjects: unknown,
  deviceId = createId()
): WorkspaceData => {
  const fallbackDate = nowIso();
  if (!Array.isArray(legacyProjects)) {
    return createEmptyWorkspace(deviceId);
  }

  const projects: Project[] = [];
  const ideas: Idea[] = [];

  legacyProjects.forEach((legacyProject, projectIndex) => {
    const project = normalizeProject(legacyProject, projectIndex, fallbackDate);
    projects.push(project);

    const legacyIdeas = isRecord(legacyProject) && Array.isArray(legacyProject.ideas)
      ? legacyProject.ideas
      : [];
    legacyIdeas.forEach((legacyIdea, ideaIndex) => {
      ideas.push(normalizeIdea(legacyIdea, project.id, ideaIndex, fallbackDate));
    });
  });

  return touchWorkspace({
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    projects,
    ideas,
    meta: {
      appName: "ophan",
      updatedAt: fallbackDate,
      deviceId,
    },
  });
};

export const normalizeWorkspace = (
  value: unknown,
  deviceId = createId()
): WorkspaceData => {
  if (Array.isArray(value)) {
    return importLegacyProjects(value, deviceId);
  }

  if (!isRecord(value)) {
    return createEmptyWorkspace(deviceId);
  }

  if (hasNestedLegacyIdeas(value.projects) && !Array.isArray(value.ideas)) {
    return importLegacyProjects(value.projects, deviceId);
  }

  const fallbackDate = nowIso();
  const meta = isRecord(value.meta) ? value.meta : {};
  const projects = Array.isArray(value.projects)
    ? value.projects.map((project, index) => normalizeProject(project, index, fallbackDate))
    : [];
  const ideas = Array.isArray(value.ideas)
    ? value.ideas.map((idea, index) => {
        const source = isRecord(idea) ? idea : {};
        const fallbackProjectId = projects[0]?.id || "";
        return normalizeIdea(source, asString(source.projectId, fallbackProjectId), index, fallbackDate);
      })
    : [];

  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    projects,
    ideas,
    meta: {
      appName: "ophan",
      updatedAt: toIsoTimestamp(meta.updatedAt, fallbackDate),
      deviceId: asString(meta.deviceId, deviceId),
    },
  };
};

export const exportWorkspaceJson = (workspace: WorkspaceData) =>
  JSON.stringify(normalizeWorkspace(workspace, workspace.meta.deviceId), null, 2);

export const importWorkspaceJson = (json: string, deviceId = createId()) =>
  normalizeWorkspace(JSON.parse(json), deviceId);

export const createProject = (
  workspace: WorkspaceData,
  input: {
    name: string;
    description?: string;
    category?: ProjectCategory;
    startDate?: string | null;
    dueDate?: string | null;
  }
) => {
  const timestamp = nowIso();
  const project: Project = {
    id: createId(),
    name: input.name.trim() || "Untitled project",
    description: input.description?.trim() || "",
    category: normalizeCategory(input.category),
    startDate: input.startDate || null,
    dueDate: input.dueDate || null,
    pinned: false,
    order: getVisibleProjects(workspace).length,
    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  };

  return {
    workspace: touchWorkspace({
      ...workspace,
      projects: [...workspace.projects, project],
    }, timestamp),
    project,
  };
};

export const updateProject = (
  workspace: WorkspaceData,
  projectId: string,
  patch: Partial<Pick<Project, "name" | "description" | "category" | "startDate" | "dueDate">>
) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    projects: workspace.projects.map((project) =>
      project.id === projectId
        ? {
            ...project,
            name: patch.name !== undefined ? patch.name.trim() || project.name : project.name,
            description:
              patch.description !== undefined ? patch.description.trim() : project.description,
            category:
              patch.category !== undefined ? normalizeCategory(patch.category) : project.category,
            startDate: patch.startDate !== undefined ? patch.startDate || null : project.startDate,
            dueDate: patch.dueDate !== undefined ? patch.dueDate || null : project.dueDate,
            updatedAt: timestamp,
          }
        : project
    ),
  }, timestamp);
};

export const deleteProject = (workspace: WorkspaceData, projectId: string) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    projects: workspace.projects.map((project) =>
      project.id === projectId ? { ...project, deletedAt: timestamp, updatedAt: timestamp } : project
    ),
    ideas: workspace.ideas.map((idea) =>
      idea.projectId === projectId ? { ...idea, deletedAt: timestamp, updatedAt: timestamp } : idea
    ),
  }, timestamp);
};

export const createIdea = (workspace: WorkspaceData, projectId: string, text: string) => {
  const timestamp = nowIso();
  const idea: Idea = {
    id: createId(),
    projectId,
    text: text.trim() || "Untitled idea",
    done: false,
    pinned: false,
    order: getIdeasForProject(workspace, projectId).length,
    createdAt: timestamp,
    updatedAt: timestamp,
    finishedAt: null,
    deletedAt: null,
  };

  return {
    workspace: touchWorkspace({
      ...workspace,
      ideas: [...workspace.ideas, idea],
    }, timestamp),
    idea,
  };
};

export const updateIdea = (
  workspace: WorkspaceData,
  ideaId: string,
  patch: Partial<Pick<Idea, "text">>
) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    ideas: workspace.ideas.map((idea) =>
      idea.id === ideaId
        ? {
            ...idea,
            text: patch.text !== undefined ? patch.text.trim() || idea.text : idea.text,
            updatedAt: timestamp,
          }
        : idea
    ),
  }, timestamp);
};

export const deleteIdea = (workspace: WorkspaceData, ideaId: string) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    ideas: workspace.ideas.map((idea) =>
      idea.id === ideaId ? { ...idea, deletedAt: timestamp, updatedAt: timestamp } : idea
    ),
  }, timestamp);
};

export const toggleIdeaDone = (workspace: WorkspaceData, ideaId: string) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    ideas: workspace.ideas.map((idea) =>
      idea.id === ideaId
        ? {
            ...idea,
            done: !idea.done,
            finishedAt: !idea.done ? timestamp : null,
            updatedAt: timestamp,
          }
        : idea
    ),
  }, timestamp);
};

export const toggleProjectPin = (workspace: WorkspaceData, projectId: string) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    projects: workspace.projects.map((project) =>
      project.id === projectId
        ? { ...project, pinned: !project.pinned, updatedAt: timestamp }
        : project
    ),
  }, timestamp);
};

export const toggleIdeaPin = (workspace: WorkspaceData, ideaId: string) => {
  const timestamp = nowIso();
  return touchWorkspace({
    ...workspace,
    ideas: workspace.ideas.map((idea) =>
      idea.id === ideaId ? { ...idea, pinned: !idea.pinned, updatedAt: timestamp } : idea
    ),
  }, timestamp);
};

const reorder = <T extends { id: string; order: number; updatedAt: string }>(
  items: T[],
  itemId: string,
  direction: -1 | 1,
  timestamp: string
) => {
  const next = [...items];
  const index = next.findIndex((item) => item.id === itemId);
  const targetIndex = index + direction;
  if (index < 0 || targetIndex < 0 || targetIndex >= next.length) return items;
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return next.map((item, order) => ({
    ...item,
    order,
    updatedAt: item.id === itemId || order === index ? timestamp : item.updatedAt,
  }));
};

export const moveProject = (
  workspace: WorkspaceData,
  projectId: string,
  direction: -1 | 1
) => {
  const timestamp = nowIso();
  const visible = getVisibleProjects(workspace);
  const reordered = reorder(visible, projectId, direction, timestamp);
  const byId = new Map(reordered.map((project) => [project.id, project]));
  return touchWorkspace({
    ...workspace,
    projects: workspace.projects.map((project) => byId.get(project.id) || project),
  }, timestamp);
};

export const moveIdea = (
  workspace: WorkspaceData,
  projectId: string,
  ideaId: string,
  direction: -1 | 1
) => {
  const timestamp = nowIso();
  const visible = getIdeasForProject(workspace, projectId);
  const reordered = reorder(visible, ideaId, direction, timestamp);
  const byId = new Map(reordered.map((idea) => [idea.id, idea]));
  return touchWorkspace({
    ...workspace,
    ideas: workspace.ideas.map((idea) => byId.get(idea.id) || idea),
  }, timestamp);
};
