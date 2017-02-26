var Vue = require('Vue');
var vueServerRender = require('vue-server-renderer');
var express = require('express');
var fs = require('fs');
var path = require('path');

var server = express();
var router = express.Router();
var renderer = vueServerRender.createRenderer();

var layout = fs.readFileSync('./index.html', 'utf8');
global.Vue = require('Vue');


server.use('/page', express.static(
  path.resolve(__dirname, 'page')
));

server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
));

router.get('/', function(req, res, next) {
    console.log(req.originalUrl);
    var jsPath = './page/index/main.js';
    renderer.renderToString(require(jsPath)(), function(error, html) {
        if(error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }
        res.send(
            layout.replace('<div id="app"></div>', html).
            replace('<script id="entryJs"></script>', '<script src="' + jsPath + '"></script>')
        );
    });
})


server.use('/', router);


server.listen(5000, function (error) {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})

