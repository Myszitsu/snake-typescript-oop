const path = require('path')

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const mode =
	process.env.NODE_ENV === 'production' ? 'production' : 'development'
// const target = process.env.NODE_ENV === 'production' ? 'browserslist' : 'target'

module.exports = {
	mode: mode,
	entry: {
		main: path.resolve(__dirname, 'src/app.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		assetModuleFilename: '[ext]/[hash][ext][query]',
		clean: true,
	},
	devtool: 'inline-source-map',
	devServer: {
		static: path.join(__dirname, 'dist'),
		open: true,
	},
	module: {
		rules: [
			{
				test: /\.s?css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.ts$/i,
				exclude: /node_modules/,
				use: ['ts-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
					  loader: ImageMinimizerPlugin.loader,
					  options: {
						severityError: "warning",
						minimizerOptions: {
						  plugins: [
							["gifsicle", { interlaced: true }],
							["mozjpeg", { progressive: true }],
							["pngquant", { optimizationLevel: 5 }]
						  ],
						},
					  },
					},
				  ],
			},
			{
				test: /\.html$/i,
				use: 'html-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			// title: 'First Webpack Project',
			filename: 'index.html',
			template: path.resolve(__dirname, 'src/temp.html'),
		}),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
	],
	resolve: {
		extensions: ['.ts', '.js'],
	},
}
