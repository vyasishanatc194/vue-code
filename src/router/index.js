import Vue from 'vue';
import VueRouter from 'vue-router';
import Store from '@/store';
import config from '@/config';
import VueAnalytics from 'vue-analytics';

const trackAnalytics =
  process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';


Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/log-in',
  },
  {
    path: '/log-in',
    name: 'Login',
    meta: {
      analytics: 'Login',
      requiresAuth: false,
      exclusivePublic: true,
    },
    component: () => import('@/views/log-in.vue'),
  },
  {
    path: '/reset-password',
    name: 'Reset password',
    meta: {
      analytics: 'Reset Password',
      requiresAuth: false,
      exclusivePublic: true,
    },
    component: () => import('@/views/reset-password.vue'),
  },
  {
    path: '*',
    name: 'not-found-404',
    meta: {
      analytics: 'Not Found Page',
      requiresAuth: false,
    },
    component: () => import('@/views/not-found.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      analytics: 'Home Page',
      requiresAuth: false,
      exclusivePublic: true,
    },
    component: () => import('@/views/home.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// for google analytics tracking
Vue.use(VueAnalytics, {
  id: config.GA_CODE,
  router,
  autoTracking: {
    pageviewTemplate(route) {
      return {
        page: route.path,
        title: route.meta.analytics,
        location: window.location.href,
      };
    },
  },
  debug: {
    enabled: config.GOOGLE_ANALYTICS_DEBUG,
    sendHitTask: trackAnalytics,
  },
});

const validateAllowedPages = function(path, next) {
  if (Store.getters['auth/isPageAllowed'](path)) {
    next(true);
  } else {
    next({ name: 'not-found-404' });
  }
};

router.beforeEach(async (to, from, next) => {
  const currentUser = Store.getters['auth/currentUser'];
  const isLoggedIn = Store.getters['auth/isLoggedIn'];
  const allowedPages = Store.getters['auth/getAllowedPages'];
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const exclusivePublic = to.matched.some(x => x.meta.exclusivePublic);
  
  let APP_NAME = currentUser.aud === null ? 'Company name' : 'SiteName'

  document.title = `${ APP_NAME } ${
    to.meta.analytics ? ' - ' + to.meta.analytics : ''
  }`;

  // This should be something like currentUser
  // User information that is gotten at login but not saved to localstorage because it's sensitive and could be manually changed
  // The allowed pages are kept in memory since the check to page permissions is done against them
  // You do this here, you avoid racing conditions with the data to check page permissions not available when you need it
  // If that data is not present, you wait until it is, if that fails, log out
  if (!allowedPages && isLoggedIn) {
    let response = await Store.dispatch('auth/refreshToken', false, true);
    if (!response.success) {
      Store.dispatch('auth/logout');
    }
  }

  if (requiresAuth) {
    // If access token hasn't expired, go
    if (isLoggedIn) {
      // Here you can do the allowedpages check
      validateAllowedPages(to.path, next);
    } else {
      // If access token has expired attempt to refresh it
      let response = await Store.dispatch('auth/refreshToken');
      if (response.success) {
        // If it succeeds try to go to the intended page
        validateAllowedPages(to.path, next);
      } else {
        // If it fails, call logout and redirect to log-in
        Store.dispatch('auth/logout');
      }
    }
  } else {
    if (exclusivePublic && isLoggedIn) {
      // next(false);
      next({ path: '/home' });
    } else {
      next(true);
    }
  }
});

export default router;
