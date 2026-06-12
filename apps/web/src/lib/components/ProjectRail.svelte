<script lang="ts">
  import { ArrowDown, ArrowUp, Folder, Pin, PinOff, Plus } from "@lucide/svelte";
  import { getProjectStats, getVisibleProjects } from "@ophan/core";
  import {
    addProject,
    app,
    emptyProjectDraft,
    getWorkspace,
    nudgeProject,
    togglePinProject,
  } from "../state/app.svelte";
  import { ui } from "../state/ui.svelte";

  const projects = $derived(getVisibleProjects(getWorkspace()));

  let draft = $state(emptyProjectDraft());

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    await addProject({ ...draft });
    draft = emptyProjectDraft();
  };
</script>

<aside class="project-rail" aria-label="Projects" inert={ui.railCollapsed}>
  <div class="rail-inner">
  <section class="rail-section new-project">
    <div class="section-title">
      <span><Folder size={16} /> New project</span>
      <strong>{projects.length}</strong>
    </div>
    <form onsubmit={submit}>
      <input bind:value={draft.name} required placeholder="Project name" />
      <textarea bind:value={draft.description} rows="3" placeholder="Short note"></textarea>
      <div class="field-row">
        <select bind:value={draft.category} aria-label="Category">
          <option value="">None</option>
          <option value="CI">CI</option>
          <option value="MP">MP</option>
          <option value="SP">SP</option>
        </select>
        <button class="primary icon-button" type="submit">
          <Plus size={17} />
          <span>Add</span>
        </button>
      </div>
    </form>
  </section>

  <section class="rail-section project-list">
    {#if projects.length === 0}
      <div class="empty-state compact">
        <p>No projects yet.</p>
        <span>Create one to begin tracking ideas.</span>
      </div>
    {:else}
      {#each projects as project, index (project.id)}
        {@const stats = getProjectStats(getWorkspace(), project.id)}
        <article class:active={app.activeProjectId === project.id} class="project-card">
          <button
            class="project-select"
            type="button"
            onclick={() => (app.activeProjectId = project.id)}
          >
            <div>
              <div class="card-title-row">
                <h2>{project.name}</h2>
                {#if project.pinned}<span class="pin-badge">Pinned</span>{/if}
              </div>
              <p>{project.description || "No description"}</p>
            </div>
            <div class="project-card-footer">
              <span>{stats.done}/{stats.total} done</span>
              <span>{stats.percent}%</span>
            </div>
          </button>
          <div class="card-actions" aria-label="Project actions">
            <button type="button" onclick={() => togglePinProject(project.id)}>
              {#if project.pinned}<PinOff size={14} />{:else}<Pin size={14} />{/if}
              <span>{project.pinned ? "Unpin" : "Pin"}</span>
            </button>
            <button
              type="button"
              disabled={index === 0}
              onclick={() => nudgeProject(project.id, -1)}
            >
              <ArrowUp size={14} />
              <span>Up</span>
            </button>
            <button
              type="button"
              disabled={index === projects.length - 1}
              onclick={() => nudgeProject(project.id, 1)}
            >
              <ArrowDown size={14} />
              <span>Down</span>
            </button>
          </div>
        </article>
      {/each}
    {/if}
  </section>
  </div>
</aside>
