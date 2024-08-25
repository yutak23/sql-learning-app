/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		nodePolyfills({ protocolImports: true }),
		vue({ template: { transformAssetUrls } }),
		vuetify({
			autoImport: true,
			styles: { configFile: 'src/styles/settings.scss' }
		}),
		// components auto importing for Vue(No more manual importing of components)
		Components(),
		vueDevTools(),
		eslint()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: { host: '0.0.0.0', port: 8080 }
});
