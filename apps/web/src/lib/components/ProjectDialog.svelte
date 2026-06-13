<script lang="ts">
  import { Trash2, X } from "@lucide/svelte";
  import { getVisibleProjects } from "@ophan/core";
  import {
    addProject,
    emptyProjectDraft,
    getWorkspace,
    removeProject,
    saveProject,
  } from "../state/app.svelte";
  import {
    closeProjectDialog,
    dialogs,
    openConfirm,
  } from "../state/dialogs.svelte";
  import { t } from "../state/i18n.svelte";

  let el: HTMLDialogElement | undefined = $state();
  let draft = $state(emptyProjectDraft());

  const editingProject = $derived.by(() => {
    const state = dialogs.project;
    if (!state || state.mode !== "edit") return null;
    return (
      getVisibleProjects(getWorkspace()).find(
        (project) => project.id === state.projectId
      ) ?? null
    );
  });

  $effect(() => {
    const state = dialogs.project;
    if (state && el && !el.open) {
      if (state.mode === "edit" && editingProject) {
        draft = {
          name: editingProject.name,
          description: editingProject.description,
          category: editingProject.category || "",
          startDate: editingProject.startDate || "",
          dueDate: editingProject.dueDate || "",
        };
      } else {
        draft = emptyProjectDraft();
      }
      el.showModal();
    } else if (!state && el?.open) {
      el.close();
    }
  });

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    const state = dialogs.project;
    if (!state) return;
    if (state.mode === "edit") {
      await saveProject(state.projectId, { ...draft });
    } else {
      await addProject({ ...draft });
    }
    closeProjectDialog();
  };

  const confirmDelete = () => {
    const project = editingProject;
    if (!project) return;
    openConfirm({
      title: t("idea.deleteProjectTitle"),
      message: t("idea.deleteProjectMessage", { projectName: project.name }),
      confirmText: t("idea.deleteProject"),
      onConfirm: async () => {
        await removeProject(project.id);
        closeProjectDialog();
      },
    });
  };
</script>

<dialog
  bind:this={el}
  onclose={() => {
    if (dialogs.project) closeProjectDialog();
  }}
>
  {#if dialogs.project}
    <div class="dialog-head">
      <h2>{dialogs.project.mode === "edit" ? t("dialog.project.edit") : t("dialog.project.new")}</h2>
      <button class="action-btn" type="button" aria-label={t("common.close")} onclick={closeProjectDialog}>
        <X size={15} />
      </button>
    </div>
    <form class="dialog-body" onsubmit={submit}>
      <label>
        {t("dialog.project.name")}
        <input bind:value={draft.name} required placeholder={t("dialog.project.namePlaceholder")} />
      </label>
      <label>
        {t("dialog.project.description")}
        <textarea bind:value={draft.description} rows="3" placeholder={t("dialog.project.descriptionPlaceholder")}></textarea>
      </label>
      <label>
        {t("dialog.project.category")}
        <select bind:value={draft.category}>
          <option value="">{t("dialog.project.none")}</option>
          <option value="CI">CI</option>
          <option value="MP">MP</option>
          <option value="SP">SP</option>
        </select>
      </label>
      <div class="dialog-grid">
        <label>
          {t("dialog.project.start")}
          <input bind:value={draft.startDate} type="date" />
        </label>
        <label>
          {t("dialog.project.due")}
          <input bind:value={draft.dueDate} type="date" />
        </label>
      </div>
      <div class="dialog-actions">
        {#if dialogs.project.mode === "edit"}
          <button class="danger" type="button" onclick={confirmDelete}>
            <Trash2 size={15} />
            <span>{t("common.delete")}</span>
          </button>
        {/if}
        <span class="spacer"></span>
        <button class="ghost" type="button" onclick={closeProjectDialog}>{t("common.cancel")}</button>
        <button class="primary" type="submit">
          {dialogs.project.mode === "edit" ? t("dialog.project.save") : t("dialog.project.create")}
        </button>
      </div>
    </form>
  {/if}
</dialog>
