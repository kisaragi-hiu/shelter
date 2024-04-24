import type { Shelter } from "../types";
import type {
    rawHualien159491,
    rawKaohsiung86415,
    rawNational73242,
} from "../rawtypes.ts";
import type { Options as CSVParseOptions } from "csv-parse";

import { readFile, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import {
    joinValues,
    parseApplicable73242,
    parseApplicable86415,
    parseBool,
    剖析收容人數,
} from "./util.ts";

let shelters: Shelter[] = [];

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
    const { disasters, note } = parseApplicable86415(value.適用災害);
    if (note) {
        備註 = (備註 || "") + note;
    }
    const address =
        value.收容所縣市 +
        value.收容所鄉鎮 +
        value.收容所村里 +
        value.收容所地址;
    return shelter({
        source,
        收容所編號: value.避難收容處所編號,
        name: value.避難收容處所名稱,
        郵遞區號: value.郵遞區號,
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
        彙整機關: value.資源彙整機關,
        收容所編號: value.收容所編號,
        name: value.收容所名稱,
        地址: value.地址,
        管理人: value.管理人,
        聯絡電話: joinValues(value.連絡電話),
        收容人數: 剖析收容人數(value.收容人數),
        備註: value.備註,
        最後更新時間: value.最後更新時間,
    });
}
function convertNational73242(value: rawNational73242) {
    const source = 73242;
    return shelter({
        source,
        name: value.避難收容處所名稱,
        適用災害: parseApplicable73242(value.適用災害類別),
        收容人數: 剖析收容人數(value.預計收容人數),
        經度: value.經度,
        緯度: value.緯度,
        地址: value.縣市及鄉鎮市區 + value.村里 + value.避難收容處所地址,
        管理人: value.管理人姓名,
        聯絡電話: [value.管理人電話],
        室內: parseBool(value.室內),
        室外: parseBool(value.室外),
        適合避難弱者安置: parseBool(value.適合避難弱者安置),
    });
}

function csvStream<T>(path: string, csvOptions: CSVParseOptions) {
    const parser = createReadStream(path).pipe(parse(csvOptions));

    // Hack to assign a type to each value. The real value is actually a Node
    // Stream, but marking it as an array still allows it to be used in for await.
    return parser as unknown as T[];
}

async function main() {
    {
        const path = "raw/86415-高雄市-因應各項災害避難收容場所一覽表.json";
        const fileData = await readFile(path, { encoding: "utf-8" });
        const values = JSON.parse(fileData).data as rawKaohsiung86415[];
        await insertData(values, convertKaohsiung86415);
    }
    await insertData(
        csvStream<rawHualien159491>(
            "raw/159491-花蓮縣-避難收容所位置及收容人數.csv",
            {
                columns: true,
                bom: true,
            },
        ),
        convertHualien159491,
    );
    await insertData(
        csvStream<rawNational73242>("raw/73242-避難收容處所點位檔.csv", {
            columns: true,
        }),
        convertNational73242,
    );

    shelters = shelters.sort((a, b) => {
        if (a.地址 < b.地址) return -1;
        if (a.地址 > b.地址) return 1;
        console.warn(`${a.地址} is duplicated!`);
        return 0;
    });

    await writeFile("normalized.json", JSON.stringify(shelters, null, 2));
}

main();
