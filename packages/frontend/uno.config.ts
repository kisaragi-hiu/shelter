import { defineConfig, presetUno, presetTypography } from "unocss";

export default defineConfig({
    presets: [presetUno(), presetTypography()],
    rules: [
        ["muted", { color: "#6b7280" }],
        // [
        //     "writing-vertical",
        //     {
        //         "writing-mode": "vertical-rl",
        //     },
        // ],
        // [
        //     "writing-horizontal",
        //     {
        //         "writing-mode": "horizontal-tb",
        //     },
        // ],
        // [
        //     /^writing-(\w+)$/,
        //     ([, mode]) => ({
        //         "writing-mode": mode,
        //     }),
        // ],
    ],
    theme: {
        colors: {
            // gray-500
            muted: "#6b7280",
        },
    },
});
