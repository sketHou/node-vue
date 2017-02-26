(function() {
    // var Vue = require('Vue');
    var createApp = function() {
        return new Vue({
            template: '<div id="app">你有已经花了<span v-text="counter"></span></div>',
            data: {
                counter: 0
            },
            created: function() {
                var vm = this;
                setInterval(function(){
                    vm.counter += 1;
                }, 1000)
            }
        });
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = createApp;
    }else{
        this.app = createApp();
    }
})(this)