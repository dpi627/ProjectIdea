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
  import { localeLabel, t, toggleLocale } from "../state/i18n.svelte";
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
      showToast(t("toast.importFailed"));
    } finally {
      input.value = "";
    }
  };

  const confirmClear = () => {
    openConfirm({
      title: t("topbar.clearTitle"),
      message: t("topbar.clearMessage"),
      confirmText: t("topbar.clearConfirm"),
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
      <p class="brand-subtitle">{t("brand.subtitle")}</p>
    </div>
  </div>
  <div class="topbar-actions" data-anim="bar">
    <button
      class="tool-button"
      type="button"
      aria-pressed={!ui.railCollapsed}
      title={ui.railCollapsed ? t("topbar.showProjects") : t("topbar.hideProjects")}
      onclick={toggleRail}
    >
      <PanelLeft size={16} />
      <span class="sr-only">{t("topbar.projectsPanel")}</span>
    </button>
    <button
      class="tool-button"
      type="button"
      aria-pressed={!ui.logCollapsed}
      title={ui.logCollapsed ? t("topbar.showCompleted") : t("topbar.hideCompleted")}
      onclick={toggleLog}
    >
      <PanelRight size={16} />
      <span class="sr-only">{t("topbar.completedPanel")}</span>
    </button>

    <span class="topbar-divider" aria-hidden="true"></span>

    <button class="tool-button" type="button" title={t("topbar.exportJson")} onclick={exportData}>
      <Download size={16} />
      <span class="sr-only">{t("topbar.exportJson")}</span>
    </button>
    <button
      class="tool-button"
      type="button"
      title={t("topbar.importJson")}
      onclick={() => importFileInput?.click()}
    >
      <Upload size={16} />
      <span class="sr-only">{t("topbar.importJson")}</span>
    </button>
    {#if app.legacyAvailable}
      <button
        class="tool-button"
        type="button"
        title={t("topbar.importLegacy")}
        onclick={importLegacy}
      >
        <DatabaseBackup size={16} />
        <span class="sr-only">{t("topbar.importLegacy")}</span>
      </button>
    {/if}
    <button class="tool-button" type="button" title={t("topbar.clearData")} onclick={confirmClear}>
      <RotateCcw size={16} />
      <span class="sr-only">{t("topbar.clearData")}</span>
    </button>

    <span class="topbar-divider" aria-hidden="true"></span>

    <button
      class="tool-button"
      type="button"
      title={ui.theme === "dark" ? t("topbar.switchLight") : t("topbar.switchDark")}
      onclick={toggleTheme}
    >
      {#if ui.theme === "dark"}
        <Sun size={16} />
      {:else}
        <Moon size={16} />
      {/if}
      <span class="sr-only">{t("topbar.toggleTheme")}</span>
    </button>
    <button
      class="tool-button language-toggle"
      type="button"
      title={t("topbar.switchLanguage")}
      aria-label={t("topbar.language")}
      onclick={toggleLocale}
    >
      {localeLabel()}
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
