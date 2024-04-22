// TODO: 只有這些嗎？
export type Disaster = "水災" | "震災" | "土石流" | "海嘯";

export interface Shelter {
    序號: number;
    縣市及鄉鎮市區: string;
    村里: string;
    避難收容處所地址: string;
    經度: string;
    緯度: string;
    避難收容處所名稱: string;
    預計收容村里: string;
    預計收容人數: string;
    適用災害類別: Disaster[];
    管理人姓名: string;
    管理人電話: string;
    室內: boolean;
    室外: boolean;
    適合避難弱者安置: boolean;
}
