import type { Shelter } from "../types";
import type { rawHualien159491, rawKaohsiung86415 } from "../rawtypes.ts";

import { readFile, writeFile, open } from "node:fs/promises";
import { parse } from "csv-parse";
import { joinValues, 剖析收容人數, 剖析適用災害 } from "./util.ts";

const shelters: Shelter[] = [];

/** Wrapper function to get types on `v`. */
function shelter(v: Shelter): Shelter {
    return v;
}

/**
 * Convert values from `iterator` using `normalizer` then insert them.
 */
async function insertData<T>(
    iterator: AsyncIterable<T> | Iterable<T>,
    normalizer: (v: T) => Shelter | undefined,
) {
    for await (const value of iterator) {
        const normalized = normalizer(value);
        if (typeof normalized === "undefined") continue;
        shelters.push(normalized);
    }
}
function convertKaohsiung86415(value: rawKaohsiung86415) {
    const source = 86415;
    // There is one item that contains total stats but in the wrong fields
    // Ignore it
    if (value.避難收容處所名稱 === "") return;
    let 備註: string | undefined;
    let 預計收容村里: string | undefined;
    // There is one mistake where 服務里別 includes stuff that should really
    // go into a 備註 field.
    if (value.服務里別.startsWith("如需") || value.服務里別.startsWith("需")) {
        備註 = value.服務里別;
    } else {
        預計收容村里 = value.服務里別;
    }
    const { disasters, note } = 剖析適用災害(value.適用災害);
    if (note) {
        備註 = (備註 || "") + note;
    }
    const 鄉鎮市區村里 = value.收容所鄉鎮 + value.收容所村里;
    const address = value.收容所縣市 + 鄉鎮市區村里 + value.收容所地址;
    return shelter({
        source,
        收容所編號: value.避難收容處所編號,
        名稱: value.避難收容處所名稱,
        縣市: value.收容所縣市,
        郵遞區號: value.郵遞區號,
        鄉鎮市區村里,
        地址: address.replaceAll(" ", ""),
        收容人數: Number.parseInt(value.容納人數),
        備註,
        預計收容村里,
        適用災害: disasters,
        主管單位聯絡人: value.主管單位聯絡人姓名,
        主管單位聯絡電話: joinValues(value.聯絡人電話, value.手機號碼),
        管理人: value.收容所聯絡人姓名,
        聯絡電話: joinValues(value.收容所聯絡人電話, value.收容所聯絡人手機),
    });
}
function convertHualien159491(value: rawHualien159491) {
    const source = 159491;
    if (value.收容所名稱.trim().length === 0) {
        return;
    }
    return shelter({
        source,
        // This function is specific to this dataset so we can hardcode it here.
        縣市: "花蓮縣",
        彙整機關: value.資源彙整機關,
        收容所編號: value.收容所編號,
        名稱: value.收容所名稱,
        鄉鎮市區村里: value.收容所鄉鎮市區 + value.收容所村里,
        地址: value.地址,
        管理人: value.管理人,
        聯絡電話: joinValues(value.連絡電話),
        收容人數: 剖析收容人數(value.收容人數),
        備註: value.備註,
        最後更新時間: value.最後更新時間,
    });
}

async function main() {
    {
        const path = "raw/86415-高雄市-因應各項災害避難收容場所一覽表.json";
        const fileData = await readFile(path, { encoding: "utf-8" });
        const values = JSON.parse(fileData).data as rawKaohsiung86415[];
        await insertData(values, convertKaohsiung86415);
    }
    {
        const file = await open(
            "raw/159491-花蓮縣-避難收容所位置及收容人數.csv",
        );
        const parser = file
            .createReadStream()
            .pipe(parse({ columns: true, bom: true }));
        // The "as..." is a hack to assign type to each value. The latter is
        // actually an async iterator, not a sync array, but type-wise they have the
        // same effect of typing value to (typeof sample).
        const values = parser as unknown as rawHualien159491[];
        await insertData(values, convertHualien159491);
    }
    await writeFile("normalized.json", JSON.stringify(shelters, null, 2));
}

main();
