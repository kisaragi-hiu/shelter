<script lang="ts">
  import type { Shelter } from "../../../../types";
  import Out from "./Out.svelte";

  export let item: Shelter;
</script>

<div class="py-4">
  <h1 class="font-bold">{item.name}</h1>
  <h2>
    <Out
      title="於 Google 地圖檢視地址"
      href={`https://www.google.com/maps/place/${item.地址}`}>{item.地址}</Out
    >
    <div>收容人數：{item.收容人數 ? item.收容人數 + "人" : ""}</div>
    <div>適用災害：{item.適用災害?.join("、") || ""}</div>
    <div>備註：{item.備註 || ""}</div>
    <div>
      資料來源：<Out href={`https://data.gov.tw/dataset/${item.source}`}></Out>
    </div>
  </h2>
</div>
