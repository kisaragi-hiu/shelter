<script lang="ts">
  import type { Shelter } from "../../../../types";
  import Badge from "./Badge.svelte";
  import MaybeMuted from "./MaybeMuted.svelte";
  import Out from "./Out.svelte";

  export let item: Shelter;
</script>

<div class="flex items-center gap-x-2">
  <div class="py-4 pr-4 w-full">
    <h1 class="flex justify-between">
      <span class="font-bold">{item.name}</span>
      {#if item.isMap}
        <Badge class="text-teal-900 bg-teal-100 border-teal-300">防災地圖</Badge
        >
      {:else}
        <Badge class="text-amber-900 bg-amber-100 border-amber-300"
          >避難所</Badge
        >
      {/if}
    </h1>
    <h2>
      <Out
        title="於 Google 地圖檢視地址"
        href={`https://www.google.com/maps/place/${item.地址}`}>{item.地址}</Out
      >
      <div>
        <span>收容人數：</span><MaybeMuted
          value={typeof item.收容人數 !== "undefined"
            ? item.收容人數.toString() + "人"
            : undefined}
          fallback="未指定"
        />
      </div>
      <div>
        <span>適用災害：</span><MaybeMuted
          value={item.適用災害?.join("、")}
          fallback="未指定"
        />
      </div>
      <div>
        <span>備註：</span><MaybeMuted value={item.備註} fallback="無" />
      </div>
      <div>
        資料來源：<Out href={`https://data.gov.tw/dataset/${item.source}`}
        ></Out>
      </div>
    </h2>
  </div>
</div>
