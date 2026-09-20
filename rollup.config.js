const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');

const packageConfiguration = require('./package.json');

module.exports = {
	input: path.join('source', 'index.js'),
	output: [
		{
			format: 'esm',
			file: path.join('compiled', 'esm', `${packageConfiguration.name}.min.js`),
			compact: true
		},
		{
			format: 'cjs',
			file: path.join('compiled', 'cjs', `${packageConfiguration.name}.min.js`),
			compact: true
		}
	],
	plugins: [
		babel({ comments: false, babelHelpers: 'bundled' }),
		terser()
	]
};
