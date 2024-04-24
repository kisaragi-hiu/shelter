<script lang="ts">
  import type { Shelter } from "../../../../types.ts";
  export let data: Shelter[];
  import ShelterCard from "../components/ShelterCard.svelte";
  let value: string;
  $: filteredData =
    typeof value !== "string"
      ? data
      : data.filter((shelter) => {
          const needle =
            shelter.name + shelter.地址 + shelter.適用災害 + shelter.備註;
          return needle.includes(value);
        });
  $: matchingData = filteredData.length === 0 ? data : filteredData;
</script>

<div class="flex flex-col">
  <input
    class="h-10 px-2 border-b-2 border-secondary-light bg-white dark:bg-black dark:border-secondary"
    type="text"
    placeholder="搜尋避難所…"
    bind:value
  />
  <ul class="flex flex-col grow divide-y">
    {#each matchingData as item}
      <li>
        <ShelterCard {item} />
      </li>
    {/each}
  </ul>
</div>
