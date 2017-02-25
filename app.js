var Vue = require('Vue');
var vueServerRender = require('vue-server-renderer');

var app = new Vue({
    render: function(h){
        return h('p', 'Hello word');
    }
});

var renderer = vueServerRender.createRenderer();

renderer.renderToString(app, function(err, html) {
    console.log(html);
})


