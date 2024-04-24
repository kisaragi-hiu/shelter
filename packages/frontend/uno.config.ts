import { defineConfig, presetUno, presetTypography } from "unocss";

export default defineConfig({
    presets: [presetUno(), presetTypography()],
    rules: [["muted", { color: "#6b7280" }]],
    theme: {
        colors: {
            // gray-500
            muted: "#6b7280",
        },
    },
});
