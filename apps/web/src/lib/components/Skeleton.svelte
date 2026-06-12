<script lang="ts">
  let {
    count = 3,
    variant = "card",
  }: { count?: number; variant?: "card" | "line" } = $props();
</script>

{#each Array.from({ length: count }) as _, index (index)}
  <div class="skeleton" class:line={variant === "line"} aria-hidden="true"></div>
{/each}
