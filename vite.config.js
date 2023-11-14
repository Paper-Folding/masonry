import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        host: true,
        port: 3000,
        open: "test/index.html"
    },
    build: {
        lib: {
            entry: resolve(__dirname, "src/lib/masonry.js"),
            name: "masonry",
            fileName: "masonry",
            formats: ["umd"]
        },
        rollupOptions: {
            output: {
                entryFileNames: "masonry.min.js"
            },
            plugins: [
                {
                    name: "banner",
                    enforce: "post",
                    generateBundle(options, bundle) {
                        const banner = `/** masonry.js
 *  Cascading grid layout library
 *  Original by Desandro
 *  Patched by Paper Folding
 *  @Source: https://github.com/Paper-Folding/masonry
 *  @Version: ${process.env.npm_package_version}
 *  @License: MIT license
 */
`;

                        for (const module of Object.values(bundle)) {
                            if (module.type === "chunk") module.code = banner + module.code;
                            else module.source = banner + module.source;
                        }
                    }
                }
            ]
        }
    }
});
