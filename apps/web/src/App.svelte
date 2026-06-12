<script lang="ts">
  import { onMount } from "svelte";
  import {
    createEmptyWorkspace,
    createIdea,
    createProject,
    deleteIdea,
    deleteProject,
    exportWorkspaceJson,
    getCompletionLog,
    getFilteredIdeas,
    getIdeasForProject,
    getProjectStats,
    getVisibleProjects,
    importWorkspaceJson,
    moveIdea,
    moveProject,
    toggleIdeaDone,
    toggleIdeaPin,
    toggleProjectPin,
    updateIdea,
    updateProject,
    type Idea,
    type IdeaFilter,
    type Project,
    type ProjectCategory,
    type WorkspaceData,
  } from "@ophan/core";
  import {
    IndexedDbProjectRepository,
    LocalStorageLegacyImporter,
  } from "@ophan/storage";

  const DEVICE_ID_KEY = "ophan.device-id";
  const THEME_KEY = "ophan.theme";
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

  const formatDate = (value: string | null) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No date";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const downloadText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deviceId = createDeviceId();
  const repository = new IndexedDbProjectRepository(deviceId);
  const legacyImporter = new LocalStorageLegacyImporter(deviceId);

  let workspace: WorkspaceData = createEmptyWorkspace(deviceId);
  let isLoading = true;
  let activeProjectId: string | null = null;
  let ideaFilter: IdeaFilter = "todo";
  let toast = "";
  let importFileInput: HTMLInputElement;
  let legacyAvailable = false;
  let theme: "light" | "dark" = "light";

  let projects: Project[] = [];
  let activeProject: Project | null = null;
  let activeIdeas: Idea[] = [];
  let allActiveIdeas: Idea[] = [];
  let activeStats = { total: 0, done: 0, todo: 0, percent: 0 };
  let completionLog = getCompletionLog(workspace);

  let newProject = {
    name: "",
    description: "",
    category: "" as "" | Exclude<ProjectCategory, null>,
    startDate: "",
    dueDate: "",
  };
  let projectFormProjectId: string | null = null;
  let projectForm = {
    name: "",
    description: "",
    category: "" as "" | Exclude<ProjectCategory, null>,
    startDate: "",
    dueDate: "",
  };
  let newIdeaText = "";
  let editingIdeaId: string | null = null;
  let editingIdeaText = "";

  $: projects = getVisibleProjects(workspace);
  $: activeProject = activeProjectId
    ? projects.find((project) => project.id === activeProjectId) || null
    : null;
  $: allActiveIdeas = activeProject
    ? getIdeasForProject(workspace, activeProject.id)
    : [];
  $: activeIdeas = activeProject
    ? getFilteredIdeas(workspace, activeProject.id, ideaFilter)
    : [];
  $: activeStats = activeProject
    ? getProjectStats(workspace, activeProject.id)
    : { total: 0, done: 0, todo: 0, percent: 0 };
  $: completionLog = getCompletionLog(workspace);
  $: if (activeProject && activeProject.id !== projectFormProjectId) {
    projectFormProjectId = activeProject.id;
    projectForm = {
      name: activeProject.name,
      description: activeProject.description,
      category: activeProject.category || "",
      startDate: activeProject.startDate || "",
      dueDate: activeProject.dueDate || "",
    };
  }

  onMount(async () => {
    const savedTheme = getBrowserStorage()?.getItem(THEME_KEY);
    theme = savedTheme === "dark" ? "dark" : "light";
    applyTheme(theme);
    legacyAvailable = legacyImporter.hasLegacyData();
    workspace = await repository.loadWorkspace();
    activeProjectId = getVisibleProjects(workspace)[0]?.id || null;
    isLoading = false;
  });

  const showToast = (message: string) => {
    toast = message;
    window.setTimeout(() => {
      if (toast === message) toast = "";
    }, 2600);
  };

  const persist = async (next: WorkspaceData, message?: string) => {
    workspace = next;
    await repository.saveWorkspace(next);
    if (message) showToast(message);
  };

  const applyTheme = (next: "light" | "dark") => {
    theme = next;
    document.documentElement.dataset.theme = next;
    getBrowserStorage()?.setItem(THEME_KEY, next);
  };

  const addProject = async () => {
    const result = createProject(workspace, {
      name: newProject.name,
      description: newProject.description,
      category: newProject.category || null,
      startDate: newProject.startDate || null,
      dueDate: newProject.dueDate || null,
    });
    newProject = {
      name: "",
      description: "",
      category: "",
      startDate: "",
      dueDate: "",
    };
    activeProjectId = result.project.id;
    await persist(result.workspace, "Project created.");
  };

  const saveActiveProject = async () => {
    if (!activeProject) return;
    await persist(
      updateProject(workspace, activeProject.id, {
        name: projectForm.name,
        description: projectForm.description,
        category: projectForm.category || null,
        startDate: projectForm.startDate || null,
        dueDate: projectForm.dueDate || null,
      }),
      "Project updated."
    );
  };

  const removeActiveProject = async () => {
    if (!activeProject) return;
    const next = deleteProject(workspace, activeProject.id);
    const remaining = getVisibleProjects(next);
    activeProjectId = remaining[0]?.id || null;
    await persist(next, "Project removed.");
  };

  const addIdea = async () => {
    if (!activeProject || !newIdeaText.trim()) return;
    const result = createIdea(workspace, activeProject.id, newIdeaText);
    newIdeaText = "";
    await persist(result.workspace, "Idea added.");
  };

  const startEditingIdea = (idea: Idea) => {
    editingIdeaId = idea.id;
    editingIdeaText = idea.text;
  };

  const saveIdea = async (ideaId: string) => {
    await persist(updateIdea(workspace, ideaId, { text: editingIdeaText }), "Idea updated.");
    editingIdeaId = null;
    editingIdeaText = "";
  };

  const exportData = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(`ophan-${stamp}.json`, exportWorkspaceJson(workspace));
    showToast("Export ready.");
  };

  const importData = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const text = await file.text();
    const next = importWorkspaceJson(text, deviceId);
    activeProjectId = getVisibleProjects(next)[0]?.id || null;
    await persist(next, "Workspace imported.");
    input.value = "";
  };

  const importLegacy = async () => {
    const next = legacyImporter.loadLegacyWorkspace();
    activeProjectId = getVisibleProjects(next)[0]?.id || null;
    await persist(next, "Legacy data imported.");
  };

  const clearLocalWorkspace = async () => {
    const next = await repository.clear();
    activeProjectId = null;
    await persist(next, "Local workspace cleared.");
  };
