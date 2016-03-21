import babel from 'rollup-plugin-babel';

export default {
	entry: 'lib/index.js',
	//Format: 'amd',
	format: 'iife',
	dest: 'web/js/index.js',
	moduleId: 'interview-test-rhengles',
	//SourceMap: true,
	plugins: [babel()]
};
