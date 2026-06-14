export type ProjectDialogState =
  | { mode: "create" }
  | { mode: "edit"; projectId: string };

export type TechDocsChapterId = "design-system";

export type TechDocsDialogState = {
  chapterId: TechDocsChapterId;
};

export type ConfirmOptions = {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void | Promise<void>;
};

export const dialogs = $state({
  project: null as ProjectDialogState | null,
  techDocs: null as TechDocsDialogState | null,
  confirm: null as ConfirmOptions | null,
});

export const openProjectCreate = () => {
  dialogs.project = { mode: "create" };
};

export const openProjectEdit = (projectId: string) => {
  dialogs.project = { mode: "edit", projectId };
};

export const closeProjectDialog = () => {
  dialogs.project = null;
};

export const openTechDocs = (chapterId: TechDocsChapterId = "design-system") => {
  dialogs.techDocs = { chapterId };
};

export const setTechDocsChapter = (chapterId: TechDocsChapterId) => {
  if (dialogs.techDocs) {
    dialogs.techDocs.chapterId = chapterId;
  }
};

export const closeTechDocs = () => {
  dialogs.techDocs = null;
};

export const openConfirm = (options: ConfirmOptions) => {
  dialogs.confirm = options;
};

export const closeConfirm = () => {
  dialogs.confirm = null;
};
