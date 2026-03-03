<template>
  <el-input :value="value" @input="$emit('input', $event)" @change="$emit('change', $event)"
    @blur="$emit('blur', $event)" @focus="$emit('focus', $event)" :placeholder="config.placeholder"
    :disabled="config.disabled" :clearable="config.clearable !== false" :readonly="config.readonly"
    :minlength="config.minLength || config.minlength" :maxlength="config.maxLength || config.maxlength" :size="size"
    style="width: 100%" />
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