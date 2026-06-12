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
      title: "Delete project?",
      message: `"${project.name}" and all of its ideas will be removed.`,
      confirmText: "Delete project",
      onConfirm: () => removeProject(project.id),
    });
  };
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
            title="Edit project"
            onclick={() => activeProject && openProjectEdit(activeProject.id)}
          >
            <Pencil size={14} />
            <span class="sr-only">Edit project</span>
          </button>
          <button
            class="action-btn is-danger"
            type="button"
            title="Delete project"
            onclick={confirmDeleteProject}
          >
            <Trash2 size={14} />
            <span class="sr-only">Delete project</span>
          </button>
        </div>
      </div>
      {#if activeProject.description}
        <p class="focus-desc">{activeProject.description}</p>
      {/if}
      {#if activeProject.startDate || activeProject.dueDate}
        <div class="focus-sub">
          {#if activeProject.startDate}
            <span>Start <strong>{activeProject.startDate}</strong></span>
          {/if}
          {#if activeProject.dueDate}
            <span>Due <strong>{activeProject.dueDate}</strong></span>
          {/if}
        </div>
      {/if}
      <div class="focus-progress">
        <div class="progress-track">
          <div class="progress-fill" style={`width:${stats.percent}%`}></div>
        </div>
        <span class="mono"><strong>{stats.percent}%</strong> · {stats.done}/{stats.total} done</span>
      </div>
    </header>

    <div class="focus-tools">
      <form class="idea-form" onsubmit={submitIdea}>
        <input bind:value={newIdeaText} placeholder="Capture an idea..." />
        <button class="primary" type="submit">
          <Plus size={16} />
          <span>Add</span>
        </button>
      </form>
      <div class="filter-row">
        <div class="segmented" role="group" aria-label="Idea filter">
          {#each FILTERS as filter (filter)}
            <button
              class:active={app.ideaFilter === filter}
              type="button"
              onclick={() => (app.ideaFilter = filter)}
            >
              {filter}
              <span class="count">{filterCount(filter)}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <div class="idea-scroll">
      {#if ideas.length === 0}
        <div class="empty-state">
          <p>No ideas in this view.</p>
          <span>{allIdeas.length === 0 ? "Add the first idea above." : "Switch filters to see more."}</span>
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
              aria-label={idea.done ? "Mark todo" : "Mark done"}
              onclick={() => toggleDone(idea.id)}
            >
              {#if idea.done}<Check size={16} />{:else}<Circle size={16} />{/if}
            </button>
            <div class="idea-body">
              {#if editingIdeaId === idea.id}
                <form class="idea-edit" onsubmit={(event) => submitIdeaEdit(event, idea.id)}>
                  <input bind:value={editingIdeaText} />
                  <button class="action-btn" type="submit" title="Save">
                    <Save size={14} />
                    <span class="sr-only">Save</span>
                  </button>
                  <button
                    class="action-btn"
                    type="button"
                    title="Cancel"
                    onclick={() => (editingIdeaId = null)}
                  >
                    <X size={14} />
                    <span class="sr-only">Cancel</span>
                  </button>
                </form>
              {:else}
                <p class="idea-text">{idea.text}</p>
                <span class="idea-stamp">
                  {idea.done
                    ? `Finished ${formatDate(idea.finishedAt)}`
                    : `Created ${formatDate(idea.createdAt)}`}
                </span>
              {/if}
            </div>
            {#if editingIdeaId !== idea.id}
              <div class="card-actions" aria-label="Idea actions">
                <button
                  class="action-btn"
                  class:is-on={idea.pinned}
                  type="button"
                  title={idea.pinned ? "Unpin" : "Pin"}
                  onclick={() => togglePinIdea(idea.id)}
                >
                  <Pin size={13} />
                  <span class="sr-only">{idea.pinned ? "Unpin" : "Pin"}</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title="Edit idea"
                  onclick={() => startEditingIdea(idea)}
                >
                  <Pencil size={13} />
                  <span class="sr-only">Edit idea</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title="Move up"
                  disabled={index === 0}
                  onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, -1)}
                >
                  <ArrowUp size={13} />
                  <span class="sr-only">Move up</span>
                </button>
                <button
                  class="action-btn"
                  type="button"
                  title="Move down"
                  disabled={index === ideas.length - 1}
                  onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, 1)}
                >
                  <ArrowDown size={13} />
                  <span class="sr-only">Move down</span>
                </button>
                <button
                  class="action-btn is-danger"
                  type="button"
                  title="Delete idea"
                  onclick={() => removeIdea(idea.id)}
                >
                  <Trash2 size={13} />
                  <span class="sr-only">Delete idea</span>
                </button>
              </div>
            {/if}
          </article>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="empty-state large">
      <p>Start with one project.</p>
      <span>Ophan keeps the workspace local first, ready for Google sync later.</span>
      <button class="primary" type="button" onclick={openProjectCreate}>
        <Plus size={16} />
        <span>New project</span>
      </button>
    </div>
  {/if}
</section>
