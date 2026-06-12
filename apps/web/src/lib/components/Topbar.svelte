<script lang="ts">
  import {
    CircleDot,
    Download,
    Moon,
    PanelLeft,
    PanelRight,
    Sun,
    Upload,
  } from "@lucide/svelte";
  import { exportData, importFromJson, showToast } from "../state/app.svelte";
  import { toggleLog, toggleRail, toggleTheme, ui } from "../state/ui.svelte";

  let importFileInput: HTMLInputElement | undefined = $state();

  const importData = async (event: Event) => {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importFromJson(text);
    } catch (error) {
      console.warn("Failed to import workspace", error);
      showToast("Import failed. Check the JSON file.");
    } finally {
      input.value = "";
    }
  };
</script>

<header class="topbar">
  <div class="brand">
    <div class="brand-mark" aria-hidden="true">
      <CircleDot size={30} strokeWidth={2.4} />
    </div>
    <div>
      <p class="brand-title">Ophan</p>
      <p class="brand-subtitle">open and use, no auth, stored in the local</p>
    </div>
  </div>
  <div class="topbar-actions">
    <button
      class="ghost icon-button"
      type="button"
      aria-pressed={!ui.railCollapsed}
      title={ui.railCollapsed ? "Show projects panel" : "Hide projects panel"}
      onclick={toggleRail}
    >
      <PanelLeft size={17} />
      <span class="sr-only">Projects panel</span>
    </button>
    <button
      class="ghost icon-button"
      type="button"
      aria-pressed={!ui.logCollapsed}
      title={ui.logCollapsed ? "Show completed panel" : "Hide completed panel"}
      onclick={toggleLog}
    >
      <PanelRight size={17} />
      <span class="sr-only">Completed panel</span>
    </button>
    <button class="ghost icon-button" type="button" onclick={exportData}>
      <Download size={17} />
      <span>Export</span>
    </button>
    <button class="ghost icon-button" type="button" onclick={() => importFileInput?.click()}>
      <Upload size={17} />
      <span>Import</span>
    </button>
    <button class="theme-button" type="button" onclick={toggleTheme}>
      {#if ui.theme === "dark"}
        <Sun size={17} />
        <span>Light</span>
      {:else}
        <Moon size={17} />
        <span>Dark</span>
      {/if}
    </button>
    <input
      bind:this={importFileInput}
      class="hidden-input"
      type="file"
      accept="application/json,.json"
      onchange={importData}
    />
  </div>
</header>
