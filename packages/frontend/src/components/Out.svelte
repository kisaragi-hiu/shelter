<script lang="ts">
  export let href: string;
</script>

<a
  class="text-blue-500 hover:underline after:content-['°']"
  target="_blank"
  rel="noreferrer"
  {href}
  {...$$restProps}
>
  {#if $$slots.default}
    <slot />
  {:else}
    {href}
  {/if}
</a>
