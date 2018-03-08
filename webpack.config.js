const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

// HTML Templates
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

// JS
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// CSS File Handling
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// External Assets (copy only)
const CopyWebpackPlugin = require('copy-webpack-plugin');


// Configurations
var cssDev = [
    'style-loader',
    'css-loader',
    'sass-loader'
];
var cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader','sass-loader']
});

// Production or Development
var isProd = process.env.NODE_ENV === 'production'; // true or false
var cssConfig = isProd ? cssProd : cssDev;


module.exports = {
    entry: {
        'wakkle': './src/js/app.js',
        'wakkle.min': './src/js/app.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: './js/[name].js',
        library: 'wakkle'
    },
    module: {
        rules: [
            {
                test: /\.(css|scss)$/, 
                use: cssConfig
            },
            {
                test: /\.js$/, 
                loader: 'babel-loader',
                query: {
                    babelrc: false,
                    plugins: [
                      'transform-es2015-arrow-functions',
                      'transform-es2015-block-scoping',
                      'transform-es2015-parameters'
                    ]
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|json|wakkle|wkkl)$/,
                use: 'file-loader?name=[name].[ext]&outputPath=images/'
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader?removeTags=true'
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true, // gzip compression
        stats: 'errors-only',
        hot: true,
        open: false
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './css/wakkle.css',
            disable: !isProd
        }),
        new HtmlWebpackPlugin({
            title: 'Demo',
            template: './src/index.ejs',
            chunks: ['wakkle'],
            hash: false,
            inject : false
        }),
        new HtmlWebpackHarddiskPlugin(),

        new UglifyJsPlugin({
            include: /\.min\.js$/
        }),

        new CopyWebpackPlugin([ // Those files become copied to dist
            {
                context: path.resolve(__dirname, './src/'),
                from: 'images/*/*', 
                to: path.resolve(__dirname, './dist/')
            },
            {
                context: path.resolve(__dirname, './src/'),
                from: 'js/vendor/headtrackr.min.js', 
                to: path.resolve(__dirname, './dist/js/')
            },
        ]),

        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ],
}