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
		}
	]
}
