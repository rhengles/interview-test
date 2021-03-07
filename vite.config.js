import loadVue from "./plugin/rollup-plugin-load-vue";
import path from "path";
import url from "url";

const __dirname = url.fileURLToPath(new URL('./', import.meta.url));

export default {
	plugins: [
		{
			name: 'reload',
			configureServer(server) {
				const { ws, watcher } = server
				watcher.on('change', () => {
					ws.send({ type: 'full-reload' })
				})
			}
		},
		loadVue('Comp', __dirname, 'comp', '_app$'),
	]
}
