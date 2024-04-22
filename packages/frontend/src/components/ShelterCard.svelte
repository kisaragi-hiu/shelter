<script lang="ts">
  import type { Shelter } from "../../../../types";

  export let item: Shelter;
</script>

<div class="py-4">
  <h1 class="font-bold">{item.名稱}</h1>
  <h2>
    <a
      class="text-blue-500 hover:underline"
      title="於 Google 地圖檢視地址"
      href={`https://www.google.com/maps/place/${item.地址}`}>{item.地址}</a
    >
    <div>收容人數：{item.收容人數}人</div>
    <div>適用災害：{item.適用災害?.join("、")}</div>
    <div>備註：{item.備註}</div>
  </h2>
</div>
