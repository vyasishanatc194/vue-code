import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import notify from './modules/notify';
import localStoragePlugin from './plugins/localStorage.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { auth, notify },
  plugins: [localStoragePlugin],
});
