<template>
  <div
    v-if="errors && errors.length"
    class="validation-msg"
    :class="errors ? 'text-danger' : ''"
  >
    <div v-for="(error, idx) in errors" :key="idx">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'VeeFieldErrorMsgs',
  props: {
    errors: { type: Array, default: () => [] },
  },

  data() {
    return {};
  },
};
</script>
