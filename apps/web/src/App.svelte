<script lang="ts">
  import { onMount } from "svelte";
  import { runEntrance } from "./lib/animations/entrance";
  import CompletionPanel from "./lib/components/CompletionPanel.svelte";
  import ConfirmDialog from "./lib/components/ConfirmDialog.svelte";
  import IdeaPanel from "./lib/components/IdeaPanel.svelte";
  import ProjectDialog from "./lib/components/ProjectDialog.svelte";
  import ProjectRail from "./lib/components/ProjectRail.svelte";
  import Toast from "./lib/components/Toast.svelte";
  import Topbar from "./lib/components/Topbar.svelte";
  import { initLocale, t } from "./lib/state/i18n.svelte";
  import { app, init } from "./lib/state/app.svelte";
  import { loadUi, ui } from "./lib/state/ui.svelte";

  let shellEl: HTMLDivElement | undefined = $state();
  let entrancePlayed = false;

  onMount(async () => {
    initLocale();
    loadUi();
    await init();
  });

  $effect(() => {
    if (!app.isLoading && shellEl && !entrancePlayed) {
      entrancePlayed = true;
      runEntrance(shellEl);
    }
  });
</script>

<svelte:head>
  <title>{t("app.title")}</title>
</svelte:head>

<div class="app-shell" bind:this={shellEl}>
  <Topbar />

  <main
    class="workspace-grid"
    class:rail-collapsed={ui.railCollapsed}
    class:log-collapsed={ui.logCollapsed}
  >
    <ProjectRail />
    <IdeaPanel />
    <CompletionPanel />
  </main>

  <ProjectDialog />
  <ConfirmDialog />
  <Toast />
</div>
