"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var vite_tsconfig_paths_1 = require("vite-tsconfig-paths");
var path_1 = require("path");
var vite_plugin_dts_1 = require("vite-plugin-dts");
var vite_plugin_externalize_deps_1 = require("vite-plugin-externalize-deps");
var vite_plugin_css_injected_by_js_1 = require("vite-plugin-css-injected-by-js");
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)(), (0, vite_tsconfig_paths_1.default)(), (0, vite_plugin_dts_1.default)(), (0, vite_plugin_externalize_deps_1.externalizeDeps)(), (0, vite_plugin_css_injected_by_js_1.default)()],
    server: {
        port: 3400,
    },
    build: {
        lib: {
            entry: (0, path_1.resolve)(__dirname, 'src/index.ts'),
            name: '@meemoo/admin-core-ui',
            fileName: 'index',
            formats: ['es', 'cjs'],
        },
        sourcemap: true,
    },
    define: {
        // By default, Vite doesn't include shims for Node.js
        // necessary for rich text editor to work
        // https://github.com/vitejs/vite/discussions/5912#discussioncomment-5569850
        global: 'globalThis',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'public'),
            '~modules': path.resolve(__dirname, './src/react-admin/modules'),
            '~shared': path.resolve(__dirname, './src/react-admin/modules/shared'),
            '~content-blocks': path.resolve(__dirname, './src/react-admin/modules/content-page/components/blocks'),
            '~generated': path.resolve(__dirname, './src/react-admin/generated'),
            '~core': path.resolve(__dirname, './src/react-admin/core'),
        },
    },
});
