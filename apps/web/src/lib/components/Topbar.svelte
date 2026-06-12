<script lang="ts">
  import {
    CircleDot,
    DatabaseBackup,
    Download,
    Moon,
    PanelLeft,
    PanelRight,
    RotateCcw,
    Sun,
    Upload,
  } from "@lucide/svelte";
  import {
    app,
    clearWorkspace,
    exportData,
    importFromJson,
    importLegacy,
    showToast,
  } from "../state/app.svelte";
  import { openConfirm } from "../state/dialogs.svelte";
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

  const confirmClear = () => {
    openConfirm({
      title: "Clear local data?",
      message:
        "All projects and ideas stored in this browser will be removed. Export a backup first if you need one.",
      confirmText: "Clear data",
      onConfirm: clearWorkspace,
    });
  };
</script>

<header class="topbar">
  <div class="brand" data-anim="bar">
    <div class="brand-mark" aria-hidden="true">
      <CircleDot size={19} strokeWidth={2.4} />
    </div>
    <div>
      <p class="brand-title">Ophan</p>
      <p class="brand-subtitle">open and use, no auth, stored in the local</p>
    </div>
  </div>
  <div class="topbar-actions" data-anim="bar">
    <button
      class="tool-button"
      type="button"
      aria-pressed={!ui.railCollapsed}
      title={ui.railCollapsed ? "Show projects panel" : "Hide projects panel"}
      onclick={toggleRail}
    >
      <PanelLeft size={16} />
      <span class="sr-only">Projects panel</span>
    </button>
    <button
      class="tool-button"
      type="button"
      aria-pressed={!ui.logCollapsed}
      title={ui.logCollapsed ? "Show completed panel" : "Hide completed panel"}
      onclick={toggleLog}
    >
      <PanelRight size={16} />
      <span class="sr-only">Completed panel</span>
    </button>

    <span class="topbar-divider" aria-hidden="true"></span>

    <button class="tool-button" type="button" title="Export JSON" onclick={exportData}>
      <Download size={16} />
      <span class="sr-only">Export JSON</span>
    </button>
    <button
      class="tool-button"
      type="button"
      title="Import JSON"
      onclick={() => importFileInput?.click()}
    >
      <Upload size={16} />
      <span class="sr-only">Import JSON</span>
    </button>
    {#if app.legacyAvailable}
      <button
        class="tool-button"
        type="button"
        title="Import legacy static data"
        onclick={importLegacy}
      >
        <DatabaseBackup size={16} />
        <span class="sr-only">Import legacy static data</span>
      </button>
    {/if}
    <button class="tool-button" type="button" title="Clear local data" onclick={confirmClear}>
      <RotateCcw size={16} />
      <span class="sr-only">Clear local data</span>
    </button>

    <span class="topbar-divider" aria-hidden="true"></span>

    <button
      class="tool-button"
      type="button"
      title={ui.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onclick={toggleTheme}
    >
      {#if ui.theme === "dark"}
        <Sun size={16} />
      {:else}
        <Moon size={16} />
      {/if}
      <span class="sr-only">Toggle theme</span>
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
