import Vue from 'vue';
import App from './App.vue';
import AppIcon from '@components/app-icon';
// commentted bootstrap globally for component isolation
//import BootstrapVue from 'bootstrap-vue';
import router from './router';
import store from './store';
import '@/components/ui/validation';

//Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.component('app-icon', AppIcon);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
