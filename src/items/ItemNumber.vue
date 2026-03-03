<template>
  <el-input-number :value="value" @input="$emit('input', $event)" @change="$emit('change', $event)"
    @blur="$emit('blur', $event)" @focus="$emit('focus', $event)" :placeholder="config.placeholder"
    :disabled="config.disabled" :min="config.min !== '' ? Number(config.min) : -Infinity"
    :max="config.max !== '' ? Number(config.max) : Infinity" :precision="config.precision" :controls="false"
    :size="size" style="width: 100%" />
</template>
<script>
  export default {
    name: 'ItemNumber',
    props: {
      value: {},
      config: {
        type: Object,
        default: () => ({})
      },
      size: {
        type: String,
        default: 'mini'
      }
    }
  };
</script>
<style lang="scss" scoped>
  ::v-deep .el-input__inner {
    text-align: left;
  }
</style>
