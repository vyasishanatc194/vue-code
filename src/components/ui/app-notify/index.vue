<template>
  <div :class="['app-notifier', group]" :style="styles">
    <transition-group :name="trans" mode="out-in" tag="div">
      <div :class="item.type" v-for="(item, idx) in notifiers" :key="item.id">
        <slot
          name="body"
          :class="item.type"
          :item="item"
          :close="() => removeItemAt(idx)"
        >
          <div class="notify-content">
            <app-icon
              v-if="statusIcon && statusIcon.name"
              :name="statusIcon.name"
              class="notify-icon"
            />
            <div v-html="item.text"></div>
          </div>
          <button
            type="button"
            @click.stop="removeItemAt(idx)"
            class="btn btn-sm btn-close p-1"
          >
            <app-icon name="icon-close" />
          </button>
        </slot>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Vue from 'vue';
import NotifyPlugin from './notify-plugin';
import _ from 'lodash';

Vue.use(NotifyPlugin);

/**
 * Notify plugin which notifies success and failure messages
 */
export default {
  props: {
    /**
     * Group names so we can refer while initiate the notifier
     */
    group: String,
    /**
     * Transition name
     */
    transition: String,
    /**
     * Notify position
     */
    position: {
      type: String,
      default: 'top right',
    },
    /**
     * Transition duration in milli seconds
     */
    duration: {
      type: Number,
      default: 3000,
    },
    /**
     * Icon component name
     */
    icon: Object,
    default: () => {
      return {
        name: 'icon-tick-round-o',
      };
    },
  },
  data() {
    const pos = this.position;
    let trans = this.transition;

    if (!trans && pos.indexOf('left') + 1) trans = 'notify-left';
    if (!trans && pos.indexOf('right') + 1) trans = 'notify-right';

    return {
      trans: trans,
      notifiers: [],
      statusIcon: this.icon,
      pos: this.position,
    };
  },
  created: function() {
    let ids = 1;
    const self = this;
    NotifyPlugin.group[this.group] = function(options) {
      let { text, type, duration, icon, position } = options;
      if (text === undefined) {
        self.removeItem();
        return;
      }
      self.statusIcon = icon;

      const item = {
        id: ids++,
        text: text,
        type: 'notify' + (type ? ' ' + type : ''),
      };
      duration = duration !== undefined ? duration : self.duration;

      if (duration > 0) {
        item.timer = setTimeout(function() {
          self.removeItem(item);
        }, duration);
      }

      if (position) {
        self.pos = position;
      }

      self.notifiers.push(item);
    };
  },

  computed: {
    styles: function() {
      let style = {};
      const posArray = this.pos.split(' ');

      posArray.map(pos => {
        if (pos == 'center') {
          style.left = style.right = 0;
          style.margin = 'auto';
        } else if (pos != '') style[pos] = '30px';

        if (pos === 'top') {
          style.top = '60px';
        } else if (pos === 'bottom') {
          style.bottom = '60px';
        }
      });
      return style;
    },
  },

  methods: {
    removeItemAt: function(n) {
      if (n + 1) {
        clearTimeout(this.notifiers[n].timer);
        this.notifiers.splice(n, 1);
      }
    },

    removeItem: function(item) {
      if (item === undefined) {
        while (this.notifiers.length) this.removeItemAt(0);
        return;
      }
      const idx = _.findIndex(this.notifiers, obj => obj.id === item.id);
      this.removeItemAt(idx);
    },
  },
};
</script>

<style lang="scss">
@import '~@/style/components/notify';
</style>
