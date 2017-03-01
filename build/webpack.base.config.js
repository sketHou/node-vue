const path = require('path');
const vueConfig = require('./vue-loader.config');

module.exports = {
    devtool: '#source-map', //https://webpack.js.org/configuration/devtool/#components/sidebar/sidebar.jsx
    entry: {
        app: './src/client-entry.js',
        vendor: [
            'es6-promise',
            'firebase/app',
            'firebase/database',
            'vue',
            'vuex',
            'vue-router',
            'vuex-router-sync'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].[chunkhash].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                option: vueConfig
            },
            {
                test: /\.js$/,
                loader: 'buble-loader',
                exclude: /node_modules/,
                options: {
                    objectAssign: 'Object.assign'
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[name].[ext]?[hash]'
                }
            }

        ]
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    }
}