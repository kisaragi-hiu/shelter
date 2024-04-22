import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
    integrations: [UnoCSS({ injectReset: true }), svelte()],
    vite: { clearScreen: false },
    i18n: {
        defaultLocale: "zh-tw",
        locales: ["zh-tw", "en"],
    },
});
