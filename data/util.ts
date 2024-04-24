import type { Disaster } from "../types";

/**
 * Join each value into an array, with empty and duplicate items removed.
 */
export function joinValues<T>(...values: T[]) {
    // Remove duplicates via Set
    const s = new Set(values);
    return [...s].filter((v) => {
        return typeof v !== undefined;
    });
}

export function parseBool(orig: string) {
    if (orig === "是") return true;
    if (orig === "否") return false;
    console.warn("Unexpected bool source value");
    return false;
}

/**
 * 收容人數 might be a normal number or an empty string or even undefined.
 * Handle it correctly.
 */
export function 剖析收容人數(orig: string | undefined) {
    // Passthrough undefined
    if (typeof orig === "undefined") return;
    if (orig === "") return;
    return Number.parseInt(orig);
}

/**
 * Take something like "■風水災\n■地震\n■海嘯\n■其他"
 * then turn it into {disaster:["風災", "水災" ...]}
 */
export function parseApplicable86415(orig: string) {
    const disasters: Disaster[] = [];
    let note: string | undefined;
    const map: Map<string, Disaster[]> = new Map(
        Object.entries({
            "■風水災": ["風災", "水災"],
            "■地震": ["地震"],
            "■海嘯": ["海嘯"],
            "■其他": ["其他"],
        }),
    );
    const keysRegexp = /[■□](風水災|地震|海嘯|其他)/g;
    for (const line of orig.split("\n")) {
        for (const [key, values] of map) {
            // Do the test
            if (line.startsWith(key)) {
                for (const value of values) disasters.push(value);
                const remaining = line.replace(keysRegexp, "");
                // Cut out the key
                // If there's still stuff remaining, then the it should be
                // considered a note.
                if (remaining.length > 0) {
                    note = (note || "") + remaining;
                }
            }
        }
    }

    return { disasters, note };
}

export function parseApplicable73242(orig: string) {
    const disasters: Disaster[] = [];
    const map: Record<string, Disaster[] | undefined> = {
        水災: ["水災"],
        震災: ["地震"],
        土石流: ["土石流"],
        海嘯: ["海嘯"],
        核子事故: ["核子事故"],
        坡地災害: ["坡地災害"],
    };
    let beenHelpful = false;
    for (const line of orig.split(",")) {
        if (line === "") continue;
        const values = map[line];
        if (values) {
            for (const value of values) {
                disasters.push(value);
            }
        } else {
            console.warn(`Seen unregistered disaster type: ${line}`);
            if (!beenHelpful) {
                console.warn(
                    "Please add it to the definition of Disaster and/or see if it should be merged with existing disaster types.",
                );
                beenHelpful = true;
            }
        }
    }

    return disasters;
}
