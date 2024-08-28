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

// for hono
import build from '@hono/vite-cloudflare-pages';
import devServer from '@hono/vite-dev-server';
// eslint-disable-next-line import/no-unresolved
import adapter from '@hono/vite-dev-server/cloudflare';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// for hono
	if (mode === 'server')
		return {
			plugins: [
				nodePolyfills({ protocolImports: true, globals: { Buffer: true } }),
				build({ entry: 'srv/index.js' }),
				devServer({
					adapter,
					entry: 'srv/index.js'
					// exclude: ['node_modules', 'src']
				})
			],
			// Configuration for avoiding the following errors
			/**
			 * Error: The following dependencies are imported but could not be resolved:
			 * @/plugins (imported by /home/study/workspace/sql-learning-app/src/main.js)
			 * Are they installed?
			 */
			resolve: {
				alias: {
					'@': fileURLToPath(new URL('./src', import.meta.url))
				}
			},
			server: { host: '0.0.0.0', port: 3000, watch: 'srv/**' }
		};

	// for vue
	return {
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
		server: {
			proxy: {
				'^/api': {
					target: 'http://192.168.56.5:3000'
				}
			},
			watch: 'src/**',
			host: '0.0.0.0',
			port: 8080
		}
	};
});
