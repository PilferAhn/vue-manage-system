import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import * as os from 'os';

export const getServerIpAddress = (): string => {
	const networkInterfaces = os.networkInterfaces();
	for (const interfaceName of Object.keys(networkInterfaces)) {
		const networkInterface = networkInterfaces[interfaceName];
		if (networkInterface) {
			for (const interfaceDetails of networkInterface) {
				const { family, address, internal } = interfaceDetails;
				if (family === 'IPv4' && !internal) {
					return address;
				}
			}
		}
	}
	return 'Unable to determine IP address';
};

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
	define: {
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
	},
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.esm-bundler.js', // 이 부분이 추가되었습니다.
		},
	},
	server: {
		host: getServerIpAddress(),
		port: 40006,
			proxy : {
				"/pdt_measurement" : "http://10.29.11.59:40000",
				"/pdt_application" : "http://10.29.11.59:40000",
				"/measurement" : "http://10.29.11.57:40000",
				"/wafer" : "http://10.29.11.57:40000",
				"/application" : "http://10.29.11.57:40000",
				"/user" : "http://10.29.11.59:40000",
				"/teg_application" : "http://10.29.11.57:40000",
				"/tcf" : "http://10.29.11.57:8002",
				"/s-parameter" : "http://10.29.11.57:8002",
				"/machine" : "http://10.29.11.59:40000",
				"/deembed" : "http://10.29.11.59:40001",			
				"/rf-limit" : "http://10.29.11.59:8002",
				"/solder" : "http://10.29.11.57:40000",
				"/fab_monitoring" : "http://10.29.11.57:40000",
				"/bfsm2" : "http://10.20.10.114",			
				"/mes" : "http://10.29.11.57:40000",
				"/OpeationMns" : "http://10.70.21.216:9086",
				"/stock/" : "http://10.29.11.57:40000",
				"/dv2" : "http://10.29.11.57:40000",
				"/test" : "http://10.29.11.59:8002",
				"/fab_monitoring_rev2": "http://10.29.11.57:40000",
				"/customer": "http://10.29.11.57:40000",
				"/band": "http://10.29.11.57:40000",			
				"/api": "http://10.20.10.128",
				"/excel" : "http://10.29.11.57:39999",
				"/csp":"http://10.29.11.57:40000",
				"/module": "http://10.29.11.57:40000",
				"/static/": "http://10.29.11.57:40000",
		  },

		// proxy: {
		// 	"/pdt_measurement": "http://10.29.9.48:40000",
		// 	"/pdt_application": "http://10.29.9.48:40000",
		// 	"/measurement": "http://10.29.9.48:40000",
		// 	"/wafer": "http://10.29.9.48:40000",
		// 	"/application": "http://10.29.9.48:40000",
		// 	"/user": "http://10.29.11.59:40000",
		// 	"/teg_application": "http://10.29.9.48:40000",
		// 	"/tcf": "http://10.29.9.48:8002",
		// 	"/s-parameter": "http://10.29.9.48:8002",
		// 	"/machine": "http://10.29.9.48:40000",
		// 	"/deembed": "http://10.29.9.48:40001",
		// 	"/rf-limit": "http://10.29.9.48:8002",
		// 	"/solder": "http://10.29.9.48:40000",
		// 	"/fab_monitoring": "http://10.29.9.48:40000",
		// 	"/bfsm2": "http://10.20.10.114:40000",
		// 	"/mes": "http://10.29.9.48:40000",
		// 	"/OpeationMns": "http://10.70.21.216:9086",
		// 	"/reel": "http://10.29.9.48:40000",
		// 	"/dv2": "http://10.29.9.48:40000",
		// 	"/test": "http://10.29.9.48:8002",
		// 	"/fab_monitoring_rev2": "http://10.29.9.48:40000",
		// 	"/customer": "http://10.29.9.48:40000",
		// 	"/band": "http://10.29.9.48:40000",
		// 	"/api": "http://10.20.10.128",
		// 	"/excel": "http://10.29.9.48:39999",
		// 	"/csp":"http://10.29.9.48:40000",
		// "/module": "http://10.29.9.48:40000"
		// }
	},
});





