import Vue from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';
import App from './App.vue';
import router from './router';

Vue.use(Vue2TouchEvents);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
