import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';

export default {
	entry: 'test/**/*-test.js',
	plugins: [babel(), multiEntry()],
	format: 'cjs',
	intro: 'require("source-map-support").install();',
	dest: 'temp/test-bundle.js',
	sourceMap: true
};
