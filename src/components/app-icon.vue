<template>
  <div class="svg-wrap">
    <svg
      :width="width"
      :height="height"
      :viewBox="viewBox"
      :class="className"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g :fill="fillColor">
        <slot>
          <component :is="icon" />
        </slot>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * SVG class names
     */
    className: String,
    /**
     * SVG width
     */
    width: {
      type: String,
      default: '1em',
    },
    /**
     * SVG height
     */
    height: {
      type: String,
      default: '1em',
    },
    /**
     * SVG Fill Color
     */
    fillColor: {
      type: String,
      default: 'currentColor',
    },
    /**
     * Icons component directory location
     */
    dir: {
      type: String,
      // by default it loads the components/icons files
      default: './icons',
    },
    /**
     * Icon component name
     */
    name: String,
  },
  data() {
    return {
      viewBox: '0 0 16 16',
    };
  },
  computed: {
    icon() {
      if (!this.name) {
        return;
      }
      return () => import(`${this.dir}/${this.name}`);
    },
  },
};
</script>

<style scoped>
svg {
  display: block;
}

.svg-wrap {
  display: inline-block;
  vertical-align: middle;
}
</style>
