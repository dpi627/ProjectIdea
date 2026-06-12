<script lang="ts">
  import { History, RotateCcw } from "@lucide/svelte";
  import { getCompletionLog } from "@ophan/core";
  import { getWorkspace, reopenIdea } from "../state/app.svelte";
  import { ui } from "../state/ui.svelte";
  import { formatDate } from "../utils/format";

  const completionLog = $derived(getCompletionLog(getWorkspace()));
</script>

<aside class="insight-panel" aria-label="Completed ideas" inert={ui.logCollapsed}>
  <div class="log-inner">
    <section class="panel fill">
      <header class="panel-head">
        <span class="panel-head-title">
          <History size={16} />
          Completed
          <span class="panel-count">{completionLog.length}</span>
        </span>
      </header>
      <div class="panel-body">
        {#if completionLog.length === 0}
          <div class="empty-state compact">
            <p>No completed ideas yet.</p>
            <span>Done items will appear here.</span>
          </div>
        {:else}
          <ol class="scroll-list">
            {#each completionLog as entry (entry.idea.id)}
              <li class="log-item">
                <p class="log-text">{entry.idea.text}</p>
                <span class="log-meta">{entry.projectName} · {formatDate(entry.idea.finishedAt)}</span>
                <button
                  class="action-btn log-reopen"
                  type="button"
                  title="Reopen idea"
                  onclick={() => reopenIdea(entry.idea.id)}
                >
                  <RotateCcw size={13} />
                  <span class="sr-only">Reopen idea</span>
                </button>
              </li>
            {/each}
          </ol>
        {/if}
      </div>
    </section>
  </div>
</aside>
