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
	optimizeDeps: {
		include: ['schart.js']
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
		}
	  },
});





