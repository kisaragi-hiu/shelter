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

/**
 * 收容人數 might be a normal number or an empty string or even undefined.
 * Handle it correctly.
 */
export function 剖析收容人數(orig: string | undefined) {
    // Passthrough undefined
    if (typeof orig === "undefined") return;
    return Number.parseInt(orig);
}

/**
 * Take something like "■風水災\n■地震\n■海嘯\n■其他"
 * then turn it into {disaster:["風災", "水災" ...]}
 */
export function 剖析適用災害(orig: string) {
    const disasters: Disaster[] = [];
    let note: string | undefined;
    const keyMap: Map<string, Disaster[]> = new Map(
        Object.entries({
            "■風水災": ["風災", "水災"],
            "■地震": ["地震"],
            "■海嘯": ["海嘯"],
            "■其他": ["其他"],
        }),
    );
    for (const line of orig.split("\n")) {
        for (const [key, values] of keyMap) {
            // Do the test
            if (line.startsWith(key)) {
                for (const value of values) disasters.push(value);
            }
            // Cut out the key
            line.replace(key, "");
            // If there's still stuff remaining, then the it should be
            // considered a note.
            if (line.length > 0) {
                note = line;
            }
        }
    }

    return { disasters, note };
}
