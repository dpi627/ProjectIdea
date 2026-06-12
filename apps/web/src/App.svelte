<script lang="ts">
  import { onMount } from "svelte";
  import CompletionPanel from "./lib/components/CompletionPanel.svelte";
  import IdeaPanel from "./lib/components/IdeaPanel.svelte";
  import ProjectRail from "./lib/components/ProjectRail.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import Topbar from "./lib/components/Topbar.svelte";
  import { app, init } from "./lib/state/app.svelte";
  import { loadUi, ui } from "./lib/state/ui.svelte";

  onMount(async () => {
    loadUi();
    await init();
  });
</script>

<svelte:head>
  <title>Ophan</title>
</svelte:head>

<div class="app-shell">
  <Topbar />

  {#if app.isLoading}
    <main class="loading-panel">
      <span class="orbit-loader" aria-hidden="true"></span>
      <p>Opening local workspace...</p>
    </main>
  {:else}
    <main
      class="workspace-grid"
      class:rail-collapsed={ui.railCollapsed}
      class:log-collapsed={ui.logCollapsed}
    >
      <ProjectRail />
      <IdeaPanel />
      <CompletionPanel />
    </main>
  {/if}

  <Toast />
</div>
