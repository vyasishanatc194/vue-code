<template>
  <div class="loader" :class="className">
    <svg
      class="spinner"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        class="spinner__circle"
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke-width="8"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script>
/**
 * Use `AppLoader` to display loading interaction to the user.
 */
export default {
  name: 'app-loader',
  props: {
    /**
    * Show loader for entire page or only a part of a section. Default: entire page
    */
    fullPage: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      className: this.fullPage ? 'loader-fixed' : '',
    }
  },
  mounted() {
    this.toggleBodyClass('addClass', 'page-loading');
  },
  methods: {
    toggleBodyClass(addRemoveClass, className) {
      const el = document.body;
      if (addRemoveClass === 'addClass') {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    },
  },
  beforeDestroy() {
    this.toggleBodyClass('removeClass', 'page-loading');
  }
};
</script>

<style scoped lang="scss">
@import '~@/style/components/loader';
</style>
