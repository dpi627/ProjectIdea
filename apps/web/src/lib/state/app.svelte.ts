import {
  createEmptyWorkspace,
  createIdea,
  createProject,
  deleteIdea,
  deleteProject,
  exportWorkspaceJson,
  getVisibleProjects,
  importWorkspaceJson,
  moveIdea,
  moveIdeaTo,
  moveProject,
  moveProjectTo,
  toggleIdeaDone,
  toggleIdeaPin,
  toggleProjectPin,
  updateIdea,
  updateProject,
  type IdeaFilter,
  type ProjectCategory,
  type WorkspaceData,
} from "@ophan/core";
import {
  IndexedDbProjectRepository,
  LocalStorageLegacyImporter,
} from "@ophan/storage";
import { downloadText } from "../utils/format";
import { t } from "./i18n.svelte";

const DEVICE_ID_KEY = "ophan.device-id";

const getBrowserStorage = () =>
  typeof localStorage === "undefined" ? null : localStorage;

const createDeviceId = () => {
  const storage = getBrowserStorage();
  const saved = storage?.getItem(DEVICE_ID_KEY);
  if (saved) return saved;
  const next =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `device_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  storage?.setItem(DEVICE_ID_KEY, next);
  return next;
};

export const deviceId = createDeviceId();
const repository = new IndexedDbProjectRepository(deviceId);
const legacyImporter = new LocalStorageLegacyImporter(deviceId);

export type ProjectDraft = {
  name: string;
  description: string;
  category: "" | Exclude<ProjectCategory, null>;
  startDate: string;
  dueDate: string;
};

export const emptyProjectDraft = (): ProjectDraft => ({
  name: "",
  description: "",
  category: "",
  startDate: "",
  dueDate: "",
});

export const app = $state({
  isLoading: true,
  activeProjectId: null as string | null,
  ideaFilter: "todo" as IdeaFilter,
  toast: "",
  legacyAvailable: false,
});

let workspaceState = $state.raw(createEmptyWorkspace(deviceId));

export const getWorkspace = () => workspaceState;

export const showToast = (message: string) => {
  app.toast = message;
  window.setTimeout(() => {
    if (app.toast === message) app.toast = "";
  }, 2600);
};

export const persist = async (next: WorkspaceData, message?: string) => {
  workspaceState = next;
  await repository.saveWorkspace(next);
  if (message) showToast(message);
};

export const init = async () => {
  app.legacyAvailable = legacyImporter.hasLegacyData();
  workspaceState = await repository.loadWorkspace();
  app.activeProjectId = getVisibleProjects(workspaceState)[0]?.id || null;
  app.isLoading = false;
};

export const addProject = async (draft: ProjectDraft) => {
  const result = createProject(workspaceState, {
    name: draft.name,
    description: draft.description,
    category: draft.category || null,
    startDate: draft.startDate || null,
    dueDate: draft.dueDate || null,
  });
  app.activeProjectId = result.project.id;
  await persist(result.workspace, t("toast.projectCreated"));
};

export const saveProject = async (projectId: string, draft: ProjectDraft) => {
  await persist(
    updateProject(workspaceState, projectId, {
      name: draft.name,
      description: draft.description,
      category: draft.category || null,
      startDate: draft.startDate || null,
      dueDate: draft.dueDate || null,
    }),
    t("toast.projectUpdated")
  );
};

export const removeProject = async (projectId: string) => {
  const next = deleteProject(workspaceState, projectId);
  if (app.activeProjectId === projectId) {
    app.activeProjectId = getVisibleProjects(next)[0]?.id || null;
  }
  await persist(next, t("toast.projectRemoved"));
};

export const addIdea = async (projectId: string, text: string) => {
  if (!text.trim()) return;
  const result = createIdea(workspaceState, projectId, text);
  await persist(result.workspace, t("toast.ideaAdded"));
};

export const saveIdeaText = async (ideaId: string, text: string) => {
  await persist(updateIdea(workspaceState, ideaId, { text }), t("toast.ideaUpdated"));
};

export const removeIdea = async (ideaId: string) => {
  await persist(deleteIdea(workspaceState, ideaId), t("toast.ideaRemoved"));
};

export const toggleDone = async (ideaId: string) => {
  await persist(toggleIdeaDone(workspaceState, ideaId));
};

export const reopenIdea = async (ideaId: string) => {
  await persist(toggleIdeaDone(workspaceState, ideaId), t("toast.ideaReopened"));
};

export const togglePinProject = async (projectId: string) => {
  await persist(toggleProjectPin(workspaceState, projectId));
};

export const togglePinIdea = async (ideaId: string) => {
  await persist(toggleIdeaPin(workspaceState, ideaId));
};

export const nudgeProject = async (projectId: string, delta: 1 | -1) => {
  await persist(moveProject(workspaceState, projectId, delta));
};

export const nudgeIdea = async (
  projectId: string,
  ideaId: string,
  delta: 1 | -1
) => {
  await persist(moveIdea(workspaceState, projectId, ideaId, delta));
};

export const dropProjectOn = async (
  projectId: string,
  targetProjectId: string
) => {
  const next = moveProjectTo(workspaceState, projectId, targetProjectId);
  if (next !== workspaceState) await persist(next);
};

export const dropIdeaOn = async (
  projectId: string,
  ideaId: string,
  targetIdeaId: string
) => {
  const next = moveIdeaTo(workspaceState, projectId, ideaId, targetIdeaId);
  if (next !== workspaceState) await persist(next);
};

export const exportData = () => {
  const stamp = new Date().toISOString().slice(0, 10);
  downloadText(`ophan-${stamp}.json`, exportWorkspaceJson(workspaceState));
  showToast(t("toast.exportReady"));
};

export const importFromJson = async (text: string) => {
  const next = importWorkspaceJson(text, deviceId);
  app.activeProjectId = getVisibleProjects(next)[0]?.id || null;
  await persist(next, t("toast.workspaceImported"));
};

export const importLegacy = async () => {
  try {
    const next = legacyImporter.loadLegacyWorkspace();
    app.activeProjectId = getVisibleProjects(next)[0]?.id || null;
    await persist(next, t("toast.legacyImported"));
    app.legacyAvailable = false;
  } catch (error) {
    console.warn("Failed to import legacy workspace", error);
    showToast(t("toast.legacyFailed"));
  }
};

export const clearWorkspace = async () => {
  const next = await repository.clear();
  app.activeProjectId = null;
  await persist(next, t("toast.localCleared"));
};
