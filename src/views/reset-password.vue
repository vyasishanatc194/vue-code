<template>
  <section class="login">
    <div class="container">
      <div class="login-details-wrap mx-auto">
        <div class="login-details">
          <!-- First screen, enter email initiate process -->
          <div v-if="!token && status.state !== 'request-sent'">
            <div class="mb-4 mb-lg-5">
              <h2 class="page-title">
                <span class="page-title__text">Forgot Password?</span>
              </h2>
              <div class="form-title-secondary">
                We can help you recover your account, first write your work email,
                where we will send you further instructions.
              </div>
            </div>
            <validation-observer
              tag="form"
              class="forms"
              ref="requestForm"
              v-slot="{ invalid }"
              @submit.prevent="requestPasswordReset"
            >
              <div class="form-group mb_40">
                <label class="control__label">Enter your Work Email</label>
                <text-input
                  v-model="email"
                  name="email_address"
                  vid="email_address"
                  type="email"
                  validationRules="required|email|max:200"
                  placeholder="E.g. Marketing@company.com"
                ></text-input>
                <div class="login-access mt-1">
                  If you no longer have access to your email
                  <a
                    class="font-weight-bold"
                    href="https://www.example.com/#contact"
                    target="_blank"
                    >Contact us</a
                  >
                </div>
              </div>
              <b-alert
                v-model="status.alert"
                :variant="status.error ? 'danger' : 'info'"
                dismissible
              >
                <span class="font-weight-bold" v-html="status.message"></span>
              </b-alert>
              <div class="m-fixed-footer">
                <div class="row g_16">
                  <div class="col-lg-4 col-6 pr-0 pr-lg-1">
                    <router-link
                      class="btn position-relative btn-outline-primary has-preicon btn-block btn-back"
                      type="button"
                      to="/log-in"
                    >
                      <div class="icon_prepend"><app-icon name="icon-arrow-left"/></div
                      >Back
                    </router-link>
                  </div>
                  <div class="col-lg-8 col-6 pl-0 pl-lg-1">
                    <button
                      class="btn position-relative btn-primary btn-block has-posticon btn-next"
                      type="submit"
                      :disabled="invalid || status.state === 'request-sent'"
                    >
                      <div class="icon_append"><app-icon name="icon-arrow-right"/></div
                      >Continue
                    </button>
                  </div>
                </div>
              </div>
            </validation-observer>
          </div>

          <div v-if="!token && status.state === 'request-sent'">
            <div class="mb-4 mb-lg-5">
              <div class="d-flex justify-content-center">
                <h2 class="page-title mb-0">
                  <span class="page-title__text">Email Sent</span>
                </h2>
              </div>
            </div>
            <div class="text-center mb-3">
              <img class="form-img" src="email-sent.png" />
            </div>
            <div
              class="form-title-secondary font-weight-bold text-center mb-5"
              style="font-size: 1em"
            >
              <div>We have sent you an email with a password reset link.</div>
              <div>Please check it and follow the instructions outlined there.</div>
            </div>
          </div>

          <!-- reset password -->
          <div v-if="token && status.state !== 'completed'" class="mb-4 mb-lg-5">
            <h2 class="page-title">
              <span class="page-title__text">Reset Password</span>
            </h2>
            <div class="form-title-secondary mb-4"
              >Create a new password for your account</div
            >
            <validation-observer
              tag="form"
              class="forms"
              ref="resetForm"
              v-slot="{ invalid }"
              @submit.prevent="completePasswordReset"
            >
              <div class="position-relative form-group mb-5">
                <label class="control__label">New Password</label>
                <text-input
                  v-model="password"
                  name="password"
                  vid="password"
                  :type="hidePassword ? 'password' : 'text'"
                  placeholder="Enter new password"
                  validationRules="required|max:20|min:8"
                  :postIcon="{ name: hidePassword ? 'icon-eye-o' : 'icon-eye-off-o', btn: true }"
                  @post-icon:click="hidePassword = !hidePassword"
                ></text-input>

                <label class="control__label mt-3">Re-enter New Password</label>
                <text-input
                  v-model="confirmPassword"
                  name="confirmPassword"
                  vid="confirmPassword"
                  :type="hideConfirmPassword ? 'password' : 'text'"
                  placeholder="Re-enter new password"
                  validationRules="required|max:20|min:8|confirmed:password"
                  :postIcon="{ name: hideConfirmPassword ? 'icon-eye-o' : 'icon-eye-off-o', btn: true }"
                  @post-icon:click="hideConfirmPassword = !hideConfirmPassword"
                ></text-input>
              </div>
              <b-alert
                v-model="status.alert"
                :variant="status.error ? 'danger' : 'info'"
                dismissible
              >
                <span class="font-weight-bold" v-html="status.message"></span>
              </b-alert>
              <div class="m-fixed-footer">
                <button
                  type="submit"
                  :disabled="invalid || !isTokenValid"
                  class="btn btn-primary btn-block"
                  >Create Password</button
                >
              </div>
            </validation-observer>
          </div>

          <!-- thank you message -->
          <div v-if="token && status.state === 'completed'">
            <div class="mb-4 mb-lg-5">
              <div class="d-flex justify-content-center">
                <h2 class="page-title-full mb-0">
                  <span class="page-title-full__text">Password Updated</span>
                </h2>
              </div>
            </div>
            <div class="text-center mb-3">
              <img class="form-img" src="@/assets/images/forgot.png" />
            </div>
            <div class="form-title-secondary text-center mb-5">
              <div> Your password has been succesfully changed.</div>
              <div>You’ll be taken to the Log in page.</div>
              <div>if you are not, do it manually.</div>
            </div>
            <div class="m-fixed-footer">
              <router-link to="/log-in" class="btn btn-primary btn-block"
                >Go to Log in Page</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-loader v-if="status.loading"></app-loader>
  </section>
