import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/index.js',
  //format: 'amd',
  format: 'iife',
  dest: 'web/js/index.js',
  moduleId: 'interview-test-rhengles',
  //sourceMap: true,
  plugins: [babel()]
};
