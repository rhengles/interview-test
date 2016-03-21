/*eslint no-console:0*/

var node_path = require('path');
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var multiEntry = require('rollup-plugin-multi-entry')['default'];
var eachAsync = require('./includes/each-async');

var scripts = [
	{
		id: 'index',
		input: 'lib/index.js',
		output: 'web/js/index.js',
		plugins: [babel(), uglify()]
	},
	{
		id: 'tests',
		input: 'test/**/*-test.js',
		output: 'temp/test-bundle.js',
		format: 'cjs',
		suffix: 'test',
		plugins: [babel(), multiEntry()],
		intro: 'require("source-map-support").install();',
		sourceMap: true
	}
];

function pathRel(p) {
	return node_path.join(__dirname, p);
}

function buildScript(opt, cb) {
	var moduleId = (opt.id || '');
	if (!validateArgs(moduleId)) {
		return cb();
	}
	var entry = opt.input;
	var dest = opt.output;
	var format = opt.format || 'iife';
	var plugins = opt.plugins;
	console.log('');
	console.log('BUNDLE ' + moduleId);
	console.log('input ' + entry);
	console.log('output ' + dest);
	console.log('');
	console.log(': rollup started');
	rollup.rollup({
		entry: pathRel('../' + entry),
		plugins: plugins
	}).then(function(bundle) {
		console.log(': bundle generated');
		bundle.write({
			format: format,
			dest: pathRel('../' + dest),
			moduleId: moduleId,
			intro: opt.intro
		}).then(function() {
			console.log(': file saved');
			cb();
		}).catch(function(err) {
			console.error(err);
			process.exit(1);
		})
	}).catch(function(err) {
		console.error(err);
		process.exit(1);
	});
}

//Console.log('argv', process.argv);

function validateArgs(moduleId) {
	var argv = process.argv.slice(2);
	var total = argv.length;
	if (!total) return true;
	for (var i = 0; i < total; i++) {
		var a = argv[i];
		if ('all' == a || moduleId == a) {
			return true;
		}
	}
	return false;
}

eachAsync(scripts, buildScript);
