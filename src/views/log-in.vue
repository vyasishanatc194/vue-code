<template>
  <section class="login">
    <div class="container">
      <div class="login-details-wrap mx-auto">
        <div class="login-details">
          <div class="top-header-main">
            <div class="logo-wrap-center">
              <router-link class="logo-link" to="">
                <img class="img-fluid" src="@/assets/svg/logo.svg" alt="logo" />
              </router-link>
            </div>
          </div>
          <div class="mb-4 mb-lg-5">
            <h1 class="page-title mb-0">
              <span class="page-title__text">Login</span>
            </h1>
          </div>
          <validation-observer
            tag="form"
            class="forms"
            ref="loginForm"
            v-slot="{ invalid }"
            @submit.prevent="login"
          >
            <div class="form-group">
              <label class="control__label">Work Email</label>
              <text-input
                v-model="email_address"
                name="email_address"
                vid="email_address"
                type="email"
                validationRules="required|email|max:200"
                placeholder="E.g. Marketing@company.com"
              ></text-input>
            </div>
            <div class="form-group position-relative mb-2 mb-lg-3">
              <label class="control__label">Password</label>
              <text-input
                v-model="password"
                class="password-input"
                name="password"
                vid="password"
                :type="hidePassword ? 'password' : 'text'"
                validationRules="required|max:20"
                placeholder="Enter password"
                :postIcon="{ name: hidePassword ? 'icon-eye-o' : 'icon-eye-off-o', btn: true }"
                @post-icon:click="hidePassword = !hidePassword"
              ></text-input>
            </div>
            <div class="mb-2">
              <b-form-checkbox
                id="keepMeLoggedIn"
                v-model="rememberMe"
                name="keepMeLoggedIn"
              >
                Keep me logged in
              </b-form-checkbox>
            </div>
            <b-alert
              v-model="showAlert"
              :variant="getStatus.error ? 'danger' : 'info'"
              dismissible
            >
              <span class="font-weight-bold" v-html="getStatus.message.message"></span>
            </b-alert>
            <div class="m-fixed-footer">
              <button
                type="submit"
                :disabled="invalid"
                class="btn btn-primary btn-block mb-2"
                >Log in</button
              >
            </div>
            <router-link to="/reset-password" class="font-weight-bold"
              >Forgot Password?</router-link
            >
          </validation-observer>
        </div>
      </div>
    </div>
    <app-loader v-if="getStatus.loading"></app-loader>
  </section>
</template>

<script>
import { BFormCheckbox, BAlert } from 'bootstrap-vue';
import { ValidationObserver } from 'vee-validate';
import AppLoader from '@/components/ui/app-loader';
import TextInput from '@/components/ui/text-input';
import { mapGetters } from 'vuex';
export default {
  name: 'login',
  components: {
    ValidationObserver,
    AppLoader,
    TextInput,
    BFormCheckbox,
    BAlert,
  },
  data() {
    return {
      email_address: '',
      password: '',
      rememberMe: false,
      hidePassword: true,
      showAlert: false
    };
  },
  computed: {
    ...mapGetters('auth', ['getStatus']),
  },

  watch: {
    'getStatus.message': function(val) {
      if (val.hasOwnProperty('errors')) {
        this.$refs.loginForm.setErrors(val.errors);
      }
    },

    'getStatus.error': function(val) {
      if (val && this.getStatus.scope === 'local') {
        this.showAlert = true
      }
    }
  },

  methods: {
    login() {
      this.$store.dispatch('auth/login', {
        email_address: this.email_address,
        password: this.password,
        remember_me: this.rememberMe ? 1 : 0,
      });
    },
  },
};
</script>

<style lang="scss">
@import '~@style/views/login';
</style>
