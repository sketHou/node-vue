import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import IndexPage from '../pages/index/index.vue';
import InfoPage from '../pages/info/index.vue';

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/index', component: IndexPage },
    { path: '/info', component: InfoPage },
  ]
})