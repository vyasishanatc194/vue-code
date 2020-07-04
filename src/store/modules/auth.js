import Vue from 'vue';
import Service from '@/services/api-service';
import { initToken } from '../plugins/localStorage';
import getErrorMessage from '@/utils/getErrorMessage';
import router from '@/router';

const getPayload = token => {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

const state = {
  token: initToken,
  allowedPages: [],
  refreshTokenCheckInterval: false,
  attemptsAfterFailure: 0,
  maxAttemptsAfterFailure: 2, // 3
  status: {
    scope: 'local',
    loading: false,
    error: false,
    message: '',
  },
};

const mutations = {
  setToken(state, token) {
    state.token = token;
  },
  resetToken(state) {
    state.token = '';
  },
  setStatus(state, status) {
    Vue.set(state, 'status', status);
  },

  setAllowedPages(state, allowedPages) {
    Vue.set(state, 'allowedPages', allowedPages);
  },

  setInterval(state, interval) {
    Vue.set(state, 'refreshTokenCheckInterval', interval);
  },

  clearInterval(state) {
    clearTimeout(state.refreshTokenCheckInterval);
    state.refreshTokenCheckInterval = false;
  },

  setAttempts(state, attempts) {
    Vue.set(state, 'attemptsAfterFailure', attempts);
  },
};

const actions = {
  setInterval({ dispatch, commit, rootGetters }) {
    // Watch localstorage, if token is not there, person logged out or deleted it
    // Log the person out.
    window.addEventListener('storage', async event => {
      if (event.key === 'app-token' && !event.newValue && event.oldValue) {
        dispatch('auth/logout', null, { root: true });
      }
    });
    commit('clearInterval');
    let tokenExpiry = getPayload(rootGetters['auth/getToken']).exp;
    // Attempt to refresh token when about 80% of the expiry time has passed.
    let remainingTime = Math.floor((tokenExpiry * 1000 - Date.now()) * 0.8);
    let interval = setTimeout(() => {
      dispatch('auth/refreshToken', true, { root: true });
    }, remainingTime);
    commit('setInterval', interval);
    return { success: true };
  },

  attemptAfterFailure({ dispatch, commit }) {
    commit('clearInterval');
    // If the refresh token query fails, try up to 3 times every 10 seconds + query time
    let interval = setTimeout(async () => {
      let response = await dispatch('auth/refreshToken', true, { root: true });
      if (response.success) {
        commit('setAttempts', 0);
      } else {
        if (state.attemptsAfterFailure < state.maxAttemptsAfterFailure) {
          commit('setAttempts', state.attemptsAfterFailure + 1);
          dispatch('auth/attemptAfterFailure', true, { root: true });
        } else {
          dispatch('auth/logout', null, { root: true });
        }
      }
    }, 10000);
    commit('setInterval', interval);
    return { success: true };
  },

  setStatus({ commit }, status) {
    commit('setStatus', {
      scope: status.scope,
      loading: status.loading,
      error: status.error,
      message: status.message,
    });
    return { success: true };
  },

  async login({ commit, dispatch, rootGetters }, user) {
    const endpoint = 'auth/login';
    commit('setStatus', { loading: true, error: false, message: '' });
    try {
      const response = await Service.post(endpoint, user);
      commit('setToken', response.data.access_token);
      commit('setAllowedPages', ((response || {}).data || {}).allowed_pages || []);
      commit('setStatus', { loading: false, error: false, message: '' });

      await dispatch('auth/setInterval', null, { root: true });
      router.push('/home');
    } catch (error) {
      commit('setStatus', {
        scope: 'local',
        loading: false,
        error: true,
        message: getErrorMessage(error),
      });
    }
  },

  async refreshToken(
    { commit, dispatch, rootGetters },
    silent = false,
    fromRouter = false
  ) {
    // Call refresh token only if there's a token in the localstorage
    if (rootGetters['auth/getToken']) {
      console.log('Refreshing token', new Date(Date.now()));
      const endpoint = 'auth/refresh_token';
      commit('setStatus', { loading: true, error: false, message: '' });
      try {
        const response = await Service.post(endpoint);
        commit('setToken', response.data.access_token);
        commit('setAllowedPages', ((response || {}).data || {}).allowed_pages || []);
        commit('setStatus', { loading: false, error: false, message: '' });

        await dispatch('auth/setInterval', null, { root: true });
        
        return { success: true };
      } catch (error) {
        commit('setStatus', {
          scope: 'global',
          loading: false,
          error: !silent,
          message: silent ? '' : getErrorMessage(error),
        });
        if (!fromRouter) await dispatch('auth/attemptAfterFailure', null, { root: true });
        return { success: false };
      }
    } else {
      if (!fromRouter) commit('clearInterval');
      return { success: false };
    }
  },

  async logout({ commit }) {
    const endpoint = 'auth/logout';
    commit('setStatus', { loading: true, error: false, message: '' });
    try {
      await Service.post(endpoint);
      commit('setStatus', {
        loading: false,
        error: false,
        message: 'You logged out',
      });
    } catch (error) {
      commit('setStatus', {
        scope: 'local',
        loading: false,
        error: true,
        message: getErrorMessage(error),
      });
    }
    commit('resetToken');
    commit('clearInterval');
    router.push('/log-in');
  },
};

const getters = {
  getToken(state) {
    return state.token ? state.token : false;
  },

  currentUser(state) {
    return state.token ? getPayload(state.token) : {};
  },

  getAllowedPages(state) {
    return state.allowedPages.length > 0 ? state.allowedPages : false;
  },

  getStatus(state) {
    return state.status;
  },

  isLoggedIn(state) {
    return state.token ? getPayload(state.token).exp > Date.now() / 1000 : false;
  },

  isPageAllowed: state => path => {
    let allowed = false;
    let idx;
    if ((idx = path.indexOf('?')) >= 0) path = path.substring(0, idx);
    if ((idx = path.indexOf('#')) >= 0) path = path.substring(0, idx);
    let pieces = path.split('/');
    while (pieces.length > 0 && pieces[0] == '') pieces.shift(); // ignore leading slashes in path
    for (; pieces.length > 0; pieces.pop()) {
      if (state.allowedPages.indexOf(pieces.join('/')) >= 0) {
        allowed = true;
        break;
      }
    }
    return allowed;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
