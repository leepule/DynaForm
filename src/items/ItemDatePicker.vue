<template>
  <el-date-picker
    :value="computedValue"
    @input="handleInput"
    @change="handleChange"
    :type="dateType"
    :placeholder="config.placeholder"
    :start-placeholder="config.placeholder ? 'Start' : 'StartDate'"
    :end-placeholder="config.placeholder ? 'End' : 'EndDate'"
    :disabled="config.disabled"
    :clearable="config.clearable !== false"
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
      const type = this.config.timeType || 'date';
      if (this.config.multiple) {
        if (type === 'year') return 'years';
        if (type === 'month') return 'months';
        if (type === 'date') return 'dates';
      }
      return type;
    },
    computedValue() {
      if (this.config.multiple) {
        if (typeof this.value === 'string' && this.value) {
          return this.value.split(',');
        }
        if (Array.isArray(this.value)) {
          return this.value;
        }
        return [];
      }
      return this.value;
    }
  },
  methods: {
    handleInput(val) {
      this.emitValue('input', val);
    },
    handleChange(val) {
      this.emitValue('change', val);
    },
    emitValue(eventName, val) {
      if (this.config.multiple) {
        const emitVal = Array.isArray(val) ? val.join(',') : (val || '');
        this.$emit(eventName, emitVal);
      } else {
        this.$emit(eventName, val);
      }
    }
  }
};
</script>
