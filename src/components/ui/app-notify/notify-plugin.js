export default {
  install(Vue) {
    const self = this;
    this.group = {};

    Vue.prototype.$notify = options =>
      self.group[options.group] && self.group[options.group](options);
  },
};
