<template>
  <el-input
    :value="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
    clearable
    :readonly="config.readonly"
    :minlength="config.minLength || config.minlength"
    :maxlength="config.maxLength || config.maxlength"
    :size="size"
  />
</template>

<script>
export default {
  name: 'ItemText',
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
