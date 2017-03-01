const webpack = require('webpack');
const base = require('./webpack.base.config')
const ExtractTextPlugin = require(extract-text-webpack-plugin);//把js中的css文件单独提出整合成一个样式文件
const HTMLPlugin = require('html-webpack-plugin'); //使用 script 来包含所有你的 webpack bundles
const vueConfig = require('./vue-loader.config');
const SWPrecachePlugin = require('sw-precache-webpack-plugin'); //https://www.npmjs.com/package/sw-precache-webpack-plugin

const config = Object.assign({}, base, {
    resolve: {//https://webpack.js.org/configuration/resolve/#components/sidebar/sidebar.jsx
        alias: Object.assign({}, base.resolve.alias, {
            'create-api': './create-api-clients.js'
        })
    },
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new HTMLPlugin({
            template: 'src/index.template.html'
        })
    ])
});

if(process.env.NODE_ENV === 'production') {
    vueConfig.loaders ={
        scss: ExtractTextPlugin.extract({
            use: ['css-loader', 'sass-loader'],
            fallback: 'vue-style-loader'
        })
    }

    config.plugins.push(
        new ExtractTextPlugin('styles.[hash.css]'),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new SWPrecachePlugin({
            cacheId: 'vue-hn',
            filename: 'service-worker.js',
            dontCacheBustUrlsMatching: /./,
            staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
        })
    );

}

module.exports = config;