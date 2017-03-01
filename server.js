const fs = require('fs');
const path = require('path');
const express = require('express');
const serialize = require('serialize-javascript') //Object 转 Array
const resolve = fileName => path.resolve(__dirname, fileName);
const vueServerRender = require('vue-server-renderer');
const compression = require('compression');
const app = express();
const router = express.Router();
const isProd = process.env.NODE_ENV === 'production';

// var Vue = require('Vue'),
//     renderer = vueServerRender.createRenderer();

// global.Vue = require('Vue');
// var layout = fs.readFileSync('./index.html', 'utf8');

if (isProd) {
  // in production: create server renderer and index HTML from real fs
  renderer = createRenderer(fs.readFileSync(resolve('./dist/server-bundle.js'), 'utf-8'))
  indexHTML = parseIndex(fs.readFileSync(resolve('./dist/index.html'), 'utf-8'))
} else {
  // in development: setup the dev server with watch and hot-reload,
  // and update renderer / index HTML on file change.
  console.log('c1');
  require('./build/setup-dev-server')(app, {
    bundleUpdated: bundle => {
      
      renderer = createRenderer(bundle);
      
    },
    indexUpdated: index => {
      console.log('c3');
      indexHTML = parseIndex(index);
      console.log('c4');
    }
  })
  console.log('c2');
}

function createRenderer (bundle) {
    return require('vue-server-renderer').createBundleRenderer(bundle, {
        cache: require('lru-cache')({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}



function parseIndex (template) {
  const contentMarker = '<!-- APP -->'
  const i = template.indexOf(contentMarker)
  return {
    head: template.slice(0, i),
    tail: template.slice(i + contentMarker.length)
  }
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
})

app.use(compression({ threshold: 0 }))
// app.use(favicon('./public/logo-48.png'))
app.use('/service-worker.js', serve('./dist/service-worker.js'))
// app.use('/manifest.json', serve('./manifest.json'))
app.use('/dist', serve('./dist'))
// app.use('/public', serve('./public'))

app.get('*', (req, res) => {
  if (!renderer) {
    return res.end('waiting for compilation... refresh in a moment.')
  }
  res.setHeader("Content-Type", "text/html")
  // res.setHeader("Server", serverInfo)

  var s = Date.now()
  const context = { url: req.url }
  const renderStream = renderer.renderToStream(context)

  renderStream.once('data', () => {
    res.write(indexHTML.head)
  })

  renderStream.on('data', chunk => {
    res.write(chunk)
  })

  renderStream.on('end', () => {
    // embed initial store state
    if (context.initialState) {
      res.write(
        `<script>window.__INITIAL_STATE__=${
          serialize(context.initialState, { isJSON: true })
        }</script>`
      )
    }
    res.end(indexHTML.tail)
    console.log(`whole request: ${Date.now() - s}ms`)
  })

  renderStream.on('error', err => {
    if (err && err.code === '404') {
      res.status(404).end('404 | Page Not Found')
      return
    }
    // Render Error Page or Redirect
    res.status(500).end('Internal Error 500')
    console.error(`error during render : ${req.url}`)
    console.error(err)
  })
})

/**
 * listen
 */
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})





