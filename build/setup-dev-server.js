const path = require('path');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpack = require('webpack');
const clientConfig = require('./webpack.client.config');
const serverConfig = require('./webpack.server.config');
const MFS = require('memory-fs');


module.exports = function setupDevServer (app, opts) {

    clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app];
    clientConfig.output.filename = '[name].js';
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );

    var clientCompiler = webpack(clientConfig);
    var devMiddleWare = webpackMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: false
        }
    });

    app.use(devMiddleWare);
    clientCompiler.plugin('done', () => {
        const fs = devMiddleWare.fileSystem
        const filePath = path.join(clientConfig.output.path, 'index.html')
        if (fs.existsSync(filePath)) {
        const index = fs.readFileSync(filePath, 'utf-8');
        opts.indexUpdated(index)
        }
    });
    app.use(require('webpack-hot-middleware')(clientCompiler));

    // watch and update server renderer
    const serverCompiler = webpack(serverConfig);
    const mfs = new MFS();
    const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename);
    serverCompiler.outputFileSystem = mfs;
    serverCompiler.watch({}, (err, stats) => {
        if (err) throw err;
        stats = stats.toJson();
        stats.errors.forEach(err => console.error(err));
        stats.warnings.forEach(err => console.warn(err));
        opts.bundleUpdated(mfs.readFileSync(outputPath, 'utf-8'));
    });
}