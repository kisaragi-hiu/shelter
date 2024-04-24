<script lang="ts">
  export let value: string | undefined;
  export let fallback: string;
</script>

{#if value}<span>{value}</span>{:else}<span class="muted">{fallback}</span>{/if}
