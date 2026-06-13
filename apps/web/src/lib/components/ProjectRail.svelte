<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    FolderKanban,
    Pencil,
    Pin,
    Plus,
  } from "@lucide/svelte";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import { getProjectStats, getVisibleProjects } from "@ophan/core";
  import { motionMs } from "../animations/entrance";
  import { t } from "../state/i18n.svelte";
  import {
    app,
    dropProjectOn,
    getWorkspace,
    nudgeProject,
    togglePinProject,
  } from "../state/app.svelte";
  import Skeleton from "./Skeleton.svelte";
  import { openProjectCreate, openProjectEdit } from "../state/dialogs.svelte";
  import {
    toggleCategoryFilter,
    ui,
    type ProjectCategoryFilter,
  } from "../state/ui.svelte";

  const FILTERS: ProjectCategoryFilter[] = ["CI", "MP", "SP", "NA"];

  const projects = $derived(getVisibleProjects(getWorkspace()));

  let dragProjectId: string | null = $state(null);
  let dragOverProjectId: string | null = $state(null);

  const resetDrag = () => {
    dragProjectId = null;
    dragOverProjectId = null;
  };
  const filteredProjects = $derived(
    projects.filter((project) => {
      if (ui.categoryFilters.length === 0) return true;
      if (!project.category) return ui.categoryFilters.includes("NA");
      return ui.categoryFilters.includes(project.category);
    })
  );
</script>

<aside class="project-rail" aria-label={t("projects.label")} inert={ui.railCollapsed}>
  <div class="rail-inner">
    <section class="panel fill" data-anim="panel">
      <header class="panel-head">
        <span class="panel-head-title">
          <FolderKanban size={16} />
          {t("projects.label")}
          <span class="panel-count">{filteredProjects.length}</span>
        </span>
        <button class="tool-button" type="button" title={t("projects.new")} onclick={openProjectCreate}>
          <Plus size={16} />
          <span class="sr-only">{t("projects.new")}</span>
        </button>
      </header>
      <div class="panel-body">
        <div class="chip-row project-filter-chips" role="group" aria-label={t("projects.filterLabel")}>
          {#each FILTERS as filter (filter)}
            <button
              class="chip"
              class:active={ui.categoryFilters.includes(filter)}
              type="button"
              aria-pressed={ui.categoryFilters.includes(filter)}
              onclick={() => toggleCategoryFilter(filter)}
            >
              {filter}
            </button>
          {/each}
        </div>

        <div class="scroll-list">
          {#if app.isLoading}
            <Skeleton count={4} />
          {:else if filteredProjects.length === 0}
            <div class="empty-state compact">
              <p>{projects.length === 0 ? t("projects.none") : t("projects.noneInCategory")}</p>
              <span>
                {projects.length === 0
                  ? t("projects.createHint")
                  : t("projects.filterHint")}
              </span>
            </div>
          {:else}
            {#each filteredProjects as project, index (project.id)}
              {@const stats = getProjectStats(getWorkspace(), project.id)}
              <article
                class="project-card"
                class:active={app.activeProjectId === project.id}
                class:dragging={dragProjectId === project.id}
                class:drag-over={dragOverProjectId === project.id}
                data-anim="card"
                draggable="true"
                animate:flip={{ duration: motionMs(240) }}
                transition:fade={{ duration: motionMs(140) }}
                ondragstart={(event) => {
                  dragProjectId = project.id;
                  if (event.dataTransfer) {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", project.id);
                  }
                }}
                ondragover={(event) => {
                  if (dragProjectId && dragProjectId !== project.id) {
                    event.preventDefault();
                    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
                    dragOverProjectId = project.id;
                  }
                }}
                ondragleave={() => {
                  if (dragOverProjectId === project.id) dragOverProjectId = null;
                }}
                ondrop={(event) => {
                  event.preventDefault();
                  if (dragProjectId && dragProjectId !== project.id) {
                    dropProjectOn(dragProjectId, project.id);
                  }
                  resetDrag();
                }}
                ondragend={resetDrag}
              >
                <button
                  class="project-select"
                  type="button"
                  onclick={() => (app.activeProjectId = project.id)}
                >
                  <div class="card-title-row">
                    {#if project.pinned}
                      <span class="pin-indicator" title={t("projects.pinned")}><Pin size={13} /></span>
                    {/if}
                    <h3>{project.name}</h3>
                    {#if project.category}
                      <span class="category-badge">{project.category}</span>
                    {/if}
                  </div>
                  {#if project.description}
                    <p class="project-desc">{project.description}</p>
                  {/if}
                  <div class="project-meta">
                    <div class="progress-track">
                      <div class="progress-fill" style={`width:${stats.percent}%`}></div>
                    </div>
                    <span class="mono">{stats.done}/{stats.total}</span>
                  </div>
                </button>
                <div class="card-actions" aria-label={t("projects.label")}>
                  <button
                    class="action-btn"
                    class:is-on={project.pinned}
                    type="button"
                    title={project.pinned ? t("common.unpin") : t("common.pin")}
                    onclick={() => togglePinProject(project.id)}
                  >
                    <Pin size={13} />
                    <span class="sr-only">{project.pinned ? t("common.unpin") : t("common.pin")}</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title={t("idea.editProject")}
                    onclick={() => openProjectEdit(project.id)}
                  >
                    <Pencil size={13} />
                    <span class="sr-only">{t("idea.editProject")}</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title={t("common.moveUp")}
                    disabled={index === 0}
                    onclick={() => nudgeProject(project.id, -1)}
                  >
                    <ArrowUp size={13} />
                    <span class="sr-only">{t("common.moveUp")}</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title={t("common.moveDown")}
                    disabled={index === filteredProjects.length - 1}
                    onclick={() => nudgeProject(project.id, 1)}
                  >
                    <ArrowDown size={13} />
                    <span class="sr-only">{t("common.moveDown")}</span>
                  </button>
                </div>
              </article>
            {/each}
          {/if}
        </div>
      </div>
    </section>
  </div>
</aside>
