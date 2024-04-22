import type { Shelter } from "../types";

import { readFile, writeFile, open } from "fs/promises";
import { parse } from "csv-parse";
import { joinValues, 剖析收容人數, 剖析適用災害 } from "./util";

const shelters: Shelter[] = [];

async function insertKaohsiung86415(path: string) {
    const sample = {
        seq: 2,
        項次: "2",
        避難收容處所編號: "SE000-0002",
        避難收容處所名稱: "鳳雄營區",
        管理層級: "縣市",
        所在縣市: "高雄市",
        所在鄉鎮市: "燕巢區",
        主管單位聯絡人姓名: "社會局救助科避難收容業務承辦人",
        聯絡人電話: "3368333轉2063",
        手機號碼: "3368333轉2060-2062",
        收容所設置單位: "高雄市政府社會局",
        收容所聯絡人姓名: "社會局救助科避難收容業務承辦股長",
        收容所聯絡人電話: "3368333轉2063",
        收容所聯絡人手機: "3368333轉2063",
        郵遞區號: "824",
        收容所縣市: "高雄市",
        收容所鄉鎮: "燕巢區",
        收容所村里: "鳳雄里",
        收容所地址: "鳳旗路23號",
        服務里別: "如需進行異地收容安置方才啟用，視情況調度收容對象",
        容納人數: "900",
        適用災害: "■風水災\n■地震\n■海嘯\n■其他",
    };
    const fileData = await readFile(path, { encoding: "utf-8" });
    const values = JSON.parse(fileData).data as (typeof sample)[];

    for (const value of values) {
        let 備註: string | undefined;
        let 預計收容村里: string | undefined;
        // There is one mistake where 服務里別 includes stuff that should really
        // go into a 備註 field.
        if (
            value.服務里別.startsWith("如需") ||
            value.服務里別.startsWith("需")
        ) {
            備註 = value.服務里別;
        } else {
            預計收容村里 = value.服務里別;
        }
        const { disasters, note } = 剖析適用災害(value.適用災害);
        if (note) {
            備註 = (備註 || "") + note;
        }
        const 鄉鎮市區村里 = value.收容所鄉鎮 + value.收容所村里;
        shelters.push({
            收容所編號: value.避難收容處所編號,
            名稱: value.避難收容處所名稱,
            縣市: value.收容所縣市,
            郵遞區號: value.郵遞區號,
            鄉鎮市區村里,
            地址: value.收容所縣市 + 鄉鎮市區村里 + value.收容所地址,
            收容人數: Number.parseInt(value.容納人數),
            備註,
            預計收容村里,
            適用災害: disasters,
            主管單位聯絡人: value.主管單位聯絡人姓名,
            主管單位聯絡電話: joinValues(value.聯絡人電話, value.手機號碼),
            管理人: value.收容所聯絡人姓名,
            聯絡電話: joinValues(
                value.收容所聯絡人電話,
                value.收容所聯絡人手機,
            ),
        });
    }
}

async function insertHualien159491(path: string) {
    const file = await open(path);
    const parser = file
        .createReadStream()
        .pipe(parse({ columns: true, bom: true }));
    const sample = {
        資源彙整機關: "花蓮縣政府",
        收容所編號: "",
        收容所名稱: "吉安國小",
        收容所鄉鎮市區: "吉安鄉",
        收容所村里: "",
        地址: "花蓮縣吉安鄉吉安村吉安路二段97號",
        管理人: "",
        連絡電話: "03-8523126-167",
        收容人數: "",
        X坐標: "307273.612",
        Y坐標: "2652193.274",
        備註: "",
        最後更新時間: "20201001",
    };

    // The "as..." is a hack to assign type to each value. The latter is
    // actually an async iterator, not a sync array, but type-wise they have the
    // same effect of typing value to (typeof sample).
    for await (const value of parser as unknown as (typeof sample)[]) {
        if (value.收容所名稱.trim().length === 0) {
            continue;
        }
        shelters.push({
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
}

async function main() {
    await insertKaohsiung86415(
        "86415-高雄市-因應各項災害避難收容場所一覽表.json",
    );
    await insertHualien159491("159491-花蓮縣-避難收容所位置及收容人數.csv");
    await writeFile("normalized.json", JSON.stringify(shelters, null, 2));
}

main();
