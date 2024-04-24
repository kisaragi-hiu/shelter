export type Disaster =
    | "水災" // "風水災" 要分開
    | "地震" // = 震災
    | "土石流"
    | "海嘯"
    | "風災"
    | "坡地災害"
    | "核子事故"
    | "空襲"
    | "其他";

// The goal is to parse each source file and fit the data into this structure.
export interface Shelter {
    /** 來源資料集 */
    source: number;
    name: string;
    /**
     * 避難所完整地址: 縣市及鄉鎮市區 + 村里 + 避難收容處所地址
     * 或者是 county + address
     */
    地址: string;
    郵遞區號?: string;
    收容人數: number | undefined;
    適用災害?: Disaster[];
    序號?: number;
    shelterCode?: string;
    sheltedId?: number;
    收容所編號?: string;
    彙整機關?: string;
    備註?: string;
    最後更新時間?: string;
    // 撤除的可以直接忽略
    // 開設狀態: OpenStatus;
    經度?: string;
    緯度?: string;
    // 大地坐標; unless we're plotting points on maps, this isn't actually
    // necessary since we still ahve addresses, right?
    TWD97_X坐標?: string;
    TWD97_Y坐標?: string;
    /** defaultville */
    預計收容村里?: string;
    管理人?: string;
    聯絡電話?: string[];
    主管單位聯絡人?: string;
    主管單位聯絡電話?: string[];
    室內?: boolean;
    室外?: boolean;
    適合避難弱者安置?: boolean;
}
