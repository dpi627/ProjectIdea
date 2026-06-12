<script lang="ts">
  import { app } from "../state/app.svelte";
</script>

{#if app.toast}
  <div class="toast" role="status">{app.toast}</div>
{/if}
