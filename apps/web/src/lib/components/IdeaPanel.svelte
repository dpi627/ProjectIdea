<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    Check,
    Circle,
    ListTodo,
    Pencil,
    Pin,
    PinOff,
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
  import {
    addIdea,
    app,
    emptyProjectDraft,
    getWorkspace,
    nudgeIdea,
    removeIdea,
    removeProject,
    saveIdeaText,
    saveProject,
    toggleDone,
    togglePinIdea,
  } from "../state/app.svelte";
  import { formatDate } from "../utils/format";

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

  let formProjectId: string | null = $state(null);
  let form = $state(emptyProjectDraft());

  $effect(() => {
    if (activeProject && activeProject.id !== formProjectId) {
      formProjectId = activeProject.id;
      form = {
        name: activeProject.name,
        description: activeProject.description,
        category: activeProject.category || "",
        startDate: activeProject.startDate || "",
        dueDate: activeProject.dueDate || "",
      };
    }
  });

  let newIdeaText = $state("");
  let editingIdeaId: string | null = $state(null);
  let editingIdeaText = $state("");

  const submitProject = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!activeProject) return;
    await saveProject(activeProject.id, { ...form });
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
</script>

<section class="focus-panel">
  {#if activeProject}
    <div class="panel-header">
      <div>
        <p class="eyebrow">Focused project</p>
        <h2>{activeProject.name}</h2>
      </div>
      <div class="progress-ring" style={`--progress:${stats.percent}%`}>
        <span>{stats.percent}%</span>
      </div>
    </div>

    <form class="project-editor" onsubmit={submitProject}>
      <div class="editor-grid">
        <label>
          Name
          <input bind:value={form.name} required />
        </label>
        <label>
          Category
          <select bind:value={form.category}>
            <option value="">None</option>
            <option value="CI">CI</option>
            <option value="MP">MP</option>
            <option value="SP">SP</option>
          </select>
        </label>
        <label>
          Start
          <input bind:value={form.startDate} type="date" />
        </label>
        <label>
          Due
          <input bind:value={form.dueDate} type="date" />
        </label>
      </div>
      <label>
        Description
        <textarea bind:value={form.description} rows="3"></textarea>
      </label>
      <div class="editor-actions">
        <button class="primary icon-button" type="submit">
          <Save size={17} />
          <span>Save project</span>
        </button>
        <button
          class="danger icon-button"
          type="button"
          onclick={() => activeProject && removeProject(activeProject.id)}
        >
          <Trash2 size={17} />
          <span>Delete project</span>
        </button>
      </div>
    </form>

    <div class="idea-toolbar">
      <form onsubmit={submitIdea}>
        <input bind:value={newIdeaText} placeholder="Capture an idea..." />
        <button class="primary icon-button" type="submit">
          <Plus size={17} />
          <span>Add idea</span>
        </button>
      </form>
      <div class="segmented" role="group" aria-label="Idea filter">
        {#each ["todo", "done", "all"] as filter (filter)}
          <button
            class:active={app.ideaFilter === filter}
            type="button"
            onclick={() => (app.ideaFilter = filter as IdeaFilter)}
          >
            {#if filter === "todo"}<ListTodo size={15} />{/if}
            {#if filter === "done"}<Check size={15} />{/if}
            {#if filter === "all"}<Circle size={15} />{/if}
            {filter}
          </button>
        {/each}
      </div>
    </div>

    <div class="idea-list">
      {#if ideas.length === 0}
        <div class="empty-state">
          <p>No ideas in this view.</p>
          <span>{allIdeas.length === 0 ? "Add the first idea above." : "Switch filters to see more."}</span>
        </div>
      {:else}
        {#each ideas as idea, index (idea.id)}
          <article class:done={idea.done} class="idea-card">
            <button
              class="check-button"
              type="button"
              aria-label={idea.done ? "Mark todo" : "Mark done"}
              onclick={() => toggleDone(idea.id)}
            >
              {#if idea.done}<Check size={17} />{:else}<Circle size={17} />{/if}
            </button>
            <div class="idea-body">
              {#if editingIdeaId === idea.id}
                <form class="idea-edit" onsubmit={(event) => submitIdeaEdit(event, idea.id)}>
                  <input bind:value={editingIdeaText} />
                  <button class="icon-button" type="submit">
                    <Save size={15} />
                    <span>Save</span>
                  </button>
                  <button class="icon-button" type="button" onclick={() => (editingIdeaId = null)}>
                    <X size={15} />
                    <span>Cancel</span>
                  </button>
                </form>
              {:else}
                <p>{idea.text}</p>
                <span>{idea.done ? `Finished ${formatDate(idea.finishedAt)}` : `Created ${formatDate(idea.createdAt)}`}</span>
              {/if}
            </div>
            <div class="idea-actions">
              <button type="button" onclick={() => togglePinIdea(idea.id)}>
                {#if idea.pinned}<PinOff size={14} />{:else}<Pin size={14} />{/if}
                <span>{idea.pinned ? "Unpin" : "Pin"}</span>
              </button>
              <button type="button" onclick={() => startEditingIdea(idea)}>
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                disabled={index === 0}
                onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, -1)}
              >
                <ArrowUp size={14} />
                <span>Up</span>
              </button>
              <button
                type="button"
                disabled={index === ideas.length - 1}
                onclick={() => activeProject && nudgeIdea(activeProject.id, idea.id, 1)}
              >
                <ArrowDown size={14} />
                <span>Down</span>
              </button>
              <button class="danger-text" type="button" onclick={() => removeIdea(idea.id)}>
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </article>
        {/each}
      {/if}
    </div>
  {:else}
    <div class="empty-state large">
      <p>Start with one project.</p>
      <span>Ophan keeps the workspace local first, ready for Google sync later.</span>
    </div>
  {/if}
</section>
