<script lang="ts">
  import clsx from "clsx";
  const base =
    "inline-flex select-none items-center rounded-md border px-2 py-0.5 text-sm font-semibold transition-colors";
  const focus =
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  let klass = "";
  export { klass as class };
</script>

<span class={clsx(base, focus, klass)}><slot /></span>
