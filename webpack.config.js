const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: './src/js/main.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public/js')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						"presets": [["env", {
							"targets": {
								"browsers": ["last 2 versions", "safari >= 7"]
							}
						}
						]]
					}
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader', 'sass-loader']
				})
			}
		]
		},
		plugins: [
			new ExtractTextPlugin('../css/main.css')
		]
}