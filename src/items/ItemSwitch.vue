<template>
  <el-switch :value="computedValue" @change="handleChange" :disabled="config.disabled"
    :active-color="config.activeColor" :inactive-color="config.inactiveColor" :active-text="config.activeText"
    :inactive-text="config.inactiveText" :active-value="getActiveValue()" :inactive-value="getInactiveValue()" />
</template>
<script>
  export default {
    name: 'ItemSwitch',
    props: {
      value: {
        type: [Boolean, String, Number],
        default: false
      },
      config: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      computedValue() {
        return this.value;
      }
    },
    methods: {
      handleChange(val) {
        this.$emit('input', val);
        this.$emit('change', val);
      },
      getActiveValue() {
        if (this.config.activeValue !== undefined) {
          if (this.config.activeValue === 'true') return true;
          if (this.config.activeValue === 'false') return false;
          return this.config.activeValue;
        }
        return true;
      },
      getInactiveValue() {
        if (this.config.inactiveValue !== undefined) {
          if (this.config.inactiveValue === 'true') return true;
          if (this.config.inactiveValue === 'false') return false;
          return this.config.inactiveValue;
        }
        return false;
      }
    }
  };
</script>