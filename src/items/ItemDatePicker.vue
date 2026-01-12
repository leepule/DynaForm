<template>
  <el-date-picker
    :value="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    :type="dateType"
    :placeholder="config.placeholder"
    :start-placeholder="config.placeholder ? 'Start' : 'StartDate'"
    :end-placeholder="config.placeholder ? 'End' : 'EndDate'"
    :disabled="config.disabled"
    clearable
    :format="config.format"
    :value-format="config.valueFormat || 'yyyy-MM-dd'"
    :readonly="config.readonly"
    :size="size"
    style="width: 100%"
  />
</template>

<script>
export default {
  name: 'ItemDatePicker',
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
  },
  computed: {
    dateType() {
      if (this.config.type === 'daterange' || this.config.type === 'dateRangePicker') {
        return 'daterange';
      }
      return this.config.timeType || 'date';
    }
  }
};
</script>
