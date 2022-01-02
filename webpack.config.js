const path = require('path');

const config = {
	entry: './public/js/index.js', // File đầu vào
	output: {
		// File đầu ra
		filename: 'bundle.js', // Tên file đầu ra
		path: path.resolve(__dirname, 'public/js'), // Nơi chưa file đầu ra
	},
	devtool: 'cheap-module-source-map',
};

module.exports = config;