</script>

<svelte:head>
  <title>Ophan</title>
</svelte:head>

<div class="app-shell">
  <header class="topbar">
    <div class="brand">
      <div class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="25" />
          <circle cx="32" cy="32" r="10" />
          <path d="M32 7v50M7 32h50M14 14l36 36M50 14 14 50" />
        </svg>
      </div>
      <div>
        <p class="eyebrow">Local-first workspace</p>
        <h1>Ophan</h1>
      </div>
    </div>
    <div class="topbar-actions">
      <button class="ghost" type="button" on:click={exportData}>Export</button>
      <button class="ghost" type="button" on:click={() => importFileInput.click()}>Import</button>
      <button class="theme-button" type="button" on:click={() => applyTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <input
        bind:this={importFileInput}
        class="hidden-input"
        type="file"
        accept="application/json,.json"
        on:change={importData}
      />
    </div>
  </header>

  {#if isLoading}
    <main class="loading-panel">
      <span class="orbit-loader" aria-hidden="true"></span>
      <p>Opening local workspace...</p>
    </main>
  {:else}
    <main class="workspace-grid">
      <aside class="project-rail" aria-label="Projects">
        <section class="rail-section new-project">
          <div class="section-title">
            <span>New project</span>
            <strong>{projects.length}</strong>
          </div>
          <form on:submit|preventDefault={addProject}>
            <input bind:value={newProject.name} required placeholder="Project name" />
            <textarea bind:value={newProject.description} rows="3" placeholder="Short note"></textarea>
            <div class="field-row">
              <select bind:value={newProject.category} aria-label="Category">
                <option value="">None</option>
                <option value="CI">CI</option>
                <option value="MP">MP</option>
                <option value="SP">SP</option>
              </select>
              <button class="primary" type="submit">Add</button>
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
              {@const stats = getProjectStats(workspace, project.id)}
              <article class:active={activeProject?.id === project.id} class="project-card">
                <button
                  class="project-select"
                  type="button"
                  on:click={() => (activeProjectId = project.id)}
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
                  <button type="button" on:click={() => persist(toggleProjectPin(workspace, project.id))}>
                    {project.pinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    type="button"
                    disabled={index === 0}
                    on:click={() => persist(moveProject(workspace, project.id, -1))}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1}
                    on:click={() => persist(moveProject(workspace, project.id, 1))}
                  >
                    Down
                  </button>
                </div>
              </article>
            {/each}
          {/if}
        </section>
      </aside>

      <section class="focus-panel">
        {#if activeProject}
          <div class="panel-header">
            <div>
              <p class="eyebrow">Focused project</p>
              <h2>{activeProject.name}</h2>
            </div>
            <div class="progress-ring" style={`--progress:${activeStats.percent}%`}>
              <span>{activeStats.percent}%</span>
            </div>
          </div>

          <form class="project-editor" on:submit|preventDefault={saveActiveProject}>
            <div class="editor-grid">
              <label>
                Name
                <input bind:value={projectForm.name} required />
              </label>
              <label>
                Category
                <select bind:value={projectForm.category}>
                  <option value="">None</option>
                  <option value="CI">CI</option>
                  <option value="MP">MP</option>
                  <option value="SP">SP</option>
                </select>
              </label>
              <label>
                Start
                <input bind:value={projectForm.startDate} type="date" />
              </label>
              <label>
                Due
                <input bind:value={projectForm.dueDate} type="date" />
              </label>
            </div>
            <label>
              Description
              <textarea bind:value={projectForm.description} rows="3"></textarea>
            </label>
            <div class="editor-actions">
              <button class="primary" type="submit">Save project</button>
              <button class="danger" type="button" on:click={removeActiveProject}>Delete project</button>
            </div>
          </form>

          <div class="idea-toolbar">
            <form on:submit|preventDefault={addIdea}>
              <input bind:value={newIdeaText} placeholder="Capture an idea..." />
              <button class="primary" type="submit">Add idea</button>
            </form>
            <div class="segmented" role="group" aria-label="Idea filter">
              {#each ["todo", "done", "all"] as filter}
                <button
                  class:active={ideaFilter === filter}
                  type="button"
                  on:click={() => (ideaFilter = filter as IdeaFilter)}
                >
                  {filter}
                </button>
              {/each}
            </div>
          </div>

          <div class="idea-list">
            {#if activeIdeas.length === 0}
              <div class="empty-state">
                <p>No ideas in this view.</p>
                <span>{allActiveIdeas.length === 0 ? "Add the first idea above." : "Switch filters to see more."}</span>
              </div>
            {:else}
              {#each activeIdeas as idea, index (idea.id)}
                <article class:done={idea.done} class="idea-card">
                  <button
                    class="check-button"
                    type="button"
                    aria-label={idea.done ? "Mark todo" : "Mark done"}
                    on:click={() => persist(toggleIdeaDone(workspace, idea.id))}
                  >
                    {idea.done ? "✓" : ""}
                  </button>
                  <div class="idea-body">
                    {#if editingIdeaId === idea.id}
                      <form class="idea-edit" on:submit|preventDefault={() => saveIdea(idea.id)}>
                        <input bind:value={editingIdeaText} />
                        <button type="submit">Save</button>
                        <button type="button" on:click={() => (editingIdeaId = null)}>Cancel</button>
                      </form>
                    {:else}
                      <p>{idea.text}</p>
                      <span>{idea.done ? `Finished ${formatDate(idea.finishedAt)}` : `Created ${formatDate(idea.createdAt)}`}</span>
                    {/if}
                  </div>
                  <div class="idea-actions">
                    <button type="button" on:click={() => persist(toggleIdeaPin(workspace, idea.id))}>
                      {idea.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button type="button" on:click={() => startEditingIdea(idea)}>Edit</button>
                    <button
                      type="button"
                      disabled={index === 0}
                      on:click={() => activeProject && persist(moveIdea(workspace, activeProject.id, idea.id, -1))}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      disabled={index === activeIdeas.length - 1}
                      on:click={() => activeProject && persist(moveIdea(workspace, activeProject.id, idea.id, 1))}
                    >
                      Down
                    </button>
                    <button class="danger-text" type="button" on:click={() => persist(deleteIdea(workspace, idea.id), "Idea removed.")}>
                      Delete
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

      <aside class="insight-panel">
        <section class="sync-card">
          <p class="eyebrow">Storage</p>
          <h2>Local first</h2>
          <p>
            Saved in IndexedDB on this device. The repository boundary is ready
            for a future Google Sheets adapter.
          </p>
          <div class="sync-actions">
            {#if legacyAvailable}
              <button class="ghost" type="button" on:click={importLegacy}>Import legacy static data</button>
            {/if}
            <button class="ghost" type="button" on:click={clearLocalWorkspace}>Clear local data</button>
          </div>
        </section>

        <section class="log-card">
          <div class="section-title">
            <span>Completion log</span>
            <strong>{completionLog.length}</strong>
          </div>
          {#if completionLog.length === 0}
            <div class="empty-state compact">
              <p>No completed ideas yet.</p>
              <span>Done items will appear here.</span>
            </div>
          {:else}
            <ol class="log-list">
              {#each completionLog.slice(0, 12) as entry (entry.idea.id)}
                <li>
                  <span>{entry.idea.text}</span>
                  <small>{entry.projectName} · {formatDate(entry.idea.finishedAt)}</small>
                </li>
              {/each}
            </ol>
          {/if}
        </section>
      </aside>
    </main>
  {/if}

  {#if toast}
    <div class="toast" role="status">{toast}</div>
  {/if}
</div>
