<template>
	<div>
		<notify :group="getNotifier.group"></notify>
		<router-view />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Notify from '@/components/ui/app-notify';
export default {
  name: 'login',
  components: { Notify },
  computed: {
    ...mapGetters('notify', ['getNotifier']),
  },
  watch: {
  	'getNotifier.trigger': function(value) {
  		if (value) {
        this.$notify({
          group: this.getNotifier.group,
          text: this.getNotifier.text,
          duration: this.getNotifier.duration,
          type: this.getNotifier.type,
          icon: {
            name: this.getNotifier.icon,
          },
        });
      }
  	}
  }
};
</script>
