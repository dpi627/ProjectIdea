<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    Check,
    Circle,
    Pencil,
    Pin,
    Plus,
    Save,
    Trash2,
    X,
  } from "@lucide/svelte";
  import {
    getFilteredIdeas,
    getIdeasForProject,
    getProjectStats,
    getVisibleProjects,
    type Idea,
    type IdeaFilter,
  } from "@ophan/core";
  import { flip } from "svelte/animate";
  import { slide } from "svelte/transition";
  import { motionMs } from "../animations/entrance";
  import {
    addIdea,
    app,
    dropIdeaOn,
    getWorkspace,
    nudgeIdea,
    removeIdea,
    removeProject,
    saveIdeaText,
    toggleDone,
    togglePinIdea,
  } from "../state/app.svelte";
  import Skeleton from "./Skeleton.svelte";
  import {
    openConfirm,
    openProjectCreate,
    openProjectEdit,
  } from "../state/dialogs.svelte";
  import { formatDate } from "../utils/format";
  import { formatLocale, i18n, t } from "../state/i18n.svelte";

  const FILTERS: IdeaFilter[] = ["todo", "done", "all"];

  const workspace = $derived(getWorkspace());
  const projects = $derived(getVisibleProjects(workspace));
  const activeProject = $derived(
    app.activeProjectId
      ? projects.find((project) => project.id === app.activeProjectId) ?? null
      : null
  );
  const allIdeas = $derived(
    activeProject ? getIdeasForProject(workspace, activeProject.id) : []
  );
  const ideas = $derived(
    activeProject
      ? getFilteredIdeas(workspace, activeProject.id, app.ideaFilter)
      : []
  );
  const stats = $derived(
    activeProject
      ? getProjectStats(workspace, activeProject.id)
      : { total: 0, done: 0, todo: 0, percent: 0 }
  );

  const filterCount = (filter: IdeaFilter) =>
    filter === "todo" ? stats.todo : filter === "done" ? stats.done : stats.total;
  const filterLabel = (filter: IdeaFilter) =>
    filter === "todo"
      ? t("idea.filter.todo")
      : filter === "done"
        ? t("idea.filter.done")
        : t("idea.filter.all");

  let newIdeaText = $state("");
  let editingIdeaId: string | null = $state(null);
  let editingIdeaText = $state("");

  let dragIdeaId: string | null = $state(null);
  let dragOverIdeaId: string | null = $state(null);

  const resetDrag = () => {
    dragIdeaId = null;
    dragOverIdeaId = null;
  };

  const submitIdea = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!activeProject) return;
    await addIdea(activeProject.id, newIdeaText);
    newIdeaText = "";
  };

  const startEditingIdea = (idea: Idea) => {
    editingIdeaId = idea.id;
    editingIdeaText = idea.text;
  };

  const submitIdeaEdit = async (event: SubmitEvent, ideaId: string) => {
    event.preventDefault();
    await saveIdeaText(ideaId, editingIdeaText);
    editingIdeaId = null;
    editingIdeaText = "";
  };

  const confirmDeleteProject = () => {
    const project = activeProject;
    if (!project) return;
    openConfirm({
      title: t("idea.deleteProjectTitle"),
      message: t("idea.deleteProjectMessage", { projectName: project.name }),
      confirmText: t("idea.deleteProject"),
      onConfirm: () => removeProject(project.id),
    });
  };

  const formatIdeaDate = (value: string | null) =>
    formatDate(value, formatLocale(i18n.locale), t("format.noDate"));
</script>

