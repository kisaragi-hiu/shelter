<script lang="ts">
  import type { Shelter } from "../../../../types.ts";
  import ShelterCard from "../components/ShelterCard.svelte";
  import VirtualList from "svelte-tiny-virtual-list";
  export let data: Shelter[];
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

  let listHeight = 0;
</script>

<div class="flex flex-col h-full">
  <input
    class="h-10 px-2 border-b-2 border-secondary-light bg-white dark:bg-black dark:border-secondary"
    type="text"
    placeholder="搜尋避難所…"
    bind:value
  />
  <div class="grow" bind:offsetHeight={listHeight}>
    <VirtualList
      width="100%"
      height={listHeight}
      itemCount={filteredData.length}
      itemSize={170}
    >
      <div
        slot="item"
        let:index
        let:style
        {style}
        class="[&:not(:last-child)]:border-b-2"
      >
        <ShelterCard item={filteredData[index]} />
      </div>
    </VirtualList>
  </div>
</div>
