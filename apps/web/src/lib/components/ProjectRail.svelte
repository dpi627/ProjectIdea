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
  import {
    app,
    dropProjectOn,
    getWorkspace,
    nudgeProject,
    togglePinProject,
  } from "../state/app.svelte";
  import Skeleton from "./Skeleton.svelte";
  import { openProjectCreate, openProjectEdit } from "../state/dialogs.svelte";
  import { setCategoryFilter, ui, type CategoryFilter } from "../state/ui.svelte";

  const FILTERS: CategoryFilter[] = ["all", "CI", "MP", "SP", "NA"];

  const projects = $derived(getVisibleProjects(getWorkspace()));

  let dragProjectId: string | null = $state(null);
  let dragOverProjectId: string | null = $state(null);

  const resetDrag = () => {
    dragProjectId = null;
    dragOverProjectId = null;
  };
  const filteredProjects = $derived(
    projects.filter((project) => {
      if (ui.categoryFilter === "all") return true;
      if (ui.categoryFilter === "NA") return !project.category;
      return project.category === ui.categoryFilter;
    })
  );
</script>

<aside class="project-rail" aria-label="Projects" inert={ui.railCollapsed}>
  <div class="rail-inner">
    <section class="panel fill" data-anim="panel">
      <header class="panel-head">
        <span class="panel-head-title">
          <FolderKanban size={16} />
          Projects
          <span class="panel-count">{filteredProjects.length}</span>
        </span>
        <button class="tool-button" type="button" title="New project" onclick={openProjectCreate}>
          <Plus size={16} />
          <span class="sr-only">New project</span>
        </button>
      </header>
      <div class="panel-body">
        <div class="chip-row" role="group" aria-label="Filter by category">
          {#each FILTERS as filter (filter)}
            <button
              class="chip"
              class:active={ui.categoryFilter === filter}
              type="button"
              onclick={() => setCategoryFilter(filter)}
            >
              {filter === "all" ? "All" : filter}
            </button>
          {/each}
        </div>

        <div class="scroll-list">
          {#if app.isLoading}
            <Skeleton count={4} />
          {:else if filteredProjects.length === 0}
            <div class="empty-state compact">
              <p>{projects.length === 0 ? "No projects yet." : "Nothing in this category."}</p>
              <span>
                {projects.length === 0
                  ? "Create one to begin tracking ideas."
                  : "Switch category filters to see more."}
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
                      <span class="pin-indicator" title="Pinned"><Pin size={13} /></span>
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
                <div class="card-actions" aria-label="Project actions">
                  <button
                    class="action-btn"
                    class:is-on={project.pinned}
                    type="button"
                    title={project.pinned ? "Unpin" : "Pin"}
                    onclick={() => togglePinProject(project.id)}
                  >
                    <Pin size={13} />
                    <span class="sr-only">{project.pinned ? "Unpin" : "Pin"}</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title="Edit project"
                    onclick={() => openProjectEdit(project.id)}
                  >
                    <Pencil size={13} />
                    <span class="sr-only">Edit project</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title="Move up"
                    disabled={index === 0}
                    onclick={() => nudgeProject(project.id, -1)}
                  >
                    <ArrowUp size={13} />
                    <span class="sr-only">Move up</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title="Move down"
                    disabled={index === filteredProjects.length - 1}
                    onclick={() => nudgeProject(project.id, 1)}
                  >
                    <ArrowDown size={13} />
                    <span class="sr-only">Move down</span>
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