</template>

<script>
import { BAlert } from 'bootstrap-vue';
// Importing only the required functions.
import {
  requestPasswordReset,
  checkToken,
  completePasswordReset,
} from '@/services/auth-service';
import { ValidationObserver } from 'vee-validate';
import TextInput from '@/components/ui/text-input';
import AppLoader from '@/components/ui/app-loader';
export default {
  name: 'reset-password',
  components: {
    ValidationObserver,
    AppLoader,
    TextInput,
    BAlert,
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      hidePassword: true,
      hideConfirmPassword: true,
      token: '',
      isTokenValid: false,
      done: false,
      status: {
        state: 'init',
        alert: false,
        loading: false,
        error: false,
        message: '',
      },
    };
  },
  methods: {
    async requestPasswordReset() {
      this.status.alert = false;
      this.status.loading = true;
      this.status.error = false;
      this.status.message = '';
      let response = await requestPasswordReset(this.email);
      this.status.state = response.success ? 'request-sent' : 'error';
      this.status.error = !response.success;
      this.status.message = response.message;
      this.status.loading = false;
      if (
        !response.success &&
        Object.keys(response.errors).length > 0 &&
        response.errors.constructor === Object
      ) {
        this.$refs.requestForm.setErrors(response.errors);
      }
      this.status.alert = true;
    },

    async checkToken() {
      this.isTokenValid = false;
      this.status.alert = false;
      this.status.loading = true;
      this.status.error = false;
      this.status.message = '';
      let response = await checkToken(this.token);
      this.isTokenValid = response.success;
      this.status.error = !response.success;
      this.status.message = response.message;
      this.status.loading = false;
      if (
        !response.success &&
        Object.keys(response.errors).length > 0 &&
        response.errors.constructor === Object
      ) {
        this.$refs.resetForm.setErrors(response.errors);
        this.status.alert = true;
        // If the token has already been used, show the completed screen.
        if (response.errors.hasOwnProperty('used_at')) {
          this.status.state = 'completed';
          this.triggerRedirect();
        }
      }
    },

    async completePasswordReset() {
      this.status.alert = false;
      this.status.loading = true;
      this.status.error = false;
      this.status.message = '';
      let response = await completePasswordReset(this.password, this.token);
      this.status.state = !response.success ? 'error' : 'completed';
      this.status.error = !response.success;
      this.status.message = response.message;
      this.status.loading = false;
      if (
        !response.success &&
        Object.keys(response.errors).length > 0 &&
        response.errors.constructor === Object
      ) {
        this.$refs.resetForm.setErrors(response.errors);
      }
      this.status.alert = true;
      if (this.status.state === 'completed') {
        this.triggerRedirect();
      }
    },

    triggerRedirect() {
      setTimeout(() => {
        this.$router.push('/log-in');
      }, 10000);
    }
  },

  created: function() {
    this.token = this.$route.query.token || '';
    if (this.token) {
      this.checkToken();
    }
  },
};
</script>
