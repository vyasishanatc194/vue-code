<template>
  <validation-provider
    :vid="vid"
    :rules="validationRules"
    v-slot="{ errors, classes }"
    tag="div"
  >
    <div class="input-wrap position-relative">
      <div
        class="position-relative"
        :class="preIcon.name ? 'has_preicon' : getPostIcon ? 'has_posticon' : ''"
      >
        <div v-if="preIcon.name" class="icon_prepend">
          <app-icon :class="preIcon.class" :name="preIcon.name" />
        </div>
        <input
          v-bind="$attrs"
          :class="['form-control', classes]"
          :value="value"
          :ref="inputRef"
          @input="onInput"
          @keyup="onKeyUp"
          @keyup.enter="onEnterKeyUp"
        />
        <div
          v-if="getPostIcon"
          class="icon_append"
          :class="postIcon.btn ? 'icon_btn' : ''"
          @click="onPostIconClick"
        >
          <app-icon :class="postIcon.class" :name="getPostIcon" />
        </div>
      </div>
      <vee-field-error-msgs :errors="errors"></vee-field-error-msgs>
    </div>
  </validation-provider>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import VeeFieldErrorMsgs from './vee-field-error-msgs';
/**
 * By default this component accepts all html input attributes
 */
export default {
  inheritAttrs: false,
  props: {
    /**
     * HTML Input value
     */
    value: String,
    /**
     * vid attribute for ValidationProvider
     */
    vid: String,
    /**
     * Vue `ref` attribute for input field
     */
    inputRef: String,
    /**
     * Max length of the input
     */
    maxlength: { type: Number, default: -1 },
    /**
     * Icon goes before text input. The object accepts 2 values: 1. icon name 2. icon class
     * for Icon name use `icons` component names
     */
    preIcon: {
      type: Object,
      default: () => {
        return {
          name: null,
          class: '',
        };
      },
    },
    /**
     * Icon goes after text input. The object accepts 3 values: 1. icon name 2. is icon button 3. icon class
     * for Icon name use `icons` component names. For input type password the default icon is eye icon
     */
    postIcon: {
      type: Object,
      default: () => {
        return {
          name: null,
          btn: false,
          class: '',
        };
      },
    },
    /**
     * We are using vee-validate for validation. This attribute accepts vee-validate rules
     * for more details doc: https://logaretm.github.io/vee-validate/guide/rules.html
     */
    validationRules: {},
  },
  components: { ValidationProvider, VeeFieldErrorMsgs },
  computed: {
    getPostIcon: function() {
      return this.postIcon && this.postIcon.name
        ? this.postIcon.name
        : this.type === 'password'
        ? 'icon-eye-o'
        : '';
    },
  },
  methods: {
    onKeyUp(event) {
      this.$emit('keyup', event);
    },
    onEnterKeyUp(event) {
      this.$emit('keyup.enter', event);
    },
    onPostIconClick(event) {
      this.$emit('post-icon:click', event);
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style lang="scss">
.password-input .icon_append {
  font-size: 1.5rem;
}
</style>
