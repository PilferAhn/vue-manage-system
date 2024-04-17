import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		VueSetupExtend(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		})
	],
	optimizeDeps: {
		include: ['schart.js']
	},
	server: {
		host: '10.29.11.59',
		port: 40006,
		proxy : {
			"/pdt_measurement" : "http://10.29.11.59:40000",
			"/pdt_application" : "http://10.29.11.59:40000",
			"/measurement" : "http://10.29.11.57:40000",
			"/wafer" : "http://10.29.11.57:40000",
			"/application" : "http://10.29.11.57:40000",
			"/user" : "http://10.29.11.59:40000",

		}
	  },
});