<section class="focus-panel panel" data-anim="panel">
  {#if app.isLoading}
    <header class="focus-head">
      <Skeleton variant="line" count={2} />
    </header>
    <div class="idea-scroll">
      <Skeleton count={4} />
    </div>
  {:else if activeProject}
    <header class="focus-head">
      <div class="focus-title-row">
        <div class="focus-title">
          <h2>{activeProject.name}</h2>
          {#if activeProject.category}
            <span class="category-badge">{activeProject.category}</span>
          {/if}
        </div>
        <div class="focus-title-actions">
          <button
            class="action-btn"
            type="button"
            title={t("idea.editProject")}
            onclick={() => activeProject && openProjectEdit(activeProject.id)}
          >
            <Pencil size={14} />
            <span class="sr-only">{t("idea.editProject")}</span>
          </button>
          <button
            class="action-btn is-danger"
            type="button"
            title={t("idea.deleteProject")}
            onclick={confirmDeleteProject}
          >
            <Trash2 size={14} />
            <span class="sr-only">{t("idea.deleteProject")}</span>
          </button>
        </div>
      </div>
      {#if activeProject.description}
        <p class="focus-desc">{activeProject.description}</p>
      {/if}
      {#if activeProject.startDate || activeProject.dueDate}
        <div class="focus-sub">
          {#if activeProject.startDate}
            <span>{t("idea.start")} <strong>{activeProject.startDate}</strong></span>
          {/if}
          {#if activeProject.dueDate}
            <span>{t("idea.due")} <strong>{activeProject.dueDate}</strong></span>
          {/if}
        </div>
      {/if}
      <div class="focus-progress">
        <div class="progress-track">
          <div class="progress-fill" style={`width:${stats.percent}%`}></div>
        </div>
        <span class="mono">
          <strong>{stats.percent}%</strong> · {t("idea.doneCount", { done: stats.done, total: stats.total })}
        </span>
      </div>
    </header>

    <div class="focus-tools">
      <form class="idea-form" onsubmit={submitIdea}>
        <input bind:value={newIdeaText} placeholder={t("idea.placeholder")} />
        <button class="primary" type="submit">
          <Plus size={16} />
          <span>{t("idea.add")}</span>
        </button>
      </form>
      <div class="filter-row">
        <div class="segmented" role="group" aria-label={t("idea.filterLabel")}>
          {#each FILTERS as filter (filter)}
            <button
              class:active={app.ideaFilter === filter}
              type="button"
              onclick={() => (app.ideaFilter = filter)}
            >
              {filterLabel(filter)}
              <span class="count">{filterCount(filter)}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="idea-scroll">
      {#if ideas.length === 0}
        <div class="empty-state">
          <p>{t("idea.empty")}</p>
          <span>{allIdeas.length === 0 ? t("idea.emptyFirst") : t("idea.emptySwitch")}</span>
        </div>
      {:else}
        {#each ideas as idea, index (idea.id)}
          <article
            class="idea-card"
            class:done={idea.done}
            class:dragging={dragIdeaId === idea.id}
            class:drag-over={dragOverIdeaId === idea.id}
            data-anim="card"
            draggable={editingIdeaId !== idea.id}
            animate:flip={{ duration: motionMs(220) }}
            transition:slide={{ duration: motionMs(180) }}
            ondragstart={(event) => {
              dragIdeaId = idea.id;
              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", idea.id);
              }
            }}
            ondragover={(event) => {
              if (dragIdeaId && dragIdeaId !== idea.id) {
                event.preventDefault();
                if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
                dragOverIdeaId = idea.id;
              }
            }}
            ondragleave={() => {
              if (dragOverIdeaId === idea.id) dragOverIdeaId = null;
            }}
            ondrop={(event) => {
              event.preventDefault();
              if (activeProject && dragIdeaId && dragIdeaId !== idea.id) {
                dropIdeaOn(activeProject.id, dragIdeaId, idea.id);
              }
              resetDrag();
            }}
            ondragend={resetDrag}
          >
            <button
              class="check-button"
              type="button"
              aria-label={idea.done ? t("idea.markTodo") : t("idea.markDone")}
              onclick={() => toggleDone(idea.id)}
            >
              {#if idea.done}<Check size={16} />{:else}<Circle size={16} />{/if}
            </button>
            <div class="idea-body">
              {#if editingIdeaId === idea.id}
                <form class="idea-edit" onsubmit={(event) => submitIdeaEdit(event, idea.id)}>
                  <input bind:value={editingIdeaText} />
                  <button class="action-btn" type="submit" title={t("common.save")}>
                    <Save size={14} />
                    <span class="sr-only">{t("common.save")}</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title={t("common.cancel")}
                    onclick={() => (editingIdeaId = null)}
                  >
                    <X size={14} />
                    <span class="sr-only">{t("common.cancel")}</span>
                  </button>
                </form>
              {:else}
                <p class="idea-text">{idea.text}</p>
                <span class="idea-stamp">
                  {idea.done
                    ? t("idea.finished", { date: formatIdeaDate(idea.finishedAt) })
                    : t("idea.created", { date: formatIdeaDate(idea.createdAt) })}
                </span>
              {/if}
            </div>
            {#if editingIdeaId !== idea.id}
              <div class="card-actions" aria-label={t("idea.actions")}>
                <button
                  class="action-btn"
                  class:is-on={idea.pinned}
                  type="button"
                  title={idea.pinned ? t("common.unpin") : t("common.pin")}
                  onclick={() => togglePinIdea(idea.id)}
                >
                  <Pin size={13} />
                  <span class="sr-only">{idea.pinned ? t("common.unpin") : t("common.pin")}</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title={t("idea.edit")}
                  onclick={() => startEditingIdea(idea)}
                >
                  <Pencil size={13} />
                  <span class="sr-only">{t("idea.edit")}</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title={t("common.moveUp")}
                  disabled={index === 0}
                  onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, -1)}
                >
                  <ArrowUp size={13} />
                  <span class="sr-only">{t("common.moveUp")}</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title={t("common.moveDown")}
                  disabled={index === ideas.length - 1}
                  onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, 1)}
                >
                  <ArrowDown size={13} />
                  <span class="sr-only">{t("common.moveDown")}</span>
                </button>
                <button
                  class="action-btn is-danger"
                  type="button"
                  title={t("idea.delete")}
                  onclick={() => removeIdea(idea.id)}
                >
                  <Trash2 size={13} />
                  <span class="sr-only">{t("idea.delete")}</span>
                </button>
              </div>
            {/if}
          </article>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="empty-state large">
      <p>{t("idea.startProject")}</p>
      <span>{t("idea.localFirst")}</span>
      <button class="primary" type="button" onclick={openProjectCreate}>
        <Plus size={16} />
        <span>{t("projects.new")}</span>
      </button>
    </div>
  {/if}
</section>
