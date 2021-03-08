import nodePath from 'path';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('./', import.meta.url).href);

var reLastSlash = /\/*$/;
export default function appPath(path) {
	var lastSlash = String(path).match(reLastSlash);
	return nodePath.resolve(__dirname, '../public/', path) +
		(lastSlash ? lastSlash[0] : '');
};


