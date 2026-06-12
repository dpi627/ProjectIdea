<script lang="ts">
  import { Database, History, RotateCcw, Upload } from "@lucide/svelte";
  import { getCompletionLog } from "@ophan/core";
  import {
    app,
    clearWorkspace,
    getWorkspace,
    importLegacy,
  } from "../state/app.svelte";
  import { formatDate } from "../utils/format";

  const completionLog = $derived(getCompletionLog(getWorkspace()));
</script>

<aside class="insight-panel">
  <section class="sync-card">
    <p class="eyebrow">Storage</p>
    <h2><Database size={19} /> Local first</h2>
    <p>
      Saved in IndexedDB on this device. The repository boundary is ready
      for a future Google Sheets adapter.
    </p>
    <div class="sync-actions">
      {#if app.legacyAvailable}
        <button class="ghost icon-button" type="button" onclick={importLegacy}>
          <Upload size={16} />
          <span>Import legacy static data</span>
        </button>
      {/if}
      <button class="ghost icon-button" type="button" onclick={clearWorkspace}>
        <RotateCcw size={16} />
        <span>Clear local data</span>
      </button>
    </div>
  </section>

  <section class="log-card">
    <div class="section-title">
      <span><History size={16} /> Completion log</span>
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
            <small>{entry.projectName} - {formatDate(entry.idea.finishedAt)}</small>
          </li>
        {/each}
      </ol>
    {/if}
  </section>
</aside>
